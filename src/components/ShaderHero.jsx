// src/components/ShaderHero.jsx
import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ShaderHero.scss';

gsap.registerPlugin(ScrollTrigger);

const PARTICLES = 800; // Original Text Particles
const VORTEX_PARTICLES = 6000; // New Background Shader Particles
const colors = ['#00ffff', '#00cccc', '#00ffcc', '#00aaff', '#88ccff', '#ffffff', '#22ddff'];

// ============================================
// OLD 0 1 ANIMATION SHAPES
// ============================================
function getSpikySphere(count) {
  const positions = [];
  const rotations = [];
  const numSpikes = 80;
  const dotsPerSpike = Math.floor(count / numSpikes);
  const phi = Math.PI * (3 - Math.sqrt(5));
  
  for (let i = 0; i < numSpikes; i++) {
    const y = 1 - (i / (numSpikes - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const dir = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).normalize();
    
    for (let j = 0; j < dotsPerSpike; j++) {
      const dist = 1.0 + Math.random() * 7.5; 
      positions.push(new THREE.Vector3().copy(dir).multiplyScalar(dist));
      
      const up = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
      
      const twist = new THREE.Quaternion().setFromAxisAngle(dir, Math.random() * Math.PI * 2);
      quat.multiply(twist);
      
      rotations.push(new THREE.Euler().setFromQuaternion(quat));
    }
  }
  
  while(positions.length < count) {
    const p = new THREE.Vector3((Math.random()-0.5)*15, (Math.random()-0.5)*15, (Math.random()-0.5)*15);
    positions.push(p);
    rotations.push(new THREE.Euler());
  }
  return { positions, rotations };
}

function getDNAHelix(count) {
  const positions = [];
  const rotations = [];
  const turns = 5;
  const radius = 4;
  const height = 28;
  
  for(let i = 0; i < count; i++) {
     const t = i / count;
     const angle = t * Math.PI * 2 * turns;
     const y = (t - 0.5) * height;
     
     const strand = (i % 2 === 0) ? 1 : -1;
     const x = Math.cos(angle + (strand > 0 ? 0 : Math.PI)) * radius;
     const z = Math.sin(angle + (strand > 0 ? 0 : Math.PI)) * radius;
     
     const nx = x + (Math.random() - 0.5) * 2;
     const ny = y + (Math.random() - 0.5) * 2;
     const nz = z + (Math.random() - 0.5) * 2;
     
     const pos = new THREE.Vector3(nx, ny, nz);
     positions.push(pos);
     
     const dir = new THREE.Vector3(x, 0, z).normalize();
     const up = new THREE.Vector3(0, 1, 0);
     const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
     rotations.push(new THREE.Euler().setFromQuaternion(quat));
  }
  return { positions, rotations };
}

function getTorus(count) {
  const positions = [];
  const rotations = [];
  const R = 6.5;
  const r = 2.5;
  
  for(let i=0; i < count; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    
    // Create a twisted torus shape
    const x = (R + r * Math.cos(v)) * Math.cos(u) + Math.sin(v) * 1.5;
    const y = (R + r * Math.cos(v)) * Math.sin(u) + Math.cos(v) * 1.5;
    const z = r * Math.sin(v) + Math.sin(u)*1.5;
    
    positions.push(new THREE.Vector3(x, y, z));
    const tubeCenter = new THREE.Vector3(R * Math.cos(u), R * Math.sin(u), 0);
    const dir = new THREE.Vector3(x,y,z).sub(tubeCenter).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    rotations.push(new THREE.Euler().setFromQuaternion(quat));
  }
  return { positions, rotations };
}

function getTornado(count) {
  const positions = [];
  const rotations = [];
  const height = 25;
  const turns = 8;
  
  for(let i=0; i < count; i++) {
     const t = i / count;
     // Radius grows non-linearly towards the top
     const currentRadius = 0.5 + Math.pow(t, 2) * 12; 
     const angle = t * Math.PI * 2 * turns;
     const y = (t - 0.5) * height; // Centered
     
     const nx = Math.cos(angle) * currentRadius + (Math.random() - 0.5) * 1.5;
     const ny = y + (Math.random() - 0.5) * 1;
     const nz = Math.sin(angle) * currentRadius + (Math.random() - 0.5) * 1.5;
     
     const pos = new THREE.Vector3(nx, ny, nz);
     positions.push(pos);
     
     // Rotate particles outwards from cylinder
     const dir = new THREE.Vector3(nx, 0, nz).normalize();
     const up = new THREE.Vector3(0, 1, 0);
     const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
     rotations.push(new THREE.Euler().setFromQuaternion(quat));
  }
  
  return { positions, rotations };
}

function getCubeGrid(count) {
  const positions = [];
  const rotations = [];
  // Cube root to get equal grid size
  const side = Math.ceil(Math.pow(count, 1/3));
  const spacing = 1.8;
  const offset = (side * spacing) / 2;
  
  for(let i=0; i < count; i++) {
     const x = (i % side) * spacing - offset;
     const y = (Math.floor(i / side) % side) * spacing - offset;
     const z = (Math.floor(i / (side * side))) * spacing - offset;
     
     // Add slight jitter so it isn't perfect
     const jitterX = x + (Math.random() - 0.5) * 0.4;
     const jitterY = y + (Math.random() - 0.5) * 0.4;
     const jitterZ = z + (Math.random() - 0.5) * 0.4;
     
     positions.push(new THREE.Vector3(jitterX, jitterY, jitterZ));
     
     // Give them a uniform geometric rotation, or facing forward
     rotations.push(new THREE.Euler(0, 0, 0));
  }
  
  return { positions, rotations };
}

function NumberParticles({ scrollRef }) {
  const group = useRef();
  
  const [data] = useState(() => {
    const arr = [];
    const shapes = [
      getSpikySphere(PARTICLES),  
      getTornado(PARTICLES),      
      getTorus(PARTICLES),        
      getDNAHelix(PARTICLES),     
      getCubeGrid(PARTICLES)      
    ];
    
    const chars = "01";
    for (let i = 0; i < PARTICLES; i++) {
      const emissiveMult = 0.5 + Math.random() * 0.5;
      const baseColor = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      
      arr.push({
        char: chars[Math.floor(Math.random() * chars.length)],
        color: baseColor.multiplyScalar(emissiveMult),
        shapes: shapes.map(s => ({ pos: s.positions[i], rot: s.rotations[i] })),
        speed: 0.3 + Math.random() * 1.2,
        offset: Math.random() * Math.PI * 2,
        size: 0.2 + Math.random() * 0.3, 
        rotSpeed: (Math.random() - 0.5) * 0.5
      });
    }
    return arr;
  });
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const textRefs = useRef([]);
  
  if (textRefs.current.length !== PARTICLES) {
    textRefs.current = Array(PARTICLES).fill().map(() => null);
  }
  
  useFrame((state) => {
    const scroll = scrollRef.current;
    const timeFull = state.clock.elapsedTime;
    
    const numShapes = data[0].shapes.length;
    const scrollT = scroll * (numShapes - 1);
    const shapeMapIndex = Math.min(Math.floor(scrollT), numShapes - 2);
    
    let shapeInterpolation = scrollT - shapeMapIndex;
    shapeInterpolation = shapeInterpolation * shapeInterpolation * (3 - 2 * shapeInterpolation);
    
    if (group.current) {
      group.current.rotation.y = timeFull * 0.15;
      group.current.rotation.z = Math.sin(timeFull * 0.05) * 0.2;
      group.current.rotation.x = scroll * Math.PI * 2 + Math.cos(timeFull * 0.08) * 0.1;
    }
    
    for (let i = 0; i < PARTICLES; i++) {
       const ref = textRefs.current[i];
       if (!ref) continue;
       const item = data[i];
       
       const shape1 = item.shapes[shapeMapIndex];
       const shape2 = item.shapes[shapeMapIndex + 1];
       
       dummy.position.lerpVectors(shape1.pos, shape2.pos, shapeInterpolation);
       
       const q1 = new THREE.Quaternion().setFromEuler(shape1.rot);
       const q2 = new THREE.Quaternion().setFromEuler(shape2.rot);
       q1.slerp(q2, shapeInterpolation);
       dummy.quaternion.copy(q1);
       
       const time = timeFull * item.speed + item.offset;
       dummy.position.y += Math.sin(time) * 0.2 + Math.cos(time * 2.5) * 0.05;
       dummy.position.x += Math.cos(time * 0.8) * 0.2 + Math.sin(time * 3.1) * 0.05;
       dummy.position.z += Math.sin(time * 1.3) * 0.1;
       
       dummy.rotateZ(time * item.rotSpeed);
       dummy.rotateX(Math.sin(time * 0.5) * 0.1);
       
       ref.position.copy(dummy.position);
       ref.quaternion.copy(dummy.quaternion);
    }
  });
  
  return (
    <group ref={group}>
      {data.map((props, i) => (
        <Text
          key={i}
          ref={(el) => (textRefs.current[i] = el)}
          text={props.char}
          fontSize={props.size}
          color={props.color}
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
          material-transparent={true}
          opacity={0.8}
        />
      ))}
    </group>
  );
}

// ============================================
// NEW VORTEX SHADER ANIMATION
// ============================================
const CustomVortexParticles = ({ scrollRef }) => {
  const pointsRef = useRef();
  
  const [positions, sizes, randoms] = useMemo(() => {
    const pos = new Float32Array(VORTEX_PARTICLES * 3);
    const sz = new Float32Array(VORTEX_PARTICLES);
    const rnd = new Float32Array(VORTEX_PARTICLES);
    
    for (let i = 0; i < VORTEX_PARTICLES; i++) {
      const radius = Math.random() * 25;
      const t = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 2.0) * 25; 
      
      const x = Math.cos(t) * r;
      const z = Math.sin(t) * r;
      // Spread them slightly vertically, tapering off near edges
      const y = (Math.random() - 0.5) * 20 * (1 - Math.min(r/25, 1)); 
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      sz[i] = Math.random() * 1.5 + 0.5;
      rnd[i] = Math.random();
    }
    
    return [pos, sz, rnd];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
  }), []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime * 2.5;
      pointsRef.current.material.uniforms.uScroll.value = THREE.MathUtils.lerp(
        pointsRef.current.material.uniforms.uScroll.value,
        scrollRef.current,
        0.05
      );

      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
      pointsRef.current.rotation.x = scrollRef.current * Math.PI * 0.5;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={VORTEX_PARTICLES} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={VORTEX_PARTICLES} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aRandom" count={VORTEX_PARTICLES} array={randoms} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent={true}
        vertexShader={`
          uniform float uTime;
          uniform float uScroll;
          attribute float aSize;
          attribute float aRandom;
          varying vec3 vColor;
          
          vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
          float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
              dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
          }

          void main() {
            vec3 pos = position;
            float radius = length(pos.xz);
            
            float twist = uTime * 0.4 * aRandom + uScroll * 15.0 * (1.0 - radius/25.0);
            float s = sin(twist);
            float c = cos(twist);
            
            float nx = pos.x * c - pos.z * s;
            float nz = pos.x * s + pos.z * c;
            pos.x = nx;
            pos.z = nz;
            
            float noiseY = snoise(vec2(pos.x * 0.1, pos.z * 0.1 + uTime * 0.3));
            pos.y += noiseY * 4.0 * aRandom + sin(uTime * 1.5 + radius) * 1.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            gl_PointSize = aSize * (15.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
            
            // Subdued cosmic backdrop colors
            float mixVal = smoothstep(0.0, 18.0, radius);
            vec3 colorCore = vec3(0.0, 0.4, 0.6); 
            vec3 colorMid = vec3(0.1, 0.1, 0.4);   
            vec3 colorEdge = vec3(0.0, 0.0, 0.2); 
            
            if (mixVal < 0.5) {
              vColor = mix(colorCore, colorMid, mixVal * 2.0);
            } else {
              vColor = mix(colorMid, colorEdge, (mixVal - 0.5) * 2.0);
            }
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.1, dist);
            gl_FragColor = vec4(vColor, alpha * 0.5); // Slightly lowered alpha for backdrop balance
          }
        `}
        uniforms={uniforms}
      />
    </points>
  );
};

// ============================================
// MAIN WRAPPER
// ============================================
const ShaderHero = () => {
  const scrollRef = useRef(0);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".main-content", 
        start: "top top",
        end: "bottom bottom",
        scrub: 1, 
        onUpdate: (self) => {
           scrollRef.current = self.progress; 
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#050b14']} />
        <fog attach="fog" args={['#050b14', 15, 35]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        {/* The new deep space particle vortex backdrop */}
        <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.2}>
          <CustomVortexParticles scrollRef={scrollRef} />
        </Float>

        {/* The original 0 and 1 shapes shifting on scroll */}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <NumberParticles scrollRef={scrollRef} />
        </Float>
        
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.5} 
            luminanceSmoothing={1.0} 
            intensity={0.6} 
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
      <div className="grain-overlay" />
    </div>
  );
};

export default ShaderHero;
