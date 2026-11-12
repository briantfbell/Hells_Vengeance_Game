# Hell’s Bubbies — Hell’s Vengeance Game

A high-detail pixel-art RPG gift based on our Pathfinder campaign. This build contains fourteen playable chapters, beginning with the **Night of Ashes** prologue: Kintargo, the Silver Star music shop, the hidden temple encounter, and the harbor escape.

## Play on another computer

Download this repository using **Code → Download ZIP**, extract the entire folder, and open **index.html** in a modern browser. Keep the art-test folder beside index.html. No installation, account, or original development laptop is required for offline play.

Alternatively, with Node.js 18 or newer installed, run `npm start` in the extracted folder and open http://127.0.0.1:8080. There are no npm dependencies to install. This address is local to whichever computer runs it.

## Starting a new story

Every launch opens the animated **Hell’s Rebels — a Hell’s Vengeance story** title screen, using Brian’s supplied Folken Games artwork. The screen flickers on and **Push A to Start** fades in. Press Enter/E/Space (or A at the title prompt) to open the main menu. Continue resumes the latest checkpoint; New game opens character selection; Load game offers four manual slots and portable save import; Settings contains audio and controls. Browsing or backing out of character selection preserves the existing checkpoint.

Choose one of the five opening companions, then receive the mission through Freya and Jason’s briefing. Reese joins in Longacre. Bruce’s portrait is available in the gallery; his recruitment awaits a confirmed joining point. Returning to the title from pause captures a checkpoint first; Continue returns to that progress. The title and all game views keep the same 640×480 frame. Flame, magic and ember effects stop when reduced motion is enabled.

The title and Night of Ashes load with the opening artwork. Chapter Two loads its own artwork when you board the Western Star or open a Chapter Two checkpoint or replay. The sermon through the Longacre armory operation load together. The later artwork loads in groups at Fort Estazano, the first Egorian arrival, the return from Fort Arego, and the Barrowood. A later checkpoint loads artwork through its group. Keep the complete `art-test` folder available for the whole story.

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

The web build is the current playable prototype. Final handheld packaging, native handheld input adapters, further screen/readability refinement, cartridge-style removable storage remain future work. This is not a Game Boy ROM.

The admin toolbar’s **Find replay** field filters checkpoints by number, scene title, or location. **Return to prior progress** restores the checkpoint from before the replay.

## Validation

Automated checks cover story prerequisites, progression, equipment, portable-save validation and all 475 replay checkpoints. Late-campaign artwork loads in batches as the player reaches the Barrowood, Dark Rain, Molthune, Citadel Dinyar, St. Ilnius, and Barleybridge. Opening a late checkpoint loads the title and common game art plus the destination batch, including its shared assets. Browser verification covers selected journeys, dialogue, keyboard combat and the fixed-screen menus.

Run `npm test` for regression checks and `npm run balance` for seeded simulations of the actual combat engine. Balance statistics depend on the stated player strategy and are adaptation checks, not historical Pathfinder statistics.

## Next chapter and map layers

See docs/NEXT_PHASE_PLAN.md for the source-grounded voyage/Longacre production plan and Corrine timing. Open **Map Layer Studio.html** (or `/maps` on the local server) to inspect the transparent Western Star foreground over independent animated water. Chapter Two is now playable: continue at the Western Star after the prologue, sail to Remesiana, meet Cimri, complete the tannery job, and rescue Jamal at Ash House. El Guapo leaves at Remesiana; a Guapo player chooses a temporary viewpoint companion. The chapter ends with the sermon briefing. New maps follow docs/MAP_LAYER_SPEC.md; existing opaque maps use the shared renderer while awaiting later asset upgrades.

## Chapter Three and future art

Continue from the Ash House briefing into the sermon, four decrees, deputy ambush, and Fex audience. All seven party walking cycles now include opposite-foot poses. Open **Longacre Art Studio.html** (`/art`) for nine layered environments and eighteen NPC models/forms covering several upcoming story arcs. Gameplay now extends through the Kantaria docks and towers; later artwork remains available for subsequent arcs. See docs/LONGACRE_PRODUCTION.md. Portable saves, all three chapter walkthroughs, the future art gallery, offline startup, and a 320px layout were checked in the browser.

Combat now uses a parchment chronicle beside crimson command buttons. The current action appears above completed actions, newest first; older entries drop off automatically, and the history clears for each fight. The visible row count adapts to the screen without scrolling.

Exploration now has a visible task overlay and context-correct quest markers; public notices show `[X/4]`. Combat uses weapon-ready three-frame idles, sprite dice in the top-left roll panel, and rules subtitles on every command. Open **Combat Animation Studio.html** (`/idles`) for 23 prepared combatant models/forms. See docs/UI_AND_COMBAT_POLISH.md. For the campaign soundtrack, docs/SUNO_SOUNDTRACK_PROMPTS.md contains 67 instrumental generation prompts and combat variations; temporary instrumental music and effects are playable, with pause-menu volume and mute controls.

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

Each combatant rolls D20 + initiative once when combat begins. A skippable ranked reveal shows the dice, modifiers and totals. Press Enter/E/Space or click Start battle to begin; B also skips the reveal. Party and enemies share that fixed order throughout the fight. Now/Next stays visible above enemy intentions, and fallen combatants are skipped. Guard grants +4 AC and halves landed damage until the character’s next turn. This replaces the previous enemy-response timing.

Early initiative modifiers are provisional game values, not inferred from later Foundry sheets. See docs/INITIATIVE.md for the modifiers, tie handling, scripted openings and verification.

## Controller support and quest help

Standard browser gamepads now use D-pad / left stick, A to confirm, B to back or pause, and B + direction to run. X opens inventory, Y opens party details, Start pauses/resumes, and Select opens quest details or the selected combat command. Keyboard shortcuts I / O / F1 offer those same screens. In combat, F1 shows the selected command’s full effect without changing your target or recent action log. The pause menu also provides quest/help access.

Connect a standard-mapped controller, press and release a button, then use it in the focused game tab. Physical controller and Miyoo validation remain pending. See docs/CONTROLLER_SUPPORT.md for mapping, held-button safeguards and native-port limits.

## Chapter Thirteen: Quiet Knives

Continue from the completed dock/tower operation, or replay section 86. Stir the market riot, ambush a militia patrol and plant the false account, compromise the labor guild records, steal the unnamed manor artifacts, then escape the burning Uskwood and recover in the Fungus Caves. Corrine returns as the assigned liaison. Sections 86–102 cover this continuation; there are now 102 replay checkpoints.

Four new transparent map foregrounds and two anonymous civilian models match the existing style. All views retain the 640×480 logical frame. The prison aftermath remains unresolved, and this chapter grants no inferred level-ups or unidentified magic items. See [chapter notes](docs/chapter-thirteen.md).

Validation: 83 automated tests pass, including portable-save round trips for every replay checkpoint and objective reachability on the new maps. The combat harness covers 200 seeded runs per encounter and chapter chains; results describe its skill-first/healing strategy, not every possible player choice.

## Presentation polish and Photoshop frames

The game now uses the original Folken Pixel font inside its 640×480 overlays. New combat void and image dice, eight distinguishable townsfolk, captive Riley conversations, separate church entry/hall maps, altar effects and the converted Asmodean floor symbol accompany the story fixes. Porch combat resumes into Cimri's rescue after victory.

See [Photoshop UI dimensions](docs/UI_PHOTOSHOP_SPEC.md) for fixed export sizes and scalable borders, [change notes](docs/PRESENTATION_POLISH.md) for the batch, and [generated artwork prompts](docs/PRESENTATION_POLISH_ART_PROMPTS.json) for reproducible asset references. Blank Photoshop skins are pending artwork. 92 automated tests pass; the solo porch fight and subsequent rescue interaction were also verified in the browser.


## Chapter Fourteen — Stranglehold

Continue after Corrine’s Fungus Caves briefing, or replay section **103**. Secure the mines, destroy the Lamashtu cult, strike rebel suppliers, and isolate the perimeter forts. Three battles, two narrated supplier operations, two new map foregrounds and two new defender models lead to a report at the refuge. The chapter stops before Valor’s Fastness.

There are now **118 replay checkpoints** and **104 passing automated tests**. Existing saves continue into the new chapter. Live browser verification of this batch is pending because local browser use is disabled in the app’s Work settings. See [chapter notes](docs/chapter-fourteen.md) for source limits, artwork and validation.

## Chapter Fifteen · Valor’s Fastness outer gate

Continue after Stranglehold or select replay **119**. Muster the reanimated soldiers, send them against the guards, and secure the breach. Replays **119–122** cover the section. The outer gate was played through and reloaded in the browser. See [the section audit and source notes](docs/chapter-fifteen-gate.md).

From the secured gate or replay **123**, fight through the mustering hall and inner chapel to the tower stairs. The two battles carry injuries and resources forward. Replays **123–127** cover the interior. See [the interior audit and artwork notes](docs/chapter-fifteen-interior.md).

From the chapel stairs or replay **128**, fight the tower mage, warpriest and returning Angel Knight. Replays **128–134** cover the ascent to the last stair. See [the ascent audit and artwork notes](docs/chapter-fifteen-ascent.md).

From the last stair or replay **135**, face Oppian and his Archon, follow Oppian over the parapet, and take him into custody to complete Chapter Fifteen. Replays **135–139** cover the summit and aftermath. See [the summit audit and artwork notes](docs/chapter-fifteen-summit.md).

From the captured Oppian checkpoint or replay **140**, meet Kantaria’s new mayor, receive the Uskwood deed and Fex’s rewards, and prepare the prisoner transport. Replays **140–144** cover this visit. See [the aftermath audit and reward mechanics](docs/kantaria-aftermath.md).

## The South Road

Escort Oppian from Kantaria or start at replay **145**. Break the infantry line, meet the mounted Sword Knights, and make camp before Egorian. Replays **145–152** cover the road. See [the South Road audit and artwork notes](docs/south-road.md).

## Arrival in Egorian

Continue from the South Road camp or select replay **153**. Cross the West Bridge under escort, turn Oppian over to the Dottari, replenish healing supplies, and meet Lady Tria Falco. Replays **153–159** cover the capital arrival. See [the arrival audit and artwork notes](docs/egorian-arrival.md).

## Egorian after dark

Continue after Freya sets the night watch, or select replay **160**. Play as J’Mal and El Guapo while they follow Svetlana’s lead and learn what Jaquen wants in exchange for the captive guard. Replays **160–165** cover the night. See [the night audit and artwork notes](docs/egorian-night.md).

## Oppian’s trial and Zara Geitta

Continue from dawn at Falco Manor or select replay **166**. Give testimony as Freya and Jason, hear Oppian’s verdict, then travel with Zara to the forge where Freya receives her fitted Hellknight plate. Replays **166–173** cover the trial and fitting. See [the section audit and artwork notes](docs/egorian-trial.md).

## Draymus in Lower Lane

Continue from the evening at Falco Manor or select replay **174**. Walk Egorian’s Lower Lane as Draymus, meet the attackers, and prepare the disguise he takes to Oppian’s public excruciation. Replays **174–179** cover the outing. See [the section audit and artwork notes](docs/egorian-mort.md).

## Oppian’s public excruciation

Continue from the morning at Falco Manor or select replay **180**. Follow J’Mal and El Guapo into the crowd, fight the noble’s bodyguards as Freya, and witness the resumed ceremony. Replays **180–188** cover the square. See [the section audit and artwork notes](docs/egorian-excruciation.md).

## Charges dropped and the road to Senara

Continue after Oppian’s excruciation or select replay **189**. Hear the Asmodean judges’ ruling, take Razelago’s orders, and search Fex’s residence for the Infernal Talisman. Replays **189–195** cover the departure and arrival. See [the section audit and artwork notes](docs/senara-arrival.md).

## The reception and orphanage

Continue from the empty coffer at Fex’s residence or select replay **196**. Welcome the garrison guests as El Guapo, then investigate the orphanage as Draymus and Jason. Replays **196–202** cover the reconnaissance. See [the section audit and artwork notes](docs/senara-cover.md).

### The Black Daggers

Continue from Fex’s residence after the orphanage reconnaissance or select replay **203**. Follow the sewers, scout the Black Daggers with J’Mal, and use Draymus’s two spells to force a surrender. Replays **203–208** cover the approach, ambush and terms. See [the section notes](docs/senara-daggers.md) for the campaign sources, artwork and verification.

### The Hellknight citadel

Continue after recovering the Infernal Talisman or select replay **209**. Visit the local chapter, study a spell with Draymus, and use the old patrol reports to plan the unicorn hunt. Replays **209–214** end at the edge of the Whisperwood. See [the section notes](docs/senara-citadel.md) for the campaign sources, artwork and verification.

### The Whisperwood night camp

Continue from the carriage stop or select replay **215**. Set the watch, fight the creatures that come out of the trees, and help J’Mal and El Guapo pull Bob clear. Replays **215–221** cover the approach through dawn. See [the section notes](docs/whisperwood-camp.md) for campaign sources, artwork and verification.

### The Blessing of Unicorns

Follow the unicorn trail from the Whisperwood night camp or select replay **222**. Recover three horns from the first assault, then recover the fourth under pressure as J’Mal. Replays **222–226** cover the glade. See [the section notes](docs/whisperwood-glade.md) for sources, artwork and verification.

### The Senara prison wagon

After recovering the four unicorn horns, take the road back to Senara or select replay **227**. Use Jason’s Dismissal, defeat the escort, and free Orn from the prison wagon. Replays **227–233** end at the patrolled quay. See [the section notes](docs/senara-wagon.md) for sources, artwork and verification.

### Senara’s graveyard

Slip past the increased patrols after returning to Senara or select replay **234**. Get the Black Daggers’ lead, fight the balisse angel, and recover its heart as the Reclamation locks down the city. Replays **234–239** cover the section. See [the section notes](docs/senara-graveyard.md) for campaign sources, artwork and verification.

### Fort Arego’s exterior

Leave Senara after the lockdown or select replay **240**. Hear what Fex promised Visperthul, then defeat both Reclamation champions and open the old prison. Replays **240–246** cover the approach and yard. See [the section notes](docs/fort-arego-exterior.md) for sources, artwork and verification.

### The Inferno Gate

Descend from Fort Arego’s yard or select replay **247**. Fight through the cellblock, bargain for passage, and warn Visperthul about Fex’s talisman. Replays **247–253** lead to the first pact. See [the section notes](docs/inferno-gate.md) for sources, artwork and verification.

### Fex’s ambush at the Inferno Gate

Continue after Visperthul’s first pact or select replay **254**. Reveal Fex and Razelago, survive the ambush, and carry the talisman into Malebolge as Reese. Replays **254–256** cover the fight and escape. See [the section notes](docs/arego-ambush.md) for sources, artwork and verification.

### Reese’s bargain and the death of Fex

Continue from the basalt ledge or select replay **257**. Hand over the talisman, return with Visperthul and two bone devils, free the company, and confront Fex again. Replays **257–262** cover the bargain through its immediate aftermath. See [the section notes](docs/arego-return.md) for sources, artwork and verification.

### The closing of the Inferno Gate

Continue after Fex’s defeat or select replay **263**. Meet Corrine and Contessa, close the Inferno Gate, and escape to Hotel Barato. Replays **263–267** end with Jason and Freya reporting to their respective superiors. See [the section notes](docs/arego-exit.md) for sources, artwork and verification.


### Egorian’s public discharge

Continue from Hotel Barato or select replay **268**. Hear what happened to Jason, walk out of the keep square as Freya, and regroup with the company. Replays **268–274** cover the section. See [the section notes](docs/egorian-discharge.md) for sources, artwork and verification.


### Reese’s vision and the tailor’s quarter

Continue after dinner at Hotel Barato or select replay **275**. Follow Reese’s vision to the fountain, then take J’Mal and El Guapo through the tailor’s quarter. Replays **275–281** cover the meeting, reconnaissance, and return to Hotel Barato. See [the section notes](docs/egorian-fountain.md) for sources, artwork and verification.


### Dapper Street and Remesiana

Continue from the completed reconnaissance or select replay **282**. See the aftermath at Wilfordshire Tailors and return to Remesiana to find Florio Cento. Replays **282–285** cover the section. See [the section notes](docs/dapper-street.md) for sources, artwork and verification.


### Florio Cento’s rival market

Continue from Remesiana’s harbor or select replay **286**. Meet Florio, evacuate the holding bays, and destroy the market. Replays **286–292** cover the assignment and report. See [the section notes](docs/remesiana-market.md) for sources, artwork and verification.


### Hinji’s naval shipyard

Continue after reporting to Florio or select replay **292a**. Speak to Barksdale, move his refusal into the dispatch docket, and hear who gets the admiralty. Replays **292a–292d** lead into Westcrown. See [the section notes](docs/hinji.md) for sources, artwork and verification.

### Brado Pachia’s favors in Westcrown

Continue from Hinji or select replay **293**. Meet Brado at the canal quay and complete three short favors in any order. Replays **293–298** cover the trip and report. See [the section notes](docs/westcrown.md) for sources, artwork and verification.


### Efisio Pera in Egorian

Continue after Brado’s favors or select replay **299**. Attempt the arrest, hold off the guards, and follow Efisio into the street as Freya. Replays **299–304** cover the confrontation. See [the section notes](docs/efisio-arc.md) for sources, artwork and verification.


### Corrine’s sting and the Crown’s debrief

Continue after defeating Efisio or select replay **305**. Hear the reports from across Cheliax, learn the Crown’s decision, and receive the Queen’s next assignment. Replays **305–309** cover the debrief. See [the section notes](docs/egorian-sting.md) for the conflicting rank records and verification.


### Sethic and Vasvion’s offers

Continue from Corrine’s debrief or select replay **310**. Attend the reception, hear both offers, and commit to Vasvion. Replays **310–314** cover the section. See [the section notes](docs/egorian-feud.md) for the conflicting records, artwork and verification.


### Sethic’s devil-hog farm

Continue after backing Vasvion or select replay **315**. Drive the hogs out of the yard, destroy the farm, and return to Egorian. Replays **315–319** cover the operation. See [the section notes](docs/sethic-farm.md) for sources, artwork and verification.


### Sethic’s judges and foreign loan

Continue after the devil-hog farm or select replay **320**. Gather both records, submit the evidence, and follow Sethic’s loan to the strongroom. Replays **320–327** cover the indictments and attempted theft. See [the section notes](docs/sethic-ledgers.md) for sources, artwork and verification.


### The Gray Men’s attempt on Nicolo

Continue after the failed loan theft or select replay **328**. Meet Nicolo, foil the ambush, and get him clear of the lane. Replays **328–332** cover the rescue. See [the section notes](docs/nicolo-arc.md) for sources, artwork and verification.


### The Night of the Pale

Continue from Nicolo’s rescue or select replay **333**. Watch Mysterio perform, meet the Queen, and face Vokadus Fex as Freya. Replays **333–341** cover the ball. See [the section notes](docs/pale-ball.md) for sources, artwork and verification.

### Belde and Yunero

Continue after the Night of the Pale or select replay **342**. Drive the Reclamation out of Belde and play Freya’s trivia contest. Replays **342–349** cover the visit. See [the section notes](docs/belde.md) for sources, adaptations and artwork.

### El Guapo’s night in Hinji

Continue from Yunero’s concession or select replay **350**. Join El Guapo at the tavern and see what happens to Titus Vel. Replays **350–352** cover the stop. See [the section notes](docs/hinji-tavern.md) for the location discrepancy and artwork.

### Corentyn and the Ballerina

Continue from the Hinji arrest or select replay **353**. Sign on at Corentyn, check the cargo deck and take the coastal watch. Replays **353–356** cover the departure. See [the section notes](docs/ballerina.md) for sources, adaptations and artwork.

### Rachikan Ruins

Continue after taking the coastal watch or select replay **357**. Land at Rachikan, scout the pirate storehouse, and break the operation. Replays **357–360** cover the raid and Draymus’s aftermath. See [the section notes](docs/rachikan.md) for sources and artwork.

### The burning of the Pezzack manse

Continue from Rachikan or select replay **361**. Witness Bruce’s attack, open the prisoners’ way out, and return to Egorian during the Strix raid. Replays **361–365** cover the visit. See [the section notes](docs/pezzack.md) for sources and artwork.

### The Bellflower barge

Continue after returning from Pezzack or select replay **366**. Help prepare Corrine’s trap, hold off the rescuers, and escape with Jason’s word of recall. Replays **366–370** cover the barge. See [the section notes](docs/bellflower-barge.md) for the sources, combat and artwork.

### The Bellflower barn

Continue from Migos Street or select replay **371**. Follow the Bellflower lead, scout the safehouse and summon the elementals. Replays **371–374** cover the operation. See [the section notes](docs/bellflower-barn.md) for sources and artwork.

### The assault on Sethic’s mansion

Continue from the Bellflower barn or select replay **375**. Choose Sethic for the Crown’s pilgrimage, rescue Bob, and subdue Sethic alive. Replays **375–382** cover the mansion. See [the section notes](docs/sethic-mansion.md) for sources, adaptations and artwork.

### Bob’s recovery in Vyre

Continue after capturing Sethic or select replay **383**. Play as El Guapo, obtain Manticce’s Wish, and use it to heal Bob. Replays **383–386** cover the visit. See [the section notes](docs/vyre-wish.md) for sources and artwork.

### The Barrowood pilgrim trail

Continue after Bob recovers or select replay **387**. Mark the first thirteen stones, repel the Reclamation scouts, and face the paladins and druid before approaching the final stone. Replays **387–395** cover the trail. See [the section notes](docs/barrow-trail.md) for sources, mechanics and artwork.

### The Covenant of Hell

Continue from the Barrowood trail or select replay **396**. Face the rogue Asmodeans, complete the rite at the fourteenth stone, and witness the company’s elevation. Replays **396–403** cover the covenant. See [the section notes](docs/barrow-covenant.md) for the battle, sources and artwork.

### Menador and the Queen’s demand

Continue after the Covenant of Hell or select replay **404**. Hear Corrine’s report and travel to Menador, where the chapter card marks the Meeting of the Twins. Replays **404–406** cover the approach. See [the section notes](docs/menador.md) for the two campaign records.

### Tathlum orders and the Nidal cave-giant hunt

Continue from Menador or select replay **407**. Take the Queen’s assignment, avoid the Gheistano patrol, and follow the thrall to the latest attack in replays **411A–411B**. Follow Reese to the lair and win Freya’s three duels. Replays **407–414** cover the expedition. See [the section notes](docs/tathlum-hunt.md) for sources, combat and artwork.

### The Pass of Dark Rain

Continue from the cave-giant lair or select replay **415**. Bargain for passage, hunt the dire polar bear as Reese, and cross through the dragon’s skull. Replays **415–423** cover the pass, ascent, and walk through the dragon’s jaws. See [the section notes](docs/darkrain.md) for sources, combat and artwork.

### Skadi and the Frost Giants

Continue from the dragon skull or select replay **423**. Scout the settlement, ask Skadi for a hearing, and win Freya’s case for passage over the feast. Replays **423–428** cover the negotiation. See [the section notes](docs/skadi-parley.md) for the source accounts and artwork.

### The Coffin Recovery in Molthune

Continue from Skadi’s feast hall or select replay **429**. Scout as Reese, use the animated bear to draw away the remorhaz, and lead Lady Violetta Pavel out through the lower pass in replay **434A**. Replays **429–436** cover the rescue. See [the section notes](docs/molthune-coffin.md) for sources, artwork and verification.

### Nidal and Citadel Dinyar

Continue from the Molthune wayside or select replay **437**. Follow Draymus to Nidal, then scout Citadel Dinyar with Freya, J’Mal, Reese and Jason. Replays **437–441** cover the split and discovery of the hidden entrance. See [the section notes](docs/dinyar-recon.md) for sources, maps and verification.

### The assault on Citadel Dinyar

Continue from the ridge or select replay **442**. Open the concealed entrance, clear the lower works, and defeat Parnoneryx at the bridge ward. Replays **442–447** cover the assault and recovery of the gold dragon’s head. The optional dispatch in replay **449A** records the party’s plans for Hellknight Scipio. See [the section notes](docs/dinyar-assault.md) for sources, artwork and verification.

### Freya’s Westcrown orders

After recovering Parnoneryx’s head, return to Egorian for Freya’s promotion and Westcrown assignment. Replays **448–450** cover the return, promotion, and departure. The GM timeline records the promotion and assignment on 16 Gozran, 4717 (S145) and the Glorious Reclamation’s capture of Westcrown on 2 Gozran (S132). The game reuses the Egorian court map and stages the promotion as a private briefing with Corrine. The orders are recorded in the journal and inventory.

### St. Ilnius Fountain

After Freya’s Westcrown deployment, follow the Nidal expedition or select replay **451**. Meet Bruce, follow the creek, and clear the five archon statues. Replays **451–455** cover the approach and the shrine court. See [the section notes](docs/ilnius-fountain.md) for sources, artwork, and verification.

### St. Ilnius’s inner temple

Continue from the fountain court or select replay **456**. Break Sylvestra Hanel’s resolve, then bring Parnoneryx’s head to Jason at the basin. Replays **456–459** cover the confrontation, ritual, and ancient-library lead. See [the section notes](docs/ilnius-inner-temple.md) for sources, art and verification.

### El Guapo scouts Barleybridge

Continue from the inner temple or select replay **460**. Follow El Guapo’s solo reconnaissance of the river crossing and town gate. Replays **460–463** cover the cutaway and scouting. See [the section notes](docs/barleybridge-scout.md) for the Foundry references and the remaining gaps in the ritual timeline.

Replay **464** reviews the documented Tathlum plan for Barleybridge, Warlock Island, and Egorian.

### Warlock Island layout previews

Open Longacre Art Studio and select either Warlock Island map to try the walking routes. These are environment previews for the planned archive expedition. See [the map notes](docs/warlock-island-preview.md) for sources, artwork prompts and route checks.

### Barleybridge town preview

Longacre Art Studio includes a walkable gate and market layout and a three-pose glaive guardsman. See [the preview notes](docs/barleybridge-town-preview.md) for the Foundry references and artwork prompts.

The castle throne room and basement are available in both the Art Studio and the in-game Planning maps after replay **464**. The Art Studio also previews the Barleybridge Bowman. See [the castle notes](docs/barleybridge-castle-preview.md) for the source scenes and artwork.
