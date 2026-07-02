# Agent Forge Phase 2 Rework 2 — Real Anti-Toy Pass

Owner: Atlas / Chris
Builder: Mustang
QA: Guardian
Design standard: Decks

Repo: `/Users/chris_trent/Atlas/apps/agent-forge`
Current commit: `02761a6`
Current screenshot: `artifacts/phase2-rework-home.png`
Deployment: **paused**. Do not work on GitHub Pages. Focus only on design, code, and copy.

## Current verdict

The latest procedural rework is improved, but still not accepted for Phase 2.

Strongest improvements:
- Better lighting/material depth than prior version.
- More rounded surfaces than the first box stack.
- Better copy/mission language is now in place.
- Socket/attachment architecture is moving in the right direction.

Still blocking:
- Head still reads like a toy cube/rounded TV block.
- Shoulder/arm forms are rounded, but still feel like simple toy capsules.
- Hands/tools remain simplified and toy-like.
- Torso/chest has some plating but still lacks true hard-surface mech detail.
- Legs are partly cropped/weak, so silhouette still does not sell premium mech.
- Overall still reads as a stylized toy robot, not a Tony-Stark/Transformer-grade constructible agent suit.

## Mission

Make the central robot materially less toy-like in the screenshot. This pass should prioritize **silhouette and hero asset credibility** over adding more UI.

## Primary path: use a real free/curated mech asset if practical

Chris approved free/curated GLB/gltf assets if licenses are acceptable. Paid assets remain disallowed without approval.

First candidate:
- Quaternius Animated Mech Pack
- URL: https://quaternius.com/packs/animatedmech.html
- License: CC0 / Public Domain
- Formats include glTF

If downloadable in this environment without account friction, use it as the base mech or as a strong base reference:
- place under `apps/web/public/models/base/` or `apps/web/public/models/parts/`
- record provenance in `docs/ASSET_CREDITS.md`, `apps/web/public/licenses/ASSET_CREDITS.md`, and/or `assets.lock.json`
- convert/package to GLB only if straightforward
- do not spend more than a bounded amount of time fighting asset download/format issues

Fallback if asset sourcing is not practical: continue procedural rework, but it must push much further than `02761a6`.

## Required visual changes if staying procedural

### 1. Head / helmet
Replace the rounded cube head with a helmet assembly:
- smaller head, nested into neck
- sloped brow
- recessed visor slit, not a bar stuck on front
- cheek/jaw armor
- side sensor pods or antenna mounts
- no large flat rectangular face panels

### 2. Shoulders / arms
Replace toy capsule arms with hard-surface mech arms:
- separate angular pauldrons
- upper/lower arm armor shells over dark joint skeleton
- visible elbow pivots
- forearm gauntlets with rails/tools
- hands/claws/tool prongs, not capsule nubs

### 3. Chest / torso
Make the chest the premium focal point:
- V-shaped layered armor
- recessed reactor cavity
- overlapping panels, vents, seams
- narrower waist and stronger chest-to-waist taper
- no single dominant flat plate

### 4. Legs / full silhouette
Ensure the screenshot shows enough legs to read heroic proportions:
- longer mechanical legs
- knee joints and shin armor
- smaller/more detailed feet
- camera pulled back or target adjusted so full silhouette reads

### 5. Materials
Increase material hierarchy:
- dark inner skeleton/rubber joints
- satin gunmetal armor
- edge highlights/secondary armor tone
- emissive cyan seams and small amber accents only

## Do not spend time on

- GitHub Pages/deployment
- backend/chat/embeddings
- paid assets
- large catalog expansion
- unrelated copy passes beyond fixing visible text if needed

## Verification

Run:

```bash
pnpm --filter web typecheck
pnpm --filter web build
pnpm --filter web preview --host 0.0.0.0
```

Capture new screenshot:

`artifacts/phase2-rework2-home.png`

Commit and push to `main`.

## Acceptance

Phase 2 still blocks if the screenshot reads as:
- Roblox
- toy capsules
- blocky TV-head robot
- simple rounded primitive mascot

Phase 2 can move forward if screenshot reads as:
- premium mech/suit
- hard-surface robot
- forged agent body
- convincing enough bridge toward future GLB hero assets

## Return format

Return only:
- files changed
- external assets added + license/provenance, if any
- verification pass/fail
- screenshot path
- commit SHA
- caveats/blockers
