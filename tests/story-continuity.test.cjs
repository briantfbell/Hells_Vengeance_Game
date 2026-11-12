const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,'art-test',name),'utf8');
function world(){const nodes={},w={quest:{},scene:'ash_house',lead:'freya',OPENING_ROSTER:['freya','jamal','jason','draymus','guapo'],CORE:['freya','jamal','jason','draymus','guapo','reese'],NAMES:{},STATS:{},hp:{},uses:{},units:[],potions:2,mendUses:2,inventory:{equipped:{}},transcript:[],journeys:[],travels:[],saved:0,performance:{now:()=>0},structuredClone};w.window=w;w.$=id=>nodes[id]??={textContent:'',replaceChildren:()=>{}};for(const id of w.CORE)w.STATS[id]={hp:20};w.say=async(name,text,choices)=>{w.transcript.push({name,text,choices});return 0;};w.journeyCard=async(title,text,commit)=>{w.journeys.push({title,text});commit?.();};w.travel=async(scene)=>{w.scene=scene;w.travels.push(scene);};w.save=()=>w.saved++;for(const name of ['paintParty','updateObjective','seedParty','applyProgression','awardSermonMilestone'])w[name]=()=>{};w.point=id=>({id,x:0,y:0});w.visiblePoints=()=>[];w.partyRoster=()=>w.quest.activeRoster||w.CORE;w.soloParty=()=>false;w.document={querySelector:()=>null};w.battle=null;w.planEnemyRound=()=>{};vm.createContext(w);vm.runInContext(read('enemy-tactics.js'),w);for(const name of ['next-chapter.js','next-arc.js','political-movement.js'])vm.runInContext(read(name),w);w.NextChapter.syncRoster=()=>{};return w;}
test('party authors the restrictions, and all four notices are counted',async()=>{const w=world();w.quest={chapter3:true,sermonDispersed:true};w.awardSermonMilestone=()=>{assert.match(w.journeys.at(-1).title,/next morning/);assert(!w.quest.decreesIssued);};await w.NextArc.interact('razelago');assert(w.transcript.some(x=>x.text.includes('carte blanche')));assert(w.transcript.some(x=>x.text.includes('six people privately or twelve publicly')));assert(w.transcript.some(x=>x.text.includes('company draws up the new rules')));w.PoliticalMovement.goal=()=>null;w.DebtsRumors={goal:()=>null};w.LastStand={goal:()=>null};vm.runInContext(read('quest-guide.js'),w);w.quest.noticePosted=w.quest.tavernPosted=w.quest.gatePosted=true;w.scene='longacre_jail';assert.equal(w.QuestGuide.current().text,'Post the public notices [3/4].');assert.equal(w.QuestGuide.current().target.id,'jailDecree');await w.NextArc.interact('jailDecree');assert(w.quest.jailPosted);assert(w.quest.rhonaDismissed);assert(w.transcript.some(x=>x.text.includes('fourth copy')));assert(w.transcript.some(x=>x.text.includes('Other deputies remain')));assert.equal(w.QuestGuide.current().text,'Leave the jail courtyard.');});
test('both sermon approaches reveal the helm and disperse the crowd before the report',async()=>{
 for(const choice of [0,1]){
  const w=world();
  w.scene='longacre_square';
  w.quest={chapter3:true};
  w.epoch=1;
  w.reduce={matches:false};
  const helm={},draws=[],citizen={id:'citizen-0',x:224,y:240,crowd:true};
  w.art={'longacre-angel-knight-helm-v1.png':helm};
  const g={save(){},restore(){},drawImage:(image)=>draws.push(image)};
  const say=w.say;
  w.say=async(...args)=>{
   if(args[0]==='allamar'){
    w.NextArc.drawSermonHelm(g);
    assert.equal(draws.length,0);
   }
   if(args[1].includes('display the Angel Knight’s helm')){
    w.NextArc.drawSermonHelm(g);
    assert.deepEqual(draws,[helm]);
   }
   await say(...args);
   return args[2]?choice:0;
  };
  w.delay=async duration=>{
   w.performance.now=()=>duration*.8;
   const leaving=w.NextArc.sermonPose(citizen);
   assert.equal(leaving.dir,'left');
   assert(leaving.x<citizen.x&&leaving.sermonOpacity<1);
   assert.equal(w.quest.sermonDispersed,undefined);
  };
  await w.NextArc.interact('sermon');
  const replies=w.transcript.slice(w.transcript.findIndex(line=>line.choices)+1).filter(line=>['freya','jamal'].includes(line.name));
  assert.deepEqual(replies.map(line=>line.name),choice===0?['freya','jamal']:['jamal','freya']);
  assert.equal(w.quest.sermonApproach,choice===0?'challenge':'whispers');
  assert(w.quest.sermonDispersed);
  assert.equal(w.NextArc.sermonPose(citizen),citizen);
  w.NextArc.drawSermonHelm(g);
  assert.equal(draws.length,1);
  await w.NextArc.interact('ashReturn');
  assert.deepEqual(w.travels,['ash_house']);
 }
});
test('the jail ambush uses all four sap deputies, restores the exit and leaves Cimri on watch',async()=>{
 const w=world();
 w.scene='longacre_jail';
 w.quest={chapter3:true,sermonDispersed:true,decreesIssued:true};
 w.epoch=1;
 w.reduce={matches:false};
 w.$('character').options=[];
 w.units=[{id:'freya',x:328,y:344,dir:'down'}];
 const spawns=[];
 w.seedParty=(...position)=>spawns.push(position);
 w.startBattle=(_count,_shaken,config)=>w.battle=config;
 assert.deepEqual(Array.from(w.NextArc.npcs(),actor=>actor.id),['rhona','deputy1','deputy2','deputy3','deputy4']);
 w.quest.rhonaDismissed=true;
 assert.equal(w.NextArc.npcs().length,0);
 w.delay=async duration=>{
  const left=w.NextArc.npcs()[0].x,right=w.NextArc.npcs()[1].x;
  w.performance.now=()=>duration;
  assert(w.NextArc.npcs()[0].x>left&&w.NextArc.npcs()[1].x<right);
 };
 await w.NextArc.interact('jailReport');
 assert.equal(w.battle.kind,'deputies');
 assert.equal(w.battle.enemies.length,4);
 assert.equal(w.battle.returnPosition.y,344);
 w.hp.freya=20;
 w.EnemyTactics.plan(w.battle.enemies,w.units,w.hp,w.STATS,1);
 assert(w.battle.enemies.every(enemy=>enemy.intent.move==='Sap strike'));
 await w.NextArc.afterBattle(w.battle.returnPosition);
 assert.deepEqual(spawns,[[328,344,'down']]);
 assert(w.quest.deputiesDefeated);
 assert.deepEqual(Array.from(w.NextArc.npcs(),actor=>actor.id),['cimri']);
 await w.NextArc.interact('jailReport');
 assert.equal(w.scene,'longacre_square');
 assert(!w.NextArc.npcs().some(actor=>actor.id==='cimri'));
 await w.NextArc.interact('ashReturn');
 assert(!w.NextArc.npcs().some(actor=>actor.id==='cimri'));
 await w.NextArc.interact('razelago');
 assert(w.quest.deputiesReported);
 assert.match(w.transcript.at(-1).text,/Scarlet Manor first thing in the morning/);
});
test('the party inspects the torn notice and meets the servant before reaching Fex',async()=>{
 const w=world();
 w.scene='longacre_square';
 w.quest={chapter3:true,sermonDispersed:true,decreesIssued:true,deputiesDefeated:true,deputiesReported:true};
 assert.equal(w.NextArc.target().id,'tornDecree');
 assert.equal(await w.NextArc.interact('manorRoad'),false);
 await w.NextArc.interact('tornDecree');
 assert.match(w.transcript[0].text,/event board still stands.*torn to shreds/);
 assert.equal(w.NextArc.target().id,'manorRoad');
 await w.NextArc.interact('manorRoad');
 assert.equal(w.scene,'scarlet_manor_approach');
 assert.equal(w.NextArc.target().id,'manorGreeting');
 assert.equal(await w.NextArc.interact('manorOffice'),false);
 const servant=()=>w.NextArc.npcs().find(actor=>actor.id==='scarlet_servant');
 assert.equal(w.NextArc.npcs().filter(actor=>actor.id==='scarlet_sentry').length,4);
 assert.equal(servant().y,330);
 await w.NextArc.interact('manorGreeting');
 assert(w.quest.manorWelcomed);
 assert.equal(servant().y,142);
 assert.equal(w.NextArc.target().id,'manorOffice');
 await w.NextArc.interact('manorOffice');
 assert.deepEqual(w.travels,['scarlet_manor_approach','scarlet_manor']);
 assert.equal(w.NextArc.target().id,'fexAudience');
});
test('the Compact stages the oath before revealing Razelago and opens the Last Stand once',async()=>{
 for(const alreadySworn of [false,true]){
  const w=world();
  w.scene='scarlet_manor';
  w.quest={chapter3:true,compactSworn:alreadySworn,activeRoster:['freya','jamal','jason','draymus']};
  w.units=w.quest.activeRoster.map(id=>({id,x:328,y:248}));
  w.epoch=1;
  w.reduce={matches:false};
  w.$('character').options=[];
  let time=0;
  w.performance.now=()=>time;
  w.delay=async duration=>{time+=duration;};
  const devilVisible=()=>w.NextArc.npcs().some(actor=>actor.id==='razelago_revealed');
  const say=w.say;
  w.say=async(...args)=>{
   const [,line,choices]=args;
   if(line.includes('backs up to the hellstone')){
    const jason=w.NextArc.compactPose(w.units.find(unit=>unit.id==='jason'));
    assert.equal(jason.dir,'down');
    assert.equal(jason.x,328);
    assert.equal(devilVisible(),false);
   }
   if(line.startsWith('The curtain opens'))assert(devilVisible());
   if(line.startsWith('Riley Kels is singing'))assert(!devilVisible());
   await say(...args);
   return choices?1:0;
  };
  assert(!devilVisible());
  await w.NextArc.interact('fexAudience');
  assert.equal(w.transcript.some(line=>line.text.includes('bare backside')), !alreadySworn);
  assert(w.quest.compactSworn&&w.quest.chapter3Complete&&w.quest.reeseJoined);
  assert.equal(w.quest.activeRoster.filter(id=>id==='reese').length,1);
  assert.equal(await w.NextArc.interact('fexAudience'),false);
 }
});
test('both peaceful approaches expose the payroll once and lead to Ash House',async()=>{
 for(const choice of [0,1]){
  const w=world();
  w.scene='tannery';
  w.quest={scouted:true};
  const drawCalls=[];
  const g={save(){},restore(){},translate(){},fillRect:(...args)=>drawCalls.push(args)};
  w.NextChapter.drawTanneryEffects(g);
  assert.equal(drawCalls.length,0);
  await w.NextChapter.interact('payroll');
  await w.NextChapter.interact('ashRoad');
  assert(!w.quest.payroll);
  assert.deepEqual(w.travels,[]);
  const say=w.say;
  w.say=async(...args)=>{await say(...args);return args[2]?choice:0;};
  await w.NextChapter.interact('owner');
  assert.equal(w.transcript.find(line=>line.choices).name,'Cimri’s crew');
  assert.equal(w.transcript.at(-2).name,choice===0?'jason':'cimri');
  assert.equal(w.NextChapter.target().id,'payroll');
  w.NextChapter.drawTanneryEffects(g);
  assert(drawCalls.length>0);
  drawCalls.length=0;
  await w.NextChapter.interact('payroll');
  await w.NextChapter.interact('payroll');
  assert.equal(w.transcript.filter(x=>x.text.includes('takes the owner’s payroll box')).length,1);
  w.NextChapter.drawTanneryEffects(g);
  assert.equal(drawCalls.length,0);
  assert.equal(w.NextChapter.target().id,'ashRoad');
  await w.NextChapter.interact('ashRoad');
  assert.deepEqual(w.travels,['ash_house']);
 }
});
test('tannery scout stages the delivery, misses and return through the gate',async()=>{
 const w=world();
 w.scene='tannery';
 w.epoch=1;
 w.reduce={matches:false};
 w.$('character').options=[];
 const rolls=[],phases=[],spawns=[];
 let time=0;
 w.performance.now=()=>time;
 w.storyRoll=async(label,face)=>rolls.push([label,face]);
 w.seedParty=(x,y)=>spawns.push([x,y]);
 w.delay=async duration=>{
  time+=duration*.75;
  const actors=w.NextChapter.npcs();
  phases.push({farmer:actors.find(actor=>actor.delivering)?.y,owner:actors.some(actor=>actor.id==='owner'),dog:actors.find(actor=>actor.id==='dog').x});
  time+=duration*.25;
 };
 assert.deepEqual(Array.from(w.NextChapter.npcs(),actor=>actor.id),['dog']);
 await w.NextChapter.interact('scout');
 assert.deepEqual(rolls,[['J’Mal · Stealth',14],['J’Mal · Sap ambush',1],['Tannery owner · Crossbow',1]]);
 const [delivery,dump,escape,sap,bolt]=phases;
 assert(delivery.farmer>dump.farmer&&escape.farmer>delivery.farmer);
 assert([delivery,dump,escape].every(phase=>!phase.owner));
 assert(sap.owner&&bolt.owner&&sap.dog>bolt.dog);
 assert(w.quest.scouted);
 assert.deepEqual(spawns,[[328,280]]);
 assert.deepEqual(Array.from(w.NextChapter.npcs(),actor=>actor.id),['owner','dog','cimri']);
 assert.equal(w.NextChapter.target().id,'owner');
});
test('Ash House stages J’Mal alone until the shout and resumes either rescue checkpoint',async()=>{
 for(const checkpoint of [{},{bathStarted:true},{bathStarted:true,jamalRescued:true}]){
  const w=world();
  w.scene='bathroom';
  w.epoch=1;
  w.quest={chapter2:true,reward:true,rested:true,...checkpoint};
  w.units=[{id:'jamal',x:328,y:216}];
  w.$('character').options=[];
  const rolls=[];
  w.storyRoll=async label=>rolls.push(label);
  w.seedParty=()=>{w.units=w.CORE.map(id=>({id}));};
  const say=w.say;
  w.say=async(...args)=>{
   const [,line,choices]=args;
   if(line.includes('drags J’Mal')||line==='Kendrick Lamar!'){
    assert.equal(w.units.length,1);
    assert.equal(w.NextChapter.npcs()[0].id,'spirit');
   }
   if(line.includes('party rushes in'))assert(w.units.length>1);
   if(line.includes('hands and knees'))assert(w.quest.jamalRescued);
   await say(...args);
   return choices?1:0;
  };
  assert.equal(w.NextChapter.npcs().length,checkpoint.bathStarted?1:0);
  await w.NextChapter.interact('bath');
  assert.equal(w.transcript.some(line=>line.text==='Kendrick Lamar!'),!checkpoint.bathStarted);
  assert.deepEqual(rolls,checkpoint.jamalRescued?['Draymus · Control undead']:['Draymus · Necromancy','Draymus · Control undead']);
  assert(w.quest.spiritCalmed);
  assert.equal(w.NextChapter.npcs().length,0);
  assert.equal(w.NextChapter.target().id,'bathExit');
  await w.NextChapter.interact('bathExit');
  assert.equal(w.scene,'ash_house');
  await w.NextChapter.interact('razelago');
  assert(w.quest.chapter2Complete);
  assert(w.transcript.some(line=>line.name==='razelago'&&line.text.includes('preaching in the square')));
 }
});
test('Remesiana purchases and Cimri’s assignment gate the road to the tannery',async()=>{
 const w=world();
 vm.runInContext(read('inventory.js'),w);
 w.inventory=w.Inventory.fresh();
 w.scene='remesiana';
 w.quest={chapter2:true};
 assert.equal(await w.NextChapter.interact('guapoDeparture'),false);
 assert.equal(await w.NextChapter.interact('cimri'),false);
 await w.NextChapter.interact('supplies');
 assert.equal(w.inventory.equipped.jamal,'masterwork_daggers');
 const items=w.Inventory.items(w.quest,2).map(item=>item.id);
 assert(items.includes('remesiana_jason_armor'));
 assert(items.includes('remesiana_arcane_supplies'));
 const base={atk:7,dmg:[1,4,5]};
 assert.equal(w.Inventory.stats(base,w.inventory,'jamal',w.quest).atk,8);
 assert.equal(w.Inventory.validate(w.Inventory.fresh(),w.quest).equipped.jamal,'jamal');
 assert.throws(()=>w.Inventory.validate(w.inventory,{}),/Invalid equipped weapon/);
 await w.NextChapter.interact('cimri');
 assert(w.transcript.some(line=>/Fex wants someone to look into rebel activity in Longacre/.test(line.text)));
 assert.equal(await w.NextChapter.interact('road'),false);
 w.$('character').options=[];
 await w.NextChapter.interact('guapoDeparture');
 const speak=w.say;
 w.say=async(...args)=>{assert.equal(w.scene,'tannery');return speak(...args);};
 await w.NextChapter.interact('road');
 assert.equal(w.travels[0],'tannery');
 assert.match(w.transcript.at(-2).text,/steal the Louslik Tannery payroll/);
 assert.match(w.transcript.at(-1).text,/scout over the palisade/);
});
test('Pezzack and the lookout gate the Western Star boarding',async()=>{
 const w=world();
 w.scene='western_star';
 w.quest={chapter2:true,scimitar:true,voyageSeen:true};
 w.inventory.equipped.freya='scimitar';
 assert.equal(w.NextChapter.target().id,'voyage');
 assert.equal(await w.NextChapter.interact('land'),false);
 await w.NextChapter.interact('voyage');
 assert.equal(w.scene,'western_star_pezzack');
 assert.equal(w.NextChapter.target().id,'voyageSellInstruments');
 assert.equal(await w.NextChapter.interact('voyageDisguiseBlade'),false);
 await w.NextChapter.interact('voyageSellInstruments');
 await w.NextChapter.interact('voyageDisguiseBlade');
 w.setScene=scene=>{w.scene=scene;};
 await w.NextChapter.interact('voyageRest');
 assert.deepEqual([...w.NextChapter.rosterOverride()],['guapo','jamal']);
 w.units=[{x:472,y:248,dir:'left'}];
 w.STATS.western_star_boarder={hp:11};
 w.startBattle=(_count,_shaken,config)=>w.battle=config;
 await w.NextChapter.interact('voyagePezzackAmbush');
 assert.equal(w.battle.enemies.length,3);
 assert.deepEqual([...w.NextChapter.unarmed('guapo',w.battle.kind).dmg],[1,3,2]);
 assert.equal(w.NextChapter.unarmed('jamal',w.battle.kind),null);
 await w.NextChapter.afterPezzackAmbush(w.battle.returnPosition);
 await w.NextChapter.interact('voyageLeavePezzack');
 assert(w.quest.voyagePezzack);
 assert.equal(w.NextChapter.rosterOverride(),null);
 assert.equal(w.NextChapter.target().id,'voyageLookout');
 assert.equal(await w.NextChapter.interact('land'),false);
 await w.NextChapter.interact('voyageLookout');
 assert(w.quest.voyageBoardingReady);
 assert.equal(w.NextChapter.target().id,'land');
 assert.deepEqual(w.transcript.slice(-4).map(line=>line.name),['Lookout','western_star_mildred','guapo','freya']);
 assert.match(w.transcript.at(-3).text,/spyglass/);
 assert.equal(w.scene,'western_star');
 w.units=[{x:520,y:232,dir:'right'}];
 w.STATS.western_star_captain={hp:28};
 w.STATS.western_star_boarder={hp:11};
 w.startBattle=(_count,_shaken,config)=>w.battle=config;
 assert.equal(await w.NextChapter.interact('voyageCorentyn'),false);
 w.epoch=1;
 w.reduce={matches:false};
 let time=0;
 w.performance.now=()=>time;
 const ship={};
 w.art={'western-star-pursuing-sloop-v1.png':ship};
 const draws=[],g={save(){},restore(){},drawImage:(...args)=>draws.push(args)};
 w.NextChapter.drawPursuit(g,0,{reduced:false});
 assert.equal(draws.at(-1)[7],68);
 w.delay=async duration=>{
  time=duration/2;
  w.NextChapter.drawPursuit(g,0,{reduced:false});
  assert(draws.at(-1)[7]>68&&draws.at(-1)[7]<196);
  w.NextChapter.drawPursuit(g,0,{reduced:true});
  assert.equal(draws.at(-1)[7],196);
 };
 await w.NextChapter.interact('land');
 const [first,captain,last]=w.battle.enemies;
 assert.equal(captain.name,'Pirate Captain');
 assert.equal(w.NextChapter.surrenderReady(w.battle),false);
 captain.hp=0;
 assert(first.hp>0&&last.hp>0);
 assert.equal(w.NextChapter.surrenderReady(w.battle),true);
 assert.equal(w.NextChapter.surrenderReady({...w.battle,kind:'temple'}),false);
 await w.NextChapter.afterBoarding(w.battle.returnPosition);
 assert(w.quest.voyageBoardingWon);
 assert.equal(w.NextChapter.target().id,'voyageCorentyn');
 await w.NextChapter.interact('voyageCorentyn');
 assert.deepEqual(w.journeys.map(x=>x.title),['Pezzack · The next morning']);
 assert.equal(w.scene,'western_star_corentyn');
 assert.equal(w.NextChapter.target().id,'voyagePlantBlade');
 assert.equal(await w.NextChapter.interact('voyageHandOverPrize'),false);
 assert.equal(await w.NextChapter.interact('voyageLand'),false);
 await w.NextChapter.interact('voyagePlantBlade');
 assert(w.quest.scimitarDisposed);
 assert.equal(w.inventory.equipped.freya,'freya');
 await w.NextChapter.interact('voyageHandOverPrize');
 assert(w.quest.voyagePrizeTurnedIn);
 assert(!w.NextChapter.npcs().some(u=>u.pose==='prone'));
 w.hp.freya=1;w.potions=0;
 await w.NextChapter.interact('voyageReequip');
 assert(w.quest.voyageCorentynSupplied);
 assert.equal(w.hp.freya,w.STATS.freya.hp);
 assert.equal(w.potions,2);
 await w.NextChapter.interact('voyageLand');
 assert.equal(w.scene,'remesiana');

 const older=world();
 older.scene='western_star';
 older.quest={chapter2:true,scimitarDisposed:true};
 assert.equal(older.NextChapter.target().id,'voyageLand');
 await older.NextChapter.interact('voyageLand');
 assert.equal(older.scene,'remesiana');
 assert.equal(older.journeys.length,0);
});
test('El Guapo returns on 21 Neth and rejoins the active company',async()=>{const w=world();w.quest={chapter5Complete:true,guapoAway:true,activeRoster:w.CORE.slice(0,4)};await w.PoliticalMovement.interact('movementRoad');assert(w.quest.guapoReturned);assert.equal(w.quest.guapoAway,false);assert.deepEqual(Array.from(w.quest.activeRoster),w.CORE);assert.equal(w.journeys[0].title,'Longacre · 21 Neth, 4716');assert.equal(w.scene,'gate_watch');});
test('completed actions and future chapter interactions are hidden',()=>{const w=world(),s=read('chapter-engine.js');vm.runInContext(s.slice(s.indexOf('function storyPointAvailable('),s.indexOf('function visiblePoints(')),w);assert.equal(w.storyPointAvailable({id:'bolgartStocks'}),false);assert.equal(w.storyPointAvailable({id:'manorRoad'}),false);w.quest={payroll:true,decreesIssued:true};assert.equal(w.storyPointAvailable({id:'payroll'}),false);assert.equal(w.storyPointAvailable({id:'gateDecree'}),true);});
test('a confirmation cannot instantly dismiss a newly opened dialogue',()=>{const w=world(),s=read('chapter-engine.js');w.GameAudio={effect:()=>{}};w.keys={clear:()=>{}};w.canvas={focus:()=>{}};vm.runInContext('let dialogOpen=true,dialogOpenedAt=0,dialogResolve=()=>window.resolved=true;'+s.slice(s.indexOf('function finishDialog('),s.indexOf('function run(')),w);w.performance.now=()=>100;w.finishDialog();assert(!w.resolved);w.performance.now=()=>200;w.finishDialog();assert(w.resolved);});

test('Reese joins the actual party at the compact, never the original voyage',async()=>{const w=world();await w.NextChapter.interact('nextChapter');assert.deepEqual(Array.from(w.quest.activeRoster),w.OPENING_ROSTER);w.quest={chapter3:true,compactSworn:true,guapoAway:true,activeRoster:w.OPENING_ROSTER.filter(id=>id!=='guapo')};w.scene='scarlet_manor';w.epoch=1;w.reduce={matches:true};w.delay=async()=>{};await w.NextArc.interact('fexAudience');assert(w.quest.reeseJoined);assert.deepEqual(Array.from(w.quest.activeRoster),['freya','jamal','jason','draymus','reese']);});
test('Bolgart fights include Reese, stage Riley’s capture, and restore Bolgart’s human appearance',async()=>{
 const w=world();
 vm.runInContext(read('last-stand-chapter.js'),w);
 w.scene='last_stand';
 w.quest={chapter4:true,reeseJoined:true,activeRoster:['freya','jamal','jason','draymus','reese']};
 w.epoch=1;
 w.reduce={matches:false};
 w.seedParty=()=>{w.units=w.quest.activeRoster.map(id=>({id}));};
 w.seedParty();
 w.startBattle=(_a,_b,c)=>w.encounter=c;
 const say=w.say;
 const riley=()=>w.LastStand.npcs().find(actor=>actor.id==='riley');
 const startsAtStage=riley().x;
 let time=0;
 w.performance.now=()=>time;
 w.delay=async duration=>{time+=duration;};
 w.say=async(...args)=>{
  const [speaker,line]=args;
  if(line.includes('takes the rear door'))assert.equal(w.LastStand.tavernPose(w.units.find(unit=>unit.id==='jamal')).y,111);
  if(speaker==='riley'){
   assert(riley().x<startsAtStage);
   assert(!w.quest.rileyCaptured);
  }
  return say(...args);
 };
 await w.LastStand.interact('lastDecree');
 assert.equal(w.encounter.kind,'bolgart');
 assert.deepEqual(Array.from(w.units,u=>u.id),['freya','jason','draymus','reese']);
 await w.LastStand.afterBattle('bolgart');
 assert(w.quest.bolgartSubdued&&w.quest.rileyCaptured);
 assert(w.units.some(unit=>unit.id==='jamal'));
 assert.equal(w.LastStand.target().id,'takePrisoners');
 w.scene='longacre_jail';
 await w.LastStand.afterBattle('wereboar');
 assert.equal(w.LastStand.npcs().find(n=>n.id.startsWith('bolgart')).id,'bolgart');
 assert(w.transcript.some(x=>x.text.includes('returns to human form')));
});
test('Riley’s interrogation yields both facts before the letter unlocks the hospice',async()=>{
 for(const choice of [0,1]){
  const w=world();
  for(const file of ['last-stand-chapter.js','debts-rumors-chapter.js'])vm.runInContext(read(file),w);
  w.scene='last_stand';
  w.quest={chapter4:true,bolgartSubdued:true,rileyCaptured:true};
  const say=w.say;
  w.say=async(...args)=>{await say(...args);return args[2]?choice:0;};
  await w.LastStand.interact('takePrisoners');
  assert.deepEqual(Array.from(w.LastStand.npcs(),actor=>actor.id),['bolgart']);
  assert.equal(w.LastStand.target().id,'jailCells');
  assert.equal(await w.DebtsRumors.interact('hospiceRoad'),false);
  await w.LastStand.interact('jailCells');
  assert.equal(w.scene,'longacre_cells');
  assert.equal(w.LastStand.npcs()[0].id,'riley');
  await w.LastStand.interact('rileyQuestion');
  assert(w.quest.rileyQuestioned);
  assert(w.transcript.some(line=>line.name==='riley'&&line.text.includes('two miles')));
  assert(w.transcript.some(line=>line.name==='riley'&&line.text.includes('seeing an angel')));
  assert.equal(w.LastStand.target().id,'hospiceRoad');
  let opened=false;
  w.PresentationPolish={hospiceLetter:async()=>{assert.equal(w.scene,'longacre_cells');opened=true;}};
  await w.DebtsRumors.interact('hospiceRoad');
  assert(opened);
  assert.deepEqual(w.travels,['longacre_jail','longacre_cells','rohalendi_hospice']);
  assert(w.DebtsRumors.npcs().some(actor=>actor.id==='riley'));
  await w.DebtsRumors.interact('doctorTalk');
  assert(w.quest.doctorAlliance);
  assert(w.transcript.some(line=>line.text.includes('ask the Archbaron to forgive your unpaid taxes')));
  assert.equal(w.DebtsRumors.target().id,'churchRoad');
  await w.DebtsRumors.interact('churchRoad');
  assert.equal(w.scene,'longacre_church_front');
  assert.equal(w.DebtsRumors.target().id,'churchForceDoor');
  assert.equal(await w.DebtsRumors.interact('churchInspect'),false);
  w.epoch=1;
  w.reduce={matches:false};
  w.delay=async()=>assert.equal(w.DebtsRumors.doorPose({id:'draymus'}).x,352);
  await w.DebtsRumors.interact('churchForceDoor');
  assert.equal(w.scene,'longacre_church');
  assert(w.transcript.some(line=>line.text.includes('Acid Splash')));
  assert.equal(await w.DebtsRumors.interact('churchRepair'),false);
  await w.DebtsRumors.interact('churchInspect');
  await w.DebtsRumors.interact('churchRepair');
  assert(w.quest.churchEntered&&w.quest.churchDoorsRepaired);
  assert.equal(w.scene,'longacre_jail');
  assert.equal(w.LastStand.target().id,'hillRoad');
 }
});
test('the hill can be searched in either order and returns older completed saves to jail',async()=>{
 for(const checks of [['hillTree','hillRidge'],['hillRidge','hillTree'],[]]){
  const w=world();
  vm.runInContext(read('last-stand-chapter.js'),w);
  w.scene='angel_hill';
  w.quest={chapter4:true,bolgartSubdued:true,prisonersJailed:true,rileyQuestioned:true,churchDoorsRepaired:true,hillSearched:checks.length===0};
  if(checks.length){
   assert.equal(await w.LastStand.interact(checks[0]),false);
   await w.LastStand.interact('hillSearch');
   assert.equal(w.LastStand.goal(),'Search the hill [0/2].');
   await w.LastStand.interact(checks[0]);
   assert.equal(w.LastStand.goal(),'Search the hill [1/2].');
   assert.equal(await w.LastStand.interact('hillReturn'),false);
   await w.LastStand.interact(checks[1]);
   assert(w.quest.hillSearched);
  }
  assert.equal(w.LastStand.target().id,'hillReturn');
  await w.LastStand.interact('hillReturn');
  assert.equal(w.scene,'longacre_jail');
  assert.equal(w.LastStand.target().id,'bolgartStocks');
 }
});
test('the Angel Knight retains the disguise until the failed fear saving throw',async()=>{const w=world();w.quest={chapter6:true};w.units=w.CORE.map(id=>({id}));w.startBattle=(_a,_b,c)=>w.encounter=c;w.log=()=>{};await w.PoliticalMovement.interact('executionStart');assert(w.units.some(u=>u.id==='reese'));assert.equal(w.encounter.enemies[0].name,'Angel Knight');assert(!w.transcript.some(x=>x.text.includes('apparent')));w.rollDice=async(...args)=>w.fearRoll=args;await w.PoliticalMovement.afterBattle('execution');assert.equal(w.fearRoll[0],'Angel Knight · Resist Cause Fear');assert.equal(w.fearRoll[4],'Failed save · Frightened · Story roll');assert.equal(w.fearRoll[5][0],1);});

test('six-character battles start safely and stay within the fixed combat field',()=>{const w=world(),s=read('chapter-engine.js');w.units=w.CORE.map(id=>({id}));w.showCombatMessage=w.paintBattle=()=>{};vm.runInContext(s.slice(s.indexOf('function startBattle('),s.indexOf('function showCombatMessage(')),w);w.startBattle(0,false,{kind:'ovinnik',enemies:[{id:'ovinnik',name:'Ovinnik',hp:38,max:38}]});assert.equal(w.units.length,6);assert(w.units.some(u=>u.id==='reese'));w.battlefieldHeight=()=>368;w.activeUnit=()=>w.units[0];vm.runInContext(s.slice(s.indexOf('function battlePosition('),s.indexOf('function healthBadge(')),w);const places=w.units.map(u=>w.battlePosition(u));assert.equal(new Set(places.map(p=>p.x)).size,6);assert(places.every(p=>p.x-34>=0&&p.x+34<=640&&p.y+34<368));});

test('temple injury refuses a potion without spending stock or the actor’s turn',async()=>{const w=world(),s=read('chapter-engine.js');w.Handheld={isOpen:()=>false};w.epoch=1;w.dialogOpen=w.taskBusy=false;w.quest.templeWound=true;w.hp.jamal=0;w.units=[{id:'freya'},{id:'jamal'}];w.activeUnit=()=>w.units[0];w.battle={kind:'temple',busy:false,turn:0,ally:'jamal',target:0,enemies:[{id:'viggo',hp:34}],control:{mode:'ally',action:'potion'}};w.log=text=>w.refusal=text;w.paintBattle=()=>{};w.damage=async()=>{throw Error('A refused potion must never roll healing.');};vm.runInContext(s.slice(s.indexOf('function potionRefusal('),s.indexOf('async function enemyStrike(')),w);await w.performActionImpl('potion');assert.equal(w.potions,2);assert.equal(w.hp.jamal,0);assert.equal(w.battle.turn,0);assert.equal(w.battle.busy,false);assert.equal(w.battle.control.mode,'commands');assert(w.refusal.includes('too badly injured'));w.battle.kind='ovinnik';assert.equal(w.potionRefusal('jamal'),'');w.battle.kind='temple';assert.equal(w.potionRefusal('freya'),'');w.quest.templeWound=false;assert.equal(w.potionRefusal('jamal'),'');});
test('combat lineup spans the bottom evenly and enemy labels stay right of the dice overlay',()=>{const w=world(),s=read('chapter-engine.js');w.battlefieldHeight=()=>368;w.activeUnit=()=>w.units[0];vm.runInContext(s.slice(s.indexOf('function battlePosition('),s.indexOf('function healthBadge(')),w);for(const size of [3,4,5,6]){w.units=w.CORE.slice(0,size).map(id=>({id}));const ps=w.units.map(u=>w.battlePosition(u));assert.equal(ps[0].x,50);assert.equal(ps.at(-1).x,590);assert(ps.every(p=>p.y===322&&p.height>=108&&p.y+34<368));const gap=ps[1].x-ps[0].x;assert(ps.slice(1).every((p,i)=>Math.abs(p.x-ps[i].x-gap)<.001));}for(const count of [1,2,3,4,5]){w.battle={enemies:Array.from({length:count},()=>({id:'cultist'}))};for(const e of w.battle.enemies){const p=w.battlePosition(e),badgeHalf=count===5?36:44;assert(p.height>=(count===5?82:96));assert(p.x-badgeHalf>640*(.015+.34));assert(p.x+badgeHalf<640);assert(p.y-p.height-35>=0);assert(p.y<322-116);}}});

test('combat intentions use compact names while retaining full target details',()=>{
 const w=world(),s=read('chapter-engine.js'),children=[];
 const nodes={append:node=>children.push(node),replaceChildren:()=>{children.length=0;}};
 const enemies=[
  {name:'Reclamation Paladin',shortName:'Paladin',hp:26,intent:{target:'freya',move:'Sword cut',round:1}},
  {name:'Reclamation Guard',shortName:'Guard',hp:24,intent:{target:'freya',move:'Sword strike',round:1}}
 ];
 const order=enemies.map(({name},index)=>({name,index,side:'enemy'}));
 Object.assign(w,{$:()=>nodes,NAMES:{freya:'Freya'},Initiative:{next:()=>order[1]},battle:{round:1,turn:0,enemies,order},
  document:{createElement:()=>({})}});
 vm.runInContext(s.slice(s.indexOf('function paintEnemyIntent('),s.indexOf('function startBattle(')),w);
 w.paintEnemyIntent();
 assert.deepEqual(children.map(node=>node.textContent),[
  'R1 · NOW Paladin','NEXT Guard','Paladin · Sword cut → Freya','Guard · Sword strike → Freya'
 ]);
 assert.equal(children[3].title,'Reclamation Guard · Sword strike → Freya');
});

test('target navigation wraps, skips defeated enemies, and includes downed healing recipients',()=>{const w=world(),s=read('chapter-engine.js');w.battle={target:0,ally:'freya',enemies:[{hp:10},{hp:0},{hp:10}]};w.units=[{id:'freya'},{id:'jamal'},{id:'reese'}];w.hp.jamal=0;vm.runInContext(s.slice(s.indexOf('function cycleCombatTarget('),s.indexOf('function handleCombatKey(')),w);w.cycleCombatTarget('enemy',1);assert.equal(w.battle.target,2);w.cycleCombatTarget('enemy',1);assert.equal(w.battle.target,0);w.cycleCombatTarget('enemy',-1);assert.equal(w.battle.target,2);w.cycleCombatTarget('ally',1);assert.equal(w.battle.ally,'jamal');w.cycleCombatTarget('ally',-1);assert.equal(w.battle.ally,'freya');});
test('action impact happens once at contact and stale animations cannot change HP',async()=>{const w=world(),s=read('chapter-engine.js');w.epoch=1;w.reduce={matches:false};w.GameAudio={effect:()=>{}};w.CANCEL=Symbol('cancel');w.battle={};const times=[];let elapsed=0,impacts=0;w.delay=async ms=>{elapsed+=ms;times.push(ms);};vm.runInContext(s.slice(s.indexOf('async function animateAction('),s.indexOf('function actionPose(')),w);await w.animateAction({id:'reese'},{id:'enemy'},'attack',true,()=>{impacts++;assert.equal(elapsed,760*.62);});assert.equal(impacts,1);assert.equal(w.battle.animation,null);assert.equal(times.length,2);w.delay=async()=>{w.epoch++;};await assert.rejects(w.animateAction({id:'freya'},{id:'enemy'},'attack',true,()=>impacts++),e=>e===w.CANCEL);assert.equal(impacts,1);});

test('a confirm during the last step acts once on the requested point when the leader arrives',async()=>{
 const w=world(),s=read('chapter-engine.js'),leader={id:'freya',x:312,y:248,anim:0};
 const target={id:'rileyBanter',x:360,y:248};
 let points=[target],interactions=0;
 Object.assign(w,{ready:true,campaignLoading:false,introOpen:false,journeyOpen:false,levelOpen:false,briefingOpen:false,
  dialogOpen:false,taskBusy:false,battle:null,finished:()=>false,Handheld:{isOpen:()=>false},INTERACTION_RADIUS:56,
  units:[leader],path:[[21,15]],trail:[],keys:new Set(),fx:[],cell:(x,y)=>[Math.floor(x/16),Math.floor(y/16)],
  visiblePoints:()=>points,updateCitizens:()=>{},run:fn=>fn(),PresentationPolish:{banter:()=>interactions++}});
 vm.runInContext(s.slice(s.indexOf('function nearPoint('),s.indexOf('async function finishTempleEscape(')),w);
 vm.runInContext(s.slice(s.indexOf('function advance('),s.indexOf('function drawActor(')),w);
 leader.step={sx:312,sy:248,tx:328,ty:248,p:0};
 await w.interact();
 assert.equal(leader.step.interaction,target.id);
 assert.equal(w.path.length,0);
 w.update(.1);
 assert.equal(interactions,0);
 w.update(.1);
 w.update(.1);
 assert.equal(interactions,1);
 leader.step={sx:328,sy:248,tx:344,ty:248,p:0};
 await w.interact(target.id);
 points=[{...target,id:'different'}];
 w.update(.2);
 assert.equal(interactions,1);
 assert.equal(leader.step,null);
});

test('brief direction taps start a step immediately and respect movement locks',()=>{const w=world(),s=read('chapter-engine.js');Object.assign(w,{ready:true,introOpen:false,journeyOpen:false,levelOpen:false,dialogOpen:false,taskBusy:false,battle:null,finished:()=>false,DIR:{up:[0,-1]},units:[{id:'freya',x:312,y:248,step:null}],path:[1],cell:(x,y)=>[Math.floor(x/16),Math.floor(y/16)],stepUnit:(u,x,y)=>{u.step={x,y};return true;}});vm.runInContext(s.slice(s.indexOf('function beginWalkTap('),s.indexOf('function update(')),w);assert(w.beginWalkTap('up'));assert.equal(w.units[0].step.y,14);assert.equal(w.path.length,0);assert.equal(w.beginWalkTap('up'),false);w.units[0].step=null;w.taskBusy=true;assert.equal(w.beginWalkTap('up'),false);assert.equal(w.units[0].step,null);});
