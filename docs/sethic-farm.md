# Sethic’s devil-hog farm

Replays 315–319 follow P004, “Choices,” and GM timeline row S099. The company destroys Sethic’s devil-hog farm after backing Vasvion. The timeline gives the date as 4717.02.30. That source notation is preserved here and the scene does not give an exact day.

The farm layout, three-hog encounter, stats, and destruction of the barn and pens by fire are game adaptations. The company drives the herd out of the yard before destroying the operation, then returns to Egorian.

## Artwork and built-in ImageGen prompts

**Farm** · `art-test/sethic-farm-v1.png`

A single wide 8:5 dark fantasy overhead pixel RPG map for 640x400. Late afternoon near Egorian, Cheliax. A secluded devil-hog farm with a central weathered red-brown feed barn at the upper center and empty split rail hog pens flanking the barn left and right, all buildings and fences in top 45 percent only. A low timber wall at the left and right margins, warm lamps and overcast green-gray dusk. A broad, uninterrupted packed earth yard from x=12% to 88%, y=46% to 92%, a bottom-center path exiting the scene. Distinct bale and feed storage details by the barn wall. Hard-edged fine pixel clusters. No people, animals, words, lettering, or UI.

**Ruined farm** · `art-test/sethic-farm-ruins-v1.png`

Create the ruined state of this exact farm map. Preserve the original 5:4 aspect ratio, exact camera, walkable foreground, perimeter and bottom exit, view of Egorian and placement of every structure. Change the upper center barn to a recently burnt, partially collapsed, dark timber shell with embers. Char and break the nearby left and right pen rails. A little restrained smoke can rise against the sky, keep the open yard clear. Maintain the precise dark fantasy RPG hard pixel art texture. No people, animals, bodies, text or UI.

**Devil-hog sprite sheet** · `art-test/sethic-devil-hog-v1.png`

Three combat frames for the same four-legged fantasy devil-hog, horizontal one row with wide empty gutters, all hooves and tails completely contained. High detail hard-edged pixel sprite art for handheld dark fantasy RPG. Wild black-bristled boar, dense charcoal hide, ember-brown marks along its shoulders, two stout pale curved tusks and small red-orange eyes. Clearly quadrupedal animal silhouette, realistic proportions. First pose crouched alert front-left, second pose aggressive lunging front-left with tusks extended, third pose shifting weight front-left. Equal scale, fixed body anchor and aligned feet. Real transparent RGBA, no floor, shadow, gore, text or extra objects.

**Transparency cleanup**

Remove the visible white backing from this exact three-frame pixel art boar sprite sheet. Keep the same three silhouettes, bristles, horns, hooves and tail edges, details, scale, alignment and exact image boundaries. Render the entire white backing, all outside margins and both gutters as true RGBA alpha=0, including around and between legs. Isolated opaque sprites on a fully transparent PNG, with no white matte, checkerboard, ground or shadow. Do not introduce any additional elements.

## Verification

The 640×480 browser playthrough continued from Vasvion’s alliance, won the hog encounter, and reloaded the ruined farm and the return to Egorian. No browser errors were logged. The fight fits all three enemies clear of the dice overlay. Automated coverage checks encounter prerequisites, map state, and portable checkpoints.
