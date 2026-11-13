"use strict";

window.EgorianArrival=(()=>{
 const bridge='egorian_bridge',square='egorian_square',temple='egorian_temple',manor='egorian_manor';
 const custodyWalkDuration=680;
 let custodyWalkStarted=null;
 const layouts={
  [bridge]:{
   name:'Egorian · West Bridge',image:'egorian-west-bridge-v1.png',spawn:[328,360],
   walk:[{x:240,y:128,w:160,h:144},{x:192,y:272,w:256,h:128},{x:288,y:112,w:64,h:32}],
   lights:[[250,90],[390,90]],
   points:[{id:'egorianSalute',x:328,y:280,label:'Meet the bridge escort'},
    {id:'egorianCross',x:328,y:136,label:'Cross into Egorian'}]
  },
  [square]:{
   name:'Egorian · Central Square',image:'egorian-central-square-v1.png',spawn:[328,360],
   walk:[{x:80,y:160,w:480,h:144},{x:256,y:288,w:128,h:112},
    {x:112,y:112,w:64,h:48},{x:464,y:112,w:64,h:48}],
   lights:[[118,90],[185,90],[325,111],[589,115]],
   points:[{id:'egorianHandover',x:152,y:144,label:'Deliver Oppian to the Dottari'},
    {id:'egorianEnterTemple',x:488,y:128,label:'Enter the Midnight Temple'},
    {id:'egorianThorntown',x:328,y:360,label:'Follow Corrine to Thorntown'}]
  },
  [temple]:{
   name:'Egorian · Midnight Temple',image:'egorian-midnight-temple-v1.png',spawn:[328,360],
   walk:[{x:144,y:128,w:352,h:160},{x:272,y:272,w:96,h:128}],
   lights:[[110,57],[221,52],[419,52],[590,173]],
   points:[{id:'egorianSupply',x:328,y:144,label:'Collect healing supplies'},
    {id:'egorianLeaveTemple',x:328,y:360,label:'Return to the square'}]
  },
  [manor]:{
   name:'Thorntown · Falco Residence',image:'egorian-falco-manor-v1.png',spawn:[328,312],
   walk:[{x:80,y:240,w:480,h:96},{x:512,y:112,w:48,h:144}],
   lights:[[152,53],[262,53],[373,53],[571,179]],
   points:[{id:'egorianWelcome',x:328,y:264,label:'Meet Lady Tria Falco'},
    {id:'egorianRooms',x:544,y:120,label:'Set the night watch'}]
  }
 };

 function install(){
  scenes.south_road_camp.points.push({id:'egorianApproach',x:328,y:344,label:'Approach the West Bridge'});
  for(const [id,layout] of Object.entries(layouts)){
   scenes[id]={...layout,blocks:[]};
   MAP_LAYERS[id]={foreground:layout.image,background:id===bridge?
    {type:'ocean',palette:['#17262e','#263945','#2d4550','#3b5360'],speed:4,waterline:126,landColor:'#141b21'}:
    {type:'solid',color:'#100e14'}};
  }
  JOURNEYS[bridge]='The carriage reaches the West Bridge near Fort Adivian. Egorian stretches along Lake Sorrow, its streets laid out by order of the crown.';
  JOURNEYS[square]='Eight mounted Egorian Knights escort the carriage over the bridge and down the main street. The Dottari are waiting in the central square.';
  JOURNEYS[temple]='Jason stops at the Midnight Temple of Asmodeus to replenish the company’s healing supplies.';
  JOURNEYS[manor]='The guards at Thorntown salute Freya. They eye the battered carriage and its passengers as Corrine leads the company on to the Falco residence.';
  NAMES.tria='Lady Tria Falco';
  QUESTGIVER_MODELS.tria={name:NAMES.tria,src:'egorian-tria-falco-v1.png',frames:[
   {x:175,y:12,w:398,h:705},{x:892,y:12,w:347,h:705},{x:1590,y:12,w:380,h:705}
  ]};
 }

 async function load(loader){
  await Promise.all(Object.entries(layouts).map(async ([id,{image}])=>{art[id]=await loader(image);}));
 }
 function mapImage(){return Object.hasOwn(layouts,scene)?art[scene]:null;}

 function target(){
  if(!quest.southRoadComplete)return null;
  switch(scene){
   case 'south_road_camp':return point('egorianApproach');
   case bridge:return point(quest.egorianBridgeMet?'egorianCross':'egorianSalute');
   case square:
    return point(quest.egorianTempleSupplied?'egorianThorntown':quest.oppianDelivered?'egorianEnterTemple':'egorianHandover');
   case temple:return point(quest.egorianTempleSupplied?'egorianLeaveTemple':'egorianSupply');
   case manor:return quest.egorianArrivalComplete?null:point(quest.triaWelcomed?'egorianRooms':'egorianWelcome');
   default:return null;
  }
 }
 function points(){const next=target();return next?[next]:scene===manor?[]:null;}
 function goal(){return target()?.label||(scene===manor&&quest.egorianArrivalComplete?'The company settles in at Falco Manor.':null);}
 function npcs(){
  if(scene===bridge)return [160,208,256,304].flatMap(y=>[248,408].map(x=>({id:'south_road_knight',x,y,height:54})));
  if(scene===square){
   if(custodyWalkStarted!==null){
    const progress=Math.min(1,(performance.now()-custodyWalkStarted)/custodyWalkDuration);
    return [{id:'guard',x:152,y:Math.round(128-22*progress)},
     {id:'oppian',x:Math.round(176-24*progress),y:Math.round(152-39*progress)}];
   }
   return [{id:'guard',x:152,y:128},...(!quest.oppianDelivered?[{id:'oppian',x:176,y:152}]:[])];
  }
  if(scene===temple)return [];
  if(scene===manor)return [{id:'tria',x:296,y:248}];
  return null;
 }

 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'egorianApproach':
    await travel(bridge,328,360);
    break;
   case 'egorianSalute':
    await say('Egorian escort','Captain Kusanagi. Fort Adivian received word of your prisoner. Eight riders will see you and your carriage to the square.');
    await say('freya','Keep four to each side. Nevilindor stays inside until the Dottari take custody.');
    quest.egorianBridgeMet=true;
    break;
   case 'egorianCross':
    await travel(square,328,360);
    break;
   case 'egorianHandover':
    await say('Dottari Guard','Oppian Nevilindor. On behalf of the crown, we accept custody of the prisoner.');
    await say('freya','He was taken alive at Valor’s Fastness. See that he makes it to trial.');
    await say(null,'The Dottari wait at the gate.', ['[Transfer Oppian into custody]']);
    quest.oppianDelivered=true;
    save();
    if(!reduce.matches){
     const token=epoch;
     custodyWalkStarted=performance.now();
     try{
      await delay(custodyWalkDuration);
      if(token!==epoch)throw CANCEL;
     }finally{
      custodyWalkStarted=null;
     }
    }
    break;
   case 'egorianEnterTemple':
    await travel(temple,328,360);
    break;
   case 'egorianSupply':
    await say('jason','We’ve been stretching what we brought from Kantaria. The temple has enough to replenish our healing supplies.');
    await say(null,'The temple has healing supplies ready at the counter.', ['[Refill the party’s potions]']);
    potions=2;
    quest.egorianTempleSupplied=true;
    break;
   case 'egorianLeaveTemple':
    await travel(square,488,160,'down');
    break;
   case 'egorianThorntown':
    await say('corrine','I was stationed in Egorian before I joined you. The Falco residence is in Thorntown. Let me get us through the gates.');
    await travel(manor,328,312);
    break;
   case 'egorianWelcome':
    await say('tria','Captain Kusanagi. Jason. Welcome to my home. Darellus and I go back years. He has told me some of your stories, and I hope you’ll tell me the rest over supper.');
    await say('tria','I’ve had four rooms made ready. Eat first, then take whichever suits you.');
    quest.triaWelcomed=true;
    break;
   case 'egorianRooms':
    await say('freya','One room will do. We’ll sleep together and take turns keeping watch.');
    quest.egorianArrivalComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,target,points,goal,npcs,interact};
})();
