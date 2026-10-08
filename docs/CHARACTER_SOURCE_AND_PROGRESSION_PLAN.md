# Character sources and progression plan

Reviewed 2026-10-08. Companion to FOUNDRY_TIMELINE_RECONCILIATION.md. This separates established source facts from proposed adaptation work; The first milestone and profile corrections are now implemented; see LEVEL_TWO_PROGRESSION.md for exact adaptation rules.

## Roster comparison

| Character / Foundry UUID | Current game | Foundry snapshot | Production decision |
|---|---|---|---|
| Freya | Half-elf samurai, katana, opening leader | Not among the five actors tagged PCs in the archive | Preserve the blog character. Do not replace her or infer departure from the current PCs folder. Find earlier sheets/actor matches before adding exact sheet mechanics. |
| El Guapo | Human pirate swashbuckler, rapier; leaves at Remesiana | Not among those five PC-folder records | Preserve sourced departure/return and opening identity. Unidentified Swashbuckler level-up card is not proof it belongs to him. |
| J'Mal / Actor.94VblZOUUnfRifHN | Jamal, hobgoblin rogue with dagger | Hobgoblin, Rogue (Unchained) 4 / Red Mantis Assassin 10; weapon records include Angelbone Sawtooth Sabers and Hark the Herald Angel Kills | Reconcile displayed spelling; retain early rogue role. Stage Red Mantis training and master blades in Longacre. Later weapon mechanics require inspecting the actual item records. |
| Jason / Actor.AlT4CD1PVRkoMT6C | Oni-spawn Asmodean cleric with mace | Tiefling, Cleric 8 / Divine Scion 6; weapon record Force Pike | Tiefling is compatible with the earlier ancestry description, but verify subtype rather than erase it. Force Pike is current equipment, acquisition date unknown. |
| Draymus / Actor.jSyYYNbh2qAx4OiB | Dhampir necromancer with dagger; shortened name | Draymus Keshaal Mortiarum; Dhampir, Necromancer 9 / Agent of the Grave 5; Angelbone Scythe +1 and Inheritor's Light | Correct full name in character details when implementing the roster pass. Preserve early equipment until acquisition evidence supports a replacement. |
| Bruce / Actor.jdG5GJYDBxBSI5sJ | Provisional later companion | Aasimar, Monk (Unchained) 4 / Sorcerer 1 / Dragon Disciple 8; current portrait depicts a blue-scaled, horned humanoid; no weapon-type items found | Replace invented ancestry/class descriptions with sourced facts. Use the portrait as evidence of his later appearance; it does not establish opening appearance or date of transformation. |
| Reese / Actor.bE2xsLBc2OVDoxrN | Provisional later companion | Strix, Ranger 7 / Wizard 1 / Arcane Archer 6; Stormcaller, Scimitar +2, Fire-Forged Dagger; archery backstory | Build the later winged archer identity from downloaded portraits and biography. Exact joins, weapon acquisitions and individual spell unlocks still need chronology. |

These inventories are item-type weapon names, not proof of equipped status, exclusive attacks or ownership since campaign start. Original sheet JSON and live totals remain separate. Classes imply a current build, not the order in which all levels were taken.

## Artwork pass

Use images/references.csv to map original actor img and prototypeToken.texture.src to downloaded images/files. Inspect the portraits before generating replacement pixel art. Produce face crops, exploration poses and three combat idle poses for sourced designs; keep early/later forms distinct. Preserve Freya and El Guapo unless an actual conflicting source is found. Corrine's artwork remains deferred at Brian's request.

## First progression release

- Confirmed trigger: Ash House rest after the Longacre sermon and before decree postings. Apply one party level-2 milestone, not a repeat award on every revisit.
- Proposed interface: the phase card introduces the new morning; a separate character improvement view explains HP/stat changes and any newly unlocked commands, with compact descriptions suitable for handheld use.
- Add a saved milestone ID and per-character progression. Old saves must migrate without losing story flags, inventory, leader or party membership; saves past the milestone must not receive duplicate rewards.
- Exact level-2 class/feat/spell choices are unknown. Obtain GM confirmation or explicitly record an approved simplified game progression before inventing mechanical rewards.
- Later sourced beats: J'Mal's Red Mantis instruction and blades; Freya's cave-giant belt runes; J'Mal's June 1, 2025 item pickup. Do not infer learning dates from spell preparation or first use.

After the roster and progression pass, build Bolgart/Riley, the church events and Red Mantis training using the Foundry encounters/maps and blog outcomes. Read the full related records before implementing each beat.
