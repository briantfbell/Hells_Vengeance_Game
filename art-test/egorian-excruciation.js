"use strict";

window.EgorianExecution=(()=>{
 const manor='egorian_manor',square='egorian_excruciation',fight='egorian_bodyguards';
 const map='egorian-excruciation-square-v1.png';
 const armorAtlas='freya-zara-geitta-combat-v1.png';
 const guardAtlas='egorian-noble-bodyguard-v1.png';
 const fxAtlas={src:'egorian-excruciation-effects-v1.png',frames:[0,1,2,3].map(i=>({x:i*543,y:85,w:543,h:543}))};
 const bodyguard='egorian_bodyguard',noble='egorian_noble';
 const combatStats={egorian_bodyguard:{hp:15,ac:14,atk:5,dmg:[1,6,1]}};
 const model=(src,rects,options={})=>{
  const frames=rects.map(([x,y,w,h,anchorX])=>({x,y,w,h,anchorX,anchorY:y+h}));
  return {src,frames,maxHeight:Math.max(...frames.map(frame=>frame.h)),...options};
 };
 const armorModels={
  katana:model(armorAtlas,[[96,60,393,395,249],[583,68,441,387,740],[1110,65,342,390,1264]]),
  naginata:model(armorAtlas,[[41,583,456,397,235],[553,585,479,395,729],[1126,559,387,421,1280]])
 };
 const guardModel=model(guardAtlas,[[41,61,553,594,385],[672,86,773,569,1151],[1561,61,512,599,1868]],
  {cycle:[0,2],attackFrames:true});
 const stage={x:320,y:128},group={x:480,y:208},jamal={x:456,y:232};
 const spectators=[152,176,200,224,248,384,408,432,456,480].flatMap((x,i)=>
  [248,280,312].map((y,j)=>({id:'citizen-egorian-ceremony-'+i+'-'+j,x:x+(j%2)*8,y,variant:(i+j*3)%8,dir:'up',crowd:true})));
 let opening=null,spell=null;

 function install(){
  scenes[manor].points.push({id:'excruciationLeave',x:328,y:312,label:'Go to Oppian’s excruciation'});
  scenes[square]={
   name:'Egorian · Excruciation Square',image:map,spawn:[328,344],blocks:[],
   walk:[{x:112,y:208,w:448,h:112},{x:272,y:320,w:112,h:64},{x:480,y:160,w:80,h:48}],
   lights:[[224,109],[416,109],[36,290],[604,290]],
   points:[
    {id:'excruciationCharges',x:328,y:200,label:'Hear the charges'},
    {id:'excruciationFollow',x:416,y:216,label:'Follow J’Mal and El Guapo'},
    {id:'excruciationNoble',x:464,y:224,label:'Approach the young noble'},
    {id:'excruciationFight',x:448,y:232,label:'Defend J’Mal'},
    {id:'excruciationHold',x:480,y:224,label:'Stop the last bodyguard'},
    {id:'excruciationHeal',x:448,y:248,label:'Get Jason to J’Mal'},
    {id:'excruciationInquiry',x:400,y:200,speaker:'guard',label:'Speak to the Dottari'},
    {id:'excruciationResume',x:328,y:200,label:'Witness the resumed ceremony'}
   ]
  };
  MAP_LAYERS[square]={foreground:map,contain:true,background:{type:'solid',color:'#11131b'}};
  JOURNEYS[square]='Nearly a thousand spectators gather. The Dottari and the Asmodean clergy are preparing the public excruciation of Oppian Nevilindor.';
  Object.assign(STATS,combatStats);
  NAMES[bodyguard]='Noble’s Bodyguard';
  NAMES[noble]='Young Noble';
  COMBAT_IDLES[bodyguard]=guardModel;
  FUTURE_NPCS[bodyguard]={source:guardAtlas,frame:guardModel.frames[2]};
  FUTURE_NPCS[noble]={source:'egorian-young-noble-v1.png',frame:{x:185,y:5,w:573,h:1531}};
 }

 async function load(loader){
  await Promise.all([
   (async()=>{art[square]=await loader(map);})(),
   ...['egorian-young-noble-v1.png',armorAtlas,guardAtlas,fxAtlas.src].map(async image=>{art[image]=await loader(image);})
  ]);
 }
 function mapImage(){return scene===square?art[square]:null;}
 function roster(){return scene===square&&quest.egorianChargesRead?['freya']:null;}
 function crowd(){
  if(scene!==square)return null;
  if(quest.egorianAssassination&&!quest.egorianDottariHeard)return spectators.filter(u=>u.x<264);
  return spectators;
 }
 function freyaCombat(){
  return quest.zaraGeitta&&!quest.egorianFreyaDischarged?armorModels[inventory.equipped.freya==='naginata'?'naginata':'katana']:null;
 }

 function npcs(){
  if(scene!==square)return null;
  const staged=opening?.token===epoch?opening:null;
  const revealed=quest.egorianAssassination||!!staged;
  const jamalDown=quest.egorianAssassination||staged?.jamalDown;
  const actors=[{id:'guard',x:280,y:144},{id:'guard',x:376,y:144}];
  if(!quest.egorianExcruciated)actors.push({id:'oppian',...stage,...(quest.egorianChargesRead?{pose:'prone',x:346}:{})});
  if(quest.egorianChargesRead&&!quest.egorianTracked)actors.push(
   {id:'jamal',x:408,y:216,dir:'right'},{id:'guapo',x:432,y:216,dir:'right'}
  );
  if(!quest.egorianDottariHeard){
   actors.push({id:noble,...group,...(revealed?{hp:0}:{})});
   const spots=[[456,208],[488,184],[520,208],[520,240]];
   spots.forEach(([x,y],i)=>{
    const fallen=i===0?(quest.egorianAssassination||staged?.firstGuardDown):
     i===3?quest.egorianLastGuardDown:quest.egorianDuelWon;
    actors.push({id:bodyguard,x,y,height:48,...(fallen?{hp:0}:{})});
   });
  }
  if(revealed&&!quest.egorianJmalEscaped){
   actors.push({id:'jamal',...jamal,dir:'up',...(jamalDown?{pose:'prone'}:{})});
   actors.push({id:'guapo',x:488,y:256,dir:'up'});
  }
  if(quest.egorianDuelWon&&!quest.egorianDottariHeard)actors.push({id:'draymus',x:528,y:272,dir:'up'});
  if(quest.egorianLastGuardDown&&!quest.egorianDottariHeard)actors.push(
   {id:'jason',x:416,y:272,dir:'up'},{id:'corrine',x:392,y:264}
  );
  if(quest.egorianJmalEscaped&&!quest.egorianDottariHeard)actors.unshift({id:'guard',x:400,y:200});
  return actors;
 }

 function target(){
  if(!quest.egorianDraymusReturned)return null;
  if(scene===manor&&!quest.egorianExcruciationStarted)return point('excruciationLeave');
  if(scene!==square||quest.egorianExcruciated)return null;
  if(!quest.egorianChargesRead)return point('excruciationCharges');
  if(!quest.egorianTracked)return point('excruciationFollow');
  if(!quest.egorianAssassination)return point('excruciationNoble');
  if(!quest.egorianDuelWon)return point('excruciationFight');
  if(!quest.egorianLastGuardDown)return point('excruciationHold');
  if(!quest.egorianJmalEscaped)return point('excruciationHeal');
  if(!quest.egorianDottariHeard)return point('excruciationInquiry');
  return point('excruciationResume');
 }
 function points(){const next=target();return next?[next]:scene===square?[]:null;}
 function goal(){return target()?.label||(scene===square&&quest.egorianExcruciated?'Oppian’s excruciation is complete.':null);}

 function encounter(){
  const max=combatStats[bodyguard].hp;
  return {kind:fight,enemies:[1,2].map(number=>({id:bodyguard,name:'Bodyguard '+number,shortName:'Guard '+number,max,hp:max}))};
 }
 function begin(){
  const {x,y,dir}=units[0];
  hp.jamal=0;
  save();
  startBattle(0,false,{...encounter(),returnPosition:[x,y,dir]});
 }
 async function afterBattle(position){
  quest.egorianDuelWon=true;
  seedParty(...position);
  save();
  await say('Chronicle','Freya cuts down two of the bodyguards. The last turns toward El Guapo as a man in a wheelchair draws near.');
  paintParty();
  updateObjective();
 }
 async function showSpell(index,position){
  const duration=reduce.matches?180:420;
  const active={index,position,start:performance.now(),duration,token:epoch};
  spell=active;
  GameAudio.effect('spell');
  await delay(duration);
  if(spell===active)spell=null;
  if(active.token!==epoch)throw CANCEL;
 }
 function effects(g){
  if(scene!==square||!spell||spell.token!==epoch||!art[fxAtlas.src])return;
  const t=(performance.now()-spell.start)/spell.duration;
  const f=fxAtlas.frames[spell.index+(reduce.matches||t<.52?0:1)];
  const {x,y}=spell.position,size=76;
  g.save();g.imageSmoothingEnabled=false;
  g.drawImage(art[fxAtlas.src],f.x,f.y,f.w,f.h,x-size/2,y-size+12,size,size);
  g.restore();
 }

 async function assassination(){
  await say('freya','I recognize the crest. I’ve heard the family may sympathize with the rebellion. Where did J’Mal and El Guapo go?');
  await storyRoll('J’Mal · Strike from concealment',19,0,'Vanish breaks on the strike');
  const active={token:epoch,firstGuardDown:false,jamalDown:false};
  opening=active;
  try{
   await say('Chronicle','The young noble falls. J’Mal appears behind him, sawtooth sabres drawn. Four guards pull longswords that crackle with electricity.');
   await say('Chronicle','El Guapo intercepts the fourth guard before he reaches J’Mal. The other three close in.');
   active.firstGuardDown=true;
   for(const [i,face] of [17,18,19].entries()){
    await storyRoll('Bodyguard '+(i+1)+' · Charged longsword',face,0,'Hits J’Mal');
    await showSpell(0,jamal);
   }
   active.jamalDown=true;
   hp.jamal=0;
   quest.egorianAssassination=true;
   save();
   await say('Chronicle','Three Shocking Grasp strikes leave J’Mal unconscious before he can use the Mosswater Tunic. Freya closes on the guards.');
  }finally{
   if(opening===active)opening=null;
  }
 }

 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'excruciationLeave':
    quest.egorianExcruciationStarted=true;
    await travel(square,328,344);
    break;
   case 'excruciationCharges':{
    await say('Chronicle','The Dottari and Asmodean clergy read the charges against Oppian Nevilindor. He says nothing as they fasten him to the table.');
    await say('freya','J’Mal? El Guapo? Where are you two going?');
    quest.egorianChargesRead=true;
    const {x,y,dir}=units[0];
    seedParty(x,y,dir);
    window.NextChapter.syncRoster();
    break;
   }
   case 'excruciationFollow':
    await say('Chronicle','The crowd parts for Freya’s Hellknight plate. She catches sight of the two companions, then loses them near a young noble flanked by four armed guards.');
    quest.egorianTracked=true;
    break;
   case 'excruciationNoble':
    await assassination();
    break;
   case 'excruciationFight':
    begin();
    return true;
   case 'excruciationHold':
    await say('draymus','Joe, wheel me a little closer. Hold Person.');
    await storyRoll('Bodyguard · Resist Hold Person',4,0,'Fails to resist');
    await showSpell(2,{x:520,y:240});
    quest.egorianLastGuardDown=true;
    await say('Chronicle','The last guard locks in place. El Guapo closes the gap and finishes him before he can move again.');
    break;
   case 'excruciationHeal':{
    await say('Chronicle','Jason and Corrine arrive after the fighting. Jason drops beside J’Mal and stabilizes him.');
    const healed=await damage([2,8,3],'Jason · Stabilize and heal J’Mal');
    hp.jamal=Math.min(STATS.jamal.hp,healed);
    quest.mosswaterSpent=Math.min(5,(quest.mosswaterSpent||0)+1);
    quest.egorianJmalEscaped=true;
    await say('Chronicle','J’Mal comes around. He uses the Mosswater Tunic to slip into the Ethereal Plane and escape the square.');
    break;
   }
   case 'excruciationInquiry':
    await say('freya','I recognized his crest. His family has been suspected of sympathizing with the rebels. You should consider whether they meant to disrupt the proceedings.');
    await say('Dottari Guard','Duke Fellatio is dead. There will be an official inquiry. Your standing and the cleric’s word are enough for us to let you go for now.');
    await say('freya','When we’re clear of this square, we’re having a talk.');
    quest.egorianDottariHeard=true;
    break;
   case 'excruciationResume':
    await journeyCard('Oppian’s Excruciation','The ceremony resumes. Oppian Nevilindor’s soul is given to Asmodeus.',()=>{
     quest.egorianExcruciated=true;
     save();
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,crowd,freyaCombat,npcs,target,points,goal,effects,interact,encounter,afterBattle,combatStats,armorModels,fxAtlas};
})();
