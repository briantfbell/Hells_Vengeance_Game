# Manual blog reconciliation — 9 October 2026

This audit supersedes conflicting prototype descriptions in earlier production notes. The game retains its 640×480 screen, controls, pixel-art style, combat presentation, saves and original party structure. The new manual export establishes what happened in this campaign; official adventure-path assumptions and earlier prototype inventions must not override it.

## Sources and preservation

Brian’s `Manual_Lore_Export_Page_5_and_6/Hells_Vengeance_Story_Blog.txt` is copied unchanged into `docs/sources/manual-blog-page-5-6/`, together with all 19 supplied images. `manifest.json` records SHA-256 hashes and byte counts. Page 6 begins the campaign; page 5 continues it. Line numbers below refer to that exact preserved text. Artwork establishes appearance, not the date equipment was acquired. The supplied J’Mal portrait includes later sword hilts: the opening sprites deliberately retain the daggers attested in the narrative.

## Corrected existing game

| Evidence | Previous prototype | Reconciliation |
|---|---|---|
| Lines 10–16: martial law, Freya receives orders three days after Barzillai arrives; Jason is co-lead | Invented personal audience with Barzillai; departure before dawn | Orders presented by Chronicle, Freya and Jason. No asserted personal audience or invented two-night countdown. |
| Line 16: Silver Star is Shensen’s musical instrument shop; she is absent | Tavern, barkeep, drinks | Music-shop map, instrument displays, shopkeeper, corrected dialogue and mission descriptions. Internal `tavern`/`barkeep` IDs remain for save compatibility. |
| Lines 18–20: temple of Sarenrae, Viggo Dawnflower Swordmaster, scimitar replaced by rapier, sacred protections dismantled, J’Mal carried out | Generic hidden shrine with immediate harbor escape | Deity and swordmaster identified. Aftermath includes dismantling, stretcher, fire and tunnel collapse. |
| Lines 22–24: Freya/Dottari cover story; Nox pays 100 gp each; lavish safehouse for nearly 24 hours; covered wagon | Direct boarding after fire | Source events restored in the rendezvous/safehouse sequence before the Western Star. Nox’s speech and appearance beyond the described human woman/glaive are not invented. |
| Lines 26–46: Pezzack trade and Guapo ambush; Mildred/pirate boarding; Corentyn sale and bounties | Voyage compressed directly to Remesiana | These events are presented as Continue-driven travel interludes. Dedicated explorable ports and pirate encounters remain future production work. |
| Line 44: Viggo’s scimitar planted on pirate captain | Permanently equippable loot | Removed from party inventory at Corentyn. Freya returns to her own weapon. Later legacy saves migrate consistently; original recovery flag remains historical evidence. |
| Lines 49–63: Remesiana, rental horses, northwest Longacre, tannery, river cleanup, hidden employer, bath | Mostly matches | Core sequence retained; Guapo’s departure is described as lying low, rather than a claimed specific second ship. Blog establishes he returns later but does not precisely date his initial departure. |
| Line 85: party reaches level 2 after sermon and rest | Existing level-2 milestone | Retained. No additional levels inferred from later sheets. |
| Lines 122–134: hellstone, Jason’s irreverent oath, Freya appeals to Fex’s scholarly curiosity, accuser-devil reveal | Ritual reduced to a generic oath | Distinctive ritual restored without changing the oath’s legal/spiritual meaning. |
| Lines 140–158: capture → interrogation → hospice → first church visit → predawn hill → wereboar → Ingoe | Hospice/church appeared later as flashback | Restored chronological route. Late chapter gates remain intact. Earlier hospice/church saves validate without prematurely setting Chapter Five. Existing old-order saves can finish through a compatibility route. |
| Lines 160–198: Ovinnik, church standoff, solo watch, jailbreak, freeing Bolgart, Bo execution and Riley disguise | Existing Chapter Six | Retained source outcomes and fixed story rolls. Updated apparent Angel Knight appearance uses the supplied reference; her appearance is a disguise in this encounter. |

## Art reconciled

J’Mal now has red-brown skin, black hair, amber eyes, dark armor and daggers based on his supplied portrait. New movement includes both leading feet in three directions, three combat idle poses and three dagger attack poses.

Fex, Cimri, Rhona, Tileavia Allamar, Loran and Lacall Allamar, Bolgart (human and wereboar), Riley, Gerya, Ingoe and revealed Razelago have reference-based pixel sprites, dialogue portraits and three idle poses. Krenshar and the apparent Angel Knight have matching three-pose atlases. Faces and outfits replace previous provisional designs. Body details absent from portrait-only references remain restrained visual interpretations. Razelago remains concealed at Ash House; his true form is revealed at Fex’s audience.

Assets and the exact built-in ImageGen prompts are recorded in `LORE_ART_PROMPTS_V2.json`; metadata is in `art-test/lore-cast.js`. Original reference art is preserved separately. Older sprite assets remain available for comparison and unaffected characters.

## Explicit limits and unresolved source conflicts

- The manual export has no portraits for Freya, Jason, Draymus or El Guapo. Their existing artwork is retained; Foundry’s later sheets should not automatically supply opening costumes or weapons.
- Nox’s exact face, Viggo’s appearance, the shopkeeper’s identity, and exact room/floor plans are unspecified. These need source evidence or Brian’s direction before claiming exact reproduction.
- Freya’s early katana and Jason’s starting mace remain prototype equipment assumptions. The later blog explicitly attests Freya’s naginata/horse and Jason’s lucerne hammer. Exact acquisition dates are absent; combat values and healing remain game adaptations, not reconstructed PF1 sheets.
- Dialogue choices, bell-rope reinforcements, combat tuning, and alternate failure branches are authored game mechanics. They are not claimed as transcripts or canon campaign events. The normal completion route follows recorded outcomes.
- The decree itself (lines 90–106) limits private groups to six and public groups to twelve; a later narrative paragraph says five in public. Preserve the decree’s explicit wording as the rule and flag the narrative conflict. Do not silently replace the posted rule with five.
- Guapo’s opening roster note says “one session only,” but the narrative explicitly includes him in the voyage and later return. Narrative participation is stronger evidence for specific scenes; session counts do not determine his presence by themselves.
- Rhona’s portrait suggests auburn hair; a later jail-fire account describes her hair as similar to Cimri’s black hair. The supplied named portrait controls the current visual adaptation; record the discrepancy rather than treating either as unambiguous.
- The source describes a Sarenrae temple (with a spelling variation), not an Iomedae shrine. Existing sun-themed temple architecture is retained as an interpreted Sarenrae sanctuary, not a reproduced floor plan or verified heraldic asset.

## Source-ordered next chapters, not implemented in this pass

1. After the execution: stolen remains → 3 a.m. church assault → shattered stained glass → acolytes, twins and summoned guardian → Riley resurrected as ghast → Allamar’s last stand.
2. Sanctuary aftermath: Draymus destroys controlled ghast; Jason/Draymus dismantle consecration; altar shatters; freed Red Mantis master offers death or knowledge. J’Mal chooses knowledge, trains for 24 hours and receives the master’s blades. This is explicit training/acquisition evidence, not an explicit level-up date.
3. Church conversion: Jason appointed pastor; windows replaced; blood ritual; Cimri promoted sheriff; accuser silenced; Gerya reports secret storage request.
4. Armory ambush: resurrection of Bo revealed; Dent and three rangers; scale-mail and ballista trap; Spectral Hand/Shocking Grasp; heist thwarted.
5. Guapo returns by rented mule; jail fire; Rhona defeats Cimri nonlethally, carries her outside, then escapes; prisoners identify Fort Estazano.
6. Fort/Whisperwood: halfling archer, silent whistle, manticore, first retreat; Guapo departs again; second assault with invisible J’Mal; fort secured; trail to Court of Spears.

Future required art: church interior/windows/altar aftermath, named twins and ghast combat variants, Red Mantis mentor/training and J’Mal’s later blades, converted Asmodean church, hospice storage, armory/trap and resurrected Bo/Dent/rangers, burning jail and Rhona dual axes, rental mule, fort ruined tower/halfling/manticore, grass approach/forest/Court of Spears. Supplied symbols and Red Mantis art are preserved now for those stages; they are not introduced prematurely into the opening party.
