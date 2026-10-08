# Longacre production batch

## Playable Chapter Three
Continue from the Ash House sermon briefing. Attend Allamar’s sermon, choose a public challenge or quiet conversations, report to Razelago, post four decrees, dismiss Rhona, survive the four-deputy ambush, and receive Fex’s Hellfire Compact. Razelago’s true form appears after the oath. The next assignment points toward Bolgart and Riley.

The walkthrough checks every decree, the four-person combat roster, the manor audience, checkpoint reload, and compact combat at a 320-pixel viewport. Earlier chapters remain playable.

## Environments prepared ahead
| Arc | Environment | Status |
| --- | --- | --- |
| Sermon / decrees / audience | Longacre square, western gate and jail, Scarlet Manor office | Playable |
| Tavern / testimony / church / alliance | Last Stand Tavern, Church of Iomedae, Angel Knight’s hill, Rohalendi hospice | Art prepared; dialogue, collision and encounters still to build |
| Information / stronghold | Northern river docks, Court of Spears | Art prepared; gameplay still to build |

All nine PNGs have transparent exterior borders and broad clear floor/path space. Backdrops render beneath fixed foregrounds; actors render above them. Water moves independently at the docks. Indoor floor furniture stays fixed. Future maps still need authored collision and interaction layouts. Open **Longacre Art Studio.html** or `/art` to inspect layers and character art. The studio contains spoilers.

## Reusable character atlas
Eighteen idle models / portrait sources: Rhona; four deputies; Allamar; her two sons; reusable townsfolk; Bolgart and his wereboar form; Riley and his ghast form; Gerya; Ingoe; Lencia; revealed Razelago; Sleipnir. `art-test/future-npcs.js` stores alpha-cropped frame metadata. New quest NPCs are currently stationary; moving NPCs will need directional walking sheets when their gameplay is authored.

The campaign archive supplies roles and events. Appearance details absent from those references are visual interpretations. Corrine remains deferred. Reese and Bruce retain their provisional labels.

## Party walking
Seven supplemental transparent strips provide front, side, and rear opposite-foot contact poses. The left facing mirrors the right facing. The renderer cycles original contact, neutral, new opposite contact, neutral. Original nine-frame sheets are preserved; `sprite-frames.js` selects corrected strip versions and aligns body anchors and scale. The walking studio previews both large artwork and game-size sprites.

## Sources and generation
Story grounding: local Pathfinder Campaign RPG Gift references P048 (sermon/decrees/deputies), P046 (Fex, compact, Razelago and following encounters), and the campaign timeline. The repository excludes the raw private archive. Decree dialogue paraphrases events rather than inventing a verbatim proclamation.

Generated with the built-in image generation tool. Exact generation and correction prompts are in `LONGACRE_ART_PROMPTS.json`. The production batch contains nine environments, three character atlases, and seven selected walking strips; earlier correction variants are preserved alongside the selected versions.
