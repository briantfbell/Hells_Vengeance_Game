"use strict";

window.MolthuneCoffin=(()=>{
 const hall='frost_giant_hall',slope='molthune_remorhaz_slope',shelter='molthune_waystation';
 const slopeArt='molthune-slope-v2.png',shelterArt='molthune-waystation-v1.png';
 const beastArt='molthune-remorhaz-v1.png',coffinArt='molthune-coffin-v1.png';
 const portrait='molthune-violetta-v1.png',undeadArt='molthune-wight-warrior-v1.png';
 const violet='violetta',unknown='pavel_unknown',wight='molthune_wight';
 const coffin=[430,185],coffinWidth=54;
 const flightDuration=950,breachDuration=2200;
 const droppedCoffin=[347,305],hutCover=[456,200];
 const portals=[{x:172,y:144,foot:192,height:83},{x:544,y:157,foot:208,height:91}];
 const scoutCover=[328,312],scoutDuration=1050;
 let scout=null,chase=null,breach=null,flight=null;

 function install(){
  scenes[hall].points.push({id:'molthuneDepart',x:328,y:344,marker:{x:328,y:376},label:'Descend toward Molthune'});
  scenes[slope]={
   name:'Molthune · The Remorhaz Slope',image:slopeArt,spawn:[328,344],blocks:[{x:464,y:160,w:64,h:32}],
   walk:[{x:112,y:160,w:416,h:160},{x:288,y:320,w:80,h:80}],lights:[],
   points:[
    {id:'molthuneScout',x:408,y:248,marker:{x:430,y:145},label:'Scout the box as Reese'},
    {id:'molthuneBait',x:200,y:256,label:'Animate the bear and set the diversion'},
    {id:'molthuneLift',x:432,y:216,marker:{x:430,y:145},label:'Lift the travel coffin'},
    {id:'molthuneBreach',x:328,y:336,label:'Carry the coffin beyond the dragon’s ward'},
    {id:'molthuneEscape',speaker:unknown,x:440,y:232,label:'Reach the woman by the shelter'},
    {id:'molthuneFlyOut',x:328,y:376,marker:{x:328,y:378},label:'Fly clear of the lower pass'}
   ]
  };
  scenes[shelter]={
   name:'Molthune · Mountain Wayside',image:shelterArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:176,w:416,h:160},{x:288,y:336,w:80,h:64}],lights:[],
   points:[
    {id:'molthuneMeetVioletta',speaker:unknown,x:456,y:224,label:'Speak to the woman from the coffin'},
    {id:'molthunePapers',speaker:violet,x:456,y:224,label:'Hear Violetta’s account and read her papers'}
   ]
  };
  MAP_LAYERS[slope]={foreground:slopeArt,contain:true,background:{type:'solid',color:'#283442'}};
  MAP_LAYERS[shelter]={foreground:shelterArt,contain:true,background:{type:'solid',color:'#222b36'}};
  JOURNEYS[slope]='13 Gozran, 4717. The company descends into Molthune. Skadi wants the box removed and the ancient remorhaz left alive.';
  JOURNEYS[shelter]='The company flies clear of the Wight Mother’s undead. Once out of reach, it stops to speak with the woman who escaped the coffin.';
  NAMES[unknown]='Young Woman';
  NAMES[violet]='Lady Violetta Pavel';
  NAMES[wight]='Wight Mother’s Warrior';
  FUTURE_NPCS[unknown]=FUTURE_NPCS[violet]={source:portrait,frame:{x:195,y:0,w:570,h:1536}};
  DIALOGUE_FACE_CROPS[unknown]=DIALOGUE_FACE_CROPS[violet]={x:344,y:0,w:295,h:295};
  FUTURE_NPCS[wight]={source:undeadArt,frame:{x:0,y:0,w:1166,h:1349}};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[slope]=await loader(slopeArt);})(),
   (async()=>{art[shelter]=await loader(shelterArt);})(),
   ...[beastArt,coffinArt,portrait,undeadArt,'darkrain-dire-bear-v1.png'].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){return scene===slope||scene===shelter?art[scene]:null;}
 function roster(){
  if(scene===slope&&!quest.molthuneScouted)return ['reese'];
  if(scene!==slope&&scene!==shelter)return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===hall&&quest.skadiComplete)return [point('molthuneDepart')];
  if(scene===slope){
   const id=!quest.molthuneScouted?'molthuneScout':!quest.molthuneBaitSet?'molthuneBait':
    !quest.molthuneCoffinLifted?'molthuneLift':!quest.molthuneBreach?'molthuneBreach':
    !quest.molthuneFlightReady?'molthuneEscape':'molthuneFlyOut';
   return [point(id)];
  }
  if(scene!==shelter)return null;
  if(quest.molthuneComplete)return [];
  return [point(quest.molthuneIntroduced?'molthunePapers':'molthuneMeetVioletta')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===shelter&&quest.molthuneComplete?'Violetta is safe. She offers to help the company.':null);}
 function ambushProgress(){
  if(quest.molthuneBreach)return 1;
  if(breach?.epoch!==epoch)return 0;
  return reduce.matches?1:Math.min(1,(performance.now()-breach.at)/breachDuration);
 }
 function phase(progress,start,end){
  return Math.max(0,Math.min(1,(progress-start)/(end-start)));
 }
 function npcs(){
  if(scene===shelter)return [{id:quest.molthuneIntroduced?violet:unknown,x:456,y:193,height:57}];
  if(scene!==slope)return null;
  const progress=ambushProgress();
  const arrivals=portals.flatMap(({x,y,foot,height},i)=>{
   const arrival=phase(progress,.16+i*.12,.56+i*.12);
   return arrival>0?[{id:wight,x,y:y+(foot-y)*arrival,height:height*(.28+.72*arrival)}]:[];
  });
  if(progress<=.44)return arrivals;
  const slip=phase(progress,.44,.94);
  const [x,y]=quest.molthuneFlightReady?[352,355]:hutCover;
  return [...arrivals,{id:unknown,x:droppedCoffin[0]+(x-droppedCoffin[0])*slip,
   y:droppedCoffin[1]+(y-droppedCoffin[1])*slip,height:56}];
 }
 function scoutProgress(){
  return scout?.epoch===epoch?Math.min(1,(performance.now()-scout.at)/scoutDuration):0;
 }
 function scoutPose(unit){
  if(scene!==slope||unit.id!=='reese'||quest.molthuneScouted||scout?.epoch!==epoch)return null;
  const progress=reduce.matches?1:scoutProgress();
  const back=Math.max(0,(progress-.16)/.84);
  const [x,y]=scoutCover;
  return {...unit,x:unit.x+(x-unit.x)*back,y:unit.y+(y-unit.y)*back,
   dir:back===0?'up':x===unit.x?'down':'left',
   step:back>0&&back<1,anim:back*1.05};
 }
 function flightPose(unit){
  if(scene!==slope||flight?.epoch!==epoch||reduce.matches)return null;
  if(unit.id!==unknown&&!units.includes(unit))return null;
  const progress=Math.min(1,(performance.now()-flight.at)/flightDuration);
  return {x:Math.round(36*progress),y:-Math.round(84*progress**1.5),opacity:Math.min(1,2.5*(1-progress))};
 }
 function drawProp(g,source,x,y,width){
  const im=art[source];
  if(!im)return;
  const height=width*im.height/im.width;
  g.drawImage(im,Math.round(x-width/2),Math.round(y-height),width,height);
 }
 function effects(g,t){
  if(scene!==slope)return;
  const reduced=reduce.matches;
  const elapsed=chase?.epoch===epoch?(performance.now()-chase.at)/1600:0;
  if(!quest.molthuneBaitSet){
   const progress=reduced&&elapsed>0?.32:Math.min(1,elapsed);
   const lunge=quest.molthuneScouted||reduced?0:Math.sin(Math.PI*scoutProgress())**2;
   drawProp(g,beastArt,427-progress*510-20*lunge,176+progress*70+62*lunge,175+10*lunge);
   const bear=art['darkrain-dire-bear-v1.png'];
   if(bear&&elapsed>0){
    const foot=226+progress*61+(reduced?0:Math.round(Math.sin(elapsed*24)*2));
    g.drawImage(bear,16,73,651,581,Math.round(272-progress*375),foot-40,45,40);
   }
  }
  const progress=ambushProgress(),drop=phase(progress,.23,.41);
  if(!quest.molthuneCoffinLifted)drawProp(g,coffinArt,...coffin,coffinWidth);
  else if(drop===1)drawProp(g,coffinArt,...droppedCoffin,coffinWidth);
  else if(units[0]){
   const carrier=units[0],x=carrier.x+(carrier.dir==='left'?-24:24),y=carrier.y-14;
   drawProp(g,coffinArt,x+(droppedCoffin[0]-x)*drop,y+(droppedCoffin[1]-y)*drop,coffinWidth);
  }
  const aperture=phase(progress,0,.19);
  if(aperture===0)return;
  for(const {x,y} of portals){
   g.save();
   g.translate(x,y);
   g.scale(aperture,1);
   g.translate(-x,-y);
   g.globalAlpha=reduced?.56:.5+Math.sin(t*3+x)*.1;
   const glow=g.createRadialGradient(x,y,4,x,y,37);
   glow.addColorStop(0,'#d4b8f2');
   glow.addColorStop(.6,'#4c2e68');
   glow.addColorStop(1,'#34274200');
   g.fillStyle=glow;
   g.fillRect(x-38,y-38,76,76);
   g.globalAlpha=.8;
   g.fillStyle='#352343';
   g.fillRect(x-8,y-24,16,43);
   g.fillStyle='#141019';
   g.fillRect(x-5,y-21,10,39);
   g.fillStyle='#c09be9';
   g.fillRect(x-7,y-18,2,29);
   g.fillRect(x+5,y-11,1,23);
   g.restore();
  }
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'molthuneDepart':
    quest.molthuneReached=true;
    await travel(slope,328,344);
    break;
   case 'molthuneScout': {
    await say('reese','I can see the box. Carved wood, metal corners. That’s a traveling coffin.');
    await storyRoll('Reese · Stealth',2,0,'The remorhaz nearly catches Reese');
    const token=epoch;
    scout={epoch:token,at:performance.now()};
    await delay(reduce.matches?220:scoutDuration);
    if(token!==epoch)return false;
    seedParty(...scoutCover,'up');
    scout=null;
    await say('Chronicle','The remorhaz lunges. Reese slips back down the slope and brings word to the others.');
    quest.molthuneScouted=true;
    seedParty(...scoutCover,'up');
    await say('draymus','A reinforced travel coffin, in these mountains? It may belong to a Nidalese vampire.');
    break;
   }
   case 'molthuneBait': {
    await say('draymus','I can get the bear moving one more time.');
    await say('jamal','Send it past the rocks. I’ll make sure the remorhaz goes after it.');
    const token=epoch;
    chase={epoch:token,at:performance.now()};
    await delay(reduce.matches?750:1600);
    if(token!==epoch)return false;
    quest.molthuneBaitSet=true;
    await say('Chronicle','The remorhaz follows the animated bear away from the coffin. The company leaves the creature alive.');
    break;
   }
   case 'molthuneLift':
    await say('freya','Lift it while it’s clear. We fly it down the slope.');
    quest.molthuneCoffinLifted=true;
    break;
   case 'molthuneBreach': {
    await say('draymus','We’re out from under the dragon’s ward. She can see us now.');
    const token=epoch;
    breach={epoch:token,at:performance.now()};
    await delay(reduce.matches?350:breachDuration);
    if(token!==epoch)return false;
    quest.molthuneBreach=true;
    save();
    await say('Chronicle','The Wight Mother’s undead spill onto the slope. A young woman slips out of the dropped coffin and takes cover beside the hut.');
    break;
   }
   case 'molthuneEscape':
    await say(unknown,'We should go.');
    await say('freya','To the mouth of the pass. We can get clear from there.');
    quest.molthuneFlightReady=true;
    break;
   case 'molthuneFlyOut': {
    const token=epoch;
    if(!reduce.matches){
     flight={epoch:token,at:performance.now()};
     await delay(flightDuration);
     if(token!==epoch)return false;
    }
    quest.molthuneEscaped=true;
    await travel(shelter,328,344);
    flight=null;
    break;
   }
   case 'molthuneMeetVioletta':
    quest.molthuneIntroduced=true;
    await say(violet,'Lady Violetta Pavel of Nidal. I’m a diplomat. I’ve been shut in that coffin for nearly a year. And yes, I’m a vampire.');
    await say('Chronicle','Freya offers Violetta a cup of her own blood.');
    break;
   case 'molthunePapers':
    await say(violet,'These are my papers. I was sent to represent Nidal to Queen Abrogail. They may have replaced me by now, but I still owe a report to both courts.');
    await say('freya','The Queen gave us orders of our own. We can’t set those aside.');
    await say(violet,'I understand. Let me help, then.');
    quest.molthuneComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,effects,scoutPose,flightPose,interact};
})();
