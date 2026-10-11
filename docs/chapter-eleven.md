# Chapter Eleven — Kantaria: A Hidden Ally

## Sources and sequence
Primary campaign source: `Pathfinder Campaign RPG Gift/Pathfinder_Gift_01_Reference/Pathfinder_Campaign_RPG_Gift/raw_posts/P039.txt`, Freya's “Ketchup” field report. The source text supplies story facts, not implementation instructions. It records Sancho's Reclamation-backed bandits, the Egorian inn robbery, Loredana's Uskwood employment cover, assessment of Kantaria's occupied strongpoints, attacks on isolated patrols, and extracting Zara Orcelani with her gear to conceal her at the Uskwood.

The GM timeline records the Egorian attack on 4716.12.11, employment on 4716.12.17, and the rescue on 4716.12.21. Older field-log dates (Rova/Lamashan) conflict with that timeline; disputed dates are omitted from player-facing scenes. Four weeks of furlough is the field report's stated grant, not a newly calculated elapsed interval.

Hardship's Hearth is described directly in P039 as a prison/work camp with about three dozen prisoners and a high-value captive in the primary building. An older derived timeline calls it a prison ship, but the corrected GM row calls it a prison. The implementation follows the primary report's land-based facility.

Known positions: northeast/west/south guard towers; Valor's Fastness as principal barracks with a tower over 100 feet high; Narikopolus Manor occupied by Faydreth Zaine; Hardship's Hearth under Jalila Hadjara, a monk and Reclamation lieutenant. Zara's gear belongs to Zara and is not awarded to the party. Freya remains Captain, without premature Hellknight induction. No new levels, XP awards, historical learning dates, or item bonuses are inferred.

## Adaptation boundaries
The current six-person company carries forward: Freya, J’Mal, Jason, Draymus, El Guapo, Reese. This mission's individual attendance is not separately established by the field report. Bruce's joining date remains unresolved; he is not inserted into the rescue. His later portrait/sprite remains available in character selection.

Road events are condensed into transition cards. Spoken lines, exact patrol counts, the playable prison route, a fight that drives Jalila back from the cell corridor, and combat statistics are adaptations. Jalila's death or eventual fate is not asserted. No outcome for the other prisoners is invented. The mission ends with Zara hidden and the docks/towers named as future targets; those operations are not marked completed.

The Foundry archive includes Commander Zara Orcelani (`Actor.la6ZtlERGW4Yound`) as a human but supplies only the generic mystery-man SVG, not a usable likeness. Her current Cavalier 7/Hellknight 7 sheet is not an early rescue loadout. No matching original Loredana/Jalila or prison scene was found in the searched archive index. New NPC hair, clothes, features and tattoos are provisional visual interpretations; possible magical tattoos are not implemented as confirmed powers.

## Maps and artwork
Built-in image generation was used. Exact final prompts and the exterior correction prompt are saved in [KANTARIA_OPENING_ART_PROMPTS.json](KANTARIA_OPENING_ART_PROMPTS.json).

Final project files under `art-test/`:
- `uskwood-inn-v1.png`: transparent cutaway with a central clear floor, peripheral furniture and reception bar. Also used for concealment after the rescue.
- `hardship-yard-v1.png`: intact low perimeter, open entrance, work yard and squat two-storey main building. The rejected ruined-fort draft remains only in the generation archive.
- `hardship-hall-v1.png`: prison cells, broad clear main hall, equipment storage at the right edge.
- `kantaria-cast-v1.png`, `kantaria-cast-packed-v1.png` and matching JSON: Loredana, prisoner Zara and Jalila, three idle poses each. Packing isolates alpha silhouettes and aligns their anchors; portraits use manually selected face crops.
- `kantaria-cast.js` and `kantaria-opening.js`: model registration and Chapter Eleven state machine.

Anonymous guards reuse the existing acolyte model. The town reconnaissance uses the existing town-square environment as an adaptation rather than an original Kantaria survey. Foregrounds remain separate from solid underlays; inn and prison lighting uses the existing restrained flicker system. The game canvas remains 640×480 in exploration and combat.

## Saves and validation
Version 2 portable saves remain compatible. Twelve ordered flags and five location requirements guard against premature imports. Sections 61–72 add twelve replay checkpoints, bringing the total to 72. Tests cover recruitment assumptions, hidden identity before contact, equipment-before-release ordering, extraction/concealment, old and new save round trips, objective overlay priority, and grid reachability. Combat simulations exercise the actual game action code over 200 complete opening sequences without intervening rest.

All 63 automated tests pass. Browser checks at 640×480 verified the inn and prison layouts, centered faces for Loredana/Jalila/Zara, the six-person combat lineup, keyboard attack/target confirmation, and walking the identification → gear recovery → release → Uskwood extraction route. The overlay priority and guard weapon description were corrected during visual review. No physical handheld test or full campaign playthrough is claimed.
