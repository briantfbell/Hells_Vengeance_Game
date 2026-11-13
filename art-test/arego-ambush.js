"use strict";

window.AregoAmbush=(()=>{
 const gate='arego_inferno_gate',hell='arego_malebolge_ledge';
 const landing=[312,296];
 const artName='arego-malebolge-ledge-v1.png',devil='arego_bearded_devil',raz='razelago_revealed';
 const commands=[
  {label:'CAST',name:'Invisibility Purge',description:'Jason reveals Fex and Razelago.',title:'The unseen attackers'},
  {label:'ATTACK',name:'Covering shot',description:'Reese fires as the company advances.',title:'Fex is exposed'},
  {label:'REGROUP',name:'Get out of the cloud',description:'Draymus tries to rally the company.',title:'Stinking Cloud'},
  {label:'RECOVER',name:'Take the talisman',description:'Reese grabs Fex’s talisman.',title:'Reese is still standing'},
  {label:'ESCAPE',name:'Jump through the gate',description:'Reese carries the talisman into Hell.',title:'The Inferno Gate'}
 ];
 function install(){
  scenes[gate].points.push({id:'aregoFexAmbush',x:472,y:272,label:'Face Fex at the Inferno Gate'});
  scenes[hell]={
   name:'Malebolge · The Basalt Ledge',image:artName,spawn:landing,blocks:[],lights:[],
   walk:[{x:272,y:272,w:80,h:64},{x:224,y:224,w:208,h:48},{x:272,y:176,w:224,h:48},{x:352,y:128,w:176,h:48}],
   points:[{id:'aregoReeseShelter',x:448,y:168,label:'Follow the ledge through the ash'}]
  };
  MAP_LAYERS[hell]={foreground:artName,contain:true,background:{type:'solid',color:'#191116'}};
  NAMES[raz]='Razelago';
  FUTURE_NPCS.fex??=LORE_CAST.fex;
  FUTURE_NPCS[raz]??=LORE_CAST[raz];
 }
 async function load(loader){art[hell]=await loader(artName);}
 function mapImage(){return scene===hell?art[hell]:null;}
 function roster(){return scene===hell?['reese']:null;}
 function points(){
  if(!quest.aregoFirstPact)return null;
  if(scene===gate)return [point('aregoFexAmbush')];
  if(scene===hell)return quest.aregoReeseSheltered?[]:[point('aregoReeseShelter')];
  return null;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===hell&&quest.aregoReeseSheltered?'Find Visperthul in Malebolge.':null);}
 function npcs(){
  if(scene===hell)return [];
  if(scene!==gate||!quest.aregoFexArrived)return null;
  return [{id:'fex',x:320,y:274,height:63},{id:raz,x:376,y:272,height:52}];
 }
 function makeEnemy(id,name,hp,hidden=false){return {id,name,hp,max:hp,opacity:hidden?0:1};}
 function start(){
  startBattle(0,false,{
   kind:'arego_fex_ambush',scripted:true,scriptActor:'jason',
   script:{command,act,enemyStatus,partyStatus,opening:'Fex and Razelago vanish. Jason can reveal them.'},
   enemies:[
    makeEnemy('fex','Archbaron Fex',76,true),makeEnemy(raz,'Razelago',55,true),
    makeEnemy(devil,'Bearded Devil',35),makeEnemy(devil,'Bearded Devil',35)
   ]
  });
 }
 function command(){return commands[battle.ambushStage||0];}
 function enemyStatus(enemy){return enemy.opacity===0?'HIDDEN':'';}
 function partyStatus(unit){
  if(unit.id==='guapo'&&battle.guapoDominated)return 'DOMINATED';
  if(unit.id==='jamal'&&battle.jamalConfused)return 'CONFUSED';
  if(unit.id==='freya'&&battle.clouded)return 'IN THE CLOUD';
  return '';
 }
 function proceed(current,stage,actor){
  current.ambushStage=stage;
  current.scriptActor=actor;
  current.busy=false;
  paintBattle();
  canvas.focus({preventScroll:true});
 }
 async function act(action,actor){
  if(action!=='special')return;
  const current=battle,stage=current.ambushStage||0,[fex,accuser,attacker]=current.enemies;
  const ally=id=>units.find(u=>u.id===id);
  current.busy=true;
  paintBattle();
  switch(stage){
   case 0:
    await animateAction(actor,fex,'purge',true,()=>{fex.opacity=1;accuser.opacity=1;});
    log('Jason casts Invisibility Purge\nFex and Razelago are revealed.');
    proceed(current,1,'reese');
    break;
   case 1:
    await animateAction(actor,fex,'attack',false);
    await animateAction(fex,ally('freya'),'arego_cloud');
    current.clouded=true;
    log('Fex casts Stinking Cloud\nThe company’s attack breaks apart.');
    proceed(current,2,'draymus');
    break;
   case 2:
    await animateAction(fex,ally('guapo'),'arego_domination',true,()=>{current.guapoDominated=true;});
    log('Fex dominates El Guapo\nGuapo turns against the company.');
    await animateAction(accuser,ally('jamal'),'arego_confusion',true,()=>{current.jamalConfused=true;});
    log('Razelago confuses J’Mal\nJ’Mal can no longer act with the company.');
    await animateAction(fex,ally('jason'),'arego_chain',true,()=>{
     hp.jason=0;
     hp.draymus=0;
    });
    log('Fex casts Chain Lightning\nJason and Draymus fall unconscious.');
    await animateAction(attacker,ally('reese'),'attack',true,()=>{
     const harm=Math.min(12,Math.max(0,hp.reese-1));
     hp.reese-=harm;
     if(harm)flash(ally('reese'),'−'+harm,'#ee9a88');
    });
    log('The bearded devils wound Reese\nThe talisman is within reach.');
    proceed(current,3,'reese');
    break;
   case 3:
    log('Reese grabs the Phlegmatic Talisman\nVisperthul has retreated through the tear.');
    proceed(current,4,'reese');
    break;
   case 4:
    await animateAction(actor,actor,'arego_crossing');
    if(battle!==current)return;
    battle=null;
    $('battle').hidden=true;
    $('enemy-intents').hidden=true;
    run(()=>journeyCard('Through the Inferno Gate','Still bleeding, Reese jumps through the tear with the talisman. On the other side, the heat and ash hit him before he can find his footing.',()=>{
     quest.aregoReeseCrossed=true;
     setScene(hell,...landing);
    }));
    break;
  }
 }
 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'aregoFexAmbush':
    if(!quest.aregoFexArrived){
     await say('fex','You have done well to bring everything here. I will take the talisman now.');
     await say('freya','We know what you promised Visperthul. The ritual is over.');
     await say('Chronicle','Visperthul withdraws through the tear. Fex and Razelago vanish from sight as two bearded devils move to cut off the company.');
     if(['jason','draymus','reese'].some(id=>hp[id]===0)){
      await say('Chronicle','The company gets its fallen companions back on their feet as Fex closes in.');
     }
     quest.aregoFexArrived=true;
     for(const id of ['jason','draymus','reese'])hp[id]=Math.max(1,hp[id]);
     save();
    }
    start();
    return true;
   case 'aregoReeseShelter':
    await say('reese','Visperthul went this way. Keep moving, Reese.');
    await say('Chronicle','Reese shields his face from the ash. Ahead, a familiar shape hangs above the rock: Visperthul’s iron throne.');
    quest.aregoReeseSheltered=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 function effects(g,t){
  if(scene!==hell||reduce.matches)return;
  g.save();
  for(let i=0;i<32;i++){
   const age=(t*.23+i*.117)%1,x=(i*41+age*103)%640,y=(i*79+age*58)%398;
   g.globalAlpha=(1-age)*.42;
   g.fillStyle=i%5?'#957771':'#e8ad6a';
   g.fillRect(Math.round(x),Math.round(y),i%5===0?2:1,1);
  }
  g.restore();
 }
 function effect(g,a){
  if(!['purge','arego_cloud','arego_domination','arego_confusion','arego_chain','arego_crossing'].includes(a.type))return false;
  const p=CombatArt.phase(a),to=battlePosition(a.target),x=to.x,y=to.y-to.height*.57;
  g.save();
  g.globalAlpha=Math.sin(p*Math.PI)*.87;
  if(a.type==='arego_chain'){
   const from=battlePosition(a.actor),other=battlePosition(units.find(u=>u.id==='draymus'));
   g.strokeStyle='#b9b8f0';g.lineWidth=3;g.beginPath();g.moveTo(from.x,from.y-45);
   g.lineTo(x+76,y-53);g.lineTo(x+57,y-42);g.lineTo(x+36,y-48);g.lineTo(x,y);
   g.lineTo((x+other.x)/2,y-22);g.lineTo(other.x,other.y-other.height*.54);g.stroke();
  }else if(a.type==='arego_cloud'){
   for(let i=0;i<18;i++){
    const dx=44+i*32+Math.sin(i*4+p*7)*17,dy=244+(i*31)%47;
    g.globalAlpha=Math.sin(p*Math.PI)*(.16+(i%3)*.1);
    g.fillStyle=i%2?'#757844':'#a89a5f';g.fillRect(Math.round(dx),Math.round(dy),26,8);
   }
  }else{
   const color={purge:'#dbd6ae',arego_domination:'#a684cd',arego_confusion:'#dda56a',arego_crossing:'#f49a55'}[a.type];
   for(let i=0;i<18;i++){
    const angle=i*Math.PI/9+p*2,r=7+p*(a.type==='purge'?90:44);
    g.fillStyle=color;
    g.fillRect(Math.round(x+Math.cos(angle)*r),Math.round(y+Math.sin(angle)*r*.7),3,3);
   }
  }
  g.restore();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,interact,effects,effect};
})();
