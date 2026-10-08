# Kintargo playable art study

Open `Kintargo Playable Art Test.html` in a browser with the sibling `art-test` folder present. No installation or server is required. The original game HTML is unchanged.

Controls: WASD/arrows, Shift to run, E/Enter to interact, click to walk, or use the onscreen controls. Explore the western doorway, speak to the Dottari, and reach the eastern gangplank. Show paths reveals collision cells. Restart clears prototype progress.

This is a separate movement and visual-scale prototype, not a campaign chapter. The Dottari dialogue comes from the supplied game. Door and departure lines are sample connective text. Freya's identity comes from the campaign character profile and labeled portrait P053_02.jpg. Background building placement is an invented test block, not a canonical Kintargo map.

The environment is a single raster map with an authored collision layer. Production maps should use reusable tiles and separate tall scenery layers. Sprite frames are a generated first pass and will need hand cleanup for final animation timing and pixel consistency.

Assets generated with the built-in imagegen tool, then copied here:
- art-test/kintargo-map.png
- art-test/freya-sheet.png
- art-test/dottari.png

## Final prompts

### Map

Production game environment asset for Hell's Bubbies, Pathfinder Hell's Vengeance Kintargo night. Single 8:5 landscape image, 1600x1000 or similar. STRICT ORTHOGRAPHIC near TOP-DOWN THREE-QUARTER JRPG map, NO horizon, no sky, no perspective vanishing point. Uniform scale throughout. VERY HIGH DETAIL TRUE PIXEL ART as native 640x400 upscaled nearest neighbor, sharp square pixel clusters and dithered pixel shading, no smooth painting. Similar to accepted reference image's rich Gothic stone architecture, crimson banners, blue slate roofs, amber lamps, moonlit harbor. CRITICAL GAMEPLAY GEOMETRY: use coordinates relative to 640x400 canvas. A CLEAR wide vertical cobbled street runs x=224..416 entire height top to bottom. A CLEAR wide horizontal street runs x=144..624 between y=192..288. Their intersection is an open plaza with quiet dark slate cobbles and sparse subtle warm light, absolutely no props, characters or obstacles in either street. Upper-left building footprint x=0..192 y=0..180, decorative south-facing dark entrance at x=168 y=175 accessible from horizontal street below; upper-right building footprint x=448..640 y=0..176. Bottom-left building footprint x=0..176 y=312..400. Harbor water occupies bottom-right x=448..640 y=312..400, shoreline solid stone wall along y=312. Horizontal east street terminates in a wooden gangplank at right edge x=600..640 y=218..264 that suggests ship exit. Alley paving x=160..224 y=180..304 connects west entrance with plaza. Center street foreground entry bottom at x=320 y=388. Decorative crates, barrels, iron lamps and greenery ONLY tight against building boundaries, never in clear streets. No stairs or changes of level on main routes. Buildings cast small directional pixel shadows outside central walking zones. No people, no sprites, no text, no UI, no lettering, no map labels. This must be a readable playable level, elaborate detail around edges and calm traversable open space in center. Hard crisp pixel blocks everywhere.

### Freya

Use case: stylized-concept. Production transparent pixel sprite sheet of Freya Kusanagi, half-elf female samurai from Hell's Bubbies. Reference is appearance only; preserve pale complexion, long flowing straight black hair, crimson lamellar armor with ornate GOLD trimming, gold tassels and layered shoulder plates, sheathed katana left hip. Adult 5-head proportions, small face, slender athletic. TRUE HIGH DETAIL PIXEL ART, hard square pixel clusters, no smooth shading, no antialiasing, 1px dark outline, 4 shades per material. EXACTLY nine full body sprites on transparent background in a regular 3 COLUMNS by 3 ROWS sprite sheet. Equal cells, no gutters, character at identical scale in each cell, feet same baseline within each cell, each head and sword entirely contained in own cell. Each cell 72x120 conceptual native pixels; sheet 216x360 conceptual native size, may render integer-upscaled larger. Character fills central 46x108 pixels of each cell, 8px head padding and 4px bottom padding. ROW 1 faces DOWN toward viewer, columns idle / walking left foot forward / walking right foot forward. ROW 2 faces RIGHT in profile, columns idle / walking left foot forward / walking right foot forward. ROW 3 faces UP back to viewer, columns idle / walking left foot forward / walking right foot forward. Transparent gaps, no floors, no cast shadow, no UI, no labels, no frame lines, no lettering. SAME character proportions, detailed readable crimson armor and black hair in all 9 poses. This is a usable spritesheet, not an illustration or contact sheet with borders.

### Dottari

Production single FULL BODY pixel-art sprite on transparent background for Kintargo Dottari city guard from Pathfinder Hell's Vengeance. Match detailed crisp pixel sprite style of supplied sheet, same adult 5-head proportions, same pixel grid, hard outlines, crimson and gold palette with cold steel. Facing down slightly toward viewer, idle stance, steel helmet with red crest and face in shadow, dark red gambeson under detailed steel breastplate, leather belt, armored boots, spear held upright on right. ONE character only centered, entire spear and boots visible with padding, no background, no floor, no text, no frame, no labels, no cast shadow. Detailed pixel clusters and discrete highlights on armor, no smooth painting.


Atmospheric lighting: twenty independently phased low-amplitude light masks animate lamp and window brightness. Reduced-motion preferences disable the effect. Direct-file mode uses spatial masks where browser pixel-read restrictions apply; the localhost preview uses warm-pixel masks. No GIF decoding or extra raster assets are required.
