# Barleybridge castle previews

The throne room and basement use the room functions and architecture of Foundry’s Daimyo’s Castle scenes `Scene.ybzNlXpccdIDQKkQ` and `Scene.N5lRVaQV5Wtjhg1n`. Their routes were condensed to the game’s 16-pixel grid. The Barleybridge Bowman’s portrait and masterwork composite longbow are documented in `Actor.1q0PfKGWLkwix4Rn`. The three sprite poses interpret that portrait. Foundry’s prepared token placements do not establish that the party entered the castle or fought these defenders.

After replay **464**, open **Current quest → Planning maps** and choose **Barleybridge · Gate and market**. Walk to the castle approach, then use the east stairs in the throne room to preview the basement. Both passages support return trips. Press **A**, **E**, or **Enter** at a marked stop and **X** or **I** to toggle walkable paths. Each floor is also available directly from the menu and in Longacre Art Studio. The Art Studio character gallery animates the bowman.

The passage locations and connections are game staging. The throne-room note describes prepared Foundry defenders, and the preview leaves the campaign save untouched.

## Councillor’s floor

Foundry scene `Scene.xLyKPIa4rbdZ1OEW` supplies the reference for the councillor’s meeting rooms, library and broad landing. Its prepared tokens include three Barleybridge Guardsmen, one Bowman and one Samurai. In the planning map, the throne room’s west gallery leads to the councillor’s floor. The floor’s return stairs take the marker back to the gallery. Inspect the meeting room and library along the way. The map condenses the Foundry layout, and the gallery connection is a game adaptation.

## Lord’s chambers

Foundry scene `Scene.iiniVv5xhDqdz7mp` shows the private quarters, including tatami rooms, a study and an eastern stair. Its prepared tokens include one Guardsman, one Bowman and one Samurai. The planning map condenses the floor around the private suite, study and open landing. Use **Trace route upstairs** at the east end of the councillor’s landing. The stair connection is an adaptation for the preview.

## Observatory

Foundry scene `Scene.TgwO6xXhcXfFGlKs` shows an upper observation floor and west balcony. The prepared placements include Lord Oda Nobunaga (`Actor.Dp2eF1CD16Bp3eJc`), a Guardsman, a Bowman and a Samurai. Inspect the marked observation floor for that placement note. The brass instrument and the route from the lord’s chambers are game adaptations. Players can trace the route and return in Planning maps.

## Castle roof

Foundry scene `Scene.H7MffmAjwdlYeF0W` shows the castle’s snowy roof with zero prepared tokens. The planning map adds a maintenance walkway and west lookout so the player can inspect the roof at handheld scale. The observatory’s east landing links to the roof, and the roof access returns to the observatory. The walkway and access route are adaptations.

## Artwork prompts

The built-in image generator produced these assets from written descriptions of the Foundry references. For the councillor’s floor, the in-game throne room supplied the style reference. The new map places the west staircase beside an open landing, with the council room and library above it.

- **Throne room** · `art-test/barleybridge-throne-v1.png` — Create a wide landscape 8:5 (1600x1000) detailed pixel art game map for a 640x400 fixed-size RPG called Barleybridge castle throne hall. Focus on the dark timber and tatami audience hall, short raised dais with a low seat, snowy central entrance, covered side galleries and wooden steps to adjacent floors. Lay the new scene out in orthographic overhead 3/4 view with the dais near top center and a broad clear open tatami lane stretching south to the entry at bottom center. An open right branch connects to an obvious stair door and a short left branch leads to a covered gallery. Place walls, pillars, floor lanterns and snowy rocks beyond the walked routes. Good game readability, continuous clear floor across x=19–80% y=45–86%, centered southern doorway. Rich crisp hand-placed pixel clusters, warm amber lamps, cold blue snow through openings, dark charcoal stained wood, subdued garnet, faded straw mats. No characters, writing, grids, UI, smoke or ornate invented insignia.
- **Basement** · `art-test/barleybridge-basement-v1.png` — Detailed pixel-art game map, wide landscape 8:5, 640x400 target, top-down three-quarter orthographic dark fantasy Japanese stone castle basement. One SINGLE large basement chamber, joined to a south central entry and a north central staircase. No interior walls at all: the stone walls are ONLY the exterior perimeter. The entire connected floor is one big T shape, left and right storage and common-room wings are freely accessible and seamlessly joined to the clear wide horizontal center aisle. North central stair against far wall, casks grouped against the upper left outer wall, furniture benches and lanterns against the upper right outer wall, and open gray flagstone walking area below the casks and benches from left to right. Wide open central foreground connects to a short south entry. Place all furniture out of the walking areas. No thresholds, no dividing walls, no railings or interior pillars, no characters, lettering, UI, markings, grid or insignia. Cool stone, warm light from lamps set on perimeter walls, deep shadows. crisp pixel clusters, matte hand-placed textured pixels. Restrained dark cutaway beyond outer walls.
- **Bowman** · `art-test/barleybridge-bowman-v1.png` — Create a single extra-wide 3:1 horizontal true RGBA sprite sheet with three separated full-body poses of the same adult woman archer, high-detail dark fantasy pixel art with crisp small clusters. Give the Barleybridge Bowman Tian features, black high ponytail tied with red cords, white neck wrap, bronze shoulder and arm plates, muted navy fabric and red boot wraps, feathered quiver, and red-brown composite longbow. Every pose faces screen-left with three-quarter front lighting and the same planted feet baseline. Left pose: bow held low at ease. Middle: draw the bow firmly and aim an arrow to screen-left, natural archery anatomy. Right: bow lowered after release, ready to nock again. All three figures and weapon tips entirely inside separate equal square cells, wide zero-alpha gutters, truly transparent RGBA outside the sprites including all feet, no scenery or floor, no halo, no lettering, no projectile outside the pose or decorative effect.

## Verification

All 174 automated tests passed. The map test found a route from each castle entrance to every labeled destination and checked the bowman’s three frame rectangles against the PNG bounds. The structural campaign audit checked 168 scenes, 475 replays and 657 campaign sprite frames with no geometry, frame or asset errors. A browser playtest walked the throne and basement previews, opened both through the Tathlum briefing, and verified the 640×480 game canvas with no console errors.

The linked-route audit opened the market from replay 464, walked to the throne room and basement, and returned through both passages at 640×480 without browser errors. All 174 tests passed, and the structural audit checked 476 replays and 659 frames.
