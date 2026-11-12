"use strict";

window.SenaraGraveyard=(()=>{
 const quay='senara_patrolled_quay',guild='senara_daggers_return',grave='senara_graveyard',locked='senara_locked_quay';
 const angel='senara_balisse',speaker='senara_dagger_speaker',paladin='fastness_paladin',kind='senara_graveyard_angel';
 const map='senara-graveyard-v1.png',sprite='senara-balisse-v1.png';
 const barricade='senara_lockdown_barricade',barrierArt='senara-lockdown-barricade-v1.png';
 const guildSpawn=[328,344],graveSpawn=[328,344];
 function install(){
  scenes[quay].points.push({id:'senaraSlipToGuild',x:280,y:144,label:'Slip down to the Black Daggers'});
  scenes[guild]={...scenes.senara_daggers_hideout,name:'Senara · Black Daggers’ Intelligence',points:[
   {id:'senaraGuildBrief',speaker,x:328,y:200,label:'Ask what the Black Daggers have found'},
   {id:'senaraGraveRoad',x:328,y:344,label:'Head straight to the graveyard'}
  ]};
  scenes[grave]={
   name:'Senara · The Graveyard',image:map,spawn:graveSpawn,blocks:[],
   walk:[{x:208,y:144,w:224,h:96},{x:272,y:240,w:96,h:160}],lights:[[34,79],[116,66],[284,65],[355,65],[525,66],[606,79],[257,330],[382,330]],
   points:[
    {id:'senaraAngelFight',x:328,y:224,label:'Engage the graveyard angel'},
    {id:'senaraAngelHeart',x:328,y:168,label:'Recover the angel’s heart'}
   ]
  };
  scenes[locked]={...scenes[quay],name:'Senara · Under Lockdown',blocks:[{x:304,y:144,w:112,h:32}],points:[
   {id:'senaraConfirmLockdown',x:360,y:184,label:'Check the river road barricade'}
  ]};
  MAP_LAYERS[guild]=MAP_LAYERS.senara_daggers_hideout;
  MAP_LAYERS[grave]={foreground:map,contain:true,background:{type:'solid',color:'#141922'}};
  MAP_LAYERS[locked]=MAP_LAYERS[quay];
  JOURNEYS[guild]='The company slips beneath Senara to ask the Black Daggers what they know. Their agreement with the guild has already yielded a lead.';
  JOURNEYS[grave]='The Black Daggers’ scouts confirm a powerful angel at the local graveyard. Freya’s company moves against it before the Reclamation can react.';
  JOURNEYS[locked]='The Reclamation discovers the angel’s death and locks down Senara. Guards close the streets and watch the river road.';
  NAMES[angel]='Balisse Angel';
  STATS[angel]={hp:84,ac:16,atk:8,dmg:[2,6,3]};
  FUTURE_NPCS[angel]={source:sprite,frame:{x:9,y:0,w:1179,h:1318}};
  DIALOGUE_FACE_CROPS[angel]={x:490,y:151,w:265,h:265};
  FUTURE_NPCS[barricade]={source:barrierArt,frame:{x:34,y:154,w:2106,h:436}};
 }
 async function load(loader){
  art[guild]=art.senara_daggers_hideout;
  art[locked]=art[quay];
  await Promise.all([
   (async()=>{art[grave]=await loader(map);})(),
   ...[sprite,barrierArt].map(async src=>{art[src]=await loader(src);})
  ]);
 }
 function mapImage(){return [guild,grave,locked].includes(scene)?art[scene]:null;}
 function points(){
  if(!quest.senaraReturnPatrolsSeen)return null;
  if(scene===quay)return [point('senaraSlipToGuild')];
  if(scene===guild)return [point(quest.senaraGraveTip?'senaraGraveRoad':'senaraGuildBrief')];
  if(scene===grave)return [point(quest.senaraBalisseDefeated?'senaraAngelHeart':'senaraAngelFight')];
  if(scene===locked)return quest.senaraLockdownObserved?[]:[point('senaraConfirmLockdown')];
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===locked&&quest.senaraLockdownObserved?'Angel heart recovered · Senara is under lockdown.':null);}
 function npcs(){
  if(scene===guild)return [{id:speaker,x:328,y:184,height:54},{id:'orn',x:392,y:232,height:51}];
  if(scene===grave)return [{id:angel,x:328,y:160,height:65,pose:quest.senaraBalisseDefeated?'prone':null}];
  if(scene===locked)return [
   {id:'orn',x:392,y:240,height:51},
   {id:barricade,x:360,y:172,height:21},
   {id:paladin,x:328,y:160,height:54},{id:paladin,x:360,y:160,height:54},{id:paladin,x:392,y:160,height:54},
   {id:paladin,x:304,y:136,height:52},{id:paladin,x:464,y:144,height:52}
  ];
  return null;
 }
 function startAngelBattle(){
  const {x,y,dir}=units[0],max=STATS[angel].hp;
  save();
  startBattle(0,false,{kind,returnPosition:[x,y,dir],enemies:[{id:angel,name:NAMES[angel],hp:max,max}]});
 }
 async function afterBattle(position){
  quest.senaraBalisseDefeated=true;
  seedParty(...position);
  save();
  paintParty();
  updateObjective();
  await say('Chronicle','The angel falls by the graves. For a moment the only sound is the wind through the trees.');
 }
 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'senaraSlipToGuild':
    await say('jamal','Let the patrol go past the steps. We’ll take the lower way while their backs are turned.');
    await storyRoll('The company · Slip past the patrol',15,0,'Reach the guild unseen');
    quest.senaraGuildRevisited=true;
    await travel(guild,...guildSpawn);
    break;
   case 'senaraGuildBrief':
    await say('freya','You promised to keep us informed. What have the Reclamation brought into Senara?');
    await say(speaker,'An angel. Our scouts watched him land at the old graveyard. He’s still there, keeping watch among the graves.');
    await say('freya','Then we go now. If the Reclamation learns we’re looking for him, they’ll close every gate.');
    quest.senaraGraveTip=true;
    break;
   case 'senaraGraveRoad':
    quest.senaraGraveReached=true;
    await travel(grave,...graveSpawn);
    break;
   case 'senaraAngelFight':
    await say(angel,'Stop there. This ground is under my protection.');
    await say('freya','Spread out. Keep him away from the way we came in.');
    startAngelBattle();
    return true;
   case 'senaraAngelHeart':
    await say('Chronicle','The company takes the fallen angel’s heart, another component for Fex’s ritual.');
    await journeyCard(scenes[locked].name,JOURNEYS[locked],()=>{
     quest.senaraAngelHeart=true;
     setScene(locked,360,344);
    });
    break;
   case 'senaraConfirmLockdown':
    await say('reese','The river road is shut. There are guards at every way out I can see.');
    await say('freya','We have the heart. Get out of sight. We’ll work out how to move once we’re clear of the patrols.');
    quest.senaraLockdownObserved=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 function drawCombat(g,u,v,t){
  if(u.id!==angel)return false;
  const image=art[sprite];
  if(!image)return false;
  const f=FUTURE_NPCS[angel].frame,pose=actionPose(u);
  const idle=reduce.matches||battle.animation?.actor===u||u.hp===0?0:[0,1,0,-1][Math.floor(t*4)%4];
  const scale=Math.min(v.height/f.h,155/f.w);
  g.save();
  g.imageSmoothingEnabled=false;
  g.translate(v.x+pose.dx,v.y+pose.dy);
  g.rotate(pose.tilt+idle*.014);
  g.scale(-1,1);
  g.drawImage(image,f.x,f.y,f.w,f.h,Math.round(-f.w*scale/2),-Math.round(f.h*scale+idle),Math.round(f.w*scale),Math.round(f.h*scale+idle));
  g.restore();
  return true;
 }
 function effect(g,a){
  if(a.type!=='balisse_flame')return false;
  const p=CombatArt.phase(a),from=battlePosition(a.actor),to=battlePosition(a.target);
  if(p<.22)return true;
  g.save();
  g.globalAlpha=Math.sin(p*Math.PI)*.88;
  const travel=Math.min(1,(p-.22)/.42);
  const x=from.x+(to.x-from.x)*travel,y=(from.y-from.height*.57)+(to.y-to.height*.58-from.y+from.height*.57)*travel;
  for(let i=0;i<10;i++){
   const offset=i-5,px=Math.round(x+offset*4),py=Math.round(y+offset*1.8);
   g.fillStyle='#c56c37';g.fillRect(px,py-7-i%4*3,4,14+i%3*4);
   g.fillStyle='#f9dc91';g.fillRect(px+1,py-3-i%4*2,2,8);
  }
  g.restore();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,interact,afterBattle,drawCombat,effect};
})();
