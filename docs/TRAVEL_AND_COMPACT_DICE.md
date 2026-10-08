# Travel cards and compact combat rolls

Implemented 2026-10-08.

- Combat dice panel reduced from 47% to 35% of the stage on desktop, and 49% to 37% on smaller screens. Dice remain on the right; multiple dice wrap within the panel.
- Objective emblem retains its translucent gold diamond and dark outline, with a small diamond center instead of an exclamation point.
- Every playable map change uses a fade-to-dark destination card containing the location, purpose and a Continue button. Appropriate existing travel narration is moved into these cards.
- Phase cards cover the two-night jump after the opening briefing, the Ash House nighttime interruption, and the next morning before posting decrees.
- Movement and interactions pause during a card. Enter, Space or E continues; Tab keeps focus on Continue. Reduced-motion preferences remove the fade.
- Destination changes commit under the dark card and create a checkpoint. Resuming that checkpoint opens the destination without replaying the travel card. Reset cancels a pending card. Phase changes remain governed by existing saved quest flags.

Validation: real tavern entry, all ten additional destinations, overnight decree transition, checkpoint destinations, movement lock, reset cancellation, reduced motion, and one/two/three dice at 320px and desktop. Full chapter walkthroughs also exercised the changed travel routes.

No leveling, stats or new chapter gameplay was added. Next: CHARACTER_SOURCE_AND_PROGRESSION_PLAN.md.
