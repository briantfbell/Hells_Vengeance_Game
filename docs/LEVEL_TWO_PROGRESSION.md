# Level two and sourced character profiles

Implemented 2026-10-08. The **timing** of the level-2 milestone is supported by blog P048: the party rests at Ash House after countering the Longacre sermon, before the decrees. Exact original class/feat/spell selections are not recorded. The mechanical increases below are the game's simplified progression, authorized as this implementation pass; they do not claim to reproduce historical Pathfinder level-up choices.

| Character | Max HP | Attack modifier | Existing skill uses |
|---|---|---|---|
| Freya | 38 → 44 | +6 → +7 | Iaijutsu Strike 1 → 2 |
| J'Mal | 30 → 35 | +7 → +8 | Sneak Attack 2 → 3 |
| Jason | 32 → 37 | +4 → +5 | Hellfire 2 → 3 |
| Draymus | 26 → 30 | +3 → +4 | Vampiric Touch 3 → 4 |

The rest restores these four companions' HP and skill charges, plus Jason's shared mending charges. Potions are not replenished. Damage dice, AC and weapons stay at their existing opening-game values. El Guapo is away and remains level 1; this does not establish his canonical advancement elsewhere.

The improvements screen appears before the next-morning travel card, lists the four individual changes, and waits for Continue. Enter, Space or E also continues. Party cards show individual levels.

## Saves

Checkpoint version 2 contains `progression.levels` and the unique `longacre-sermon-rest` milestone. The portable file envelope remains formatVersion 1; its nested checkpoint is version 2. Derived stats/skill limits are rebuilt from immutable opening values and saved levels on every reset.

- Version-1 saves before `decreesIssued` migrate to level 1.
- Version-1 saves after `decreesIssued` receive the four companions' level-2 increases. Living characters gain only the max-HP difference, preserving their existing missing HP; defeated characters stay at zero. Story flags, leader, original leader, roster, position, used skill counts and consumables are preserved.
- Migration is stored as version 2 at the resumed checkpoint. Export/import/reload never adds the increases twice.
- Milestone and levels must agree with the story flag. Unsupported levels, duplicate/unknown milestones, invalid resources and inconsistent state are rejected before import.
- The award and next-day quest flag are saved before showing the screen. Closing or resetting during the screen cannot lose the award or grant it twice. Resuming does not replay the presentation.

## Character sources and artwork

J'Mal's display spelling and Draymus Keshaal Mortiarum's full profile name now follow the actor exports. Internal IDs remain unchanged for old-save compatibility. Reese's profile identifies a Strix ranger/arcane archer with wizard training; Bruce's profile identifies an Aasimar with monk, sorcerer and Dragon Disciple training. They remain later companions, not selectable prologue protagonists.

The later-companion preview now uses unchanged portraits from the supplied campaign archive, preserving the artwork's existing marks. These are current/later appearances, not proof of their appearance at campaign start. Existing provisional sprite sheets remain labeled provisional in the sprite gallery until the pixel-art adaptation pass.

| Local image | Source actor / archive record |
|---|---|
| art-test/bruce-foundry-portrait.webp | Actor.jdG5GJYDBxBSI5sJ; images/files/a2883b9acffb84892932_dragon_blue_scales_glowing_eyes_black_horns_bruce.webp |
| art-test/reese-foundry-portrait.webp | Actor.bE2xsLBc2OVDoxrN; images/files/6671317beafc639699ae_stryx_male_rhys_arcane_archer_ranger.webp |

Archive root: `C:/Users/Brian/Documents/Codex/2026-10-08/this-chat-is-for-the-current-9/outputs/Hells_Vengeance_Campaign_Archive`; mappings: images/references.csv. Bruce's image shows a blue-scaled, horned humanoid; it should not be treated as a confirmed full-dragon transformation.

## Validation

`npm test` covers legacy migration, injuries/defeated status, resource limits, portable round trips, forged/duplicate progression and immutable base rules. Browser checks cover the actual rest interaction, handheld/landscape/desktop fitting, repeat awards, two-device export/import, restored combat bonuses/resources, sourced profiles, the full Chapter Three walkthrough, and the existing save cancel/restore/rejection flow.

Next production phase remains the Bolgart/Riley and Longacre church sequence, followed by J'Mal's sourced Red Mantis training. Later unlocks require explicit story/item evidence or a documented adaptation decision.
