# Fixed-screen combat, attack audit and story rolls

Implemented 2026-10-08.

## Layout and animation

Exploration, combat, character selection, travel and level-up screens share one fixed 640×400 logical surface (8:5). Mode changes never change the canvas dimensions, frame width or frame position. The shared frame fits within the browser viewport, capped at the existing 1084px exploration width; browser-only title, party, save and touch controls sit below it.

The combat interface was rebuilt from scratch after the earlier responsive menu still changed proportions. All previous combat CSS rules were removed. The battlefield is always 640×288; the command dock is always the bottom 112 logical pixels (28%). Container-relative dimensions scale text, cards and spacing uniformly with the screen. There are no combat height breakpoints or minimum-pixel-height exceptions. A slim turn/target/aid header sits above two panes: the current action plus the two preceding actions on the left, and command cards on the right. Four commands use two columns; five use three. Action details remain in the cards and the focused command preview. History is bounded to two records in memory and the DOM, with no scrolling or resize observer.

Combat uses a dark, mostly plain combat void, drawn directly at 640×288. Faint translucent bands and sparse motes drift gently; reduced-motion mode freezes both. There is no masonry, floor grid or exploration-map scaling. Formation platforms use restrained opacity. Dice sit in the top left, away from the enemies in the top right.

Combat supports D-pad plus confirm/back input throughout. Arrows or WASD navigate the actual two- or three-column command grid, skipping unavailable cells. Enter, E or Space selects an action; attack/skill then offer enemy selection and potion/mending offer ally selection with the same directions. Confirm executes, while B or Escape returns to the command grid without spending a turn or resource. Guard and Smoke execute directly. The current card is visibly highlighted even when canvas has focus. Every new actor starts on Attack; inputs lock while rolls/actions resolve. Mouse actions, native target dropdown and Q/H shortcuts remain available. E is reserved for confirm rather than the old enemy-cycle shortcut.

Attacks use the existing three-pose sprite artwork with directed advance/recovery, a short lean, blade trails and timed impact effects. Casting uses distinct flame and cold-touch effects; Panache uses a rapier trail rather than a chair projectile. Guard, healing, smoke and enemy strikes also receive action effects. These are canvas-driven sprite/effect animations, not newly generated attack-frame atlases. Reduced-motion mode removes sprite displacement and uses a short stationary effect. Animation completes before applying damage and advancing the turn; combat RNG stays random.

## Accuracy audit

The game has simplified combat math. Recorded actor items establish that abilities exist on later sheets; they do not establish exact historical acquisition dates or opening loadouts. The revised early loadout uses plausible class-level-appropriate abilities from those sheets, an adaptation choice rather than a claim about original level-1 selections.

| Character | Established source | Implemented correction / remaining gap |
|---|---|---|
| Freya | Actor.KOt611BvSrOhib3t (Field Marshal Freya Kusanagi), Samurai 4 / Hellknight 10; Challenge (SAM), item cy5yJAZ3Su3ArJMj | Challenge replaces the unverified Iaijutsu skill. Its strike adds +1 damage at game level 1 / +2 at level 2. Daily uses and single-strike presentation remain simplified. Katana is the existing approved art/loadout; later named blade is not awarded early. |
| J'Mal | Actor.94VblZOUUnfRifHN; Sneak Attack (ROG), item QnPYzEYVWog5uL5h; blog P043 explicitly describes his daggers | Opening sneak bonus reduced to +1D6. Target already hit this round remains the game's simplified eligibility rule, not Pathfinder flanking/denied-Dex rules. Actual later assassin sabers remain future equipment. |
| Jason | Actor.AlT4CD1PVRkoMT6C; Burning Hands level 1, item 55svzDyp6ls8HDp0; Channel Negative Energy also recorded | Unsupported Hellfire skill becomes Burning Hands: 1D4 at game level 1, 2D4 at level 2. Single-target, automatic-hit presentation and use counts are simplified; area templates and Reflex saves are not implemented. Opening mace is unverified. The current sheet's Force Pike is later equipment with no established acquisition date. Mending remains a custom game healing action, not a verified spell called Infernal Mending. |
| Draymus | Actor.jSyYYNbh2qAx4OiB; Chill Touch level 1, item XacxjDDLzHcZbSV2; Vampiric Touch level 3, item 3Qy3CFpG8yVlwtqK | Early Vampiric Touch becomes Chill Touch, 1D6 with no self-healing. Touch attack, secondary effects and spell charges remain simplified. Current scythe/other weapons do not establish his opening weapon; the dagger remains provisional. Vampiric Touch is reserved for a later unlock. |
| El Guapo | Actor.L5DcsTIk8mrd7gm6, Swashbuckler 14; Panache item wHmoqD73EMNuq43J. Blog P041 describes drawing his rapier. | Unverified chair skill becomes Panache Thrust, a targeted rapier strike with +2 hit and 1D6+5 damage. This is a game interpretation of Panache, not a separately verified feat. Later sheet has Mithril Scimitar +2 and Revolver; no early acquisition is inferred. |

Freya and El Guapo were present in the full 133-actor archive outside the five records marked PCs. Their current sheets are high-level snapshots, not dated early sheets. No player combat art or gear is changed to late-campaign equipment on this basis.

Source archive: `C:/Users/Brian/Documents/Codex/2026-10-08/this-chat-is-for-the-current-9/outputs/Hells_Vengeance_Campaign_Archive`, index.json plus actor JSONs. Blog records: `Pathfinder Campaign RPG Gift/Pathfinder_Gift_01_Reference/Pathfinder_Campaign_RPG_Gift/raw_posts`.

## Story outcomes

Blog P049, In The Shit, explicitly reports:

1. J'Mal climbs the palisade unnoticed. Displayed story check is D20 face 14 +7 =21 (success).
2. He hides in the delivery pool. The wheelbarrow arrives regardless; this is an event, not a failed fence jump or an avoidable dice check.
3. His sap attack fails. Displayed story attack is face 1 +7 =8 (miss).
4. The owner's crossbow misses. Displayed story attack is face 1 +0 =1 (miss); the +0 is a neutral presentation value, not a sourced owner statistic.
5. Draymus controls/calms the bath spirit. Relevant necromancy checks display face 12 +6 =18 (success), including the optional grip-loosening route.

These faces/modifiers are presentation choices, not recovered historical dice results. Dice result text explicitly identifies a Story roll. Other checks and combat rolls remain random. Existing saved story flags prevent completed events replaying or duplicating rewards.

## Validation

Browser checks match exploration/combat/return frame dimensions and coordinates at 320×240, 640×400, 800×480 and 1440×1000 browser sizes. Their game frames are respectively 320×200, 640×400, 768×480 and 1084×677.5; all use the same 640×400 logical canvas. Intro profiles and level-up screens are checked for overflow; every character's command text fits; target selection; badge positions; animation start/end; reduced motion; successful stealth, failed sap/crossbow with RNG forced low; subsequent random combat roll still obeys RNG. The rebuilt dock is checked to stay exactly 28% of the frame at every tested size, across all five turns, long action messages and focused command previews. History retains exactly two preceding actions. Void pixels change over time in normal motion and stay identical with reduced motion. Keyboard tests cover commands, enemy/ally targets, auxiliary skills, cancellation, disabled actions, busy locking, a real attack and automatic selection on the next turn; dice placement is checked against the enemy formation. A real opening-chapter playthrough checks the stage bounds on combat entry and after victory, then completes the escape, ship and save reload. Full progression/save tests cover the affected branches.
