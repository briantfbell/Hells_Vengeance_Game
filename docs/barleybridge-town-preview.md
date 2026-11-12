# Barleybridge town and guardsman previews

The exported Barleybridge town map (`Scene.5vgQuoZspvon4viX`) and snowy scene (`Scene.Ax0LoKdKYNJRQDAH`) informed the dark timber, market, inn, and pagoda roofs. The gate-to-market layout and its walking routes were designed for the game’s 16-pixel grid.

Foundry’s Barleybridge Guardsman (`Actor.OO9bXb6Dvki1Sc3x`) supplied the portrait reference and the masterwork glaive. The armor silhouette and pose sequence are adaptations. The sprite has two ready poses and a thrust, aligned to a common baseline. Its presence in the art studio represents available production art. The export does not establish the guard’s participation in a particular encounter.

Open Longacre Art Studio, choose Barleybridge · Town Gate and Market, and move the marker with arrows or WASD. Show walkable tiles to inspect the routes. The guardsman animation is in the character gallery. The main story checkpoint is still El Guapo’s scouting and the planned Tathlum briefing.

## Artwork prompts

The map and sprite sheet were created with the built-in image generator.

**Town gate and market** · `art-test/barleybridge-town-v1.png`

Wide 8:5 game map of Barleybridge, a snowy mountain river town based on a feudal Japanese settlement. 640x400 target, overhead three-quarter orthographic playable detailed dark-fantasy pixel-art map. View from inside the dark wooden gate toward a modest plaza. The gate is at the bottom center, a broad snow-packed entrance lane and central open market square spanning x=19–81%, y=45–84%. A low dark-timber inn along upper left, a small pagoda-like roof at upper right, a few closed stall awnings beyond the square at top. Outside the right wall beyond the town is distant river mist. Restrained slate blue shadows, packed gray snow, warm amber lanterns, high-detail crisp pixel clusters. Keep the floor in the broad square clear. No characters, people, smoke, conflict, signs, letters, grids or UI.

**Guardsman** · `art-test/barleybridge-guard-v1.png`

A 3:1 wide sprite sheet, three separated full-body poses of one Barleybridge guardsman for a high-detail dark fantasy pixel RPG. A young adult Tian man with a dark topknot, warm tan complexion, clean shaven angular face and dark rust-red collar, wearing charcoal and muted indigo lamellar armor, modest cords, practical boots and a winter sash. His only weapon is a simple glaive with a curved blade on a dark wooden shaft. All three poses face left in the same three-quarter view: standing watch with the shaft upright, one compact forward glaive thrust, a ready stance with weight shifted and knees bent. Keep the polearm entirely inside each pose's equal square cell, same scale and baseline, clean alpha-zero gaps between silhouettes, no floor shadows or haze. True transparent PNG. Dark crisp pixel clusters, no text or scenery.

## Verification

The browser test walked through the gate to the market and verified the guardsman card rendered without console errors. Automated checks reached each marked town destination and verified all three sprite frames fit inside the atlas. All 169 automated tests and the campaign structural audit passed.
