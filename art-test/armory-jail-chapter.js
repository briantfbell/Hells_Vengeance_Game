"use strict";
window.ArmoryArc=(()=>{
 const maps={},chain=['chapter8','smearHeard','accuserSilenced','bodyDisposed','heistTip','ambushPrepared','armoryCleared','jailReached','porchCleared','cimriRecovered','prisonersQuestioned','chapter8Complete'];
 const r=(x,y,w,h)=>({x,y,w,h});
 const riverEdge={x:328,y:376},releaseDuration=1000;
 let release=null,joiningFight=false,jailBeat=null;
 function install(){
  const defs=[['smear_docks','longacre_north_docks','Longacre · An Accusation'],['accuser_home','ash_house','Longacre · The Accuser’s Home'],['river_disposal','longacre_north_docks','Longacre · The Riverbank'],['heist_church','church_asmodeus','Longacre · A Midnight Warning'],['longacre_armory','longacre_church','Longacre Armory · The Ambush'],['burning_jail','escape_jail','Longacre Jail · Smoke and Steel'],['heist_aftermath','ash_house','Ash House · The Prisoners']];
  for(const[id,base,name]of defs){const s=structuredClone(scenes[base]);s.name=name;s.points=[];s.spawn=[328,312];if(id==='accuser_home'){s.image='accuser-home-v1.png';s.walk=[r(272,112,96,256),r(176,192,288,64)];s.blocks=[];}if(id==='longacre_armory'){s.image='longacre-armory-v1.png';s.spawn=[264,312];s.walk=[r(232,144,80,240),r(192,64,144,40),r(192,96,48,88),r(304,96,32,88)];s.blocks=[r(234,80,58,64)];s.lights=[[232,312],[296,312]];}if(id==='burning_jail'){s.image='longacre-jail-fire-v1.png';s.walk.push(r(400,176,96,32));s.lights=[[430,148],[476,158]];}maps[id]=scenes[id]=s;MAP_LAYERS[id]={foreground:s.image,background:['smear_docks','river_disposal'].includes(id)?{type:'ocean',palette:['#13252b','#25434b','#35545b','#1b343d'],speed:3}:{type:'solid',color:'#111820'}};}
  const add=(map,id,x,y,label)=>scenes[map].points.push({id,x,y,label});
  add('church_asmodeus','armoryArcRoad',328,352,'Continue: Rumors and the Armory');add('smear_docks','smearReport',248,168,'Hear Ingoe’s warning');add('smear_docks','accuserRoad',328,344,'Send J’Mal to the accuser');add('accuser_home','visitAccuser',328,200,'Question the accuser');add('accuser_home','riverRoad',328,344,'Leave under cover');add('river_disposal','disposeBody',riverEdge.x,riverEdge.y,'Lower the body into the river');add('river_disposal','heistChurchRoad',328,280,'Return to the church');add('heist_church','heistWarning',328,200,'Speak to Doctor Rohalendi');add('heist_church','armoryRoad',328,344,'Prepare the armory ambush');add('longacre_armory','prepareAmbush',264,168,'Rig the ballista');add('longacre_armory','takeCover',216,152,'Take cover beside the hall');add('longacre_armory','hearIntruders',216,152,'Wait for the thieves');add('longacre_armory','armoryFight',264,344,'Disarm the tripwire and rush in');add('longacre_armory','jailFireRoad',264,344,'Investigate the smoke');add('burning_jail','porchFight',440,216,'Challenge the men on the porch');add('burning_jail','watchJailDuel',440,184,'Look inside the burning jail');add('burning_jail','rescueCimri',424,232,'Reach Cimri');add('burning_jail','douseJail',488,200,'Help put out the fire');add('burning_jail','aftermathRoad',328,344,'Take Cimri to Ash House');add('heist_aftermath','tendCimri',392,216,'Help Jason tend to Cimri');add('heist_aftermath','questionPrisoners',328,168,'Question the armory prisoners');add('heist_aftermath','armoryArcComplete',328,312,'Make ready for Fort Estazano');
  Object.assign(NAMES,{armory_bo:'Bo Gramel',armory_dent:'Dent Gramel',heist_ranger:'Rebel Ranger',porch_guard:'Armed Man',accuser:'The Accuser'});
  Object.assign(STATS,{armory_bo:{hp:32,ac:14,atk:4,dmg:[1,6,1]},armory_dent:{hp:26,ac:14,atk:4,dmg:[1,6,1]},heist_ranger:{hp:14,ac:12,atk:3,dmg:[1,6,0]},porch_guard:{hp:12,ac:12,atk:2,dmg:[1,4,0]}});
  FUTURE_NPCS.porch_guard=structuredClone(FUTURE_NPCS.masked_human);COMBAT_IDLES.porch_guard={...MOVEMENT_FRAMES['political-cast-v1.png'][3],frames:MOVEMENT_FRAMES['political-cast-v1.png'][3].frames.slice(0,2),cycle:[0,1,0,1]};
  Object.assign(JOURNEYS,{smear_docks:'Cimri is now sheriff. Ingoe has word from the docks and asks to speak in private.',accuser_home:'J’Mal has completed his training. He goes alone to the accuser’s home to deal with the threat to Cimri.',river_disposal:'For two hours, J’Mal takes back lanes and waits for footsteps to pass. He reaches the river with the accuser’s body.',heist_church:'Back at the converted church, Doctor Rohalendi arrives under a black hood. She asks to speak privately with Jason.',longacre_armory:'Almost eleven hours before the expected theft, Freya and Jason leave their plate behind to approach quietly. Inside the museum, J’Mal spots a ballista aimed down the main hall.',burning_jail:'El Guapo rides back into town to find smoke pouring from the jail. Two armed men watch the doorway. He dismounts and approaches on foot.',heist_aftermath:'The jail fire is out. The party brings Cimri and the armory prisoners to Ash House.'});
 }
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);}
 function mapImage(){return quest.chapter8?(scene==='burning_jail'&&quest.cimriRecovered?art.escape_jail:art[scene]):null;}
 function roster(){if(!quest.chapter8)return null;if(['accuser_home','river_disposal'].includes(scene))return ['jamal'];if(scene==='longacre_armory')return quest.armoryIntrudersHeard&&!quest.armoryCleared&&!joiningFight?['jamal']:['freya','jamal','jason','draymus'];if(scene==='burning_jail')return quest.jailDuelSeen||quest.cimriRecovered?['freya','jamal','jason','guapo']:['guapo'];return null;}
 function goal(){if(!quest.chapter7Complete)return null;if(!quest.chapter8)return 'Continue: Rumors and the Armory.';if(scene==='accuser_home'&&quest.accuserSilenced)return 'Carry the body to the river.';if(scene==='river_disposal')return quest.bodyDisposed?'Return to the church.':'Take the body to the end of the pier.';if(scene==='longacre_armory'&&!quest.armoryCleared)return armoryPoint().label+'.';if(scene==='burning_jail')return jailPoint().label+'.';if(scene==='heist_aftermath'&&!quest.chapter8Complete)return aftermathPoint().label+'.';const goals=['Hear Ingoe’s warning.','Visit the accuser with J’Mal.','Finish the river journey.','Hear Doctor Rohalendi’s warning.','Prepare the armory ambush.','Thwart the armory heist.','Investigate the jail fire.','Challenge the porch guards as El Guapo.','Recover Cimri from the burning jail.','Question the prisoners at Ash House.','Close the chapter.','Chapter complete · Fort Estazano is the next lead.'];const i=chain.findIndex(k=>!quest[k]);return i<0?goals.at(-1):goals[Math.max(0,i-1)];}
 function points(){if(!quest.chapter7Complete)return null;if(!quest.chapter8)return scene==='church_asmodeus'?[point('armoryArcRoad')]:[];const id=({smear_docks:quest.smearHeard?'accuserRoad':'smearReport',accuser_home:quest.accuserSilenced?'riverRoad':'visitAccuser',river_disposal:quest.bodyDisposed?'heistChurchRoad':'disposeBody',heist_church:quest.heistTip?'armoryRoad':'heistWarning',longacre_armory:armoryPoint()?.id,burning_jail:jailPoint()?.id,heist_aftermath:aftermathPoint()?.id})[scene];return quest.chapter8Complete?[]:[point(id)].filter(Boolean);}
 function armoryPoint(){
  return point(quest.armoryCleared?'jailFireRoad':quest.armoryIntrudersHeard?'armoryFight':quest.ambushPrepared?'hearIntruders':quest.armoryBallistaRigged?'takeCover':'prepareAmbush');
 }
 function jailPoint(){
  return point(quest.cimriRecovered?'aftermathRoad':quest.rhonaFledJail?'douseJail':quest.jailDuelSeen?'rescueCimri':quest.porchCleared?'watchJailDuel':'porchFight');
 }
 function aftermathPoint(){
  return point(quest.prisonersQuestioned?'armoryArcComplete':quest.cimriTreated?'questionPrisoners':'tendCimri');
 }
 const target=()=>points()?.[0]||null;
 function npcs(){if(!quest.chapter8)return null;if(scene==='smear_docks')return [{id:'ingoe',x:248,y:168}];if(scene==='accuser_home')return [{id:'accuser',x:328,y:200,...(quest.accuserSilenced?{pose:'prone'}:{})}];if(scene==='river_disposal')return riverBody();if(scene==='heist_church')return [{id:'gerya',x:328,y:200},{id:'cimri',x:392,y:216}];if(scene==='longacre_armory')return quest.armoryIntrudersHeard&&!quest.armoryCleared?[{id:'armory_dent',x:264,y:200},{id:'armory_bo',x:296,y:168},{id:'heist_ranger',x:216,y:168}]:[];
  if(scene==='burning_jail')return jailActors();
  if(scene==='heist_aftermath'){
   const actors=[{id:'cimri',x:408,y:216,...(quest.cimriTreated||quest.prisonersQuestioned?{}:{pose:'prone'})}];
   if(!quest.prisonersQuestioned)actors.push({id:'armory_bo',x:312,y:152},{id:'heist_ranger',x:344,y:152});
   return actors;
  }
  return [];
 }
 function jailActors(){
  if(!quest.porchCleared)return [{id:'porch_guard',x:416,y:200},{id:'porch_guard',x:464,y:208}];
  if(quest.cimriRecovered||quest.rhonaFledJail)return [{id:'cimri',x:444,y:220,pose:'prone'}];
  if(quest.jailDuelSeen)return [{id:'rhona',x:444,y:214},{id:'cimri',x:438,y:210,pose:'prone'}];
  const active=jailBeat?.epoch===epoch;
  const sway=active&&!reduce.matches?Math.sin((performance.now()-jailBeat.at)/115)*8:0;
  return [{id:'rhona',x:435+sway,y:176,height:active?46:38},{id:'cimri',x:463-sway,y:183,height:active?46:38}];
 }
 async function watchJailDuel(){
  jailBeat={epoch,at:performance.now()};
  try{
   await say('Chronicle','Inside, a young woman with paired kukri trades blows with an older woman wielding two hand axes. The flames are climbing the walls.');
   await say('guapo','She could have buried that axe. She turned it at the last second. She wants the girl alive.');
  }finally{jailBeat=null;}
  await journeyCard('Longacre Jail · At the same time','Freya, Jason, and J’Mal see smoke rising over the jail. They leave Draymus with the armory prisoners and hurry down the street.');
  quest.jailDuelSeen=true;
  prepare(344,264,'right');
  await say('Chronicle','The older woman knocks her opponent unconscious and carries her toward the door. El Guapo steps aside, pipe in hand.');
 }
 function riverBody(){
  if(quest.bodyDisposed)return [];
  if(release?.epoch===epoch){
   const p=Math.min(1,(performance.now()-release.at)/releaseDuration);
   return [{id:'accuser',x:riverEdge.x-24,y:riverEdge.y-7+p*35,pose:'prone',height:46,opacity:1-p}];
  }
  const jamal=units.find(u=>u.id==='jamal');
  return jamal?[{id:'accuser',x:jamal.x-23,y:jamal.y+4,pose:'prone',height:46}]:[];
 }
 async function releaseBody(){
  if(!reduce.matches){
   const token=epoch;
   release={epoch:token,at:performance.now()};
   try{
    await delay(releaseDuration);
    if(token!==epoch)throw CANCEL;
   }finally{release=null;}
  }
  quest.bodyDisposed=true;
  save();
  await say('Chronicle','J’Mal lowers the body into the river. The current takes it out of sight.');
 }
 function prepare(x=scenes[scene].spawn[0],y=scenes[scene].spawn[1],dir='up'){applyProgression();seedParty(x,y,dir);window.NextChapter?.syncRoster?.();paintParty();save();}
 function enemy(id,name){return {id,name:name||NAMES[id],hp:STATS[id].hp,max:STATS[id].hp};}
 async function afterBattle(kind){
  if(kind==='armory_heist'){
   quest.armoryCleared=true;
   save();
   await say('Chronicle','The rangers and Dent fall. J’Mal forces Bo onto the defensive. Draymus sends Shocking Grasp through his Spectral Hand until Bo falls unconscious.');
   await say('freya','Secure the prisoners. This time we have evidence of their rebellion.');
   prepare();
  }
  if(kind==='armory_porch'){
   quest.porchCleared=true;
   prepare(408,232,'right');
   await say('Chronicle','El Guapo’s rapier brings one attacker down. The other breaks away and flees. El Guapo packs his pipe as steel still rings inside the jail.');
  }
  updateObjective();
 }
 function resolvePorchFlight(current){
  if(current.kind!=='armory_porch')return;
  const survivors=current.enemies.filter(e=>e.hp>0);
  if(survivors.length!==1)return;
  survivors[0].hp=0;
  log('The surviving guard flees the porch.');
 }
 async function interact(id){if(id==='armoryArcRoad'){if(!quest.chapter7Complete||quest.chapter8)return false;quest.chapter8=true;await journeyCard('Longacre · Between assignments','Jason takes charge of the rededicated church, and Cimri settles in at the jail. The party rests before visiting Ingoe at the docks.');hp=Object.fromEntries(CORE.map(id=>[id,STATS[id].hp]));uses=Object.fromEntries(CORE.map(id=>[id,0]));mendUses=2;await travel('smear_docks',328,312);}else if(!quest.chapter8)return false;
  else if(id==='smearReport'&&scene==='smear_docks'&&!quest.smearHeard){
   await say('ingoe','Someone says he can put your new sheriff at Louslik Tannery the night before they announced they were bankrupt. Says he has proof, too.');
   await say('freya','If he can place Cimri there, he can tie her to the missing payroll. That puts all of us at risk.');
   await say('jamal','I’ll pay him a visit. One of us at his door is plenty.');
   quest.smearHeard=true;
  }
  else if(id==='accuserRoad'&&scene==='smear_docks'&&quest.smearHeard)await travel('accuser_home',328,312);
  else if(id==='visitAccuser'&&scene==='accuser_home'&&quest.smearHeard&&!quest.accuserSilenced){
   await say('jamal','I hear you’ve been telling people the sheriff was at the tannery. What are you claiming you saw?');
   await say(null,'[Confront the accuser]', ['[Press him about the tannery]']);
   quest.accuserSilenced=true;
   save();
   await say('Chronicle','The confrontation turns violent. J’Mal accidentally kills the man.');
   await say('jamal','That wasn’t the idea. I’ll have to get him out of here before anyone comes by.');
  }
  else if(id==='riverRoad'&&scene==='accuser_home'&&quest.accuserSilenced)await travel('river_disposal',328,312,'down');
  else if(id==='disposeBody'&&scene==='river_disposal'&&quest.accuserSilenced&&!quest.bodyDisposed)await releaseBody();
  else if(id==='heistChurchRoad'&&scene==='river_disposal'&&quest.bodyDisposed)await travel('heist_church',328,312);
  else if(id==='heistWarning'&&scene==='heist_church'&&quest.bodyDisposed&&!quest.heistTip){
   await say('Chronicle','Doctor Rohalendi keeps her hood up as she draws Jason aside.');
   await say('gerya','Strangers offered me good money to hold something for a few hours. They wanted my silence, too.');
   await say('jason','When would they bring it? Where are they getting it?');
   await say('gerya','After midnight, gone before four. They wouldn’t say where it came from. I thought you should know.');
   await say('cimri','I’d put my money on the rebels and the armory. The veterans donated enough weapons to outfit a raiding party.');
   await say('jason','Then we’ll be inside before they are.');
   quest.heistTip=true;
  }
  else if(id==='armoryRoad'&&scene==='heist_church'&&quest.heistTip)await travel('longacre_armory',264,312);
  else if(id==='prepareAmbush'&&scene==='longacre_armory'&&quest.heistTip&&!quest.armoryBallistaRigged&&!quest.ambushPrepared){
   await say('jamal','It still works. I can run a line from the trigger to the front door.');
   await say(null,'[Rig the ballista]', ['[Tie the tripwire to the front door]']);
   quest.armoryBallistaRigged=true;
  }
  else if(id==='takeCover'&&scene==='longacre_armory'&&quest.armoryBallistaRigged&&!quest.ambushPrepared){
   await say('freya','Jason, take that scale mail. It’ll do. Draymus, leave yourself room to cast.');
   await say('jamal','I’ll watch from the bushes. If I come back through the front, I’ll cut my own wire first.');
   quest.ambushPrepared=true;
  }
  else if(id==='hearIntruders'&&scene==='longacre_armory'&&quest.ambushPrepared&&!quest.armoryIntrudersHeard&&!quest.armoryCleared){
   await journeyCard('Longacre Armory · 12:12 a.m.','The wait stretches past midnight. Then a key turns in the back-door lock.');
   quest.armoryIntrudersHeard=true;
   await say('Chronicle','Armored footsteps stop at the far end of the hall. Someone whispers, “Abort!”');
   await say('armory_bo','No! I want them!');
   await say('Chronicle','“They’ve messed with the ballista. Don’t touch it!” Freya looses an arrow as Dent rounds the corner. He catches it on his shield.');
   await say('Chronicle','Bo steps out behind him, her head back on her shoulders. Her crossbow fires twice. One bolt catches Freya. Outside, J’Mal hears the fight and rushes to the front door.');
   prepare(264,376,'up');
  }
  else if(id==='armoryFight'&&scene==='longacre_armory'&&quest.armoryIntrudersHeard&&!quest.armoryCleared){
   await say('jamal','My own trap. Cut the line first.');
   await say(null,'[Disarm the trap]', ['[Cut the tripwire and rush in]']);
   joiningFight=true;
   try{applyProgression();seedParty(...scenes[scene].spawn);}
   finally{joiningFight=false;}
   hp.freya=Math.max(1,hp.freya-4);
   SPECIAL.draymus={...SPECIAL.draymus,name:'Shocking Grasp',dmg:[1,6,0]};
   startBattle(0,false,{kind:'armory_heist',enemies:[enemy('armory_dent'),enemy('armory_bo'),...Array.from({length:3},(_,i)=>enemy('heist_ranger','Ranger '+(i+1)))]});
   log('The trap is disarmed. Bo focuses on Freya.');
  }
  else if(id==='jailFireRoad'&&scene==='longacre_armory'&&quest.armoryCleared){
   quest.jailReached=true;
   await travel('burning_jail',328,312);
  }
  else if(id==='porchFight'&&scene==='burning_jail'&&quest.jailReached&&!quest.porchCleared){
   await say('porch_guard','Official town business. Move on.');
   await say('guapo','Then why can I hear swordplay inside?');
   prepare(408,232,'right');
   startBattle(0,false,{kind:'armory_porch',enemies:[enemy('porch_guard','Porch Guard 1'),enemy('porch_guard','Porch Guard 2')]});
   battle.enemies[1].hp=battle.enemies[1].max=8;
   log('El Guapo draws his rapier. The guards reach for their swords.');
  }
  else if(id==='watchJailDuel'&&scene==='burning_jail'&&quest.porchCleared&&!quest.jailDuelSeen&&!quest.cimriRecovered)await watchJailDuel();
  else if(id==='rescueCimri'&&scene==='burning_jail'&&quest.jailDuelSeen&&!quest.rhonaFledJail&&!quest.cimriRecovered){
   await say('freya','Rhona! Put Cimri down.');
   quest.rhonaFledJail=true;
   save();
   await say('Chronicle','Rhona drops Cimri and escapes around the building, outpacing pursuit.');
   await say('freya','El Guapo. You picked an interesting moment to turn up again.');
   await say('guapo','Two goats, a stolen wedding cake, and a deeply unreasonable customs officer. I will explain when the jail stops burning.');
   await say('jason','Cimri’s breathing. Get her clear of the door. I need hands on the buckets.');
  }
  else if(id==='douseJail'&&scene==='burning_jail'&&quest.rhonaFledJail&&!quest.cimriRecovered){
   await say(null,'[Help put out the fire]', ['[Pass the buckets down the line]']);
   quest.cimriRecovered=true;
   save();
   await say('Chronicle','The fire dies down. The party can carry Cimri and escort the armory prisoners back to Ash House.');
  }
  else if(id==='aftermathRoad'&&scene==='burning_jail'&&quest.cimriRecovered)await travel('heist_aftermath',328,312);
  else if(id==='tendCimri'&&scene==='heist_aftermath'&&quest.cimriRecovered&&!quest.cimriTreated&&!quest.prisonersQuestioned){
   await say('jason','Set her down here. Hold her shoulder steady while I see to the cuts.');
   await say(null,'[Help Jason treat Cimri]', ['[Steady Cimri while Jason heals her]']);
   quest.cimriTreated=true;
   save();
   await say('cimri','My aunt could have killed me. Next time I’d like to ask her why she didn’t.');
  }
  else if(id==='questionPrisoners'&&scene==='heist_aftermath'&&quest.cimriTreated&&!quest.prisonersQuestioned){
   await say('freya','You broke into the armory after midnight. Where were those weapons going?');
   await say(null,'[Press the prisoners about the weapons]', ['[Ask where the rebels keep their supplies]']);
   await say('Chronicle','Under questioning, the prisoners reveal that the rebellion stores weapons and supplies at Fort Estazano, an old fort outside town.');
   await say('freya','Estazano has stood empty for decades. We’ll send someone to see what’s there.');
   await journeyCard('Longacre · After the questioning','The armory prisoners are executed. The party displays their heads on spikes outside the church.');
   quest.prisonersQuestioned=true;
  }
  else if(id==='armoryArcComplete'&&scene==='heist_aftermath'&&quest.prisonersQuestioned&&!quest.chapter8Complete){
   await say('jamal','If they’ve got stores out there, somebody’s watching them. Let’s see the walls before we go in.');
   quest.chapter8Complete=true;
  }
  else return false;save();paintParty();updateObjective();return true;
 }
 function effect(g,a){
  if(battle?.kind!=='armory_heist')return false;
  const electric=a.actor.id==='draymus'&&a.type==='special',bolt=a.actor.id==='armory_bo'&&a.type==='attack';if(!electric&&!bolt)return false;
  const p=CombatArt.phase(a),v=battlePosition(a.target),from=battlePosition(a.actor),x=v.x,y=v.y-v.height*.55;if(!a.hit||p<.28)return true;
  g.save();g.globalAlpha=reduce.matches?.65:Math.sin(p*Math.PI);
  if(electric){g.fillStyle='#b5dcf2';g.fillRect(x-10,y-6,20,16);for(let i=0;i<4;i++)g.fillRect(x-10+i*6,y-18,4,14);g.strokeStyle='#e0f4ff';g.lineWidth=2;g.beginPath();g.moveTo(x-22,y-18);g.lineTo(x+2,y-7);g.lineTo(x-8,y+5);g.lineTo(x+24,y+18);g.stroke();}
  else{const t=Math.max(0,Math.min(1,(p-.28)/.34)),sx=from.x,sy=from.y-from.height*.55;g.translate(sx+(x-sx)*t,sy+(y-sy)*t);g.rotate(Math.atan2(y-sy,x-sx));g.fillStyle='#d8c39b';g.fillRect(-12,-1,24,2);g.fillStyle='#bac9d5';g.fillRect(10,-2,4,4);}
  g.restore();return true;
 }
 function effects(g,t){
  if(scene==='river_disposal'&&release?.epoch===epoch){
   const p=Math.min(1,(performance.now()-release.at)/releaseDuration);
   if(p>.45){
    const spread=(p-.45)*2;
    g.save();g.globalAlpha=(1-spread)*.6;g.strokeStyle='#a2c4cc';
    g.beginPath();g.ellipse(riverEdge.x,399,4+spread*22,1+spread*5,0,0,Math.PI*2);g.stroke();g.restore();
   }
  }
  if(scene==='longacre_armory'&&!quest.armoryCleared){
   if(quest.armoryBallistaRigged||quest.ambushPrepared){
    g.save();g.strokeStyle='#c4a3738c';g.beginPath();g.moveTo(259,135);g.lineTo(249,354);g.lineTo(264,363);g.stroke();g.restore();
   }
   if(quest.armoryIntrudersHeard){
    const glow=g.createRadialGradient(264,61,4,264,61,80);
    glow.addColorStop(0,'#ffb85c55');glow.addColorStop(1,'#ffb85c00');
    g.fillStyle=glow;g.fillRect(184,0,160,142);
   }
  }
  if(scene!=='burning_jail'||quest.cimriRecovered)return;
  g.save();
  for(const [index,[x,y]] of [[430,139],[473,154],[538,87]].entries()){
   const light=g.createRadialGradient(x,y,3,x,y,31);
   light.addColorStop(0,'#ffa141');light.addColorStop(1,'#ffa14100');
   g.globalAlpha=.27+(reduce.matches?0:.09*Math.sin(t*9+index*4));
   g.fillStyle=light;g.fillRect(x-31,y-31,62,62);
   if(reduce.matches)continue;
   for(let i=0;i<5;i++){
    const p=(t*.38+i*.2+index*.17)%1,dx=x+Math.round(p*32+Math.sin(i*5)*6),dy=y-Math.round(p*96);
    const radius=6+p*16,smoke=g.createRadialGradient(dx,dy,1,dx,dy,radius);
    smoke.addColorStop(0,'#8d8176');smoke.addColorStop(1,'#8d817600');
    g.globalAlpha=.35*Math.sin(p*Math.PI);
    g.fillStyle=smoke;g.fillRect(dx-radius,dy-radius,radius*2,radius*2);
   }
  }
  g.restore();
 }
 return {install,load,mapImage,roster,goal,points,target,npcs,interact,afterBattle,resolvePorchFlight,effect,effects,chain};
})();
