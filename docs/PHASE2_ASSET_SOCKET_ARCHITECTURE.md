# Agent Forge Phase 2 Asset + Socket Architecture Gate

Owner: Sally  
Scope: Phase 2 real-look 3D architecture that keeps the Phase 1 primitive demo stable while enabling curated/free GLB assets now and a stronger generated/bespoke 3D pipeline later.

## Architecture decision

Proceed with a **hybrid curated-first pipeline**:

1. **Now / Phase 2 demo:** free or curated GLB assets with acceptable licenses, plus one local procedural/placeholder fallback module. Paid assets require Chris's explicit approval per item before purchase.
2. **Soon / Phase 2 hardening:** normalize all external assets into a consistent Agent Forge socket contract and manifest, not direct ad hoc imports from marketplace files.
3. **Later / Phase 5+:** generate or commission bespoke GLBs behind the same manifest/socket contract, so Feature 5 can evolve into on-the-fly part generation without frontend rewrites.

The stable contract is: **FeatureDef -> model manifest -> socket -> mounted GLB or fallback**.

## Repo structure

Recommended additions under the current spec structure:

```txt
apps/web/public/
  models/
    base/
      base_mech.glb
      base_mech.manifest.json
    parts/
      routing-core/
        routing-core.glb
        routing-core.manifest.json
      builder-gauntlet/
        builder-gauntlet.glb
        builder-gauntlet.manifest.json
    fallback/
      forged_module.glb              # later; optional if procedural fallback ships first
      forged_module.manifest.json
  hdri/
    studio.hdr
  licenses/
    ASSET_CREDITS.md
    assets.lock.json

docs/
  PHASE2_ASSET_SOCKET_ARCHITECTURE.md
```

Keep binary source/source-of-truth files out of the frontend bundle unless needed at runtime:

```txt
assets-source/                         # optional; add only with LFS decision
  blender/
  textures/
  vendor-downloads/
```

Do not commit large binary assets until the team chooses one of:
- Git LFS for `.glb`, `.gltf`, `.bin`, `.hdr`, texture maps, and `.blend`; or
- external object storage/CDN with only manifests committed.

## Socket naming contract

### Rules

- Every socket node in `base_mech.glb` must be an empty/Object3D whose name starts with `socket_`.
- Names are stable API, not artist notes. Renaming a socket is a breaking change.
- Use uppercase side suffixes: `_L`, `_R`.
- Use singular, semantic body zones; avoid part-specific names like `socket_calendar_cannon`.
- Attachments should be authored with their local origin/pivot aligned to the mount point and forward axis documented below.
- Frontend indexes sockets dynamically from the GLB scene (`name.startsWith('socket_')`), then validates every active feature slot exists.

### Coordinate convention

Use Three.js defaults:
- `+Y` up
- `+Z` forward/out from torso toward viewer-facing front
- `+X` character left/right as authored in the base model; maintain current app convention for `_L` and `_R` from catalog rather than trying to infer from camera.

Attachment GLBs should be exported at real scene scale, with the model origin at the socket mount. Avoid runtime magic offsets except temporary `mount` overrides in the manifest.

### Required Phase 2 sockets

These cover the existing stock catalog and give room for near-term hero parts:

```txt
socket_root
socket_pelvis
socket_chest
socket_reactor
socket_back
socket_spine_upper
socket_head
socket_head_crown
socket_head_eyes
socket_head_jaw
socket_shoulder_L
socket_shoulder_R
socket_upperarm_L
socket_upperarm_R
socket_forearm_L
socket_forearm_R
socket_wrist_L
socket_wrist_R
socket_hand_L
socket_hand_R
socket_hip_L
socket_hip_R
socket_thigh_L
socket_thigh_R
socket_shin_L
socket_shin_R
```

Optional expansion sockets for later catalog depth:

```txt
socket_back_upper_L
socket_back_upper_R
socket_back_lower_L
socket_back_lower_R
socket_chest_L
socket_chest_R
socket_head_ear_L
socket_head_ear_R
socket_knee_L
socket_knee_R
socket_ankle_L
socket_ankle_R
```

### Current stock feature slot mapping

Keep the Phase 1 slots, but require the Phase 2 base GLB to include all of them:

| Feature | Slot |
|---|---|
| Routing Core | `socket_chest` |
| Monocle Lens | `socket_head` |
| Oracle Crown | `socket_head_crown` |
| Recon Visor | `socket_head_eyes` |
| Signal Antenna | `socket_back` |
| Archive Satchel | `socket_hip_L` |
| Laser Pointer Arm | `socket_hand_R` |
| Battleaxe Arm | `socket_hand_L` |
| Builder Gauntlet | `socket_forearm_R` |
| Research Grappler | `socket_forearm_L` |
| Guardian Reactor | `socket_reactor` |
| Creative Furnace | `socket_chest` |
| Market Radar | `socket_shoulder_R` |
| Calendar Cannon | `socket_shoulder_L` |

Collision policy for multiple features on one socket: Phase 2 may allow it only through deterministic fan-out offsets in the fallback/attachment component. Long term, prefer alternate compatible slots in the catalog (`compatibleSlots`) or mutually-exclusive variants.

## Asset manifest contract

Add lightweight runtime metadata next to each GLB. This avoids hardcoding scale/offset/license details in React components.

Example part manifest:

```json
{
  "id": "builder-gauntlet",
  "kind": "part",
  "version": 1,
  "model": "/models/parts/builder-gauntlet/builder-gauntlet.glb",
  "defaultSocket": "socket_forearm_R",
  "compatibleSockets": ["socket_forearm_R", "socket_forearm_L", "socket_hand_R", "socket_hand_L"],
  "mount": {
    "scale": 1,
    "position": [0, 0, 0],
    "rotation": [0, 0, 0]
  },
  "materials": {
    "accentTargets": ["emissive", "trim", "glass"],
    "recolorable": true
  },
  "bounds": {
    "radius": 0.45,
    "height": 0.7
  },
  "licenseId": "sketchfab-creator-asset-slug-2026-07-02"
}
```

Example base manifest:

```json
{
  "id": "base-mech-v1",
  "kind": "base",
  "version": 1,
  "model": "/models/base/base_mech.glb",
  "requiredSockets": ["socket_chest", "socket_reactor", "socket_head", "socket_head_crown", "socket_head_eyes", "socket_back", "socket_hip_L", "socket_hand_R", "socket_hand_L", "socket_forearm_R", "socket_forearm_L", "socket_shoulder_R", "socket_shoulder_L"],
  "scale": 1,
  "licenseId": "base-mech-source-id"
}
```

Frontend `FeatureDef.model` can keep pointing directly to a GLB for Phase 2 speed, but Sally's long-term preference is to add an optional `assetManifest` field later. Do not block Phase 2 on changing shared types if Mustang can implement a small internal resolver:

```ts
resolveFeatureAsset(def) => def.model || '/models/fallback/forged_module.glb'
```

## Licensing and citation policy

Chris has approved free/curated GLB assets with acceptable licenses. Paid purchases need explicit approval before purchase.

Acceptable for committed demo assets:
- CC0/Public Domain.
- CC-BY with clear creator attribution in `ASSET_CREDITS.md`.
- Marketplace free assets whose license permits commercial/product demo use, modification, and redistribution in the repo or deployed web app.
- HDRIs from Poly Haven or equivalent CC0 sources preferred.

Avoid unless Chris explicitly approves:
- Editorial-only assets.
- Non-redistributable marketplace downloads if the app deployment would serve the raw GLB publicly.
- NC/non-commercial licenses for anything that might ship beyond an internal demo.
- Fan/IP-infringing Iron Man/Transformer ripoffs. Use the visual language, not protected designs.

Maintain `apps/web/public/licenses/assets.lock.json`:

```json
[
  {
    "licenseId": "polyhaven-studio-small-03-2026-07-02",
    "assetName": "Studio Small 03 HDRI",
    "assetType": "hdri",
    "sourceUrl": "https://...",
    "creator": "Poly Haven",
    "license": "CC0",
    "downloadedAt": "2026-07-02",
    "localPaths": ["/hdri/studio.hdr"],
    "notes": "OK for redistribution and commercial use."
  }
]
```

Maintain human-readable `ASSET_CREDITS.md` for UI/about/deployment citations.

## Fallback strategy

The fallback must be a first-class module, not an error state.

Phase 2 implementation options:
1. **Immediate safest path:** procedural R3F fallback module, generated in code, recolored by `FeatureDef.accent`, scaled by slot type. This preserves Phase 1 stability and requires no binary asset.
2. **Preferred visual path:** one `forged_module.glb` with PBR material slots and emissive accent target. Use it for any missing, failed, or unlicensed feature GLB.

Runtime fallback rules:
- If base GLB is unavailable: render the existing Phase 1 primitive mech. This keeps the demo stable.
- If a feature GLB fails to load: mount fallback module to the requested socket.
- If the requested socket is missing: mount fallback to `socket_chest` or skip with visible dev warning; do not crash the Canvas.
- If license metadata is missing in production builds: warn/block depending on deployment mode; never silently add unknown sourced assets.

The fallback module should support:
- Accent recolor.
- Slot-aware variants: lens, shoulder pod, hand tool, chest core, back antenna can be simple scale/rotation presets over the same mesh.
- Forge-in animation: scale 0 -> 1 plus emissive flash.

## Frontend architecture guidance

Create Phase 2 components without deleting the primitive mech:

```txt
apps/web/src/three/
  Stage.tsx                 # Canvas, HDRI, lights, postprocessing
  Mech.tsx                  # chooses GLB mech or primitive fallback
  PrimitiveMech.tsx         # current Phase 1 geometry preserved
  GlbMech.tsx               # loads base_mech.glb and indexes sockets
  Attachment.tsx            # loads/clones part GLB or fallback
  FallbackModule.tsx        # procedural fallback, later can wrap forged_module.glb
  Effects.tsx               # Bloom + SSAO + tone/tuning wrapper
  sockets.ts                # indexSockets, validateSockets, slot presets
  assets.ts                 # resolve model path/manifest/fallback
```

Key behaviors:
- Use `useGLTF.preload` for base and stock hero parts.
- Use `SkeletonUtils.clone` before mounting reused GLB scenes.
- Never mutate the cached GLTF scene directly across multiple attachments.
- Validate sockets after base load and surface missing sockets as a non-fatal dev overlay/log.
- Keep selected parts derived from `coreSkills` now; later include `customFeatures` as a separate bucket.
- Add `@react-three/postprocessing` for Bloom/SSAO; keep ACES tone mapping already present in `Stage.tsx`.

## Mustang implementation guidance

### Implement now for Phase 2 gate

Mustang should implement the code seam and visual upgrade before hunting for every final asset:

1. Add `@react-three/postprocessing` and create `Effects.tsx` with Bloom + SSAO.
2. Split current `Mech.tsx` into `PrimitiveMech.tsx` and `Mech.tsx` wrapper so the Phase 1 demo survives base GLB failures.
3. Add `GlbMech.tsx`, `Attachment.tsx`, `FallbackModule.tsx`, `sockets.ts`, and `assets.ts`.
4. Implement runtime socket indexing from `base_mech.glb` with graceful missing-socket fallback.
5. Keep all current catalog slots; update only model paths when real GLBs are available.
6. Add `apps/web/public/models/.gitkeep`, `models/base/.gitkeep`, `models/parts/.gitkeep`, `models/fallback/.gitkeep`, `hdri/.gitkeep`, and `licenses/ASSET_CREDITS.md` / `assets.lock.json` scaffolding if no assets are committed yet.
7. Use `<Environment files="/hdri/studio.hdr" />` when a real HDR exists; otherwise keep `preset="city"` as fallback so dev does not break.
8. Start with 3-5 hero parts plus procedural fallback if asset sourcing time is tight. The architecture must support ~20; the demo need not wait for all 20 if the fallback looks intentional.
9. Add a small asset QA script later or now if quick: validate manifests reference existing files and required sockets are listed.

### Defer

Do not block Phase 2 on:
- 1,000-feature catalog authoring.
- Embedding match backend.
- Text-to-3D generation integration.
- Full Blender source workflow.
- Paid asset marketplace purchases without Chris approval.
- SQLite or CDN asset storage.
- Rigged animation beyond idle/forge/speaking pulses.
- Changing shared `FeatureDef` unless needed; prefer local resolver compatibility first.

## Long-term 3D pipeline

1. **Ingest:** acquire/generate GLB, record source/license in `assets.lock.json`, store raw source outside public runtime path.
2. **Normalize:** open in Blender or gltf-transform pipeline; set scale, origin, axes, material names, mesh compression if chosen, and mount pivot.
3. **Author sockets:** base mech sockets are empties; part origin aligns to intended socket. Export GLB.
4. **Optimize:** run glTF transform steps as appropriate: dedupe, prune, texture resize/webp/ktx2 later, meshopt/Draco only after checking loader support.
5. **Manifest:** create/update part manifest with default/compatible sockets, transform overrides, material accent targets, bounds, and licenseId.
6. **Validate:** automated check for missing files, unknown licenses, invalid sockets, oversized assets, and broken JSON.
7. **Preview:** local asset gallery route or Storybook-like harness showing each part on each compatible socket.
8. **Promote:** only assets passing license + validation + visual QA become catalog entries.

Future generated-asset path should output the same GLB + manifest + license/provenance record. If generated parts are low confidence, they enter as draft assets and render via fallback until curated.

## Acceptance gate for Phase 2

Phase 2 passes Sally's architecture gate when:

- Phase 1 primitive mech remains available as the fallback path.
- Base GLB sockets are dynamically indexed; code is not tied to hardcoded socket positions except primitive fallback presets.
- Missing GLBs/missing sockets do not crash the app.
- Asset license/citation scaffolding exists before curated assets are committed.
- Bloom, SSAO, ACES, and HDRI/preset environment are active.
- Feature rendering remains data-driven from `FeatureDef.slot` and `FeatureDef.model`.
- Fallback module is visually intentional and accent-colored.
- No paid, non-redistributable, editorial, or unknown-license assets are committed.
