# Agent Forge Phase 2 Rework Brief — Anti-Blocky Mech

Owner: Atlas / Chris
Builder: Mustang
Design gate: Decks
Architecture gate: Sally
Asset scout: Scout
QA: Guardian

Repo: `/Users/chris_trent/Atlas/apps/agent-forge`
Current rejected Phase 2 commit: `3ed7b7c`
Current screenshot: `artifacts/phase2-home.png`
Deployment: **paused**. Do not troubleshoot GitHub Pages in this rework. Focus on code/files/local verification.

## Decision

Phase 2 is reopened. Current mech remains too blocky / Roblox-like, so Phase 2 is not accepted.

## Goal

Ship a revised Phase 2 where the central robot screenshot reads materially more like a premium forged mech:

- heroic adult silhouette
- angular hard-surface armor
- layered plates and negative space
- rounded/chamfered forms instead of visible boxes
- mechanical joints, sockets, pistons, reactor, optics
- attachments as gear mounted to the suit, not stickers/cubes

## Asset rule

Chris approved free/curated GLB assets with acceptable licenses.

Best candidate from Scout:

1. Quaternius Animated Mech Pack
   - URL: https://quaternius.com/packs/animatedmech.html
   - Author: Quaternius
   - License: CC0 / Public Domain
   - Formats: FBX, OBJ, Blend, glTF

Fallback candidate:

2. Poly Pizza Mech by Quaternius
   - URL: https://poly.pizza/m/D5wW2jDO42
   - Author: Quaternius
   - License: Public Domain / CC0
   - Formats: FBX / glTF

Use these only if download/integration is straightforward and license/provenance is recorded. Do not use paid assets. Do not use IP-infringing Iron Man/Transformer ripoffs. Do not use unclear license assets.

If GLB/gltf sourcing is slow, implement the procedural premium rework now and leave the GLB as an explicit next branch. The key deliverable is a non-blocky screenshot and maintainable socket architecture.

## Must-fix visual issues from Decks

### Blockers in current screenshot

- Cube head with flat visor.
- Rectangular torso block.
- Flat shoulder plank.
- Box arms/legs/feet.
- Box-heavy fallback modules.
- Low-segment faceted cylinders.
- Little negative space around joints.
- Camera crops lower body and emphasizes cube head/chest.

### Required changes

1. Replace box-only body language with rounded/tapered/chamfered armor.
2. Reduce head size by ~20–30% and make it a helmet form.
3. Increase chest mass, narrow waist, longer mechanical legs.
4. Replace shoulder plank with separate left/right pauldrons.
5. Add mechanical joints and negative space.
6. Rework forearm/hand modules into gauntlets/tools, not boxes.
7. Add layered V-shaped chest armor and a recessed reactor.
8. Improve material hierarchy: dark inner skeleton, satin armor, emissive seams.
9. Adjust camera/composition to show full silhouette.

## Sally architecture requirements

### Shared socket contract

Update or preserve:

- `apps/web/src/three/sockets.ts`
- `apps/web/src/three/Mech.tsx`
- `apps/web/src/three/PrimitiveMech.tsx`
- `apps/web/src/three/GlbMech.tsx`
- `apps/web/src/three/Attachment.tsx`

Keep socket names stable:

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

Add/maintain richer socket specs:

```ts
export interface SocketSpec {
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  normal?: [number, number, number];
}
```

### Procedural premium kit

Recommended new file:

`apps/web/src/three/ProceduralParts.tsx`

Components to add/use:

- `RoundedArmorPlate`
- `JointOrb`
- `LimbCapsule` or cylinder+sphere fallback
- `GlowStrip`
- `SocketCollar`
- `ReactorRing`

Use `RoundedBox` from `@react-three/drei` if available. If capsuleGeometry typing fails, use cylinders with sphere end caps.

### Components to alter

Must alter:

1. `PrimitiveMech.tsx`
   - Replace big box anatomy with rounded/chamfered armor, helmet, separate pauldrons, mechanical joints, V chest, longer legs.
   - Add/maintain named procedural socket groups or socket map behavior.

2. `FallbackModule.tsx`
   - Replace box modules with variant-specific equipment: optic, crown, back pack, hip pack, hand tool, forearm gauntlet, shoulder pod, reactor ring, chest module.

3. `sockets.ts`
   - Rich socket specs and helper functions.

4. `Mech.tsx`
   - Pass selected parts into GLB path if not already.

5. `GlbMech.tsx`
   - Accept parts and attach via indexed socket nodes / portals if practical.

6. `Attachment.tsx`
   - Apply mount transforms consistently.

Optional:

- `Stage.tsx` camera/lighting tune.
- `Effects.tsx` SSAO/bloom tune.

## Acceptance criteria

A new screenshot must pass:

- No major hero body part is a plain rectangular cuboid.
- Head no longer reads as a cube.
- Shoulders are not a straight plank.
- Chest has layered/tapered armor and reactor focal point.
- Arms/legs show joints and negative space.
- Modules look like equipment, not boxes.
- Full silhouette reads premium mech, not Roblox/block toy.

## Verification required

Run:

```bash
pnpm --filter web typecheck
pnpm --filter web build
pnpm --filter web preview --host 0.0.0.0
```

Capture a local screenshot to:

`artifacts/phase2-rework-home.png`

Commit and push code/files to `main`.

Do **not** spend time on GitHub Pages deployment. Deployment is paused by Chris.

## Return format

Return only:

- files changed
- assets added + license/provenance
- verification commands pass/fail
- screenshot path
- commit SHA
- caveats/blockers
