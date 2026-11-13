"use strict";
window.ChurchArc=(()=>{
 const maps={};let collapseStart=0;const chain=['chapter7','bodiesMissing','churchTrail','churchBreach','entryCleared','hallCleared','resurrectionBroken','sanctuaryCleared','allamarDefeated','ghastDestroyed','altarBroken','assassinKnowledge','mantisTraining','churchConverted','chapter7Complete'];
 const r=(x,y,w,h)=>({x,y,w,h});
 const coffinArt='longacre-empty-coffin-v1.png',trackMarks=[[285,247],[267,231],[244,217],[222,205],[200,193]];
 const breachDuration=780;
 let breachBeat=null;
 function nightEffects(g){
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
  add('execution_square','churchArcRoad',328,352,'Continue: The Missing Dead');add('church_night','missingRemains',328,248,'Hear the deputy’s report');add('church_night','followChurchTracks',200,208,'Follow the tracks');add('church_approach','breachChurch',328,232,'Scout the barred church');add('church_entry','entryFight',328,216,'Clear the entrance');add('church_entry','hallRoad',328,144,'Force the inner double doors');add('church_hall','hallFight',328,216,'Advance through the hallway');add('church_hall','sanctuaryRoad',328,144,'Switch to J’Mal outside');add('church_flank','kantariaWindow',392,176,'Break through the Kantaria window');add('church_sanctuary','interruptRitual',328,200,'Interrupt Allamar’s ritual');add('church_sanctuary','sanctuaryFight',328,216,'Defeat the sanctuary defenders');add('church_sanctuary','allamarFight',328,176,'Face Allamar');add('church_sanctuary','destroyGhast',328,200,'Put Riley’s remains to rest');add('church_sanctuary','altarRoad',328,144,'Examine the consecrated altar');add('church_ruins','breakAltar',328,144,'Break the stone altar');add('church_ruins','assassinBoon',328,160,'Hear the freed assassin’s offer');add('church_ruins','trainingRoad',328,312,'Accept the training');add('mantis_training','mantisLesson',328,248,'Train with the Red Mantis master');add('mantis_training','conversionRoad',328,352,'Return to the church');add('church_asmodeus','dedicateChurch',328,160,'Dedicate the church to Asmodeus');add('church_asmodeus','churchArcComplete',328,312,'Close the chapter');
  Object.assign(NAMES,{church_acolyte:'Church Acolyte',kuribu:'Kuribu',ghast_riley:'Riley · Ghast',mantis_master:'Red Mantis Master',celestial_wolf:'Celestial Wolf',twin1:'Loran Allamar',twin2:'Lacall Allamar'});
  
  Object.assign(STATS,{church_acolyte:{hp:18,ac:12,atk:3,dmg:[1,6,1]},twin1:{hp:26,ac:14,atk:4,dmg:[1,6,2]},twin2:{hp:28,ac:14,atk:4,dmg:[1,6,2]},allamar:{hp:65,ac:15,atk:5,dmg:[1,8,2]},celestial_wolf:{hp:24,ac:13,atk:4,dmg:[1,6,1]}});
  Object.assign(JOURNEYS,{church_night:'The party rests at the jail after the dusk execution. Freya is on watch when a deputy brings disturbing news.',church_approach:'Fresh tracks lead from the empty coffins to the church. It is around three in the morning. Four deputies join the party; dim light shines behind the stained glass.',church_flank:'While the fight continues inside, J’Mal and the deputies look for a window wide enough to get through.',church_entry:'Jason and Freya have breached the stained-glass window. The party enters the vestibule, where four acolytes are rallying.',church_hall:'The double doors give way. The twins and more acolytes defend the passage. J’Mal and the deputies go outside to force a second window.',church_sanctuary:'Pews splinter under the fighting. At the altar, Allamar has begun a resurrection spell over Riley’s recovered body.',church_ruins:'Allamar is dead and her summons have vanished. With Riley’s ghast destroyed, the party turns to the power imprisoned in the altar.',mantis_training:'The party chooses knowledge rather than another death. J’Mal spends twenty-four hours training while his companions stay at the jail.',church_asmodeus:'Razelago obtains Fex’s decree appointing Jason head pastor. The party funds more than four hundred gold pieces in renovations.'});
 }
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);art.churchBroken=await loader('church-ruins-v1.png');art[coffinArt]=await loader(coffinArt);}
 function mapImage(){return scene==='church_ruins'&&quest.altarBroken||scene==='church_asmodeus'&&!quest.churchConverted?art.churchBroken:art[scene];}
 function goal(){if(!quest.chapter6Complete)return null;if(scene==='church_flank')return 'Break through the Kantaria window.';if(!quest.chapter7)return 'Continue: The Missing Dead.';const goals=['Hear the deputy’s report.','Follow the fresh tracks to the church.','Scout the barred church.','Clear the entrance.','Force the doors and clear the hallway.','Interrupt Allamar’s resurrection.','Defeat the sanctuary defenders.','Face Allamar’s final stand.','Destroy Riley’s ghast.','Examine and break the stone altar.','Speak to the freed assassin.','Complete J’Mal’s twenty-four-hour training.','Dedicate the church to Asmodeus.','Close the chapter.','Chapter complete · Jason is the new pastor.'];const i=chain.findIndex(k=>!quest[k]);return i<0?goals.at(-1):goals[Math.max(0,i-1)];}
 function points(){if(!quest.chapter6Complete)return null;if(!quest.chapter7)return scene==='execution_square'?[point('churchArcRoad')]:[];const id=({church_night:quest.bodiesMissing?'followChurchTracks':'missingRemains',church_approach:'breachChurch',church_entry:quest.entryCleared?'hallRoad':'entryFight',church_hall:quest.hallCleared?'sanctuaryRoad':'hallFight',church_flank:'kantariaWindow',church_sanctuary:!quest.resurrectionBroken?'interruptRitual':!quest.sanctuaryCleared?'sanctuaryFight':!quest.allamarDefeated?'allamarFight':!quest.ghastDestroyed?'destroyGhast':'altarRoad',church_ruins:!quest.altarBroken?'breakAltar':!quest.assassinKnowledge?'assassinBoon':'trainingRoad',mantis_training:quest.mantisTraining?'conversionRoad':'mantisLesson',church_asmodeus:quest.churchConverted?'churchArcComplete':'dedicateChurch'})[scene];return quest.chapter7Complete?[]:[point(id)].filter(Boolean);}
 function target(){return points()?.[0]||null;}
 function npcs(){if(!quest.chapter7)return null;if(scene==='church_night')return [{id:'loyal_deputy',x:376,y:248}];if(scene==='church_approach')return approachActors();if(scene==='church_flank')return flankActors();if(scene==='church_entry')return quest.entryCleared?[]:[[282,192],[325,168],[368,192],[410,208]].map(([x,y])=>({id:'church_acolyte',x,y}));if(scene==='church_hall')return quest.hallCleared?[]:[{id:'twin1',x:280,y:152},{id:'twin2',x:376,y:152}];if(scene==='church_sanctuary')return [...(!quest.allamarDefeated?[{id:'allamar',x:328,y:144}]:[]),...(!quest.ghastDestroyed&&quest.resurrectionBroken?[{id:'ghast_riley',x:376,y:200}]:[]),...(quest.sanctuaryCleared?[]:[{id:'kuribu',x:424,y:168}])];if(['church_ruins','mantis_training'].includes(scene))return quest.altarBroken&&!quest.mantisTraining?[{id:'mantis_master',x:376,y:200}]:[];return [];}
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
 function prepare(){seedParty(328,312);paintParty();save();}
 function enemy(id,name){return {id,name:name||NAMES[id],hp:STATS[id].hp,max:STATS[id].hp};}
 function fight(kind,enemies){prepare();if(kind==='church_allamar')units=units.filter(u=>u.id!=='draymus');if(kind==='church_hall')units=units.filter(u=>u.id!=='jamal');startBattle(0,false,{kind,enemies});if(kind==='church_entry')battle.enemies.forEach(e=>e.shaken=2);if(kind==='church_sanctuary'){battle.paralyzed='jamal';if(units.filter(u=>hp[u.id]>0).every(u=>u.id==='jamal')){battle.paralyzed=null;battle.round=2;planEnemyRound();}}paintBattle();log(kind==='church_allamar'?'Draymus withdraws with the controlled ghast. Cimri holds the flank.':kind==='church_sanctuary'?'J’Mal is paralyzed for the opening round. Cimri supports the party.':'Cimri supports the flank · one strike each round.');}
 async function afterBattle(kind){prepare();if(kind==='church_entry'){quest.entryCleared=true;await say('Chronicle','The four acolytes fall. The party secures the vestibule and turns toward the barred double doors.');}if(kind==='church_hall'){quest.hallCleared=true;await say('Chronicle','The defenders give ground. Freya pushes into the sanctuary through splintering pews. Outside, J’Mal and the deputies are still fighting the iron seams of the second window.');await say('draymus','That winged archer is a Kuribu. A lesser angel.');}if(kind==='church_sanctuary'){quest.sanctuaryCleared=true;await say('Chronicle','The remaining acolytes and Lacall fall. The Kuribu’s mission has failed; it leaves the church. J’Mal finally shakes off the paralysis.');await say('Chronicle','Allamar emerges from her study carrying a sword and shield. Her sons are dead, and her attempt to restore Riley has made a monster. She will not yield.');}if(kind==='church_allamar'){quest.allamarDefeated=true;await say('Chronicle','Cimri and J’Mal close from opposite sides. Allamar falls. Her spiritual sword and celestial wolf vanish with her.');}save();paintParty();updateObjective();}
 async function support(){if(!battle?.kind.startsWith('church_'))return;if(battle.kind==='church_hall'){await kuribuVolley();if(!battle)return;}if(battle.kind==='church_sanctuary'&&battle.round===1){await animateAction({id:'kuribu'},{id:'cimri'},'attack',true);log('Kuribu’s arrows pin Cimri. Her flank attack is delayed.');return;}const e=livingEnemy();if(e){await animateAction({id:'cimri'},e,'attack',true,()=>{const value=Math.min(4,e.hp-1);e.hp-=value;flash(e,'−'+value);});log('Cimri attacks from the flank · a supporting cut against '+e.name+'.');}}
 async function enemyPreparation(enemy){if(enemy.id==='allamar'&&battle.round%2===0){await animateAction(enemy,enemy,'channel',true,()=>{enemy.hp=Math.min(enemy.max,enemy.hp+5);flash(enemy,'+5','#ead58d');});log('Allamar channels positive energy · 5 HP restored.');}}
 function effect(g,a){if(a.actor.id==='allamar'&&a.type==='channel'){const v=battlePosition(a.actor),p=CombatArt.phase(a);g.save();g.globalAlpha=Math.sin(p*Math.PI)*.8;g.fillStyle='#f0dfa0';for(let i=0;i<12;i++){const angle=i*Math.PI/6,r=16+p*25;g.fillRect(v.x+Math.cos(angle)*r,v.y-v.height*.5+Math.sin(angle)*r,4,4);}g.restore();return true;}if(a.actor.id!=='allamar'||a.actor.intent?.move!=='Spiritual sword')return false;const p=CombatArt.phase(a),v=battlePosition(a.target),x=v.x,y=v.y-v.height*.55;g.save();g.globalAlpha=Math.sin(p*Math.PI);g.fillStyle='#eee4b0';g.fillRect(x-2,y-29+Math.round(p*20),4,40);g.fillStyle='#c2a260';g.fillRect(x-12,y+4+Math.round(p*20),24,4);g.fillRect(x-2,y+8+Math.round(p*20),4,12);g.restore();return true;}
 function drawSupport(t){if(!battle?.kind.startsWith('church_'))return;if(battle.animation?.actor.id==='kuribu')drawCombatIdle(ctx,{id:'kuribu'},{x:480,y:42,height:38},t);if(battle.kind==='church_entry'&&battle.round<3){ctx.save();ctx.fillStyle='#333648';ctx.globalAlpha=.55;for(const e of battle.enemies){const v=battlePosition(e);for(let i=0;i<6;i++)ctx.fillRect(v.x-26+i*9,v.y-5+Math.round(Math.sin(t+i)*2),12,5);}ctx.restore();}const f=DIALOGUE_FACE_CROPS.cimri;ctx.drawImage(art[LORE_CAST.cimri.src],f.x,f.y,f.w,f.h,12,202,24,24);ctx.fillStyle='#e4c58a';ctx.font='10px monospace';ctx.textAlign='left';ctx.fillText('Cimri · flank',42,216);if(battle.animation?.actor.id==='cimri')drawCombatIdle(ctx,battle.animation.actor,{x:212,y:222,height:56},t);if(battle.kind==='church_sanctuary'&&battle.paralyzed&&battle.round===1){const a=units.find(u=>u.id==='jamal');if(a){const p=battlePosition(a);ctx.strokeStyle='#92b9d9';ctx.lineWidth=2;for(let i=0;i<3;i++)ctx.strokeRect(p.x-16-i*3,p.y-78+i*9,32+i*6,10);}}
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
 else if(id==='hallFight'){await say('Chronicle','Loran and Lacall hold the hallway with two acolytes. A small winged archer appears over their shoulders, fires, and slips away.');fight('church_hall',[enemy('twin1','Loran'),enemy('twin2','Lacall'),enemy('church_acolyte','Hall Acolyte 1'),enemy('church_acolyte','Hall Acolyte 2')]);}
 else if(id==='sanctuaryRoad'&&scene==='church_hall'&&quest.hallCleared){
  await say('Chronicle','Loran moves up to heal an acolyte. Jason’s lucerne hammer brings him down. Freya kills him with her naginata as Lacall looks on.');
  await travel('church_flank',504,248,'left');
 }
 else if(id==='kantariaWindow'&&scene==='church_flank'&&quest.hallCleared)await breachFlank();
 else if(id==='interruptRitual'){await say('Chronicle','J’Mal reaches Allamar through the fighting. Lacall’s heavy mace catches him, but he lands a shallow kukri cut. The distraction breaks her resurrection spell.');await storyRoll('J’Mal · Interrupt the ritual',20,0,'The resurrection is broken');quest.resurrectionBroken=true;await say('Chronicle','Riley’s body writhes with worms. Blue eyes open above a long, twitching tongue. The ghast leaps onto J’Mal, paralyzing him and exposing him to ghoul fever.');await say('draymus','Enough. You answer to me now.');await storyRoll('Draymus · Command Undead',20,0,'Riley submits · Story outcome');await say('Chronicle','Draymus wins the battle of wills. Riley releases J’Mal, who remains rigid. Cimri keeps the defenders from reaching him.');quest.resurrectionBroken=true;hp.jamal=Math.max(1,hp.jamal-6);}
 else if(id==='sanctuaryFight')fight('church_sanctuary',[enemy('twin2','Lacall'),enemy('church_acolyte','Sanctuary Acolyte 1'),enemy('church_acolyte','Sanctuary Acolyte 2')]);
 else if(id==='allamarFight'){await say('allamar','You have taken my sons. You will take nothing more.');await say('Chronicle','A spiritual sword hangs in the air and a celestial wolf answers her call. Her positive energy heals her and burns both Draymus and the ghast; Draymus retreats with Riley under his control.');fight('church_allamar',[enemy('allamar','Allamar'),enemy('celestial_wolf')]);}
 else if(id==='destroyGhast'){await say('Chronicle','Draymus forces Riley’s ghast to submit. Freya destroys it with her naginata, ending the failed resurrection.');quest.ghastDestroyed=true;}
 else if(id==='altarRoad'){await say('Chronicle','Jason and Draymus unravel the church’s consecration. Beneath it they sense a powerful presence trapped in the stone altar.');await travel('church_ruins',328,312);}
 else if(id==='breakAltar'){await say('jason','Asmodeus, guide this blow.');await storyRoll('Jason · Shatter the altar',20,0,'Lucerne hammer · Stone breaks');await say('Chronicle','The altar splits under Jason’s hammer. Stone fragments scatter and dust rolls through the battered sanctuary.');quest.altarBroken=true;collapseStart=window.performance?.now?.()||0;await (typeof delay==='function'?delay(reduce.matches?0:1300):Promise.resolve());collapseStart=0;await say('Chronicle','A shadowy figure appears above the broken altar, finishing a two-sword strike that had been frozen in time. His blades cut empty air.');await say('mantis_master','What is the date? How long was I held here?');}
 else if(id==='assassinBoon'){await say('mantis_master','You freed me. I offer a boon: death, or knowledge. Name someone and I will kill them. Or let one worthy of Achaekek learn from me.');await say('Chronicle','The party considers a death, but those they most wanted dead are already gone. They choose knowledge for J’Mal.');await say('mantis_master','Then attend closely. Some I killed walk again. I must see to them when our lesson is done.');quest.assassinKnowledge=true;}
 else if(id==='trainingRoad')await travel('mantis_training',328,312);
 else if(id==='mantisLesson'){await journeyCard('Longacre · Twenty-four hours','J’Mal trains intensely with the freed assassin. The master disguises himself as a Chelish peasant. At the end he gives J’Mal a sword belt and blades, then limps away to the southwest.');quest.mantisTraining=true;inventory=Inventory.equip(inventory,quest,'jamal','mantis_blades');applyProgression();NextChapter.refresh();await say('jamal','Twenty-four hours. I am going to feel every one of them tomorrow.');await say('Chronicle','The master leaves his sword belt and blades with J’Mal. Disguised as a Chelish peasant, the master limps away toward the southwest.');}
 else if(id==='conversionRoad')await travel('church_asmodeus',328,312);
 else if(id==='dedicateChurch'){await say('razelago','The Archbaron has issued his decree. Jason is head pastor. The church is yours to remake.');await say('jason','Remove the stained glass. Destroy it. We will put this place to its proper use.');await say('Chronicle','The party pays more than four hundred gold pieces toward renovation. Workers replace broken fittings and work a blood-sealed symbol of Asmodeus into the floor beneath the pews.');quest.churchConverted=true;save();await journeyCard('Longacre · The Church Remade','The renovations are complete. Jason takes his place as head pastor beneath the sign of Asmodeus. Cimri becomes sheriff.');}
 else if(id==='churchArcComplete'){quest.chapter7Complete=true;await say('Chapter Seven complete','The missing remains led to Allamar’s last stand. Riley’s ghast is destroyed. J’Mal has trained with the freed assassin, Jason heads the converted church, and Cimri is sheriff.');}
 else return false;save();paintParty();updateObjective();return true;}
 function effects(g,t){nightEffects(g);if(!collapseStart||reduce.matches)return;const p=Math.min(1,(performance.now()-collapseStart)/1300);g.save();g.globalAlpha=(1-p)*.7;for(let i=0;i<28;i++){const x=328+Math.sin(i*2.1)*(12+p*110),y=144+p*65+Math.cos(i*1.7)*p*22;g.fillStyle=i%2?'#a39582':'#6c655f';g.fillRect(Math.round(x),Math.round(y),4+i%4,4+i%3);}g.globalAlpha=(1-p)*.25;g.fillStyle='#c3b295';g.fillRect(210,96,230,180);g.restore();}
 return {soloFlank:()=>scene==='church_flank',install,load,mapImage,effects,effect,enemyPreparation,goal,points,target,npcs,afterBattle,support,drawSupport,interact,chain};
})();
