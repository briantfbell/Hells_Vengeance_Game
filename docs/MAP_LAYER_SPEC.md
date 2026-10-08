# Layered map format

## Rendering order

1. Background/environment layer: ocean, river, distant terrain, sky or a static fill.
2. Playable foreground PNG: all fixed ground/structure/attached props; genuine alpha in exposed regions.
3. Actors and grounded interactive objects, sorted by feet where needed.
4. Optional occlusion PNG: upper rails, roof edges, mast/rigging sections that must pass in front of an actor.
5. Light/particle effects and UI.

For the ship, water is never baked into the foreground. The whole ship remains fixed while the ocean moves below its transparent perimeter. Do not deform or sample-shift the ship artwork. A top-down playable foreground is distinct from optional actor-occlusion layers.

## Files

- art-test/map-layers.js and map-layers.json: map registry.
- art-test/scene-layers.js: shared rendering functions (background, foreground, draw, occluders).
- art-test/ship-deck-foreground.png: first transparent map asset, generated with built-in ImageGen. Exact prompt: docs/ship-layer-prompt.txt.
- Map Layer Studio.html: inspect ship-only, ocean-only, combined, animation pause, and draft path grid.

Registry fields: foreground filename; background configuration; optional walk rectangles and blocked rectangles; future occlusion filename. Current background types are a static fill and a cached procedural ocean tile. The ocean is an independent layer and can later be replaced by an authored looping texture without reworking the foreground.

Existing Kintargo/tavern/temple maps now use the common renderer but retain their opaque artwork and static underlying fill. They have not been falsely treated as separated assets. New maps must use the transparent format; split existing art only through an explicit asset edit when upgrading those scenes.

## Coordinates, collision and animation

640x400 logical exploration space; 16px navigation cells. All PNG layers use the same aspect ratio, canvas alignment and origin. Export high-resolution PNGs with real alpha; no painted checkerboard, ocean or halo outside the scene silhouette. Background speed is independent of walking/collision and does not use gameplay random rolls. Reduced-motion preference renders a fixed background.

Navigation stays in authored map data. Alpha is not collision: transparent holes may be hazards, and opaque mast bases may be blocked. Foreground drawings must preserve adequate walk corridors, entrances and turning room. The ship's current walk/blocked shapes are draft art-study data, not final chapter collision.

## Asset review

Check image alpha and canvas alignment; combined/background-only/foreground-only modes; deterministic foreground under moving background; no seams at loop wrap; no missing assets offline or HTTP; small-screen readability; actor depth near stairs, rails and masts; path connectivity and reachable exits. Foreground art is reusable regardless of background animation implementation.

Validation: the preview exposed 140,424 transparent pixels; two animation frames changed 8,659 ocean pixels and zero opaque ship pixels. Paused frames were identical, the 320px viewport had no horizontal overflow, and the existing chapter walkthrough passed.
