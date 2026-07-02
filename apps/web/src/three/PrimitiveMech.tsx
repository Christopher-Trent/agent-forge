import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { FeatureDef } from '@agent-forge/shared';
import type { Group } from 'three';
import { Attachment } from './Attachment';
import { fallbackSocketSpecs, getSocketSpec } from './sockets';
import { GlowStrip, JointOrb, LimbCapsule, ReactorRing, RoundedArmorPlate, SocketCollar } from './ProceduralParts';

function SocketMounts({ parts }: { parts: FeatureDef[] }) {
  return (
    <>
      {parts.map((part, index) => {
        const spec = getSocketSpec(part.slot);
        const fanout: [number, number, number] = part.slot === 'socket_chest' ? [index * 0.12 - 0.06, 0, 0.03] : [0, 0, 0];
        return (
          <group
            key={part.id}
            name={`${part.slot}_mounted_${part.id}`}
            position={[spec.position[0] + fanout[0], spec.position[1] + fanout[1], spec.position[2] + fanout[2]]}
            rotation={spec.rotation ?? [0, 0, 0]}
            scale={spec.scale ?? 1}
          >
            <SocketCollar color={part.accent} />
            <group position={[0, 0, 0.08]}>
              <Attachment def={part} index={index} />
            </group>
          </group>
        );
      })}
    </>
  );
}

function NamedSockets() {
  return (
    <>
      {Object.values(fallbackSocketSpecs).map((spec) => (
        <group key={spec.name} name={spec.name} position={spec.position} rotation={spec.rotation ?? [0, 0, 0]} scale={spec.scale ?? 1} />
      ))}
    </>
  );
}

function ArmorSeams({ color }: { color: string }) {
  return (
    <>
      {[-0.38, -0.19, 0.19, 0.38].map((x) => (
        <GlowStrip key={`vent-${x}`} position={[x, 1.9, 0.39]} scale={[0.035, 0.18, 0.018]} color={color} intensity={0.85} />
      ))}
      <GlowStrip position={[-0.22, 1.55, 0.56]} scale={[0.24, 0.026, 0.018]} rotation={[0, 0, -0.68]} color={color} intensity={0.9} />
      <GlowStrip position={[0.22, 1.55, 0.56]} scale={[0.24, 0.026, 0.018]} rotation={[0, 0, 0.68]} color={color} intensity={0.9} />
      <GlowStrip position={[0, 2.52, 0.52]} scale={[0.42, 0.035, 0.018]} color={color} intensity={1.8} />
    </>
  );
}

function Piston({ position, rotation = [0, 0, 0], length = 0.5 }: { position: [number, number, number]; rotation?: [number, number, number]; length?: number }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <cylinderGeometry args={[0.024, 0.024, length, 16]} />
        <meshStandardMaterial color="#0a1016" metalness={0.94} roughness={0.18} />
      </mesh>
      <mesh position={[0, length / 2 + 0.02, 0]} castShadow>
        <sphereGeometry args={[0.036, 16, 8]} />
        <meshStandardMaterial color="#1f303e" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function PrimitiveMech({ parts }: { parts: FeatureDef[] }) {
  const group = useRef<Group>(null);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useFrame((state) => {
    if (!group.current || reduceMotion) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.56) * 0.038;
    group.current.position.y = -0.38 + Math.sin(t * 1.18) * 0.014;
  });

  const seamPulse = useMemo(() => parts[0]?.accent ?? '#3fd0ff', [parts]);

  return (
    <group ref={group} position={[0, -0.38, 0]}>
      <group name="premium_procedural_base_v2">
        <NamedSockets />

        {/* Dark inner skeleton and narrow waist leave visible negative space between armor masses. */}
        <LimbCapsule position={[0, 1.22, -0.04]} length={0.78} radius={0.13} color="#05090d" />
        <RoundedArmorPlate position={[0, 1.12, 0.04]} scale={[0.52, 0.34, 0.28]} color="#081019" radius={0.08} />
        <RoundedArmorPlate position={[0, 1.69, 0.05]} scale={[1.12, 0.78, 0.42]} color="#101c28" radius={0.12} />
        <RoundedArmorPlate position={[0, 1.86, 0.22]} scale={[1.36, 0.28, 0.26]} color="#263a4d" radius={0.08} />
        <RoundedArmorPlate position={[-0.33, 1.57, 0.42]} scale={[0.44, 0.72, 0.13]} rotation={[0.12, 0.08, -0.31]} color="#1d2c3b" radius={0.045} />
        <RoundedArmorPlate position={[0.33, 1.57, 0.42]} scale={[0.44, 0.72, 0.13]} rotation={[0.12, -0.08, 0.31]} color="#1d2c3b" radius={0.045} />
        <RoundedArmorPlate position={[0, 1.52, 0.51]} scale={[0.42, 0.36, 0.1]} color="#071018" radius={0.05} />
        <group position={[0, 1.43, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
          <ReactorRing color={seamPulse} scale={1.0} />
        </group>
        <ArmorSeams color={seamPulse} />

        {/* Helmet: smaller, faceted, visor-forward, not a cube. */}
        <LimbCapsule position={[0, 2.24, -0.03]} length={0.24} radius={0.12} color="#05090d" />
        <RoundedArmorPlate position={[0, 2.52, 0.05]} scale={[0.52, 0.36, 0.38]} rotation={[0.03, 0, 0]} color="#142436" radius={0.09} />
        <RoundedArmorPlate position={[0, 2.62, 0.1]} scale={[0.4, 0.16, 0.42]} rotation={[0.08, 0, 0]} color="#203447" radius={0.055} />
        <RoundedArmorPlate position={[-0.27, 2.5, 0.08]} scale={[0.12, 0.28, 0.3]} rotation={[0, 0.16, -0.08]} color="#0d1824" radius={0.04} />
        <RoundedArmorPlate position={[0.27, 2.5, 0.08]} scale={[0.12, 0.28, 0.3]} rotation={[0, -0.16, 0.08]} color="#0d1824" radius={0.04} />

        {/* Separate pauldrons, no shoulder plank. */}
        <RoundedArmorPlate position={[-0.84, 2.05, 0.06]} scale={[0.56, 0.24, 0.42]} rotation={[0.02, -0.1, -0.28]} color="#273c4f" radius={0.09} />
        <RoundedArmorPlate position={[0.84, 2.05, 0.06]} scale={[0.56, 0.24, 0.42]} rotation={[0.02, 0.1, 0.28]} color="#273c4f" radius={0.09} />
        <RoundedArmorPlate position={[-0.98, 1.94, 0.12]} scale={[0.38, 0.16, 0.32]} rotation={[0.02, -0.08, -0.46]} color="#132131" radius={0.06} />
        <RoundedArmorPlate position={[0.98, 1.94, 0.12]} scale={[0.38, 0.16, 0.32]} rotation={[0.02, 0.08, 0.46]} color="#132131" radius={0.06} />

        {/* Arms: exposed shoulders/elbows/wrists with tapered armor shells. */}
        <JointOrb position={[-0.9, 1.78, 0.02]} scale={0.95} accent={seamPulse} />
        <JointOrb position={[0.9, 1.78, 0.02]} scale={0.95} accent={seamPulse} />
        <LimbCapsule position={[-1.08, 1.45, 0.02]} length={0.54} radius={0.105} rotation={[0.04, 0, -0.32]} color="#070d13" />
        <LimbCapsule position={[1.08, 1.45, 0.02]} length={0.54} radius={0.105} rotation={[0.04, 0, 0.32]} color="#070d13" />
        <RoundedArmorPlate position={[-1.13, 1.46, 0.14]} scale={[0.26, 0.5, 0.24]} rotation={[0.05, 0, 0.22]} color="#182838" radius={0.065} />
        <RoundedArmorPlate position={[1.13, 1.46, 0.14]} scale={[0.26, 0.5, 0.24]} rotation={[0.05, 0, -0.22]} color="#182838" radius={0.065} />
        <JointOrb position={[-1.24, 1.12, 0.06]} scale={0.78} />
        <JointOrb position={[1.24, 1.12, 0.06]} scale={0.78} />
        <RoundedArmorPlate position={[-1.36, 0.86, 0.18]} scale={[0.24, 0.48, 0.24]} rotation={[0.08, 0, 0.08]} color="#223345" radius={0.06} />
        <RoundedArmorPlate position={[1.36, 0.86, 0.18]} scale={[0.24, 0.48, 0.24]} rotation={[0.08, 0, -0.08]} color="#223345" radius={0.06} />
        <JointOrb position={[-1.42, 0.58, 0.16]} scale={0.58} />
        <JointOrb position={[1.42, 0.58, 0.16]} scale={0.58} />

        {/* Longer mechanical legs with knee gaps and compact feet. */}
        <JointOrb position={[-0.36, 0.82, 0.02]} scale={0.82} />
        <JointOrb position={[0.36, 0.82, 0.02]} scale={0.82} />
        <LimbCapsule position={[-0.4, 0.46, 0.02]} length={0.62} radius={0.11} rotation={[0.02, 0, 0.08]} color="#070d13" />
        <LimbCapsule position={[0.4, 0.46, 0.02]} length={0.62} radius={0.11} rotation={[0.02, 0, -0.08]} color="#070d13" />
        <RoundedArmorPlate position={[-0.43, 0.42, 0.16]} scale={[0.28, 0.58, 0.26]} rotation={[0.02, 0, 0.08]} color="#182838" radius={0.07} />
        <RoundedArmorPlate position={[0.43, 0.42, 0.16]} scale={[0.28, 0.58, 0.26]} rotation={[0.02, 0, -0.08]} color="#182838" radius={0.07} />
        <JointOrb position={[-0.43, 0.06, 0.08]} scale={0.72} accent={seamPulse} />
        <JointOrb position={[0.43, 0.06, 0.08]} scale={0.72} accent={seamPulse} />
        <LimbCapsule position={[-0.45, -0.32, 0.08]} length={0.64} radius={0.1} rotation={[0, 0, -0.03]} color="#070d13" />
        <LimbCapsule position={[0.45, -0.32, 0.08]} length={0.64} radius={0.1} rotation={[0, 0, 0.03]} color="#070d13" />
        <RoundedArmorPlate position={[-0.48, -0.28, 0.22]} scale={[0.28, 0.6, 0.26]} rotation={[0.02, 0, -0.03]} color="#233345" radius={0.07} />
        <RoundedArmorPlate position={[0.48, -0.28, 0.22]} scale={[0.28, 0.6, 0.26]} rotation={[0.02, 0, 0.03]} color="#233345" radius={0.07} />
        <RoundedArmorPlate position={[-0.48, -0.74, 0.34]} scale={[0.44, 0.16, 0.62]} rotation={[0, -0.06, 0]} color="#101a24" radius={0.08} />
        <RoundedArmorPlate position={[0.48, -0.74, 0.34]} scale={[0.44, 0.16, 0.62]} rotation={[0, 0.06, 0]} color="#101a24" radius={0.08} />

        <Piston position={[-0.72, 1.63, -0.05]} rotation={[0, 0, 0.7]} length={0.5} />
        <Piston position={[0.72, 1.63, -0.05]} rotation={[0, 0, -0.7]} length={0.5} />
        <Piston position={[-0.25, 0.62, -0.05]} rotation={[0, 0, 0.22]} length={0.5} />
        <Piston position={[0.25, 0.62, -0.05]} rotation={[0, 0, -0.22]} length={0.5} />
      </group>
      <SocketMounts parts={parts} />
    </group>
  );
}
