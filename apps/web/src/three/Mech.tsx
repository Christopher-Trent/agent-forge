import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, type Group } from 'three';
import { useRef } from 'react';
import { useForge } from '../store/forge';
import { catalogById } from '../data/catalog';

const socketPositions: Record<string, [number, number, number]> = {
  socket_chest: [0, 1.65, 0.18], socket_reactor: [0, 1.35, 0.24], socket_head: [0, 2.68, 0.12], socket_head_crown: [0, 3.02, 0], socket_head_eyes: [0, 2.58, 0.34], socket_back: [0, 1.7, -0.38], socket_hip_L: [-0.55, 0.65, 0], socket_hand_R: [-1.62, 0.75, 0.04], socket_hand_L: [1.62, 0.75, 0.04], socket_forearm_R: [-1.38, 1.12, 0], socket_forearm_L: [1.38, 1.12, 0], socket_shoulder_R: [-1.0, 2.15, 0], socket_shoulder_L: [1.0, 2.15, 0],
};

function SuitPart({ slot, color, active }: { slot: string; color: string; active: boolean }) {
  const pos = socketPositions[slot] ?? [0, 1, 0];
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.06;
    ref.current.scale.setScalar(active ? pulse : 1);
  });
  return (
    <mesh ref={ref} position={pos} castShadow>
      <octahedronGeometry args={[slot.includes('shoulder') ? 0.28 : 0.2, 1]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.6 : 0.55} metalness={0.7} roughness={0.22} />
    </mesh>
  );
}

export function Mech() {
  const group = useRef<Group>(null);
  const selected = useForge((state) => state.blueprint.coreSkills);
  const parts = useMemo(() => selected.map((id) => catalogById[id]).filter(Boolean), [selected]);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.045;
  });

  return (
    <group ref={group} position={[0, -0.25, 0]}>
      <mesh position={[0, 1.38, 0]} castShadow>
        <capsuleGeometry args={[0.55, 1.05, 10, 24]} />
        <meshStandardMaterial color="#172635" metalness={0.88} roughness={0.2} emissive="#07131b" />
      </mesh>
      <mesh position={[0, 1.36, 0.58]} castShadow>
        <sphereGeometry args={[0.19, 32, 16]} />
        <meshStandardMaterial color="#3fd0ff" emissive="#3fd0ff" emissiveIntensity={2.2} metalness={0.2} roughness={0.1} />
      </mesh>
      <mesh position={[0, 2.45, 0]} castShadow>
        <sphereGeometry args={[0.37, 32, 20]} />
        <meshStandardMaterial color="#1c3040" metalness={0.9} roughness={0.18} />
      </mesh>
      <mesh position={[0, 2.48, 0.35]} castShadow>
        <boxGeometry args={[0.46, 0.08, 0.05]} />
        <meshStandardMaterial color="#3fd0ff" emissive="#3fd0ff" emissiveIntensity={1.9} />
      </mesh>
      {[[-0.78, 1.95, 0], [0.78, 1.95, 0]].map((p, i) => (
        <mesh key={`shoulder-${i}`} position={p as [number, number, number]} castShadow>
          <sphereGeometry args={[0.28, 24, 12]} />
          <meshStandardMaterial color="#21384b" metalness={0.88} roughness={0.22} />
        </mesh>
      ))}
      {[[-1.12, 1.35, 0], [1.12, 1.35, 0], [-1.2, 0.65, 0], [1.2, 0.65, 0]].map((p, i) => (
        <mesh key={`limb-${i}`} position={p as [number, number, number]} rotation-z={i % 2 ? -0.15 : 0.15} castShadow>
          <capsuleGeometry args={[0.15, 0.78, 8, 16]} />
          <meshStandardMaterial color="#182939" metalness={0.82} roughness={0.24} />
        </mesh>
      ))}
      {[[-0.35, 0.02, 0], [0.35, 0.02, 0]].map((p, i) => (
        <mesh key={`leg-${i}`} position={p as [number, number, number]} castShadow>
          <capsuleGeometry args={[0.18, 1.28, 8, 16]} />
          <meshStandardMaterial color="#172635" metalness={0.88} roughness={0.22} />
        </mesh>
      ))}
      {parts.map((part) => <SuitPart key={part.id} slot={part.slot} color={part.accent} active />)}
    </group>
  );
}
