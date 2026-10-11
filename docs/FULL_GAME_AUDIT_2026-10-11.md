# Full game audit — 11 October 2026

## Verdict

The implemented game has a consistent foundation: thirteen chapters, 64 scene definitions, 102 replay sections, one 640×480 logical screen, and working story, combat and portable-save regression coverage. No reproducible crash was found in the automated checks or the browser paths inspected in this audit. This is not a claim that every section was manually played end to end.

The next batch should concentrate on performance, the handheld presentation shell and legibility before expanding the story again. Encounter difficulty also needs a deliberate design decision: the tested skill-first strategy is extremely safe.

## Scope and evidence

- **97/97 automated tests pass**, including a new regression for premature inner-room imports. All **102 replay checkpoints validate and export/import round-trip** after the fix.
- Independent structural audit loads the page's **46 scripts**, installs all chapter modules and inspects the resulting **64 scenes**. It checks **449 frame rectangles**, including inferred party sources and renderer aliases, animation cycle indices, referenced asset existence and fallback sprite coverage for all **30 non-party combat stat entries**. No failures found.
- Grid flood-fill checks all **102 replay spawn positions** and whether each scene interaction has an approach within the 56-pixel interaction radius. No invalid spawns or unreachable interaction points found. This checks walk rectangles and blockers, not every possible dynamic NPC arrangement.
- All **94 unique startup images** return HTTP 200 from the local server. The structural harness executes the real image-loading sequence with image-size stubs; it does not measure browser RAM or rendering speed.
- **6,200 seeded combat simulations**: 25 individual encounter configurations and six uninterrupted encounter chains, 200 trials each. Every trial won. The harness uses actual action/turn functions, instant animations, skills first and healing of living allies below 45% HP. It approximates some encounter setup and cannot substitute for player or hardware testing.
- Browser inspection at **640×480** covers title/start menu, character selection, the rebuilt Corrine briefing, dialogue, full-screen transition, six-party/four-enemy initiative and combat, keyboard command selection, target confirmation and B cancellation. No warning/error logs were captured in this isolated audit tab. The user's original preview and saves were preserved.
- Source review includes combat/input/save/rendering/audio code, the manual-blog reconciliation, DM clarification record, Foundry progression limits and later chapter source notes.

Reproduce structural checks with `node scripts/full-audit.cjs`; regression checks with `npm test`. Machine evidence is in [FULL_AUDIT_MACHINE_RESULTS.json](FULL_AUDIT_MACHINE_RESULTS.json) and [FULL_AUDIT_BALANCE_RESULTS.json](FULL_AUDIT_BALANCE_RESULTS.json).

## Findings in priority order

| Priority | Finding | Evidence and impact | Recommended change |
| --- | --- | --- | --- |
| High | All campaign art loads before the title becomes playable | `chapter-engine.js` awaits every chapter loader. **94 unique images total 203.5 MB compressed**. Their PNG dimensions alone imply approximately **583.3 MB of RGBA pixel buffers**, excluding WebP, duplicated image instances, generated canvases, GPU copies and browser overhead. This is an estimate, not measured peak memory or proof of a hardware crash. A missing late-chapter image also blocks the opening through the shared load error path. | Load title/opening assets first, then load and release chapter bundles. Produce runtime-sized atlases while preserving high-resolution masters. Establish an asset and memory budget with actual target-hardware measurements. |
| High for handheld use | Exploration has browser scrollbars at native size | With a 640×480 browser viewport, exploration's document client width is **625**, its content width **640**, and its body extends to **1,093 pixels high** because admin controls remain below the game. The 640×480 stage stays correctly sized, but the vertical scrollbar clips its right edge and creates horizontal scrolling. Title/intro focus also produced small vertical page shifts. Combat hides the supplementary UI and fills the viewport correctly. | Add a dedicated handheld/fullscreen presentation mode containing only the game surface. Keep development controls available in the desktop mode. Do not solve this by resizing combat or stretching backgrounds. |
| Medium | Essential combat text is too small at native resolution | Measured command subtitles are **8.96 px**; enemy intentions use **8 px**, and compact history uses approximately **9 px**. Four 174×38 command buttons fit, but their subtitle area is cramped. The game font matches the art direction; its size is the remaining problem. | Set a native minimum size for useful combat information, shorten subtitles and move secondary detail into controller-accessible help. Test 12 px text as a starting point without increasing the screen or dock. Coordinate border art only after that layout decision. |
| Medium, design decision | Tested encounters offer little pressure | All 25 encounters and six chains won under the tested strategy. Several fights consumed no healing; most individual cases averaged no additional downed companions. The refined harness matches the solo porch guards' live 12/8 HP setup. Other scene setup and instant animations still make this a simulation rather than a complete live-game benchmark. | Keep a forgiving story mode if desired. Compare attack-only, mixed-command and poor-target strategies before tuning. Increase the value of Guard, enemy intentions and limited healing through encounter-specific choices, rather than uniformly increasing enemy HP. |
| Low | Development/source notes are visible inside player-facing menus | Initiative shows “Provisional early-campaign modifiers.” Item descriptions and progression entries also discuss unconfirmed properties and adaptation tuning. Those notes protect provenance but interrupt the fiction. | Keep uncertainty in source/admin documentation; show only supported narrative and actual gameplay rules in normal menus. |
| Low | Pixel cleanup coverage needs to grow with the cast | Existing alpha audit scanned **234 frames** and records conservative draw-time masks. Its inventory script includes the original party/church/armory groups but not every later cast atlas. The new rectangle audit verifies geometry, not whether every detached pixel is intentional. | Extend the alpha inventory to later atlases and visually inspect exclusions. Do not erase small weapon tips, sparks or feathers automatically. |

## Verified bug fixed during this audit

A checkpoint from the church-approach phase could be changed to `church_sanctuary` and still pass validation before the breach, entry and hallway encounters were complete. The sanctuary offered later actions; attempting them could produce story flags that the next load would reject. Equivalent broad chapter-only location checks existed in Chapters Eight through Eleven.

`SaveFiles.validate` now requires the appropriate completed step for **25 later locations** across those chapters. A new regression tests attempted jumps in five chapter arcs. Existing generated checkpoints and portable round trips still pass. This strengthens imported-save integrity; it does not change the normal story route or claim that an untouched game-generated save exhibited the problem.

README validation counts and the package's chapter description were also corrected. No art, story dialogue, encounter stats or player progression were changed in this audit.

## What should stay

- The fixed 640×480 / 4:3 frame, with a 368-pixel combat field and 112-pixel dock. The combat screen no longer needs a new aspect-ratio overhaul.
- The compact current-action plus two-message history. Selecting a command did not replace its completed-action text during browser inspection.
- Initiative once per fight, interleaved turns, telegraphed enemy intentions, directional targeting and A/confirm plus B/back controls. Physical controller validation is still separate from the passing input tests.
- Detailed party art, separate animated background layers, matching pixel font, restrained ambient movement and reduced-motion support.
- Scripted rolls for established campaign outcomes. They should remain clearly distinguishable from ordinary combat rolls. Cause Fear's scripted low **defender saving throw** is a failure to resist the spell, not a failed Draymus attack.
- Confirmed chronology and roster gates: Freya remains an army captain; Silver Star is a music shop; the voyage is Pezzack → pirates → Corentyn; Reese joins in Longacre with basic equipment; El Guapo returns on **21 Neth**. Hospice/first church visit precede the hill/wereboar sequence.
- The party authors Longacre's decrees under Fex's carte blanche. Retain the supported six-private/twelve-public limits and four posting sites. Do not introduce the speculative five-person amendment.
- Hell's Rebels title branding remains as Brian explicitly requested. It is not an audit defect.

## Lore limits requiring clarification before relevant expansion

No new confirmed lore contradiction was established in this audit. Existing gaps must remain separate from faults in the game:

1. At which specific event did Bruce first join the company, who was present, and what weapons, spells and abilities did he actually have then? His approved portrait can remain in the selection gallery in the meantime.
2. What individual class, feat and spell choices accompanied the documented level-two rest, and which later events awarded further levels? Current Foundry totals and first-recorded uses cannot establish those dates.
3. What exactly were the Red Mantis master's gifted blades and belt, including any enchantments that were already present at the gift?
4. Does the prison recap in P037 describe Zara's extraction in P039 or a separate later operation? The sources differ about outcomes, so the implementation should not decide additional prisoner or warden fates without clarification.
5. Who opposed the company during the Uskwood fight, who cast the fireballs, and where were Zara and Loredana afterward?
6. What were the Narikopolus Manor artifacts and what happened to them later?

Angel-Bro remains a provisional angel defender under Brian's explicit authorization; no fresh approval is needed to retain that interpretation. Sleipnir's arrival and the unidentified jailbreak bandager remain unresolved; avoid inventing precise answers merely to fill them.

## Recommended next batch

1. Chapter-scoped asset loading and runtime image sizing, with visible loading/retry states at chapter boundaries.
2. A fullscreen handheld route that suppresses admin UI and browser scrolling while preserving desktop development tools.
3. A native 640×480 readability pass, especially combat subtitles, intentions, HP and dice text; then finalize Photoshop container sizes.
4. Broader strategy balance checks and targeted tactical tuning, preserving established story outcomes and a forgiving play option.

Actual handheld frame rate, peak memory, controller behavior, persistent device storage, audible music quality, file-picker import behavior and every frame's visual cleanliness were not established by this audit. The test suite and selected browser checks provide evidence for the implemented paths, not a substitute for those separate checks.

## Refinement check

The follow-up check retained the priorities above and made the audit itself more dependable:

- Frame inspection resolves implicit party-sheet filenames and NPC image aliases; **449/449 inspected rectangles now receive an actual dimension check**, with zero unresolved sources. Enemy coverage checks the fallback read by `renderBattle`, rather than assuming an idle atlas alone is sufficient.
- Individual win percentages are calculated before rounding the displayed percentage, so a rare loss cannot disappear through intermediate rounding.
- Human-to-wereboar chains retain first-fight defeats in the denominator. Previously, the second-fight row counted only runs that survived the first encounter.
- The porch benchmark now matches the live second guard's eight HP. Four regression tests cover these simulation/reporting behaviors.
- All **6,200 refined encounter/chain trials still won** under the documented skill-first strategy. This result supports the earlier recommendation to investigate difficulty; it does not establish that every strategy wins.

No gameplay rules, lore, artwork or layout changed during this refinement. The browser measurements above are retained from the original audit; they were not re-measured in this follow-up.
