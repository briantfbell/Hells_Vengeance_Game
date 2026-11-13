"use strict";

window.WhisperwoodCamp=(()=>{
 const road='whisperwood_road',camp='whisperwood_night_camp',image='whisperwood-night-camp-v1.png';
 const webs='whisperwood-web-creatures-v1.png',heavy='whisperwood-heavy-creatures-v1.png';
 const creatures={
  whisper_spider:{name:'Giant Spider',src:webs,box:[38,281,925,594],stats:{hp:12,ac:12,atk:4,dmg:[1,6,1]}},
  whisper_ettercap:{name:'Ettercap',src:webs,box:[1044,14,645,861],stats:{hp:23,ac:14,atk:5,dmg:[1,8,1]}},
  whisper_giant:{name:'Forest Giant',src:heavy,box:[7,8,815,875],stats:{hp:38,ac:15,atk:5,dmg:[1,10,2]}},
  whisper_bear:{name:'Great Bear',src:heavy,box:[868,132,900,748],stats:{hp:46,ac:14,atk:6,dmg:[1,10,3]}}
 };
 const encounters={
  whisperwood_webs:{ids:['whisper_spider','whisper_spider','whisper_ettercap'],flag:'whisperwoodWebsCleared'},
  whisperwood_giant:{ids:['whisper_giant'],flag:'whisperwoodGiantCleared'},
  whisperwood_bear:{ids:['whisper_bear'],flag:'whisperwoodBearDrivenOff'}
 };
 const webIntruders=[
  {id:'whisper_spider',x:264,y:168,height:27},
  {id:'whisper_spider',x:344,y:168,height:27},
  {id:'whisper_ettercap',x:304,y:144,height:57}
 ];
 const bearApproach={x:456,y:264};
 const recoverySpot={x:144,y:272};
 const objectives=[
  ['whisperwoodWatch',192,224,'Set the watch by the fire'],
  ['whisperwoodWebs',296,184,'Investigate the webs on the trail'],
  ['whisperwoodGiant',408,168,'Meet the giant at the treeline'],
  ['whisperwoodBear',440,264,'Reach Bob at the horses'],
  ['whisperwoodRescue',424,288,'Pull Bob out of danger'],
  ['whisperwoodDawn',328,152,'Look for tracks at dawn']
 ];
 function install(){
  scenes[road].points.push({id:'whisperwoodMakeCamp',x:328,y:88,label:'Follow the road into the Whisperwood'});
  scenes[camp]={
   name:'Whisperwood · Night Camp',image,spawn:[328,344],blocks:[{x:128,y:208,w:48,h:32}],
   walk:[{x:112,y:176,w:416,h:128},{x:176,y:144,w:320,h:48},{x:208,y:288,w:224,h:32},{x:304,y:304,w:48,h:96}],
   lights:[[150,216]],
   points:objectives.map(([id,x,y,label])=>({id,x,y,label}))
  };
  MAP_LAYERS[camp]={foreground:image,contain:true,background:{type:'solid',color:'#10151b'}};
  JOURNEYS[camp]='The company camps on the road to the unicorns’ range. Bob keeps the carriage and horses close to the clearing while the others set a watch.';
  for(const [id,{name,src,box,stats}] of Object.entries(creatures)){
   const [x,y,w,h]=box;
   const frame={x,y,w,h,anchorX:x+w/2,anchorY:y+h};
   NAMES[id]=name;
   STATS[id]=stats;
   FUTURE_NPCS[id]={source:src,frame};
  }
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[camp]=await loader(image);})(),
   ...[webs,heavy].map(async src=>{art[src]=await loader(src);})
  ]);
 }
 function mapImage(){return scene===camp?art[camp]:null;}
 function points(){
  if(!quest.senaraWhisperwoodReady)return null;
  if(scene===road)return [point('whisperwoodMakeCamp')];
  if(scene!==camp)return null;
  if(quest.whisperwoodNightComplete)return [];
  const stage=['whisperwoodWatchSet','whisperwoodWebsCleared','whisperwoodGiantCleared',
   'whisperwoodBearDrivenOff','whisperwoodBobRescued'].findIndex(flag=>!quest[flag]);
  return [point(objectives[stage<0?5:stage][0])];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===camp&&quest.whisperwoodNightComplete?'The company is ready to follow the unicorn trail.':null);}
 function npcs(){
  if(scene!==camp)return null;
  const bob={id:'bob',...(quest.whisperwoodBobRescued?recoverySpot:bearApproach),height:46,pose:quest.whisperwoodBobMauled?'prone':null};
  if(quest.whisperwoodWatchSet&&!quest.whisperwoodWebsCleared)return [bob,...webIntruders];
  if(quest.whisperwoodWebsCleared&&!quest.whisperwoodGiantCleared)return [bob,{id:'whisper_giant',x:408,y:144,height:67}];
  if(quest.whisperwoodGiantCleared&&!quest.whisperwoodBearDrivenOff)return [bob,{id:'whisper_bear',x:472,y:232,height:48}];
  return [bob];
 }

 function begin(kind){
  const {x,y,dir}=units[0];
  const enemies=encounters[kind].ids.map(id=>{
   const {name,stats}=creatures[id];
   return {id,name,hp:stats.hp,max:stats.hp};
  });
  save();
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir]});
 }
 async function afterBattle(kind,position){
  const encounter=encounters[kind];
  if(!encounter)return;
  quest[encounter.flag]=true;
  seedParty(...position);
  save();
  paintParty();
  updateObjective();
  if(kind==='whisperwood_webs')await say('reese','The webs are cut. Keep the fire low. Something heavier is moving behind the trees.');
  if(kind==='whisperwood_giant')await say('Chronicle','The giant’s attack is over. Near the carriage, the horses begin to scream.');
  if(kind==='whisperwood_bear')await say('guapo','The bear’s off him. J’Mal, help me get Bob clear.');
 }
 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'whisperwoodMakeCamp':
    quest.whisperwoodCampReached=true;
    await travel(camp,328,344);
    break;
   case 'whisperwoodWatch':
    await say('freya','We’ll stop here. Get some rest while we can, then keep two sets of eyes on the trees.');
    await say(null,'The fire is low and the watches are assigned.', ['[Rest before taking watch]']);
    SouthRoad.recover(.5);
    quest.whisperwoodWatchSet=true;
    save();
    updateObjective();
    await say('Chronicle','After a short rest, the company hears movement on the trail. Strands of web catch the firelight.');
    break;
   case 'whisperwoodWebs':
    await say('reese','Webs across the trail. There’s something taller than the spiders moving behind them.');
    begin('whisperwood_webs');
    return true;
   case 'whisperwoodGiant':
    await say('freya','That’s no branch coming down. Keep away from its reach.');
    begin('whisperwood_giant');
    return true;
   case 'whisperwoodBear':
    if(!quest.whisperwoodBobMauled){
     await say('bob','Whoa! Steady, you lot. What’s got into—');
     await storyRoll('Bob · Evade the bear',3,0,'Mauled before he can get clear');
     quest.whisperwoodBobMauled=true;
     save();
     await say('jamal','Bob’s down. Get that thing off him!');
    }
    begin('whisperwood_bear');
    return true;
   case 'whisperwoodRescue':
    await say('jamal','I’ve got him under the arms. Guapo, lift on three.');
    await storyRoll('J’Mal and El Guapo · Pull Bob clear',18,0,'Reach him in time');
    quest.whisperwoodBobRescued=true;
    save();
    updateObjective();
    await say('Chronicle','J’Mal and El Guapo get Bob back to the bedrolls. He’s alive, though the mauling will leave lasting effects.');
    break;
   case 'whisperwoodDawn':
    await say('freya','We’ll leave Bob here to recover. The horns are still our next objective. Find the herd’s trail.');
    quest.whisperwoodNightComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 function effects(g,t){
  if(scene!==camp)return;
  g.save();
  if(quest.whisperwoodNightComplete){
   const dawn=g.createLinearGradient(0,48,0,342);
   dawn.addColorStop(0,'#b7866945');
   dawn.addColorStop(1,'#da99540c');
   g.fillStyle=dawn;g.fillRect(0,0,640,400);
  }
  if(!reduce.matches){
   for(let i=0;i<8;i++){
    const age=(t*.7+i*.131)%1;
    const x=150+Math.round(Math.sin(i*2+age*3)*(6+age*7)),y=214-Math.round(age*(16+i%4*4));
    g.globalAlpha=(1-age)*.58;g.fillStyle=i%2?'#ed893b':'#f6bf64';g.fillRect(x,y,2,2);
   }
  }
  g.restore();
 }
 function combatHeight(id){return ({whisper_spider:61,whisper_ettercap:102,whisper_giant:126,whisper_bear:83})[id];}
 function drawCombat(g,u,v,t){
  const data=creatures[u.id],model=FUTURE_NPCS[u.id],im=data&&art[model.source];
  if(!im)return false;
  const f=model.frame,a=battle?.animation,active=a?.actor===u;
  const idle=reduce.matches||active||u.hp===0?0:Math.sin(Math.floor((t+(u.idleOffset||0))*3)*1.7);
  const height=v.height;
  const scale=Math.min(height/f.h,(u.id==='whisper_spider'?106:195)/f.w),pose=actionPose(u);
  g.save();
  g.imageSmoothingEnabled=false;
  g.translate(v.x+pose.dx,v.y+pose.dy);
  g.rotate(pose.tilt+idle*.009);
  if(u.flash>0&&!reduce.matches)g.globalAlpha*=.7;
  g.drawImage(im,f.x,f.y,f.w,f.h,Math.round(-f.w*scale/2),-Math.round(f.h*scale+idle),Math.round(f.w*scale),Math.round(f.h*scale+idle));
  g.restore();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,interact,afterBattle,effects,combatHeight,drawCombat};
})();
