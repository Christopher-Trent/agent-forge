import { useMemo, useState } from 'react';
import type { FeatureDef } from '@agent-forge/shared';
import { CATALOG } from '../data/catalog';
import { useForge } from '../store/forge';

function FeatureCard({ def, suggested }: { def: FeatureDef; suggested: boolean }) {
  const selected = useForge((state) => state.blueprint.coreSkills.includes(def.id));
  const toggleSkill = useForge((state) => state.toggleSkill);
  const [open, setOpen] = useState(false);
  return (
    <article className={`feature-card ${selected ? 'selected' : ''} ${suggested ? 'suggested' : ''}`}>
      <button className="feature-main" type="button" onClick={() => toggleSkill(def.id)} aria-pressed={selected}>
        <span className="feature-dot" style={{ background: def.accent, boxShadow: `0 0 18px ${def.accent}` }} />
        <span><b>{def.name}</b><em>{def.slot}</em></span>
      </button>
      <button className="feature-info" type="button" aria-label={`What ${def.name} does`} aria-expanded={open} onClick={() => setOpen((value) => !value)}>i</button>
      {open && <div className="feature-desc" tabIndex={0}><p>{def.description}</p><div>{def.keywords.join(' · ')}</div></div>}
    </article>
  );
}

export function Loadout() {
  const blueprint = useForge((state) => state.blueprint);
  const suggestedIds = useMemo(() => {
    const haystack = blueprint.mission.toLowerCase();
    return new Set(CATALOG.filter((def) => def.keywords.some((word) => haystack.includes(word.toLowerCase()))).map((def) => def.id));
  }, [blueprint.mission]);
  return (
    <section className="hud panel loadout-panel" aria-labelledby="loadout-title">
      <div className="panel-kicker">Loadout</div>
      <h2 id="loadout-title">Core skills <span>{blueprint.coreSkills.length}/3</span></h2>
      <p className="microcopy">Mission text highlights suggestions. Selection is always explicit.</p>
      <div className="feature-list">{CATALOG.map((def) => <FeatureCard key={def.id} def={def} suggested={suggestedIds.has(def.id)} />)}</div>
    </section>
  );
}
