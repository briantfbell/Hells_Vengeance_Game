# Combat art, audio and Debts and Rumors

## Art integration

Built-in image generation with transparent backgrounds, October 9, 2026. Saved asset set: `art-test/spell-effects-v1.png`, `attack-freya-v1.png`, `cast-party-v1.png`, `attack-party-v1.png`. The assets are unmodified tool outputs; frame metadata records cell rectangles and foot anchors. Combat code selects frames and scales them into the existing fixed 640×480 screen.

Prompt set: eight equal columns by three rows of dark fantasy pixel spell effects (Burning Hands target burst/embers, green-gold healing spiral, cyan/violet Chill Touch); three equal columns by two rows of Freya katana/scimitar wind-up, strike and recovery matching her existing rear sprite; three columns by two rows of Jason and Draymus casting gestures matching their existing rear sprites; three columns by four rows of J’Mal daggers, El Guapo rapier, Jason mace and Draymus dagger wind-up, strike and recovery. The melee sheet was regenerated with wider safe margins to reduce crossing between cells. These are visual adaptations of the existing game actions, not new abilities or evidence of historical equipment.

Burning Hands appears as a burst at the affected enemy; this does not rename it Fireball or change its rules. Healing uses the recipient’s position. Missed touch spells do not display an impact. Brief static effects replace frame motion under reduced-motion settings.

## Audio

Pause → Audio provides separate music and effect volumes in 25% steps, plus mute. Initial music is quiet (25%), effects 45%; the first effects adjustment selects 50%. Preferences persist separately from campaign checkpoints. A trusted key/click unlocks browser audio. Hidden tabs suspend playback.

These are original temporary synthesized instrumental cues, with three alternating combat arrangements; they are not completed Suno campaign tracks. Replace cues through `window.MUSIC_TRACKS` in game-audio.js: keys are scene IDs, `title`, and `combat-1` through `combat-3`. Values are bundled audio paths, e.g. `art-test/music/longacre.ogg`. Add files before assigning paths. File playback failure falls back to the synthesized cue. The existing [Suno soundtrack prompt book](SUNO_SOUNDTRACK_PROMPTS.md) remains the production guide.

## Chapter Five source and chronology

Source: campaign blog “Dumb and Dumber Cop”, https://hellspathfinder.tumblr.com/post/145668811333/dumb-and-dumber-cop. Gerya Rohalendi is a cleric of Abadar, the hospice debt is nearly 300gp, and the letter mentions her cousin in Remesiana. The party offers to obtain forgiveness of unpaid taxes and wins goodwill; the game does not assert Fex approved forgiveness. The deserted church’s locked doors are forced with polearms/Acid Splash. Healing supplies and Iomedae books are examined but left untouched; repairs are arranged through a paid carpenter, with no invented price. Ingoe agrees to provide rumors/cargo information for 10gp per week without bargaining. This records an agreement, not simulated weekly currency deductions.

The doctor/church visits preceded the predawn hill search already included in Chapter Four. This chapter explicitly labels them as a retrospective earlier-day sequence, then returns to the present for Ingoe. This preserves existing checkpoints and source chronology. Dialogue is connective adaptation; no new advancement date, spell unlock or level is inferred. Save validation enforces the ordered outcomes and preserves old completed Chapter Four saves.

Next production scope: the later gate/Ovinnik disturbance, church standoff, jail escape, and execution sequence from “Political Movement”, https://hellspathfinder.tumblr.com/post/145691201253/political-movement. Prepare Ovinnik, masked rescuers and execution NPCs before implementation; verify identities and combat data from the archive. Do not interpret planned objectives as completed history. Corrine remains deferred.

## Validation

All eleven automated save/progression/inventory tests pass. Browser checks cover the full five-chapter keyboard-only walkthrough, Chapter Five checkpoint encode/decode and reload, fixed screen bounds at four sizes, intro/dialogue/journey/pause/inventory/level overlays, real scimitar damage and equipment locks, spell and casting-frame rendering, keyboard audio volumes with persisted preferences, and direct-file offline startup. Visual review covered hospice/docks maps and fire/healing/melee effects. Physical Miyoo hardware and completed campaign music recordings remain untested.
