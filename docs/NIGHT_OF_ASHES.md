# Night of Ashes playable chapter

Open `../Night of Ashes.html`, or visit the local preview at http://127.0.0.1:52039/chapter while serve.cjs is running.

A separate high-detail pixel-art chapter prototype. The original Hell's Bubbies.html and previous art studies remain available.

- Five prologue companions follow the selected leader through Kintargo, the Silver Star tavern, and its hidden temple.
- Authored collision grids, click-to-walk pathfinding, WASD/arrows, Shift running, E interaction, and touch controls.
- Source-game dialogue and Night of Ashes mission: Viggo's scimitar, planted rapier, burning the temple, and harbor departure.
- Bell-rope choices change zealot reinforcements. Turn-based combat uses source-game party stats, signature abilities, healing, guard, and enemy rolls. This is a simplified playable encounter, not a complete Pathfinder rules implementation.
- Scene checkpoints save in browser localStorage. Restart chapter clears current progress by replacing the checkpoint. Load checkpoint restores the last saved scene, not an exact walking position. Each browser/origin has its own save.
- Dim light flicker respects reduced-motion preferences. PNG scene artwork remains static; animation is rendered by the game.
- Reese and Bruce remain clearly provisional in the sprite studio; they are not members of this prologue party.

New assets: chapter-tavern.png, chapter-temple.png, chapter-npcs.png. Generated with the built-in ImageGen tool as Gothic high-detail pixel-art environments and transparent priest/zealot figures. NPC frame rectangles are detected from alpha without modifying source artwork. Party art and frame metadata reuse the approved sprite study. Environment positions and collision shapes are authored for this prototype.

Validation: validate-chapter.cjs exercises the route, bell-rope choice, fight, aftermath, escape, checkpoint reload, and mobile width. QA screenshots are saved alongside the script. Deterministic test randomness is injected only by the test browser; the game uses normal random rolls.

Additional branch validation: defeat/retry restores the checkpoint health; a sounded bell adds three zealots; potions heal and consume stock; smoke persists through the enemy phase and decreases by round. Labels were checked for correct UTF-8 punctuation.

Combat UI update: retro cream command windows with two-column action/choice buttons and arrow-key focus navigation. Actual D20 checks/attacks and D4/D6/D8/D10 damage/healing rolls animate onscreen. Each die shows its final result, followed by modifiers and total. Cosmetic tumbling does not consume extra random rolls. Reduced motion uses immediate settling. Roll playback blocks overlapping actions and cancels cleanly when loading or restarting a checkpoint. validate-dice-ui.cjs checks an intimidation D20, two-D10 strike, menu focus, and mobile layout.

Handheld layout update: portrait/title dialogue banners; a separate 4:3 battle composition uses larger rear-facing party sprites opposite front-facing enemies. All five companions remain visible, and the active character is enlarged. Targets, healing selection, turn prompt, and commands fit inside the game frame. Only the latest battle message is shown; the longer log remains internal. Layout checks cover 640x480, 480x320, 320x240, and a portrait phone viewport. Every character command set fits without page or menu overflow. Full chapter transitions and save reload passed. Existing directional sheets create the staging; dedicated diagonal battle poses could refine the perspective later.
