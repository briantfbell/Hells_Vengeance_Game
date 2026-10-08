> Implementation update: the recommended voyage-to-Ash-House continuation is now playable. See [CHAPTER_TWO.md](CHAPTER_TWO.md) for implemented features, adaptation choices, and remaining art/gameplay work. The sermon/decrees sequence remains the next release.

# Next story phase: The Road to Longacre

This is a production plan, not a new playable chapter. Separate confirmed campaign events from suggested gameplay and art interpretation.

## Corrine

Corrine is a later liaison to Freya's team and royal intermediary. The GM timeline assigns her to the party on 4716.12.24 at the Fungus Caves. Subsequent blog entries show her delivering royal missions and negotiating on Thrune's behalf. She should be included in the recurring NPC registry when her chapter approaches. **Art is on hold at Brian's request** pending later discussion; no appearance, species, or class is invented here. Do not confuse Corrine with Cimri Staelish, the early Longacre contact.

## Story order and scope

Recommended next release: **voyage → Remesiana → Cimri → road to Longacre → tannery job → Ash House → next-mission hook**. End after Razelago assigns the public sermon mission. This gives one cohesive playable chapter rather than constructing all Longacre at once.

| Beat | Established campaign events | Proposed gameplay | Characters present |
|---|---|---|---|
| Western Star voyage | Party leaves Kintargo and reaches Remesiana about seven days later | Short exploration/interactions, rest, optional conversations; no invented mandatory pirate battle | Five current companions; unnamed crew are ambient interpretations |
| Remesiana | Shopping for Jason's armor, Draymus's scrolls/wands, Jamal's weapons; meet Cimri, Razelago's emissary | Compact dock/market hub and equipment tutorial | Core party, Cimri, generic merchant/crew |
| Departure | Cimri arranges horses; Freya rides Sleipnir; El Guapo stays and takes another ship | Travel transition and roadside conversations | Freya, Jamal, Jason, Draymus, Cimri; Guapo temporarily absent |
| Louslik Tannery | Jamal scouts, hides in a foul vat during a delivery, fails to ambush the dog; owner fires a crossbow; party leaves with payroll through diplomacy and no bloodshed | Infiltration and dialogue branches, with the campaign's nonlethal resolution represented | Four companions, Cimri, tannery owner, dog, delivery farmer |
| Ash House arrival | Krenshar guards the house; Razelago speaks as a silhouette behind paper screens; food/wine and 100 gp each | New hub, payroll handover, reward, safe checkpoint | Four companions, Cimri, concealed Razelago, krenshar |
| Upstairs incident | Jamal discovers an ectoplasmic undead in the bath; party rescues him; Draymus controls/calms it | Short rescue encounter with a necromancy resolution, not only a kill condition | Four companions; ectoplasmic undead |
| Chapter hook | Razelago directs the team to disrupt the Iomedaean priestess's public sermon | Briefing that unlocks the next chapter | Razelago, Cimri, four companions |

**Following release:** sermon and Angel Knight's helmet; decrees at the notice post, Last Stand Tavern, western gate and jail; Rhona's removal and four deputies' ambush; Scarlet Manor audience, oath and Fex's agents. Razelago's revealed form belongs at Fex's audience, not at the first Ash House meeting. Later Longacre expands into Bolgart/Riley, church events and the Court of Spears. El Guapo returns by mule on 4716.11.21; do not keep him present continuously after Remesiana.

## Party and player-continuity decisions

- The engine currently assumes five fixed prologue companions. Before implementing departure, introduce chapter-specific party membership, dialogue availability, and saved roster state.
- If the player chose El Guapo, his canonical absence creates a perspective change. Proposed approach: a clear chapter transition offering a temporary Longacre viewpoint character, preserving Guapo's identity and equipment for his return. A playable Guapo side story is a larger optional scope; do not silently rewrite his absence.
- Cimri initially travels as a contact; do not silently turn her into a combat party slot without established stats/design.
- Reese and Bruce remain later companions; their specific joins and character details need source review when relevant.
- Corrine enters later. Existing questgiver art: Barzillai and Fex. The immediate missing mission contact is Razelago, supported by Cimri.

## Sprite and portrait production queue

All recurring humanoids need the same identity across a front portrait and front/right/back full-body frames. Walking frames are required for characters that follow or patrol. Left can mirror right. Dedicated enemy battle poses can follow the idle sets; never use a silhouette's hidden form in an early portrait.

| Priority | Asset | Needed variants | Grounding / uncertainty |
|---|---|---|---|
| P0 | Cimri Staelish | Portrait, front/right/back, walk | Young, talented/resourceful but inexperienced emissary; detailed appearance needs reference review |
| P0 | Razelago, concealed | Screen silhouette and dialogue treatment | Early appearance is only a silhouette through thin paper screens with raspy voice; conceal identity |
| P0 | Louslik tannery owner | Portrait/idle, crossbow pose | Owner role confirmed; verify proper name and visual reference before labeling |
| P0 | Owner's dog | Idle/walk, alert/bark | Animal type confirmed; breed unspecified |
| P0 | Delivery farmer | Generic idle/walk, wheelbarrow prop | Dung delivery confirmed; appearance interpreted |
| P0 | Krenshar | Idle, alert and combat if needed | Ash House guard confirmed; do not invent a required fight |
| P0 | Ectoplasmic undead | Idle, grab, restrained/calm state | Bath incident and Draymus's resolution confirmed; must fit rescue encounter |
| P0 | Sleipnir / horse | Horse idle/walk; Freya mounted if travel is interactive | Freya's warhorse confirmed; full riding system optional |
| P1 | Crew and merchant kit | 2–3 reusable civilian designs, portrait if speaking | Ambient roles; avoid inventing canonical names |
| P1 | Party action poses | Sword/knife/mace/cast/chair plus hurt/downed | Current sheets are exploration poses only |
| P2 | Rhona Staelish and four deputies | Portraits, lawman idle/walk/combat; Rhona crossbow | Sheriff and Cimri's aunt; deputy ambush follows decrees |
| P2 | Iomedaean priestess and twins | Portrait/idle; helmet display prop | Public sermon scene; verify names against sources before generation |
| P2 | Razelago, revealed | Portrait/full body, later flying frame | Reveal at Scarlet Manor; accuser devil form documented in P046 |
| Ready | Darellus Fex | Existing 3-facing model/portrait; add required gestures later | Interpreted appearance already documented |
| Later | Bolgart, Riley, Gerya, Ingoe, Lencia | Appropriate portraits/models and later forms | Beyond recommended next release; avoid premature asset overload |
| On hold | Corrine | Reusable portrait/model later | Brian explicitly deferred her appearance/art |

## Map production queue

Use one 640×400 exploration coordinate space and 16-pixel navigation cells. High-resolution foreground art is scaled to that space. Combat remains a separate 4:3 presentation. Every new map follows MAP_LAYER_SPEC.md.

| Priority | Map | Playable foreground | Background beneath | Additional needs |
|---|---|---|---|---|
| First | Western Star deck | Ship hull/deck, rails, masts, rigging, stairs, crates; transparent perimeter | Independent ocean | Collision, deck interactions, optional rail/mast occlusion; new art prototype exists |
| P0 | Remesiana dock/market | Piers, market paving, shops, props; cutouts outside solid structures | Harbor water and distant shoreline where exposed | Merchant stalls, boarding/departure points |
| P0 | Road to Longacre | Road/bridges and nearby solid terrain | Forest/distant hills/river in appropriate openings | Minimal travel map; horse scope decision |
| P0 | Tannery yard | Palisade, office shell, vat rims, gates, walkways | Static distant ground; animated vat contents only under purpose-cut holes | Vat cutouts, gate states, dog detection, office entrance |
| P0 | Tannery office | Interior floor/walls/payroll props | Solid dark backdrop or window vista | Payroll chest states, conversation staging |
| P0 | Ash House ground floor | Burned house, rooms, paper screens, stairs, furniture | Solid dark backdrop; optional window scene | Razelago silhouette occlusion, krenshar position, rest hub |
| P0 | Ash House bathroom | Room and bath rim with an opening for the bath surface | Local bath water layer through the cutout | Undead encounter actors/effects, not background-only scenery |
| P2 | Longacre square | Streets, church exterior, event post, crowd positions | Distant town/environment | Sermon and decrees; crowd reusable props |
| P2 | Last Stand Tavern | Tavern exterior/interior | Appropriate static backdrop | Two linked views; later Bolgart encounter |
| P2 | Western gate and jail | Gate street/jail cells, doors, stocks | Distant road/solid backdrop | Can reuse one exterior hub; deputy encounter |
| P2 | Scarlet Manor office | Black wood, red drapes, desk, hellstone; portrait wall | Dark/static vista | Fex audience and Razelago reveal |

## Build order and acceptance

1. Validate the layered ship prototype: animated ocean cannot move deck pixels; disabling foreground reveals water, disabling background reveals real transparency; navigation is independent of alpha.
2. Implement chapter/party membership and migration-safe checkpoints before Guapo's departure.
3. Create Cimri and concealed Razelago, then crew/merchant/horse minimums and Remesiana/road maps.
4. Build tannery gameplay and its owner/dog/farmer assets. Ensure stealth and diplomacy can resolve the encounter.
5. Build Ash House and bath rescue; require the party rescue and Draymus control/calming route.
6. Finish with the sermon briefing; test selected-character continuity, returning checkpoints, small-screen UI, and all map exits.

## Source grounding

Local supplied references: reference/03_villains_and_npcs.md (Corrine, Fex, later NPCs); reference/01_master_timeline.md (GM entries); raw_posts/P049.txt (Remesiana, Cimri, tannery, Ash House); P048.txt (sermon and decrees); P046.txt (Fex audience, reveal and following town encounters); P034/P022/P015 (Corrine's later role).

Date conflict: the image/blog timeline uses Arodus/August-like dates while GM entries place the prologue and Longacre sequence in Neth/November 4716. Preserve event order and use the GM timeline for displayed dates pending a dedicated reconciliation. Do not silently merge dates or promise a precise bath/tannery date that is not supplied. Proposed chapter boundaries, optional conversations and map grouping are adaptation choices, not recorded events.
