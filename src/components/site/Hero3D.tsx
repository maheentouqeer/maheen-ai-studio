import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, MeshWobbleMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FloatingGeometry({ position, color, geometry }: { 
  position: [number, number, number]; 
  color: string;
  geometry: 'icosahedron' | 'octahedron' | 'torus';
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(t / 3) / 6;
    ref.current.rotation.y = Math.cos(t / 2.5) / 5;
    ref.current.rotation.z = Math.sin(t / 4) / 8;
    ref.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.15;
    ref.current.position.x = position[0] + Math.cos(t * 0.6 + position[1]) * 0.1;
  });

  const getGeometry = () => {
    switch (geometry) {
      case 'icosahedron': return <icosahedronGeometry args={[0.5, 2]} />;
      case 'octahedron': return <octahedronGeometry args={[0.4, 0]} />;
      case 'torus': return <torusGeometry args={[0.3, 0.15, 8, 24]} />;
    }
  };

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      {getGeometry()}
      <MeshWobbleMaterial 
        color={color} 
        speed={1.2} 
        factor={0.4} 
        transparent 
        opacity={0.7}
        roughness={0.1}
        metalness={0.3}
      />
    </mesh>
  );
}

const Hero3D = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 3]} intensity={0.6} />
        <pointLight position={[-5, -5, 2]} intensity={0.4} color="hsl(214, 92%, 70%)" />
        <Stars 
          radius={120} 
          depth={80} 
          count={3000} 
          factor={3} 
          saturation={0.2} 
          fade 
          speed={0.8} 
        />
        <FloatingGeometry 
          position={[-3, 1, -2]} 
          color="hsl(214, 92%, 60%)" 
          geometry="icosahedron" 
        />
        <FloatingGeometry 
          position={[2.5, -0.5, -2.5]} 
          color="hsl(214, 100%, 70%)" 
          geometry="octahedron" 
        />
        <FloatingGeometry 
          position={[0, 2, -3]} 
          color="hsl(214, 85%, 65%)" 
          geometry="torus" 
        />
        <FloatingGeometry 
          position={[-1, -2, -1.5]} 
          color="hsl(214, 95%, 58%)" 
          geometry="icosahedron" 
        />
      </Canvas>
    </div>
  );
};

export default Hero3D;
