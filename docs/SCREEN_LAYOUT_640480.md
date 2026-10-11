# Current game window: 640×480

This layout supersedes the earlier 640×400 / 8:5 display notes. The game canvas is always 640×480; the stage and viewport-fitting CSS use 4:3 in every mode. At a 640×480 host viewport, the game takes exactly that rectangle. At smaller or larger sizes it scales uniformly. Supplemental browser controls remain outside the stage below it.

Combat uses 368 pixels of battlefield and 112 pixels of commands (23⅓% of the screen). The extra vertical space goes to the battlefield; command text/buttons remain compact. Party/enemy positions use the new battlefield height. The void animation and dice overlay follow the new screen bounds.

Current world artwork, walk geometry, path cells, lights and saved positions still use their existing 640×400 coordinates. Render the world at y+40 inside the larger viewport, including actors and objective markers. Layered backgrounds extend above/below the centered floor art. No map image is stretched to 640×480. Input converts screen y back to world y by subtracting 40; combat pointer input uses full-screen coordinates. Old saves and 400-pixel map sampling in the light-mask code intentionally remain valid. Additional screen area is background rather than new walkable terrain.

Intro, dialogue, journey, level-up and pause/inventory overlays use the full stage. No mode changes the canvas height to 400. Sprite gallery/map studio canvases are separate tools and retain their asset-preview dimensions.

Validation: stage/canvas bounds and all combat command cards checked at 320×240, 640×480, 800×480 and 1440×1000 host viewports. Intro, briefing, dialogue, travel, pause, inventory and real level-up retain identical stage bounds. Exploration clicks target the shifted map correctly. Existing saves decode without coordinate migration. Inventory equipment/potion tests, actual combat damage, Last Stand story tests and the ten save/progression tests pass. Ship, intro and combat screenshots were visually inspected; background and sprite proportions are preserved. This is browser preparation for the Miyoo display, not a completed native device port.

## Miyoo control plan — browser mapping implemented

Brian accepted this control plan on October 9, 2026. The standard browser controller mapping and shortcuts are now implemented; see CONTROLLER_SUPPORT.md. Native Miyoo packaging remains future work. Retain WASD/arrows and Enter/E during development.

| Button | Exploration | Combat / menus |
| --- | --- | --- |
| D-pad | Move | Navigate commands, choices and targets |
| A | Interact / advance dialogue | Confirm command, then confirm target |
| B | Tap while stationary: pause; hold while moving: run | Cancel targeting / return to previous menu |
| X | Inventory shortcut | Inspect inventory; equipment and potion use remain locked during combat |
| Y | Party details shortcut | View equipment, stats and remaining abilities |
| Start | Pause | Pause |
| Select | Current quest details | Combat help |

B advances ordinary dialogue but never automatically chooses a dialogue action. All essential gameplay remains reachable using D-pad + A/B; X/Y are shortcuts. The run/pause distinction needs physical-device testing. The browser adapter implements shortcuts, quest details and combat help. Native hardware mapping remains to be validated.

## Remaining agenda

1. Combat feedback and weapon-specific animations: readable hit/miss reactions, damage/healing numbers, distinct melee/spell effects, and art that follows equipped weapons (including Freya’s recovered scimitar).
2. Audio system: exploration/combat tracks, ambient and interface/action sounds, music/effects volume settings; integrate supplied Suno tracks.
3. Source-grounded next story chapter: reconcile the doctor, church and Ingoe events, then work toward Riley’s later escape and consequences without inventing advancement dates.

Inventory/equipment and the 640×480 game window are complete. Physical controls and native Miyoo packaging remain later work.
