# Agent Forge Phase 2 Build Brief

Owner: Chris / Atlas
Builder: Mustang
Design: Decks
Architecture: Sally
Copy: Scout
QA: Guardian

Repo: `/Users/chris_trent/Atlas/apps/agent-forge`
Live demo: `https://christopher-trent.github.io/agent-forge/`

## Mission

Phase 2 must make Agent Forge feel materially more premium and less Roblox-like. The user should feel like they are assembling an intelligent machine in a Tony Stark-style lab, not selecting parts on a toy robot.

## Asset rule

Chris approved free/curated GLB assets if licenses are acceptable.

- Prefer CC0, public domain, CC-BY with attribution, or permissive demo redistribution licenses.
- Paid assets require explicit Chris approval first.
- Avoid IP-infringing Iron Man/Transformer ripoffs, non-commercial-only, editorial-only, unknown-license, or non-redistributable assets.

## Required scope

### 1. Premium mech/rendering upgrade

Implement the strongest near-term visual improvement available without blocking on paid assets:

- Replace or strongly upgrade the primitive body so it no longer reads like Roblox/Lego.
- If a suitable free base GLB can be sourced quickly, add it under `apps/web/public/models/base/` and use it.
- If a production-suitable base GLB cannot be sourced quickly, upgrade the procedural fallback heavily:
  - adult heroic proportions
  - layered hard-surface armor plates
  - no obvious final anatomy made of simple spheres/capsules/boxes
  - dark gunmetal/graphite/black glass materials
  - emissive cyan/amber seams, optics, reactor
  - vents, pistons, cables, sockets/greebles where feasible
  - attachments look docked/bolted, not floating stickers

### 2. GLB/socket architecture

Preserve Phase 1 behavior and add Phase 2 architecture:

- Split current primitive implementation into fallback path if useful.
- Add/prepare:
  - `Attachment.tsx`
  - `FallbackModule.tsx`
  - `sockets.ts`
  - `assets.ts` or equivalent manifest helper
  - `Effects.tsx` for postprocessing
- Index named sockets dynamically when GLB exists.
- Required socket contract:
  - `socket_chest`
  - `socket_reactor`
  - `socket_head`
  - `socket_head_crown`
  - `socket_head_eyes`
  - `socket_back`
  - `socket_hip_L`
  - `socket_hand_R`
  - `socket_hand_L`
  - `socket_forearm_R`
  - `socket_forearm_L`
  - `socket_shoulder_R`
  - `socket_shoulder_L`
- Missing socket/model must warn and fallback; never crash the Canvas.

### 3. Rendering stack

- Install and use `@react-three/postprocessing` if compatible.
- Add Bloom + SSAO or equivalent.
- Keep ACES tone mapping.
- Use HDRI if present; otherwise keep an environment preset fallback.
- Add/contact shadows where safe.
- Preserve OrbitControls spin/zoom.

### 4. Copy polish from Scout

Apply high-impact copy changes:

- H1: `Describe the mission. Watch the machine assemble.`
- `Agent name` → `Callsign`
- `Model` → `Core mind`
- `Mission` → `Mission directive`
- `SOUL.md` → `SOUL.md — operating creed`
- `Live prompt preview` → `Core prompt telemetry`
- `Loadout` → `Armory`
- `Core skills` → `Prime systems`
- Loadout microcopy: `The forge scans your mission and lights up likely modules. You choose the three that define the machine.`
- `Trait sliders` → `Temperament matrix`
- `Persona directives` → `Behavioral spec`
- Toast: `Three prime systems max — remove one before installing another.`
- Page title: `Agent Forge — Describe the mission. Assemble the agent.`
- Hide raw socket IDs from visible UI; show friendly mount labels instead.

Preferred trait labels:
- `Command`
- `Cooperation`
- `Warmth`
- `Wit`
- `Depth`
- `Risk posture`

Preserve internal type IDs; only change user-facing labels.

### 5. Asset provenance

Create/update:

- `docs/ASSET_CREDITS.md`
- machine-readable asset manifest if any external GLBs/HDRIs are added

Include asset name, author, source URL, license, local path, modifications.

## Non-Roblox acceptance criteria

A screenshot passes only if:

- Silhouette is heroic, angular, mechanical, and adult-proportioned.
- No visible primitive toy anatomy dominates the robot.
- Armor has layered plates, seams, vents, sockets, cables, pistons, or greebles.
- Materials feel like PBR metal/ceramic/glass/rubber, not plastic blocks.
- Lighting has reflections, contact shadows/SSAO, controlled bloom.
- Attachments look physically mounted.
- UI and mech feel like one holographic lab system.

## Must preserve from Phase 1

- React/Vite/TypeScript app builds.
- GitHub Pages deploy remains live.
- 3 core skill cap.
- Skill info buttons remain separate from selection.
- Mission suggestions do not auto-select.
- Trait sliders update prompt preview live.
- Zustand/shared model boundaries remain intact.

## Verification required

Run:

```bash
pnpm install
pnpm --filter web typecheck
pnpm --filter web build
```

Then start local preview/dev server and verify HTTP 200.

If possible, capture a screenshot artifact locally. If browser automation is unavailable, report that clearly and include code/build proof.

Commit and push to `main`. Ensure GitHub Pages redeploys or `gh-pages` branch is refreshed if needed.

## Return format

Return only:

- files changed
- assets added + license/provenance
- commands run + pass/fail
- local URL
- live demo status
- commit SHA
- caveats/blockers
