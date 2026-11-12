'use strict';
window.LastStand=(()=>{
 const r=(x,y,w,h)=>({x,y,w,h});
 const rearDoor=[328,111],bardStage=[467,119],bar=[280,176],tavernFloor=[300,250],tavernEntry=[328,328];
 const jailCells='longacre_cells';
 const hillChecks={hillTree:{flag:'hillTreeSearched',speaker:'jamal',line:'Nothing fresh beneath the tree. No footprints I can follow.'},hillRidge:{flag:'hillRidgeSearched',speaker:'reese',line:'I can see both sides of the ridge from here. Nobody’s coming, and there’s no trail down.'}};
 const panDuration=420,captureDuration=880;
 let tavernBeat=null;
 const maps={last_stand:{name:'Chapter Four · The Last Stand',image:'last-stand.png',spawn:[328,328],walk:[r(144,144,336,176),r(272,304,80,80),r(272,80,80,80),r(480,176,64,96)],blocks:[],lights:[[116,116],[248,104],[520,176]],points:[{id:'lastDecree',x:328,y:328,label:'Repost the torn decree'},{id:'lastPatrons',x:424,y:256,label:'Speak to the patrons'},{id:'takePrisoners',x:328,y:352,label:'Escort the prisoners to jail'}]},angel_hill:{name:'Outside Longacre · The Angel Knight’s Hill',image:'angel-knight-hill.png',spawn:[328,344],walk:[r(288,240,80,144),r(176,128,288,128)],blocks:[],lights:[],points:[{id:'hillSearch',x:312,y:176,label:'Ask Riley to point out the spot'},{id:'hillTree',x:200,y:152,label:'Search beneath the tree'},{id:'hillRidge',x:440,y:152,label:'Check the ridge'},{id:'hillReturn',x:328,y:352,label:'Return to the jail'}]}};
 maps[jailCells]={
  name:'Longacre Jail · The Cells',image:'longacre-jail-cells-v1.png',spawn:[328,344],
  walk:[r(144,208,352,96),r(288,288,64,96)],blocks:[],lights:[[191,129],[448,128],[582,111]],
  points:[{id:'rileyQuestion',x:352,y:216,label:'Question Riley Kels'},{id:'hospiceRoad',x:328,y:352,label:'Open Razelago’s letter'}]
 };
 function install(){Object.assign(scenes,maps);JOURNEYS[jailCells]='Bolgart remains in the courtyard pillory. Riley is locked in a cell inside the jail.';scenes.longacre_jail.walk.push(r(128,232,48,80));for(const [id,s] of Object.entries(maps))MAP_LAYERS[id]={foreground:s.image,background:{type:'solid',color:'#121820'}};NAMES.bolgart='Bolgart Caggan';NAMES.bolgart_wereboar='Bolgart · Wereboar';NAMES.riley='Riley Kels';STATS.bolgart={hp:46,ac:13,atk:4,dmg:[1,6,2]};STATS.bolgart_wereboar={hp:64,ac:14,atk:6,dmg:[1,8,3]};scenes.scarlet_manor.points.push({id:'lastStandRoad',x:328,y:352,label:'Continue to the Last Stand'});scenes.longacre_jail.points.push({id:'jailCells',x:440,y:200,label:'Enter the jail to question Riley'},{id:'hospiceRoad',x:328,y:352,label:'Open Razelago’s letter'},{id:'hillRoad',x:328,y:352,label:'Follow Riley to the hill'},{id:'bolgartStocks',x:152,y:264,label:'Approach Bolgart in the stocks'},{id:'lastReport',x:328,y:352,label:'Report to Razelago'});}
 async function load(loader){for(const [id,s] of Object.entries(maps))art[id]=await loader(s.image);art.later=await loader('longacre-later-cast.png');art.bolgartStocks=await loader('bolgart-stocks-v1.png');}
 function goal(){if(scene==='angel_hill'&&quest.chapter4&&!quest.chapter4Complete)return hillGoal();if(!quest.chapter4)return quest.chapter3Complete?'Continue to the Last Stand.':null;if(quest.chapter4Complete)return 'Chapter complete · The town’s resistance is growing.';return !quest.bolgartSubdued?'Repost the torn decree at the Last Stand.':!quest.prisonersJailed?'Escort Bolgart and Riley to the jail.':!quest.rileyQuestioned?(scene===jailCells?'Question Riley about the Angel Knight.':'Enter the jail to question Riley.'):!quest.churchDoorsRepaired?'Open Razelago’s letter.':!quest.hillSearched?'Investigate the hill Riley describes.':!quest.bolgartSecured?'Return to the jail and approach Bolgart.':'Report the captures to Razelago.';}
 function target(){if(scene==='angel_hill'&&quest.chapter4)return hillPoints()[0];const id=!quest.chapter4?'lastStandRoad':!quest.bolgartSubdued?'lastDecree':!quest.prisonersJailed?'takePrisoners':!quest.rileyQuestioned?(scene===jailCells?'rileyQuestion':'jailCells'):!quest.churchDoorsRepaired?'hospiceRoad':!quest.hillSearched?(scene==='angel_hill'?'hillSearch':'hillRoad'):!quest.bolgartSecured?(scene==='angel_hill'?'hillReturn':'bolgartStocks'):'lastReport';return point(id);}
 function points(){if(!quest.chapter4)return null;if(scene==='last_stand')return scenes[scene].points.filter(p=>p.id==='lastPatrons'||p.id===(quest.bolgartSubdued?'takePrisoners':'lastDecree'));if(scene===jailCells)return [point(quest.rileyQuestioned?'hospiceRoad':'rileyQuestion')];if(scene==='angel_hill')return hillPoints();if(scene==='longacre_jail')return scenes[scene].points.filter(p=>p.id===(!quest.rileyQuestioned?(scene===jailCells?'rileyQuestion':'jailCells'):!quest.churchDoorsRepaired?'hospiceRoad':!quest.hillSearched?'hillRoad':!quest.bolgartSecured?'bolgartStocks':'lastReport'));if(scene==='ash_house'&&quest.chapter4Complete)return [point('razelago')];return null;}
 function currentBeat(){return scene==='last_stand'&&tavernBeat&&tavernBeat.epoch===epoch?tavernBeat:null;}
 function beatProgress(beat,duration){return reduce.matches?1:Math.min(1,(performance.now()-beat.start)/duration);}
 function tavernActors(){
  if(quest.bolgartSubdued)return [{id:'bolgart',x:362,y:276},{id:'riley',x:397,y:277}];
  const beat=currentBeat();
  const [bx,by]=beat?tavernFloor:bar;
  const progress=beat?.phase==='capture'?beatProgress(beat,captureDuration):0;
  return [{id:'bolgart',x:bx,y:by,pose:['subdued','capture'].includes(beat?.phase)?'prone':null},{id:'riley',x:bardStage[0]+(rearDoor[0]+22-bardStage[0])*progress,y:bardStage[1]+(rearDoor[1]+19-bardStage[1])*progress}];
 }
 function npcs(){
  if(!quest.chapter4)return null;
  if(scene==='last_stand')return tavernActors();
  if(scene===jailCells)return [{id:'riley',x:328,y:180}];
  if(scene==='longacre_jail')return [
   ...(quest.rileyQuestioned?[{id:'riley',x:456,y:216}]:[]),
   quest.bolgartSecured?{id:'bolgart',pose:'stocks',x:224,y:248}:{id:'bolgart',pose:'stocks',x:120,y:264}
  ];
  if(scene==='angel_hill')return [{id:'riley',x:328,y:163}];
  return null;
 }
 function drawCellBars(g){
  if(scene!==jailCells||!art[jailCells])return;
  const map=art[jailCells],scale=map.width/640;
  for(const x of [311,327,342])g.drawImage(map,x*scale,106*scale,5*scale,88*scale,x,106,5,88);
 }
 function tavernPose(unit){
  if(!currentBeat())return unit;
  if(unit.id==='jamal')return {...unit,x:rearDoor[0],y:rearDoor[1],dir:'down',step:null};
  const position={freya:[328,318],jason:[282,299],draymus:[360,300],reese:[395,295]}[unit.id];
  return position?{...unit,x:position[0],y:position[1],dir:'up',step:null}:unit;
 }
 function drawPan(g){
  const beat=currentBeat();
  if(beat?.phase!=='pan'||reduce.matches)return;
  const progress=beatProgress(beat,panDuration);
  if(progress>=1)return;
  const x=302+26*progress,y=218+48*progress-24*Math.sin(progress*Math.PI);
  g.save();g.translate(Math.round(x),Math.round(y));g.rotate(progress*8);
  g.fillStyle='#1e1818';g.fillRect(-5,-5,10,10);g.fillRect(3,-1,9,3);
  g.fillStyle='#797479';g.fillRect(-4,-4,8,8);g.fillRect(4,0,7,1);
  g.fillStyle='#38343a';g.fillRect(-3,-3,6,6);
  g.restore();
 }
 async function begin(){
  quest.chapter4=true;
  quest.chapter4Complete=false;
  NextChapter.refresh();
  await say('freya','We’ll get Riley’s account ourselves. J’Mal, watch the rear door while we put the order back up.');
  await travel('last_stand',...tavernEntry);
  save();
 }
 async function confrontBolgart(){
  tavernBeat={epoch,phase:'confrontation',start:performance.now()};
  await say('Chronicle','J’Mal takes the rear door. At the front post, the rest of the party fastens up a fresh copy of the decree.');
  await say('bolgart','Take that down! You have no right to tell my customers when they can gather.');
  await say('freya','Put the pan down, Bolgart. We can settle this without a fight.');
  const token=epoch;
  tavernBeat={epoch:token,phase:'pan',start:performance.now()};
  await delay(reduce.matches?0:panDuration);
  if(token!==epoch)return;
  await say('Chronicle','The frying pan rings against Freya’s helmet. Across the tavern, Riley stops playing and looks toward the rear exit.');
  tavernBeat=null;
  units=units.filter(unit=>unit.id!=='jamal');
  startBattle(0,false,{kind:'bolgart',opening:'Roll initiative. Subdue Bolgart while J’Mal holds the rear door.',enemies:[{id:'bolgart',name:'Bolgart Caggan',hp:46,max:46}]});
 }
 async function afterBattle(kind){
  if(kind==='bolgart'){
   seedParty(...tavernEntry);
   tavernBeat={epoch,phase:'subdued'};
   await say('Chronicle','Bolgart goes down. While the others secure him, Riley slips away from his stage.');
   const token=epoch;
   tavernBeat={epoch:token,phase:'capture',start:performance.now()};
   await delay(reduce.matches?0:captureDuration);
   if(token!==epoch)return;
   await say('riley','I was just leaving. Is that against the decree too?');
   await say('jamal','Come with me. I want to hear the story you were singing.');
   quest.bolgartSubdued=true;
   quest.rileyCaptured=true;
   tavernBeat=null;
   await say('freya','Everyone else, go home. Put the utensils down and there’ll be no more trouble.');
   await say('Chronicle','The patrons leave, and the barmaids back away. Bolgart and Riley are in custody.');
  }else{
   quest.bolgartSecured=true;
   await say('Chronicle','With Bolgart staggered, Freya drives a mounted lance charge on Sleipnir to bring him down.');
   await say('Chronicle','Bolgart is subdued and returns to human form. The party secures his wrists, legs and neck with shackles and locks him in the jail.');
   await say('Chronicle','A carpenter is paid to restore a working pillory. The broken pieces are left on display while the party spreads word of Bolgart’s hidden curse.');
  }
  save();
  updateObjective();
 }

 function hillPoints(){
  if(quest.hillSearched)return [point('hillReturn')];
  if(!quest.hillSpotShown)return [point('hillSearch')];
  return Object.entries(hillChecks).filter(([,check])=>!quest[check.flag]).map(([id])=>point(id));
 }
 function hillGoal(){
  if(quest.hillSearched)return 'Return to the jail with Riley.';
  if(!quest.hillSpotShown)return 'Have Riley show you where he saw the knight.';
  const count=Object.values(hillChecks).filter(check=>quest[check.flag]).length;
  return 'Search the hill ['+count+'/2].';
 }
 async function searchHill(id){
  const {flag,speaker,line}=hillChecks[id];
  if(quest[flag])return;
  await say(speaker==='reese'&&!quest.reeseJoined?'freya':speaker,line);
  const complete=Object.values(hillChecks).every(check=>check.flag===flag||quest[check.flag]);
  if(complete)await say('freya','The knight’s gone and we have no trail. Bring Riley back to the jail.');
  quest[flag]=true;
  if(complete)quest.hillSearched=true;
 }
 async function interact(id){if(id==='lastStandRoad'){await begin();return true;}if(!quest.chapter4)return false;
 if(id==='lastDecree'&&!quest.bolgartSubdued)await confrontBolgart();
 else if(id==='lastPatrons')await say('Tavern patron',quest.bolgartSubdued?'We’re leaving. There’s no need for more trouble.':'Riley sings about a knight he saw outside town. We came to hear the story.');
 else if(id==='takePrisoners'){
  if(!quest.bolgartSubdued)await say('Chronicle','Bolgart has not surrendered.');
  else if(!quest.prisonersJailed){
   quest.prisonersJailed=true;
   await travel('longacre_jail',328,312);
   await say('Chronicle','Bolgart is locked in the pillory outside. The guards take Riley inside and put him in a cell.');
  }
 }
 else if(id==='jailCells'&&scene==='longacre_jail'&&quest.prisonersJailed&&!quest.rileyQuestioned)await travel(jailCells,328,344);
 else if(id==='rileyQuestion'&&scene===jailCells&&quest.prisonersJailed&&!quest.rileyQuestioned){
  await say('freya','You’ve been singing about meeting the Angel Knight. I want to hear what happened before you turned it into a song.');
  await say('riley','The song is very good, actually. People keep asking me to perform it.');
  const choice=await say('Riley’s account','Where do you start?',['[Ask where he met the Angel Knight]','[Ask why he mistook her for an angel]']);
  for(const topic of choice===0?['where','why']:['why','where']){
   await say(lead,topic==='where'?'Where did you see her?':'What made you think she was an angel?');
   await say('riley',topic==='where'?'On a hill two miles out of town, early in the morning. She was kneeling in prayer.':'The armor and that helm. There she was, all alone, praying. At first I thought I was seeing an angel.');
  }
  await say('freya','Then you can show us the hill. You’ll stay under guard until we go.');
  quest.rileyQuestioned=true;
 }

 else if(id==='hillRoad'){if(!quest.churchDoorsRepaired)return false;await journeyCard('Outside Longacre · Before dawn','The hospice visit and church investigation are complete. The party takes Riley two miles out of town to the hill he described.');await travel('angel_hill',328,344);}
 else if(id==='hillSearch'&&scene==='angel_hill'&&!quest.hillSearched&&!quest.hillSpotShown){
  await say('riley','There, in the clearing. She was kneeling in prayer. I thought I had seen an angel.');
  await say('freya','Stay here with us. Check beneath the tree and along the ridge.');
  quest.hillSpotShown=true;
 }
 else if(scene==='angel_hill'&&quest.hillSpotShown&&!quest.hillSearched&&Object.hasOwn(hillChecks,id))await searchHill(id);
 else if(id==='hillReturn'&&scene==='angel_hill'&&quest.hillSearched)await travel('longacre_jail',328,312);
 else if(id==='bolgartStocks'){await say('Chronicle','Back at the jail in the early morning, Bolgart looks remarkably recovered. He taunts the party from the stocks.');await say('jamal','You are still in our custody. Keep that in mind.');await say('Chronicle','Bolgart strains against the pillory. His body swells and twists; tusks push from his face. The hidden wereboar breaks free and charges J’Mal.');await say('Chronicle','Freya moves to her mount, Sleipnir, and readies her lance while the others hold Bolgart back.');startBattle(0,false,{kind:'wereboar',enemies:[{id:'bolgart_wereboar',name:'Bolgart · Wereboar',hp:64,max:64}]});}
 else if(id==='lastReport'){await travel('ash_house',328,296);await say('razelago','The tavern’s gathering is ended, and both prisoners are secured. Keep your sashes visible. Longacre is watching you.');quest.chapter4Complete=true;await say('Chapter Four complete','Riley’s claimed meeting led to an empty hill. Bolgart’s hidden curse has been exposed. The prisoners remain alive in custody; their later fate is still ahead.');}
 else return false;save();updateObjective();return true;}
 return {tavernPose,drawPan,drawCellBars,install,load,goal,target,points,npcs,begin,interact,afterBattle};
})();
