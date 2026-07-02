import { RoundedBox } from '@react-three/drei';

export function ArmorMaterial({ color = '#172433', emissive = '#010407', roughness = 0.28 }: { color?: string; emissive?: string; roughness?: number }) {
  return <meshStandardMaterial color={color} metalness={0.86} roughness={roughness} emissive={emissive} />;
}

export function JointMaterial() {
  return <meshStandardMaterial color="#05090d" metalness={0.72} roughness={0.46} />;
}

export function GlowMaterial({ color = '#3fd0ff', intensity = 1.4 }: { color?: string; intensity?: number }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} metalness={0.28} roughness={0.12} />;
}

export function RoundedArmorPlate({
  position,
  scale,
  rotation = [0, 0, 0],
  color = '#172433',
  radius = 0.075,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  radius?: number;
}) {
  return (
    <RoundedBox args={scale} radius={radius} smoothness={5} position={position} rotation={rotation} castShadow receiveShadow>
      <ArmorMaterial color={color} />
    </RoundedBox>
  );
}

export function JointOrb({ position, scale = 1, accent }: { position: [number, number, number]; scale?: number; accent?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.18, 24, 16]} />
        <JointMaterial />
      </mesh>
      {accent && (
        <mesh position={[0, 0, 0.025]}>
          <torusGeometry args={[0.155, 0.011, 8, 48]} />
          <GlowMaterial color={accent} intensity={0.7} />
        </mesh>
      )}
    </group>
  );
}

export function LimbCapsule({
  position,
  length,
  radius = 0.11,
  rotation = [0, 0, 0],
  color = '#0b1118',
}: {
  position: [number, number, number];
  length: number;
  radius?: number;
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.84, length, 24]} />
        <ArmorMaterial color={color} roughness={0.36} />
      </mesh>
      <mesh position={[0, length / 2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[radius, 24, 12]} />
        <ArmorMaterial color={color} roughness={0.36} />
      </mesh>
      <mesh position={[0, -length / 2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[radius * 0.86, 24, 12]} />
        <ArmorMaterial color={color} roughness={0.36} />
      </mesh>
    </group>
  );
}

export function GlowStrip({ position, scale, rotation = [0, 0, 0], color = '#3fd0ff', intensity = 1.25 }: { position: [number, number, number]; scale: [number, number, number]; rotation?: [number, number, number]; color?: string; intensity?: number }) {
  return (
    <RoundedBox args={scale} radius={0.012} smoothness={3} position={position} rotation={rotation} castShadow>
      <GlowMaterial color={color} intensity={intensity} />
    </RoundedBox>
  );
}

export function SocketCollar({ color = '#3fd0ff' }: { color?: string }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.18, 0.022, 10, 56]} />
        <meshStandardMaterial color="#071018" metalness={0.9} roughness={0.18} emissive={color} emissiveIntensity={0.12} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.115, 0.008, 8, 40]} />
        <GlowMaterial color={color} intensity={0.65} />
      </mesh>
    </group>
  );
}

export function ReactorRing({ color = '#3fd0ff', scale = 1 }: { color?: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh castShadow receiveShadow>
        <torusGeometry args={[0.21, 0.035, 16, 72]} />
        <meshStandardMaterial color="#071018" metalness={0.92} roughness={0.16} emissive={color} emissiveIntensity={0.28} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.11, 32, 16]} />
        <GlowMaterial color={color} intensity={2.0} />
      </mesh>
    </group>
  );
}
