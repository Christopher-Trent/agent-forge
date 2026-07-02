import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import type { Group } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { indexSockets, validateSockets } from './sockets';

export function GlbMech({ model }: { model: string }) {
  const group = useRef<Group>(null);
  const gltf = useGLTF(model);
  const scene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const sockets = useMemo(() => indexSockets(scene), [scene]);

  useEffect(() => {
    const missing = validateSockets(sockets);
    if (missing.length) console.warn(`[Agent Forge] Base GLB missing sockets: ${missing.join(', ')}`);
  }, [sockets]);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.035;
  });

  return (
    <group ref={group} position={[0, -0.28, 0]}>
      <primitive object={scene} />
    </group>
  );
}
