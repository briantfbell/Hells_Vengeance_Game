"use strict";
window.CovertArc=(()=>{
 const maps={},party=['freya','jamal','jason','draymus','guapo','reese'];
 const chain=['chapter13','covertBriefed','marketSurveyed','marketRiot','patrolAmbushed','falseBlame','guildEntered','guildRecordsTampered','manorObserved','manorArtifactsTaken','uskwoodReturned','uskwoodBurned','escapeOpened','cavesReached','caveRested','corrineAssigned','chapter13Complete'];
 const patrol=[{id:'kantaria_guard',x:224,y:184},{id:'kantaria_guard',x:288,y:168},{id:'kantaria_guard',x:352,y:184}];
 const marketCrowd=[{id:'market_trader',x:216,y:184},{id:'guild_clerk',x:440,y:216},{id:'market_trader',x:248,y:248},{id:'guild_clerk',x:376,y:248},{id:'market_trader',x:408,y:152}];
 const innAttackers=[{id:'kantaria_guard',x:240,y:184},{id:'kantaria_guard',x:328,y:176},{id:'kantaria_guard',x:416,y:184}];
 const innFireSites=[[148,142,18],[326,133,21],[484,158,16],[470,252,15]];
 let crowdMovesAt=null;
 const r=(x,y,w,h)=>({x,y,w,h});
 function install(){
  for(const[id,name,image]of [['covert_briefing','The Uskwood · Quiet Knives','uskwood-inn-v1.png'],['kantaria_market','Kantaria · Market Unrest','kantaria-market-v1.png'],['kantaria_patrol_lane','Kantaria · The Patrol Route','kantaria-market-v1.png'],['kantaria_guild','Kantaria · Labor Guild','kantaria-guild-v1.png'],['kantaria_manor','Kantaria · Narikopolus Manor','kantaria-manor-v1.png'],['uskwood_last_night','The Uskwood · No Shelter Left','uskwood-inn-v1.png'],['fungus_shelter','Fungus Caves · A Cold Refuge','kantaria-caves-v1.png']]){
   const s=structuredClone(scenes.uskwood_inn);s.name=name;s.image=image;s.points=[];s.blocks=[];s.spawn=[328,344];s.walk=[r(144,160,352,144),r(288,304,80,80)];s.lights=id==='fungus_shelter'?[[520,152],[144,144],[464,264]]:[[136,112],[504,112],[264,328],[368,328]];
   if(id==='kantaria_market'||id==='kantaria_patrol_lane')s.walk=[r(288,304,64,80),r(144,128,352,192)];
   if(id==='kantaria_guild'){
    s.walk=[r(280,288,80,96),r(128,144,384,160),r(208,128,288,32)];
    s.lights=[[120,88],[232,56],[376,56],[504,64],[252,308],[388,308]];
   }
   if(id==='kantaria_manor'){
    s.walk=[r(280,288,80,96),r(128,144,384,160),r(416,112,80,48)];
    s.lights=[[124,64],[216,64],[424,64],[504,64],[252,308],[388,308]];
   }
   maps[id]=scenes[id]=s;MAP_LAYERS[id]={foreground:image,background:{type:'solid',color:id==='fungus_shelter'?'#081313':'#11121b'}};
  }
  const add=(map,id,x,y,label)=>scenes[map].points.push({id,x,y,label});
  add('disruption_report','covertRoad',328,344,'Continue: Quiet Knives');
  for(const[map,entries]of [
   ['covert_briefing',[['covertBrief',328,200,'[Plan the covert operations]'],['marketRoad',328,344,'[Go to the market]']]],
   ['kantaria_market',[['marketSurvey',200,200,'Listen at the market stalls'],['marketStir',328,200,'Address the gathered crowd'],['patrolRoad',328,344,'[Intercept a militia patrol]']]],
   ['kantaria_patrol_lane',[['covertPatrolFight',288,216,'Ambush the militia patrol'],['framePatrol',288,184,'Plant a false account of the ambush'],['guildRoad',328,344,'[Go to the labor guild]']]],
   ['kantaria_guild',[['guildEntry',168,152,'[Distract the guild clerk]'],['alterGuildRecords',456,136,'[Tamper with the guild records]'],['manorRoad',328,344,'[Approach Narikopolus Manor]']]],
   ['kantaria_manor',[['manorSurvey',328,232,'[Watch the Reclamation patrol]'],['takeManorArtifacts',328,152,'[Steal the displayed artifacts]'],['innReturn',328,344,'[Return to the Uskwood]']]],
   ['uskwood_last_night',[['uskwoodEscapeFight',328,216,'[Investigate the commotion]'],['cavesRoad',328,344,'[Escape to the caves]']]],
   ['fungus_shelter',[['caveRest',232,200,'[Rest in the shelter]'],['corrineArrival',328,200,'[Meet the assigned liaison]'],['covertEnd',328,344,'[Prepare the next operation]']]]
  ])for(const[id,x,y,label]of entries)add(map,id,x,y,label);
  Object.assign(NAMES,{market_trader:'Market Trader',guild_clerk:'Guild Clerk'});
  Object.assign(JOURNEYS,{covert_briefing:'The docks and towers have been hit. The company turns to unrest, false reports and theft to undermine the occupation.',kantaria_market:'Trade continues despite the damaged docks. The company moves among Kantaria’s market stalls and listens to the crowd.',kantaria_patrol_lane:'After the crowd disperses, an isolated militia patrol passes through the empty market. The company circles back to intercept it.',kantaria_guild:'The labor guild keeps records that help the town function. The company enters to tamper with them.',kantaria_manor:'Narikopolus Manor is occupied by Glorious Reclamation agents. The company seeks the valuable artifacts inside.',uskwood_last_night:'The stolen artifacts are secured. The company returns to the Uskwood as its activities make Kantaria increasingly dangerous.',fungus_shelter:'Fire has destroyed the company’s shelter at the Uskwood. They withdraw, exhausted and wounded, into damp caves to recover.'});
 }
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);}
 function mapImage(){return quest.chapter13?art[scene]:null;}
 function roster(){return quest.chapter13?party:null;}
 function points(){
  if(!quest.chapter12Complete)return null;if(!quest.chapter13)return scene==='disruption_report'?[point('covertRoad')]:[];if(quest.chapter13Complete)return [];
  const id=({covert_briefing:quest.covertBriefed?'marketRoad':'covertBrief',kantaria_market:!quest.marketSurveyed?'marketSurvey':!quest.marketRiot?'marketStir':'patrolRoad',kantaria_patrol_lane:!quest.patrolAmbushed?'covertPatrolFight':!quest.falseBlame?'framePatrol':'guildRoad',kantaria_guild:!quest.guildEntered?'guildEntry':!quest.guildRecordsTampered?'alterGuildRecords':'manorRoad',kantaria_manor:!quest.manorObserved?'manorSurvey':!quest.manorArtifactsTaken?'takeManorArtifacts':'innReturn',uskwood_last_night:quest.escapeOpened?'cavesRoad':'uskwoodEscapeFight',fungus_shelter:!quest.caveRested?'caveRest':!quest.corrineAssigned?'corrineArrival':'covertEnd'})[scene];const objective=point(id);
  if(!objective)return [];
  return id==='uskwoodEscapeFight'&&quest.uskwoodBurned?[{...objective,label:'[Fight through the burning inn]'}]:[objective];
 }
 const target=()=>points()?.[0]||null;
 function goal(){if(!quest.chapter12Complete)return null;if(!quest.chapter13)return 'Continue: Kantaria’s covert operations.';if(quest.chapter13Complete)return 'Quiet Knives complete · The cave refuge is established.';return ({covertRoad:'Continue the campaign.',covertBrief:'Plan the covert operations.',marketRoad:'Go to the market.',marketSurvey:'Listen at Kantaria’s market stalls.',marketStir:'Stir unrest against the occupation.',patrolRoad:'Find an isolated militia patrol.',covertPatrolFight:'Ambush the militia patrol.',framePatrol:'Plant a false account of the ambush.',guildRoad:'Enter the labor guild.',guildEntry:'Get past the clerk and reach the records.',alterGuildRecords:'Reach the ledgers along the far wall.',manorRoad:'Approach Narikopolus Manor.',manorSurvey:'Observe the manor’s Reclamation agents.',takeManorArtifacts:'Take the artifacts from the central display.',innReturn:'Return to the Uskwood.',uskwoodEscapeFight:quest.uskwoodBurned?'Fight a path out of the burning Uskwood.':'Investigate the commotion in the inn.',cavesRoad:'Leave the burning inn for the caves.',caveRest:'Rest in the damp cave shelter.',corrineArrival:'Meet Corrine, the assigned liaison.',covertEnd:'Review the next targets.'})[target()?.id]||'Continue the operation.';}
 function npcs(){if(!quest.chapter13)return null;
  if(scene==='covert_briefing')return [{id:'loredana',x:280,y:168}];
  if(scene==='kantaria_market'){
   if(quest.marketRiot)return [];
   if(crowdMovesAt===null)return marketCrowd;
   const progress=Math.min(1,(performance.now()-crowdMovesAt)/750);
   return marketCrowd.map((actor,index)=>({...actor,x:Math.round(actor.x+(index%2?1:-1)*progress*48),y:Math.round(actor.y+progress*(index<2?12:30))}));
  }
  if(scene==='kantaria_patrol_lane')return quest.patrolAmbushed?[]:patrol;
  if(scene==='kantaria_guild')return [{id:'guild_clerk',x:quest.guildEntered?136:168,y:quest.guildEntered?232:144}];
  if(scene==='kantaria_manor')return quest.manorObserved
   ? [{id:'kantaria_guard',x:472,y:128},{id:'kantaria_guard',x:472,y:176}]
   : [{id:'kantaria_guard',x:248,y:184},{id:'kantaria_guard',x:392,y:184}];
  if(scene==='uskwood_last_night')return quest.escapeOpened?[]:innAttackers;
  if(scene==='fungus_shelter'&&quest.caveRested)return [{id:'corrine',x:328,y:168}];return [];
 }
 function drawNPC(u){if(u.id!=='corrine')return false;drawQuestgiver('corrine',u.x,u.y,62);return true;}
 function fight(kind,count){applyProgression();seedParty(...scenes[scene].spawn);save();startBattle(0,false,{kind,enemies:Array.from({length:count},(_,i)=>({id:'kantaria_guard',name:(kind==='covert_patrol'?'Militia':'Inn Foe')+' '+(i+1),hp:STATS.kantaria_guard.hp,max:STATS.kantaria_guard.hp}))});}
 async function afterBattle(kind){if(kind==='covert_patrol'){quest.patrolAmbushed=true;seedParty(288,216);save();await say('Chronicle','The militia patrol is down. The square is still empty.');}else if(kind==='covert_escape'){quest.escapeOpened=true;save();await say('freya','The front door is clear. Everyone out!');}else return;save();paintParty();updateObjective();}
 async function interact(id){
  if(id==='covertRoad'){if(!quest.chapter12Complete||quest.chapter13)return false;quest.chapter13=true;await travel('covert_briefing',328,344);}
  else if(!points()?.some(p=>p.id===id))return false;
  else if(id==='covertBrief'){await say('freya','Word about the docks will have reached the market. Let’s hear what people are saying before we speak.');await say('jason','The guild’s records and the manor can wait until the patrols have their hands full.');quest.covertBriefed=true;}
  else if(id==='marketRoad')await travel('kantaria_market',328,344);
  else if(id==='marketSurvey'){await say('market_trader','The docks are ruined and everyone has an opinion about what comes next. I still have a stall to keep open.');await say('freya','What has the occupation done for your business?');await say('market_trader','Raised the fees and sent soldiers to collect them. Now look how many stalls have shut.');quest.marketSurveyed=true;}
  else if(id==='marketStir'){
   const choice=await say(null,'The traders turn to listen.', ['[Let Freya speak]','[Let Jason speak]']);
   await say(choice===0?'freya':'jason',choice===0?'They promised you order. Look around you. Is this what that promise was worth?':'Their banners do not fill your cupboards. Ask who benefits while you struggle.');
   if(!reduce.matches){
    const token=epoch;
    crowdMovesAt=performance.now();
    try{await delay(750);if(token!==epoch)throw CANCEL;}finally{crowdMovesAt=null;}
   }
   quest.marketRiot=true;
   save();
   await say('Chronicle','Shouts spread between the stalls. The crowd surges out of the square as the riot spills into the neighboring streets.');
  }
  else if(id==='patrolRoad')await travel('kantaria_patrol_lane',328,344);
  else if(id==='covertPatrolFight'){await say('reese','Three militia. No other patrol in sight.');await say(null,'The patrol passes the empty stalls.', ['[Spring the ambush]']);fight('covert_patrol',patrol.length);log('Patrol ambush · Defeat the militia.');}
  else if(id==='framePatrol'){await say(null,'[Leave the false account]', ['[Plant the forged report]']);await say('Chronicle','The planted account falsely blames Kantaria’s homeless freed slaves. Freya’s company carried out the ambush.');quest.falseBlame=true;}
  else if(id==='guildRoad')await travel('kantaria_guild',328,344);
  else if(id==='guildEntry'){
   await say('guild_clerk','If it’s about the new fees, you’ll have to wait.');
   await say('jason','I can wait. Would you show me the fee schedule by the window?');
   await say(null,'The clerk reaches for the schedule.', ['[Slip past the desk]']);
   quest.guildEntered=true;
  }
  else if(id==='alterGuildRecords'){
   await say('jamal','Here are the guild ledgers. Jason, keep him talking.');
   await say(null,'The records are within reach.', ['[Tamper with the ledgers]']);
   quest.guildRecordsTampered=true;
   save();
   await say('Chronicle','The company alters the guild records and leaves the books in their place.');
  }
  else if(id==='manorRoad')await travel('kantaria_manor',328,344);
  else if(id==='manorSurvey'){
   await say('reese','Two Reclamation agents. Watch the door on the right.');
   await say(null,'The guards cross the gallery on their rounds.', ['[Wait for the guards to turn away]']);
   quest.manorObserved=true;
   save();
   await say('jamal','They’re by the door. Straight to the display, then back the way we came.');
  }
  else if(id==='takeManorArtifacts'){
   await say(null,'The priceless artifacts are within reach. The guards are still facing the side door.', ['[Wrap and take the artifacts]']);
   quest.manorArtifactsTaken=true;
   save();
   await say('guapo','Priceless and already sorted. How considerate.');
  }
  else if(id==='innReturn'){quest.uskwoodReturned=true;await travel('uskwood_last_night',328,344);}
  else if(id==='uskwoodEscapeFight'){
   if(!quest.uskwoodBurned){
    await say('draymus','Get down!');
    quest.uskwoodBurned=true;
    save();
    updateObjective();
    await say('Chronicle','Fireballs tear through the Uskwood. The rafters catch, and three attackers close in through the smoke.');
   }else{
    fight('covert_escape',innAttackers.length);
    log('The Uskwood burns · Open an escape route.');
   }
  }
  else if(id==='cavesRoad'){quest.cavesReached=true;await travel('fungus_shelter',328,344);}
  else if(id==='caveRest'){await say('Chronicle','Exhausted and wounded, the company shelters in damp, plague-ridden caves. Here they wait and recover.');for(const u of units){hp[u.id]=STATS[u.id].hp;uses[u.id]=0;}potions=2;mendUses=2;quest.caveRested=true;save();await say('guapo','A cave. Damp, miserable, and mercifully difficult to invoice.');}
  else if(id==='corrineArrival'){await say('Chronicle','Corrine is assigned to Captain Freya’s team as liaison. She joins them at their cave refuge.');await say('corrine','Captain, I have been assigned as your liaison. We will keep your company connected while you continue the operation.');await say('freya','Then you know where to find us. Kantaria is not finished.');quest.corrineAssigned=true;}
  else if(id==='covertEnd'){await journeyCard('Chapter Thirteen · Quiet Knives','The market is in unrest, the guild records compromised, and the manor artifacts stolen. The Uskwood is lost. From their cave refuge, the company prepares to strike at the rebellion’s remaining sources of income and equipment.');quest.chapter13Complete=true;}
  else return false;save();paintParty();updateObjective();return true;
 }
 function effects(g,t){
  if(!quest.chapter13||scene!=='uskwood_last_night'||!quest.uskwoodBurned)return;
  const time=reduce.matches?0:t;
  const glow=g.createRadialGradient(320,144,20,320,144,252);
  glow.addColorStop(0,'#ba411d52');
  glow.addColorStop(1,'#451a1600');
  g.save();
  g.fillStyle=glow;
  g.fillRect(64,32,512,310);
  for(const [x,y,height] of innFireSites){
   for(let i=0;i<5;i++){
    const drift=(time*.24+i*.21)%1;
    const size=6+Math.floor(drift*15);
    const smokeX=x+Math.round((i-2)*4+drift*36);
    const smokeY=y-height-Math.floor(drift*59);
    g.globalAlpha=(1-drift)*.28;
    g.fillStyle=i%2?'#32272b':'#483735';
    g.fillRect(smokeX-size,smokeY,size*2,size);
    g.fillRect(smokeX-size+4,smokeY-4,size*2-8,4);
   }
   g.globalAlpha=1;
   for(let i=0;i<9;i++){
    const fx=x-18+i*4;
    const tip=Math.floor(height*(.45+.4*Math.sin(i/8*Math.PI)))+((Math.floor(time*9)*5+i*7)%8);
    g.fillStyle='#8b281a';
    g.fillRect(fx-2,y-tip+5,6,tip-4);
    g.fillStyle='#e05225';
    g.fillRect(fx,y-tip,4,tip);
    g.fillStyle='#f4a63d';
    g.fillRect(fx+1,y-Math.floor(tip*.55),2,Math.floor(tip*.55));
    if(i%2===0){
     g.fillStyle='#ffe39b';
     g.fillRect(fx+1,y-6,2,5);
    }
   }
  }
  g.restore();
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,drawNPC,afterBattle,interact,effects,chain};
})();
