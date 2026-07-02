import { useMemo } from 'react';
import { useForge } from '../store/forge';
import { catalogById } from '../data/catalog';
import { BASE_MECH_MANIFEST } from './assets';
import { GlbMech } from './GlbMech';
import { PrimitiveMech } from './PrimitiveMech';

export function Mech() {
  const selected = useForge((state) => state.blueprint.coreSkills);
  const parts = useMemo(() => selected.map((id) => catalogById[id]).filter(Boolean), [selected]);

  if (BASE_MECH_MANIFEST.model) {
    return <GlbMech model={BASE_MECH_MANIFEST.model} />;
  }

  return <PrimitiveMech parts={parts} />;
}
