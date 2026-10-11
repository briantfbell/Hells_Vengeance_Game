> October 2026 audit follow-up: enemies now respond after their announced target’s command, once per round. Remaining responses occur at round end; pairs of ordinary guards/rangers/acolytes can focus the same target. Guard’s +4 AC and half-damage benefit remain unchanged. No creature HP, character levels, story rolls or historical feats were changed. Campaign history now uses four-entry D-pad pages. The current canvas is 640×480; earlier implementation notes below are historical.

# Enemy intent, Guard and campaign progression

## Game behavior

Enemy intent is announced at the beginning of each round, in a compact panel below the dice. It shows move and target; heavy moves are highlighted. It never replaces the recent-action log. The target stays fixed until the next round. If that target falls before the enemy attacks, that enemy loses its opening rather than silently attacking someone else.

- Zealots pressure the living ally with the lowest fraction of HP.
- Viggo alternates a scimitar cut and a heavier slash (+2 damage).
- Human Bolgart pressures the first two living party members with brawling swings.
- Wereboar Bolgart alternates a gore charge (+3 damage) and a tusk strike.
- The gate guardian alternates a heavy claw (+3 damage) and a claw.
- The Angel Knight alternates ordinary and heavier sword strikes (+2 damage).
- Deputies and rioters rotate targets between rounds.

These tactics are adaptation choices, not new canonical feats or historical combat transcripts. Existing story outcomes and scripted rolls are preserved. No base enemy stats changed.

Guard uses the character’s turn and lasts through the ensuing enemy phase: +4 AC and half incoming hit damage, rounded down to a minimum of one. Heavy bonus damage is included before reduction. Guard does not prevent the scripted temple injury or other fixed story events.

## Source-backed progression

The pause menu now has a Campaign progression journal. It derives entries from saved story flags and the existing validated milestone, so replaying, loading or importing never duplicates an award. It records the scimitar’s recovery and subsequent disposal, the Ash House level-2 rest, Reese’s recruitment with basic gear, and El Guapo’s 21 Neth return. It does not expose future milestones in advance.

The level-2 rest retains the already approved simplified mechanics in LEVEL_TWO_PROGRESSION.md. Current skill/weapon information remains available in Party & equipment, including Reese’s Aimed Shot. No new late-game spells, magic items, or class levels were assigned to early chapters.

Future schedule requiring evidence:

| Beat | Evidence / decision still needed |
|---|---|
| J’Mal’s Red Mantis instruction and blades | Inspect complete blog beat and weapon acquisition records; do not substitute current master weapons for the training blades. |
| Freya’s cave-giant belt runes | Confirm encounter placement and resulting item mechanics before granting bonuses. |
| Later PC level-ups | Obtain individual historical levels/choices; current Foundry class totals and unidentified chat cards do not date advancement. |
| Reese’s later magic equipment | DM confirms his early basic bow/armor; dated acquisition evidence needed for Stormcaller and other later items. |

## Verification

Run `npm test` and `npm run balance`. The balance harness uses the real action and enemy-turn code, now including announced intents and heavy attacks. Its skill-first strategy does not Guard: this is a baseline for whether Guard is mandatory, not an optimal tactical comparison. All 1,600 sampled fights succeeded; the crowded temple averaged 1.67 potions remaining, versus 1.85 before this pass. Opening fights remain forgiving.

Keyboard verification also uncovered and fixed brief direction taps being missed between animation frames. A direction key now starts an idle movement step immediately, while held movement retains the existing loop. Locked states and ongoing steps still prevent extra movement.

Browser QA used a separate localhost origin so the normal development save was untouched. Startup, character choice, the briefing, exploration, transitions, progression journal and save-slot round trip were exercised with keys. All 23 section checkpoints were checked (the opening briefing separately, then a keyboard replay sweep of the remaining 22), confirming 640×480 canvas size, objectives and expected party membership. This checkpoint sweep is not an uninterrupted complete-story playthrough.

The dusk confrontation was also completed with keyboard commands: all five combatants Guarded through one enemy phase, then used attacks to win. The browser log showed Guard absorbing 3 of a 6-damage hit, and the scripted disguise/fear sequence resumed after victory without changing its roll.

The guardian encounter was checked at an actual 640×480 browser viewport: canvas 640×480 at (0,0), command dock 640×112 at y=368, and no overflow in the dock, actions or intent panel. All six party positions fit, including J’Mal’s fallen pose. Checkpoint observations are preserved in keyboard-section-checks.json.
