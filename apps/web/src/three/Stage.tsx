import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, Stars } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import { Mech } from './Mech';
import { Effects } from './Effects';

export function Stage() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className="stage" aria-label="3D holographic mech assembly bay">
      <Canvas style={{ position: 'absolute', inset: 0 }} camera={{ position: [4.45, 1.65, 6.45], fov: 39 }} shadows gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.18 }} onCreated={({ camera }) => camera.lookAt(0, 0.82, 0)}>
        <color attach="background" args={['#04070b']} />
        <fog attach="fog" args={['#04070b', 8, 20]} />
        <ambientLight intensity={0.18} />
        <hemisphereLight intensity={0.52} color="#2a5a78" groundColor="#020406" />
        <pointLight position={[-5, 6, 4]} intensity={80} color="#bfeaff" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[6, 2.8, -4]} intensity={58} color="#ff8b3d" />
        <spotLight position={[0, 7, 1.2]} angle={0.34} penumbra={0.78} intensity={88} color="#3fd0ff" castShadow />
        <Stars radius={42} depth={16} count={600} factor={1.3} fade speed={0.25} />
        <Mech />
        <mesh rotation-x={-Math.PI / 2} position={[0, -1.05, 0]} receiveShadow>
          <ringGeometry args={[1.85, 2.08, 128]} />
          <meshStandardMaterial color="#3fd0ff" emissive="#3fd0ff" emissiveIntensity={1.05} transparent opacity={0.36} metalness={0.2} roughness={0.18} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0, -1.035, 0]} receiveShadow>
          <circleGeometry args={[1.72, 96]} />
          <meshStandardMaterial color="#07131b" transparent opacity={0.34} metalness={0.6} roughness={0.4} />
        </mesh>
        <ContactShadows position={[0, -1.02, 0]} opacity={0.48} scale={5.2} blur={2.6} far={3.2} color="#000000" />
        <Environment preset="city" />
        <Effects />
        <OrbitControls autoRotate={!reduceMotion} autoRotateSpeed={0.45} enableDamping minDistance={4.4} maxDistance={12} target={[0, 0.82, 0]} />
      </Canvas>
      <div className="scanline" />
      <div className="stage-label"><span>ASSEMBLY BAY</span><b>Socket forge live</b></div>
    </div>
  );
}
