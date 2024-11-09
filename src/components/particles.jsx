import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSwarm = () => {
  const count = 300;
  const mesh = useRef();
  
  const [positions, speeds] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;      // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;  // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;  // z
      speeds[i] = Math.random() * 0.1 + 0.05;
    }
    
    return [positions, speeds];
  }, []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update Y position with wave-like motion
      mesh.current.geometry.attributes.position.array[i3 + 1] += speeds[i];
      
      // Reset position if particle goes too high
      if (mesh.current.geometry.attributes.position.array[i3 + 1] > 15) {
        mesh.current.geometry.attributes.position.array[i3 + 1] = -15;
      }
      
      // Add gentle swaying motion in X and Z
      mesh.current.geometry.attributes.position.array[i3] += Math.sin(time + i) * 0.01;
      mesh.current.geometry.attributes.position.array[i3 + 2] += Math.cos(time + i) * 0.01;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.17}
        sizeAttenuation={true}
        color="#FC8019"
        transparent={true}
        opacity={1.0}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-white/40">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        dpr={[1, 2]}
      >
        <ParticleSwarm />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;