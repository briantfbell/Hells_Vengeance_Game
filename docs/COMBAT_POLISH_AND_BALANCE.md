# Combat polish and balance audit

Enemy tactics and Guard were subsequently added; see ENEMY_TACTICS_AND_PROGRESSION.md. The repeatable results below reflect the current tactics.

- The game window remains 640×480. Gold diamonds mark the enemy target; green diamonds mark healing recipients. Target mode adds corner brackets and explicit left/right, confirm and back instructions. Dead enemies are skipped, target navigation wraps, and downed allies remain selectable for eligible healing. Temple J’Mal retains his potion refusal.
- Downed allies lie horizontally on the ground using their existing approved sprites, with a DOWN label. This is a rendered fallen pose, not new character artwork. Revived allies return to their ready animation.
- Actions now have wind-up, contact at 62% of their animation, and follow-through. HP, healing, potion use and damage numbers change at contact. Hit reactions and pixel sparks align with contact. Reese releases his arrow before it travels; misses pass wide. Spell effects appear after the caster winds up. Reduced-motion mode retains quick effects without recoil or marker bobbing.

## Repeatable balance evidence

Run `node scripts/combat-balance.cjs`. Results are saved in `docs/combat-balance-results.json`.

The harness executes the actual game action and enemy-turn functions with instant animations and seeded dice. It uses skills while available, then normal attacks; it heals living allies below 45% HP. Each encounter has 200 runs. It preserves the current roster, level milestones, scripted J’Mal injuries and Freya’s reserved execution charge. The human-to-wereboar sequence also runs without refreshing resources.

All sampled runs succeeded. Mean duration is approximately 3 rounds for the quiet temple, 5 for the sounded bell, 4 for deputies, 3 for each Bolgart form, 2 for the guardian, and 3 for the execution. Average potions remaining ranged from 1.67 to 2.00 out of two. These results show forgiving introductory story encounters under this strategy, not proof that every player or strategy will win. The harness does not evaluate human comprehension, controller feel, rendering, or the entire campaign’s resource economy.

No enemy values or historical character abilities were changed in this polish pass. A future difficulty option or enemy action-pattern pass should focus on the guardian and solo Bolgart encounters if more challenge is desired. Damage inflation alone would not resolve their disadvantage against five attackers. Reese’s early numbers remain provisional adaptation values.
