# Story, replay and townsfolk polish

Implemented 2026-10-09.

- Dialogue actions use brackets; quoted or plainly spoken responses remain speech. Viggo’s third choice is [Kneel before Viggo].
- Tannery scouting starts with J’Mal alone at (136,280), on the left interior path. Only Scout the tannery is available. The selected campaign lead and full active roster are retained in the save and return when the party enters after the commotion. A reload before scouting preserves the solo staging.
- Blog P049 establishes that the failed sap ambush targets the owner’s dog, not the owner. New lines connect the farmer’s departure, J’Mal leaving the vat, his intended attack on the dog, barking, the owner emerging with his crossbow, and the party arriving. Bath narration introduces the unexplored upstairs room, dirty water with no visible bather, and J’Mal going ahead while the others wait on the landing. The safe word and the spirit’s remembered fire are explained. The sermon receives a brief introduction to Allamar and her sons.
- Combat formation platforms and active-actor circles are removed. Enemy horizontal spacing increases by 16 logical pixels, anchored on the rightmost opponent. The current action and preceding two actions do not change on hover, focus or target selection; action details stay on the cards and their accessible labels/tooltips. Confirm/back hints remain in the header.
- Travel summaries put each sentence on its own line; small-screen styles keep the cards within the shared game frame.
- Admin Replay section offers 15 curated section starts with appropriate story flags, level, roster and replenished resources. These are testing entry points, not recovered historical character snapshots. A separate local backup preserves progress before the first replay; Return to prior progress restores it. Replay is unavailable during a fight, dialogue, level-up or journey. Portable save format stays unchanged.
- Rhona and her two deputies move two tiles left and two down in the western gate/jail map. The dismissal interaction moves with Rhona.
- Four new ordinary civilian designs appear in Kintargo, Remesiana, Longacre square and the gate/jail area. The sermon has eight stationary spectators facing Allamar; afterward the crowd gives way to a few townsfolk. Other citizens pause between slow, short path-constrained walks, avoid key interaction points and the party, and offer one-line original ambient dialogue. They do not block pathfinding. Reduced motion freezes their walking.

## Sources and art

Narrative factual changes follow Pathfinder Campaign RPG Gift/Pathfinder_Gift_01_Reference/Pathfinder_Campaign_RPG_Gift/raw_posts/P049.txt. Ambient citizen lines and unspecified staging are adaptation choices, not campaign evidence.

Generated with the built-in image-generation tool. Saved artwork: art-test/townsfolk-sheet-v1.png. Frame bounds: art-test/townsfolk-frames.json. The original generated alpha is retained; frame metadata identifies front idle, two opposing front steps, back idle and profile idle. Four consistent clothing variants are reused for anonymous background citizens.

Final generation prompt:

Use case: stylized-concept. Asset: transparent pixel-art sprite atlas for background townspeople in a dark medieval fantasy RPG. Generate exactly 20 full-body sprites on a strict 4-column by 5-row grid, equally spaced cells, transparent background with NO labels, borders, shadows, scenery, weapons or text. Each column is one consistent civilian: column 1 older male laborer in muted moss-green wool coat and cap; column 2 female market worker in muted brown dress, apron and headscarf; column 3 male villager in charcoal blue tunic and worn boots; column 4 female villager in dusty plum dress and shawl. All ordinary peasants, calm neutral expressions. Each column repeats its same character with identical clothes/body proportions in all rows. Row 1 front facing idle; row 2 front facing LEFT FOOT forward walking; row 3 front facing RIGHT FOOT forward walking; row 4 BACK facing idle, truly showing back of head and clothes, no face; row 5 right-side profile idle. Consistent elevated 3/4 top-down RPG camera and subtle overhead warm lighting, detailed layered cloth, seams, leather belts, fabric wear. Highly detailed crisp pixel art with restrained dark earthy palette and fine pixel shading, matching a high-detail gothic fantasy pixel sprite game. Never chibi or simple flat block shapes, never photoreal or painterly. Characters fill 80% of each cell height, centered horizontally with feet at a common baseline, clear transparent gaps between every character. Suggested overall atlas 1024x1280 or equivalent 4:5 ratio. Preserve true alpha transparency.

## Checks

All 15 section starts validate as saves and the saved return point round-trips. Tests cover sole scout interaction and party reunion, citizen conversation and back-facing crowd, bounded path movement and reduced motion, shifted NPC coordinates, unchanged combat log during hover/focus/targeting, sentence-separated travel cards at 320px, unchanged screen bounds, keyboard combat, and complete chapter-two/three walkthroughs.

