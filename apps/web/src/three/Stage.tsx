import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stars } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import { Mech } from './Mech';

export function Stage() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className="stage" aria-label="3D holographic robot assembly bay">
      <Canvas camera={{ position: [5, 4.2, 8], fov: 42 }} shadows gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.08 }}>
        <color attach="background" args={['#05080c']} />
        <fog attach="fog" args={['#05080c', 10, 23]} />
        <ambientLight intensity={0.28} />
        <hemisphereLight intensity={0.7} color="#2a5a78" groundColor="#030507" />
        <pointLight position={[-6, 7, 5]} intensity={60} color="#bfeaff" castShadow />
        <pointLight position={[7, 3, -5]} intensity={48} color="#ff9a4a" />
        <spotLight position={[0, 8, 0]} angle={0.35} penumbra={0.8} intensity={70} color="#3fd0ff" />
        <Stars radius={40} depth={18} count={900} factor={1.8} fade speed={0.4} />
        <Mech />
        <mesh rotation-x={-Math.PI / 2} position={[0, -1.05, 0]} receiveShadow>
          <ringGeometry args={[1.8, 2.05, 96]} />
          <meshStandardMaterial color="#3fd0ff" emissive="#3fd0ff" emissiveIntensity={1.4} transparent opacity={0.42} />
        </mesh>
        <Environment preset="city" />
        <OrbitControls autoRotate={!reduceMotion} autoRotateSpeed={0.55} enableDamping minDistance={4.8} maxDistance={13} target={[0, 1.4, 0]} />
      </Canvas>
      <div className="scanline" />
      <div className="stage-label"><span>ASSEMBLY BAY</span><b>Hologram live</b></div>
    </div>
  );
}
