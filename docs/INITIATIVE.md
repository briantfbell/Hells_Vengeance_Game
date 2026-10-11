# Combat initiative

Implemented October 11, 2026. Combat stays within the existing 640×480 frame.

## Order and reveal

Every involved party member and enemy rolls one random D20 at battle setup. Total = die + initiative modifier. The sorted order is reused every round. A tie favors the higher modifier, then original encounter order; tied identical enemies keep distinct encounter indexes. Natural 1 and 20 have no special initiative effect.

The full ranked list shows each D20, modifier and total in a two-column reveal. Its restrained animation lasts roughly 1.5 seconds; Enter/E/Space, B, or the button immediately begins the fight using the same completed rolls. Skipping never rerolls. Reduced motion removes the reveal animation. No combat command can execute while the reveal or enemy turns are active.

Now/Next appears above enemy intentions. Enemy turns resolve automatically in their rolled positions. Downed characters and defeated enemies are skipped; a revived character can act again at their original position. J’Mal’s first-round church paralysis skips his position without changing the order; he rejoins in round two. Support, smoke duration and shaken duration continue to update at round boundaries.

## Provisional modifiers

These are deliberately provisional game values, not reconstructed historical Pathfinder bonuses. They do not incorporate later Foundry equipment, feats, buffs, or current-sheet Dexterity.

| Character | Modifier |
| --- | ---: |
| Freya | +2 |
| J’Mal | +4 |
| Jason | +0 |
| Draymus | +1 |
| El Guapo | +3 |
| Reese | +4 |
| Every enemy | +0 |

The reveal labels these early-campaign modifiers as provisional. Confirmed early initiative totals can replace this table later. Bruce does not enter combat before his recruitment is established.

## Guard and scripted openings

Guard retains +4 AC and halves landed damage. Protection expires at the beginning of the owner’s next eligible turn, including protection against enemies who act before that turn after the round wraps. It no longer expires merely because the round number changes.

The scripted temple injury and failed-intimidation opening occur before the normal initiative reveal. J’Mal’s injury is preserved. A surprise enemy strike already taken in round one is not repeated at that enemy’s normal position. Other historical story rolls and outcomes are unchanged.

Initiative exists only for the current fight. Save files keep their established pre-fight checkpoint behavior; no migration or historical advancement is introduced.

## Validation

Regression checks cover rolled totals, deterministic ties, duplicate enemy identities, dead/paralyzed skips, enemy-first turns, once-per-round actions, and Guard across a round boundary. The balance harness runs the actual mixed-turn engine with seeded initiative dice; the saved results describe its skill-first/heal-below-45% strategy. All 75 automated tests pass. The browser check at 640×480 verified a nine-combatant reveal, keyboard start, and a party → enemy → party sequence matching the displayed order. The seeded harness completed 200 runs per encounter case plus chained encounters. Hardware validation remains pending.
