"use strict";
window.FortArc=(()=>{
 const maps={},chain=['chapter9','fortScouted','scoutRetreated','fortPrepared','archerAmbushed','manticoreDefeated','fortSearched','forestMarked','patrolQuestioned','chapter9Complete'];
 const keepTracks=[[324,132],[330,155],[322,178],[328,204]],roadTracks=[[328,320],[322,340],[306,352],[286,351],[266,344]];
 const tower={x:568,y:136},foot={x:568,y:232},lookout={x:520,y:264},airborne={x:520,y:105};
 let scoutMotion=null,hammerThrow=null;
 const party=['freya','jamal','jason','draymus'],r=(x,y,w,h)=>({x,y,w,h});
 function install(){
  for(const[id,name,image]of [['fort_scout','Fort Estazano · First Reconnaissance','fort-estazano-v1.png'],['fort_rest','Longacre · A Second Attempt','accuser-home-v1.png'],['fort_assault','Fort Estazano · The Return','fort-estazano-v1.png'],['fort_search','Fort Estazano · The Hidden Trail','fort-estazano-v1.png'],['whisperwood_trail','Whisperwood · Above the Forest Floor','whisperwood-trail-v1.png'],['fort_patrol','Fort Estazano · Returning Patrol','fort-estazano-v1.png']]){
   const s=structuredClone(scenes.heist_aftermath);s.name=name;s.image=image;s.points=[];s.spawn=[328,344];s.blocks=[];s.lights=[];
   s.walk=id==='fort_rest'?[r(272,112,96,256),r(176,192,288,64)]:id==='whisperwood_trail'?[r(280,64,96,320),r(232,192,176,48)]:[r(288,48,80,336),r(176,144,400,144),r(560,96,64,160),r(352,192,224,64)];
   maps[id]=scenes[id]=s;MAP_LAYERS[id]={foreground:image,background:{type:'solid',color:'#18211b'}};
  }
  const add=(map,id,x,y,label)=>scenes[map].points.push({id,x,y,label});
  add('heist_aftermath','fortArcRoad',328,344,'Continue: Fort Estazano');
  add('fort_scout','scoutFort',foot.x,foot.y,'Levitate onto the wall');add('fort_scout','inspectParapet',tower.x,tower.y,'Scout the parapet');add('fort_scout','reachLookout',lookout.x,lookout.y,'Regroup with El Guapo');add('fort_scout','retreatFort',328,344,'Retreat to Longacre');
  add('fort_rest','planFort',328,200,'[Prepare the return]');add('fort_rest','returnFort',328,344,'[Return to Fort Estazano]');
  add('fort_assault','drinkInvisibility',foot.x,foot.y,'Drink the potion of Invisibility');add('fort_assault','ambushArcher',tower.x,tower.y,'Ambush the archer before she signals');add('fort_assault','rallyAtTower',foot.x,foot.y,'Get J’Mal to cover');add('fort_assault','manticoreFight',foot.x,foot.y,'Hold the tower against the manticore');add('fort_assault','finishManticore',foot.x,foot.y,'Throw Jason’s hammer at the manticore');
  add('fort_search','searchKeep',328,120,'Inspect the tracks at the keep');add('fort_search','findForestTrail',296,344,'Check where the trail leaves the road');add('fort_search','forestRoad',296,344,'Follow the hidden woodland trail');
  add('whisperwood_trail','canopyLookout',344,216,'Study the canopy from cover');add('whisperwood_trail','markCourt',328,120,'Mark the settlement on the map');add('whisperwood_trail','patrolRoad',328,344,'Return to the fort to rest');
  add('fort_patrol','questionPatrol',328,216,'Question the captured patrol');add('fort_patrol','raisePatrol',328,136,'Leave Jason’s undead in the cave');add('fort_patrol','fortArcComplete',328,344,'Prepare for the Court of Spears');
  Object.assign(NAMES,{fort_archer:'Halfling Archer',manticore:'Manticore'});
  Object.assign(STATS,{fort_archer:{hp:18,ac:14,atk:5,dmg:[1,6,2]},manticore:{hp:96,ac:14,atk:5,dmg:[1,8,2]}});
  Object.assign(JOURNEYS,{fort_scout:'The prisoners have named Fort Estazano as a rebel supply cache. J’Mal scouts with El Guapo as backup. One watchtower has collapsed; tall grass covers the clearing around the apparently vacant fort.',fort_rest:'The hidden archer and her manticore have forced a retreat. Back in Longacre, the party heals and plans a coordinated return.',fort_assault:'J’Mal goes ahead with an Invisibility potion. Freya, Jason, and Draymus wait out of sight at the treeline. El Guapo has slipped away again.',fort_search:'The manticore is dead. The party holds Fort Estazano and searches for the weapons and supplies.',whisperwood_trail:'The concealed trail winds several miles into the Whisperwood. J’Mal leads the party under the trees.',fort_patrol:'The strange settlement has been marked on the map. The party returns to the fort to rest and regain spells. A rebel patrol arrives.'});
 }
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);}
 function mapImage(){return quest.chapter9?art[scene]:null;}
 function roster(){if(!quest.chapter9)return null;if(scene==='fort_scout')return ['jamal','guapo'];return scene==='fort_assault'&&!quest.archerAmbushed?['jamal']:party;}
 function goal(){if(!quest.chapter8Complete)return null;if(!quest.chapter9)return 'Investigate the supply-cache lead at Fort Estazano.';if(scene==='fort_scout')return scoutPoint().label+'.';if(scene==='fort_rest')return quest.fortPrepared?'Return to Fort Estazano.':'Plan the second approach.';if(scene==='fort_assault')return assaultPoint().label+'.';if(!quest.chapter9Complete&&['fort_search','whisperwood_trail','fort_patrol'].includes(scene))return target()?.label+'.';const text=['Scout the fort with J’Mal and El Guapo.','Retreat to Longacre.','Plan the second approach.','Ambush the archer before she signals.','Hold the tower against the manticore.','Search the keep for the rebels’ trail.','Mark the hidden woodland settlement.','Question the returning patrol.','Prepare for the Court of Spears.','Chapter complete · The Court of Spears awaits.'];const i=chain.findIndex(k=>!quest[k]);return text[i<0?9:Math.max(0,i-1)];}
 function points(){if(!quest.chapter8Complete)return null;if(!quest.chapter9)return scene==='heist_aftermath'?[point('fortArcRoad')]:[];if(quest.chapter9Complete)return [];const id=({fort_scout:scoutPoint()?.id,fort_rest:quest.fortPrepared?'returnFort':'planFort',fort_assault:assaultPoint()?.id,fort_search:quest.fortSearched?'forestRoad':quest.fortKeepInspected?'findForestTrail':'searchKeep',whisperwood_trail:quest.forestMarked?'patrolRoad':quest.fortCanopySeen?'markCourt':'canopyLookout',fort_patrol:quest.patrolQuestioned?'fortArcComplete':quest.fortPatrolNamed?'raisePatrol':'questionPatrol'})[scene];return [point(id)].filter(Boolean);}
 function scoutPoint(){
  return point(quest.fortScouted?'retreatFort':quest.fortScoutWounded?'reachLookout':quest.fortWallReached?'inspectParapet':'scoutFort');
 }
 function assaultPoint(){
  return point(quest.manticoreDrivenOff?'finishManticore':quest.archerAmbushed?'manticoreFight':quest.fortArcherStopped?'rallyAtTower':quest.fortInvisible?'ambushArcher':'drinkInvisibility');
 }
 const target=()=>points()?.[0]||null;
 function npcs(){if(!quest.chapter9)return null;if(scene==='fort_scout'&&(quest.fortScoutWounded||quest.fortScouted)){
   const actors=[{id:'fort_archer',x:600,y:134,height:44}];
   if(quest.fortScouted)actors.push({id:'manticore',x:536,y:136,height:86});
   return actors;
  }if(scene==='fort_assault'){
   if(quest.manticoreDrivenOff){
    const p=hammerThrow?.epoch===epoch?Math.min(1,Math.max(0,performance.now()-hammerThrow.at-420)/440):0;
    return [{id:'manticore',x:airborne.x-p*114,y:airborne.y+p*91,height:86,...(p>=1?{pose:'prone'}:{})}];
   }
   if(quest.fortArcherStopped||quest.archerAmbushed)return [{id:'manticore',x:504,y:147,height:92}];
   return [{id:'fort_archer',x:600,y:134,height:44}];
  }if(scene==='fort_patrol'&&!quest.patrolQuestioned){
   if(quest.fortPatrolNamed)return [{id:'heist_ranger',x:312,y:132,pose:'prone'},{id:'heist_ranger',x:344,y:146,pose:'prone'}];
   return [{id:'heist_ranger',x:296,y:216},{id:'heist_ranger',x:360,y:216}];
  }return [];}
 function scoutPose(unit){
  if(!['fort_scout','fort_assault'].includes(scene))return unit;
  if(scene==='fort_assault'&&unit.id==='jamal'&&quest.fortInvisible&&!quest.fortArcherStopped)unit={...unit,opacity:.45};
  if(unit.id==='guapo'&&((quest.fortWallReached&&!quest.fortScouted)||scoutMotion?.epoch===epoch))return {...unit,...lookout,dir:'up',step:null};
  if(unit.id!=='jamal'||scoutMotion?.epoch!==epoch)return unit;
  const p=Math.min(1,(performance.now()-scoutMotion.start)/scoutMotion.duration);
  const {from,to}=scoutMotion;
  return {...unit,x:from.x+(to.x-from.x)*p,y:from.y+(to.y-from.y)*p,dir:'up',step:null};
 }
 async function moveScout(from,to,duration){
  const token=epoch;
  if(!reduce.matches){
   scoutMotion={from,to,duration,start:performance.now(),epoch:token};
   try{
    await delay(duration);
    if(token!==epoch)throw CANCEL;
   }finally{scoutMotion=null;}
  }
  seedParty(to.x,to.y,'up');
 }
 async function reachWall(){
  await say('jamal','I’ll take the wall. Stay low and watch our way out.');
  await say(null,'[Climb the watchtower]', ['[Drink the potion of Levitate]']);
  await moveScout(foot,tower,780);
  quest.fortWallReached=true;
 }
 async function surviveAmbush(){
  quest.fortScoutWounded=true;
  await say('Chronicle','A halfling with a shortbow appears out of thin air on the parapet. She looses before J’Mal can draw.');
  await storyRoll('Halfling Archer · Surprise shot',20,0,'J’Mal is badly wounded');
  hp.jamal=Math.max(1,Math.floor(STATS.jamal.hp*.25));
  await say('jamal','Back over the wall. The potion’s still working.');
  await moveScout(tower,foot,500);
  await say('Chronicle','J’Mal lands on his feet. A second arrow strikes the ground as he runs for El Guapo.');
 }
 async function reachLookout(){
  await say('guapo','That arrow looks expensive. Can you run?');
  await say('jamal','I’m running now. What’s she doing with that whistle?');
  quest.fortScouted=true;
  seedParty(lookout.x,lookout.y,'left');
  save();
  await say('Chronicle','The archer blows. No whistle sounds. A growl rises from the keep, and a manticore spreads its wings beside her on the wall.');
  await say('guapo','A silent whistle. Somehow I doubt that means a quiet afternoon.');
 }
 function prepare(){applyProgression();seedParty(...scenes[scene].spawn);window.NextChapter?.syncRoster?.();paintParty();save();}
 function recover(){for(const id of party){hp[id]=STATS[id].hp;uses[id]=0;}mendUses=2;}
 async function afterBattle(kind){
  if(kind!=='fort_manticore')return;
  quest.manticoreDrivenOff=true;
  seedParty(foot.x,foot.y,'up');
  save();
  await say('Chronicle','The manticore crashes into Jason’s doorway. Stone breaks loose, and Freya rushes in to help drive it back. It takes to the air.');
  await say('jason','It’s still in range. One more throw.');
  paintParty();updateObjective();
 }
 async function finishManticore(){
  await say(null,'[Bring down the manticore]', ['[Throw Jason’s hammer]']);
  if(!reduce.matches){
   const token=epoch;
   hammerThrow={at:performance.now(),epoch:token};
   try{await delay(1000);if(token!==epoch)throw CANCEL;}
   finally{hammerThrow=null;}
  }
  await say('Chronicle','The hammer catches it before it clears the wall. The manticore falls, and the fort is quiet.');
  quest.manticoreDefeated=true;
  await travel('fort_search',328,344);
  prepare();
 }
 async function interact(id){
  if(id==='fortArcRoad'){if(!quest.chapter8Complete||quest.chapter9)return false;quest.chapter9=true;await say('freya','The prisoners named Fort Estazano. We need to see whether their cache is still there. J’Mal, take El Guapo and scout the walls.');await travel('fort_scout',328,344);}
  else if(!quest.chapter9)return false;
  else if(id==='scoutFort'&&scene==='fort_scout'&&!quest.fortWallReached&&!quest.fortScouted)await reachWall();
  else if(id==='inspectParapet'&&scene==='fort_scout'&&quest.fortWallReached&&!quest.fortScoutWounded&&!quest.fortScouted)await surviveAmbush();
  else if(id==='reachLookout'&&scene==='fort_scout'&&quest.fortScoutWounded&&!quest.fortScouted)await reachLookout();
  else if(id==='retreatFort'&&scene==='fort_scout'&&quest.fortScouted&&!quest.scoutRetreated){quest.scoutRetreated=true;await travel('fort_rest',328,344);recover();}
  else if(id==='planFort'){await say('freya','She cannot signal if we reach her first. J’Mal, go ahead invisible. Jason rides with me on Sleipnir. Draymus follows from the treeline.');await say('Chronicle','After healing and resting, the party settles on a coordinated attack. J’Mal brings a potion of Invisibility. El Guapo has departed again; four companions make the return.');await say('jamal','If he returns with another wedding cake, I am not helping carry it.');quest.fortPrepared=true;}
  else if(id==='returnFort')await travel('fort_assault',328,344);
  else if(id==='drinkInvisibility'&&scene==='fort_assault'&&quest.fortPrepared&&!quest.fortInvisible&&!quest.archerAmbushed){
   await say('jamal','She was up on this wall last time. I’ll get close before she sees me.');
   await say(null,'[Approach unseen]', ['[Drink the potion of Invisibility]']);
   quest.fortInvisible=true;
   seedParty(tower.x,tower.y,'right');
  }
  else if(id==='ambushArcher'&&scene==='fort_assault'&&quest.fortInvisible&&!quest.fortArcherStopped&&!quest.archerAmbushed){
   await say(null,'The halfling reaches for her whistle.', ['[Strike before she can blow]']);
   await storyRoll('J’Mal · Ambush before the signal',20,0,'The whistle is stopped');
   quest.fortArcherStopped=true;
   await say('Chronicle','J’Mal strikes and casts the archer from the wall. In the clearing, Freya and Jason charge in on Sleipnir with Draymus running behind.');
   await say('Chronicle','Hooves and armor wake the manticore. It sweeps out of its cave and flings a volley of tail spines at Jason.');
   await moveScout(tower,foot,500);
  }
  else if(id==='rallyAtTower'&&scene==='fort_assault'&&quest.fortArcherStopped&&!quest.archerAmbushed){
   await say('Chronicle','Another volley knocks J’Mal unconscious. Freya pulls him down the stairs and gives him a healing potion.');
   quest.archerAmbushed=true;
   hp.jamal=Math.max(1,Math.floor(STATS.jamal.hp*.5));
   seedParty(foot.x,foot.y,'up');
   await say('jason','Get behind me. I’ll hold the lower door.');
  }
  else if(id==='manticoreFight'&&scene==='fort_assault'&&quest.archerAmbushed&&!quest.manticoreDrivenOff&&!quest.manticoreDefeated){prepare();hp.jamal=Math.max(1,Math.min(hp.jamal,Math.floor(STATS.jamal.hp*.5)));startBattle(0,false,{kind:'fort_manticore',enemies:[{id:'manticore',name:'Manticore',hp:STATS.manticore.hp,max:STATS.manticore.hp}]});log('Hold the tower · Tail spines and diving claws alternate. Guard reduces damage.');}
  else if(id==='finishManticore'&&scene==='fort_assault'&&quest.manticoreDrivenOff&&!quest.manticoreDefeated)await finishManticore();
  else if(id==='searchKeep'&&scene==='fort_search'&&quest.manticoreDefeated&&!quest.fortKeepInspected&&!quest.fortSearched){
   await say('freya','See where the prints double back? They walked into the keep and straight back out. Check the road by the gate.');
   quest.fortKeepInspected=true;
  }
  else if(id==='findForestTrail'&&scene==='fort_search'&&quest.fortKeepInspected&&!quest.fortSearched){
   await say('Chronicle','The tracks leave the road just outside the fort. The rebels brushed over the turn, but scuffs in the dirt continue toward the woods.');
   await say('freya','There. J’Mal, take point.');
   quest.fortSearched=true;
  }
  else if(id==='forestRoad'&&scene==='fort_search'&&quest.fortSearched)await travel('whisperwood_trail',328,344);
  else if(id==='canopyLookout'&&scene==='whisperwood_trail'&&!quest.fortCanopySeen&&!quest.forestMarked){
   await say('jamal','Stop. Look where the trees grow closer together. There’s a bridge between those two trunks.');
   quest.fortCanopySeen=true;
  }
  else if(id==='markCourt'&&scene==='whisperwood_trail'&&quest.fortCanopySeen&&!quest.forestMarked){
   await say('Chronicle','Platforms and tree-houses join the bridges overhead. From below, the settlement is barely visible.');
   await say(null,'[Record the location]', ['[Mark the settlement and withdraw]']);
   quest.forestMarked=true;
  }
  else if(id==='patrolRoad'&&scene==='whisperwood_trail'&&quest.forestMarked){await travel('fort_patrol',328,344);recover();}
  else if(id==='questionPatrol'&&scene==='fort_patrol'&&!quest.fortPatrolNamed&&!quest.patrolQuestioned){
   await say('Chronicle','During the rest, two rangers return from a long patrol. The party takes them prisoner.');
   await say('freya','The platforms in the Whisperwood. What’s the place called?');
   await say('heist_ranger','The Court of Spears. That’s all I can tell you.');
   await say('Chronicle','The rangers know little else. They are killed, and Jason takes their bodies to the manticore’s cave.');
   quest.fortPatrolNamed=true;
  }
  else if(id==='raisePatrol'&&scene==='fort_patrol'&&quest.fortPatrolNamed&&!quest.patrolQuestioned){
   await say('jason','Leave them here. I’ll see that they get back on their feet.');
   await say(null,'[Leave the cave to Jason]', ['[Let Jason raise the two rangers]']);
   await say('Chronicle','Jason raises the two rangers as undead. The party leaves them in the cave.');
   quest.patrolQuestioned=true;
  }
  else if(id==='fortArcComplete'&&scene==='fort_patrol'&&quest.patrolQuestioned&&!quest.chapter9Complete){await journeyCard('Chapter Nine · The Court of Spears','The party rents another horse in town and bills it to Archbaron Fex. With the hidden settlement located, they prepare to ride out. The next operation is the Court of Spears.');quest.chapter9Complete=true;}
  else return false;save();paintParty();updateObjective();return true;
 }
 function drawHammer(g){
  if(scene!=='fort_assault'||hammerThrow?.epoch!==epoch)return;
  const p=(performance.now()-hammerThrow.at)/420;
  if(p>1)return;
  g.save();g.translate(foot.x-30+(airborne.x-foot.x+30)*p,foot.y-30+(airborne.y-49-foot.y+30)*p-Math.sin(p*Math.PI)*34);g.rotate(p*Math.PI*5);
  g.fillStyle='#ab865b';g.fillRect(-2,-5,4,17);g.fillStyle='#d4c9a9';g.fillRect(-8,-8,16,7);g.restore();
 }
 function drawTracks(g){
  if(scene!=='fort_search')return;
  g.save();g.fillStyle='#a18a65';g.globalAlpha=.55;
  const tracks=quest.fortKeepInspected?roadTracks:keepTracks;
  for(const [x,y] of tracks){g.fillRect(x-2,y,3,5);g.fillRect(x+3,y+6,3,5);}
  g.restore();
 }
 function effects(g,t){drawHammer(g);drawTracks(g);if(!quest.chapter9||!scene.startsWith('fort_')||scene==='fort_rest')return;g.save();g.globalAlpha=.22;g.strokeStyle='#7b8053';g.lineWidth=1;const sway=reduce.matches?0:Math.round(Math.sin(t*1.6)*2);for(let i=0;i<90;i++){const x=(i*73)%640,y=18+(i*47)%370;if(x>145&&x<515)continue;g.beginPath();g.moveTo(x,y+5);g.lineTo(x+sway,y);g.stroke();}g.restore();}
 function effect(g,a){if(battle?.kind!=='fort_manticore'||a.actor.id!=='manticore')return false;const p=CombatArt.phase(a);if(!a.hit||p<.25)return true;const v=battlePosition(a.target),f=battlePosition(a.actor);g.save();g.globalAlpha=reduce.matches?.8:Math.sin(p*Math.PI);g.strokeStyle='#d9c49b';g.lineWidth=2;if(a.actor.intent?.move==='Diving claws'){for(let i=0;i<3;i++){g.beginPath();g.moveTo(v.x-16+i*10,v.y-v.height*.5-18);g.lineTo(v.x-4+i*10,v.y-v.height*.5+18);g.stroke();}g.restore();return true;}for(let i=-1;i<=1;i++){const k=Math.min(1,(p-.25)/.35),x=f.x+(v.x-f.x)*k,y=f.y-f.height*.5+(v.y-v.height*.5-f.y+f.height*.5)*k+i*6;g.beginPath();g.moveTo(x+10,y-5);g.lineTo(x-8,y+4);g.stroke();}g.restore();return true;}
 return {install,load,mapImage,roster,goal,points,target,npcs,scoutPose,interact,afterBattle,effects,effect,chain};
})();
