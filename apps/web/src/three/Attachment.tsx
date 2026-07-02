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

  if (!asset.model) {
    return <FallbackModule slot={def.slot} accent={def.accent} index={index} />;
  }

  return (
    <Suspense fallback={<FallbackModule slot={def.slot} accent={def.accent} index={index} />}>
      <GlbAttachment model={asset.model} />
    </Suspense>
  );
}
