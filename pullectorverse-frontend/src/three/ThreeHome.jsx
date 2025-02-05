// src/components/ThreeHome.jsx
import React, { Suspense, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three"; // needed for Vector3, Quaternion, etc.
import { useGLTF } from "@react-three/drei";
import { Link } from "react-router-dom";

/**
 * Project 2D mouse coords onto a virtual sphere (arcball).
 */
function projectOnBall(clientX, clientY, width, height) {
  let x = (clientX / width) * 2 - 1;
  let y = (clientY / height) * -2 + 1; // invert Y
  const len2 = x * x + y * y;
  if (len2 > 1) {
    const scale = 1 / Math.sqrt(len2);
    x *= scale;
    y *= scale;
    return new THREE.Vector3(x, y, 0);
  } else {
    const z = Math.sqrt(1 - len2);
    return new THREE.Vector3(x, y, z);
  }
}

// 1) Logo above the ball
function LogoModel() {
  const { scene } = useGLTF("/models/3DLogoForward.glb");
  scene.position.set(0, 2.5, 0);
  scene.scale.set(1, 1, 1);
  return <primitive object={scene} />;
}

/**
 * 2) Pokeball with arcball drag + momentum + pointer capture
 *    tuned to spin slowly & not stop too fast.
 */
function PokeballModel() {
  const { scene } = useGLTF("/models/pullectorsphere.glb");
  scene.position.set(0, 0, 0);
  scene.scale.set(5, 5, 5);

  const meshRef = useRef(scene);

  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const lastSpherePos = useRef(null);

  // Momentum states
  const [momentum, setMomentum] = useState({
    axis: new THREE.Vector3(0, 0, 0),
    angle: 0,
  });
  const [applyMomentum, setApplyMomentum] = useState(false);

  // When user clicks the ball
  function handlePointerDown(e) {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);

    setIsDragging(true);
    setApplyMomentum(false);
    lastSpherePos.current = projectOnBall(
      e.clientX,
      e.clientY,
      window.innerWidth,
      window.innerHeight
    );
  }

  // While dragging, compute arc rotation
  function handlePointerMove(e) {
    if (!isDragging || !lastSpherePos.current) return;
    e.stopPropagation();

    const newSpherePos = projectOnBall(
      e.clientX,
      e.clientY,
      window.innerWidth,
      window.innerHeight
    );

    // axis = cross, angle = acos(dot)
    const axis = new THREE.Vector3().crossVectors(
      lastSpherePos.current,
      newSpherePos
    );
    let dot = lastSpherePos.current.dot(newSpherePos);
    dot = Math.min(Math.max(dot, -1), 1);
    let angle = Math.acos(dot);

    // Lower speedFactor => slower drag rotation
    const speedFactor = 2.0; // adjust to your liking
    angle *= speedFactor;

    // Build quaternion
    const q = new THREE.Quaternion();
    axis.normalize();
    q.setFromAxisAngle(axis, angle);

    // Apply rotation
    meshRef.current.quaternion.premultiply(q);

    // Store axis+angle for momentum
    setMomentum({ axis: axis.clone(), angle });

    // Update last sphere pos
    lastSpherePos.current = newSpherePos;
  }

  // On release, enable momentum
  function handlePointerUp(e) {
    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    lastSpherePos.current = null;
    setApplyMomentum(true);
  }

  function handlePointerCancel() {
    setIsDragging(false);
    lastSpherePos.current = null;
    setApplyMomentum(false);
  }

  // useFrame: apply momentum if enabled
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (applyMomentum && !isDragging) {
      let { axis, angle } = momentum;

      if (angle < 0.0001) {
        setApplyMomentum(false);
        return;
      }

      const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
      mesh.quaternion.premultiply(q);

      // Higher friction => slower stop => spins longer
      const friction = 0.99; 
      angle *= friction;

      setMomentum({ axis, angle });
    }
  });

  return (
    <primitive
      object={scene}
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
    />
  );
}

// 3) Main component
export default function ThreeHome() {
  return (
    <>
      <Canvas
        style={{ width: "100%", height: "100vh" }}
        camera={{ position: [0, 2.5, 10], fov: 50 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />

        <Suspense fallback={null}>
          <PokeballModel />
          <LogoModel />
        </Suspense>
      </Canvas>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <Link to="/shop">
          <button
            style={{
              fontSize: "1rem",
              padding: "0.8rem 1.2rem",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Go to Shop
          </button>
        </Link>
      </div>
    </>
  );
}
