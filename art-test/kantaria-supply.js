"use strict";
window.SupplyArc=(()=>{
 const maps={},party=['freya','jamal','jason','draymus','guapo','reese'];
 const chain=['chapter14','supplyBriefed','mineObserved','mineDefendersCleared','minesSecured','cultLocated','cultDefeated','cultDestroyed','tradeObserved','merchantStruck','captainStruck','fortObserved','fortIsolated','perimeterCleared','supplyReported','chapter14Complete'];
 const mineGuards=[{id:'kantaria_guard',x:248,y:176},{id:'kantaria_guard',x:328,y:144},{id:'kantaria_guard',x:408,y:176}];
 const fortGuards=[
  {id:'kantaria_guard',x:208,y:184},
  {id:'kantaria_guard',x:280,y:160},
  {id:'kantaria_guard',x:376,y:160},
  {id:'kantaria_guard',x:448,y:184}
 ];
 const shrineDefenders=[
  {id:'lamashtu_sentry',x:232,y:176},
  {id:'lamashtu_sentry',x:424,y:176},
  {id:'lamashtu_adept',x:328,y:136}
 ];
 const altarDebris=[[292,124,12,5],[306,132,8,5],[316,126,15,8],[333,135,9,4],[344,127,13,6],[362,120,7,5],[374,129,10,4]];
 let altarBrokenAt=-Infinity;
 const steps={supply_caves:[['supplyBrief','supplyBriefed',328,200,'Plan the remaining targets'],['mineRoad',null,328,344,'Approach the mines']],kantaria_mines:[['mineSurvey','mineObserved',152,184,'Scout from the ore crates'],['mineFight','mineDefendersCleared',328,216,'Defeat the mine defenders'],['secureMines','minesSecured',328,120,'Secure the main tunnel'],['cultRoad',null,328,344,'Seek the Lamashtu cult']],lamashtu_grotto:[['locateCult','cultLocated',200,224,'Inspect the shrine from the cavern edge'],['cultFight','cultDefeated',328,216,'Defeat the cult defenders'],['destroyCult','cultDestroyed',328,120,'Break the cult altar'],['tradeRoad',null,328,344,'Track the rebel suppliers']],kantaria_supply_wharf:[['observeTrade','tradeObserved',328,232,'Watch the wharf from the pier'],['strikeMerchant','merchantStruck',152,152,'Intercept the merchant suppliers'],['strikeCaptain','captainStruck',488,152,'Intercept the shipping contacts'],['perimeterRoad',null,328,344,'Approach the perimeter forts']],kantaria_perimeter:[['observeFort','fortObserved',176,232,'Scout from the broken wall'],['isolateFort','fortIsolated',472,224,'Signal the road watchers'],['perimeterFight','perimeterCleared',328,200,'Attack the isolated garrison'],['supplyReportRoad',null,328,344,'Return to the cave refuge']],supply_report:[['supplyReport','supplyReported',328,200,'Review the operation with Corrine'],['supplyEnd','chapter14Complete',328,344,'Prepare for Valor’s Fastness']]};
 function install(){
  const defs=[['supply_caves','Fungus Caves · Stranglehold','kantaria-caves-v1.png'],['kantaria_mines','Kantaria · The Ore Workings','kantaria-mines-v1.png'],['lamashtu_grotto','Kantaria · The Hidden Cult','lamashtu-grotto-v1.png'],['kantaria_supply_wharf','Kantaria · The Supply Network','kantaria-docks-v1.png'],['kantaria_perimeter','Kantaria · The Perimeter Forts','fort-estazano-v1.png'],['supply_report','Fungus Caves · The Remaining Stronghold','kantaria-caves-v1.png']];
  for(const[id,name,image]of defs){const s=structuredClone(scenes.fungus_shelter);Object.assign(s,{name,image,points:[],blocks:[],spawn:[328,344],walk:[{x:144,y:160,w:352,h:144},{x:288,y:304,w:80,h:80}],lights:[[144,144],[496,144]]});maps[id]=scenes[id]=s;MAP_LAYERS[id]={foreground:image,background:{type:'solid',color:id==='lamashtu_grotto'?'#10130d':'#0b1015'}};if(id==='kantaria_supply_wharf')MAP_LAYERS[id].background={type:'ocean',palette:['#13252b','#25434b','#35545b','#1b343d'],speed:3};for(const[p,flag,x,y,label]of steps[id])s.points.push({id:p,x,y,label:'['+label+']'});}
  Object.assign(scenes.kantaria_mines,{
   walk:[{x:288,y:272,w:64,h:128},{x:160,y:240,w:320,h:48},{x:128,y:144,w:384,h:112},{x:160,y:112,w:320,h:48}],
   lights:[[80,128],[186,82],[328,70],[474,82],[552,136]]
  });
  Object.assign(scenes.lamashtu_grotto,{
   walk:[{x:288,y:272,w:64,h:128},{x:160,y:240,w:320,h:48},{x:112,y:160,w:416,h:96},{x:192,y:128,w:256,h:48}],
   lights:[[128,96],[302,72],[374,72],[568,136]]
  });
  Object.assign(scenes.kantaria_supply_wharf,{
   walk:[{x:272,y:176,w:96,h:208},{x:96,y:144,w:448,h:48},{x:192,y:112,w:256,h:48}],
   lights:[[288,80],[352,80]]
  });
  Object.assign(scenes.kantaria_perimeter,{
   walk:[{x:288,y:256,w:64,h:144},{x:144,y:160,w:368,h:112},{x:288,y:112,w:64,h:64}],
   lights:[]
  });
  scenes.fungus_shelter.points.push({id:'supplyRoad',x:328,y:344,label:'Continue: Stranglehold'});
  Object.assign(NAMES,{lamashtu_sentry:'Cult Sentry',lamashtu_adept:'Cult Adept'});
  Object.assign(STATS,{lamashtu_sentry:{hp:24,ac:14,atk:5,dmg:[1,6,2]},lamashtu_adept:{hp:30,ac:13,atk:5,dmg:[1,8,2]}});
  Object.assign(JOURNEYS,{supply_caves:'The company has recovered in the caves. Corrine is now its liaison. The rebellion still draws income, equipment and patrol support from the country around Kantaria.',kantaria_mines:'Ore and equipment help sustain the rebellion. The company approaches the mine workings to sever that support.',lamashtu_grotto:'The company turns to a hidden cult of Lamashtu. They intend to root it out and destroy its stronghold.',kantaria_supply_wharf:'Cargo still moves through surviving berths around Kantaria. The company watches for the merchants and ship captains who supply the rebellion.',kantaria_perimeter:'The rebellion uses its outlying forts to extend its patrols. The company approaches one garrison while lookouts take position along the connecting roads.',supply_report:'The mines are secured, the cult destroyed, and the supply network struck. The party returns to the caves to review the perimeter operation.'});
 }
 async function load(loader){for(const[id,s]of Object.entries(maps))art[id]=await loader(s.image);}
 function mapImage(){return quest.chapter14?art[scene]:null;}
 function roster(){return quest.chapter14?party:null;}
 function points(){if(!quest.chapter13Complete)return null;if(!quest.chapter14)return scene==='fungus_shelter'?[point('supplyRoad')]:[];if(quest.chapter14Complete)return [];const entries=steps[scene];if(!entries)return [];const next=entries.find(([,flag])=>!flag||!quest[flag]);return [point(next?.[0])].filter(Boolean);}
 const target=()=>points()?.[0]||null;
 function goal(){if(!quest.chapter13Complete)return null;if(quest.chapter14Complete)return 'Stranglehold complete · Valor’s Fastness remains.';if(!quest.chapter14)return 'Continue: Stranglehold.';const p=target();return p?p.label.replace(/^\[|\]$/g,'')+'.':'Continue the operation.';}
 function npcs(){if(!quest.chapter14)return null;if(['supply_caves','supply_report'].includes(scene))return [{id:'corrine',x:328,y:168}];if(scene==='kantaria_mines')return quest.mineDefendersCleared?[]:mineGuards;if(scene==='lamashtu_grotto')return quest.cultDefeated?[]:shrineDefenders;if(scene==='kantaria_supply_wharf')return [...(!quest.merchantStruck?[{id:'market_trader',x:128,y:152}]:[]),...(!quest.captainStruck?[{id:'guild_clerk',x:520,y:168}]:[])];if(scene==='kantaria_perimeter')return quest.perimeterCleared?[]:fortGuards;return [];}
 function drawNPC(u){if(u.id!=='corrine')return false;drawQuestgiver('corrine',u.x,u.y,62);return true;}
 function fight(kind,ids){applyProgression();seedParty(...scenes[scene].spawn);save();startBattle(0,false,{kind,enemies:ids.map((id,i)=>({id,name:(id==='kantaria_guard'?(kind==='supply_mines'?'Mine Guard':'Fort Guard'):NAMES[id])+' '+(i+1),shortName:({kantaria_guard:'Guard',lamashtu_sentry:'Sentry',lamashtu_adept:'Adept'})[id]+' '+(i+1),hp:STATS[id].hp,max:STATS[id].hp}))});}
 async function afterBattle(kind){const flag=({supply_mines:'mineDefendersCleared',supply_cult:'cultDefeated',supply_fort:'perimeterCleared'})[kind];if(!flag)return;quest[flag]=true;save();await say('Chronicle',kind==='supply_mines'?'The defenders fall. The company can now secure the workings and their supplies.':kind==='supply_cult'?'The cult’s defenders are defeated. Its stronghold lies open to the company.':'The isolated garrison is defeated. The perimeter operation cuts back the rebellion’s reach.');paintParty();updateObjective();}
 async function interact(id){
  if(id==='supplyRoad'){if(!quest.chapter13Complete||quest.chapter14)return false;quest.chapter14=true;await travel('supply_caves',328,344);}
  else if(!points()?.some(p=>p.id===id))return false;
  else if(id==='supplyBrief'){await say('corrine','The rebellion can still draw ore and equipment from the mines. Merchants and captains keep supplies moving, and patrols rally at the outlying forts.');await say('freya','We start at the mines. Then the cult of Lamashtu, the suppliers, and the forts. By the time we reach their stronghold, they’ll have nowhere to turn.');quest.supplyBriefed=true;}
  else if(id==='mineRoad')await travel('kantaria_mines',328,344);
  else if(id==='mineSurvey'){await say('reese','Three guards past these crates. The middle one has a clear run to the main tunnel.');await say('freya','Take the floor first. We need the workings intact.');quest.mineObserved=true;}
  else if(id==='mineFight')fight('supply_mines',mineGuards.map(guard=>guard.id));
  else if(id==='secureMines'){await say('freya','Hold this tunnel and check the store crates. Nothing leaves for the rebellion.');await say(null,'The guards are down and the ore is still here.', ['[Take control of the workings]']);quest.minesSecured=true;save();await say('Chronicle','The company secures the mines around Kantaria, cutting the rebellion off from income and equipment.');}
  else if(id==='cultRoad')await travel('lamashtu_grotto',328,344);
  else if(id==='locateCult'){await say('jason','Lamashtu’s shrine. The adept is at the altar and the two sentries have the floor. We deal with them before we touch the shrine.');quest.cultLocated=true;}
  else if(id==='cultFight')fight('supply_cult',shrineDefenders.map(defender=>defender.id));
  else if(id==='destroyCult'){
   await say('jason','Break the altar. Leave them nothing to gather around.');
   await say(null,'The shrine stands undefended.', ['[Bring down the altar]']);
   quest.cultDestroyed=true;
   altarBrokenAt=performance.now();
   save();
   updateObjective();
   await say('Chronicle','Stone cracks and the altar collapses. The company destroys the cult’s stronghold.');
  }
  else if(id==='tradeRoad')await travel('kantaria_supply_wharf',328,344);
  else if(id==='observeTrade'){
   await say('reese','Crates are coming in on the left. On the right, the crews are taking on cargo. We can watch both berths from here.');
   await say('freya','Find out who’s supplying the rebellion. We move on the merchants first.');
   quest.tradeObserved=true;
  }
  else if(id==='strikeMerchant'){
   const approach=await say('freya','Our contacts have picked out the merchants. How do we move?',['[Set a quiet ambush]','[Watch the route with Reese]']);
   await say(approach===0?'jamal':'reese',approach===0?'I’ll follow them past the cargo stacks. Wait until they’re out of sight of the pier.':'I’ll watch their route from here. Give me a signal when you’re ready.');
   await say(null,'The merchants leave the berth.', ['[Move on the merchant suppliers]']);
   quest.merchantStruck=true;
   save();
   updateObjective();
   await journeyCard('Kantaria · The Merchant Suppliers','The company assassinates key merchants dealing with the rebellion.\nThe ship captains who carried their cargo are still operating.');
  }
  else if(id==='strikeCaptain'){
   await say('guapo','Those crews will cast off as soon as they’re loaded. Let’s make sure their captains miss the tide.');
   await say(null,'The crews are occupied with the cargo.', ['[Move on the shipping contacts]']);
   quest.captainStruck=true;
   save();
   updateObjective();
   await journeyCard('Kantaria · Shipping Contacts','The company assassinates ship captains dealing with the rebellion.\nWith the supply routes disrupted, the company turns to the perimeter forts.');
  }
  else if(id==='perimeterRoad')await travel('kantaria_perimeter',328,344);
  else if(id==='observeFort'){
   await say('reese','Four in the yard. Their patrols use the road beyond that arch to move between forts.');
   await say('freya','Get the road watchers in place. We’ll strike when they give the signal.');
   quest.fortObserved=true;
  }
  else if(id==='isolateFort'){
   await say('reese','The watchers are in place. They can stop a runner before he reaches the next fort.');
   await say(null,'The road watchers are waiting.', ['[Signal them to close the road]']);
   quest.fortIsolated=true;
   save();
  }
  else if(id==='perimeterFight'){
   fight('supply_fort',fortGuards.map(guard=>guard.id));
  }
  else if(id==='supplyReportRoad')await travel('supply_report',328,344);
  else if(id==='supplyReport'){
   await say('corrine','The rebellion has lost its ore, the suppliers we tracked, and the forts its patrols relied on. Where do you go next?');
   await say('freya','Valor’s Fastness. The road there is open. We’ll move when we’re ready.');
   quest.supplyReported=true;
  }
  else if(id==='supplyEnd'){await journeyCard('Chapter Fourteen · Stranglehold','The mines are secured.\nThe Lamashtu cult is destroyed.\nMerchant and shipping suppliers have been struck.\nThe perimeter forts have been isolated and attacked.\nValor’s Fastness remains ahead.');quest.chapter14Complete=true;}
  else return false;save();paintParty();updateObjective();return true;
 }
 function effects(g){
  if(scene!=='lamashtu_grotto'||!quest.cultDestroyed)return;
  const altar=art.lamashtu_grotto;
  g.save();
  if(altar){
   const sx=altar.width/640,sy=altar.height/400;
   g.filter='saturate(0.32) brightness(0.48)';
   g.drawImage(altar,286*sx,54*sy,99*sx,70*sy,286,54,99,70);
   g.filter='none';
  }
  for(const [x,y,w,h] of altarDebris){
   g.fillStyle='#201e1c';
   g.fillRect(x-2,y+1,w+4,h);
   g.fillStyle='#77716a';
   g.fillRect(x,y,w,h-2);
   g.fillStyle='#514b46';
   g.fillRect(x+2,y+h-2,w-2,2);
  }
  const age=(performance.now()-altarBrokenAt)/1100;
  if(!reduce.matches&&age>=0&&age<1){
   g.globalAlpha=(1-age)*.45;
   g.fillStyle='#b8a997';
   for(let i=0;i<9;i++){
    const size=5+Math.floor(age*9);
    g.fillRect(332+(i-4)*(8+age*9),120-age*(16+i*3),size*2,size);
   }
  }
  g.restore();
 }
 return {install,load,mapImage,roster,points,target,goal,npcs,drawNPC,afterBattle,interact,effects,chain};
})();
