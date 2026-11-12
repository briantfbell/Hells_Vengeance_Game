# Nidal and the approach to Citadel Dinyar

GM timeline rows S141 and S142 date the split to 14 Gozran, 4717. Draymus, Violetta Pavel and Corrine travel to Nidal to seek an operation to remove Draymus’s brain. The campaign blog P001, “Fuck-It List,” records that the group teleports there while Freya, J’Mal, Reese and Jason scout Dinyar. The Nidal scene depicts their arrival and plans to seek a physician. The campaign record leaves the outcome of the operation open at this point.

Replay **437** shows Draymus, Violetta, and Corrine depart from the wayside while Freya’s company remains behind. The spell animation is staging for the teleport recorded in P001. Replay **438** resumes as Draymus in Nidal.

Corrine learned about the concealed entrance from a young Hellknight signifier who escaped to warn the capital. The fortress consists of two keeps connected by a bridge over a deep chasm. The Glorious Reclamation has held it for nearly a year. J’Mal and Reese locate the entrance, and the group hopes to find surviving Godclaw Hellknights below. The exact briefing dialogue, arrival courtyard, observation route, and position of the hidden entrance are adaptations.

The exported Foundry journal `JournalEntry.KCdVUuF4I36HvXIj` contains an image reference for Citadel Dinyar. The referenced artwork returned HTTP 404 in the archive. The game uses the blog’s architectural description for the new map.

In replay **440**, approaching the seam with Freya triggers the Championship Belt’s Cave Giant rune. Foundry item `B8WdcS4xvdExMyJb` grants +5 to detect hidden doors or panels and a passive check within 10 feet. This adaptation uses two 16-pixel tiles and a scripted D20 result. It marks the seam, then J’Mal and Reese still inspect it and find the entrance, as in the blog.

Replays **442–442A** show the concealed postern opening before the party descends. The open doorway stays visible when the ridge checkpoint reloads. The opening motion and doorway placement are game staging. Existing checkpoints below the ridge still load.

## Artwork prompts

Both maps were created with the built-in image generator.

**Nidal arrival court** · `art-test/nidal-arrival-court-v1.png`

High-detail dark fantasy pixel art environment for a fixed 640x400 RPG game map, 8:5 landscape ratio. Orthographic top-down 3/4 view of a discreet covered arrival courtyard in Nidal, empty. Tall narrow gothic black-stone buildings, wine purple shadows, dark slate tiles, one distant closed ironbound double doorway centered against north wall with subtle warm violet lamps. Clear central southern entrance, broad continuous walkable dark gray stone court within x 20 to 80 percent and y 40 to 90 percent. Detailed handmade clusters and quiet ambient lighting, grounded, somber. No characters, no creature, no signs or words, no game grid or UI, no circular floor sigil, no actual portal.

**Citadel Dinyar ridge** · `art-test/dinyar-ridge-v1.png`

Wide 8:5 landscape overhead three-quarter orthographic map for a detailed dark fantasy pixel RPG with fine hard pixel clusters, used as a playable 640x400 canvas. Citadel Dinyar, rocky mountain fortress of two separate gray-black stone keeps connected by a high narrow masonry bridge crossing a very deep rocky chasm, two distinct keeps and connecting bridge clearly recognizable along upper half. The nearer keep on the upper left, other on upper right, everything north of y 54 percent. In the foreground a broad continuous rocky observation shelf spans x 16 to 83 percent from y 57 to 88 percent, connected with a clear footpath exiting bottom center. The rock face of the nearer keep meets the shelf at x 24 percent near midline, with an unremarkable masonry seam near there suggesting a hidden postern. A low ledge on the right provides a view of the bridge. No people, no labels, no grid, no game UI. Muted iron blue and charcoal, gray slate and sparse amber torches, detailed evening lighting and rock textures.

**Open postern** · `art-test/dinyar-ridge-postern-v1.png`

Built-in image generator edit prompt: Make a precise localized edit to this exact 1586 by 992 wide detailed pixel art fortress game map. Change only a small patch at the very bottom of the near LEFT fortress wall, at approximately pixel x=375, y=550, 24% from left and 55% from top. The foot of the masonry wall touches the rocky foreground shelf around y=598 there. In that stone wall, open a narrow concealed postern, a roughly human-height small black rectangular stone doorway about 65 image pixels wide and 95 pixels tall, bottom flush with the existing rocky ledge at y=594. Make it unmistakably open, with two dim worn stone stair treads descending into darkness, dark recessed lintel, a hint of warm reflected light deep inside. The shifted door itself blends with the wall and sits to one side. It should appear just ahead of the player on the left shelf, BELOW every existing torch, gate, window and stair on the left fortress. Match the wall perspective, masonry texture and pixel clusters. Preserve the original source frame, scale, camera, viewpoint and all areas outside this tiny patch as exactly as possible, including foreground walking shelf, both keeps, bridge, cliff, sky, banners and all lighting. No characters, lettering, grids, glow or interface.

## Verification

The browser playthrough started from the Molthune checkpoint, followed the briefing, reloaded in Nidal, verified both playable rosters, and completed the ridge scouting and lower-approach plan. The final checkpoint loaded at 640×480 with no browser console errors. All 165 automated tests passed. The structural audit checked 158 scenes, 445 replays and 645 sprite frames.

The postern audit played replay 442 at 640×480, opened the door, reloaded on the ridge, and entered the lower works. The Reclamation watch objective loaded with no browser errors. All 174 tests passed, including all 476 replay checkpoints and a legacy lower-works save. The structural audit reported no geometry, frame or asset errors.

The teleport audit opened replay 437 at 640×480, observed the wayside spell, continued into Nidal with Draymus as the only playable character, and reloaded the arrival checkpoint. No browser errors appeared. All 174 tests passed, and the structural audit checked all 476 replays.

The belt audit opened replay 440 at 640×480, triggered Freya’s check by walking, reloaded with the seam marked, and used the normal J’Mal and Reese inspection to unlock the lower approach. The browser reported no errors. All 174 tests passed, and the structural audit checked 476 replays.
