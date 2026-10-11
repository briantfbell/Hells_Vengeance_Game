# Chapter Seven — The Missing Dead and the church assault

## Source and scope
Adapted from Hells_Vengeance_Story_Blog.txt, the section following Bo Gramel’s execution and Riley’s death, through the church’s conversion. The complete local campaign archive remains outside the repository. The following smear campaign is the next chapter, not part of this batch.

Sequence: missing heads and empty coffins → tracks → barred church and stained-glass breach → entrance → twins in hallway → interrupted resurrection → ghast Riley → Allamar’s final stand → destruction of ghast → broken altar → Red Mantis master → knowledge chosen → twenty-four-hour training → Jason’s appointment and conversion. Four deputies help breach the second window; Cimri supports the fighting. Loran dies before Lacall, the Kuribu leaves after the defenders fall, and Draymus withdraws with his controlled ghast during Allamar’s positive-energy assault.

## Game adaptation decisions
- Four separate fights remain within the existing 640×480 combat stage. No world image is stretched into combat.
- Six playable characters remain in the party. Cimri is an animated flank-support ally, represented beside the enemy-intent panel and striking at round end. She is not a seventh selectable or targetable party member.
- Grease reduces the entrance defenders’ attack bonuses for two rounds and has a moving floor effect. Existing Burning Hands sprites remain available.
- J’Mal is absent from the hallway fight while he and the deputies force the second window. Freya’s enlarged combat pose is larger there and in the sanctuary.
- Paralysis skips J’Mal’s opening sanctuary turn, then ends at round two. Ghoul fever is narrated; a persistent disease subsystem has not been added.
- Command Undead, interruption and altar destruction use explicitly labeled story outcomes, not claims about the session’s numerical rolls.
- Allamar summons a celestial wolf, has an animated spiritual-sword attack, and restores five HP on even-round positive-energy channels. The wolf has its own three-frame gray-white celestial sprite; these stats are encounter tuning.
- The named assault weapons enter inventory at the breach: Freya’s naginata, Jason’s lucerne hammer and J’Mal’s kukri. New attack poses use the approved character identities. Item damage and the gifted blades’ D6 are adaptation values. No enchantments or historical level gain are invented.
- J’Mal receives the master’s sword belt and blades after training. Progression journal records that event; all levels retain the earlier confirmed game milestone.
- More than 400 gp in renovations is recorded as a party-funded story expenditure, not silently deducted from the existing individual goldReward field.

## Saves and replay
Checkpoints remain version 2. Chapter Seven flags are validated in sequence. Replay now has 32 sections, with sections 24–32 covering this arc. The existing backup/restore mechanism preserves the player’s real progress. Older Chapter Six completion saves now unlock the next objective rather than freezing movement.

## Artwork
Built-in image generation was used. Assets live under art-test: church-cast-v1.png (source atlas), church-cast-packed-v1.png (isolated three-frame idle rows), church-weapons-v1.png (source atlas), church-weapons-packed-v1.png (three-frame attack rows), church-ruins-v1.png and church-asmodeus-v1.png, celestial-wolf-v1.png and celestial-wolf-packed-v1.png. Existing Allamar, twins and Cimri artwork is reused.

Final prompt set:
1. Preserve the approved church layout and camera; broken pews, shattered glass and shattered altar; transparent exterior; no characters or text.
2. Transparent 4×3 gothic pixel sprite atlas: sword-carrying acolyte, childlike winged longbow Kuribu, blue-eyed long-tongued ghast Riley, Red Mantis master matching the blog portrait; ready/weight-left/weight-right poses.
3. Transparent 3×3 party weapon atlas preserving approved Freya/Jason/J’Mal identities: naginata, lucerne hammer, paired kukri; windup/strike/recovery from the rear.
4. Preserve church architecture and aisle; plain dark windows, restored pews, crimson-black furnishings, modest Asmodean altar; floor symbol hidden beneath pews; transparent exterior.

5. Transparent three-frame celestial wolf atlas: gray-white wolf with long muzzle, pale gold eyes, subtle holy light, ready/weight-left/weight-right poses.

Connected silhouettes were sliced and packed as production frames, preventing pixels from neighboring poses appearing in animation. New cast appearances lacking a portrait are artistic adaptations rather than newly asserted campaign facts.

## Validation
44 automated tests pass, including all 32 replay export/import round trips and chapter sequence rejection. The actual game action code was tested across 200 seeded full church assaults without rest between fights. Browser QA completed the entrance encounter using keyboard-only combat and inspected the 640×480 layout. This is not a claim of a complete uninterrupted browser playthrough of all chapters.
