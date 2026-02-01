import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshTransmissionMaterial, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const CinematicObject = () => {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;
            meshRef.current.rotation.y = time * 0.1;
            meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[2, 20]} />
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={1.5}
                    thickness={1}
                    samples={16}
                    transmission={1}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    envMapIntensity={2}
                    color="#ffffff"
                    roughness={0}
                    anisotropy={0.1}
                    distortion={0.3}
                    distortionScale={0.3}
                    temporalDistortion={0.5}
                    ior={1.1}
                />
            </mesh>
        </Float>
    );
};

const BackgroundFluid = () => {
    const meshRef = useRef();

    const shaderArgs = useMemo(() => ({
        uniforms: {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color('#080808') },
            uColor2: { value: new THREE.Color('#111111') },
            uColor3: { value: new THREE.Color('#bfff47') },
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
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      varying vec2 vUv;

      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float dist = length(p);
        
        float pulse = sin(uTime * 0.1 + dist * 2.0) * 0.5 + 0.5;
        vec3 finalColor = mix(uColor1, uColor2, dist);
        
        float fluid = sin(vUv.x * 5.0 + uTime * 0.2) * cos(vUv.y * 5.0 + uTime * 0.2);
        finalColor = mix(finalColor, uColor3, fluid * 0.03 * pulse);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
    }), []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
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
            <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />

                <color attach="background" args={['#080808']} />

                <ambientLight intensity={1} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#bfff47" />

                <Suspense fallback={null}>
                    <BackgroundFluid />
                    <CinematicObject />
                    <Environment preset="city" />
                    <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4} />
                </Suspense>
            </Canvas>

            <div className="grain-overlay" />

            <style>{`
        .canvas-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: -1;
          pointer-events: none;
        }
        
        .grain-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.05;
          mix-blend-mode: overlay;
        }
      `}</style>
        </div>
    );
};

export default ShaderHero;
