# Valor’s Fastness · Tower Ascent

Continue from the secured chapel stairs or choose replay **128 · Climb the tower stairs**. Replays 129–134 cover the mage, the upper landing, Lencia’s return and the last stair.

P037, “Iomedae In A Fire,” records the deaths of a mage, a warpriest and an Angel Knight on the ascent. The master timeline records Lencia Visserine’s death in Kantaria on 4717.01.01 alongside Oppian’s capture. This adaptation treats her as the Lencia Visserene who escaped the Court of Spears in P039, preserving the spelling already used in the game. The mage and warpriest remain unnamed. Their room layouts, supporting guards, combat tactics and dialogue are game adaptations.

The mage uses an arcane bolt and telegraphs its stronger version on even rounds. The warpriest can spend one even-round turn on a battle prayer at half HP or below. Lencia reuses her established sword and shield combat style, model and dialogue portrait. Party resources carry up the tower. The section ends at the last stair before the summit encounter.

## Audit

- The browser run began at replay 128 and won the study, landing and gallery battles without resting. It showed the charged-bolt warning and the warpriest restoring 8 HP in combat. It also verified the last-stair checkpoint after reload with party injuries intact. The game canvas remained 640×480, rendered at 4:3, and the browser reported zero console errors.
- 109 regression tests passed, including all 134 replay save round trips, the ordered ascent flags and the one-use battle prayer.
- The structural audit passed for 49 scripts, 76 scenes, 134 replays and 475 sprite frames. It reported zero missing assets, invalid replay geometry or frame bounds.
- In the simulator, each tower fight won 200 of 200 fresh-party trials. The three-fight ascent won 200 of 200 without resting. The nine-fight sequence from the mines through Lencia won 199 of 200, with one defeat on the gallery. These figures describe the simulator’s skill and healing strategy.

## Artwork

The built-in image generator used the inner chapel as a style reference. The three transparent foregrounds and defender atlas were copied unchanged into `art-test/`. The six idle frame bounds were measured from the atlas alpha channel. The gallery’s sky is a separate background beneath its open arches.

### `valor-fastness-study-v1.png`

> Overhead three-quarter pixel-art game map foreground for a fortified temple tower. True transparent exterior alpha. The reference sets rendering style and pale stone/ivory-gold architecture only. New enclosed octagonal mage’s study at a lower tower landing: tall narrow bookcases on perimeter, scattered arcane charts and lamps on side desks, blue and amber accents. Wide 8:5 map. Clear traversable flagstones x24–76%, y45–67%, no objects in that area. Open bottom-center passage x45–56% to bottom; open rear central stair x51% with traversable threshold y39%. Detailed crisp pixel clusters, no people, no text, no watermark.

### `valor-fastness-landing-v1.png`

> Overhead three-quarter pixel-art game map foreground, true transparent exterior alpha. Reference is style and pale limestone architecture only. New fortified tower upper landing used as a devotional armory, bright ivory walls, muted red banners and golden sword-and-sun plaques, shield racks and braziers against side walls. Wide 8:5 map. Central floor x24–76%, y45–67% is completely walkable and empty, x45–56% continues to the open bottom-center entrance, and an open central staircase x51% at rear has walkable threshold y39%. Props stay clear of traversal. Dense crisp pixel clusters, no figures, lettering, UI, or watermark.

### `valor-fastness-gallery-v1.png`

> Overhead three-quarter pixel-art game map foreground, true transparent exterior alpha. The reference is architectural continuity and detailed crisp pixel style. A new open-air high tower gallery at dusk with pale stone floor, low crenellated railings and gothic buttresses, ivory gold banners. Beyond edges and behind railings is transparent sky for independent underlay. Wide 8:5 game map; central floor x24–76%, y45–67% completely clear. Entrance path x45–56% continues south to bottom and a rear stair portal x51% leads up from a traversable threshold near y39%. No characters, objects on paths, text, landscape backdrop, or watermark.

### `valor-fastness-ascent-cast-v1.png`

> A transparent 3 columns by 2 rows sprite atlas, each cell exact equal size and full figure padding, detailed gothic RPG crisp pixel clusters. Reference only sets atmosphere and colors. Upper row is three subtly shifting idle poses of the same anonymous adult temple mage in slate-blue robes and ivory trim, holding a slender gold focus staff, face visible. Lower row is three subtle idle poses of one anonymous adult veteran warpriest in worn silver armor, red mantle, gilded sun-headed warhammer held low, stern mature face. All face left three-quarter combat view. Foot line fixed per row, entire silhouettes separated from adjacent cells and edges. No text, divider, backdrop, cast shadow, or effects. True alpha transparency.
