import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import type { FeatureDef } from '@agent-forge/shared';
import type { Group } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { Attachment } from './Attachment';
import { fallbackSocketSpecs, indexSockets, validateSockets } from './sockets';

export function GlbMech({ model, parts }: { model: string; parts: FeatureDef[] }) {
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
      {parts.map((part, index) => {
        const spec = fallbackSocketSpecs[part.slot] ?? fallbackSocketSpecs.socket_chest;
        const node = sockets.get(part.slot);
        const position = node ? [node.position.x, node.position.y, node.position.z] as [number, number, number] : spec.position;
        const rotation = node ? [node.rotation.x, node.rotation.y, node.rotation.z] as [number, number, number] : spec.rotation ?? [0, 0, 0] as [number, number, number];
        return (
          <group key={part.id} name={`${part.slot}_glb_mount_${part.id}`} position={position} rotation={rotation} scale={spec.scale ?? 1}>
            <Attachment def={part} index={index} />
          </group>
        );
      })}
    </group>
  );
}
