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
test('all 139 replay checkpoints validate and survive export/import, including new equipment',()=>{const w=world(),list=w.replaySections();assert.equal(list.length,139);for(const section of list){const c=w.SaveFiles.validate(checkpoint(w,section)),back=w.SaveFiles.decode(w.SaveFiles.encode(c));assert.equal(back.scene,section.scene);assert.equal(back.progression.levels.jamal,section.quest.decreesIssued?2:1);}const final=w.SaveFiles.validate(checkpoint(w,list.at(-1)));assert.equal(final.inventory.equipped.jamal,'mantis_blades');assert.equal(final.inventory.equipped.jason,'lucerne');assert.equal(final.inventory.equipped.freya,'naginata');});
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
