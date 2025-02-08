import React, {
  Suspense,
  useRef,
  useMemo,
  useEffect,
  useState
} from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/three";
import gsap from "gsap";
import { TextureLoader } from "three";



window.THREE = THREE;

const MOUSE_SENSITIVITY = 4;
const MOMENTUM_DAMPING = 0.97;
const MIN_MOMENTUM = 0.0001;
const ROTATION_MIX_FACTOR = 0.3;
const BASE_SCALE = 7;

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && canvas.getContext("webgl"));
  } catch (e) {
    return false;
  }
}

// Performance Check: Detect Low-End Devices
function isLowEndDevice() {
  return navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4;
}

// FPS Monitoring Function
function monitorFPS(navigate) {
  let frameCount = 0;
  let startTime = performance.now();

  function checkFPS() {
    frameCount++;
    const elapsed = performance.now() - startTime;
    if (elapsed >= 1000) {
      const fps = frameCount;
      console.log(`FPS: ${fps}`);

      if (fps < 10) {
        navigate("/shop");
      }

      frameCount = 0;
      startTime = performance.now();
    }
    requestAnimationFrame(checkFPS);
  }

  checkFPS();
}


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
  
  const tempAxis = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const currentQuat = useMemo(() => new THREE.Quaternion(), []);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    isDragging.current = true;
    momentum.current.angle = 0;
    lastPos.current.copy(
      projectOnBall(e.clientX, e.clientY, window.innerWidth, window.innerHeight)
    );
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    
    const newPos = projectOnBall(e.clientX, e.clientY, window.innerWidth, window.innerHeight);
    tempAxis.crossVectors(lastPos.current, newPos);
    
    if (tempAxis.length() < 0.000001) return;
    tempAxis.normalize();
    
    const angle = lastPos.current.angleTo(newPos) * MOUSE_SENSITIVITY;
    
    tempQuat.setFromAxisAngle(tempAxis, angle);
    targetQuat.current.premultiply(tempQuat);
    momentum.current.axis.copy(tempAxis);
    momentum.current.angle = angle;
    
    lastPos.current.copy(newPos);
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    isDragging.current = false;
  };

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    currentQuat.slerp(targetQuat.current, ROTATION_MIX_FACTOR);
    meshRef.current.quaternion.copy(currentQuat);

    if (!isDragging.current && momentum.current.angle > MIN_MOMENTUM) {
      tempQuat.setFromAxisAngle(
        momentum.current.axis,
        momentum.current.angle * delta * 80
      );
      targetQuat.current.premultiply(tempQuat);
      momentum.current.angle *= MOMENTUM_DAMPING;
    }
  });

  return (
    <group>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <sphereGeometry args={[BASE_SCALE, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <primitive
        object={scene}
        ref={meshRef}
        castShadow
        receiveShadow
        scale={[BASE_SCALE, BASE_SCALE, BASE_SCALE]}
      />
    </group>
  );
}

function ShopButtonModel({ onShopClick }) {
  const { scene } = useGLTF("/models/Shop.glb");
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const { scale } = useSpring({
    scale: clicked ? 1.4 : hovered ? 1.8 : 1.5,
    config: {
      tension: clicked ? 600 : hovered ? 400 : 300,
      friction: 20,
    },
    onRest: () => {
      if (clicked) {
        onShopClick && onShopClick();
      }
    },
  });
  return (
    <animated.group scale={scale} position={[0, -6, -3]}>

      <primitive object={scene} />

      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(true)}
      >
        <boxGeometry args={[2.2, 0.2, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </animated.group>
  );
}

function ShopPreview({ meshRef }) {
  const texture = useLoader(TextureLoader, "/shop_preview.png");

  return (
    <mesh ref={meshRef} position={[0, -4, -20]}>
      <planeGeometry args={[10, (10 * 9) / 16]} />
      <meshBasicMaterial map={texture} transparent opacity={0} />
    </mesh>
  );
}

function CameraFlyThrough({ onComplete, shopPreviewRef }) {
  const { camera } = useThree();

  const shopPreviewPosition = new THREE.Vector3(0, -4, -20);
  
  useEffect(() => {
    const startPoint = camera.position.clone();
    const initialLookAt = camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()));

    const cp1 = startPoint;
    const cp2 = new THREE.Vector3(0, 2, 9); 
    const cp3 = new THREE.Vector3(0, -4, -9.5); 
    const curve = new THREE.CatmullRomCurve3([cp1, cp2, cp3]);
    
    const progress = { t: 0 };
    let shopPreviewShown = false;
    
    gsap.to(progress, {
      t: 1,
      duration: 2.5, 
      ease: "power2.inOut",
      onUpdate: () => {
        const point = curve.getPointAt(progress.t);
        camera.position.copy(point);

        const interpolatedLookAt = new THREE.Vector3().lerpVectors(initialLookAt, shopPreviewPosition, progress.t);
        camera.lookAt(interpolatedLookAt);
        

        camera.fov = THREE.MathUtils.lerp(50, 30, progress.t);
        camera.updateProjectionMatrix();

        if (!shopPreviewShown && progress.t >= 0.4 && shopPreviewRef.current) {
          shopPreviewShown = true;
          gsap.to(shopPreviewRef.current.material, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      },
      onComplete: () => {
        onComplete && onComplete();
      },
    });
  }, [camera, onComplete, shopPreviewRef]);
  
  return null;
}


export default function ThreeHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const backgroundRef = useRef(null);
  const [flyThroughActive, setFlyThroughActive] = useState(false);
  const shopPreviewRef = useRef();

  useEffect(() => {
    // ✅ Pre-check WebGL before rendering
    if (!isWebGLAvailable() || isLowEndDevice()) {
      console.warn("WebGL not supported or low-end device detected. Redirecting...");
      navigate("/shop");
    } else {
      setIsAllowed(true);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (!isAllowed) return;

    // ✅ Start FPS Monitoring only if allowed
    monitorFPS(navigate);

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
          mouseControls: false,
          touchControls: false,
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
          showLines: false,
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
  }, [isAllowed, navigate]);


  const handleShopClick = () => {
    setFlyThroughActive(true);
  };

  const handleCameraComplete = () => {
    navigate("/shop");
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div
        ref={backgroundRef}
        style={{ position: "absolute", width: "100vw", height: "100vh", zIndex: -1 }}
      ></div>
      <Canvas camera={{ position: [0, 2.5, 10], fov: 50 }}>
        <ambientLight intensity={2} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={2048}
        />
        <Suspense fallback={null}>
          <PokeballModel />
          <LogoModel />
          <ShopButtonModel onShopClick={handleShopClick} />
          <ShopPreview meshRef={shopPreviewRef} />
          {flyThroughActive && (
            <CameraFlyThrough
              shopPreviewRef={shopPreviewRef}
              onComplete={handleCameraComplete}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
