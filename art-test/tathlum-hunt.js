"use strict";

window.TathlumHunt=(()=>{
 const pass='menador_pass',orders='tathlum_orders',border='gheistano_road',village='nidal_hunt_village',attackSite='nidal_giant_attack_site',cave='nidal_giant_lair';
 const borderArt='gheistano-road-v1.png',patrolArt='nidal-patrol-v1.png',patrol='nidal_patrol';
 const patrolFrames=[
  {x:242,y:12,w:265,h:700,anchorX:401},
  {x:860,y:12,w:401,h:700,anchorX:1090},
  {x:1586,y:12,w:419,h:700,anchorX:1820}
 ];
 const patrolRoute=[[488,190],[541,221],[533,255],[498,284],[476,312]];
 const townArt='tathlum-nidal-village-v1.png',caveArt='tathlum-cave-lair-v1.png',sheet='tathlum-cave-giant-v1.png';
 const attackArt='tathlum-nidal-attack-site-v1.png';
 const giant='tathlum_cave_giant',kind='tathlum_giant_duel';
 const model={src:sheet,frames:[
  {x:4,y:17,w:617,h:670,anchorX:371,anchorY:680},
  {x:633,y:47,w:811,h:640,anchorX:1130,anchorY:680},
  {x:1480,y:24,w:660,h:663,anchorX:1865,anchorY:680}
 ],maxHeight:670,cycle:[0,2],attackFrames:true};
 const duels=()=>quest.tathlumDuels??0;

 function install(){
  scenes[pass].points.push({id:'tathlumReturn',x:328,y:344,label:'Return to Egorian for new orders'});
  scenes[orders]={
   ...scenes.egorian_court,name:'Egorian · The Tathlum Orders',points:[
    {id:'tathlumReceiveOrders',speaker:'corrine',x:328,y:272,label:'Receive the Tathlum assignment'},
    {id:'tathlumDepartNidal',x:328,y:344,label:'Set out for Nidal'}
   ]
  };
  scenes[border]={
   name:'Nidal · In Sight of Citadel Gheistano',image:borderArt,spawn:[328,344],blocks:[],
   walk:[{x:128,y:224,w:256,h:48},{x:160,y:272,w:224,h:32},{x:224,y:304,w:160,h:32},{x:288,y:336,w:64,h:64}],lights:[],
   points:[
    {id:'tathlumSpotPatrol',x:296,y:248,label:'Watch the Nidalese patrol'},
    {id:'tathlumSkirtPatrol',x:152,y:248,label:'Slip past the patrol under cover'}
   ]
  };
  scenes[village]={
   name:'Nidal · Village on the Giant Trail',image:townArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:160,w:416,h:112},{x:192,y:272,w:240,h:48},{x:272,y:320,w:80,h:80},{x:288,y:128,w:64,h:32}],lights:[[177,122],[247,122],[393,116],[559,188]],
   points:[
    {id:'tathlumThrall',x:216,y:200,label:'Investigate the cave-giant attacks'},
    {id:'tathlumFollowThrall',x:328,y:152,label:'Follow the thrall to the last attack'}
   ]
  };
  scenes[attackSite]={
   name:'Nidal · The Last Cave-Giant Attack',image:attackArt,spawn:[328,344],blocks:[],
   walk:[{x:144,y:208,w:368,h:96},{x:208,y:304,w:208,h:32},{x:288,y:336,w:80,h:64},{x:432,y:144,w:80,h:64}],lights:[],
   points:[
    {id:'tathlumExamineAttack',x:216,y:248,label:'Inspect the damage'},
    {id:'tathlumTrack',x:472,y:152,label:'Follow the tracks uphill'}
   ]
  };
  scenes[cave]={
   name:'Nidal · Cave-Giant Lair',image:caveArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:144,w:416,h:160},{x:208,y:304,w:224,h:32},{x:288,y:336,w:64,h:64}],lights:[[212,80],[239,96],[422,93],[453,73]],
   points:[
    {id:'tathlumBait',x:328,y:248,label:'Send the thrall in as bait'},
    {id:'tathlumDuel',x:328,y:216,label:'Challenge a cave giant'},
    {id:'tathlumRunes',x:328,y:216,label:'Inspect the belt’s new runes'}
   ]
  };
  MAP_LAYERS[orders]=MAP_LAYERS.egorian_court;
  MAP_LAYERS[border]={foreground:borderArt,contain:true,background:{type:'solid',color:'#19212b'}};
  MAP_LAYERS[village]={foreground:townArt,contain:true,background:{type:'solid',color:'#18232d'}};
  MAP_LAYERS[attackSite]={foreground:attackArt,contain:true,background:{type:'solid',color:'#20292c'}};
  MAP_LAYERS[cave]={foreground:caveArt,contain:true,background:{type:'solid',color:'#161c23'}};
  JOURNEYS[orders]='4 Gozran, 4717. Freya returns to Egorian for the Queen’s next assignment.';
  JOURNEYS[border]='8 Gozran, 4717. Citadel Gheistano is in sight as the company enters Nidal. Avoid the patrols and continue toward the reported cave-giant attacks.';
  JOURNEYS[village]='The company leaves the patrols behind and reaches a Nidalese village near the reported cave-giant attacks.';
  JOURNEYS[attackSite]='Draymus’s thrall leads the company to the site of the latest cave-giant attack. Look for signs of where the giants went.';
  JOURNEYS[cave]='With Reese scouting ahead, the company follows the trail to the giants’ lair.';
  NAMES[giant]='Cave Giant';
  FUTURE_NPCS[giant]={source:sheet,frame:model.frames[0]};
  COMBAT_IDLES[giant]=model;
  STATS[giant]={hp:13,ac:12,atk:5,dmg:[1,8,2]};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[border]=await loader(borderArt);})(),
   (async()=>{art[patrolArt]=await loader(patrolArt);})(),
   (async()=>{art[village]=await loader(townArt);})(),
   (async()=>{art[attackSite]=await loader(attackArt);})(),
   (async()=>{art[cave]=await loader(caveArt);})(),
   (async()=>{art[sheet]=await loader(sheet);})()
  ]);
 }
 function mapImage(){
  if(scene===orders)return art.egorian_court;
  return [border,village,attackSite,cave].includes(scene)?art[scene]:null;
 }
 function roster(){
  if(scene===cave&&quest.tathlumBaitSet&&duels()<3)return ['freya'];
  if(![orders,border,village,attackSite,cave].includes(scene))return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===pass&&quest.menadorComplete)return [point('tathlumReturn')];
  if(scene===orders)return [point(quest.tathlumBriefed?'tathlumDepartNidal':'tathlumReceiveOrders')];
  if(scene===border)return [point(quest.tathlumPatrolSpotted?'tathlumSkirtPatrol':'tathlumSpotPatrol')];
  if(scene===village)return [point(quest.tathlumThrallMade?'tathlumFollowThrall':'tathlumThrall')];
  if(scene===attackSite)return [point(quest.tathlumAttackExamined?'tathlumTrack':'tathlumExamineAttack')];
  if(scene!==cave)return null;
  if(quest.tathlumHuntComplete)return [];
  if(!quest.tathlumBaitSet)return [point('tathlumBait')];
  return [point(duels()<3?'tathlumDuel':'tathlumRunes')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  if(scene===cave&&quest.tathlumHuntComplete)return 'The cave-giant hunt is complete. The company prepares to turn south.';
  return target()?.id==='tathlumDuel'?'Freya’s cave-giant duels ['+duels()+'/3]':target()?.label||null;
 }
 function npcs(){
  if(scene===orders)return [{id:'corrine',x:328,y:240,height:58}];
  if(scene===border)return [0,1].map(patrolPosition);
  if(scene===village)return [
   {id:'citizen-nidal-thrall',x:quest.tathlumThrallMade?321:218,y:quest.tathlumThrallMade?130:173,dir:'down',variant:6},
   {id:'citizen-nidal-villager',x:489,y:235,dir:'left',variant:1}
  ];
  if(scene===attackSite)return [{id:'citizen-nidal-thrall',x:200,y:226,dir:'up',variant:6}];
  if(scene!==cave)return null;
  if(!quest.tathlumBaitSet)return [{id:'citizen-nidal-thrall',x:328,y:224,dir:'up',variant:6}];
  return [[270,168],[328,151],[385,173]].map(([x,y],i)=>({
   id:giant,x,y,height:75,pose:i<duels()?'prone':null
  }));
 }
 function patrolPosition(index){
  const t=reduce.matches?0:Handheld.time(performance.now()/1000);
  const phase=(t*.13+index*.19)%1;
  const distance=(phase<.5?phase*2:2-phase*2)*(patrolRoute.length-1);
  const leg=Math.min(Math.floor(distance),patrolRoute.length-2);
  const fraction=distance-leg;
  const [x,y]=patrolRoute[leg], [nextX,nextY]=patrolRoute[leg+1];
  const facingRight=(phase<.5)===(nextX>x);
  return {id:patrol,x:x+(nextX-x)*fraction,y:y+(nextY-y)*fraction,dir:facingRight?'right':'left',
   frame:reduce.matches?0:[0,1,0,2][Math.floor(t*5+index)%4]};
 }
 function drawPatrol(g,u){
  if(u.id!==patrol)return false;
  const im=art[patrolArt],f=patrolFrames[u.frame];
  if(!im||!f)return true;
  const scale=49/f.h;
  g.save();
  g.imageSmoothingEnabled=false;
  g.translate(Math.round(u.x),Math.round(u.y));
  if(u.dir==='right')g.scale(-1,1);
  g.drawImage(im,f.x,f.y,f.w,f.h,Math.round((f.x-f.anchorX)*scale),-Math.round(f.h*scale),Math.round(f.w*scale),Math.round(f.h*scale));
  g.restore();
  return true;
 }
 function beginFight(){
  const {x,y,dir}=units[0],max=STATS[giant].hp;
  save();
  startBattle(0,false,{kind,enemies:[{id:giant,name:'Cave Giant '+(duels()+1),shortName:'Cave Giant',hp:max,max}],
   returnPosition:[x,y,dir],opening:'Freya takes the giant in single combat.'});
 }
 function isHuntBattle(value){return value===kind;}
 async function afterBattle(position){
  quest.tathlumDuels=duels()+1;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  if(duels()===3)await say('Chronicle','The last giant falls. New runes come to life on Freya’s dwarven champion’s belt.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'tathlumReturn':
    quest.tathlumOrdersReached=true;
    await travel(orders,328,344);
    break;
   case 'tathlumReceiveOrders':
    await say('corrine','The Queen has raised you to Lieutenant Colonel. She orders you to assemble the ingredients for a Tathlum.');
    await say('freya','The old Kellid rite. How much power is she asking for?');
    await say('corrine','Her list calls for stronger ingredients than the old accounts. We don’t know what that will do. Start in Nidal. Hunt cave giants, cyclopes and trolls, and scout the sacred fountain.');
    quest.tathlumBriefed=true;
    break;
   case 'tathlumDepartNidal':
    SouthRoad.recover(1);
    quest.tathlumBorderReached=true;
    await travel(border,328,344);
    break;
   case 'tathlumSpotPatrol':
    await say('reese','That’s Citadel Gheistano. The patrol is keeping to the road. There’s cover along the rocks to our left.');
    quest.tathlumPatrolSpotted=true;
    break;
   case 'tathlumSkirtPatrol':
    await say('freya','They’re allies, but we’d lose time explaining ourselves. Keep to the rocks. We’ll be past them in a moment.');
    quest.tathlumNidalReached=true;
    await travel(village,328,344);
    break;
   case 'tathlumThrall':
    await say('Chronicle','Looking for the giants’ latest attack, Draymus murders a man and animates the body. He orders his new thrall to show them where the giants struck.');
    await say('reese','Let it show us the spot. I’ll take the trail from there.');
    quest.tathlumThrallMade=true;
    break;
   case 'tathlumFollowThrall':
    quest.tathlumAttackReached=true;
    await travel(attackSite,328,344);
    break;
   case 'tathlumExamineAttack':
    await say('draymus','It stopped here. Look what the giants did to the timber.');
    await say('reese','The beams were torn out from the yard. See the deep prints? They lead out on the uphill side.');
    quest.tathlumAttackExamined=true;
    break;
   case 'tathlumTrack':
    await say('reese','This is where the trail leaves the yard. Stay low and keep behind me.');
    quest.tathlumLairReached=true;
    await travel(cave,328,344);
    break;
   case 'tathlumBait': {
    await say('draymus','Go in. Make enough noise that they all look your way.');
    await say('Chronicle','The thrall draws the cave giants out. Freya takes the opening and challenges them one at a time.');
    const {x,y,dir}=units[0];
    quest.tathlumBaitSet=true;
    seedParty(x,y,dir);
    break;
   }
   case 'tathlumDuel':
    beginFight();
    return true;
   case 'tathlumRunes':
    await say('freya','The cave-giant rune has awakened. We’ve done what we came to do at this lair.');
    quest.tathlumHuntComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,drawPatrol,isHuntBattle,afterBattle,interact};
})();
