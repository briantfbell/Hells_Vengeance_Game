"use strict";

window.SkadiParley=(()=>{
 const skull='darkrain_skull_slope',yard='frost_giant_yard',hall='frost_giant_hall',skadi='skadi';
 const yardArt='skadi-settlement-v1.png',hallArt='skadi-feast-hall-v1.png',portrait='skadi-frost-giant-v1.png';
 const guests='skadi-feast-guests-v1.png';
 const rounds=[
  {
   claim:'You crossed our land without asking. What right had you to come this far?',
   choices:['[Claim the mountain for Cheliax.]','[Acknowledge the boundary and ask for permission.]','[Deny crossing onto her land.]'],
   answer:1,reply:'We came to ask permission to pass. The boundary remains yours.',
   result:'You understand whose door you’re standing at. Sit and make your case.',
   hint:'Start with the boundary. You’re asking to cross it.'
  },{
   claim:'My people hold this pass by inheritance. Why should an outsider’s orders carry any weight here?',
   choices:['[Respect her people’s claim.]','[Demand a permanent right of passage.]','[Say inheritance counts for nothing.]'],
   answer:0,reply:'Your claim stands. Our orders bind us, and your permission can end when our passage is done.',
   result:'Temporary passage. That much I can consider.',
   hint:'A limited agreement gives her room to grant passage.'
  },{
   claim:'Our old enemies have used that same promise. What do we get if we let you through?',
   choices:['[Threaten to bring the Wight Mother’s army.]','[Promise away the land below.]','[Offer to remove a nuisance on her terms.]'],
   answer:2,reply:'Name something you need done. We’ll agree to that task and leave your lands to you.',
   result:'Then we have terms to discuss.',
   hint:'She’s asking for a concrete exchange her people can accept.'
  }
 ];
 const tally=()=>quest.skadiArguments??0;

 function install(){
  scenes[skull].points.push({id:'skadiCrossFromSkull',x:328,y:152,label:'Cross into Frost Giant territory'});
  scenes[yard]={
   name:'Isger · Frost Giant Settlement',image:yardArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:144,w:416,h:160},{x:208,y:304,w:224,h:32},{x:288,y:336,w:64,h:64}],lights:[[269,95],[370,94],[270,324],[359,324]],
   points:[
    {id:'skadiScout',x:216,y:264,label:'Scout the settlement’s defenses'},
    {id:'skadiCover',x:328,y:288,label:'Have Draymus hide the approach'},
    {id:'skadiParley',speaker:skadi,x:328,y:208,label:'Ask Skadi for a formal meeting'}
   ]
  };
  scenes[hall]={
   name:'Isger · Skadi’s Feast Hall',image:hallArt,spawn:[328,344],blocks:[],
   walk:[{x:112,y:176,w:416,h:144},{x:288,y:320,w:64,h:80}],lights:[[102,119],[58,203],[59,275],[579,203],[579,275]],
   points:[
    {id:'skadiArgument1',speaker:skadi,x:328,y:216,label:'Argue the right of passage'},
    {id:'skadiArgument2',speaker:skadi,x:328,y:216,label:'Answer Skadi on inheritance'},
    {id:'skadiArgument3',speaker:skadi,x:328,y:216,label:'Offer terms to Skadi'},
    {id:'skadiTerms',speaker:skadi,x:328,y:216,label:'Hear what Skadi wants removed'}
   ]
  };
  MAP_LAYERS[yard]={foreground:yardArt,contain:true,background:{type:'solid',color:'#273846'}};
  MAP_LAYERS[hall]={foreground:hallArt,contain:true,background:{type:'solid',color:'#242125'}};
  JOURNEYS[yard]='12 Gozran, 4717. Beyond the skull lies the Frost Giants’ home. Scout its defenses before asking for passage.';
  JOURNEYS[hall]='Skadi grants a formal hearing over food and drink. Freya must make her case under the giants’ roof.';
  NAMES[skadi]='Skadi';
  FUTURE_NPCS[skadi]={source:portrait,frame:{x:218,y:3,w:572,h:1530}};
  DIALOGUE_FACE_CROPS[skadi]={x:363,y:8,w:244,h:244};
  FUTURE_NPCS.skadi_guest_one={source:guests,frame:{x:190,y:0,w:480,h:887}};
  FUTURE_NPCS.skadi_guest_two={source:guests,frame:{x:1103,y:0,w:471,h:887}};
 }
 async function load(loader){
  await Promise.all([
   (async()=>{art[yard]=await loader(yardArt);})(),
   (async()=>{art[hall]=await loader(hallArt);})(),
   ...[portrait,guests].map(async source=>{art[source]=await loader(source);})
  ]);
 }
 function mapImage(){return scene===yard||scene===hall?art[scene]:null;}
 function roster(){
  if(scene===hall||scene===yard&&quest.skadiCovered)return ['freya','jamal','reese'];
  if(scene!==yard)return null;
  return (quest.activeRoster||CORE).filter(id=>id!=='guapo');
 }
 function points(){
  if(scene===skull&&quest.darkrainComplete)return [point('skadiCrossFromSkull')];
  if(scene===yard)return [point(!quest.skadiScouted?'skadiScout':!quest.skadiCovered?'skadiCover':'skadiParley')];
  if(scene!==hall)return null;
  if(quest.skadiComplete)return [];
  return [point(tally()<3?'skadiArgument'+(tally()+1):'skadiTerms')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){return target()?.label||(scene===hall&&quest.skadiComplete?'Skadi grants passage. Find the box below the ridge.':null);}
 function npcs(){
  if(scene===yard)return quest.skadiCovered?[{id:skadi,x:328,y:173,height:85}]:[];
  return scene===hall?[
   {id:skadi,x:328,y:188,height:88},
   {id:'skadi_guest_one',x:200,y:190,height:83},
   {id:'skadi_guest_two',x:456,y:191,height:83}
  ]:null;
 }
 async function argue(){
  const index=tally(),round=rounds[index],answer=await say(skadi,round.claim,round.choices);
  if(answer!==round.answer){
   await say('freya',round.hint+' Let me try again.');
   return;
  }
  await say('freya',round.reply);
  await say(skadi,round.result);
  if(index===1){
   await say('jamal','I think the tankard has won its argument with me.');
   await say('Chronicle','The giants keep pouring. J’Mal is drunk by the time Freya presses her last point, and she is still clear-headed.');
  }
  if(index===2)await storyRoll('Freya · Persuasion',20,0,'Skadi accepts Freya’s terms');
  quest.skadiArguments=index+1;
 }
 async function interact(id){
  if(target()?.id!==id)return false;
  if(id==='skadiArgument'+(tally()+1))await argue();
  else switch(id){
   case 'skadiCrossFromSkull':
    quest.skadiYardReached=true;
    await travel(yard,328,344);
    break;
   case 'skadiScout':
    await say('reese','The approaches are narrow, and the lodges cover each other. We can talk to them from the yard.');
    await say('freya','Then we ask for passage. We don’t need another fight.');
    quest.skadiScouted=true;
    break;
   case 'skadiCover': {
    await say('draymus','If the Wight Mother is watching, I’ll give her something else to watch. Go while the illusion holds.');
    await say('Chronicle','Draymus spins an illusion as Freya, J’Mal and Reese approach the chief.');
    const {x,y,dir}=units[0];
    quest.skadiCovered=true;
    seedParty(x,y,dir);
    break;
   }
   case 'skadiParley':
    await say(skadi,'You’ve reached my home. Turn around and leave.');
    await say('freya','We ask for passage, and for a formal hearing to set the terms.');
    await say(skadi,'Very well. Come inside.');
    quest.skadiFeastReached=true;
    await travel(hall,328,344);
    break;
   case 'skadiTerms':
    await say(skadi,'The north slope leads to Molthune. An ancient remorhaz down there has killed three of mine. Leave the creature alive. It keeps trespassers off the ridge.');
    await say('freya','What do you want us to take away?');
    await say(skadi,'There’s a box near its ground. Remove it. You have your passage, and you may take the old things my people recovered. We have no use for them.');
    quest.skadiComplete=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,interact};
})();
