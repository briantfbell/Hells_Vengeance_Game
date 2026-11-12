"use strict";

window.Menador=(()=>{
 const glade='barrow_covenant',pass='menador_pass',image='menador-pass-v2.png';
 const backstoryArt='menador-twins-v1.png';

 function install(){
  scenes[glade].points.push(
   {id:'menadorBrief',speaker:'corrine',x:216,y:232,label:'Hear Corrine’s report'},
   {id:'menadorDepart',x:328,y:344,label:'Travel to Menador'}
  );
  scenes[pass]={
   name:'Menador · Mountain Pass',image,spawn:[328,344],blocks:[],
   walk:[{x:288,y:64,w:64,h:64},{x:256,y:128,w:112,h:32},{x:192,y:160,w:240,h:112},
    {x:240,y:272,w:160,h:48},{x:256,y:320,w:112,h:80}],lights:[],
   points:[{id:'menadorMeeting',x:328,y:144,label:'Continue through the pass'},
    {id:'menadorKeep',x:232,y:200,label:'Look toward Menador Keep'}]
  };
  MAP_LAYERS[pass]={foreground:image,contain:true,background:{type:'solid',color:'#22282e'}};
  JOURNEYS[pass]='3 Gozran, 4717. The company travels to Menador after the Queen’s demand concerning the Silver Ravens.';
 }
 async function load(loader){[art[pass]]=await Promise.all([loader(image),loader(backstoryArt)]);}
 function mapImage(){return scene===pass?art[scene]:null;}
 function roster(){return scene===pass?(quest.activeRoster||CORE).filter(id=>id!=='guapo'):null;}
 function points(){
  if(scene===glade&&quest.covenantComplete)return [point(quest.menadorBriefed?'menadorDepart':'menadorBrief')];
  if(scene!==pass)return null;
  if(quest.menadorComplete)return [];
  const route=[point('menadorMeeting')];
  if(!quest.menadorKeepSeen)route.push(point('menadorKeep'));
  return route;
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===pass&&quest.menadorComplete?'The Meeting of the Twins at Menador.':null);}
 function npcs(){
  if(scene===glade&&quest.covenantComplete)return BarrowCovenant.npcs().concat({id:'corrine',x:216,y:208,height:58});
  return scene===pass?[]:null;
 }
 async function interact(id){
  if(!points()?.some(p=>p?.id===id))return false;
  switch(id){
   case 'menadorBrief':
    await say('corrine','The Glorious Reclamation has taken Westcrown. In Kintargo, the Silver Ravens killed Barzillai Thrune and now control the city.');
    await say('freya','Will they try to break from Cheliax?');
    await say('corrine','We expect it. The Queen demands a letter declaring their action unlawful and calling for those responsible to be turned over to her agents. Prepare to meet the Ravens.');
    quest.menadorBriefed=true;
    break;
   case 'menadorDepart':
    quest.menadorReached=true;
    await travel(pass,328,344);
    break;
   case 'menadorKeep':
    await say('Chronicle','The Silver Ravens brought down Menador Keep. Its collapse closed the gap and cut off land reinforcements to Barzillai Thrune in Kintargo.');
    quest.menadorKeepSeen=true;
    break;
   case 'menadorMeeting':
    await journeyCard('Freya and Boudicca','The Kusanagi twins were four when their mother, Solei, fled to warn her homeland of Noyuda’s coming attack.\nShe took Boudicca and left Freya behind, fearing Noyuda would hunt them down if both daughters vanished.',undefined,backstoryArt);
    await journeyCard('Meeting of the Twins','3 Gozran, 4717. Menador.',()=>{quest.menadorComplete=true;});
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,interact};
})();
