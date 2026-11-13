# El Guapo scouts Barleybridge

Foundry Player Notes, `JournalEntry.EltOc6EXYEwl4A16.JournalEntryPage.Ktv9CUolBTWrhvGW`, say El Guapo has already deployed to Barleybridge as a forward scout. The rest of the company expects limited paladin presence and plans to follow. The note gives no scouting report. This section depicts a first look at the crossing and gate from the far bank. The dialogue, route markers, and exact scouting position are game staging.

The snowy riverside setting is based on Foundry scenes `Scene.5vgQuoZspvon4viX` and `Scene.Ax0LoKdKYNJRQDAH`. The scene tokens show prepared placements. They do not establish arrival, fighting, or ritual outcomes.

The GM timeline row S147 plans for blood from 100 slain innocents at Barleybridge, while the Player Notes give 1,000 in a single day. The game leaves the quantity unresolved. Row S148 identifies the planned library as the Archive of Redacted Histories on Warlock Island. Row S149 plans for Queen Abrogail to complete the Tathlum ritual. The Foundry Warlock Island Library folder includes two prepared maps with no placed tokens, `Scene.AHKdFTaUaJ1sP66c` and `Scene.AKXADR2Bz9BDgrpN`. No record reviewed for this section establishes that the Barleybridge objective, archive fire, or completed Tathlum occurred.

The plan card and journal preserve a distinction between S147 and S151. The first lists a Barleybridge objective as planned. The second reports the events at St. Ilnius and names an ancient library as the last component. The surviving accounts do not explain what happened to the Barleybridge requirement. The game presents its outcome as unknown.

## Artwork prompt

The Barleybridge approach map was created with the built-in image generator and saved as `art-test/barleybridge-approach-v1.png`.

Wide 8:5 landscape orthographic overhead three-quarter RPG map, richly detailed hand-crafted dark fantasy pixel art. Edge of a snowy mountain town based on a feudal Japanese river town: a dark-timber snow-covered gate and low roof silhouettes in the upper right, one modest wooden bridge over a cold river toward the left, pine forest and distant mountains. Camera stands on the near bank at dusk. One broad continuous snow-packed dirt shelf from x 18% to 83%, y 49% to 87%, ending in a trail out of bottom center. A route approaches the near bridge rail at x 25%, y 48%; a sheltered lookout behind a short fence near x 73%, y 55% gives a view of the gate. Amber lanterns, faded slate-blue snow shadow, careful crisp pixel clusters. No people, animals, text, UI, signage, symbols or grid. Leave the walkable foreground completely open.

## Verification

The browser playthrough continued from the St. Ilnius checkpoint, verified El Guapo was the only playable member, and reloaded after the crossing and after the report. The game ran at 640×480 without console errors. All 168 automated tests passed. The structural audit checked 165 scenes, 467 replays and 657 sprite frames.

## Playable briefing

Replay **464** presents the plan as three consecutive journey cards from El Guapo’s completed scouting checkpoint. It records the plan in the journal without advancing the outcome of any of the three objectives. The browser audit checked each card’s content and order and reloaded the handoff at 640×480 without console errors. All 168 automated tests passed. The structural audit checked 165 scenes, 468 replays and 657 sprite frames.

The final briefing card points players to **Current quest → Planning maps**, which remains available after reloading. El Guapo can still walk on the near bank. Select **Barleybridge · Scout’s approach** to inspect the crossing and trace a continuous planning route through the market and castle. The market’s south entrance returns the planning marker to the near bank. This route leaves the saved party outside town. Use the direction controls to move the planning marker. At Barleybridge and Warlock Island, confirm inspects a stop or uses a passage, and X or I toggles walkable paths. Back returns to the quest menu. See [the Warlock Island route notes](warlock-island-preview.md) for the linked library and archive.

The river uses clipped water regions beneath the still bridge, banks, and shelter. Small pixel highlights drift horizontally with the current. Reduced-motion mode renders the original still water.

## Questions for the campaign record

- After El Guapo scouted Barleybridge, did the rest of the company reach the town? What did El Guapo report, who was there, and what happened next?
- The GM timeline lists blood from 100 slain innocents, while the Foundry player notes say 1,000 in a single day. Which was the requirement at the table, and was it ever fulfilled?
- Did the company reach the Archive of Redacted Histories on Warlock Island? If they did, who was involved, what happened at the archive, and were its ashes applied to Parnoneryx’s head?
- Did Queen Abrogail receive the prepared head, and did she complete or use the Tathlum? What happened in Westcrown after Freya’s assignment?

The river and planning handoff were checked in replay 464 at 640×480 with no browser errors. A renderer check confirmed that visible highlights change between frames inside the clipped river and that reduced motion draws zero current highlights. All 174 tests passed, and the structural audit checked 476 replays.

## Party boat epilogue

The invitation, banquet and toast are original epilogue material. Continue and export/import preserve the boat and banquet state.

The built-in image generator produced `art-test/guapo-party-boat-v1.png` using the following prompt.

> Create a single production-ready pixel art game map background for a dark fantasy RPG, wide landscape 8:5 for a 640 by 400 viewport. Orthographic overhead three-quarter game camera. El Guapo's rented pirate party boat, richly decorated, festive and inviting at dusk. Compose the aft banquet deck as a wide rectangular railed stage, dark oak planks running from a clearly recognizable boarding gangplank at bottom center to a raised stern cabin beyond the top. The deck occupies x 15–85 percent. A single long feast table across the UPPER THIRD, fully visible and loaded with roast, fruit, bread, goblets and bottles, table height and chairs believable beside 50 pixel tall sprites at final resolution. Keep the entire middle and bottom deck (x 20–80 percent, y 45–86 percent) absolutely empty and walkable. Several recognizable round festive balloons tied in small bunches by the cabin and rails, coral red, warm gold and plum. Warm lanterns and bunting, ornate aged brass, red fabric, quiet indigo sea around the hull, calm shoreline-free night. Crisp deliberately placed pixel clusters, highly detailed art like a late 16-bit dark fantasy RPG, rich yet restrained palette. No characters or creatures, words, signage, UI, grid, frame, modern party hardware, sails or ropes obstructing the view. Strict overhead three-quarter playable view with objects placed to leave large clear play space. PNG.
