# Agent Forge Phase 2 — Premium Mech Visual Direction

## North star
Phase 2 must stop reading as a toy/Roblox avatar and start reading as a premium AI suit in a holographic lab: **Tony Stark workshop + movie Transformer surface complexity + clean sci-fi product UI**. The mech is not a mascot; it is the physicalized blueprint of an AI agent being forged.

## Design bar: non-Roblox criteria
A Phase 2 screenshot passes only if these are true at thumbnail size and full size:

1. **Silhouette is heroic and mechanical, not cute/blocky.** Tall V-shaped torso, smaller armored waist, long readable limbs, angular helmet, broad shoulders, asymmetric optional tools. Avoid sphere/capsule body language.
2. **Armor language uses layered hard-surface panels.** Overlapping plates, bevels, inset seams, vents, pistons, exposed joints, sockets, cables, and greebles. No primitive boxes/cylinders/spheres as final visible anatomy.
3. **Materials are PBR-first.** Brushed gunmetal, graphite ceramic, black glass, carbon/rubber joint material, small amber/cyan emissive accents. Every hero mesh needs normal/roughness/metalness variation; flat color equals fail.
4. **Scale and proportion feel adult.** Helmet and hands are not oversized cartoon proportions. Shoulders/chest can be powerful, but limbs need believable mechanical taper and joint detail.
5. **Lighting sells premium metal.** HDRI studio reflections, cool cyan key, warm amber rim/fill, contact shadows/SSAO in crevices, controlled bloom only on optics/reactor/UI strips.
6. **Feature parts integrate into sockets.** Attachments look bolted/docked into the suit, not floating stickers. Each part needs a visible mount collar, hinge, rail, or magnetic clamp.
7. **UI and mech share one system.** Skill cards, accent colors, reactor pulses, scan plane, and selected parts use matching cyan/amber/holo language. UI should frame the mech like a lab instrument, not compete with it.
8. **No toy plastic.** Avoid saturated primary colors, chunky rounded proportions, untextured low-poly assets, bobblehead scale, or block-built silhouettes.

## Robot silhouette direction
- Base stance: upright hero pose, feet planted on holographic assembly ring; subtle idle breathing/servo sway only.
- Shape: angular helmet; narrow luminous visor; trapezoid chest with central reactor; broad but faceted pauldrons; visible mechanical elbows/knees; slim waist; armored thighs/shins.
- Read: from 20 feet away, it should read as **high-end armored suit / autonomous mech**, not character toy.
- Asymmetry: selected skills may create asymmetry, but the base silhouette must remain balanced.

## Armor and attachment language
- Base mech: layered plating with panel seams and bevels. Keep dense detail on chest, helmet, shoulders, forearms, and knees; leave some calm surfaces so attachments can read.
- Attachment families:
  - Optics/head: visors, monocles, crowns, antennas, sensor fins.
  - Torso/reactor: core plates, heat sinks, translucent energy lenses.
  - Shoulders/back: radar dishes, launchers, signal arrays, wing-like server fins.
  - Arms/hands: gauntlets, tools, grapplers, blades, pointer emitters.
  - Hip/utility: archive packs, satchels, data canisters.
- Each feature GLB should include a small dock/mount base aligned to the named socket. Do not rely on naked mesh intersection.

## Materials palette
- Primary metal: dark gunmetal / graphite, high metalness, medium-low roughness, with brushed anisotropic feel if available.
- Secondary material: matte black ceramic/carbon for undersuit and joints.
- Detail material: darker rubber/cable material for neck, elbows, knees, hips.
- Glass/lenses: black-tinted glossy glass with cyan internal glow.
- Emissive accents: default holo-cyan `#3fd0ff`; arc-amber `#ff7a18`; feature-specific accents can tint small strips/lenses only, not whole limbs.
- Texture requirement for hero assets: base color + normal + roughness/metalness where possible. Normal maps must show fine panel lines/scratches.

## Lighting and stage direction
- Environment: replace preset-only look with a real studio/lab HDRI when available (`/hdri/studio.hdr`). City preset is acceptable only as a temporary fallback.
- Camera: three-quarter hero view, slightly low, 35–45° lens/FOV equivalent, robot fills 65–75% of assembly bay height.
- Lights: cyan overhead/key, amber rim/fill, soft ground contact shadows. Keep bloom controlled; if the whole mech glows, it looks cheap.
- Post: ACES tone mapping, SSAO, bloom, optional subtle vignette. SSAO/contact shadow is mandatory for crevice depth.
- Hologram treatment: scan plane/ring should enhance the physical mesh, not replace it. Avoid flat CSS mech overlay once GLB is present unless used as loading/ghost guide.

## UI integration rules
- Selected skill card accent must match the attached part’s tiny emissive strip/lens.
- Forge animation: part scales in from 0.85–1.0, snaps to socket, then emits a quick 300–600ms pulse along mount seams. No bouncy cartoon easing.
- Tooltip/description copy can use engineering language: “docked,” “calibrated,” “thermal,” “array,” “reactor,” “optic,” “grappler.”
- Keep panels glassy and data-rich, but never cover the mech’s head/chest in default desktop view.

## Asset acceptance checklist for Mustang
For each candidate GLB, reject it if any answer is “no”:
- License is acceptable for the demo/project and source URL/license are recorded.
- It is not Roblox/Minecraft/low-poly/toy-stylized.
- It has hard-surface detail visible without zooming in.
- It includes PBR materials or can be quickly rematerialized with Quixel/Poly Haven textures.
- Polycount is web-reasonable after compression/Draco/meshopt; no huge unoptimized marketplace dump.
- Origin/pivot and scale can be normalized; forward/up axes are sane.
- For base mech: sockets can be added/named consistently.
- For feature parts: part can plausibly mount to one of the stock sockets and includes or can receive a mount collar.

## Screenshot QA gate
Capture desktop at the live demo size and check:
1. Thumbnail test: at 25% zoom, silhouette reads as premium armored mech, not toy/primitive robot.
2. Material test: metal has reflections, roughness variation, panel lines, and crevice shadows.
3. Lighting test: head/torso/attachments are legible; bloom is accents only; background is dark premium lab.
4. Feature test: selecting three skills visibly changes three different parts without cluttering the silhouette.
5. UI test: panels feel like holographic lab controls and accents correspond to selected mech parts.
6. Roblox kill test: no visible final primitive spheres/capsules/boxes as body anatomy; no chunky rounded avatar proportions; no flat primary-color plastic.

## Exact build guidance for Mustang
1. Replace the current primitive `Mech.tsx` body with `base_mech.glb` loaded via `useGLTF`, and index named sockets at runtime (`socket_chest`, `socket_reactor`, `socket_head`, `socket_head_crown`, `socket_head_eyes`, `socket_back`, `socket_hip_L`, `socket_hand_R`, `socket_hand_L`, `socket_forearm_R`, `socket_forearm_L`, `socket_shoulder_R`, `socket_shoulder_L`).
2. Curate one strong free/approved base mech GLB first; if it lacks sockets, add empties in Blender and export. This is more important than collecting many parts.
3. Curate/prepare 14 stock hero part GLBs mapped to the current catalog, plus one premium fallback module. Prioritize: visor/eyes, reactor/chest core, shoulder radar/cannon, forearm gauntlet, hand tool, back antenna, hip archive pack.
4. Update `catalog.ts` model paths from `/models/fallback.glb` to the real part paths as each part is ready; keep fallback only for missing assets.
5. Add `Attachment.tsx` using `SkeletonUtils.clone`, parent each part to its socket, normalize scale/rotation per asset, and play a short emissive forge pulse.
6. Upgrade stage rendering: real `/hdri/studio.hdr`, ACES already present, add `@react-three/postprocessing` SSAO + Bloom, enable/contact shadows, and remove or demote the CSS `.mech-hologram` overlay once GLB loads.
7. Add asset provenance notes in `docs/ASSET_PROVENANCE.md` or adjacent asset manifest: asset name, source URL, license, author, local path, modifications. Paid assets require Chris approval before purchase.
8. Run the screenshot QA gate before calling Phase 2 done. The acceptance target is “premium holographic mech lab” in one screenshot, not merely “GLB loads.”
