import type { FeatureDef } from '@agent-forge/shared';

export interface AssetManifest {
  id: string;
  kind: 'base' | 'part' | 'fallback';
  version: number;
  model: string | null;
  defaultSocket?: string;
  compatibleSockets?: string[];
  mount?: {
    scale?: number;
    position?: [number, number, number];
    rotation?: [number, number, number];
  };
  licenseId?: string;
}

export const BASE_MECH_MANIFEST: AssetManifest = {
  id: 'procedural-premium-mech-v1',
  kind: 'base',
  version: 1,
  model: null,
  licenseId: 'agent-forge-procedural-code-2026-07-02',
};

export const FALLBACK_MODULE_MANIFEST: AssetManifest = {
  id: 'procedural-forged-module-v1',
  kind: 'fallback',
  version: 1,
  model: null,
  mount: { scale: 1, position: [0, 0, 0], rotation: [0, 0, 0] },
  licenseId: 'agent-forge-procedural-code-2026-07-02',
};

export function resolveFeatureAsset(def: FeatureDef): AssetManifest {
  const hasRuntimeModel = Boolean(def.model && !def.model.includes('fallback'));
  return {
    id: def.id,
    kind: 'part',
    version: 1,
    model: hasRuntimeModel ? def.model : null,
    defaultSocket: def.slot,
    compatibleSockets: [def.slot],
    mount: { scale: 1, position: [0, 0, 0], rotation: [0, 0, 0] },
    licenseId: hasRuntimeModel ? undefined : FALLBACK_MODULE_MANIFEST.licenseId,
  };
}

export function preloadAssetManifests(features: FeatureDef[]) {
  return features.map(resolveFeatureAsset).filter((asset) => asset.model);
}
