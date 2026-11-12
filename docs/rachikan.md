# Rachikan Ruins

GM timeline row S113 records the dismantling of the pirate operation at the Rachikan Ruins on 15 Pharast, 4717. It also records Draymus staying behind with forty corpses. P015, “A Vacation from Virtue,” describes the company ending the recent pirate campaigns along the coast before their stop in Pezzack.

The landing, storehouse, scouting dialogue, and four pirate defenders are game adaptations. The defenders represent the courtyard encounter within the wider raid. The forty bodies are counted in the aftermath, and Draymus is the only playable character left at the ruins. His reason for staying and what happened to the bodies remain open. El Guapo’s return from the arrest remains unresolved during this section.

## Artwork prompts

**Coastal ruins** · `art-test/rachikan-ruins-v1.png`

Wide 8:5 overhead orthographic high detail pixel art map for a 640x400 handheld RPG. Rachikan Ruins, a weathered dark coastal archaeological ruin used as a pirate storehouse, ancient stone walls with broken columns, battered crates and a few unlit ropes, one empty paved court. Frame as a stone island or rocky ledge with fully transparent RGBA open sea around the left and right edges and at lower corners. The island fills most of the image. A small timber landing connects at center bottom x=42–58%. Large clear walkable stone court x=22–79%, y=36–83%. Collapsed gate upper center, vegetation and rocks stay at edges. Scattered muted warm lanterns. Cool dusk greens and slate, restrained warm wood. No figures, bodies, lettering, symbols, grid, UI or rendered water. Crisp hard-edged pixel clusters.

**Pirate sprites** · `art-test/rachikan-pirates-v1.png`

Wide horizontal three-frame true transparent alpha sprite sheet for a high-detail pixel RPG. Exactly one same stocky human pirate in each evenly spaced third: aged rusty red bandana, dark teal sleeveless waistcoat over an ivory shirt, leather boots, single chipped curved cutlass. Neutral battle pose front-left in frame 1, committed cutlass swing toward lower left in frame 2, standing weight shifted ready front-left in frame 3. All three full head to boots, at consistent scale, facing lower left, wide clean transparent gutters, hands and sword clear of borders. True zero alpha outside silhouette. No background, floor shadow, other characters, glow, blood or lettering. Fine hard edged pixels.

## Verification

The browser playthrough continued from the coastal watch, landed at Rachikan, scouted the storehouse and won the four-pirate fight. The aftermath and checkpoint reload left Draymus alone at the ruins. The game canvas was 640×480 and the browser reported no console errors. All 152 automated tests passed. The structural audit checked 135 scenes, 364 replays and 612 sprite frames.
