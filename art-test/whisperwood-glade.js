"use strict";

window.WhisperwoodGlade=(()=>{
 const camp='whisperwood_night_camp',glade='whisperwood_unicorn_glade';
 const image='whisperwood-unicorn-glade-v1.png',unicorn='whisperwood-unicorn-v1.png',allies='whisperwood-glade-defenders-v1.png',stone='whisperwood-stone-giant-v1.png';
 const opponents={
  whisper_unicorn:{name:'Unicorn',src:unicorn,box:[12,8,1515,998],height:87,stats:{hp:23,ac:15,atk:6,dmg:[1,8,2]}},
  whisper_stone_giant:{name:'Stone Giant',src:stone,box:[7,0,994,1435],height:96,stats:{hp:45,ac:16,atk:6,dmg:[1,10,3]}},
  whisper_owlbear:{name:'Owlbear',src:allies,box:[10,20,1046,864],height:85,stats:{hp:40,ac:14,atk:6,dmg:[1,10,2]}},
  whisper_swan:{name:'Swan Maiden',src:allies,box:[1140,0,616,875],height:96,stats:{hp:28,ac:15,atk:6,dmg:[1,8,2]}}
 };
 const creekDefenders=[
  {id:'whisper_unicorn',x:392,y:160,height:49},
  {id:'whisper_stone_giant',x:424,y:136,height:69},
  {id:'whisper_unicorn',x:432,y:216,height:49},
  {id:'whisper_owlbear',x:384,y:232,height:53},
  {id:'whisper_swan',x:448,y:184,height:52}
 ];
 const targets=[
  {id:'gladeAssault',x:328,y:224,label:'Advance on the Blessing of Unicorns'},
  {id:'gladeCollect',x:344,y:176,label:'Recover the first three horns'},
  {id:'gladeCamp',x:384,y:264,label:'Make camp near the creek'},
  {id:'gladeCounterattack',x:408,y:248,label:'Face the defenders at the creek'}
 ];
 function install(){
  scenes[camp].points.push({id:'gladeTrail',x:328,y:152,label:'Follow the unicorn trail'});
  scenes[glade]={
   name:'Whisperwood · The Unicorn Glade',image,spawn:[328,344],blocks:[],
   walk:[{x:224,y:112,w:224,h:80},{x:176,y:176,w:272,h:128},{x:176,y:288,w:256,h:96}],lights:[],points:targets
  };
  MAP_LAYERS[glade]={foreground:image,contain:true,background:{type:'solid',color:'#17201b'}};
  MAP_LAYERS[glade].waterChannels=[[
   [527,0],[556,6],[568,24],[560,44],[541,57],[531,72],[522,92],[518,116],[524,129],
   [542,146],[558,157],[570,173],[576,190],[563,210],[553,229],[543,246],[541,266],
   [555,281],[570,300],[574,320],[568,338],[557,351],[546,364],[535,381],[530,399],
   [458,399],[457,380],[469,366],[486,351],[495,333],[497,314],[485,295],[472,281],
   [459,261],[458,242],[467,223],[485,210],[501,195],[505,178],[504,160],[491,144],
   [472,127],[458,107],[468,89],[480,74],[495,62],[510,52],[527,43],[540,29],[539,13]
  ]];
  JOURNEYS[glade]='The trail leads to a grassy glade with a creek running through it. The Blessing of Unicorns has made its home here for generations.';
  for(const [id,{name,src,box,stats}] of Object.entries(opponents)){
   const [x,y,w,h]=box;
   NAMES[id]=name;
   STATS[id]=stats;
   FUTURE_NPCS[id]={source:src,frame:{x,y,w,h,anchorX:x+w/2,anchorY:y+h}};
  }
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[glade]=await loader(image);})(),
   ...[unicorn,allies,stone].map(async src=>{art[src]=await loader(src);})
  ]);
 }
 function mapImage(){return scene===glade?art[scene]:null;}
 function points(){
  if(!quest.whisperwoodNightComplete)return null;
  if(scene===camp)return quest.whisperwoodGladeComplete?[]:[point('gladeTrail')];
  if(scene!==glade)return null;
  const stage=['whisperwoodUnicornsDefeated','whisperwoodThreeHorns','whisperwoodGladeCamped'].findIndex(flag=>!quest[flag]);
  return [targets[stage<0?3:stage]];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  if(scene===camp&&quest.whisperwoodGladeComplete)return 'Unicorn horns [4/4] · Prepare to hunt angel hearts.';
  if(scene===glade)return target().label+' · Horns ['+(quest.whisperwoodThreeHorns?3:0)+'/4]';
  return target()?.label||null;
 }
 function npcs(){
  if(scene!==glade)return null;
  if(quest.whisperwoodGladeCamped)return creekDefenders;
  return [[240,160],[320,144],[376,176]].map(([x,y])=>({
   id:'whisper_unicorn',x,y,height:50,pose:quest.whisperwoodUnicornsDefeated?'prone':null
  }));
 }
 function enemy(id,number){
  const name=opponents[id].name,max=STATS[id].hp;
  return {id,name:number?name+' '+number:name,hp:max,max};
 }
 function startAssault(){
  const {x,y,dir}=units[0];
  save();
  startBattle(0,false,{kind:'whisperwood_unicorn_assault',enemies:[1,2,3].map(number=>enemy('whisper_unicorn',number)),returnPosition:[x,y,dir]});
 }
 async function afterBattle(position){
  quest.whisperwoodUnicornsDefeated=true;
  seedParty(...position);
  save();
  paintParty();
  updateObjective();
  await say('Chronicle','Three unicorns lie dead by the creek. The rest are gone into the trees.');
 }
 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'gladeTrail':
    quest.whisperwoodGladeReached=true;
    await travel(glade,328,344);
    break;
   case 'gladeAssault':
    await say('freya','Three by the creek. The rest are farther back. Go now, before they scatter.');
    startAssault();
    return true;
   case 'gladeCollect':
    await say(null,'Three unicorns lie dead by the creek.', ['[Collect the three horns]']);
    quest.whisperwoodThreeHorns=true;
    save();
    updateObjective();
    await say('freya','That’s three. Fex needs one more.');
    break;
   case 'gladeCamp':
    await say('freya','We’ll camp here. Stay close to the creek and keep watch on the woods.');
    SouthRoad.recover(.35);
    quest.whisperwoodGladeCamped=true;
    break;
   case 'gladeCounterattack':
    await say('reese','They’re coming back across the creek. A giant, an owlbear, and something winged. They’ve cut off the bank.');
    await say('freya','We’re being driven off the bank. Cover the retreat. J’Mal, keep an eye out for that last horn.');
    save();
    startBattle(0,false,{
     kind:'whisperwood_glade_retreat',scripted:true,script:{command,act,opening:'The glade’s defenders drive the company back.'},scriptActor:'freya',
     enemies:creekDefenders.map(({id})=>enemy(id))
    });
    return true;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }

 const commands=[
  {label:'COVER',name:'Hold the line',description:'Freya shields the company’s withdrawal.',title:'Counterattack'},
  {label:'RECOVER',name:'Take the horn',description:'J’Mal cuts the fourth horn free.',title:'Retreat · Horns [3/4]'},
  {label:'RETREAT',name:'Leave the glade',description:'Fall back with all four horns.',title:'Retreat · Horns [4/4]'}
 ];
 function command(){return commands[battle.gladeStage||0];}
 async function act(action,actor){
  if(action!=='special')return;
  const current=battle,stage=current.gladeStage||0;
  current.busy=true;
  paintBattle();
  if(stage===0){
   await animateAction(current.enemies[1],actor,'attack',true);
   await animateAction(actor,actor,'guard',true,()=>{current.enemies[2].hp=0;});
   log('Freya covers the retreat\nThe giant drives the company back. A unicorn falls in the fighting.');
   current.scriptActor='jamal';
  }else if(stage===1){
   await storyRoll('J’Mal · Reach the fallen unicorn',17,0,'Recover the fourth horn under attack');
   $('dice-panel').hidden=true;
   log('J’Mal recovers the fourth horn\nFour of four horns secured. Fall back.');
  }else{
   log('The company retreats\nJ’Mal carries the fourth horn clear.');
   await delay(reduce.matches?180:600);
   if(battle!==current)return;
   battle=null;
   $('battle').hidden=true;
   $('enemy-intents').hidden=true;
   run(()=>journeyCard('Out of the glade','The company is driven out of the unicorns’ ancestral glade. J’Mal makes it out with the fourth horn. Fex’s next requirement is angel hearts.',()=>{
    quest.whisperwoodFourthHorn=true;
    quest.whisperwoodGladeComplete=true;
    setScene(camp,328,168);
   }));
   return;
  }
  current.gladeStage=stage+1;
  current.busy=false;
  paintBattle();
  canvas.focus({preventScroll:true});
 }
 function combatHeight(id){return opponents[id]?.height;}
 function drawCombat(g,u,v,t){
  const data=opponents[u.id],model=FUTURE_NPCS[u.id],im=data&&art[model.source];
  if(!im)return false;
  const f=model.frame,a=battle?.animation;
  const idle=reduce.matches||a?.actor===u||u.hp===0?0:Math.sin(Math.floor((t+(u.idleOffset||0))*4)*1.7);
  const scale=Math.min(v.height/f.h,(battle.scripted?112:132)/f.w),pose=actionPose(u);
  g.save();
  g.imageSmoothingEnabled=false;
  g.translate(v.x+pose.dx,v.y+pose.dy);
  g.rotate(u.hp===0?-.8:pose.tilt+idle*.013);
  if(u.flash>0&&!reduce.matches)g.globalAlpha*=.7;
  g.drawImage(im,f.x,f.y,f.w,f.h,Math.round(-f.w*scale/2),-Math.round(f.h*scale+idle),Math.round(f.w*scale),Math.round(f.h*scale+idle));
  g.restore();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,interact,afterBattle,combatHeight,drawCombat};
})();
