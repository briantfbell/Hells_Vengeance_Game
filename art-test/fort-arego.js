"use strict";

window.FortArego=(()=>{
 const quay='senara_locked_quay',trail='arego_forest_approach',yard='arego_outer_yard';
 const devil='arego_loose_devil',viona='arego_viona',champion='arego_champion',paladin='fastness_paladin';
 const trailArt='arego-forest-approach-v1.png',yardArt='arego-outer-yard-v1.png';
 const openYard='arego-outer-yard-open-v1.png';
 const devilArt='arego-loose-devil-v1.png',championArt='arego-champions-v1.png';
 const models=[
  {id:devil,name:'Loose Devil',src:devilArt,frame:[151,5,861,1307],face:[526,139,265,265]},
  {id:viona,name:'Viona Kadarius',src:championArt,frame:[12,45,715,748],face:[277,42,185,185]},
  {id:champion,name:'Reclamation Champion',src:championArt,frame:[1180,0,793,793],face:[1404,41,195,195]}
 ];
 const encounters={
  arego_viona_line:{enemies:[viona,paladin,paladin],flag:'aregoVionaFell'},
  arego_prison_door:{enemies:[champion,paladin],flag:'aregoChampionsDefeated'}
 };
 function install(){
  scenes[quay].points.push({id:'aregoDepart',x:360,y:312,label:'Leave Senara for Fort Arego'});
  scenes[trail]={
   name:'Whisperwood · Fort Arego Approach',image:trailArt,spawn:[328,344],blocks:[],
   walk:[{x:272,y:96,w:112,h:64},{x:224,y:160,w:192,h:128},{x:192,y:288,w:240,h:96}],lights:[],
   points:[
    {id:'aregoDevils',speaker:devil,x:328,y:200,label:'Hear the loose devils'},
    {id:'aregoDecision',x:328,y:176,label:'Decide what to do about Fex'},
    {id:'aregoCross',x:328,y:128,label:'Approach the prison yard'}
   ]
  };
  scenes[yard]={
   name:'Fort Arego · Outer Yard',image:yardArt,spawn:[328,344],blocks:[],
   walk:[{x:128,y:128,w:384,h:192},{x:256,y:320,w:128,h:80}],lights:[[237,69],[404,69],[237,320],[404,320]],
   points:[
    {id:'aregoFirstLine',speaker:viona,x:328,y:232,label:'Break Viona’s line'},
    {id:'aregoSecondLine',speaker:champion,x:328,y:168,label:'Take the prison doorway'},
    {id:'aregoSecureYard',x:312,y:128,label:'Open the prison doors'}
   ]
  };
  MAP_LAYERS[trail]={foreground:trailArt,contain:true,background:{type:'solid',color:'#15171a'}};
  MAP_LAYERS[yard]={foreground:yardArt,contain:true,background:{type:'solid',color:'#171822'}};
  JOURNEYS[trail]='The company leaves Senara under cover and heads for Fort Arego, an old military prison in the Whisperwood. The rogue portal is somewhere beneath it.';
  JOURNEYS[yard]='The Glorious Reclamation holds the ruined prison. Freya’s company needs a way past the soldiers and down into the dungeons.';
  STATS[viona]={hp:51,ac:16,atk:7,dmg:[1,8,4]};
  STATS[champion]={hp:56,ac:16,atk:7,dmg:[1,10,3]};
  for(const {id,name,src,frame,face} of models){
   const [x,y,w,h]=frame,[fx,fy,fw,fh]=face;
   NAMES[id]=name;
   FUTURE_NPCS[id]={source:src,frame:{x,y,w,h}};
   DIALOGUE_FACE_CROPS[id]={x:fx,y:fy,w:fw,h:fh};
  }
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[trail]=await loader(trailArt);})(),
   (async()=>{art[yard]=await loader(yardArt);})(),
   ...[devilArt,championArt,openYard].map(async src=>{art[src]=await loader(src);})
  ]);
 }
 function mapImage(){return scene===trail||scene===yard?art[scene]:null;}
 function points(){
  if(!quest.senaraLockdownObserved)return null;
  if(scene===quay)return [point('aregoDepart')];
  if(scene===trail)return [point(!quest.aregoBetrayalKnown?'aregoDevils':!quest.aregoFexOpposed?'aregoDecision':'aregoCross')];
  if(scene===yard)return quest.aregoExteriorSecured?[]:[point(!quest.aregoVionaFell?'aregoFirstLine':!quest.aregoChampionsDefeated?'aregoSecondLine':'aregoSecureYard')];
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===yard&&quest.aregoExteriorSecured?'The way into Fort Arego’s dungeons is clear.':null);}
 function npcs(){
  if(scene===trail)return quest.aregoFexOpposed?[]:[
   {id:devil,x:328,y:184,height:66},{id:devil,x:408,y:160,height:57}
  ];
  if(scene!==yard)return null;
  const fallenViona={id:viona,x:280,y:224,height:58,pose:'prone'};
  if(quest.aregoChampionsDefeated)return [fallenViona,{id:champion,x:296,y:152,height:61,pose:'prone'}];
  if(quest.aregoVionaFell)return [fallenViona,{id:champion,x:328,y:152,height:61},{id:paladin,x:376,y:160,height:54}];
  return [
   {id:viona,x:328,y:216,height:60},{id:paladin,x:264,y:200,height:54},{id:paladin,x:392,y:200,height:54}
  ];
 }
 function startFight(kind){
  const {x,y,dir}=units[0];
  const enemies=encounters[kind].enemies.map((id,i)=>{
   const max=STATS[id].hp;
   return {id,name:id===paladin?'Reclamation Paladin '+i:NAMES[id],hp:max,max};
  });
  save();
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir]});
 }
 async function afterBattle(kind,position){
  quest[encounters[kind].flag]=true;
  seedParty(...position);
  save();
  paintParty();
  updateObjective();
  if(kind==='arego_viona_line'){
   await say('Chronicle','Viona Kadarius falls in the yard. A second champion rallies the defenders by the prison door.');
  }else{
   await say('Chronicle','The second champion falls. The surviving garrison breaks away from the prison entrance.');
  }
 }
 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'aregoDepart':
    quest.aregoApproachReached=true;
    await travel(trail,328,344);
    break;
   case 'aregoDevils':
    await say(devil,'You have brought the offerings, then? Your lord promised Visperthul more than horns and hearts. He promised him your souls.');
    await say('draymus','Fex told us that ritual was meant to close the gate. What did he promise Visperthul it would do?');
    await say(devil,'Make the gate permanent. Your archbaron intends to hold the passage and rule the Whisperwood through it.');
    quest.aregoBetrayalKnown=true;
    break;
   case 'aregoDecision':
    await say('freya','Fex has made his choice. We’ll make ours. He isn’t sacrificing anyone in this company.');
    await say('jason','Then we still need to reach the gate before he can use it. Give us a moment to tend to our wounds first.');
    SouthRoad.recover(.55);
    quest.aregoFexOpposed=true;
    break;
   case 'aregoCross':
    quest.aregoYardReached=true;
    await travel(yard,328,344);
    break;
   case 'aregoFirstLine':
    await say(viona,'The Reclamation holds Fort Arego. Turn back or answer to my blade.');
    await say('freya','We need that door. Move.');
    startFight('arego_viona_line');
    return true;
   case 'aregoSecondLine':
    await say(champion,'Hold by the door. Don’t let them through to the lower levels.');
    startFight('arego_prison_door');
    return true;
   case 'aregoSecureYard':
    await say('freya','Get those doors open. Stay together on the stairs. We don’t know what Fex has let through down there.');
    quest.aregoExteriorSecured=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 function effects(g,t){
  if(scene===yard&&quest.aregoExteriorSecured){
   g.save();
   g.beginPath();
   g.rect(273,34,94,96);
   g.clip();
   SceneLayers.foreground(g,art[openYard],{contain:true});
   g.restore();
  }
  if(scene!==trail||reduce.matches)return;
  g.save();
  for(let i=0;i<18;i++){
   const x=(i*71+Math.floor(t*6))%640,y=20+(i*43+Math.floor(t*2))%350;
   g.globalAlpha=.14+(i%4)*.035;g.fillStyle=i%3?'#abb1b9':'#d3b2a2';
   g.fillRect(x,y,i%4===0?2:1,1);
  }
  g.restore();
 }
 function drawCombat(g,u,v,t){
  if(u.id!==viona&&u.id!==champion)return false;
  const {source,frame:f}=FUTURE_NPCS[u.id],image=art[source];
  if(!image)return false;
  const pose=actionPose(u),scale=Math.min(v.height/f.h,123/f.w);
  const idle=reduce.matches||u.hp===0||battle.animation?.actor===u?0:[0,1,0,-1][Math.floor((t+(u.idleOffset||0))*4)%4];
  g.save();
  g.imageSmoothingEnabled=false;
  g.translate(v.x+pose.dx,v.y+pose.dy);
  g.rotate(pose.tilt+idle*.016);
  if(u.flash&&!reduce.matches)g.globalAlpha*=.7;
  g.drawImage(image,f.x,f.y,f.w,f.h,Math.round(-f.w*scale/2),-Math.round(f.h*scale+idle),Math.round(f.w*scale),Math.round(f.h*scale+idle));
  g.restore();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,interact,afterBattle,effects,drawCombat};
})();
