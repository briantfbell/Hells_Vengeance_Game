# The assault on Citadel Dinyar

The GM timeline row S143 records that Parnoneryx was slain at Citadel Dinyar on 15 Gozran, 4717 and that his head was taken. Foundry Player Notes, `JournalEntry.EltOc6EXYEwl4A16.JournalEntryPage.ch0MchgiPuWLvgku`, also record that the citadel was cleared and a gold dragon head was obtained. The note bears the label 11/05/2023. Its date format is unresolved, so the game uses the GM timeline’s in-world date.

The blog P001 establishes the concealed entrance, the party of Freya, J’Mal, Reese and Jason, and their hope of finding surviving Godclaw Hellknights in the dungeons. The approach through the cells, the Reclamation watch, the positioning of the dragon at the bridge, and the dialogue are game adaptations. The party checks a set of cells and gets no reply. The fate of any surviving prisoners remains open.

Foundry actor `Actor.nV7jJKWRctqtUVtW` lists Bite & Claws, Wing Slam, and dragon breath among Parnoneryx’s attacks. The game adapts them into a three-round rotation. HP, attack bonuses, targeting, and the timing of the breath are game balance decisions. The actor’s portrait and journal image were unavailable in the archive, but the prototype token was recovered and informed the sprite’s palette and profile.

At replay **447**, Parnoneryx lies intact at the bridge ward after the fight. Recovering the head adds the quest item and switches to a matching pose with a stylized cut neck. The fallen body and trophy state follow the saved quest flags. The pose and recovery staging are adaptations of the recorded outcome.

## The Dinyar dispatch

Foundry Player Notes page `ch0MchgiPuWLvgku` records the party’s intention to resurrect Hellknight Scipio alongside the result at Dinyar. Foundry actor `Actor.s5BDCmBTYIdV3vOj` supplies his name. The notes do not establish where he died, whether the party found his body at Dinyar, or whether a resurrection happened. Replay 449A presents the note as an optional dispatch after Freya’s promotion in Egorian. The timing and placement of the dispatch are adaptations. Reading it records the intention in the journal and leaves the main departure available.

## Artwork prompts

Created with the built-in image generator.

**Lower works** · `art-test/dinyar-lower-works-v1.png`

Wide landscape 8:5 playable 640x400 map for high detail dark fantasy pixel RPG. Top down orthographic 3/4 view of Citadel Dinyar lower works of gray slate and iron gray masonry, entering via secret postern from center bottom. Old stone dungeons with two rows of barred empty cell doors recessed into left and right north walls, old chain hooks and cold lanterns. A central staircase leads up at x 50%, y 36%. Keep all the middle area from x 21% to x 79% and y 45% through y 86% clear continuous walkable stone, center walkway to bottom. Rough mountain rock, soot, subdued steel blue and a few amber lights. Painted pixel clusters, clear world scale for 38 pixel actors. No people, weapons on floor, game grid, signage, text or interface.

**Bridge ward** · `art-test/dinyar-bridge-ward-v1.png`

Wide landscape 8:5 playable 640x400 map for high detail dark fantasy pixel RPG. Top down orthographic 3/4 view of an upper stone ward at Citadel Dinyar between two rocky mountain keeps. The player stands in a broad gate court on the near end of a narrow masonry bridge, which extends from center of the upper edge of the court over a deep mountain chasm toward a distant keep. Bridge crosses upper half, gate court with ash stained flagstones spans x 15 to 85 percent from y 50 to 86 percent, central stair emerges at bottom center, no clutter in walkable area. Cold blue-grey rock and low amber torches, austere medieval fortress architecture, dusk. Crisp small pixel clusters. No people, no dragons, no text, game grid, or UI.

Precisely remove the single tiny humanoid standing on the gray flagstones in the exact center of the foreground court (halfway across and about 69% down). Replace only those few pixels with matching empty slate paving. Preserve the pixel-art style, the original 8:5 crop, bridge, steps, towers, chasm and all architecture and color as closely as possible. The result must contain no figures, no characters and no dragons.

**Parnoneryx** · `art-test/parnoneryx-v1.png`

A 3:1 wide video-game spritesheet, three poses of a single gold dragon, exported as cutouts on actual transparent PNG canvas. The pixels outside silhouettes are alpha 0, including under the feet, between poses and along the whole border. No white pixels or haze outside the silhouettes, no shadow or outline glow. Each sprite facing screen left, in its own equal-width cell with padding, all feet at same baseline, consistent character scale. Winged quadruped with amber gold scales, bronze layered neck plates, two backward sweeping horns, an elongated wedge-shaped muzzle, broad leathery muted-gold wings, curled tail. Pose 1 grounded alert, pose 2 neck thrust toward bottom left with jaws open for a breath attack (no flame), pose 3 slightly raised head and wing. Crisp handmade dark-fantasy pixel art, defined pixel clusters, compact readable shapes, no text. Only these three separate dragons against fully empty alpha.

**Fallen Parnoneryx** · `art-test/parnoneryx-fallen-intact-v1.png` and `art-test/parnoneryx-fallen-after-recovery-v2.png`

The built-in image generator created the intact fallen pose with the head resting on the ground, the neck clearly connected to the chest, and the wings folded back from the shoulders. A matching edit removed the head and gave the neck a flat oval cut with a gold-scaled rim, muted red interior, and a small ivory center inspired by the supplied cartoon ham reference.

## Verification

The browser playthrough started from the Dinyar scouting checkpoint. It defeated the watch, searched the cells, climbed to the ward, defeated Parnoneryx, reloaded before taking his head, and reloaded the final checkpoint. The game ran at 640×480 with no browser console errors. All 166 automated tests passed. The structural audit checked 160 scenes, 451 replays, and 649 sprite frames.

The follow-up audit opened replay 447 at 640×480, recovered the trophy, inspected it in inventory, and reloaded the cut-neck pose with the Egorian objective. All 174 tests passed. The structural audit checked 168 scenes, 475 replays and 659 sprite frames with no asset, frame or geometry errors.
