import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshTransmissionMaterial, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { sounds, getMuted } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

const CinematicObject = () => {
  const groupRef = useRef();
  const bubblesRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Higher fidelity data for 12 bubbles (reduced on mobile for performance)
  const bubbleData = useMemo(() => {
    const allData = [
      { id: 0, targetPos: [0, 0, 0], scale: 1.2, speed: 1 },
      { id: 1, targetPos: [-4, 3, -3], scale: 0.6, speed: 1.2 },
      { id: 2, targetPos: [4, -3, -2], scale: 0.5, speed: 0.8 },
      { id: 3, targetPos: [-3, -4, -4], scale: 0.7, speed: 1.5 },
      { id: 4, targetPos: [5, 4, -5], scale: 0.4, speed: 1.1 },
      { id: 5, targetPos: [-5, 1, -2], scale: 0.5, speed: 0.9 },
      { id: 6, targetPos: [3, 5, -4], scale: 0.6, speed: 1.3 },
      { id: 7, targetPos: [1, -5, -2], scale: 0.4, speed: 0.7 },
      { id: 8, targetPos: [-6, -2, -3], scale: 0.3, speed: 1.4 },
      { id: 9, targetPos: [6, 0, -4], scale: 0.5, speed: 1.0 },
      { id: 10, targetPos: [-2, 6, -3], scale: 0.4, speed: 1.2 },
      { id: 11, targetPos: [2, -6, -5], scale: 0.3, speed: 0.9 },
    ];
    return isMobile ? allData.slice(0, 6) : allData;
  }, [isMobile]);


  useEffect(() => {
    let lastSoundTime = 0;
    const soundCooldown = 150; // ms

    // Scroll animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 3, // Increased for a more liquid, high-fidelity smoothing feel
        onUpdate: (self) => {
          // Play bubble sound when scrolling, with a cooldown and check if muted
          const now = Date.now();
          if (!getMuted() && Math.abs(self.getVelocity()) > 100 && now - lastSoundTime > soundCooldown) {
            sounds.bubble();
            lastSoundTime = now;
          }
        }
      }
    });

    bubblesRef.current.forEach((bubble, i) => {
      if (!bubble) return;
      const data = bubbleData[i];
      const staggerDelay = i * 0.05; // More pronounced stagger for "smooth unfolding"

      // 1. SPLIT (0 -> 40% scroll)
      tl.to(bubble.position, {
        x: data.targetPos[0],
        y: data.targetPos[1],
        z: data.targetPos[2],
        ease: 'power3.out', // Smoother entry
      }, staggerDelay)
        .to(bubble.scale, {
          x: data.scale,
          y: data.scale,
          z: data.scale,
          ease: 'power3.out',
        }, staggerDelay);

      // 2. MERGE (40% -> 60% scroll)
      tl.to(bubble.position, {
        x: 0,
        y: 0,
        z: 0,
        ease: 'expo.inOut',
      }, 0.4 + staggerDelay)
        .to(bubble.scale, {
          x: i === 0 ? 1.5 : 0,
          y: i === 0 ? 1.5 : 0,
          z: i === 0 ? 1.5 : 0,
          ease: 'expo.inOut',
        }, 0.4 + staggerDelay);

      // 3. RE-SPLIT (60% -> 100% scroll)
      tl.to(bubble.position, {
        x: data.targetPos[0] * -1.2,
        y: data.targetPos[1] * 0.8,
        z: data.targetPos[2] - 2,
        ease: 'power4.inOut',
      }, 0.7 + staggerDelay)
        .to(bubble.scale, {
          x: data.scale * 0.7,
          y: data.scale * 0.7,
          z: data.scale * 0.7,
          ease: 'power4.inOut',
        }, 0.7 + staggerDelay);
    });

    return () => {
      if (ScrollTrigger.getById('bubble-trigger')) ScrollTrigger.getById('bubble-trigger').kill();
    };
  }, [bubbleData]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pulse = (Math.sin(time * 0.5) + 1) * 0.5; // Synced 0-1 pulse
    const mouseX = state.mouse.x * 2;
    const mouseY = state.mouse.y * 2;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, time * 0.05 + mouseX * 0.1, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY * 0.05, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, Math.sin(time * 0.5) * 0.1 + mouseY * 0.05, 0.1);
    }

    bubblesRef.current.forEach((bubble, i) => {
      if (bubble) {

        // Organic "Deep" animation using Three.js MathUtils
        const targetRotX = Math.sin(time * (0.2 + i * 0.05)) * 0.2;
        const targetRotZ = Math.cos(time * (0.1 + i * 0.03)) * 0.1;

        // Smoother liquid feel with three.js damp/lerp
        bubble.rotation.x = THREE.MathUtils.lerp(bubble.rotation.x, targetRotX, 0.08);
        bubble.rotation.z = THREE.MathUtils.lerp(bubble.rotation.z, targetRotZ, 0.08);

        // Subtle organic "breathe" scale
        const breathe = 1.0 + Math.sin(time * 0.8 + i) * 0.03;
        bubble.children[0]?.scale.setScalar(breathe);

        // Sync bubble color/transmission with pulse (Deep Styling)
        const material = bubble.material;
        if (material) {
          // Blend between crisp white and more "Deep" indigo/violet
          const targetColor = new THREE.Color(pulse > 0.5 ? '#6d28d9' : '#ffffff');
          material.color.lerp(targetColor, 0.02);
          material.envMapIntensity = THREE.MathUtils.lerp(material.envMapIntensity, 1.0 + pulse * 1.5, 0.05);
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {bubbleData.map((data, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh ref={el => bubblesRef.current[i] = el} position={[0, 0, 0]}>
            <icosahedronGeometry args={[2, 20]} />
            <MeshTransmissionMaterial
              backside
              backsideThickness={isMobile ? 0.3 : 1.0}
              thickness={isMobile ? 0.3 : 0.8}
              samples={isMobile ? 1 : 4}
              resolution={isMobile ? 256 : 512}
              transmission={1}
              clearcoat={isMobile ? 0.3 : 0.8}
              clearcoatRoughness={0}
              envMapIntensity={isMobile ? 1.2 : 2.0}
              color="#ffffff"
              roughness={0.05}
              anisotropy={isMobile ? 0.1 : 0.5}
              chromaticAberration={0.08}
              distortion={0.4}
              distortionScale={0.4}
              temporalDistortion={0.5}
              ior={1.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const BackgroundFluid = () => {
  const meshRef = useRef();

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uSyncPulse: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color('#000105') }, // Pure Black Depth
      uColor2: { value: new THREE.Color('#6d28d9') }, // Deep Professional Violet
      uColor3: { value: new THREE.Color('#ffffff') }, // Crisp White energy
      uAccent: { value: new THREE.Color('#a855f7') }, // Vibrant Purple Accent
      uDeepPurple: { value: new THREE.Color('#1e1b4b') } // Indigo Depth
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uSyncPulse;
      uniform vec2 uMouse;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec3 uAccent;
      uniform vec3 uDeepPurple;
      varying vec2 vUv;

      //  Simplex 3D Noise 
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

      float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        float n_ = 1.0/7.0; 
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float dist = length(p);
        float time = uTime * 0.15;
        
        // DEEP LIGHT RAYS (Subtle and atmospheric)
        float rays = 0.0;
        vec2 rayP = p * 1.5;
        float rayAngle = atan(rayP.y, rayP.x);
        rays += (sin(rayAngle * 6.0 + time) + 1.0) * 0.5;
        rays += (sin(rayAngle * 4.0 - time * 0.5) + 1.0) * 0.5;
        rays *= 0.08 * smoothstep(0.6, 0.0, dist);

        float n1 = snoise(vec3(p * 1.5, time));
        float n2 = snoise(vec3(p * 3.0 + vec2(time * 0.4), time * 1.2));
        float finalNoise = n1 * 0.5 + n2 * 0.5;
        
        // DEEP MOUSE GLOW
        float mouseDist = length(p - uMouse);
        float mouseGlow = smoothstep(0.8, 0.0, mouseDist) * 0.35;

        // Perfect Sync Base: Deep Black with subtle pulse depth
        vec3 color = mix(uColor1, uDeepPurple * (0.3 + uSyncPulse * 0.3), dist * 0.8);
        
        // Professional Violet Waves - intensity synced with pulse
        float violetWaves = smoothstep(-0.3, 0.7, finalNoise);
        color = mix(color, uColor2 * (0.8 + uSyncPulse * 0.4), violetWaves * 0.35);
        
        // Premium Accents synced
        float accentMask = smoothstep(0.35, 0.85, n2);
        color = mix(color, uAccent * (0.9 + uSyncPulse * 0.3), accentMask * 0.25);
        
        // Kinetic White Energy Highlights - perfectly synced pulse
        float energyMask = smoothstep(0.5, 0.99, n1 + 0.2);
        color = mix(color, uColor3 * (1.1 + uSyncPulse * 0.2), energyMask * 0.2);

        // Apply Deep Lights
        color += mix(uColor2, uDeepPurple, 0.5) * rays * (0.4 + uSyncPulse * 0.4);
        color += uDeepPurple * mouseGlow * (0.6 + uSyncPulse * 0.3);
        
        // Professional Vignette - sharp focus center, pure black edges
        color *= 1.1 - smoothstep(0.2, 1.2, dist);

        gl_FragColor = vec4(color, 1.0);
      }
    `
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.material.uniforms.uTime.value = time;
      meshRef.current.material.uniforms.uSyncPulse.value = (Math.sin(time * 0.5) + 1) * 0.5;
      meshRef.current.material.uniforms.uMouse.value.lerp(state.mouse, 0.1);

      // Background Parallax
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, state.mouse.y * 0.5, 0.02);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={[100, 100, 1]}>
      <planeGeometry />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
};

const ShaderHero = () => {
  return (
    <div className="canvas-container">
      <Canvas dpr={window.devicePixelRatio > 1 ? [1, 1.5] : [1, 2]} gl={{ antialias: false, alpha: true, stencil: false }} powerPreference="high-performance">
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={window.innerWidth < 768 ? 60 : 45} />

        <color attach="background" args={['#000000']} />

        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={8} color="#a855f7" />
        <pointLight position={[-10, 5, -5]} intensity={10} color="#6d28d9" />
        <pointLight position={[0, -5, 5]} intensity={5} color="#ffffff" />

        <ContactShadows
          position={[0, -4, 0]}
          opacity={0.4}
          scale={20}
          blur={2.5}
          far={4}
          color="#000000"
        />

        <Suspense fallback={null}>
          <BackgroundFluid />
          <CinematicObject />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      <div className="grain-overlay" />

      <style>{`
        .canvas-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: -1;
          pointer-events: none;
          background: #000;
        }
        
        .grain-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.05;
          mix-blend-mode: overlay;
        }
      `}</style>
    </div>
  );
};

export default ShaderHero;
