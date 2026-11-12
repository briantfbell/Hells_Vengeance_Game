# Kantaria · Aftermath

Continue from the completed Fastness summit or select replay **140 · Return to Kantaria**. Replays 141–144 cover the mayor, the Uskwood deed, Fex’s gifts, and preparation for the South Road.

P036, “The Spoils of Wha?,” records the conversion of Valor’s Fastness to government offices, Linton Demeer’s appointment, Loredana’s return to Nidal and transfer of the Uskwood, and Fex’s gifts and back pay. P034, “Mid-day Cowboy,” establishes that Zara rides ahead to Egorian and that Fex promises delivery of Oppian within five days. The exact meeting room, dialogue, and placement of these events in one playable visit are adaptations. The game uses the appointment and capture order corroborated by the master timeline and leaves out the older conflicting date.

The deed names Freya, J’Mal, Jason and Draymus. The inventory tracks 10,600 gp of shared back pay as a story item. Freya receives the plate commission here and collects the armor in Egorian. The record gives no named gift for El Guapo, so this visit leaves his gear as it was.

## Reward mechanics

- Silent Sentry is equipped on Reese when awarded. It provides +2 to hit and a separate 1D6 frost roll on a successful Attack or Aimed Shot. The standard bow remains available. Ammunition has no counter, and the campaign’s sentry-post power is pending an encounter that uses it.
- The Ring of Wizardry I expands Draymus’s compressed spell allowance by four uses and preserves uses already spent.
- The Mosswater Tunic gives J’Mal +3 AC. Phase spends one of five charges to evade enemy attacks until his next turn. The game represents one round of ethereal jaunt per charge.
- The Dragon Helm lets Jason maximize Burning Hands three times per rest, spending a helm charge and a Burning Hands use. Wisdom modifiers and spell duration extension are outside this combat implementation.

The four gifts become available after their dialogue. Recovery of spent gear charges belongs at a subsequent rest. There is no new level or resource refill during the council visit.

## Audit

- The browser entered from the completed summit, played the mayor, deed, rewards and transport events, checked the awarded items and equipped bow in the inventory, then reloaded the completed departure checkpoint. The game remained 640×480 at 4:3. No console errors were reported.
- All 115 tests passed, including 144 replay save round trips. Focused regressions cover pre-award rejection, equip validation, preserved gear charges and the actual combat action handlers for frost, Phase and Maximize.
- The structural audit passed for 50 scripts, 79 scenes, 144 replays and 486 sprite frame references. It found zero missing assets, invalid geometry or frame errors. This section has no live combat.

## Artwork

The two assets were produced using the built-in image generator with the Fastness hall as a style reference, then copied unchanged into `art-test/`. Linton’s appearance is provisional.

### `kantaria-council-v1.png`

> Wide 8:5 transparent foreground for a gothic overhead three-quarter high-detail pixel-art RPG. Reference is style and pale stone architecture only. New former fortified temple hall repurposed as a working town council office after a rebellion. Plain walls without religious iconography, vacant alcove at rear, modest timber council table with blank papers along rear wall, records shelves and boxes along side walls, unadorned lanterns. Open entrance at bottom center x45–56%, empty floor x24–76% and y45–68%, clear aisle to entrance. Dark burgundy and parchment touches, crisp pixel clusters, true exterior alpha. No figures, no text, no UI, no watermark.

### `linton-demeer-v1.png`

> Create a transparent single full-body pixel-art RPG NPC sprite, centered, with whole silhouette and padding. Match reference world in color and crisp high-detail pixel clusters; reference is style only. Provisional depiction of Linton Demeer, an adult town councilman and practical new mayor: tidy salt-and-pepper hair, weathered ordinary human face, sober dark teal doublet, simple chain of office and bundle of folded papers. Standing front three-quarter with face readable for dialogue portrait. Groundless true alpha cutout, no background, text, labels or framing. High-detail clean clustered pixels.
