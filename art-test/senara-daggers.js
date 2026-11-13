"use strict";

window.SenaraDaggers=(()=>{
 const villa='senara_fex_villa',sewer='senara_sewers',guild='senara_daggers_hideout',kind='senara_daggers';
 const cast='senara-daggers-cast-v1.png';
 const members=[
  {id:'senara_dagger_speaker',name:'Guild Spokesperson',shortName:'Spokesperson',x:328,y:168},
  {id:'senara_dagger_scout',name:'Guild Scout',shortName:'Scout',x:264,y:152},
  {id:'senara_dagger_lookout',name:'Guild Lookout',shortName:'Lookout',x:392,y:152}
 ];
 const maps={
  [sewer]:{
   name:'Senara · The Sewers',image:'senara-sewers-v1.png',spawn:[328,344],blocks:[],lights:[[219,31],[420,31],[91,115],[547,115],[28,263],[611,263]],
   walk:[{x:272,y:64,w:96,h:96},{x:256,y:144,w:128,h:112},{x:224,y:240,w:192,h:160}],
   points:[{id:'sewerRendezvous',x:328,y:248,label:'Approach the waiting figure'},
    {id:'sewerGuild',x:328,y:96,label:'Follow J’Mal through the arch'}]
  },
  [guild]:{
   name:'Senara · Black Daggers’ Hideout',image:'senara-daggers-hideout-v1.png',spawn:[328,344],blocks:[],lights:[[131,52],[272,31],[367,31],[511,52],[63,147],[576,147],[64,185],[574,185]],
   walk:[{x:112,y:112,w:416,h:192},{x:176,y:288,w:288,h:64},{x:288,y:336,w:64,h:64}],
   points:[{id:'daggersScout',x:328,y:288,label:'Scout the hideout from the entrance'},
    {id:'daggersStrike',x:328,y:240,label:'Spring the ambush'},
    {id:'daggersTerms',speaker:members[0].id,x:328,y:192,label:'Hear the Black Daggers’ terms'}]
  }
 };
 function install(){
  scenes[villa].points.push({id:'senaraSewers',x:328,y:344,label:'Follow the sewer lead'});
  for(const [id,map] of Object.entries(maps)){
   scenes[id]=map;
   MAP_LAYERS[id]={foreground:map.image,contain:true,background:{type:'solid',color:'#10141a'}};
  }
  MAP_LAYERS[sewer].waterChannels=[
   [[198,88],[234,88],[222,147],[208,203],[196,260],[180,346],[54,346],[89,266],[117,203],[144,135],[186,115]],
   [[406,88],[442,88],[454,115],[496,135],[523,203],[551,266],[586,346],[460,346],[444,260],[432,203],[418,147]]
  ];
  JOURNEYS[sewer]='The old guild marks point into the sewers beneath Senara. Draymus follows the stone channel while the others wait above.';
  JOURNEYS[guild]='J’Mal leads Draymus to a cave where the Black Daggers have regrouped. The two hold back to see how the guild has set its watch.';
  members.forEach(({id,name},i)=>{
   NAMES[id]=name;
   FUTURE_NPCS[id]={source:cast,frame:castFrames[i]};
   DIALOGUE_FACE_CROPS[id]=faceFrames[i];
  });
 }
 const castFrames=[{x:137,y:7,w:455,h:713},{x:901,y:28,w:330,h:688},{x:1558,y:7,w:427,h:713}];
 const faceFrames=[{x:327,y:10,w:151,h:151},{x:990,y:34,w:150,h:150},{x:1668,y:5,w:151,h:151}];

 async function load(loader){
  await Promise.all([
   ...Object.entries(maps).map(async ([id,{image}])=>{art[id]=await loader(image);}),
   (async()=>{art[cast]=await loader(cast);})()
  ]);
 }
 function mapImage(){return Object.hasOwn(maps,scene)?art[scene]:null;}
 function roster(){
  if(scene===sewer)return quest.senaraJmalFound?['draymus','jamal']:['draymus'];
  if(scene===guild){
   if(quest.senaraGuildSurrendered)return ['freya','draymus','jamal'];
   return ['draymus','jamal'];
  }
  return null;
 }
 function npcs(){
  if(scene===sewer)return quest.senaraJmalFound?[]:[{id:'jamal',x:328,y:232,dir:'down'}];
  return scene===guild?members:null;
 }
 function points(){
  if(!quest.senaraOrphanageComplete)return null;
  if(scene===villa)return quest.senaraTalismanRecovered?[]:[point('senaraSewers')];
  if(scene===sewer)return [point(quest.senaraJmalFound?'sewerGuild':'sewerRendezvous')];
  if(scene===guild)return [point(quest.senaraGuildSurrendered?'daggersTerms':quest.senaraGuildScouted?'daggersStrike':'daggersScout')];
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===villa&&quest.senaraTalismanRecovered?'The Infernal Talisman is recovered.':null);}

 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'senaraSewers':
    quest.senaraSewersEntered=true;
    await travel(sewer,328,344);
    break;
   case 'sewerRendezvous':
    await say('draymus','J’Mal? Last I saw you, the Dottari were searching the square.');
    await say('jamal','Let them look. The Black Daggers are through that arch. I’ll take you to them.');
    quest.senaraJmalFound=true;
    setScene(sewer,328,248);
    break;
   case 'sewerGuild':
    quest.senaraGuildEntered=true;
    await travel(guild,328,344);
    break;
   case 'daggersScout':
    await say('jamal','Three in the open, and none of them has seen us. You have the first move.');
    await say('draymus','Glitterdust first. Once they’re blind, I’ll bind them.');
    quest.senaraGuildScouted=true;
    break;
   case 'daggersStrike':
    save();
    startBattle(0,false,{kind,scripted:true,script,scriptActor:'draymus',returnPosition:[328,240],enemies:members.map(e=>({...e,hp:1,max:1}))});
    return true;
   case 'daggersTerms':
    await say(members[0].id,'We surrender. The talisman is yours. Let us walk away and we’ll send you word whenever the Reclamation moves.');
    await say('freya','Regular reports, for Thrune. Start with what you know about the rebels in Senara.');
    await say(null,'The spokesperson offers Fex’s talisman.', ['[Take the Infernal Talisman]']);
    await journeyCard('The Black Daggers’ bargain','The guild returns Fex’s Infernal Talisman and agrees to report on the rebels’ movements. The company returns to the residence.',()=>{
     quest.senaraTalismanRecovered=true;
     setScene(villa,328,312);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 function command(){
  if(battle?.kind!==kind)return null;
  return battle.daggerSpell==='tentacles'?
   {title:'Initiative won',name:'Black Tentacles',description:'Bind the guild before they can act.'}:
   {title:'Surprise round',name:'Glitterdust',description:'Blind the guild in the surprise round.'};
 }
 async function castSpell(action,actor){
  const spell=command();
  if(!spell||action!=='special')return;
  const current=battle,target=livingEnemy();
  current.busy=true;
  paintBattle();
  await animateAction(actor,target,'special',true);
  if(current.daggerSpell!=='tentacles'){
   log('Draymus casts Glitterdust\nGolden dust blinds the guild.');
   await storyRoll('Draymus · Initiative',17,0,'Draymus acts first');
   $('dice-panel').hidden=true;
   current.daggerSpell='tentacles';
   current.busy=false;
   paintBattle();
   canvas.focus({preventScroll:true});
   return;
  }
  log('Draymus casts Black Tentacles\nThe guild drops its weapons.');
  await delay(reduce.matches?200:650);
  if(battle!==current)return;
  battle=null;
  $('battle').hidden=true;
  $('enemy-intents').hidden=true;
  quest.senaraGuildSurrendered=true;
  setScene(guild,...current.returnPosition);
  run(async()=>{
   await say(members[0].id,'Enough! We yield. Let us speak before anyone else draws a blade.');
   await say('jamal','I’ll bring Freya down. She can hear their offer herself.');
  });
 }
 const script={command,act:castSpell,opening:'Surprise round · Draymus has the opening.',enemyStatus:()=>battle.daggerSpell==='tentacles'?'BLINDED':'ON WATCH'};
 function effect(g,a){
  if(battle?.kind!==kind||a.type!=='special')return false;
  const p=CombatArt.phase(a),amount=Math.max(0,(p-.22)/.78),binding=battle.daggerSpell==='tentacles';
  if(!amount)return true;
  g.save();
  g.globalAlpha=reduce.matches?.8:Math.sin(amount*Math.PI)*.95;
  for(const enemy of battle.enemies){
   const {x,y,height}=battlePosition(enemy);
   if(binding){
    for(let i=-1;i<=1;i++){
     const reach=Math.round(height*.86*Math.min(1,amount*2.3));
     for(let h=0;h<reach;h+=4){
      const px=Math.round(x+i*13+Math.sin(h*.12+i+amount*5)*9);
      g.fillStyle='#171226';g.fillRect(px,y-h,9,5);
      g.fillStyle='#705582';g.fillRect(px+2,y-h,2,4);
     }
    }
   }else{
    for(let i=0;i<19;i++){
     const angle=i*2.399,r=6+amount*(12+i%7*4);
     const px=Math.round(x+Math.cos(angle)*r),py=Math.round(y-height*.65+Math.sin(angle)*r);
     g.fillStyle=i%3?'#f5cf66':'#fff3ac';
     g.fillRect(px,py,i%3?2:5,2);
     if(i%3===0)g.fillRect(px+2,py-2,1,6);
    }
   }
  }
  g.restore();
  return true;
 }
 return {install,load,mapImage,roster,npcs,points,target,goal,interact,command,castSpell,effect};
})();
