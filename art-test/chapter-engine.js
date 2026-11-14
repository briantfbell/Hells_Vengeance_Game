'use strict';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d'),T=16,COLS=40,ROWS=25;
const SCREEN={width:640,height:480,worldHeight:400,mapTop:40,combatDock:112};
ctx.imageSmoothingEnabled=false;
const OPENING_ROSTER=['freya','jamal','jason','draymus','guapo'],CORE=[...OPENING_ROSTER,'reese'],NAMES={freya:'Freya',jamal:"J’Mal",jason:'Jason',draymus:'Draymus',guapo:'El Guapo',reese:'Reese',corrine:'Corrine · Asmodean Clergy',barzillai:'Barzillai Thrune',fex:'Archbaron Darellus Fex',viggo:'Viggo · Dawnflower Swordmaster',nox:'Nox',cultist:'Zealot'};
const STATS={freya:{hp:38,ac:17,atk:6,dmg:[1,10,4]},jamal:{hp:30,ac:16,atk:7,dmg:[1,4,5]},jason:{hp:32,ac:15,atk:4,dmg:[1,8,2]},draymus:{hp:26,ac:13,atk:3,dmg:[1,4,1]},guapo:{hp:34,ac:15,atk:6,dmg:[1,6,3]},reese:{hp:30,ac:15,atk:6,dmg:[1,8,2]},viggo:{hp:34,ac:14,atk:5,dmg:[1,8,2]},cultist:{hp:12,ac:12,atk:3,dmg:[1,6,0]}};
const SPECIAL={freya:{name:'Challenge',uses:1,bonus:0,dmg:[1,10,5]},jamal:{name:'Sneak Attack',uses:2,dmg:[1,4,5]},jason:{name:'Burning Hands',uses:2,auto:true,dmg:[1,4,0]},draymus:{name:'Chill Touch',uses:3,dmg:[1,6,0]},guapo:{name:'Panache Thrust',uses:3,bonus:2,dmg:[1,6,5]},reese:{name:'Aimed Shot',uses:3,bonus:2,dmg:[1,8,2]}};
const BASE_STATS=structuredClone(STATS),BASE_SPECIAL=structuredClone(SPECIAL);
let inventory=Inventory.fresh();
let progression=Progression.fresh(),levelOpen=false,levelResolve=null;
const INTERACTION_RADIUS=56;
const WEAPONS={freya:'katana',jamal:'dagger',jason:'mace',draymus:'dagger',guapo:'rapier',reese:'bow'};
const ATTACKS={freya:'slashes with her katana',jamal:'lunges with his dagger',jason:'swings his mace',draymus:'strikes with his dagger',guapo:'thrusts his rapier',reese:'looses an arrow from his bow'};
const SKILL_TEXT={freya:'challenges the foe and cuts with her katana',jamal:'finds an opening for a Sneak Attack',jason:'casts Burning Hands',draymus:'strikes with Chill Touch',guapo:'lunges with a Panache Thrust',reese:'steadies his bow for an Aimed Shot'};
const DIR={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]},KEY={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',Shift:'run'};
const scenes={
 street:{name:'Kintargo · Night of Ashes',image:'kintargo-map.png',walk:[{x:240,y:8,w:104,h:296},{x:256,y:304,w:88,h:88},{x:16,y:160,w:560,h:48},{x:576,y:176,w:48,h:16},{x:136,y:136,w:104,h:24}],blocks:[],points:[{id:'silver',x:142,y:132,label:'Enter the Silver Star'},{id:'guard',x:472,y:184,label:'Speak to Dottari'},{id:'ship',x:608,y:184,label:'Reach the rendezvous with Nox'}],lights:[[22,30],[140,27],[19,119],[223,20],[163,62],[122,107],[366,67],[399,114],[474,38],[510,36],[573,117],[581,170],[585,231],[365,230],[351,316],[235,279],[40,298],[171,342]]},
 tavern:{name:'The Silver Star · Musical Instruments',image:'silver-star-music-shop-v2.png',walk:[{x:48,y:128,w:544,h:160},{x:256,y:88,w:128,h:296},{x:272,y:112,w:320,h:32}],blocks:[{x:88,y:160,w:120,h:80},{x:424,y:160,w:128,h:80}],points:[{id:'barkeep',x:264,y:120,label:'Speak to the shopkeeper'},{id:'rope',x:584,y:112,label:'Examine bell rope'},{id:'stairs',x:536,y:136,label:'Descend to the temple'},{id:'outside',x:312,y:360,label:'Return to Kintargo'}],lights:[[94,84],[210,84],[228,35],[283,35],[356,35],[410,35],[35,132],[607,132],[153,181],[480,181],[277,330],[368,330]]},
 temple:{name:'Beneath the Silver Star',image:'chapter-temple.png',walk:[{x:48,y:96,w:544,h:224},{x:272,y:320,w:96,h:64}],blocks:[{x:160,y:104,w:56,h:88},{x:424,y:104,w:56,h:88},{x:160,y:216,w:56,h:80},{x:424,y:216,w:56,h:80}],points:[{id:'altar',x:312,y:112,label:'Approach Viggo'},{id:'upstairs',x:312,y:360,label:'Return to the Silver Star'}],lights:[[45,117],[46,198],[256,46],[380,46],[274,62],[366,62],[212,160],[434,160],[212,268],[432,268],[74,300],[566,300],[252,352],[390,352]]}
};
const lines={street:{freya:'Quiet. In and out. Barzillai does not forgive noise.',jamal:'Nice night for it. Door is up there. Try not to kick it in.',jason:'The flames are a blessing. Asmodeus favors the thorough.',draymus:'So many bodies in a fire. Nobody will notice one more going missing.',guapo:'If we die tonight, I want it on record that I was not paid.'},tavern:{freya:'Search the room. Quickly.',jamal:'Trapdoor. Has to be. Check the corners.',jason:'Can you smell the incense? It is under us.',draymus:'The floor creaks differently over there.',guapo:'I will guard the door. From the inside. Near the instruments.'}};
const SAVE='hells-bubbies-night-of-ashes-v1',keys=new Set(),art={},sheets={},CANCEL=Symbol('cancel');
let dialogOpenedAt=0;
let introOpen=false,introIndex=0,briefingOpen=false,journeyOpen=false,journeyResolve=null;
let ready=false,scene='street',lead='freya',units=[],trail=[],path=[],epoch=0,dialogResolve=null,dialogOpen=false,taskBusy=false,battle=null,last=0,showPaths=false,fx=[],flicker=[],lastPartyPaint=-1,quest={},hp={},uses={},potions=2,mendUses=2;
const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);},cell=(x,y)=>[Math.floor(x/T),Math.floor(y/T)],inside=(x,y,r)=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h;
const delay=ms=>new Promise(r=>setTimeout(r,ms)),dice=n=>1+Math.floor(Math.random()*n);
function dieMarkup(sides,value){const i=[4,6,8,10,20].indexOf(sides);return '<div class="die" aria-label="D'+sides+' rolled '+value+'"><div class="die-art"><canvas width="64" height="64" data-die="'+(i<0?4:i)+'" aria-hidden="true"></canvas><span class="die-number">'+value+'</span></div><small aria-hidden="true">D'+sides+'</small></div>';}
async function rollDice(label,sides,count=1,modifier=0,context='',fixed=null){
 const token=epoch,values=fixed||Array.from({length:count},()=>dice(sides)),total=values.reduce((a,b)=>a+b,modifier),panel=$('dice-panel');
 panel.hidden=false;panel.classList.add('rolling');panel.dataset.rollSize=values.length===1?'single':values.length===2?'pair':'pool';$('dice-label').textContent=label;$('dice-result').textContent='Rolling…';
 const paint=vals=>{$('dice-tray').innerHTML=vals.map(v=>dieMarkup(sides,v)).join('');window.PresentationPolish?.paintDice();};paint(values);
 let tick=0;const timer=reduce.matches?null:setInterval(()=>{if(token!==epoch){clearInterval(timer);return;}paint(values.map((v,i)=>(v+ ++tick+i)%sides+1));},70);
 await delay(reduce.matches?80:420);if(timer)clearInterval(timer);if(token!==epoch)throw CANCEL;
 paint(values);panel.classList.remove('rolling');$('dice-result').textContent=values.join(' + ')+(modifier?' '+(modifier>0?'+ ':'− ')+Math.abs(modifier):'')+' = '+total+(context?'\n'+context:'');
 await delay(reduce.matches?120:330);if(token!==epoch)throw CANCEL;return total;
}
async function storyRoll(label,face,modifier,outcome){return rollDice(label,20,1,modifier,outcome+' · Story roll',[face]);}
async function damage(spec,label,fixed=null){return rollDice(label,spec[1],spec[0],spec[2],'',fixed);}
function point(id){return scenes[scene].points.find(p=>p.id===id);}
function actorBlocking(x,y,which=scene){return (which===scene&&quest.chapter2&&(window.BarleybridgeScout?.npcs()||window.IlniusFountain?.npcs()||window.DinyarRecon?.npcs()||window.MolthuneCoffin?.npcs()||window.SkadiParley?.npcs()||window.DarkRain?.npcs()||window.TathlumHunt?.npcs()||window.Menador?.npcs()||window.BarrowCovenant?.npcs()||window.BarrowTrail?.npcs()||window.VyreWish?.npcs()||window.SethicMansion?.npcs()||window.BellflowerBarn?.npcs()||window.BellflowerBarge?.npcs()||window.Pezzack?.npcs()||window.Rachikan?.npcs()||window.Ballerina?.npcs()||window.HinjiTavern?.npcs()||window.Belde?.npcs()||window.PaleBall?.npcs()||window.NicoloArc?.npcs()||window.SethicLedgers?.npcs()||window.SethicFarm?.npcs()||window.EgorianFeud?.npcs()||window.EgorianSting?.npcs()||window.EfisioArc?.npcs()||window.Hinji?.npcs()||window.Westcrown?.npcs()||window.RemesianaMarket?.npcs()||window.EgorianFountain?.npcs()||window.EgorianDischarge?.npcs()||window.AregoExit?.npcs()||window.AregoReturn?.npcs()||window.AregoAmbush?.npcs()||window.InfernoGate?.npcs()||window.FortArego?.npcs()||window.SenaraGraveyard?.npcs()||window.SenaraWagon?.npcs()||window.WhisperwoodGlade?.npcs()||window.WhisperwoodCamp?.npcs()||window.SenaraCitadel?.npcs()||window.SenaraDaggers?.npcs()||window.SenaraCover?.npcs()||window.SenaraArrival?.npcs()||window.EgorianExecution?.npcs()||window.EgorianMort?.npcs()||window.EgorianTrial?.npcs()||window.EgorianNight?.npcs()||window.EgorianArrival?.npcs()||window.SouthRoad?.npcs()||window.KantariaAftermath?.npcs()||window.FastnessArc?.npcs()?.filter(unit=>unit.hp!==0)||window.SupplyArc?.npcs()||DisruptionArc.npcs()||KantariaArc.npcs()||CourtArc.npcs()||FortArc.npcs()||ArmoryArc.npcs()||ChurchArc.npcs()||PoliticalMovement.npcs()||DebtsRumors.npcs()||LastStand.npcs()||(quest.chapter3?window.NextArc.npcs():window.NextChapter.npcs())).some(p=>Math.hypot(x-p.x,y-p.y)<12))||scenes[which].points.some(p=>['guard','barkeep'].includes(p.id)&&Math.hypot(x-p.x,y-p.y)<12);}
function passable(gx,gy,which=scene){if(gx<0||gy<0||gx>=COLS||gy>=ROWS)return false;const x=gx*T+8,y=gy*T+8,s=scenes[which];return s.walk.some(r=>inside(x,y,r))&&!s.blocks.some(r=>inside(x,y,r))&&!actorBlocking(x,y,which);}
function findPath(from,to,which=scene){if(!passable(...to,which))return null; // Allow walking out of a cell occupied by a newly revealed NPC.
const q=[from],prev=new Map([[from.join(','),null]]);for(let i=0;i<q.length;i++){const a=q[i],key=a.join(',');if(key===to.join(',')){let k=key,result=[];while(prev.get(k)!==null){result.unshift(k.split(',').map(Number));k=prev.get(k);}return result;}for(const [dx,dy] of Object.values(DIR)){const n=[a[0]+dx,a[1]+dy],k=n.join(',');if(passable(...n,which)&&!prev.has(k)){prev.set(k,key);q.push(n);}}}return null;}
function soloScout(){return scene==='tannery'&&!quest.scouted;}
function soloParty(){return soloScout()||window.ChurchArc?.soloFlank()||(scene==='bathroom'&&!quest.bathStarted)||PoliticalMovement.soloWatch();}
function partyRoster(){return window.NextChapter?.rosterOverride?.()||window.BarleybridgeScout?.roster()||window.IlniusFountain?.roster()||window.DinyarRecon?.roster()||window.MolthuneCoffin?.roster()||window.SkadiParley?.roster()||window.DarkRain?.roster()||window.TathlumHunt?.roster()||window.Menador?.roster()||window.BarrowCovenant?.roster()||window.BarrowTrail?.roster()||window.VyreWish?.roster()||window.SethicMansion?.roster()||window.BellflowerBarn?.roster()||window.BellflowerBarge?.roster()||window.Pezzack?.roster()||window.Rachikan?.roster()||window.Ballerina?.roster()||window.HinjiTavern?.roster()||window.PaleBall?.roster()||window.EfisioArc?.roster()||window.EgorianFountain?.roster()||window.EgorianDischarge?.roster()||window.AregoExit?.roster()||window.AregoReturn?.roster()||window.AregoAmbush?.roster()||window.SenaraDaggers?.roster()||window.SenaraCover?.roster()||window.SenaraArrival?.roster()||window.EgorianExecution?.roster()||window.EgorianMort?.roster()||window.EgorianTrial?.roster()||window.EgorianNight?.roster()||window.SouthRoad?.roster()||window.SupplyArc?.roster()||window.CovertArc?.roster()||DisruptionArc.roster()||KantariaArc.roster()||CourtArc.roster()||FortArc.roster()||ArmoryArc.roster()|| (soloParty()?['jamal']:(quest.activeRoster||(quest.reeseJoined?CORE:OPENING_ROSTER)));}
function finished(){return !!quest.guapoBanquetComplete;}
function seedParty(x,y,dir='up'){
 const start=cell(x,y),seen=new Set([start.join(',')]);trail=[start];let cur=start,heading=dir==='up'?'down':'up';
 for(let i=0;i<16;i++){let next=null;for(const d of [heading,'left','right','up','down']){const v=DIR[d],a=[cur[0]+v[0],cur[1]+v[1]];if(passable(...a)&&!seen.has(a.join(','))){next=a;heading=d;break;}}if(!next)break;trail.push(next);seen.add(next.join(','));cur=next;}
 const front=soloParty()?'jamal':partyRoster().includes(lead)?lead:partyRoster()[0];units=[front,...partyRoster().filter(id=>id!==front)].map((id,i)=>{const c=trail[Math.min(i*2,trail.length-1)];return {id,x:c[0]*T+8,y:c[1]*T+8,dir,step:null,anim:0};});path=[];keys.clear();
}
function setScene(next,x,y,dir='up'){$('dice-panel').hidden=true;scene=next;if(PoliticalMovement.soloWatch()){x=168;y=280;dir='right';}if(soloScout()){x=136;y=280;dir='right';}seedParty(x,y,dir);buildFlicker();$('location-name').textContent=scenes[next].name;updateObjective();window.NextChapter.syncRoster();save();}
const JOURNEYS={
 street:'Return to Kintargo’s streets. Keep the operation quiet and follow the route to the next objective.',
 tavern:'Shensen, the famous actress, is absent from her musical instrument shop, the Silver Star. Jason searches for the entrance to the hidden temple of Sarenrae.',
 temple:'Descend beneath the Silver Star. Find Viggo, end the temple, and leave the false evidence.',
 western_star:'Kintargo falls behind the party. The first stop on the voyage is Pezzack.',
 remesiana:'10 Neth, 4716. The Western Star reaches Remesiana. The company has time to shop before Freya meets her contact.',
 last_stand:'The posted decree has been torn down. Repost it while J’Mal watches the back door. Subdue resistance and take the prisoners to jail.',
 angel_hill:'Riley describes a meeting two miles outside Longacre. Keep him under guard and inspect the hill before returning to the jail.',
 tannery:'Cimri leads the party northwest to Longacre, where they return the rental horses. Louslik Tannery lies about a mile west of town.',
 ash_house:'Cimri guides the party to the ruined Ash House. Razelago waits behind the screens.',
 bathroom:'J’Mal investigates the splashing alone. His companions wait on the landing.',
 longacre_square:'Enter Longacre’s church square and carry out Razelago’s instructions.',
 longacre_jail:'Head to the western gate and jail. Deliver the remaining decrees and the separate order dismissing Rhona.',
 scarlet_manor:'The household servant brings the party to Fex’s office. The Archbaron is waiting inside.'
};
function cancelJourney(){const resolve=journeyResolve;journeyResolve=null;journeyOpen=false;$('journey').hidden=true;$('journey').classList.remove('visible');$('journey-continue').disabled=true;if(resolve)resolve();}
async function journeyCard(title,summary,commit=()=>{},illustration=null,{outro=false}={}){
 const token=epoch,panel=$('journey'),button=$('journey-continue');journeyOpen=true;keys.clear();path=[];$('prompt').hidden=true;$('dice-panel').hidden=true;
 panel.classList.toggle('illustrated',!!illustration);
 panel.classList.toggle('campaign-outro',outro);
 panel.querySelector('.eyebrow').textContent=outro?'Folken Games presents':'HELL’S VENGEANCE · THE JOURNEY';
 button.textContent=outro?'Return to main menu':'Continue ↵';
 const gradient=outro?'transparent 72%, #100d14b0 81%, #100d14':'transparent 42%, #100d14eb 68%, #100d14';
 const card=panel.querySelector('.journey-card');
 PresentationPolish.setJourneyEffects(card,illustration);
 card.style.backgroundImage=illustration
  ? `linear-gradient(${gradient}), url("art-test/${illustration}")`
  : '';
 $('journey-title').textContent=title;$('journey-summary').textContent=panel.classList.contains('decree-page')?summary:summary.replace(/(?<!\bSt)([.!?])[ \t]+(?=[A-Z])/g,'$1\n');button.disabled=true;panel.hidden=false;panel.classList.add('visible');
 commit();button.disabled=false;panel.scrollIntoView({block:'start'});button.focus({preventScroll:true});await new Promise(resolve=>journeyResolve=resolve);if(token!==epoch)throw CANCEL;
 button.disabled=true;journeyOpen=false;keys.clear();canvas.focus({preventScroll:true});save();
 // Keep the black card covering the map until the next card, dialogue or end of the scene.
}
$('journey-continue').onclick=()=>{if(!journeyOpen||$('journey-continue').disabled||!journeyResolve)return;const resolve=journeyResolve;journeyResolve=null;$('journey-continue').disabled=true;resolve();};
const JOURNEY_ART={
 western_star:'transition-western-star-v1.png',
 church_asmodeus:'church-ruins-v1.png',
 court_lower:'court-platforms-v1.png',
 fungus_shelter:'transition-uskwood-fire-v1.png',
 fastness_hall:'transition-valors-fastness-v1.png',
 egorian_bridge:'egorian-west-bridge-v1.png',
 whisperwood_unicorn_glade:'whisperwood-unicorn-glade-v1.png',
 arego_inferno_gate:'transition-inferno-gate-v1.png',
 egorian_sting_hall:'transition-egorian-sting-v1.png',
 egorian_pale_graveyard:'transition-night-of-the-pale-v1.png',
 barrow_covenant:'transition-fourteenth-stone-v1.png',
 darkrain_skull_slope:'darkrain-skull-v1.png',
 nidal_arrival_court:'transition-split-missions-v1.png',
 dinyar_bridge_ward:'dinyar-bridge-ward-v1.png'
};
async function travel(next,x,y,dir='up'){
 let summary=JOURNEYS[next];
 if(next==='western_star'&&quest.voyagePezzack)summary='The Western Star casts off from Pezzack. The crew keeps watch along the coast.';
 if(next==='church_watch'&&quest.watchStarted)summary='After resting at Ash House, J’Mal watches the church alone into the evening. Meet any movement with care.';
 if(next==='street'&&quest.burned)summary='The Silver Star burns. Slip away under Freya’s cover.';
 if(next==='tavern'&&quest.burned)summary='Smoke rises from the cellar. The party carries J’Mal out under cover of the fire.';
 if(next==='ash_house'&&quest.payroll&&!quest.reward)summary='At the river, Jamal washes the tannery off. Cimri leads the party to Ash House. Deliver the payroll to the employer behind the screens.';
 else if(next==='ash_house'&&quest.chapter3)summary=quest.sermonDispersed?'Return to Razelago and report the party’s work in Longacre.':'Meet Razelago before heading to the sermon.';
 else if(next==='ash_house'&&quest.spiritCalmed)summary='Return downstairs. Jamal is safe and the spirit is quiet. Report to Razelago in the morning.';
 if(next==='ash_house'&&quest.chapter6)summary=!quest.ovinnikReported?'Bring the still-living gate guardian to Razelago. Learn what attacked the party.':'The party withdraws from the church standoff. Rest at Ash House before J’Mal’s evening watch.';
 if(next==='longacre_jail')summary=quest.chapter4?(quest.hillSearched?'Return with Riley after the unsuccessful hill search. Check on Bolgart in custody.':'Escort and question the prisoners at the jail.'):quest.rhonaDismissed?'Return to the jail, now staffed by retained deputies and replacement guards.':quest.decreesIssued?'Post the jail’s copy of the notices and deliver the party’s separate dismissal of Rhona.':'Visit the western gate and jail.';
 if(next==='longacre_square')summary=!quest.sermonDispersed?'The church square is gathering for Allamar’s sermon. Listen to her claims and counter the talk of rebellion.':quest.deputiesReported&&!quest.tavernNoticeTorn&&!quest.compactSworn?'After a quiet night at Ash House, the party crosses Longacre on its way to Scarlet Manor. Check the public notices along the way.':'Return to the square. '+QuestGuide.current().text;
 const illustration=next==='arego_inferno_gate'&&quest.aregoGateSurveyed?null:JOURNEY_ART[next];
 await journeyCard(scenes[next].name,summary,()=>setScene(next,x,y,dir),illustration);
}
function storySectionLabel(q,location){
 if(location==='guapo_party_boat')return 'Epilogue';
 if(q.barleybridgeReached)return 'The Tathlum · Barleybridge';
 if(q.ilniusForestReached)return 'The Tathlum · St. Ilnius';
 if(q.westcrownOrdersReached)return 'Freya’s Westcrown orders';
 if(q.dinyarReached)return 'The Tathlum · Citadel Dinyar';
 if(q.nidalOperationSought)return 'The Tathlum · The company divides';
 if(q.molthuneReached)return 'The Tathlum · Molthune';
 if(q.tathlumOrdersReached)return 'The Tathlum expedition';
 if(q.menadorReached)return 'The Menador meeting';
 if(q.covenantReached)return 'The Covenant of Hell';
 if(q.barrowRoadReached)return 'The Barrowood pilgrimage';
 if(q.egorianFountainOrders)return 'Operations across Cheliax';
 if(q.aregoEgorianEscaped)return 'Return to Egorian';
 if(q.aregoApproachReached)return 'Fort Arego and the Inferno Gate';
 if(q.senaraGarrisonSeen||location==='senara_waterfront')return 'Senara and the Whisperwood';
 if(q.egorianBridgeMet||location==='egorian_bridge')return 'The Egorian proceedings';
 if(location.startsWith('south_road'))return 'The South Road';
 if(q.chapter15)return 'Chapter Fifteen · Valor’s Fastness';
 if(q.chapter14)return 'Chapter Fourteen · Stranglehold';
 if(q.chapter13)return 'Chapter Thirteen · Quiet Knives';
 if(q.chapter12)return 'Chapter Twelve · Kantaria’s defenses';
 if(q.chapter11)return 'Chapter Eleven · Hardship’s Hearth';
 if(q.chapter10)return 'Chapter Ten · Court of Spears';
 if(q.chapter9)return 'Chapter Nine · Fort Estazano';
 if(q.chapter8)return 'Chapter Eight · Rumors and the Armory';
 if(q.chapter7)return 'Chapter Seven · The Missing Dead';
 if(q.chapter6)return 'Chapter Six · Political Movement';
 if(q.chapter5)return 'Chapter Five · Debts and Rumors';
 if(q.chapter4)return 'Chapter Four · The Last Stand';
 if(q.chapter3)return 'Chapter Three · Longacre';
 if(q.chapter2)return 'Chapter Two · Voyage to Longacre';
 return 'Prologue · Kintargo';
}
function updateObjective(){
 $('story-section').textContent=storySectionLabel(quest,scene);
 const cover=window.BarleybridgeScout?.goal()||window.IlniusFountain?.goal()||window.DinyarRecon?.goal()||window.MolthuneCoffin?.goal()||window.SkadiParley?.goal()||window.DarkRain?.goal()||window.TathlumHunt?.goal()||window.Menador?.goal()||window.BarrowCovenant?.goal()||window.BarrowTrail?.goal()||window.VyreWish?.goal()||window.SethicMansion?.goal()||window.BellflowerBarn?.goal()||window.BellflowerBarge?.goal()||window.Pezzack?.goal()||window.Rachikan?.goal()||window.Ballerina?.goal()||window.HinjiTavern?.goal()||window.Belde?.goal()||window.PaleBall?.goal()||window.NicoloArc?.goal()||window.SethicLedgers?.goal()||window.SethicFarm?.goal()||window.EgorianFeud?.goal()||window.EgorianSting?.goal()||window.EfisioArc?.goal()||window.Hinji?.goal()||window.Westcrown?.goal()||window.RemesianaMarket?.goal()||window.EgorianFountain?.goal()||window.EgorianDischarge?.goal()||window.AregoExit?.goal()||window.AregoReturn?.goal()||window.AregoAmbush?.goal()||window.InfernoGate?.goal()||window.FortArego?.goal()||window.SenaraGraveyard?.goal()||window.SenaraWagon?.goal()||window.WhisperwoodGlade?.goal()||window.WhisperwoodCamp?.goal()||window.SenaraCitadel?.goal()||window.SenaraDaggers?.goal()||window.SenaraCover?.goal();
 if(cover){$('objective').textContent=cover;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}
 const senara=window.SenaraArrival?.goal();
 if(senara){$('objective').textContent=senara;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}
 const excruciation=window.EgorianExecution?.goal();
 if(excruciation){$('objective').textContent=excruciation;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}
 const mort=window.EgorianMort?.goal();
 if(mort){$('objective').textContent=mort;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}
 const trial=window.EgorianTrial?.goal();
 if(trial){$('objective').textContent=trial;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}
 const night=window.EgorianNight?.goal();
 if(night){$('objective').textContent=night;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}
 const egorian=window.EgorianArrival?.goal();
 if(egorian){$('objective').textContent=egorian;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}
 const road=window.SouthRoad?.goal();
 if(road){$('objective').textContent=road;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}
 const aftermath=window.KantariaAftermath?.goal();
 if(aftermath){$('objective').textContent=aftermath;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}
 const fastness=window.FastnessArc?.goal();
 if(fastness){$('objective').textContent=fastness;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}
 const fourteenth=window.SupplyArc?.goal();if(fourteenth){$('objective').textContent=fourteenth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const thirteenth=window.CovertArc?.goal();if(thirteenth){$('objective').textContent=thirteenth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const twelfth=DisruptionArc.goal();if(twelfth){$('objective').textContent=twelfth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const eleventh=KantariaArc.goal();if(eleventh){$('objective').textContent=eleventh;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const tenth=CourtArc.goal();if(tenth){$('objective').textContent=tenth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const ninth=FortArc.goal();if(ninth){$('objective').textContent=ninth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const eighth=ArmoryArc.goal();if(eighth){$('objective').textContent=eighth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const seventh=ChurchArc.goal();if(seventh){$('objective').textContent=seventh;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const sixth=PoliticalMovement.goal();if(sixth){$('objective').textContent=sixth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const fifth=DebtsRumors.goal();if(fifth){$('objective').textContent=fifth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const fourth=LastStand.goal();if(fourth){$('objective').textContent=fourth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}if(window.NextArc.objective()||window.NextChapter.objective())return;
 $('objective').textContent=battle?'Defeat Viggo and the zealots.':quest.done?'A voyage south, then Longacre.':scene==='street'?(quest.burned?'Leave Kintargo under cover.':'Find the Silver Star.'):scene==='tavern'?(quest.burned?'Return to the street.':quest.ropeCut?'The bell is silent. Find the stairs.':'Find the way down.'):quest.victory?(quest.planted?'Destroy the temple.':'Take the scimitar. Plant the rapier.'):'Approach the altar.';
 $('status').textContent=quest.done?'Chapter complete. Remesiana, then the road to Longacre.':battle?'Choose an enemy, then attack or use an ability. Select a companion to receive healing.':quest.burned?'The Silver Star burns. Slip away under Freya’s cover.':'WASD / arrows to walk · Shift to run · E to interact · Click to move';
}
function save(){if(battle||!ready||introOpen)return;try{localStorage.setItem(SAVE,JSON.stringify({version:2,scene,lead,quest,hp,uses,potions,mendUses,progression,inventory,position:units[0]?{x:units[0].step?.sx||units[0].x,y:units[0].step?.sy||units[0].y}:null}));$('save-status').textContent='Checkpoint saved';}catch{$('save-status').textContent='Checkpoint unavailable';}}
function clearDialog(){const resolve=dialogResolve;dialogResolve=null;dialogOpen=false;$('dialog').hidden=true;keys.clear();if(resolve)resolve(null);}
function say(name,text,choices=null){const textLimit=choices?150:240;if(text.length>textLimit){const words=text.split(/\s+/),pages=[];let page='';for(const word of words){if((page+' '+word).length>textLimit){pages.push(page);page=word;}else page+=(page?' ':'')+word;}if(page)pages.push(page);return (async()=>{let result;for(let i=0;i<pages.length;i++)result=await say(name,pages[i],i===pages.length-1?choices:null);return result;})();}if(!journeyOpen)$('journey').hidden=true;if(!battle&&name!=='Intimidation')$('dice-panel').hidden=true;const token=epoch;dialogOpen=true;dialogOpenedAt=performance.now();keys.clear();path=[];$('speaker').textContent=name?NAMES[name]||name:'Chronicle';paintPortrait(name);if(typeof name==='string'&&name.startsWith('citizen-'))$('speaker').textContent=['Townsman','Townswoman','Laborer','Local Resident','Elderly Townsman','Market Woman','Young Laborer','Local Weaver'][townsfolk().find(u=>u.id===name)?.variant||0];$('line').textContent=text;$('dialog').classList.toggle('has-choices',!!choices);$('choices').replaceChildren();$('close').hidden=!!choices;$('dialog').hidden=false;$('prompt').hidden=true;
 if(choices)choices.forEach((text,i)=>{const b=document.createElement('button');b.textContent=(i+1)+'. '+text;b.onclick=()=>finishDialog(i);$('choices').append(b);});
 canvas.scrollIntoView({block:'nearest'});
 (choices?$('choices').firstChild:$('close')).focus({preventScroll:true});
 return new Promise(r=>dialogResolve=r).then(v=>{if(token!==epoch)throw CANCEL;return v;});
}
function paintPortrait(name){
 let id=({ 'Freya Kusanagi':'freya','Dottari Guard':'guard','Shopkeeper':'cultist','Outfitter':'farmer','The Woman in the Bath':'spirit' })[name]||name;if(id==='razelago'&&quest.compactSworn)id='razelago_revealed';const c=$('portrait'),g=c.getContext('2d');let im,f;
 if(window.FUTURE_NPCS?.[id]){const m=window.FUTURE_NPCS[id];im=art[m.source];f=m.frame;}
 if(window.NEXT_NPCS?.[id]){im=art.nextNPCs;f=window.NEXT_NPCS[id];}
 if(window.QUESTGIVER_MODELS[id]){im=art[id];f=window.QUESTGIVER_MODELS[id].frames[0];}
 else if(ROSTER.includes(id)){im=sheets[id];f=window.PARTY_FRAMES[id].frames[0];}
 else if(['viggo','cultist'].includes(id)){im=art.npcs;f=window.CHAPTER_NPCS[id];}
 else if(id==='guard'){im=art.guard;f={x:0,y:0,w:im.width,h:im.height};}
 if(id==='reese'&&art['reese-portrait']){im=art['reese-portrait'];f={x:385,y:48,w:290,h:290};}
 if(id==='corrine'){f={x:211,y:45,w:132,h:132};}
 if(window.LORE_CAST?.[id]){const m=LORE_CAST[id];im=art[m.source]||art[id];f=m.frame;}
 if(typeof name==='string'&&name.startsWith('citizen-')){c.hidden=false;$('dialog').classList.add('has-portrait');PresentationPolish.citizenPortrait(name,g);return;}
  if(['Townsfolk','Tavern patron'].includes(name)){im=art.citizens;f=CITIZEN_FRAMES[0].frames[0];}
 c.hidden=!im;$('dialog').classList.toggle('has-portrait',!!im);if(!im)return;
 g.clearRect(0,0,96,96);g.imageSmoothingEnabled=false;g.fillStyle='#252c35';g.fillRect(0,0,96,96);
 if(id==='razelago_revealed'&&!window.LORE_CAST?.[id]){g.drawImage(im,1130,42,220,220,3,3,90,90);return;}const crop=window.DIALOGUE_FACE_CROPS?.[id];if(crop){g.drawImage(im,crop.x,crop.y,crop.w,crop.h,3,3,90,90);return;}if(['corrine','reese'].includes(id)){g.drawImage(im,f.x,f.y,f.w,f.h,3,3,90,90);return;}const side=Math.min(f.w,f.h*.32),cx=f.x+f.w/2;
 g.drawImage(im,Math.max(f.x,Math.min(cx-side/2,f.x+f.w-side)),f.y,side,side,3,3,90,90);
}
function syncBattleView(){const on=!!battle;document.body.classList.toggle('is-combat',on);}
function battlefieldHeight(){return SCREEN.height-SCREEN.combatDock;}
function battlePosition(actor){
 if(actor.id==='kuribu'&&battle?.kind.startsWith('church_'))return {x:480,y:42,height:38};
 if(actor.id==='cimri'&&battle?.kind.startsWith('church_'))return {x:212,y:222,height:56};
 const i=units.indexOf(actor),floor=battlefieldHeight()-46;
 if(i>=0){const spacing=units.length>1?540/(units.length-1):0;return {x:units.length>1?50+i*spacing:320,y:floor,height:actor.id==='freya'&&['church_hall','church_sanctuary','church_allamar'].includes(battle?.kind)?130:activeUnit()===actor?116:108};}
 const index=Math.max(0,battle?.enemies.indexOf(actor)??0),count=battle?.enemies.length||1;
 const x=count>=5?275+index*80:count===1?480:count===2?380+index*170:count===3?300+index*140:275+index*105;
 const height=actor.id==='parnoneryx'?132:actor.id==='bellflower_boarder'?72:actor.id==='devil_hog'?66:actor.id==='senara_balisse'?132:window.WhisperwoodGlade?.combatHeight(actor.id)||window.WhisperwoodCamp?.combatHeight(actor.id)||(count>=5?82:['viggo','bolgart_wereboar'].includes(actor.id)?116:count>=4?96:104);
 return {x,y:180,height};
}
function healthBadge(x,y,w,name,value,max,selected=false,enemy=false,status=''){
 ctx.save();ctx.fillStyle='#131922ed';ctx.strokeStyle=selected?'#e4c581':'#766343';ctx.lineWidth=selected?2:1;ctx.beginPath();ctx.moveTo(x-w/2+5,y);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w/2,y+27);ctx.lineTo(x-w/2,y+27);ctx.lineTo(x-w/2,y+5);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.textAlign='left';ctx.font='10px FolkenPixel';ctx.fillStyle=selected?'#f4d795':'#e4d5b9';
 const label=name.replace(/^(Sanctuary |Church |Porch )/,'').replace('El Guapo','Guapo').replace('Celestial Wolf','Cel. Wolf').replace(/^(Loran|Lacall) Allamar$/,'$1');
 const available=w-12;
 let fontSize=10;
 while(fontSize>8&&ctx.measureText(label).width>available){
  fontSize--;
  ctx.font=fontSize+'px FolkenPixel';
 }
 ctx.fillText(label,x-w/2+6,y+10,available);
 if(status){ctx.font='9px FolkenPixel';ctx.fillStyle='#bcb8ab';ctx.fillText(status,x-w/2+6,y+21);ctx.restore();return;}
 ctx.font='9px FolkenPixel';ctx.fillStyle='#bcb8ab';ctx.fillStyle=value===0?'#dc9a87':'#bcb8ab';ctx.fillText(value===0?'DOWN':value+'/'+max,x-w/2+6,y+21);
 const barX=x-w/2+38,barW=w-44;rect(barX,y+16,barW,5,'#35333a');rect(barX,y+16,barW*Math.max(0,value/max),5,enemy?'#b86454':'#9dab77');if(selected){ctx.fillStyle='#e4c581';ctx.beginPath();ctx.moveTo(x-4,y-5);ctx.lineTo(x+4,y-5);ctx.lineTo(x,y-1);ctx.fill();}ctx.restore();
}
async function animateAction(actor,target,type,hit=true,onImpact=null){
 const token=epoch,duration=reduce.matches?120:actor.id==='reese'&&['attack','special'].includes(type)?760:['special','dismissal','purge'].includes(type)?780:['potion','mend'].includes(type)?720:600;
 const action={actor,target,type,hit,start:performance.now(),duration};battle.animation=action;
 GameAudio.effect(['balisse_flame','parnoneryx_breath'].includes(type)?'fire':(type==='dismissal'||type==='purge'||type.startsWith('arego_'))?'spell':['potion','mend'].includes(type)?'heal':type==='special'&&actor.id==='jason'?'fire':type==='special'&&actor.id==='draymus'?'spell':hit?'confirm':'miss');
 await delay(duration*.62);if(token!==epoch||!battle)throw CANCEL;onImpact?.();
 await delay(duration*.38);if(token!==epoch)throw CANCEL;if(battle?.animation===action)battle.animation=null;
}
function actionPose(u){const a=battle?.animation;if(!a||reduce.matches)return {dx:0,dy:0,tilt:0};if(a.actor!==u){const p=(performance.now()-a.start)/a.duration,q=(p-.62)/.28,reaction=a.target===u&&a.hit&&!['potion','mend','guard','smoke'].includes(a.type)&&q>=0&&q<=1?Math.sin(q*Math.PI):0;return {dx:reaction*5,dy:-reaction*2,tilt:reaction*.055};}const p=Math.min(1,(performance.now()-a.start)/a.duration),from=battlePosition(u),to=battlePosition(a.target||u),d=Math.hypot(to.x-from.x,to.y-from.y)||1,stride=Math.sin(p*Math.PI)*(['reese','ilnius_sylvestra'].includes(u.id)?0:['mend','potion','dismissal','purge'].includes(a.type)?2:a.type==='guard'?0:a.type==='special'&&['jason','draymus'].includes(u.id)?5:a.type==='special'&&u.id==='freya'?28:18);return {dx:(to.x-from.x)/d*stride,dy:(to.y-from.y)/d*stride,tilt:Math.sin(p*Math.PI)*.08};}
function renderAction(){const a=battle?.animation;if(!a)return;if(window.DinyarRecon?.effect(ctx,a)||window.AregoAmbush?.effect(ctx,a)||window.SenaraGraveyard?.effect(ctx,a)||window.SenaraWagon?.effect(ctx,a)||window.SenaraDaggers?.effect(ctx,a))return;if(a.type==='smoke'&&window.PresentationPolish){PresentationPolish.smoke(ctx,a);return;}const unarmed=a.type==='attack'&&unarmedWeapon(a.actor.id);if(!unarmed&&CombatArt.effect(ctx,a))return;const p=reduce.matches ? .6 : Math.min(1,(performance.now()-a.start)/a.duration),from=battlePosition(a.actor),to=battlePosition(a.target||a.actor),x=to.x,y=to.y-to.height*.55;ctx.save();ctx.globalAlpha=Math.sin(p*Math.PI)*.9;ctx.lineWidth=3;
 if(['reese','kuribu','ilnius_sylvestra'].includes(a.actor.id)&&['attack','special'].includes(a.type)){const flight=Math.max(0,Math.min(1,(p-.38)/.24)),sx=from.x+(a.actor.id==='ilnius_sylvestra'?-22:17),sy=from.y-from.height*.6,ax=sx+(x-sx)*flight,ay=sy+((a.hit?y:y+24)-sy)*flight,angle=Math.atan2(y-sy,x-sx);if(p>.38&&p<.72){ctx.translate(ax,ay);ctx.rotate(angle);ctx.globalAlpha=1;ctx.fillStyle='#dccba2';ctx.fillRect(-13,-1,20,2);ctx.fillStyle='#a5b4c0';ctx.fillRect(6,-2,4,4);ctx.fillStyle='#745949';ctx.fillRect(-14,-3,4,6);}ctx.restore();return;}

 if(p<.48||p>.88){ctx.restore();return;}
 const burst=(color)=>{ctx.strokeStyle=color;for(let i=0;i<8;i++){const angle=i*Math.PI/4,r=12+p*16;ctx.beginPath();ctx.moveTo(x+Math.cos(angle)*r*.4,y+Math.sin(angle)*r*.4);ctx.lineTo(x+Math.cos(angle)*r,y+Math.sin(angle)*r);ctx.stroke();}};
 if(a.type==='special'&&a.actor.id==='draymus'){ctx.strokeStyle='#a3bddc';ctx.beginPath();ctx.moveTo(from.x,from.y-45);ctx.quadraticCurveTo((from.x+x)/2,y-40,x,y);ctx.stroke();burst('#a3bddc');}
 else if(a.type==='special'&&a.actor.id==='jason'){burst('#ed975c');for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#e46846':'#eac16e';ctx.fillRect(x-18+i*8,y+10-Math.sin(p*Math.PI)*20-i%3*5,5,15);}}
 else if(a.type==='potion'||a.type==='mend'){ctx.fillStyle='#a5c994';ctx.fillRect(x-3,y-13,6,26);ctx.fillRect(x-13,y-3,26,6);}
 else if(a.type==='guard'){ctx.strokeStyle='#dcc486';ctx.beginPath();ctx.moveTo(from.x-19,from.y-40);ctx.lineTo(from.x,from.y-48);ctx.lineTo(from.x+19,from.y-40);ctx.lineTo(from.x+15,from.y-20);ctx.lineTo(from.x,from.y-10);ctx.lineTo(from.x-15,from.y-20);ctx.closePath();ctx.stroke();}
 else if(a.type==='smoke'){ctx.fillStyle='#aaa5b07a';for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(420+i*25,130+i%2*40,15+p*16,0,Math.PI*2);ctx.fill();}}
 else if(unarmed){if(a.hit)burst('#d4b981');}
 else if(a.type==='special'&&a.actor.id==='guapo'){ctx.strokeStyle='#e8ce89';ctx.beginPath();ctx.moveTo(from.x+12,from.y-42);ctx.lineTo(x,y);ctx.stroke();if(a.hit)burst('#e8ce89');}
 else{ctx.strokeStyle=a.actor.id.startsWith('deputy')?'#bd9470':a.hit?'#efe0b8':'#b0acaa';if(a.actor.id.startsWith('deputy'))ctx.lineWidth=6;const thrust=['jamal','guapo'].includes(a.actor.id);if(thrust){ctx.beginPath();ctx.moveTo(x-25,y+12);ctx.lineTo(x+16,y-8);ctx.stroke();if(a.type==='special'){ctx.beginPath();ctx.moveTo(x-15,y-15);ctx.lineTo(x+18,y+8);ctx.stroke();}}else{ctx.beginPath();ctx.arc(x,y,20,Math.PI*.8,Math.PI*1.8);ctx.stroke();}if(a.hit)burst('#d4b981');}
 ctx.restore();
}
function drawCombatIdle(g,u,v,t){if(unarmedWeapon(u.id)){const {dx,dy}=actionPose(u);drawActor(g,{...u,x:v.x+dx,y:v.y+dy,dir:'up',step:null},v.height);return true;}if(u.id==='jason'&&window.EgorianDischarge?.drawActor(g,{...u,x:v.x+actionPose(u).dx,y:v.y+actionPose(u).dy,dir:'right'},v.height))return true;if(window.InfernoGate?.drawCombat(g,u,v,t))return true;if(window.FortArego?.drawCombat(g,u,v,t))return true;if(window.SenaraGraveyard?.drawCombat(g,u,v,t))return true;if(window.WhisperwoodGlade?.drawCombat(g,u,v,t))return true;if(window.WhisperwoodCamp?.drawCombat(g,u,v,t))return true;if(window.SouthRoad?.drawCombat(g,u,v,t))return true;if(CombatArt.actor(g,u,v))return true;const m=window.COMBAT_IDLES?.[u.id],im=m&&art[m.src];if(!m||!im)return false;const a=battle?.animation,attacking=(m.attackFrames&&a?.actor===u&&a.type==='attack')||(u.id==='parnoneryx'&&a?.actor===u&&a.type==='parnoneryx_breath');const opening=window.IlniusFountain?.openingPose(u),phase=opening?.frame??(attacking?(reduce.matches?1:Math.min(2,Math.floor(CombatArt.phase(a)*3))):window.PresentationPolish?PresentationPolish.phase(u,t,m):reduce.matches||hp[u.id]===0||u.hp===0?0:m.cycle[Math.floor(t/.52)%m.cycle.length]),f=m.frames[phase]||m.frames[0],scale=v.height/m.maxHeight;g.save();g.imageSmoothingEnabled=false;const pose=opening||actionPose(u);g.translate(v.x+pose.dx+(u.flash&&!reduce.matches?Math.sin(u.flash*60)*3:0),v.y+pose.dy-(u.lunge?Math.sin(u.lunge/.22*Math.PI)*5:0));g.rotate(pose.tilt);if(m.flipX)g.scale(-1,1);if(hp[u.id]===0||u.hp===0)g.globalAlpha=.25;else if(u.flash>0&&!reduce.matches)g.globalAlpha=.65;(window.PresentationPolish?.draw||function(g,im,f,...d){g.drawImage(im,f.x,f.y,f.w,f.h,...d)})(g,im,f,Math.round((f.x-f.anchorX)*scale),-Math.round(f.h*scale),Math.round(f.w*scale),Math.round(f.h*scale));g.restore();return true;}
function drawCombatBackdrop(t){
 rect(0,0,SCREEN.width,battlefieldHeight(),'#14151f');if(art['combat-void-v2.png'])ctx.drawImage(art['combat-void-v2.png'],0,0,640,battlefieldHeight());
 // A quiet combat void: translucent drifting bands, no scenery or floor grid.
 ctx.save();ctx.fillStyle='#85323d';ctx.globalAlpha=.018;
 for(let i=0;i<4;i++){const shift=reduce.matches?0:Math.sin(t*.18+i*1.7)*18;ctx.beginPath();ctx.ellipse(105+i*155+shift,78+i%2*102,165,30+i*6,-.16,0,Math.PI*2);ctx.fill();}
 ctx.globalAlpha=.11;ctx.fillStyle='#bba783';for(let i=0;i<13;i++){const drift=reduce.matches?0:t*2;const x=(i*97+33)%640,y=(i*43+drift)%battlefieldHeight();ctx.fillRect(x,y,1,i%4===0?2:1);}ctx.restore();
}
function drawCombatFallen(g,u,v){
 const meta=window.COMBAT_IDLES?.[u.id]||PARTY_FRAMES[u.id],f=meta.frames[0],im=art[meta.src]||sheets[u.id];if(!im)return;
 const length=74,scale=length/(meta.maxHeight||f.h);g.save();g.imageSmoothingEnabled=false;g.globalAlpha=.85;g.translate(v.x,v.y-18);g.rotate(-Math.PI/2);g.drawImage(im,f.x,f.y,f.w,f.h,-f.w*scale/2,-f.h*scale/2,f.w*scale,f.h*scale);g.restore();
}
function drawTargetBrackets(t=0){
 if(battle.busy||battle.scripted)return;const mode=battle.control?.mode==='ally'?'ally':'enemy';
 const target=mode==='enemy'?battle.enemies[battle.target]:units.find(u=>u.id===battle.ally);if(!target||mode==='enemy'&&target.hp<=0)return;
 const v=battlePosition(target),down=mode==='ally'&&hp[target.id]===0,half=mode==='ally'?43:48,top=down?v.y-42:v.y-v.height-4,bottom=v.y+3;
 ctx.save();ctx.strokeStyle=mode==='ally'?'#a8d8a0':'#f0ca7e';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=2;
 if(['enemy','ally'].includes(battle.control?.mode))for(const[x,sx]of [[v.x-half,1],[v.x+half,-1]])for(const[y,sy]of [[top,1],[bottom,-1]]){ctx.beginPath();ctx.moveTo(x,y+sy*9);ctx.lineTo(x,y);ctx.lineTo(x+sx*9,y);ctx.stroke();}
 const y=mode==='enemy'?top-41:top-13,lift=reduce.matches?0:Math.sin(t*4)*2;
 ctx.beginPath();ctx.moveTo(v.x,y-7+lift);ctx.lineTo(v.x+6,y+lift);ctx.lineTo(v.x,y+7+lift);ctx.lineTo(v.x-6,y+lift);ctx.closePath();ctx.fill();ctx.strokeStyle='#352a30';ctx.lineWidth=1;ctx.stroke();ctx.restore();
}
function renderBattle(t){
 const field=battlefieldHeight();drawCombatBackdrop(t);
 ChurchArc.drawSupport(t);window.AregoReturn?.drawSupport(ctx,t);window.NicoloArc?.drawSupport(ctx);for(const enemy of battle.enemies){const v=battlePosition(enemy),m=window.FUTURE_NPCS?.[enemy.id],f=m?.frame||window.CHAPTER_NPCS[enemy.id],scale=v.height/f.h;ctx.save();ctx.globalAlpha=enemy.hp>0?(enemy.opacity??1):.22;if(enemy.id==='celestial_wolf'){ctx.shadowColor='#dce4ff';ctx.shadowBlur=9;}if(!drawCombatIdle(ctx,enemy,v,t))ctx.drawImage(m?art[m.source]:art.npcs,f.x,f.y,f.w,f.h,v.x-f.w*scale/2,v.y-v.height+(enemy.lunge?-5:0),f.w*scale,v.height);ctx.restore();if(enemy.hp>0)healthBadge(v.x,v.y-v.height-35,battle.enemies.length>=5?72:88,((enemy.shortName||enemy.name)+(enemy.resolve?' (R)':'')),enemy.hp,enemy.max,!battle.scripted&&battle.enemies[battle.target]===enemy&&battle.control?.mode!=='ally',true,battle.script?.enemyStatus?.(enemy)||'');}

 window.IlniusFountain?.drawSupport(ctx);
 const ordered=units.map(u=>({u,v:battlePosition(u)})).sort((a,b)=>a.v.y-b.v.y);
 for(const {u,v} of ordered){if(hp[u.id]===0)drawCombatFallen(ctx,u,v);else if(!drawCombatIdle(ctx,u,v,t))drawActor(ctx,{...u,x:v.x,y:v.y,dir:'up',step:null},v.height);healthBadge(v.x,v.y+7,units.length>5?68:76,NAMES[u.id],hp[u.id],STATS[u.id].hp,activeUnit()===u||battle.control?.mode==='ally'&&battle.ally===u.id,false,battle.script?.partyStatus?.(u)||'');}
 renderAction();CombatArt.impact(ctx,battle.animation);drawTargetBrackets(t);
 for(const f of fx){ctx.font='16px FolkenPixel';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#111';ctx.fillStyle=f.color;ctx.strokeText(f.text,f.x,f.y-(.9-f.life)*15);ctx.fillText(f.text,f.x,f.y-(.9-f.life)*15);}
 $('prompt').hidden=true;
}
function finishDialog(value=0){if(!dialogOpen||performance.now()-dialogOpenedAt<180)return;GameAudio.effect('confirm');const resolve=dialogResolve;dialogResolve=null;dialogOpen=false;$('dialog').hidden=true;keys.clear();canvas.focus({preventScroll:true});if(resolve)resolve(value);}
function run(fn){if(taskBusy||battle?.busy)return;taskBusy=true;const token=epoch;Promise.resolve().then(fn).catch(e=>{if(e!==CANCEL){console.error(e);$('status').textContent='The scene could not continue. Restart from the checkpoint.';}}).finally(()=>{if(token===epoch){taskBusy=false;if(battle?.pendingInit)beginInitiative();if(!journeyOpen)$('journey').hidden=true;updateObjective();}});}
const ROSTER=[...CORE,'bruce'];
const BIOS={
 freya:{name:'Freya Kusanagi',role:'Half-elf · Samurai',bio:'An army captain raised by an officer father. Trained in swordsmanship, horsemanship, and tactics, Freya wants to earn a reputation beyond her family name. Her Hellknight induction lies ahead.',ability:'Challenge · Focused samurai strike against one foe.'},
 jamal:{name:'J’Mal',role:'Hobgoblin · Rogue',bio:'A sharp grin and sharper blades. J’Mal exploits openings while smoke keeps the enemy guessing.',ability:'Sneak Attack · Extra damage against a wounded target.'},
 jason:{name:'Jason',role:'Oni-spawn tiefling · Cleric of Asmodeus',bio:'An imposing servant of the Prince of Darkness. Jason brings divine authority and fire magic to the party.',ability:'Burning Hands · Fire spell. Mending · Restore an ally.'},
 draymus:{name:'Draymus Keshaal Mortiarum',role:'Dhampir · Necromancer',bio:'Pale, patient, and fascinated by what death leaves behind. Draymus wields cold necromantic touch magic.',ability:'Chill Touch · A close-range necromantic strike.'},
 guapo:{name:'El Guapo',role:'Sailor · Swashbuckler',bio:'A seasoned blade with a dry sense of humor. El Guapo fights dirty and keeps one eye on the nearest exit.',ability:'Panache Thrust · A daring attack with his rapier.'},
 reese:{name:'Reese',role:'Strix · Ranger / Archer',bio:'A strix archer exiled from his people for excessive violence while serving in their defense force. He comes down from the mountains with armor, a bow, and basic equipment; his magical arsenal comes later.',ability:'Joins during the Longacre operations; absent from the Kintargo mission.'},
 bruce:{name:'Bruce',role:'Aasimar · Monk / Dragon Disciple',bio:'Bruce’s later build combines unchained monk training, sorcery, and the Dragon Disciple path. His blue scales, ivory horns, black hair, and luminous eyes follow the chosen campaign portrait. His sprite wears practical monk clothing.',ability:'Joins later in the campaign; not present on the Night of Ashes.'}
};
function drawIntroArt(c,id){
 const g=c.getContext('2d'),f=window.PARTY_FRAMES[id].frames[0];
 // Selection art uses the same front-facing pixel sprites for every party member.
 // Portraits remain available for dialogue without replacing the roster sprites.
 g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
 const scale=Math.min(c.width*.85/f.w,c.height*.94/f.h),w=f.w*scale,h=f.h*scale;
 g.drawImage(sheets[id],f.x,f.y,f.w,f.h,(c.width-w)/2,c.height-h,w,h);
}
function paintIntro(){const id=ROSTER[introIndex],bio=BIOS[id];drawIntroArt($('intro-art'),id);$('intro-name').textContent=bio.name;$('intro-role').textContent=bio.role;$('intro-bio').textContent=bio.bio;$('intro-ability').textContent=bio.ability;$('intro-art').setAttribute('aria-label',bio.name+' character sprite');$('intro-start').disabled=!OPENING_ROSTER.includes(id);$('intro-start').textContent=OPENING_ROSTER.includes(id)?'Play as '+NAMES[id]:'Joins in a later chapter';Array.from($('intro-roster').children).forEach((b,i)=>b.setAttribute('aria-pressed',String(i===introIndex)));}
function showIntro(){introOpen=true;document.body.classList.add('is-intro');canvas.height=SCREEN.height;ctx.imageSmoothingEnabled=false;$('intro').hidden=false;$('intro-resume').hidden=!readSave();$('intro-roster').replaceChildren();ROSTER.forEach((id,i)=>{const b=document.createElement('button'),c=document.createElement('canvas'),name=document.createElement('span');c.width=110;c.height=130;drawIntroArt(c,id);name.textContent=NAMES[id]||BIOS[id].name;b.append(c,name);b.setAttribute('aria-label',BIOS[id].name+(OPENING_ROSTER.includes(id)?'':', joins later'));if(!OPENING_ROSTER.includes(id)){const tag=document.createElement('small');tag.textContent='Later';b.append(tag);}b.onclick=()=>{introIndex=i;paintIntro();};$('intro-roster').append(b);});introIndex=Math.max(0,ROSTER.indexOf(lead));paintIntro();$('intro-start').focus();}
function reset(resume=false,selected=null){
 if(campaignLoading)return;
 const saved=resume?readSave():null;
 const stage=artStage(saved);
 if(!loadedArtStages.has(stage)){
  void prepareCampaign(stage).then(loaded=>{if(loaded)reset(resume,selected);});
  return;
 }
 TitleScreen.hide();Handheld.close();
 epoch++;$('initiative-reveal').hidden=true;cancelJourney();cancelLevel();briefingOpen=false;$('dice-panel').hidden=true;$('dice-panel').classList.remove('rolling');clearDialog();battle=null;$('combat-log').replaceChildren();showCombatMessage('');taskBusy=false;fx=[];path=[];keys.clear();$('battle').hidden=true;$('character').disabled=false;syncBattleView();
 if(!resume&&!selected){showIntro();return;}
 introOpen=false;$('intro').hidden=true;document.body.classList.remove('is-intro');canvas.height=SCREEN.height;ctx.imageSmoothingEnabled=false;
 if(!resume&&selected){try{const previous=localStorage.getItem(SAVE);if(previous){localStorage.setItem(SAVE+'-before-import',previous);$('save-restore').hidden=false;}}catch{}}
 quest=saved?.quest||{briefed:false,ropeCut:false,bell:false,victory:false,scimitar:false,planted:false,burned:false,done:false};
 progression=saved?.progression||Progression.fresh();inventory=saved?.inventory||Inventory.fresh();applyProgression();
 hp=saved?.hp||Object.fromEntries(CORE.map(id=>[id,STATS[id].hp]));uses=saved?.uses||Object.fromEntries(CORE.map(id=>[id,0]));potions=saved?.potions??2;mendUses=saved?.mendUses??2;lead=saved?.lead||selected||'freya';$('character').value=lead;
 $('save-file-status').textContent='';
 const next=saved?.scene||'street',spawn=scenes[next].spawn||[312,next==='street'?248:next==='tavern'?280:312];setScene(next,saved?.position?.x??spawn[0],saved?.position?.y??spawn[1]);window.NextChapter.syncRoster();
 canvas.focus({preventScroll:true});
 window.scrollTo(0,0);
 if(!saved||quest.briefed===false)run(deliverOpeningMission);else if(quest.burned&&!quest.done)run(finishTempleEscape);
}
$('intro-start').onclick=()=>{const id=ROSTER[introIndex];if(OPENING_ROSTER.includes(id))reset(false,id);};$('intro-resume').onclick=()=>reset(true);
function drawQuestgiver(id,x,y,height=150,dir='front'){const model=window.QUESTGIVER_MODELS[id],f=model.frames[dir==='back'?2:dir==='right'||dir==='left'?1:0],scale=height/f.h;ctx.save();ctx.translate(x,y);if(dir==='left')ctx.scale(-1,1);ctx.drawImage(art[id],f.x,f.y,f.w,f.h,-f.w*scale/2,-height,f.w*scale,height);ctx.restore();}
function renderBriefing(t){
 // An interpreted clergy chamber; the exact briefing room is not recorded.
 ctx.drawImage(art.briefingRoom,0,-SCREEN.mapTop,SCREEN.width,SCREEN.height);
 rect(0,-SCREEN.mapTop,640,112,'#0b0c1699');
 if(!reduce.matches){ctx.save();ctx.globalAlpha=.02+.012*Math.sin(t*2.3);ctx.fillStyle='#db9c58';ctx.fillRect(0,80,640,220);ctx.restore();}
 ctx.textAlign='center';ctx.font='bold 14px monospace';ctx.fillStyle='#d9ba79';ctx.fillText('KINTARGO · THE MISSION ORDERS',320,35);
 ctx.font='11px monospace';ctx.fillStyle='#aaa08e';ctx.fillText('ASMODEAN CLERGY · CAPTAIN FREYA’S COMPANY',320,58);
 drawQuestgiver('corrine',174,260,155,'right');
 drawActor(ctx,{id:'freya',x:382,y:260,dir:'left',step:null},150);
 drawActor(ctx,{id:'jason',x:478,y:260,dir:'left',step:null},150);
 ctx.font='bold 11px monospace';ctx.fillStyle='#d9ba79';ctx.fillText('CORRINE',174,278);ctx.fillText('FREYA',382,278);ctx.fillText('JASON',478,278);$('prompt').hidden=true;
}
function drawBellRope(){
 if(scene!=='tavern')return;
 const x=point('rope').x;
 // Canvas-native overlay stays aligned to the existing interaction on the replacement map.
 rect(x-6,44,12,3,'#2c1d16');rect(x-4,47,8,8,'#b68a43');rect(x-7,55,14,3,'#dfb66b');rect(x-1,58,2,3,'#e3c38a');
 const end=quest.ropeCut?77:112;
 for(let y=61;y<end;y++){rect(x-1,y,2,1,y%4<2?'#e4c89b':'#9e7850');if(y%4===0)rect(x+1,y,1,2,'#563b27');}
 if(quest.ropeCut){rect(x-3,77,1,3,'#e4c89b');rect(x+2,76,1,4,'#ae8655');}
 else{rect(x-3,111,6,2,'#e4c89b');rect(x-4,113,2,5,'#c29d66');rect(x+2,113,2,5,'#c29d66');rect(x-2,117,4,2,'#e4c89b');}
}
async function deliverOpeningMission(){briefingOpen=true;keys.clear();path=[];
 await say('Chronicle','Martial law grips Kintargo. Its lord-mayor has disappeared, and Barzillai Thrune has taken command. Three days after his arrival, a covert operation is assigned to Captain Freya Kusanagi.');
 await say('Chronicle','Raised among soldiers by her officer father, Freya learned riding, swordsmanship, tactics, and leadership long before officer school. Family connections brought her the Kintargo and Longacre assignments. Success must be her own.');
 await say('corrine','There is a secret temple to Sarenrae beneath Shensen’s Silver Star music shop. The Asmodean clergy requires it dismantled. Carry out the operation quietly.');
 await say('freya','Understood. Jason and I will lead the operation together. We confirm the temple, remove its defenders, and dismantle its protections.');
 await say('jason','Shensen is the famous actress who owns the shop. She is not expected to be home. Beneath it, Viggo, the Dawnflower Swordmaster, guards the shrine.');
 await say('Chronicle','Freya, Jason, J’Mal, Draymus, and El Guapo form the company for this operation under the Asmodean banner. Jason serves Asmodeus as a cleric; the others bring steel, stealth, necromancy, and a sailor’s experience.');
 await say('freya','We leave misleading evidence behind. Take Viggo’s scimitar and put a rapier in its place.');
 await say('jason','Then we dismantle the sacred protections. Nothing below the shop is to remain.');
 await say('Chronicle','Their strike coincides with other operations across Kintargo on what becomes known as the Night of Ashes. Beyond Kintargo, Freya’s next assignment is to work against the rebellion in Longacre, under Archbaron Darellus Fex.');
 briefingOpen=false;quest.briefed=true;await journeyCard('Kintargo · Night of Ashes','Corrine’s mission: dismantle the hidden temple of Sarenrae beneath the Silver Star. Enter the shop, find the cellar, and carry out the covert operation.');save();}

function applyProgression(){for(const id of CORE){STATS[id]=Inventory.stats(Progression.stats(BASE_STATS[id],id,progression.levels[id]),inventory,id,quest);SPECIAL[id]=Inventory.skill(Progression.skill(BASE_SPECIAL[id],progression.levels[id],id),id,quest);if(['freya','jamal','reese'].includes(id))SPECIAL[id].dmg[1]=STATS[id].dmg[1];WEAPONS[id]=Inventory.weapon(inventory,id).name;ATTACKS[id]=Inventory.weapon(inventory,id).verb;}}
function cancelLevel(){const resolve=levelResolve;levelResolve=null;levelOpen=false;document.body.classList.remove('is-level');$('level-up').hidden=true;if(resolve)resolve();}
$('level-continue').onclick=()=>{const resolve=levelResolve;levelResolve=null;if(resolve)resolve();};
async function awardSermonMilestone(){
 if(progression.milestones.includes(Progression.milestone))return false;
 $('journey').hidden=true;
 const token=epoch;progression.milestones.push(Progression.milestone);for(const id of Progression.members)progression.levels[id]=2;applyProgression();
 for(const id of Progression.members){hp[id]=STATS[id].hp;uses[id]=0;}mendUses=2;save();paintParty();levelOpen=true;document.body.classList.add('is-level');canvas.height=SCREEN.height;ctx.imageSmoothingEnabled=false;keys.clear();path=[];$('dice-panel').hidden=true;$('level-rows').replaceChildren();
 for(const id of Progression.members){const row=document.createElement('div'),name=document.createElement('strong'),detail=document.createElement('div'),skill=document.createElement('small');row.className='level-row';name.textContent=NAMES[id]+' · Lv 2';detail.textContent='HP '+BASE_STATS[id].hp+' → '+STATS[id].hp+' · Hit +'+BASE_STATS[id].atk+' → +'+STATS[id].atk;skill.textContent=SPECIAL[id].name+' '+BASE_SPECIAL[id].uses+' → '+SPECIAL[id].uses+' uses';detail.append(skill);row.append(name,detail);$('level-rows').append(row);}
 $('level-up').hidden=false;$('level-continue').focus();await new Promise(resolve=>levelResolve=resolve);if(token!==epoch)throw CANCEL;$('level-up').hidden=true;levelOpen=false;document.body.classList.remove('is-level');canvas.height=SCREEN.height;ctx.imageSmoothingEnabled=false;keys.clear();canvas.focus();save();return true;
}
function readSave(){try{const raw=localStorage.getItem(SAVE);return raw?window.SaveFiles.decode(raw):null;}catch{return null;}}
// Later Ash House interactions are exposed only by their chapter’s gated points() handler.
function storyPointAvailable(p){
 if(['western_star','western_star_corentyn','western_star_pezzack','remesiana'].includes(scene))return p.id===NextChapter.target()?.id;
 const completed={supplies:'supplied',cimri:'metCimri',guapoDeparture:'guapoAway',scout:'scouted',owner:'ownerDeal',payroll:'payroll',rest:'rested',bathStairs:'spiritCalmed',sermon:'sermonDispersed',noticeDecree:'noticePosted',tavernDecree:'tavernPosted',gateDecree:'gatePosted',jailDecree:'rhonaDismissed'};
 if(completed[p.id]&&quest[completed[p.id]])return false;
 if(['noticeDecree','tavernDecree','gateDecree','jailDecree'].includes(p.id)&&!quest.decreesIssued)return false;
 if(p.id==='tornDecree')return !!quest.deputiesReported&&!quest.tavernNoticeTorn&&!quest.compactSworn;
 if(p.id==='manorRoad')return !!quest.deputiesReported&&!!(quest.tavernNoticeTorn||quest.compactSworn);
 if(p.id==='manorGreeting')return !quest.manorWelcomed;
 if(p.id==='manorOffice')return !!quest.manorWelcomed;
 if(['jailCells','rileyQuestion','hospiceRoad','hillRoad','bolgartStocks','lastReport'].includes(p.id))return !!quest.chapter4;
 if(p.id==='lastStandRoad')return !!quest.chapter3Complete;
 return true;
}
function visiblePoints(){return storyPoints().concat(window.PresentationPolish?.captivePoints()||[]);}
function storyPoints(){const cover=window.BarleybridgeScout?.points()||window.IlniusFountain?.points()||window.DinyarRecon?.points()||window.MolthuneCoffin?.points()||window.SkadiParley?.points()||window.DarkRain?.points()||window.TathlumHunt?.points()||window.Menador?.points()||window.BarrowCovenant?.points()||window.BarrowTrail?.points()||window.VyreWish?.points()||window.SethicMansion?.points()||window.BellflowerBarn?.points()||window.BellflowerBarge?.points()||window.Pezzack?.points()||window.Rachikan?.points()||window.Ballerina?.points()||window.HinjiTavern?.points()||window.Belde?.points()||window.PaleBall?.points()||window.NicoloArc?.points()||window.SethicLedgers?.points()||window.SethicFarm?.points()||window.EgorianFeud?.points()||window.EgorianSting?.points()||window.EfisioArc?.points()||window.Hinji?.points()||window.Westcrown?.points()||window.RemesianaMarket?.points()||window.EgorianFountain?.points()||window.EgorianDischarge?.points()||window.AregoExit?.points()||window.AregoReturn?.points()||window.AregoAmbush?.points()||window.InfernoGate?.points()||window.FortArego?.points()||window.SenaraGraveyard?.points()||window.SenaraWagon?.points()||window.WhisperwoodGlade?.points()||window.WhisperwoodCamp?.points()||window.SenaraCitadel?.points()||window.SenaraDaggers?.points()||window.SenaraCover?.points();if(cover)return cover;const senara=window.SenaraArrival?.points();if(senara)return senara;const excruciation=window.EgorianExecution?.points();if(excruciation)return excruciation;const mort=window.EgorianMort?.points();if(mort)return mort;const trial=window.EgorianTrial?.points();if(trial)return trial;const night=window.EgorianNight?.points();if(night)return night;const egorian=window.EgorianArrival?.points();if(egorian)return egorian;const road=window.SouthRoad?.points();if(road)return road;const aftermath=window.KantariaAftermath?.points();if(aftermath)return aftermath;const fastness=window.FastnessArc?.points();if(fastness)return fastness;const fourteenth=window.SupplyArc?.points();if(fourteenth)return fourteenth;const thirteenth=window.CovertArc?.points();if(thirteenth)return thirteenth;const twelfth=DisruptionArc.points();if(twelfth)return twelfth;const eleventh=KantariaArc.points();if(eleventh)return eleventh;const tenth=CourtArc.points();if(tenth)return tenth;const ninth=FortArc.points();if(ninth)return ninth;const eighth=ArmoryArc.points();if(eighth)return eighth;const seventh=ChurchArc.points();if(seventh)return seventh;const sixth=PoliticalMovement.points();if(sixth)return sixth;const fifth=DebtsRumors.points();if(fifth)return fifth;if(quest.chapter3Complete&&!quest.chapter4)return [point('lastStandRoad')].filter(Boolean);const fourth=LastStand.points();if(fourth)return fourth.concat(townsfolk().map(u=>({id:u.id,x:u.x,y:u.y,label:'Speak to townsfolk'})));if(scene==='tannery')return [NextChapter.target()];if(quest.chapter2Complete&&!quest.chapter3)return [{id:'chapterThree',x:328,y:160,label:'Continue to Chapter Three'}];if(quest.done&&!quest.chapter2)return [{id:'nextChapter',x:608,y:184,label:'Continue to Chapter Two'}];return scenes[scene].points.filter(p=>storyPointAvailable(p)&&!['debtsRoad','movementRoad','feyReport','churchStandRoad','watchRoad'].includes(p.id)&&(p.id!=='longacreRoad'||quest.chapter3)&&!(quest.burned&&scene==='tavern'&&p.id==='stairs')&&!(quest.victory&&scene==='temple'&&p.id==='altar')) .concat(scene==='temple'&&quest.victory?[{id:'aftermath',x:312,y:120,label:!quest.scimitar?'Take Viggo’s scimitar':!quest.planted?'Plant the rapier':'Burn the temple'}]:[]).concat(townsfolk().map(u=>({id:u.id,x:u.x,y:u.y,label:'Speak to a townsfolk'})));}
function nearPoint(){if(!units[0])return null;return visiblePoints().filter(p=>Math.hypot(units[0].x-p.x,units[0].y-p.y)<INTERACTION_RADIUS).sort((a,b)=>Math.hypot(units[0].x-a.x,units[0].y-a.y)-Math.hypot(units[0].x-b.x,units[0].y-b.y))[0];}
async function interact(requestedId=null){
 const leader=units[0];
 if(!leader||Handheld.isOpen()||introOpen||journeyOpen||levelOpen||dialogOpen||taskBusy||battle||finished())return;
 const p=typeof requestedId==='string'?visiblePoints().find(p=>p.id===requestedId&&Math.hypot(leader.x-p.x,leader.y-p.y)<INTERACTION_RADIUS):nearPoint();
 if(!p)return;
 if(leader.step){
  if(Math.hypot(leader.step.tx-p.x,leader.step.ty-p.y)>=INTERACTION_RADIUS)return;
  leader.step.interaction=p.id;
  path=[];
  return;
 }
 path=[];
 if(p.id==='rileyBanter'){run(()=>PresentationPolish.banter());return;}
 run(async()=>{
  if(p.id.startsWith('citizen-')){await say(p.id,citizenLine(p.id));return;}
  const nextArtStage=ART_ENTRY_STAGES[p.id];
  if(nextArtStage&&!await prepareCampaign(nextArtStage))return;
  if(await window.BarleybridgeScout?.interact(p.id)||await window.IlniusFountain?.interact(p.id)||await window.DinyarRecon?.interact(p.id)||await window.MolthuneCoffin?.interact(p.id)||await window.SkadiParley?.interact(p.id)||await window.DarkRain?.interact(p.id)||await window.TathlumHunt?.interact(p.id)||await window.Menador?.interact(p.id)||await window.BarrowCovenant?.interact(p.id)||await window.BarrowTrail?.interact(p.id)||await window.VyreWish?.interact(p.id)||await window.SethicMansion?.interact(p.id)||await window.BellflowerBarn?.interact(p.id)||await window.BellflowerBarge?.interact(p.id)||await window.Pezzack?.interact(p.id)||await window.Rachikan?.interact(p.id)||await window.Ballerina?.interact(p.id)||await window.HinjiTavern?.interact(p.id)||await window.Belde?.interact(p.id)||await window.PaleBall?.interact(p.id)||await window.NicoloArc?.interact(p.id)||await window.SethicLedgers?.interact(p.id)||await window.SethicFarm?.interact(p.id)||await window.EgorianFeud?.interact(p.id)||await window.EgorianSting?.interact(p.id)||await window.EfisioArc?.interact(p.id)||await window.Hinji?.interact(p.id)||await window.Westcrown?.interact(p.id)||await window.RemesianaMarket?.interact(p.id)||await window.EgorianFountain?.interact(p.id)||await window.EgorianDischarge?.interact(p.id)||await window.AregoExit?.interact(p.id)||await window.AregoReturn?.interact(p.id)||await window.AregoAmbush?.interact(p.id)||await window.InfernoGate?.interact(p.id)||await window.FortArego?.interact(p.id)||await window.SenaraGraveyard?.interact(p.id)||await window.SenaraWagon?.interact(p.id)||await window.WhisperwoodGlade?.interact(p.id)||await window.WhisperwoodCamp?.interact(p.id)||await window.SenaraCitadel?.interact(p.id)||await window.SenaraDaggers?.interact(p.id)||await window.SenaraCover?.interact(p.id)||await window.SenaraArrival?.interact(p.id)||await window.EgorianExecution?.interact(p.id)||await window.EgorianMort?.interact(p.id)||await window.EgorianTrial?.interact(p.id)||await window.EgorianNight?.interact(p.id)||await window.EgorianArrival?.interact(p.id)||await window.SouthRoad?.interact(p.id)||await window.KantariaAftermath?.interact(p.id)||await window.FastnessArc?.interact(p.id)||await window.SupplyArc?.interact(p.id)||await window.CovertArc?.interact(p.id)||await DisruptionArc.interact(p.id)||await KantariaArc.interact(p.id)||await CourtArc.interact(p.id)||await FortArc.interact(p.id)||await ArmoryArc.interact(p.id)||await ChurchArc.interact(p.id)||await PoliticalMovement.interact(p.id)||await DebtsRumors.interact(p.id)||await LastStand.interact(p.id)||await window.NextArc.interact(p.id)||await window.NextChapter.interact(p.id))return;
  if(p.id==='silver'){await travel('tavern',312,280);if(!quest.entered){quest.entered=true;await say('The Silver Star','Lutes, horns, and instrument cases fill Shensen’s shop. The famous actress is away; a shopkeeper remains. Somewhere beneath the floorboards, chanting rises through the wood.');save();}}
  if(p.id==='outside'){await travel('street',152,152,'down');}
  if(p.id==='upstairs'){await travel('tavern',536,152,'down');}
  if(p.id==='guard'){await say('Dottari Guard',quest.burned?'The Western Star sails on the tide. Nobody is checking papers tonight.':'Fires on the north bank. Every Dottari in the city is up there. Keep off the streets.');if(!quest.burned)await say('Dottari Guard','...Unless you are who I think you are. Then I saw nothing.');}
  if(p.id==='ship'){if(!quest.burned){await say('Chronicle','The temple is unfinished business. Complete the operation beneath the Silver Star first.');return;}if(!quest.done)await finishTempleEscape();}
  if(p.id==='barkeep'){await say('Shopkeeper','We are closed. The fires. Go home.');const choice=await say(null,'The shopkeeper waits.',['[Leave the shopkeeper alone]','[Ask about the cellar]','[Threaten the shopkeeper] Tell me, or burn with it.']);if(choice===0){await say('Shopkeeper','...Please.');}if(choice===1){await say(lead,{freya:'Tell me what is beneath this shop.',jamal:'So, what are you keeping in the cellar?',jason:'What lies beneath this establishment?',draymus:'What exactly is down in your cellar?',guapo:'What have you got down in the cellar?'}[lead]);await say('Shopkeeper','There is no cellar.');await say(null,'His eyes go to the far corner of the room.');quest.stairsKnown=true;}if(choice===2){if(quest.ropeCut||quest.bell){await say('Shopkeeper','I already told you everything.');return;}const mod={freya:4,jamal:1,jason:3,draymus:2,guapo:3}[lead],total=await rollDice('Intimidation',20,1,mod,'DC 10');await say('Intimidation',total>=10?'Success. The shopkeeper gives way.':'Failed. The shopkeeper reaches for the alarm.');if(total>=10){quest.ropeCut=true;await say('Shopkeeper','The bell rope. By the stairs in the corner. Cut it or they will hear you coming.');await say(null,'You cut the rope. Whatever is below will not be warned.');}else{quest.bell=true;await say(null,'He screams. Somewhere beneath the floor, a bell answers.');}}save();}
  if(p.id==='rope'){if(quest.ropeCut){await say(null,'The severed bell rope hangs loose. Below, the chanting continues.');}else if(quest.bell){await say(null,'The bell has already sounded. Whoever is below knows you are coming.');}else{await say(null,'A bell rope, by the cellar stairs.');const c=await say(null,'Cut the rope before descending?',['[Cut the bell rope]','[Leave the rope intact]']);if(c===0){quest.ropeCut=true;await say(null,'You cut the rope. Whatever is below will not be warned.');save();}}}
  if(p.id==='stairs'){await say('jason','The incense leads here. This is the entrance.');await say(null,'Jason finds the concealed way beneath the shop. Chanting rises from the hidden temple of Sarenrae.');await travel('temple',312,312);if(!quest.victory)await say(null,'A hidden temple. Candles, an altar, and a man in robes'+(quest.ropeCut?' still absorbed in prayer.':' who has heard you coming.'));}
  if(p.id==='altar')await encounter();
  if(p.id==='aftermath'){if(!quest.scimitar){quest.scimitar=true;await say(null,'Obtained: Viggo’s scimitar.');}else if(!quest.planted){quest.planted=true;await say(null,'You lay the rapier in its place. Viggo’s scimitar is gone; a rapier takes its place. The substitution leaves misleading evidence behind.');}else{await say(null,'Nothing about tonight is undecided.',['[Burn it.]','[Burn it anyways.]']);quest.burned=true;await say(null,'Braziers tip. Old wood catches fast. Nobody will pray here again.');await say('jamal','We should not be standing in a fire. Just saying.');await finishTempleEscape();}save();}
 });
}
async function finishTempleEscape(){
 await journeyCard('The Silver Star · Fire and false evidence','The temple’s sacred protections are dismantled. After his warning about the fire, J’Mal is stabilized. His wounds are still too severe to walk; the party carries him out on a stretcher as the burning shop collapses part of the tunnels below.\n\nOn the way out, the party takes musical instruments from the shop above. They will fence the stolen goods far from Kintargo.');
 await journeyCard('Kintargo · Nox’s payment','Captain Freya returns with Dottari guards. Her military standing and family connections lend weight to her words. She makes a show of trying to fight the fire, and declares it an unfortunate accident.\n\nThe contractor, known to the party only as Nox, appears human: a woman carrying a fine glaive, with an unsettling power about her. She pays each member one hundred gold pieces and sends them to a safehouse.');
 await journeyCard('Kintargo · The safehouse','From a lavish safehouse balcony, the team watches three fires burn across the city. They lie low for nearly twenty-four hours.\n\nAfter resting, a covered wagon takes them to the docks, where The Western Star awaits.',()=>{for(const id of CORE)hp[id]=STATS[id].hp;setScene('street',600,184,'left');},'transition-kintargo-safehouse-v1.png');
 await say('guapo','A pleasure cruiser? Now that is a proper escape.');quest.done=true;save();updateObjective();
}
async function templeStoryStrike(){
 if(!battle||battle.kind!=='temple')return;
 const token=epoch,enemy=battle.enemies.find(e=>e.id==='viggo')||livingEnemy(),target=units.find(u=>u.id==='jamal');if(!enemy||!target)return;
 battle.busy=true;paintBattle();
 await storyRoll(enemy.name+' → J’Mal',20,STATS[enemy.id].atk,'Critical blow · J’Mal is knocked out of the fight');
 if(token!==epoch||!battle)return;
 await animateAction(enemy,target,'attack',true);if(token!==epoch||!battle)return;
 const lost=hp.jamal;hp.jamal=0;quest.templeWound=true;flash(target,'−'+lost,'#ee9a88');
 log(enemy.name+' catches J’Mal with a devastating strike. He collapses; the others must finish the fight.');paintParty();await delay(reduce.matches?120:650);
 while(battle&&battle.turn<units.length&&(hp[units[battle.turn].id]<=0||(battle.paralyzed===units[battle.turn].id&&battle.round===1)))battle.turn++;
 if(battle){planEnemyRound();battle.busy=false;paintBattle();}
}
async function encounter(){
 await say('viggo','You walk into a holy place with drawn steel. Then you are what the fires are for.');
 await say('viggo','The Silver Star will not kneel to Thrune.');
 const c=await say(null,'Your answer?',['“It will.”','[Intimidate Viggo] Everything kneels, eventually.','[Kneel before Viggo]']);
 if(c===2){await say(null,'You kneel. Viggo smiles, and the knife is already in his hand.');await fail('You knelt to the Silver Star. The crown does not record failures.');return;}
 let shaken=false,surprise=false;
 if(c===1){const mod={freya:4,jamal:1,jason:3,draymus:2,guapo:3}[lead],total=await rollDice('Intimidation',20,1,mod,'DC 12');await say('Intimidation',total>=12?'Success. Viggo’s resolve falters.':'Failed. Viggo stands firm.');shaken=total>=12;surprise=!shaken;await say(shaken?null:'viggo',shaken?'Viggo flinches. His hands are shaking. He will fight worse for it.':'Then kneel to this.');}
 else await say(lead,'It will.');
 const count=quest.ropeCut?1:quest.bell?3:2;
 await say(null,count===1?'A single zealot steps from behind a pillar. The others never heard the bell.':count===2?'Two zealots step from behind the pillars.':'Three zealots come down the stairs behind you. The bell did its work.');
 startBattle(count,shaken);await templeStoryStrike();if(surprise){battle.busy=true;await enemyStrike(battle.enemies[0],epoch);if(battle){battle.busy=false;paintBattle();}}
}
function planEnemyRound(){if(battle)EnemyTactics.plan(battle.enemies,units,hp,STATS,battle.round);}
function fitCombatLine(element, baseSize, minimumSize){
 const width=element.clientWidth;
 if(!width)return;
 const required=element.scrollWidth;
 if(required>width)element.style.fontSize=Math.max(minimumSize,baseSize*width/(required+1))+'cqw';
}
function paintEnemyIntent(){
 const panel=$('enemy-intents');
 panel.hidden=!battle||!!battle.scripted;
 if(panel.hidden)return;
 panel.replaceChildren();
 const turnName=entry=>entry?.side==='enemy'?(battle.enemies[entry.index]?.shortName||entry.name):entry?.name;
 const heading=document.createElement('strong');
 const current=battle.order?.[battle.turn];
 heading.textContent='R'+battle.round+' · NOW '+(turnName(current)||NAMES[activeUnit()?.id]||'Initiative');
 if(current)heading.title=current.name;
 panel.append(heading);
 if(battle.order){
  const next=Initiative.next(battle.order,battle.turn,units,battle.enemies,hp,battle.round,battle.paralyzed);
  const line=document.createElement('div');
  line.className='turn-next';
  line.textContent='NEXT '+(turnName(next)||'—');
  if(next)line.title=next.name;
  panel.append(line);
 }
 for(const enemy of battle.enemies.filter(enemy=>enemy.hp>0)){
  const row=document.createElement('div');
  row.textContent=EnemyTactics.preview(enemy,NAMES,true);
  row.title=EnemyTactics.preview(enemy,NAMES);
  row.className=enemy.intent?.heavy?'heavy':'';
  panel.append(row);
  fitCombatLine(row,1.25,1.05);
 }
}
function startBattle(count,shaken,config=null){
 const places=[[312,280],[264,296],[360,296],[280,328],[344,328],[392,328]];
 units.forEach((u,i)=>{u.x=places[i][0];u.y=places[i][1];u.dir='up';u.step=null;u.guard=false;u.ethereal=false;});path=[];
 const enemies=config?.enemies||[{id:'viggo',name:'Viggo',x:312,y:136,hp:34,max:34,shaken:shaken?2:0},...Array.from({length:count},(_,i)=>({id:'cultist',name:'Zealot '+(i+1),x:[248,392,552][i],y:[152,152,280][i],hp:12,max:12}))];
 for(const e of enemies)e.idleOffset=Math.random()*2;
 battle={kind:config?.kind||'temple',returnPosition:config?.returnPosition,round:1,turn:0,target:0,ally:units.some(u=>u.id===lead)?lead:units[0].id,enemies,busy:false,smoke:0,pendingInit:!config?.scripted,scripted:!!config?.scripted,script:config?.script,scriptActor:config?.scriptActor};$('battle').hidden=false;$('character').disabled=true;$('combat-log').replaceChildren();battle.recent=[];battle.current='';showCombatMessage(battle.script?.opening||config?.opening||'Choose a command. Guard lasts until your next turn.');if(!battle.scripted)planEnemyRound();paintBattle();updateObjective();
}
function showCombatMessage(text){$('battle-message').textContent=text;}
function paintCombatHistory(){if(!battle)return;const panel=$('combat-log');panel.replaceChildren();for(const text of battle.recent.slice(0,2)){const e=document.createElement('div');e.className='combat-entry';const lines=text.split('\n');e.textContent=lines.length>1?lines[0].split(/ · | casts /)[0]+' → '+lines[1]:text;e.title=text;panel.append(e);fitCombatLine(e,1.40625,1.125);}}
function log(text){if(!battle)return;$('battle-message').classList.remove('command-preview');if(battle.current)battle.recent.unshift(battle.current);battle.recent=battle.recent.slice(0,2);battle.current=text;showCombatMessage(text);paintCombatHistory();}
function activeUnit(){if(!battle)return null;if(battle.scripted)return units.find(u=>u.id===battle.scriptActor);if(!battle.order)return units[battle.turn];const entry=battle.order[battle.turn];return entry?.side==='party'?Initiative.actor(entry,units,battle.enemies):null;}
function livingEnemy(){return battle?.enemies.find(e=>e.hp>0);}
function flash(target,value,color='#f0d5a0'){const position=battle?battlePosition(target):{x:target.x,y:target.y,height:55};fx.push({x:position.x,y:position.y-position.height+(battle?.enemies.includes(target)?24:0),text:String(value),color,life:.9});target.flash=.18;}
function hitTarget(attacker,target,value){GameAudio.effect('hit');target.hp=Math.max(0,target.hp-value);attacker.lunge=.22;flash(target,'−'+value);return value;}
function paintParty(){
 syncBattleView();
 $('party').replaceChildren();units.forEach(u=>{const b=document.createElement('button');b.className='party-card'+(hp[u.id]===0?' down':'')+(battle&&activeUnit()?.id===u.id?' current':'')+(battle?.ally===u.id?' selected':'');b.title=battle?'Select '+NAMES[u.id]+' as healing target':'Speak to '+NAMES[u.id];const c=document.createElement('canvas');c.width=32;c.height=48;drawActor(c.getContext('2d'),{...u,x:16,y:46,dir:'down',step:null},38);const text=document.createElement('span');text.textContent=NAMES[u.id]+' · Lv '+progression.levels[u.id]+' · '+hp[u.id]+'/'+STATS[u.id].hp;const meter=document.createElement('i');meter.style.width=Math.max(0,hp[u.id]/STATS[u.id].hp*100)+'%';b.append(c,text,meter);b.onclick=()=>{if(battle){battle.ally=u.id;paintParty();}else if(!taskBusy&&!finished())run(()=>say(u.id,lines[scene]?.[u.id]||'Your call.'));};$('party').append(b);});
}
const signed=n=>(n>=0?'+':'−')+Math.abs(n);
const rollSummary=spec=>spec[0]+'D'+spec[1]+(spec[2]?' '+signed(spec[2]):'');
function combatAC(id){return STATS[id].ac+(battle?.kind==='execution'&&id==='jason'?2:0)-(battle?.kind==='armory_heist'&&['freya','jason'].includes(id)?1:0);}
function commandSummary(action,id){
 const stat=STATS[id],skill=SPECIAL[id],hit='D20 '+signed(stat.atk+(action==='special'?(skill.bonus||0):0)),remaining=Math.max(0,skill.uses-uses[id]),ally=NAMES[battle.ally||id];
 if(action==='attack'){const move=(unarmedWeapon(id)||window.SouthRoad?.lance(id,battle?.kind)||Inventory.weapon(inventory,id)).move;return 'Attack | '+move+' · Hit '+hit+' vs AC · Damage '+rollSummary(unarmedWeapon(id)?.dmg||window.SouthRoad?.damageDice(id,battle?.kind,stat.dmg)||stat.dmg)+(stat.frostDice?' + 1D6 frost':'')+'.';}
 if(action==='special'){let effect='Damage '+rollSummary(window.SouthRoad?.damageDice(id,battle?.kind,skill.dmg)||skill.dmg)+(stat.frostDice?' + 1D6 frost':'');if(id==='jamal')effect+='; +1D6 if target already hit this round';if(skill.drain)effect+='; heal self by damage dealt';if(id==='jason')effect+='; fire burst on selected foe';if(id==='draymus')effect+='; necromantic touch, no self-healing';return 'Skill | '+skill.name+' ['+remaining+'/'+skill.uses+'] · '+(skill.auto?'Automatic hit':'Hit '+hit+' vs AC')+' · '+effect+'.';}
 if(action==='guard')return 'Guard | '+NAMES[id]+' braces · AC '+combatAC(id)+' → '+(combatAC(id)+4)+' until their next turn; halve damage from hits. Uses this turn.';
 if(action==='potion')return 'Potion | '+NAMES[id]+' heals '+ally+' · Restore 2D4 +2 HP (up to max) · ['+potions+'/2].';
 if(action==='mend')return 'Mend | Infernal Mending · Jason heals '+ally+' for 2D8 +3 HP (up to max) · ['+mendUses+'/2].';
 if(action==='phase')return 'Phase | Mosswater Tunic · Avoid enemy attacks until next turn. ['+Inventory.giftCharges(quest,id)+'/5].';
 if(action==='maximize')return 'Maximize | Dragon Helm · Burning Hands deals full damage. Spends one spell use. ['+Inventory.giftCharges(quest,id)+'/3].';
 if(action==='smoke')return 'Smoke | Jamal throws a bomb · Enemies −4 to hit for 2 rounds · ['+(quest.smokeUsed?0:1)+'/1].';
}
function commandCardSummary(action,id){
 const stat=STATS[id],skill=SPECIAL[id],roll=d=>rollSummary(d).replaceAll(' ',''),hit='D20'+signed(stat.atk+(action==='special'?(skill.bonus||0):0)),left=Math.max(0,skill.uses-uses[id]),ally=NAMES[battle.ally||id];
 const weapon=({freya:'Katana',jamal:'Daggers',masterwork_daggers:'Masterwork',jason:'Mace',draymus:'Dagger',guapo:'Rapier',reese:'Bow',naginata:'Naginata',lucerne:'Lucerne',kukri:'Kukri',mantis_blades:'Paired blades',scimitar:'Scimitar'})[inventory.equipped[id]]||WEAPONS[id];
 if(action==='attack'&&unarmedWeapon(id))return 'Unarmed\n'+hit+' '+roll(unarmedWeapon(id).dmg);
 if(action==='attack'&&window.SouthRoad?.lance(id,battle?.kind))return 'Lance charge\n'+hit+' '+roll(SouthRoad.damageDice(id,battle.kind,stat.dmg));
 if(action==='attack')return stat.frostDice?'Sentry +1D6\n'+hit+' '+roll(stat.dmg):weapon+'\n'+hit+' '+roll(stat.dmg);
 if(action==='special'&&window.SouthRoad?.lance(id,battle?.kind))return 'Challenge\n'+roll(SouthRoad.damageDice(id,battle.kind,skill.dmg))+' ['+left+'/'+skill.uses+']';
 if(action==='special'&&stat.frostDice)return 'Aim +1D6\n'+roll(skill.dmg)+' ['+left+'/'+skill.uses+']';
 if(action==='phase')return 'Tunic ['+Inventory.giftCharges(quest,id)+'/5]\nEvade attacks';
 if(action==='maximize')return 'Dragon ['+Inventory.giftCharges(quest,id)+'/3]\nFull damage';
 if(action==='special')return ({freya:'Challenge',jamal:'Sneak Attack',jason:'Burning Hands',draymus:skill.name==='Shocking Grasp'?'Shock Grasp':'Chill Touch',guapo:'Panache',reese:'Aimed Shot'})[id]+'\n'+roll(skill.dmg)+' ['+left+'/'+skill.uses+']';
 if(action==='guard')return 'AC '+combatAC(id)+' → '+(combatAC(id)+4)+'\nHalf damage';
 if(action==='potion'||action==='mend')return (ally==='El Guapo'?'Guapo':ally)+' ['+(action==='mend'?mendUses:potions)+'/2]\n'+(action==='mend'?'2D8+3':'2D4+2')+' HP';
 return 'Foes: −4 hit\n2 turns ['+(quest.smokeUsed?0:1)+'/1]';
}
function combatButtons(){return Array.from($('actions').querySelectorAll('button'));}
function selectedCombatCommand(){
 const actor=activeUnit(),control=battle?.control;
 if(!actor||!control)return null;
 const button=combatButtons()[control.index];
 if(!button)return null;
 const heading=button.querySelector('.command-title')?.textContent;
 const description=button.getAttribute('aria-label')||'';
 const rows=description.replace(/^[^|]+\|\s*/,'').split(' · ');
 const target=control.mode==='enemy'?battle.enemies[battle.target]?.name:control.mode==='ally'?NAMES[battle.ally]:null;
 if(target)rows.push('Selected target · '+target);
 return {heading:heading+' · '+NAMES[actor.id],rows};
}
function setCombatHeading(text, compactText = text){
 const heading=$('battle-title');
 heading.textContent=text;
 heading.style.fontSize='';
 fitCombatLine(heading,1.72,1.35);
 if(heading.scrollWidth>heading.clientWidth && compactText!==text){
  heading.textContent=compactText;
  heading.style.fontSize='';
  fitCombatLine(heading,1.72,1.35);
 }
}
function paintCombatSelection(){
 if(!battle)return;const c=battle.control;combatButtons().forEach((b,i)=>b.classList.toggle('is-chosen',c?.mode==='commands'&&i===c.index));
 if(c?.mode==='enemy'||c?.mode==='ally'){
  const confirmLabel=document.documentElement.classList.contains('handheld-display')?'A':'E';
  setCombatHeading('← → Select · '+confirmLabel+' Confirm · B Back');
  canvas.focus({preventScroll:true});
 }
}
function beginCombatChoice(action){
 if(!battle||battle.busy)return;const c=battle.control;
 if(battle.scripted||['guard','smoke','phase'].includes(action)){performAction(action);return;}
 c.action=action;c.mode=['potion','mend'].includes(action)?'ally':'enemy';paintCombatSelection();
}
function cycleCombatTarget(mode,delta){
 const choices=mode==='enemy'?battle.enemies.flatMap((e,i)=>e.hp>0?[i]:[]):units.map(u=>u.id);if(!choices.length)return;
 const current=mode==='enemy'?battle.target:battle.ally,index=choices.indexOf(current),next=choices[(Math.max(0,index)+delta+choices.length)%choices.length];if(mode==='enemy')battle.target=next;else battle.ally=next;
}
function handleCombatKey(e){
 const key=e.key.toLowerCase(),direction=KEY[e.key],confirm=['enter','e',' '].includes(key),cancel=['escape','b'].includes(key);
 if(!direction&&!confirm&&!cancel&&!['q','h'].includes(key)&&! /^[1-9]$/.test(key))return false;
 e.preventDefault();keys.clear();if(battle.reveal){if((confirm||cancel)&&!e.repeat)startInitiative();return true;}if(battle.busy||taskBusy||e.repeat&&confirm)return true;
 const c=battle.control,buttons=combatButtons();
 if(cancel){c.mode='commands';c.action=null;paintBattle();combatButtons()[c.index]?.focus({preventScroll:true});return true;}
 if(c.mode!=='commands'){
  if(direction){cycleCombatTarget(c.mode,['left','up'].includes(direction)?-1:1);paintBattle();}
  else if(confirm)performAction(c.action);return true;
 }
 if(direction){
  const cols=$('actions').classList.contains('has-aux')?3:2,rows=Math.ceil(buttons.length/cols),start=c.index;
  let row=Math.floor(start/cols),col=start%cols;
  for(let i=0;i<buttons.length+cols;i++){if(direction==='left')col=(col-1+cols)%cols;else if(direction==='right')col=(col+1)%cols;else row=(row+(direction==='up'?-1:1)+rows)%rows;const index=row*cols+col;if(buttons[index]&&!buttons[index].disabled){c.index=index;break;}}
  buttons[c.index]?.focus({preventScroll:true});paintCombatSelection();
 }else if(confirm){const button=buttons[c.index];if(button&&!button.disabled)beginCombatChoice(button.dataset.action);}
 else if(/^[1-9]$/.test(key)){const button=buttons[Number(key)-1];if(button&&!button.disabled){c.index=Number(key)-1;beginCombatChoice(button.dataset.action);}}
 else if(key==='h')$('heal-target').click();else if(key==='q'){cycleCombatTarget('enemy',-1);paintBattle();}
 return true;
}
function paintBattle(){
 if(!battle)return;paintEnemyIntent();const acting=activeUnit();
 if(!acting||battle.reveal){$('actions').replaceChildren();$('heal-target').disabled=true;$('combat-target').disabled=true;setCombatHeading(battle.reveal?'Initiative · Battle order':'R'+battle.round+' · '+(battle.order?.[battle.turn]?.name||'Resolving turn'));paintParty();return;}
 if(battle.enemies[battle.target]?.hp<=0)battle.target=battle.enemies.findIndex(e=>e.hp>0);
 const actor=activeUnit(),script=battle.script?.command();if(!battle.control||battle.control.actor!==actor.id||battle.control.round!==battle.round)battle.control={actor:actor.id,round:battle.round,mode:'commands',index:0,action:null};$('heal-target').textContent='Aid: '+NAMES[battle.ally];$('heal-target').disabled=battle.busy||!!script;const turnHeading=(script?.title||'R'+battle.round)+' · '+NAMES[actor.id];const confirmLabel=document.documentElement.classList.contains('handheld-display')?'A':'E';setCombatHeading(turnHeading+' · '+confirmLabel+': select',turnHeading);$('battle-title').title='Round '+battle.round+' · '+NAMES[actor.id]+'’s turn';$('combat-target').replaceChildren();battle.enemies.forEach((e,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(e.shortName||e.name)+' '+e.hp+'/'+e.max+(e.resolve?' resolve':'');o.title=e.name;o.disabled=e.hp<=0;$('combat-target').append(o);});$('combat-target').value=battle.target;$('combat-target').disabled=battle.busy||!!script;
 $('actions').replaceChildren();const commands=[['attack','Attack'],['special',SPECIAL[actor.id].name+' ('+Math.max(0,SPECIAL[actor.id].uses-uses[actor.id])+')'],['guard','Guard'],['potion','Potion ('+potions+')']];
 if(script)commands.splice(0,commands.length,['special',script.name]);
 else if(unarmedWeapon(actor.id)||(actor.id==='jason'&&quest.egorianJasonBack))commands.splice(1,1);
 if(!script&&actor.id==='jason'&&!quest.egorianJasonBack)commands.splice(2,0,['mend','Mending ('+mendUses+')']);
 if(!script&&actor.id==='jamal')commands.splice(2,0,['smoke','Smoke Bomb']);
 if(!script&&quest.kantariaGiftsReceived&&actor.id==='jamal')commands.push(['phase','Phase']);
 if(!script&&quest.kantariaGiftsReceived&&actor.id==='jason'&&!quest.egorianJasonBack)commands.push(['maximize','Maximize']);
 $('actions').classList.toggle('has-aux',commands.length>4);
 commands.forEach(([action,label],i)=>{const b=document.createElement('button');const remaining=Math.max(0,SPECIAL[actor.id].uses-uses[actor.id]);const detail=script?script.name+' · '+script.description:commandSummary(action,actor.id);const title=document.createElement('span'),subtitle=document.createElement('span');title.className='command-title';subtitle.className='command-subtitle';title.textContent=script?.label||({attack:'ATTACK',special:'SKILL',guard:'GUARD',potion:'POTION',mend:'MEND',smoke:'SMOKE',phase:'PHASE',maximize:'MAXIMIZE'})[action];subtitle.textContent=script?script.name:commandCardSummary(action,actor.id);if(script)subtitle.classList.add('scripted-command');b.append(title,subtitle);b.dataset.action=action;b.onfocus=()=>{if(battle.control.mode==='commands'){battle.control.index=i;paintCombatSelection();}};b.title=detail;b.setAttribute('aria-label',detail);b.disabled=battle.busy||(!script&&action==='special'&&uses[actor.id]>=SPECIAL[actor.id].uses)||(action==='potion'&&potions<=0)||(action==='mend'&&mendUses<=0)||(action==='smoke'&&quest.smokeUsed)||(action==='phase'&&!Inventory.giftCharges(quest,actor.id))||(action==='maximize'&&(!Inventory.giftCharges(quest,actor.id)||!remaining));b.onclick=()=>{if(battle.control.mode!=='commands'&&battle.control.action===action)performAction(action);else{battle.control.index=i;beginCombatChoice(action);}};$('actions').append(b);});
 paintParty();const buttons=combatButtons();if(buttons[battle.control.index]?.disabled)battle.control.index=Math.max(0,buttons.findIndex(b=>!b.disabled));paintCombatSelection();
}
async function performAction(action){try{await performActionImpl(action);}catch(e){if(e!==CANCEL){console.error(e);if(battle){battle.busy=false;paintBattle();}}}}
function potionRefusal(id){
 if(battle?.covenantJasonKilled&&id==='jason')return 'Jason is dead. A potion cannot bring him back.';
 return battle?.kind==='temple'&&quest.templeWound&&id==='jamal'?'J’Mal is too badly injured to swallow a potion. He cannot consume it.':'';}
function unarmedWeapon(id){return window.NextChapter?.unarmed?.(id,battle?.kind);}
function combatOutcome(actor,target,skill,value,roll,bonus){
 const move=skill?(actor.id==='draymus'&&battle.kind==='armory_heist'?'Shocking Grasp':skill.name):(unarmedWeapon(actor.id)||window.SouthRoad?.lance(actor.id,battle.kind)||Inventory.weapon(inventory,actor.id)).move;
 const caster=skill&&['jason','draymus'].includes(actor.id);
 const first=NAMES[actor.id]+(caster?' casts ':' · ')+move;
 const outcome=target.name+': '+(value===null?'miss':'−'+value+(target.resolve?' resolve':' HP'));
 const usesLeft=skill?'['+Math.max(0,skill.uses-uses[actor.id])+'/'+skill.uses+'] uses':'';
 const detail=value===null?'D20 '+roll+' '+(bonus>=0?'+':'−')+Math.abs(bonus)+(usesLeft?' · '+usesLeft:''):actor.id==='draymus'&&battle.kind==='armory_heist'&&skill?'Spectral Hand · '+usesLeft:usesLeft;
 return [first,outcome,detail].filter(Boolean).join('\n');
}
async function performActionImpl(action){
 if(Handheld.isOpen()||!battle||battle.busy||dialogOpen||taskBusy)return;const token=epoch,actor=activeUnit();if(!actor)return;if(battle.scripted)return battle.script.act(action,actor);const target=battle.enemies[battle.target]?.hp>0?battle.enemies[battle.target]:livingEnemy();if(!target)return;
 if(action==='special'&&uses[actor.id]>=SPECIAL[actor.id].uses||action==='potion'&&potions<=0||action==='mend'&&mendUses<=0||action==='smoke'&&quest.smokeUsed)return;
 if(action==='phase'&&(actor.id!=='jamal'||!Inventory.giftCharges(quest,actor.id)))return;
 if(actor.id==='jason'&&quest.egorianJasonBack&&['special','mend','maximize'].includes(action))return;
 if(action==='maximize'&&(actor.id!=='jason'||!Inventory.giftCharges(quest,actor.id)||uses[actor.id]>=SPECIAL[actor.id].uses))return;
 if(action==='special'&&unarmedWeapon(actor.id))return;
 const refusal=action==='potion'?potionRefusal(battle.ally||actor.id):'';if(refusal){battle.control.mode='commands';battle.control.action=null;log(refusal);paintBattle();return;}
 battle.control.mode='commands';battle.control.action=null;battle.busy=true;$('battle-message').classList.remove('command-preview');paintBattle();
 if(action==='guard'){await animateAction(actor,actor,'guard');actor.guard=true;log(NAMES[actor.id]+' guards · AC +4, half damage.');}
 else if(action==='potion'||action==='mend'){const id=battle.ally||actor.id,value=await damage(action==='mend'?[2,8,3]:[2,4,2],NAMES[actor.id]+' · '+(action==='mend'?'Infernal Mending':'Healing potion')),before=hp[id];await animateAction(actor,units.find(u=>u.id===id),action,true,()=>{hp[id]=Math.min(STATS[id].hp,hp[id]+value);if(action==='potion')potions--;else mendUses--;flash(units.find(u=>u.id===id),'+'+(hp[id]-before),'#a8d8a0');});log(NAMES[actor.id]+' · '+(action==='potion'?'Healing potion':'Infernal Mending')+'\n'+NAMES[id]+' +'+(hp[id]-before)+' HP ['+(action==='potion'?potions:mendUses)+'/2]');}
 else if(action==='phase'){await animateAction(actor,actor,'guard');actor.ethereal=true;quest.mosswaterSpent=(quest.mosswaterSpent||0)+1;log('J’Mal phases until his next turn. ['+Inventory.giftCharges(quest,actor.id)+'/5].');}
 else if(action==='smoke'){await animateAction(actor,target,'smoke');quest.smokeUsed=true;battle.smoke=2;log('Jamal throws a smoke bomb. Enemies take −4 to hit for two rounds. [0/1 remaining]');}
 else{
  const maximized=action==='maximize';
  const skill=action==='special'||maximized?SPECIAL[actor.id]:null;if(skill)uses[actor.id]++;
  if(maximized)quest.dragonHelmSpent=(quest.dragonHelmSpent||0)+1;
  const defense=EnemyTactics.defense(target,battle.enemies,STATS);
  const bonus=STATS[actor.id].atk+(skill?.bonus||0),total=skill?.auto?null:await rollDice(NAMES[actor.id]+' · Attack',20,1,bonus,'AC '+defense),roll=total===null?null:total-bonus,hit=skill?.auto||roll===20||roll!==1&&total>=defense;
  if(hit){const baseDice=skill?.dmg||unarmedWeapon(actor.id)?.dmg||STATS[actor.id].dmg;const dice=window.SouthRoad?.damageDice(actor.id,battle.kind,baseDice)||baseDice;const fixed=maximized?Array(dice[0]).fill(dice[1]):null;let value=await damage(dice,NAMES[actor.id]+' · '+(maximized?'Maximized Burning Hands':skill?.name||'Damage'),fixed);if(STATS[actor.id].frostDice)value+=await damage([1,6,0],'Silent Sentry · Frost');if(skill&&actor.id==='jamal'&&target.hitRound===battle.round)value+=await damage([1,6,0],'J’Mal · Sneak attack bonus');await animateAction(actor,target,maximized?'special':action,true,()=>hitTarget(actor,target,value));target.hitRound=battle.round;if(skill?.drain)hp[actor.id]=Math.min(STATS[actor.id].hp,hp[actor.id]+value);log(combatOutcome(actor,target,skill,value,roll,bonus));}else{await animateAction(actor,target,action,false);actor.lunge=.22;flash(target,'MISS','#bfc1d1');log(combatOutcome(actor,target,skill,null,roll,bonus));}
 }
 paintBattle();await delay(280);if(token!==epoch||!battle)return;
 if(window.NextChapter?.surrenderReady(battle)){
  const position=battle.returnPosition;
  battle=null;
  $('battle').hidden=true;$('enemy-intents').hidden=true;$('character').disabled=false;
  run(()=>NextChapter.afterBoarding(position));
  return;
 }
 ChurchArc.dismissSummons(battle);
 ArmoryArc.resolvePorchFlight(battle);
 if(!livingEnemy()&&window.NextChapter?.isAmbush?.(battle.kind)){
  const position=battle.returnPosition;
  battle=null;
  $('battle').hidden=true;$('enemy-intents').hidden=true;$('character').disabled=false;
  run(()=>NextChapter.afterPezzackAmbush(position));
  return;
 }
 if(!livingEnemy()){if(finishBellflowerBoarding())return;const {kind,returnPosition}=battle;battle=null;$('dice-panel').hidden=true;$('battle').hidden=true;$('character').disabled=false;if(window.IlniusFountain?.isBattle(kind)){$('enemy-intents').hidden=true;run(()=>IlniusFountain.afterBattle(kind,returnPosition));return;}if(window.DinyarRecon?.isDinyarBattle(kind)){$('enemy-intents').hidden=true;run(()=>DinyarRecon.afterBattle(kind,returnPosition));return;}if(window.DarkRain?.isBearBattle(kind)){$('enemy-intents').hidden=true;run(()=>DarkRain.afterBattle(returnPosition));return;}if(window.TathlumHunt?.isHuntBattle(kind)){$('enemy-intents').hidden=true;run(()=>TathlumHunt.afterBattle(returnPosition));return;}if(window.BarrowCovenant?.isCovenantBattle(kind)){$('enemy-intents').hidden=true;run(()=>BarrowCovenant.afterBattle(returnPosition));return;}if(window.BarrowTrail?.isTrailBattle(kind)){$('enemy-intents').hidden=true;run(()=>BarrowTrail.afterBattle(kind,returnPosition));return;}if(window.SethicMansion?.isMansionBattle(kind)){$('enemy-intents').hidden=true;run(()=>SethicMansion.afterBattle(kind,returnPosition));return;}if(kind==='rachikan_raid'){$('enemy-intents').hidden=true;run(()=>Rachikan.afterBattle(returnPosition));return;}if(kind==='belde_watch'){$('enemy-intents').hidden=true;run(()=>Belde.afterBattle(returnPosition));return;}if(kind==='pale_vokadus_duel'){$('enemy-intents').hidden=true;run(()=>PaleBall.afterBattle(returnPosition));return;}if(kind==='nicolo_gray_men'){$('enemy-intents').hidden=true;run(()=>NicoloArc.afterBattle(returnPosition));return;}if(kind==='sethic_hogs'){$('enemy-intents').hidden=true;run(()=>SethicFarm.afterBattle(returnPosition));return;}if(kind.startsWith('efisio_')){$('enemy-intents').hidden=true;run(()=>EfisioArc.afterBattle(kind,returnPosition));return;}if(kind==='arego_fex_rematch'){$('enemy-intents').hidden=true;run(()=>AregoReturn.afterBattle(returnPosition));return;}if(kind==='arego_cell_devils'){$('enemy-intents').hidden=true;run(()=>InfernoGate.afterBattle(returnPosition));return;}if(kind.startsWith('arego_')){$('enemy-intents').hidden=true;run(()=>FortArego.afterBattle(kind,returnPosition));return;}if(kind==='senara_graveyard_angel'){$('enemy-intents').hidden=true;run(()=>SenaraGraveyard.afterBattle(returnPosition));return;}if(kind==='senara_wagon_escort'){$('enemy-intents').hidden=true;run(()=>SenaraWagon.afterBattle(returnPosition));return;}if(kind==='whisperwood_unicorn_assault'){$('enemy-intents').hidden=true;run(()=>WhisperwoodGlade.afterBattle(returnPosition));return;}if(kind.startsWith('whisperwood_')){$('enemy-intents').hidden=true;run(()=>WhisperwoodCamp.afterBattle(kind,returnPosition));return;}if(kind==='egorian_bodyguards'){$('character').disabled=true;$('enemy-intents').hidden=true;run(()=>EgorianExecution.afterBattle(returnPosition));return;}if(kind.startsWith('south_road_')){$('character').disabled=true;$('enemy-intents').hidden=true;run(()=>SouthRoad.afterBattle(kind,returnPosition));return;}if(kind.startsWith('fastness_')){$('enemy-intents').hidden=true;run(()=>FastnessArc.afterBattle(kind,returnPosition));return;}if(kind.startsWith('supply_')){updateObjective();paintParty();run(()=>SupplyArc.afterBattle(kind));return;}if(kind.startsWith('covert_')){updateObjective();paintParty();run(()=>CovertArc.afterBattle(kind));return;}if(kind.startsWith('disruption_')){updateObjective();paintParty();run(()=>DisruptionArc.afterBattle(kind));return;}if(kind.startsWith('kantaria_')){updateObjective();paintParty();run(()=>KantariaArc.afterBattle(kind));return;}if(kind.startsWith('court_')){updateObjective();paintParty();run(()=>CourtArc.afterBattle(kind));return;}if(kind.startsWith('fort_')){updateObjective();paintParty();run(()=>FortArc.afterBattle(kind));return;}if(kind.startsWith('armory_')){updateObjective();paintParty();run(()=>ArmoryArc.afterBattle(kind));return;}if(kind.startsWith('church_')){updateObjective();paintParty();run(()=>ChurchArc.afterBattle(kind));return;}if(['ovinnik','execution'].includes(kind)){updateObjective();paintParty();run(()=>PoliticalMovement.afterBattle(kind));return;}if(['bolgart','wereboar'].includes(kind)){updateObjective();paintParty();run(()=>LastStand.afterBattle(kind));return;}if(kind==='deputies'){updateObjective();paintParty();run(()=>window.NextArc.afterBattle(returnPosition));return;}quest.victory=true;updateObjective();paintParty();save();run(async()=>{await say(null,'Viggo is dead at his own altar.');await say('freya','Clean. Now the rapier.');});return;}
 await advanceInitiative(true,token);
}
function beginInitiative(){
 if(!battle?.pendingInit)return;const current=battle,token=epoch;current.pendingInit=false;current.busy=true;current.reveal=true;
 current.order=Initiative.roll(units,current.enemies,NAMES,()=>1+Math.floor(Math.random()*20));current.turn=0;
 const list=$('initiative-results');list.replaceChildren();current.order.forEach((entry,i)=>{
  const row=document.createElement('li');row.className='init-'+entry.side;row.style.setProperty('--rank',i);const rank=document.createElement('span'),die=document.createElement('span'),copy=document.createElement('span'),name=document.createElement('strong'),math=document.createElement('small');
  rank.textContent=i+1;die.className='init-die';die.innerHTML=dieMarkup(20,entry.die);name.className='init-name';name.textContent=entry.name;math.textContent='D20 '+entry.die+' '+signed(entry.modifier)+' = '+entry.total;copy.append(name,math);row.append(rank,die,copy);list.append(row);
 });
 window.PresentationPolish?.paintDice();$('initiative-reveal').hidden=false;$('dice-panel').hidden=true;$('initiative-start').textContent=reduce.matches?'Start battle · Enter / E':'Skip reveal · Enter / E';$('initiative-start').focus({preventScroll:true});paintBattle();
 delay(reduce.matches?0:1500).then(()=>{if(epoch===token&&battle===current&&current.reveal)$('initiative-start').textContent='Start battle · Enter / E';});
}
async function startInitiative(){
 if(!battle?.reveal)return;const token=epoch;battle.reveal=false;$('initiative-reveal').hidden=true;keys.clear();
 try{if(window.BarrowCovenant?.isCovenantBattle(battle.kind))await BarrowCovenant.openingStrike(battle);if(window.IlniusFountain?.isBattle(battle?.kind))await IlniusFountain.openingStrike(battle);await advanceInitiative(false,token);}catch(e){if(e!==CANCEL){console.error(e);if(battle){battle.busy=false;paintBattle();}}}
}
function initiativeDefeat(){if(!battle||!units.every(u=>hp[u.id]<=0))return false;battle=null;$('battle').hidden=true;$('initiative-reveal').hidden=true;$('character').disabled=false;run(()=>fail('The party is overwhelmed. Return to the checkpoint before this encounter.'));return true;}
function finishBellflowerBoarding(){
 if(!battle||!window.BellflowerBarge?.retreatReady(battle))return false;
 const position=battle.returnPosition;
 battle=null;
 $('battle').hidden=true;
 $('enemy-intents').hidden=true;
 $('character').disabled=false;
 run(()=>BellflowerBarge.afterBattle(position));
 return true;
}
async function advanceInitiative(increment,token){
 if(!battle||token!==epoch)return;if(increment)battle.turn++;
 while(battle&&token===epoch){
  if(initiativeDefeat())return;
  if(battle.turn>=battle.order.length){
   if(finishBellflowerBoarding())return;
   await ChurchArc.support();if(!battle||token!==epoch)return;
   window.AregoReturn?.support();window.NicoloArc?.support();
   battle.round++;battle.turn=0;battle.smoke=Math.max(0,battle.smoke-1);battle.enemies.forEach(e=>e.shaken=Math.max(0,(e.shaken||0)-1));
   if(battle.paralyzed&&battle.round===2){battle.paralyzed=null;log('J’Mal shakes off paralysis.');}planEnemyRound();
  }
  const entry=battle.order[battle.turn];if(!Initiative.eligible(entry,units,battle.enemies,hp,battle.round,battle.paralyzed)){battle.turn++;continue;}
  const actor=Initiative.actor(entry,units,battle.enemies);
  if(entry.side==='party'){actor.guard=false;actor.ethereal=false;battle.busy=false;paintBattle();canvas.focus({preventScroll:true});return;}
  battle.busy=true;paintBattle();await enemyStrike(actor,token);if(!battle||token!==epoch)return;if(initiativeDefeat())return;battle.turn++;
 }
}
$('initiative-start').onclick=startInitiative;

async function enemyStrike(enemy,token){
 if(!battle||token!==epoch||enemy.actedRound===battle.round)return;
 enemy.actedRound=battle.round;
 if(!enemy.intent)planEnemyRound();
 if(await window.FastnessArc?.enemySupport(enemy))return;
 if(token!==epoch||!battle)return;
 const intent=enemy.intent,target=units.find(u=>u.id===intent?.target);
 // Keep the announced target: a fallen target costs the enemy this action.
 if(!target||hp[target.id]<=0){log(enemy.name+' · Target down.');return;}
 if(target.ethereal){log(enemy.name+' cannot strike J’Mal while he is phased.');return;}
 await window.ChurchArc?.enemyPreparation?.(enemy);if(token!==epoch||!battle)return;
 const penalty=(battle.smoke?4:0)+(enemy.shaken?2:0),bonus=STATS[enemy.id].atk-penalty,ac=combatAC(target.id)+(target.guard?4:0),total=await rollDice(enemy.name+' · '+intent.move+' → '+NAMES[target.id],20,1,bonus,'AC '+ac),roll=total-bonus;
 if(token!==epoch||!battle)return;
 if(roll===20||roll!==1&&total>=ac){
  const rolled=await damage(STATS[enemy.id].dmg,enemy.name+' · Damage');
  const raw=rolled+intent.extra;
  const armor=intent.physical===false?0:(STATS[target.id].physicalDR||0);
  const absorbed=Math.min(raw,armor);
  const value=EnemyTactics.damage(raw,target.guard,armor);
  await animateAction(enemy,target,intent.effect||'attack',true,()=>{
   hp[target.id]=Math.max(0,hp[target.id]-value);
   GameAudio.effect('hit');
   flash(target,'−'+value,'#ee9a88');
  });
  const protection=[];
  if(absorbed)protection.push('Zara Geitta −'+absorbed);
  if(target.guard)protection.push('Guard −'+(raw-absorbed-value));
  log([enemy.name+' · '+intent.move,NAMES[target.id]+': −'+value+' HP',protection.join(' · ')].filter(Boolean).join('\n'));
 }else{
  await animateAction(enemy,target,intent.effect||'attack',false);
  flash(target,'MISS','#bfc1d1');
  log(enemy.name+' misses '+NAMES[target.id]+(target.guard?'’s guard.':'.'));
 }
 paintParty();
 await delay(220);
}
async function fail(text){await say('Defeat',text);const c=await say(null,'Return to the last checkpoint?',['[Retry the encounter]','[Restart the chapter]']);if(c===0)reset(true);else reset();}
function stepUnit(u,gx,gy){if(!passable(gx,gy))return false;const tx=gx*T+8,ty=gy*T+8,dx=tx-u.x,dy=ty-u.y;u.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';u.step={sx:u.x,sy:u.y,tx,ty,p:0};return true;}
function advance(u,dt,speed){if(!u.step)return false;u.step.p=Math.min(1,u.step.p+dt*speed);u.x=u.step.sx+(u.step.tx-u.step.sx)*u.step.p;u.y=u.step.sy+(u.step.ty-u.step.sy)*u.step.p;u.anim+=dt;if(u.step.p>=1){u.x=u.step.tx;u.y=u.step.ty;u.step=null;return true;}return false;}
function walkTo(gx,gy){if(!ready||introOpen||journeyOpen||levelOpen||dialogOpen||taskBusy||battle)return;const u=units[0],from=u.step?cell(u.step.tx,u.step.ty):cell(u.x,u.y),p=findPath(from,[gx,gy]);if(p){path=p;return true;}return false;}
function beginWalkTap(d){if(!ready||introOpen||journeyOpen||levelOpen||dialogOpen||taskBusy||battle||!DIR[d]||units[0].step)return false;const u=units[0],a=cell(u.x,u.y),v=DIR[d];path=[];u.dir=d;return stepUnit(u,a[0]+v[0],a[1]+v[1]);}
function update(dt){if(campaignLoading||Handheld.isOpen()||$('save-import-dialog').open)return;if(ready&&!introOpen&&!journeyOpen&&!levelOpen&&!briefingOpen&&!dialogOpen&&!taskBusy&&!battle)updateCitizens(dt);
 for(const u of units){u.flash=Math.max(0,(u.flash||0)-dt);u.lunge=Math.max(0,(u.lunge||0)-dt);}for(const e of battle?.enemies||[]){e.flash=Math.max(0,(e.flash||0)-dt);e.lunge=Math.max(0,(e.lunge||0)-dt);}
 fx=fx.filter(f=>(f.life-=dt)>0);if(!ready||introOpen||journeyOpen||levelOpen||dialogOpen||taskBusy||battle)return;
 const u=units[0],speed=keys.has('run')?8:5;
 if(u.step){
  const interaction=u.step.interaction;
  if(advance(u,dt,speed)){
   trail.unshift(cell(u.x,u.y));
   trail=trail.slice(0,64);
   if(interaction){void interact(interaction);return;}
  }
 }
 else{const d=['up','down','left','right'].find(d=>keys.has(d));if(d){path=[];const a=cell(u.x,u.y),v=DIR[d];u.dir=d;stepUnit(u,a[0]+v[0],a[1]+v[1]);}else if(path.length){const to=path.shift();stepUnit(u,...to);}}
 for(let i=1;i<units.length;i++){const f=units[i];if(f.step)advance(f,dt,speed);else{const desired=trail[Math.min(i*2,trail.length-1)],from=cell(f.x,f.y);if(desired&&(from[0]!==desired[0]||from[1]!==desired[1])){const p=findPath(from,desired);if(p?.length)stepUnit(f,...p[0]);}}}
 if(!u.step&&window.DinyarRecon?.canSensePostern()){
  run(()=>DinyarRecon.sensePostern());
  return;
 }
 const p=nearPoint();$('prompt').hidden=!p;if(p)$('prompt').textContent='E · '+p.label;
}
function drawActor(g,u,height=55){
 if(window.EgorianDischarge?.drawActor(g,u,height))return;
 g.imageSmoothingEnabled=false;
 const variant=u.id==='freya'?window.EgorianTrial?.movement():u.id==='draymus'?window.EgorianMort?.movement():null;
 const meta=variant?.meta||window.PARTY_FRAMES[u.id];let im=variant?.image||sheets[u.id];if(!im)return;
 const row=u.dir==='up'?2:u.dir==='down'?0:1,col=u.step?meta.walkCycle[Math.floor(u.anim*10)%4]:0,f=col===3?meta.oppositeStep.frames[row]:meta.frames[row*3+col],scale=height/(f.scaleBasis||meta.maxHeight);if(col===3)im=sheets[u.id+'-opposite'];
 const x=Math.round(u.x),y=Math.round(u.y);g.fillStyle='#02060c66';g.fillRect(x-8,y-2,16,4);g.save();g.translate(x,y+2-(u.lunge?Math.sin(u.lunge/.22*Math.PI)*5:0));if(u.dir==='left')g.scale(-1,1);g.globalAlpha*=u.opacity??(hp[u.id]===0?.38:1);
 g.drawImage(im,f.x,f.y,f.w,f.h,Math.round((f.x-f.anchorX)*scale),-Math.round(f.h*scale),Math.round(f.w*scale),Math.round(f.h*scale));g.restore();
}
function drawNPC(u){if(window.TathlumHunt?.drawPatrol(ctx,u))return;if(u.pose==='prone'||u.hp!==undefined&&u.hp<=0){ctx.save();ctx.globalAlpha*=u.opacity??(u.pose==='prone'?1:.65);ctx.translate(u.x,u.y);ctx.rotate(-Math.PI/2);const flat={...u,x:0,y:0,hp:undefined,pose:null};if(CORE.includes(u.id))drawActor(ctx,flat);else drawNPC(flat);ctx.restore();return;}if(u.id==='bruce'){drawActor(ctx,{...u,step:null,anim:0},55);return;}if(u.id==='reese'){drawActor(ctx,{...u,dir:'up',step:null,anim:0},55);return;}if(u.pose==='stocks'&&art.bolgartStocks){const im=art.bolgartStocks;ctx.drawImage(im,104,137,1046,1100,u.x-35,u.y-74,70,74);return;}
 if(u.id==='krenshar')return;
  if(u.id.startsWith('citizen-')||u.id.startsWith('execution-citizen-')){drawCitizen(u);return;}
 if(u.id==='tria'||u.id==='corrine'){drawQuestgiver(u.id,u.x,u.y,u.height||58);return;}
 if(window.FastnessArc?.drawNPC(u))return;
 if(window.SupplyArc?.drawNPC(u))return;if(window.CovertArc?.drawNPC(u))return;
 if(PoliticalMovement.drawNPC(u))return;
 if(window.NextArc.drawNPC(u))return;
 if(window.NextChapter.drawNPC(u))return;
 if(u.id==='guard'){const im=art.guard;ctx.drawImage(im,u.x-17,u.y-54,34,56);return;}
 const f=window.CHAPTER_NPCS[u.id],im=art.npcs;if(!f||!im)return;const scale=55/f.h;ctx.save();
 ctx.drawImage(im,f.x,f.y,f.w,f.h,Math.round(u.x-f.w*scale/2),Math.round(u.y-55),Math.round(f.w*scale),55);ctx.restore();
 if(battle&&u.hp>0){rect(u.x-16,u.y-64,32,3,'#151522');rect(u.x-16,u.y-64,Math.max(0,32*u.hp/u.max),3,'#c46652');}
}
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
function buildFlicker(){
 flicker=[];
 const image=art[scene],lights=scenes[scene].lights;
 if(!image||!lights?.length)return;
 const sample=document.createElement('canvas');
 sample.width=640;sample.height=400;
 const g=sample.getContext('2d',{willReadFrequently:true});
 SceneLayers.foreground(g,image,{contain:MAP_LAYERS[scene]?.contain});
 let pixels;
 try{pixels=g.getImageData(0,0,640,400).data;}catch{return;}
 flicker=lights.map(([x,y],index)=>{
  const mask=document.createElement('canvas');
  mask.width=33;mask.height=49;
  const mg=mask.getContext('2d'),data=mg.createImageData(mask.width,mask.height);
  for(let yy=0;yy<mask.height;yy++)for(let xx=0;xx<mask.width;xx++){
   const wx=x-16+xx,wy=y-24+yy;
   const distance=((xx-16)/16)**2+((yy-24)/24)**2;
   if(distance>=1||wx<0||wy<0||wx>=640||wy>=400)continue;
   const pixel=(wy*640+wx)*4;
   const [r,green,b,alpha]=pixels.subarray(pixel,pixel+4);
   if(alpha===0||r<=125||green<=65||r<=green*1.12||green<=b*1.2)continue;
   const offset=(yy*mask.width+xx)*4;
   data.data.set([r,green,b,Math.round(alpha*Math.min(1,(r-110)/120)*(1-distance))],offset);
  }
  mg.putImageData(data,0,0);
  return {mask,x:x-16,y:y-24,index};
 });
}
function drawMapLights(t){
 if(reduce.matches||!flicker.length)return;
 ctx.save();
 ctx.globalCompositeOperation='screen';
 for(const {mask,x,y,index} of flicker){
  const phase=t+index*1.31;
  ctx.globalAlpha=.085+.04*Math.sin(phase*1.9)+.025*Math.sin(phase*3.7);
  ctx.drawImage(mask,x,y);
 }
 ctx.restore();
}
function render(t){if(!journeyOpen&&!taskBusy)$('journey').hidden=true;GameAudio.tick();t=Handheld.time(t);$('pause-toggle').hidden=!ready||introOpen||dialogOpen||journeyOpen||levelOpen||briefingOpen||taskBusy;
 $('quest-task').hidden=!ready||introOpen||briefingOpen||journeyOpen||levelOpen||!!battle;
 rect(0,0,640,canvas.height,'#0b1018');if(ready&&TitleScreen.draw(ctx,t))return;if(!ready||introOpen)return;if(battle){renderBattle(t);return;}ctx.save();ctx.translate(0,SCREEN.mapTop);try{if(briefingOpen){renderBriefing(t);return;}window.SceneLayers.draw(ctx,window.MAP_LAYERS[scene],window.BarleybridgeScout?.mapImage()||window.IlniusFountain?.mapImage()||window.DinyarRecon?.mapImage()||window.MolthuneCoffin?.mapImage()||window.SkadiParley?.mapImage()||window.DarkRain?.mapImage()||window.TathlumHunt?.mapImage()||window.Menador?.mapImage()||window.BarrowCovenant?.mapImage()||window.BarrowTrail?.mapImage()||window.VyreWish?.mapImage()||window.SethicMansion?.mapImage()||window.BellflowerBarn?.mapImage()||window.BellflowerBarge?.mapImage()||window.Pezzack?.mapImage()||window.Rachikan?.mapImage()||window.Ballerina?.mapImage()||window.HinjiTavern?.mapImage()||window.Belde?.mapImage()||window.PaleBall?.mapImage()||window.NicoloArc?.mapImage()||window.SethicLedgers?.mapImage()||window.SethicFarm?.mapImage()||window.EgorianFeud?.mapImage()||window.EgorianSting?.mapImage()||window.EfisioArc?.mapImage()||window.Hinji?.mapImage()||window.Westcrown?.mapImage()||window.RemesianaMarket?.mapImage()||window.EgorianFountain?.mapImage()||window.EgorianDischarge?.mapImage()||window.AregoExit?.mapImage()||window.AregoAmbush?.mapImage()||window.InfernoGate?.mapImage()||window.FortArego?.mapImage()||window.SenaraGraveyard?.mapImage()||window.SenaraWagon?.mapImage()||window.WhisperwoodGlade?.mapImage()||window.WhisperwoodCamp?.mapImage()||window.SenaraCitadel?.mapImage()||window.SenaraDaggers?.mapImage()||window.SenaraCover?.mapImage()||window.SenaraArrival?.mapImage()||window.EgorianExecution?.mapImage()||window.EgorianMort?.mapImage()||window.EgorianTrial?.mapImage()||window.EgorianNight?.mapImage()||window.EgorianArrival?.mapImage()||window.SouthRoad?.mapImage()||window.KantariaAftermath?.mapImage()||window.FastnessArc?.mapImage()||window.SupplyArc?.mapImage()||window.CovertArc?.mapImage()||DisruptionArc.mapImage()||KantariaArc.mapImage()||CourtArc.mapImage()||FortArc.mapImage()||ArmoryArc.mapImage()||ChurchArc.mapImage(),t,{reduced:reduce.matches,top:-SCREEN.mapTop,bottom:SCREEN.height-SCREEN.mapTop});window.AregoAmbush?.effects(ctx,t);window.InfernoGate?.effects(ctx,t);window.AregoExit?.effects(ctx);window.EgorianDischarge?.effects(ctx);window.RemesianaMarket?.effects(ctx,t);window.SethicFarm?.effects(ctx,t);window.PaleBall?.effects(ctx,t);window.Pezzack?.effects(ctx,t);window.BellflowerBarge?.effects(ctx);window.BellflowerBarn?.effects(ctx,t);window.VyreWish?.effects(ctx);window.BarrowTrail?.effects(ctx,t);window.BarrowCovenant?.effects(ctx,t);window.DarkRain?.effects(ctx,t);window.MolthuneCoffin?.effects(ctx,t);window.DinyarRecon?.drawPostern(ctx);window.DinyarRecon?.drawCellVision(ctx);window.IlniusFountain?.drawWater(ctx,t);window.EgorianFountain?.drawWater(ctx,t);window.IlniusFountain?.drawRite(ctx,t);window.FortArego?.effects(ctx,t);window.SenaraWagon?.effects(ctx);window.WhisperwoodCamp?.effects(ctx,t);window.CovertArc?.effects(ctx,t);window.SupplyArc?.effects(ctx);window.SouthRoad?.effects(ctx);DisruptionArc.effects(ctx,t);ArmoryArc.effects(ctx,t);FortArc.effects(ctx,t);CourtArc.effects(ctx,t);KantariaArc.drawCell(ctx);
 window.SkadiParley?.drawDiversion(ctx,t);
 window.NextChapter?.drawTanneryEffects(ctx);
 NextArc.drawTornDecree(ctx);
 NextArc.drawCompactOffice(ctx);
 LastStand.drawPan(ctx);
 LastStand.drawJailAction(ctx);
 PoliticalMovement.drawWatch(ctx);
 PoliticalMovement.drawArrest(ctx);
 DebtsRumors.drawChurchBreach(ctx);
 drawBellRope();window.PresentationPolish?.world(ctx,t);ChurchArc.effects?.(ctx,t);
 drawMapLights(t);
 if(scene==='street'&&!reduce.matches){for(let i=0;i<30;i++){const p=(t*.05+i*.177)%1,x=(i*71+t*(2+i%3))%640,y=30+p*90;rect(x,y,2,1,'#b8aa9044');}}
 if(showPaths){ctx.fillStyle='#83bdb23b';for(let y=0;y<25;y++)for(let x=0;x<40;x++)if(passable(x,y))ctx.fillRect(x*T+1,y*T+1,14,14);}
 if(path.length){ctx.fillStyle='#d9b86a77';path.forEach(([x,y])=>ctx.fillRect(x*T+7,y*T+7,2,2));}
 let npcs=window.BarleybridgeScout?.npcs()||window.IlniusFountain?.npcs()||window.DinyarRecon?.npcs()||window.MolthuneCoffin?.npcs()||window.SkadiParley?.npcs()||window.DarkRain?.npcs()||window.TathlumHunt?.npcs()||window.Menador?.npcs()||window.BarrowCovenant?.npcs()||window.BarrowTrail?.npcs()||window.VyreWish?.npcs()||window.SethicMansion?.npcs()||window.BellflowerBarn?.npcs()||window.BellflowerBarge?.npcs()||window.Pezzack?.npcs()||window.Rachikan?.npcs()||window.Ballerina?.npcs()||window.HinjiTavern?.npcs()||window.Belde?.npcs()||window.PaleBall?.npcs()||window.NicoloArc?.npcs()||window.SethicLedgers?.npcs()||window.SethicFarm?.npcs()||window.EgorianFeud?.npcs()||window.EgorianSting?.npcs()||window.EfisioArc?.npcs()||window.Hinji?.npcs()||window.Westcrown?.npcs()||window.RemesianaMarket?.npcs()||window.EgorianFountain?.npcs()||window.EgorianDischarge?.npcs()||window.AregoExit?.npcs(t)||window.AregoReturn?.npcs(t)||window.AregoAmbush?.npcs()||window.InfernoGate?.npcs(t)||window.FortArego?.npcs()||window.SenaraGraveyard?.npcs()||window.SenaraWagon?.npcs()||window.WhisperwoodGlade?.npcs()||window.WhisperwoodCamp?.npcs()||window.SenaraCitadel?.npcs()||window.SenaraDaggers?.npcs()||window.SenaraCover?.npcs()||window.SenaraArrival?.npcs()||window.EgorianExecution?.npcs()||window.EgorianMort?.npcs()||window.EgorianTrial?.npcs()||window.EgorianNight?.npcs()||window.EgorianArrival?.npcs()||window.SouthRoad?.npcs()||window.KantariaAftermath?.npcs()||window.FastnessArc?.npcs()||window.SupplyArc?.npcs()||window.CovertArc?.npcs()||DisruptionArc.npcs()||KantariaArc.npcs()||CourtArc.npcs()||FortArc.npcs()||ArmoryArc.npcs()||ChurchArc.npcs()||PoliticalMovement.npcs()||DebtsRumors.npcs()||LastStand.npcs()||(quest.chapter3?window.NextArc.npcs():quest.chapter2?window.NextChapter.npcs():scene==='street'?[{id:'guard',x:472,y:184}]:scene==='tavern'?[{id:'cultist',x:264,y:120}]:battle?battle.enemies:quest.victory?[{id:'viggo',x:312,y:136,hp:0}]:[{id:'viggo',x:312,y:136}]);
 const captivePoint=PresentationPolish.captivePoints()[0];
 if(captivePoint&&!npcs.some(n=>n.id==='riley'))npcs=npcs.concat({id:'riley',x:captivePoint.x,y:captivePoint.y});
  const freyaMounted=PoliticalMovement.mountedVisible()||LastStand.mountedFinish();
  const partyDrawables=units.filter(u=>(!battle||hp[u.id]>0)&&!(freyaMounted&&u.id==='freya'));
  const drawables=[...partyDrawables.map(u=>window.MolthuneCoffin?.scoutPose(u)||window.IlniusFountain?.stagePose(u)||u),...npcs,...townsfolk()].map(u=>DebtsRumors.doorPose(LastStand.jailPose(LastStand.tavernPose(NextArc.compactPose(NextArc.sermonPose(PoliticalMovement.executionPose(ChurchArc.ritualPose(FortArc.scoutPose(u))))))))).sort((a,b)=>a.y-b.y);
 for(const u of drawables){
  const pose=window.MolthuneCoffin?.flightPose(u)||window.DinyarRecon?.departurePose(u)||window.SkadiParley?.feastPose(u,t)||CourtArc.escapePose(u);
  if(pose){
   ctx.save();ctx.translate(pose.x,pose.y);ctx.globalAlpha=pose.opacity;
   if(pose.tilt){ctx.translate(u.x,u.y);ctx.rotate(pose.tilt);ctx.translate(-u.x,-u.y);}
  }
  if(CORE.includes(u.id)&&u.pose!=='prone'){
   if(!window.NextChapter?.drawTanneryScout(ctx,u)&&!window.NextChapter?.drawBathScout(ctx,u))drawActor(ctx,u);
  }else drawNPC(u);
  if(pose)ctx.restore();
 }
 NextArc.drawSermonHelm(ctx);
 ChurchArc.drawAssassinStrike(ctx);
 LastStand.drawCellBars(ctx);
 KantariaArc.drawCell(ctx,true);
 LastStand.drawMountedFinish(ctx);
 window.DinyarRecon?.drawDeparture(ctx);
 window.IlniusFountain?.drawStrike(ctx);
 window.EgorianExecution?.effects(ctx);
 window.EgorianMort?.effects(ctx);
 const guide=QuestGuide.current();if($('quest-task-text').textContent!==guide.text)$('quest-task-text').textContent=guide.text;
 if(scene==='church_watch'&&quest.watchStarted||scene==='execution_square'){ctx.fillStyle='#121a3c55';ctx.fillRect(0,0,640,400);}
 if(!finished())for(const rawTarget of guide.targets??(guide.target?[guide.target]:[])){const speaker=rawTarget.speaker||({smearReport:'ingoe',visitAccuser:'accuser',heistWarning:'gerya',missingRemains:'loyal_deputy',allamarFight:'allamar',assassinBoon:'mantis_master',churchConfront:'allamar',cimriAccount:'cimri',executionOrders:'fex',arrestBo:'bo_gramel',doctorTalk:'gerya',ingoeTalk:'ingoe',sermon:'allamar',razelago:'razelago',fexAudience:'fex',jailDecree:'rhona',owner:'owner',cimri:'cimri',guard:'guard',barkeep:'cultist',altar:'viggo'})[rawTarget.id],actor=npcs.find(n=>n.id===speaker),target=rawTarget.marker||(actor?{x:actor.x,y:actor.y-(actor.height||(speaker==='fex'?62:55))+41-53}:{x:rawTarget.x,y:rawTarget.y-53}),lift=reduce.matches?0:Math.round(Math.sin(t*2.5)*2),y=target.y+lift-(rawTarget.id==='churchWatch'?32:0);ctx.save();ctx.globalAlpha=.8;ctx.fillStyle='#f2cf7e';ctx.strokeStyle='#31202a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(target.x,y-9);ctx.lineTo(target.x+9,y);ctx.lineTo(target.x,y+10);ctx.lineTo(target.x-9,y);ctx.closePath();ctx.fill();ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle='#492a2a';ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.beginPath();ctx.moveTo(target.x,y-5);ctx.lineTo(target.x+4,y);ctx.lineTo(target.x,y+5);ctx.lineTo(target.x-4,y);ctx.closePath();ctx.fill();ctx.restore();}

 if(quest.burned&&scene==='tavern'){ctx.fillStyle='rgba(80,55,38,.1)';ctx.fillRect(0,0,640,400);if(!reduce.matches)for(let i=0;i<12;i++){const y=350-(t*35+i*47)%320,x=490+Math.sin(i+t)*60;rect(x,y,1,2,'#ffb97377');}}
 for(const f of fx){ctx.save();ctx.globalAlpha=Math.min(1,f.life*2);ctx.font='11px FolkenPixel';ctx.textAlign='center';ctx.lineWidth=3;const y=f.y-(.9-f.life)*18;ctx.strokeStyle='#0b1018';ctx.strokeText(f.text,f.x,y);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,y);ctx.restore();}
 const currentPrompt=nearPoint();$('prompt').hidden=dialogOpen||!!battle||taskBusy||finished()||!currentPrompt;if(currentPrompt)$('prompt').textContent='E · '+currentPrompt.label;
}finally{ctx.restore();}
}
$('combat-target').onchange=e=>{if(battle&&!battle.busy){battle.target=Number(e.target.value);paintBattle();}};
$('close').onclick=()=>finishDialog();$('reset').onclick=()=>reset();$('retry').onclick=()=>reset(true);
$('paths').onclick=()=>{showPaths=!showPaths;$('paths').textContent=showPaths?'Hide paths':'Show paths';$('paths').setAttribute('aria-pressed',String(showPaths));};
$('interact').onclick=interact;
$('heal-target').onclick=()=>{if(!battle||battle.busy)return;cycleCombatTarget('ally',1);paintBattle();};
$('character').onchange=e=>{if(battle||taskBusy||dialogOpen){e.target.value=lead;return;}const old=lead;if(units[0].step){units[0].x=units[0].step.sx;units[0].y=units[0].step.sy;}lead=e.target.value;const displaced=units.find(u=>u.id===lead);if(displaced)displaced.id=old;units[0].id=lead;units[0].step=null;path=[];keys.clear();paintParty();save();canvas.focus();};
document.addEventListener('keydown',e=>{if(e.target.id==='section-search')return;if(campaignLoading){e.preventDefault();return;}if(e.repeat&&dialogOpen&&['Enter',' ','e','E','Escape','b','B'].includes(e.key)){e.preventDefault();return;}if(Handheld.importKey(e)||TitleScreen.key(e)||Handheld.key(e)||Handheld.dialogKey(e))return;
 if(!introOpen&&!levelOpen&&!journeyOpen&&!dialogOpen&&['i','o','F1'].includes(e.key)){e.preventDefault();if(!e.repeat)Handheld.show(e.key==='i'?'inventory':e.key==='o'?'character':battle?'combat-command':'quest');return;}
 if(!introOpen&&!levelOpen&&!journeyOpen&&!dialogOpen&&(e.key.toLowerCase()==='p'||['Escape','b','B'].includes(e.key)&&(!battle||battle.control?.mode==='commands'))){e.preventDefault();if(!e.repeat)Handheld.show();return;}
 if(levelOpen){e.preventDefault();if(['Enter',' ','e','E'].includes(e.key)&&!e.repeat)$('level-continue').click();else if(e.key==='Tab')$('level-continue').focus();return;}
 if(journeyOpen){e.preventDefault();if(['Enter',' ','e','E'].includes(e.key)&&!e.repeat)$('journey-continue').click();else if(e.key==='Tab')$('journey-continue').focus();return;}
 if(introOpen){const d=KEY[e.key],actions=[$('intro-start'),$('intro-resume'),$('intro-import')].filter(b=>!b.hidden&&!b.disabled);if(['left','right'].includes(d)){e.preventDefault();introIndex=(introIndex+(d==='left'?-1:1)+ROSTER.length)%ROSTER.length;paintIntro();}else if(['up','down'].includes(d)){e.preventDefault();Handheld.navigate(actions,d,1);}else if(['Enter','e','E',' '].includes(e.key)){e.preventDefault();if(!e.repeat)(actions.includes(document.activeElement)?document.activeElement:$('intro-start')).click();}else if(['b','B','Escape'].includes(e.key)){e.preventDefault();if(!TitleScreen.backFromSelection())$('intro-start').focus();}return;}
 if(battle&&!dialogOpen&&!['INPUT','TEXTAREA'].includes(e.target.tagName)&&handleCombatKey(e))return;
 if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
 const menu=dialogOpen&&$('choices').children.length?$('choices'):battle&&!battle.busy?$('actions'):null;
 if(menu&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const buttons=Array.from(menu.querySelectorAll('button')).filter(b=>!b.disabled),index=buttons.indexOf(document.activeElement),delta={ArrowUp:-2,ArrowDown:2,ArrowLeft:-1,ArrowRight:1}[e.key];buttons[index<0?0:(index+delta+buttons.length*2)%buttons.length]?.focus();return;}
 if(dialogOpen){if(['Escape','Enter',' '].includes(e.key)&&!$('close').hidden){e.preventDefault();finishDialog();}if(/^[1-9]$/.test(e.key)){const b=$('choices').children[Number(e.key)-1];if(b){e.preventDefault();b.click();}}if(e.key==='Tab'){e.preventDefault();const focusable=Array.from($('dialog').querySelectorAll('button')).filter(b=>!b.hidden);const index=focusable.indexOf(document.activeElement),next=(index+(e.shiftKey?-1:1)+focusable.length)%focusable.length;focusable[next]?.focus({preventScroll:true});}return;}
 if(KEY[e.key]){e.preventDefault();if(!battle&&!taskBusy){keys.add(KEY[e.key]);if(!e.repeat)beginWalkTap(KEY[e.key]);}}
 else if(['e','E','Enter',' '].includes(e.key)&&e.target.tagName!=='BUTTON'){e.preventDefault();if(!e.repeat)interact();}
 else if(battle&&/^[1-9]$/.test(e.key)){const b=$('actions').children[Number(e.key)-1];if(b&&!b.disabled)b.click();}
});
document.addEventListener('keyup',e=>keys.delete(KEY[e.key]));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{keys.clear();last=0;});
document.querySelectorAll('[data-dir]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(!dialogOpen&&!battle&&!taskBusy)keys.add(b.dataset.dir);};for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.dir));});
canvas.onpointerdown=e=>{if(campaignLoading||Handheld.isOpen()||!ready||introOpen||journeyOpen||levelOpen||dialogOpen||taskBusy)return;canvas.focus();const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*640/r.width,y=(e.clientY-r.top)*SCREEN.height/r.height-(battle?0:SCREEN.mapTop);if(battle){if(battle.busy)return;const i=battle.enemies.findIndex(a=>{const v=battlePosition(a);return a.hp>0&&Math.abs(x-v.x)<35&&y>v.y-v.height-22&&y<v.y+8;});if(i>=0){battle.target=i;if(battle.control?.mode==='enemy')performAction(battle.control.action);else paintBattle();}else{const ally=units.find(a=>{const v=battlePosition(a);return Math.abs(x-v.x)<44&&y>v.y-v.height&&y<v.y+38;});if(ally){battle.ally=ally.id;if(battle.control?.mode==='ally')performAction(battle.control.action);else paintBattle();}}return;}const object=visiblePoints().find(p=>Math.hypot(x-p.x,y-p.y)<25);if(object){if(Math.hypot(units[0].x-object.x,units[0].y-object.y)<INTERACTION_RADIUS){interact(object.id);return;}const candidates=[];for(let gy=0;gy<25;gy++)for(let gx=0;gx<40;gx++)if(passable(gx,gy)&&Math.hypot(gx*T+8-object.x,gy*T+8-object.y)<INTERACTION_RADIUS)candidates.push([gx,gy]);candidates.sort((a,b)=>Math.hypot(a[0]*T+8-units[0].x,a[1]*T+8-units[0].y)-Math.hypot(b[0]*T+8-units[0].x,b[1]*T+8-units[0].y));for(const c of candidates)if(walkTo(...c))return;}else walkTo(...cell(x,y));};
const citizenCache=new Map(),CITIZEN_FRAMES=[{"frames":[{"x":96,"y":27,"w":137,"h":256},{"x":96,"y":307,"w":136,"h":260},{"x":96,"y":582,"w":137,"h":255},{"x":95,"y":852,"w":141,"h":247},{"x":120,"y":1113,"w":89,"h":259}],"maxHeight":260},{"frames":[{"x":365,"y":30,"w":117,"h":254},{"x":370,"y":306,"w":116,"h":261},{"x":367,"y":580,"w":118,"h":259},{"x":369,"y":854,"w":114,"h":247},{"x":370,"y":1118,"w":102,"h":254}],"maxHeight":261},{"frames":[{"x":623,"y":23,"w":129,"h":261},{"x":620,"y":300,"w":131,"h":270},{"x":624,"y":578,"w":133,"h":261},{"x":625,"y":851,"w":130,"h":257},{"x":644,"y":1113,"w":82,"h":263}],"maxHeight":270},{"frames":[{"x":896,"y":32,"w":118,"h":251},{"x":897,"y":310,"w":118,"h":259},{"x":899,"y":584,"w":124,"h":255},{"x":902,"y":854,"w":114,"h":247},{"x":903,"y":1119,"w":99,"h":253}],"maxHeight":259}];
function townsfolk(){const egorian=window.EgorianExecution?.crowd();if(egorian)return egorian;if(scene==='execution_square')return PoliticalMovement.crowd();
 const plans={street:[[384,184],[424,184]],remesiana:[[280,184],[328,216],[168,232]],longacre_jail:[[232,280],[440,296]],last_stand:quest.bolgartSubdued?[]:[[200,256],[456,232],[240,288]],longacre_square:quest.sermonDispersed?(quest.decreesIssued?[[200,280],[472,312],[376,296],[176,232],[456,264],[248,296],[424,232]]:[[176,280],[488,304],[448,224],[216,216]]):[[192,224],[240,232],[288,248],[344,248],[392,232],[448,224],[208,280],[424,288]]};
 if(!plans[scene]?.length)return [];const key=scene+':'+(scene==='longacre_square'?(!quest.sermonDispersed?'crowd':quest.decreesIssued?'quiet':'dispersed'):'quiet');
 if(!citizenCache.has(key))citizenCache.set(key,plans[scene].map(([x,y],i)=>({id:'citizen-'+scene+'-'+i,x,y,homeX:x,homeY:y,dir:key.endsWith('crowd')?'up':'down',variant:({street:[2,3],remesiana:[4,5,6],longacre_jail:[0,7],last_stand:[1,4,6]})[scene]?.[i]??(key.endsWith('crowd')?i%8:key.endsWith('dispersed')?i+4:i<3?i:i+1),crowd:key.endsWith('crowd'),wait:6+i*2,step:null,anim:0})));
 return citizenCache.get(key);
}
function citizenLine(id){
 const i=Number(id.split('-').at(-1))||0;
 const lines=scene==='street'?['Keep your head down. The guards have enough trouble tonight.','I saw smoke across the river. I’m going home.']:scene==='remesiana'?['Ships bring news from everywhere. Most of it is bad.','Mind your purse in the market.','The tide will turn before evening.']:scene==='longacre_square'&&!quest.sermonDispersed?['Quiet, please. Allamar is speaking.','I came to hear what she has to say.','That helm has everyone talking.']:['I have work to finish. I don’t want trouble.','Things were quieter before all these orders.','Best keep moving.'];
 return lines[i%lines.length];
}
function updateCitizens(dt){for(const u of townsfolk()){
 if(u.crowd||reduce.matches)continue;
 if(u.step){u.anim+=dt;const st=u.step;st.progress=Math.min(1,st.progress+dt/3);u.x=st.sx+(st.tx-st.sx)*st.progress;u.y=st.sy+(st.ty-st.sy)*st.progress;if(st.progress===1){u.step=null;u.wait=9+u.variant*3;}continue;}
 u.wait-=dt;if(u.wait>0)continue;u.wait=8;
 const options=u.x!==u.homeX||u.y!==u.homeY?[[u.homeX,u.homeY]]:[[u.x+16,u.y],[u.x-16,u.y],[u.x,u.y+16],[u.x,u.y-16]];
 const dest=options.find(([x,y])=>passable(...cell(x,y))&&visiblePoints().filter(p=>!p.id.startsWith('citizen-')).every(p=>Math.hypot(x-p.x,y-p.y)>36)&&units.every(p=>Math.hypot(x-p.x,y-p.y)>24));
 if(dest){u.dir=dest[0]>u.x?'right':dest[0]<u.x?'left':dest[1]<u.y?'up':'down';u.step={sx:u.x,sy:u.y,tx:dest[0],ty:dest[1],progress:0};}
}}
function drawCitizen(u){
 if(!art.citizens)return;const meta=PresentationPolish.citizenMeta(u.variant),row=u.dir==='up'?3:['left','right'].includes(u.dir)?4:u.step?1+Math.floor(u.anim*2)%2:0,f=meta.frames[row],scale=(u.height??43)/meta.maxHeight;
 ctx.save();ctx.globalAlpha*=u.sermonOpacity??1;ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(u.x),Math.round(u.y));if(u.dir==='left')ctx.scale(-1,1);ctx.drawImage(u.variant<4?art.citizens:art['townsfolk-sheet-v2.png'],f.x,f.y,f.w,f.h,Math.round(-f.w*scale/2),-Math.round(f.h*scale),Math.round(f.w*scale),Math.round(f.h*scale));ctx.restore();
}
const REPLAY_BACKUP=SAVE+'-before-section-replay';
function replaySections(){
 const q={briefed:false},list=[];
 const add=(id,name,map,position,flags='')=>{for(const k of flags.split(' ').filter(Boolean))q[k]=true;list.push({id,name,scene:map,position,quest:structuredClone(q)});};
 add('mission','01 · The mission orders','street',[312,248]);q.briefed=true;
 add('streets','02 · Kintargo streets','street',[312,248]);add('tavern','03 · The Silver Star','tavern',[312,280],'entered');add('temple','04 · Viggo’s temple','temple',[312,312],'ropeCut');
 add('ship','05 · The Western Star','western_star',[360,248],'victory scimitar planted burned done chapter2');
 add('ship-pezzack-market','05A1 · The Pezzack market','western_star_pezzack',[552,168],'voyagePezzackReached');
 add('ship-pezzack-smith','05A2 · The Pezzack blacksmith','western_star_pezzack',[104,200],'voyageGoodsSold');
 add('ship-pezzack-night','05A3 · Return to the ship for the night','western_star_pezzack',[360,168],'voyageBladeDisguised');
 add('ship-pezzack-ambush','05A4 · The Pezzack ambush','western_star_pezzack',[552,168],'voyagePezzackDawn');
 add('ship-pezzack-return','05A5 · Leave Pezzack','western_star_pezzack',[472,248],'voyagePezzackWon');
 add('ship-lookout','05A · The pursuing sail','western_star',[360,144],'voyagePezzack');
 add('ship-boarding','05B · The pirate boarding','western_star',[104,144],'voyageBoardingReady');
 add('ship-prize','05C · Take both ships to Corentyn','western_star',[520,232],'voyageBoardingWon');
 add('ship-blade','05D · Plant the disguised scimitar','western_star_corentyn',[552,200],'voyageCorentynReached');
 add('ship-prize-sale','05E · Hand over the prize','western_star_corentyn',[472,216],'scimitarDisposed');
 add('ship-refit','05F · Refit at Corentyn','western_star_corentyn',[280,168],'voyagePrizeTurnedIn');
 add('market','06 · Remesiana harbor','remesiana',[520,280],'voyageCorentynSupplied');
 add('market-contact','06A · Meet Cimri in Remesiana','remesiana',[200,200],'supplied');
 add('market-farewell','06B · See El Guapo off','remesiana',[424,200],'metCimri');
 add('market-road','06C · Ride to Longacre','remesiana',[520,280],'guapoAway');
 q.activeRoster=OPENING_ROSTER.filter(id=>id!=='guapo');list.at(-1).quest=structuredClone(q);
 add('tannery','07 · J’Mal scouts the tannery','tannery',[136,280]);q.activeRoster=OPENING_ROSTER.filter(id=>id!=='guapo');list.at(-1).quest=structuredClone(q);
 add('employer','08 · Ash House employer','ash_house',[328,328],'scouted ownerDeal payroll');q.goldReward=100;add('rest','09 · Rest at Ash House','ash_house',[328,296],'reward');add('bath','10 · The upstairs bath','bathroom',[328,328],'rested');
 add('sermon','11 · Allamar’s sermon','longacre_square',[328,296],'bathStarted jamalRescued spiritCalmed chapter2Complete chapter3');
 add('decrees','12 · Posting the decrees','ash_house',[328,296],'sermonDispersed decreesIssued');add('dismissal','13 · Rhona’s dismissal','longacre_jail',[328,312],'noticePosted tavernPosted gatePosted');add('ambush','14 · Former deputies’ ambush','longacre_jail',[328,312],'jailPosted rhonaDismissed');
 add('manor-decree','14A · The torn decree','longacre_square',[328,296],'deputiesDefeated deputiesReported');
 add('manor-grounds','14B · The grounds of Scarlet Manor','scarlet_manor_approach',[328,360],'tavernNoticeTorn');
 add('compact','15 · The Hellfire Compact','scarlet_manor',[328,312],'manorWelcomed');add('last-stand','16 · The Last Stand','scarlet_manor',[328,312],'compactSworn chapter3Complete');add('riley-cells','16A · Riley in the jail cells','longacre_cells',[328,344],'chapter4 bolgartSubdued rileyCaptured prisonersJailed');add('hospice','17 · Gerya’s intercepted letter','rohalendi_hospice',[328,344],'chapter4 bolgartSubdued rileyCaptured prisonersJailed rileyQuestioned');add('first-church-doors','17A · The locked church doors','longacre_church_front',[328,288],'doctorAlliance');add('hill','18 · The predawn hill search','angel_hill',[328,344],'doctorAlliance churchEntered churchDoorsRepaired');add('debts','19 · Ingoe’s dockside rumors','ash_house',[328,296],'hillSearched bolgartSecured chapter4Complete');add('movement','20 · Political Movement','ash_house',[328,296],'chapter5 doctorAlliance churchEntered churchDoorsRepaired ingoeAgreement chapter5Complete');q.guapoReturned=true;q.guapoAway=false;q.activeRoster=[...CORE];add('church-watch','21 · Church standoff and watch','ash_house',[328,296],'chapter6 gateOpened ovinnikSubdued ovinnikReported');add('jailbreak','22 · Jailbreak investigation','escape_jail',[328,312],'churchStandoff watchStarted jailbreakHeard');add('execution','23 · Dusk execution','execution_square',[328,296],'jailbreakInspected escapeTrailLost bolgartReleased executionOrdered boCaptured');add('missing-dead','24 · The missing dead','execution_square',[328,296],'executionPrepared boExecuted executionResolved chapter6Complete');add('church-breach','25 · The church breach','church_approach',[328,312],'chapter7 bodiesMissing churchTrail');add('church-entry','26 · The entrance defenders','church_entry',[328,312],'churchBreach churchLoadout');add('church-hall','27 · The Allamar twins','church_hall',[328,312],'entryCleared');add('church-ritual','28 · Riley’s resurrection','church_sanctuary',[328,312],'hallCleared');add('church-final','29 · Allamar’s final stand','church_sanctuary',[328,312],'resurrectionBroken sanctuaryCleared');add('church-altar','30 · The imprisoned assassin','church_ruins',[328,312],'allamarDefeated ghastDestroyed');add('mantis-training','31 · J’Mal’s training','mantis_training',[328,312],'altarBroken assassinKnowledge');add('church-conversion','32 · The new pastor','church_asmodeus',[328,312],'mantisTraining');add('smear-campaign','33 · The accusation against Cimri','church_asmodeus',[328,312],'churchConverted chapter7Complete');add('accuser','34 · J’Mal visits the accuser','accuser_home',[328,312],'chapter8 smearHeard');add('river','35 · Two hours to the river','river_disposal',[328,312],'accuserSilenced');add('heist-warning','36 · Rohalendi’s warning','heist_church',[328,312],'bodyDisposed');add('armory-trap','37 · The armory trap','longacre_armory',[264,312],'heistTip');add('armory-battle','38 · Bo and Dent return','longacre_armory',[264,312],'ambushPrepared');add('jail-fire','39 · El Guapo at the jail','burning_jail',[328,312],'armoryCleared jailReached');add('rhona-escape','40 · Rhona and Cimri','burning_jail',[328,312],'porchCleared');add('fort-lead','41 · The fort’s location','heist_aftermath',[328,312],'cimriRecovered');add('fort-start','42 · Fort Estazano reconnaissance','heist_aftermath',[328,312],'prisonersQuestioned chapter8Complete');add('fort-scout','43 · The silent whistle','fort_scout',[328,344],'chapter9');add('fort-retreat','44 · Retreat to Longacre','fort_scout',[328,344],'fortScouted');add('fort-plan','45 · The second approach','fort_rest',[328,344],'scoutRetreated');add('fort-return','46 · The invisible ambush','fort_assault',[328,344],'fortPrepared');add('fort-battle','47 · The manticore','fort_assault',[328,344],'archerAmbushed');add('fort-tracks','48 · The hidden trail','fort_search',[328,344],'manticoreDefeated');add('fort-woods','49 · The canopy settlement','whisperwood_trail',[328,344],'fortSearched');add('fort-patrol','50 · The returning patrol','fort_patrol',[328,344],'forestMarked');add('fort-end','51 · The Court of Spears lead','fort_patrol',[328,344],'patrolQuestioned');add('court-start','52 · The Court of Spears assault','fort_patrol',[328,344],'chapter9Complete');add('court-approach','53 · The company regroups','court_approach',[328,344],'chapter10');add('court-lower','54 · The lower crossing','court_lower',[328,344],'courtBriefed');add('court-rhona','55 · Rhona’s last stand','court_lower',[328,344],'lowerCleared');add('court-bridge','56 · The upper bridge','court_lower',[328,344],'rhonaDefeated');add('court-lencia','57 · The Angel of Longacre','court_upper',[328,344],'upperReached');add('court-escape','58 · Feather-fall','court_upper',[328,344],'lenciaDefeated');add('court-report','59 · The Longacre report','court_report',[328,344],'lenciaEscaped courtSecured');add('court-furlough','60 · Furlough and Kantaria','court_report',[328,344],'courtReported');add('kantaria-start','61 · The road to Kantaria','court_report',[328,344],'chapter10Complete');add('uskwood-briefing','62 · The Uskwood employment','uskwood_inn',[328,344],'chapter11');add('kantaria-intel','63 · Assessing the occupation','kantaria_streets',[328,344],'uskwoodBriefed');add('kantaria-patrol','64 · An isolated patrol','kantaria_streets',[328,344],'kantariaAssessed');add('hardship-observe','65 · Hardship’s Hearth','hardship_yard',[328,344],'patrolsThinned');add('hardship-yard','66 · The prison work yard','hardship_yard',[328,344],'prisonObserved');add('hardship-hall','67 · The warden’s hall','hardship_hall',[328,344],'prisonYardCleared');add('zara-identity','68 · The captive Hellknight','hardship_hall',[328,344],'prisonHallCleared');add('zara-gear','69 · Zara’s confiscated gear','hardship_hall',[328,344],'zaraIdentified');add('zara-release','70 · Freeing Zara','hardship_hall',[328,344],'zaraGearRecovered');add('zara-hideout','71 · Concealment at the Uskwood','uskwood_hideout',[328,344],'zaraFreed');add('kantaria-end','72 · The next Kantaria targets','uskwood_hideout',[328,344],'zaraHidden');add('disruption-start','73 · Supply lines','uskwood_hideout',[328,344],'chapter11Complete');add('disruption-plan','74 · The dock operation','disruption_briefing',[328,344],'chapter12');add('dock-observe','75 · Dockside collections','kantaria_docks',[328,344],'disruptionBriefed');add('dock-battle','76 · Jonas Reikman','kantaria_docks',[328,344],'docksObserved');add('dock-fires','77 · Burning the docks','kantaria_docks',[328,344],'dockDefendersCleared');add('dock-withdraw','78 · Jonas escapes','kantaria_docks',[328,344],'dockPierBurned dockStoresBurned dockOfficeBurned docksBurned');add('north-assault','79 · North guard tower','kantaria_north_tower',[328,344],'jonasEscaped southTowerDamaged');add('north-cleared','80 · The next tower','kantaria_north_tower',[328,344],'northTowerCleared');add('angel-defender','81 · The angel defender','kantaria_west_tower',[328,344],'westTowerReached');add('west-burn','82 · West tower burns','kantaria_west_tower',[328,344],'angelBroDefeated');add('disruption-return','83 · Return under cover','kantaria_west_tower',[328,344],'westTowerBurned');add('disruption-report','84 · The operation report','disruption_report',[328,344],'');add('disruption-end','85 · Supply lines broken','disruption_report',[328,344],'disruptionReported');add('covert-start','86 · Quiet Knives','disruption_report',[328,344],'chapter12Complete');add('covert-plan','87 · Covert operations','covert_briefing',[328,344],'chapter13');add('market-listen','88 · Kantaria market','kantaria_market',[328,344],'covertBriefed');add('market-riot','89 · Stirring unrest','kantaria_market',[328,344],'marketSurveyed');add('covert-patrol','90 · Militia ambush','kantaria_patrol_lane',[328,344],'marketRiot');add('covert-blame','91 · The false account','kantaria_patrol_lane',[328,344],'patrolAmbushed');add('guild-entry','92 · The labor guild','kantaria_guild',[328,344],'falseBlame');add('guild-records','93 · Compromised ledgers','kantaria_guild',[328,344],'guildEntered');add('manor-entry','94 · Narikopolus Manor','kantaria_manor',[328,344],'guildRecordsTampered');add('manor-artifacts','95 · The gallery theft','kantaria_manor',[328,344],'manorObserved');add('uskwood-return','96 · Return to the Uskwood','kantaria_manor',[328,344],'manorArtifactsTaken');add('uskwood-fight','97 · The Uskwood fight','uskwood_last_night',[328,344],'uskwoodReturned');add('uskwood-fire','98 · The burning inn','uskwood_last_night',[328,344],'uskwoodBurned');add('caves-withdraw','99 · No shelter left','uskwood_last_night',[328,344],'escapeOpened');add('caves-rest','100 · The Fungus Caves','fungus_shelter',[328,344],'cavesReached');add('caves-liaison','101 · Corrine’s assignment','fungus_shelter',[328,344],'caveRested');add('covert-end','102 · The next targets','fungus_shelter',[328,344],'corrineAssigned');add('supply-start','103 · Stranglehold','fungus_shelter',[328,344],'chapter13Complete');add('supply-plan','104 · The remaining targets','supply_caves',[328,344],'chapter14');add('mine-scout','105 · The ore workings','kantaria_mines',[328,344],'supplyBriefed');add('mine-battle','106 · The mine defenders','kantaria_mines',[328,344],'mineObserved');add('mine-secure','107 · Income and equipment','kantaria_mines',[328,344],'mineDefendersCleared');add('cult-scout','108 · The hidden cult','lamashtu_grotto',[328,344],'minesSecured');add('cult-battle','109 · The shrine defenders','lamashtu_grotto',[328,344],'cultLocated');add('cult-destroy','110 · The cult destroyed','lamashtu_grotto',[328,344],'cultDefeated');add('trade-watch','111 · Rebel suppliers','kantaria_supply_wharf',[328,344],'cultDestroyed');add('merchant-strike','112 · The merchant suppliers','kantaria_supply_wharf',[328,344],'tradeObserved');add('captain-strike','113 · Shipping contacts','kantaria_supply_wharf',[328,344],'merchantStruck');add('perimeter-scout','114 · The perimeter forts','kantaria_perimeter',[328,344],'captainStruck');add('perimeter-isolate','115 · Cut off support','kantaria_perimeter',[328,344],'fortObserved');add('perimeter-battle','116 · The isolated garrison','kantaria_perimeter',[328,344],'fortIsolated');add('supply-report','117 · The remaining stronghold','supply_report',[328,344],'perimeterCleared');add('supply-end','118 · Valor’s Fastness awaits','supply_report',[328,344],'supplyReported');
 add('fastness-start','119 · The road to Valor’s Fastness','supply_report',[328,344],'chapter14Complete');
 add('fastness-muster','120 · The dead assemble','fastness_gate',[328,344],'chapter15');
 add('fastness-charge','121 · The outer gate assault','fastness_gate',[328,264],'fastnessMustered');
 add('fastness-threshold','122 · The breach','fastness_gate',[328,216],'fastnessGateCleared');
 add('fastness-hall-road','123 · Through the breach','fastness_gate',[328,152],'fastnessGateComplete');
 add('fastness-hall','124 · The mustering hall','fastness_hall',[328,344]);
 add('fastness-chapel-road','125 · The chapel passage','fastness_hall',[328,216],'fastnessHallCleared');
 add('fastness-chapel','126 · The inner chapel','fastness_chapel',[328,344]);
 add('fastness-stairs','127 · The tower stairs','fastness_chapel',[328,216],'fastnessChapelCleared');
 add('fastness-ascent','128 · Climb the tower stairs','fastness_chapel',[440,168],'fastnessInteriorComplete');
 add('fastness-study','129 · The tower mage','fastness_study',[328,344]);
 add('fastness-study-exit','130 · Above the study','fastness_study',[328,216],'fastnessMageCleared');
 add('fastness-landing','131 · The warpriest','fastness_landing',[328,344]);
 add('fastness-landing-exit','132 · The gallery passage','fastness_landing',[328,216],'fastnessWarpriestCleared');
 add('fastness-gallery','133 · Lencia returns','fastness_gallery',[328,344]);
 add('fastness-last-stair','134 · The last stair','fastness_gallery',[328,216],'fastnessLenciaSlain');
 add('fastness-summit-road','135 · Climb to the summit','fastness_gallery',[328,152],'fastnessAscentComplete');
 add('fastness-summit','136 · Oppian and the Archon','fastness_summit',[328,344]);
 add('fastness-rescue','137 · Over the parapet','fastness_summit',[472,168],'fastnessSummitWon');
 add('fastness-capture','138 · Oppian alive','fastness_tower_base',[328,344],'fastnessOppianRescued');
 add('fastness-report','139 · Kantaria secured','fastness_tower_base',[328,344],'fastnessOppianCaptured');
 add('kantaria-aftermath','140 · Return to Kantaria','fastness_tower_base',[328,344],'chapter15Complete');
 add('kantaria-mayor','141 · The new mayor','kantaria_council',[328,344]);
 add('kantaria-deed','142 · The Uskwood deed','kantaria_council',[328,216],'kantariaMayorMet');
 add('kantaria-gifts','143 · Fex’s rewards','kantaria_council',[328,216],'uskwoodDeedSigned');
 add('kantaria-departure','144 · The South Road awaits','kantaria_council',[328,344],'kantariaGiftsReceived');
 add('south-road-depart','145 · Take the South Road','kantaria_council',[328,344],'kantariaDepartureReady');
 add('south-road-scout','146 · Reese’s warning','south_road',[328,344]);
 add('south-road-infantry','147 · Fire on the road','south_road',[328,232],'roadScouted');
 add('south-road-knights','148 · The Sword Knights charge','south_road',[328,192],'roadInfantryCleared');
 add('south-road-clerics','149 · Reese and the clerics','south_road',[328,160],'roadKnightsCleared');
 add('south-road-heal','150 · Treat Draymus','south_road',[328,176],'roadClericsCleared');
 add('south-road-rest','151 · The night camp','south_road_camp',[328,344],'roadDraymusTreated');
 add('south-road-dawn','152 · Egorian ahead','south_road_camp',[328,344],'roadRested');
 add('egorian-approach','153 · Approach Egorian','south_road_camp',[328,344],'southRoadComplete');
 add('egorian-escort','154 · The West Bridge escort','egorian_bridge',[328,360]);
 add('egorian-handover','155 · Deliver Oppian','egorian_square',[328,360],'egorianBridgeMet');
 add('egorian-temple','156 · The Midnight Temple','egorian_temple',[328,360],'oppianDelivered');
 add('egorian-thorntown','157 · Follow Corrine to Thorntown','egorian_square',[488,160],'egorianTempleSupplied');
 add('egorian-welcome','158 · Lady Tria Falco','egorian_manor',[328,312]);
 add('egorian-watch','159 · Set the night watch','egorian_manor',[328,264],'triaWelcomed');
 add('egorian-night-out','160 · Slip out of Falco Manor','egorian_manor',[328,312],'egorianArrivalComplete');
 add('egorian-svetlana','161 · Find Svetlana','egorian_lantern_lane',[328,344],'egorianNightStarted');
 add('egorian-guard-trail','162 · Follow the guard’s trail','egorian_lantern_lane',[184,216],'egorianSvetlanaMet');
 add('egorian-neighbor','163 · The neighbor’s house','egorian_guard_lane',[328,344]);
 add('egorian-jaquen','164 · Jaquen’s contract','egorian_guard_lane',[120,152],'egorianGuardLeadChecked');
 add('egorian-before-dawn','165 · Back before dawn','egorian_guard_lane',[344,88],'egorianContractAccepted');
 add('egorian-summons','166 · Answer the court summons','egorian_manor',[328,312],'egorianNightReturned');
 add('egorian-zara-court','167 · Zara at the court','egorian_court',[328,344],'egorianTrialStarted');
 add('egorian-freya-testimony','168 · Freya’s testimony','egorian_court',[328,272],'egorianZaraMet');
 add('egorian-jason-testimony','169 · Jason’s testimony','egorian_court',[168,184],'egorianFreyaTestified');
 add('egorian-verdict','170 · The verdict','egorian_court',[168,184],'egorianJasonTestified');
 add('egorian-thumbtown','171 · Zara’s commission','egorian_court',[328,184],'egorianVerdict');
 add('egorian-plate','172 · Zara Geitta','egorian_forge',[328,344],'egorianSmithMet');
 add('egorian-plate-return','173 · The evening before','egorian_forge',[328,200],'zaraGeitta');
 add('egorian-draymus-out','174 · Draymus slips out','egorian_manor',[328,312],'egorianPlateReturned');
 add('egorian-draymus-ambush','175 · A knife in the dark','egorian_lower_lane',[328,344],'egorianDraymusStarted');
 add('egorian-flesh-puppet','176 · Flesh Puppet','egorian_lower_lane',[328,248],'egorianAmbushResolved');
 add('egorian-chair','177 · An antique wheelchair','egorian_lower_lane',[328,216],'egorianJoeRaised');
 add('egorian-disguise','178 · An elderly gentleman','egorian_lower_lane',[472,168],'egorianChairBought');
 add('egorian-draymus-dawn','179 · Egorian wakes','egorian_lower_lane',[456,200],'egorianDisguiseReady');
 add('egorian-excruciation-start','180 · Oppian’s excruciation','egorian_manor',[328,312],'egorianDraymusReturned');
 add('egorian-excruciation-charges','181 · Hear the charges','egorian_excruciation',[328,344],'egorianExcruciationStarted');
 add('egorian-excruciation-follow','182 · Through the crowd','egorian_excruciation',[328,216],'egorianChargesRead');
 add('egorian-excruciation-noble','183 · The young noble','egorian_excruciation',[416,216],'egorianTracked');
 add('egorian-excruciation-duel','184 · Defend J’Mal','egorian_excruciation',[464,224],'egorianAssassination');
 add('egorian-excruciation-hold','185 · The last bodyguard','egorian_excruciation',[448,232],'egorianDuelWon');
 add('egorian-excruciation-heal','186 · Stabilize J’Mal','egorian_excruciation',[480,224],'egorianLastGuardDown');
 add('egorian-excruciation-dottari','187 · The Dottari inquiry','egorian_excruciation',[448,248],'egorianJmalEscaped');
 add('egorian-excruciation-resume','188 · The ceremony resumes','egorian_excruciation',[400,216],'egorianDottariHeard');
 add('egorian-inquiry','189 · The inquiry ends','egorian_excruciation',[328,216],'egorianExcruciated');
 add('egorian-ruling','190 · The judges’ ruling','egorian_inquiry',[328,344],'egorianInquiryVisited');
 add('senara-briefing','191 · Razelago’s orders','egorian_inquiry',[328,184],'egorianChargesDropped');
 add('senara-depart','192 · Leave Egorian','egorian_inquiry',[424,248],'senaraOrders');
 add('senara-approach','193 · The Senara garrison','senara_waterfront',[360,344]);
 add('senara-residence','194 · Fex’s residence','senara_waterfront',[360,168],'senaraGarrisonSeen');
 add('senara-talisman','195 · The empty coffer','senara_fex_villa',[328,344]);
 add('senara-party','196 · El Guapo’s house party','senara_fex_villa',[536,216],'senaraTalismanMissing');
 add('senara-toast','197 · The garrison guests','senara_party',[328,344],'senaraPartyStarted');
 add('senara-slip-out','198 · Slip out of the reception','senara_party',[328,216],'senaraPartyPlayed');
 add('senara-orphan-approach','199 · The orphanage yard','senara_orphan_yard',[328,344],'senaraOrphanApproach');
 add('senara-orphan-search','200 · The old guild records','senara_orphanage',[328,344],'senaraOrphanEntered');
 add('senara-orphan-witnesses','201 · Three witnesses','senara_orphanage',[512,184],'senaraOrphanClue');
 add('senara-orphan-return','202 · A route below Senara','senara_orphanage',[200,216],'senaraWitnessesSeen');
 add('senara-sewer-lead','203 · Follow the sewer lead','senara_fex_villa',[328,312],'senaraOrphanageComplete');
 add('senara-sewer-rendezvous','204 · A figure in the sewer','senara_sewers',[328,344],'senaraSewersEntered');
 add('senara-sewer-hideout','205 · Follow J’Mal','senara_sewers',[328,248],'senaraJmalFound');
 add('senara-daggers-scout','206 · Scout the Black Daggers','senara_daggers_hideout',[328,344],'senaraGuildEntered');
 add('senara-daggers-strike','207 · The surprise round','senara_daggers_hideout',[328,264],'senaraGuildScouted');
 add('senara-daggers-terms','208 · The guild surrenders','senara_daggers_hideout',[328,240],'senaraGuildSurrendered');
 add('senara-citadel-visit','209 · The Hellknight citadel','senara_fex_villa',[328,312],'senaraTalismanRecovered');
 add('senara-citadel-greet','210 · The local chapter','senara_hellknight_citadel',[328,264],'senaraCitadelVisited');
 add('senara-citadel-study','211 · Draymus studies a spell','senara_hellknight_citadel',[104,184],'senaraChapterGreeted');
 add('senara-citadel-intel','212 · The old patrol reports','senara_hellknight_citadel',[536,120],'senaraDraymusTrained');
 add('senara-citadel-depart','213 · Take the carriage','senara_hellknight_citadel',[104,184],'senaraForestIntel');
 add('whisperwood-road','214 · Bob and the warhorses','whisperwood_road',[296,344],'senaraCarriageDeparted');
 add('whisperwood-camp-road','215 · Enter the Whisperwood','whisperwood_road',[424,280],'senaraWhisperwoodReady');
 add('whisperwood-night-watch','216 · Make camp','whisperwood_night_camp',[328,344],'whisperwoodCampReached');
 add('whisperwood-night-webs','217 · Webs in the trees','whisperwood_night_camp',[312,248],'whisperwoodWatchSet');
 add('whisperwood-night-giant','218 · The forest giant','whisperwood_night_camp',[296,184],'whisperwoodWebsCleared');
 add('whisperwood-night-bear','219 · Bob and the bear','whisperwood_night_camp',[408,168],'whisperwoodGiantCleared');
 add('whisperwood-night-rescue','220 · Pull Bob clear','whisperwood_night_camp',[424,264],'whisperwoodBobMauled whisperwoodBearDrivenOff');
 add('whisperwood-night-dawn','221 · Dawn in the Whisperwood','whisperwood_night_camp',[424,288],'whisperwoodBobRescued');
 add('whisperwood-glade-trail','222 · The unicorn trail','whisperwood_night_camp',[328,168],'whisperwoodNightComplete');
 add('whisperwood-glade-assault','223 · The Blessing of Unicorns','whisperwood_unicorn_glade',[328,344],'whisperwoodGladeReached');
 add('whisperwood-glade-horns','224 · Three fallen unicorns','whisperwood_unicorn_glade',[328,224],'whisperwoodUnicornsDefeated');
 add('whisperwood-glade-camp','225 · Camp by the creek','whisperwood_unicorn_glade',[328,192],'whisperwoodThreeHorns');
 add('whisperwood-glade-retreat','226 · The counterattack','whisperwood_unicorn_glade',[264,264],'whisperwoodGladeCamped');
 add('senara-wagon-depart','227 · Return to Senara','whisperwood_night_camp',[328,168],'whisperwoodFourthHorn whisperwoodGladeComplete');
 add('senara-wagon-stop','228 · The prison wagon','senara_prison_road',[328,344],'senaraWagonReached');
 add('senara-wagon-escort','229 · Jason’s Dismissal','senara_prison_road',[328,224],'senaraWagonChallenged');
 add('senara-wagon-prisoner','230 · Open the prison wagon','senara_prison_road',[328,224],'senaraEscortDefeated');
 add('senara-wagon-orn','231 · Orn of Nidal','senara_prison_road',[552,152],'senaraPrisonerFreed');
 add('senara-wagon-quay','232 · The road to the quay','senara_prison_road',[552,152],'senaraOrnRecruited');
 add('senara-return-patrols','233 · Reclamation patrols','senara_patrolled_quay',[360,344],'senaraWagonReturned');
 add('senara-grave-slip','234 · Beneath the patrols','senara_patrolled_quay',[360,184],'senaraReturnPatrolsSeen');
 add('senara-grave-tip','235 · Black Daggers’ intelligence','senara_daggers_return',[328,344],'senaraGuildRevisited');
 add('senara-grave-road','236 · The graveyard lead','senara_daggers_return',[328,216],'senaraGraveTip');
 add('senara-grave-fight','237 · The balisse angel','senara_graveyard',[328,344],'senaraGraveReached');
 add('senara-grave-heart','238 · The angel’s heart','senara_graveyard',[328,224],'senaraBalisseDefeated');
 add('senara-grave-lockdown','239 · Senara under lockdown','senara_locked_quay',[360,344],'senaraAngelHeart');
 add('arego-depart','240 · Leave Senara for Fort Arego','senara_locked_quay',[360,200],'senaraLockdownObserved');
 add('arego-devils','241 · Devils on the road','arego_forest_approach',[328,344],'aregoApproachReached');
 add('arego-betrayal','242 · Fex’s betrayal','arego_forest_approach',[328,216],'aregoBetrayalKnown');
 add('arego-prison-approach','243 · The prison yard','arego_forest_approach',[328,176],'aregoFexOpposed');
 add('arego-viona-line','244 · Viona Kadarius','arego_outer_yard',[328,344],'aregoYardReached');
 add('arego-door-fight','245 · The second champion','arego_outer_yard',[328,232],'aregoVionaFell');
 add('arego-secure-yard','246 · The dungeon threshold','arego_outer_yard',[328,200],'aregoChampionsDefeated');
 add('arego-dungeon-entry','247 · Descend into Fort Arego','arego_outer_yard',[328,136],'aregoExteriorSecured');
 add('arego-cell-devils','248 · The prison cells','arego_prison_cells',[328,344],'aregoDungeonEntered');
 add('arego-devil-parley','249 · The devil at the stair','arego_prison_cells',[328,240],'aregoCellDevilsDefeated');
 add('arego-gate-stair','250 · The lowest stair','arego_prison_cells',[400,192],'aregoStairParley');
 add('arego-inferno-gate','251 · The Inferno Gate','arego_inferno_gate',[328,344],'aregoGateReached');
 add('arego-visperthul','252 · Visperthul of Malebolge','arego_inferno_gate',[328,288],'aregoGateSurveyed');
 add('arego-first-pact','253 · Visperthul’s terms','arego_inferno_gate',[472,264],'aregoTalismanExposed');
 add('arego-fex-arrival','254 · Fex at the Inferno Gate','arego_inferno_gate',[472,264],'aregoFirstPact');
 add('arego-fex-ambush','255 · The unseen attackers','arego_inferno_gate',[472,264],'aregoFexArrived');
 add('arego-malebolge-landing','256 · Reese in Malebolge','arego_malebolge_ledge',[312,296],'aregoReeseCrossed');
 add('arego-reese-bargain','257 · Reese’s bargain','arego_malebolge_ledge',[448,168],'aregoReeseSheltered');
 add('arego-bone-devils','258 · Visperthul’s aid','arego_malebolge_ledge',[488,168],'aregoReeseContract');
 add('arego-return-crossing','259 · Back through the gate','arego_malebolge_ledge',[488,168],'aregoBoneDevilsSummoned');
 add('arego-company-rescue','260 · Free the company','arego_inferno_gate',[328,344],'aregoReeseReturned');
 add('arego-fex-rematch','261 · The battle with Fex','arego_inferno_gate',[280,328],'aregoCompanyFreed');
 add('arego-fex-aftermath','262 · The price of the bargain','arego_inferno_gate',[328,312],'aregoFexSlain');
 add('arego-corrine','263 · The Queen’s envoy','arego_inferno_gate',[472,264],'aregoFexAftermath');
 add('arego-negotiation','264 · Contessa’s terms','arego_inferno_gate',[328,304],'aregoCorrineArrived');
 add('arego-seal','265 · Close the Inferno Gate','arego_inferno_gate',[288,320],'aregoExitTerms');
 add('arego-teleport','266 · Escape to Egorian','arego_inferno_gate',[328,304],'aregoGateSealed');
 add('arego-barato','267 · Hotel Barato','egorian_hotel_barato',[328,328],'aregoEgorianEscaped');
 add('egorian-jason-return','268 · Jason’s return','egorian_hotel_barato',[328,280],'aregoReportsSent');
 add('egorian-discharge-rumor','269 · News of the discharge','egorian_hotel_barato',[328,280],'egorianJasonBack');
 add('egorian-discharge-keep','270 · The public discharge','egorian_hotel_barato',[328,280],'egorianDischargeRumor');
 add('egorian-discharge-walk','271 · The walk past the crowd','egorian_discharge_square',[328,144],'egorianFreyaDischarged');
 add('egorian-zara-intervention','272 · Zara enters the lane','egorian_discharge_square',[328,192],'egorianWalkBegan');
 add('egorian-discharge-exit','273 · The silent square','egorian_discharge_square',[328,256],'egorianZaraStoppedCrowd');
 add('egorian-discharge-meal','274 · Dinner at Hotel Barato','egorian_hotel_barato',[328,328],'egorianDischargeHome');
 add('egorian-fountain-vision','275 · Reese’s vision','egorian_hotel_barato',[328,248],'egorianDischargeComplete');
 add('egorian-fountain-meeting','276 · The man by the fountain','egorian_fountain',[328,344],'egorianVisionSeen');
 add('egorian-tailor-watch','277 · The tailor’s routine','egorian_fountain',[360,216],'egorianFountainOrders');
 add('egorian-tailor-shop','278 · The display window','egorian_tailor_street',[328,344],'egorianTailorStreetReached');
 add('egorian-tailor-home','279 · The family’s home','egorian_tailor_street',[136,296],'egorianTailorShopSeen');
 add('egorian-tailor-schools','280 · The schools','egorian_tailor_street',[376,296],'egorianTailorHomeSeen');
 add('egorian-tailor-report','281 · The Thursday deadline','egorian_tailor_street',[536,248],'egorianTailorSchoolsSeen');
 add('egorian-tailor-orders','282 · The stranger’s assignment','egorian_hotel_barato',[328,328],'egorianTailorScouted');
 add('egorian-dapper-street','283 · The Dapper Street Murders','egorian_tailor_street',[328,344],'egorianTailorOrdersCarriedOut');
 add('egorian-tailor-departure','284 · Leave for Remesiana','egorian_tailor_street',[152,328],'egorianTailorAftermathSeen');
 add('remesiana-return','285 · Return to Remesiana','remesiana_return',[520,280],'remesianaReturned');
 add('remesiana-florio','286 · Florio Cento','remesiana_return',[424,184],'remesianaFlorioLead');
 add('remesiana-market-road','287 · The rival market','remesiana_return',[424,184],'remesianaFlorioMet');
 add('remesiana-market-bays','288 · The holding bays','remesiana_rival_market',[328,344],'remesianaMarketReached');
 add('remesiana-market-clear','289 · Clear the market','remesiana_rival_market',[136,152],'remesianaMarketBaysOpen');
 add('remesiana-market-destroy','290 · The empty yard','remesiana_rival_market',[328,344],'remesianaMarketEvacuated');
 add('remesiana-market-withdraw','291 · Leave the ruined market','remesiana_rival_market',[368,168],'remesianaMarketDestroyed');
 add('remesiana-florio-report','292 · A favor repaid','remesiana_return',[424,184],'remesianaMarketWithdrawn');
 add('hinji-road','292a · Leave for Hinji','remesiana_return',[424,184],'remesianaFlorioReported');
 add('hinji-barksdale','292b · Barksdale’s refusal','hinji_shipyard',[328,312],'hinjiReached');
 add('hinji-docket','292c · The promotion docket','hinji_shipyard',[120,184],'hinjiDeclined');
 add('hinji-lebeau','292d · LeBeau’s appointment','hinji_shipyard',[416,152],'hinjiPapersSent');
 add('westcrown-road','293 · Leave for Westcrown','hinji_shipyard',[552,184],'hinjiComplete');
 add('westcrown-brado','294 · Brado Pachia','westcrown_quay',[328,264],'westcrownReached');
 add('westcrown-freight','295 · The freight ledger','westcrown_quay',[280,232],'westcrownHired');
 add('westcrown-note','296 · The sealed note','westcrown_quay',[72,184],'westcrownManifestChecked');
 add('westcrown-berth','297 · The canal berth','westcrown_quay',[368,184],'westcrownNoteDelivered');
 add('westcrown-report','298 · Three favors','westcrown_quay',[576,344],'westcrownBerthChecked');
 add('efisio-road','299 · Return to Egorian','westcrown_quay',[328,264],'westcrownComplete');
 add('efisio-arrest','300 · Attempt to arrest Efisio','egorian_efisio_apartment',[328,328],'efisioApartmentReached');
 add('efisio-contract','301 · Reese’s contract','egorian_efisio_apartment',[328,216],'efisioContractInvoked');
 add('efisio-guards','302 · Efisio’s guards','egorian_efisio_apartment',[328,216],'efisioReeseRestrained');
 add('efisio-window','303 · The fifth-story window','egorian_efisio_apartment',[328,200],'efisioGuardsDefeated');
 add('efisio-duel','304 · Freya and Efisio','egorian_efisio_street',[328,200],'efisioWindowFollowed');
 add('sting-road','305 · Go to Corrine’s debrief','egorian_efisio_street',[328,264],'efisioDefeated');
 add('sting-briefing','306 · Corrine’s sting','egorian_sting_hall',[328,344],'egorianStingReached');
 add('sting-reports','307 · Reports across Cheliax','egorian_sting_hall',[328,272],'egorianStingBriefed');
 add('sting-standing','308 · Standing restored','egorian_sting_hall',[328,200],'egorianStingComplete');
 add('sting-orders','309 · The Queen’s next assignment','egorian_sting_hall',[328,272],'egorianStandingRestored');
 add('feud-road','310 · The first reception','egorian_sting_hall',[328,272],'egorianStingDebriefed');
 add('feud-sethic','311 · Sethic’s offer','egorian_feud_salon',[328,344],'egorianFeudReached');
 add('feud-vasvion','312 · Vasvion’s offer','egorian_feud_salon',[120,224],'egorianSethicHeard');
 add('feud-urgency','313 · The Queen’s patience','egorian_feud_salon',[520,224],'egorianVasvionHeard');
 add('feud-choice','314 · Back Vasvion','egorian_feud_salon',[328,272],'egorianFeudPressure');
 add('sethic-farm-road','315 · Sethic’s devil-hog farm','egorian_feud_salon',[520,224],'egorianVasvionChosen');
 add('sethic-farm-survey','316 · Survey the pens','sethic_devil_hog_farm',[328,344],'sethicFarmReached');
 add('sethic-farm-hogs','317 · The devil-hogs','sethic_devil_hog_farm',[328,264],'sethicFarmSurveyed');
 add('sethic-farm-destroy','318 · Destroy the farm','sethic_devil_hog_farm',[328,224],'sethicHogsDriven');
 add('sethic-farm-withdraw','319 · Leave the ruined farm','sethic_devil_hog_farm',[328,192],'sethicFarmDestroyed');
 add('sethic-records-road','320 · Sethic’s payments to the judges','egorian_feud_salon',[328,344],'sethicFarmComplete');
 add('sethic-payment-ledger','321 · The payment ledger','egorian_judicial_records',[328,344],'sethicRecordsReached');
 add('sethic-court-register','322 · The court register','egorian_judicial_records',[88,168],'sethicPaymentsFound');
 add('sethic-judges','323 · The judges indicted','egorian_judicial_records',[552,168],'sethicRegisterMatched');
 add('sethic-loan-road','324 · Sethic’s foreign loan','egorian_judicial_records',[328,240],'sethicJudgesIndicted');
 add('sethic-loan-dispatch','325 · The strongroom dispatch','egorian_loan_strongroom',[328,344],'sethicLoanReached');
 add('sethic-loan-vault','326 · The attempted theft','egorian_loan_strongroom',[104,200],'sethicLoanTraced');
 add('sethic-loan-withdraw','327 · Empty-handed','egorian_loan_strongroom',[328,168],'sethicLoanFailed');
 add('nicolo-road','328 · Go to meet Nicolo','egorian_feud_salon',[328,344],'sethicFinanceComplete');
 add('nicolo-meet','329 · Nicolo Alazario','egorian_nicolo_lane',[328,344],'nicoloLaneReached');
 add('nicolo-gray-men','330 · The Gray Men','egorian_nicolo_lane',[328,232],'nicoloAmbushed');
 add('nicolo-after','331 · The attempt foiled','egorian_nicolo_lane',[328,216],'nicoloGrayMenDriven');
 add('nicolo-withdraw','332 · Leave the lane','egorian_nicolo_lane',[328,232],'nicoloChecked');
 add('pale-road','333 · The Night of the Pale','egorian_feud_salon',[328,344],'nicoloRescueComplete');
 add('pale-guests','334 · The invited guests','egorian_pale_graveyard',[328,344],'paleBallReached');
 add('pale-show','335 · The Great Mysterio','egorian_pale_graveyard',[232,256],'paleGuestsMet');
 add('pale-queen','336 · Queen Abrogail II','egorian_pale_graveyard',[328,184],'paleShowSeen');
 add('pale-challenge','337 · Vokadus Fex','egorian_pale_graveyard',[440,208],'paleQueenMet');
 add('pale-armor','338 · Freya summons the plate','egorian_pale_graveyard',[328,304],'paleChallenged');
 add('pale-duel','339 · The Hellknight duel','egorian_pale_graveyard',[328,272],'paleArmorSummoned');
 add('pale-loot','340 · Goblins Be Lootin','egorian_pale_graveyard',[328,272],'paleDuelWon');
 add('pale-close','341 · The ball ends','egorian_pale_graveyard',[328,272],'paleLootSeen');
 add('belde-road','342 · Travel to Belde','egorian_feud_salon',[328,344],'paleBallComplete');
 add('belde-watch','343 · The Reclamation watch','belde_square',[328,344],'beldeReached');
 add('belde-fight','344 · Liberate Belde','belde_square',[328,264],'beldeWatchSeen');
 add('belde-yunero','345 · Meet Yunero','belde_square',[328,216],'beldeLiberated');
 add('belde-trivia-one','346 · Chelaxian Noble Trivia','belde_square',[520,216],'beldeTriviaStarted');
 add('belde-trivia-two','347 · The Battle of a Hundred Kings','belde_square',[520,216],'beldeTriviaFirst');
 add('belde-trivia-three','348 · The capital of Cheliax','belde_square',[520,216],'beldeTriviaSecond');
 add('belde-result','349 · Yunero’s concession','belde_square',[520,216],'beldeTriviaWon');
 add('hinji-tavern-road','350 · Leave Belde for Hinji','belde_square',[520,216],'beldeComplete');
 add('hinji-tavern-toast','351 · Meet Titus Vel','hinji_tavern',[328,328],'hinjiTavernReached');
 add('hinji-tavern-watch','352 · The watch arrives','hinji_tavern',[328,184],'hinjiTavernToast');
 add('corentyn-road','353 · Travel to Corentyn','hinji_tavern',[328,248],'hinjiTavernArrested');
 add('corentyn-quay','354 · Sign on to the Ballerina','corentyn_quay',[328,344],'corentynReached');
 add('ballerina-cargo','355 · Check the lashings','ballerina_deck',[328,232],'ballerinaBoarded');
 add('ballerina-watch','356 · Take the coastal watch','ballerina_deck',[184,168],'ballerinaCargoChecked');
 add('rachikan-road','357 · Land at Rachikan','ballerina_deck',[456,200],'ballerinaWatchTaken');
 add('rachikan-scout','358 · Scout the pirate storehouse','rachikan_ruins',[328,344],'rachikanReached');
 add('rachikan-raid','359 · Break the pirate operation','rachikan_ruins',[328,272],'rachikanSurveyed');
 add('rachikan-dead','360 · Draymus and forty corpses','rachikan_ruins',[328,216],'rachikanRaidWon');
 add('pezzack-road','361 · Continue to Pezzack','rachikan_ruins',[328,248],'rachikanComplete');
 add('pezzack-dragon','362 · The dragon over Pezzack','pezzack_manse',[328,344],'pezzackReached');
 add('pezzack-prisoners','363 · Free the prisoners','pezzack_manse',[328,264],'pezzackManseBurned');
 add('pezzack-strix','364 · Strix over the rooftops','pezzack_manse',[552,184],'pezzackPrisonersFreed');
 add('pezzack-escape','365 · Teleport home','pezzack_manse',[328,232],'pezzackStrixSeen');
 add('bellflower-brief','366 · Corrine’s Bellflower assignment','pezzack_egorian',[328,328],'pezzackComplete');
 add('bellflower-prep','367 · Rig the party barge','egorian_bellflower_barge',[328,248],'bellflowerReached');
 add('bellflower-host','368 · Draymus hosts the party','egorian_bellflower_barge',[328,184],'bellflowerPrepared');
 add('bellflower-boarders','369 · Bellflower boarders','egorian_bellflower_barge',[328,232],'bellflowerPartyStarted');
 add('bellflower-recall','370 · Jason’s word of recall','egorian_bellflower_barge',[248,216],'bellflowerHeld');
 add('bellflower-barn-lead','371 · Follow the Bellflower lead','egorian_migos_hideaway',[328,296],'bellflowerBargeComplete');
 add('bellflower-barn-scout','372 · Scout the safehouse','egorian_bellflower_barn',[328,344],'bellflowerBarnReached');
 add('bellflower-barn-summon','373 · Summon the earth elementals','egorian_bellflower_barn',[328,264],'bellflowerBarnScouted');
 add('bellflower-barn-ruins','374 · Search the leveled barn','egorian_bellflower_barn',[328,232],'bellflowerBarnLeveled');
 add('sethic-mansion-orders','375 · A choice from the Crown','egorian_bellflower_barn',[328,232],'bellflowerBarnComplete');
 add('sethic-mansion-guards','376 · Secure the mansion','egorian_sethic_mansion',[328,344],'sethicMansionReached');
 add('sethic-mansion-cellar','377 · Search the cellar','egorian_sethic_mansion',[328,248],'sethicMansionGuardsDown');
 add('sethic-mansion-bob','378 · Find Bob Applewood','egorian_sethic_cellar',[328,344],'sethicMansionCellarEntered');
 add('sethic-mansion-wait','379 · Wait for Sethic','egorian_sethic_cellar',[552,168],'sethicMansionBobFreed');
 add('sethic-mansion-duel','380 · Confront Sethic','egorian_sethic_mansion',[328,296],'sethicMansionWaited');
 add('sethic-mansion-bind','381 · Stabilize and restrain Sethic','egorian_sethic_mansion',[328,216],'sethicMansionSethicDown');
 add('sethic-mansion-pack','382 · Prepare the prisoner','egorian_sethic_mansion',[328,216],'sethicMansionBound');
 add('vyre-wish-road','383 · Follow the lead to Vyre','egorian_sethic_mansion',[328,312],'sethicMansionComplete');
 add('vyre-wish-request','384 · Ask Manticce for a Wish','vyre_wish_room',[328,344],'vyreWishReached');
 add('vyre-wish-cast','385 · El Guapo’s Wish','vyre_wish_room',[264,200],'vyreWishGranted');
 add('vyre-wish-bob','386 · Bob Applewood recovers','vyre_wish_room',[536,200],'vyreBobHealed');
 add('barrow-road','387 · Depart for the Barrowood','vyre_wish_room',[536,200],'vyreWishComplete');
 add('barrow-stones','388 · The first standing stones','barrow_road',[328,344],'barrowRoadReached');
 q.barrowStones=3;
 add('barrow-scouts','389 · Reclamation advance scouts','barrow_road',[328,224]);
 add('barrow-road-rest','390 · Continue the pilgrim road','barrow_road',[328,192],'barrowScoutsDefeated');
 q.barrowStones=6;
 add('barrow-grove','391 · Enter the old grove','barrow_road',[328,152]);
 add('barrow-grove-stones','392 · Stones in the grove','barrow_grove',[328,344],'barrowGroveReached');
 q.barrowStones=9;
 add('barrow-guardians','393 · The paladins and the druid','barrow_grove',[400,264]);
 add('barrow-final-stones','394 · Mark the remaining trail stones','barrow_grove',[328,216],'barrowGuardiansDefeated');
 q.barrowStones=13;
 add('barrow-final-approach','395 · Approach the final stone','barrow_grove',[328,144]);
 add('covenant-road','396 · Enter the final stone clearing','barrow_grove',[328,144],'barrowTrailComplete');
 add('covenant-parley','397 · The rogue Asmodeans','barrow_covenant',[328,344],'covenantReached');
 add('covenant-battle','398 · Defend the covenant','barrow_covenant',[328,240],'covenantLoyal');
 add('covenant-sacrifice','399 · The fourteenth stone','barrow_covenant',[328,224],'covenantBattleWon');
 q.barrowStones=14;
 add('covenant-fiend','400 · Gorthoklekk’s claim','barrow_covenant',[328,208],'covenantSacrificeMade');
 add('covenant-audience','401 · The Queen at the stone','barrow_covenant',[328,224],'covenantTrueForm covenantClaimed');
 add('covenant-raise','402 · Raise Jason','barrow_covenant',[408,224],'covenantQueenArrived');
 add('covenant-promotion','403 · Bound Agents of Thrune','barrow_covenant',[264,264],'covenantJasonRaised');
 add('menador-brief','404 · The Queen’s demand','barrow_covenant',[408,224],'covenantComplete');
 add('menador-road','405 · Travel to Menador','barrow_covenant',[216,232],'menadorBriefed');
 add('menador-meeting','406 · Meeting of the Twins','menador_pass',[328,344],'menadorReached');
 add('tathlum-return','407 · Return to Egorian','menador_pass',[328,144],'menadorComplete');
 add('tathlum-orders','408 · The Tathlum assignment','tathlum_orders',[328,344],'tathlumOrdersReached');
 add('tathlum-nidal-road','409 · Leave for Nidal','tathlum_orders',[328,272],'tathlumBriefed');
 add('tathlum-patrol','409A · The Gheistano patrol','gheistano_road',[328,344],'tathlumBorderReached');
 add('tathlum-cover','409B · Slip past the patrol','gheistano_road',[296,248],'tathlumPatrolSpotted');
 add('tathlum-village','410 · Investigate the giant attacks','nidal_hunt_village',[328,344],'tathlumNidalReached');
 add('tathlum-track','411 · Follow the thrall','nidal_hunt_village',[216,200],'tathlumThrallMade');
 add('tathlum-attack-site','411A · The last cave-giant attack','nidal_giant_attack_site',[328,344],'tathlumAttackReached');
 add('tathlum-trail-found','411B · The trail uphill','nidal_giant_attack_site',[216,248],'tathlumAttackExamined');
 add('tathlum-bait','412 · The cave-giant lair','nidal_giant_lair',[328,344],'tathlumLairReached');
 add('tathlum-duels','413 · Freya’s cave-giant duels','nidal_giant_lair',[328,248],'tathlumBaitSet');
 q.tathlumDuels=3;
 add('tathlum-runes','414 · The cave-giant rune','nidal_giant_lair',[328,216]);
 add('darkrain-road','415 · Turn south for Dark Rain','nidal_giant_lair',[328,216],'tathlumHuntComplete');
 add('darkrain-mother','416 · Parley with the Wight Mother','darkrain_pass',[328,344],'darkrainReached');
 add('darkrain-climb','417 · Climb into the snow','darkrain_pass',[328,208],'darkrainPact');
 add('darkrain-cold','418 · Shelter on the slope','darkrain_skull_slope',[328,344],'darkrainSlopeReached');
 add('darkrain-bear','419 · Reese’s dire bear hunt','darkrain_skull_slope',[328,272],'darkrainColdSeen');
 add('darkrain-hide','420 · Make winter clothing','darkrain_skull_slope',[440,240],'darkrainBearWon');
 add('darkrain-skull','421 · Examine the dragon’s skull','darkrain_skull_slope',[440,240],'darkrainClothed');
 add('darkrain-jaws','422 · Through the dragon’s jaws','darkrain_skull_slope',[328,192],'darkrainSkullSeen');
 add('skadi-road','423 · Frost Giant territory','darkrain_skull_passage',[328,344],'darkrainInsideSkull');
 add('skadi-scout','424 · Scout the settlement','frost_giant_yard',[328,344],'darkrainComplete skadiYardReached');
 add('skadi-cover','425 · Draymus’s diversion','frost_giant_yard',[216,264],'skadiScouted');
 add('skadi-meet','426 · Cross under cover','frost_giant_yard',[328,288],'skadiCovered');
 add('skadi-approach','426A · Ask for a hearing','frost_giant_yard',[456,248],'skadiApproached');
 add('skadi-feast','427 · Skadi’s feast','frost_giant_hall',[328,344],'skadiFeastReached');
 q.skadiArguments=3;
 add('skadi-terms','428 · Skadi’s terms','frost_giant_hall',[328,216]);
 add('molthune-road','429 · Descend toward Molthune','frost_giant_hall',[328,216],'skadiComplete');
 add('molthune-scout','430 · Reese scouts the coffin','molthune_remorhaz_slope',[328,344],'molthuneReached');
 add('molthune-bait','431 · The animated bear','molthune_remorhaz_slope',[328,312],'molthuneScouted');
 add('molthune-lift','432 · Retrieve the travel coffin','molthune_remorhaz_slope',[200,256],'molthuneBaitSet');
 add('molthune-breach','433 · Beyond the dragon’s ward','molthune_remorhaz_slope',[464,216],'molthuneCoffinLifted');
 add('molthune-escape','434 · Escape the Wight Mother','molthune_remorhaz_slope',[328,336],'molthuneBreach');
 add('molthune-fly-out','434A · Fly clear of the lower pass','molthune_remorhaz_slope',[440,232],'molthuneFlightReady');
 add('molthune-violetta','435 · Meet Lady Violetta Pavel','molthune_waystation',[328,344],'molthuneEscaped');
 add('molthune-papers','436 · Violetta’s papers','molthune_waystation',[456,224],'molthuneIntroduced');
 add('dinyar-split','437 · The company splits','molthune_waystation',[456,224],'molthuneComplete');
 add('dinyar-nidal','438 · Draymus in Nidal','nidal_arrival_court',[328,344],'nidalOperationSought');
 add('dinyar-view','439 · Survey Citadel Dinyar','dinyar_ridge',[328,344],'dinyarReached');
 add('dinyar-postern','440 · Search for the hidden entrance','dinyar_ridge',[456,272],'dinyarSurveyed');
 add('dinyar-plan','441 · Plan the lower approach','dinyar_ridge',[152,248],'dinyarEntranceFound');
 add('dinyar-descent','442 · Open the hidden entrance','dinyar_ridge',[216,280],'dinyarReconComplete');
 add('dinyar-open-postern','442A · Enter the lower works','dinyar_ridge',[184,264],'dinyarPosternOpen');
 add('dinyar-watch','443 · The Reclamation watch','dinyar_lower_works',[328,344],'dinyarLowerReached');
 add('dinyar-cells','444 · Search the Godclaw cells','dinyar_lower_works',[328,248],'dinyarWatchCleared');
 add('dinyar-stairs','445 · Climb to the bridge ward','dinyar_lower_works',[184,184],'dinyarCellsChecked');
 add('dinyar-dragon','446 · Parnoneryx','dinyar_bridge_ward',[328,344],'dinyarBridgeReached');
 add('dinyar-trophy','447 · The gold dragon’s head','dinyar_bridge_ward',[328,256],'dinyarDragonSlain');
 add('westcrown-egorian','448 · Return to Egorian','dinyar_bridge_ward',[328,232],'dinyarCleared');
 add('westcrown-commission','449 · Field Marshal Freya','egorian_westcrown_orders',[328,344],'westcrownOrdersReached');
 add('dinyar-dispatch','449A · The Dinyar dispatch','egorian_westcrown_orders',[216,264],'freyaFieldMarshal');
 add('westcrown-deployment','450 · Orders for Westcrown','egorian_westcrown_orders',[328,264]);
 add('ilnius-cutaway','451 · Expedition to St. Ilnius','egorian_westcrown_orders',[328,344],'westcrownDeployed');
 add('ilnius-bruce','452 · Rendezvous with Bruce','ilnius_forest',[328,344],'ilniusForestReached');
 add('ilnius-cross','453 · Follow the creek','ilnius_forest',[456,272],'ilniusBruceMet');
 add('ilnius-statues','454 · Five archon statues','ilnius_shrine',[328,344],'ilniusShrineReached');
 add('ilnius-ward','455 · The inner entrance','ilnius_shrine',[328,240],'ilniusStatuesCleared');
 add('ilnius-temple','456 · Enter the inner temple','ilnius_shrine',[328,224],'ilniusWardChecked');
 add('ilnius-paladin','457 · Sylvestra Hanel','ilnius_inner_temple',[328,344],'ilniusTempleReached');
 add('ilnius-rite','458 · Parnoneryx at the basin','ilnius_inner_temple',[328,248],'ilniusPaladinSlain');
 add('ilnius-library','459 · The last Tathlum component','ilnius_inner_temple',[328,200],'ilniusDefiled');
 add('barleybridge-cutaway','460 · El Guapo scouts ahead','ilnius_inner_temple',[424,272],'ilniusTempleComplete');
 add('barleybridge-crossing','461 · The Barleybridge crossing','barleybridge_approach',[328,344],'barleybridgeReached');
 add('barleybridge-gate','462 · The Barleybridge gate','barleybridge_approach',[168,216],'barleybridgeCrossingSeen');
 add('barleybridge-report','463 · Mark the approach','barleybridge_approach',[456,224],'barleybridgeGateSeen');
 add('barleybridge-plan','464 · Review the Tathlum plan','barleybridge_approach',[328,344],'barleybridgeScoutComplete');
 add('guapo-invite','465 · El Guapo’s invitation','barleybridge_approach',[328,344],'barleybridgePlanReviewed');
 add('guapo-banquet','466 · The party boat','guapo_party_boat',[328,344]);
 return list;
}
function replaySearchText(value){
 return value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
}
function matchingReplaySections(sections,query){
 const terms=replaySearchText(query);
 if(!terms)return sections;
 if(/^\d+$/.test(terms))return sections.filter(section=>Number(section.name.match(/^\d+(?=\s*·)/)?.[0])===Number(terms));
 const words=terms.split(' ');
 return sections.filter(section=>{
  const entry=replaySearchText(section.name+' '+(scenes[section.scene]?.name||'')+' '+section.scene);
  return words.every(word=>entry.includes(word));
 });
}
function replayAllowed(){return !campaignLoading&&ready&&!introOpen&&!dialogOpen&&!battle&&!taskBusy&&!journeyOpen&&!levelOpen;}
function installSectionReplay(){
 const sections=replaySections(),sectionsById=new Map(sections.map(section=>[section.id,section]));
 const search=$('section-search'),picker=$('section-replay'),go=$('section-go');
 function showResults(){
  const previous=picker.value,matches=matchingReplaySections(sections,search.value);
  const options=matches.map(section=>{
   const option=document.createElement('option');
   option.value=section.id;
   option.textContent=section.name;
   return option;
  });
  picker.replaceChildren(...options);
  if(matches.some(section=>section.id===previous))picker.value=previous;
  picker.disabled=go.disabled=matches.length===0;
  $('section-count').textContent=matches.length===0?'No matching sections':matches.length+' of '+sections.length+' sections';
 }
 search.oninput=showResults;
 search.onkeydown=event=>{
  if(event.key==='Enter'&&!picker.disabled){event.preventDefault();picker.focus();}
 };
 showResults();
 $('section-restore').hidden=!localStorage.getItem(REPLAY_BACKUP);
 $('section-go').onclick=()=>{if(!replayAllowed()){$('save-file-status').textContent='Finish the conversation, journey or fight before replaying a section.';return;}
 const section=sectionsById.get(picker.value);
 if(!section)return;
 const q=structuredClone(section.quest),p=Progression.migrate(q),chosen=(q.guapoAway&&lead==='guapo'||lead==='reese'&&!q.chapter3Complete)?'freya':lead;
 const replayHealth=Object.fromEntries(CORE.map(id=>[id,Progression.stats(BASE_STATS[id],id,p.levels[id]).hp]));
 if(section.scene==='egorian_excruciation'&&q.egorianAssassination)replayHealth.jamal=q.egorianJmalEscaped?12:0;
 if(section.scene==='egorian_excruciation'&&q.egorianJmalEscaped)q.mosswaterSpent=1;
 if(q.aregoReeseCrossed&&!q.aregoCompanyFreed){
  replayHealth.jason=replayHealth.draymus=0;
  if(!q.aregoBoneDevilsSummoned)replayHealth.reese=Math.max(1,replayHealth.reese-12);
 }
 const checkpoint=SaveFiles.validate({version:2,scene:section.scene,position:{x:section.position[0],y:section.position[1]},lead:chosen,quest:q,progression:p,hp:replayHealth,uses:Object.fromEntries(CORE.map(id=>[id,0])),potions:2,mendUses:q.egorianJasonBack?0:2});
 save();if(!localStorage.getItem(REPLAY_BACKUP))localStorage.setItem(REPLAY_BACKUP,localStorage.getItem(SAVE));localStorage.setItem(SAVE,JSON.stringify(checkpoint));reset(true);$('section-restore').hidden=false;$('save-file-status').textContent='Replaying '+section.name+'. Your previous progress is preserved.';
 };
 $('section-restore').onclick=()=>{if(!replayAllowed()){$('save-file-status').textContent='Finish the current conversation or fight first.';return;}const raw=localStorage.getItem(REPLAY_BACKUP);if(!raw)return;SaveFiles.decode(raw);localStorage.setItem(SAVE,raw);localStorage.removeItem(REPLAY_BACKUP);reset(true);$('section-restore').hidden=true;$('save-file-status').textContent='Your previous progress is restored.';};
}
const imageRequests=new Map();
function imageLoad(src){
 if(!imageRequests.has(src))imageRequests.set(src,new Promise((resolve,reject)=>{
  const im=new Image();
  im.onload=()=>resolve(im);
  im.onerror=()=>{imageRequests.delete(src);reject(Error('Could not load '+src));};
  im.src='art-test/'+src;
 }));
 return imageRequests.get(src);
}
const loadedArtStages=new Set([0]);
let campaignLoading=false;
const ART_ENTRY_STAGES={
 nextChapter:1,chapterThree:2,fortArcRoad:3,egorianApproach:4,aregoEscape:5,barrowDepart:6,
 tathlumReturn:7,skadiCrossFromSkull:8,dinyarSplit:9,ilniusCutaway:10,barleybridgeCutaway:11
};
function artStage(saved){
 const q=saved?.quest;
 if(q?.barleybridgeReached)return 11;
 if(q?.ilniusForestReached)return 10;
 if(q?.nidalOperationSought)return 9;
 if(q?.skadiYardReached)return 8;
 if(q?.tathlumOrdersReached)return 7;
 if(q?.barrowRoadReached)return 6;
 if(q?.aregoEgorianEscaped)return 5;
 if(q?.egorianBridgeMet||saved?.scene==='egorian_bridge')return 4;
 if(q?.chapter9)return 3;
 if(q?.chapter3)return 2;
 return q?.chapter2?1:0;
}

async function loadCastArt(cast){
 const sources=new Set(cast.flatMap(id=>[LORE_CAST[id]?.src,COMBAT_IDLES[id]?.src].filter(Boolean)));
 await Promise.all([...sources].map(async src=>{art[src]=await imageLoad(src);}));
}

async function loadPrologueArt(){
 const maps={briefingRoom:'kintargo-briefing-v1.png',citizens:'townsfolk-sheet-v1.png',
  street:'kintargo-map.png',tavern:'silver-star-music-shop-v2.png',temple:'chapter-temple.png',
  npcs:'chapter-npcs.png',guard:'dottari.png'};
 const openingCast=[...OPENING_ROSTER,'viggo','cultist','nox','corrine','barzillai'];

 await Promise.all([
  ...Object.entries(maps).map(async ([id,src])=>{art[id]=await imageLoad(src);}),
  loadCastArt(openingCast),
  ...ROSTER.map(async id=>{
   const model=PARTY_FRAMES[id];
   [sheets[id],sheets[id+'-opposite']]=await Promise.all([model.src||id+'-sheet.png',model.oppositeStep.src].map(imageLoad));
  }),
  ...Object.entries(QUESTGIVER_MODELS).map(async ([id,model])=>{art[id]=await imageLoad(model.src);}),
  CombatArt.load(imageLoad),PresentationPolish.load(imageLoad)
 ]);
}
async function loadVoyageArt(){
 const cast=['farmer','cimri','owner','dog','razelago','krenshar','spirit','western_star_captain','western_star_boarder'];
 await Promise.all([window.NextChapter.load(imageLoad),loadCastArt(cast)]);
}
async function loadLongacreArt(){
 const cast=['reese','cimri','fex','allamar','rhona','twin1','twin2','deputy1','deputy2','deputy3','deputy4',
  'razelago_revealed','bolgart','bolgart_wereboar','riley','gerya','ingoe','false_knight','church_acolyte','kuribu',
  'ghast_riley','mantis_master','celestial_wolf','accuser','armory_bo','armory_dent','heist_ranger'];
 const chapters=[window.NextArc,LastStand,DebtsRumors,PoliticalMovement,ChurchArc,ArmoryArc];
 await Promise.all([
  ...chapters.map(chapter=>chapter.load(imageLoad)),
  loadCastArt(cast),
  (async()=>{art['reese-portrait']=await imageLoad('reese-early-portrait.png');})()
 ]);
}
async function loadKantariaArt(){
  await Promise.all([...new Set(Object.values(LORE_CAST).map(m=>m.src))].map(async src=>{art[src]=await imageLoad(src);}));
  await FortArc.load(imageLoad);
  await CourtArc.load(imageLoad);
  await KantariaArc.load(imageLoad);
  await DisruptionArc.load(imageLoad);
  await CovertArc.load(imageLoad);
  await SupplyArc.load(imageLoad);
  await FastnessArc.load(imageLoad);
  await KantariaAftermath.load(imageLoad);
  await SouthRoad.load(imageLoad);
  await Promise.all([...new Set(Object.values(COMBAT_IDLES).filter(model=>!model.deferred).map(model=>model.src))].map(async src=>{art[src]=await imageLoad(src);}));
}
async function loadAregoArt(){
  await EgorianArrival.load(imageLoad);
  await EgorianNight.load(imageLoad);
  await EgorianTrial.load(imageLoad);
  await EgorianMort.load(imageLoad);
  await EgorianExecution.load(imageLoad);
  await SenaraArrival.load(imageLoad);
  await SenaraCover.load(imageLoad);
  await SenaraDaggers.load(imageLoad);
  await SenaraCitadel.load(imageLoad);
  await WhisperwoodCamp.load(imageLoad);
  await WhisperwoodGlade.load(imageLoad);
  await SenaraWagon.load(imageLoad);
  await SenaraGraveyard.load(imageLoad);
  await FortArego.load(imageLoad);
  await InfernoGate.load(imageLoad);
  await AregoAmbush.load(imageLoad);
  await AregoReturn.load(imageLoad);
  await AregoExit.load(imageLoad);
}
async function loadCheliaxArt(){
  await EgorianDischarge.load(imageLoad);
  await EgorianFountain.load(imageLoad);
  await RemesianaMarket.load(imageLoad);
  await Hinji.load(imageLoad);
  await Westcrown.load(imageLoad);
  await EfisioArc.load(imageLoad);
  EgorianSting.load();
  await EgorianFeud.load(imageLoad);
  await SethicFarm.load(imageLoad);
  await SethicLedgers.load(imageLoad);
  await NicoloArc.load(imageLoad);
  await PaleBall.load(imageLoad);
  await Belde.load(imageLoad);
  await HinjiTavern.load(imageLoad);
  await Ballerina.load(imageLoad);
  await Rachikan.load(imageLoad);
  await Pezzack.load(imageLoad);
  await BellflowerBarge.load(imageLoad);
  await BellflowerBarn.load(imageLoad);
  await SethicMansion.load(imageLoad);
  await VyreWish.load(imageLoad);
  art['bruce-portrait']=await imageLoad('bruce-foundry-portrait.webp');
}
async function loadLateSharedArt(cast=[],images={}){
 const spriteSources=new Set(['reese',...cast].flatMap(id=>[
  LORE_CAST[id]?.src,FUTURE_NPCS[id]?.source,COMBAT_IDLES[id]?.src
 ]).filter(Boolean));
 const files={
  'reese-portrait':'reese-early-portrait.png',
  'freya-zara-geitta-walk-v1.png':'freya-zara-geitta-walk-v1.png',
  'freya-zara-geitta-combat-v1.png':'freya-zara-geitta-combat-v1.png',
  ...Object.fromEntries([...spriteSources].map(src=>[src,src])),
  ...images
 };
 await Promise.all(Object.entries(files).map(async ([id,src])=>{art[id]=await imageLoad(src);}));
}
async function loadBarrowoodArt(){
 await Promise.all([
  ...[BarrowTrail,BarrowCovenant,Menador].map(chapter=>chapter.load(imageLoad)),
  loadLateSharedArt(['kantaria_guard','fastness_paladin','fastness_cleric','sethic','bob','abrogail','contessa'])
 ]);
}
async function loadDarkRainArt(){
 await Promise.all([
  TathlumHunt.load(imageLoad),DarkRain.load(imageLoad),
  loadLateSharedArt([],{egorian_court:scenes.egorian_court.image})
 ]);
}
async function loadMolthuneArt(){
 await Promise.all([SkadiParley.load(imageLoad),MolthuneCoffin.load(imageLoad),loadLateSharedArt()]);
}
async function loadDinyarArt(){
 await Promise.all([
  DinyarRecon.load(imageLoad),
  loadLateSharedArt(['violetta','fastness_paladin','kantaria_guard'],{egorian_court:scenes.egorian_court.image})
 ]);
}
async function loadIlniusArt(){
 await Promise.all([IlniusFountain.load(imageLoad),loadLateSharedArt(['bruce'],{'bruce-portrait':'bruce-foundry-portrait.webp'})]);
}
const ART_STAGES=[
 null,
 [loadVoyageArt,'Loading the Western Star and Longacre…'],
 [loadLongacreArt,'Loading the Longacre operations…'],
 [loadKantariaArt,'Loading Fort Estazano and Kantaria…'],
 [loadAregoArt,'Loading Egorian, Senara and Fort Arego…'],
 [loadCheliaxArt,'Loading the operations across Cheliax…'],
 [loadBarrowoodArt,'Loading the Barrowood and Menador…'],
 [loadDarkRainArt,'Loading Nidal and the Pass of Dark Rain…'],
 [loadMolthuneArt,'Loading the Frost Giant settlement and Molthune…'],
 [loadDinyarArt,'Loading Citadel Dinyar…'],
 [loadIlniusArt,'Loading St. Ilnius…'],
 [()=>BarleybridgeScout.load(imageLoad),'Loading Barleybridge…']
];
function requiredArtStages(stage){
 return stage>=6?[stage]:Array.from({length:stage},(_,index)=>index+1);
}
async function prepareCampaign(stage){
 if(loadedArtStages.has(stage))return true;
 if(campaignLoading)return false;
 campaignLoading=true;
 keys.clear();
 $('loadingText').textContent=ART_STAGES[stage][1];
 $('loading').hidden=false;
 $('load-retry').hidden=true;
 try{
  for(const required of requiredArtStages(stage)){
   if(loadedArtStages.has(required))continue;
   await ART_STAGES[required][0]();
   loadedArtStages.add(required);
  }
  return true;
 }catch(error){
  console.error(error);
  $('loading').hidden=true;
  campaignLoading=false;
  $('save-file-status').textContent='Campaign artwork could not load. Try opening the chapter or checkpoint again.';
  if(introOpen)TitleScreen.show(true);
  else await say('Artwork unavailable','Campaign artwork could not load. Try opening the chapter again.');
  return false;
 }finally{
  $('loading').hidden=true;
  campaignLoading=false;
 }
}
async function load(){
 $('loading').hidden=false;
 $('load-retry').hidden=true;
 try{
  await Promise.all([loadPrologueArt(),TitleScreen.load(imageLoad)]);
  ready=true;
  $('loading').hidden=true;
  TitleScreen.show();
 }
 catch(e){console.error(e);$('loadingText').textContent='The chapter art could not load. Keep this HTML beside its art-test folder.';$('load-retry').hidden=false;}
}
$('load-retry').onclick=load;
function loop(now){const dt=last?Math.min((now-last)/1000,.05):0;last=now;update(dt);render(now/1000);requestAnimationFrame(loop);}
window.__chapter={state:()=>({title:TitleScreen.state(),ready,introOpen,briefingOpen,journeyOpen,levelOpen,progression:structuredClone(progression),scene,lead,quest:{...quest},hp:{...hp},potions,uses:{...uses},mendUses,interaction:nearPoint()?.id,guide:window.QuestGuide.current(),dialogOpen,taskBusy,party:units.map(u=>({id:u.id,x:u.x,y:u.y,dir:u.dir,moving:!!u.step})),pathLength:path.length,battle:battle?{round:battle.round,turn:battle.turn,actor:activeUnit()?.id,busy:battle.busy,enemies:battle.enemies.map(e=>({name:e.name,hp:e.hp})),smoke:battle.smoke}:null}),passable,findPath};
window.NextChapter.install();window.NextArc.install();LastStand.install();DebtsRumors.install();PoliticalMovement.install();ChurchArc.install();ArmoryArc.install();FortArc.install();CourtArc.install();KantariaArc.install();DisruptionArc.install();CovertArc.install();SupplyArc.install();FastnessArc.install();KantariaAftermath.install();SouthRoad.install();EgorianArrival.install();EgorianNight.install();EgorianTrial.install();EgorianMort.install();EgorianExecution.install();SenaraArrival.install();SenaraCover.install();SenaraDaggers.install();SenaraCitadel.install();WhisperwoodCamp.install();WhisperwoodGlade.install();SenaraWagon.install();SenaraGraveyard.install();FortArego.install();InfernoGate.install();AregoAmbush.install();AregoReturn.install();AregoExit.install();EgorianDischarge.install();EgorianFountain.install();RemesianaMarket.install();Hinji.install();Westcrown.install();EfisioArc.install();EgorianSting.install();EgorianFeud.install();SethicFarm.install();SethicLedgers.install();NicoloArc.install();PaleBall.install();Belde.install();HinjiTavern.install();Ballerina.install();Rachikan.install();Pezzack.install();BellflowerBarge.install();BellflowerBarn.install();SethicMansion.install();VyreWish.install();BarrowTrail.install();BarrowCovenant.install();Menador.install();TathlumHunt.install();DarkRain.install();SkadiParley.install();MolthuneCoffin.install();DinyarRecon.install();IlniusFountain.install();BarleybridgeScout.install();PresentationPolish.install();window.SaveFiles.install({scenes,core:CORE,stats:BASE_STATS,special:BASE_SPECIAL,names:NAMES,key:SAVE,read:readSave,capture:save,safeToCapture:()=>ready&&!campaignLoading&&!introOpen&&!battle&&!dialogOpen&&!taskBusy,canImport:()=>ready&&!campaignLoading&&!battle&&!dialogOpen&&!taskBusy,resume:()=>reset(true)});installSectionReplay();Handheld.install();GameInput.install({
 context:()=>!ready||campaignLoading||taskBusy||battle?.busy&&!battle.reveal?'blocked':Handheld.isOpen()||introOpen||dialogOpen||journeyOpen||levelOpen||battle||$('save-import-dialog').open?'menu':'world',
 emit:event=>canvas.dispatchEvent(new KeyboardEvent(event.type,{key:event.key,repeat:!!event.repeat,bubbles:true,cancelable:true}))
});TitleScreen.install();GameAudio.install();load();requestAnimationFrame(loop);
