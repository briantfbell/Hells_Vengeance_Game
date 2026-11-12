"use strict";

window.KantariaAftermath = (() => {
 const office = 'kantaria_council';
 const image = 'kantaria-council-v1.png';

 function install() {
  scenes.fastness_tower_base.points.push({id:'kantariaAftermathRoad',x:328,y:344,label:'Return to Kantaria'});
  scenes[office] = {
   name:'Kantaria · Council Hall',image,spawn:[328,344],blocks:[],
   walk:[{x:144,y:192,w:352,h:80},{x:288,y:272,w:64,h:112}],
   lights:[[190,126],[228,125],[414,126],[451,124]],
   points:[
    {id:'kantariaMayor',x:328,y:216,label:'Meet Mayor Demeer'},
    {id:'uskwoodDeed',x:232,y:232,label:'Speak with Loredana'},
    {id:'kantariaGifts',x:424,y:232,label:'Receive Fex’s rewards'},
    {id:'capitalOrders',x:328,y:344,label:'Prepare the prisoner transport'}
   ]
  };
  MAP_LAYERS[office] = {foreground:image,background:{
   type:'solid',color:'#141720',surface:{x:286,y:281,w:68,h:108,color:'#55505a'}
  }};
  JOURNEYS[office] = 'The banners and shrines have come down inside Valor’s Fastness. The former temple now houses the town government. The council has appointed Linton Demeer mayor, and he is already rebuilding it.';
  NAMES.linton = 'Linton Demeer';
  const sprite = 'linton-demeer-v1.png';
  LORE_CAST.linton = {src:sprite,source:sprite,frame:{x:186,y:15,w:579,h:1515}};
  FUTURE_NPCS.linton = LORE_CAST.linton;
  DIALOGUE_FACE_CROPS.linton = {x:366,y:14,w:263,h:263};
 }

 async function load(loader) { art[office] = await loader(image); }
 function mapImage() { return scene===office ? art[office] : null; }
 function points() {
  if (!quest.chapter15Complete) return null;
  if (scene==='fastness_tower_base') return [point('kantariaAftermathRoad')];
  if (scene!==office || quest.kantariaDepartureReady) return [];
  if (!quest.kantariaMayorMet) return [point('kantariaMayor')];
  if (!quest.uskwoodDeedSigned) return [point('uskwoodDeed')];
  return [point(quest.kantariaGiftsReceived?'capitalOrders':'kantariaGifts')];
 }
 function target() { return points()?.[0] || null; }
 function goal() {
  if (!quest.chapter15Complete) return null;
  return quest.kantariaDepartureReady ? 'The prisoner transport is ready for the South Road.' : target()?.label || null;
 }
 function npcs() {
  if (scene!==office) return null;
  const visitors=[{id:'linton',x:328,y:200},{id:'razelago',x:424,y:208}];
  if (!quest.uskwoodDeedSigned) visitors.push({id:'loredana',x:232,y:208});
  return visitors;
 }

 async function interact(id) {
  if (target()?.id!==id) return false;
  switch (id) {
   case 'kantariaAftermathRoad':
    await travel(office,328,344);
    break;
   case 'kantariaMayor':
    await say('linton','The council has appointed me mayor. We’ve offices again, but our docks are still in pieces and the traders are sailing past us.');
    await say('freya','Start with the empty seats on the council. Kantaria needs people who will stay and put it back together.');
    await say('Chronicle','Valor’s Fastness is deconsecrated. The temple of Iomedae and hidden shrine to Aroden are removed. Rioters loot and destroy Iomedae’s house.');
    quest.kantariaMayorMet=true;
    break;
   case 'uskwoodDeed':
    await say('loredana','I collected my father’s insurance. I’m going back to Nidal, and I won’t be returning to Kantaria.');
    await say('loredana','What’s left of the Uskwood is yours. I’ve put Freya, J’Mal, Jason and Draymus on the deed.');
    quest.uskwoodDeedSigned=true;
    break;
   case 'kantariaGifts':
    await say('razelago','Archbaron Fex is pleased. Here is your back pay. Ten thousand six hundred gold. He has sent gifts as well.');
    await say('razelago','Draymus, the Ring of Wizardry was his own. J’Mal, take the Mosswater Tunic. Jason, the Dragon Helm once belonged to a tiefling cleric.');
    await say('razelago','Reese, this bow is the Silent Sentry. Captain, Zara has gone ahead to Egorian. She’ll put your commission to the forge there.');
    quest.kantariaGiftsReceived=true;
    inventory=Inventory.equip(inventory,quest,'reese','silent_sentry');
    applyProgression();
    break;
   case 'capitalOrders':
    await say('razelago','Fex has promised the capital that Oppian will be delivered in five days. The South Road is the quickest way to Egorian.');
    await say('freya','Then we leave as soon as the carriage is ready. Keep Oppian in the middle seat.');
    await journeyCard('The South Road Awaits','Linton and the council take charge of Kantaria. Oppian remains in the company’s custody. The carriage is ready for the journey to Egorian.');
    quest.kantariaDepartureReady=true;
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,interact};
})();
