"use strict";

window.BellflowerBarge=(()=>{
 const home='pezzack_egorian',barge='egorian_bellflower_barge',hide='egorian_migos_hideaway';
 const kind='bellflower_boarding',boarder='bellflower_boarder';
 const deck='bellflower-barge-v1.png',room='bellflower-migos-v1.png',sheet='bellflower-boarders-v1.png';
 const captives=[
  {id:'citizen-barge-1',x:294,y:143,dir:'down',variant:1,height:37},
  {id:'citizen-barge-2',x:358,y:145,dir:'down',variant:6,height:37}
 ];
 let cutaway=null;
 const model={src:sheet,frames:[
  {x:51,y:91,w:550,h:555,anchorX:345,anchorY:646},
  {x:680,y:143,w:760,h:503,anchorX:1095,anchorY:646},
  {x:1548,y:91,w:550,h:555,anchorX:1830,anchorY:646}
 ],maxHeight:555,cycle:[0,2],attackFrames:true};

 function install(){
  scenes[home].points.push({id:'bellflowerBrief',speaker:'corrine',x:328,y:248,label:'Hear Corrine’s orders'});
  scenes[barge]={
   name:'Egorian · Party Barge',image:deck,spawn:[328,248],blocks:[],
   walk:[{x:80,y:176,w:480,h:80}],lights:[[181,80],[294,78],[414,79],[64,257],[573,256]],
   points:[
    {id:'bellflowerPrepare',x:328,y:184,label:'Check the fighting ring'},
    {id:'bellflowerHost',x:328,y:232,label:'Give Draymus the signal'},
    {id:'bellflowerBoarders',x:248,y:216,label:'Hold off the Bellflower boarders'},
    {id:'bellflowerRecall',x:328,y:248,label:'Get the company out with Jason'}
   ]
  };
  scenes[hide]={
   name:'Egorian · Migos Street Hideaway',image:room,spawn:[328,296],blocks:[],
   walk:[{x:208,y:160,w:336,h:176},{x:288,y:336,w:64,h:64}],lights:[[91,100],[181,100],[554,42]],
   points:[]
  };
  MAP_LAYERS[barge]={foreground:deck,contain:true,background:{
   type:'ocean',speed:3,palette:['#101d2a','#1e303c','#334653','#4d5965']
  }};
  MAP_LAYERS[hide]={foreground:room,contain:true,background:{type:'solid',color:'#181923'}};
  JOURNEYS[barge]='20 Pharast, 4717. The company rents a river barge and advertises a late-night party with a halfling fighting ring. Draymus joins them in Egorian to play the host.';
  NAMES[boarder]='Bellflower Rescuer';
  FUTURE_NPCS[boarder]={source:sheet,frame:model.frames[0]};
  COMBAT_IDLES[boarder]=model;
  STATS[boarder]={hp:19,ac:14,atk:6,dmg:[1,6,2]};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[barge]=await loader(deck);})(),
   (async()=>{art[hide]=await loader(room);})(),
   (async()=>{art[sheet]=await loader(sheet);})()
  ]);
 }
 function mapImage(){return scene===barge||scene===hide?art[scene]:null;}
 function roster(){
  if(scene!==barge&&scene!==hide)return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===home&&quest.pezzackComplete)return [point('bellflowerBrief')];
  if(scene===hide)return [];
  if(scene!==barge)return null;
  const id=!quest.bellflowerPrepared?'bellflowerPrepare':!quest.bellflowerPartyStarted?'bellflowerHost':
   !quest.bellflowerHeld?'bellflowerBoarders':'bellflowerRecall';
  return [point(id)];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===hide?'The company has retreated. The Bellflower Network freed many captives.':null);}
 function npcs(){
  if(scene===home&&quest.pezzackComplete)return [{id:'corrine',x:328,y:231,height:58}];
  if(scene===hide)return [];
  if(scene!==barge)return null;
  if(quest.bellflowerHeld){
   if(cutaway?.name!=='rescue'||cutaway.epoch!==epoch)return [];
   const time=phase();
   return captives.flatMap((captive,index)=>{
    const pace=Math.max(0,Math.min(1,(time-index*.12)/.82));
    if(pace>=1)return [];
    const gather=Math.min(1,pace/.38);
    const x=captive.x+(316-captive.x)*gather,y=captive.y+(344-captive.y)*pace;
    return [{...captive,x,y,step:pace>0,anim:time*cutaway.duration/1000}];
   });
  }
  if(!quest.bellflowerPartyStarted)return captives.concat([
   {id:'citizen-barge-guest-1',x:122,y:178,dir:'right',variant:4},
   {id:'citizen-barge-guest-2',x:516,y:176,dir:'left',variant:7},
   {id:'citizen-barge-guest-3',x:490,y:206,dir:'up',variant:3}
  ]);
  return captives.concat([
   {id:boarder,x:218,y:195,height:39},
   {id:boarder,x:169,y:226,height:39}
  ]);
 }
 function phase(){return Math.min(1,(performance.now()-cutaway.started)/cutaway.duration);}
 async function playCutaway(name,duration){
  if(reduce.matches)return;
  const effect={name,duration,epoch,started:performance.now()};
  cutaway=effect;
  try{
   await delay(duration);
   if(effect.epoch!==epoch)throw CANCEL;
  }finally{
   if(cutaway===effect)cutaway=null;
  }
 }
 function effects(g){
  if(scene!==barge||cutaway?.name!=='recall'||cutaway.epoch!==epoch||reduce.matches)return;
  const time=phase(),glow=Math.sin(time*Math.PI);
  g.save();
  g.globalCompositeOperation='lighter';
  g.globalAlpha=glow*.62;
  for(const [index,{x,y}] of units.entries()){
   const radius=18+time*14;
   const light=g.createRadialGradient(x,y,2,x,y,radius);
   light.addColorStop(0,'#d3afff');
   light.addColorStop(1,'#614c8d00');
   g.fillStyle=light;
   g.fillRect(x-radius,y-radius,radius*2,radius*2);
   g.fillStyle='#e2cdfb';
   for(let i=0;i<7;i++){
    const angle=i*1.8+time*5+index,px=x+Math.cos(angle)*(8+time*12);
    const py=y+Math.sin(angle)*7-time*(32+i*5);
    g.fillRect(Math.round(px),Math.round(py),2,3+i%3);
   }
  }
  g.restore();
 }
 function beginFight(){
  const {x,y,dir}=units[0],max=STATS[boarder].hp;
  const enemies=[1,2,3,4].map(i=>({id:boarder,name:'Bellflower Rescuer '+i,shortName:'Rescuer '+i,hp:max,max}));
  save();
  hp.draymus=Math.min(Math.max(1,hp.draymus),5);
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir],
   opening:'Draymus is badly wounded. Hold for one round to make room for Jason’s recall.'});
 }
 function retreatReady(current){return current.kind===kind&&current.round>=1;}
 async function afterBattle(position){
  quest.bellflowerHeld=true;
  const jasonDown=hp.jason===0;
  if(jasonDown)hp.jason=1;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  await playCutaway('rescue',1750);
  await say('Chronicle','While the company holds the deck, the Bellflower rescuers get many of the captives clear.');
  if(jasonDown)await say('Chronicle','Jason comes round as Freya pulls him clear of the fighting.');
  await say('jason','Stay close. I can get us back to Migos Street.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'bellflowerBrief':
    await say('corrine','The Bellflower Network is moving people out of Egorian. I need you to break its operation in the capital.');
    await say('freya','Then we give them a rescue they can’t pass up. Get us a barge.');
    quest.bellflowerReached=true;
    await travel(barge,328,248);
    break;
   case 'bellflowerPrepare':
    await say('Chronicle','The party checks the fighting ring before admitting the guests. Word has already spread about the halflings being held aboard.');
    quest.bellflowerPrepared=true;
    break;
   case 'bellflowerHost':
    await say('draymus','Welcome aboard. There’s wine at the rail and a show to come.');
    await say('Chronicle','The guests barely have time to turn. Bellflower fighters come aboard and strike Draymus before the company can spring the trap.');
    quest.bellflowerPartyStarted=true;
    break;
   case 'bellflowerBoarders':
    beginFight();
    return true;
   case 'bellflowerRecall':
    await say('jason','Kendrick Lamar!');
    await playCutaway('recall',1000);
    await journeyCard('Migos Street · Word of recall','Jason’s recall brings the company back to its Egorian hideaway. The Bellflower Network has freed many halflings, and the trap has failed.',()=>{
     quest.bellflowerBargeComplete=true;
     setScene(hide,328,296);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,effects,retreatReady,afterBattle,interact};
})();
