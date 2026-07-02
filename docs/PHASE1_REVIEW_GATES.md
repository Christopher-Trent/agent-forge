# Agent Forge Phase 1 Review Gates

## Decks — design gate

Ship only if Phase 1 preserves:
- Full-screen 3D assembly bay as the visual center, not a side widget.
- Floating glass HUD panels over the canvas.
- Void black / holo cyan / arc amber visual language.
- Robot/mech visibly changes when skills are selected.
- Mission keyword detection suggests cards only; it never auto-selects.
- 3-core-skill cap has a clear refusal toast.
- Trait sliders feel like a conduct matrix, not plain settings controls.
- Prompt/SOUL preview updates live.
- Mobile uses bottom-sheet or otherwise usable HUD panels.
- Focus states and aria labels exist, especially card info buttons.

Block if:
- It looks like generic React dashboard cards.
- The robot is inert/decorative.
- Skill cards auto-select from mission text.
- It loses forge effects: scan, glow, pulse, assembly animation, status readouts, HUD chrome.
- Any white/light default UI leaks in.

## Sally — architecture gate

Phase 1 must not paint future phases into a corner:
- Use shared `AgentBlueprint`, `FeatureDef`, caps, and trait IDs from `packages/shared`.
- Keep `coreSkills` and `customFeatures` separate.
- Keep mission keyword detection suggestion-only.
- Drive visual attachments from feature definitions and slots, not ad hoc booleans.
- Use future-compatible socket names, e.g. `socket_head_crown`, `socket_shoulder_L`, `socket_hand_R`, `socket_back`, `socket_chest`.
- Keep prompt building as a pure function: `buildSystemPrompt(blueprint)`.
- Treat localStorage as a Phase 1 persistence adapter, not the permanent data model.
- Keep provider/Ollama/backend config out of frontend.
- Do not commit large binary assets before Phase 2 asset policy / possible Git LFS decision.

## Deferred Chris decisions

Needed later, not blocking Phase 1:
1. Asset strategy: buy/curate GLBs vs generate vs hybrid.
2. Phase 2 visual fidelity target: one hero mech + strong parts vs wider lower-quality coverage.
3. Chat provider policy: Ollama only vs hosted fallback.
4. Persistence: JSON demo vs SQLite.
5. Catalog authorship: seed/generated/sourced.
6. On-the-fly 3D generation as stretch vs core product direction.
