"use strict";

window.BarrowCovenant=(()=>{
 const grove='barrow_grove',glade='barrow_covenant',kind='barrow_malix';
 const altar='barrow-final-stone-v1.png',sheet='barrow-malix-v1.png',fiends='barrow-gorthoklekk-v1.png';
 const malix='luthon_malix',human='gorthoklekk',fiend='gorthoklekk_fiend',cleric='fastness_cleric';
 let royalArrival=null;
 const model={src:sheet,frames:[
  {x:119,y:1,w:359,h:714,anchorX:315,anchorY:713},
  {x:731,y:6,w:618,h:709,anchorX:1087,anchorY:713},
  {x:1514,y:6,w:452,h:709,anchorX:1750,anchorY:713}
 ],maxHeight:714,cycle:[0,2],attackFrames:true};

 function install(){
  scenes[grove].points.push({id:'covenantArrive',x:328,y:128,label:'Enter the final stone clearing'});
  scenes[glade]={
   name:'Barrowood · The Fourteenth Stone',image:altar,spawn:[328,344],blocks:[{x:288,y:133,w:64,h:32}],
   walk:[{x:112,y:160,w:416,h:160},{x:288,y:320,w:80,h:80}],lights:[[261,147],[368,101],[381,147]],
   points:[
    {id:'covenantParley',speaker:malix,x:328,y:240,label:'Hear Archmage Malix'},
    {id:'covenantBattle',speaker:malix,x:328,y:224,label:'Face the rogue Asmodeans'},
    {id:'covenantSacrifice',x:328,y:208,label:'Mark the fourteenth stone and offer Sethic'},
    {id:'covenantFiend',speaker:human,x:328,y:224,label:'Witness Gorthoklekk’s claim'},
    {id:'covenantAudience',x:408,y:224,label:'Meet the Queen at the stone'},
    {id:'covenantRaiseJason',x:264,y:264,label:'Witness Jason’s return'},
    {id:'covenantPromotion',speaker:'abrogail',x:408,y:224,label:'Receive the Queen’s judgment'}
   ]
  };
  MAP_LAYERS[glade]={foreground:altar,contain:true,background:{type:'solid',color:'#141819'}};
  JOURNEYS[glade]='2 Gozran, 4717. The company reaches the fourteenth stone. Another delegation of Asmodeans is already waiting.';
  NAMES[malix]='Archmage Luthon Malix';
  NAMES[human]=NAMES[fiend]='Gorthoklekk';
  FUTURE_NPCS[malix]={source:sheet,frame:model.frames[0]};
  FUTURE_NPCS[human]={source:fiends,frame:{x:92,y:126,w:322,h:749}};
  FUTURE_NPCS[fiend]={source:fiends,frame:{x:856,y:0,w:889,h:887}};
  DIALOGUE_FACE_CROPS[malix]={x:239,y:12,w:155,h:155};
  DIALOGUE_FACE_CROPS[human]={x:194,y:130,w:124,h:124};
  DIALOGUE_FACE_CROPS[fiend]={x:1204,y:22,w:235,h:235};
  COMBAT_IDLES[malix]=model;
  STATS[malix]={hp:36,ac:15,atk:7,dmg:[1,8,3]};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[glade]=await loader(altar);})(),
   ...[sheet,fiends].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){return scene===glade?art[scene]:null;}
 function roster(){
  if(scene!==glade)return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo'&&
   (id!=='jason'||!quest.covenantBattleWon||quest.covenantJasonRaised));
 }
 function points(){
  if(scene===grove&&quest.barrowTrailComplete)return [point('covenantArrive')];
  if(scene!==glade)return null;
  if(quest.covenantComplete)return [];
  const id=!quest.covenantLoyal?'covenantParley':!quest.covenantBattleWon?'covenantBattle':
   !quest.covenantSacrificeMade?'covenantSacrifice':!quest.covenantClaimed?'covenantFiend':
   !quest.covenantQueenArrived?'covenantAudience':!quest.covenantJasonRaised?'covenantRaiseJason':'covenantPromotion';
  return [point(id)];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===glade&&quest.covenantComplete?'The Covenant of Hell stands renewed. The company is sworn as Bound Agents.':null);}
 function npcs(){
  if(scene!==glade)return null;
  if(!quest.covenantBattleWon)return [
   {id:malix,x:328,y:190,height:61},{id:cleric,x:274,y:202,height:54},{id:cleric,x:382,y:202,height:54}
  ];
  const actors=[];
  if(!quest.covenantJasonRaised)actors.push({id:'jason',x:276,y:246,pose:'prone'});
  if(!quest.covenantClaimed)actors.push({id:'sethic',x:328,y:186,pose:'prone',height:54});
  if(quest.covenantSacrificeMade){
   actors.push({id:quest.covenantTrueForm?fiend:human,x:328,y:175,height:quest.covenantTrueForm?111:64});
   actors.push({id:'bob',x:440,y:264,height:46});
  }
  if(quest.covenantQueenArrived)actors.push({id:'abrogail',x:408,y:191,height:58},{id:'contessa',x:450,y:192,height:58});
  return actors;
 }
 function effects(g,t){
  if(scene!==glade||!quest.covenantSacrificeMade)return;
  const pulse=reduce.matches?.42:.37+.08*Math.sin(t*3.3);
  g.save();
  g.globalAlpha=pulse;
  const glow=g.createRadialGradient(328,125,6,328,125,65);
  glow.addColorStop(0,'#f4ba76');
  glow.addColorStop(.5,'#a33431');
  glow.addColorStop(1,'#2a161100');
  g.fillStyle=glow;
  g.fillRect(263,60,130,130);
  for(let i=0;i<12;i++){
   const lift=reduce.matches?(i*7)%52:Math.floor(t*17+i*13)%52;
   g.fillStyle=i%3?'#dc754a':'#f8bd79';
   g.fillRect(296+i*6,168-lift,2,2);
  }
  if(royalArrival?.epoch===epoch){
   const duration=(performance.now()-royalArrival.at)/1600;
   if(duration<1){
    g.globalAlpha=(1-duration)*.52;
    g.strokeStyle='#d7ab72';
    g.lineWidth=3;
    g.beginPath();
    g.ellipse(439,160,23,38,0,0,Math.PI*2);
    g.stroke();
   }
  }
  g.restore();
 }
 function beginFight(){
  const {x,y,dir}=units[0],resolve=STATS[malix].hp,max=STATS[cleric].hp;
  const enemies=[{id:malix,name:NAMES[malix],shortName:'Malix',hp:resolve,max:resolve,resolve:true},
   ...[1,2].map(i=>({id:cleric,name:'Rogue Cleric '+i,shortName:'Cleric '+i,hp:max,max}))];
  save();
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir],opening:'Stand with Jason and defend the Crown’s covenant.'});
 }
 function isCovenantBattle(value){return value===kind;}
 async function openingStrike(current){
  if(!isCovenantBattle(current.kind)||current.covenantJasonKilled)return;
  const token=epoch,jason=units.find(u=>u.id==='jason'),attacker=current.enemies[0];
  if(!jason)return;
  await storyRoll('Malix → Jason',20,STATS[malix].atk,'Fatal spell · Jason falls');
  if(token!==epoch||battle!==current)return;
  await animateAction(attacker,jason,'arcaneBolt',true,()=>{
   hp.jason=0;
   current.covenantJasonKilled=true;
   flash(jason,'FALLEN','#ee9a88');
  });
  if(token===epoch&&battle===current)log('Malix’s spell kills Jason. The company has to hold the stone.');
 }
 async function afterBattle(position){
  quest.covenantBattleWon=true;
  hp.jason=0;
  seedParty(...position);
  paintParty();
  save();
  updateObjective();
  await say('Chronicle','The rogue clerics fall. Wounded, Malix slips into the trees. Jason lies dead where the spell struck him.');
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'covenantArrive':
    quest.covenantReached=true;
    await travel(glade,328,344);
    break;
   case 'covenantParley':
    await say(malix,'The Church should rule Cheliax. You can serve Asmodeus without kneeling to Thrune.');
    await say('jason','Asmodeus stands with the Queen. So do I.');
    quest.covenantLoyal=true;
    break;
   case 'covenantBattle':
    beginFight();
    return true;
   case 'covenantSacrifice':
    await say('Chronicle','The survivors bring Sethic to the fourteenth stone. Freya marks it with his blood and cuts his throat at the altar.');
    quest.barrowStones=14;
    quest.covenantSacrificeMade=true;
    save();
    await say('Chronicle','A gate to Hell opens. A man steps through and names himself Gorthoklekk.');
    break;
   case 'covenantFiend':
    await say(human,'Let him see who brought him here.');
    quest.covenantTrueForm=true;
    await say('Chronicle','Gorthoklekk takes his true form. The pit fiend casts Heal, clearing Sethic’s mind long enough for him to recognize the company.');
    await say('Chronicle','Bob makes finger-guns at Sethic. Gorthoklekk devours him and casts his remains and soul through the gate.');
    quest.covenantClaimed=true;
    break;
   case 'covenantAudience':
    royalArrival={epoch,at:performance.now()};
    quest.covenantQueenArrived=true;
    await say('Chronicle','A second portal opens. Contessa steps through first and scans the clearing. Queen Abrogail follows.');
    await say('abrogail','You have kept our covenant. Gorthoklekk, bring Jason back.');
    break;
   case 'covenantRaiseJason':
    await say(fiend,'As Your Majesty commands.');
    await say('Chronicle','Gorthoklekk casts Raise Dead. Jason draws a breath.');
    hp.jason=Math.max(1,Math.ceil(STATS.jason.hp/2));
    quest.covenantJasonRaised=true;
    seedParty(328,264,'up');
    break;
   case 'covenantPromotion':
    await say('abrogail','Freya, Jason, J’Mal, Draymus, Reese. You are Bound Agents of Thrune. While you serve me, you answer to the Crown.');
    await say('Chronicle','The Queen removes a ring from her own finger and gives it to Jason.');
    quest.covenantComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,effects,isCovenantBattle,openingStrike,afterBattle,interact};
})();
