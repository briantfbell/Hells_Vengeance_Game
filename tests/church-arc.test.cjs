const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,'art-test',n),'utf8');
function world(){const w={window:null,structuredClone,CORE:['freya','jamal','jason','draymus','guapo','reese'],OPENING_ROSTER:['freya','jamal','jason','draymus','guapo'],document:{getElementById:()=>({})},localStorage:{getItem:()=>null},scenes:{},STATS:{},CHAPTER_NPCS:{dog:{x:0,y:0,w:20,h:20}},NEXT_NPCS:{dog:{x:0,y:0,w:20,h:20}},FUTURE_NPCS:{},MAP_LAYERS:{},JOURNEYS:{},NAMES:{},art:{},quest:{},scene:'execution_square',units:[],hp:{freya:44,jamal:35,jason:37,draymus:30,guapo:34,reese:30},transcript:[],battles:[],NextChapter:{refresh:()=>{}},performance:{now:()=>0}};w.window=w;vm.createContext(w);for(const n of ['inventory.js','progression.js','save-files.js','church-assault.js'])vm.runInContext(read(n),w);for(const id of ['escape_jail','church_watch','longacre_church','execution_square'])w.scenes[id]={image:'map.png',spawn:[328,312],points:[],walk:[{x:0,y:0,w:640,h:400}],blocks:[],lights:[]};w.ChurchArc.install();w.point=id=>w.scenes[w.scene].points.find(p=>p.id===id);w.say=async(name,text)=>w.transcript.push({name,text});w.journeyCard=async(t,s)=>w.transcript.push({name:t,text:s});w.travel=async id=>w.scene=id;w.storyRoll=async()=>20;w.seedParty=()=>w.units=w.CORE.map(id=>({id}));w.paintBattle=w.planEnemyRound=w.paintParty=w.save=w.updateObjective=w.applyProgression=w.log=()=>{};w.startBattle=(_a,_b,c)=>{w.battle={...c,round:1};w.battles.push(c);};w.inventory=w.Inventory.fresh();vm.runInContext(read('chapter-engine.js').slice(read('chapter-engine.js').indexOf('function replaySections(){'),read('chapter-engine.js').indexOf('function replayAllowed(){')),w);const list=w.replaySections();for(const s of list)w.scenes[s.scene]??={walk:[{x:0,y:0,w:640,h:400}],blocks:[]};w.SaveFiles.install({core:w.CORE,scenes:w.scenes,names:w.NAMES,stats:Object.fromEntries(w.CORE.map(id=>[id,{hp:40,atk:4,dmg:[1,6,2]}])),special:Object.fromEntries(w.CORE.map(id=>[id,{uses:3,dmg:[1,6,0]}])),key:'test'});return w;}
function checkpoint(w,s){const q=structuredClone(s.quest),p=w.Progression.migrate(q);return {version:2,scene:s.scene,lead:'freya',quest:q,progression:p,position:{x:s.position[0],y:s.position[1]},hp:Object.fromEntries(w.CORE.map(id=>[id,40])),uses:Object.fromEntries(w.CORE.map(id=>[id,0])),potions:2,mendUses:2};}

test('Fastness checkpoints preserve battle retry and completed breach while rejecting skipped stages', () => {
 const w=world(), sections=w.replaySections();
 const start=checkpoint(w,sections.find(section=>section.id==='fastness-start'));
 const retry=checkpoint(w,sections.find(section=>section.id==='fastness-charge'));
 const finished=checkpoint(w,sections.find(section=>section.id==='fastness-threshold'));
 finished.quest.fastnessGateComplete=true;
 finished.hp.jamal=9;
 finished.potions=0;
 const roundTrip=save=>w.SaveFiles.decode(w.SaveFiles.encode(w.SaveFiles.validate(save)));
 assert.equal(roundTrip(start).scene,'supply_report');
 assert.equal(roundTrip(retry).quest.fastnessMustered,true);
 assert.notEqual(roundTrip(retry).quest.fastnessGateCleared,true);
 const restored=roundTrip(finished);
 assert.equal(restored.quest.fastnessGateComplete,true);
 assert.equal(restored.hp.jamal,9);
 assert.equal(restored.potions,0);
 for (const flag of ['chapter14Complete','chapter15','fastnessMustered','fastnessGateCleared']) {
  const forged=structuredClone(finished);
  forged.quest[flag]=false;
  assert.throws(()=>w.SaveFiles.validate(forged),/Valor’s Fastness/);
 }
 start.scene='fastness_gate';
 assert.throws(()=>w.SaveFiles.validate(start),/Valor’s Fastness state/);
});

test('Fastness interior saves preserve injuries and reject access to uncleared rooms', () => {
 const w=world(), sections=w.replaySections();
 const saveAt=id=>checkpoint(w,sections.find(section=>section.id===id));
 const hall=saveAt('fastness-hall');
 const stairs=saveAt('fastness-stairs');
 stairs.quest.fastnessInteriorComplete=true;
 stairs.hp.jamal=9;
 stairs.mendUses=0;
 const restored=w.SaveFiles.decode(w.SaveFiles.encode(w.SaveFiles.validate(stairs)));
 assert.equal(restored.quest.fastnessInteriorComplete,true);
 assert.equal(restored.hp.jamal,9);
 assert.equal(restored.mendUses,0);
 hall.scene='fastness_chapel';
 assert.throws(()=>w.SaveFiles.validate(hall),/Premature Valor’s Fastness location/);
 for(const flag of ['fastnessGateComplete','fastnessHallCleared','fastnessChapelCleared']){
  const forged=structuredClone(stairs);
  forged.quest[flag]=false;
  assert.throws(()=>w.SaveFiles.validate(forged),/Invalid Valor’s Fastness sequence/);
 }
});

test('Fastness ascent saves preserve Lencia’s defeat and reject skipped defenders', () => {
 const w=world(), sections=w.replaySections();
 const saveAt=id=>checkpoint(w,sections.find(section=>section.id===id));
 const study=saveAt('fastness-study');
 study.scene='fastness_gallery';
 assert.throws(()=>w.SaveFiles.validate(study),/Premature Valor’s Fastness location/);
 const last=saveAt('fastness-last-stair');
 last.quest.fastnessAscentComplete=true;
 last.uses.jamal=2;
 const restored=w.SaveFiles.decode(w.SaveFiles.encode(w.SaveFiles.validate(last)));
 assert.equal(restored.quest.fastnessLenciaSlain,true);
 assert.equal(restored.quest.fastnessAscentComplete,true);
 assert.equal(restored.uses.jamal,2);
 for(const flag of ['fastnessInteriorComplete','fastnessMageCleared','fastnessWarpriestCleared','fastnessLenciaSlain']){
  const forged=structuredClone(last);
  forged.quest[flag]=false;
  assert.throws(()=>w.SaveFiles.validate(forged),/Invalid Valor’s Fastness sequence/);
 }
});

test('Oppian’s custody survives export and requires the summit victory and rescue', () => {
 const w=world(), sections=w.replaySections();
 const saveAt=id=>checkpoint(w,sections.find(section=>section.id===id));
 const retry=saveAt('fastness-summit');
 assert.equal(w.SaveFiles.validate(retry).quest.fastnessAscentComplete,true);
 assert.notEqual(w.SaveFiles.validate(retry).quest.fastnessSummitWon,true);
 retry.scene='fastness_tower_base';
 assert.throws(()=>w.SaveFiles.validate(retry),/Premature Valor’s Fastness location/);
 const end=saveAt('fastness-report');
 end.quest.chapter15Complete=true;
 end.hp.jamal=7;
 end.potions=0;
 const restored=w.SaveFiles.decode(w.SaveFiles.encode(w.SaveFiles.validate(end)));
 assert.equal(restored.quest.fastnessOppianCaptured,true);
 assert.equal(restored.quest.chapter15Complete,true);
 assert.equal(restored.hp.jamal,7);
 assert.equal(restored.potions,0);
 for (const flag of ['fastnessAscentComplete','fastnessSummitWon','fastnessOppianRescued','fastnessOppianCaptured']) {
  const bad=structuredClone(end);
  bad.quest[flag]=false;
  assert.throws(()=>w.SaveFiles.validate(bad),/Invalid Valor’s Fastness sequence/);
 }
});

test('Kantaria rewards validate in sequence and preserve equipped gear and spent charges',()=>{
 const w=world(),sections=w.replaySections();
 const saveAt=id=>checkpoint(w,sections.find(section=>section.id===id));
 const before=saveAt('kantaria-gifts');
 before.quest.mosswaterSpent=1;
 assert.throws(()=>w.SaveFiles.validate(before),/gear has not been awarded/);
 const end=saveAt('kantaria-departure');
 end.quest.kantariaDepartureReady=true;
 end.quest.mosswaterSpent=4;
 end.quest.dragonHelmSpent=2;
 end.uses.draymus=7;
 const back=w.SaveFiles.decode(w.SaveFiles.encode(w.SaveFiles.validate(end)));
 assert.equal(back.inventory.equipped.reese,'silent_sentry');
 assert.equal(back.uses.draymus,7);
 assert.equal(w.Inventory.giftCharges(back.quest,'jamal'),1);
 assert.equal(w.Inventory.giftCharges(back.quest,'jason'),1);
 end.quest.dragonHelmSpent=4;
 assert.throws(()=>w.SaveFiles.validate(end),/Invalid dragonHelmSpent/);
 end.quest.dragonHelmSpent=2;
 end.quest.uskwoodDeedSigned=false;
 assert.throws(()=>w.SaveFiles.validate(end),/Invalid Kantaria aftermath sequence/);
});
test('all 246 replay checkpoints validate and survive export/import, including new equipment',()=>{const w=world(),list=w.replaySections();assert.equal(list.length,246);for(const section of list){const c=w.SaveFiles.validate(checkpoint(w,section)),back=w.SaveFiles.decode(w.SaveFiles.encode(c));assert.equal(back.scene,section.scene);assert.equal(back.progression.levels.jamal,section.quest.decreesIssued?2:1);}const final=w.SaveFiles.validate(checkpoint(w,list.at(-1)));assert.equal(final.inventory.equipped.jamal,'mantis_blades');assert.equal(final.inventory.equipped.jason,'lucerne');assert.equal(final.inventory.equipped.freya,'naginata');});
test('church saves reject skipped evidence, forged training and premature chapter locations',()=>{const w=world(),c=w.SaveFiles.validate(checkpoint(w,w.replaySections().at(-1)));for(const flag of w.ChurchArc.chain.slice(0,-2)){const bad=structuredClone(c);bad.quest[flag]=false;assert.throws(()=>w.SaveFiles.validate(bad));}const early=checkpoint(w,w.replaySections()[0]);early.scene='church_hall';assert.throws(()=>w.SaveFiles.validate(early));assert.throws(()=>w.Inventory.equip(w.Inventory.fresh(),{},'jamal','mantis_blades'));});
test('church flow follows missing bodies through all four encounters and recorded aftermath',async()=>{const w=world();w.quest={chapter6Complete:true};for(const id of ['churchArcRoad','missingRemains','followChurchTracks','breachChurch','entryFight'])await w.ChurchArc.interact(id);assert.equal(w.battles[0].enemies.length,4);assert.equal(w.inventory.equipped.jason,'lucerne');await w.ChurchArc.afterBattle('church_entry');await w.ChurchArc.interact('hallRoad');await w.ChurchArc.interact('hallFight');assert(!w.units.some(u=>u.id==='jamal'));await w.ChurchArc.afterBattle('church_hall');await w.ChurchArc.interact('sanctuaryRoad');await w.ChurchArc.interact('interruptRitual');await w.ChurchArc.interact('sanctuaryFight');assert.equal(w.battle.paralyzed,'jamal');await w.ChurchArc.afterBattle('church_sanctuary');await w.ChurchArc.interact('allamarFight');assert(!w.units.some(u=>u.id==='draymus'));assert(w.units.some(u=>u.id==='reese'));await w.ChurchArc.afterBattle('church_allamar');for(const id of ['destroyGhast','altarRoad','breakAltar','assassinBoon','trainingRoad','mantisLesson','conversionRoad','dedicateChurch','churchArcComplete'])await w.ChurchArc.interact(id);assert(w.quest.chapter7Complete);assert.equal(w.inventory.equipped.jamal,'mantis_blades');assert(w.transcript.some(x=>/twenty-four/i.test(x.text)));assert(w.transcript.some(x=>x.text.includes('head pastor')));assert.equal(w.units.length,6);});
test('Cimri support cannot bypass the normal last-enemy victory path',async()=>{const w=world(),enemy={id:'church_acolyte',name:'Acolyte',hp:2};w.battle={kind:'church_entry'};w.livingEnemy=()=>enemy;w.animateAction=async(a,t,k,h,impact)=>impact();w.flash=()=>{};await w.ChurchArc.support();assert.equal(enemy.hp,1);await w.ChurchArc.support();assert.equal(enemy.hp,1);});

test('Allamar’s positive energy heals only on the telegraphed even-round pattern',async()=>{const w=world(),enemy={id:'allamar',hp:63,max:65};w.battle={kind:'church_allamar',round:2};w.animateAction=async(a,t,k,h,impact)=>impact();w.flash=()=>{};await w.ChurchArc.enemyPreparation(enemy);assert.equal(enemy.hp,65);enemy.hp=40;w.battle.round=3;await w.ChurchArc.enemyPreparation(enemy);assert.equal(enemy.hp,40);});

test('armory saves reject missing prerequisites and preserve previous chapter saves',()=>{const w=world(),final=checkpoint(w,w.replaySections().at(-1));assert(w.SaveFiles.validate(final).quest.cimriRecovered);for(const flag of ['chapter7Complete','chapter8','smearHeard','accuserSilenced','bodyDisposed','heistTip','ambushPrepared','armoryCleared','jailReached','porchCleared']){const bad=structuredClone(final);bad.quest[flag]=false;assert.throws(()=>w.SaveFiles.validate(bad));}const old=checkpoint(w,w.replaySections()[31]);assert.equal(w.SaveFiles.validate(old).scene,'church_asmodeus');const bad=structuredClone(old);bad.scene='burning_jail';assert.throws(()=>w.SaveFiles.validate(bad));});

test('fort saves reject skipped scouting, forged victories and premature map access',()=>{const w=world(),final=checkpoint(w,w.replaySections().at(-1));for(const flag of ['chapter8Complete','chapter9','fortScouted','scoutRetreated','fortPrepared','archerAmbushed','manticoreDefeated','fortSearched','forestMarked']){const bad=structuredClone(final);bad.quest[flag]=false;assert.throws(()=>w.SaveFiles.validate(bad));}const earlier=checkpoint(w,w.replaySections()[40]);assert.equal(w.SaveFiles.validate(earlier).scene,'heist_aftermath');earlier.scene='fort_assault';assert.throws(()=>w.SaveFiles.validate(earlier));});

test('Court save imports reject skipped battles, forged escape and premature locations',()=>{const w=world(),final=checkpoint(w,w.replaySections().at(-1));for(const flag of ['chapter9Complete','chapter10','courtBriefed','lowerCleared','rhonaDefeated','upperReached','lenciaDefeated','lenciaEscaped','courtSecured']){const bad=structuredClone(final);bad.quest[flag]=false;assert.throws(()=>w.SaveFiles.validate(bad));}const old=checkpoint(w,w.replaySections()[50]);assert.equal(w.SaveFiles.validate(old).scene,'fort_patrol');old.scene='court_upper';assert.throws(()=>w.SaveFiles.validate(old));});

test('Kantaria portable saves reject skipped rescue prerequisites and premature locations',()=>{const w=world(),list=w.replaySections();const s=list.find(s=>s.id==='zara-release');const c=checkpoint(w,s);assert.equal(w.SaveFiles.validate(c).quest.zaraGearRecovered,true);delete c.quest.zaraGearRecovered;c.quest.zaraFreed=true;assert.throws(()=>w.SaveFiles.validate(c),/Kantaria opening/);const early=checkpoint(w,list.find(s=>s.id==='court-furlough'));early.scene='hardship_hall';assert.throws(()=>w.SaveFiles.validate(early),/Chapter Eleven/);});

test('dock operation saves retain partial fires and reject skipped escape or premature towers',()=>{const w=world(),list=w.replaySections(),before=checkpoint(w,list.find(s=>s.id==='dock-fires'));before.quest.dockOfficeBurned=true;const back=w.SaveFiles.decode(w.SaveFiles.encode(before));assert(back.quest.dockOfficeBurned);assert.equal(back.quest.docksBurned,undefined);const incomplete=structuredClone(before);incomplete.quest.docksBurned=true;assert.throws(()=>w.SaveFiles.validate(incomplete),/Incomplete dock fires/);const early=structuredClone(before);early.scene='kantaria_west_tower';assert.throws(()=>w.SaveFiles.validate(early),/Premature Chapter Twelve/);const skipped=checkpoint(w,list.find(s=>s.id==='north-assault'));skipped.quest.jonasEscaped=false;assert.throws(()=>w.SaveFiles.validate(skipped),/disruption sequence/);});

test('covert saves reject skipped operations, retain pre-fight fire and preserve previous chapter progress',()=>{const w=world(),list=w.replaySections(),final=checkpoint(w,list.find(s=>s.id==='covert-end'));final.quest.chapter13Complete=true;assert.equal(w.SaveFiles.decode(w.SaveFiles.encode(final)).quest.corrineAssigned,true);for(const flag of ['chapter12Complete','chapter13','covertBriefed','marketSurveyed','marketRiot','patrolAmbushed','falseBlame','guildEntered','guildRecordsTampered','manorObserved','manorArtifactsTaken','uskwoodReturned','uskwoodBurned','escapeOpened','cavesReached','caveRested','corrineAssigned']){const bad=structuredClone(final);bad.quest[flag]=false;assert.throws(()=>w.SaveFiles.validate(bad),/covert sequence/);}const before=checkpoint(w,list.find(s=>s.id==='uskwood-fire'));before.hp.jamal=4;before.potions=0;const saved=w.SaveFiles.decode(w.SaveFiles.encode(before));assert(saved.quest.uskwoodBurned);assert(!saved.quest.escapeOpened);assert.equal(saved.hp.jamal,4);assert.equal(saved.potions,0);assert.equal(saved.progression.levels.jamal,2);const early=checkpoint(w,list.find(s=>s.id==='covert-plan'));early.scene='fungus_shelter';assert.throws(()=>w.SaveFiles.validate(early),/Premature Chapter Thirteen/);const old=checkpoint(w,list.find(s=>s.id==='covert-start'));assert(w.SaveFiles.validate(old).quest.chapter12Complete);assert(!w.SaveFiles.validate(old).quest.chapter13);});
test('entry, hallway and sanctuary are distinct and renovation retains ruins until dedication',async()=>{const w=world();w.quest={chapter6Complete:true,chapter7:true,altarBroken:true};w.art.churchBroken={id:'ruins'};w.scene='church_asmodeus';assert.equal(w.ChurchArc.mapImage(),w.art.churchBroken);assert.notEqual(w.scenes.church_entry.image,w.scenes.church_hall.image);assert.notEqual(w.scenes.church_hall.image,w.scenes.church_sanctuary.image);w.say=async(name,text)=>{if(name==='jason'){assert.equal(w.ChurchArc.mapImage(),w.art.churchBroken);assert(!w.quest.churchConverted);}};await w.ChurchArc.interact('dedicateChurch');assert(w.quest.churchConverted);assert.notEqual(w.ChurchArc.mapImage(),w.art.churchBroken);});

test('imports cannot jump into later rooms while earlier chapter encounters are unfinished',()=>{const w=world(),list=w.replaySections();for(const[from,to]of [['church-breach','church_sanctuary'],['accuser','burning_jail'],['fort-scout','fort_assault'],['court-approach','court_upper'],['uskwood-briefing','hardship_hall']]){const c=checkpoint(w,list.find(s=>s.id===from));c.scene=to;c.position={x:328,y:312};assert.throws(()=>w.SaveFiles.validate(c),/Premature campaign location/);}});

test('Stranglehold saves reject skipped operations and premature locations without changing older saves',()=>{const w=world(),list=w.replaySections(),end=checkpoint(w,list.find(s=>s.id==='supply-end'));end.quest.chapter14Complete=true;assert(w.SaveFiles.decode(w.SaveFiles.encode(end)).quest.chapter14Complete);for(const flag of ['chapter13Complete','chapter14','supplyBriefed','mineObserved','mineDefendersCleared','minesSecured','cultLocated','cultDefeated','cultDestroyed','tradeObserved','merchantStruck','captainStruck','fortObserved','fortIsolated','perimeterCleared','supplyReported']){const c=structuredClone(end);c.quest[flag]=false;assert.throws(()=>w.SaveFiles.validate(c),/Stranglehold sequence/);}const early=checkpoint(w,list.find(s=>s.id==='supply-plan'));early.scene='supply_report';assert.throws(()=>w.SaveFiles.validate(early),/Premature Chapter Fourteen/);const old=checkpoint(w,list.find(s=>s.id==='covert-end'));assert.equal(w.SaveFiles.validate(old).quest.chapter14,undefined);const before=checkpoint(w,list.find(s=>s.id==='cult-battle'));before.hp.jamal=7;before.potions=0;assert.equal(w.SaveFiles.decode(w.SaveFiles.encode(before)).hp.jamal,7);});

test('Egorian arrival hands over Oppian before supplies and keeps the refill one-time', async()=>{
 const w=world(),start=w.replaySections().find(s=>s.id==='egorian-approach');
 w.scenes.south_road_camp.points=[];
 w.QUESTGIVER_MODELS={};
 vm.runInContext(read('egorian-arrival.js'),w);
 w.EgorianArrival.install();
 w.scene=start.scene;
 w.quest=structuredClone(start.quest);
 w.potions=0;
 assert.equal(await w.EgorianArrival.interact('egorianSupply'),false);
 for(const id of ['egorianApproach','egorianSalute','egorianCross','egorianHandover','egorianEnterTemple','egorianSupply']){
  assert.equal(await w.EgorianArrival.interact(id),true,id);
 }
 assert.equal(w.potions,2);
 w.potions=1;
 assert.equal(await w.EgorianArrival.interact('egorianSupply'),false);
 for(const id of ['egorianLeaveTemple','egorianThorntown','egorianWelcome','egorianRooms']){
  assert.equal(await w.EgorianArrival.interact(id),true,id);
 }
 assert.equal(w.potions,1);
 assert.equal(w.scene,'egorian_manor');
 assert.equal(w.quest.egorianArrivalComplete,true);
 assert.equal(w.EgorianArrival.target(),null);
 const finished={...checkpoint(w,{scene:w.scene,quest:w.quest,position:[552,144]}),potions:w.potions};
 assert.equal(w.SaveFiles.decode(w.SaveFiles.encode(finished)).quest.oppianDelivered,true);
 finished.quest.oppianDelivered=false;
 assert.throws(()=>w.SaveFiles.validate(finished),/Egorian arrival sequence/);
});

test('Egorian night saves preserve the two-person investigation and the pending contract',async()=>{
 const w=world(),start=w.replaySections().find(s=>s.id==='egorian-night-out');
 w.scenes.egorian_manor.points=[];
 w.DIALOGUE_FACE_CROPS={};
 w.journeyCard=async(name,text,commit)=>{w.transcript.push({name,text});commit?.();};
 w.setScene=id=>w.scene=id;
 vm.runInContext(read('egorian-night.js'),w);
 w.EgorianNight.install();
 w.scene=start.scene;
 w.quest=structuredClone(start.quest);
 w.potions=1;
 const step=async id=>assert.equal(await w.EgorianNight.interact(id),true,id);
 assert.equal(w.EgorianNight.roster(),null);
 await step('nightLeave');
 assert.deepEqual(Array.from(w.EgorianNight.roster()),['jamal','guapo']);
 assert.equal(await w.EgorianNight.interact('nightFollowLead'),false);
 await step('nightSvetlana');
 await step('nightFollowLead');
 assert.equal(await w.EgorianNight.interact('nightContract'),false);
 await step('nightInspect');
 await step('nightContract');
 assert.equal(w.quest.egorianContractAccepted,true);
 assert(w.Progression.history(w.quest,w.Progression.migrate(w.quest)).some(row=>row.includes('5,000 gp and the guard')));
 assert(w.transcript.some(row=>row.name==='jaquen'&&row.text.includes('Two days')));
 await step('nightReturn');
 assert.equal(w.potions,1);
 assert.equal(w.scene,'egorian_manor');
 assert.equal(w.EgorianNight.roster(),null);
 assert.equal(w.quest.egorianNightReturned,true);
 assert.equal(await w.EgorianNight.interact('nightLeave'),false);
 const finished=checkpoint(w,{scene:w.scene,quest:w.quest,position:[328,312]});
 assert.equal(w.SaveFiles.decode(w.SaveFiles.encode(finished)).quest.egorianContractAccepted,true);
 const skipped=structuredClone(finished);
 skipped.quest.egorianGuardLeadChecked=false;
 assert.throws(()=>w.SaveFiles.validate(skipped),/Invalid Egorian night sequence/);
 finished.scene='egorian_guard_lane';
 assert.throws(()=>w.SaveFiles.validate(finished),/Egorian night progress/);
});


test('Egorian trial awards Freya’s plate after both witnesses and persists the fitted gear',async()=>{
 const w=world(),start=w.replaySections().find(s=>s.id==='egorian-summons');
 w.scenes.egorian_manor.points=[];
 w.DIALOGUE_FACE_CROPS={};
 w.journeyCard=async(name,text,commit)=>{w.transcript.push({name,text});commit?.();};
 w.setScene=id=>w.scene=id;
 let recalculations=0;
 w.applyProgression=()=>recalculations++;
 vm.runInContext(read('egorian-trial.js'),w);
 w.EgorianTrial.install();
 w.scene=start.scene;
 w.quest=structuredClone(start.quest);
 w.potions=1;
 const step=async id=>assert.equal(await w.EgorianTrial.interact(id),true,id);
 const gear=()=>w.Inventory.items(w.quest,w.potions).map(item=>item.id);
 assert(gear().includes('egorian_commission'));
 assert(!gear().includes('zara_geitta'));
 await step('trialSummons');
 assert.deepEqual(Array.from(w.EgorianTrial.roster()),['freya','jason']);
 assert.equal(await w.EgorianTrial.interact('trialVerdict'),false);
 for(const id of ['trialMeetZara','trialFreya','trialJason','trialVerdict','trialRide'])await step(id);
 assert.deepEqual(Array.from(w.EgorianTrial.roster()),['freya']);
 assert.equal(await w.EgorianTrial.interact('trialPlate'),false);
 await step('trialSmith');
 await step('trialPlate');
 assert.equal(recalculations,1);
 assert(gear().includes('zara_geitta'));
 assert(!gear().includes('egorian_commission'));
 const base={ac:17,atk:7,dmg:[1,8,4]},inventory=w.Inventory.fresh(w.quest);
 const stats=w.Inventory.stats(base,inventory,'freya',w.quest);
 assert.equal(stats.ac,19);
 assert.equal(stats.physicalDR,3);
 assert.equal(w.Inventory.stats(base,inventory,'jason',w.quest).physicalDR,undefined);
 assert.equal(await w.EgorianTrial.interact('trialPlate'),false);
 await step('trialReturn');
 assert.equal(w.scene,'egorian_manor');
 assert.equal(w.potions,1);
 const finished=checkpoint(w,{scene:w.scene,quest:w.quest,position:[328,312]});
 const restored=w.SaveFiles.decode(w.SaveFiles.encode(finished));
 assert.equal(restored.quest.zaraGeitta,true);
 assert.equal(restored.quest.egorianPlateReturned,true);
 finished.quest.egorianVerdict=false;
 assert.throws(()=>w.SaveFiles.validate(finished),/Invalid Egorian trial sequence/);
});

test('Draymus’s Lower Lane outing gates the disguise behind the two spells and chair purchase',async()=>{
 const w=world(),start=w.replaySections().find(s=>s.id==='egorian-draymus-out');
 w.scenes.egorian_manor.points=[];
 w.DIALOGUE_FACE_CROPS={};
 w.journeyCard=async(name,text,commit)=>{w.transcript.push({name,text});commit?.();};
 w.setScene=id=>w.scene=id;
 w.reduce={matches:false};
 w.epoch=1;
 w.CANCEL=Symbol('cancel');
 w.delay=async()=>{};
 w.GameAudio={effect:()=>{}};
 const rolls=[];
 w.storyRoll=async(...args)=>rolls.push(args);
 vm.runInContext(read('egorian-mort.js'),w);
 w.EgorianMort.install();
 w.scene=start.scene;
 w.quest=structuredClone(start.quest);
 w.potions=1;
 const step=async id=>assert.equal(await w.EgorianMort.interact(id),true,id);
 await step('mortLeave');
 assert.deepEqual(Array.from(w.EgorianMort.roster()),['draymus']);
 assert.equal(await w.EgorianMort.interact('mortPuppet'),false);
 await step('mortAmbush');
 assert.deepEqual(rolls.map(row=>row[1]),[18,3]);
 assert.equal(w.EgorianMort.npcs()[0].hp,0);
 assert.equal(await w.EgorianMort.interact('mortChair'),false);
 await step('mortPuppet');
 assert(w.EgorianMort.npcs().some(actor=>actor.id==='joe_kek'));
 await step('mortChair');
 assert(w.Inventory.items(w.quest,w.potions).some(item=>item.id==='antique_wheelchair'));
 await step('mortDisguise');
 assert.equal(w.EgorianMort.npcs().length,0);
 await step('mortDawn');
 assert.equal(w.scene,'egorian_manor');
 assert.equal(w.EgorianMort.roster(),null);
 assert.equal(w.potions,1);
 assert.equal(await w.EgorianMort.interact('mortLeave'),false);
 const finished=checkpoint(w,{scene:w.scene,quest:w.quest,position:[328,312]});
 const restored=w.SaveFiles.decode(w.SaveFiles.encode(finished));
 assert.equal(restored.quest.egorianDraymusReturned,true);
 assert.equal(restored.quest.egorianDisguiseReady,true);
 finished.quest.egorianJoeRaised=false;
 assert.throws(()=>w.SaveFiles.validate(finished),/Invalid Draymus outing sequence/);
});

test('Egorian excruciation stages J’Mal’s injury, Freya’s duel, the rescue and the resumed ceremony',async()=>{
 const w=world(),start=w.replaySections().find(s=>s.id==='egorian-excruciation-start');
 w.scenes.egorian_manor.points=[];
 w.COMBAT_IDLES={};
 w.reduce={matches:false};
 w.epoch=1;
 w.CANCEL=Symbol('cancel');
 w.delay=async()=>{};
 w.GameAudio={effect:()=>{}};
 w.damage=async()=>11;
 w.STATS.jamal={hp:35};
 w.journeyCard=async(name,text,commit)=>{w.transcript.push({name,text});commit?.();};
 w.seedParty=(x,y,dir)=>{w.units=[{id:'freya',x,y,dir}];};
 w.NextChapter.syncRoster=()=>{};
 const rolls=[];
 w.storyRoll=async(...args)=>rolls.push(args);
 vm.runInContext(read('egorian-excruciation.js'),w);
 w.EgorianExecution.install();
 w.scene=start.scene;
 w.quest=structuredClone(start.quest);
 w.units=[{id:'freya',x:328,y:344,dir:'up'}];
 const step=async id=>assert.equal(await w.EgorianExecution.interact(id),true,id);
 assert.equal(w.EgorianExecution.roster(),null);
 await step('excruciationLeave');
 await step('excruciationCharges');
 assert.deepEqual(Array.from(w.EgorianExecution.roster()),['freya']);
 assert.equal(await w.EgorianExecution.interact('excruciationNoble'),false);
 await step('excruciationFollow');
 await step('excruciationNoble');
 assert.equal(w.hp.jamal,0);
 assert.deepEqual(rolls.map(r=>r[1]),[19,17,18,19]);
 await step('excruciationFight');
 assert.equal(w.battles[0].kind,'egorian_bodyguards');
 assert.equal(w.battles[0].enemies.length,2);
 assert.equal(await w.EgorianExecution.interact('excruciationHold'),false);
 await w.EgorianExecution.afterBattle([448,232,'right']);
 await step('excruciationHold');
 await step('excruciationHeal');
 assert.equal(w.hp.jamal,11);
 assert.equal(w.quest.mosswaterSpent,1);
 assert(!w.EgorianExecution.npcs().some(actor=>actor.id==='jamal'));
 assert.equal(await w.EgorianExecution.interact('excruciationResume'),false);
 await step('excruciationInquiry');
 assert(w.transcript.some(row=>row.name==='Dottari Guard'&&row.text.includes('Duke Fellatio')));
 await step('excruciationResume');
 const finished=checkpoint(w,{scene:w.scene,quest:w.quest,position:[328,216]});
 const restored=w.SaveFiles.decode(w.SaveFiles.encode(finished));
 assert.equal(restored.quest.egorianExcruciated,true);
 assert.equal(restored.quest.mosswaterSpent,1);
 finished.quest.egorianDuelWon=false;
 assert.throws(()=>w.SaveFiles.validate(finished),/Invalid Egorian excruciation sequence/);
});

test('Senara arrival preserves the inquiry ruling, the mission list, and J’Mal’s absence',async()=>{
 const w=world(),start=w.replaySections().find(s=>s.id==='egorian-inquiry');
 w.scenes.egorian_excruciation.points=[];
 w.MAP_LAYERS.egorian_court={foreground:'egorian-court-v1.png'};
 vm.runInContext(read('senara-arrival.js'),w);
 w.SenaraArrival.install();
 w.scene=start.scene;
 w.quest=structuredClone(start.quest);
 w.hp.jamal=11;
 w.potions=1;
 const step=async id=>assert.equal(await w.SenaraArrival.interact(id),true,id);
 await step('senaraInquiry');
 assert.equal(await w.SenaraArrival.interact('senaraBriefing'),false);
 await step('senaraRuling');
 assert(w.transcript.some(row=>row.name==='egorian_magistrate'&&row.text.includes('denies')));
 await step('senaraBriefing');
 assert(w.Inventory.items(w.quest,w.potions).some(item=>item.id==='senara_ritual_list'));
 await step('senaraRoad');
 assert.deepEqual(Array.from(w.SenaraArrival.roster()),['freya','jason','draymus','guapo','reese']);
 assert.equal(await w.SenaraArrival.interact('senaraVilla'),false);
 await step('senaraPatrols');
 await step('senaraVilla');
 await step('senaraCoffer');
 assert.equal(w.hp.jamal,11);
 assert.equal(w.potions,1);
 const finished=checkpoint(w,{scene:w.scene,quest:w.quest,position:[536,216]});
 const restored=w.SaveFiles.decode(w.SaveFiles.encode(finished));
 assert.equal(restored.quest.egorianChargesDropped,true);
 assert.equal(restored.quest.senaraTalismanMissing,true);
 finished.quest.senaraGarrisonSeen=false;
 assert.throws(()=>w.SaveFiles.validate(finished),/Invalid Senara arrival sequence/);
});

test('Senara reconnaissance allows both entrances and preserves the sewer lead',async()=>{
 const w=world(),start=w.replaySections().find(s=>s.id==='senara-party');
 w.scenes.senara_fex_villa.points=[];
 w.MAP_LAYERS.senara_fex_villa={foreground:'senara-fex-villa-v1.png'};
 w.DIALOGUE_FACE_CROPS={};
 const journeys=[],rolls=[];
 w.travel=async (id,x,y,dir)=>{journeys.push({id,x,y,dir});w.scene=id;};
 w.setScene=id=>w.scene=id;
 w.storyRoll=async(...args)=>rolls.push(args);
 w.journeyCard=async(name,text,commit)=>{w.transcript.push({name,text});commit?.();};
 w.say=async(name,text,choices)=>{w.transcript.push({name,text});return choices?1:undefined;};
 vm.runInContext(read('senara-cover.js'),w);
 w.SenaraCover.install();
 w.scene=start.scene;
 w.quest=structuredClone(start.quest);
 w.potions=1;
 const step=async id=>assert.equal(await w.SenaraCover.interact(id),true,id);
 await step('senaraHost');
 assert.deepEqual(Array.from(w.SenaraCover.roster()),['guapo']);
 assert.equal(await w.SenaraCover.interact('senaraSlipOut'),false);
 await step('senaraToast');
 await step('senaraSlipOut');
 assert.deepEqual(Array.from(w.SenaraCover.roster()),['draymus','jason']);
 const yard={scene:w.scene,quest:structuredClone(w.quest)};
 assert.deepEqual(Array.from(w.SenaraCover.points(),p=>p.id),['orphanFront','orphanSide']);
 await step('orphanFront');
 assert.equal(journeys.at(-1).x,328);
 assert.equal(rolls.at(-1)[1],14);
 w.scene=yard.scene;
 w.quest=yard.quest;
 await step('orphanSide');
 assert.equal(journeys.at(-1).x,568);
 assert.equal(rolls.at(-1)[1],16);
 assert.equal(await w.SenaraCover.interact('orphanWithdraw'),false);
 await step('orphanSearch');
 assert.equal(w.SenaraCover.npcs().length,3);
 await step('orphanWitnesses');
 assert.equal(w.SenaraCover.npcs().length,0);
 await step('orphanWithdraw');
 assert.equal(w.scene,'senara_fex_villa');
 assert.equal(w.SenaraCover.roster(),null);
 assert.equal(w.potions,1);
 const finished=checkpoint(w,{scene:w.scene,quest:w.quest,position:[328,312]});
 assert.equal(w.SaveFiles.decode(w.SaveFiles.encode(finished)).quest.senaraOrphanageComplete,true);
 finished.quest.senaraWitnessesSeen=false;
 assert.throws(()=>w.SaveFiles.validate(finished),/Invalid Senara reconnaissance sequence/);
});

test('Black Daggers route preserves the recorded spell order, surrender and talisman through portable saves',async()=>{
 const w=world();
 const section=w.replaySections().find(s=>s.id==='senara-sewer-lead');
 Object.assign(w,{scene:section.scene,quest:structuredClone(section.quest),DIALOGUE_FACE_CROPS:{},
  reduce:{matches:true},canvas:{focus(){}},$:()=>({}),delay:async()=>{},
  setScene:(id)=>{w.scene=id;},journeyCard:async(_title,_summary,commit)=>commit(),
  run:async fn=>fn(),livingEnemy:()=>w.battle.enemies[0]});
 w.scenes[section.scene].points=[];
 vm.runInContext(read('senara-daggers.js'),w);
 w.SenaraDaggers.install();
 const step=async id=>assert.equal(await w.SenaraDaggers.interact(id),true,id);
 await step('senaraSewers');
 assert.deepEqual(Array.from(w.SenaraDaggers.roster()),['draymus']);
 assert.equal(await w.SenaraDaggers.interact('sewerGuild'),false);
 await step('sewerRendezvous');
 assert.deepEqual(Array.from(w.SenaraDaggers.roster()),['draymus','jamal']);
 await step('sewerGuild');
 assert.equal(await w.SenaraDaggers.interact('daggersStrike'),false);
 await step('daggersScout');
 await step('daggersStrike');
 assert.equal(w.battle.scripted,true);
 const events=[];
 w.animateAction=async()=>events.push(w.SenaraDaggers.command().name);
 w.storyRoll=async(label,face)=>events.push(label+' '+face);
 w.log=msg=>events.push(msg.split('\n')[1]);
 await w.SenaraDaggers.castSpell('attack',{id:'draymus'});
 assert.deepEqual(events,[]);
 await w.SenaraDaggers.castSpell('special',{id:'draymus'});
 assert.equal(w.quest.senaraGuildSurrendered,undefined);
 assert.equal(w.SenaraDaggers.command().name,'Black Tentacles');
 await w.SenaraDaggers.castSpell('special',{id:'draymus'});
 assert.deepEqual(events,['Glitterdust','Golden dust blinds the guild.','Draymus · Initiative 17','Black Tentacles','The guild drops its weapons.']);
 assert.equal(w.battle,null);
 assert.equal(w.quest.senaraGuildSurrendered,true);
 assert.equal(w.SenaraDaggers.target().id,'daggersTerms');
 await step('daggersTerms');
 assert.equal(w.scene,section.scene);
 assert.equal(w.SenaraDaggers.points().length,0);
 const finished=checkpoint(w,{...section,quest:w.quest});
 const restored=w.SaveFiles.decode(w.SaveFiles.encode(finished));
 assert.equal(restored.quest.senaraTalismanRecovered,true);
 const forged=structuredClone(finished);forged.quest.senaraGuildSurrendered=false;
 assert.throws(()=>w.SaveFiles.validate(forged),/Invalid Black Daggers sequence/);
});

test('citadel spell study and patrol reports precede the carriage trip and survive portable saves',async()=>{
 const w=world(),sections=w.replaySections();
 const start=sections.find(s=>s.id==='senara-citadel-visit');
 const road=sections.find(s=>s.id==='whisperwood-road');
 Object.assign(w,{scene:start.scene,quest:structuredClone(start.quest),DIALOGUE_FACE_CROPS:{}});
 w.scenes[start.scene].points=[];
 vm.runInContext(read('senara-citadel.js'),w);
 w.SenaraCitadel.install();
 const step=async id=>assert.equal(await w.SenaraCitadel.interact(id),true,id);
 assert.equal(await w.SenaraCitadel.interact('citadelDepart'),false);
 await step('senaraCitadel');
 assert.equal(w.SenaraCitadel.target().id,'citadelRespect');
 assert.equal(await w.SenaraCitadel.interact('citadelStudy'),false);
 await step('citadelRespect');
 const say=w.say;
 w.say=async(name,text,options)=>{
  await say(name,text);
  return options?0:undefined;
 };
 await step('citadelStudy');
 assert(w.transcript.some(line=>line.text.includes('Now that I’ve written it out')));
 w.quest.senaraDraymusTrained=false;
 w.say=async(name,text,options)=>{
  await say(name,text);
  return options?1:undefined;
 };
 await step('citadelStudy');
 assert(w.transcript.some(line=>line.text.includes('The casting holds')));
 assert.equal(w.quest.senaraDraymusTrained,true);
 assert.equal(await w.SenaraCitadel.interact('citadelDepart'),false);
 await step('citadelTrail');
 await step('citadelDepart');
 assert.equal(w.scene,road.scene);
 assert.equal(w.SenaraCitadel.npcs()[0].id,'bob');
 await step('whisperwoodBob');
 assert.equal(w.SenaraCitadel.target(),null);
 assert.equal(w.SenaraCitadel.goal(),'Ready to enter the Whisperwood.');
 assert.equal(await w.SenaraCitadel.interact('whisperwoodBob'),false);
 const saved=checkpoint(w,{...road,quest:w.quest});
 const back=w.SaveFiles.decode(w.SaveFiles.encode(saved));
 assert.equal(back.quest.senaraWhisperwoodReady,true);
 assert.equal(back.progression.levels.draymus,w.Progression.migrate(start.quest).levels.draymus);
 for(const flag of ['senaraTalismanRecovered','senaraDraymusTrained','senaraForestIntel','senaraCarriageDeparted']){
  const forged=structuredClone(saved);forged.quest[flag]=false;
  assert.throws(()=>w.SaveFiles.validate(forged),/Invalid Hellknight citadel sequence/);
 }
 const stale=structuredClone(saved);stale.scene='senara_hellknight_citadel';
 assert.throws(()=>w.SaveFiles.validate(stale),/Progress does not match the Hellknight citadel/);
});

test('Whisperwood watch, battles, and Bob’s rescue keep their checkpoints in story order',async()=>{
 const w=world(),list=w.replaySections(),start=list.find(s=>s.id==='whisperwood-camp-road');
 Object.assign(w,{scene:start.scene,quest:structuredClone(start.quest),units:[{x:328,y:280,dir:'up'}],
  SouthRoad:{recover:fraction=>w.rest=fraction},storyRoll:async(label,face)=>w.rolls.push([label,face]),rolls:[]});
 w.scenes[start.scene].points=[];
 vm.runInContext(read('whisperwood-camp.js'),w);
 w.WhisperwoodCamp.install();
 const step=async id=>assert.equal(await w.WhisperwoodCamp.interact(id),true,id);
 const victory=async(kind,ids)=>{
  assert.equal(w.battle.kind,kind);
  assert.deepEqual(Array.from(w.battle.enemies,e=>e.id),ids);
  const position=w.battle.returnPosition;
  w.battle=null;
  await w.WhisperwoodCamp.afterBattle(kind,position);
 };
 await step('whisperwoodMakeCamp');
 await step('whisperwoodWatch');
 assert.equal(w.rest,.5);
 assert.equal(await w.WhisperwoodCamp.interact('whisperwoodBear'),false);
 await step('whisperwoodWebs');
 await victory('whisperwood_webs',['whisper_spider','whisper_spider','whisper_ettercap']);
 await step('whisperwoodGiant');
 await victory('whisperwood_giant',['whisper_giant']);
 await step('whisperwoodBear');
 assert.equal(w.WhisperwoodCamp.npcs().find(u=>u.id==='bob').pose,'prone');
 const retry=checkpoint(w,{scene:w.scene,position:[328,280],quest:w.quest});
 assert.equal(w.SaveFiles.decode(w.SaveFiles.encode(retry)).quest.whisperwoodBobMauled,true);
 await step('whisperwoodBear');
 assert.deepEqual(w.rolls,[['Bob · Evade the bear',3]]);
 await victory('whisperwood_bear',['whisper_bear']);
 assert.equal(await w.WhisperwoodCamp.interact('whisperwoodDawn'),false);
 await step('whisperwoodRescue');
 await step('whisperwoodDawn');
 assert.deepEqual(w.rolls,[['Bob · Evade the bear',3],['J’Mal and El Guapo · Pull Bob clear',18]]);
 const complete=checkpoint(w,{scene:w.scene,position:[328,280],quest:w.quest});
 assert.equal(w.SaveFiles.decode(w.SaveFiles.encode(complete)).quest.whisperwoodNightComplete,true);
 const forged=structuredClone(complete);forged.quest.whisperwoodBobRescued=false;
 assert.throws(()=>w.SaveFiles.validate(forged),/Invalid Whisperwood camp sequence/);
});

test('the Unicorn Glade preserves the first three horns and awards the fourth only after the playable retreat',async()=>{
 const w=world(),list=w.replaySections(),start=list.find(s=>s.id==='whisperwood-glade-trail');
 Object.assign(w,{scene:start.scene,quest:structuredClone(start.quest),units:[{x:328,y:224,dir:'up'}],
  SouthRoad:{recover:()=>{}},reduce:{matches:true},$:()=>({}),canvas:{focus(){}},delay:async()=>{},
  animateAction:async(_actor,_target,_type,_hit,impact)=>impact?.(),
  setScene:id=>{w.scene=id;},journeyCard:async(_title,_summary,commit)=>commit(),run:fn=>fn(),
  storyRoll:async(label,face)=>w.rolls.push([label,face]),rolls:[]});
 w.scenes[start.scene].points=[];
 w.STATS.whisper_giant={hp:38};
 vm.runInContext(read('whisperwood-glade.js'),w);
 w.WhisperwoodGlade.install();
 const step=async id=>assert.equal(await w.WhisperwoodGlade.interact(id),true,id);
 const horns=()=>w.Inventory.items(w.quest,2).find(i=>i.id==='whisperwood_unicorn_horns')?.name;
 await step('gladeTrail');
 await step('gladeAssault');
 assert.equal(w.battle.kind,'whisperwood_unicorn_assault');
 assert.deepEqual(Array.from(w.battle.enemies,e=>e.id),Array(3).fill('whisper_unicorn'));
 assert.equal(await w.WhisperwoodGlade.interact('gladeCollect'),false);
 const position=w.battle.returnPosition;
 w.battle=null;
 await w.WhisperwoodGlade.afterBattle(position);
 await step('gladeCollect');
 assert.equal(horns(),'Unicorn horns [3/4]');
 await step('gladeCamp');
 await step('gladeCounterattack');
 const battle=w.battle,script=battle.script;
 assert.deepEqual(Array.from(battle.enemies,e=>e.id),['whisper_unicorn','whisper_stone_giant','whisper_unicorn','whisper_owlbear','whisper_swan']);
 assert.equal(battle.scriptActor,'freya');
 assert.equal(script.command().name,'Hold the line');
 await script.act('special',{id:'freya'});
 assert.equal(battle.enemies[2].hp,0);
 assert.equal(battle.scriptActor,'jamal');
 assert.equal(script.command().name,'Take the horn');
 await script.act('special',{id:'jamal'});
 assert.equal(horns(),'Unicorn horns [3/4]');
 assert.deepEqual(w.rolls,[['J’Mal · Reach the fallen unicorn',17]]);
 assert.equal(script.command().name,'Leave the glade');
 await script.act('special',{id:'jamal'});
 assert.equal(w.scene,start.scene);
 assert.equal(horns(),'Unicorn horns [4/4]');
 const save=checkpoint(w,{...start,quest:w.quest});
 assert.equal(w.SaveFiles.decode(w.SaveFiles.encode(save)).quest.whisperwoodGladeComplete,true);
 const forged=structuredClone(save);forged.quest.whisperwoodThreeHorns=false;
 assert.throws(()=>w.SaveFiles.validate(forged),/Invalid unicorn glade sequence/);
});

test('the Senara prison wagon sends the archon away before initiative and saves Orn’s recruitment',async()=>{
 const w=world(),sections=w.replaySections(),start=sections.find(s=>s.id==='senara-wagon-depart');
 Object.assign(w,{scene:start.scene,quest:structuredClone(start.quest),units:[{x:328,y:224,dir:'up'}],
  DIALOGUE_FACE_CROPS:{},animateAction:async(actor,target,type)=>w.events.push([actor.id,target.id,type]),
  storyRoll:async(label,face,_mod,outcome)=>w.events.push([label,face,outcome]),
  planEnemyRound:()=>w.events.push('plan'),
  beginInitiative:()=>w.events.push(['initiative',w.battle.enemies.length]),events:[]});
 w.scenes[start.scene].points=[];
 w.scenes.senara_waterfront={points:[],walk:[{x:0,y:0,w:640,h:400}],blocks:[]};
 w.STATS.fastness_paladin={hp:26};
 vm.runInContext(read('senara-wagon.js'),w);
 w.SenaraWagon.install();
 const step=async id=>assert.equal(await w.SenaraWagon.interact(id),true,id);
 await step('senaraWagonRoad');
 assert.equal(await w.SenaraWagon.interact('senaraWagonFree'),false);
 await step('senaraWagonStop');
 await step('senaraWagonFight');
 assert.equal(w.battle.scriptActor,'jason');
 assert.equal(w.battle.script.command().name,'Dismissal');
 await w.battle.script.act('special',{id:'jason'});
 assert.deepEqual(w.events,[['jason','senara_hound_archon','dismissal'],['Dismissal · Destination',5,'Spell misfires · Abaddon'],'plan',['initiative',3]]);
 assert(w.battle.enemies.every(e=>e.id==='fastness_paladin'));
 assert.equal(w.battle.scripted,false);
 assert.equal(w.quest.senaraEscortDefeated,undefined);
 const position=w.battle.returnPosition;
 w.battle=null;
 await w.SenaraWagon.afterBattle(position);
 await step('senaraWagonFree');
 assert.equal(w.SenaraWagon.npcs()[0].id,'orn');
 assert.equal(await w.SenaraWagon.interact('senaraWagonQuay'),false);
 await step('senaraOrnRecruit');
 await step('senaraWagonQuay');
 await step('senaraMorePatrols');
 const arrival=sections.find(s=>s.id==='senara-return-patrols');
 const saved=checkpoint(w,{...arrival,quest:w.quest});
 const restored=w.SaveFiles.decode(w.SaveFiles.encode(saved));
 assert.equal(restored.quest.senaraOrnRecruited,true);
 assert.equal(restored.quest.senaraReturnPatrolsSeen,true);
 assert.equal(restored.quest.whisperwoodFourthHorn,true);
 const forged=structuredClone(saved);forged.quest.senaraPrisonerFreed=false;
 assert.throws(()=>w.SaveFiles.validate(forged),/Invalid Senara prison wagon sequence/);
});

test('the Black Daggers’ lead unlocks the graveyard, and only the fallen angel yields a heart and lockdown',async()=>{
 const w=world(),sections=w.replaySections(),start=sections.find(s=>s.id==='senara-grave-slip');
 Object.assign(w,{scene:start.scene,quest:structuredClone(start.quest),units:[{x:328,y:224,dir:'up'}],
  DIALOGUE_FACE_CROPS:{},setScene:id=>{w.scene=id;},journeyCard:async(_title,_summary,commit)=>commit(),
  storyRoll:async(label,face)=>w.rolls.push([label,face]),rolls:[]});
 w.scenes[start.scene].points=[];
 w.scenes.senara_daggers_hideout={points:[],walk:[{x:0,y:0,w:640,h:400}],blocks:[]};
 vm.runInContext(read('senara-graveyard.js'),w);
 w.SenaraGraveyard.install();
 const step=async id=>assert.equal(await w.SenaraGraveyard.interact(id),true,id);
 assert.equal(await w.SenaraGraveyard.interact('senaraGraveRoad'),false);
 await step('senaraSlipToGuild');
 assert.equal(w.SenaraGraveyard.npcs()[0].id,'senara_dagger_speaker');
 await step('senaraGuildBrief');
 await step('senaraGraveRoad');
 assert.equal(await w.SenaraGraveyard.interact('senaraAngelHeart'),false);
 await step('senaraAngelFight');
 assert.equal(w.battle.kind,'senara_graveyard_angel');
 assert.equal(w.battle.enemies.length,1);
 assert.equal(w.battle.enemies[0].id,'senara_balisse');
 const position=w.battle.returnPosition;
 w.battle=null;
 await w.SenaraGraveyard.afterBattle(position);
 assert.equal(w.SenaraGraveyard.npcs()[0].pose,'prone');
 assert(!w.Inventory.items(w.quest,2).some(i=>i.id==='senara_angel_heart'));
 await step('senaraAngelHeart');
 assert(w.Inventory.items(w.quest,2).some(i=>i.id==='senara_angel_heart'));
 assert.equal(w.scene,'senara_locked_quay');
 await step('senaraConfirmLockdown');
 assert.equal(w.SenaraGraveyard.target(),null);
 assert.deepEqual(w.rolls,[['The company · Slip past the patrol',15]]);
 const arrival=sections.find(s=>s.id==='senara-grave-lockdown');
 const save=checkpoint(w,{...arrival,quest:w.quest});
 assert.equal(w.SaveFiles.decode(w.SaveFiles.encode(save)).quest.senaraLockdownObserved,true);
 const forged=structuredClone(save);forged.quest.senaraBalisseDefeated=false;
 assert.throws(()=>w.SaveFiles.validate(forged),/Invalid Senara graveyard sequence/);
});

test('Fort Arego reveals Fex’s betrayal before the two champions and locks the dungeon threshold until both fall',async()=>{
 const w=world(),sections=w.replaySections(),start=sections.find(s=>s.id==='arego-depart');
 Object.assign(w,{scene:start.scene,quest:structuredClone(start.quest),units:[{x:328,y:216,dir:'up'}],
  DIALOGUE_FACE_CROPS:{},SouthRoad:{recover:fraction=>w.recovery=fraction}});
 w.scenes[start.scene].points=[];
 w.STATS.fastness_paladin={hp:26};
 vm.runInContext(read('fort-arego.js'),w);
 w.FortArego.install();
 const step=async id=>assert.equal(await w.FortArego.interact(id),true,id);
 const victory=async(kind,id)=>{
  assert.equal(w.battle.kind,kind);
  assert.equal(w.battle.enemies[0].id,id);
  const position=w.battle.returnPosition;
  w.battle=null;
  await w.FortArego.afterBattle(kind,position);
 };
 await step('aregoDepart');
 assert.equal(await w.FortArego.interact('aregoCross'),false);
 await step('aregoDevils');
 assert(w.transcript.some(line=>line.text.includes('promised him your souls')));
 await step('aregoDecision');
 assert.equal(w.recovery,.55);
 await step('aregoCross');
 assert.equal(await w.FortArego.interact('aregoSecondLine'),false);
 await step('aregoFirstLine');
 await victory('arego_viona_line','arego_viona');
 assert.equal(await w.FortArego.interact('aregoSecureYard'),false);
 await step('aregoSecondLine');
 await victory('arego_prison_door','arego_champion');
 await step('aregoSecureYard');
 const arrival=sections.find(s=>s.id==='arego-secure-yard');
 const saved=checkpoint(w,{...arrival,quest:w.quest});
 const back=w.SaveFiles.decode(w.SaveFiles.encode(saved));
 assert.equal(back.quest.aregoExteriorSecured,true);
 assert.equal(back.quest.senaraAngelHeart,true);
 const forged=structuredClone(saved);forged.quest.aregoVionaFell=false;
 assert.throws(()=>w.SaveFiles.validate(forged),/Invalid Fort Arego exterior sequence/);
});
