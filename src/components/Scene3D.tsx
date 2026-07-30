"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function Receipt({ position, rotation, color }: { position: [number, number, number]; rotation: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.x = rotation[0] + Math.cos(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={rotation} castShadow>
        <RoundedBox args={[1.4, 2, 0.05]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </RoundedBox>
        <mesh position={[0, 0.6, 0.03]}>
          <boxGeometry args={[0.9, 0.08, 0.01]} />
          <meshStandardMaterial color="#997E67" opacity={0.3} transparent />
        </mesh>
        <mesh position={[0, 0.35, 0.03]}>
          <boxGeometry args={[0.7, 0.06, 0.01]} />
          <meshStandardMaterial color="#997E67" opacity={0.2} transparent />
        </mesh>
        <mesh position={[0, 0.15, 0.03]}>
          <boxGeometry args={[0.8, 0.06, 0.01]} />
          <meshStandardMaterial color="#997E67" opacity={0.2} transparent />
        </mesh>
        <mesh position={[0, -0.05, 0.03]}>
          <boxGeometry args={[0.6, 0.06, 0.01]} />
          <meshStandardMaterial color="#997E67" opacity={0.2} transparent />
        </mesh>
        <mesh position={[0, -0.35, 0.03]}>
          <boxGeometry args={[0.5, 0.08, 0.01]} />
          <meshStandardMaterial color="#22C55E" opacity={0.4} transparent />
        </mesh>
      </mesh>
    </Float>
  );
}

function ChatBubble({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
      <group ref={meshRef} position={position}>
        <RoundedBox args={[2.2, 1.4, 0.15]} radius={0.15} smoothness={4} castShadow>
          <meshStandardMaterial color="#06C755" roughness={0.2} metalness={0.05} />
        </RoundedBox>
        <mesh position={[0, 0.3, 0.09]}>
          <boxGeometry args={[1.5, 0.08, 0.01]} />
          <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
        </mesh>
        <mesh position={[0, 0.1, 0.09]}>
          <boxGeometry args={[1.2, 0.06, 0.01]} />
          <meshStandardMaterial color="#ffffff" opacity={0.4} transparent />
        </mesh>
        <mesh position={[0, -0.1, 0.09]}>
          <boxGeometry args={[1.0, 0.06, 0.01]} />
          <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
        </mesh>
        <mesh position={[0, -0.35, 0.09]}>
          <RoundedBox args={[0.8, 0.25, 0.02]} radius={0.05} smoothness={4}>
            <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
          </RoundedBox>
        </mesh>
      </group>
    </Float>
  );
}

function DashboardCard({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + 1) * 0.1;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3 + 1) * 0.05;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} castShadow>
        <RoundedBox args={[1.6, 1, 0.08]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.15} transparent opacity={0.9} />
        </RoundedBox>
        <mesh position={[-0.4, 0.2, 0.05]}>
          <boxGeometry args={[0.3, 0.3, 0.01]} />
          <meshStandardMaterial color="#4F6BFF" opacity={0.5} transparent />
        </mesh>
        <mesh position={[0.2, 0.2, 0.05]}>
          <boxGeometry args={[0.6, 0.06, 0.01]} />
          <meshStandardMaterial color="#997E67" opacity={0.3} transparent />
        </mesh>
        <mesh position={[0.2, 0.05, 0.05]}>
          <boxGeometry args={[0.5, 0.06, 0.01]} />
          <meshStandardMaterial color="#997E67" opacity={0.2} transparent />
        </mesh>
        <mesh position={[0, -0.2, 0.05]}>
          <boxGeometry args={[1.1, 0.15, 0.01]} />
          <meshStandardMaterial color="#22C55E" opacity={0.3} transparent />
        </mesh>
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-3, 3, 2]} intensity={0.4} color="#4F6BFF" />
        <pointLight position={[0, -2, 3]} intensity={0.3} color="#FFDDBB" />

        <Receipt position={[-3.5, 0.5, 0]} rotation={[0.1, 0.3, -0.05]} color="#FFFFFF" />
        <Receipt position={[-3.8, -1, -1]} rotation={[-0.05, -0.2, 0.1]} color="#FFF8F0" />
        <ChatBubble position={[0, 0.3, 0.5]} />
        <DashboardCard position={[3.2, 0.8, 0]} color="#FFFFFF" />
        <DashboardCard position={[3.5, -0.5, -0.5]} color="#FFF8F0" />
      </Canvas>
    </div>
  );
}
