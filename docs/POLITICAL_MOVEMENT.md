# Chapter Six: Political Movement

## Evidence and uncertainty

Primary local source: P045, “Political Movement”, https://hellspathfinder.tumblr.com/post/145691201253/political-movement. The inventoried publication date is June 9, 2016; it is not asserted as a play date. The source record takes priority over generic adventure-path events. The organized Foundry archive index was searched for Ovinnik, the Gramels, Riley, Allamar, Cimri and rioter/acolyte sheets; no matching early NPC record was found there. Current later PC sheets do not establish early character levels or acquisition dates.

Recorded order: the western gate is opened despite the decree; Bo and Dent Gramel are retired artillery veterans; a tiny feline fey attacks, Draymus fails to identify it on a natural 1, and J’Mal falls unconscious. Jason/Draymus magic brings it down. The post first describes it as killed but then explicitly describes a living specimen delivered to Razelago. The game retains the living specimen and avoids inventing a death/resurrection. Razelago identifies an Ovinnik and sends it to Fex for research.

The party approaches the church while still injured; Allamar, her twin sons and acolytes hold the doorway. The party backs off. After rest, J’Mal watches the church, intercepts an injured deputy and gathers the party. Riley has been released. Cimri was defeated by three masked humans and one masked halfling, then bandaged to prevent her death. Their identities and motives remain unknown. Freya follows footprints that disappear into streets and forest **as if** Pass Without Trace were involved; the game does not assert a caster or confirmed spell. Bolgart is released.

Fex demands an execution; the party selects Bo as a treason suspect after her behavior at the gate. She is apprehended after a cookware struggle. The guillotine is built and the execution announced for dusk. Jason casts Shield of Faith and pulls the lever, killing Bo as rioters rush the stage and an apparent Angel Knight arrives. J’Mal’s cut suggests leather beneath the armor; Draymus casts Cause Fear, with the rider’s recorded natural 1. Freya charges on Sleipnir with a naginata, killing the rider and exposing Riley’s disguise. The party displays Bo and Riley’s heads. This is portrayed through restrained dialogue and pixel sprites. Third-party adventure speech is paraphrased, not reproduced.

The source calls the jail empty after releasing Bolgart, but the older decree episode jailed former deputies. Their intervening fate is not resolved here: the game refers only to the remaining **named** prisoner. No additional prisoner fate is invented. No new XP, advancement date or character level is awarded. Corrine remains deferred.

## Gameplay adaptation

Routine patrols provide a resource refresh before the gate encounter; the church approach preserves post-fight injuries until the explicitly staged rest. This is pacing/resource tuning, not a claim about exact historical healing totals. J’Mal begins the Ovinnik encounter at 0 HP and can be healed. After victory, he regains at least 1 HP; the evening rest restores the party. His solo watch survives reload without changing the user’s chosen lead or permanent roster.

The Ovinnik encounter uses tuned HP 38, AC 14, attack +5, claws 2D4+1. The apparent rider uses HP 30, AC 13, attack +3, damage 1D6+1. Two rioters use HP 16, AC 12, attack +3, damage 1D6+1. These are provisional game values, **not verified historical or Foundry totals**. Rioters/acolytes/deputy visuals reuse anonymous existing sprites.

The stage battle abstracts the fighting before the scripted finishing scene. Freya is held in reserve so her katana/scimitar actions are not presented as mounted naginata attacks. The finishing scene uses new mounted naginata frames; the weapon is not invented as an inventory reward or generic skill unlock. Shield of Faith supplies Jason a temporary +2 AC story buff only in this fight. Cause Fear and the identification check preserve recorded natural 1 rolls; tracking has no invented historical die result. Ordinary combat rolls remain random.

Save validation enforces the ordered outcomes. Chapter Five saves without new flags continue normally; four new section starts cover the chapter, church/watch, jailbreak and execution. Every game view remains 640×480. Target selection uses amber enemy and green ally brackets; commands and target names remain outside the completed-action log. Keyboard and mouse targeting share confirmation behavior.

## Artwork

Built-in image_gen generated the sprites with transparent backgrounds and edited a copy of the existing square, preserving the original map. Unmodified generated outputs are saved in art-test: ovinnik-idle-v1.png (three idle frames), political-cast-v1.png (Bo, Dent, disguised Riley, masked silhouettes), mounted-freya-v1.png (stance/charge/recovery), execution-square-v1.png (separate foreground). movement-frames.js records crop/anchor metadata; pixel data was not edited during metadata extraction. Exact prompts and reference roles are in POLITICAL_MOVEMENT_ART_PROMPTS.json.

All new NPC appearances are provisional interpretations of textual descriptions. Anonymous masked designs are prepared for future reuse and displayed in the art studio; they are not shown as identified suspects or inserted into the jailbreak as an invented witnessed scene. The guillotine and platform have map collision; transparent outer map borders keep the background independent. Ambient audio cues for gate/watch/jailbreak/execution use the existing volume controls and can be replaced by supplied campaign tracks.

## Validation

The full six-chapter keyboard-only walkthrough passes. Twelve automated save/progression/inventory tests pass. Browser checks: Chapter Six keyboard-only navigation, both fights, J’Mal’s downed opening, solo-watch reload, ordered checkpoint decoding and final reload; unchanged bounds at four viewport sizes; direct-file startup; attack/healing selection and cancellation, stable completed log, mouse-only confirmation; inventory/equipment/potion regression. Physical Miyoo testing remains future work.
