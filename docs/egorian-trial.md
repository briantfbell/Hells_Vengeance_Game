# Oppian’s trial and Zara Geitta

Continue from the dawn checkpoint at Falco Manor or select replay **166 · Answer the court summons**. Replays **166–173** cover the summons, testimony, verdict, the forge, and the return to the manor.

“Mid-day Cowboy” (P034) records the six hours of testimony from Freya and Jason, the high-treason verdict, Zara’s ride with Freya, and the handover at the forge. The in-game testimony summarizes the capture and escort already played. The actual testimony is not transcribed in the campaign account. The magistrate and smith designs and the courtroom and forge layouts are interpretations. Zara and Oppian reuse their existing likenesses.

P034 places the forge in Thumbtown. “The Spoils of Wha?” (P036) describes the forge as being in Longmarket. The game follows P034’s location and encounter sequence. P036 records the suit as custom adamantine plate providing +12 armor bonus, DR 3/–, a maximum +2 Dexterity bonus, a −4 armor check penalty, a weight of 45 pounds, and 30-foot movement for Freya. The game’s AC already incorporates equipment and does not track those tabletop movement, weight or Dexterity rules. In the game the commission is replaced by fitted gear that adds +2 to Freya’s existing AC and reduces incoming physical damage by up to 3 per hit. Guard then applies to the remaining damage. The fitting does not consume resources or alter the equipped weapon. Freya uses a nine-frame set of armored exploration sprites after fitting. Weapon-ready armor art will be added with the next relevant combat scene.

## Verification

The browser playthrough started from the existing manor checkpoint, covered both witnesses and the verdict, and verified the solo forge visit. Reloading at the forge preserved Freya’s armored sprite and fitted equipment, and the manor reload restored the full party. The game stayed at 640×480 and logged no browser errors. The automated audit checked 89 scenes, 173 replay checkpoints, and 510 sprite frame references. Regression tests verify that the fitting requires the verdict and that physical reduction applies before Guard.

## Generated artwork

Built-in image generation was used for the following assets. The existing Freya sheet was supplied as the reference for her armored sheet.

### Courtroom

`art-test/egorian-court-v1.png`

High-detail pixel-art dark fantasy JRPG playable map foreground, 8:5 horizontal aspect to occupy a 640x400 map region. Overhead orthographic three-quarter camera, level and symmetrical, crisp colored pixel clusters, robust readable paths at handheld scale. Objects sit on the ground with plausible readable footprints, no implied horizon. Genuine transparent pixels outside the floor and walls. Leave clear paths and wide floor area for NPCs. No characters, people, UI, text, letters, grid or picture frame. An imposing Chelaxian imperial courtroom in Egorian, obsidian and gray granite with dull brass lines and restrained dark red fabrics. Upper central wall raised judge bench beneath a crimson five-point star and tall dark arched windows, gavel and parchment visible only as small props. At upper left a witness rail with clear standing space in front, upper right a small defendant dock with rail and clear aisle access. Straight red runner from bottom center entrance into broad unobstructed open floor across the center. Side seating pushed to the far edges. Daylight shafts reflect in stone; candle sconces add warm local contrast.

### Thumbtown forge

`art-test/egorian-thumbtown-forge-v1.png`

High-detail pixel-art dark fantasy JRPG playable map foreground, 8:5 horizontal aspect to occupy a 640x400 map region. Overhead orthographic three-quarter camera, level and symmetrical, crisp colored pixel clusters, robust readable paths at handheld scale. Objects sit on the ground with plausible readable footprints, no implied horizon. Genuine transparent pixels outside the floor and walls. Leave clear paths and wide floor area for NPCs. No characters, people, UI, text, letters, grid or picture frame. Large, tidy Thumbtown blacksmith's workshop in Egorian. At the upper middle is an empty wooden armor display stand on a modest low platform, with no armor on it. It is cleared of other work. South-facing entrance at bottom center with a broad worn stone floor and straight approach to stand. Upstage forge and chimney to the left with low embers, anvil and tongs at the left edge, quiet neatly folded blanket and pillow on a cot near the upper-right wall, shuttered right window admitting a narrow sunlight shaft across the display. Crimson and blue-black metals, amber day and hearth. No other armor or racks of weapons. Main playable floor spans x 27% to 73% from y 38% to 80%.

### Blacksmith

`art-test/egorian-thumbtown-smith-v1.png`

A single transparent full-body high-detail 16-bit pixel-art RPG sprite of an unnamed Egorian blacksmith. Small and muscular older man with pale gray close cropped hair and short gray beard, a broad warm smile, rolled off-white sleeves, russet leather blacksmith apron, work trousers and leather boots. Slightly overhead three-quarter front RPG perspective, both eyes and both feet visible. Human adult with believable proportions, unarmed, warm presence. Clean deliberate clusters, crisp boundaries, colors that read against dark stone. Genuine transparent background. No smoke, cast shadow, ground, UI, lettering, or other poses.

### Armor display

`art-test/zara-geitta-display-v1.png`

A single isolated high-detail 16-bit pixel-art RPG object sprite of a complete articulated suit of Hellknight plate armor displayed upright as if on a hidden mannequin, front-facing with slight three-quarter overhead RPG camera. No human or mannequin head. The deep blackened crimson adamantine appears almost black in shadow and shows subdued wine-crimson edges on planes facing sunlight. Ridged steel, layered pauldrons, fitted waist, articulated knees and fingers, shaped armored boots, dignified martial geometry with slightly infernal motifs. Pair of open gauntlets relaxed at sides. Bare display support is handled by the game map; do not add a platform. Deliberate pixel clusters and crisp edge. Real transparent background and isolated clean silhouette, no text or props.

### Freya in Zara Geitta

`art-test/freya-zara-geitta-walk-v1.png`

Use the supplied Freya sprite sheet as character identity and pose-layout reference. Make a NEW portrait-oriented 3 columns by 3 rows sprite sheet for the same woman wearing her new Hellknight plate. Row 1 faces forward, row 2 faces right, row 3 faces back. In EVERY row the left column stands ready, middle column takes one walking step with left foot forward, right column the same step with right foot forward. Three separate full body sprites per row. Exact uniform spacing, fixed camera and silhouette scale, all feet fully visible and aligned to the same row baseline. Keep Freya's long loose dark brown hair, face, build and human proportions from the reference. No helmet; visible face in front and side. Fitted broad pauldron plate, ridged articulated blackened crimson adamantine with restrained dark wine-red highlights, predominantly nearly black. Subtle infernal martial styling in metalwork, no bright red cloth or exaggerated spikes. Weapon stowed. High-detail 16-bit JRPG pixel clusters, crisp outer pixel edges. Real alpha background throughout and completely empty wide gutters. No text, grid dividers, extra figures or items.

### Magistrate

`art-test/egorian-magistrate-v1.png`

Single isolated high-detail 16-bit dark-fantasy RPG pixel sprite of an unnamed imperial Chelaxian magistrate, seated facing forward at an unseen tall bench. Upper body only, from stern graying head down to the lower chest, shoulders draped in an austere black robe with subtle muted crimson collar and a small bronze clasp. Hands below the bottom edge. No chair, table, gavel or backdrop. Use genuine full transparency, no cast shadow or halos, crisp deliberate clusters at the silhouette, grounded proportions and an unobtrusive official appearance. A subdued warm edge light reads against dark gothic courthouse stone. No text or UI.
