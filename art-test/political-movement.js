"use strict";
window.PoliticalMovement=(()=>{

 const maps={},gateRushDuration=640;let mountedStart=0,gateRush=null,deputyArrival=null,arrestBeat=null;
 function install(){
  for(const [id,base,name,spawn]of [['gate_watch','longacre_jail','Chapter Six · The Open Gate',[328,312]],['church_watch','longacre_square','Longacre · The Church Standoff',[328,296]],['escape_jail','longacre_jail','Longacre · The Broken Jail',[328,312]],['gramel_gate','longacre_jail','The Gramel Residence',[328,312]],['execution_manor','scarlet_manor','Scarlet Manor · The Execution Order',[328,312]],['execution_square','longacre_square','Longacre · Dusk in the Square',[328,296]]]){maps[id]={...structuredClone(scenes[base]),name,spawn,points:[]};scenes[id]=maps[id];MAP_LAYERS[id]={foreground:id==='execution_square'?'execution-square-v1.png':scenes[base].image,background:{type:'solid',color:'#111820'}};}
  for(const id of ['gate_watch','escape_jail','gramel_gate']){maps[id].image='longacre-jail-open-v1.png';MAP_LAYERS[id].foreground=maps[id].image;MAP_LAYERS[id].openGatePatch=true;}maps.execution_square.image='execution-square-v1.png';maps.execution_square.blocks.push({x:240,y:176,w:160,h:64});
  const add=(map,id,x,y,label)=>scenes[map].points.push({id,x,y,label});
  add('ash_house','movementRoad',328,328,'Continue: Political Movement');add('gate_watch','gateDisturbance',200,208,'Investigate the open gate');add('gate_watch','gateReturn',328,352,'Bring the creature to Razelago');add('ash_house','feyReport',328,160,'Ask Razelago about the creature');add('ash_house','churchStandRoad',328,352,'Approach the church');add('church_watch','churchConfront',328,184,'Approach Allamar');add('church_watch','churchRestRoad',328,352,'Return to Ash House');add('ash_house','watchRoad',328,352,'Rest, then watch the church');add('church_watch','watchPost',216,264,'Watch the church');add('church_watch','churchWatch',440,264,'Stop the injured deputy');add('church_watch','escapeRoad',104,304,'Hurry to the jail');add('escape_jail','cimriAccount',456,224,'Check on Cimri');add('escape_jail','escapeTrail',200,208,'Follow the escape trail');add('escape_jail','trailStreet',520,296,'Check the street route');add('escape_jail','trailWoods',168,208,'Check the forest route');add('escape_jail','freeBolgart',224,256,'Release Bolgart');add('escape_jail','ordersRoad',328,352,'Meet Fex the next morning');add('execution_manor','executionOrders',328,208,'Hear the Archbaron’s orders');add('execution_manor','gramelRoad',328,352,'Go to the Gramel residence');add('gramel_gate','arrestBo',488,248,'Apprehend Bo Gramel');add('gramel_gate','squareExecutionRoad',328,352,'Prepare the square');add('execution_square','prepareExecution',328,264,'Arrange the dusk gathering');add('execution_square','executionStart',328,264,'Begin the dusk confrontation');add('execution_square','movementReport',328,352,'Close the chapter');
  Object.assign(NAMES,{ovinnik:'Ovinnik',bo_gramel:'Bo Gramel',dent_gramel:'Dent Gramel',false_knight:'Angel Knight',rioter1:'Rioter',rioter2:'Rioter',loyal_deputy:'Injured Deputy',acolyte1:'Church Acolyte',acolyte2:'Church Acolyte'});
  // Encounter tuning, not exported or reconstructed historical sheet totals.
  STATS.ovinnik={hp:38,ac:14,atk:5,dmg:[2,4,1]};STATS.false_knight={hp:30,ac:13,atk:3,dmg:[1,6,1]};for(const id of ['rioter1','rioter2'])STATS[id]={hp:16,ac:12,atk:3,dmg:[1,6,1]};
  for(const[id,base]of [['rioter1','deputy3'],['rioter2','deputy4'],['loyal_deputy','deputy1'],['acolyte1','townswoman'],['acolyte2','townswoman']])FUTURE_NPCS[id]=structuredClone(FUTURE_NPCS[base]);
  for(const[id,row]of [['bo_gramel',0],['dent_gramel',1],['false_knight',2],['masked_human',3]])FUTURE_NPCS[id]={source:'movementCast',frame:MOVEMENT_FRAMES['political-cast-v1.png'][row].frames[0]};FUTURE_NPCS.masked_halfling={source:'movementCast',frame:MOVEMENT_FRAMES['political-cast-v1.png'][3].frames[2]};FUTURE_NPCS.ovinnik={source:'ovinnik',frame:MOVEMENT_FRAMES['ovinnik-idle-v1.png'][0].frames[0]};COMBAT_IDLES.ovinnik=MOVEMENT_FRAMES['ovinnik-idle-v1.png'][0];COMBAT_IDLES.false_knight=window.LORE_CREATURE_IDLES?.false_knight||MOVEMENT_FRAMES['political-cast-v1.png'][2];if(window.LORE_CAST?.false_knight)FUTURE_NPCS.false_knight=LORE_CAST.false_knight;
  Object.assign(JOURNEYS,{gate_watch:'The western gate has been opened despite the party’s decree. Investigate the gate kept by retired artillery veterans Bo and Dent Gramel.',church_watch:'The church doors are watched by Allamar and her sons. Approach carefully; the party has not fully recovered from the gate encounter.',escape_jail:'An injured deputy reports a jailbreak. Find Cimri, establish who escaped, and inspect the trail.',gramel_gate:'Fex demands a public execution after the jailbreak. The party has chosen Bo Gramel and goes to her home by the gate.',execution_manor:'The next morning, Fex demands a public execution after the jailbreak. Hear his orders and decide how the party proceeds.',execution_square:'A guillotine is raised in the church square. Prepare for the announced execution at dusk as townsfolk gather.'});
 }
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);art.movementCast=await loader('political-cast-v1.png');art.ovinnik=await loader('ovinnik-idle-v1.png');art['ovinnik-idle-v1.png']=art.ovinnik;art['political-cast-v1.png']=art.movementCast;art.mounted=await loader('mounted-freya-v1.png');}
 function goal(){if(!quest.chapter5Complete)return null;if(!quest.chapter6)return 'Continue: Political Movement.';if(quest.chapter6Complete)return 'Chapter complete · Riley’s deception is exposed.';return !quest.gateOpened?'Investigate the open western gate.':!quest.ovinnikSubdued?'Subdue the gate’s guardian.':!quest.ovinnikReported?'Bring the living creature to Razelago.':!quest.churchStandoff?'Approach Allamar at the church.':!quest.jailbreakHeard?(scene==='church_watch'?(!quest.watchStarted?'Return to Ash House.':quest.watchHoursPassed?'Stop the injured deputy.':'Take up the watch outside the church.'):'Rest, then watch the church with J’Mal.'):!quest.jailbreakInspected?'Check on Cimri at the jail.':!quest.escapeTrailLost?(quest.escapeTrailFound?'Check the escape routes ['+Object.values(trailChecks).filter(check=>quest[check.flag]).length+'/2].':'Follow the rescuers’ trail.'):!quest.bolgartReleased?'Release Bolgart from custody.':!quest.executionOrdered?'Hear Fex’s orders the next morning.':!quest.boCaptured?'Apprehend Bo at the gate.':!quest.executionPrepared?'Prepare the execution square.':!quest.executionResolved?'Defend the stage at dusk.':'Close the chapter.';}
 function points(){if(scene==='escape_jail'&&quest.chapter6&&quest.escapeTrailFound&&!quest.escapeTrailLost)return ['trailStreet','trailWoods'].filter(id=>!quest[trailChecks[id].flag]).map(id=>point(id));if(!quest.chapter5Complete)return null;if(!quest.chapter6)return scene==='ash_house'?[point('movementRoad')]:null;const byScene={ash_house:!quest.ovinnikReported?'feyReport':!quest.churchStandoff?'churchStandRoad':'watchRoad',gate_watch:quest.ovinnikSubdued?'gateReturn':'gateDisturbance',church_watch:!quest.churchStandoff?'churchConfront':!quest.watchStarted?'churchRestRoad':!quest.jailbreakHeard?(quest.watchHoursPassed?'churchWatch':'watchPost'):'escapeRoad',escape_jail:!quest.jailbreakInspected?'cimriAccount':!quest.escapeTrailLost?(!quest.escapeTrailFound?'escapeTrail':!quest.escapeStreetChecked?'trailStreet':'trailWoods'):!quest.bolgartReleased?'freeBolgart':'ordersRoad',execution_manor:quest.executionOrdered?'gramelRoad':'executionOrders',gramel_gate:quest.boCaptured?'squareExecutionRoad':'arrestBo',execution_square:!quest.executionPrepared?'prepareExecution':!quest.executionResolved?'executionStart':'movementReport'};return byScene[scene]?[point(byScene[scene])]:[];}
 function target(){return points()?.[0]||null;}
 function npcs(){if(!quest.chapter6)return null;if(scene==='gate_watch')return gateActors();
  if(scene==='gramel_gate')return [{id:'bo_gramel',x:488,y:241},{id:'dent_gramel',x:523,y:252}];
  if(scene==='ash_house'&&quest.ovinnikSubdued&&!quest.ovinnikReported)return [...NextChapter.npcs(),{id:'ovinnik',x:366,y:196,pose:'prone',height:32}];
  if(scene==='church_watch')return quest.watchStarted?watchActors():quest.churchStandoff?[]:[{id:'allamar',x:328,y:160},{id:'twin1',x:280,y:176},{id:'twin2',x:376,y:176},{id:'acolyte1',x:232,y:192},{id:'acolyte2',x:424,y:192}];if(scene==='escape_jail')return [{id:'cimri',x:456,y:216,pose:'prone'},{id:'loyal_deputy',x:392,y:256},...(!quest.bolgartReleased?[{id:'bolgart',pose:'stocks',x:224,y:248}]:[])];if(scene==='execution_manor')return [{id:'fex',x:328,y:176}];if(scene==='execution_square'&&mountedStart)return [{id:'mounted_freya',x:328,y:264},{id:reduce.matches||performance.now()-mountedStart>=1300?'riley':'false_knight',x:424,y:248}];if(scene==='execution_square')return quest.executionResolved?[]:[{id:'bo_gramel',x:328,y:216},{id:'loyal_deputy',x:440,y:240}];return null;}
 const trailChecks={
  trailStreet:{flag:'escapeStreetChecked',line:'The prints carry into the streets, then vanish. There’s nothing here I can follow.'},
  trailWoods:{flag:'escapeWoodsChecked',line:'Another set heads toward the woods. They cut off just as abruptly.'}
 };
 async function checkTrail(id){
  const {flag,line}=trailChecks[id];
  if(quest[flag])return;
  await say('freya',line);
  const complete=Object.values(trailChecks).every(check=>check.flag===flag||quest[check.flag]);
  if(complete){
   await say('draymus','Pass Without Trace could do that. We’d need more than missing footprints to say for sure.');
   await say('freya','We’ve lost them. Back to the jail.');
  }
  quest[flag]=true;
  if(complete)quest.escapeTrailLost=true;
 }
 function watchActors(){
  if(!quest.watchHoursPassed)return [];
  if(deputyArrival?.epoch!==epoch)return [{id:'loyal_deputy',x:440,y:256}];
  const progress=reduce.matches?1:Math.min(1,(performance.now()-deputyArrival.start)/900);
  const stumble=progress===1?0:Math.sin(progress*24)*3;
  return [{id:'loyal_deputy',x:520-80*progress,y:280-24*progress+stumble}];
 }
 async function waitAtChurch(){
  await journeyCard('Longacre · Hours after dusk','The square empties. J’Mal watches the doors for hours. Nobody enters or leaves.',()=>{});
  const token=epoch;
  deputyArrival={epoch:token,start:performance.now()};
  quest.watchHoursPassed=true;
  await delay(reduce.matches?0:900);
  if(token!==epoch)return;
  deputyArrival=null;
  await say('Chronicle','A deputy from the jail staggers across the far side of the square. He is barely on his feet.');
 }
 function drawWatch(g){
  if(!soloWatch())return;
  g.save();g.fillStyle='rgba(10,16,31,.26)';g.fillRect(0,0,640,400);g.restore();
 }
 function gateActors(){
  if(quest.ovinnikSubdued)return [{id:'ovinnik',x:250,y:254,pose:'prone',height:32}];
  const actors=[{id:'bo_gramel',x:132,y:228},{id:'dent_gramel',x:161,y:239}];
  if(!gateRush||gateRush.epoch!==epoch)return actors;
  const progress=reduce.matches?1:Math.min(1,(performance.now()-gateRush.start)/gateRushDuration);
  actors.push({id:'ovinnik',x:205+45*progress,y:164+90*progress,height:32});
  return actors;
 }
 async function investigateGate(){
  await say('Chronicle','The western gate stands open. Bo and Dent Gramel, the retired artillery veterans who used to tend it, watch from the side of the yard.');
  await say('freya','The decree closed this gate. Who opened it?');
  await say('bo_gramel','Go on, ghost of the gate! Show them what you think of their orders!');
  const token=epoch;
  gateRush={epoch:token,start:performance.now()};
  await delay(reduce.matches?0:gateRushDuration);
  if(token!==epoch)return;
  await say('Chronicle','A tiny, catlike figure springs from the gateway and rushes J’Mal.');
  await rollDice('Draymus · Identify the creature',20,1,0,'Recorded story result',[1]);
  await say('draymus','I can’t place it. J’Mal, get back!');
  await say('Chronicle','The creature’s claws tear into J’Mal before he can retreat. He collapses, bleeding.');
  quest.gateOpened=true;
  gateRush=null;
  save();
  hp.jamal=0;
  paintParty();
  startBattle(0,false,{kind:'ovinnik',opening:'J’Mal is down. Roll initiative and subdue the gate guardian.',enemies:[{id:'ovinnik',name:'Gate Guardian',hp:38,max:38}]});
 }
 function crowd(){if(scene!=='execution_square'||quest.executionResolved)return [];const places=[[136,264],[184,280],[232,296],[280,312],[376,312],[424,296],[472,280],[520,264],[168,232],[488,232],[216,256],[440,264]];return places.map(([x,y],i)=>({id:'execution-citizen-'+i,x,y,dir:'up',variant:i%8,crowd:true,anim:0,step:null}));}
 async function afterBattle(kind){if(kind==='ovinnik'){quest.ovinnikSubdued=true;hp.jamal=Math.max(1,hp.jamal);seedParty(328,312);await say('Chronicle','Jason and Draymus’s magic helps bring the creature down. Bo and Dent retreat indoors in dismay. Though it appears dead at first, it is still breathing.');await say('jason','J’Mal is coming around. Keep the creature alive; Razelago may know what it is.');}else{quest.executionResolved=true;seedParty(328,296);await say('Chronicle','J’Mal’s cut across the knight’s back feels like leather beneath the shining armor. The disguise is coming apart.');await say('draymus','I cast Cause Fear. Let terror take hold of your heart.');await rollDice('Angel Knight · Resist Cause Fear',20,1,0,'Failed save · Frightened · Story roll',[1]);mountedStart=performance.now();await say('Chronicle','The knight fails to resist Draymus’s spell. Supernatural dread overwhelms the rider, who screams and struggles with a panicked mount. Freya charges on Sleipnir and strikes with her naginata. The false armor falls away: the rider is Riley Kels.');mountedStart=0;await say('Chronicle','Riley is killed in the charge. The rioters are crushed and the crowd flees. The party displays Bo and Riley’s heads on pikes as a warning.');}save();paintParty();updateObjective();}
 async function interact(id){if(id==='movementRoad'){if(!quest.chapter5Complete||quest.chapter6||scene!=='ash_house')return false;quest.chapter6=true;quest.guapoReturned=true;quest.guapoAway=false;quest.activeRoster=[...CORE];NextChapter.syncRoster();await journeyCard('Longacre · 21 Neth, 4716','El Guapo reaches Longacre destitute, riding a mule. Eleven days after separating at Remesiana, he rejoins the company.',()=>{seedParty(328,296);NextChapter.refresh();});await journeyCard('Chapter Six · Political Movement','Routine patrols give the party time to recover and resupply. Then a report arrives: the western gate is open despite the decree closing it.',()=>NextChapter.refresh());await travel('gate_watch',328,312);}
 else if(!quest.chapter6)return false;
 else if(id==='gateDisturbance'&&scene==='gate_watch'&&!quest.ovinnikSubdued)await investigateGate();
 else if(id==='gateReturn'&&scene==='gate_watch'&&quest.ovinnikSubdued)await travel('ash_house',328,296);
 else if(id==='feyReport'&&scene==='ash_house'&&quest.ovinnikSubdued&&!quest.ovinnikReported){
  await say('draymus','It came straight out of the gate. I’ve never seen one before. Do you know what it is?');
  await say('razelago','An ovinnik. They attach themselves to a place and defend it fiercely. Keep this one alive. The Archbaron can have it taken away for study.');
  quest.ovinnikReported=true;
 }
 else if(id==='churchStandRoad')await travel('church_watch',328,296);
 else if(id==='churchConfront'&&scene==='church_watch'&&quest.ovinnikReported&&!quest.churchStandoff){
  await say('Chronicle','The party approaches the church before its wounds from the gate have healed. Allamar comes to the doors with her sons and several acolytes.');
  await say('allamar','Last time you came to these doors, a carpenter had to put them back. What business brings you here today?');
  await say('freya','We know where you stand. Keep your people off the street, and we’ll leave it there for today.');
  await say('Chronicle','The two groups hold their ground. Nobody draws a weapon. Freya finally turns the party away from the steps.');
  quest.churchStandoff=true;
 }
 else if(id==='churchRestRoad'&&scene==='church_watch'&&quest.churchStandoff&&!quest.watchStarted)await travel('ash_house',328,296);
 else if(id==='watchRoad'&&scene==='ash_house'&&quest.churchStandoff&&!quest.watchStarted){
  await say('freya','We need time to dress these wounds. J’Mal, watch the church while we rest. Tell us if anyone comes or goes.');
  await journeyCard('Ash House · Evening watch','The others rest at Ash House. J’Mal heads back to the square alone.',()=>{
   NextChapter.refresh();
   quest.watchStarted=true;
   setScene('church_watch',168,280,'right');
  });
 }
 else if(id==='watchPost'&&soloWatch()&&!quest.watchHoursPassed)await waitAtChurch();
 else if(id==='churchWatch'&&soloWatch()&&quest.watchHoursPassed){
  await say('jamal','Hold up. You’re bleeding. What happened?');
  await say('loyal_deputy','I was coming to Ash House. They stormed the jail and knocked me out. Cimri fought them. I think they nearly killed her.');
  await say('jamal','Who did they take?');
  await say('loyal_deputy','Riley Kels. Bolgart’s still there.');
  await say('jamal','Sit down before you fall down. I’ll get the others.');
  await journeyCard('Longacre · The alarm','J’Mal gathers the party at Ash House. They hurry straight to the jail to find Cimri.',()=>{
   quest.jailbreakHeard=true;
   setScene('escape_jail',328,312);
  });
 }
 else if(id==='escapeRoad'&&quest.jailbreakHeard)await travel('escape_jail',328,312);
 else if(id==='cimriAccount'&&scene==='escape_jail'&&quest.jailbreakHeard&&!quest.jailbreakInspected){
  await say('loyal_deputy','Riley’s cell is empty. Bolgart’s still here, just as I said.');
  await say('freya','Cimri. Can you tell us who came in?');
  await say('cimri','Four. Three humans and a halfling, I think. They were masked. I fought until I couldn’t stand.');
  await say('Chronicle','Someone bandaged Cimri’s wounds after she fell. She was unconscious and cannot say who helped her.');
  quest.jailbreakInspected=true;
 }
 else if(id==='escapeTrail'&&scene==='escape_jail'&&quest.jailbreakInspected&&!quest.escapeTrailFound&&!quest.escapeTrailLost){
  await say('freya','There are prints outside the jail. Check where they lead toward the streets and toward the woods.');
  quest.escapeTrailFound=true;
 }
 else if(scene==='escape_jail'&&quest.escapeTrailFound&&!quest.escapeTrailLost&&Object.hasOwn(trailChecks,id))await checkTrail(id);
 else if(id==='freeBolgart'&&scene==='escape_jail'&&quest.escapeTrailLost&&!quest.bolgartReleased){
  await say('freya','Bolgart. You’re free to go.');
  await say('bolgart','You’re letting me go? Then I won’t waste your time asking why.');
  await say('Chronicle','Bolgart walks into the night. With Riley gone, the jail has no prisoners left.');
  quest.bolgartReleased=true;
 }
 else if(id==='ordersRoad'&&scene==='escape_jail'&&quest.bolgartReleased)await travel('execution_manor',328,312);
 else if(id==='executionOrders'&&scene==='execution_manor'&&quest.bolgartReleased&&!quest.executionOrdered){
  await say('fex','You lost a prisoner and let the other walk free. Longacre will take that as permission to defy you.');
  await say('fex','Execute a prisoner in public. I leave the choice of whom to you.');
  await say('freya','The jail’s empty. Riley escaped, and Bolgart’s gone.');
  await say('jamal','Bo Gramel cheered when that creature came for us. I doubt she’s forgotten it either.');
  await say('freya','Then we’ll go to the gate and arrest Bo.');
  quest.executionOrdered=true;
 }
 else if(id==='gramelRoad'&&scene==='execution_manor'&&quest.executionOrdered)await travel('gramel_gate',328,312);
 else if(id==='arrestBo'&&scene==='gramel_gate'&&quest.executionOrdered&&!quest.boCaptured)await arrestBo();
 else if(id==='squareExecutionRoad'&&scene==='gramel_gate'&&quest.boCaptured)await travel('execution_square',328,296);
 else if(id==='prepareExecution'){await journeyCard('Longacre Square · Dusk','A guillotine is prepared. Hundreds gather for Bo’s announced execution. Guards are stationed around the square; Cimri and J’Mal hide among the crowd.');await say('Chronicle','Jason and Draymus address the crowd from the platform. Freya waits on Sleipnir with her naginata. The party has allowed time for the news to spread.');quest.executionPrepared=true;}
 else if(id==='executionStart'){await say('Chronicle','As Jason’s sermon ends, armed rioters rush the stage. A rider in shining armor and a familiar stylized helm gallops into the square: the Angel Knight.');await say('Chronicle','Jason casts Shield of Faith, then pulls the lever. Bo is executed. J’Mal moves through the fighting toward the rider, while Freya holds for a mounted charge.');quest.boExecuted=true;save();units=units.filter(u=>u.id!=='freya');startBattle(0,false,{kind:'execution',enemies:[{id:'false_knight',name:'Angel Knight',hp:30,max:30},{id:'rioter1',name:'Rioter',hp:16,max:16},{id:'rioter2',name:'Rioter',hp:16,max:16}]});log('Jason casts Shield of Faith · AC +2 for this confrontation.');}
 else if(id==='movementReport'){quest.chapter6Complete=true;await say('Chapter Six complete','The gate’s guardian has been sent alive to Fex. Riley’s rescuers remain unidentified. Bolgart is free; Bo and Riley are dead, and Longacre has witnessed the party’s warning.');}
 else return false;save();updateObjective();return true;}
 const arrestDuration=540;
 async function arrestBo(){
  await say('freya','Bo Gramel. You’re coming with us. Jason, watch the door.');
  await say('bo_gramel','You didn’t have the nerve to come here when the ghost was still about.');
  const token=epoch;
  arrestBeat={epoch:token,start:performance.now()};
  await delay(reduce.matches?0:arrestDuration);
  if(token!==epoch)return;
  arrestBeat=null;
  await say('jason','That pot nearly took my head off.');
  await say('dent_gramel','She spent her life in the army. Now this is what her service buys her?');
  await say('Chronicle','The party overpowers Bo and takes her into custody.');
  await journeyCard('Longacre · Dusk in the Square','The party announces Bo Gramel’s execution for dusk. While the town gathers, workers raise a guillotine in the church square.',()=>{
   quest.boCaptured=true;
   setScene('execution_square',328,296);
  });
 }
 function drawArrest(g){
  if(scene!=='gramel_gate'||!arrestBeat||arrestBeat.epoch!==epoch||reduce.matches)return;
  const progress=Math.min(1,(performance.now()-arrestBeat.start)/arrestDuration);
  if(progress>=1)return;
  const x=484-76*progress,y=212+35*progress-18*Math.sin(progress*Math.PI);
  g.save();g.translate(Math.round(x),Math.round(y));g.rotate(progress*9);
  g.fillStyle='#1f1815';g.fillRect(-6,-4,12,8);g.fillRect(-8,-2,16,3);
  g.fillStyle='#987456';g.fillRect(-5,-3,10,2);g.fillStyle='#514037';g.fillRect(-5,0,10,3);
  g.restore();
 }
 function soloWatch(){return scene==='church_watch'&&quest.watchStarted&&!quest.jailbreakHeard;}
 function drawNPC(u){if(u.id!=='mounted_freya')return false;const m=MOVEMENT_FRAMES['mounted-freya-v1.png'][0],phase=reduce.matches?1:Math.min(2,Math.floor((performance.now()-mountedStart)/650)),f=m.frames[phase],scale=100/m.maxHeight;ctx.drawImage(art.mounted,f.x,f.y,f.w,f.h,u.x-f.w*scale/2,u.y-f.h*scale,f.w*scale,f.h*scale);return true;}
 return {drawWatch,drawArrest,install,load,goal,points,target,npcs,crowd,afterBattle,interact,soloWatch,drawNPC,mountedVisible:()=>!!mountedStart};
})();
