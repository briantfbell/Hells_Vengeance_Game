# Hell’s Bubbies — Hell’s Vengeance Game

A high-detail pixel-art RPG gift based on our Pathfinder campaign. This build contains twelve playable chapters, beginning with the **Night of Ashes** prologue: Kintargo, the Silver Star music shop, the hidden temple encounter, and the harbor escape.

## Play on another computer

Download this repository using **Code → Download ZIP**, extract the entire folder, and open **index.html** in a modern browser. Keep the art-test folder beside index.html. No installation, account, or original development laptop is required for offline play.

Alternatively, with Node.js 18 or newer installed, run `npm start` in the extracted folder and open http://127.0.0.1:8080. There are no npm dependencies to install. This address is local to whichever computer runs it.

## Starting a new story

Every launch opens the animated **Hell’s Rebels — a Hell’s Vengeance story** title screen, using Brian’s supplied Folken Games artwork. The screen flickers on and **Push A to Start** fades in. Press Enter/E/Space (or A at the title prompt) to open the main menu. Continue resumes the latest checkpoint; New game opens character selection; Load game offers four manual slots and portable save import; Settings contains audio and controls. Browsing or backing out of character selection preserves the existing checkpoint.

Choose one of the five opening companions, then receive the mission through Freya and Jason’s briefing. Reese joins in Longacre. Bruce’s portrait is available in the gallery; his recruitment awaits a confirmed joining point. Returning to the title from pause captures a checkpoint first; Continue returns to that progress. The title and all game views keep the same 640×480 frame. Flame, magic and ember effects stop when reduced motion is enabled.

## Controls

- Arrows / WASD: move or select. Enter / E / Space: confirm. B / Escape: back or pause. P also opens pause. Shift runs during exploration.
- Dialogue choices and character selection use the same direction and confirm controls.
- Combat: select a command, confirm, select its enemy or healing target, then confirm. B cancels targeting. The current action and last two completed actions remain visible.
- Pause: resume, party/equipment, inventory, four save slots, load, export/import, audio, controls, or title screen. Saves and file transfers are unavailable during combat.
- Exploration and combat share a fixed 640×480 logical screen (4:3), scaled uniformly to the available display. Mouse and touch remain supported.

## Included

- Five following prologue companions, connected scenes, turn-based combat, signature abilities, healing, bell-rope reinforcements, and checkpoint recovery.
- Compact retro command menus and visual D20/D4/D6/D8/D10 rolls. Command subtitles show ability details and remaining uses.
- Dim interior light effects. Separate water underlays animate beneath supported ship, dock and island foregrounds; the old full-map ripple distortion is removed. Reduced-motion settings pause ambient effects.
- Reusable Barzillai Thrune and Archbaron Darellus Fex character models, with three facings and automatic dialogue portraits. See docs/QUESTGIVERS.md.
- Speaker headshots and title names inside dialogue banners. Portraits reuse close-up crops of existing character artwork.
- Party Sprite Studio.html: seven-character art gallery. Reese and Bruce use the approved character references and do not join this prologue.
- legacy/: preserved original game for reference.
- docs/: artwork provenance and implementation notes. The raw campaign archive is not included.

## Saves

Checkpoints and four manual save slots use browser localStorage. Press B or P to save/load a slot inside the game frame. They remain on that browser and computer and do not sync through GitHub. File and HTTP versions can have different saves. Restart chapter replaces the current checkpoint. Use **Export save** to download your checkpoint, and **Import save** on another device’s start screen or game toolbar. Preview before replacing; Restore previous save recovers the checkpoint replaced by an import. See docs/SAVE_PORTABILITY.md.

## Hosting and privacy

This is a static website: index.html and art-test/ can be served by a static web host without a backend. A private repository is not itself a playable website. GitHub Pages is not enabled by this commit, and ordinary Pages sites can be public even when their source repository is private. Choose access-protected hosting before publishing campaign content if privacy is required.

## Handheld direction

The web build is the current playable prototype. Final handheld packaging, native gamepad mapping, further screen/readability refinement, cartridge-style removable storage remain future work. This is not a Game Boy ROM.

## Validation

Automated checks cover story prerequisites, progression, equipment, portable-save validation and every one of the 85 replay checkpoints. Browser verification covers selected journeys, dialogue, keyboard combat and the fixed-screen menus; this is not a claim of a complete twelve-chapter playthrough or physical handheld validation.

Run `npm test` for regression checks and `npm run balance` for seeded simulations of the actual combat engine. Balance statistics depend on the stated player strategy and are adaptation checks, not historical Pathfinder statistics.

## Next chapter and map layers

See docs/NEXT_PHASE_PLAN.md for the source-grounded voyage/Longacre production plan and Corrine timing. Open **Map Layer Studio.html** (or `/maps` on the local server) to inspect the transparent Western Star foreground over independent animated water. Chapter Two is now playable: continue at the Western Star after the prologue, sail to Remesiana, meet Cimri, complete the tannery job, and rescue Jamal at Ash House. El Guapo leaves at Remesiana; a Guapo player chooses a temporary viewpoint companion. The chapter ends with the sermon briefing. New maps follow docs/MAP_LAYER_SPEC.md; existing opaque maps use the shared renderer while awaiting later asset upgrades.

## Chapter Three and future art

Continue from the Ash House briefing into the sermon, four decrees, deputy ambush, and Fex audience. All seven party walking cycles now include opposite-foot poses. Open **Longacre Art Studio.html** (`/art`) for nine layered environments and eighteen NPC models/forms covering several upcoming story arcs. Gameplay now extends through the Kantaria docks and towers; later artwork remains available for subsequent arcs. See docs/LONGACRE_PRODUCTION.md. Portable saves, all three chapter walkthroughs, the future art gallery, offline startup, and a 320px layout were checked in the browser.

Combat now uses a parchment chronicle beside crimson command buttons. The current action appears above completed actions, newest first; older entries drop off automatically, and the history clears for each fight. The visible row count adapts to the screen without scrolling.

Exploration now has a visible task overlay and context-correct quest markers; public notices show `[X/4]`. Combat uses weapon-ready three-frame idles, larger right-aligned dice inside the dice panel, and rules subtitles on every command. Open **Combat Animation Studio.html** (`/idles`) for 23 prepared combatant models/forms. See docs/UI_AND_COMBAT_POLISH.md. For the campaign soundtrack, docs/SUNO_SOUNDTRACK_PROMPTS.md contains 67 instrumental generation prompts and combat variations; temporary instrumental music and effects are playable, with pause-menu volume and mute controls.

## Chapter Four and handheld menus

Continue from Fex’s audience into the Last Stand confrontation, Riley’s capture/interrogation, the empty hill investigation, and Bolgart’s wereboar transformation at the jail. Existing tavern, hill and NPC artwork is reused. Read docs/LAST_STAND_AND_HANDHELD.md for evidence, adaptation choices and controls. The party screen shows current weapons, combat numbers, health, remaining skills/potions and earned upgrades.

A complete keyboard-only browser playthrough covered the opening mission through Chapter Four, including every battle and the four-decree counter. Save/load slots and party browsing were checked at 320×200; exploration/combat frame bounds were checked across four viewports. Portable progression saves and seven validation tests pass. Native hardware/gamepad and filesystem adapters still need a later packaging pass.

## Inventory and equipment

Press B/P → Inventory to inspect personal weapons, recovered gear, shared potions and mission items. Equip Viggo’s scimitar on Freya after the altar pickup, or switch back to her katana. Damage rolls and combat text follow the selected blade. Use healing potions on injured companions outside combat; the supply is shared with combat and saved immediately. Equipment changes are locked during fights. Existing saves migrate automatically. See docs/INVENTORY_AND_EQUIPMENT.md for rules, source limits and validation.

## 640×480 game window

The game now uses one 640×480 (4:3) surface across exploration, combat, character selection, dialogue, travel, progression and pause/inventory menus. Browser admin controls remain below the game. Current map artwork and walk coordinates stay at their original proportions with a 40-pixel vertical offset; independent backgrounds fill the additional space. Combat uses a 368-pixel battlefield and the same compact 112-pixel command dock. See docs/SCREEN_LAYOUT_640480.md.

## Combat art, audio and Chapter Five

Three-phase weapon/casting sprites accompany eight-frame Burning Hands, healing and Chill Touch effects. Freya displays her equipped katana or recovered scimitar. Reduced motion uses brief static effects. Pause → Audio cycles music/effect volumes and mute; preferences stay in this browser. Original temporary instrumental cues include three combat variations, ready to be replaced by campaign tracks.

Chapter Five, Debts and Rumors, visits Gerya’s hospice and the church in chronological order before the hill search and wereboar confrontation. The later dockside visit establishes Ingoe’s ten-gold weekly agreement. Completed Chapter Four saves can continue directly; the section replay menu also offers Chapter Five. No additional advancement is inferred. See docs/COMBAT_AUDIO_AND_DEBTS.md.

## Chapter Six: Political Movement

Continue from a completed Chapter Five checkpoint, or use section replay 20. Investigate the gate’s Ovinnik, back away from the church standoff, keep watch with J’Mal, inspect the jailbreak and vanishing trail, release Bolgart, then follow the recorded dusk confrontation and Riley reveal. Sections 21–23 offer additional replay starts. There is no inferred new level-up.

Combat targets have amber attack brackets and green healing brackets. Choose a command, choose a target with directions, then confirm; B returns to commands. With a mouse, click a command then its target, or click the command again to confirm the current target. Completed actions stay in the left-hand log.

Open Political Movement Art Studio.html to inspect the new characters, mounted Freya and layered execution-square map. See docs/POLITICAL_MOVEMENT.md for source facts, adaptation decisions and art provenance.

### Chapter Seven: The Missing Dead

Continue from Chapter Six into the missing-remains investigation, four staged church encounters, the Red Mantis master’s release and training, and the church’s conversion. Replay sections 24–32 cover the new arc. Combat remains 640×480, with source-based weapons and new attack poses. See [chapter notes](docs/chapter-seven.md) for provenance and adaptation boundaries.

## Chapters Eight through Twelve

The playable continuation covers the accusation against Cimri, the armory ambush and jail fire, Fort Estazano, the Court of Spears, Zara’s extraction from Hardship’s Hearth, and the Kantaria dock and tower operations. See docs/chapter-eight.md through docs/chapter-twelve.md for source facts, staging choices, and unresolved evidence. The prison aftermath remains pending reconciliation; Bruce’s attendance and later advancement are not inferred.

## Menus, ready poses and combat tactics

Campaign progression is paginated in four-entry pages inside the game frame. Arrows/WASD select Previous, Next or Back; Enter/E confirms and B returns. Weapon-upgraded companions keep a subtle three-pose weight shift using their approved silhouettes, with motion disabled for reduced-motion settings or downed characters.

Enemy intentions stay fixed for the round; rank-and-file pairs can focus on the same companion. Completed responses are marked Done this round. A living enemy responds after its announced target’s command and acts at most once per round; any remaining response occurs at round end. Guard still provides +4 AC and halves landed damage for that round. Eliminating an announced attacker prevents its response. This timing is an intentional game adaptation, not a claim about the original tabletop initiative order.
