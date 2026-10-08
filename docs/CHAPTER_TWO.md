# Chapter Two: The Road to Longacre

Playable continuation after the Night of Ashes. At the Western Star interaction, choose Continue to Chapter Two. Existing completed prologue saves can continue; no restart is required.

## Included

- Western Star deck over an independent animated ocean; seven-day voyage and replenishment.
- Remesiana market, outfitting, Cimri introduction and horse arrangements.
- El Guapo's canonical departure. A Guapo player explicitly chooses a temporary viewpoint; the four-person roster persists in checkpoints. His HP and identity remain stored for a later return.
- Narrated horse travel to Longacre, including Freya's Sleipnir and returning the rentals.
- Walkable Louslik Tannery, Jamal's scouting mishap, owner confrontation, two peaceful dialogue approaches, and collection of the payroll box.
- Ash House guardian and concealed Razelago audience, 100 gp per companion recorded as a story reward, feast and rest.
- Upstairs bath rescue: pull Jamal free together or use Draymus to loosen the spirit's grip, then calm the undead. Repeated calming rolls cannot permanently block the story. These are story encounter choices, not a new full tactical battle.
- Morning briefing ends the chapter at the forthcoming Iomedaean sermon. The sermon/decrees chapter is not implemented in this release.

## Art and source

Built-in ImageGen produced four foreground maps and a six-character NPC atlas. All are saved in art-test/. Maps preserve real transparent borders; the bathroom preserves a bath cutout. The NPC atlas uses stationary front sprites and headshot crops; walking/directional variants remain future additions when those NPCs need movement.

Cimri, the unnamed owner, farmer, dog and spirit appearances are artistic interpretations of the supplied text. The krenshar follows its described feline/skull appearance. The outfitter reuses the civilian owner sprite. Razelago uses a deliberately concealed silhouette in the screens; no later form is shown. Corrine remains on hold. Prompts: CHAPTER_TWO_ART_PROMPTS.json.

Grounding: the user-supplied reference archive, raw_posts/P049.txt (In The Shit), and the next-phase production plan. This release adapts the event order into interactive scenes. Dialogue is newly written; horse travel and river cleanup are narrated, and shopping is a scripted resupply rather than an economy/equipment system. The 100 gp award is a quest record, not spendable currency yet. No precise session date is invented.

## Interaction and combat update

Interaction range increases from 34 to 56 world pixels, shared by prompt, E/touch interaction and click-to-approach. NPCs occupy their own tiles. Combat attacks name the party weapon; skills, potions, smoke and mending display remaining/total counts on compact buttons and describe effects in the message. Spent uses are recorded even when a skill misses. Rest replenishes the existing two-potion allocation and ability uses.

## Validation

Complete prologue regression and complete Chapter Two browser walkthrough passed. Tests covered the selected-Guapo viewpoint transition, four-person checkpoint reload, old completed-prologue save migration, scripted tannery resolution, bath rescue and morning briefing. HTTP, extracted-file startup and sprite gallery loading passed. A dedicated combat test verified interaction at 40 pixels (outside the old range), weapon text, skill depletion, smoke, mending, potion counts and a 320px combat viewport. No script or missing-asset errors were observed.

The alternate Draymus rescue route and three consecutive low calming rolls also passed, confirming the encounter cannot get stuck on unlucky checks.
