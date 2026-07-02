import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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

export function FallbackModule({ slot, accent, index = 0 }: { slot: string; accent: string; index?: number }) {
  const group = useRef<Group>(null);
  const variant = useMemo(() => variantForSlot(slot), [slot]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const forge = Math.min(1, t * 1.8);
    const pulse = 1 + Math.sin(t * 5.5 + index) * 0.025;
    group.current.scale.setScalar(forge * pulse);
  });

  const emissiveIntensity = 1.1 + (index % 2) * 0.35;

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={variant === 'shoulder' ? [0.46, 0.2, 0.34] : variant === 'forearm' ? [0.24, 0.5, 0.22] : variant === 'back' ? [0.3, 0.68, 0.18] : [0.32, 0.2, 0.24]} />
        <meshStandardMaterial color="#111b24" metalness={0.82} roughness={0.24} emissive="#02070a" />
      </mesh>
      <mesh position={[0, 0, 0.035]} castShadow>
        <boxGeometry args={variant === 'optic' ? [0.48, 0.08, 0.055] : variant === 'reactor' ? [0.26, 0.26, 0.08] : [0.26, 0.055, 0.07]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={emissiveIntensity} metalness={0.25} roughness={0.12} />
      </mesh>
      {(variant === 'shoulder' || variant === 'back' || variant === 'crown') && (
        <>
          <mesh position={[-0.18, 0.18, 0]} rotation-z={0.3} castShadow>
            <boxGeometry args={[0.06, 0.38, 0.08]} />
            <meshStandardMaterial color="#263745" metalness={0.9} roughness={0.18} />
          </mesh>
          <mesh position={[0.18, 0.18, 0]} rotation-z={-0.3} castShadow>
            <boxGeometry args={[0.06, 0.38, 0.08]} />
            <meshStandardMaterial color="#263745" metalness={0.9} roughness={0.18} />
          </mesh>
        </>
      )}
      {(variant === 'hand' || variant === 'forearm') && (
        <mesh position={[0, -0.22, 0.08]} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.035, 0.06, 0.42, 6]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} metalness={0.7} roughness={0.18} />
        </mesh>
      )}
    </group>
  );
}
