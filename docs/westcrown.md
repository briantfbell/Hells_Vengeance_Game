# Brado Pachia’s favors in Westcrown

GM timeline row S093 records that Brado Pachia hired Freya’s company for a series of small favors in Westcrown on 4717.02.20. It does not identify the favors or describe Brado’s appearance. The freight ledger, sealed note, canal berth, quay layout, dialogue, and report are provisional game adaptations. They create no named factions, payments, or campaign consequences.

Replays 293–298 cover travel, hiring, three errands, and the report. The errands can be done in any order. Each completed errand removes its marker and updates the on-screen count, and all three are required before reporting.

## Artwork and built-in ImageGen prompts

**Canal quay** · `art-test/westcrown-quay-v1.png`

Wide 8:5 2D dark-fantasy handheld RPG map in fine hard-edged pixel art, an old Westcrown quay beside a city canal in Cheliax. Orthographic overhead, matching a medieval game map. Dark weathered slate and mottled terracotta storehouses across the top third, with a mooring ledger booth at upper left, a dockside side door upper center and a wooden bollard pier at lower right. A wide continuous open cobblestone promenade in the middle from x=12% to 88%, y=48% to 75%, with no crates or obstructions in that central region. Reserve the bottom strip y=82% to 100% as fully transparent RGBA except a small right-side wooden pier; this is the canal layer and animated water will be drawn behind it by the game. All land and buildings are opaque. Soft gray daylight, small warm windows, river city patina, no people, lettering, text or UI. Preserve real alpha beneath the quay.

**Brado Pachia** · `art-test/westcrown-brado-v1.png`

A single full body pixel art character sprite for a handheld RPG. Provisional Brado Pachia, a middle aged man in Westcrown, Cheliax, with a compact build, short dark curly hair with graying temples, tired but shrewd eyes, a burgundy wool waistcoat under a soot-dark short coat, buff scarf, plain leather boots and gloves. Plain understated outfit, no emblems or weapons. Neutral three-quarter front, feet fully visible. Readable silhouette, natural proportions and detailed hard pixel clusters. True RGBA transparency, zero outside figure. No background, ground, lettering, shadows or light effects.

The foreground’s transparent canal shows animated water beneath the quay and its pier.

## Verification

All 140 tests passed. The structural audit checked 73 scripts, 120 scenes, 298 replays and 582 sprite frames. The browser playthrough started from Remesiana, completed the berth first, reloaded at one of three, and then delivered the note, checked the ledger, and reported to Brado. The completed checkpoint reloaded at 640×480 with no browser errors.
