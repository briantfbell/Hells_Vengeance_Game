> Lore reconciliation update: see [LORE_ACCURACY_AUDIT.md](LORE_ACCURACY_AUDIT.md). Its source facts and chronological route supersede conflicting prototype descriptions below.

# Reusable questgiver models

Created with the built-in ImageGen tool, matching the approved Freya pixel-art sheet. Full prompts: questgiver-art-prompts.json.

## Barzillai Thrune

Opening patron in Kintargo. Appearance follows 03_ART_SPEC.md: pale sharp-featured noble, slick black hair, short goatee, black/crimson coat with gold trim. Opening orders reuse the supplied original game's dialogue, with the selected leader responding. The private audience precedes the Night of Ashes by two nights.

## Archbaron Darellus Fex

The later patron in Longacre, confirmed by the campaign NPC profile and timeline. He does not appear in the current prologue. His purple coat, silver hair, and cane are an interpreted design because appearance was unspecified in the provided profile. Do not confuse him with Vokadus Fex. No later plot details are exposed in the game.

## Files and reuse

- art-test/barzillai-model.png and art-test/fex-model.png: transparent sheets with front, right-profile, and rear idle models.
- art-test/questgiver-models.js / .json: names, source filenames, facing order, and exact alpha-bound frame rectangles.
- The game loads both models through the registry. Dialogue uses the same portrait renderer as the party.
- Use `say('barzillai', text)` or `say('fex', text)` for named portrait dialogue.
- Use `drawQuestgiver(id, x, footY, height, facing)` in a scene renderer; facings are front, right, left (mirrored right), and back.

Model PNG alpha is retained. Bounds are detected without altering raster artwork. These are reusable idle/facing models; dedicated walking or attack animations can be added when needed.

## Validation

All six model frames have nonempty alpha bounds. Each starting character receives the eight-part opening sequence, then becomes the exploration leader. Checkpoint reload preserves the choice. Full chapter walkthrough and offline/HTTP asset startup checks pass. Water distortion and moving wave highlights have been removed; other light/ambient effects remain.
