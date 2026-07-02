# Agent Forge Phase 1 Build Brief

Owner: Atlas / Chris
Builder: Mustang
Repo: `https://github.com/Christopher-Trent/agent-forge` (private)
Local root: `/Users/chris_trent/Atlas/apps/agent-forge`
Spec: `/Users/chris_trent/Atlas/apps/agent-forge/SPEC.md`
Reference prototype: `/Users/chris_trent/.hermes/cache/documents/doc_44a7e91218af_agent-forge.html`

## Mission

Build Phase 1 from SPEC.md as a real React + Vite + TypeScript monorepo app, preserving the Agent Forge/Tony Stark lab feel from the existing single-file prototype.

Do not implement backend/chat/embeddings yet. Phase 1 is frontend-only and must be demoable.

## Required Phase 1 scope

- pnpm workspace monorepo structure from spec:
  - `apps/web`
  - `apps/server` placeholder only if useful
  - `packages/shared`
- React + Vite + TypeScript frontend.
- react-three-fiber / drei scene with current primitive mech equivalent.
- OrbitControls: user can spin/rotate and zoom the robot like a hologram.
- Blueprint panel:
  - agent name
  - model selector
  - mission textarea
  - SOUL.md / prompt preview
- Loadout panel:
  - 14 stock feature cards from the prototype/spec
  - card body toggles skill
  - info button expands description and keywords without toggling
  - max 3 selected core skills, with clear toast/refusal on 4th
  - mission keyword detection only suggests/highlights cards; never auto-selects
- Traits panel:
  - 0–100 sliders for authority, agreeableness, likeability, humor/playful, verbosity, caution
  - updates blueprint.traits and assembled prompt preview live
- Zustand store using the shared AgentBlueprint model.
- localStorage persistence acceptable for Phase 1.
- Responsive layout: mobile panels become bottom sheets or usable stacked panels.
- Accessibility basics: keyboard focus, aria labels for card info buttons.

## Visual bar

Use the existing prototype as look/interaction reference:
- void black / holo cyan / arc amber
- Chakra Petch, Space Grotesk, JetBrains Mono
- floating glass HUD panels with corner brackets
- scan / glow / forge animation language

Do not reduce this to generic React cards. If you need to compromise, preserve the central 3D forge feeling first.

## Verification required

Run and report exact output:
- `pnpm install`
- `pnpm --filter web build`
- any typecheck/lint script you add
- start local dev server or preview server and verify HTTP 200

If screenshot tooling is available, capture one screenshot. If not, state why.

## Git workflow

- Commit meaningful files.
- Push to private GitHub repo main or a feature branch if safer.
- Do not commit `node_modules`, secrets, or local DB files.
- Include README with setup/demo instructions.

## Return format

Return only:
- files changed summary
- commands run + pass/fail
- local URL
- GitHub URL/branch/commit
- blockers/caveats
