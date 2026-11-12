"use strict";

window.EgorianMort=(()=>{
 const manor='egorian_manor',alley='egorian_lower_lane';
 const map='egorian-lower-lane-v1.png',solo=['draymus'];
 const assailant={x:360,y:208};
 const disguise={
  src:'draymus-chair-walk-v1.png',maxHeight:341,walkCycle:[1,0,2,0],
  frames:[
   [156,8,178,341,245],[632,8,197,341,720],[1111,9,187,340,1200],
   [95,372,289,332,256],[540,373,330,331,743],[1022,372,326,332,1217],
   [153,734,179,338,244],[632,734,180,338,722],[1111,734,183,338,1201]
  ].map(([x,y,w,h,anchorX])=>({x,y,w,h,anchorX}))
 };
 const spellAtlas={
  src:'egorian-mort-spells-v1.png',
  frames:Array.from({length:8},(_,index)=>{
   const column=index%4,row=Math.floor(index/4);
   const x=Math.floor(column*1774/4),y=Math.floor(row*887/2);
   return {x,y,w:Math.floor((column+1)*1774/4)-x,h:Math.floor((row+1)*887/2)-y};
  })
 };
 let spell=null;

 function install(){
  scenes[manor].points.push({id:'mortLeave',x:328,y:312,label:'Slip out as Draymus'});
  scenes[alley]={
   name:'Egorian · Lower Lane',image:map,spawn:[328,344],blocks:[],
   walk:[{x:128,y:240,w:384,h:80},{x:192,y:192,w:320,h:48},
    {x:272,y:320,w:96,h:64},{x:272,y:144,w:96,h:48},{x:448,y:160,w:48,h:32}],
   lights:[[429,102],[318,365]],
   points:[
    {id:'mortAmbush',x:328,y:248,label:'Search the dark lane'},
    {id:'mortPuppet',x:328,y:216,label:'Cast Flesh Puppet'},
    {id:'mortChair',x:472,y:168,speaker:'egorian_antique_chair',label:'Buy the antique wheelchair'},
    {id:'mortDisguise',x:456,y:200,label:'Put on the disguise'},
    {id:'mortDawn',x:328,y:344,label:'Leave before dawn'}
   ]
  };
  MAP_LAYERS[alley]={foreground:map,contain:true,background:{type:'solid',color:'#101219'}};
  JOURNEYS[alley]='The others settle in for the evening before the excruciation. Draymus slips out alone and deliberately seeks a poorer district.';
  NAMES.joe_kek='Joe Kek';
  FUTURE_NPCS.joe_kek={source:'egorian-joe-kek-v1.png',frame:{x:366,y:12,w:403,h:1282}};
  FUTURE_NPCS.egorian_assailant=FUTURE_NPCS.joe_kek;
  FUTURE_NPCS.egorian_antique_chair={source:'egorian-antique-chair-v1.png',frame:{x:214,y:19,w:849,h:1142}};
  DIALOGUE_FACE_CROPS.joe_kek={x:444,y:0,w:310,h:310};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[alley]=await loader(map);})(),
   ...['egorian-joe-kek-v1.png','egorian-antique-chair-v1.png',disguise.src,spellAtlas.src].map(async image=>{art[image]=await loader(image);})
  ]);
 }
 function mapImage(){return scene===alley?art[alley]:null;}
 function roster(){return scene===alley?solo:null;}
 function movement(){return quest.egorianDisguiseReady&&art[disguise.src]?{meta:disguise,image:art[disguise.src]}:null;}
 function npcs(){
  if(scene!==alley)return null;
  if(!quest.egorianAmbushResolved){
   const active=spell?.kind===0&&spell.token===epoch&&!reduce.matches;
   const run=active?Math.max(0,(spellProgress()-.35)/.65):0;
   return [{id:'egorian_assailant',...assailant},
    {id:'citizen-egorian-lookout',x:296+run*32,y:232-run*112,dir:run?'up':'down',variant:2}];
  }
  const props=[];
  if(!quest.egorianJoeRaised)props.push({id:'egorian_assailant',...assailant,hp:0});
  else if(!quest.egorianDisguiseReady)props.push({id:'joe_kek',...(quest.egorianChairBought?{x:440,y:200}:assailant)});
  if(quest.egorianJoeRaised&&!quest.egorianDisguiseReady)props.push({id:'egorian_antique_chair',x:488,y:176,height:37});
  return props;
 }
 function target(){
  if(!quest.egorianPlateReturned)return null;
  if(scene===manor&&!quest.egorianDraymusStarted)return point('mortLeave');
  if(scene!==alley)return null;
  if(!quest.egorianAmbushResolved)return point('mortAmbush');
  if(!quest.egorianJoeRaised)return point('mortPuppet');
  if(!quest.egorianChairBought)return point('mortChair');
  if(!quest.egorianDisguiseReady)return point('mortDisguise');
  return point('mortDawn');
 }
 function points(){
  const next=target();
  return next?[next]:scene===manor&&quest.egorianDraymusReturned?[]:null;
 }
 function goal(){return target()?.label||(scene===manor&&quest.egorianDraymusReturned?'The public excruciation begins this morning.':null);}
 async function showSpell(kind){
  const duration=reduce.matches?190:720;
  const active={kind,x:assailant.x-(kind===1?25:0),y:assailant.y,start:performance.now(),duration,token:epoch};
  spell=active;
  GameAudio.effect('spell');
  await delay(duration);
  if(spell===active)spell=null;
  if(active.token!==epoch)throw CANCEL;
 }
 const spellProgress=()=>Math.min(.999,Math.max(0,(performance.now()-spell.start)/spell.duration));
 function effects(g){
  if(scene!==alley||!spell||spell.token!==epoch||!art[spellAtlas.src])return;
  const f=spellAtlas.frames[spell.kind*4+(reduce.matches?2:Math.floor(spellProgress()*4))];
  const size=88;
  g.save();
  g.imageSmoothingEnabled=false;
  g.drawImage(art[spellAtlas.src],f.x,f.y,f.w,f.h,spell.x-size/2,spell.y-size+15,size,size);
  g.restore();
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'mortLeave':
    quest.egorianDraymusStarted=true;
    await travel(alley,328,344);
    break;
   case 'mortAmbush':
    await say('Chronicle','A man with a crude knife comes up behind Draymus. A second figure waits in the lane.');
    await storyRoll('Draymus · Notice the knife',18,0,'Spots the ambush');
    await say('draymus','Phantasmal Killer.');
    await storyRoll('Assailant · Resist the phantasm',3,0,'Fails to resist');
    await showSpell(0);
    quest.egorianAmbushResolved=true;
    await say('Chronicle','The knife falls. The man drops to his knees, screaming at something only he can see. He dies of fright. The second assailant runs.');
    break;
   case 'mortPuppet':
    await say('draymus','Flesh Puppet. Stand up.');
    await showSpell(1);
    quest.egorianJoeRaised=true;
    await say('Chronicle','The dead man stands. He looks as he did in life, and when Draymus speaks to him, he answers.');
    break;
   case 'mortChair':
    await say('Chronicle','Draymus purchases an antique wheelchair from a second-hand dealer.');
    quest.egorianChairBought=true;
    break;
   case 'mortDisguise':
    await say('Chronicle','Draymus disguises himself as an elderly man and settles into the chair.');
    await say('draymus','Joe Kek. I’ll tell you where we’re going. You push.');
    await say('joe_kek','Where to?');
    quest.egorianDisguiseReady=true;
    break;
   case 'mortDawn':
    await journeyCard('Egorian · The Next Morning','The city wakes for the public excruciation. The company will join the crowd. Draymus can reach the square in his disguise, with Joe Kek behind the chair.',()=>{
     quest.egorianDraymusReturned=true;
     setScene(manor,328,312);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,movement,npcs,target,points,goal,effects,interact,disguise,spellAtlas};
})();
