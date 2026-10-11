# Presentation and story polish

The game remains 640×480 in exploration, combat and transitions. An original Folken Pixel font replaces modern UI type in in-game overlays, while developer controls remain readable outside the game. Dialogue is paginated; normal and choice frames now have explicit native dimensions. See UI_PHOTOSHOP_SPEC.md for artwork targets.

## Completed changes

- Fixed the porch guards' idle cycle indexing; render-safe fallback and cycle-length handling prevent the missing-frame crash. Porch victory now refreshes objectives and saves its result before Cimri's rescue.
- Eight distinct townsfolk models (four additional generated variants), each with their own dialogue headshot crop and walking poses.
- Krenshar faces into the scene and uses three standing idle poses. No lying-down pose was added.
- First decree posting displays a full-screen parchment notice. Gathering limits retain the documented six/twelve wording; no speculative five-person amendment.
- New infernal combat void artwork, geometric image dice with dynamic numbers, stepped smoke clouds and separate timing offsets for duplicated enemies.
- Four optional self-important Riley conversation topics during captivity. These are adaptation flavor, not recovered campaign quotations.
- Render-time removal of isolated sprite islands: original PNGs remain unchanged. Audit covers 234 indexed frames, including weapon strike frames; 15 frames have conservative cleanup masks.
- Solo J'Mal starts his watch from the left. The deputy marker is raised two tiles. Bolgart remains in stocks during the jailbreak/release checkpoint.
- Bo's arrest immediately leads to the dusk transition. Cause Fear explicitly identifies the spell and the knight failing to resist it. Its D20 remains a failed **defender saving throw**, not a successful attacker roll.
- After the execution, Riley and Bo head pikes flank the guillotine until the bodies go missing.
- Separate church vestibule, hallway and sanctuary maps. Altar destruction has a brief stone/dust collapse effect. Renovation retains the ruined map until Jason's dedication; converted artwork uses the supplied red inverted Asmodean pentagram.
- J'Mal's accuser scene states the accidental killing and leaves the corpse visible, without editorial source-gap commentary.

## Artwork provenance

Six built-in imagegen outputs were copied unchanged to art-test. Full prompts: PRESENTATION_POLISH_ART_PROMPTS.json. Frames and portrait crops are metadata. Font source: scripts/build-pixel-font.py (original project glyphs, CC0). Sprite audit sources: scripts/audit-sprite-frames.cjs and scripts/audit-sprite-alpha.py; results in sprite-alpha-audit.json.

## Validation

92 automated tests pass, including new porch-cycle, duplicate-enemy timing, captive-Riley gating, eight portrait variants and cancelled-decree cleanup regressions. Browser playthrough and layout observations are recorded with screenshots in the same docs directory. Photoshop skins are pending Brian's artwork; the existing frames are functional placeholders with the new font/palette.

Browser verification: the solo porch fight completed in five rounds with both enemy sprites visible; its aftermath advanced to the Cimri rescue dialogue without console errors. The test save used a separate localhost origin.
Additional browser checks: full-screen first-posted decree, captive Riley's five-choice layout, separate church vestibule, ten-combatant initiative dice artwork and six-member battle staging. Browser console reported no warnings/errors. Screenshots: combat-presentation-preview.jpg, decree-preview.jpg, riley-dialogue-preview.jpg, porch-rescue-proof.jpg.
