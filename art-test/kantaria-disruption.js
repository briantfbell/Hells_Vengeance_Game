"use strict";
window.DisruptionArc=(()=>{
 const maps={},party=['freya','jamal','jason','draymus','guapo','reese'],chain=['chapter12','disruptionBriefed','docksObserved','dockDefendersCleared','docksBurned','jonasEscaped','southTowerDamaged','northTowerCleared','westTowerReached','angelBroDefeated','westTowerBurned','disruptionReported','chapter12Complete'];
 const towerGuards=[{id:'kantaria_guard',x:232,y:184},{id:'kantaria_guard',x:328,y:152},{id:'kantaria_guard',x:424,y:184}];
 const fires=[['dockPierBurned',328,264,'Burn the pier',360,244],['dockStoresBurned',168,152,'Burn the dockside stores',124,131],['dockOfficeBurned',328,136,'Burn the dock office',318,104]],r=(x,y,w,h)=>({x,y,w,h});
 function install(){
  for(const[id,name,image]of [['disruption_briefing','The Uskwood · Cut Their Supply Lines','uskwood-inn-v1.png'],['kantaria_docks','Kantaria · River Docks','kantaria-docks-v1.png'],['kantaria_north_tower','Kantaria · North Guard Tower','kantaria-tower-v1.png'],['kantaria_west_tower','Kantaria · West Guard Tower','kantaria-tower-v1.png'],['disruption_report','The Uskwood · The Occupation Falters','uskwood-inn-v1.png']]){
   const s=structuredClone(scenes.uskwood_inn);s.name=name;s.image=image;s.points=[];s.blocks=[];s.spawn=[328,344];
   if(id==='kantaria_docks')s.walk=[r(264,192,112,176),r(96,144,448,48),r(176,112,288,32)];
   else if(id.includes('tower'))s.walk=[r(288,256,64,128),r(112,144,384,144),r(304,128,32,32)];
   else s.walk=[r(288,144,80,240),r(128,176,384,128)];
   s.lights=id.includes('tower')?[[280,96],[360,96],[160,120],[480,120],[280,336],[360,336]]:id==='kantaria_docks'?[[288,96],[352,96]]:scenes.uskwood_inn.lights;
   maps[id]=scenes[id]=s;MAP_LAYERS[id]={foreground:image,background:id==='kantaria_docks'?{type:'ocean',speed:3,palette:['#0b202b','#14323e','#1a4050','#2b5361']}:{type:'solid',color:'#11121b'}};
  }
  const add=(map,id,x,y,label)=>scenes[map].points.push({id,x,y,label});
  add('uskwood_hideout','disruptionRoad',328,344,'Continue: Docks and towers');add('disruption_briefing','disruptionBrief',328,200,'[Plan the dock operation]');add('disruption_briefing','dockRoad',328,344,'[Go to the river docks]');
  add('kantaria_docks','dockObserve',168,168,'Inspect the dock collections');add('kantaria_docks','dockFight',328,168,'Confront Jonas and the guards');for(const[id,x,y,label]of fires)add('kantaria_docks',id,x,y,label);add('kantaria_docks','dockEscape',328,344,'Withdraw from the burning docks');
  add('kantaria_north_tower','northFight',328,200,'Storm the north tower');
  add('kantaria_north_tower','westRoad',328,344,'Move to the west tower');
  add('kantaria_west_tower','angelFight',328,200,'Face the angel defender');
  add('kantaria_west_tower','westBurn',136,168,'Set the west tower ablaze');
  add('kantaria_west_tower','disruptionReturn',328,344,'Return to the Uskwood');
  add('disruption_report','disruptionDebrief',328,200,'[Report the operations]');add('disruption_report','disruptionEnd',328,344,'[Close the report]');
  Object.assign(NAMES,{jonas:'Jonas Reikman',angel_bro:'Angel-Bro'});
  Object.assign(STATS,{jonas:{hp:42,ac:14,atk:5,dmg:[1,6,2]},angel_bro:{hp:65,ac:16,atk:6,dmg:[1,8,2]}});
  Object.assign(JOURNEYS,{disruption_briefing:'Zara remains hidden at the Uskwood. The company prepares to cut the occupation’s dock income and weaken its guard towers.',kantaria_docks:'Kantaria’s river docks are still taking in cargo. The company approaches by the pier to see what the Reclamation collects from visiting ships.',kantaria_north_tower:'The docks are burning, and the south tower has been damaged in a simultaneous action. The company presses the assault against the north guard tower.',kantaria_west_tower:'The north tower’s soldiers have fallen. The company moves on the west tower, where an angel defender stands in its way.',disruption_report:'The dock income is interrupted and the guard towers are weakened. Return to the Uskwood and review what the attacks accomplished.'});
 }
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);}
 function mapImage(){return quest.chapter12?art[scene]:null;}function roster(){return quest.chapter12?party:null;}
 function count(){return fires.filter(([id])=>quest[id]).length;}
 function goal(){if(!quest.chapter11Complete)return null;if(!quest.chapter12)return 'Continue: Kantaria docks and towers.';if(scene==='kantaria_docks'&&quest.dockDefendersCleared&&!quest.docksBurned)return 'Burn the dock facilities ['+count()+'/3].';if(!quest.chapter12Complete&&['kantaria_docks','kantaria_north_tower','kantaria_west_tower'].includes(scene))return target()?.label+'.';const texts=['Plan the dock and tower operations.','Go to Kantaria’s river docks.','Confront Jonas and the dock guards.','Burn the dock facilities [0/3].','Withdraw from the burning docks.','Reach the north guard tower.','Storm the north guard tower.','Move to the west tower.','Defeat the angel defender.','Burn the west guard tower.','Report back at the Uskwood.','Close the operation report.','Docks and towers complete · Kantaria remains contested.'];const i=chain.findIndex(k=>!quest[k]);return texts[i<0?12:Math.max(0,i-1)];}
 function points(){if(!quest.chapter11Complete)return null;if(!quest.chapter12)return scene==='uskwood_hideout'?[point('disruptionRoad')]:[];if(quest.chapter12Complete)return [];if(scene==='kantaria_docks'&&quest.dockDefendersCleared&&!quest.docksBurned)return fires.filter(([id])=>!quest[id]).map(([id])=>point(id));const id=({disruption_briefing:quest.disruptionBriefed?'dockRoad':'disruptionBrief',kantaria_docks:!quest.docksObserved?'dockObserve':!quest.dockDefendersCleared?'dockFight':'dockEscape',kantaria_north_tower:quest.northTowerCleared?'westRoad':'northFight',kantaria_west_tower:!quest.angelBroDefeated?'angelFight':!quest.westTowerBurned?'westBurn':'disruptionReturn',disruption_report:quest.disruptionReported?'disruptionEnd':'disruptionDebrief'})[scene];return [point(id)].filter(Boolean);}
 const target=()=>points()?.[0]||null;
 function npcs(){if(!quest.chapter12)return null;if(['disruption_briefing','disruption_report'].includes(scene))return [{id:'loredana',x:280,y:168},{id:'zara',x:376,y:168}];if(scene==='kantaria_docks')return quest.dockDefendersCleared?[]:[{id:'jonas',x:328,y:128},{id:'kantaria_guard',x:232,y:144},{id:'kantaria_guard',x:424,y:144}];if(scene==='kantaria_north_tower')return quest.northTowerCleared?[]:towerGuards;if(scene==='kantaria_west_tower')return quest.angelBroDefeated?[]:towerGuards.map((guard,index)=>index===1?{...guard,id:'angel_bro'}:guard);return [];}
 function foe(id,name,shortName){return {id,name:name||NAMES[id],shortName,hp:STATS[id].hp,max:STATS[id].hp};}
 function guards(post,count){return Array.from({length:count},(_,index)=>foe('kantaria_guard',post+' Guard '+(index+1),'Guard '+(index+1)));}
 function fight(kind,enemies){applyProgression();seedParty(...scenes[scene].spawn);save();startBattle(0,false,{kind,enemies});}
 async function afterBattle(kind){if(kind==='disruption_docks'){quest.dockDefendersCleared=true;seedParty(328,200);save();await say('Chronicle','Jonas breaks away from the quay, badly wounded. The guards are down, and the company holds the docks.');}else if(kind==='disruption_north'){quest.northTowerCleared=true;seedParty(328,200);save();await say('Chronicle','The north tower’s soldiers are killed in the assault. The company has opened the route to its next target.');}else if(kind==='disruption_angel'){quest.angelBroDefeated=true;seedParty(328,200);save();await say('Chronicle','The angel defender is defeated. The west tower lies exposed.');}else return;save();paintParty();updateObjective();}
 async function interact(id){if(id==='disruptionRoad'){if(!quest.chapter11Complete||quest.chapter12)return false;quest.chapter12=true;await travel('disruption_briefing',328,344);}else if(!points()?.some(p=>p.id===id))return false;
  else if(id==='disruptionBrief'){await say('loredana','The docks are an income source for the occupation. Jonas taxes the visiting vessels heavily and turns the money over to Oppian.');await say('freya','We will cut off that income and weaken the watchtowers. Zara stays concealed here.');await say('Chronicle','The company prepares attacks on the docks and defensive towers.');quest.disruptionBriefed=true;}
  else if(id==='dockRoad')await travel('kantaria_docks',328,344);
  else if(id==='dockObserve'){
   await say('guapo','I’ve paid enough harbor fees to know when I’m being robbed. Look at what Jonas charges just to tie up.');
   await say('draymus','The collections go straight to Oppian. Same dockmaster as before, new hands on the money.');
   await say('freya','The office is across the quay. Get the guards away from the stores first.');
   quest.docksObserved=true;
  }
  else if(id==='dockFight'){await say('jonas','These docks answer to Oppian. You will not interfere.');await say('freya','Your collections end here.');await say(null,'Jonas signals the guards.', ['[Take the quay]']);fight('disruption_docks',[foe('jonas',NAMES.jonas,'Jonas'),...guards('Dock',2)]);log('Docks · Jonas and the occupation guards.');}
  else if(fires.some(([key])=>key===id)){
   quest[id]=true;
   if(count()===fires.length)quest.docksBurned=true;
   save();
   await say('Chronicle',({dockPierBurned:'Fire catches along the outside pilings. The center boards still give the party a way out.',dockStoresBurned:'Flames spread through the dockside crates and stores.',dockOfficeBurned:'The fire takes hold inside the dock office.'})[id]);
  }
  else if(id==='dockEscape'){quest.jonasEscaped=true;quest.southTowerDamaged=true;await journeyCard('Two Targets · One Operation','The docks are ruined. Rebuilding is expected to take two months. Jonas Reikman escapes, severely injured. At the same time, the south guard tower is damaged. Its repairs are expected to take two weeks.');await travel('kantaria_north_tower',328,344);}
  else if(id==='northFight'){await say('reese','Three soldiers at the stairs. The two out wide can see the whole room.');await say('freya','Stay together until we reach the foot of the stairs.');await say(null,'[Storm the north tower]', ['[Advance on the garrison]']);fight('disruption_north',guards('North',3));log('North tower · Clear the garrison.');}
  else if(id==='westRoad'){quest.westTowerReached=true;await travel('kantaria_west_tower',328,344);}
  else if(id==='angelFight'){await say('Chronicle','A winged defender stands at the foot of the stairs. A soldier steps out on either side.');await say('freya','Let them come off the stairs. Hold formation.');await say(null,'[Challenge the defenders]', ['[Advance into the west tower]']);fight('disruption_angel',[foe('angel_bro',NAMES.angel_bro,'Angel'),...guards('West',2)]);log('West tower · An angel reinforces the defenders.');}
  else if(id==='westBurn'){await say('jason','Put the flame to the stores. Leave the middle of the room clear so we can get out.');await say(null,'[Burn the west tower]', ['[Light the stores by the west wall]']);quest.westTowerBurned=true;save();await say('Chronicle','Fire spreads from the stores along the wall. The entrance is still clear.');}
  else if(id==='disruptionReturn')await travel('disruption_report',328,344);
  else if(id==='disruptionDebrief'){await say('freya','The docks are destroyed. Jonas escaped wounded. The north tower’s soldiers are dead, the west tower burned, and the south tower damaged.');await say('loredana','The occupation still holds Kantaria. Keep your cover while you prepare your next move.');await say('Chronicle','The attacks have weakened the rebellion’s income and defenses. Valor’s Fastness and Narikopolus Manor remain in rebel hands.');quest.disruptionReported=true;}
  else if(id==='disruptionEnd'){await journeyCard('Chapter Twelve · Supply Lines Broken','The dock and tower operations are complete. The occupation is weakened, but Kantaria has not fallen. The company’s work continues.');quest.chapter12Complete=true;}
  else return false;save();paintParty();updateObjective();return true;
 }
 function effects(g,t){
  const active=scene==='kantaria_docks'
   ?fires.filter(([id])=>quest[id]).map(([, , , , x,y])=>[x,y])
   :scene==='kantaria_west_tower'&&quest.westTowerBurned?[[104,145],[76,205]]:[];
  if(active.length)PresentationPolish.worldFire(g,t,active);
 }
 return {install,load,mapImage,roster,goal,points,target,npcs,afterBattle,interact,effects,chain};
})();
