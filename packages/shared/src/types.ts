export type TraitId =
  | 'authority'
  | 'agreeableness'
  | 'likeability'
  | 'humor'
  | 'verbosity'
  | 'caution';

export interface FeatureDef {
  id: string;
  name: string;
  slot: string;
  description: string;
  keywords: string[];
  embedding?: number[];
  model: string;
  accent: string;
  isStock: boolean;
}

export interface CustomFeature {
  featureId: string;
  userPhrase: string;
  score: number;
}

export interface AgentBlueprint {
  id: string;
  name: string;
  model: string;
  mission: string;
  coreSkills: string[];
  customFeatures: CustomFeature[];
  traits: Record<TraitId, number>;
  soul: string;
}

export const MAX_CORE = 3;
export const MAX_CUSTOM = 6;

export const DEFAULT_TRAITS: Record<TraitId, number> = {
  authority: 50,
  agreeableness: 50,
  likeability: 50,
  humor: 30,
  verbosity: 50,
  caution: 50,
};
