const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,'art-test',name),'utf8');
function world(){const nodes={},w={quest:{},scene:'ash_house',lead:'freya',OPENING_ROSTER:['freya','jamal','jason','draymus','guapo'],CORE:['freya','jamal','jason','draymus','guapo','reese'],NAMES:{},STATS:{},hp:{},uses:{},units:[],potions:2,mendUses:2,inventory:{equipped:{}},transcript:[],journeys:[],travels:[],saved:0,performance:{now:()=>0},structuredClone};w.window=w;w.$=id=>nodes[id]??={textContent:'',replaceChildren:()=>{}};for(const id of w.CORE)w.STATS[id]={hp:20};w.say=async(name,text,choices)=>{w.transcript.push({name,text,choices});return 0;};w.journeyCard=async(title,text,commit)=>{w.journeys.push({title,text});commit?.();};w.travel=async(scene)=>{w.scene=scene;w.travels.push(scene);};w.save=()=>w.saved++;for(const name of ['paintParty','updateObjective','seedParty','applyProgression','awardSermonMilestone'])w[name]=()=>{};w.point=id=>({id,x:0,y:0});w.visiblePoints=()=>[];w.partyRoster=()=>w.quest.activeRoster||w.CORE;w.soloParty=()=>false;w.document={querySelector:()=>null};w.battle=null;w.planEnemyRound=()=>{};vm.createContext(w);vm.runInContext(read('enemy-tactics.js'),w);for(const name of ['next-chapter.js','next-arc.js','political-movement.js'])vm.runInContext(read(name),w);w.NextChapter.syncRoster=()=>{};return w;}
test('party authors the restrictions, and all four notices are counted',async()=>{const w=world();w.quest={chapter3:true,sermonDispersed:true};await w.NextArc.interact('razelago');assert(w.transcript.some(x=>x.text.includes('carte blanche')));assert(w.transcript.some(x=>x.text.includes('six people privately or twelve publicly')));assert(w.transcript.some(x=>x.text.includes('party’s choices')));w.PoliticalMovement.goal=()=>null;w.DebtsRumors={goal:()=>null};w.LastStand={goal:()=>null};vm.runInContext(read('quest-guide.js'),w);w.quest.noticePosted=w.quest.tavernPosted=w.quest.gatePosted=true;w.scene='longacre_jail';assert.equal(w.QuestGuide.current().text,'Post the public notices [3/4].');assert.equal(w.QuestGuide.current().target.id,'jailDecree');await w.NextArc.interact('jailDecree');assert(w.quest.jailPosted);assert(w.quest.rhonaDismissed);assert(w.transcript.some(x=>x.text.includes('fourth copy')));assert(w.transcript.some(x=>x.text.includes('Other deputies remain')));assert.equal(w.QuestGuide.current().text,'Leave the jail courtyard.');});
test('completed payroll cannot be obtained twice',async()=>{const w=world();w.scene='tannery';w.quest={ownerDeal:true};await w.NextChapter.interact('payroll');await w.NextChapter.interact('payroll');assert.equal(w.transcript.filter(x=>x.text.includes('Obtained:')).length,1);});
test('scouting instruction follows arrival and identifies theft',async()=>{const w=world();w.quest={metCimri:true,supplied:true,guapoAway:true};await w.NextChapter.interact('road');assert.equal(w.travels[0],'tannery');assert(w.transcript[0].text.includes('steal the payroll'));assert(w.transcript[1].text.includes('scout over the palisade'));});
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

test('Reese joins the actual party at the compact, never the original voyage',async()=>{const w=world();await w.NextChapter.interact('nextChapter');assert.deepEqual(Array.from(w.quest.activeRoster),w.OPENING_ROSTER);w.quest={chapter3:true,compactSworn:true,guapoAway:true,activeRoster:w.OPENING_ROSTER.filter(id=>id!=='guapo')};await w.NextArc.interact('fexAudience');assert(w.quest.reeseJoined);assert.deepEqual(Array.from(w.quest.activeRoster),['freya','jamal','jason','draymus','reese']);});
test('Bolgart fights include Reese, preserve the rear-door scout, and restore human appearance',async()=>{const w=world();vm.runInContext(read('last-stand-chapter.js'),w);w.quest={chapter4:true,reeseJoined:true,activeRoster:['freya','jamal','jason','draymus','reese']};w.units=w.quest.activeRoster.map(id=>({id}));w.startBattle=(_a,_b,c)=>w.encounter=c;await w.LastStand.interact('lastDecree');assert.equal(w.encounter.kind,'bolgart');assert.deepEqual(Array.from(w.units,u=>u.id),['freya','jason','draymus','reese']);w.scene='longacre_jail';await w.LastStand.afterBattle('wereboar');assert.equal(w.LastStand.npcs().find(n=>n.id.startsWith('bolgart')).id,'bolgart');assert(w.transcript.some(x=>x.text.includes('returns to human form')));});
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
