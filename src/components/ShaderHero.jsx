import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshTransmissionMaterial, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
        // Scroll animation timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 3, // Increased for a more liquid, high-fidelity smoothing feel
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

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        if (groupRef.current) {
            // Smooth group rotation lerp
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, time * 0.05, 0.1);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, Math.sin(time * 0.5) * 0.1, 0.1);
        }

        bubblesRef.current.forEach((bubble, i) => {
            if (bubble) {
                // Organic rotation wobble with lerp for jitter-free motion
                const targetRotX = Math.sin(time * (0.2 + i * 0.05)) * 0.2;
                const targetRotZ = Math.cos(time * (0.1 + i * 0.03)) * 0.1;
                bubble.rotation.x = THREE.MathUtils.lerp(bubble.rotation.x, targetRotX, 0.1);
                bubble.rotation.z = THREE.MathUtils.lerp(bubble.rotation.z, targetRotZ, 0.1);
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
                            backsideThickness={isMobile ? 0.5 : 1.5}
                            thickness={isMobile ? 0.5 : 1.2}
                            samples={isMobile ? 1 : 4}
                            resolution={isMobile ? 256 : 512}
                            transmission={1}
                            clearcoat={isMobile ? 0.5 : 1}
                            clearcoatRoughness={0}
                            envMapIntensity={isMobile ? 1.5 : 2.5}
                            color="#ffffff"
                            roughness={0.03}
                            anisotropy={isMobile ? 0.1 : 0.5}
                            chromaticAberration={0.06}
                            distortion={0.3}
                            distortionScale={0.3}
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
            uColor1: { value: new THREE.Color('#000000') },
            uColor2: { value: new THREE.Color('#1e1b4b') }, // Deeper Indigo/Purple
            uColor3: { value: new THREE.Color('#ffffff') }, // Energy Highlights
            uAccent: { value: new THREE.Color('#4c1d95') }, // Sophisticated Violet
            uDeepBlue: { value: new THREE.Color('#020617') } // Deep Space Blue
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
      uniform vec3 uAccent;
      varying vec2 vUv;

      //  Simplex 3D Noise 
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

      float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        //  x0 = x0 - 0.0 + 0.0 * C 
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

        // Permutations
        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients
        float n_ = 1.0/7.0; // N=7
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

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

        //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        // Mix
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        
        // Slower, majestic movement
        float time = uTime * 0.2;
        
        // Multi-octave noise for rich texture
        float n1 = snoise(vec3(p * 1.0, time));
        float n2 = snoise(vec3(p * 2.0 + vec2(time*0.5), time * 1.5));
        float n3 = snoise(vec3(p * 4.0 - vec2(time*0.3), time * 2.0));
        
        float finalNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
        
        // Map noise to color channels
        // Purple "Nebula" areas
        float purpleMask = smoothstep(0.0, 0.8, finalNoise + 0.2);
        
        // White "Lightning/Energy" areas
        float whiteMask = smoothstep(0.4, 0.9, n2 * n3 + 0.2);

        vec3 color = mix(uColor1, uDeepBlue, dist * 0.5); // Cinematic background depth
        
        // Add purple glow
        color = mix(color, uColor2, purpleMask * 0.6);
        
        // Add accents
        color = mix(color, uAccent, smoothstep(0.3, 0.7, n1) * 0.4);
        
        // Add white space-dust (softened highlights)
        color = mix(color, uColor3, whiteMask * 0.4);
        
        // Vignette
        color *= 1.0 - smoothstep(0.4, 1.4, dist);

        gl_FragColor = vec4(color, 1.0);
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
            <Canvas dpr={window.devicePixelRatio > 1 ? [1, 1.5] : [1, 2]} gl={{ antialias: false, alpha: true, stencil: false }} powerPreference="high-performance">
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={window.innerWidth < 768 ? 60 : 45} />

                <color attach="background" args={['#000000']} />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={5} color="#d8b4fe" />
                <pointLight position={[-10, 5, -5]} intensity={8} color="#1e40af" /> // New Cinematic Blue Rim Light
                <pointLight position={[-10, -10, -10]} intensity={2} color="#6366f1" />

                <Suspense fallback={null}>
                    <BackgroundFluid />
                    <CinematicObject />
                    <Environment preset="night" />
                    <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={3} far={4} />
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
          z-index: 1;
          pointer-events: none;
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
