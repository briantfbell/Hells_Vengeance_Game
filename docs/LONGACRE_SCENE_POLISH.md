# Longacre scene and dialogue polish

October 9, 2026. Party artwork and combat rules remain unchanged.

## Riley's introduction

Manual story blog line 136 records Razelago identifying Riley Kels as the Longacre bard who performs at the Last Stand and sings about his supposed meeting with the Angel Knight. The Chapter Four briefing now gives this information before travel, alongside Bolgart's illegal gathering. Riley is identified at the tavern before his escape attempt. Freya explicitly ties the jail questioning to those songs. This establishes why the party captures and questions him without treating his account as proven divine intervention.

## Dialogue portraits

Face crops are separate from full-body sprite anchors. Explicit rectangles center all twelve lore cast faces, the Dottari helmet, Krenshar, apparent knight, owner, farmer, bath spirit and dog. Other human speakers use the center of their occupied frame rather than a cell placement anchor. Razelago's normal speaker ID selects his revealed face after the compact; earlier concealment remains intact. Townsfolk and tavern patrons reuse an existing villager face, and the outfitter reuses the farmer artwork. Browser contact sheets were visually checked across the speaking cast.

## Jail and gate art

Human Bolgart uses a restrained pillory sprite at the existing stocks while awaiting the transformation. The interaction point and a short approach route connect it to the courtyard. The wereboar confrontation remains unchanged.

The open gate is used during the Chapter Six gate visit, jailbreak and Gramel residence. Earlier closed-gate scenes retain their original state. The renderer keeps the original map and clips the generated variant to the interior of the gate only, preserving all pixels outside that doorway. The guardian is absent on arrival and throughout Bo's warning; it appears when the party investigates and finishes hearing her warning. The saved gateOpened flag records that reveal.

## Transition screens

Journey cards fill the fixed 640x480 screen, with larger text, separate sentences, generous spacing and a Continue button. They appear immediately. Consecutive cards keep the overlay visible; dialogue or scene completion clears it. There are no fade timers and no intermediate map frame. Reduced motion and regular motion follow the same behavior.

## Validation

Scene checks cover portrait contact sheets, stocks positioning and path access, Riley's briefing, guardian reveal order and open map, fullscreen bounds and no hidden overlay between cards. Temple escape, all 23 replay saves, hospice chronology, Fex oath, offline startup, fixed-screen states and 14 progression/save tests pass. Original image files remain preserved; new built-in image_gen outputs and exact prompts are listed in LONGACRE_SCENE_ART_PROMPTS.txt.
