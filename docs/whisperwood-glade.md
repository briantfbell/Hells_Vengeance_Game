# The Blessing of Unicorns

“Charges Dropped” (P028) records that the party killed three unicorns in their ancestral creek glade, camped there, and was driven out by surviving unicorns, stone giants, owlbears and swan maidens. J’Mal recovered the fourth horn during the retreat. The campaign timeline separately records four later unicorn deaths and four horns recovered overall. It does not identify which later engagements account for those deaths.

The initial assault uses regular initiative. The retreat is scripted so the player covers the withdrawal, retrieves the fourth horn as J’Mal, and leaves with all four. The representative lineup, Freya’s cover action, the exact pickup roll, the recovery at the glade camp and the return checkpoint are adaptation choices. The fourth horn and retreat outcome are committed together. The inventory tracks the first three and the final horn.

Replays 222–226 cover the glade trail, assault, collection, camp and counterattack.

## Artwork

The built-in ImageGen tool generated the glade and its defenders. The creek uses the same masked water layer as the Senara sewers.

- `art-test/whisperwood-unicorn-glade-v1.png` — Wide 8:5 overhead orthographic detailed crisp pixel art RPG map, a beautiful ancestral unicorn glade in a dark fantasy pine woodland by clear soft daylight. Playable broad continuous grassy clearing from lower center through center to upper center, scattered small wildflowers, ancient mossy trees frame the sides. A gently curving pale blue creek flows vertically down the rightmost third only, banks clearly distinct, rocky bottom. No bridge needed, the left bank is open and walkable. No buildings, characters, text or paths blocked by boulders. Hard square pixel clusters, aged saturated forest palette, 32-bit handheld game art.
- `art-test/whisperwood-unicorn-v1.png` — Single full-body true transparent RGBA PNG sprite for a dark fantasy handheld pixel RPG. One white woodland unicorn with a long slender ivory horn, realistic horse anatomy and powerful cantering battle stance, head and horn turned toward lower left, four visible hooves, bright silver mane, slight muted gold edge light. Sharp hard small pixel clusters. Alpha zero outside the unicorn, full silhouette within margins, no backdrop, shadow, ground or text.
- `art-test/whisperwood-glade-defenders-v1.png` — Two separate full-body transparent RGBA sprites, horizontal row with empty gap, high-detail hard-pixel fantasy handheld RPG. LEFT creature is an owlbear, massive dusky brown bear body with owl head, beak and feathered forearms, grounded attacking stance facing lower left. RIGHT defender is a swan maiden in human battle form, adult woman in light white feather mantle and dark gray leather with a slender bow, subtle pale swan wings folded, facing lower left. Distinct silhouettes, no gore, no shadow, no ground, no background, alpha zero outside sprites. No text.
- `art-test/whisperwood-stone-giant-v1.png` — One isolated full-body true-transparent RGBA pixel-art sprite for a dark fantasy handheld RPG. A stone giant: tall wiry muscular broad-shouldered humanoid, bald, ash-gray and mottled slate skin resembling smooth stone, stony angular face, sparse rough gray hide skirt and leather belt, wielding one large rough stone-headed club. Leaner and taller than a fur-clad forest giant. Grounded ready stance, front three-quarter looking left. Crisp hard small pixel clusters, no glow, no haze, no floor, full feet in frame, transparency alpha 0 outside silhouette, no letters.

## Verification

128 tests passed. The structural audit checked 62 scripts, 103 scenes, 226 replays and 564 sprite frames. In the browser, the existing dawn save led into the assault, all three unicorns were defeated with the normal combat controls, and the horn count advanced to three. The counterattack’s final controls each showed one command. The fourth horn survived a checkpoint reload. The canvas stayed 640 × 480 and the browser reported no errors.
