"use strict";

window.EgorianDischarge=(()=>{
 const hotel='egorian_hotel_barato',square='egorian_discharge_square';
 const map='egorian-discharge-square-v1.png',civilian='egorian-discharge-civilians-v1.png',helmet='egorian-zara-helmet-v1.png';
 const disguised='jason_disguised',zara='zara_helmeted',thrower='citizen-discharge-thrower';
 const freyaFront={x:146,y:23,w:314,h:848},freyaBack={x:711,y:22,w:303,h:852};
 const zaraInLane={id:zara,x:356,y:254,height:63};
 const throwerInLane={id:thrower,x:384,y:258,dir:'left',variant:3};
 let strike=null,throwsAt=null,helmetEpoch=-1;
 function install(){
  scenes[hotel].points.push(
   {id:'egorianJasonReturns',x:328,y:280,label:'Wait for Jason to return'},
   {id:'egorianHearDischarge',speaker:disguised,x:352,y:200,label:'Hear what happened to Jason'},
   {id:'egorianGoToKeep',x:328,y:328,label:'Go to Freya’s public discharge'},
   {id:'egorianAfterDischarge',x:328,y:216,label:'Share a meal at Hotel Barato'}
  );
  scenes[square]={
   name:'Egorian · The Keep Gates',image:map,spawn:[328,144],blocks:[],
   walk:[{x:256,y:144,w:144,h:256}],lights:[[237,81],[405,81]],
   points:[
    {id:'egorianWalkShame',x:328,y:192,label:'Walk past the jeering crowd'},
    {id:'egorianZaraIntervenes',x:328,y:256,label:'Reach Zara in the crowd'},
    {id:'egorianLeaveKeep',x:328,y:392,label:'Leave the square with Zara'}
   ]
  };
  MAP_LAYERS[square]={foreground:map,contain:true,background:{type:'solid',color:'#171a23'}};
  JOURNEYS[square]='The next day, Freya is stripped of her rank as Commander and her standing as a Hellknight. She leaves the keep in a servant’s dress. The crowd is already waiting.';
  NAMES[disguised]='Jason';
  NAMES[zara]='Zara Orcelani';
  NAMES[thrower]='Man in the Crowd';
  FUTURE_NPCS[disguised]={source:civilian,frame:{x:1236,y:0,w:381,h:875}};
  FUTURE_NPCS[zara]={source:helmet,frame:{x:5,y:0,w:1106,h:1316}};
  DIALOGUE_FACE_CROPS[disguised]={x:1349,y:9,w:215,h:215};
  DIALOGUE_FACE_CROPS[zara]={x:528,y:6,w:279,h:279};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[square]=await loader(map);})(),
   ...[civilian,helmet].map(async src=>{art[src]=await loader(src);})
  ]);
 }
 function mapImage(){return scene===square?art[scene]:null;}
 function roster(){
  if(scene===square)return ['freya'];
  if(scene===hotel&&quest.egorianJasonBack&&!quest.egorianDischargeHome)
   return (quest.activeRoster||CORE).filter(id=>!['jason','freya'].includes(id));
  if(scene===hotel&&quest.egorianDischargeHome)return quest.activeRoster||CORE;
  return null;
 }
 function points(){
  if(!quest.aregoReportsSent)return null;
  if(scene===hotel){
   if(quest.egorianDischargeComplete)return [];
   const id=quest.egorianDischargeHome?'egorianAfterDischarge':!quest.egorianJasonBack?'egorianJasonReturns':!quest.egorianDischargeRumor?'egorianHearDischarge':'egorianGoToKeep';
   return [point(id)];
  }
  if(scene===square)return [point(!quest.egorianWalkBegan?'egorianWalkShame':!quest.egorianZaraStoppedCrowd?'egorianZaraIntervenes':'egorianLeaveKeep')];
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===hotel&&quest.egorianDischargeComplete?'The company regroups at Hotel Barato.':null);}
 function npcs(){
  if(scene===hotel)return quest.egorianJasonBack&&!quest.egorianDischargeHome?[{id:disguised,x:352,y:184,height:53}]:[];
  if(scene!==square)return null;
  const crowd=[];
  for(let row=0;row<5;row++)for(let i=0;i<6;i++){
   const left=i<3,x=left?133+i*37:411+(i-3)*36,y=152+row*42+(i%2)*7;
   crowd.push({id:'citizen-discharge-'+row+'-'+i,x,y,dir:left?'right':'left',variant:(i+row*3)%8});
  }
  const friends=[
   {id:'guapo',x:419,y:208,dir:'left'},{id:'reese',x:467,y:240,dir:'left'},
   {id:'draymus',x:183,y:218,dir:'right'},{id:'jamal',x:130,y:232,dir:'right'},
   {id:disguised,x:205,y:268,height:52}
  ];
  const knight=quest.egorianZaraStoppedCrowd?{...zaraInLane,x:280,y:302}:helmetEpoch===epoch?zaraInLane:{id:'zara',x:408,y:248,height:63};
  const witness={...throwerInLane,pose:quest.egorianZaraStoppedCrowd?'prone':null};
  const named=[...friends,knight,witness];
  return [...crowd.filter(person=>!named.some(actor=>Math.abs(person.x-actor.x)<19&&Math.abs(person.y-actor.y)<28)),...named];
 }

 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'egorianJasonReturns':
    await journeyCard('Hotel Barato · The next morning','Jason returns in disguise. His Asmodean full plate and insignia are gone.',()=>{
     quest.egorianJasonBack=true;
     uses.jason=0;
     mendUses=0;
     applyProgression();
     setScene(hotel,328,280);
    });
    break;
   case 'egorianHearDischarge':
    await say(disguised,'They stripped my rank and took my plate. Asmodeus has withdrawn his gifts. They called what we did a betrayal of the church and of Thrune.');
    await say('jamal','Word in the street is they’ll strip Freya in public tomorrow. Commander and Hellknight, both gone.');
    await say('guapo','Then she’ll have friends there, however many others turn up.');
    quest.egorianDischargeRumor=true;
    break;
   case 'egorianGoToKeep':
    quest.egorianFreyaDischarged=true;
    applyProgression();
    await travel(square,328,144,'down');
    break;
   case 'egorianWalkShame':
    throwsAt={token:epoch,at:performance.now(),x:units[0].x,y:units[0].y-28};
    await say('Chronicle','The keep gates close. Rotten fruit and refuse begin to fly.');
    await say('guapo','I’m helping…');
    await say('Chronicle','El Guapo throws fresh apples gently, for whatever good that does.');
    quest.egorianWalkBegan=true;
    break;
   case 'egorianZaraIntervenes':
    await say('zara','Enough. Let her pass.');
    await say('Chronicle','The crowd ignores her. Zara pulls on her helmet, raises her shield and steps into the lane.');
    helmetEpoch=epoch;
    await say(zara,'Freeze.');
    await say('Chronicle','Much of the crowd goes still. One man throws a rotten tomato. It strikes Freya and splashes Zara’s armor.');
    await say(thrower,'I’m sorry. I didn’t mean—');
    strike={token:epoch,at:performance.now()};
    GameAudio.effect('hit');
    await delay(reduce.matches?50:580);
    if(strike.token!==epoch)throw CANCEL;
    quest.egorianZaraStoppedCrowd=true;
    await say('Chronicle','Zara runs him through with her bastard sword. She holds him aloft and looks across the square. When she drops him, no one throws again.');
    break;
   case 'egorianLeaveKeep':
    await say(zara,'Come with me, Freya.');
    await journeyCard('Back at Hotel Barato','Zara walks out of the square with Freya. The company leaves the silent crowd behind and returns to Hotel Barato.',()=>{
     quest.egorianDischargeHome=true;
     setScene(hotel,328,328);
    });
    break;
   case 'egorianAfterDischarge':
    await say('Chronicle','Dinner and cheap ale take the edge off the day. They sell some treasure and make a few purchases.');
    await say('draymus','I’ve begun the work. Lichdom will take time, and I don’t intend to leave it to chance.');
    SouthRoad.recover(1);
    mendUses=0;
    quest.egorianDischargeComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 function drawActor(g,u,height){
  const f=u.id==='freya'&&scene===square?(u.dir==='up'?freyaBack:freyaFront):
   u.id==='jason'&&quest.egorianJasonBack?FUTURE_NPCS[disguised].frame:null;
  if(!f||!art[civilian])return false;
  const w=Math.round(height*f.w/f.h);
  const step=u.step?[0,1,0,-1][Math.floor(u.anim*10)%4]:0;
  g.save();g.imageSmoothingEnabled=false;
  g.translate(Math.round(u.x),Math.round(u.y+step));
  if(u.dir==='left')g.scale(-1,1);
  if(hp[u.id]===0)g.globalAlpha=.4;
  g.drawImage(art[civilian],f.x,f.y,f.w,f.h,-w/2,-height,w,height);
  g.restore();
  return true;
 }
 function effects(g){
  if(scene!==square||reduce.matches)return;
  if(throwsAt?.token===epoch&&!quest.egorianZaraStoppedCrowd){
   const elapsed=(performance.now()-throwsAt.at)/1000;
   if(elapsed<5){
    for(let i=0;i<13;i++){
     const p=(elapsed*1.5+i*.173)%1;
     const from=i%2?426:200;
     g.fillStyle=i%3?'#763b3b':'#aa8247';
     g.fillRect(Math.round(from+(throwsAt.x-from)*p),Math.round(throwsAt.y+22-Math.sin(p*Math.PI)*53+i%6*4),4,4);
    }
   }
  }
  if(strike?.token===epoch&&!quest.egorianZaraStoppedCrowd){
   const p=Math.min(1,(performance.now()-strike.at)/580);
   g.save();g.globalAlpha=Math.sin(p*Math.PI)*.85;g.strokeStyle='#dcc8ac';g.lineWidth=2;
   const handX=zaraInLane.x+8,handY=zaraInLane.y-29;
   const hitX=throwerInLane.x,hitY=throwerInLane.y-24;
   g.beginPath();g.moveTo(handX,handY+11*(1-p));g.lineTo(hitX+9*p,hitY-15*(1-p));g.stroke();
   g.restore();
  }
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,interact,drawActor,effects};
})();
