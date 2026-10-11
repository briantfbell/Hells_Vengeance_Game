'use strict';
window.Progression=(()=>{
 const milestone='longacre-sermon-rest',members=['freya','jamal','jason','draymus'],hpGain={freya:6,jamal:5,jason:5,draymus:4,guapo:5,reese:5};
 const fresh=()=>({levels:{freya:1,jamal:1,jason:1,draymus:1,guapo:1,reese:1},milestones:[]});
 function validate(value,quest){if(!value||typeof value!=='object'||Array.isArray(value)||!value.levels||!Array.isArray(value.milestones))throw Error('Invalid character progression.');const expected=fresh();if(value.milestones.length){if(value.milestones.length!==1||value.milestones[0]!==milestone||!quest.decreesIssued)throw Error('Invalid progression milestone.');expected.milestones=[milestone];for(const id of members)expected.levels[id]=2;}if(![5,6].includes(Object.keys(value.levels).length)||Object.keys(value.levels).some(id=>!Object.hasOwn(expected.levels,id))||Object.keys(value).some(k=>!['levels','milestones'].includes(k)))throw Error('Invalid character progression fields.');for(const id of Object.keys(expected.levels))if((value.levels[id]??(id==='reese'?1:undefined))!==expected.levels[id])throw Error('Invalid level for '+id+'.');if(!!quest.decreesIssued!==!!expected.milestones.length)throw Error('The progression does not match the story checkpoint.');return expected;}
 function migrate(quest){const p=fresh();if(quest.decreesIssued){p.milestones=[milestone];for(const id of members)p.levels[id]=2;}return p;}
 const stats=(base,id,level)=>({...base,hp:base.hp+(level===2?hpGain[id]:0),atk:base.atk+(level===2?1:0),dmg:[...base.dmg]});
 const skill=(base,level,id)=>({...base,uses:base.uses+(level===2?1:0),dmg:id==='jason'?[level,4,0]:id==='freya'?[1,10,4+level]:[...base.dmg]});
 function history(q,p){const rows=[];
  if(q.scimitar)rows.push(q.scimitarDisposed?'Viggo’s scimitar · recovered, then planted on the pirate captain.':'Viggo’s scimitar · recovered; available to Freya.');
  if(p.milestones.includes(milestone))rows.push('Ash House rest · Freya, J’Mal, Jason and Draymus reach level 2. More HP, +1 to hit and +1 skill use; Challenge and Burning Hands grow stronger.');
  if(q.reeseJoined)rows.push('Reese joins in Longacre · basic bow and armor.');
  if(q.guapoReturned)rows.push('21 Neth · El Guapo rejoins the company.');
  if(q.churchLoadout)rows.push('Church assault · Freya uses her naginata, Jason a lucerne hammer, J’Mal a kukri.');
  if(q.mantisTraining)rows.push('Red Mantis training · twenty-four hours; sword belt and blades gifted to J’Mal. Historical level and enchantments remain unconfirmed.');
  if(q.churchConverted)rows.push('Jason appointed head pastor · church converted; Cimri becomes sheriff.');
  if(q.armoryCleared)rows.push('Armory heist thwarted · Bo returns alive; Dent and three rangers fight alongside her.');
  if(q.cimriRecovered)rows.push('Jail fire · Cimri recovered; Rhona escapes.');
  if(q.prisonersQuestioned)rows.push('Prisoner interrogation · rebel supplies at Fort Estazano.');
  if(q.fortScouted)rows.push('Fort Estazano · hidden archer and manticore force the scouts to retreat.');
  if(q.manticoreDefeated)rows.push('Fort secured · Jason’s final hammer throw downs the manticore.');
  if(q.patrolQuestioned)rows.push('Returning patrol · hidden settlement named the Court of Spears.');
  if(q.rhonaDefeated)rows.push('Court of Spears · Rhona Staelish dies in the assault.');
  if(q.lenciaEscaped)rows.push('Lencia Visserene escapes · winged armor with feather-fall.');
  if(q.courtReported)rows.push('Longacre operation complete · four weeks furlough; next assignment Kantaria.');
  if(q.uskwoodBriefed)rows.push('Kantaria · Loredana employs the company at the Uskwood Inn.');
  if(q.zaraFreed)rows.push('Zara Orcelani extracted from Hardship’s Hearth with her gear.');
  if(q.zaraHidden)rows.push('Zara concealed at the Uskwood.');
  if(q.docksBurned)rows.push('Kantaria docks destroyed; the rebellion’s dock income interrupted.');
  if(q.jonasEscaped)rows.push('Jonas Reikman escaped wounded; south tower damaged.');
  if(q.westTowerBurned)rows.push('North tower assaulted; west tower burned; Angel-Bro defeated.');
  if(q.marketRiot)rows.push('Kantaria market · the company causes a riot.');
  if(q.falseBlame)rows.push('Militia ambushes · the company falsely blames homeless freed slaves.');
  if(q.guildRecordsTampered)rows.push('Labor guild · records compromised during a burglary.');
  if(q.manorArtifactsTaken)rows.push('Narikopolus Manor · priceless artifacts stolen.');
  if(q.uskwoodBurned)rows.push('Uskwood fight · fireballs destroy the company’s shelter.');
  if(q.cavesReached)rows.push('Fungus Caves · the company withdraws to recover.');
  if(q.corrineAssigned)rows.push('Corrine assigned to Captain Freya’s team as liaison.');
  if(!rows.length)rows.push('No campaign milestones reached yet.');
  return rows;
 }
 return {milestone,members,hpGain,fresh,validate,migrate,stats,skill,history};
})();
