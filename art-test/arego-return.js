"use strict";

window.AregoReturn=(()=>{
 const hell='arego_malebolge_ledge',gate='arego_inferno_gate',kind='arego_fex_rematch';
 const bone='arego_bone_devil',bearded='arego_bearded_devil',boneArt='arego-bone-devil-v1.png';
 const reinforcements=[{x:139,y:230,height:46},{x:203,y:228,height:48}];
 function install(){
  scenes[hell].points.push(
   {id:'aregoReeseBargain',speaker:'visperthul',x:488,y:160,label:'Bargain with Visperthul'},
   {id:'aregoRaiseBoneDevils',speaker:'visperthul',x:488,y:160,label:'Accept Visperthul’s aid'},
   {id:'aregoReturnThroughGate',x:312,y:312,label:'Return through the Inferno Gate'}
  );
  scenes[gate].points.push(
   {id:'aregoFreeCompany',x:280,y:328,label:'Free the fallen companions'},
   {id:'aregoFexRematch',speaker:'fex',x:328,y:288,label:'Confront Fex again'},
   {id:'aregoConsiderContract',speaker:'visperthul',x:472,y:248,label:'Consider the price of the bargain'}
  );
  STATS.fex={hp:94,ac:17,atk:8,dmg:[2,6,4]};
  NAMES[bone]='Bone Devil';
  FUTURE_NPCS[bone]={source:boneArt,frame:{x:111,y:37,w:875,h:1224}};
 }
 async function load(loader){art[boneArt]=await loader(boneArt);}
 function roster(){
  if(scene!==gate||!quest.aregoReeseReturned||quest.aregoFexSlain)return null;
  if(!quest.aregoCompanyFreed)return ['reese'];
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(!quest.aregoReeseSheltered)return null;
  if(scene===hell)return [point(!quest.aregoReeseContract?'aregoReeseBargain':!quest.aregoBoneDevilsSummoned?'aregoRaiseBoneDevils':'aregoReturnThroughGate')];
  if(scene===gate&&quest.aregoReeseReturned){
   if(quest.aregoFexAftermath)return [];
   return [point(!quest.aregoCompanyFreed?'aregoFreeCompany':!quest.aregoFexSlain?'aregoFexRematch':'aregoConsiderContract')];
  }
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===gate&&quest.aregoFexAftermath?'Fex is dead · Reese’s contract still binds the company.':null);}
 function npcs(t=0){
  if(scene===hell&&quest.aregoReeseSheltered){
   const allies=[{id:'visperthul',x:488,y:145,height:90}];
   if(quest.aregoBoneDevilsSummoned)allies.push({id:bone,x:412,y:149,height:59},{id:bone,x:539,y:125,height:58});
   return allies;
  }
  if(scene!==gate||!quest.aregoReeseReturned)return null;
  const allies=[{id:'visperthul',x:472,y:232+(reduce.matches?0:Math.round(Math.sin(t*1.7)*2)),height:91}];
  if(quest.aregoFexSlain)return [...allies,{id:'fex',x:360,y:296,height:61,pose:'prone'}];
  allies.push({id:bone,x:174,y:304,height:62},{id:bone,x:462,y:307,height:62},{id:'fex',x:328,y:276,height:64});
  if(!quest.aregoCompanyFreed)allies.push(
   {id:'jason',x:208,y:315,height:49,pose:'prone'},
   {id:'draymus',x:226,y:337,height:48,pose:'prone'},
   {id:'jamal',x:252,y:359,height:45,pose:'prone'}
  );
  return allies;
 }

 function beginFight(){
  const {x,y,dir}=units[0];
  save();
  const enemies=[
   {id:'fex',name:'Archbaron Fex',hp:STATS.fex.hp,max:STATS.fex.hp},
   ...[1,2].map(i=>({id:bearded,name:'Bearded Devil '+i,hp:22,max:STATS[bearded].hp}))
  ];
  startBattle(0,false,{kind,enemies,returnPosition:[x,y,dir]});
  log('Visperthul joins the battle\nTwo bone devils press the enemy line.');
 }
 async function afterBattle(position){
  quest.aregoFexSlain=true;
  seedParty(...position);
  NextChapter.syncRoster();
  save();
  updateObjective();
  await say('Chronicle','Fex falls in front of the Inferno Gate. The archbaron is dead.');
 }
 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'aregoReeseBargain':
    await say('reese','Fex has them. Take the talisman. I need you to come back with me and help me bring him down.');
    await say('visperthul','The talisman buys my attention. I want the fealty of every one of you. No conditions.');
    await say('reese','I swear my fealty and theirs. Help me save them.', ['[Hand over the talisman and sign]']);
    quest.aregoReeseContract=true;
    break;
   case 'aregoRaiseBoneDevils':
    await say('visperthul','You’ll need your strength for what comes next. Stand still.');
    hp.reese=STATS.reese.hp;
    await say('Chronicle','Visperthul closes Reese’s wounds and summons two bone devils. They turn toward the tear.');
    quest.aregoBoneDevilsSummoned=true;
    break;
   case 'aregoReturnThroughGate':
    await journeyCard('Back through the Inferno Gate','Visperthul and his two bone devils return to Fort Arego with Reese. Jason and Draymus are still unconscious. J’Mal needs help too.',()=>{
     quest.aregoReeseReturned=true;
     setScene(gate,328,344);
    });
    break;
   case 'aregoFreeCompany':{
    await say('reese','Jason. Draymus. J’Mal. Get them clear while we’ve still got room.');
    await say('Chronicle','With Visperthul’s help, Reese frees Jason, Draymus and J’Mal and gets them back on their feet.');
    for(const id of ['jason','draymus','jamal'])hp[id]=Math.max(hp[id],Math.ceil(STATS[id].hp*.6));
    quest.aregoCompanyFreed=true;
    const {x,y,dir}=units[0];
    setScene(gate,x,y,dir);
    break;
   }
   case 'aregoFexRematch':
    await say('fex','You handed him what I made. Do you understand what you have done?');
    await say('reese','I came back for my company.');
    await say('freya','Guapo’s still under Fex’s spell. Keep him out of the fight. Visperthul, send your devils in.');
    beginFight();
    return true;
   case 'aregoConsiderContract':{
    const fallen=['freya','jason','draymus'].filter(id=>hp[id]===0);
    if(fallen.length){
     await say('Chronicle','The company takes a moment to bind wounds and bring the fallen around.');
     for(const id of fallen)hp[id]=1;
    }
    await say('draymus','We could turn on Visperthul while we have the chance.');
    await say('jason','Reese signed a contract. Think about what it might cost him before you reach for a weapon.');
    await say('reese','I brought us back alive. We still have to decide what that promise means.');
    quest.aregoFexAftermath=true;
    break;
   }
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 function support(){
  if(battle?.kind!==kind)return;
  const target=battle.enemies.find(e=>e.hp>1);
  if(!target)return;
  const damage=Math.min(target.hp-1,8);
  target.hp-=damage;
  battle.boneStrikeAt=performance.now();
  flash(target,'−'+damage,'#d3b7e6');
  log('The bone devils strike\n'+target.name+' takes '+damage+' damage.');
 }
 function drawSupport(g,t){
  if(battle?.kind!==kind||!art[boneArt])return;
  const models=[{id:'visperthul',x:66,y:231,height:55},...reinforcements.map(p=>({...p,id:bone}))];
  g.save();
  g.imageSmoothingEnabled=false;
  for(const [index,{id,x,y,height}] of models.entries()){
   const {source,frame:f}=FUTURE_NPCS[id],width=Math.round(height*f.w/f.h);
   const lift=reduce.matches?0:Math.round(Math.sin(t*2.8+index*1.8)*(index===0?2:1));
   const strike=reduce.matches||index===0||battle.boneStrikeAt==null?0:
    Math.sin(Math.PI*Math.min(1,(performance.now()-battle.boneStrikeAt)/340))*11;
   g.drawImage(art[source],f.x,f.y,f.w,f.h,x-width/2+strike,y-height+lift,width,height);
  }
  g.restore();
 }
 return {install,load,roster,points,target,goal,npcs,interact,afterBattle,support,drawSupport};
})();
