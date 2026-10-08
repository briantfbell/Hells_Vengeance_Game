# Foundry timeline reconciliation

Reviewed 2026-10-08. Evidence notes only; no gameplay changes or complete historical leveling schedule.

## Source locations

- Native exports: `C:/Users/Brian/Desktop/Files/Claude/Toby_PF_Game/Foundry_export`.
- Second round: `Export_round_2/fvtt-log-Thu-Oct-08-2026.txt` under that folder. Inspection found one TXT chat export, not a JSON file.
- Full archive: `C:/Users/Brian/Documents/Codex/2026-10-08/this-chat-is-for-the-current-9/outputs/Hells_Vengeance_Campaign_Archive`.
- Supplement: sibling `Hells_Vengeance_Timeline_Supplement`; start with timeline.md, timeline.csv, coverage.json and originals/chat/foundry-chat-export.txt.
- Older references: `Pathfinder Campaign RPG Gift/Pathfinder_Gift_01_Reference/Pathfinder_Campaign_RPG_Gift`, especially reference/01_master_timeline.md and raw_posts/P001.txt, P042.txt, P043.txt, P044.txt, P048.txt.

Preserve UUIDs and original source references. Foundry 13.351 / pf1 11.11. Live observations and stored sheet values remain distinct. The live world remains read-only.

## Progression evidence from the blog

| Story placement | Source | Established fact | Limits |
|---|---|---|---|
| After the Longacre sermon, before posting decrees | P048, paragraph beginning Returning to Razelago | Party rests at Ash House and advances to level 2 | Exact individual class/feat/spell selections unspecified; does not establish later companions' levels. Publication 2016-06-07 is not a session date. |
| Longacre church / Red Mantis master | P043, paragraph beginning They opt for knowledge | J'Mal receives 24 hours of instruction and the master's sword belt and blades | Numerical class level and exact unlocks unspecified. |
| Church conversion / Cimri's promotion / accusation against Cimri | P042 | Red Mantis training begins and is completed before J'Mal visits the accuser | P042 and P043 overlap; do not invent two independent class-level awards. |
| Royal Tathlum mission, cave giants in Nidal | P001 | Freya defeats giants and unlocks new runes on her dwarven-champion's belt | Rune mechanics and upgrade values need item/GM evidence. |

P044's separate level-2 award belongs to **Hell's Rebels** (Rexus, Silver Ravens, Azraith, Boudicca, Eol, Femick). Exclude it from Hell's Bubbies. Preserve HV/HR distinctions in the shared timeline.

## New supplement

- 557 retained messages; action clusters April 20 and June 1, 2025. Later entries are module notices, not confirmed sessions. This is not continuous campaign history.
- J'Mal explicitly acquires one Hark the Herald Angel Kills on June 1, 2025 at 17:29:03; native chat line 6481 / ordinal 544; selected UI metadata identifies ChatMessage.pZpEBNrwPlmjo75x. Derive mechanics from the item export, not its name.
- Six unattributed class reports: Swashbuckler 13→14; Bloodrager 11→12→13→14; Slayer 9→10→11. Do not assign them to El Guapo, Bruce or another actor by class resemblance. Gameplay advancement versus GM preparation is unresolved.
- 74 preparation changes and 75 first-recorded ability/item cards establish preparation or availability, not learning dates.
- No verified PC XP award, advancement date or independently dated older PC sheet was found in the supplement. The older blog does supply the level-2 story milestone above.

## Reconciliation and open conflicts

| Sources | Finding |
|---|---|
| Player Notes 11/05/2023; GM HV row 143, 4717.04.15 | Both report obtaining Citadel Dinyar's gold dragon head. Shared story milestone supported; exact cross-calendar mapping unverified. Keep ambiguous real-world label and in-world date separate. Journal reports clearing the citadel; GM row specifically reports dragon death/head acquisition. |
| Player Notes, mission report, P001, GM HV rows 136–151 | Royal Tathlum mission has overlapping coverage. P001 ends at reconnaissance; later records describe subsequent activity. Different coverage endpoints do not imply contradiction. |
| Player Notes 100 souls; separate reboot note 1,000 innocents; GM HV row 147 planned blood from 100 slain innocents | Preserve separate requirements. The planned GM step does not resolve the later 1,000 claim or prove completion. |
| GM HV row 150 celestial battle at St. Ilnius Fountain; retained celestial combat cards | Possible correspondence only. General opponent similarity and ability use do not identify a session, scene or outcome. |
| Journal Scipio resurrection request | Planned/requested; resurrection not established. |
| GM rows 146–149 marked PLAN | Fountain, blood, library and ritual objectives remain planned unless explicitly corroborated as completed. Reported activity in rows 150–151 stays separate. |

Never equate blog publication dates, browser-local chat timestamps, journal labels and Golarion dates. Do not apply current level-13/14 sheets to opening chapters. An ability's first use establishes availability by that date, not acquisition then.

## Production use

1. When implementing leveling, the first sourced milestone is the Ash House rest after the sermon. No leveling code changed in this review.
2. Tie named upgrades to explicit story events. Label proposed unlock schedules and combat tuning as adaptation choices until confirmed.
3. Prioritize GM clarification of individual level-2 choices, subsequent milestone levels, the six cards' actors/purpose, journal dates, and the 100/1,000 requirement.
4. Obtain any older logs or dated sheet snapshots from existing backups via a separate copy. Do not restore the live world or activate an inactive logger to recover past events.

The archives remain local; no raw campaign archive, artwork collection or chat history was copied into the repository.
