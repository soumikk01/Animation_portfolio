import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ShaderHero.scss';

gsap.registerPlugin(ScrollTrigger);

const PARTICLES = 800; // Increased for more density
const colors = ['#00ffff', '#00cccc', '#00ffcc', '#00aaff', '#88ccff', '#ffffff', '#22ddff'];

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

function NumberParticles() {
  const group = useRef();
  
  const [data] = useState(() => {
    const arr = [];
    const shapes = [
      getSpikySphere(PARTICLES),  // Hero/Top - 0%
      getTornado(PARTICLES),      // Scrolling down a bit - 25%
      getTorus(PARTICLES),        // Middle - 50%
      getDNAHelix(PARTICLES),     // Lower - 75%
      getCubeGrid(PARTICLES)      // Bottom - 100%
    ];
    
    const chars = "01";
    for (let i = 0; i < PARTICLES; i++) {
      // Base emissive intensity modifier for bloom - REDUCED
      const emissiveMult = 0.5 + Math.random() * 0.5;
      const baseColor = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      
      arr.push({
        char: chars[Math.floor(Math.random() * chars.length)],
        color: baseColor.multiplyScalar(emissiveMult), // Make it artificially brighter for Bloom
        shapes: shapes.map(s => ({ pos: s.positions[i], rot: s.rotations[i] })),
        speed: 0.3 + Math.random() * 1.2,
        offset: Math.random() * Math.PI * 2,
        size: 0.2 + Math.random() * 0.3, // Slightly larger base size
        rotSpeed: (Math.random() - 0.5) * 0.5
      });
    }
    return arr;
  });
  
  const scrollRef = useRef(0);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".main-content", // This matches App.jsx content wrapper
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Add slight smoothing to the scrub
        onUpdate: (self) => {
           scrollRef.current = self.progress; 
        }
      });
    });
    return () => ctx.revert();
  }, []);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const textRefs = useRef([]);
  
  if (textRefs.current.length !== PARTICLES) {
    textRefs.current = Array(PARTICLES).fill().map(() => null);
  }
  
  useFrame((state, delta) => {
    const scroll = scrollRef.current;
    const timeFull = state.clock.elapsedTime;
    
    // We have 5 shapes now 
    const numShapes = data[0].shapes.length;
    const scrollT = scroll * (numShapes - 1);
    const shapeMapIndex = Math.min(Math.floor(scrollT), numShapes - 2);
    // Smooth interpolation curve (easeInOut)
    let shapeInterpolation = scrollT - shapeMapIndex;
    shapeInterpolation = shapeInterpolation * shapeInterpolation * (3 - 2 * shapeInterpolation);
    
    if (group.current) {
      // Keep it rotating elegantly
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
       // Add subtle floating and vibrating movements
       dummy.position.y += Math.sin(time) * 0.2 + Math.cos(time * 2.5) * 0.05;
       dummy.position.x += Math.cos(time * 0.8) * 0.2 + Math.sin(time * 3.1) * 0.05;
       dummy.position.z += Math.sin(time * 1.3) * 0.1;
       
       // Add individual gentle rotation
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
          opacity={0.6}
        />
      ))}
    </group>
  );
}

const ShaderHero = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#050b14']} />
        <fog attach="fog" args={['#050b14', 15, 35]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <NumberParticles />
        </Float>
        
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.5} 
            luminanceSmoothing={1.0} 
            intensity={0.4} 
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
      <div className="grain-overlay" />
    </div>
  );
};

export default ShaderHero;
