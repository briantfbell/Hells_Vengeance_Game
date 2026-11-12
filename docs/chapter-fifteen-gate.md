# Valor’s Fastness · Outer Gate

Chapter Fifteen begins at the end of Stranglehold. Replay sections 119–122 start at the road to the Fastness, the muster, the outer battle, and the breach respectively. This section ends once the gate is secured. The next section begins with the fortress interior.

## Story and encounter

P037, “Iomedae In A Fire,” places a royal pursuit between the supply operations and the assault. The game summarizes the fraud and deaths in a transition. The source’s reference to a sexual encounter gives no details, so the transition leaves it out. It leaves the participants unnamed and assigns no date. P037 also records the reanimated Reclamation soldiers leading the gate attack and the exterior defenders falling. P039 describes Valor’s Fastness as Kantaria’s primary barracks and gives the tower its scale.

The courtyard layout, exact defender count, and six damage dealt to each of the three front guards are game adaptations. The undead reuse the Reclamation guard model with a desaturated green treatment. The six established party members carry their existing health, equipment and resources into the section.

## Audit

- The browser playthrough started at the completed Stranglehold checkpoint, used the keyboard to reach the muster and initiate combat, won the battle, then reloaded the victory and completed breach checkpoints. The reload retained injury totals and skipped the cleared fight. The game canvas reported 640×480 with a rendered aspect of 4:3. The browser reported no console errors during the check.
- 105 regression tests passed, including all 122 replay save round trips. A dedicated check covers pre-fight retry, post-breach resources and rejection of skipped stages.
- The structural audit passed for 49 scripts, 71 scenes, 122 replays and 459 sprite frames. It reported no missing assets, invalid replay geometry or sprite-frame errors. The served build loaded the new map in the browser.
- The seeded combat simulator won 200 of 200 gate encounters starting with full resources (mean 3.21 rounds), and 200 of 200 gate encounters after the three Stranglehold battles without another rest (mean 3.65 gate rounds). The simulator used skills and healed allies below 45% health. Neither sample ended with a downed companion.

## Map provenance

`art-test/valor-fastness-gate-v1.png` was generated with the built-in image generator using `art-test/fort-estazano-v1.png` as a style reference. The generated foreground was copied unchanged and has an independent dark background layer in game.

> Style reference only: use the same dense hand-pixelled gothic RPG map art, overhead three-quarter angle, layered transparent silhouette and crisp clusters. New 8:5 landscape game foreground for the outer approach to Valor’s Fastness, a fortified temple of Iomedae in Kantaria. Solemn fortified abbey, tall watchtower behind a central pointed gate with open arch, ivory-and-gold sword and sun banners, pale gray masonry and torchlit stone, overcast twilight. Gate centered x51%, threshold around y39%. Broad unobstructed playable courtyard from x25% to 75%, y44% to 73%; straight unobstructed approach x45% to 57% continues south to the bottom. Keep all buildings, steps, rubble and braziers outside those playable areas. Real alpha transparency around outer edges, no people, lettering, weapons on walk paths, UI, horizon or painted backdrop.
