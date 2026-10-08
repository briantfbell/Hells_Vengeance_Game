'use strict';
window.Progression=(()=>{
 const milestone='longacre-sermon-rest',members=['freya','jamal','jason','draymus'],hpGain={freya:6,jamal:5,jason:5,draymus:4,guapo:5};
 const fresh=()=>({levels:{freya:1,jamal:1,jason:1,draymus:1,guapo:1},milestones:[]});
 function validate(value,quest){if(!value||typeof value!=='object'||Array.isArray(value)||!value.levels||!Array.isArray(value.milestones))throw Error('Invalid character progression.');const expected=fresh();if(value.milestones.length){if(value.milestones.length!==1||value.milestones[0]!==milestone||!quest.decreesIssued)throw Error('Invalid progression milestone.');expected.milestones=[milestone];for(const id of members)expected.levels[id]=2;}if(Object.keys(value.levels).length!==5||Object.keys(value).some(k=>!['levels','milestones'].includes(k)))throw Error('Invalid character progression fields.');for(const id of Object.keys(expected.levels))if(value.levels[id]!==expected.levels[id])throw Error('Invalid level for '+id+'.');if(!!quest.decreesIssued!==!!expected.milestones.length)throw Error('The progression does not match the story checkpoint.');return expected;}
 function migrate(quest){const p=fresh();if(quest.decreesIssued){p.milestones=[milestone];for(const id of members)p.levels[id]=2;}return p;}
 const stats=(base,id,level)=>({...base,hp:base.hp+(level===2?hpGain[id]:0),atk:base.atk+(level===2?1:0),dmg:[...base.dmg]});
 const skill=(base,level)=>({...base,uses:base.uses+(level===2?1:0),dmg:[...base.dmg]});
 return {milestone,members,hpGain,fresh,validate,migrate,stats,skill};
})();
