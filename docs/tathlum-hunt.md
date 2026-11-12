# Tathlum orders and the Nidal cave-giant hunt

GM timeline row S136 dates Freya’s Tathlum assignment to 4 Gozran, 4717. S137 records the 8 Gozran trip to Nidal with orders to hunt cave giants, cyclopes and trolls and scout a sacred fountain. P001, “Fuck-It List,” describes Freya’s promotion to lieutenant colonel, the orders for unusually powerful ingredients, the route past Citadel Gheistano, Draymus making a thrall, Reese tracking the giants, and Freya defeating several in single combat. The chapter leaves the cyclops, troll and fountain outcomes open.

Corrine delivers the Queen’s instructions in the game. The village, lair, exact number of three duels, enemy statistics and dialogue are adaptations. The party recovers before the expedition. The game records the cave-giant rune as awakening on the belt Freya already has in the blog. Freya’s Foundry Championship Belt item B8WdcS4xvdExMyJb records 120 ft. darkvision and a bonus to finding hidden panels and doors for this rune, along with the earlier Yunero result. The inventory describes those properties. At Dinyar, Freya receives the item’s passive +5 check when she approaches the concealed masonry. Her darkvision also reveals the lower works’ unlit cell interiors within 24 game tiles, using the same five feet per tile conversion as the postern check. The sources do not date the belt’s original acquisition.

## Citadel Gheistano

The approach is playable in sections 409A and 409B. The player spots the patrol from the clearing, then follows the covered path to the left. P001 records the company seeing the citadel and avoiding the Nidalese patrols despite their alliance, so they could travel without delay. The route, two guards and dialogue are adaptations. The patrol’s armor and shield reference the generic Foundry Nidalese Soldier (Actor.kFPeBUr3yxv6peS7).

The approach map is `art-test/gheistano-road-v1.png`. The patrol uses a transparent three-frame sheet at `art-test/nidal-patrol-v1.png` with a standing pose and alternate footfalls.

## The last cave-giant attack

Replays 411A and 411B expand the sequence from P001: Draymus’s thrall shows the company where the cave giants attacked, and Reese tracks them to their lair. The ruined holding, specific traces and dialogue are staging. Earlier checkpoints at the lair still load with their original state.

## Artwork prompts

**Attack site** · `art-test/tathlum-nidal-attack-site-v1.png`

Create a new detailed pixel art game environment, wide 8:5 landscape, for a 640×400 map in a dark fantasy RPG. Orthographic overhead three-quarter view, same scale as a 16-pixel tile walking map. A small abandoned Nidalese outlying hillside holding where a cave giant attacked recently: one small dark timber shed with a smashed corner and broken fence on the LEFT upper side only, weathered gray stone retaining wall, scattered timbers and disturbed dirt. A broad muddy open clearing from x 19–80 percent and y 45–87 percent, connected to a broad entry from bottom center; an uphill open rocky foot trail exits toward upper right x 72–80 percent starting at y 25 percent. Oversized faint humanoid footprints clearly pressed in wet earth along the trail to the right, without any other obstacles in the walkable foreground. Pine trees and rocky hills around the margins, mist in the upper distance, overcast twilight. Cool slate, muted forest greens, earthy gray-brown mud, restrained warm wood hues. Rich crisp hand-placed pixel clusters, hard edges, coherent realistic scale, no perspective horizon line. No figures, gore, fires, text, symbols, lettering, grid or UI.

Outpaint this exact Nidal cave giant attack site pixel art map horizontally into a much wider 8:5 landscape game environment (target 1600×1000). Keep the original artwork, color palette, mud, broken shed, damage, and giant footprints as intact as possible at the center. Add the minimum width needed on the far left and far right, extending matching shadowed trees and rocky borders so the scene fills the wider aspect ratio edge to edge. Do not crop the existing lower entrance or upper right exit. The artwork must read as a detailed overhead three-quarter pixel art game map, and keep the full central walkable clearing. No UI, text, people or new structures.

**Nidal village** · `art-test/tathlum-nidal-village-v1.png`

Wide 8:5 high-detail orthographic top-down dark fantasy pixel RPG map, a modest Nidalese rural village at dusk under deep slate sky. Weathered dark timber cottages top and sides, soft dim amber shutters, an open muddy stone lane across central x=15–83% y=38–84%, center bottom road entry, old north trail opening toward rocky hills. Uncluttered visible walking routes. Ash gray, blue-green shadows, muted amber light. Crisp pixel clusters, no people, signage, writing, UI or grid.

**Lair** · `art-test/tathlum-cave-lair-v1.png`

Wide 8:5 orthographic top-down dark fantasy detailed pixel RPG map, a cave giants’ lair in rocky hills of Nidal. Large gray basalt grotto, open wide flat gravel floor x=18–82% y=38–85%, massive fallen boulders and bone fragments around margins, dim natural blue spill from the centered bottom entrance and warm embers near upper wall. A dark tunnel opening upper center. Crisp distinct pixel clusters, no figures, text, UI, grids or loose obstacles in center.

**Cave giant** · `art-test/tathlum-cave-giant-v1.png`

Wide horizontal three-frame transparent RGBA sprite sheet for detailed dark fantasy pixel RPG, same adult cave giant in each third, enormous barrel-chested rough gray ochre skin, tattered hide waist wrap and weathered leather straps, a heavy knotted wooden club in right hand. All facing lower-left in full figure. Frame 1 ready, frame 2 forward club swing toward lower-left, frame 3 shifted ready. Equal scale, feet planted, broad clean zero-alpha gutters, sharp small pixel clusters. No floor shadows, aura, rendered effects, text or scenery. Preserve whole feet and weapon tips.

## Verification

The browser playthrough continued from Menador, received the orders, followed the trail to the lair, won all three solo duels and inspected the belt. It reloaded after the first duel and after completion at 640×480 with no console errors. All 161 automated tests passed. The structural audit checked 150 scenes, 418 replays and 634 sprite frames.
