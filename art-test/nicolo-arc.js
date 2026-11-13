"use strict";

window.NicoloArc=(()=>{
 const salon='egorian_feud_salon',lane='egorian_nicolo_lane',kind='nicolo_gray_men';
 const map='egorian-nicolo-lane-v1.png',allyArt='egorian-nicolo-v1.png',enemyArt='egorian-gray-man-v1.png';
 const nicolo='nicolo',gray='gray_man';
 let ambushRevealEpoch=null;
 const ready={x:104,y:12,w:468,h:766,anchorX:387},strike={x:946,y:136,w:984,h:632,anchorX:1376};
 const model={
  src:enemyArt,frames:[
   {x:13,y:4,w:500,h:714,anchorX:286,anchorY:718},
   {x:636,y:64,w:780,h:654,anchorX:1070,anchorY:718},
   {x:1614,y:4,w:488,h:714,anchorX:1884,anchorY:718}
  ],maxHeight:714,cycle:[0,2],attackFrames:true
 };

 function install(){
  scenes[salon].points.push({id:'nicoloLeaveSalon',x:328,y:392,label:'Go to meet Nicolo Alazario'});
  scenes[lane]={
   name:'Egorian · Townhouse Lane',image:map,spawn:[328,344],blocks:[],
   walk:[{x:48,y:192,w:544,h:160},{x:288,y:352,w:64,h:48}],lights:[[155,125],[501,125]],
   points:[
    {id:'nicoloMeet',speaker:nicolo,x:328,y:203,label:'Speak to Nicolo Alazario'},
    {id:'nicoloFight',x:328,y:216,label:'Fight the Gray Men'},
    {id:'nicoloAftermath',speaker:nicolo,x:328,y:203,label:'Check on Nicolo'},
    {id:'nicoloLeaveLane',x:328,y:392,label:'Leave the lane with Nicolo'}
   ]
  };
  MAP_LAYERS[lane]={foreground:map,contain:true,background:{type:'solid',color:'#121722'}};
  JOURNEYS[lane]='1 Pharast, 4717. The company goes to see Nicolo Alazario, Vasvion’s fiancé and the son of Egorian’s Lord Mayor.';
  NAMES[nicolo]='Nicolo Alazario';
  NAMES[gray]='Gray Man';
  STATS[gray]={hp:22,ac:15,atk:6,dmg:[1,6,2]};
  FUTURE_NPCS[nicolo]={source:allyArt,frame:ready};
  DIALOGUE_FACE_CROPS[nicolo]={x:310,y:10,w:181,h:181};
  FUTURE_NPCS[gray]={source:enemyArt,frame:model.frames[0]};
  COMBAT_IDLES[gray]=model;
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[lane]=await loader(map);})(),
   ...[allyArt,enemyArt].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){return scene===lane?art[scene]:null;}
 function points(){
  if(!quest.sethicFinanceComplete)return null;
  if(scene===salon)return quest.nicoloRescueComplete?[]:[point('nicoloLeaveSalon')];
  if(scene!==lane)return null;
  if(!quest.nicoloAmbushed)return [point('nicoloMeet')];
  if(!quest.nicoloGrayMenDriven)return [point('nicoloFight')];
  return [point(quest.nicoloChecked?'nicoloLeaveLane':'nicoloAftermath')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  return target()?.label||(scene===salon&&quest.nicoloRescueComplete?'Nicolo Alazario survived the Gray Men’s ambush.':null);
 }
 function npcs(){
  if(scene!==lane)return null;
  const actors=[{id:nicolo,x:328,y:203,height:57}];
  if(!quest.nicoloGrayMenDriven&&(quest.nicoloAmbushed||ambushRevealEpoch===epoch))
   actors.push(...[[232,198],[390,185],[445,222]].map(([x,y])=>({id:gray,x,y,height:53})));
  return actors;
 }
 function beginFight(){
  const {x,y,dir}=units[0],max=STATS[gray].hp;
  const enemies=[1,2,3].map(i=>({id:gray,name:'Gray Man '+i,shortName:'Gray Man '+i,hp:i===1?max-7:max,max}));
  save();
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir]});
 }
 function support(){
  if(battle?.kind!==kind)return;
  const target=battle.enemies.find(enemy=>enemy.hp>1);
  if(!target)return;
  const damage=Math.min(target.hp-1,6);
  target.hp-=damage;
  battle.nicoloStrikeAt=performance.now();
  GameAudio.effect('hit');
  flash(target,'−'+damage,'#e8ce9b');
  log('Nicolo flanks\n'+target.name+': −'+damage+' HP');
 }
 function drawSupport(g){
  if(battle?.kind!==kind||!art[allyArt])return;
  const moving=!reduce.matches&&battle.nicoloStrikeAt!=null&&performance.now()-battle.nicoloStrikeAt<360;
  const f=moving?strike:ready,scale=64/ready.h;
  g.save();
  g.imageSmoothingEnabled=false;
  g.drawImage(art[allyArt],f.x,f.y,f.w,f.h,230+Math.round((f.x-f.anchorX)*scale)+(moving?9:0),232-Math.round(f.h*scale),Math.round(f.w*scale),Math.round(f.h*scale));
  g.restore();
 }
 async function afterBattle(position){
  quest.nicoloGrayMenDriven=true;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  await say('Chronicle','The Gray Men are beaten back. Nicolo is still on his feet.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'nicoloLeaveSalon':
    quest.nicoloLaneReached=true;
    await travel(lane,328,344);
    break;
   case 'nicoloMeet':{
    await say(nicolo,'Levisvia said you might come. I take it this is about Sethic.');
    ambushRevealEpoch=epoch;
    await say('Chronicle','Three gray-clad figures break from the shadows and close on Nicolo. He draws before the nearest reaches him.');
    await storyRoll('Nicolo · Opening strike',17,0,'Nicolo wounds the lead assassin');
    await say('freya','He can handle a blade. Keep the others off his flank.');
    quest.nicoloAmbushed=true;
    ambushRevealEpoch=null;
    break;
   }
   case 'nicoloFight':
    beginFight();
    return true;
   case 'nicoloAftermath':
    await say(nicolo,'I’m all right. Those were the Gray Men of Norgorber.');
    await say('freya','You held your ground. Let’s get you out of this street.');
    quest.nicoloChecked=true;
    break;
   case 'nicoloLeaveLane':
    await journeyCard('Egorian · The attempt foiled','The Gray Men fail to kill Nicolo Alazario. The company gets him clear and returns to the reception hall.',()=>{
     quest.nicoloRescueComplete=true;
     setScene(salon,328,344);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,support,drawSupport,afterBattle,interact};
})();
