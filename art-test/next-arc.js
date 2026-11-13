'use strict';
window.NextArc=(()=>{
 const r=(x,y,w,h)=>({x,y,w,h});
 const helmArt='longacre-angel-knight-helm-v1.png',dispersalDuration=1100;
 const manorApproach='scarlet_manor_approach',servant='scarlet_servant',sentry='scarlet_sentry';
 const manorActors={
  [servant]:{source:'scarlet-manor-servant-v1.png',frame:{x:0,y:0,w:106,h:272}},
  [sentry]:{source:'scarlet-manor-sentry-v1.png',frame:{x:0,y:0,w:132,h:240}}
 };
 const hellstoneArt='scarlet-manor-hellstone-v1.png',curtainArt='scarlet-manor-curtain-v1.png';
 const hellstone=[328,221],curtainDuration=620;
 let sermonStage=null,deputyApproach=null,compactStage=null;
 const deputies=[
  {id:'deputy1',duty:[376,240],flank:[204,296],charge:[274,304]},
  {id:'deputy2',duty:[520,264],flank:[462,304],charge:[386,312]},
  {id:'deputy3',duty:[408,260],flank:[236,272],charge:[292,280]},
  {id:'deputy4',duty:[480,286],flank:[434,272],charge:[367,284]}
 ];
 const chargeDuration=680;
 const maps={longacre_square:{name:'Chapter Three · Longacre Square',image:'longacre-square.png',spawn:[328,296],walk:[r(80,176,480,160),r(272,320,96,48)],blocks:[],lights:[],points:[{id:'sermon',x:328,y:176,label:'Listen to the sermon'},{id:'noticeDecree',x:128,y:224,label:'Post the decree'},{id:'tavernDecree',x:520,y:280,label:'Post at the Last Stand'},{id:'jailRoad',x:104,y:304,label:'Go to the western gate and jail'},{id:'manorRoad',x:552,y:208,label:'Go to Scarlet Manor'},{id:'ashReturn',x:328,y:352,label:'Return to Ash House'}]},longacre_jail:{name:'Longacre · Western Gate and Jail',image:'longacre-jail.png',spawn:[328,312],walk:[r(160,192,400,144),r(272,320,96,48)],blocks:[],lights:[],points:[{id:'gateDecree',x:200,y:208,label:'Post at the western gate'},{id:'jailDecree',x:456,y:224,label:'Deliver the sheriff’s dismissal'},{id:'jailReport',x:328,y:352,label:'Return to the square'}]},scarlet_manor:{name:'Scarlet Manor · The Hellfire Compact',image:'scarlet-manor.png',spawn:[328,312],walk:[r(176,208,320,128),r(272,320,96,48)],blocks:[],lights:[],points:[{id:'fexAudience',x:328,y:208,label:'Meet Archbaron Fex'},{id:'manorExit',x:328,y:352,label:'Return to Longacre'}]}};
 maps[manorApproach]={
  name:'Scarlet Manor · The Grounds',image:'scarlet-manor-approach-v1.png',spawn:[328,360],
  walk:[r(256,160,128,224),r(288,112,64,64),r(144,160,352,48)],blocks:[],
  lights:[[268,99],[370,100],[80,175],[560,175],[212,221],[426,222]],
  points:[{id:'manorGreeting',x:352,y:328,label:'Speak to the household servant'},{id:'manorOffice',x:328,y:128,label:'Enter Fex’s office'}]
 };
 maps.longacre_square.points.push({id:'tornDecree',x:520,y:264,label:'Inspect the torn decree'});
 function installManor(){
  JOURNEYS[manorApproach]='The party reaches Scarlet Manor. Its gates stand open for the Archbaron’s expected guests.';
  NAMES[servant]='Household Servant';
  NAMES[sentry]='House Fex Sentry';
  Object.assign(window.FUTURE_NPCS,manorActors);
 }
 function install(){installManor();Object.assign(scenes,maps);scenes.ash_house.points.push({id:'longacreRoad',x:328,y:352,label:'Travel to Longacre square'});for(const [id,s] of Object.entries(maps))window.MAP_LAYERS[id]={foreground:s.image,background:{type:'solid',color:'#101817'}};Object.assign(NAMES,{rhona:'Rhona Staelish',allamar:'Sword Knight Tileavia Allamar',twin1:'Loran Allamar',twin2:'Lacall Allamar',razelago_revealed:'Razelago',deputy1:'Former Deputy 1',deputy2:'Former Deputy 2',deputy3:'Former Deputy 3',deputy4:'Former Deputy 4'});for(let i=1;i<=4;i++)STATS['deputy'+i]={hp:18,ac:13,atk:4,dmg:[1,6,1]};}
 async function load(loader){
  const assets=Object.entries(maps).map(([id,s])=>[id,s.image]);
  assets.push(['authority','longacre-authority-cast.png'],['revelations','longacre-revelations.png']);
  for(const source of [helmArt,hellstoneArt,curtainArt,...Object.values(manorActors).map(actor=>actor.source)])assets.push([source,source]);
  await Promise.all(assets.map(async ([id,source])=>{art[id]=await loader(source);}));
 }
 function currentSermon(){return scene==='longacre_square'&&!quest.sermonDispersed&&sermonStage&&sermonStage.epoch===epoch?sermonStage:null;}
 function sermonPose(unit){
  const stage=currentSermon();
  if(!stage)return unit;
  if(unit.id==='rhona')return {...unit,x:419,y:259};
  if(unit.id==='twin2'&&stage.helm)return {...unit,x:363,y:177};
  if(unit.id==='freya'&&stage.speaker==='freya')return {...unit,x:309,y:200,dir:'up'};
  if(unit.id==='jamal'&&stage.speaker==='jamal')return {...unit,x:263,y:258,dir:'left'};
  if(!unit.crowd||stage.dispersingAt===null)return unit;
  const progress=reduce.matches?1:Math.min(1,(performance.now()-stage.dispersingAt)/dispersalDuration);
  const dir=unit.x<320?'left':'right',exitX=dir==='left'?114:526;
  return {...unit,dir,x:unit.x+(exitX-unit.x)*progress,y:unit.y+20*progress,step:progress<1,anim:progress*3,sermonOpacity:Math.min(1,(1-progress)*3)};
 }
 function drawSermonHelm(g){
  if(!currentSermon()?.helm||!art[helmArt])return;
  g.save();
  g.imageSmoothingEnabled=false;
  g.drawImage(art[helmArt],343,142,18,25);
  g.restore();
 }
 function drawTornDecree(g){
  if(scene!=='longacre_square'||!quest.deputiesReported||quest.chapter4)return;
  g.save();g.translate(528,265);
  for(const [x,y,angle] of [[-6,1,.3],[3,-5,-.5],[8,4,.6],[-1,7,-.35]]){
   g.save();g.translate(x,y);g.rotate(angle);
   g.fillStyle='#503625';g.fillRect(0,1,6,3);
   g.fillStyle='#dfc799';g.fillRect(0,0,5,3);
   g.restore();
  }
  g.restore();
 }
 function currentCompact(){return scene==='scarlet_manor'&&compactStage&&compactStage.epoch===epoch?compactStage:null;}
 function curtainOpening(stage){
  if(!stage?.curtain)return 0;
  const elapsed=performance.now()-stage.curtain.start;
  const progress=reduce.matches?1:Math.min(1,elapsed/curtainDuration);
  return stage.curtain.opening?progress:1-progress;
 }
 function compactPose(unit){
  const stage=currentCompact();
  if(!stage?.gathered)return unit;
  const index=stage.roster.indexOf(unit.id);
  if(index<0)return unit;
  if(stage.member===unit.id)return {...unit,x:unit.id==='jason'?328:302,y:unit.id==='jason'?244:224,dir:unit.id==='jason'?'down':'right',step:null};
  const [x,y]=[[271,252],[292,277],[369,277],[390,252],[403,271]][index]||[unit.x,unit.y];
  return {...unit,x,y,dir:'up',step:null};
 }
 function drawCompactOffice(g){
  if(scene!=='scarlet_manor')return;
  const stage=currentCompact(),open=curtainOpening(stage),side=Math.round(30*(1-open));
  const curtain=art[curtainArt];
  if(side&&curtain){
   const half=curtain.width/2;
   g.drawImage(curtain,0,0,half,curtain.height,442,64,side,79);
   g.drawImage(curtain,half,0,half,curtain.height,502-side,64,side,79);
  }
  const image=art[hellstoneArt];
  if(image)g.drawImage(image,hellstone[0]-15,hellstone[1]-32,30,32);
  if(stage?.embersAt==null||reduce.matches)return;
  const age=(performance.now()-stage.embersAt)/700;
  if(age>=1)return;
  g.save();g.globalAlpha=1-age;
  for(let i=0;i<5;i++){
   g.fillStyle=i%2?'#d77a39':'#f5ba66';
   g.fillRect(Math.round(hellstone[0]+(i-2)*(3+age*3)),Math.round(hellstone[1]-24-age*(10+i*2)),2,2);
  }
  g.restore();
 }
 function objective(){if(!quest.chapter3)return false;let goal=battle?'Subdue the four former deputies.':quest.chapter3Complete?'Chapter Three complete · Trouble at the Last Stand.':!quest.sermonDispersed?'Attend the sermon in Longacre square.':!quest.decreesIssued?'Report back to Razelago.':!quest.rhonaDismissed?'Post all four decrees and dismiss Rhona.':!quest.deputiesDefeated?'Leave the jail courtyard.':!quest.deputiesReported?'Report the deputies’ ambush.':'Attend the audience at Scarlet Manor.';$('objective').textContent=battle?goal:window.QuestGuide.current().text;$('status').textContent=battle?'The former lawmen attack with saps. Defeat them and take them into custody.':'WASD / arrows · E to interact · Click to walk · Export save to carry your progress';return true;}
 function npcs(){
  const cimriAtJail=quest.deputiesDefeated&&!quest.compactSworn;
  if(scene==='longacre_square'){
   if(quest.sermonDispersed)return cimriAtJail?[]:[{id:'cimri',x:440,y:264}];
   return [{id:'allamar',x:328,y:152},{id:'twin1',x:280,y:168},{id:'twin2',x:376,y:168},{id:'rhona',x:424,y:248},{id:'cimri',x:456,y:264}];
  }
  if(scene==='longacre_jail')return jailActors();
  if(scene===manorApproach)return [
   {id:servant,x:quest.manorWelcomed?352:360,y:quest.manorWelcomed?142:330,height:43},
   {id:sentry,x:246,y:210,height:51},{id:sentry,x:394,y:210,height:51},
   {id:sentry,x:132,y:58,height:33},{id:sentry,x:508,y:58,height:33}
  ];
  if(scene==='scarlet_manor')return [{id:'fex',x:328,y:176},...(curtainOpening(currentCompact())>.55?[{id:'razelago_revealed',x:472,y:155,height:53}]:[])];
  const actors=window.NextChapter.npcs();
  return cimriAtJail?actors.filter(actor=>actor.id!=='cimri'):actors;
 }
 function jailActors(){
  if(quest.deputiesDefeated)return [{id:'cimri',x:450,y:222}];
  if(!quest.rhonaDismissed)return [{id:'rhona',x:456,y:216},...deputies.map(({id,duty:[x,y]})=>({id,x,y}))];
  if(!deputyApproach||deputyApproach.epoch!==epoch)return [];
  const progress=reduce.matches?1:Math.min(1,(performance.now()-deputyApproach.start)/chargeDuration);
  return deputies.map(({id,flank,charge})=>({id,x:flank[0]+(charge[0]-flank[0])*progress,y:flank[1]+(charge[1]-flank[1])*progress}));
 }
 function drawNPC(u){if(u.id==='fex'){drawQuestgiver('fex',u.x,u.y,62);return true;}const m=window.FUTURE_NPCS?.[u.id];if(!m)return false;const im=art[m.source];if(!im)return false;const f=m.frame,h=u.height||(u.id==='razelago_revealed'?45:55),scale=h/f.h;(window.PresentationPolish?.draw||function(g,im,f,...d){g.drawImage(im,f.x,f.y,f.w,f.h,...d)})(ctx,im,f,u.x-f.w*scale/2,u.y-h,f.w*scale,h);return true;}
 function target(){
  if(scene==='ash_house')return point('razelago');
  if(scene===manorApproach)return point(quest.manorWelcomed?'manorOffice':'manorGreeting');
  if(scene==='scarlet_manor')return point('fexAudience');
  if(scene==='longacre_jail')return point(!quest.gatePosted?'gateDecree':!quest.rhonaDismissed?'jailDecree':'jailReport');
  if(quest.deputiesReported)return point(quest.tavernNoticeTorn||quest.compactSworn?'manorRoad':'tornDecree');
  return point(!quest.sermonDispersed?'sermon':!quest.noticePosted?'noticeDecree':!quest.tavernPosted?'tavernDecree':quest.decreesIssued?'jailRoad':'ashReturn');
 }
 async function begin(){quest.chapter3=true;quest.chapter3Complete=false;await say('razelago','Archbaron Darellus Fex rules Longacre. You have authority to deal with the rebellion here. These red sashes bear his crest and the cross of Cheliax; let the town see whose authority backs your work.');await say('cimri','The church square will be crowded. My aunt will be there too. Sheriff Rhona Staelish. Keep your answers short.');await travel('longacre_square',328,296);save();}
 async function sermon(){
  sermonStage={epoch,helm:false,speaker:null,dispersingAt:null};
  await say('Chronicle','The square is packed. Sheriff Rhona Staelish leaves her deputies at the edge of the crowd and walks straight up to Cimri.');
  await say('rhona','A red sash with Fex’s crest. Last I heard, the tannery was short a payroll box. You wouldn’t know anything about that, would you?');
  await say('cimri','We have business here, Aunt Rhona. Leave it at that.');
  await say('freya','Sheriff, the sword knight is about to speak. We can talk later.');
  await say('allamar','The Glorious Reclamation has shown what courage can win back. Iomedae has sent us her own champion, the Angel Knight, to help Longacre reclaim its honor.');
  sermonStage.helm=true;
  await say('Chronicle','Allamar’s twin sons step forward to display the Angel Knight’s helm. A hush runs through the square.');
  const choice=await say('The crowd stirs','Who should move first?',['[Freya: challenge Allamar openly]','[J’Mal: listen and intervene in the crowd]']);
  quest.sermonApproach=choice===0?'challenge':'whispers';
  for(const speaker of choice===0?['freya','jamal']:['jamal','freya']){
   sermonStage.speaker=speaker;
   if(speaker==='freya')await say('freya','If you’re asking Longacre to follow the Reclamation, say it plainly. Let everyone here hear what you’re asking them to risk.');
   else{
    await say('Townsfolk','Did you see that helm? If there really is an Angel Knight, maybe we should hear him out.');
    await say('jamal','Go ahead and admire it. Just remember whose crest I’m wearing when you repeat what you heard here.');
   }
  }
  sermonStage.speaker=null;
  await say('Chronicle','One conversation dies out, then another. People start looking for a way out of the square.');
  sermonStage.dispersingAt=performance.now();
  const token=epoch;
  await delay(reduce.matches?0:dispersalDuration);
  if(token!==epoch)return;
  quest.sermonDispersed=true;
  sermonStage=null;
  await say('cimri','They’re going home. Let’s tell Razelago what Allamar showed them.');
 }

 async function prepareDecrees(){
  await say('razelago','Good. Allamar has had her audience. Get some rest. Tomorrow you’ll have more to do than break up a sermon.');
  await journeyCard('Ash House · The next morning','The party rests at Ash House after dispersing Allamar’s sermon. By morning, Longacre is back at its usual business.',save);
  await awardSermonMilestone();
  await say('razelago','Fex has given your company carte blanche to deal with the rebellion. What measures will you take?');
  await say('Chronicle','The party decides to restrict gatherings: no more than six people privately or twelve publicly, with exceptions for families and business.');
  await say('freya','Close the western gate. Have the other gates check who’s authorized to pass. Put a curfew in the order, too.');
  await say('Chronicle','The company draws up the new rules. The public copy bears Fex’s name and seal.');
  await say('freya','Four copies. The square, the Last Stand, the western gate, and the jail. Put Rhona’s dismissal on a separate sheet. I’ll hand her that one myself.');
  quest.decreesIssued=true;
 }
 const postings={
  noticeDecree:{flag:'noticePosted',line:'The new notice goes up on the square’s event board. A few passersby stop to read it.'},
  tavernDecree:{flag:'tavernPosted',line:'The party puts up a copy outside the Last Stand before anyone can turn it into an argument.'},
  gateDecree:{flag:'gatePosted',line:'The party posts the gate order beside the western gate. From here on, authorized traffic must use the north or south gate.'}
 };
 async function postDecree(id){
  const {flag,line}=postings[id];
  if(!quest.decreesIssued)await say('Chronicle','Report the sermon to Razelago before delivering tomorrow’s orders.');
  else if(quest[flag])await say('Chronicle','The posted order remains in place.');
  else{
   await say('Chronicle',line);
   if(!Object.values(postings).some(posting=>quest[posting.flag]))await window.PresentationPolish?.decree();
   quest[flag]=true;
  }
 }

 async function deputyAmbush(){
  const {x,y,dir}=units[0];
  await say('Chronicle','At the courtyard exit, two men step out on each side. It’s the deputies who threw down their vests. All four are carrying saps.');
  const token=epoch;
  deputyApproach={epoch:token,start:performance.now()};
  await delay(reduce.matches?0:chargeDuration);
  if(token!==epoch)return;
  await say('freya','They’re coming in together. Take them alive.');
  deputyApproach=null;
  startBattle(0,false,{kind:'deputies',returnPosition:{x,y,dir},opening:'Roll initiative. Subdue the four deputies and take them alive.',enemies:deputies.map(({id},i)=>({id,name:'Deputy '+(i+1),x:248+i*64,y:152,hp:18,max:18}))});
 }
 async function swearCompact(stage){
  await say('fex','Welcome, colleagues. You’ve done well for Longacre. Swear the Hellfire Compact to House Thrune, as I have, and I can name you my official agents.');
  const choice=await say('The Hellfire Compact','A legal oath of service to House Thrune.',['[Swear the Compact]','[Ask what the office requires]']);
  if(choice===1){
   await say(lead,'What does the office require of us?');
   await say('fex','Loyalty, discretion, and results. How you bring Longacre to order is your company’s decision.');
  }
  await say('fex','Recite your oath with a hand on the hellstone. House Thrune binds you by law. Your souls are your own.');
  stage.gathered=true;
  await say('Chronicle','The party gathers around the hellstone. Each palm that touches the black surface comes away burned.');
  for(const member of stage.roster){
   stage.member=member;
   stage.embersAt=performance.now();
   if(member==='jason'){
    await say('Chronicle','Jason lowers his trousers, backs up to the hellstone, and touches it with his bare backside. He keeps his eyes on Fex as he swears.');
    await say('freya','A very intimate part of his people’s customs, my lord. Few outsiders have ever seen it.');
    await say('fex','Remarkable. I accept your oath, Jason.');
   }else{
    await say(member,'I swear my service to House Thrune.');
   }
  }
  stage.member=null;
  quest.compactSworn=true;
  await say('fex','You are agents of House Fex now. Keep wearing the sashes. People should know whose authority you carry.');
 }
 async function moveCurtain(stage,opening){
  stage.curtain={opening,start:performance.now()};
  await delay(reduce.matches?0:curtainDuration);
  return stage.epoch===epoch;
 }
 async function compactAudience(){
  const stage={epoch,roster:units.map(unit=>unit.id),member:null,gathered:false,embersAt:null,curtain:null};
  compactStage=stage;
  try{
   if(!quest.compactSworn)await swearCompact(stage);
   await say('fex','Razelago, there’s no need for theatrics with trusted agents. Show yourself.');
   if(!await moveCurtain(stage,true))return;
   await say('Chronicle','The curtain opens. Wings rise behind a bulbous fly body and a fleshy human torso. A familiar voice comes from between the mandibles.');
   await say('razelago_revealed','An accuser devil, yes. I’ve seen that expression before.');
   await say('jamal','Would you mind drawing the curtain again?');
   await say('razelago_revealed','Typical prejudice. Very well.');
   if(!await moveCurtain(stage,false))return;
   await say('razelago_revealed','Riley Kels is singing again at the Last Stand. He claims he met the Angel Knight. Bolgart is still allowing forbidden gatherings there. Start with the tavern.');
   await say('Chronicle','During the Longacre operations, Reese, a strix archer, joins the company.');
   quest.chapter3Complete=true;
   quest.reeseJoined=true;
   quest.activeRoster=[...(quest.activeRoster||OPENING_ROSTER).filter(id=>id!=='reese'),'reese'];
   seedParty(units[0]?.x||328,units[0]?.y||312);
   NextChapter.syncRoster();
  }finally{
   if(compactStage===stage)compactStage=null;
  }
 }

 async function afterBattle(position){
  quest.deputiesDefeated=true;
  if(position)seedParty(position.x,position.y,position.dir);
  window.NextChapter.syncRoster();
  updateObjective();
  save();
  await say('Chronicle','All four deputies are alive. The party takes their saps, marches them back inside, and locks them in the jail.');
  await say('cimri','I’ll watch the cells. Go tell Razelago what happened before someone else gives him their version.');
 }
 async function interact(id){if(id==='chapterThree'){await begin();return true;}if(!quest.chapter3)return false;
 if(id==='razelago'){
  if(!quest.sermonDispersed)await say('razelago','The sermon is this afternoon. Listen—and make sure the crowd hears the crown’s answer.');
  else if(!quest.decreesIssued)await prepareDecrees();
  else if(quest.deputiesDefeated&&!quest.deputiesReported){
   await say('freya','All four copies are up. Rhona stepped down. Four deputies tried to stop us on the way out. They’re locked up, and Cimri is watching the jail.');
   await say('razelago','Your pay is on the table. The Archbaron wants to see you at Scarlet Manor first thing in the morning. Rest while you can.');
   quest.deputiesReported=true;
  }else await say('razelago','Finish the postings. Then bring me your report.');
  save();updateObjective();return true;
 }
 if(id==='sermon'){
  if(quest.sermonDispersed)await say('Chronicle','The crowd has gone. The church doors are watched from within.');
  else await sermon();
 }
 else if(Object.hasOwn(postings,id))await postDecree(id);
 else if(id==='jailRoad')await travel('longacre_jail',328,312);
 else if(id==='jailDecree'){if(!quest.decreesIssued)await say('rhona','If you have official business, bring official orders.');else if(!quest.noticePosted||!quest.tavernPosted||!quest.gatePosted)await say('Chronicle','Post the other copies first. The sheriff’s dismissal will end the day’s easy work.');else if(!quest.rhonaDismissed){await say('Chronicle','A fourth copy of the party’s gathering and gate notices is posted at the jail. A separate order removes Rhona from office.');quest.jailPosted=true;await say('rhona','Removed. By a separate decree. I see.');await say('Chronicle','Rhona leaves her longsword and vest, takes her own crossbow, and walks out without a word to Cimri. Four deputies throw down their vests and follow. Other deputies remain to staff the jail with new guards.');quest.jailPosted=true;quest.rhonaDismissed=true;save();}else await say('Chronicle','Rhona’s badge and vest lie on the desk. The dismissal is delivered.');}
 else if(id==='jailReport'){if(quest.rhonaDismissed&&!quest.deputiesDefeated)await deputyAmbush();else await travel('longacre_square',136,296);}
 else if(id==='longacreRoad')await travel('longacre_square',328,296);else if(id==='ashReturn')await travel('ash_house',328,296);
 else if(id==='tornDecree'&&scene==='longacre_square'&&quest.deputiesReported&&!quest.tavernNoticeTorn){
  await say('Chronicle','The decree at the event board still stands. Outside the Last Stand, the party finds the other copy torn to shreds beneath the tavern beams.');
  await say('freya','Leave the scraps where they fell. We have an appointment at Scarlet Manor. We’ll answer this afterward.');
  quest.tavernNoticeTorn=true;
 }
 else if(id==='manorRoad'&&scene==='longacre_square'&&quest.deputiesReported&&(quest.tavernNoticeTorn||quest.compactSworn))await travel(manorApproach,328,360);
 else if(id==='manorGreeting'&&scene===manorApproach&&!quest.manorWelcomed){
  await say(servant,'Captain Freya. His Lordship is expecting you. Follow the main walk to the blackwood stairs. I’ll meet you at the door.');
  await say('Chronicle','The halfling servant passes between two armed guards. More crossbows watch the courtyard from the roof.');
  quest.manorWelcomed=true;
 }
 else if(id==='manorOffice'&&scene===manorApproach&&quest.manorWelcomed){
  await say(servant,'Archbaron Fex will receive you now.');
  await travel('scarlet_manor',328,312);
 }
 else if(id==='fexAudience'&&scene==='scarlet_manor'&&!quest.chapter3Complete)await compactAudience();
 else if(id==='manorExit')await travel('longacre_square',520,232);
 else return false;save();updateObjective();return true;}
 return {install,load,objective,npcs,drawNPC,target,interact,afterBattle,sermonPose,drawSermonHelm,drawTornDecree,compactPose,drawCompactOffice};
})();
