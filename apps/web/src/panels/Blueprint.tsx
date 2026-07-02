import { useMemo } from 'react';
import { useForge } from '../store/forge';
import { buildSystemPrompt } from '../lib/prompt';

export function Blueprint() {
  const { blueprint, setField } = useForge();
  const prompt = useMemo(() => buildSystemPrompt(blueprint), [blueprint]);
  return (
    <section className="hud panel blueprint-panel" aria-labelledby="blueprint-title">
      <div className="panel-kicker">Blueprint</div>
      <h1 id="blueprint-title">Describe the mission. Watch the machine assemble.</h1>
      <label>Callsign<input value={blueprint.name} onChange={(event) => setField('name', event.target.value)} /></label>
      <label>Core mind<select value={blueprint.model} onChange={(event) => setField('model', event.target.value)}><option>gpt-4.1</option><option>gpt-4.1-mini</option><option>llama3.1</option><option>qwen2.5-coder</option></select></label>
      <label>Mission directive<textarea value={blueprint.mission} onChange={(event) => setField('mission', event.target.value)} rows={6} /></label>
      <label>SOUL.md — operating creed<textarea value={blueprint.soul} onChange={(event) => setField('soul', event.target.value)} rows={5} /></label>
      <div className="prompt-preview" tabIndex={0} aria-label="Core prompt telemetry"><strong>Core prompt telemetry</strong><pre>{prompt}</pre></div>
    </section>
  );
}
