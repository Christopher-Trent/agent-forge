import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { FeatureDef } from '@agent-forge/shared';
import type { Group } from 'three';
import { Attachment } from './Attachment';
import { fallbackSocketPositions } from './sockets';

function ArmorMaterial({ color = '#172433', emissive = '#02070a' }: { color?: string; emissive?: string }) {
  return <meshStandardMaterial color={color} metalness={0.88} roughness={0.2} emissive={emissive} />;
}

function Plate({ position, scale, rotation = [0, 0, 0], color = '#172433' }: { position: [number, number, number]; scale: [number, number, number]; rotation?: [number, number, number]; color?: string }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <ArmorMaterial color={color} />
    </mesh>
  );
}

function SocketMounts({ parts }: { parts: FeatureDef[] }) {
  return (
    <>
      {parts.map((part, index) => {
        const position = fallbackSocketPositions[part.slot] ?? fallbackSocketPositions.socket_chest;
        const fanout = part.slot === 'socket_chest' ? [index * 0.14 - 0.07, 0, 0.02] : [0, 0, 0];
        return (
          <group key={part.id} position={[position[0] + fanout[0], position[1] + fanout[1], position[2] + fanout[2]]}>
            <mesh position={[0, 0, -0.045]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.2, 0.075, 8]} />
              <meshStandardMaterial color="#0b1219" metalness={0.92} roughness={0.18} emissive={part.accent} emissiveIntensity={0.18} />
            </mesh>
            <Attachment def={part} index={index} />
          </group>
        );
      })}
    </>
  );
}

export function PrimitiveMech({ parts }: { parts: FeatureDef[] }) {
  const group = useRef<Group>(null);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useFrame((state) => {
    if (!group.current || reduceMotion) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.62) * 0.042;
    group.current.position.y = -0.35 + Math.sin(t * 1.35) * 0.018;
  });

  const seamPulse = useMemo(() => parts[0]?.accent ?? '#3fd0ff', [parts]);

  return (
    <group ref={group} position={[0, -0.35, 0]}>
      <group name="premium_procedural_base">
        <Plate position={[0, 1.52, 0]} scale={[1.0, 1.24, 0.46]} rotation={[0, 0, 0]} color="#111c28" />
        <Plate position={[0, 1.8, 0.11]} scale={[1.32, 0.34, 0.26]} color="#223447" />
        <Plate position={[-0.35, 1.42, 0.29]} scale={[0.32, 0.78, 0.12]} rotation={[0.12, 0.08, -0.2]} color="#1d2c3b" />
        <Plate position={[0.35, 1.42, 0.29]} scale={[0.32, 0.78, 0.12]} rotation={[0.12, -0.08, 0.2]} color="#1d2c3b" />
        <Plate position={[0, 1.02, 0.02]} scale={[0.62, 0.38, 0.34]} color="#0e171f" />
        <mesh position={[0, 1.43, 0.56]} castShadow>
          <cylinderGeometry args={[0.18, 0.24, 0.09, 8]} />
          <meshStandardMaterial color="#06131a" emissive={seamPulse} emissiveIntensity={2.1} metalness={0.35} roughness={0.08} />
        </mesh>
        <Plate position={[0, 2.48, 0.03]} scale={[0.62, 0.46, 0.48]} color="#172738" />
        <Plate position={[0, 2.58, 0.37]} scale={[0.5, 0.075, 0.08]} color="#050d12" />
        <mesh position={[0, 2.58, 0.43]} castShadow>
          <boxGeometry args={[0.42, 0.035, 0.035]} />
          <meshStandardMaterial color="#3fd0ff" emissive="#3fd0ff" emissiveIntensity={2.4} metalness={0.2} roughness={0.05} />
        </mesh>
        {[[-0.86, 2.04, 0.02, -0.22], [0.86, 2.04, 0.02, 0.22]].map(([x, y, z, rz], i) => (
          <Plate key={`pauldron-${i}`} position={[x, y, z]} scale={[0.62, 0.28, 0.42]} rotation={[0.04, 0, rz]} color="#26394b" />
        ))}
        {[[-1.05, 1.57, 0.02, 0.24], [1.05, 1.57, 0.02, -0.24], [-1.23, 1.12, 0.08, 0.12], [1.23, 1.12, 0.08, -0.12]].map(([x, y, z, rz], i) => (
          <Plate key={`arm-${i}`} position={[x, y, z]} scale={[0.23, 0.62, 0.28]} rotation={[0.05, 0, rz]} color={i < 2 ? '#172635' : '#203142'} />
        ))}
        {[[-0.39, 0.45, 0.04, 0.08], [0.39, 0.45, 0.04, -0.08], [-0.42, -0.22, 0.1, -0.03], [0.42, -0.22, 0.1, 0.03]].map(([x, y, z, rz], i) => (
          <Plate key={`leg-${i}`} position={[x, y, z]} scale={[0.27, 0.72, 0.32]} rotation={[0.02, 0, rz]} color={i < 2 ? '#182838' : '#233345'} />
        ))}
        {[[-0.42, -0.68, 0.22], [0.42, -0.68, 0.22]].map((p, i) => (
          <Plate key={`foot-${i}`} position={p as [number, number, number]} scale={[0.48, 0.16, 0.68]} color="#101a24" />
        ))}
        {[-0.46, -0.23, 0, 0.23, 0.46].map((x) => (
          <mesh key={`vent-${x}`} position={[x, 1.95, 0.31]} castShadow>
            <boxGeometry args={[0.04, 0.16, 0.035]} />
            <meshStandardMaterial color="#3fd0ff" emissive="#3fd0ff" emissiveIntensity={0.9} metalness={0.35} roughness={0.1} />
          </mesh>
        ))}
        {[[-0.78, 1.74, -0.05, 0.7], [0.78, 1.74, -0.05, -0.7], [-0.3, 0.86, -0.05, 0.2], [0.3, 0.86, -0.05, -0.2]].map(([x, y, z, rz], i) => (
          <mesh key={`piston-${i}`} position={[x, y, z]} rotation-z={rz} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.48, 8]} />
            <meshStandardMaterial color="#0a1016" metalness={0.92} roughness={0.16} />
          </mesh>
        ))}
      </group>
      <SocketMounts parts={parts} />
    </group>
  );
}
