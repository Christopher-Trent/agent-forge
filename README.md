# Agent Forge

Phase 1 frontend demo for Agent Forge: a React + Vite + TypeScript monorepo prototype where a blueprint drives a live holographic primitive mech.

## Stack

- pnpm workspace monorepo
- React + Vite + TypeScript
- react-three-fiber + drei
- Zustand store
- Shared TypeScript blueprint model in `packages/shared`

## Run

```bash
corepack pnpm install
corepack pnpm --filter web dev
```

Open `http://localhost:5173`.

## Verify

```bash
corepack pnpm --filter web build
corepack pnpm --filter web typecheck
corepack pnpm --filter web preview --host 0.0.0.0
curl -I http://localhost:4173
```

## Phase 1 scope

Implemented frontend-only per `PHASE1_BUILD_BRIEF.md`: primitive r3f mech, OrbitControls, blueprint panel, 14 explicit skill cards with info expansion, max-3 core skill cap with toast, mission keyword suggestions only, trait sliders, live prompt preview, Zustand persistence, responsive HUD layout, and accessibility basics.

Backend/chat/embeddings/GLB assets are intentionally deferred to later phases.
