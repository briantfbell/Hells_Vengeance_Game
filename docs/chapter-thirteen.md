# Chapter Thirteen — Quiet Knives

This continuation takes the company from the completed dock/tower operation through Kantaria’s covert disruption and the loss of its Uskwood shelter. Continue normally or use replay sections 86–102.

## Campaign evidence

Primary narrative: `Pathfinder_Campaign_RPG_Gift/raw_posts/P037.txt`, “Iomedae In A Fire.” It explicitly records a market riot, militia patrol attacks falsely blamed on homeless freed slaves, labor-guild burglary and record tampering, theft of priceless artifacts from Narikopolus Manor, fireballs during a fight at the Uskwood, and retreat to damp, plague-ridden caves while wounded and exhausted.

The local GM master timeline records the Fungus Caves and Corrine’s liaison assignment on **4716.12.24**. It does not independently date each market, guild or manor operation. The displayed mission sequence is playable staging of the retrospective account, rather than a claim to an exact session chronology.

The prison recap in P037 conflicts with the more detailed extraction account in P039. This batch does not decide the warden’s fate, introduce another prison assault or grant additional prisoner-release outcomes. The apparent Hellknight-induction date in the timeline also conflicts with the DM’s post-Kantaria clarification; no induction occurs here.

## Playable sequence and interpretation

1. Quiet Knives planning at the Uskwood.
2. Market conversation and a choice of Freya or Jason to stir unrest.
3. An isolated militia ambush, followed by an explicitly false account blaming freed slaves. The narration identifies the company as responsible.
4. A clerk distraction, burglary and record tampering at the labor guild.
5. Observation of Reclamation agents and theft at Narikopolus Manor.
6. Return to the Uskwood; a fireball transition establishes the destruction, followed by an escape fight.
7. Retreat, recovery and Corrine’s liaison introduction at the cave refuge.

The conversation wording, anonymous civilian appearances, room layouts, distractions and three-opponent encounter compositions are adaptation. The source does not identify the Uskwood attackers or the caster of its fireballs; neither is assigned a campaign identity. Zara’s and Loredana’s whereabouts after the fire are not asserted. The manor loot remains non-equippable story cargo with no named identity, powers or stat bonus.

The six established companions participate. Bruce’s joining point remains unconfirmed. No new campaign advancement, equipment upgrade or learned spell is inferred. El Guapo receives a brief cheeky shelter line without changing his original departure/return sequence.

## Maps, art and presentation

- `kantaria-market-v1.png`: market and patrol staging.
- `kantaria-guild-v1.png`: labor-guild records room.
- `kantaria-manor-v1.png`: manor gallery.
- `kantaria-caves-v1.png`: damp refuge.
- `kantaria-civilians-v1.png` and frame metadata: anonymous Market Trader and Guild Clerk, three facings each, with centered face crops.
- Existing Uskwood art and Corrine model are reused. Inn fire and cave shimmer are code effects; reduced-motion mode suppresses animation.

The four map PNGs have true transparent foreground borders over independent dark underlays. They are rendered into the existing 640×480 canvas without changing its aspect ratio. Broad central floor geometry keeps objectives reachable. The original maps supplied style references for generation.

Art was generated with the built-in imagegen tool. Full prompts and source-to-asset mapping are preserved in `KANTARIA_COVERT_ART_PROMPTS.json`. Original generated images were copied unchanged; frame coordinates were obtained through read-only alpha inspection. An additional civilian-background edit was generated but unused after inspection confirmed the original’s background already had zero alpha. Anonymous roles are not intended as canonical likenesses.

## Saves and validation

Seventeen new replay checkpoints bring the total to **102**. Portable saves validate the sequential chapter flags and map prerequisites; old Chapter Twelve saves still lead into the continuation. A burning-inn checkpoint resumes before its unresolved fight. Completed interactions do not recur. Cave recovery restores existing health/resources; it does not level the party.

- **83 automated tests passed**: chapter event gates, save rejection of skipped prerequisites, all 102 portable replay round trips, map reachability, existing combat/controller behavior.
- Actual engine combat code exercised for **200 seeded runs** per encounter. Both new fights and their uninterrupted two-fight chain won in every harness run, with no additional downed companions in the chain. The harness uses skills first and heals living allies below 45% health; these results do not imply every strategy is safe.
- Browser checks cover new market, guild, manor and cave layouts, trader/clerk portraits, cave recovery and Corrine dialogue. The logical canvas remains 640×480.

## Questions retained for later story reconciliation

- Does the prison recap describe the same extraction operation as P039, or a separate later return? When did it occur relative to Zara’s rescue and the Uskwood fire?
- What were the stolen Narikopolus Manor artifacts, and what did the party do with them afterward?
- Who opposed the party at the Uskwood, and who cast the fireballs that destroyed the shelter?
- Where were Zara and Loredana when the Uskwood burned, and what happened to them afterward?
- At what event did Bruce first join the company?

The earlier angel defender remains provisional under Brian’s explicit direction: no named identity or invented biography is attached to that opponent.
