# Valor’s Fastness · The Summit

Continue from the last stair or choose replay **135 · Climb to the summit**. Replays 136–139 start at the confrontation, the rescue, custody, and the chapter report.

P037, “Iomedae In A Fire,” records the Fourth Sword Knight’s confrontation with the party and his Archon bodyguard, the stolen hammer, a betrayal, his fall, and the company’s rescue. P039 identifies the Fourth Sword Knight as Oppian Nevilindor. P034 and the master timeline confirm Oppian’s capture and the planned delivery to Egorian. The betrayer’s identity, the original hammer wielder, the precise method of saving Oppian, and the Archon’s fate are unresolved. The adaptation leaves those details open.

A narrated hammer blow reduces Oppian’s starting resolve by 8. The Archon grants him +2 AC while it can fight. Oppian’s combat meter measures resolve. When it reaches zero he can no longer fight, and the defeat leads to the parapet sequence. The rooftop route, scene dialogue, exact combat numbers, and the fixed D20 result of 17 are adaptations. The company rescues him and takes him into custody without a grant of equipment, levels or healing.

## Audit

- The browser restored the pre-fight checkpoint, won the summit fight, reloaded the victory checkpoint and reached the parapet. It showed the fixed rescue roll and Oppian alive at the base. After custody and the report, reloading retained party injuries and the completed objective. The game remained 640×480 at 4:3 with zero browser console errors.
- 111 regression tests passed, including all 139 replay save round trips, the order of the rescue and custody flags, and the Archon’s defense bonus.
- The structural audit passed for 49 scripts, 78 scenes, 139 replays, and 484 sprite frames. It reported zero missing assets, invalid replay geometry or frame errors.
- The simulator won 200 of 200 summit trials with fresh resources and 195 of 200 ten-fight runs without a rest from Stranglehold through the summit. Of the five defeats, one occurred on the gallery and four at the summit. The mean summit length among completed chain runs was 5.37 rounds. These results apply to the simulator’s skill and healing strategy.

## Artwork

The built-in image generator used the open gallery art as a style reference. The two transparent map foregrounds and the combat atlas were copied unchanged into `art-test/`. The character appearances are provisional. The six idle frames were measured from the atlas alpha channel.

### `valor-fastness-summit-v1.png`

> New high-detail overhead three-quarter gothic pixel-art RPG foreground for the roof of the tallest pale stone temple tower. Reference sets architectural and palette continuity only. Show a clearly outdoor, broad flat octagonal stone rooftop with LOW crenellated parapets, a single little stairhead and ivory/gold sword-and-sun pennants. Open sky is real transparent alpha outside and between stone elements. One obvious BROKEN low parapet edge at rear right x68–74% y41%, looking down into transparent space, walkable landing immediately in front of it. Clear unobstructed playable flagstones x24–76% y44–69%; straight bottom center walkway x44–56% south to bottom, open at bottom. 8:5 landscape game map. No tall interior walls, no ceiling, no characters, lettering, perspective horizon, or background painted into alpha.

### `valor-fastness-tower-base-v1.png`

> New high-detail gothic overhead three-quarter pixel-art RPG foreground for the base of a pale stone fortified temple tower in Kantaria. Reference sets architecture only. A moonlit ground-level stone court and a few low stone buttresses on the far upper side, ivy and rubble along boundaries, a rear closed barred sally door, visible night lanterns. Empty broad playable flagstone court from x24–76% y44–70%, and open central passage x45–57% continuing to bottom. This is ground level with simple walls and gravel, not the roof. Genuine transparent alpha beyond perimeter; landscape 8:5, crisp pixel clusters, no people, text, UI or watermark.

### `valor-fastness-summit-cast-v1.png`

> Transparent 3 columns by 2 rows equal-cell pixel-art combat sprite atlas for a gothic tabletop campaign adaptation. Full bodies have clear padding within cells, true alpha outside silhouettes. Top row three subtly shifting idle poses of Oppian, a human male high-ranking cleric and knight, dark brown hair with gray at temples, solemn middle-aged face visible, high ivory and midnight-blue ceremonial plate over chain, gold sword-and-sun emblem, longsword and small shield. Bottom row three subtly shifting idle poses of an unnamed celestial Archon bodyguard, tall athletic humanoid celestial in pale silver cuirass, upright light gold greatsword, two short feathered wings folded close and a hood concealing the face, restrained ivory highlights. Each faces left in three-quarter view, stance and foot position consistent across poses. Crisp clustered pixels, opaque character interiors. No floating effects, extra figures, grid, backdrop, text or floor.
