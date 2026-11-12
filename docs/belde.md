# Belde and Yunero

Replays 342–349 cover the stop in Belde on 11 Pharast, 4717. GM timeline row S109 records the company liberating Belde from the Glorious Reclamation and Freya winning a trivia contest against Yunero, an ogre mage. P015, “A Vacation from Virtue,” places the stop after the Night of the Pale. The surviving accounts give the outcomes without a battle roster, a town layout or the contest’s original questions.

The adaptation puts the fight first and stages it at the town watch. The guard roster, dialogue, quiz mechanics and Yunero’s appearance are adapted. The three questions draw on GM timeline rows S003 (Taldor), S019 (House Davian) and S025 (Egorian). An incorrect answer leaves the current question open. Each correct answer saves progress.

Freya’s Foundry actor export (Actor.KOt611BvSrOhib3t) names the contest Chelaxian Noble Trivia in the Championship Belt entry (Item.B8WdcS4xvdExMyJb). The entry associates defeating Yunero with a +2 bonus against ogre mage spell-like abilities. The available sources leave the belt’s acquisition timing unresolved, so the game records the contest win in the journal and leaves that equipment progression open.

## Artwork prompts

**Occupied square** · `art-test/belde-square-v1.png`

Wide 8:5 top-down orthographic dark fantasy pixel RPG map for 640x400. Belde, a modest walled Chelish coastal town at overcast late afternoon. A stone watch gate and barricade only at the upper center edge, a half-timbered inn frontage at upper right with warm windows, cottages and old sea wall toward the upper left. Clear uninterrupted cobblestone square and broad walkable central lane from x=12% to 88%, y=47% to 92%. Lower center entry path. Faint sea beyond distant rooftops. Fine hard-edged pixel clusters and restrained muted stone blue, moss and amber. No people, words, banners with symbols, UI or readable text.

**Liberated square** · `art-test/belde-square-liberated-v1.png`

Edit this exact 8:5 top-down pixel-art game map of Belde. Preserve the camera, stone gatehouse, town square, inn, sea, all lamps, and exact walkable layout. Remove only the wooden X-shaped barricade across the upper-center gate mouth so the stone passage is visibly clear. Keep the lifted portcullis and all town detail. No people, text, new structures, or changes elsewhere.

**Yunero** · `art-test/belde-yunero-v1.png`

Single full-body transparent high-detail pixel art sprite of Yunero, an adult male ogre mage and learned trivia opponent in a dark fantasy handheld RPG. Tall solid build, broad face, muted blue-gray skin, restrained short horns, intelligent amused expression, simple deep indigo and weathered teal robes with ochre trim, carrying one small bound history book. Full head, hands and boots visible, neutral three-quarter front. Fine hard-edged pixel clusters, readable silhouette, true RGBA alpha zero outside the sprite. No scenery, shadow, halo, text, weapons, or second figure.

## Verification

The browser playthrough continued from the Night of the Pale, won the guard fight, and continued in the liberated square. It tested a wrong answer and retry, reloaded after the first correct answer, finished all three rounds, and reloaded the concession checkpoint. The game canvas was 640×480 and the browser reported no console errors. All 149 automated tests passed. The structural audit checked 131 scenes, 353 replays and 606 sprite frames.
