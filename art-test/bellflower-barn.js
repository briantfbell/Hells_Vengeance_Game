"use strict";

window.BellflowerBarn=(()=>{
 const hide='egorian_migos_hideaway',yard='egorian_bellflower_barn',boarder='bellflower_boarder';
 const intact='bellflower-barn-v1.png',ruined='bellflower-barn-ruined-v1.png',elemental='bellflower-earth-elemental-v1.png';
 let siege=null;

 function install(){
  scenes[hide].points.push({id:'bellflowerBarnLead',speaker:'jason',x:264,y:216,label:'Follow the lead to the Bellflower barn'});
  scenes[yard]={
   name:'Egorian · Bellflower Barn',image:intact,spawn:[328,344],blocks:[],
   walk:[{x:112,y:176,w:416,h:144},{x:288,y:320,w:80,h:80}],lights:[[52,253],[595,265],[286,112],[446,112]],
   points:[
    {id:'bellflowerBarnScout',x:328,y:264,label:'Scout the barn and its exits'},
    {id:'bellflowerBarnSummon',x:328,y:232,label:'Summon the earth elementals'},
    {id:'bellflowerBarnAftermath',x:328,y:200,label:'Search the ruins'}
   ]
  };
  MAP_LAYERS[yard]={foreground:intact,contain:true,background:{type:'solid',color:'#22252b'}};
  JOURNEYS[yard]='22 Pharast, 4717. The company follows its investigation to a barn the Bellflower Network uses as a safehouse.';
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[yard]=await loader(intact);})(),
   ...[ruined,elemental].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){return scene===yard?art[quest.bellflowerBarnLeveled?ruined:yard]:null;}
 function roster(){
  if(scene!==yard)return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===hide&&quest.bellflowerBargeComplete)return [point('bellflowerBarnLead')];
  if(scene!==yard)return null;
  if(quest.bellflowerBarnComplete)return [];
  return [point(!quest.bellflowerBarnScouted?'bellflowerBarnScout':
   !quest.bellflowerBarnLeveled?'bellflowerBarnSummon':'bellflowerBarnAftermath')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===yard&&quest.bellflowerBarnComplete?'The safehouse is gone. Most Bellflower agents escaped.':null);}
 function elapsed(){return siege?.epoch===epoch?(performance.now()-siege.at)/1000:Infinity;}
 function npcs(){
  if(scene!==yard)return null;
  const time=elapsed();
  if(time>.85&&time<2.5||reduce.matches&&time<.97){
   const pace=reduce.matches?76:(time-.85)*90;
   return [
    {id:boarder,x:224-pace,y:185-pace*.16,height:34},
    {id:boarder,x:423+pace,y:191-pace*.15,height:34},
    {id:boarder,x:456+pace*.8,y:209-pace*.26,height:34}
   ];
  }
  return [];
 }
 function effects(g,t){
  if(scene!==yard)return;
  const reduced=reduce.matches,time=elapsed(),im=art[elemental];
  if(im&&time<2.55){
   const lift=reduced?0:Math.max(0,1-time/.48)*34;
   const hit=!reduced&&time>.76?Math.sin((time-.76)*16)*Math.max(0,2.5-time)*3:0;
   for(const [x,y,flip] of [[234,177,-1],[424,175,1]]){
    const width=112,height=im.height*width/im.width;
    g.save();
    g.beginPath();
    g.rect(x-100,0,200,y+5);
    g.clip();
    g.globalAlpha=quest.bellflowerBarnLeveled&&!reduced?Math.max(0,Math.min(1,(2.55-time)/.55)):1;
    g.translate(x,y+Math.round(lift+hit));
    g.rotate(flip*hit*.026);
    g.scale(flip,1);
    g.drawImage(im,-width/2,-height,width,height);
    g.restore();
   }
  }
  if(!quest.bellflowerBarnLeveled&&!(time>=.8&&time<2.75))return;
  g.save();
  const density=time<2.75?27:13;
  for(let i=0;i<density;i++){
   const drift=reduced?i*7%59:Math.floor(t*(12+i%4)+i*17)%59;
   const x=129+(i*57)%388+Math.floor(drift/4),y=178-(i%4)*16-drift;
   g.globalAlpha=(1-drift/59)*(time<2.75?.7:.32);
   g.fillStyle=i%3?'#aaa18f':'#776d62';
   g.fillRect(x,y,4+i%5,2+i%4);
  }
  g.restore();
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  switch(id){
   case 'bellflowerBarnLead':
    await say('jason','We’ve followed the rescue back to a barn. They’ve been using it as a safehouse.');
    await say('freya','Then we take away the shelter they’ve been counting on.');
    quest.bellflowerBarnReached=true;
    await travel(yard,328,344);
    break;
   case 'bellflowerBarnScout':
    await say('Chronicle','A wide barn anchors the yard. Narrow lanes run past the outbuildings on either side.');
    await say('jamal','We can bring the barn down from here. Anyone inside still has two ways out.');
    quest.bellflowerBarnScouted=true;
    break;
   case 'bellflowerBarnSummon': {
    await say('Chronicle','The ground heaves as the company summons giant earth elementals.');
    const token=epoch;
    siege={epoch:token,at:performance.now()};
    await delay(reduce.matches?850:1560);
    if(token!==epoch)return false;
    quest.bellflowerBarnLeveled=true;
    save();
    await delay(reduce.matches?120:1010);
    if(token!==epoch)return false;
    siege=null;
    await say('Chronicle','The elementals level the barn and its outbuildings. Bellflower agents flee through the side lanes as the timbers come down.');
    break;
   }
   case 'bellflowerBarnAftermath':
    await say('jamal','Most of them got away. The barn’s gone, though.');
    await say('jason','They won’t use this place again. We’re done here.');
    quest.bellflowerBarnComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,effects,interact};
})();
