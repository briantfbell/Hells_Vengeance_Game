# Controller support and in-frame help

Implemented October 11, 2026. The browser prototype supports controllers exposed through the standard Gamepad mapping. This prepares controls for handheld packaging; it does not install or port the game to a Miyoo.

| Controller | Action | Keyboard equivalent |
| --- | --- | --- |
| D-pad / left stick | Move, choose commands and targets | Arrows / WASD |
| A | Interact, advance, confirm command then target | Enter / E / Space |
| B | Back; ordinary dialogue continues, choices are never automatically chosen | B / Escape |
| B + direction | Run during exploration; releasing B after running does not pause | Shift + direction |
| B stationary | Pause on release | B / Escape |
| X | Inventory, inspect only during combat | I |
| Y | Party details | O |
| Start | Pause / resume when safe | P |
| Select | Current quest during exploration, combat help during a fight | F1 |

The pause menu also includes Current quest / Combat help, so the shortcuts are optional. Quest details reuse the current objective and its counters. Combat help explains targeting, initiative, Guard and shared healing. Equipment changes, save transfers and consumable use through inventory retain their existing combat locks.

## Input behavior

Only standard-mapped pads are used; the first available pad is selected and remains selected while connected. The browser may expose a controller only after pressing a button; release it before continuing. Control labels use A/B/X/Y conventions; browser mappings on other controllers may have different printed symbols. Nonstandard pads report their mapping requirement in Controls rather than guessing button indexes.

D-pad and stick share directions, with a 0.55 stick dead zone. Confirm and shortcuts fire once per press. Menu directions repeat after 350 ms, then every 110 ms. Exploration uses held direction state. Switching between exploration and menus, losing focus, disconnecting or entering a busy turn releases the controller keys and requires neutral input before accepting another press. Keyboard and mouse controls remain available.

No new save fields or campaign facts are introduced. Native Miyoo input, filesystem saves and launch packaging remain separate work. Physical controller feel and native-device compatibility still require hardware testing.

## Validation

Automated input tests cover standard mapping, dead zone, held confirm, menu repeat, run versus pause, screen changes, disconnect and busy locks. Existing combat, progression and portable-save regressions remain required. Browser checks exercise the same command handlers through keyboard shortcuts and verify their 640×480 panels; they do not simulate a physical connected controller.

Validation result: all 79 automated tests pass. Browser QA at 640×480 covered new-game keyboard navigation, I/O/F1 shortcuts, Start/P resume, combat help with the active character’s weapon, retained enemy targeting after help, and a disabled equipment-change button during combat. The preview used a separate localhost origin to preserve the normal development save.
