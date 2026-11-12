"use strict";

window.InfernoGate=(()=>{
 const yard='arego_outer_yard',cells='arego_prison_cells',gate='arego_inferno_gate';
 const bearded='arego_bearded_devil',envoy='arego_stair_devil',visperthul='visperthul',kind='arego_cell_devils';
 const cellsArt='arego-prison-cells-v1.png',gateArt='arego-inferno-gate-v1.png';
 const devilArt='arego-bearded-devil-v1.png',visperthulArt='arego-visperthul-v1.png';
 const cellsSpawn=[328,344],gateSpawn=[328,344];
 const ashOrigin=[320,86];
 const lavaRuns=[[[171,149],[467,149]],[[467,149],[219,256]],[[219,256],[319,94]],[[319,94],[419,256]],[[419,256],[171,149]]];
 function install(){
  scenes[yard].points.push({id:'aregoDescend',x:328,y:128,label:'Descend into Fort Arego'});
  scenes[cells]={
   name:'Fort Arego · Prison Cells',image:cellsArt,spawn:cellsSpawn,blocks:[],
   walk:[{x:192,y:96,w:256,h:240},{x:272,y:336,w:96,h:64}],lights:[[177,55],[267,51],[373,51],[463,55],[177,121],[463,121],[177,188],[463,188],[177,257],[463,257],[177,325],[463,325],[252,373],[388,373]],
   points:[
    {id:'aregoCellFight',x:328,y:240,label:'Clear the devils from the cellblock'},
    {id:'aregoDevilParley',speaker:envoy,x:400,y:176,label:'Parley with the devils by the stair'},
    {id:'aregoLowerStair',x:328,y:144,label:'Take the lowest stair'}
   ]
  };
  scenes[gate]={
   name:'Fort Arego · The Inferno Gate',image:gateArt,spawn:gateSpawn,blocks:[],
   walk:[{x:128,y:272,w:384,h:112},{x:128,y:208,w:64,h:64},{x:448,y:208,w:64,h:64}],lights:[],
   points:[
    {id:'aregoSurveyGate',x:328,y:288,label:'Examine the Inferno Gate'},
    {id:'aregoWarnVisperthul',speaker:visperthul,x:472,y:248,label:'Tell Visperthul what Fex intends'},
    {id:'aregoAcceptPact',speaker:visperthul,x:472,y:248,label:'Hear Visperthul’s terms'}
   ]
  };
  MAP_LAYERS[cells]={foreground:cellsArt,contain:true,background:{type:'solid',color:'#131519'}};
  MAP_LAYERS[gate]={foreground:gateArt,contain:true,background:{type:'solid',color:'#1b1317'}};
  JOURNEYS[cells]='Below the courtyard, Fort Arego still has its old military cells. The bars have rusted for centuries. The things moving behind them are far more recent.';
  JOURNEYS[gate]='On the lowest floor, molten lava runs through a pentagram cut into the stone. Ash falls from a tear in the air. Beyond it lies Hell.';
  NAMES[bearded]='Bearded Devil';
  NAMES[envoy]='Devil at the Stair';
  NAMES[visperthul]='Visperthul';
  STATS[bearded]={hp:35,ac:15,atk:6,dmg:[1,8,3]};
  FUTURE_NPCS[bearded]={source:devilArt,frame:{x:0,y:0,w:1059,h:1485}};
  FUTURE_NPCS[envoy]=FUTURE_NPCS.arego_loose_devil;
  FUTURE_NPCS[visperthul]={source:visperthulArt,frame:{x:159,y:0,w:1218,h:1024}};
  DIALOGUE_FACE_CROPS[envoy]=DIALOGUE_FACE_CROPS.arego_loose_devil;
  DIALOGUE_FACE_CROPS[visperthul]={x:618,y:83,w:284,h:284};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[cells]=await loader(cellsArt);})(),
   (async()=>{art[gate]=await loader(gateArt);})(),
   ...[devilArt,visperthulArt].map(async src=>{art[src]=await loader(src);})
  ]);
 }
 function mapImage(){return scene===cells||scene===gate?art[scene]:null;}
 function points(){
  if(!quest.aregoExteriorSecured)return null;
  if(scene===yard)return [point('aregoDescend')];
  if(scene===cells)return [point(!quest.aregoCellDevilsDefeated?'aregoCellFight':!quest.aregoStairParley?'aregoDevilParley':'aregoLowerStair')];
  if(scene===gate){
   if(quest.aregoFirstPact)return [];
   return [point(!quest.aregoGateSurveyed?'aregoSurveyGate':!quest.aregoTalismanExposed?'aregoWarnVisperthul':'aregoAcceptPact')];
  }
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===gate&&quest.aregoFirstPact?'Visperthul’s terms accepted · Watch for Fex.':null);}
 function npcs(t=0){
  if(scene===cells){
   if(quest.aregoStairParley)return [];
   if(quest.aregoCellDevilsDefeated)return [{id:envoy,x:400,y:160,height:62}];
   return [{id:bearded,x:264,y:200,height:64},{id:bearded,x:392,y:200,height:64}];
  }
  if(scene===gate&&quest.aregoGateSurveyed)return [{id:visperthul,x:472,y:232+(reduce.matches?0:Math.round(Math.sin(t*1.7)*2)),height:92}];
  return scene===gate?[]:null;
 }
 function fight(){
  const {x,y,dir}=units[0],max=STATS[bearded].hp;
  save();
  startBattle(0,false,{
   kind,returnPosition:[x,y,dir],
   enemies:[1,2].map(i=>({id:bearded,name:NAMES[bearded]+' '+i,hp:max,max}))
  });
 }
 async function afterBattle(position){
  quest.aregoCellDevilsDefeated=true;
  seedParty(...position);
  save();
  paintParty();
  updateObjective();
  await say('Chronicle','The cellblock falls quiet. Farther down, a devil lowers its weapon and waits by the stair.');
 }

 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'aregoDescend':
    quest.aregoDungeonEntered=true;
    await travel(cells,...cellsSpawn);
    break;
   case 'aregoCellFight':
    await say('reese','Two ahead of us. They’ve left enough room between the cells to come at us together.');
    fight();
    return true;
   case 'aregoDevilParley':
    await say(envoy,'I heard what happened up the hall. You’re going below, aren’t you?');
    await say('freya','We came for the gate. Leave us the stair and we’ll leave you the cells.');
    await say(envoy,'Agreed. Follow the falling ash. Visperthul is in the chamber it comes from.');
    quest.aregoStairParley=true;
    break;
   case 'aregoLowerStair':
    quest.aregoGateReached=true;
    await travel(gate,...gateSpawn);
    break;
   case 'aregoSurveyGate':
    await say('Chronicle','Lava runs through the trenches in the floor. A fifteen-foot tear hangs above them, shedding ash and flashes of black lightning.');
    await say('draymus','That’s Hell on the other side. Keep away from the edge of the tear.');
    quest.aregoGateSurveyed=true;
    break;
   case 'aregoWarnVisperthul':
    await say(visperthul,'I am Visperthul, of Moloch’s Malebolge. Fex said his offerings would come to me. I see they’ve brought themselves.');
    await say('freya','Fex meant to sell our souls. He meant to bind you, too. He made a talisman to put you and the gate under his control.');
    await say(visperthul,'He spoke to me as a partner. Now I find he meant to hold my leash.');
    quest.aregoTalismanExposed=true;
    break;
   case 'aregoAcceptPact':
    await say(visperthul,'Defeat Fex and give me the talisman. I’ll help you close this gate, and Cheliax will hear nothing more from me this century.');
    await say('freya','You help us close the gate, and you stay out of Cheliax.', ['[Accept Visperthul’s terms]']);
    await say('freya','On those terms, we have a deal.');
    quest.aregoFirstPact=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 function drawCombat(g,u,v,t){
  if(u.id!==bearded)return false;
  const image=art[devilArt],f=FUTURE_NPCS[bearded].frame;
  if(!image)return false;
  const idle=reduce.matches||u.hp===0||battle.animation?.actor===u?0:[0,1,0,-1][Math.floor((t+(u.idleOffset||0))*4)%4];
  const pose=actionPose(u),scale=Math.min(v.height/f.h,135/f.w);
  g.save();
  g.imageSmoothingEnabled=false;
  g.translate(v.x+pose.dx,v.y+pose.dy);
  g.rotate(pose.tilt+idle*.012);
  g.scale(-1,1);
  if(u.flash&&!reduce.matches)g.globalAlpha*=.7;
  g.drawImage(image,f.x,f.y,f.w,f.h,Math.round(-f.w*scale/2),-Math.round(f.h*scale+idle),Math.round(f.w*scale),Math.round(f.h*scale+idle));
  g.restore();
  return true;
 }
 function effects(g,t){
  if(scene!==gate||reduce.matches)return;
  const [px,py]=ashOrigin;
  g.save();
  for(let i=0;i<24;i++){
   const age=(t*.42+i*.107)%1;
   const x=px+(i%7-3)*8+Math.sin(i*2+age*3)*age*39,y=py+age*(68+i%5*10);
   g.globalAlpha=(1-age)*.48;
   g.fillStyle=i%4?'#a99b91':'#de8650';g.fillRect(Math.round(x),Math.round(y),i%3===0?2:1,1);
  }
  lavaRuns.forEach(([[ax,ay],[bx,by]],n)=>{
   for(let i=0;i<9;i++){
    const k=(t*.27+i/9+n*.14)%1;
    g.globalAlpha=.36+.25*Math.sin(k*Math.PI);
    g.fillStyle=i%4?'#f69547':'#ffde82';
    g.fillRect(Math.round(ax+(bx-ax)*k),Math.round(ay+(by-ay)*k),3,2);
   }
  });
  const pulse=t%7.1;
  if(pulse<.18){
   g.globalAlpha=.84*(1-pulse/.18);
   g.strokeStyle='#160d19';g.lineWidth=3;g.beginPath();
   g.moveTo(px+18,py-46);g.lineTo(px+5,py-28);g.lineTo(px+12,py-22);
   g.lineTo(px-5,py-9);g.lineTo(px-2,py+3);g.lineTo(px-17,py+14);g.stroke();
  }
  g.restore();
 }
 return {install,load,mapImage,points,target,goal,npcs,interact,afterBattle,drawCombat,effects};
})();
