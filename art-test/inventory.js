'use strict';
window.Inventory=(()=>{
 const ids=['freya','jamal','jason','draymus','guapo','reese'];
 const weapons={
  freya:{name:'Katana',die:10,verb:'slashes with her katana',move:'Katana slash'},
  jamal:{name:'Paired daggers',die:4,verb:'cuts with his paired daggers',move:'Dagger lunge'},
  jason:{name:'Mace',die:8,verb:'swings his mace',move:'Mace swing'},
  draymus:{name:'Dagger',die:4,verb:'strikes with his dagger',move:'Dagger strike'},
  guapo:{name:'Rapier',die:6,verb:'thrusts his rapier',move:'Rapier thrust'},
  reese:{name:'Bow',die:8,verb:'looses an arrow from his bow',move:'Bow shot'},
  naginata:{name:'Naginata',die:8,verb:'sweeps her naginata',move:'Naginata sweep'},
  lucerne:{name:'Lucerne hammer',die:12,verb:'drives his lucerne hammer',move:'Lucerne hammer strike'},
  kukri:{name:'Kukri',die:4,verb:'slashes with his kukri',move:'Kukri cut'},
  mantis_blades:{name:'Master’s gifted blades',die:6,verb:'cuts with the master’s gifted blades',move:'Paired blade cut'},
  scimitar:{name:'Viggo’s scimitar',die:6,verb:'slashes with Viggo’s scimitar',move:'Scimitar slash'}
 };
 const fresh=(q={})=>({version:1,equipped:Object.fromEntries(ids.map(id=>[id,q.churchLoadout&&id==='freya'?'naginata':q.churchLoadout&&id==='jason'?'lucerne':id==='jamal'&&q.mantisTraining?'mantis_blades':id==='jamal'&&q.churchLoadout?'kukri':id]))});
 function validate(value,q){if(value==null)return fresh(q);if(typeof value!=='object'||Array.isArray(value)||value.version!==1||Object.keys(value).some(k=>!['version','equipped'].includes(k))||!value.equipped||![5,6].includes(Object.keys(value.equipped).length)||Object.keys(value.equipped).some(id=>!ids.includes(id)))throw Error('Invalid inventory.');const out=fresh();for(const id of ids){const item=value.equipped[id]??(id==='reese'?'reese':undefined);if(item!==id&&!(id==='freya'&&item==='scimitar'&&q.scimitar)&&!(q.churchLoadout&&({freya:'naginata',jason:'lucerne',jamal:'kukri'})[id]===item)&&!(id==='jamal'&&item==='mantis_blades'&&q.mantisTraining))throw Error('Invalid equipped weapon for '+id+'.');out.equipped[id]=item==='scimitar'&&q.scimitarDisposed?'freya':item;}return out;}
 function weapon(state,id){return weapons[state.equipped[id]];}
 function equip(state,q,id,item){const candidate=structuredClone(state);candidate.equipped[id]=item;return validate(candidate,q);}
 function stats(base,state,id){return {...base,dmg:[base.dmg[0],weapon(state,id).die,base.dmg[2]]};}
 function items(q,potions){const result=ids.filter(id=>id!=='reese'||q.reeseJoined).map(id=>({id,name:weapons[id].name+' · '+({freya:'Freya',jamal:'J’Mal',jason:'Jason',draymus:'Draymus',guapo:'El Guapo',reese:'Reese'})[id],kind:'weapon',owner:id,description:'Personal starting weapon. Uses the character’s current attack bonus and damage modifier.'}));if(q.scimitar&&!q.scimitarDisposed)result.push({id:'scimitar',name:weapons.scimitar.name,kind:'weapon',owner:'freya',description:'Recovered from Viggo’s altar. Freya can equip this martial blade. A curved blade for close combat.'});if(q.churchLoadout)for(const [owner,id]of [['freya','naginata'],['jason','lucerne'],['jamal','kukri'],...(q.mantisTraining?[['jamal','mantis_blades']]:[])])result.push({id,name:weapons[id].name,owner,kind:'weapon',description:id==='mantis_blades'?'Gifted after twenty-four-hour training. Enchantments and exact weapon properties remain unconfirmed; game damage is adaptation tuning.':'Used in the documented church assault. Damage values are game tuning, not a reconstructed early sheet.'});result.push({id:'potion',name:'Healing potion ['+potions+'/2]',kind:'consumable',description:'Shared supply. Restore 2D4+2 HP to one present companion, up to their maximum. Uses the same stock as combat.'});if(q.briefed&&!q.planted)result.push({id:'missionRapier',name:'False-trail rapier',kind:'quest',description:'The mission’s false evidence to plant at Viggo’s altar. Reserved for the mission; cannot be equipped or consumed.'});if(q.payroll&&!q.reward)result.push({id:'payroll',name:'Tannery payroll box',kind:'quest',description:'Carry to Razelago at Ash House. Delivery removes it from the inventory.'});if(q.manorArtifactsTaken)result.push({id:"manorArtifacts",name:"Narikopolus artifacts",kind:"quest",description:"Priceless objects stolen from the manor. Their names and properties are not recorded; retained as story cargo, with no equipment bonus."});return result;}
 return {fresh,validate,weapon,equip,stats,items};
})();
