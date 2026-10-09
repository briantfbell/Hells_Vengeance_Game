# Hell’s Bubbies — Hell’s Vengeance Game

A high-detail pixel-art RPG gift based on our Pathfinder campaign. This build contains four playable chapters, beginning with the **Night of Ashes** prologue: Kintargo, the Silver Star tavern, the hidden temple encounter, and the harbor escape.

## Play on another computer

Download this repository using **Code → Download ZIP**, extract the entire folder, and open **index.html** in a modern browser. Keep the art-test folder beside index.html. No installation, account, or original development laptop is required for offline play.

Alternatively, with Node.js 18 or newer installed, run `npm start` in the extracted folder and open http://127.0.0.1:8080. There are no npm dependencies to install. This address is local to whichever computer runs it.

## Starting a new story

A new game opens the character-selection screen. Browse the full party artwork and descriptions, choose one of the five Night of Ashes companions, and receive the mission directly from Barzillai Thrune in a staged dialogue scene. Reese and Bruce are shown as provisional later companions. Existing saves resume automatically; use Restart chapter to return to selection, or Continue checkpoint from selection to keep your current progress. Selecting a new character starts a fresh checkpoint.

## Controls

- Arrows / WASD: move or select. Enter / E / Space: confirm. B / Escape: back or pause. P also opens pause. Shift runs during exploration.
- Dialogue choices and character selection use the same direction and confirm controls.
- Combat: select a command, confirm, select its enemy or healing target, then confirm. B cancels targeting. The current action and last two completed actions remain visible.
- Pause: resume, party/equipment, inventory, four save slots, load, export/import, controls, or title screen. Saves and file transfers are unavailable during combat.
- Exploration and combat share a fixed 640×400 logical screen (8:5), scaled uniformly to the available display. Mouse and touch remain supported.

## Included

- Five following prologue companions, connected scenes, turn-based combat, signature abilities, healing, bell-rope reinforcements, and checkpoint recovery.
- Compact retro command menus and visual D20/D4/D6/D8/D10 rolls. Command subtitles show ability details and remaining uses.
- Dim interior light effects. Harbor ripple animation has been removed. Reduced-motion settings pause ambient effects.
- Reusable Barzillai Thrune and Archbaron Darellus Fex character models, with three facings and automatic dialogue portraits. See docs/QUESTGIVERS.md.
- Speaker headshots and title names inside dialogue banners. Portraits reuse close-up crops of existing character artwork.
- Party Sprite Studio.html: seven-character art gallery. Reese and Bruce are clearly provisional and do not join this prologue.
- legacy/: preserved original game for reference.
- docs/: artwork provenance and implementation notes. The raw campaign archive is not included.

## Saves

Checkpoints and four manual save slots use browser localStorage. Press B or P to save/load a slot inside the game frame. They remain on that browser and computer and do not sync through GitHub. File and HTTP versions can have different saves. Restart chapter replaces the current checkpoint. Use **Export save** to download your checkpoint, and **Import save** on another device’s start screen or game toolbar. Preview before replacing; Restore previous save recovers the checkpoint replaced by an import. See docs/SAVE_PORTABILITY.md.

## Hosting and privacy

This is a static website: index.html and art-test/ can be served by a static web host without a backend. A private repository is not itself a playable website. GitHub Pages is not enabled by this commit, and ordinary Pages sites can be public even when their source repository is private. Choose access-protected hosting before publishing campaign content if privacy is required.

## Handheld direction

The web build is the current playable prototype. Final handheld packaging, native gamepad mapping, further screen/readability refinement, cartridge-style removable storage remain future work. This is not a Game Boy ROM.

## Validation

The Chapter Two browser walkthrough covers the complete continuation, Guapo viewpoint selection, roster persistence after reload, and a 320px viewport.

The source prototype passed a complete chapter walkthrough, checkpoint reload, reinforcement and defeat branches, healing/smoke/enemy turns, visual dice checks, and mobile width checks. The repository build is checked separately for offline startup and bundled asset completeness.

## Next chapter and map layers

See docs/NEXT_PHASE_PLAN.md for the source-grounded voyage/Longacre production plan and Corrine timing. Open **Map Layer Studio.html** (or `/maps` on the local server) to inspect the transparent Western Star foreground over independent animated water. Chapter Two is now playable: continue at the Western Star after the prologue, sail to Remesiana, meet Cimri, complete the tannery job, and rescue Jamal at Ash House. El Guapo leaves at Remesiana; a Guapo player chooses a temporary viewpoint companion. The chapter ends with the sermon briefing. New maps follow docs/MAP_LAYER_SPEC.md; existing opaque maps use the shared renderer while awaiting later asset upgrades.

## Chapter Three and future art

Continue from the Ash House briefing into the sermon, four decrees, deputy ambush, and Fex audience. All seven party walking cycles now include opposite-foot poses. Open **Longacre Art Studio.html** (`/art`) for nine layered environments and eighteen NPC models/forms covering several upcoming story arcs. Later arcs have art prepared; their gameplay is still to build. See docs/LONGACRE_PRODUCTION.md. Portable saves, all three chapter walkthroughs, the future art gallery, offline startup, and a 320px layout were checked in the browser.

Combat now uses a parchment chronicle beside crimson command buttons. The current action appears above completed actions, newest first; older entries drop off automatically, and the history clears for each fight. The visible row count adapts to the screen without scrolling.

Exploration now has a visible task overlay and context-correct quest markers; public notices show `[X/3]`. Combat uses weapon-ready three-frame idles, larger right-aligned dice inside the dice panel, and rules subtitles on every command. Open **Combat Animation Studio.html** (`/idles`) for 23 prepared combatant models/forms. See docs/UI_AND_COMBAT_POLISH.md. For the campaign soundtrack, docs/SUNO_SOUNDTRACK_PROMPTS.md contains 67 instrumental generation prompts and combat variations; audio playback is not yet installed.

## Chapter Four and handheld menus

Continue from Fex’s audience into the Last Stand confrontation, Riley’s capture/interrogation, the empty hill investigation, and Bolgart’s wereboar transformation at the jail. Existing tavern, hill and NPC artwork is reused. Read docs/LAST_STAND_AND_HANDHELD.md for evidence, adaptation choices and controls. The party screen shows current weapons, combat numbers, health, remaining skills/potions and earned upgrades.

A complete keyboard-only browser playthrough covered the opening mission through Chapter Four, including every battle and the four-decree counter. Save/load slots and party browsing were checked at 320×200; exploration/combat frame bounds were checked across four viewports. Portable progression saves and seven validation tests pass. Native hardware/gamepad and filesystem adapters still need a later packaging pass.

## Inventory and equipment

Press B/P → Inventory to inspect personal weapons, recovered gear, shared potions and mission items. Equip Viggo’s scimitar on Freya after the altar pickup, or switch back to her katana. Damage rolls and combat text follow the selected blade. Use healing potions on injured companions outside combat; the supply is shared with combat and saved immediately. Equipment changes are locked during fights. Existing saves migrate automatically. See docs/INVENTORY_AND_EQUIPMENT.md for rules, source limits and validation.
