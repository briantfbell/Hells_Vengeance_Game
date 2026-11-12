# Hinji’s naval shipyard

P015, “A Vacation from Virtue,” places the shipyard operation between Remesiana and Westcrown and records the party’s interference with the naval promotion chain. GM timeline row S092 dates the outcome to 4717.02.18. Nathin Barksdale declines promotion to Admiral and the post goes to Rear Admiral LeBeau.

The dock layout, officer designs, dialogue, and the handling of the refusal as a dispatch-docket interaction are provisional adaptations. Replays 292a–292d cover the trip and promotion sequence. Replay 293 retains its number and now starts at the shipyard’s departure for Westcrown. Existing saves from Westcrown or later still load without requiring Hinji.

## Artwork and built-in ImageGen prompts

**Shipyard** · `art-test/hinji-shipyard-v1.png`

Single wide 8:5 top-down orthographic map for a high-detail handheld dark fantasy pixel RPG. Hinji naval shipyard in Cheliax, twilight. Across the upper third are three points of interest: a small harbor administration booth with ledgers at upper left, a naval timber warehouse and dispatch board at upper center, and a shipwright’s covered entrance at upper right. The entire central area is broad unobstructed dark cobblestone with a few markings for cargo, x=10%-90%, y=42%-76%. Bottom edge has a weathered stone quay and simple narrow pier center, with fully transparent RGBA below the quay and around the pier from y=83% to 100% for moving water. Opaque land and structures, fine hard pixel clusters, slate blues and weathered red, subdued amber lights, no people, lettering, UI or readable signs.

**Barksdale and LeBeau** · `art-test/hinji-officers-v1.png`

Two separate full-body transparent pixel-art RPG sprites side by side, each wholly in its own half with a wide empty vertical gutter, matching feet height. Left is naval officer Nathin Barksdale, sturdy middle-aged man with deep brown skin, short-cropped hair and slate-blue naval coat, subtle brass buttons and plain boots. Right is Rear Admiral LeBeau, lean older man with light brown skin, short gray hair and a navy-blue officer’s coat with dark maroon trim, plain belt and boots. Distinct silhouettes, neutral three-quarter front views, natural proportions. Rich fine hard-pixel clusters. True RGBA zero outside the sprites, no shadow, weapons, scenery, text, or additional figures.

The transparent canal edge and pier sit over the game’s animated water layer.

## Verification

All 142 tests passed. The structural audit checked 75 scripts, 123 scenes, 308 replay points and 588 sprite frames. The browser loaded a pre-Hinji post-Efisio save, then played the inserted section from the harbor. The refusal and Westcrown arrival checkpoints reloaded at 640×480 and the browser logged no errors.
