"use strict";

window.BarrowTrail=(()=>{
 const vyre='vyre_wish_room',road='barrow_road',grove='barrow_grove',druid='barrow_druid';
 const scoutFight='barrow_scouts',groveFight='barrow_guardians';
 const roadArt='barrow-road-v1.png',groveArt='barrow-grove-v1.png',stoneArt='barrow-standing-stone-v1.png',sheet='barrow-druid-v1.png';
 const stones=[
  [144,244],[232,192],[328,224],[440,252],[480,176],[328,152],
  [144,264],[240,224],[400,264],[496,216],[432,160],[232,164],[328,144]
 ];
 const stonePoint=index=>({id:'barrowStone'+(index+1),x:stones[index][0],y:stones[index][1],label:'Mark standing stone '+(index+1)});
 const stoneBlocks=(start,end)=>stones.slice(start,end).map(([x,y])=>({x:x-11,y:y-21,w:22,h:15}));
 const model={src:sheet,deferred:true,frames:[
  {x:106,y:7,w:386,h:704,anchorX:325,anchorY:711},
  {x:701,y:7,w:602,h:704,anchorX:1082,anchorY:711},
  {x:1586,y:7,w:472,h:704,anchorX:1836,anchorY:711}
 ],maxHeight:704,cycle:[0,2],attackFrames:true};
 const tally=()=>quest.barrowStones??0;

 function install(){
  scenes[vyre].points.push({id:'barrowDepart',x:320,y:392,label:'Rejoin the company for the Barrowood pilgrimage'});
  scenes[road]={
   name:'Barrowood · Pilgrim Road',image:roadArt,spawn:[328,344],blocks:stoneBlocks(0,6),
   walk:[{x:96,y:128,w:448,h:192},{x:288,y:320,w:64,h:80},{x:304,y:80,w:48,h:48}],lights:[],
   points:[
    ...stones.slice(0,6).map((_,i)=>stonePoint(i)),
    {id:'barrowScoutFight',x:328,y:192,label:'Repel the Reclamation scouts'},
    {id:'barrowEnterGrove',x:328,y:96,label:'Follow the trail deeper into the Barrowood'}
   ]
  };
  scenes[grove]={
   name:'Barrowood · The Old Grove',image:groveArt,spawn:[328,344],blocks:stoneBlocks(6,13),
   walk:[{x:96,y:128,w:448,h:192},{x:288,y:320,w:64,h:80},{x:304,y:80,w:48,h:48}],lights:[],
   points:[
    ...stones.slice(6).map((_,i)=>stonePoint(i+6)),
    {id:'barrowGuardianFight',speaker:druid,x:328,y:216,label:'Face the paladins and the grove’s druid'},
    {id:'barrowFinalApproach',x:328,y:108,label:'Approach the final stone'}
   ]
  };
  MAP_LAYERS[road]={foreground:roadArt,contain:true,background:{type:'solid',color:'#212520'}};
  MAP_LAYERS[grove]={foreground:groveArt,contain:true,background:{type:'solid',color:'#171f1d'}};
  JOURNEYS[road]='1 Gozran, 4717. Carrying Sethic overland from Egorian, the company follows Abrogail I’s route through the Barrowood. A drop of his blood must mark each of the fourteen stones.';
  JOURNEYS[grove]='Beyond the first six stones, the trail winds deeper into the trees. Keep Sethic alive and continue the rite.';
  NAMES[druid]='Barrowood Druid';
  FUTURE_NPCS[druid]={source:sheet,frame:model.frames[0]};
  DIALOGUE_FACE_CROPS[druid]={x:239,y:20,w:144,h:144};
  COMBAT_IDLES[druid]=model;
  STATS[druid]={hp:32,ac:14,atk:6,dmg:[1,8,3]};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[road]=await loader(roadArt);})(),
   (async()=>{art[grove]=await loader(groveArt);})(),
   ...[stoneArt,sheet].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){return scene===road||scene===grove?art[scene]:null;}
 function roster(){
  if(scene!==road&&scene!==grove)return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===vyre&&quest.vyreWishComplete)return [point('barrowDepart')];
  if(scene===road){
   if(tally()===3&&!quest.barrowScoutsDefeated)return [point('barrowScoutFight')];
   return [point(tally()<6?'barrowStone'+(tally()+1):'barrowEnterGrove')];
  }
  if(scene!==grove)return null;
  if(quest.barrowTrailComplete)return [];
  if(tally()===9&&!quest.barrowGuardiansDefeated)return [point('barrowGuardianFight')];
  return [point(tally()<13?'barrowStone'+(tally()+1):'barrowFinalApproach')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  const next=target();
  if(scene!==road&&scene!==grove)return next?.label||null;
  if(!next)return quest.barrowTrailComplete?'Thirteen stones marked. The final stone lies ahead.':null;
  return next.label+' ['+tally()+'/14]';
 }
 function npcs(){
  if(scene===road)return tally()===3&&!quest.barrowScoutsDefeated?
   [[284,169],[328,156],[376,172]].map(([x,y])=>({id:'kantaria_guard',x,y,height:52})):[];
  if(scene!==grove)return null;
  if(tally()!==9||quest.barrowGuardiansDefeated)return [];
  return [{id:druid,x:328,y:185,height:58},
   {id:'fastness_paladin',x:272,y:194,height:58},{id:'fastness_paladin',x:384,y:194,height:58}];
 }
 function effects(g,t){
  const image=art[stoneArt];
  if(!image||scene!==road&&scene!==grove)return;
  const start=scene===road?0:6,end=scene===road?6:13;
  g.save();
  g.imageSmoothingEnabled=false;
  for(let i=start;i<end;i++){
   const [x,y]=stones[i],height=40+i%3*5,width=Math.round(height*.43);
   g.globalAlpha=.28;
   g.fillStyle='#0d1515';
   g.beginPath();
   g.ellipse(x+1,y-14,width*.44,4,0,0,Math.PI*2);
   g.fill();
   g.globalAlpha=1;
   g.drawImage(image,211,61,560,1390,x-Math.floor(width/2),y-14-height,width,height);
   if(i<tally()){
    const pulse=reduce.matches?1:.87+Math.sin(t*2.3+i)*.13;
    g.globalAlpha=pulse;
    g.fillStyle='#67262c';
    g.fillRect(x-3,y-30,7,5);
    g.fillStyle='#bd7867';
    g.fillRect(x-1,y-29,3,2);
   }
  }
  g.restore();
 }
 function beginFight(kind){
  const {x,y,dir}=units[0];
  const foes=kind===scoutFight?
   [1,2,3].map(i=>['kantaria_guard','Reclamation Scout '+i,'Scout '+i]):
   [[druid,'Barrowood Druid','Druid'],...([1,2].map(i=>['fastness_paladin','Reclamation Paladin '+i,'Paladin '+i]))];
  const enemies=foes.map(([id,name,shortName])=>({id,name,shortName,hp:STATS[id].hp,max:STATS[id].hp}));
  save();
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir]});
 }
 function isTrailBattle(kind){return kind===scoutFight||kind===groveFight;}
 async function afterBattle(kind,position){
  const scouts=kind===scoutFight;
  if(scouts)quest.barrowScoutsDefeated=true;
  else quest.barrowGuardiansDefeated=true;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  await say('Chronicle',scouts?'The advance scouts fall. Reclamation soldiers have reached farther past the army’s lines than the company expected.':'The paladins and the druid can hold the trail no longer. The company can reach the remaining stones.');
 }
 async function markStone(){
  const next=tally()+1;
  if(next===1)await say('jason','Follow the marker from stone to stone. One drop of Sethic’s blood on each. The offering comes at the fourteenth.');
  if(next===6)await say('freya','Six. Keep the pack steady. We take the trail through those trees.');
  if(next===13)await say('jason','Thirteen. The last stone is just ahead.');
  quest.barrowStones=next;
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  if(id==='barrowStone'+(tally()+1))await markStone();
  else switch(id){
   case 'barrowDepart':
    await say('Chronicle','Bob is back on his feet. The company takes Sethic west from Egorian in the pack it prepared for the journey.');
    SouthRoad.recover(1);
    quest.barrowRoadReached=true;
    await travel(road,328,344);
    break;
   case 'barrowScoutFight':
    await say('reese','Advance scouts. They’ve come a long way past the Chelish lines.');
    beginFight(scoutFight);
    return true;
   case 'barrowEnterGrove':
    quest.barrowGroveReached=true;
    await travel(grove,328,344);
    break;
   case 'barrowGuardianFight':
    await say(druid,'This wood has seen enough blood. You go no farther.');
    beginFight(groveFight);
    return true;
   case 'barrowFinalApproach':
    await say('Chronicle','The western flank of the Reclamation force has broken. The company takes the narrow trail north toward the fourteenth stone.');
    quest.barrowTrailComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,effects,isTrailBattle,afterBattle,interact};
})();
