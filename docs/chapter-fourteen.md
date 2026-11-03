# Chapter Fourteen — Stranglehold

Continue from Corrine's completed Fungus Caves briefing, or use replay section **103**. Sixteen new checkpoints cover the continuation, bringing the total to **118**.

## Campaign evidence and interpretation

The source is the next paragraph of `Pathfinder_Campaign_RPG_Gift/raw_posts/P037.txt`, “Iomedae In A Fire.” It records securing the mines around Kantaria, destroying a Lamashtu cult, assassinating merchants and ship captains supplying the rebellion, and isolating and attacking perimeter forts.

The paragraph is a retrospective summary. Its order supplies a playable sequence here; it does not establish dates, a precise travel route, named suppliers, individual fort identities, or encounter attendance. The new dialogue, scouting, choices, anonymous defenders, battle compositions and layouts are adaptation. The mine and shrine are separate locations; their proximity or physical connection is not asserted. The supplier operations use narrated transitions rather than inventing named assassination victims or detailed historical confrontations.

Freya, Jason, J'Mal, Draymus, Reese and El Guapo remain the established company. This chapter adds no inferred level-ups, learned spells, named loot or Bruce recruitment. Corrine remains the liaison introduced at the refuge. Existing health and resources carry through; entering the chapter grants no additional rest.

The chapter ends with the remaining stronghold acknowledged, before any assault on Valor's Fastness. The intervening royal-cousin episode in the source still needs clarification before adaptation. This chapter does not settle the conflicting prison recap, the warden's fate, or Freya's Hellknight induction.

## Playable sequence

1. Plan the next operations with Corrine at the refuge.
2. Scout the ore workings, fight three defenders, and secure the mines.
3. Investigate the cult shrine, fight two sentries and an adept, and destroy the stronghold.
4. Observe the trade network; choose an approach to the merchant suppliers and strike the shipping contacts.
5. Scout and isolate the perimeter forts, then fight a four-guard representative garrison.
6. Return to Corrine and review the operation.

## Artwork and maps

Two new transparent foregrounds, `kantaria-mines-v1.png` and `lamashtu-grotto-v1.png`, sit above independent dark underlays. A new transparent sheet, `lamashtu-defenders-v1.png`, supplies two anonymous defenders with three-frame combat idles and centered portrait crops. The existing caves, docks, guard and Fort Estazano artwork supplies the other staging. Reusing the fort artwork does not identify these Kantaria positions as Fort Estazano.

The built-in image generator produced the assets using the cave artwork as the style reference. Originals were copied unchanged. Full prompts, output mapping and hashes are in `KANTARIA_SUPPLY_ART_PROMPTS.json`. Frame bounds came from read-only alpha inspection. All views retain the existing 640×480 logical frame and controller commands.

## Saves and validation

- **104 automated tests pass**, including all 118 replay-save round trips, prerequisite rejection, prior-chapter compatibility, objective reachability, full chapter flow and existing combat/controller behavior.
- The machine audit covers 48 scripts, 70 scenes, 118 checkpoints and 459 frame bounds, with no reported missing assets, unresolved references or geometry errors.
- The actual combat engine completed 200 seeded trials for each new fight and 200 uninterrupted chapter chains. All harness runs won using skills first and healing living allies below 45% health. This is a strategy-specific balance check, not a guarantee for every player choice.
- The generated artwork was inspected directly. Live browser verification of this chapter could not run because local browser use is disabled in the app's Work settings. A human playtest should check the mine/shrine layouts, new defender animation crops, and the end-to-end handoff from section 103.

Detailed combat results are preserved in `CHAPTER_FOURTEEN_BALANCE.json`. Existing checkpoints remain valid; new saves enforce the ordered chapter flags and map-entry prerequisites. Victories are checkpointed before aftermath dialogue so that resuming does not repeat a cleared fight.
