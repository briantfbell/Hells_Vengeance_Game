"use strict";
window.CovertArc=(()=>{
 const maps={},party=['freya','jamal','jason','draymus','guapo','reese'];
 const chain=['chapter13','covertBriefed','marketSurveyed','marketRiot','patrolAmbushed','falseBlame','guildEntered','guildRecordsTampered','manorObserved','manorArtifactsTaken','uskwoodReturned','uskwoodBurned','escapeOpened','cavesReached','caveRested','corrineAssigned','chapter13Complete'];
 const r=(x,y,w,h)=>({x,y,w,h});
 function install(){
  for(const[id,name,image]of [['covert_briefing','The Uskwood · Quiet Knives','uskwood-inn-v1.png'],['kantaria_market','Kantaria · Market Unrest','kantaria-market-v1.png'],['kantaria_patrol_lane','Kantaria · The Patrol Route','kantaria-market-v1.png'],['kantaria_guild','Kantaria · Labor Guild','kantaria-guild-v1.png'],['kantaria_manor','Kantaria · Narikopolus Manor','kantaria-manor-v1.png'],['uskwood_last_night','The Uskwood · No Shelter Left','uskwood-inn-v1.png'],['fungus_shelter','Fungus Caves · A Cold Refuge','kantaria-caves-v1.png']]){
   const s=structuredClone(scenes.uskwood_inn);s.name=name;s.image=image;s.points=[];s.blocks=[];s.spawn=[328,344];s.walk=[r(144,160,352,144),r(288,304,80,80)];s.lights=id==='fungus_shelter'?[[520,152],[144,144],[464,264]]:[[136,112],[504,112],[264,328],[368,328]];
   maps[id]=scenes[id]=s;MAP_LAYERS[id]={foreground:image,background:{type:'solid',color:id==='fungus_shelter'?'#081313':'#11121b'}};
  }
  const add=(map,id,x,y,label)=>scenes[map].points.push({id,x,y,label});
  add('disruption_report','covertRoad',328,344,'Continue: Quiet Knives');
  for(const[map,entries]of [
   ['covert_briefing',[['covertBrief',328,200,'[Plan the covert operations]'],['marketRoad',328,344,'[Go to the market]']]],
   ['kantaria_market',[['marketSurvey',232,200,'[Listen at the market stalls]'],['marketStir',328,216,'[Turn the crowd against the occupation]'],['patrolRoad',328,344,'[Intercept a militia patrol]']]],
   ['kantaria_patrol_lane',[['covertPatrolFight',328,216,'[Ambush the militia patrol]'],['framePatrol',328,216,'[Leave a false account of the attack]'],['guildRoad',328,344,'[Go to the labor guild]']]],
   ['kantaria_guild',[['guildEntry',232,200,'[Get past the guild clerk]'],['alterGuildRecords',424,184,'[Tamper with the guild records]'],['manorRoad',328,344,'[Approach Narikopolus Manor]']]],
   ['kantaria_manor',[['manorSurvey',328,200,'[Observe the Reclamation agents]'],['takeManorArtifacts',424,200,'[Steal the displayed artifacts]'],['innReturn',328,344,'[Return to the Uskwood]']]],
   ['uskwood_last_night',[['uskwoodEscapeFight',328,216,'[Fight through the Uskwood]'],['cavesRoad',328,344,'[Escape to the caves]']]],
   ['fungus_shelter',[['caveRest',232,200,'[Rest in the shelter]'],['corrineArrival',328,200,'[Meet the assigned liaison]'],['covertEnd',328,344,'[Prepare the next operation]']]]
  ])for(const[id,x,y,label]of entries)add(map,id,x,y,label);
  Object.assign(NAMES,{market_trader:'Market Trader',guild_clerk:'Guild Clerk'});
  Object.assign(JOURNEYS,{covert_briefing:'The docks and towers have been hit. The company turns to unrest, false reports and theft to undermine the occupation.',kantaria_market:'Trade continues despite the damaged docks. The company moves among Kantaria’s market stalls and listens to the crowd.',kantaria_patrol_lane:'Leave the market behind and find an isolated militia patrol. The company intends to conceal its responsibility for the attack.',kantaria_guild:'The labor guild keeps records that help the town function. The company enters to tamper with them.',kantaria_manor:'Narikopolus Manor is occupied by Glorious Reclamation agents. The company seeks the valuable artifacts inside.',uskwood_last_night:'The stolen artifacts are secured. The company returns to the Uskwood as its activities make Kantaria increasingly dangerous.',fungus_shelter:'Fire has destroyed the company’s shelter at the Uskwood. They withdraw, exhausted and wounded, into damp caves to recover.'});
 }
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);}
 function mapImage(){return quest.chapter13?art[scene]:null;}
 function roster(){return quest.chapter13?party:null;}
 function points(){
  if(!quest.chapter12Complete)return null;if(!quest.chapter13)return scene==='disruption_report'?[point('covertRoad')]:[];if(quest.chapter13Complete)return [];
  const id=({covert_briefing:quest.covertBriefed?'marketRoad':'covertBrief',kantaria_market:!quest.marketSurveyed?'marketSurvey':!quest.marketRiot?'marketStir':'patrolRoad',kantaria_patrol_lane:!quest.patrolAmbushed?'covertPatrolFight':!quest.falseBlame?'framePatrol':'guildRoad',kantaria_guild:!quest.guildEntered?'guildEntry':!quest.guildRecordsTampered?'alterGuildRecords':'manorRoad',kantaria_manor:!quest.manorObserved?'manorSurvey':!quest.manorArtifactsTaken?'takeManorArtifacts':'innReturn',uskwood_last_night:quest.escapeOpened?'cavesRoad':'uskwoodEscapeFight',fungus_shelter:!quest.caveRested?'caveRest':!quest.corrineAssigned?'corrineArrival':'covertEnd'})[scene];return [point(id)].filter(Boolean);
 }
 const target=()=>points()?.[0]||null;
 function goal(){if(!quest.chapter12Complete)return null;if(!quest.chapter13)return 'Continue: Kantaria’s covert operations.';if(quest.chapter13Complete)return 'Quiet Knives complete · The cave refuge is established.';return ({covertRoad:'Continue the campaign.',covertBrief:'Plan the covert operations.',marketRoad:'Go to the market.',marketSurvey:'Listen at Kantaria’s market stalls.',marketStir:'Stir unrest against the occupation.',patrolRoad:'Find an isolated militia patrol.',covertPatrolFight:'Ambush the militia patrol.',framePatrol:'Plant a false account of the ambush.',guildRoad:'Enter the labor guild.',guildEntry:'Get past the clerk and reach the records.',alterGuildRecords:'Tamper with the labor guild records.',manorRoad:'Approach Narikopolus Manor.',manorSurvey:'Observe the manor’s Reclamation agents.',takeManorArtifacts:'Steal the manor artifacts.',innReturn:'Return to the Uskwood.',uskwoodEscapeFight:quest.uskwoodBurned?'Fight a path out of the burning Uskwood.':'Face the fight at the Uskwood.',cavesRoad:'Leave the burning inn for the caves.',caveRest:'Rest in the damp cave shelter.',corrineArrival:'Meet Corrine, the assigned liaison.',covertEnd:'Review the next targets.'})[target()?.id]||'Continue the operation.';}
 function npcs(){if(!quest.chapter13)return null;
  if(scene==='covert_briefing')return [{id:'loredana',x:280,y:168}];
  if(scene==='kantaria_market')return [{id:'market_trader',x:216,y:184},{id:'guild_clerk',x:440,y:216},...[[264,248],[376,248],[408,184]].map(([x,y],i)=>({id:'market_trader',x,y}))];
  if(scene==='kantaria_patrol_lane')return quest.patrolAmbushed?[]:[{id:'kantaria_guard',x:264,y:208},{id:'kantaria_guard',x:392,y:208}];
  if(scene==='kantaria_guild')return quest.guildEntered?[]:[{id:'guild_clerk',x:216,y:176}];
  if(scene==='kantaria_manor')return quest.manorObserved?[]:[{id:'kantaria_guard',x:264,y:192},{id:'kantaria_guard',x:392,y:192}];
  if(scene==='fungus_shelter'&&quest.caveRested)return [{id:'corrine',x:328,y:168}];return [];
 }
 function drawNPC(u){if(u.id!=='corrine')return false;drawQuestgiver('corrine',u.x,u.y,62);return true;}
 function fight(kind,count){applyProgression();seedParty(...scenes[scene].spawn);save();startBattle(0,false,{kind,enemies:Array.from({length:count},(_,i)=>({id:'kantaria_guard',name:(kind==='covert_patrol'?'Militia':'Inn Foe')+' '+(i+1),hp:STATS.kantaria_guard.hp,max:STATS.kantaria_guard.hp}))});}
 async function afterBattle(kind){if(kind==='covert_patrol'){quest.patrolAmbushed=true;await say('Chronicle','The militia patrol is defeated. The company prepares to put the blame elsewhere.');}else if(kind==='covert_escape'){quest.escapeOpened=true;await say('freya','There is a way out. Everyone, move!');await say('Chronicle','The fight has opened a route out of the burning inn. The Uskwood can no longer shelter them.');}else return;save();paintParty();updateObjective();}
 async function interact(id){
  if(id==='covertRoad'){if(!quest.chapter12Complete||quest.chapter13)return false;quest.chapter13=true;await travel('covert_briefing',328,344);}
  else if(!points()?.some(p=>p.id===id))return false;
  else if(id==='covertBrief'){await say('freya','The docks and towers are only part of the occupation’s strength. Now we undermine its hold on the town.');await say('jason','The market, the guild’s records, and the manor. Trouble they cannot solve with another patrol.');quest.covertBriefed=true;}
  else if(id==='marketRoad')await travel('kantaria_market',328,344);
  else if(id==='marketSurvey'){await say('market_trader','The docks are ruined and everyone has an opinion about what comes next. I still have a stall to keep open.');await say('freya','Then tell me what the occupation has done for your business.');await say('Chronicle','The company listens, watching where the crowd gathers.');quest.marketSurveyed=true;}
  else if(id==='marketStir'){const choice=await say('Chronicle','Who will address the gathering crowd?',['[Let Freya speak]','[Let Jason speak]']);await say(choice===0?'freya':'jason',choice===0?'They promised you order. Look around you. Is this what that promise was worth?':'Their banners do not fill your cupboards. Ask who benefits while you struggle.');await say('Chronicle','The company fans the market’s anger into a riot. Shouts spread between the stalls as people turn against the occupation.');quest.marketRiot=true;await journeyCard('Kantaria Market · Unrest','The party has caused a riot at the market. They leave the crowd behind and turn their attention to the militia patrols.');}
  else if(id==='patrolRoad')await travel('kantaria_patrol_lane',328,344);
  else if(id==='covertPatrolFight'){await say('freya','An isolated patrol. Keep the attack away from the crowd.');fight('covert_patrol',3);log('Patrol ambush · Defeat the militia.');}
  else if(id==='framePatrol'){await say('freya','The report will point away from us.');await say('Chronicle','The party frames Kantaria’s homeless freed slaves for the militia attacks. The accusation is false: the company carried out the ambush.');quest.falseBlame=true;}
  else if(id==='guildRoad')await travel('kantaria_guild',328,344);
  else if(id==='guildEntry'){await say('guild_clerk','The guild’s records are not open to casual visitors.');await say('jason','We have business to settle. You need not trouble yourself with every page.');await say('Chronicle','While the clerk is occupied, the company gains access to the records room.');quest.guildEntered=true;}
  else if(id==='alterGuildRecords'){await say('Chronicle','The company burglarizes the labor guild and tampers with its records. They leave the paperwork compromised.');await say('jamal','A quiet job. Paper hardly ever screams.');quest.guildRecordsTampered=true;}
  else if(id==='manorRoad')await travel('kantaria_manor',328,344);
  else if(id==='manorSurvey'){await say('Chronicle','Glorious Reclamation agents occupy Narikopolus Manor. The party observes their movements before slipping into the gallery.');await say('jamal','Let them watch the entrances. We only need a moment inside.');quest.manorObserved=true;}
  else if(id==='takeManorArtifacts'){await say('Chronicle','The company steals priceless artifacts from Narikopolus Manor beneath the agents’ noses. They secure the stolen objects for removal.');await say('guapo','I appreciate a room that has already sorted its valuables for us.');quest.manorArtifactsTaken=true;}
  else if(id==='innReturn'){quest.uskwoodReturned=true;await travel('uskwood_last_night',328,344);}
  else if(id==='uskwoodEscapeFight'){if(!quest.uskwoodBurned){await journeyCard('The Uskwood · Fireballs','A fight erupts at the Uskwood. Fireballs tear through the inn, destroying the company’s shelter. They must fight their way out.');quest.uskwoodBurned=true;}fight('covert_escape',3);log('The Uskwood burns · Open an escape route.');}
  else if(id==='cavesRoad'){quest.cavesReached=true;await travel('fungus_shelter',328,344);}
  else if(id==='caveRest'){await say('Chronicle','Exhausted and wounded, the company shelters in damp, plague-ridden caves. Here they wait and recover.');for(const u of units){hp[u.id]=STATS[u.id].hp;uses[u.id]=0;}potions=2;mendUses=2;quest.caveRested=true;await say('guapo','A cave. Damp, miserable, and mercifully difficult to invoice.');}
  else if(id==='corrineArrival'){await say('Chronicle','Corrine is assigned to Captain Freya’s team as liaison. She joins them at their cave refuge.');await say('corrine','Captain, I have been assigned as your liaison. We will keep your company connected while you continue the operation.');await say('freya','Then you know where to find us. Kantaria is not finished.');quest.corrineAssigned=true;}
  else if(id==='covertEnd'){await journeyCard('Chapter Thirteen · Quiet Knives','The market is in unrest, the guild records compromised, and the manor artifacts stolen. The Uskwood is lost. From their cave refuge, the company prepares to strike at the rebellion’s remaining sources of income and equipment.');quest.chapter13Complete=true;}
  else return false;save();paintParty();updateObjective();return true;
 }
 function effects(g,t){if(!quest.chapter13)return;g.save();if(scene==='uskwood_last_night'&&quest.uskwoodBurned){for(const[x,y]of [[144,120],[496,152],[328,104]])for(let i=0;i<7;i++){const phase=reduce.matches?i:Math.floor(t*7)+i;const h=12+((phase*7+i*11)%7)*2;const fx=x-22+i*7,fy=y-h;g.fillStyle='#8f241c';g.fillRect(fx-2,fy+6,10,h-4);g.fillStyle='#d74d20';g.fillRect(fx,fy+2,6,h);g.fillRect(fx+2,fy-2,2,6);g.fillStyle='#ed922e';g.fillRect(fx+2,fy+7,4,h-5);g.fillStyle='#f6ca69';g.fillRect(fx+2,y-6,2,6);if(!reduce.matches&&phase%4===0){g.fillStyle='#ee9e44';g.fillRect(fx+2,fy-8,2,2);}}}else if(scene==='fungus_shelter'&&!reduce.matches){g.globalAlpha=.04+.015*Math.sin(t*1.2);g.fillStyle='#89bca4';g.fillRect(128,144,384,176);}g.restore();}
 return {install,load,mapImage,roster,points,target,goal,npcs,drawNPC,afterBattle,interact,effects,chain};
})();
