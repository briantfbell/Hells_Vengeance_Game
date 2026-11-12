# The Pass of Dark Rain

GM timeline row S138 places Freya’s visit to the Pass of Dark Rain and Draymus’s meeting with the Wight Mother on 10 Gozran, 4717. P001, “Fuck-It List,” describes the bargain to remove the Frost Giants, Reese killing a dire polar bear alone and crafting winter clothing, and the company finding an immense dragon skull with immobilized undead nearby. Draymus interprets the effect and ancestry as theories. The timeline leaves the precise dates of the hunt and the skull discovery open.

The Wight Mother’s appearance, layout, exact dialogue, bear statistics and timing of the ascent are game adaptations. The winter clothing and retained carcass are recorded in the inventory. The carcass carries forward for its documented use later in the mountain expedition.

## The frozen undead

Replay **421** lets the player inspect the storm giant skeleton and winter wights in either order. Both observations save, and the objective counts them before Draymus gives his interpretation of the ward. The individual examination points and the faint blue light are game staging for the recorded discovery. Earlier saves that already reached Draymus’s explanation can still proceed to the jaws.

## Through the dragon’s jaws

Replay 422 leads from the slope into the skull. Replay 423 starts inside the passage, where the party can follow the floor to the far side of the ridge. P001 describes the party passing through the skull. The cavern layout and faint ward lights are adaptations. Checkpoints from earlier builds that already completed the crossing still lead directly into Frost Giant territory.

## Artwork prompts

**Inside the dragon’s jaws** · `art-test/darkrain-jaws-v1.png`

New wide 8:5 landscape environment 1600 by 1000, designed to fill a 640 by 400 pixel RPG world. High-detail dark fantasy pixel art, orthographic overhead three-quarter game camera, clearly walkable ice cavern inside the fossilized jaws of a colossal ancient dragon in the snowy Pass of Dark Rain. Pale old jawbones and fractured ivory teeth on both sides frame the lower entrance x=50%, with large bony palate ridges and frost-covered slate walls along the edges. A broad connected central floor rises gently to a narrow exit opening toward a snowy mountain ridge at upper center. In the playable area keep the central path wide and unobstructed from x=30 to 70%, y=32 to 93%, directly connected to the south edge at x=50% and north exit. Ancient ochre-white bone with faint cold blue ice reflections, dark muted slate, soft snowlight through the north exit, restrained high contrast around rocky edges. Rich crisp hard-edged pixel clusters, calm eerie subterranean atmosphere, readable silhouettes. No humanoids, undead, living dragons, floor inscriptions, symbols, text, grid, border, UI, visual-effect particles, or visible horizon.

**Pass** · `art-test/darkrain-pass-v1.png`

Wide 8:5 orthographic overhead high detail dark fantasy pixel RPG map, Pass of Dark Rain in the mountains of Isger. Bleak dark slate ridges, sparse charcoal pines, wet boulders and sheets of gray mist at edges. Broad open weathered dirt and stone ravine x=19–81%, y=40–85%, centered south and north path entrances. In the far upper edges only, small rows of distant indistinct undead silhouettes against fog, with an empty central place for an audience. Cold gray green and desaturated silver. Hard pixel clusters, no foreground figures, letters, borders or UI.

**Dragon skull** · `art-test/darkrain-skull-v1.png`

Wide 8:5 overhead orthographic high detail dark fantasy RPG map on a cold snow-covered mountain. Enormous ancient white dragon skull at upper center, teeth and jaw forming a walkable passage into darkness, around x=28–72% y=2–46%; clear flat frozen approach x=18–82% y=48–87%, centered southern entry. A giant humanoid skeleton frozen motionless along far left near the skull, and two small icebound wight silhouettes far right near rock edge. Keep all figures out of walking area. Pale blue moonlight, muted cold stone, crisp rich pixel clusters. No living figures, lettering, UI or grid.

**Wight Mother** · `art-test/darkrain-wight-mother-v1.png`

One full-body dark fantasy detailed pixel art sprite with true transparent background. Wight Mother of the Pass of Dark Rain, a tall formidable adult undead necromancer devoted to Urgathoa, desiccated pale face with sunken eyes, layered dark gray-green robes and tarnished bronze clasp, long straight gray hair, long staff, calm poised authority. Readable three-quarter front silhouette with full head and feet. Hard refined pixel clusters, no gore, glowing aura, shadows, mist, floor, symbols, words or other characters.

**Dire polar bear** · `art-test/darkrain-dire-bear-v1.png`

Wide horizontal three-frame sprite sheet on true RGBA transparent background. Same enormous realistic dire polar bear in all three, dense off-white fur, dark small eyes and black nose, three-quarter front-left facing left. Frames ready on four paws, forward swiping with one raised paw, shifted ready on four paws. Full legs, head and paws, wide fully empty gutters. Detailed hard-edged dark fantasy pixel-art clusters. No shadows, paper, floor, snow, text, blood, halo or other creatures.

Keep the exact three left-facing dire polar bear poses, scale, framing and order. Clean the white background, light gray texture, halo and every floor shadow from the three-frame pixel sprite sheet, preserving the white fur. Return true transparent PNG alpha with empty zero-alpha corners and gutters, and zero alpha under all feet. Keep all fur and claw edges sharp and all four paws fully visible. No new art.

## Verification

The browser playthrough continued from the Nidal lair, completed the bargain, climbed to the skull, and won the bear fight as Reese alone. It reloaded after the hunt, made winter clothing, and reloaded the completed crossing at 640×480 with no console errors. All 162 automated tests passed. The structural audit checked 152 scenes, 426 replays and 639 sprite frames.

The frozen-undead audit played replay 421 at 640×480, inspected the wights first, reloaded at [1/2], inspected the skeleton, and heard Draymus’s explanation before the jaws objective appeared. No browser errors appeared. All 174 tests passed, and the structural audit checked 476 replays.
