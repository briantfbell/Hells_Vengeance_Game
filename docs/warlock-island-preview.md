# Warlock Island map previews

The GM timeline lists the Archive of Redacted Histories on Warlock Island as a planned target. The Foundry folder Book5 / Warlock Island Library includes Magic Library (`Scene.AHKdFTaUaJ1sP66c`) and Museum Archives (`Scene.AKXADR2Bz9BDgrpN`). Their exported layouts informed the circular stacks and the divided museum wing. The exact arrangement of walkable routes and the marked destinations are game layout decisions.

Open Longacre Art Studio and choose either Warlock Island environment. Focus the map and move the marker with arrows or WASD. Show walkable tiles to inspect the routes. After reviewing the Tathlum briefing in replay **464**, open **Current quest → Planning maps** and choose either Warlock Island environment. Walk to the marked passage and press **A**, **E**, or **Enter** to move between the library and archive. The reading dais, document stacks, and display gallery offer route notes. Use **X** on a controller or **I** on the keyboard to toggle paths. The link between the two maps is planning-stage layout, and the expedition’s outcome remains open. The route preview leaves campaign progress and saves untouched.

## Artwork prompts

The maps were created with the built-in image generator.

**Circular Library** · `art-test/warlock-library-v1.png`

Create a game-ready 8:5 wide environment for a 640x400 high-detail dark fantasy pixel RPG, orthographic overhead 3/4 view. Warlock Island’s ancient circular library, inspired by a VTT room with two concentric curving bands of shelves, a small circular blue-slate mosaic at the central reading dais, symmetrical bookshelves to both sides, dark worn wood, gray-green flagstone, dim antique brass lamps. Leave a wide straight southern approach from a centered entrance at bottom to the circular dais, and an open looping aisle around the dais with at least one exit toward upper right. Low furnishings and readable routes. Crisp dense hand-placed pixel clusters with warm gold-brown highlights. Empty room, no people, no combat, no smoke, no fire except small lamps, no text, numbers, UI or tile grid.

**Museum Archive** · `art-test/warlock-archive-v1.png`

Create a game-ready 8:5 wide environment for a 640x400 high-detail dark fantasy pixel RPG, orthographic overhead 3/4 view. A connected wing of the ancient Archive of Redacted Histories, based on a VTT museum archive: restrained timber interior, left side darker recessed document stacks and a low examination desk, central modest rectangular stone display chamber against upper wall, right side a warm larger gallery with low glass cases and long shelving along the upper and right walls. Entry at lower center and an open broad east-west aisle across y 60–84%, plus a clear branch north at right. Gray-blue stone, old oak, brass and muted lantern light. Crisp compact readable pixel clusters. The scene is intact and unoccupied. No flames, smoke, characters, lettering, UI, or grid.

## Verification

Both preview maps and the path overlay loaded in the browser without console errors. Keyboard movement reached the reading dais and display gallery. The automated route test verified all four marked destinations are reachable from their respective entrances on the game’s 16-pixel grid. All 169 automated tests and the campaign structural audit passed.

The linked-route audit opened both floors from replay 464 at 640×480, inspected the reading dais and display gallery, toggled the path overlay, walked through the passage in both directions, and returned to Barleybridge with no console errors. All 174 tests passed. The structural audit checked 168 scenes, 475 replays, and 659 sprite frames.
