"use strict";
window.KantariaArc=(()=>{
 const maps={},chain=['chapter11','uskwoodBriefed','kantariaAssessed','patrolsThinned','prisonObserved','prisonYardCleared','prisonHallCleared','zaraIdentified','zaraGearRecovered','zaraFreed','zaraHidden','chapter11Complete'];
 const yardGuards=[{id:'kantaria_guard',x:264,y:192},{id:'kantaria_guard',x:328,y:168},{id:'kantaria_guard',x:392,y:192}];
 const hallDefenders=[{id:'jalila',x:328,y:176},{id:'kantaria_guard',x:248,y:184},{id:'kantaria_guard',x:408,y:184}];
 let cellOpened=null;
 const party=['freya','jamal','jason','draymus','guapo','reese'],r=(x,y,w,h)=>({x,y,w,h});
 function install(){
  for(const[id,name,image]of [['uskwood_inn','Kantaria · The Uskwood Inn','uskwood-inn-v1.png'],['kantaria_streets','Kantaria · Gathering Intelligence','kantaria-market-v1.png'],['hardship_yard','Hardship’s Hearth · Work Yard','hardship-yard-v1.png'],['hardship_hall','Hardship’s Hearth · Main Building','hardship-hall-v1.png'],['uskwood_hideout','The Uskwood · A Hidden Ally','uskwood-inn-v1.png']]){
   const s=structuredClone(scenes.scarlet_manor);s.name=name;s.image=image;s.points=[];s.spawn=[328,344];s.blocks=[];s.lights=[];
   if(id==='kantaria_streets')s.walk=[r(288,304,64,80),r(144,128,352,192)];
   else if(id==='hardship_yard')s.walk=[r(304,144,32,240),r(144,160,352,112)];
   else if(id==='hardship_hall')s.walk=[r(288,304,64,80),r(144,144,352,176),r(480,176,64,80)];
   else s.walk=[r(288,144,80,240),r(128,176,384,160),r(400,144,112,128)];
   if(id.startsWith('uskwood'))s.lights=[[166,112],[264,100],[376,112],[552,184],[280,328],[376,328]];if(id==='hardship_hall')s.lights=[[240,64],[496,64],[552,128],[280,328],[376,328]];
   maps[id]=scenes[id]=s;MAP_LAYERS[id]={foreground:image,background:{type:'solid',color:id==='hardship_yard'?'#252a23':'#11121b'}};
  }
  const add=(map,id,x,y,label)=>scenes[map].points.push({id,x,y,label});
  add('court_report','kantariaRoad',328,344,'Continue: Kantaria');add('uskwood_inn','uskwoodBriefing',328,200,'[Meet Loredana]');add('uskwood_inn','kantariaIntelRoad',328,344,'[Gather intelligence in town]');
  add('kantaria_streets','kantariaTowers',200,232,'Watch the tower patrols');
  add('kantaria_streets','kantariaManorIntel',328,152,'Check the route to Narikopolus Manor');
  add('kantaria_streets','kantariaAssessment',456,216,'Find the route to Hardship’s Hearth');
  add('kantaria_streets','kantariaPatrol',424,280,'Intercept the isolated patrol');add('kantaria_streets','hardshipRoad',328,344,'[Approach Hardship’s Hearth]');
  add('hardship_yard','hardshipObserve',328,280,'Watch the prison yard');
  add('hardship_yard','hardshipYardFight',328,216,'Clear the guards from the entrance');
  add('hardship_yard','hardshipEnter',328,152,'Enter the main building');
  add('hardship_hall','hardshipHallFight',328,216,'Clear a route to the prisoner');
  add('hardship_hall','zaraContact',328,152,'Speak to the captive Hellknight');
  add('hardship_hall','zaraEquipment',520,200,'Recover Zara’s gear from storage');
  add('hardship_hall','zaraRelease',328,152,'Open Zara’s cell');
  add('hardship_hall','uskwoodReturn',328,344,'Escort Zara to the Uskwood');
  add('uskwood_hideout','zaraShelter',328,200,'[Arrange Zara’s concealment]');add('uskwood_hideout','kantariaOpeningComplete',328,344,'[Review the next targets]');
  Object.assign(NAMES,{loredana:'Loredana Viorica',zara:'Zara Orcelani',jalila:'Jalila Hadjara',kantaria_guard:'Reclamation Guard'});
  Object.assign(STATS,{kantaria_guard:{hp:24,ac:13,atk:4,dmg:[1,6,1]},jalila:{hp:55,ac:15,atk:6,dmg:[1,6,2]}});
  FUTURE_NPCS.kantaria_guard={source:COMBAT_IDLES.church_acolyte.src,frame:COMBAT_IDLES.church_acolyte.frames[0]};COMBAT_IDLES.kantaria_guard=COMBAT_IDLES.church_acolyte;
  Object.assign(JOURNEYS,{uskwood_inn:'Captain Freya’s company reaches Kantaria. Their first stop is the Uskwood Inn, where proprietor Loredana Viorica is expecting them.',kantaria_streets:'The employment provides a public cover while the company studies the Glorious Reclamation’s occupation. Watch the patrols and find out where the Reclamation is holding prisoners.',hardship_yard:'The company reaches the prison work camp while the other patrols are out of sight. The Hellknight is somewhere in the main building.',hardship_hall:'The outer guards have been defeated. Move through the main building, reach the captive Hellknight, and recover her confiscated equipment.',uskwood_hideout:'The company extracts Zara Orcelani and her gear. Return to the Uskwood Inn and keep her hidden until she can act without exposing the operation.'});
 }
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);}
 function mapImage(){return quest.chapter11?art[scene]:null;}
 function roster(){return quest.chapter11?party:null;}
 function goal(){if(!quest.chapter10Complete)return null;if(!quest.chapter11)return 'Continue to Kantaria.';
  if(!quest.chapter11Complete&&['kantaria_streets','hardship_yard','hardship_hall','uskwood_hideout'].includes(scene))return target()?.label.replace(/^\[|\]$/g,'')+'.';
  const text=['Meet Loredana at the Uskwood Inn.','Gather intelligence in Kantaria.','Intercept an isolated rebel patrol.','Observe Hardship’s Hearth.','Break through the outer guards.','Enter the prison’s main building.','Identify the captive Hellknight.','Recover Zara’s confiscated gear.','Free Zara.','Bring Zara to safety at the Uskwood.','Review the next Kantaria targets.','Kantaria opening complete · The docks and guard towers await.'];const i=chain.findIndex(k=>!quest[k]);return text[i<0?11:Math.max(0,i-1)];}
 function points(){if(!quest.chapter10Complete)return null;if(!quest.chapter11)return scene==='court_report'?[point('kantariaRoad')]:[];if(quest.chapter11Complete)return [];const id=({uskwood_inn:quest.uskwoodBriefed?'kantariaIntelRoad':'uskwoodBriefing',kantaria_streets:streetObjective(),hardship_yard:!quest.prisonObserved?'hardshipObserve':!quest.prisonYardCleared?'hardshipYardFight':'hardshipEnter',hardship_hall:!quest.prisonHallCleared?'hardshipHallFight':!quest.zaraIdentified?'zaraContact':!quest.zaraGearRecovered?'zaraEquipment':!quest.zaraFreed?'zaraRelease':'uskwoodReturn',uskwood_hideout:quest.zaraHidden?'kantariaOpeningComplete':'zaraShelter'})[scene];return [point(id)].filter(Boolean);}
 function streetObjective(){
  if(quest.patrolsThinned)return 'hardshipRoad';
  if(quest.kantariaAssessed)return 'kantariaPatrol';
  if(quest.kantariaManorScouted)return 'kantariaAssessment';
  return quest.kantariaTowersScouted?'kantariaManorIntel':'kantariaTowers';
 }
 const target=()=>points()?.[0]||null;
 function npcs(){if(!quest.chapter11)return null;if(scene==='uskwood_inn')return [{id:'loredana',x:328,y:160}];if(scene==='uskwood_hideout')return [{id:'loredana',x:280,y:168},{id:'zara',x:376,y:168}];if(scene==='kantaria_streets'&&!quest.patrolsThinned){
   return quest.kantariaAssessed
    ?[{id:'kantaria_guard',x:448,y:260},{id:'kantaria_guard',x:464,y:284},{id:'kantaria_guard',x:448,y:304}]
    :[{id:'kantaria_guard',x:248,y:144},{id:'kantaria_guard',x:392,y:144}];
  }
  if(scene==='hardship_yard')return quest.prisonYardCleared?[]:yardGuards;if(scene==='hardship_hall'){
   if(!quest.prisonHallCleared)return hallDefenders;
   const leader=units[0];
   if(quest.zaraFreed&&leader){
    const atExit=leader.y>=304;
    return [{id:'zara',x:atExit?320:Math.min(488,Math.max(160,leader.x+(leader.x>352?-30:30))),y:Math.max(160,leader.y-24)}];
   }
   const progress=openingProgress();
   return [{id:'zara',x:320,y:121+Math.round(progress*55),height:47}];
  }return [];}
 function prepare(position=scenes[scene].spawn){applyProgression();seedParty(...position);window.NextChapter?.syncRoster?.();paintParty();save();}
 function foe(id,name,shortName){return {id,name:name||NAMES[id],shortName,hp:STATS[id].hp,max:STATS[id].hp};}
 async function afterBattle(kind){if(kind==='kantaria_patrol'){quest.patrolsThinned=true;save();await say('Chronicle','The company begins thinning isolated guard patrols and spreading false leads. Their next objective is the Hellknight imprisoned at Hardship’s Hearth.');}
  else if(kind==='kantaria_yard'){
   quest.prisonYardCleared=true;
   prepare([328,216]);
   updateObjective();
   await say('freya','Door’s clear. Inside, before the next patrol comes back.');
   return;
  }
  else if(kind==='kantaria_hall'){
   quest.prisonHallCleared=true;
   prepare([328,216]);
   updateObjective();
   await say('freya','Jalila’s fallen back. Get to the center cell before the guards regroup.');
   return;
  }
  else return;prepare();updateObjective();}
 async function interact(id){if(id==='kantariaRoad'){if(!quest.chapter10Complete||quest.chapter11)return false;if(!quest.kantariaRoadBandits){
   await journeyCard('On the Road to Kantaria','The company defeats a band led by Sancho. Among his belongings they find a letter of marque from the Glorious Reclamation.');
   quest.kantariaRoadBandits=true;
   save();
  }
  if(!quest.kantariaRoadEgorian){
   await journeyCard('An Overnight Stop in Egorian','Robbers attack the company at their inn. El Guapo fights them off without a stitch on. Five assailants die and one escapes. The company tends its wounds and presses on.');
   quest.kantariaRoadEgorian=true;
   save();
  }
  quest.chapter11=true;for(const id of party){hp[id]=STATS[id].hp;uses[id]=0;}mendUses=2;await travel('uskwood_inn',328,344);}
  else if(!quest.chapter11||!points()?.some(p=>p.id===id))return false;
  else if(id==='uskwoodBriefing'){
   await say('loredana','Captain Freya. Fex said you’d come. I can hire your company to guard the Uskwood. I sit on the council, so I can answer for your presence if anyone asks.');
   await say(null,'[Take the Uskwood contract]', ['[Accept work as private security]']);
   await say('freya','Then we’re here to guard the inn. While we’re on rounds, we’ll see where the Reclamation has its people posted.');
   quest.uskwoodBriefed=true;
  }
  else if(id==='kantariaIntelRoad')await travel('kantaria_streets',328,344);
  else if(id==='kantariaTowers'){
   await say('reese','They’ve posted guards at the northeast, west, and south entrances. The patrols keep coming back to Valor’s Fastness.');
   await say('freya','A fortified temple for barracks. Mark the three towers and the routes between them.');
   quest.kantariaTowersScouted=true;
  }
  else if(id==='kantariaManorIntel'){
   await say('draymus','Faydreth Zaine has taken Narikopolus Manor. Word in the market is that the wizard has been confiscating valuables and anything magical.');
   quest.kantariaManorScouted=true;
  }
  else if(id==='kantariaAssessment'){
   await say('jamal','Hardship’s Hearth holds about three dozen prisoners. There’s a Hellknight in the main building.');
   await say('freya','We need a name. Wait for a patrol to lose sight of the others, then we’ll open a route to the prison.');
   quest.kantariaAssessed=true;
  }
  else if(id==='kantariaPatrol'){await say('freya','An isolated patrol. Strike before they can regroup with the occupation force.');prepare();startBattle(0,false,{kind:'kantaria_patrol',enemies:[1,2,3].map(i=>foe('kantaria_guard','Patrol Guard '+i,'Guard '+i))});log('Isolated patrol · Three Reclamation guards.');}
  else if(id==='hardshipRoad')await travel('hardship_yard',328,344);
  else if(id==='hardshipObserve'){
   await say('reese','Three in the yard. The middle one is right on the door. I can cover you from the work benches.');
   await say('jamal','Most of these guards look new. Jalila Hadjara runs the prison, though. A Reclamation lieutenant, and a monk.');
   await say('freya','Then we take the door together. The Hellknight and her gear are what we came for.');
   quest.prisonObserved=true;
  }
  else if(id==='hardshipYardFight'){
   await say(null,'The guards turn toward the company.', ['[Cross the yard and take the entrance]']);
   prepare([328,216]);
   const enemies=yardGuards.map(({id},index)=>foe(id,'Yard Guard '+(index+1),'Guard '+(index+1)));
   startBattle(0,false,{kind:'kantaria_yard',enemies});
   log('Three guards stand between the company and the prison door.');
  }
  else if(id==='hardshipEnter')await travel('hardship_hall',328,344);
  else if(id==='hardshipHallFight'){
   await say('jalila','Turn around. This corridor is under my protection.');
   await say('freya','We came for the prisoner. Stand aside.');
   await say(null,'Jalila raises her fists. Her guards move to block the cells.', ['[Break through the cell corridor]']);
   prepare([328,216]);
   startBattle(0,false,{kind:'kantaria_hall',enemies:[foe('jalila',NAMES.jalila,'Jalila'),...[1,2].map(i=>foe('kantaria_guard','Hall Guard '+i,'Guard '+i))]});
   log('Jalila fights unarmed. Two guards hold the corridor.');
  }
  else if(id==='zaraContact'){await say('freya','Captain Freya Kusanagi. We’re getting you out. What’s your name?');await say('zara','Zara Orcelani. My equipment is in the racks by the east wall. I want it back before we go.');quest.zaraIdentified=true;}
  else if(id==='zaraEquipment'){
   await say(null,'The confiscated gear is stacked beside the east wall.', ['[Gather Zara’s armor and weapons]']);
   quest.zaraGearRecovered=true;
  }
  else if(id==='zaraRelease'){
   await say(null,'[Open the center cell]', ['[Unlatch the door and return Zara’s gear]']);
   if(!reduce.matches){
    const token=epoch;
    cellOpened={at:performance.now(),epoch:token};
    try{await delay(600);if(token!==epoch)throw CANCEL;}finally{if(cellOpened?.epoch===token)cellOpened=null;}
   }
   quest.zaraFreed=true;
   save();
   await say('zara','Everything’s here. Lead the way.');
  }
  else if(id==='uskwoodReturn')await travel('uskwood_hideout',328,344);
  else if(id==='zaraShelter'){await say('freya','We have extracted Zara Orcelani and her gear. She needs to remain out of sight.');await say('loredana','I can keep her in a back room. If anyone asks, you’re still here to guard the inn.');await say('Chronicle','Zara is hidden at the inn until she can be deployed without alerting the rebels to the company’s operation.');quest.zaraHidden=true;}
  else if(id==='kantariaOpeningComplete'){await journeyCard('Chapter Eleven · A Hidden Ally','Zara Orcelani is safe at the Uskwood. The company has identified Kantaria’s principal rebel positions. Its next operation will target the docks and guard towers.');quest.chapter11Complete=true;}
  else return false;save();paintParty();updateObjective();return true;
 }
 function openingProgress(){
  if(quest.zaraFreed)return 1;
  return cellOpened?.epoch===epoch?Math.min(1,(performance.now()-cellOpened.at)/600):0;
 }
 function drawCell(g,foreground=false){
  if(scene!=='hardship_hall'||!art[scene])return;
  const progress=openingProgress();
  if(foreground){
   if(progress>0||!quest.prisonHallCleared)return;
   const map=art[scene],sx=map.width/640,sy=map.height/400;
   for(const x of [306,313,320,327])g.drawImage(map,x*sx,61*sy,3*sx,62*sy,x,61,3,62);
   return;
  }
  if(progress===0)return;
  const width=Math.round(29*progress);
  const shadow=g.createLinearGradient(0,64,0,123);
  shadow.addColorStop(0,'#110e0d');shadow.addColorStop(.75,'#211810');shadow.addColorStop(1,'#58412a');
  g.save();
  g.fillStyle=shadow;g.fillRect(304,63,width,59);
  g.fillStyle='#826947';g.fillRect(304,122,width,2);
  g.restore();
 }
 return {install,load,mapImage,roster,goal,points,target,npcs,interact,afterBattle,drawCell,chain};
})();
