import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, MeshWobbleMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FloatingIcosahedron({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(t / 2) / 4;
    ref.current.rotation.y = Math.cos(t / 2) / 4;
    ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.2;
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <icosahedronGeometry args={[0.6, 1]} />
      <MeshWobbleMaterial color={color} speed={1.5} factor={0.6} transparent opacity={0.85} />
    </mesh>
  );
}

const Hero3D = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 3, 2]} intensity={0.8} />
        <Stars radius={80} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
        <FloatingIcosahedron position={[-2, 0.5, -1]} color={"hsl(214 92% 55% / 0.8)"} />
        <FloatingIcosahedron position={[2, -0.2, -1.5]} color={"hsl(214 92% 70% / 0.6)"} />
      </Canvas>
    </div>
  );
};

export default Hero3D;
