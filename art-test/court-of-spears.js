"use strict";
window.CourtArc=(()=>{
 const maps={},chain=['chapter10','courtBriefed','lowerCleared','rhonaDefeated','upperReached','lenciaDefeated','lenciaEscaped','courtSecured','courtReported','chapter10Complete'];
 const defenders=[{id:'court_ranger',x:216,y:196},{id:'court_ranger',x:328,y:176},{id:'court_ranger',x:440,y:196}];
 const rhonaGuard=[{id:'court_ranger',x:280,y:176},{id:'court_rhona',x:328,y:128},{id:'court_ranger',x:376,y:176}];
 const upperGuard=[{id:'lencia',x:328,y:168},{id:'court_ranger',x:248,y:184},{id:'court_ranger',x:408,y:184}];
 const eastRail={x:552,y:192},escapeDuration=1240;
 let escapeBeat=null;
 const party=['freya','jamal','jason','draymus','guapo','reese'],r=(x,y,w,h)=>({x,y,w,h});
 function install(){
  for(const[id,name,image]of [['court_approach','Court of Spears · Forest Approach','whisperwood-trail-v1.png'],['court_lower','Court of Spears · Lower Platforms','court-platforms-v1.png'],['court_upper','Court of Spears · Upper Court','court-upper-v1.png'],['court_report','Scarlet Manor · Longacre Debrief','scarlet-manor.png']]){
   const s=structuredClone(scenes[id==='court_report'?'scarlet_manor':'whisperwood_trail']);s.name=name;s.points=[];s.spawn=[328,344];s.image=id==='court_report'?scenes.scarlet_manor.image:image;s.blocks=[];s.lights=[];
   if(id==='court_lower')s.walk=[r(288,144,80,240),r(112,176,416,96),r(288,64,80,128)];
   if(id==='court_upper')s.walk=[r(288,112,80,272),r(176,128,288,160),r(448,176,128,64)];
   maps[id]=scenes[id]=s;MAP_LAYERS[id]=id==='court_report'?structuredClone(MAP_LAYERS.scarlet_manor):{foreground:s.image,background:{type:'solid',color:'#17251e'}};
  }
  const add=(map,id,x,y,label)=>scenes[map].points.push({id,x,y,label});
  add('fort_patrol','courtArcRoad',328,344,'Continue: Court of Spears');add('court_approach','courtBriefing',328,216,'Regroup below the canopy');add('court_approach','courtClimb',328,120,'Climb to the lower platforms');
  add('court_lower','courtSurveyCrossing',328,248,'Scout the lower crossing');add('court_lower','courtLowerFight',328,216,'Break through the defenders');add('court_lower','courtRhonaFight',328,168,'Confront Rhona');add('court_lower','checkUpperBridge',328,120,'Check the upper bridge');add('court_lower','courtUpperRoad',328,72,'Cross to the upper court');
  add('court_upper','courtLenciaFight',328,216,'Face the Angel of Longacre');add('court_upper','courtEscape',528,200,'Follow Lencia to the platform edge');add('court_upper','secureCourt',328,152,'Secure the Court of Spears');add('court_upper','courtReportRoad',328,344,'Report to Archbaron Fex');
  add('court_report','courtDebrief',328,200,'Deliver the Longacre report');add('court_report','courtArcComplete',328,344,'Begin the furlough');
  Object.assign(NAMES,{court_rhona:'Rhona Staelish',lencia:'Lencia Visserene',court_ranger:'Rebel Defender'});
  Object.assign(STATS,{court_rhona:{hp:46,ac:14,atk:5,dmg:[1,6,2]},lencia:{hp:70,ac:16,atk:6,dmg:[1,8,2]},court_ranger:{hp:22,ac:13,atk:4,dmg:[1,6,1]}});
  FUTURE_NPCS.court_ranger=FUTURE_NPCS.heist_ranger;COMBAT_IDLES.court_ranger=COMBAT_IDLES.heist_ranger;
  Object.assign(JOURNEYS,{court_approach:'The patrol has named the hidden settlement. The party rides back into the Whisperwood to assault the Court of Spears, an old druidic tree-town used as the rebels’ base.',court_lower:'The stairs rise to a broad deck across the canopy. Three defenders hold the route to the next bridge.',court_upper:'Beyond the bridge, the upper deck opens into a broad court. The surviving defenders are making their stand here.',court_report:'The party returns to Scarlet Manor. Fex is waiting to hear what happened at the Court of Spears.'});
 }
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);}
 function mapImage(){return quest.chapter10?art[scene]:null;}
 function roster(){return quest.chapter10?party:null;}
 function goal(){if(!quest.chapter9Complete)return null;if(!quest.chapter10)return 'Continue the operation at the Court of Spears.';if(['court_approach','court_lower','court_upper','court_report'].includes(scene)){const next=target();if(next)return next.label+'.';}const text=['Plan the Court of Spears assault.','Break through the lower-platform defenders.','Confront Rhona.','Cross to the upper court.','Face the Angel of Longacre.','Follow Lencia to the platform edge.','Secure the Court of Spears.','Report the outcome to Fex.','Prepare for the next assignment.','Longacre complete · The road to Kantaria awaits.'];const i=chain.findIndex(k=>!quest[k]);return text[i<0?9:Math.max(0,i-1)];}
 function points(){if(!quest.chapter9Complete)return null;if(!quest.chapter10)return scene==='fort_patrol'?[point('courtArcRoad')]:[];if(quest.chapter10Complete)return [];const id=({court_approach:quest.courtBriefed?'courtClimb':'courtBriefing',court_lower:!quest.lowerCleared?(quest.courtCrossingSurveyed?'courtLowerFight':'courtSurveyCrossing'):!quest.rhonaDefeated?'courtRhonaFight':quest.courtBridgeChecked?'courtUpperRoad':'checkUpperBridge',court_upper:!quest.lenciaDefeated?'courtLenciaFight':!quest.lenciaEscaped?'courtEscape':!quest.courtSecured?'secureCourt':'courtReportRoad',court_report:quest.courtReported?'courtArcComplete':'courtDebrief'})[scene];return [point(id)].filter(Boolean);}
 const target=()=>points()?.[0]||null;
 function npcs(){if(!quest.chapter10)return null;if(scene==='court_lower')return !quest.lowerCleared?defenders:!quest.rhonaDefeated?rhonaGuard:[{id:'court_rhona',x:312,y:168,pose:'prone'}];if(scene==='court_upper')return quest.lenciaEscaped?[]:quest.lenciaDefeated?[{id:'lencia',...eastRail}]:upperGuard;if(scene==='court_report')return [{id:'fex',x:328,y:168}];return [];}
 function escapePose(actor){
  if(scene!=='court_upper'||actor.id!=='lencia'||escapeBeat?.epoch!==epoch)return null;
  const progress=Math.min(1,(performance.now()-escapeBeat.at)/escapeDuration);
  const descent=Math.max(0,(progress-.28)/.72);
  return {x:Math.round(22*progress+43*descent),y:Math.round(descent*63),opacity:1-descent*.9,tilt:descent*.24};
 }
 async function escapeLencia(){
  await say('jamal','She’s past the railing. How far down is that?');
  if(!reduce.matches){
   const token=epoch;
   escapeBeat={epoch:token,at:performance.now()};
   try{await delay(escapeDuration);if(token!==epoch)throw CANCEL;}
   finally{escapeBeat=null;}
  }
  quest.lenciaEscaped=true;
  save();
  await say('Chronicle','Lencia drops over the edge. The feather-fall worked into her armor slows her descent. She disappears beneath the canopy.');
  await say('freya','Let her go. Check our wounded and secure the deck.');
 }
 function prepare(position=scenes[scene].spawn){applyProgression();seedParty(...position);window.NextChapter?.syncRoster?.();paintParty();save();}
 function foe(id,name){return {id,name:name||NAMES[id],hp:STATS[id].hp,max:STATS[id].hp};}
 async function afterBattle(kind){if(kind==='court_lower'){quest.lowerCleared=true;save();await say('freya','Keep moving. The connecting platforms lead deeper into their base.');}
  else if(kind==='court_rhona'){
   quest.rhonaDefeated=true;
   prepare([328,200]);
   await say('Chronicle','Rhona Staelish falls on the lower deck. She does not rise.');
   await say('freya','Cimri will have to hear it from us. J’Mal, check the bridge ahead.');
   updateObjective();
   return;
  }
  else if(kind==='court_lencia'){
   quest.lenciaDefeated=true;
   prepare([360,216]);
   await say('Chronicle','Lencia falls back toward the east rail, bracing on her shield.');
   await say('reese','She’s still on her feet. The side bridge, over there.');
   updateObjective();
   return;
  }
  else return;prepare();updateObjective();}
 async function interact(id){if(id==='courtArcRoad'){if(!quest.chapter9Complete||quest.chapter10)return false;quest.chapter10=true;for(const id of party){hp[id]=STATS[id].hp;uses[id]=0;}mendUses=2;await travel('court_approach',328,344);}
  else if(!quest.chapter10)return false;
  else if(id==='courtBriefing'&&scene==='court_approach'&&!quest.courtBriefed){
   await say('jamal','Same bridges we saw from the trail. The stairs up are just ahead.');
   await say('freya','All six of us cross together. Reese, watch the platforms above. Keep the stairs clear behind us.');
   await say('reese','I’ll have a clear shot once we reach the deck.');
   await say('freya','El Guapo. Back with us again?');
   await say('guapo','A bishop tried to marry me to a lighthouse. I declined on navigational grounds.');
   quest.courtBriefed=true;
  }
  else if(id==='courtClimb'&&scene==='court_approach'&&quest.courtBriefed)await travel('court_lower',328,344);
  else if(id==='courtSurveyCrossing'&&scene==='court_lower'&&quest.courtBriefed&&!quest.courtCrossingSurveyed&&!quest.lowerCleared){
   await say('reese','Three on the deck. One at each rail and another at the far bridge.');
   await say('jason','Once we step onto those boards, they’ll hear us.');
   await say('freya','Then we go together. Keep them off the stairs.');
   quest.courtCrossingSurveyed=true;
  }
  else if(id==='courtLowerFight'&&scene==='court_lower'&&quest.courtCrossingSurveyed&&!quest.lowerCleared){
   await say(null,'[Advance across the deck]', ['[Lead the company into the crossing]']);
   prepare();
   const enemies=defenders.map(({id},i)=>foe(id,'Defender '+(i+1)));
   startBattle(0,false,{kind:'court_lower',enemies});
   log('Three defenders bar the crossing.');
  }
  else if(id==='courtRhonaFight'&&scene==='court_lower'&&quest.lowerCleared&&!quest.rhonaDefeated){
   await say('jamal','Rhona. The woman from the jail. She’s holding the far bridge.');
   await say('freya','Rhona, step aside. This can end here.');
   await say('court_rhona','You dismissed me at the gate. That was your town. This is our bridge.');
   await say(null,'[Confront Rhona at the crossing]', ['[Advance on Rhona and her defenders]']);
   prepare();
   startBattle(0,false,{kind:'court_rhona',enemies:[foe('court_rhona'),foe('court_ranger','Bridge Defender 1'),foe('court_ranger','Bridge Defender 2')]});
   log('Rhona holds the crossing with twin hand axes.');
  }
  else if(id==='checkUpperBridge'&&scene==='court_lower'&&quest.rhonaDefeated&&!quest.courtBridgeChecked){
   await say('jamal','The ropes are still sound. There’s a bigger deck on the other side.');
   await say('freya','Cross in single file. Reese, keep an eye on the far rail.');
   quest.courtBridgeChecked=true;
  }
  else if(id==='courtUpperRoad'&&scene==='court_lower'&&quest.courtBridgeChecked&&!quest.upperReached){quest.upperReached=true;await travel('court_upper',328,344);}
  else if(id==='courtLenciaFight'&&scene==='court_upper'&&quest.upperReached&&!quest.lenciaDefeated){
   await say('Chronicle','Lencia Visserene, the Angel of Longacre, raises her shield. The paladin’s armor is shaped like wings. Two defenders stand beside her.');
   await say('lencia','Iomedae, steady my hand.');
   await say('freya','Watch her sword arm. Keep your backs to the center of the deck.');
   await say(null,'[Face Lencia on the upper deck]', ['[Advance on the Angel of Longacre]']);
   prepare();
   startBattle(0,false,{kind:'court_lencia',enemies:[foe('lencia'),foe('court_ranger','Court Defender 1'),foe('court_ranger','Court Defender 2')]});
   log('Lencia raises her shield. The defenders close in.');
  }
  else if(id==='courtEscape'&&scene==='court_upper'&&quest.lenciaDefeated&&!quest.lenciaEscaped)await escapeLencia();
  else if(id==='secureCourt'&&scene==='court_upper'&&quest.lenciaEscaped&&!quest.courtSecured){
   await say(null,'[Secure the upper deck]', ['[Check the wounded and clear the remaining platforms]']);
   for(const id of party)hp[id]=Math.max(1,hp[id]);
   quest.courtSecured=true;
   save();
   await say('Chronicle','The remaining platforms are clear. The party has wounded, but no fatalities. The Court of Spears can no longer serve as the rebels’ base.');
   await say('freya','Tell Fex exactly what happened. Rhona fell here. Lencia escaped.');
  }
  else if(id==='courtReportRoad'&&scene==='court_upper'&&quest.courtSecured)await travel('court_report',328,344);
  else if(id==='courtDebrief'&&scene==='court_report'&&quest.courtSecured&&!quest.courtReported){
   await say('fex','Captain. What became of the Court of Spears?');
   await say(null,'[Deliver Freya’s field report]', ['[Report the outcome of the assault]']);
   await say('freya','The Court is broken. Rhona Staelish fell in the fighting. Lencia Visserene escaped below the canopy. We brought everyone home, with injuries but no fatalities.');
   await say('fex','You’ve done what I asked of you in Longacre. Take four weeks of furlough. When it ends, I’ll need your company in Kantaria.');
   quest.courtReported=true;
  }
  else if(id==='courtArcComplete'&&scene==='court_report'&&quest.courtReported&&!quest.chapter10Complete){
   await journeyCard('Longacre · Four Weeks of Furlough','The company stands down after the Court of Spears assault.\nFour weeks pass before they set out for Kantaria.');
   quest.chapter10Complete=true;
  }
  else return false;save();paintParty();updateObjective();return true;
 }
 function effects(g,t){if(!quest.chapter10||!['court_lower','court_upper'].includes(scene))return;g.save();g.fillStyle='#73926c';g.globalAlpha=.1;for(let i=0;i<18;i++){const x=(i*83+(reduce.matches?0:Math.floor(t*5)))%640,y=(i*47)%400;if(y>120&&y<290)continue;g.fillRect(x,y,3,2);}g.restore();}
 return {install,load,mapImage,roster,goal,points,target,npcs,interact,afterBattle,escapePose,effects,chain};
})();
