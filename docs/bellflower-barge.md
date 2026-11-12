# The Bellflower barge

GM timeline row S119 records the Bellflower Network attacking Draymus and company’s party barge in Egorian on 20 Pharast, 4717 and forcing the company to retreat. P004, “Choices,” describes Corrine assigning the operation, the bait of a halfling fighting ring, Draymus hosting and being badly wounded as Bellflower fighters board, and Jason recalling the company to Migos Street with “Kendrick Lamar.” Many halflings are freed during the encounter.

The deck layout, fighter roster, guest and captive sprite counts, dialogue beyond the word of recall, and timing of Draymus’s return from Rachikan are adapted. Combat opens with Draymus at no more than 5 HP and the company holds for one full initiative round. Clearing all active boarders also opens the escape. If Jason was knocked out, he comes round at 1 HP before casting recall. The rescue and retreat remain the recorded outcome. El Guapo’s return remains unresolved at this point.

After combat, two representative captives cross the deck and leave by the gangway. A short spell effect plays after Jason speaks and before the Migos Street transition. Both sequences use existing sprites and are skipped under reduced motion. The exact route and visual treatment are adaptations.

## Artwork prompts

**River barge** · `art-test/bellflower-barge-v1.png`

Wide 8:5 top-down high-detail pixel art transparent RPG map, a large flat-bottomed late-medieval Chelish river barge at night, for a decadent private party in Egorian. Entire horizontal flat dark oak silhouette separated on real transparent alpha outside, no water drawn. Deck fills x=7–93%, y=21–82%. Clear open lane x=19–82%, y=42–70%. At rear/north side scarlet drapes and rope-bound low fighting pen, tables with candles and goblets at upper corners, ropes, lanterns and railings. Low wooden gangplank at bottom center. No people, text, logos, grid or UI, no sail covering deck, no outside shadow. Fine hard pixel clusters and restrained deep oxblood and amber.

**Bellflower rescuers** · `art-test/bellflower-boarders-v1.png`

A wide three-frame horizontal true transparent RGBA dark fantasy RPG sprite sheet. Same compact ADULT halfling rescue fighter in each evenly spaced third: agile short stature, clearly adult, practical olive/brown cloak, muted scarf and soft leather gear, wielding a short sword with no heraldry. Face lower-left in all frames. Frame 1 ready with bent legs, frame 2 active lunging sword slash toward lower-left, frame 3 ready weight shift. All sprites full body, same height and anchored feet, with broad completely transparent gutters, no floor shadow, lighting halos, blood, words or scenery. High detail crisp pixel clusters.

Keep these exact three full-body halfling frames, separated and in the same order. Remove all background, white haze, and contact shadows. Output a true transparent PNG with fully empty zero-alpha gutters, corners and floor under all feet. Preserve the clothing, cutlass blades and fine crisp pixels, without any glow. Keep the full three-frame horizontal composition and wide empty gaps.

**Migos Street hideaway** · `art-test/bellflower-migos-v1.png`

Wide 8:5 orthographic overhead dark fantasy pixel RPG interior. Migos Street hideaway in Egorian: modest discreet urban safehouse back room, exposed stone walls, heavy closed oak door, a planning table with maps and two candles against left wall, rolled blankets and cabinets along right wall. Broad bare walkable wood floor across central x=24–78%, y=44–87%, lower entry area centered. Cool muted blue shadows with small warm candle pools, detailed handcrafted crisp pixel clusters. No figures, text, UI, or grid.

## Verification

The browser playthrough continued from Pezzack, heard Corrine’s orders, prepared the ring and started the party. It survived the opening combat round, reloaded before Jason’s recall, and reloaded the completed Migos Street checkpoint. The game canvas was 640×480 and the browser reported no console errors. All 154 automated tests passed. The structural audit checked 139 scenes, 374 replays and 616 sprite frames.
