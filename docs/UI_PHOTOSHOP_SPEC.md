# Photoshop UI artwork sizes

All sizes below are **native game pixels**, width × height. The game remains a fixed **640 × 480** canvas (4:3), including combat. Desktop enlargement does not change these artwork dimensions.

Export transparent PNGs at 1×. Keep text out of the artwork so dialogue, quantities and names remain editable. Use the supplied title art's dark iron, blood-red enamel and aged brass palette. Square pixel edges are welcome. Reserve 12–16 px around decorative borders for text safety. Avoid painting anything important into the transparent centre.

## Fixed frame assets to make first

| Asset filename | Size | Purpose |
| --- | --- | --- |
| combat-screen-frame.png | 640 × 480 | Optional outer combat border with transparent centre |
| transition-frame.png | 640 × 480 | Location transitions; full-screen blank frame |
| decree-parchment.png | 640 × 480 | First posted decree; aged parchment with blank writing area |
| dialogue-frame.png | 608 × 176 | Ordinary dialogue; placed 16 px from either side, 12 px above bottom |
| dialogue-choices-frame.png | 608 × 224 | Dialogue with choices; same placement, grows upward |
| portrait-frame.png | 64 × 64 | Speaker headshot border; transparent centre |
| dialogue-choice.png | 290 × 40 | Two-column dialogue choices; runtime width is 290.4, rounded for export |
| dialogue-continue.png | 96 × 28 | Dialogue Continue button |
| combat-dock.png | 640 × 112 | Entire bottom combat strip; includes 20 px header |
| combat-log-frame.png | 276 × 92 | Current action and last two actions, beneath header |
| combat-actions-frame.png | 364 × 92 | Right command region beneath header |
| combat-command.png | 174 × 38 | Attack/Skill/Guard/Potion cards in two columns |
| combat-command-small.png | 114 × 38 | Cards in three columns when extra actions are available |
| dice-frame.png | 198 × 104 | Top-left roll overlay |
| transition-continue.png | 120 × 32 | Minimum Continue button size; allow longer captions to expand |

Combat background is a separate **640 × 368** image above the dock. Do not bake the log, dice or command boxes into it.

The dialogue portrait is at the upper left inside the frame, with speaker title above the text. Choice buttons appear below the text. Do not include a permanent vertical divider: portraitless Chronicle dialogue uses the full width.

## Secondary assets / reusable borders

| Element | Native size or behavior | Recommendation |
| --- | --- | --- |
| Party health label | 76 × 27 for up to five; 68 × 27 for six | Two variants or one scalable border |
| Enemy health label | 88 × 27; 72 × 27 with five enemies | Two variants or scalable border |
| Enemy intentions panel | Content-dependent height, narrow left panel | Reuse dice frame/border; do not bake text |
| Initiative, pause, character selection, progression | 640 × 480 outer overlays | Reuse transition border; interior layout is dynamic |
| Title main menu | Approx. 320 × 250; load/settings can be wider | Reusable border; preserve title art above |
| Interaction prompt | Width follows its caption | Sample 320 × 28; scalable border |
| Inventory, quests, character details | Pages inside the pause overlay | Reuse full-screen frame and menu-row borders |
| Objective/task HUD | Width depends on task, maximum about 352 px | Scalable border; sample 352 × 44 |
| Pause/menu rows | Width and height depend on menu contents | Sample 300 × 40; scalable border |
| Initiative cards | Count/layout depend on combatants | Scalable border rather than fixed full card |
| Target selector/header | 20 px tall inside combat dock | Style as part of dock; dynamic target text |

The secondary sizes are **not all fixed containers**. A nine-slice border is best: corners stay fixed, edges stretch, centre remains transparent. A 48 × 48 border sample with 12 px corner slices is sufficient. Offer selected/focused and disabled versions of command/choice buttons, or separate transparent highlight overlays. Keyboard focus needs to remain clearly visible.

## Parchment wording

Keep the decree text live if possible; its wording may require future lore corrections. The initial notice uses six privately / twelve publicly, with family and business exceptions, closure of the western gate and writs for the other gates. The unverified five-person restriction is not included. A baked-text 640 × 480 parchment can be supported later, but it would need a readable text equivalent alongside it.

Place final exports in `art-test/ui-skins/` using the filenames above. These are the integration targets; there are no missing-image requests for Photoshop assets before they are supplied.
