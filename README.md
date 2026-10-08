# Hell’s Bubbies — Hell’s Vengeance Game

A high-detail pixel-art RPG gift based on our Pathfinder campaign. This build contains the playable **Night of Ashes** prologue: Kintargo, the Silver Star tavern, the hidden temple encounter, and the harbor escape.

## Play on another computer

Download this repository using **Code → Download ZIP**, extract the entire folder, and open **index.html** in a modern browser. Keep the art-test folder beside index.html. No installation, account, or original development laptop is required for offline play.

Alternatively, with Node.js 18 or newer installed, run `npm start` in the extracted folder and open http://127.0.0.1:8080. There are no npm dependencies to install. This address is local to whichever computer runs it.

## Starting a new story

A new game opens the character-selection screen. Browse the full party artwork and descriptions, choose one of the five Night of Ashes companions, and receive the mission briefing. Reese and Bruce are shown as provisional later companions. Existing saves resume automatically; use Restart chapter to return to selection, or Continue checkpoint from selection to keep your current progress. Selecting a new character starts a fresh checkpoint.

## Controls

- WASD or arrows: move. Shift: run. Click the map: walk to a location.
- E: interact. Click a nearby object to interact with that exact object.
- Dialogue: click a choice, or use its number shortcut. Enter continues ordinary dialogue.
- Combat fills one 4:3 screen with all five companions in the foreground and enemies opposite them. Choose an enemy, then a command. Arrow keys select commands; Enter activates a focused button. Click a companion in the battle scene to select a healing target, or use the Heal button/H. Q/E cycle enemy targets.
- Touch controls appear below the game.

## Included

- Five following prologue companions, connected scenes, turn-based combat, signature abilities, healing, bell-rope reinforcements, and checkpoint recovery.
- Compact retro command menus and visual D20/D4/D6/D8/D10 rolls. Focus or hover a command to see ability details and remaining uses.
- Looping harbor ripples, moving water reflections, and dim interior light effects. Reduced-motion settings pause ambient effects.
- Speaker headshots and title names inside dialogue banners. Portraits reuse close-up crops of existing character artwork.
- Party Sprite Studio.html: seven-character art gallery. Reese and Bruce are clearly provisional and do not join this prologue.
- legacy/: preserved original game for reference.
- docs/: artwork provenance and implementation notes. The raw campaign archive is not included.

## Saves

Checkpoints use browser localStorage. They remain on that browser and computer and do not sync through GitHub. File and HTTP versions can have different saves. Restart chapter replaces the current checkpoint. Save export/import is a future portability task.

## Hosting and privacy

This is a static website: index.html and art-test/ can be served by a static web host without a backend. A private repository is not itself a playable website. GitHub Pages is not enabled by this commit, and ordinary Pages sites can be public even when their source repository is private. Choose access-protected hosting before publishing campaign content if privacy is required.

## Handheld direction

The web build is the current playable prototype. Final handheld packaging, complete controller support, further screen/readability refinement, transferable saves, and cartridge-style removable storage remain future work. This is not a Game Boy ROM.

## Validation

The source prototype passed a complete chapter walkthrough, checkpoint reload, reinforcement and defeat branches, healing/smoke/enemy turns, visual dice checks, and mobile width checks. The repository build is checked separately for offline startup and bundled asset completeness.
