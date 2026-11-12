# Reese’s vision and the tailor’s quarter

Replays 275–281 follow the closing events in P022, “Down to Earth.” Reese sees the fountain in a vision, and J’Mal accompanies him to meet the stranger. The stranger gives them until Thursday and directs them to report to Florio Cento in Remesiana afterward. J’Mal and El Guapo trace the family’s routine and return to the company with a plan.

The stranger’s appearance, exact dialogue, and street layout are game adaptations. The shop, home, and route to the schools are represented as three stops on a single map. This section ends with reconnaissance completed and the company back at Hotel Barato.

## Artwork and ImageGen prompts

**Fountain plaza** · `art-test/egorian-fountain-v1.png`

Wide 8:5 single orthographic top-down 2D videogame map, detailed dark fantasy pixel art with hard pixel clusters, Egorian in Pathfinder, a quiet medieval Chelish neighborhood plaza in overcast morning. Compact old limestone fountain with a nearly circular basin centered at 50% x, 32% y, occupies no more than 22% of image width and 23% height. Muted blue-gray water. Slate dark brick townhouses and tall narrow windows along top and far edges. Warm light in a few windows, subtle burgundy and charcoal colors. Broad clean open and entirely traversable cobbled area between 15% and 85% width below the fountain all the way to bottom edge, open at lower left and lower right. No foreground objects, people, frames, lettering, or UI. The map will be used at 640x400.

**Tailor’s quarter** · `art-test/egorian-tailor-street-v1.png`

Wide 8:5 single overhead orthographic medieval city game map in high-detail dark fantasy RPG pixel art. Egorian working quarter in overcast daylight. Three distinctive visible buildings in a continuous row along the top half: left a fine tailor shop with an expansive street display window, center a modest family townhouse with a narrow stone stair, right a lane opening between two buildings with academic stonework glimpsed at its far end. Absolutely no people, no bodies, no lettering, no signage text, no UI. Walkable dark gray cobblestone street clear of obstacles spans full width in the lower half, open at bottom center. Establish each location by silhouette and restrained warm amber details with soot-red accents. Hard pixel clusters and believable texture, readable at 640x400.

**Stranger** · `art-test/egorian-fountain-stranger-v1.png`

One full-body 3/4 front sprite of an unnamed adult human messenger for a dark medieval fantasy pixel RPG. A plain almost black charcoal cloak with understated burgundy lining, dark weathered clothing, gloves, worn boots, face visible with short dark hair and a composed guarded expression. Natural adult proportions, standing neutrally with arms at sides, feet fully visible, no weapons, no symbols, no ground, no effects, no text. Highly detailed hard-edged pixel clusters with muted cool shadows and a few warm highlights. Real transparency with RGBA zero outside the character. Centered figure.

## Verification

All 137 automated tests passed. The structural audit checked 71 scripts, 117 scenes, 281 replays and 580 frames. The browser playthrough resumed from the previous Hotel Barato checkpoint, showed both scouting rosters, displayed the deadline and Florio instruction, and preserved progress through a mid-route reload and a reload after returning to the hotel. The canvas measured 640×480 and the browser reported no errors.
