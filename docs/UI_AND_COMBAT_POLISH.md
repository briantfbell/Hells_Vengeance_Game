# Quest and combat polish

## Quest guide
The exploration overlay shows the current task in the upper-left. Three public postings use `[X/3]`; the fourth decree is delivered with Rhona’s separate dismissal at the jail. Their progress remains in ordinary exported checkpoints. Combat and character selection hide the overlay.

A larger translucent gold diamond with a dark border replaces the tiny marker. The quest guide resolves scene transitions as well as destinations: return to Razelago after the sermon and ambush, leave the bathroom after calming the spirit, and take the correct route toward the manor. Conversation markers sit above the actual speaker, rather than the interaction point below them. Completion removes the marker. Guide tests cover 21 stage/location combinations and the notice counter.

## Combat
Commands retain uppercase titles and include compact character-specific subtitles with weapon or ability, hit roll, damage roll, resources or duration. The parchment preview still carries the fuller rule description and the recent-action chronicle stays separate. The handheld layout allocates enough space for Jamal and Jason’s additional commands; party labels sit above it.

The dice tray is enlarged and positioned on the right inside the original dice panel. Labels and totals occupy its left. Razelago’s revealed portrait uses an explicit face crop; his concealed introduction still preserves the curtain/identity reveal.

## Three-frame combat idles
The active party and current enemies use new weapon-ready idle strips, distinct from the walking sheets. Frames cycle balanced → left-weight → balanced → right-weight with staggered timing and planted feet. Reduced-motion settings freeze the cycle. Defeated characters do not shift. Frame cropping/anchors live in `art-test/combat-idles.js`; original artwork is preserved.

23 existing models/forms have prepared idles: the seven party designs (Reese and Bruce provisional), Viggo, zealot, four deputies, Bolgart’s wereboar, Riley’s ghast, Lencia, Rhona, Sleipnir, Fex, Cimri, Allamar and her two sons. Only encounters already implemented are playable. New combatants introduced in later chapters will need the same idle-sheet contract. The twins’ ready swords are interpreted equipment; this does not assert new mechanical weapon statistics.

Open **Combat Animation Studio.html** or `/idles` to inspect all prepared cycles. Exact image-generation prompts are saved in COMBAT_IDLE_PROMPTS.json.

## Music
SUNO_SOUNDTRACK_PROMPTS.md supplies 67 copy-ready instrumental prompts, including 17 combat/boss variations, cue priorities, motif guidance, loop-editing notes and a producer/LLM hand-off. This update creates the prompt document; actual audio generation and in-game playback remain subsequent work.

## Validation
Browser checks cover marker stages/counters, hidden combat task HUD, subtitles for all five playable characters at 320px, dice geometry, distinct idle frames, reduced motion, the 23-model gallery, and the centered portrait. All three chapter walkthroughs and offline startup are checked for regression.
