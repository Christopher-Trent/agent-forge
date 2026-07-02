import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_TRAITS, MAX_CORE, type AgentBlueprint, type TraitId } from '@agent-forge/shared';

interface ForgeState {
  blueprint: AgentBlueprint;
  toast: string | null;
  setField: <K extends keyof AgentBlueprint>(key: K, value: AgentBlueprint[K]) => void;
  setTrait: (trait: TraitId, value: number) => void;
  toggleSkill: (id: string) => void;
  clearToast: () => void;
}

const initialBlueprint: AgentBlueprint = {
  id: crypto.randomUUID?.() ?? `forge-${Date.now()}`,
  name: 'Atlas Striker',
  model: 'gpt-4.1',
  mission: 'Build a decisive operator that researches opportunities, ships prototypes, and verifies every handoff.',
  coreSkills: ['routing-core', 'builder-gauntlet'],
  customFeatures: [],
  traits: DEFAULT_TRAITS,
  soul: 'SOUL.md\n- Protect momentum.\n- Be direct, useful, and evidence-backed.\n- Ask only when a real fork blocks action.',
};

export const useForge = create<ForgeState>()(
  persist(
    (set, get) => ({
      blueprint: initialBlueprint,
      toast: null,
      setField: (key, value) => set((state) => ({ blueprint: { ...state.blueprint, [key]: value } })),
      setTrait: (trait, value) => set((state) => ({ blueprint: { ...state.blueprint, traits: { ...state.blueprint.traits, [trait]: value } } })),
      toggleSkill: (id) => {
        const selected = get().blueprint.coreSkills;
        if (selected.includes(id)) {
          set((state) => ({ blueprint: { ...state.blueprint, coreSkills: selected.filter((skill) => skill !== id) } }));
          return;
        }
        if (selected.length >= MAX_CORE) {
          set({ toast: 'Three prime systems max — remove one before installing another.' });
          window.setTimeout(() => get().clearToast(), 2600);
          return;
        }
        set((state) => ({ blueprint: { ...state.blueprint, coreSkills: [...selected, id] } }));
      },
      clearToast: () => set({ toast: null }),
    }),
    { name: 'agent-forge-phase-1' },
  ),
);
