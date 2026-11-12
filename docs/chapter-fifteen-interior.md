# Valor’s Fastness · Fortress Interior

Continue at the secured outer gate or choose replay **123 · Through the breach**. Replay 124 starts the mustering hall, 125 the chapel passage, 126 the inner chapel and 127 the tower stairs.

P037, “Iomedae In A Fire,” records the party fighting room to room against clerics and paladins before the tower ascent. P039 describes the fortified temple as the Reclamation’s main barracks. The mustering hall, chapel layout, unnamed defenders, their count and the cleric’s healing are adaptations for play. The mage, warpriest and Angel Knight belong to the next section.

The hall’s paladin alternates sword cuts and stronger shield-led strikes. On even rounds the chapel cleric can spend its turn restoring up to six HP to a wounded living ally. The enemy intentions panel previews that possibility. The party’s health and resources carry between rooms. Victory returns the party to the exploration formation before saving, and defeated defenders no longer obstruct movement.

## Audit

- The browser playtest entered from the completed breach, won both rooms without a rest, and verified the hall and chapel victory checkpoints. After correcting the party’s placement on returning from combat, a second chapel win led to the stairs. The completed checkpoint reloaded with injuries intact. The game canvas remained 640×480 with a rendered 4:3 ratio. The browser reported no console errors.
- 107 automated tests passed, including all 127 replay save round trips. Targeted cases reject premature room access and verify that the cleric cannot heal a fallen ally, overheal a living one or heal itself.
- The structural audit passed for 49 scripts, 73 maps, 127 replay checkpoints and 467 sprite frames. It reported no missing assets, invalid replay geometry or frame errors.
- The seeded combat simulator won 200 of 200 trials for each new fight in isolation. It also won 200 of 200 six-battle runs from the Stranglehold mines through the chapel without another rest. Mean chapel length was 3.77 rounds in the chain. The mean number of downed companions at the end was 0.02. Those results use the simulator’s skill and healing strategy.

## Artwork

The built-in image generator used the outer gate art as a style reference. The two map layers and the defender atlas were copied unchanged into `art-test/`. The frame coordinates were measured against the atlas alpha channel.

### `valor-fastness-hall-v1.png`

> Wide 8:5 transparent foreground for a high-detail gothic overhead three-quarter pixel-art RPG. Reference is style and architectural continuity only. Design the vaulted inner mustering hall of that pale-stone fortified temple, with empty open center aisle, side weapon racks and ivory/gold sword and sun banners. Rear doorway at x51%, walkable threshold y39%, and a front entrance at x51% with open path to bottom. Continuous empty floor between x22%-78%, y46%-75%, and vertical aisle x44%-58% from rear threshold to front. Columns, furniture, candle stands stay outside the play space. Stone tiles, warm sconces, restrained slate shadow, very crisp clustered pixels. True transparent alpha beyond silhouette. No people, text, UI, watermarks, or horizon.

### `valor-fastness-chapel-v1.png`

> Wide 8:5 transparent foreground for a high-detail gothic overhead three-quarter pixel-art RPG. Reference is style and architectural continuity only. Design the inner chapel of that fortified Iomedaean temple, clearly distinct from a barracks: pale flagstone, muted navy aisle runner with fine gold trim, narrow lancet stained glass, flanking votive candles, central altar at rear with gold sword-and-sun emblem and an accessible stair arch beside it at x66%, y39%. Floor clear across x24%-78%, y47%-75% with clear central entry aisle x44%-58% to bottom and unobstructed approach to stairs around x65%, y40%-48%. Keep pews, columns and furniture beyond this open floor. Crisp square pixel clusters, amber and muted blue light, true transparent alpha beyond silhouette. No people, text, UI, watermark, or horizon.

### `valor-fastness-defenders-v1.png`

> Create a transparent 3 columns by 2 rows sprite atlas, square or landscape, exact equal cells, three idle poses each for two anonymous Glorious Reclamation defenders. The reference is palette and setting only. High detail crisp pixel clusters for a gothic 2D RPG. Upper row: same faceless adult paladin, closed silver helmet, white and blue tabard with small golden sword motif, sword and pale kite shield. Lower row: same anonymous adult armored cleric, short dark hair and solemn face, white hooded vestments over pale mail, holding a gold sun-headed mace and prayer book. Both face left in three-quarter combat view, grounded stance, very subtle weight shift and breathing between poses. Entire silhouette fits into each cell with clear transparent padding, all feet fixed at matching level within each row. No floor, shadows, dividing lines, text, labels or effects, real alpha background.
