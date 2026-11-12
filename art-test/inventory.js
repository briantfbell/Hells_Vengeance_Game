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
  silent_sentry:{name:'Silent Sentry',die:8,attackBonus:2,frostDice:1,verb:'looses a frost arrow',move:'Silent Sentry shot'},
  naginata:{name:'Naginata',die:8,verb:'sweeps her naginata',move:'Naginata sweep'},
  lucerne:{name:'Lucerne hammer',die:12,verb:'drives his lucerne hammer',move:'Lucerne hammer strike'},
  kukri:{name:'Kukri',die:4,verb:'slashes with his kukri',move:'Kukri cut'},
  mantis_blades:{name:'Master’s gifted blades',die:6,verb:'cuts with the master’s gifted blades',move:'Paired blade cut'},
  scimitar:{name:'Viggo’s scimitar',die:6,verb:'slashes with Viggo’s scimitar',move:'Scimitar slash'}
 };
 const fresh=(q={})=>({version:1,equipped:Object.fromEntries(ids.map(id=>[id,q.churchLoadout&&id==='freya'?'naginata':q.churchLoadout&&id==='jason'?'lucerne':id==='jamal'&&q.mantisTraining?'mantis_blades':id==='jamal'&&q.churchLoadout?'kukri':id==='reese'&&q.kantariaGiftsReceived?'silent_sentry':id]))});
 function validate(value,q){if(value==null)return fresh(q);if(typeof value!=='object'||Array.isArray(value)||value.version!==1||Object.keys(value).some(k=>!['version','equipped'].includes(k))||!value.equipped||![5,6].includes(Object.keys(value.equipped).length)||Object.keys(value.equipped).some(id=>!ids.includes(id)))throw Error('Invalid inventory.');const out=fresh();for(const id of ids){const item=value.equipped[id]??(id==='reese'?'reese':undefined);if(item!==id&&!(id==='freya'&&item==='scimitar'&&q.scimitar)&&!(q.churchLoadout&&({freya:'naginata',jason:'lucerne',jamal:'kukri'})[id]===item)&&!(id==='jamal'&&item==='mantis_blades'&&q.mantisTraining)&&!(id==='reese'&&item==='silent_sentry'&&q.kantariaGiftsReceived&&q.reeseJoined))throw Error('Invalid equipped weapon for '+id+'.');out.equipped[id]=item==='scimitar'&&q.scimitarDisposed?'freya':item;}return out;}
 function weapon(state,id){return weapons[state.equipped[id]];}
 function equip(state,q,id,item){const candidate=structuredClone(state);candidate.equipped[id]=item;return validate(candidate,q);}
 function hasFreyaPlate(q){return !!(q.zaraGeitta&&(!q.egorianFreyaDischarged||q.paleArmorSummoned));}
 function stats(base,state,id,q={}){
  const equipped=weapon(state,id);
  const plate=id==='freya'&&hasFreyaPlate(q);
  return {...base,ac:base.ac+(plate?2:id==='jamal'&&q.kantariaGiftsReceived?3:0),...(plate?{physicalDR:3}:{}),
   atk:base.atk+(equipped.attackBonus||0),frostDice:equipped.frostDice||0,
   dmg:[base.dmg[0],equipped.die,base.dmg[2]]};
 }
 function skill(base,id,q){if(id==='jason'&&q.egorianJasonBack)return {...base,uses:0};return id==='draymus'&&q.kantariaGiftsReceived?{...base,uses:base.uses+4}:base;}
 function giftCharges(q,id){
  if(!q.kantariaGiftsReceived)return 0;
  if(id==='jamal')return 5-(q.mosswaterSpent||0);
  if(id==='jason'&&!q.egorianJasonBack)return 3-(q.dragonHelmSpent||0);
  return 0;
 }
 function items(q,potions){const result=ids.filter(id=>id!=='reese'||q.reeseJoined).map(id=>({id,name:weapons[id].name+' · '+({freya:'Freya',jamal:'J’Mal',jason:'Jason',draymus:'Draymus',guapo:'El Guapo',reese:'Reese'})[id],kind:'weapon',owner:id,description:'Personal starting weapon. Uses the character’s current attack bonus and damage modifier.'}));if(q.scimitar&&!q.scimitarDisposed)result.push({id:'scimitar',name:weapons.scimitar.name,kind:'weapon',owner:'freya',description:'Recovered from Viggo’s altar. Freya can equip this martial blade. A curved blade for close combat.'});if(q.churchLoadout)for(const [owner,id]of [['freya','naginata'],['jason','lucerne'],['jamal','kukri'],...(q.mantisTraining?[['jamal','mantis_blades']]:[])])result.push({id,name:weapons[id].name,owner,kind:'weapon',description:id==='mantis_blades'?'Gifted after twenty-four-hour training. Enchantments and exact weapon properties remain unconfirmed; game damage is adaptation tuning.':'Used in the documented church assault. Damage values are game tuning, not a reconstructed early sheet.'});result.push({id:'potion',name:'Healing potion ['+potions+'/2]',kind:'consumable',description:'Shared supply. Restore 2D4+2 HP to one present companion, up to their maximum. Uses the same stock as combat.'});if(q.briefed&&!q.planted)result.push({id:'missionRapier',name:'False-trail rapier',kind:'quest',description:'The mission’s false evidence to plant at Viggo’s altar. Reserved for the mission; cannot be equipped or consumed.'});if(q.payroll&&!q.reward)result.push({id:'payroll',name:'Tannery payroll box',kind:'quest',description:'Carry to Razelago at Ash House. Delivery removes it from the inventory.'});if(q.manorArtifactsTaken)result.push({id:"manorArtifacts",name:"Narikopolus artifacts",kind:"quest",description:"Priceless objects stolen from the manor. Their names and properties are not recorded; retained as story cargo, with no equipment bonus."});if(q.uskwoodDeedSigned)result.push({id:'uskwood_deed',name:'Uskwood deed',kind:'quest',description:'Freya, J’Mal, Jason and Draymus co-own the ruined Uskwood property. Loredana has left for Nidal.'});
 if(q.kantariaGiftsReceived)result.push(
  {id:'silent_sentry',name:'Silent Sentry',owner:'reese',kind:'weapon',description:'Reese’s +2 frost bow. Each hit adds 1D6 frost damage. It provides its own arrows.'},
  {id:'wizardry_ring',name:'Ring of Wizardry I',kind:'gear',owner:'draymus',description:'Adds four uses to Draymus’s spell allowance. His existing spent uses still count.'},
  {id:'mosswater_tunic',name:'Mosswater Tunic',kind:'gear',owner:'jamal',description:'+3 AC. Phase avoids enemy attacks until J’Mal’s next turn. '+giftCharges(q,'jamal')+'/5 charges remain.'},
  {id:'dragon_helm',name:'Dragon Helm',kind:'gear',owner:'jason',description:'Maximize rolls full Burning Hands damage and spends a spell use. '+giftCharges(q,'jason')+'/3 charges remain.'},
  {id:'kantaria_back_pay',name:'Kantaria back pay · 10,600 gp',kind:'quest',description:'The company’s shared back pay from Archbaron Fex.'}
 );
 if(q.skadiComplete)result.push({id:'skadi_cultural_items',name:'Objects recovered by the Frost Giants',kind:'quest',description:'Skadi gives the company several cultural objects as part of the passage agreement.'});
 if(q.darkrainClothed)result.push({id:'polar_bear_winter_clothing',name:'Polar-bear winter clothing',owner:'reese',kind:'gear',description:'Reese makes warm clothing for the company from the hide of the dire polar bear.'});
 if(q.freyaFieldMarshal)result.push({id:'westcrown_orders',name:'Westcrown orders',kind:'quest',description:'The Crown promotes Freya to Field Marshal and assigns her to Westcrown.'});
 if(q.dinyarCleared)result.push({id:'parnoneryx_head',name:'Parnoneryx’s head',kind:'quest',description:q.ilniusDefiled?'Jason used this head to defile the basin at St. Ilnius.':'The head of the gold dragon slain at Citadel Dinyar.'});
 if(q.molthuneCoffinLifted&&!q.molthuneBreach)result.push({id:'nidal_travel_coffin',name:'Reinforced travel coffin',kind:'quest',description:'Recovered from the ancient remorhaz’s territory.'});
 if(q.darkrainBearWon&&!q.molthuneBaitSet)result.push({id:'polar_bear_carcass',name:'Dire polar bear carcass',kind:'quest',description:'The company keeps the carcass after taking the hide.'});
 if(q.tathlumDuels===3)result.push({id:'championship_belt',name:'Championship Belt',owner:'freya',kind:'gear',description:'Freya’s dwarven belt. The Cave Giant rune grants 120 ft. darkvision and +5 to detect hidden doors. At Dinyar she can see into shadowed cells and sense hidden masonry as she approaches. The Ogre Magi rune records her victory over Yunero.'});
 if(q.covenantComplete)result.push({id:'abbies_ring',name:'Abbie’s Ring',owner:'jason',kind:'gear',description:'Given to Jason by Queen Abrogail after the covenant. The Foundry sheet records Freedom of Movement and fire resistance.'});
 if(hasFreyaPlate(q))result.push({id:'zara_geitta',name:'Zara Geitta',owner:'freya',kind:'gear',description:'Freya’s fitted adamantine Hellknight plate. +2 AC. Absorbs up to 3 physical damage per hit.'});
 else if(q.kantariaGiftsReceived&&!q.zaraGeitta)result.push({id:'egorian_commission',name:'Hellknight plate commission',kind:'quest',description:'Zara has ridden to Egorian to work on Freya’s custom plate.'});
 if(q.egorianChairBought)result.push({id:'antique_wheelchair',name:'Antique wheelchair',kind:'quest',description:'Draymus uses the chair for his disguise. Joe Kek pushes it.'});
 if(q.senaraTalismanRecovered&&!q.aregoReeseContract)result.push({id:'senara_infernal_talisman',name:q.aregoTalismanExposed?'Phlegmatic Talisman':'Infernal Talisman',kind:'quest',description:q.aregoTalismanExposed?'Fex built the talisman to bind Visperthul and control the Inferno Gate.':'Fex’s talisman, recovered from the Black Daggers beneath Senara.'});
 if(q.whisperwoodThreeHorns)result.push({id:'whisperwood_unicorn_horns',name:'Unicorn horns ['+(q.whisperwoodFourthHorn?4:3)+'/4]',kind:'quest',description:'Ritual components taken from the Blessing of Unicorns in the Whisperwood.'});
 if(q.senaraAngelHeart)result.push({id:'senara_angel_heart',name:'Angel heart',kind:'quest',description:'A ritual component taken from the balisse angel at Senara’s graveyard.'});
 if(q.senaraOrders)result.push({id:'senara_ritual_list',name:'Fex’s ritual list',kind:'quest',description:'Known entries include Fex’s Infernal Talisman, four unicorn horns, and angel hearts. Razelago says the ritual will close an uncontrolled portal in the Whisperwood.'});
 return result;
 }
 return {fresh,validate,weapon,equip,hasFreyaPlate,stats,skill,giftCharges,items};
})();
