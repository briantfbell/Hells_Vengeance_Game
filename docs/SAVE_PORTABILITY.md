# Portable saves

Use **Export save** during play to download a JSON checkpoint. On another computer, pull or download the entire game and choose **Import save** on the character-selection screen, or in the game toolbar. Select the file, review the character/location summary, and confirm.

The file carries your chosen character, active companions, story flags, HP, remaining abilities, potions, character levels, completed advancement milestones, and position. During a conversation or battle, export uses the last safe checkpoint; importing waits until that scene finishes. Normal browser checkpoints continue automatically.

Import validates the file before replacing anything. Cancel preserves the current save. A successful replacement keeps the previous checkpoint; **Restore previous save** swaps it back. Files with unsupported versions, unknown characters, invalid resource counts, or unwalkable positions are rejected. Maximum file size is 128 KiB. Legacy version-one raw checkpoints are supported.

Saves stay local to the browser until you export them. GitHub carries the game files; it does not sync progress. File and HTTP browser origins may each have their own checkpoint. Keep an exported file before changing computers, browsers, or launch method.

Checkpoints now use version 2. Version-one checkpoints automatically migrate: earlier story states remain level 1, while saves after the post-sermon Ash House rest receive the level-2 increases without losing existing damage or defeated status. See LEVEL_TWO_PROGRESSION.md for the exact rules.
