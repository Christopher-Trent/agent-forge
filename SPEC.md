# Agent Forge — Build Specification

**Owner:** Chris
**Implementer:** Hermes (autonomous coding agent)
**Status:** Ready to build — Phase 1 first
**Last updated:** 2026-07-02

---

## 0. How to use this document

This is the single source of truth for building **Agent Forge**. Implement it in the order given in **Section 9 (Build Phases)**. Each feature section below lists **requirements**, **acceptance criteria**, and **reference code**. Reference code shows intent and structure — you may refactor for quality, but do not change the described behavior without flagging it. When a decision is marked **[DECISION NEEDED]**, stop and ask Chris before proceeding.

There is a working single-file HTML prototype (`agent-forge.html`) that already implements the core idea: a description box drives a live 3D robot that gains parts as skills are detected. Treat that prototype as the **look-and-interaction reference**. This spec ports it to a real stack and adds five new capabilities.

---

## 1. Product vision

A design studio where a user builds an AI agent by describing what it should do, and watches it assemble into a highly detailed 3D robot (Iron-Man-suit / movie-Transformer fidelity) they can spin like a hologram. The feeling to hit: **Tony Stark in his lab.** The user should feel they are *forging* an agent, not filling out a form.

Core loop:
1. Name the agent and describe its mission.
2. Pick up to **3 core skills** (the targeted purpose).
3. Add **custom features** by describing them in their own words — matched to a large catalog and rendered as unique parts.
4. Tune **character traits** with sliders.
5. **Chat** with the finished agent, in character.
6. Save the blueprint.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | **React + Vite + TypeScript** | Fast dev, typed blueprint model |
| 3D | **react-three-fiber** + **@react-three/drei** | Declarative Three.js, GLB loading, `<Environment/>`, `<OrbitControls/>` |
| Post-processing | **@react-three/postprocessing** | Bloom + SSAO + tone mapping — the "not Roblox" upgrade |
| State | **Zustand** | Simple global store for the blueprint |
| Backend | **Node + Express + TypeScript** | Chat proxy, embedding match, save/load |
| Local models | **Ollama** (chat + embeddings) | Runs on Chris's Mac mini home server |
| Vector match | In-memory cosine (Phase 4); sqlite-vec if it grows | 1,000 features fits in memory |

Keep frontend and backend as separate apps in one monorepo. No framework churn mid-build.

---

## 3. Repository structure

```
agent-forge/
├── apps/
│   ├── web/                          # React + Vite + r3f frontend
│   │   ├── public/
│   │   │   ├── models/               # base_mech.glb + feature GLBs
│   │   │   └── hdri/studio.hdr
│   │   └── src/
│   │       ├── store/forge.ts        # Zustand store (blueprint state)
│   │       ├── three/
│   │       │   ├── Stage.tsx         # Canvas, lights, env, postprocessing
│   │       │   ├── Mech.tsx          # base mech + socket indexing
│   │       │   ├── Attachment.tsx    # mounts a feature GLB to a socket
│   │       │   └── Effects.tsx       # bloom / SSAO
│   │       ├── panels/
│   │       │   ├── Blueprint.tsx     # name, model, mission, SOUL.md
│   │       │   ├── Loadout.tsx       # right panel: skill cards
│   │       │   ├── CustomFeature.tsx # describe-your-own-skill input
│   │       │   ├── Traits.tsx        # character sliders
│   │       │   └── Chat.tsx          # chat with the agent
│   │       ├── lib/
│   │       │   ├── prompt.ts         # blueprint -> system prompt
│   │       │   └── api.ts            # fetch wrappers for the server
│   │       └── data/catalog.ts       # feature definitions (stock skills)
│   └── server/                       # Express backend
│       ├── src/
│       │   ├── index.ts              # app bootstrap + routes
│       │   ├── chat.ts               # /api/chat  (Ollama proxy, streaming)
│       │   ├── match.ts              # /api/match-feature (embedding search)
│       │   └── embed.ts              # embedding helper
│       └── data/features.embedded.json
├── packages/
│   └── shared/                       # types shared by web + server
│       └── src/types.ts
├── scripts/
│   └── build-embeddings.ts           # one-time: embed the feature catalog
└── SPEC.md                           # this file
```

---

## 4. Shared data model

Put this in `packages/shared/src/types.ts`. Everything else references it.

```ts
export type TraitId =
  | 'authority' | 'agreeableness' | 'likeability'
  | 'humor' | 'verbosity' | 'caution';

export interface FeatureDef {
  id: string;
  name: string;
  slot: string;          // socket name on the base mech, e.g. "socket_shoulder_L"
  description: string;    // shown when the card's info button is clicked
  keywords: string[];     // used for suggestion + embedding text
  embedding?: number[];   // filled by scripts/build-embeddings.ts
  model: string;          // path to the feature GLB
  accent: string;         // hex glow color, e.g. "#3fd0ff"
  isStock: boolean;       // true = appears in right-hand Loadout panel
}

export interface CustomFeature {
  featureId: string;      // matched catalog feature
  userPhrase: string;     // what the user typed
  score: number;          // cosine similarity 0–1
}

export interface AgentBlueprint {
  id: string;
  name: string;
  model: string;          // LLM model string, e.g. "gpt-4.1"
  mission: string;        // the description textarea
  coreSkills: string[];   // MAX 3 stock feature ids — the targeted purpose
  customFeatures: CustomFeature[]; // secondary/flair, cap 6
  traits: Record<TraitId, number>; // each 0–100, default 50
  soul: string;           // SOUL.md text
}

export const MAX_CORE = 3;
export const MAX_CUSTOM = 6;
export const DEFAULT_TRAITS: Record<TraitId, number> = {
  authority: 50, agreeableness: 50, likeability: 50,
  humor: 30, verbosity: 50, caution: 50,
};
```

---

## 5. Feature requirements

### Feature 1 — Click a skill card → description

**Requirements**
- Each card in the right-hand Loadout panel has two affordances: (a) the main body toggles the skill on/off; (b) a small **info** button reveals a description of what that skill does, plus its keywords.
- Reading the description must be a **separate action** from selecting the skill (clicking "info" never selects).
- The description text comes from `FeatureDef.description`.

**Acceptance criteria**
- Clicking info on a card expands its description without changing selection state.
- Clicking the card body toggles selection (subject to the 3-cap in Feature 2).
- Keyboard accessible: info button has an `aria-label`; expandable region is reachable by tab.

**Reference code**
```tsx
function FeatureCard({ def }: { def: FeatureDef }) {
  const { coreSkills, toggleSkill } = useForge();
  const [open, setOpen] = useState(false);
  const on = coreSkills.includes(def.id);
  return (
    <div className={cx('card', { on })}>
      <button className="card-main" onClick={() => toggleSkill(def.id)}>
        <span className="dot" style={{ color: def.accent }} /> {def.name}
        <em>{def.slot}</em>
      </button>
      <button className="card-info" aria-label={`What ${def.name} does`}
              onClick={() => setOpen(o => !o)}>i</button>
      {open && (
        <div className="card-desc">
          <p>{def.description}</p>
          <div className="tags">{def.keywords.join(' · ')}</div>
        </div>
      )}
    </div>
  );
}
```

---

### Feature 2 — Cap core skills at 3

**Requirements**
- No more than **3 core skills** may be selected. A 4th attempt is **refused with a clear message** ("Max 3 core skills — remove one first"), not silently dropped.
- **Two separate buckets:**
  - *Core skills* (max 3) = the agent's targeted purpose. They drive the main loadout and get top priority in the system prompt.
  - *Custom features* (max 6, from Feature 5) = secondary/flair. They add parts and personality but never dilute the core purpose.
- The description box's keyword auto-detect (from the prototype) is demoted to a **suggester**: it highlights recommended cards, but the user still explicitly picks their 3.

**Acceptance criteria**
- Selecting a 4th core skill shows a toast and does not change selection.
- Deselecting frees a slot.
- Suggested cards are visually marked but not auto-selected.

**Reference code**
```ts
export const useForge = create<ForgeState>((set, get) => ({
  coreSkills: [],
  toggleSkill: (id: string) => {
    const s = get().coreSkills;
    if (s.includes(id)) return set({ coreSkills: s.filter(x => x !== id) });
    if (s.length >= MAX_CORE) return toast(`Max ${MAX_CORE} core skills — remove one first.`);
    set({ coreSkills: [...s, id] });
  },
}));
```

---

### Feature 3 — Real Iron-Man / Transformer detail

**This is an asset problem, not a code problem.** Primitive geometry (boxes/cylinders) caps at "detailed Lego." Reaching movie fidelity requires four things:

1. **Modular GLB models, not primitives.** One rigged `base_mech.glb` whose skeleton contains empty **socket nodes** named consistently (`socket_head_crown`, `socket_head_eyes`, `socket_shoulder_L`, `socket_shoulder_R`, `socket_hand_L`, `socket_hand_R`, `socket_back`, `socket_chest`, …). Each feature is its own small GLB that parents onto the matching socket. This is also what makes "hundreds of features" scale.
2. **PBR materials with normal maps** — panel lines, scratches, brushed metal. This is ~80% of "real suit" vs "toy."
3. **Post-processing:** Bloom (the glow, done properly), SSAO (shadow in the crevices = perceived detail), ACES tone mapping.
4. **Image-based lighting:** an HDRI via drei `<Environment/>` so metal reflects a real studio.

**Asset strategy — [DECISION NEEDED from Chris]**
- **Option A — Buy/curate:** download ready-made `.glb` files from marketplaces (Sketchfab, CGTrader, KitBash3D) plus Quixel material maps. Some free, some ~$10–50 each. Fastest path to "wow."
- **Option B — Generate:** use text-to-3D (Meshy, Tripo, Luma Genie) to produce parts from descriptions. Rougher and slower, but on-brand — and the same tech can later power Feature 5's on-the-fly part generation.
- **Fallback module (build regardless):** one generic `forged_module.glb` that recolors/rescales for any feature lacking a bespoke model, so the catalog never renders a hole.

**Recommended for the demo:** one strong base mech + ~20 hero part GLBs + the fallback module.

**Acceptance criteria**
- Base mech loads with named sockets discoverable at runtime.
- Adding/removing a feature parents/unparents its GLB on the correct socket with a scale-in + emissive-flash "forge" animation.
- Bloom, SSAO, ACES, and HDRI environment are all active.
- The scene reads clearly as "premium suit," not blocky primitives.

**Reference code**
```tsx
// Mech.tsx
function Mech() {
  const { scene } = useGLTF('/models/base_mech.glb');
  const sockets = useMemo(() => indexSockets(scene), [scene]); // name -> Object3D
  const parts = useForge(s => s.activeParts);                  // core + custom features
  return (
    <group>
      <primitive object={scene} />
      {parts.map(p => (
        <Attachment key={p.id} def={p} socket={sockets[p.slot]} />
      ))}
    </group>
  );
}

function indexSockets(root: Object3D): Record<string, Object3D> {
  const map: Record<string, Object3D> = {};
  root.traverse(o => { if (o.name.startsWith('socket_')) map[o.name] = o; });
  return map;
}

// Attachment.tsx
function Attachment({ def, socket }: { def: FeatureDef; socket?: Object3D }) {
  const { scene } = useGLTF(def.model);
  const inst = useMemo(() => clone(scene), [scene]); // SkeletonUtils.clone
  useForgeInAnimation(inst, def.accent);             // scale 0->1 + emissive flash
  useEffect(() => {
    if (!socket) return;
    socket.add(inst);
    return () => { socket.remove(inst); };
  }, [socket, inst]);
  return null;
}
```
```tsx
// Stage.tsx
<Canvas shadows gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}>
  <color attach="background" args={['#070a0f']} />
  <Environment files="/hdri/studio.hdr" />
  <hemisphereLight intensity={0.5} color="#2a5a78" groundColor="#05080c" />
  <pointLight position={[-7, 9, 7]} intensity={1.4} color="#bfeaff" />
  <pointLight position={[7, 3, -6]} intensity={1.7} color="#ff9a4a" />
  <Mech />
  <OrbitControls autoRotate autoRotateSpeed={0.6} enableDamping
                 minDistance={6} maxDistance={18} target={[0, 2.7, 0]} />
  <EffectComposer>
    <SSAO />
    <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.6} />
  </EffectComposer>
</Canvas>
```

---

### Feature 4 — Chat with the robot

**Requirements**
- A chat panel where the user talks to the agent and it answers **in character**, derived from its blueprint (mission + soul + traits + core skills).
- When the agent speaks, the robot **visibly reacts**: optic pulse, reactor intensity spike, slight head-turn, for the duration of the streamed response.
- Streaming responses (token-by-token) required.
- Optional: Web Speech API voice output (stretch).

**Acceptance criteria**
- The system prompt is assembled from the current blueprint at send time (so trait/skill changes take effect immediately).
- Responses stream into the panel.
- The mech animation state toggles to `speaking` while streaming and back to `idle` after.

**Reference code**
```ts
// lib/prompt.ts
export function buildSystemPrompt(bp: AgentBlueprint): string {
  const skills = bp.coreSkills.map(id => CATALOG[id]?.name).filter(Boolean).join(', ');
  return [
    `You are ${bp.name}, an AI agent. Mission: ${bp.mission}`,
    `Core capabilities: ${skills}.`,
    `Persona directives: ${traitsToTone(bp.traits)}`,
    bp.soul,
  ].join('\n');
}
```
```ts
// server/chat.ts — proxy + stream from Ollama (swap base URL for OpenAI if needed)
app.post('/api/chat', async (req, res) => {
  const { messages, blueprint } = req.body;
  const upstream = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      model: blueprint.model,
      stream: true,
      messages: [
        { role: 'system', content: buildSystemPrompt(blueprint) },
        ...messages,
      ],
    }),
  });
  res.setHeader('Content-Type', 'text/event-stream');
  upstream.body.pipe(res); // forward tokens as SSE
});
```
On send from the client: dispatch `mech.setState('speaking')`, then `mech.setState('idle')` when the stream closes.

---

### Feature 5 — Custom feature via embedding match

The "I built this myself" moment. The user describes a skill in their own words; the backend finds the closest match in a large catalog and renders it as a **unique** part (distinct from the stock right-panel set).

**Requirements**
- Input box: user types a skill description.
- Backend embeds the phrase, runs cosine similarity against a **~1,000-feature catalog**, returns the **top 3** matches with similarity scores.
- User picks one (or the top match auto-applies); the chosen feature's GLB renders at its socket and is stored as a `CustomFeature` (separate from core skills).
- Showing top-3 with scores makes it feel like **discovery**, not a dropdown.
- Custom features respect `MAX_CUSTOM` (6).

**Acceptance criteria**
- Typing a novel phrase returns 3 ranked matches with scores.
- Selecting one renders a part not present in the stock loadout.
- The custom feature persists in the blueprint and can be removed.

**Reference code**
```ts
// scripts/build-embeddings.ts — run once to precompute catalog embeddings
import { readFileSync, writeFileSync } from 'fs';
const features = JSON.parse(readFileSync('apps/server/data/features.json', 'utf8'));
for (const f of features) {
  f.embedding = await embed(`${f.name}. ${f.description}. ${f.keywords.join(', ')}`);
}
writeFileSync('apps/server/data/features.embedded.json', JSON.stringify(features));
```
```ts
// server/embed.ts
export async function embed(text: string): Promise<number[]> {
  const r = await fetch('http://localhost:11434/api/embeddings', {
    method: 'POST',
    body: JSON.stringify({ model: 'nomic-embed-text', prompt: text }),
  });
  return (await r.json()).embedding;
}
```
```ts
// server/match.ts
const cosine = (a: number[], b: number[]) => {
  let d = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { d += a[i]*b[i]; na += a[i]**2; nb += b[i]**2; }
  return d / Math.sqrt(na * nb);
};

app.post('/api/match-feature', async (req, res) => {
  const q = await embed(req.body.phrase);
  const top = CATALOG
    .map(f => ({ id: f.id, name: f.name, slot: f.slot, model: f.model, score: cosine(q, f.embedding!) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  res.json({ top });
});
```

**Scale note:** in-memory cosine is fine at 1,000. If the catalog grows large, move to `sqlite-vec` / `pgvector` / Chroma behind the same `/api/match-feature` interface.

**Stretch (Phase 5):** if the best match is below a similarity threshold, generate a bespoke GLB on the fly (Meshy/Tripo) instead of returning a catalog part. This is the true "you built it" endgame.

---

### Feature 6 — Character trait sliders → prompt

**Requirements**
- A panel of **0–100 sliders**: Authoritative, Agreeable, Likeable, Playful (humor), Verbose, Cautious.
- Moving a slider **rewrites the system prompt live** — the user never edits prompt text directly.
- Show a small live preview of the resulting persona directives (optional but recommended).
- Optional: each trait subtly nudges the robot (authority → bulkier pauldrons; humor → warmer accent color).

**Acceptance criteria**
- Each slider is 0–100, defaults to `DEFAULT_TRAITS`.
- Changing a slider updates `blueprint.traits` and the assembled system prompt.
- The chat in Feature 4 reflects trait changes on the next message.

**Reference code**
```ts
// lib/prompt.ts
const band = (v: number) => (v < 33 ? 0 : v < 67 ? 1 : 2);

export function traitsToTone(t: Record<TraitId, number>): string {
  const M: Record<TraitId, [string, string, string]> = {
    authority:     ['Defer to the user; ask before asserting.',
                    'Offer clear recommendations, stay open.',
                    'Lead decisively; state conclusions with conviction.'],
    agreeableness: ['Challenge weak reasoning directly.',
                    'Balance agreement with honest pushback.',
                    'Be accommodating and supportive.'],
    likeability:   ['Keep it blunt and businesslike.',
                    'Be personable but efficient.',
                    'Be warm, encouraging, and personable.'],
    humor:         ['Stay serious and focused.',
                    'Allow occasional light humor.',
                    'Be witty and playful.'],
    verbosity:     ['Answer in as few words as possible.',
                    'Give moderate detail.',
                    'Explain thoroughly with examples.'],
    caution:       ['Be bold; act on best judgment.',
                    'Flag real risks, then proceed.',
                    'Be careful; caveat and verify before acting.'],
  };
  return (Object.keys(M) as TraitId[]).map(k => M[k][band(t[k])]).join(' ');
}
```

---

## 6. API surface (backend)

| Method | Route | Body | Returns |
|---|---|---|---|
| POST | `/api/chat` | `{ messages, blueprint }` | SSE token stream |
| POST | `/api/match-feature` | `{ phrase }` | `{ top: [{ id, name, slot, model, score }] }` |
| POST | `/api/blueprint` | `AgentBlueprint` | `{ id }` (save) |
| GET | `/api/blueprint/:id` | — | `AgentBlueprint` (load) |

Save/load can start as JSON files on disk; upgrade to SQLite later.

---

## 7. Feature catalog

- **Stock catalog** (`apps/web/src/data/catalog.ts`): ~14 features that appear in the right-hand Loadout panel, ported from the prototype (Routing Core, Monocle Lens, Oracle Crown, Recon Visor, Signal Antenna, Archive Satchel, Laser Pointer Arm, Battleaxe Arm, Builder Gauntlet, Research Grappler, Guardian Reactor, Creative Furnace, Market Radar, Calendar Cannon). Each needs a `description`, `slot`, `model`, `accent`, `isStock: true`.
- **Full catalog** (`apps/server/data/features.json`): the ~1,000-feature set for Feature 5. Each entry needs `name`, `description`, `keywords`, `slot`, `model`, `accent`. Generate embeddings with `scripts/build-embeddings.ts`. Many will share the fallback GLB until bespoke models exist. **[DECISION NEEDED: who authors the 1,000-feature list — hand-write a seed of ~100 and generate the rest, or source externally?]**

---

## 8. Visual system (carry over from the prototype)

- **Palette:** void `#070a0f`, panel `#0d1620`, holo-cyan `#3fd0ff`, arc-amber `#ff7a18`, text `#e8f4fb`, muted `#5b7689`.
- **Type:** display *Chakra Petch*, body *Space Grotesk*, mono/data *JetBrains Mono*.
- **Layout:** full-bleed 3D canvas with floating glass HUD panels — Blueprint (left), Assembly Bay (center, the robot), Loadout (right), plus Chat and Traits panels. Corner brackets on panels.
- **Signature:** parts forge onto the suit in real time with a scale-in + emissive flash; reactor pulses; scan plane sweeps the body.
- **Quality floor:** responsive to mobile (panels become bottom sheets), visible keyboard focus, `prefers-reduced-motion` disables auto-rotate and scan.

---

## 9. Build phases

Build in this order. Each phase should be a working, demoable milestone.

1. **Phase 1 — Frontend port.** r3f + the current primitive mech, 3-core-skill cap (Feature 2), click-to-describe cards (Feature 1), trait sliders with live prompt preview (Feature 6). No backend yet. Ships the interaction model.
2. **Phase 2 — Real look (Feature 3).** Base GLB + sockets + ~20 hero part GLBs + fallback module + HDRI + Bloom/SSAO. This is the "less Roblox" milestone. Depends on the **[asset decision]**.
3. **Phase 3 — Chat (Feature 4).** Ollama proxy + streaming + robot reaction animation.
4. **Phase 4 — Custom-feature matcher (Feature 5).** 1,000-feature catalog + embeddings + top-3 UI.
5. **Phase 5 — Stretch.** On-the-fly part generation for unmatched features; voice output; blueprint save/load persistence upgrade.

---

## 10. Setup (target)

```bash
# prerequisites: Node 20+, pnpm, Ollama running on the Mac mini
pnpm install
ollama pull nomic-embed-text          # for Feature 5 embeddings

# one-time: embed the catalog (after features.json exists)
pnpm tsx scripts/build-embeddings.ts

# dev
pnpm --filter server dev              # http://localhost:8787
pnpm --filter web dev                 # http://localhost:5173
```

Environment variables (`.env`): `OLLAMA_URL` (default `http://localhost:11434`), `PORT` for the server, and an optional `OPENAI_API_KEY` if swapping chat/embeddings off local models.

---

## 11. Open decisions (ask Chris before these block you)

1. **3D assets:** buy/curate GLBs (Option A) or generate them (Option B)? Affects Phase 2.
2. **1,000-feature catalog authorship:** seed ~100 by hand + generate the rest, or source externally?
3. **Chat backend:** local Ollama only, or also support OpenAI/hosted as a fallback?
4. **Persistence:** JSON-on-disk for the demo, or stand up SQLite now?

Everything else in this spec is settled — proceed.
