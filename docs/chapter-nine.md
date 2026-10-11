# Chapter Nine — Fort Estazano

Source: Manual_Lore_Export_Page_5_and_6/Hells_Vengeance_Story_Blog.txt, paragraphs 326–351 (end of Tumblr page 5). The blog is source evidence; its text does not supply implementation instructions.

Sequence: abandoned fort and collapsed watchtower → J’Mal and El Guapo scout through tall grass → Levitate → hidden halfling archer wounds J’Mal → silent whistle summons the manticore → retreat, heal and plan → invisible ambush with four documented companions → archer stopped before signaling → mounted approach wakes monster anyway → J’Mal downed by spines, Freya gives healing → tower defense → Jason’s final hammer throw → tracks reveal the fort is a waypoint → hidden Whisperwood settlement spotted → withdraw for spells → returning patrol identifies the Court of Spears → prisoners killed and raised → rent another horse and bill Fex.

## Adaptation boundaries
- The halfling’s name and physical details are not recorded here. Her leather, olive cloak and braided brown hair are visual interpretation. No invented personal history is asserted.
- The first scout injury and the later ambush are fixed story outcomes with clearly labeled cinematic D20 rolls. Levitate, Invisibility, and Freya’s rescue potion are narrated encounter-specific supplies; they do not consume or add to the player's two general healing potions. J’Mal begins the playable manticore battle at half health after the documented rescue.
- Normal manticore combat is playable; its tower collision, flight and Jason’s decisive hammer throw are the recorded victory scene. Enemy stats and alternating attacks are game tuning, not reconstructed PF1 sheet numbers. Jason’s throwing hammer is narrated without silently changing his permanent equipped weapon.
- Source roster: two scouts first; Freya, J’Mal, Jason and Draymus for the return. Reese and Bruce are not inserted into this documented four-person mission; no explanation for their whereabouts is invented. The original El Guapo departure/reunion stays intact. The brief wedding-cake callback is adapted comic dialogue, not campaign evidence.
- The fort initially looks vacant, but the attack reveals occupants. The supply-cache claim leads to a waypoint discovery, not an invented room full of loot.
- The hidden settlement is not named in objective text or dialogue until the returning patrol identifies it. The chapter ends before the Court of Spears assault.
- Rest restores health and spell/skill resources without inventing levels, XP awards or acquisitions. The patrol’s execution and raising are narrative outcomes, not a new playable undead party.

## Files and art prompts
Built-in image generation was used. Final artwork is saved in art-test/ within the repository; source silhouettes are packed into isolated three-frame idle rows. Original generated attempts remain outside the project in the generation archive.
- `fort-estazano-v1.png`: detailed gothic pixel-art overhead cutaway; small abandoned fort, bottom open gate, left collapsed watchtower, right intact stairs/wall-walk, central open courtyard, dark keep/cave opening; transparent exterior for independent grass underlay; no people or UI.
- `whisperwood-trail-v1.png`: muted woodland cutaway, clear winding central trail, canopy platforms and bridges barely visible above, transparent exterior edges, no people/text/UI.
- `fort-cast-v2.png`, `fort-cast-packed-v2.png` and JSON: two rows by three columns; adult female halfling shortbow archer in basic leather/olive cloak, brown braid; manticore with tawny lion body, human face, leathery wings and spined tail; three idle poses each, isolated silhouettes and alpha background. Hidden RGB in transparent pixels is not a painted gameplay backdrop.

## Saves, replay and verification
Version 2 save format remains compatible. Ordered fort flags and new-location prerequisites reject impossible imports. Sections 42–51 provide ten additional replay checkpoints. Automated tests cover source order, roster changes, fixed injuries, delayed settlement-name reveal, objectives, save gating and all 51 export/import replay round trips. The actual combat engine simulates 200 manticore encounters beginning with J’Mal injured. Browser checks cover the map and keyboard combat at 640×480; this does not constitute a full campaign playthrough or physical-device test.
