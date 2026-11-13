"use strict";
window.ChurchArc=(()=>{
 const maps={};let collapseStart=null,assassinStrike=null;const chain=['chapter7','bodiesMissing','churchTrail','churchBreach','entryCleared','hallCleared','resurrectionBroken','sanctuaryCleared','allamarDefeated','ghastDestroyed','altarBroken','assassinKnowledge','mantisTraining','churchConverted','chapter7Complete'];
 const r=(x,y,w,h)=>({x,y,w,h});
 const coffinArt='longacre-empty-coffin-v1.png',trackMarks=[[285,247],[267,231],[244,217],[222,205],[200,193]];
 const breachDuration=780;
 let breachBeat=null,ritualBeat=null,dedicationEpoch=null;
 function nightEffects(g){
  if(scene==='mantis_training'&&!quest.mantisTraining)drawTrainingPost(g);
  if(scene==='church_asmodeus'&&dedicationEpoch===epoch)drawDedication(g);
  const phase=currentRitual();
  if(['altar','command','channel'].includes(phase)){
   const x=phase==='altar'?325:phase==='channel'?371:410,y=phase==='altar'?135:162;
   const phaseOffset=reduce.matches?0:performance.now()/190;
   g.save();
   g.globalAlpha=.7;
   g.fillStyle=phase==='command'?'#a68cce':'#ead8a3';
   for(let i=0;i<8;i++){
    const angle=i*Math.PI/4+phaseOffset;
    g.fillRect(Math.round(x+Math.cos(angle)*19),Math.round(y+Math.sin(angle)*9),3,2);
   }
   g.restore();
  }
  if(scene==='church_night'){
   const coffin=art[coffinArt];
   if(coffin)for(const x of [290,342])g.drawImage(coffin,x,212,43,30);
   if(quest.bodiesMissing){
    g.fillStyle='#393332';
    for(const [i,[x,y]] of trackMarks.entries()){g.fillRect(x+(i%2)*4,y,4,3);g.fillRect(x-3,y+5,3,2);}
   }
  }
  if(!['church_approach','church_entry','church_flank'].includes(scene)||!breachBeat||breachBeat.epoch!==epoch||reduce.matches)return;
  const progress=Math.min(1,(performance.now()-breachBeat.start)/breachDuration);
  if(progress>=1)return;
  g.save();
  if(breachBeat.kind==='daggers'){
   for(let i=0;i<2;i++){
    const flight=Math.max(0,Math.min(1,progress*1.55-i*.42));
    if(flight>0&&flight<1){g.fillStyle='#ddd6bd';g.fillRect(Math.round(296+34*flight),Math.round(194-35*flight),8,2);}
   }
  }else if(breachBeat.kind==='glass'){
   g.globalAlpha=1-progress;
   const windowX=scene==='church_flank'?389:365;
   for(let i=0;i<14;i++){
    g.fillStyle=['#cabd7c','#99734e','#778fb5'][i%3];
    g.fillRect(Math.round(windowX+(i-7)*progress*6),Math.round(130+(i%4)*6+progress*42),3,4);
   }
  }else if(breachBeat.kind==='grease'||breachBeat.kind==='fire'){
   for(let i=0;i<14;i++){
    const x=Math.round(270+i*9),y=Math.round(194+Math.sin(i*2)*11);
    g.fillStyle=i%2?'#4d4450':'#655767';g.fillRect(x,y,10,4);
    if(breachBeat.kind==='fire'&&progress>i*.025){
     g.fillStyle=i%2?'#d77832':'#f4bf64';
     g.fillRect(x+3,y-4-Math.round(Math.sin(i+progress*12)*3),4,9);
    }
   }
  }else if(breachBeat.kind==='innerDoors'){
   g.globalAlpha=1-progress;
   for(let i=0;i<12;i++){
    g.fillStyle=i%2?'#a17b4f':'#684a36';
    g.fillRect(Math.round(320+(i-6)*(2+progress*5)),Math.round(133+(i%4)*7+progress*26),4,3);
   }
  }
  g.restore();
 }
 function drawTrainingPost(g){
  g.save();g.translate(408,226);
  g.fillStyle='#231915';g.fillRect(-5,-27,10,40);g.fillRect(-15,11,30,4);
  g.fillStyle='#805c3d';g.fillRect(-3,-25,5,36);g.fillRect(-13,-15,26,6);
  g.fillStyle='#b0976e';g.fillRect(-5,-19,10,10);
  const beat=breachBeat;
  if(beat?.kind==='pairedStrike'&&beat.epoch===epoch&&!reduce.matches){
   const progress=(performance.now()-beat.start)/breachDuration;
   const swing=progress<.5?progress*2:(progress-.5)*2;
   if(progress<1){
    g.strokeStyle='#ead9ad';g.globalAlpha=Math.sin(swing*Math.PI);g.lineWidth=2;g.beginPath();
    const side=progress<.5?-1:1;
    g.moveTo(side*16,-25+swing*11);g.lineTo(-side*4,-15+swing*12);g.stroke();
   }
  }
  g.restore();
 }
 async function playBreach(kind){
  const token=epoch;
  breachBeat={kind,epoch:token,start:performance.now()};
  await delay(reduce.matches?0:breachDuration);
  if(token!==epoch)throw CANCEL;
  breachBeat=null;
 }
 function install(){
  const defs=[['church_night','escape_jail','Longacre Jail · The Missing Dead'],['church_approach','church_watch','Church of Iomedae · Before Dawn'],['church_flank','church_watch','Church of Iomedae · The Kantaria Window'],['church_entry','longacre_church','Church of Iomedae · Entry Vestibule'],['church_hall','longacre_church','Church of Iomedae · The Hallway'],['church_sanctuary','longacre_church','Church of Iomedae · The Sanctuary'],['church_ruins','longacre_church','Church of Iomedae · The Broken Altar'],['mantis_training','escape_jail','Longacre Jail · Twenty-four Hours'],['church_asmodeus','longacre_church','Longacre · The New Pastor']];
  for(const[id,base,name]of defs){const s=structuredClone(scenes[base]);s.name=name;s.points=[];s.spawn=[328,312];if(id.startsWith('church_')&&!['church_night','church_approach','church_flank'].includes(id)){s.walk=[r(288,112,64,272),r(176,192,288,48),r(256,112,128,64)];s.blocks=[];s.lights=[[248,120],[392,120],[248,264],[392,264]];}if(id==='church_entry'){s.image='church-entry-v2.png';s.walk.push(r(112,192,96,80));}if(id==='church_hall')s.image='church-hall-v2.png';if(id==='church_asmodeus')s.image='church-asmodeus-v2.png';maps[id]=scenes[id]=s;MAP_LAYERS[id]={foreground:s.image,background:{type:'solid',color:'#0c1018'}};}
  const add=(map,id,x,y,label)=>scenes[map].points.push({id,x,y,label});
  add('execution_square','churchArcRoad',328,352,'Continue: The Missing Dead');add('church_night','missingRemains',328,248,'Hear the deputy’s report');add('church_night','followChurchTracks',200,208,'Follow the tracks');add('church_approach','breachChurch',328,232,'Scout the barred church');add('church_entry','entryFight',328,216,'Clear the entrance');add('church_entry','hallRoad',328,144,'Force the inner double doors');add('church_hall','hallFight',328,216,'Advance through the hallway');add('church_hall','sanctuaryRoad',328,144,'Switch to J’Mal outside');add('church_flank','kantariaWindow',392,176,'Break through the Kantaria window');add('church_sanctuary','interruptRitual',328,200,'Interrupt Allamar’s ritual');add('church_sanctuary','sanctuaryFight',328,216,'Defeat the sanctuary defenders');add('church_sanctuary','allamarFight',328,176,'Face Allamar');add('church_sanctuary','destroyGhast',328,200,'Put Riley’s remains to rest');add('church_sanctuary','altarRoad',328,144,'Examine the consecrated altar');add('church_ruins','breakAltar',328,144,'Break the stone altar');add('church_ruins','assassinBoon',328,160,'Hear the freed assassin’s offer');add('church_ruins','trainingRoad',328,312,'Accept the training');add('mantis_training','mantisLesson',328,248,'Begin the Red Mantis lesson');add('mantis_training','mantisDrill',408,240,'Practice the paired strike');add('mantis_training','mantisFinish',328,248,'Finish the lesson');add('mantis_training','conversionRoad',328,352,'Return to the church');add('church_asmodeus','dedicateChurch',328,232,'Hear Fex’s decree');add('church_asmodeus','rededicateChurch',328,200,'Begin Jason’s rededication');add('church_asmodeus','churchArcComplete',328,312,'Speak to Cimri');
  Object.assign(NAMES,{church_acolyte:'Church Acolyte',kuribu:'Kuribu',ghast_riley:'Riley · Ghast',mantis_master:'Red Mantis Master',celestial_wolf:'Celestial Wolf',twin1:'Loran Allamar',twin2:'Lacall Allamar'});
  
  Object.assign(STATS,{church_acolyte:{hp:18,ac:12,atk:3,dmg:[1,6,1]},twin1:{hp:26,ac:14,atk:4,dmg:[1,6,2]},twin2:{hp:28,ac:14,atk:4,dmg:[1,6,2]},allamar:{hp:65,ac:15,atk:5,dmg:[1,8,2]},celestial_wolf:{hp:24,ac:13,atk:4,dmg:[1,6,1]}});
  Object.assign(JOURNEYS,{church_night:'The party rests at the jail after the dusk execution. Freya is on watch when a deputy brings disturbing news.',church_approach:'Fresh tracks lead from the empty coffins to the church. It is around three in the morning. Four deputies join the party; dim light shines behind the stained glass.',church_flank:'While the fight continues inside, J’Mal and the deputies look for a window wide enough to get through.',church_entry:'Jason and Freya have breached the stained-glass window. The party enters the vestibule, where four acolytes are rallying.',church_hall:'The double doors give way. The twins and more acolytes defend the passage. J’Mal and the deputies go outside to force a second window.',church_sanctuary:'Pews splinter under the fighting. At the altar, Allamar has begun a resurrection spell over Riley’s recovered body.',church_ruins:'Allamar is dead and her summons have vanished. With Riley’s ghast destroyed, the party turns to the power imprisoned in the altar.',mantis_training:'The party chooses knowledge rather than another death. J’Mal spends twenty-four hours training while his companions stay at the jail.',church_asmodeus:'The fight is over, but the sanctuary is still in ruins. Razelago is waiting there with word from the Archbaron.'});
 }
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);art.churchBroken=await loader('church-ruins-v1.png');art[coffinArt]=await loader(coffinArt);}
 function mapImage(){return scene==='church_ruins'&&quest.altarBroken||scene==='church_asmodeus'&&!quest.churchConverted?art.churchBroken:art[scene];}
 function goal(){if(!quest.chapter6Complete)return null;if(scene==='church_entry')return quest.entryCleared?'Force the inner double doors.':'Clear the entrance.';if(scene==='church_hall')return quest.hallCleared?'Switch to J’Mal outside.':'Clear the hallway.';if(scene==='church_flank')return 'Break through the Kantaria window.';if(scene==='mantis_training'&&!quest.mantisTraining)return quest.mantisDrillDone?'Return to the master.':quest.mantisLessonStarted?'Practice the paired strike.':'Begin the Red Mantis lesson.';if(scene==='mantis_training'&&quest.mantisTraining)return 'Return to the church.';if(scene==='church_asmodeus'&&quest.chapter7&&!quest.chapter7Complete)return quest.churchConverted?'Speak to Cimri.':quest.churchRenovationPaid?'Begin Jason’s rededication.':'Hear Fex’s decree.';if(!quest.chapter7)return 'Continue: The Missing Dead.';const goals=['Hear the deputy’s report.','Follow the fresh tracks to the church.','Scout the barred church.','Clear the entrance.','Force the doors and clear the hallway.','Interrupt Allamar’s resurrection.','Defeat the sanctuary defenders.','Face Allamar’s final stand.','Destroy Riley’s ghast.','Examine and break the stone altar.','Speak to the freed assassin.','Complete J’Mal’s twenty-four-hour training.','Dedicate the church to Asmodeus.','Close the chapter.','Chapter complete · Jason is the new pastor.'];const i=chain.findIndex(k=>!quest[k]);return i<0?goals.at(-1):goals[Math.max(0,i-1)];}
 function points(){if(!quest.chapter6Complete)return null;if(!quest.chapter7)return scene==='execution_square'?[point('churchArcRoad')]:[];const id=({church_night:quest.bodiesMissing?'followChurchTracks':'missingRemains',church_approach:'breachChurch',church_entry:quest.entryCleared?'hallRoad':'entryFight',church_hall:quest.hallCleared?'sanctuaryRoad':'hallFight',church_flank:'kantariaWindow',church_sanctuary:!quest.resurrectionBroken?'interruptRitual':!quest.sanctuaryCleared?'sanctuaryFight':!quest.allamarDefeated?'allamarFight':!quest.ghastDestroyed?'destroyGhast':'altarRoad',church_ruins:!quest.altarBroken?'breakAltar':!quest.assassinKnowledge?'assassinBoon':'trainingRoad',mantis_training:quest.mantisTraining?'conversionRoad':quest.mantisDrillDone?'mantisFinish':quest.mantisLessonStarted?'mantisDrill':'mantisLesson',church_asmodeus:quest.churchConverted?'churchArcComplete':quest.churchRenovationPaid?'rededicateChurch':'dedicateChurch'})[scene];return quest.chapter7Complete?[]:[point(id)].filter(Boolean);}
 function target(){return points()?.[0]||null;}
 function npcs(){if(!quest.chapter7)return null;if(scene==='church_night')return [{id:'loyal_deputy',x:376,y:248}];if(scene==='church_approach')return approachActors();if(scene==='church_flank')return flankActors();if(scene==='church_entry')return quest.entryCleared?[]:[[282,192],[325,168],[368,192],[410,208]].map(([x,y])=>({id:'church_acolyte',x,y}));if(scene==='church_hall')return quest.hallCleared?[]:[{id:'twin1',x:280,y:152},{id:'twin2',x:376,y:152}];if(scene==='church_sanctuary')return sanctuaryActors();if(scene==='church_asmodeus'){if(quest.chapter8)return [];if(quest.churchConverted)return [{id:'cimri',x:352,y:312}];return quest.churchRenovationPaid?[]:[{id:'razelago',x:352,y:232,height:42}];}if(['church_ruins','mantis_training'].includes(scene))return quest.altarBroken&&!quest.mantisTraining?assassinActors():[];return [];}
 function approachActors(){
  const deputies=[{id:'loyal_deputy',x:218,y:284},{id:'loyal_deputy',x:254,y:280},{id:'loyal_deputy',x:395,y:280},{id:'loyal_deputy',x:431,y:284}];
  if(breachBeat?.kind==='daggers'&&breachBeat.epoch===epoch){
   const progress=reduce.matches?1:Math.min(1,(performance.now()-breachBeat.start)/breachDuration);
   if(progress<1)deputies.push({id:'church_acolyte',x:328,y:171-20*progress});
  }
  return deputies;
 }
 function flankActors(){
  return [[332,225],[354,244],[423,244],[446,227]].map(([x,y])=>({id:'loyal_deputy',x,y,height:48}));
 }
 async function breachFlank(){
  await say('jamal','Iomedae at Kantaria. This one’s wide enough. Help me break the ironwork.');
  await say('Chronicle','The glass cracks under their blows, but the iron holds. J’Mal and the deputies lean into the frame together.');
  await playBreach('glass');
  await say('Chronicle','The iron bends. J’Mal and the deputies scramble through, just in time to see Allamar reading from a scroll over Riley’s body.');
  await travel('church_sanctuary',440,216,'left');
 }
 async function kuribuVolley(){
  const target=units.find(unit=>unit.id==='freya'&&hp.freya>1);
  if(!target)return;
  let damage=0;
  await animateAction({id:'kuribu'},target,'attack',true,()=>{
   damage=Math.min(3,hp.freya-1);
   hp.freya-=damage;
   flash(target,'−'+damage);
  });
  log('A winged archer fires from cover · Freya loses '+damage+' HP.');
 }
 async function breachChurch(){
  await say('freya','Four deputies with us. Jason, Draymus, prepare your spells. J’Mal, see if we can get in through the doors.');
  await say('Chronicle','Jason and Draymus cast their protective spells. A sentry spots J’Mal as he closes on the main doors.');
  await playBreach('daggers');
  await say('Chronicle','J’Mal’s daggers strike the sentry in the chest. He stumbles inside and raises the alarm. The doors are barred from within.');
  await say('jamal','We’ll have to use a window.');
  await say('Chronicle','Jason charges the stained glass of the Battle of Three Sorrows. The panels crack, but the iron seams hold.');
  await say('Chronicle','Through the broken glass, an acolyte casts Daze. Jason falters in the frame.');
  await say('freya','Brace yourself, Jason. I’m pushing.');
  await storyRoll('Freya · Break through the stained glass',20,0,'The window gives way');
  await playBreach('glass');
  await say('Chronicle','Freya drives Jason through. The frame gives way and the party follows them into the vestibule.');
  quest.churchBreach=true;
  quest.churchLoadout=true;
  inventory=Inventory.equip(inventory,quest,'freya','naginata');
  inventory=Inventory.equip(inventory,quest,'jason','lucerne');
  inventory=Inventory.equip(inventory,quest,'jamal','kukri');
  applyProgression();
  await travel('church_entry',136,232,'right');
 }
 function currentRitual(){return scene==='church_sanctuary'&&ritualBeat&&ritualBeat.epoch===epoch?ritualBeat.phase:null;}
 function sanctuaryActors(){
  const stage=currentRitual(),risen=quest.resurrectionBroken||stage==='ghast'||stage==='command';
  const actors=[];
  if(!quest.allamarDefeated&&(!risen||quest.sanctuaryCleared))actors.push({id:'allamar',x:stage==='channel'?328:quest.sanctuaryCleared?408:328,y:quest.sanctuaryCleared?164:144});
  if(!quest.ghastDestroyed)actors.push(risen?{id:'ghast_riley',x:stage==='ghast'?376:stage==='retreat'?450:410,y:stage==='retreat'?249:191,height:53}:{id:'riley',x:325,y:145,pose:'prone',height:41});
  if(stage==='channel'||stage==='retreat')actors.push({id:'celestial_wolf',x:377,y:192,height:45});
  if(!quest.sanctuaryCleared)actors.push({id:'twin2',x:368,y:168},{id:'kuribu',x:424,y:168});
  return actors;
 }
 function ritualPose(unit){
  if(scene==='mantis_training'&&unit.id==='jamal'&&breachBeat?.kind==='pairedStrike'&&breachBeat.epoch===epoch){
   const progress=reduce.matches?1:Math.min(1,(performance.now()-breachBeat.start)/breachDuration);
   return {...unit,x:384+Math.round(progress*42),y:242+Math.round(Math.sin(progress*Math.PI)*12),dir:progress<.5?'right':'left',step:progress<1,anim:progress*.8};
  }
  if(scene==='church_asmodeus'&&dedicationEpoch===epoch&&unit.id==='jason')return {...unit,x:328,y:200,dir:'down',step:null};
  const stage=currentRitual();
  if(!stage)return unit;
  if(unit.id==='jamal')return {...unit,x:stage==='altar'?344:370,y:stage==='altar'?176:207,dir:'up',step:null};
  if(unit.id==='draymus'&&['command','channel','retreat'].includes(stage))return {...unit,x:stage==='retreat'?474:401,y:stage==='retreat'?252:222,dir:'up',step:null};
  return unit;
 }
 async function interruptRitual(){
  ritualBeat={phase:'altar',epoch};
  try{
   await say('Chronicle','Allamar reads from a scroll over Riley’s body. Bands of light pull the wound closed. J’Mal rushes the altar.');
   await say('Chronicle','Lacall catches him with a heavy mace. J’Mal keeps moving and cuts Allamar with his kukri, breaking her concentration.');
   await storyRoll('J’Mal · Interrupt the ritual',20,0,'The resurrection is broken');
   ritualBeat.phase='ghast';
   await say('Chronicle','The bands of light twist into worms. Blue eyes open, and Riley rises as a ghast. Allamar recoils and flees to her study.');
   await say('Chronicle','Riley lunges at J’Mal. His touch leaves J’Mal rigid and exposes him to ghoul fever.');
   ritualBeat.phase='command';
   await say('draymus','Enough. You answer to me now.');
   await storyRoll('Draymus · Command Undead',20,0,'Riley submits · Story outcome');
   await say('Chronicle','Riley lets go. J’Mal still cannot move. Cimri steps between him and the defenders.');
   hp.jamal=Math.max(1,hp.jamal-6);
   quest.resurrectionBroken=true;
  }finally{ritualBeat=null;}
 }
 async function faceAllamar(){
  ritualBeat={phase:'channel',epoch};
  try{
   await say('allamar','You killed my sons and defiled this sanctuary. Now answer to Iomedae.');
   await say('Chronicle','Allamar raises her shield. A celestial wolf takes its place at her side, and a spiritual sword hangs above the aisle.');
   await say('Chronicle','She channels positive energy. The light closes her wounds and burns both Draymus and the ghast.');
   ritualBeat.phase='retreat';
   await say('draymus','I can keep Riley under control or stand in that light. I’m taking him out of reach.');
  }finally{ritualBeat=null;}
  fight('church_allamar',[enemy('allamar','Allamar'),enemy('celestial_wolf')]);
 }
 async function destroyGhast(){
  await say('draymus','Hold still, Riley. One last command.');
  await say('Chronicle','The ghast strains against Draymus’s command. Freya brings down her naginata, and the body goes still.');
  quest.ghastDestroyed=true;
 }
 const collapseDuration=1000,strikeDuration=640;
 function assassinActors(){
  if(scene==='mantis_training')return [{id:'mantis_master',x:328,y:224}];
  if(scene!=='church_ruins'||!collapseStart||collapseStart.epoch!==epoch){
   const progress=strikeProgress();
   return [{id:'mantis_master',x:Math.round(326+50*progress),y:Math.round(148+52*progress)}];
  }
  return [];
 }
 function strikeProgress(){
  if(!assassinStrike||assassinStrike.epoch!==epoch||reduce.matches)return 1;
  return Math.min(1,(performance.now()-assassinStrike.at)/strikeDuration);
 }
 function drawAssassinStrike(g){
  if(scene!=='church_ruins'||!assassinStrike||assassinStrike.epoch!==epoch||reduce.matches)return;
  const p=strikeProgress();
  if(p>=1)return;
  g.save();
  g.globalAlpha=(1-p)*.85;
  g.strokeStyle='#dec5a0';
  g.lineWidth=2;
  for(const offset of [-9,9]){
   g.beginPath();
   g.moveTo(318+50*p+offset,117+52*p);
   g.lineTo(340+50*p+offset,139+52*p);
   g.stroke();
  }
  g.restore();
 }
 async function breakAltar(){
  await say('draymus','The consecration is gone. Whatever’s trapped here is still inside the stone.');
  await say('jason','Asmodeus, guide this blow.');
  await storyRoll('Jason · Shatter the altar',20,0,'Lucerne hammer · Stone breaks');
  const token=epoch;
  collapseStart={at:performance.now(),epoch:token};
  quest.altarBroken=true;
  try{
   await delay(reduce.matches?0:collapseDuration);
   if(token!==epoch)throw CANCEL;
   collapseStart=null;
   assassinStrike={at:performance.now(),epoch:token};
   await delay(reduce.matches?0:strikeDuration);
   if(token!==epoch)throw CANCEL;
   await say('Chronicle','A figure springs from the broken altar, finishing a two-sword strike that had been frozen in time. Both blades cut empty air.');
   await say('mantis_master','What is the date? How long was I held here?');
  }finally{
   collapseStart=null;
   assassinStrike=null;
  }
 }
 async function chooseBoon(){
  await say('mantis_master','You freed me. Name someone and I will kill them, or send me someone worthy to learn the teachings of Achaekek.');
  await say('freya','The names I’d give you are already lying on the floor. J’Mal, what do you say?');
  await say('jamal','Teach me.');
  await say('mantis_master','Then attend closely. Some I killed walk again. When we’re done, I must see to them.');
  quest.assassinKnowledge=true;
 }
 async function finishTraining(){
  await journeyCard('Longacre · Red Mantis Training','J’Mal spends twenty-four hours training with the master. They drill footwork, timing, and the paired blades until his arms shake.');
  await say('mantis_master','Take my sword belt and blades. Keep practicing. I have business to the southwest.');
  await say('Chronicle','The master changes his appearance to that of a Chelish peasant, then limps down the road.');
  quest.mantisTraining=true;
  inventory=Inventory.equip(inventory,quest,'jamal','mantis_blades');
  applyProgression();
  NextChapter.refresh();
  seedParty(328,248);
  NextChapter.syncRoster?.();
 }
 function prepare(){seedParty(328,312);paintParty();save();}
 function enemy(id,name,shortName){return {id,name:name||NAMES[id],shortName,hp:STATS[id].hp,max:STATS[id].hp};}
 function dismissSummons(fight){
  if(fight.kind!=='church_allamar'||!fight.enemies.some(enemy=>enemy.id==='allamar'&&enemy.hp<=0))return;
  const wolf=fight.enemies.find(enemy=>enemy.id==='celestial_wolf'&&enemy.hp>0);
  if(wolf){wolf.hp=0;log('Allamar falls. Her celestial wolf vanishes.');}
 }
 function fight(kind,enemies){prepare();if(kind==='church_allamar')units=units.filter(u=>u.id!=='draymus');if(kind==='church_hall')units=units.filter(u=>u.id!=='jamal');startBattle(0,false,{kind,enemies});if(kind==='church_entry')battle.enemies.forEach(e=>e.shaken=2);if(kind==='church_sanctuary'){battle.paralyzed='jamal';if(units.filter(u=>hp[u.id]>0).every(u=>u.id==='jamal')){battle.paralyzed=null;battle.round=2;planEnemyRound();}}paintBattle();log(kind==='church_allamar'?'Draymus withdraws with the controlled ghast. Cimri holds the flank.':kind==='church_sanctuary'?'J’Mal is paralyzed for the opening round. Cimri supports the party.':'Cimri supports the flank · one strike each round.');}
 async function afterBattle(kind){prepare();if(kind==='church_entry'){quest.entryCleared=true;await say('Chronicle','The four acolytes fall. The party secures the vestibule and turns toward the barred double doors.');}if(kind==='church_hall'){quest.hallCleared=true;await say('Chronicle','The defenders give ground. Freya pushes into the sanctuary through splintering pews. Outside, J’Mal and the deputies are still fighting the iron seams of the second window.');await say('draymus','That winged archer is a Kuribu. A lesser angel.');}if(kind==='church_sanctuary'){quest.sanctuaryCleared=true;await say('Chronicle','The remaining acolytes and Lacall fall. The Kuribu’s mission has failed; it leaves the church. J’Mal finally shakes off the paralysis.');await say('Chronicle','Allamar emerges from her study carrying a sword and shield. Her sons are dead, and her attempt to restore Riley has made a monster. She will not yield.');}if(kind==='church_allamar'){quest.allamarDefeated=true;await say('Chronicle','Cimri and J’Mal close from opposite sides. Allamar falls. Her spiritual sword and celestial wolf vanish with her.');}save();paintParty();updateObjective();}
 async function support(){if(!battle?.kind.startsWith('church_'))return;if(battle.kind==='church_hall'){await kuribuVolley();if(!battle)return;}if(battle.kind==='church_sanctuary'&&battle.round===1){await animateAction({id:'kuribu'},{id:'cimri'},'attack',true);log('Kuribu’s arrows pin Cimri. Her flank attack is delayed.');return;}const e=livingEnemy();if(e){await animateAction({id:'cimri'},e,'attack',true,()=>{const value=Math.min(4,e.hp-1);e.hp-=value;flash(e,'−'+value);});log('Cimri attacks from the flank · a supporting cut against '+e.name+'.');}}
 async function enemyPreparation(enemy){if(enemy.id==='allamar'&&battle.round%2===0){await animateAction(enemy,enemy,'channel',true,()=>{enemy.hp=Math.min(enemy.max,enemy.hp+5);flash(enemy,'+5','#ead58d');});log('Allamar channels positive energy · 5 HP restored.');}}
 function effect(g,a){if(a.actor.id==='allamar'&&a.type==='channel'){const v=battlePosition(a.actor),p=CombatArt.phase(a);g.save();g.globalAlpha=Math.sin(p*Math.PI)*.8;g.fillStyle='#f0dfa0';for(let i=0;i<12;i++){const angle=i*Math.PI/6,r=16+p*25;g.fillRect(v.x+Math.cos(angle)*r,v.y-v.height*.5+Math.sin(angle)*r,4,4);}g.restore();return true;}if(a.actor.id!=='allamar'||a.actor.intent?.move!=='Spiritual sword')return false;const p=CombatArt.phase(a),v=battlePosition(a.target),x=v.x,y=v.y-v.height*.55;g.save();g.globalAlpha=Math.sin(p*Math.PI);g.fillStyle='#eee4b0';g.fillRect(x-2,y-29+Math.round(p*20),4,40);g.fillStyle='#c2a260';g.fillRect(x-12,y+4+Math.round(p*20),24,4);g.fillRect(x-2,y+8+Math.round(p*20),4,12);g.restore();return true;}
 function drawSupport(t){if(!battle?.kind.startsWith('church_'))return;if(battle.animation?.actor.id==='kuribu')drawCombatIdle(ctx,{id:'kuribu'},{x:480,y:42,height:38},t);if(battle.kind==='church_entry'&&battle.round<3){ctx.save();ctx.fillStyle='#333648';ctx.globalAlpha=.55;for(const e of battle.enemies){const v=battlePosition(e);for(let i=0;i<6;i++)ctx.fillRect(v.x-26+i*9,v.y-5+Math.round(Math.sin(t+i)*2),12,5);}ctx.restore();}const f=DIALOGUE_FACE_CROPS.cimri;ctx.drawImage(art[LORE_CAST.cimri.src],f.x,f.y,f.w,f.h,12,202,24,24);ctx.fillStyle='#e4c58a';ctx.font='10px monospace';ctx.textAlign='left';ctx.fillText('Cimri · flank',42,216);if(battle.animation?.actor.id==='cimri')drawCombatIdle(ctx,battle.animation.actor,{x:212,y:222,height:56},t);if(battle.kind==='church_sanctuary'&&battle.paralyzed&&battle.round===1){const a=units.find(u=>u.id==='jamal');if(a){const p=battlePosition(a);ctx.strokeStyle='#92b9d9';ctx.lineWidth=2;for(let i=0;i<3;i++)ctx.strokeRect(p.x-16-i*3,p.y-78+i*9,32+i*6,10);}}
 }
 function drawDedication(g){
  const tick=reduce.matches?0:performance.now()/170;
  g.save();
  g.fillStyle='#df5342';
  for(let i=0;i<15;i++){
   const angle=i*Math.PI*2/15;
   const radius=10+(i*13+tick*5)%32;
   g.globalAlpha=.3+(1-radius/42)*.6;
   g.fillRect(Math.round(328+Math.cos(angle)*radius),Math.round(223+Math.sin(angle)*radius*.45),2+i%2,2);
  }
  g.restore();
 }
 async function rededicate(){
  dedicationEpoch=epoch;
  try{
   await say('Chronicle','Jason seals the blood into a great symbol of Asmodeus on the sanctuary floor. The red lines sink into the stone.');
   await say('jason','We will put this place to its proper use.');
  }finally{dedicationEpoch=null;}
  quest.churchConverted=true;
  save();
  await say('Chronicle','The last of the blood is cleaned away. New glass goes in and the pews return, covering the outer edges of Jason’s mark.');
 }
 async function interact(id){if(id==='churchArcRoad'){if(!quest.chapter6Complete||quest.chapter7)return false;quest.chapter7=true;NextChapter.refresh();await travel('church_night',328,312);}else if(!quest.chapter7)return false;
 else if(id==='missingRemains'&&scene==='church_night'&&!quest.bodiesMissing){
  await say('loyal_deputy','Captain, someone tampered with the guillotine. The heads are gone, and both coffins are empty.');
  await say('freya','Wake the others. I want to see where those tracks go.');
  quest.bodiesMissing=true;
 }
 else if(id==='followChurchTracks'&&scene==='church_night'&&quest.bodiesMissing){
  await say('freya','These are the only fresh prints from the coffins. They lead toward Iomedae’s church.');
  quest.churchTrail=true;
  await travel('church_approach',328,312);
 }
 else if(id==='breachChurch'&&scene==='church_approach'&&quest.churchTrail&&!quest.churchBreach)await breachChurch();
 else if(id==='entryFight'&&scene==='church_entry'&&quest.churchBreach&&!quest.entryCleared){
  await say('Chronicle','The wounded sentry tears out J’Mal’s daggers and calls on Iomedae to heal himself and his fellow acolytes.');
  await say('draymus','Stay off the center tiles. I’m casting Grease.');
  await playBreach('grease');
  await say('jason','Now, the Fire of Asmodeus.');
  await playBreach('fire');
  await say('cimri','They’re slipping. J’Mal, take the other side.');
  fight('church_entry',Array.from({length:4},(_,i)=>({...enemy('church_acolyte','Acolyte '+(i+1)),shaken:2})));
 }
 else if(id==='hallRoad'&&scene==='church_entry'&&quest.entryCleared){
  await say('draymus','The consecration is burning through me. Freya, hold still. I can still cast Enlarge Person.');
  await say('Chronicle','Freya grows to twice her height. She and Jason strike the barred double doors until they splinter.');
  await playBreach('innerDoors');
  await say('jamal','No room to get past you two. I’ll take the deputies outside and find another window.');
  await travel('church_hall',328,312);
 }
 else if(id==='hallFight'){await say('Chronicle','Loran and Lacall hold the hallway with two acolytes. A small winged archer appears over their shoulders, fires, and slips away.');fight('church_hall',[enemy('twin1','Loran'),enemy('twin2','Lacall'),enemy('church_acolyte','Hall Acolyte 1','Acolyte 1'),enemy('church_acolyte','Hall Acolyte 2','Acolyte 2')]);}
 else if(id==='sanctuaryRoad'&&scene==='church_hall'&&quest.hallCleared){
  await say('Chronicle','Loran moves up to heal an acolyte. Jason’s lucerne hammer brings him down. Freya kills him with her naginata as Lacall looks on.');
  await travel('church_flank',504,248,'left');
 }
 else if(id==='kantariaWindow'&&scene==='church_flank'&&quest.hallCleared)await breachFlank();
 else if(id==='interruptRitual'&&scene==='church_sanctuary'&&quest.hallCleared&&!quest.resurrectionBroken)await interruptRitual();
 else if(id==='sanctuaryFight'&&scene==='church_sanctuary'&&quest.resurrectionBroken&&!quest.sanctuaryCleared)fight('church_sanctuary',[enemy('twin2','Lacall'),enemy('church_acolyte','Sanctuary Acolyte 1','Acolyte 1'),enemy('church_acolyte','Sanctuary Acolyte 2','Acolyte 2')]);
 else if(id==='allamarFight'&&scene==='church_sanctuary'&&quest.sanctuaryCleared&&!quest.allamarDefeated)await faceAllamar();
 else if(id==='destroyGhast'&&scene==='church_sanctuary'&&quest.allamarDefeated&&!quest.ghastDestroyed)await destroyGhast();
 else if(id==='altarRoad'&&scene==='church_sanctuary'&&quest.ghastDestroyed){await say('Chronicle','Jason and Draymus unravel the church’s consecration. Beneath it they sense a powerful presence trapped in the stone altar.');await travel('church_ruins',328,312);}
 else if(id==='breakAltar'&&scene==='church_ruins'&&quest.ghastDestroyed&&!quest.altarBroken)await breakAltar();
 else if(id==='assassinBoon'&&scene==='church_ruins'&&quest.altarBroken&&!quest.assassinKnowledge)await chooseBoon();
 else if(id==='trainingRoad'&&scene==='church_ruins'&&quest.assassinKnowledge)await travel('mantis_training',328,312);
 else if(id==='mantisLesson'&&scene==='mantis_training'&&quest.assassinKnowledge&&!quest.mantisTraining&&!quest.mantisLessonStarted){
  await say('mantis_master','First, your feet. Let one blade draw the eye. Step across his line before you bring the other through.');
  await say('jamal','One to draw the guard, one to get past it. I’ll try it on the post.');
  quest.mantisLessonStarted=true;
 }
 else if(id==='mantisDrill'&&scene==='mantis_training'&&quest.mantisLessonStarted&&!quest.mantisDrillDone){
  await say('Chronicle','J’Mal steps around the practice post and follows his first cut with the second.');
  await playBreach('pairedStrike');
  await say('mantis_master','Again. Keep your feet moving when the first blade lands.');
  quest.mantisDrillDone=true;
 }
 else if(id==='mantisFinish'&&scene==='mantis_training'&&quest.mantisDrillDone&&!quest.mantisTraining)await finishTraining();
 else if(id==='conversionRoad'&&scene==='mantis_training'&&quest.mantisTraining)await travel('church_asmodeus',328,312);
 else if(id==='dedicateChurch'&&scene==='church_asmodeus'&&quest.mantisTraining&&!quest.churchRenovationPaid&&!quest.churchConverted){
  await say('razelago','By decree of Archbaron Fex, Jason is the new head pastor of Longacre. This church is to be devoted to Asmodeus.');
  await say('jason','Take down the Iomedaean glass and break it. We’ll pay for the new windows. Leave the sanctuary floor to me.');
  await say('Chronicle','The party puts up more than four hundred gold pieces for new glass and repairs. The sanctuary still lies in ruins.');
  quest.churchRenovationPaid=true;
 }
 else if(id==='rededicateChurch'&&scene==='church_asmodeus'&&quest.churchRenovationPaid&&!quest.churchConverted)await rededicate();
 else if(id==='churchArcComplete'&&scene==='church_asmodeus'&&quest.churchConverted&&!quest.chapter7Complete){
  await say('cimri','The Archbaron’s made me sheriff. I’m taking my aunt’s post. I wonder how long it’ll take her to hear.');
  await say('freya','Get the jail in order. We’ll see what word comes back from the docks.');
  quest.chapter7Complete=true;
 }
 else return false;save();paintParty();updateObjective();return true;}
 function effects(g,t){nightEffects(g);if(scene!=='church_ruins'||!collapseStart||collapseStart.epoch!==epoch||reduce.matches)return;const p=Math.min(1,(performance.now()-collapseStart.at)/collapseDuration);g.save();g.globalAlpha=(1-p)*.7;for(let i=0;i<28;i++){const x=328+Math.sin(i*2.1)*(12+p*110),y=144+p*65+Math.cos(i*1.7)*p*22;g.fillStyle=i%2?'#a39582':'#6c655f';g.fillRect(Math.round(x),Math.round(y),4+i%4,4+i%3);}g.globalAlpha=(1-p)*.25;g.fillStyle='#c3b295';g.fillRect(210,96,230,180);g.restore();}
 return {ritualPose,soloFlank:()=>scene==='church_flank'||(scene==='mantis_training'&&!quest.mantisTraining),install,load,mapImage,effects,effect,enemyPreparation,goal,points,target,npcs,afterBattle,support,drawSupport,drawAssassinStrike,dismissSummons,interact,chain};
})();
