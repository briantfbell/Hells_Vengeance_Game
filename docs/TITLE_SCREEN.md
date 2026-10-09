# Title screen and menu theme

Brian supplied all four original PNGs on October 9, 2026. They are copied unchanged into art-test: title-card.png, title-background.png, folken-games-logo.png and hells-rebels-logo.png. The first two are used by the runtime; the standalone logos are retained for future branded screens. No party artwork or weapon rules were changed.

The 640×480 canvas draws the untitled poster, then restores the printed title area from the complete card. Color masks pulse only bright flame and purple magic pixels. Sparse pixel embers move upward, without consuming gameplay random numbers. When a browser blocks pixel reads for directly opened local files, the poster and moving embers remain available without the color masks. There is no GIF dependency or stretched exploration background. A brief dim flicker precedes the prompt fade; reduced motion disables both startup and ambient animation.

The title always appears on launch, including when a save exists. Enter/E/Space confirm; literal A also opens the initial prompt. Arrows/WASD navigate menus; B/Escape return. The existing handheld control plan remains unchanged and native gamepad mapping remains future work.

Continue and manual slots use existing validated saves. Empty/corrupt slots are disabled. New game uses the established character selector; backing out preserves saves. Import uses the existing preview/confirmation flow. Returning from pause saves first and is unavailable during combat. The burgundy, charcoal and gold stylesheet also themes dialogue, journey, pause, character selection and combat without changing their layout.

Validation: keyboard navigation, new game/back, checkpoint resume, manual slot loading, portable import, fixed 640×480 and 320×240 bounds, reduced-motion static frames, offline startup and existing progression/save tests.
