import { Suspense, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { FeatureDef } from '@agent-forge/shared';
import { resolveFeatureAsset } from './assets';
import { FallbackModule } from './FallbackModule';

function GlbAttachment({ model }: { model: string }) {
  const gltf = useGLTF(model);
  const scene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  return <primitive object={scene} />;
}

export function Attachment({ def, index = 0 }: { def: FeatureDef; index?: number }) {
  const asset = resolveFeatureAsset(def);
  const mount = asset.mount ?? { scale: 1, position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] };

  if (!asset.model) {
    return (
      <group position={mount.position ?? [0, 0, 0]} rotation={mount.rotation ?? [0, 0, 0]} scale={mount.scale ?? 1}>
        <FallbackModule slot={def.slot} accent={def.accent} index={index} />
      </group>
    );
  }

  return (
    <group position={mount.position ?? [0, 0, 0]} rotation={mount.rotation ?? [0, 0, 0]} scale={mount.scale ?? 1}>
      <Suspense fallback={<FallbackModule slot={def.slot} accent={def.accent} index={index} />}>
        <GlbAttachment model={asset.model} />
      </Suspense>
    </group>
  );
}
