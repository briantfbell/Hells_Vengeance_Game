"use strict";

window.Pezzack=(()=>{
 const ruins='rachikan_ruins',manse='pezzack_manse',home='pezzack_egorian';
 const image='pezzack-manse-v1.png',burned='pezzack-manse-ruined-v1.png';
 const dragon='pezzack-blue-dragon-v1.png',strix='pezzack-strix-flight-v1.png';
 const evacuationDuration=1800,prisonerStarts=[527,551,570];
 let attack=null,evacuation=null;

 function install(){
  scenes[ruins].points.push({id:'pezzackDepartRachikan',x:320,y:376,label:'Continue to Pezzack with the company'});
  scenes[manse]={
   name:'Pezzack · Governor’s Manse',image,spawn:[328,344],blocks:[],
   walk:[{x:64,y:176,w:528,h:112},{x:80,y:288,w:480,h:16},{x:272,y:304,w:96,h:16},{x:288,y:320,w:64,h:80}],lights:[[52,183],[43,253],[602,183],[607,254],[532,143],[573,143]],
   points:[
    {id:'pezzackWatchDragon',x:328,y:264,label:'Look toward the manse'},
    {id:'pezzackFreePrisoners',x:552,y:166,label:'Open the prisoners’ way out'},
    {id:'pezzackWatchStrix',x:328,y:232,label:'Look up at the approaching wings'},
    {id:'pezzackTeleport',x:320,y:368,label:'Gather the company for the teleport home'}
   ]
  };
  const hotel=scenes.egorian_hotel_barato;
  scenes[home]={...hotel,name:'Egorian · Return from Pezzack',points:[]};
  MAP_LAYERS[home]={...MAP_LAYERS.egorian_hotel_barato};
  MAP_LAYERS[manse]={foreground:image,contain:true,background:{type:'solid',color:'#1c2029'}};
  JOURNEYS[manse]='18 Pharast, 4717. The company stops for a drink in Pezzack. As the port settles into dusk, a shadow falls across the governor’s manse.';
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[manse]=await loader(image);})(),
   ...[burned,dragon,strix].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){
  if(scene===home)return art.egorian_hotel_barato;
  return scene===manse?art[quest.pezzackManseBurned?burned:manse]:null;
 }
 function roster(){
  if(scene!==manse&&scene!==home)return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo'&&id!=='draymus');
 }
 function points(){
  if(scene===ruins&&quest.rachikanComplete)return [point('pezzackDepartRachikan')];
  if(scene===home)return [];
  if(scene!==manse)return null;
  const id=!quest.pezzackManseBurned?'pezzackWatchDragon':!quest.pezzackPrisonersFreed?'pezzackFreePrisoners':
   !quest.pezzackStrixSeen?'pezzackWatchStrix':'pezzackTeleport';
  return [point(id)];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===home?'The company has returned to Egorian.':null);}
 function npcs(){
  if(scene===home)return [];
  if(scene!==manse)return null;
  if(!quest.pezzackManseBurned)return [
   {id:'citizen-pezzack-1',x:162,y:227,dir:'right',variant:2},
   {id:'citizen-pezzack-2',x:432,y:290,dir:'up',variant:6}
  ];
  if(quest.pezzackPrisonersFreed)return [];
  const leaving=evacuation?.epoch===epoch;
  const elapsed=leaving?performance.now()-evacuation.at:0;
  return prisonerStarts.flatMap((x,i)=>{
   const progress=Math.max(0,(elapsed-i*120)/evacuationDuration);
   if(progress>=1)return [];
   const startY=172+i%2*7;
   const crossing=progress>=.2&&progress<.68;
   const across=Math.max(0,Math.min(1,(progress-.2)/.48));
   const down=Math.max(0,(progress-.68)/.32);
   return [{id:'citizen-pezzack-prisoner-'+i,
    x:x+(304+i*14-x)*across,
    y:startY+(232-startY)*Math.min(1,progress/.2)+176*down,
    dir:crossing?'left':'down',variant:i+1,step:progress>0,anim:elapsed/145}];
  });
 }
 function drawFlyer(g,img,x,y,width,angle=0){
  if(!img)return;
  const height=img.height*width/img.width;
  g.save();
  g.translate(Math.round(x),Math.round(y));
  g.rotate(angle);
  g.drawImage(img,-width/2,-height/2,width,height);
  g.restore();
 }
 function effects(g,t){
  if(scene!==manse)return;
  const reduced=reduce.matches;
  const elapsed=attack?.epoch===epoch?(performance.now()-attack.at)/1000:Infinity;
  if(elapsed<2){
   const x=reduced?250:60+elapsed*300;
   drawFlyer(g,art[dragon],x,reduced?69:72+Math.sin(elapsed*2.4)*17,167);
   if(elapsed>.5&&elapsed<1.02){
    g.save();
    g.globalAlpha=.52;
    g.fillStyle='#9ce3fb';
    for(let i=0;i<13;i++){
     const dx=i*7,dy=i*3;
     g.fillRect(Math.round(x+59+dx),92+dy,6-i%3,2+i%3);
    }
    g.restore();
   }
  }
  if(quest.pezzackManseBurned||elapsed>1.15&&elapsed<2){
   g.save();
   for(let i=0;i<28;i++){
    const rise=reduced?(i*13)%74:Math.floor((t*(13+i%4)+i*19)%74);
    const x=217+i*7+Math.floor(rise/5);
    g.globalAlpha=(1-rise/74)*.68;
    g.fillStyle=rise<20?(i%2?'#ffab53':'#f2d070'):'#80777d';
    g.fillRect(x,113-rise,2+i%4,2+i%3);
   }
   g.restore();
  }
  if(quest.pezzackPrisonersFreed||evacuation?.epoch===epoch){
   g.save();
   g.fillStyle='#17161a';
   g.beginPath();
   g.moveTo(540,166);
   g.lineTo(540,141);
   g.lineTo(544,134);
   g.lineTo(552,131);
   g.lineTo(560,134);
   g.lineTo(565,141);
   g.lineTo(565,166);
   g.closePath();
   g.fill();
   g.fillStyle='#363036';
   g.fillRect(541,163,23,3);
   g.restore();
  }
  if(quest.pezzackStrixSeen){
   g.save();
   g.fillStyle='#10172b48';
   g.fillRect(0,0,640,400);
   g.globalAlpha=.82;
   for(let i=0;i<5;i++){
    const x=reduced?128+i*82:680-(Math.floor(t*(37+i%3*5))+i*113)%745;
    const y=35+i%3*16+(reduced?0:Math.round(Math.sin(t*1.9+i)*5));
    drawFlyer(g,art[strix],x,y,41-i%3*4,reduced?0:Math.sin(t*3+i)*.09);
   }
   g.restore();
  }
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'pezzackDepartRachikan':
    quest.pezzackReached=true;
    await travel(manse,328,344);
    break;
   case 'pezzackWatchDragon': {
    await say('jamal','Was that a sail over the rooftops? No. Too low.');
    const token=epoch;
    attack={epoch:token,at:performance.now()};
    await delay(reduce.matches?950:1850);
    if(token!==epoch)return false;
    quest.pezzackManseBurned=true;
    save();
    await say('Chronicle','Bruce sweeps over the manse in the form of a blue dragon. Fire takes the building. The holding wing still stands.');
    break;
   }
   case 'pezzackFreePrisoners':{
    await say('freya','Clear the passage. Get every prisoner out before the fire spreads.');
    const token=epoch;
    if(!reduce.matches){
     evacuation={epoch:token,at:performance.now()};
     await delay(evacuationDuration+(prisonerStarts.length-1)*120);
     if(token!==epoch)return false;
    }
    quest.pezzackPrisonersFreed=true;
    evacuation=null;
    await say('Chronicle','The last prisoner crosses the bridge. The holding wing is empty.');
    break;
   }
   case 'pezzackWatchStrix':
    quest.pezzackStrixSeen=true;
    save();
    await say('Chronicle','Night falls over Pezzack. Strix sweep across the rooftops and assault the city.');
    await say('freya','Gather up. We’re going home.');
    break;
   case 'pezzackTeleport':
    await journeyCard('Return to Egorian','As the Strix raid Pezzack, the company teleports home to Egorian.',()=>{
     quest.pezzackComplete=true;
     setScene(home,328,328);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,effects,interact};
})();
