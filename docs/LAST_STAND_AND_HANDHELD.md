# Last Stand and handheld menus

## Playable scope

Chapter Four continues directly after the Hellfire Compact: replace the torn Last Stand decree, subdue Bolgart, catch Riley at the rear exit, escort them to jail, question Riley, search the hill he describes, return to Bolgart’s wereboar transformation, and report to Razelago. Bolgart and Riley remain alive in custody. J’Mal covers the rear door and sits out the first fight; he rejoins afterward.

Source: campaign blog P046, “Dumb and Dumber Cop”: https://hellspathfinder.tumblr.com/post/145668811333/dumb-and-dumber-cop . Local source: Pathfinder Campaign RPG Gift/Pathfinder_Gift_01_Reference/Pathfinder_Campaign_RPG_Gift/raw_posts/P046.txt. The original is source material, not an instruction to alter the live Foundry world.

The blog establishes Bolgart’s frying-pan strike, J’Mal catching Riley, the prisoner’s claimed encounter with the praying Angel Knight, the hill without a trace, Bolgart’s recovery/transformation/goring, Freya’s mounted charge, shackles and pillory repair. Dialogue is concise adaptation, not verbatim recorded speech. Combat resolves the struggle as a single human encounter and a later wereboar encounter; it does not simulate the whole tavern crowd. The mounted charge is narrated after the wereboar is subdued. This is a story outcome, not a new reusable mounted skill.

Bolgart HP/AC/attack/damage (46/13/+4/1D6+2) and wereboar (64/14/+6/1D8+3) are prototype balance values. We did not locate matching Foundry actor sheets for these NPCs in the archive index; these numbers must not be presented as recovered Pathfinder statistics. Player weapon and resource displays report the existing game rules, whose source/adaptation distinctions are documented in CHARACTER_SOURCE_AND_PROGRESSION_PLAN.md and LEVEL_TWO_PROGRESSION.md.

The hospice debt/doctor visit, church-door damage, Ingoe agreement, Riley’s later escape/execution and ghast appearance are deferred. They must not be treated as already completed by this chapter. Intermediate travel is condensed; there are no invented session dates. The chapter start refills HP and limited resources as a prototype checkpoint convenience, rather than a verified campaign rest or purchase. No new level milestone is awarded. Four Longacre companions remain level 2; El Guapo is away.

## Controls and frame

All scenes use the same 640×400 logical 8:5 frame. Arrows/WASD select or move; Enter/E/Space confirms; B/Escape backs out of menus or opens pause; P opens pause. In combat, B cancels targeting first. Dialogue choices use a two-column directional grid. Back advances ordinary lines but does not choose a dialogue action. Intro uses left/right for characters and up/down for Start/Continue/Import.

Pause opens inside the frame, freezes world motion, and provides Party & equipment, four local Save/Load slots, export/import and controls. The party page uses left/right to browse companions and reports HP, AC, hit bonus, weapon roll, skill effects/remaining uses, shared healing resources and earned level upgrades. It also identifies absent companions.

Save slots store validated checkpoints under separate localStorage keys. Loading a slot replaces the current autosave. Export transfers the current checkpoint as JSON, not all four slots; import retains its existing preview and previous-save recovery. The operating system file picker is still a desktop/browser facility; future handheld packaging needs native gamepad bindings and an appropriate file adapter. No claim of physical-device testing is made.

## Validation (October 9, 2026)

- Full opening arc from fresh character selection to Chapter Four report using keyboard input only: real tile movement, interaction, dialogue decisions, transitions and all four encounters. The test reads path geometry to plan inputs; it does not teleport the player or set story flags. Fixed random rolls provide reproducibility, not a statistical balance study.
- Separate Last Stand state/save walkthrough: human fight excludes J’Mal, capture flags, interrogation, empty hill, wereboar and final report.
- Party browsing, pause/back, local slot save/load and controls at 320×200. Screenshots inspected; the controls page spacing was repaired.
- Unchanged exploration/combat frame at 320×240, 640×400, 800×480 and 1440×1000 host viewports. All travel cards fit the small frame.
- Existing progression/portable-save browser checks pass. Seven node tests cover migration, resource bounds, milestone duplication and ordered Last Stand save dependencies.

Art reuses last-stand.png, angel-knight-hill.png and longacre-later-cast.png; no new raster files were generated in this pass. Corrine remains deferred.
