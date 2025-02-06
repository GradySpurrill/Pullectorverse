import React, { Suspense, useRef, useMemo, useEffect, useCallback, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/three";

window.THREE = THREE;

const MOUSE_SENSITIVITY = 4;
const MOMENTUM_DAMPING = 0.97;
const MIN_MOMENTUM = 0.0001;
const ROTATION_MIX_FACTOR = 0.3;
const BASE_SCALE = 7;

function projectOnBall(clientX, clientY, width, height) {
  const x = (clientX / width) * 2 - 1;
  const y = (clientY / height) * -2 + 1;
  const length = Math.min(1, Math.sqrt(x * x + y * y));
  return new THREE.Vector3(x, y, Math.sqrt(1 - length * length));
}

function LogoModel() {
  const { scene } = useGLTF("/models/LOGO.glb");
  return <primitive object={scene} position={[0, 3, 3.5]} />;
}

function PokeballModel() {
  const { scene } = useGLTF("/models/pullectorsphereF.glb");
  const meshRef = useRef();
  const isDragging = useRef(false);
  const lastPos = useRef(new THREE.Vector3());
  const momentum = useRef({ axis: new THREE.Vector3(), angle: 0 });
  const targetQuat = useRef(new THREE.Quaternion());
  
  // Reusable objects
  const tempAxis = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const currentQuat = useMemo(() => new THREE.Quaternion(), []);

  const handleMove = (clientX, clientY) => {
    if (!isDragging.current) return;
    
    const newPos = projectOnBall(clientX, clientY, window.innerWidth, window.innerHeight);
    tempAxis.crossVectors(lastPos.current, newPos).normalize();
    const angle = lastPos.current.angleTo(newPos) * MOUSE_SENSITIVITY * 1.5;
    
    if (angle > 0.0001) {
      tempQuat.setFromAxisAngle(tempAxis, angle);
      targetQuat.current.premultiply(tempQuat);
      momentum.current.axis.copy(tempAxis);
      momentum.current.angle = angle;
    }
    
    lastPos.current.copy(newPos);
  };

  const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const handleTouchMove = (e) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    isDragging.current = true;
    momentum.current.angle = 0;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    lastPos.current.copy(projectOnBall(clientX, clientY, window.innerWidth, window.innerHeight));

    // Add global listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handlePointerUp);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    // Remove global listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handlePointerUp);
    document.removeEventListener('touchmove', handleTouchMove, { passive: false });
    document.removeEventListener('touchend', handlePointerUp);
  };

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Apply rotation mixing
    currentQuat.slerp(targetQuat.current, ROTATION_MIX_FACTOR);
    meshRef.current.quaternion.copy(currentQuat);

    // Apply momentum when not dragging
    if (!isDragging.current && momentum.current.angle > MIN_MOMENTUM) {
      tempQuat.setFromAxisAngle(momentum.current.axis, momentum.current.angle * delta * 60);
      targetQuat.current.premultiply(tempQuat);
      momentum.current.angle *= MOMENTUM_DAMPING;
    }
  });

  useEffect(() => {
    return () => {
      // Cleanup listeners on unmount
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

  return (
    <primitive
      object={scene}
      ref={meshRef}
      castShadow
      receiveShadow
      scale={[BASE_SCALE, BASE_SCALE, BASE_SCALE]}
      onPointerDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    />
  );
}
function ShopButtonModel() {
  const { scene } = useGLTF("/models/Shop.glb");
  const meshRef = useRef();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);


  const { scale } = useSpring({
    scale: clicked ? 0.8 : hovered ? 1.2 : 1.5,
    config: { tension: 300, friction: 10 },
    onRest: () => {
      if (clicked) {
        setClicked(false);
        navigate("/shop");
      }
    },
  });

  return (
    <animated.primitive
      object={scene}
      ref={meshRef}
      position={[0, -6, -3]}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(true)}
    />
  );
}

export default function ThreeHome() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const loadScripts = async () => {
      if (!window.p5) {
        const scriptP5 = document.createElement("script");
        scriptP5.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js";
        scriptP5.async = true;
        document.body.appendChild(scriptP5);
        await new Promise((resolve) => (scriptP5.onload = resolve));
      }

      if (!window.VANTA || !window.VANTA.DOTS) {
        const scriptVanta = document.createElement("script");
        scriptVanta.src = "https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.dots.min.js";
        scriptVanta.async = true;
        document.body.appendChild(scriptVanta);
        await new Promise((resolve) => (scriptVanta.onload = resolve));
      }

      if (window.VANTA && window.VANTA.DOTS && backgroundRef.current) {
        backgroundRef.current.vantaEffect = window.VANTA.DOTS({
          el: backgroundRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: window.innerHeight,
          minWidth: window.innerWidth,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x222222,
          color: 0xe5a64,
          color2: 0x84848,
          size: 3,
          spacing: 35,
          showLines: true,
          THREE: window.THREE,
        });
      }
    };

    loadScripts();

    return () => {
      if (backgroundRef.current?.vantaEffect) {
        backgroundRef.current.vantaEffect.destroy();
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div ref={backgroundRef} style={{ position: "absolute", width: "100vw", height: "100vh", zIndex: -1 }}></div>
      <Canvas camera={{ position: [0, 2.5, 10], fov: 50 }}>
        <ambientLight intensity={2} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow shadow-mapSize={2048} />
        <Suspense fallback={null}>
          <PokeballModel />
          <LogoModel />
          <ShopButtonModel /> {/* ✅ 3D Shop Button is now working */}
        </Suspense>
      </Canvas>
    </div>
  );
}