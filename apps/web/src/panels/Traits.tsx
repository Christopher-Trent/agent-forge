import type { TraitId } from '@agent-forge/shared';
import { useForge } from '../store/forge';
import { traitsToTone } from '../lib/prompt';

const traits: Array<[TraitId, string]> = [
  ['authority', 'Command'], ['agreeableness', 'Cooperation'], ['likeability', 'Warmth'], ['humor', 'Wit'], ['verbosity', 'Depth'], ['caution', 'Risk posture'],
];

export function Traits() {
  const blueprint = useForge((state) => state.blueprint);
  const setTrait = useForge((state) => state.setTrait);
  return (
    <section className="hud panel traits-panel" aria-labelledby="traits-title">
      <div className="panel-kicker">Persona alloy</div>
      <h2 id="traits-title">Temperament matrix</h2>
      {traits.map(([id, label]) => (
        <label className="trait-row" key={id}>{label}<span>{blueprint.traits[id]}</span><input type="range" min="0" max="100" value={blueprint.traits[id]} onChange={(event) => setTrait(id, Number(event.target.value))} /></label>
      ))}
      <div className="tone-preview"><strong>Behavioral spec</strong><p>{traitsToTone(blueprint.traits)}</p></div>
    </section>
  );
}
