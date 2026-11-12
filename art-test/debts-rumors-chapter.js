"use strict";
window.DebtsRumors=(()=>{
 const r=(x,y,w,h)=>({x,y,w,h});
 const churchFront='longacre_church_front',door=[320,125],breachDuration=850;
 let breach=null;
 const maps={rohalendi_hospice:{name:'Longacre · Rohalendi Hospice',image:'rohalendi-hospice.png',spawn:[328,344],walk:[r(272,288,80,96),r(176,128,272,176)],blocks:[],lights:[[120,184],[504,184]],points:[{id:'doctorTalk',x:328,y:168,label:'Speak to Gerya Rohalendi'},{id:'churchRoad',x:328,y:344,label:'Visit the church'}]},longacre_church:{name:'Longacre · Church of Iomedae',image:'longacre-church.png',spawn:[328,344],walk:[r(288,112,64,272),r(176,192,304,48)],blocks:[],lights:[[232,152],[408,152]],points:[{id:'churchInspect',x:328,y:136,label:'Inspect the deserted church'},{id:'churchRepair',x:328,y:344,label:'Arrange repairs and leave'}]},longacre_north_docks:{name:'Longacre · North Docks',image:'longacre-north-docks.png',spawn:[328,344],walk:[r(288,256,64,128),r(128,144,384,112)],blocks:[],lights:[[168,104],[480,104]],points:[{id:'ingoeTalk',x:248,y:168,label:'Speak to Ingoe'},{id:'docksReport',x:328,y:344,label:'Return to Ash House'}]}};
 maps[churchFront]={
  name:'Longacre · Outside the Church of Iomedae',image:'longacre-square.png',spawn:[328,288],
  walk:[r(192,160,256,144)],blocks:[],lights:[],
  points:[{id:'churchForceDoor',x:328,y:168,label:'Try the church doors'}]
 };
 function install(){Object.assign(scenes,maps);for(const [id,s]of Object.entries(maps))MAP_LAYERS[id]={foreground:s.image,background:id==='longacre_north_docks'?{type:'ocean',palette:['#13252b','#25434b','#35545b','#1b343d'],speed:3}:{type:'solid',color:'#121820'}};NAMES.gerya='Gerya Rohalendi';NAMES.ingoe='Ingoe Zoags';scenes.ash_house.points.push({id:'debtsRoad',x:328,y:328,label:'Meet Ingoe at the north docks'});Object.assign(JOURNEYS,{rohalendi_hospice:'After Riley’s interrogation, an intercepted letter points the party toward Gerya Rohalendi’s unpaid taxes. Visit her hospice.',longacre_church_front:'The party brings Riley to the Church of Iomedae to look for the Angel Knight’s helm.',longacre_church:'Beyond the broken doors, the church stands empty. Search for clues about the helm.',longacre_north_docks:'After Bolgart is secured. Razelago introduces a shipmaster who can supply news of travelers and cargo.'});}
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);}
 function earlyVisits(){return quest.chapter4&&quest.rileyQuestioned&&!quest.chapter4Complete;}
 function goal(){if(earlyVisits()&&['rohalendi_hospice',churchFront,'longacre_church'].includes(scene))return scene==='rohalendi_hospice'?(!quest.doctorAlliance?'Speak to Gerya about the intercepted letter.':'Investigate the church with Riley under guard.'):!quest.churchEntered?(scene===churchFront?'Check the church doors.':'Search the deserted church.'):'Arrange repairs, then return to the jail.';if(!quest.chapter4Complete)return null;if(!quest.chapter5)return 'Meet Razelago’s dockside contact.';if(quest.chapter5Complete)return 'Chapter complete · A new source of rumors is secured.';return !quest.doctorAlliance?'Speak to Gerya at the hospice.':!quest.churchEntered?'Investigate the deserted church.':!quest.churchDoorsRepaired?'Arrange repairs to the church doors.':!quest.ingoeAgreement?'Arrange Ingoe’s weekly reports.':'Return to Razelago.';}
 function points(){if((earlyVisits()||quest.chapter5)&&scene===churchFront)return [point('churchForceDoor')];if(earlyVisits()){if(scene==='rohalendi_hospice')return [point(quest.doctorAlliance?'churchRoad':'doctorTalk')];if(scene==='longacre_church')return [point(quest.churchEntered?'churchRepair':'churchInspect')];}if(!quest.chapter4Complete)return null;if(!quest.chapter5)return scene==='ash_house'?[point('debtsRoad')]:null;if(scene==='rohalendi_hospice')return [point(quest.doctorAlliance?'churchRoad':'doctorTalk')];if(scene==='longacre_church')return [point(quest.churchEntered?'churchRepair':'churchInspect')];if(scene==='longacre_north_docks')return [point(quest.ingoeAgreement?'docksReport':'ingoeTalk')];if(scene==='ash_house')return [];return null;}
 function target(){return points()?.[0]||null;}
 function npcs(){
  if(!quest.chapter5&&!earlyVisits())return null;
  if(scene===churchFront)return [
   ...(earlyVisits()?[{id:'riley',x:389,y:222}]:[]),
   {id:'citizen-church-front-0',variant:4,x:201,y:252,dir:'right'},
   {id:'citizen-church-front-1',variant:7,x:434,y:245,dir:'left'}
  ];
  return scene==='rohalendi_hospice'?[{id:'gerya',x:328,y:160},...(earlyVisits()?[{id:'riley',x:392,y:280}]:[])]:scene==='longacre_church'?(earlyVisits()?[{id:'riley',x:392,y:216}]:[]):scene==='longacre_north_docks'?[{id:'ingoe',x:248,y:160}]:null;
 }
 function currentBreach(){return scene===churchFront&&breach&&breach.epoch===epoch?breach:null;}
 function doorPose(unit){
  if(!currentBreach())return unit;
  if(unit.id==='freya')return {...unit,x:311,y:161,dir:'up',step:null};
  if(unit.id==='draymus')return {...unit,x:352,y:177,dir:'up',step:null};
  return unit;
 }
 function drawChurchBreach(g){
  const stage=currentBreach();
  if(!stage)return;
  const progress=reduce.matches?1:Math.min(1,(performance.now()-stage.at)/breachDuration);
  const [x,y]=door;
  g.save();
  if(progress>=.6){
   g.fillStyle='#171011';g.fillRect(x-9,y-16,18,12);
   for(const [dx,dy,angle] of [[-7,3,-.3],[3,6,.4],[9,0,-.5]]){
    g.save();g.translate(x+dx,y+dy);g.rotate(angle);g.fillStyle='#72513a';g.fillRect(-5,0,10,2);g.restore();
   }
  }
  if(!reduce.matches&&progress<1){
   if(progress<.5){
    const travel=progress*2;
    const sx=Math.round(350-30*travel),sy=Math.round(142-30*travel);
    g.fillStyle='#90b463';g.fillRect(sx,sy,5,4);g.fillStyle='#d6df96';g.fillRect(sx+1,sy+1,2,2);
   }else{
    const scatter=(progress-.5)*2;
    g.globalAlpha=1-scatter;
    for(let i=0;i<9;i++){
     g.fillStyle=i%3?'#ab7950':'#afc372';
     g.fillRect(Math.round(x+(i-4)*(2+scatter*4)),Math.round(y-10+(i%3)*4+scatter*9),3,2);
    }
   }
  }
  g.restore();
 }
 async function forceChurchDoor(){
  await say('Chronicle','The doors of Iomedae’s church are locked. The party calls inside and gets no answer. People on the square have started watching.');
  await say('freya','I’ll break the boards. Draymus, put a spell on the latch.');
  const token=epoch;
  breach={epoch:token,at:performance.now()};
  await delay(reduce.matches?0:breachDuration);
  if(token!==epoch)return;
  await say('Chronicle','Polearm blows split the boards. Draymus casts Acid Splash at the latch, and the main doors break open with a crash that carries across the square.');
  await travel('longacre_church',328,344);
  breach=null;
 }
 async function interact(id){if(id==='hospiceRoad'){
  if(!earlyVisits()||quest.churchDoorsRepaired||!['longacre_jail','longacre_cells'].includes(scene))return false;
  await say('Chronicle','Later that day, a letter reaches the party from Razelago. It was written by Doctor Gerya Rohalendi. How it came into his hands is unclear.');
  await window.PresentationPolish?.hospiceLetter();
  await say('freya','If the hospice closes, Longacre loses its doctor. Bring Riley with us. Let’s see what we can offer her.');
  await travel('rohalendi_hospice',328,344);
 }
 else if(id==='debtsRoad'){if(!quest.chapter4Complete||quest.chapter5||scene!=='ash_house')return false;quest.chapter5=true;if(quest.churchDoorsRepaired){await say('razelago','Bolgart is secured. Ingoe Zoags, the shipmaster north of town, can keep you informed about travelers and cargo.');await travel('longacre_north_docks',328,344);}else{await say('Chronicle','Before the hill search, another encounter shaped the party’s position in Longacre. We return briefly to those earlier visits, then rejoin the present at the docks.');await say('razelago','A letter addressed to Gerya Rohalendi concerns unpaid taxes. Her hospice may offer an opportunity to gain an ally.');await travel('rohalendi_hospice',328,344);}}
 else if(!quest.chapter5&&!earlyVisits())return false;
 else if(id==='doctorTalk'){
  await say('gerya','I’m Doctor Rohalendi. Are any of you hurt?');
  await say('freya','A letter meant for your cousin reached us by mistake. We read it before we realized what it was. Is the hospice really that close to shutting its doors?');
  await say('gerya','Close enough that I have to plan for it. Abadar knows I’ve kept the accounts, and there’s only so much I can put off.');
  await say('freya','The hospice matters to this town. We can ask the Archbaron to forgive your unpaid taxes.');
  await say('gerya','If you’ll put that case to him, you’ll have an ally here.');
  quest.doctorAlliance=true;
 }
 else if(id==='churchRoad'&&quest.doctorAlliance)await travel(churchFront,328,288);
 else if(id==='churchForceDoor'&&scene===churchFront&&quest.doctorAlliance)await forceChurchDoor();
 else if(id==='churchInspect'&&scene==='longacre_church'&&!quest.churchEntered){
  await say('Chronicle','The nave is deserted. The party finds healing supplies and books devoted to Iomedae. The search turns up no clues about where the Angel Knight went.');
  if(earlyVisits())await say('riley','I saw the helm on the hill. I never saw where the knight went afterward.');
  await say('freya','Leave everything where it is. We’ve seen enough.');
  quest.churchEntered=true;
 }
 else if(id==='churchRepair'&&scene==='longacre_church'&&quest.churchEntered){await say('freya','We will pay a carpenter to put the doors right. Leave the supplies where they are.');await say('Chronicle','Repairs are arranged to cover the damage. The visit may have been seen by dozens of people; fixing the doors cannot erase those witnesses.');quest.churchDoorsRepaired=true;if(earlyVisits()){await say('Chronicle','The party returns to the jail with Riley. Before dawn, he will guide them to the hill where he claims to have seen the Angel Knight.');await travel('longacre_jail',328,312);}else{await say('Chronicle','Those earlier visits are complete. We return to the present: the hill search has failed, Bolgart is secured, and Razelago offers a new contact.');await travel('longacre_north_docks',328,344);}}
 else if(id==='ingoeTalk'){await say('ingoe','Razelago says you need ears at the docks. Ten gold a week, and I will report rumors and the cargo moving through here.');await say('freya','Agreed. Keep us informed.');await say('Chronicle','The party accepts without bargaining. The agreement is ten gold pieces per week; it secures a source of dockside information.');quest.ingoeAgreement=true;}
 else if(id==='docksReport'){await travel('ash_house',328,296);await say('razelago','Then you have another pair of eyes on Longacre. Keep listening. The town’s resistance has not ended.');quest.chapter5Complete=true;await say('Chapter Five complete','Ingoe will report dockside rumors and cargo movements for ten gold a week. The agreement gives the party another source of information as it continues policing Longacre.');}
 else return false;save();updateObjective();return true;}
 return {install,load,goal,points,target,npcs,interact,doorPose,drawChurchBreach};
})();
