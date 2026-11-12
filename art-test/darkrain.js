"use strict";

window.DarkRain=(()=>{
 const cave='nidal_giant_lair',pass='darkrain_pass',slope='darkrain_skull_slope',passage='darkrain_skull_passage';
 const passArt='darkrain-pass-v1.png',slopeArt='darkrain-skull-v1.png',passageArt='darkrain-jaws-v1.png';
 const portrait='darkrain-wight-mother-v1.png',sheet='darkrain-dire-bear-v1.png';
 const mother='wight_mother',bear='darkrain_bear',kind='darkrain_bear_hunt';
 const model={src:sheet,frames:[
  {x:16,y:73,w:651,h:581,anchorX:367,anchorY:647},
  {x:687,y:71,w:757,h:583,anchorX:1125,anchorY:647},
  {x:1478,y:77,w:694,h:577,anchorX:1848,anchorY:647}
 ],maxHeight:583,cycle:[0,2],attackFrames:true};

 function install(){
  scenes[cave].points.push({id:'darkrainLeaveNidal',x:328,y:344,label:'Turn south for the Pass of Dark Rain'});
  scenes[pass]={
   name:'Isger · Pass of Dark Rain',image:passArt,spawn:[328,344],blocks:[],
   walk:[{x:128,y:160,w:384,h:144},{x:272,y:304,w:80,h:96},{x:288,y:128,w:64,h:32}],lights:[],
   points:[
    {id:'darkrainMeetMother',speaker:mother,x:328,y:208,label:'Parley with the Wight Mother'},
    {id:'darkrainClimb',x:328,y:152,label:'Climb into the snow'}
   ]
  };
  scenes[slope]={
   name:'Dark Rain · The Dragon’s Skull',image:slopeArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:192,w:416,h:112},{x:208,y:304,w:224,h:32},{x:288,y:336,w:80,h:64},{x:288,y:144,w:96,h:48}],lights:[],
   points:[
    {id:'darkrainCold',x:328,y:272,label:'Stop in the shelter of the rocks'},
    {id:'darkrainHunt',speaker:bear,x:440,y:240,label:'Hunt the dire polar bear as Reese'},
    {id:'darkrainMakeClothing',x:440,y:240,label:'Make winter clothing from the hide'},
    {id:'darkrainReadSkull',x:328,y:192,label:'Examine the frozen undead and the skull'},
    {id:'darkrainThroughSkull',x:328,y:152,label:'Enter the dragon’s jaws'}
   ]
  };
  scenes[passage]={
   name:'Dark Rain · Inside the Dragon’s Jaws',image:passageArt,spawn:[328,344],blocks:[],
   walk:[{x:224,y:304,w:192,h:96},{x:192,y:192,w:256,h:112},{x:256,y:128,w:128,h:64},{x:288,y:80,w:64,h:48}],lights:[],points:[]
  };
  MAP_LAYERS[passage]={foreground:passageArt,contain:true,background:{type:'solid',color:'#1d2937'}};
  MAP_LAYERS[pass]={foreground:passArt,contain:true,background:{type:'solid',color:'#20282c'}};
  MAP_LAYERS[slope]={foreground:slopeArt,contain:true,background:{type:'solid',color:'#263744'}};
  JOURNEYS[pass]='10 Gozran, 4717. The company turns south through Cheliax and east into Isger. An undead army stands between it and the Frost Giants.';
  JOURNEYS[slope]='The Wight Mother lets the company pass. The trail climbs into bitter cold, beneath the bones of an immense dragon.';
  JOURNEYS[passage]='The company enters the jaws. The undead remain frozen outside. Follow the light to the far side of the ridge.';
  NAMES[mother]='The Wight Mother';
  NAMES[bear]='Dire Polar Bear';
  FUTURE_NPCS[mother]={source:portrait,frame:{x:43,y:4,w:874,h:1526}};
  DIALOGUE_FACE_CROPS[mother]={x:439,y:62,w:225,h:225};
  FUTURE_NPCS[bear]={source:sheet,frame:model.frames[0]};
  COMBAT_IDLES[bear]=model;
  STATS[bear]={hp:19,ac:12,atk:4,dmg:[1,8,1]};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[pass]=await loader(passArt);})(),
   (async()=>{art[slope]=await loader(slopeArt);})(),
   (async()=>{art[passage]=await loader(passageArt);})(),
   ...[portrait,sheet].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){return [pass,slope,passage].includes(scene)?art[scene]:null;}
 function roster(){
  if(scene===slope&&quest.darkrainColdSeen&&!quest.darkrainBearWon)return ['reese'];
  if(![pass,slope,passage].includes(scene))return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===cave&&quest.tathlumHuntComplete)return [point('darkrainLeaveNidal')];
  if(scene===pass)return [point(quest.darkrainPact?'darkrainClimb':'darkrainMeetMother')];
  if(scene!==slope)return null;
  if(quest.darkrainComplete)return [];
  const id=!quest.darkrainColdSeen?'darkrainCold':!quest.darkrainBearWon?'darkrainHunt':
   !quest.darkrainClothed?'darkrainMakeClothing':!quest.darkrainSkullSeen?'darkrainReadSkull':'darkrainThroughSkull';
  return [point(id)];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===slope&&quest.darkrainComplete?'The company has passed through the dragon’s skull.':null);}
 function npcs(){
  if(scene===pass)return [{id:mother,x:328,y:174,height:67}];
  if(scene===passage)return [];
  if(scene!==slope)return null;
  return quest.darkrainColdSeen&&!quest.darkrainComplete?[{id:bear,x:440,y:204,height:63,pose:quest.darkrainBearWon?'prone':null}]:[];
 }
 function drawWard(g,t){
  const inside=scene===passage;
  if(!inside&&(scene!==slope||!quest.darkrainSkullSeen))return;
  const motion=reduce.matches?0:t;
  const sources=inside?[[206,212],[388,241],[382,152]]:[[249,160],[407,163]];
  g.save();
  for(const [index,[x,y]] of sources.entries()){
   const radius=inside?40:25;
   const halo=g.createRadialGradient(x,y,1,x,y,radius);
   halo.addColorStop(0,'#daedff');
   halo.addColorStop(1,'#96c1ff00');
   g.fillStyle=halo;
   g.globalAlpha=.15+.05*Math.sin(motion*2+index);
   g.fillRect(x-radius,y-radius,radius*2,radius*2);
   g.fillStyle='#d6eaff';
   for(let i=0;i<6;i++){
    const rise=(i*7+motion*12)%39;
    g.globalAlpha=.4*(1-rise/39);
    g.fillRect(Math.round(x+(i%3-1)*12+Math.sin(i+rise*.12)*4),Math.round(y-rise),1+i%2,2);
   }
  }
  g.restore();
 }
 function effects(g,t){
  drawWard(g,t);
  if((scene!==slope&&scene!==pass)||reduce.matches)return;
  const snow=scene===slope;
  g.save();
  for(let i=0;i<38;i++){
   const x=(i*83+Math.floor(t*(snow?8+i%4:26)))%640,y=(i*47+Math.floor(t*(snow?11+i%5:58)))%400;
   g.globalAlpha=.12+i%4*.06;
   g.fillStyle=snow?'#e6f4fb':'#b6c8ce';
   g.fillRect(x,y,snow?1+i%2:1,snow?1+i%3:3+i%3);
  }
  g.restore();
 }
 function isBearBattle(value){return value===kind;}
 function beginFight(){
  const {x,y,dir}=units[0],max=STATS[bear].hp;
  save();
  startBattle(0,false,{kind,enemies:[{id:bear,name:NAMES[bear],shortName:'Dire Bear',hp:max,max}],returnPosition:[x,y,dir],
   opening:'Reese hunts alone. Bring down the bear for its hide.'});
 }
 async function afterBattle(position){
  quest.darkrainBearWon=true;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  await say('Chronicle','Reese brings down the bear alone. Its thick hide can keep the company warm.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'darkrainLeaveNidal':
    quest.darkrainReached=true;
    await travel(pass,328,344);
    break;
   case 'darkrainMeetMother':
    await say('draymus','That army is hers. She was a necromancer in life, and Urgathoa made her something greater in death.');
    await say(mother,'You seek passage. Remove the Frost Giants from my land, and my host will let you through.');
    await say('draymus','Let us climb, and we’ll deal with the giants.');
    quest.darkrainPact=true;
    break;
   case 'darkrainClimb':
    quest.darkrainSlopeReached=true;
    await travel(slope,328,344);
    break;
   case 'darkrainCold': {
    await say('freya','We’ll freeze before we reach the giants. Find something we can use for warmth.');
    await say('reese','Bear tracks. It went toward that ridge. I’ll go alone.');
    const {x,y,dir}=units[0];
    quest.darkrainColdSeen=true;
    seedParty(x,y,dir);
    break;
   }
   case 'darkrainHunt':
    beginFight();
    return true;
   case 'darkrainMakeClothing':
    await say('Chronicle','Reese makes winter clothing from the bear’s hide. The company keeps the carcass as it prepares to move on.');
    quest.darkrainClothed=true;
    break;
   case 'darkrainReadSkull':
    await say('Chronicle','A storm giant skeleton and winter wights stand motionless beside the immense skull.');
    await say('draymus','I can feel the bones holding them. It’s like Halt Undead. This might have been an ancestor of the gold or silver dragons.');
    quest.darkrainSkullSeen=true;
    break;
   case 'darkrainThroughSkull':
    quest.darkrainInsideSkull=true;
    await travel(passage,328,344);
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,effects,isBearBattle,afterBattle,interact};
})();
