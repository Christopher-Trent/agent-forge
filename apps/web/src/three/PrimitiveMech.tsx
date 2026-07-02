import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { FeatureDef } from '@agent-forge/shared';
import type { Group } from 'three';
import { Attachment } from './Attachment';
import { fallbackSocketSpecs, getSocketSpec } from './sockets';
import { ArmorMaterial, GlowMaterial, GlowStrip, JointOrb, LimbCapsule, ReactorRing, SocketCollar } from './ProceduralParts';

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

function HardPlate({ position, scale, rotation = [0, 0, 0], color = '#172433', emissive = '#010407' }: { position: [number, number, number]; scale: [number, number, number]; rotation?: [number, number, number]; color?: string; emissive?: string }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <ArmorMaterial color={color} emissive={emissive} roughness={0.24} />
    </mesh>
  );
}

function ArmorBolt({ position, scale = 1, color = '#7b91a3' }: { position: [number, number, number]; scale?: number; color?: string }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]} scale={scale} castShadow>
      <cylinderGeometry args={[0.025, 0.025, 0.018, 10]} />
      <meshStandardMaterial color={color} metalness={0.92} roughness={0.18} />
    </mesh>
  );
}

function ArmorSeams({ color }: { color: string }) {
  return (
    <>
      {[-0.38, -0.19, 0.19, 0.38].map((x) => (
        <GlowStrip key={`vent-${x}`} position={[x, 1.92, 0.42]} scale={[0.03, 0.2, 0.018]} color={color} intensity={0.85} />
      ))}
      <GlowStrip position={[-0.22, 1.58, 0.61]} scale={[0.24, 0.024, 0.018]} rotation={[0, 0, -0.72]} color={color} intensity={0.9} />
      <GlowStrip position={[0.22, 1.58, 0.61]} scale={[0.24, 0.024, 0.018]} rotation={[0, 0, 0.72]} color={color} intensity={0.9} />
      <GlowStrip position={[0, 2.5, 0.28]} scale={[0.32, 0.018, 0.012]} color={color} intensity={1.55} />
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

function VentRow({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-0.12, -0.04, 0.04, 0.12].map((x) => (
        <HardPlate key={x} position={[x, 0, 0]} scale={[0.04, 0.16, 0.022]} rotation={[0, 0, -0.22]} color="#050a10" />
      ))}
    </group>
  );
}

function ClawHand({ side, accent }: { side: -1 | 1; accent: string }) {
  return (
    <group position={[side * 1.5, 0.48, 0.18]} rotation={[0.08, 0, side * -0.05]}>
      <HardPlate position={[0, 0.02, 0]} scale={[0.22, 0.16, 0.18]} color="#0b131d" />
      {[-0.09, 0, 0.09].map((x, index) => (
        <group key={x} position={[x, -0.12, 0.03]} rotation={[0.35, 0, (index - 1) * 0.16]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.018, 0.012, 0.25, 6]} />
            <meshStandardMaterial color="#121f2b" metalness={0.9} roughness={0.22} />
          </mesh>
          <mesh position={[0, -0.15, 0.018]} rotation={[0.42, 0, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.026, 0.12, 6]} />
            <meshStandardMaterial color="#8ea5b7" metalness={0.94} roughness={0.16} emissive={accent} emissiveIntensity={0.04} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RailSet({ side, accent }: { side: -1 | 1; accent: string }) {
  return (
    <group position={[side * 1.37, 0.86, 0.34]} rotation={[0.08, 0, side * -0.08]}>
      <HardPlate position={[0, 0.02, 0]} scale={[0.07, 0.42, 0.06]} color="#0b1118" />
      <HardPlate position={[side * 0.08, -0.02, 0.03]} scale={[0.035, 0.52, 0.045]} color="#51697d" />
      <GlowStrip position={[side * 0.09, -0.02, 0.067]} scale={[0.018, 0.36, 0.012]} color={accent} intensity={0.7} />
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
    group.current.position.y = -0.32 + Math.sin(t * 1.18) * 0.014;
  });

  const seamPulse = useMemo(() => parts[0]?.accent ?? '#3fd0ff', [parts]);

  return (
    <group ref={group} position={[0, -0.32, 0]}>
      <group name="premium_procedural_hardsurface_base_v3">
        <NamedSockets />

        {/* Dark exposed chassis with layered hard-surface armor over it. */}
        <LimbCapsule position={[0, 1.16, -0.08]} length={0.92} radius={0.1} color="#04080d" />
        <HardPlate position={[0, 1.06, 0.02]} scale={[0.42, 0.38, 0.28]} color="#070d14" />
        <HardPlate position={[0, 1.72, 0.02]} scale={[1.05, 0.72, 0.42]} color="#0f1a26" />
        <HardPlate position={[0, 1.94, 0.2]} scale={[1.42, 0.22, 0.24]} rotation={[0.03, 0, 0]} color="#2b4054" />
        <HardPlate position={[-0.36, 1.62, 0.46]} scale={[0.48, 0.74, 0.12]} rotation={[0.1, 0.08, -0.36]} color="#203244" />
        <HardPlate position={[0.36, 1.62, 0.46]} scale={[0.48, 0.74, 0.12]} rotation={[0.1, -0.08, 0.36]} color="#203244" />
        <HardPlate position={[-0.22, 1.78, 0.55]} scale={[0.2, 0.48, 0.08]} rotation={[0.05, 0, -0.72]} color="#53697b" />
        <HardPlate position={[0.22, 1.78, 0.55]} scale={[0.2, 0.48, 0.08]} rotation={[0.05, 0, 0.72]} color="#53697b" />
        <HardPlate position={[0, 1.42, 0.56]} scale={[0.46, 0.34, 0.1]} color="#050b12" />
        <group position={[0, 1.43, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
          <ReactorRing color={seamPulse} scale={1.0} />
        </group>
        <VentRow position={[-0.44, 1.34, 0.58]} />
        <VentRow position={[0.44, 1.34, 0.58]} />
        {[-0.56, 0.56].map((x) => <ArmorBolt key={`chest-bolt-${x}`} position={[x, 1.87, 0.35]} scale={1.25} />)}
        <ArmorSeams color={seamPulse} />

        {/* Helmet assembly: compact, recessed, sloped, with cheek armor and sensor pods. */}
        <LimbCapsule position={[0, 2.25, -0.04]} length={0.28} radius={0.1} color="#04080d" />
        <HardPlate position={[0, 2.48, 0.02]} scale={[0.44, 0.3, 0.34]} rotation={[0.04, 0, 0]} color="#111f2d" />
        <HardPlate position={[0, 2.61, 0.16]} scale={[0.5, 0.11, 0.19]} rotation={[-0.24, 0, 0]} color="#40586b" />
        <HardPlate position={[0, 2.5, 0.25]} scale={[0.38, 0.055, 0.04]} color="#02070c" emissive={seamPulse} />
        <HardPlate position={[-0.18, 2.38, 0.19]} scale={[0.16, 0.18, 0.12]} rotation={[0.12, 0, -0.26]} color="#203244" />
        <HardPlate position={[0.18, 2.38, 0.19]} scale={[0.16, 0.18, 0.12]} rotation={[0.12, 0, 0.26]} color="#203244" />
        <HardPlate position={[-0.3, 2.49, 0.04]} scale={[0.08, 0.26, 0.28]} rotation={[0, 0.14, -0.08]} color="#0a121b" />
        <HardPlate position={[0.3, 2.49, 0.04]} scale={[0.08, 0.26, 0.28]} rotation={[0, -0.14, 0.08]} color="#0a121b" />
        {[-0.36, 0.36].map((x) => <ArmorBolt key={`sensor-${x}`} position={[x, 2.58, 0.13]} scale={1.1} color="#d08a3c" />)}

        {/* Separate angular pauldrons, layered like shoulder armor instead of capsules. */}
        <HardPlate position={[-0.84, 2.07, 0.05]} scale={[0.6, 0.18, 0.46]} rotation={[0.04, -0.12, -0.34]} color="#31485b" />
        <HardPlate position={[0.84, 2.07, 0.05]} scale={[0.6, 0.18, 0.46]} rotation={[0.04, 0.12, 0.34]} color="#31485b" />
        <HardPlate position={[-1.04, 1.93, 0.14]} scale={[0.44, 0.13, 0.34]} rotation={[0.02, -0.12, -0.58]} color="#142232" />
        <HardPlate position={[1.04, 1.93, 0.14]} scale={[0.44, 0.13, 0.34]} rotation={[0.02, 0.12, 0.58]} color="#142232" />
        <HardPlate position={[-0.76, 2.17, 0.31]} scale={[0.36, 0.06, 0.18]} rotation={[0.1, -0.18, -0.32]} color="#6f879a" />
        <HardPlate position={[0.76, 2.17, 0.31]} scale={[0.36, 0.06, 0.18]} rotation={[0.1, 0.18, 0.32]} color="#6f879a" />

        {/* Arms: exposed shoulders/elbows/wrists with gauntlets, rails, and claw tools. */}
        <JointOrb position={[-0.9, 1.78, 0.02]} scale={0.95} accent={seamPulse} />
        <JointOrb position={[0.9, 1.78, 0.02]} scale={0.95} accent={seamPulse} />
        <LimbCapsule position={[-1.08, 1.45, 0.02]} length={0.54} radius={0.105} rotation={[0.04, 0, -0.32]} color="#070d13" />
        <LimbCapsule position={[1.08, 1.45, 0.02]} length={0.54} radius={0.105} rotation={[0.04, 0, 0.32]} color="#070d13" />
        <HardPlate position={[-1.13, 1.46, 0.14]} scale={[0.24, 0.5, 0.22]} rotation={[0.05, 0, 0.22]} color="#1a2b3b" />
        <HardPlate position={[1.13, 1.46, 0.14]} scale={[0.24, 0.5, 0.22]} rotation={[0.05, 0, -0.22]} color="#1a2b3b" />
        <HardPlate position={[-1.2, 1.55, 0.34]} scale={[0.08, 0.36, 0.07]} rotation={[0.08, 0, 0.22]} color="#5d7488" />
        <HardPlate position={[1.2, 1.55, 0.34]} scale={[0.08, 0.36, 0.07]} rotation={[0.08, 0, -0.22]} color="#5d7488" />
        <JointOrb position={[-1.24, 1.12, 0.06]} scale={0.78} />
        <JointOrb position={[1.24, 1.12, 0.06]} scale={0.78} />
        <HardPlate position={[-1.36, 0.86, 0.18]} scale={[0.3, 0.52, 0.25]} rotation={[0.08, 0, 0.08]} color="#25384a" />
        <HardPlate position={[1.36, 0.86, 0.18]} scale={[0.3, 0.52, 0.25]} rotation={[0.08, 0, -0.08]} color="#25384a" />
        <RailSet side={-1} accent={seamPulse} />
        <RailSet side={1} accent={seamPulse} />
        <JointOrb position={[-1.42, 0.58, 0.16]} scale={0.58} />
        <JointOrb position={[1.42, 0.58, 0.16]} scale={0.58} />
        <ClawHand side={-1} accent={seamPulse} />
        <ClawHand side={1} accent={seamPulse} />

        {/* Longer mechanical legs with visible knees, shin armor, rails, and compact feet. */}
        <JointOrb position={[-0.36, 0.82, 0.02]} scale={0.82} />
        <JointOrb position={[0.36, 0.82, 0.02]} scale={0.82} />
        <LimbCapsule position={[-0.4, 0.46, 0.02]} length={0.62} radius={0.11} rotation={[0.02, 0, 0.08]} color="#070d13" />
        <LimbCapsule position={[0.4, 0.46, 0.02]} length={0.62} radius={0.11} rotation={[0.02, 0, -0.08]} color="#070d13" />
        <HardPlate position={[-0.43, 0.42, 0.16]} scale={[0.3, 0.62, 0.25]} rotation={[0.02, 0, 0.08]} color="#1a2b3b" />
        <HardPlate position={[0.43, 0.42, 0.16]} scale={[0.3, 0.62, 0.25]} rotation={[0.02, 0, -0.08]} color="#1a2b3b" />
        <HardPlate position={[-0.52, 0.46, 0.36]} scale={[0.08, 0.48, 0.07]} rotation={[0.02, 0, 0.08]} color="#657c90" />
        <HardPlate position={[0.52, 0.46, 0.36]} scale={[0.08, 0.48, 0.07]} rotation={[0.02, 0, -0.08]} color="#657c90" />
        <JointOrb position={[-0.43, 0.06, 0.08]} scale={0.72} accent={seamPulse} />
        <JointOrb position={[0.43, 0.06, 0.08]} scale={0.72} accent={seamPulse} />
        <LimbCapsule position={[-0.45, -0.32, 0.08]} length={0.64} radius={0.1} rotation={[0, 0, -0.03]} color="#070d13" />
        <LimbCapsule position={[0.45, -0.32, 0.08]} length={0.64} radius={0.1} rotation={[0, 0, 0.03]} color="#070d13" />
        <HardPlate position={[-0.48, -0.28, 0.22]} scale={[0.32, 0.64, 0.27]} rotation={[0.02, 0, -0.03]} color="#26384a" />
        <HardPlate position={[0.48, -0.28, 0.22]} scale={[0.32, 0.64, 0.27]} rotation={[0.02, 0, 0.03]} color="#26384a" />
        <HardPlate position={[-0.39, -0.34, 0.42]} scale={[0.08, 0.46, 0.06]} rotation={[0.02, 0, -0.03]} color="#5c7285" />
        <HardPlate position={[0.39, -0.34, 0.42]} scale={[0.08, 0.46, 0.06]} rotation={[0.02, 0, 0.03]} color="#5c7285" />
        <HardPlate position={[-0.48, -0.77, 0.36]} scale={[0.48, 0.14, 0.66]} rotation={[0, -0.06, 0]} color="#0f1924" />
        <HardPlate position={[0.48, -0.77, 0.36]} scale={[0.48, 0.14, 0.66]} rotation={[0, 0.06, 0]} color="#0f1924" />
        <HardPlate position={[-0.48, -0.82, 0.67]} scale={[0.32, 0.08, 0.22]} rotation={[0.05, -0.06, 0]} color="#53697c" />
        <HardPlate position={[0.48, -0.82, 0.67]} scale={[0.32, 0.08, 0.22]} rotation={[0.05, 0.06, 0]} color="#53697c" />

        <Piston position={[-0.72, 1.63, -0.05]} rotation={[0, 0, 0.7]} length={0.5} />
        <Piston position={[0.72, 1.63, -0.05]} rotation={[0, 0, -0.7]} length={0.5} />
        <Piston position={[-0.25, 0.62, -0.05]} rotation={[0, 0, 0.22]} length={0.5} />
        <Piston position={[0.25, 0.62, -0.05]} rotation={[0, 0, -0.22]} length={0.5} />
        <mesh position={[0, 2.73, 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <coneGeometry args={[0.055, 0.3, 4]} />
          <GlowMaterial color="#d08a3c" intensity={0.35} />
        </mesh>
      </group>
      <SocketMounts parts={parts} />
    </group>
  );
}
