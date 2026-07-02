import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedArmorPlate, GlowStrip, ReactorRing, SocketCollar, GlowMaterial } from './ProceduralParts';
import type { Group } from 'three';

type Variant = 'optic' | 'crown' | 'back' | 'hip' | 'hand' | 'forearm' | 'shoulder' | 'reactor' | 'chest';

function variantForSlot(slot: string): Variant {
  if (slot.includes('eyes') || slot === 'socket_head') return 'optic';
  if (slot.includes('crown')) return 'crown';
  if (slot.includes('back')) return 'back';
  if (slot.includes('hip')) return 'hip';
  if (slot.includes('hand')) return 'hand';
  if (slot.includes('forearm')) return 'forearm';
  if (slot.includes('shoulder')) return 'shoulder';
  if (slot.includes('reactor')) return 'reactor';
  return 'chest';
}

function AntennaPair({ accent }: { accent: string }) {
  return (
    <>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.12, 0.16, 0]} rotation={[0, 0, side * -0.32]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.012, 0.02, 0.45, 12]} />
            <meshStandardMaterial color="#263745" metalness={0.9} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.035, 16, 8]} />
            <GlowMaterial color={accent} intensity={0.9} />
          </mesh>
        </group>
      ))}
    </>
  );
}

export function FallbackModule({ slot, accent, index = 0 }: { slot: string; accent: string; index?: number }) {
  const group = useRef<Group>(null);
  const variant = useMemo(() => variantForSlot(slot), [slot]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const forge = Math.min(1, 0.82 + t * 0.55);
    const pulse = 1 + Math.sin(t * 4.2 + index) * 0.018;
    group.current.scale.setScalar(forge * pulse);
  });

  if (variant === 'reactor') {
    return (
      <group ref={group} rotation={[Math.PI / 2, 0, 0]}>
        <ReactorRing color={accent} scale={0.78} />
      </group>
    );
  }

  if (variant === 'optic') {
    return (
      <group ref={group}>
        <SocketCollar color={accent} />
        <RoundedArmorPlate position={[0, 0, 0.07]} scale={[0.36, 0.12, 0.1]} color="#071018" radius={0.04} />
        <GlowStrip position={[0, 0, 0.135]} scale={[0.3, 0.028, 0.018]} color={accent} intensity={1.7} />
        <mesh position={[0.18, 0, 0.12]} castShadow>
          <sphereGeometry args={[0.07, 24, 12]} />
          <GlowMaterial color={accent} intensity={1.15} />
        </mesh>
      </group>
    );
  }

  if (variant === 'crown') {
    return (
      <group ref={group}>
        <SocketCollar color={accent} />
        <AntennaPair accent={accent} />
        <GlowStrip position={[0, 0.08, 0.08]} scale={[0.24, 0.026, 0.028]} color={accent} />
      </group>
    );
  }

  if (variant === 'back') {
    return (
      <group ref={group}>
        <SocketCollar color={accent} />
        <RoundedArmorPlate position={[0, 0, -0.06]} scale={[0.26, 0.56, 0.16]} color="#101b25" radius={0.055} />
        {[-0.11, 0.11].map((x) => (
          <mesh key={x} position={[x, 0.1, -0.02]} rotation={[0.24, 0, x > 0 ? -0.14 : 0.14]} castShadow>
            <cylinderGeometry args={[0.022, 0.034, 0.72, 16]} />
            <meshStandardMaterial color="#293b49" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        <GlowStrip position={[0, -0.18, 0.05]} scale={[0.18, 0.025, 0.026]} color={accent} />
      </group>
    );
  }

  if (variant === 'hand') {
    return (
      <group ref={group}>
        <SocketCollar color={accent} />
        <RoundedArmorPlate position={[0, -0.03, 0.06]} scale={[0.2, 0.32, 0.18]} color="#111b24" radius={0.05} />
        <mesh position={[0, -0.26, 0.11]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.065, 0.46, 24]} />
          <GlowMaterial color={accent} intensity={0.95} />
        </mesh>
        <GlowStrip position={[0, -0.04, 0.165]} scale={[0.14, 0.026, 0.018]} color={accent} />
      </group>
    );
  }

  if (variant === 'forearm') {
    return (
      <group ref={group}>
        <SocketCollar color={accent} />
        <RoundedArmorPlate position={[0, 0, 0.05]} scale={[0.24, 0.45, 0.16]} color="#152231" radius={0.055} />
        <mesh position={[0, -0.02, 0.16]} castShadow>
          <cylinderGeometry args={[0.045, 0.06, 0.48, 20]} />
          <meshStandardMaterial color="#091018" metalness={0.88} roughness={0.18} emissive={accent} emissiveIntensity={0.24} />
        </mesh>
        <GlowStrip position={[0, 0.18, 0.17]} scale={[0.12, 0.022, 0.018]} color={accent} />
      </group>
    );
  }

  if (variant === 'shoulder') {
    return (
      <group ref={group}>
        <SocketCollar color={accent} />
        <RoundedArmorPlate position={[0, 0, 0.05]} scale={[0.34, 0.18, 0.24]} color="#1c2d3c" radius={0.055} />
        <mesh position={[0, 0.02, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.08, 0.22, 24]} />
          <meshStandardMaterial color="#091018" metalness={0.9} roughness={0.18} emissive={accent} emissiveIntensity={0.18} />
        </mesh>
        <GlowStrip position={[0, 0.09, 0.18]} scale={[0.19, 0.022, 0.016]} color={accent} />
      </group>
    );
  }

  if (variant === 'hip') {
    return (
      <group ref={group}>
        <SocketCollar color={accent} />
        <RoundedArmorPlate position={[0, -0.04, 0.05]} scale={[0.24, 0.34, 0.16]} color="#121d27" radius={0.055} />
        <mesh position={[0, -0.1, 0.16]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
          <GlowMaterial color={accent} intensity={0.75} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={group}>
      <SocketCollar color={accent} />
      <RoundedArmorPlate position={[0, 0, 0.05]} scale={[0.34, 0.18, 0.16]} color="#111b24" radius={0.05} />
      <GlowStrip position={[0, 0, 0.145]} scale={[0.24, 0.028, 0.018]} color={accent} intensity={1.35} />
    </group>
  );
}
