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
function dieMarkup(sides,value){
 const shapes={4:'24,3 45,45 3,45',6:'5,5 43,5 43,43 5,43',8:'24,2 46,24 24,46 2,24',10:'24,2 45,17 38,43 10,43 3,17',20:'24,2 45,13 45,35 24,46 3,35 3,13'};
 const points=shapes[sides]||shapes[20],facet=sides===6?'M5 5 L43 43 M43 5 L5 43':sides===4?'M24 3 L24 29 L3 45 M24 29 L45 45':'M24 2 L12 24 L36 24 Z M3 13 L12 24 L3 35 M45 13 L36 24 L45 35 M12 24 L24 46 L36 24';
 let face='<text x="24" y="32" text-anchor="middle">'+value+'</text>';
 if(sides===6){const pts={1:[[24,24]],2:[[14,14],[34,34]],3:[[14,14],[24,24],[34,34]],4:[[14,14],[34,14],[14,34],[34,34]],5:[[14,14],[34,14],[24,24],[14,34],[34,34]],6:[[14,13],[34,13],[14,24],[34,24],[14,35],[34,35]]};face=(pts[value]||[]).map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="3"/>').join('');}
 return '<div class="die"><svg viewBox="0 0 48 48" aria-hidden="true"><polygon points="'+points+'"/>'+(sides===6?'':'<path d="'+facet+'"/>')+face+'</svg><small>D'+sides+' · '+value+'</small></div>';
}
async function rollDice(label,sides,count=1,modifier=0,context='',fixed=null){
 const token=epoch,values=fixed||Array.from({length:count},()=>dice(sides)),total=values.reduce((a,b)=>a+b,modifier),panel=$('dice-panel');
 panel.hidden=false;panel.classList.add('rolling');$('dice-label').textContent=label;$('dice-result').textContent='Rolling…';
 const paint=vals=>$('dice-tray').innerHTML=vals.map(v=>dieMarkup(sides,v)).join('');paint(values);
 let tick=0;const timer=reduce.matches?null:setInterval(()=>{if(token!==epoch){clearInterval(timer);return;}paint(values.map((v,i)=>(v+ ++tick+i)%sides+1));},70);
 await delay(reduce.matches?80:420);if(timer)clearInterval(timer);if(token!==epoch)throw CANCEL;
 paint(values);panel.classList.remove('rolling');$('dice-result').textContent=values.join(' + ')+(modifier?' '+(modifier>0?'+ ':'− ')+Math.abs(modifier):'')+' = '+total+(context?' · '+context:'');
 await delay(reduce.matches?120:330);if(token!==epoch)throw CANCEL;return total;
}
async function storyRoll(label,face,modifier,outcome){return rollDice(label,20,1,modifier,outcome+' · Story roll',[face]);}
async function damage(spec,label){return rollDice(label,spec[1],spec[0],spec[2]);}
function point(id){return scenes[scene].points.find(p=>p.id===id);}
function actorBlocking(x,y,which=scene){return (which===scene&&quest.chapter2&&(ChurchArc.npcs()||PoliticalMovement.npcs()||DebtsRumors.npcs()||LastStand.npcs()||(quest.chapter3?window.NextArc.npcs():window.NextChapter.npcs())).some(p=>Math.hypot(x-p.x,y-p.y)<12))||scenes[which].points.some(p=>['guard','barkeep'].includes(p.id)&&Math.hypot(x-p.x,y-p.y)<12);}
function passable(gx,gy,which=scene){if(gx<0||gy<0||gx>=COLS||gy>=ROWS)return false;const x=gx*T+8,y=gy*T+8,s=scenes[which];return s.walk.some(r=>inside(x,y,r))&&!s.blocks.some(r=>inside(x,y,r))&&!actorBlocking(x,y,which);}
function findPath(from,to,which=scene){if(!passable(...to,which))return null; // Allow walking out of a cell occupied by a newly revealed NPC.
const q=[from],prev=new Map([[from.join(','),null]]);for(let i=0;i<q.length;i++){const a=q[i],key=a.join(',');if(key===to.join(',')){let k=key,result=[];while(prev.get(k)!==null){result.unshift(k.split(',').map(Number));k=prev.get(k);}return result;}for(const [dx,dy] of Object.values(DIR)){const n=[a[0]+dx,a[1]+dy],k=n.join(',');if(passable(...n,which)&&!prev.has(k)){prev.set(k,key);q.push(n);}}}return null;}
function soloScout(){return scene==='tannery'&&!quest.scouted;}
function soloParty(){return soloScout()||(scene==='bathroom'&&!quest.bathStarted)||PoliticalMovement.soloWatch();}
function partyRoster(){return soloParty()?['jamal']:(quest.activeRoster||(quest.reeseJoined?CORE:OPENING_ROSTER));}
function finished(){return !!quest.chapter7Complete;}
function seedParty(x,y,dir='up'){
 const start=cell(x,y),seen=new Set([start.join(',')]);trail=[start];let cur=start,heading=dir==='up'?'down':'up';
 for(let i=0;i<16;i++){let next=null;for(const d of [heading,'left','right','up','down']){const v=DIR[d],a=[cur[0]+v[0],cur[1]+v[1]];if(passable(...a)&&!seen.has(a.join(','))){next=a;heading=d;break;}}if(!next)break;trail.push(next);seen.add(next.join(','));cur=next;}
 const front=soloParty()?'jamal':lead;units=[front,...partyRoster().filter(id=>id!==front)].map((id,i)=>{const c=trail[Math.min(i*2,trail.length-1)];return {id,x:c[0]*T+8,y:c[1]*T+8,dir,step:null,anim:0};});path=[];keys.clear();
}
function setScene(next,x,y,dir='up'){$('dice-panel').hidden=true;scene=next;if(soloScout()){x=136;y=280;dir='right';}seedParty(x,y,dir);buildFlicker();$('location-name').textContent=scenes[next].name;updateObjective();paintParty();$('character').value=soloParty()?'jamal':lead;$('character').disabled=soloParty();save();}
const JOURNEYS={
 street:'Return to Kintargo’s streets. Keep the operation quiet and follow the route to the next objective.',
 tavern:'Shensen, the famous actress, is absent from her musical instrument shop, the Silver Star. Jason searches for the entrance to the hidden temple of Sarenrae.',
 temple:'Descend beneath the Silver Star. Find Viggo, end the temple, and leave the false evidence.',
 western_star:'Kintargo falls behind the party. Their route runs through Pezzack, a pirate encounter, and Corentyn before Remesiana.',
 remesiana:'10 Neth, 4716. The Western Star reaches Remesiana. Meet Cimri and arrange the road to Freya’s next assignment in Longacre.',
 last_stand:'The posted decree has been torn down. Repost it while J’Mal watches the back door. Subdue resistance and take the prisoners to jail.',
 angel_hill:'Riley describes a meeting two miles outside Longacre. Keep him under guard and inspect the hill before returning to the jail.',
 tannery:'Cimri leads the party northwest to Longacre, where the rental horses are returned. Razelago’s first test is a robbery: take the payroll from Louslik Tannery. J’Mal approaches the palisade alone.',
 ash_house:'Cimri guides the party to the ruined Ash House. Razelago waits behind the screens.',
 bathroom:'J’Mal investigates the splashing alone. His companions wait on the landing.',
 longacre_square:'Enter Longacre’s church square and carry out Razelago’s instructions.',
 longacre_jail:'Head to the western gate and jail. Deliver the remaining decrees and the separate order dismissing Rhona.',
 scarlet_manor:'The notice-post decree survives the night; the Last Stand’s copy is torn down. Servants lead the party past armed guards to Fex’s audience.'
};
function cancelJourney(){const resolve=journeyResolve;journeyResolve=null;journeyOpen=false;$('journey').hidden=true;$('journey').classList.remove('visible');$('journey-continue').disabled=true;if(resolve)resolve();}
async function journeyCard(title,summary,commit=()=>{}){
 const token=epoch,panel=$('journey'),button=$('journey-continue');journeyOpen=true;keys.clear();path=[];$('prompt').hidden=true;$('dice-panel').hidden=true;
 $('journey-title').textContent=title;$('journey-summary').textContent=summary.replace(/([.!?])[ \t]+(?=[A-Z])/g,'$1\n');button.disabled=true;panel.hidden=false;panel.classList.add('visible');
 commit();button.disabled=false;button.focus();await new Promise(resolve=>journeyResolve=resolve);if(token!==epoch)throw CANCEL;
 button.disabled=true;journeyOpen=false;keys.clear();canvas.focus();save();
 // Keep the black card covering the map until the next card, dialogue or end of the scene.
}
$('journey-continue').onclick=()=>{if(!journeyOpen||$('journey-continue').disabled||!journeyResolve)return;const resolve=journeyResolve;journeyResolve=null;$('journey-continue').disabled=true;resolve();};
async function travel(next,x,y,dir='up'){
 let summary=JOURNEYS[next];
 if(next==='church_watch'&&quest.watchStarted)summary='After resting at Ash House, J’Mal watches the church alone into the evening. Meet any movement with care.';
 if(next==='street'&&quest.burned)summary='The Silver Star burns. Slip away under Freya’s cover.';
 if(next==='tavern'&&quest.burned)summary='Smoke rises from the cellar. The party carries J’Mal out under cover of the fire.';
 if(next==='ash_house'&&quest.payroll&&!quest.reward)summary='At the river, Jamal washes the tannery off. Cimri leads the party to Ash House. Deliver the payroll to the employer behind the screens.';
 else if(next==='ash_house'&&quest.chapter3)summary=quest.sermonDispersed?'Return to Razelago and report the party’s work in Longacre.':'Meet Razelago before heading to the sermon.';
 else if(next==='ash_house'&&quest.spiritCalmed)summary='Return downstairs. Jamal is safe and the spirit is quiet. Report to Razelago in the morning.';
 if(next==='ash_house'&&quest.chapter6)summary=!quest.ovinnikReported?'Bring the still-living gate guardian to Razelago. Learn what attacked the party.':'The party withdraws from the church standoff. Rest at Ash House before J’Mal’s evening watch.';
 if(next==='longacre_jail')summary=quest.chapter4?(quest.hillSearched?'Return with Riley after the unsuccessful hill search. Check on Bolgart in custody.':'Escort and question the prisoners at the jail.'):quest.rhonaDismissed?'Return to the jail, now staffed by retained deputies and replacement guards.':quest.decreesIssued?'Post the jail’s copy of the notices and deliver the party’s separate dismissal of Rhona.':'Visit the western gate and jail.';
 if(next==='longacre_square')summary=!quest.sermonDispersed?'The church square is gathering for Allamar’s sermon. Listen to her claims and counter the talk of rebellion.':quest.deputiesReported?'Cross Longacre on the way to the audience at Scarlet Manor.':'Return to the square. '+QuestGuide.current().text;
 await journeyCard(scenes[next].name,summary,()=>setScene(next,x,y,dir));
}
function updateObjective(){
 const seventh=ChurchArc.goal();if(seventh){$('objective').textContent=seventh;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const sixth=PoliticalMovement.goal();if(sixth){$('objective').textContent=sixth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const fifth=DebtsRumors.goal();if(fifth){$('objective').textContent=fifth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}const fourth=LastStand.goal();if(fourth){$('objective').textContent=fourth;$('status').textContent='Arrows / WASD · E confirm · B pause / back';return;}if(window.NextArc.objective()||window.NextChapter.objective())return;
 $('objective').textContent=battle?'Defeat Viggo and the zealots.':quest.done?'A voyage south, then Longacre.':scene==='street'?(quest.burned?'Leave Kintargo under cover.':'Find the Silver Star.'):scene==='tavern'?(quest.burned?'Return to the street.':quest.ropeCut?'The bell is silent. Find the stairs.':'Find the way down.'):quest.victory?(quest.planted?'Destroy the temple.':'Take the scimitar. Plant the rapier.'):'Approach the altar.';
 $('status').textContent=quest.done?'Chapter complete. Remesiana, then the road to Longacre.':battle?'Choose an enemy, then attack or use an ability. Select a companion to receive healing.':quest.burned?'The Silver Star burns. Slip away under Freya’s cover.':'WASD / arrows to walk · Shift to run · E to interact · Click to move';
}
function save(){if(battle||!ready||introOpen)return;try{localStorage.setItem(SAVE,JSON.stringify({version:2,scene,lead,quest,hp,uses,potions,mendUses,progression,inventory,position:units[0]?{x:units[0].step?.sx||units[0].x,y:units[0].step?.sy||units[0].y}:null}));$('save-status').textContent='Checkpoint saved';}catch{$('save-status').textContent='Checkpoint unavailable';}}
function clearDialog(){const resolve=dialogResolve;dialogResolve=null;dialogOpen=false;$('dialog').hidden=true;keys.clear();if(resolve)resolve(null);}
function say(name,text,choices=null){if(!journeyOpen)$('journey').hidden=true;if(!battle&&name!=='Intimidation')$('dice-panel').hidden=true;const token=epoch;dialogOpen=true;dialogOpenedAt=performance.now();keys.clear();path=[];$('speaker').textContent=name?NAMES[name]||name:'Chronicle';paintPortrait(name);$('line').textContent=text;$('choices').replaceChildren();$('close').hidden=!!choices;$('dialog').hidden=false;$('prompt').hidden=true;
 if(choices)choices.forEach((text,i)=>{const b=document.createElement('button');b.textContent=(i+1)+'. '+text;b.onclick=()=>finishDialog(i);$('choices').append(b);});
 (choices?$('choices').firstChild:$('close')).focus();
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
 const x=count===1?480:count===2?380+index*170:count===3?300+index*140:275+index*105;
 const height=['viggo','bolgart_wereboar'].includes(actor.id)?116:count>=4?96:104;
 return {x,y:180,height};
}
function healthBadge(x,y,w,name,value,max,selected=false,enemy=false){
 ctx.save();ctx.fillStyle='#131922ed';ctx.strokeStyle=selected?'#e4c581':'#766343';ctx.lineWidth=selected?2:1;ctx.beginPath();ctx.moveTo(x-w/2+5,y);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w/2,y+27);ctx.lineTo(x-w/2,y+27);ctx.lineTo(x-w/2,y+5);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.textAlign='left';ctx.font='bold 11px Georgia';ctx.fillStyle=selected?'#f4d795':'#e4d5b9';ctx.fillText(name,x-w/2+6,y+10,w-12);
 ctx.font='9px monospace';ctx.fillStyle='#bcb8ab';ctx.fillStyle=value===0?'#dc9a87':'#bcb8ab';ctx.fillText(value===0?'DOWN':value+'/'+max,x-w/2+6,y+21);
 const barX=x-w/2+38,barW=w-44;rect(barX,y+16,barW,5,'#35333a');rect(barX,y+16,barW*Math.max(0,value/max),5,enemy?'#b86454':'#9dab77');if(selected){ctx.fillStyle='#e4c581';ctx.beginPath();ctx.moveTo(x-4,y-5);ctx.lineTo(x+4,y-5);ctx.lineTo(x,y-1);ctx.fill();}ctx.restore();
}
async function animateAction(actor,target,type,hit=true,onImpact=null){
 const token=epoch,duration=reduce.matches?120:actor.id==='reese'&&['attack','special'].includes(type)?760:type==='special'?780:['potion','mend'].includes(type)?720:600;
 const action={actor,target,type,hit,start:performance.now(),duration};battle.animation=action;
 GameAudio.effect(['potion','mend'].includes(type)?'heal':type==='special'&&actor.id==='jason'?'fire':type==='special'&&actor.id==='draymus'?'spell':hit?'confirm':'miss');
 await delay(duration*.62);if(token!==epoch||!battle)throw CANCEL;onImpact?.();
 await delay(duration*.38);if(token!==epoch)throw CANCEL;if(battle?.animation===action)battle.animation=null;
}
function actionPose(u){const a=battle?.animation;if(!a||reduce.matches)return {dx:0,dy:0,tilt:0};if(a.actor!==u){const p=(performance.now()-a.start)/a.duration,q=(p-.62)/.28,reaction=a.target===u&&a.hit&&!['potion','mend','guard','smoke'].includes(a.type)&&q>=0&&q<=1?Math.sin(q*Math.PI):0;return {dx:reaction*5,dy:-reaction*2,tilt:reaction*.055};}const p=Math.min(1,(performance.now()-a.start)/a.duration),from=battlePosition(u),to=battlePosition(a.target||u),d=Math.hypot(to.x-from.x,to.y-from.y)||1,stride=Math.sin(p*Math.PI)*(u.id==='reese'?0:['mend','potion'].includes(a.type)?2:a.type==='guard'?0:a.type==='special'&&['jason','draymus'].includes(u.id)?5:a.type==='special'&&u.id==='freya'?28:18);return {dx:(to.x-from.x)/d*stride,dy:(to.y-from.y)/d*stride,tilt:Math.sin(p*Math.PI)*.08};}
function renderAction(){const a=battle?.animation;if(!a)return;if(CombatArt.effect(ctx,a))return;const p=reduce.matches ? .6 : Math.min(1,(performance.now()-a.start)/a.duration),from=battlePosition(a.actor),to=battlePosition(a.target||a.actor),x=to.x,y=to.y-to.height*.55;ctx.save();ctx.globalAlpha=Math.sin(p*Math.PI)*.9;ctx.lineWidth=3;
 if(['reese','kuribu'].includes(a.actor.id)&&['attack','special'].includes(a.type)){const flight=Math.max(0,Math.min(1,(p-.38)/.24)),sx=from.x+17,sy=from.y-from.height*.6,ax=sx+(x-sx)*flight,ay=sy+((a.hit?y:y+24)-sy)*flight,angle=Math.atan2(y-sy,x-sx);if(p>.38&&p<.72){ctx.translate(ax,ay);ctx.rotate(angle);ctx.globalAlpha=1;ctx.fillStyle='#dccba2';ctx.fillRect(-13,-1,20,2);ctx.fillStyle='#a5b4c0';ctx.fillRect(6,-2,4,4);ctx.fillStyle='#745949';ctx.fillRect(-14,-3,4,6);}ctx.restore();return;}

 if(p<.48||p>.88){ctx.restore();return;}
 const burst=(color)=>{ctx.strokeStyle=color;for(let i=0;i<8;i++){const angle=i*Math.PI/4,r=12+p*16;ctx.beginPath();ctx.moveTo(x+Math.cos(angle)*r*.4,y+Math.sin(angle)*r*.4);ctx.lineTo(x+Math.cos(angle)*r,y+Math.sin(angle)*r);ctx.stroke();}};
 if(a.type==='special'&&a.actor.id==='draymus'){ctx.strokeStyle='#a3bddc';ctx.beginPath();ctx.moveTo(from.x,from.y-45);ctx.quadraticCurveTo((from.x+x)/2,y-40,x,y);ctx.stroke();burst('#a3bddc');}
 else if(a.type==='special'&&a.actor.id==='jason'){burst('#ed975c');for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#e46846':'#eac16e';ctx.fillRect(x-18+i*8,y+10-Math.sin(p*Math.PI)*20-i%3*5,5,15);}}
 else if(a.type==='potion'||a.type==='mend'){ctx.fillStyle='#a5c994';ctx.fillRect(x-3,y-13,6,26);ctx.fillRect(x-13,y-3,26,6);}
 else if(a.type==='guard'){ctx.strokeStyle='#dcc486';ctx.beginPath();ctx.moveTo(from.x-19,from.y-40);ctx.lineTo(from.x,from.y-48);ctx.lineTo(from.x+19,from.y-40);ctx.lineTo(from.x+15,from.y-20);ctx.lineTo(from.x,from.y-10);ctx.lineTo(from.x-15,from.y-20);ctx.closePath();ctx.stroke();}
 else if(a.type==='smoke'){ctx.fillStyle='#aaa5b07a';for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(420+i*25,130+i%2*40,15+p*16,0,Math.PI*2);ctx.fill();}}
 else if(a.type==='special'&&a.actor.id==='guapo'){ctx.strokeStyle='#e8ce89';ctx.beginPath();ctx.moveTo(from.x+12,from.y-42);ctx.lineTo(x,y);ctx.stroke();if(a.hit)burst('#e8ce89');}
 else{ctx.strokeStyle=a.actor.id.startsWith('deputy')?'#bd9470':a.hit?'#efe0b8':'#b0acaa';if(a.actor.id.startsWith('deputy'))ctx.lineWidth=6;const thrust=['jamal','guapo'].includes(a.actor.id);if(thrust){ctx.beginPath();ctx.moveTo(x-25,y+12);ctx.lineTo(x+16,y-8);ctx.stroke();if(a.type==='special'){ctx.beginPath();ctx.moveTo(x-15,y-15);ctx.lineTo(x+18,y+8);ctx.stroke();}}else{ctx.beginPath();ctx.arc(x,y,20,Math.PI*.8,Math.PI*1.8);ctx.stroke();}if(a.hit)burst('#d4b981');}
 ctx.restore();
}
function drawCombatIdle(g,u,v,t){if(CombatArt.actor(g,u,v))return true;const m=window.COMBAT_IDLES?.[u.id],im=m&&art[m.src];if(!m||!im)return false;const phase=reduce.matches||hp[u.id]===0||u.hp===0?0:m.cycle[Math.floor((t+(CORE.indexOf(u.id)+1)*.17)/.52)%4],f=m.frames[phase],scale=v.height/m.maxHeight;g.save();g.imageSmoothingEnabled=false;const pose=actionPose(u);g.translate(v.x+pose.dx+(u.flash&&!reduce.matches?Math.sin(u.flash*60)*3:0),v.y+pose.dy-(u.lunge?Math.sin(u.lunge/.22*Math.PI)*5:0));g.rotate(pose.tilt);if(hp[u.id]===0||u.hp===0)g.globalAlpha=.25;else if(u.flash>0&&!reduce.matches)g.globalAlpha=.65;g.drawImage(im,f.x,f.y,f.w,f.h,Math.round((f.x-f.anchorX)*scale),-Math.round(f.h*scale),Math.round(f.w*scale),Math.round(f.h*scale));g.restore();return true;}
function drawCombatBackdrop(t){
 rect(0,0,SCREEN.width,battlefieldHeight(),'#14151f');
 // A quiet combat void: translucent drifting bands, no scenery or floor grid.
 ctx.save();ctx.fillStyle='#706078';ctx.globalAlpha=.045;
 for(let i=0;i<4;i++){const shift=reduce.matches?0:Math.sin(t*.18+i*1.7)*18;ctx.beginPath();ctx.ellipse(105+i*155+shift,78+i%2*102,165,30+i*6,-.16,0,Math.PI*2);ctx.fill();}
 ctx.globalAlpha=.11;ctx.fillStyle='#bba783';for(let i=0;i<13;i++){const drift=reduce.matches?0:t*2;const x=(i*97+33)%640,y=(i*43+drift)%battlefieldHeight();ctx.fillRect(x,y,1,i%4===0?2:1);}ctx.restore();
}
function drawCombatFallen(g,u,v){
 const meta=window.COMBAT_IDLES?.[u.id]||PARTY_FRAMES[u.id],f=meta.frames[0],im=art[meta.src]||sheets[u.id];if(!im)return;
 const length=74,scale=length/(meta.maxHeight||f.h);g.save();g.imageSmoothingEnabled=false;g.globalAlpha=.85;g.translate(v.x,v.y-18);g.rotate(-Math.PI/2);g.drawImage(im,f.x,f.y,f.w,f.h,-f.w*scale/2,-f.h*scale/2,f.w*scale,f.h*scale);g.restore();
}
function drawTargetBrackets(t=0){
 if(battle.busy)return;const mode=battle.control?.mode==='ally'?'ally':'enemy';
 const target=mode==='enemy'?battle.enemies[battle.target]:units.find(u=>u.id===battle.ally);if(!target||mode==='enemy'&&target.hp<=0)return;
 const v=battlePosition(target),down=mode==='ally'&&hp[target.id]===0,half=mode==='ally'?43:48,top=down?v.y-42:v.y-v.height-4,bottom=v.y+3;
 ctx.save();ctx.strokeStyle=mode==='ally'?'#a8d8a0':'#f0ca7e';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=2;
 if(['enemy','ally'].includes(battle.control?.mode))for(const[x,sx]of [[v.x-half,1],[v.x+half,-1]])for(const[y,sy]of [[top,1],[bottom,-1]]){ctx.beginPath();ctx.moveTo(x,y+sy*9);ctx.lineTo(x,y);ctx.lineTo(x+sx*9,y);ctx.stroke();}
 const y=mode==='enemy'?top-41:top-13,lift=reduce.matches?0:Math.sin(t*4)*2;
 ctx.beginPath();ctx.moveTo(v.x,y-7+lift);ctx.lineTo(v.x+6,y+lift);ctx.lineTo(v.x,y+7+lift);ctx.lineTo(v.x-6,y+lift);ctx.closePath();ctx.fill();ctx.strokeStyle='#352a30';ctx.lineWidth=1;ctx.stroke();ctx.restore();
}
function renderBattle(t){
 const field=battlefieldHeight();drawCombatBackdrop(t);
 ChurchArc.drawSupport(t);for(const enemy of battle.enemies){const v=battlePosition(enemy),m=window.FUTURE_NPCS?.[enemy.id],f=m?.frame||window.CHAPTER_NPCS[enemy.id],scale=v.height/f.h;ctx.save();ctx.globalAlpha=enemy.hp>0?1:.22;if(enemy.id==='celestial_wolf'){ctx.shadowColor='#dce4ff';ctx.shadowBlur=9;}if(!drawCombatIdle(ctx,enemy,v,t))ctx.drawImage(m?art[m.source]:art.npcs,f.x,f.y,f.w,f.h,v.x-f.w*scale/2,v.y-v.height+(enemy.lunge?-5:0),f.w*scale,v.height);ctx.restore();if(enemy.hp>0)healthBadge(v.x,v.y-v.height-35,88,enemy.name,enemy.hp,enemy.max,battle.enemies[battle.target]===enemy&&battle.control?.mode!=='ally',true);}

 const ordered=units.map(u=>({u,v:battlePosition(u)})).sort((a,b)=>a.v.y-b.v.y);
 for(const {u,v} of ordered){if(hp[u.id]===0)drawCombatFallen(ctx,u,v);else if(!drawCombatIdle(ctx,u,v,t))drawActor(ctx,{...u,x:v.x,y:v.y,dir:'up',step:null},v.height);healthBadge(v.x,v.y+7,units.length>5?68:76,NAMES[u.id],hp[u.id],STATS[u.id].hp,activeUnit()===u||battle.control?.mode==='ally'&&battle.ally===u.id);}
 renderAction();CombatArt.impact(ctx,battle.animation);drawTargetBrackets(t);
 for(const f of fx){ctx.font='bold 18px monospace';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#111';ctx.fillStyle=f.color;ctx.strokeText(f.text,f.x,f.y-(.9-f.life)*15);ctx.fillText(f.text,f.x,f.y-(.9-f.life)*15);}
 $('prompt').hidden=true;
}
function finishDialog(value=0){if(!dialogOpen||performance.now()-dialogOpenedAt<180)return;GameAudio.effect('confirm');const resolve=dialogResolve;dialogResolve=null;dialogOpen=false;$('dialog').hidden=true;keys.clear();canvas.focus();if(resolve)resolve(value);}
function run(fn){if(taskBusy||battle?.busy)return;taskBusy=true;const token=epoch;Promise.resolve().then(fn).catch(e=>{if(e!==CANCEL){console.error(e);$('status').textContent='The scene could not continue. Restart from the checkpoint.';}}).finally(()=>{if(token===epoch){taskBusy=false;if(!journeyOpen)$('journey').hidden=true;updateObjective();}});}
const ROSTER=[...CORE,'bruce'];
const BIOS={
 freya:{name:'Freya Kusanagi',role:'Half-elf · Samurai',bio:'An army captain raised by an officer father. Trained in swordsmanship, horsemanship, and tactics, Freya wants to earn a reputation beyond her family name. Her Hellknight induction lies ahead.',ability:'Challenge · Focused samurai strike against one foe.'},
 jamal:{name:'J’Mal',role:'Hobgoblin · Rogue',bio:'A sharp grin and sharper blades. J’Mal exploits openings while smoke keeps the enemy guessing.',ability:'Sneak Attack · Extra damage against a wounded target.'},
 jason:{name:'Jason',role:'Oni-spawn tiefling · Cleric of Asmodeus',bio:'An imposing servant of the Prince of Darkness. Jason brings divine authority and fire magic to the party.',ability:'Burning Hands · Fire spell. Mending · Restore an ally.'},
 draymus:{name:'Draymus Keshaal Mortiarum',role:'Dhampir · Necromancer',bio:'Pale, patient, and fascinated by what death leaves behind. Draymus wields cold necromantic touch magic.',ability:'Chill Touch · A close-range necromantic strike.'},
 guapo:{name:'El Guapo',role:'Sailor · Swashbuckler',bio:'A seasoned blade with a dry sense of humor. El Guapo fights dirty and keeps one eye on the nearest exit.',ability:'Panache Thrust · A daring attack with his rapier.'},
 reese:{name:'Reese',role:'Strix · Ranger / Archer',bio:'A strix archer exiled from his people for excessive violence while serving in their defense force. He comes down from the mountains with armor, a bow, and basic equipment; his magical arsenal comes later.',ability:'Joins during the Longacre operations; absent from the Kintargo mission.'},
 bruce:{name:'Bruce',role:'Aasimar · Monk / Dragon Disciple',bio:'Bruce’s later build combines unchained monk training, sorcery, and the Dragon Disciple path. His portrait shows his later campaign appearance.',ability:'Joins later in the campaign; not present on the Night of Ashes.'}
};
function drawIntroArt(c,id){const g=c.getContext('2d'),f=window.PARTY_FRAMES[id].frames[0];if(art[id+'-portrait']){const im=art[id+'-portrait'];g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=true;const scale=Math.min(c.width/im.width,c.height/im.height);g.drawImage(im,(c.width-im.width*scale)/2,(c.height-im.height*scale)/2,im.width*scale,im.height*scale);return;}g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;const scale=Math.min(c.width*.85/f.w,c.height*.94/f.h),w=f.w*scale,h=f.h*scale;g.drawImage(sheets[id],f.x,f.y,f.w,f.h,(c.width-w)/2,c.height-h,w,h);}
function paintIntro(){const id=ROSTER[introIndex],bio=BIOS[id];drawIntroArt($('intro-art'),id);$('intro-name').textContent=bio.name;$('intro-role').textContent=bio.role;$('intro-bio').textContent=bio.bio;$('intro-ability').textContent=bio.ability;$('intro-start').disabled=!OPENING_ROSTER.includes(id);$('intro-start').textContent=OPENING_ROSTER.includes(id)?'Play as '+NAMES[id]:'Joins in a later chapter';Array.from($('intro-roster').children).forEach((b,i)=>b.setAttribute('aria-pressed',String(i===introIndex)));}
function showIntro(){introOpen=true;document.body.classList.add('is-intro');canvas.height=SCREEN.height;ctx.imageSmoothingEnabled=false;$('intro').hidden=false;$('intro-resume').hidden=!readSave();$('intro-roster').replaceChildren();ROSTER.forEach((id,i)=>{const b=document.createElement('button'),c=document.createElement('canvas'),name=document.createElement('span');c.width=110;c.height=130;drawIntroArt(c,id);name.textContent=NAMES[id]||BIOS[id].name;b.append(c,name);b.setAttribute('aria-label',BIOS[id].name+(OPENING_ROSTER.includes(id)?'':', joins later'));if(!OPENING_ROSTER.includes(id)){const tag=document.createElement('small');tag.textContent='Later';b.append(tag);}b.onclick=()=>{introIndex=i;paintIntro();};$('intro-roster').append(b);});introIndex=Math.max(0,ROSTER.indexOf(lead));paintIntro();$('intro-start').focus();}
function reset(resume=false,selected=null){
 TitleScreen.hide();Handheld.close();
 epoch++;cancelJourney();cancelLevel();briefingOpen=false;$('dice-panel').hidden=true;$('dice-panel').classList.remove('rolling');clearDialog();battle=null;$('combat-log').replaceChildren();showCombatMessage('');taskBusy=false;fx=[];path=[];keys.clear();$('battle').hidden=true;$('character').disabled=false;syncBattleView();
 if(!resume&&!selected){showIntro();return;}
 introOpen=false;$('intro').hidden=true;document.body.classList.remove('is-intro');canvas.height=SCREEN.height;ctx.imageSmoothingEnabled=false;
 if(!resume&&selected){try{const previous=localStorage.getItem(SAVE);if(previous){localStorage.setItem(SAVE+'-before-import',previous);$('save-restore').hidden=false;}}catch{}}
 const saved=resume?readSave():null;quest=saved?.quest||{briefed:false,ropeCut:false,bell:false,victory:false,scimitar:false,planted:false,burned:false,done:false};
 progression=saved?.progression||Progression.fresh();inventory=saved?.inventory||Inventory.fresh();applyProgression();
 hp=saved?.hp||Object.fromEntries(CORE.map(id=>[id,STATS[id].hp]));uses=saved?.uses||Object.fromEntries(CORE.map(id=>[id,0]));potions=saved?.potions??2;mendUses=saved?.mendUses??2;lead=saved?.lead||selected||'freya';$('character').value=lead;
 $('save-file-status').textContent='';
 const next=saved?.scene||'street',spawn=scenes[next].spawn||[312,next==='street'?248:next==='tavern'?280:312];setScene(next,saved?.position?.x??spawn[0],saved?.position?.y??spawn[1]);window.NextChapter.syncRoster();canvas.focus();
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

function applyProgression(){for(const id of CORE){STATS[id]=Inventory.stats(Progression.stats(BASE_STATS[id],id,progression.levels[id]),inventory,id);SPECIAL[id]=Progression.skill(BASE_SPECIAL[id],progression.levels[id],id);if(['freya','jamal','reese'].includes(id))SPECIAL[id].dmg[1]=STATS[id].dmg[1];WEAPONS[id]=Inventory.weapon(inventory,id).name;ATTACKS[id]=Inventory.weapon(inventory,id).verb;}}
function cancelLevel(){const resolve=levelResolve;levelResolve=null;levelOpen=false;document.body.classList.remove('is-level');$('level-up').hidden=true;if(resolve)resolve();}
$('level-continue').onclick=()=>{const resolve=levelResolve;levelResolve=null;if(resolve)resolve();};
async function awardSermonMilestone(){
 if(progression.milestones.includes(Progression.milestone))return false;
 const token=epoch;progression.milestones.push(Progression.milestone);for(const id of Progression.members)progression.levels[id]=2;applyProgression();
 for(const id of Progression.members){hp[id]=STATS[id].hp;uses[id]=0;}mendUses=2;save();paintParty();levelOpen=true;document.body.classList.add('is-level');canvas.height=SCREEN.height;ctx.imageSmoothingEnabled=false;keys.clear();path=[];$('dice-panel').hidden=true;$('level-rows').replaceChildren();
 for(const id of Progression.members){const row=document.createElement('div'),name=document.createElement('strong'),detail=document.createElement('div'),skill=document.createElement('small');row.className='level-row';name.textContent=NAMES[id]+' · Lv 2';detail.textContent='HP '+BASE_STATS[id].hp+' → '+STATS[id].hp+' · Hit +'+BASE_STATS[id].atk+' → +'+STATS[id].atk;skill.textContent=SPECIAL[id].name+' '+BASE_SPECIAL[id].uses+' → '+SPECIAL[id].uses+' uses';detail.append(skill);row.append(name,detail);$('level-rows').append(row);}
 $('level-up').hidden=false;$('level-continue').focus();await new Promise(resolve=>levelResolve=resolve);if(token!==epoch)throw CANCEL;$('level-up').hidden=true;levelOpen=false;document.body.classList.remove('is-level');canvas.height=SCREEN.height;ctx.imageSmoothingEnabled=false;keys.clear();canvas.focus();save();return true;
}
function readSave(){try{const raw=localStorage.getItem(SAVE);return raw?window.SaveFiles.decode(raw):null;}catch{return null;}}
// Later Ash House interactions are exposed only by their chapter’s gated points() handler.
function storyPointAvailable(p){
 const completed={supplies:'supplied',cimri:'metCimri',guapoDeparture:'guapoAway',scout:'scouted',owner:'ownerDeal',payroll:'payroll',rest:'rested',bathStairs:'spiritCalmed',sermon:'sermonDispersed',noticeDecree:'noticePosted',tavernDecree:'tavernPosted',gateDecree:'gatePosted',jailDecree:'rhonaDismissed'};
 if(completed[p.id]&&quest[completed[p.id]])return false;
 if(['noticeDecree','tavernDecree','gateDecree','jailDecree'].includes(p.id)&&!quest.decreesIssued)return false;
 if(p.id==='manorRoad')return !!quest.deputiesReported;
 if(['rileyQuestion','hospiceRoad','hillRoad','bolgartStocks','lastReport'].includes(p.id))return !!quest.chapter4;
 if(p.id==='lastStandRoad')return !!quest.chapter3Complete;
 return true;
}
function visiblePoints(){const seventh=ChurchArc.points();if(seventh)return seventh;const sixth=PoliticalMovement.points();if(sixth)return sixth;const fifth=DebtsRumors.points();if(fifth)return fifth;if(quest.chapter3Complete&&!quest.chapter4)return [point('lastStandRoad')].filter(Boolean);const fourth=LastStand.points();if(fourth)return fourth.concat(townsfolk().map(u=>({id:u.id,x:u.x,y:u.y,label:'Speak to townsfolk'})));if(soloScout())return [point('scout')];if(quest.chapter2Complete&&!quest.chapter3)return [{id:'chapterThree',x:328,y:160,label:'Continue to Chapter Three'}];if(quest.done&&!quest.chapter2)return [{id:'nextChapter',x:608,y:184,label:'Continue to Chapter Two'}];return scenes[scene].points.filter(p=>storyPointAvailable(p)&&!['debtsRoad','movementRoad','feyReport','churchStandRoad','watchRoad'].includes(p.id)&&(p.id!=='longacreRoad'||quest.chapter3)&&!(quest.burned&&scene==='tavern'&&p.id==='stairs')&&!(quest.victory&&scene==='temple'&&p.id==='altar')) .concat(scene==='temple'&&quest.victory?[{id:'aftermath',x:312,y:120,label:!quest.scimitar?'Take Viggo’s scimitar':!quest.planted?'Plant the rapier':'Burn the temple'}]:[]).concat(townsfolk().map(u=>({id:u.id,x:u.x,y:u.y,label:'Speak to a townsfolk'})));}
function nearPoint(){if(!units[0])return null;return visiblePoints().filter(p=>Math.hypot(units[0].x-p.x,units[0].y-p.y)<INTERACTION_RADIUS).sort((a,b)=>Math.hypot(units[0].x-a.x,units[0].y-a.y)-Math.hypot(units[0].x-b.x,units[0].y-b.y))[0];}
async function interact(requestedId=null){
 if(Handheld.isOpen()||introOpen||journeyOpen||levelOpen||dialogOpen||taskBusy||battle||units[0]?.step||finished())return;const p=typeof requestedId==='string'?visiblePoints().find(p=>p.id===requestedId&&Math.hypot(units[0].x-p.x,units[0].y-p.y)<INTERACTION_RADIUS):nearPoint();if(!p)return;
 run(async()=>{
  if(p.id.startsWith('citizen-')){await say('Townsfolk',citizenLine(p.id));return;}
  if(await ChurchArc.interact(p.id)||await PoliticalMovement.interact(p.id)||await DebtsRumors.interact(p.id)||await LastStand.interact(p.id)||await window.NextArc.interact(p.id)||await window.NextChapter.interact(p.id))return;
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
 await journeyCard('Kintargo · The safehouse','From a lavish safehouse balcony, the team watches three fires burn across the city. They lie low for nearly twenty-four hours.\n\nAfter resting, a covered wagon takes them to the docks, where The Western Star awaits.',()=>{for(const id of CORE)hp[id]=STATS[id].hp;setScene('street',600,184,'left');});
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
function paintEnemyIntent(){const panel=$('enemy-intents');panel.hidden=!battle;if(!battle)return;panel.replaceChildren();const heading=document.createElement('strong');heading.textContent='ENEMY INTENT · R'+battle.round;panel.append(heading);for(const e of battle.enemies.filter(e=>e.hp>0)){const row=document.createElement('div');row.textContent=EnemyTactics.preview(e,NAMES);row.title=row.textContent;row.className=e.intent?.heavy?'heavy':'';panel.append(row);}}
function startBattle(count,shaken,config=null){
 const places=[[312,280],[264,296],[360,296],[280,328],[344,328],[392,328]];
 units.forEach((u,i)=>{u.x=places[i][0];u.y=places[i][1];u.dir='up';u.step=null;u.guard=false;});path=[];
 const enemies=config?.enemies||[{id:'viggo',name:'Viggo',x:312,y:136,hp:34,max:34,shaken:shaken?2:0},...Array.from({length:count},(_,i)=>({id:'cultist',name:'Zealot '+(i+1),x:[248,392,552][i],y:[152,152,280][i],hp:12,max:12}))];
 battle={kind:config?.kind||'temple',round:1,turn:0,target:0,ally:units.some(u=>u.id===lead)?lead:units[0].id,enemies,busy:false,smoke:0};$('battle').hidden=false;$('character').disabled=true;$('combat-log').replaceChildren();battle.recent=[];battle.current='';showCombatMessage('Read enemy intent. Guard halves incoming damage.');planEnemyRound();paintBattle();updateObjective();
}
function showCombatMessage(text){$('battle-message').textContent=text;}
function paintCombatHistory(){if(!battle)return;const panel=$('combat-log');panel.replaceChildren();for(const text of battle.recent.slice(0,2)){const e=document.createElement('div');e.className='combat-entry';e.textContent=text;e.title=text;panel.append(e);}}
function log(text){if(!battle)return;$('battle-message').classList.remove('command-preview');if(battle.current)battle.recent.unshift(battle.current);battle.recent=battle.recent.slice(0,2);battle.current=text;showCombatMessage(text);paintCombatHistory();}
function activeUnit(){return battle?units[battle.turn]:null;}
function livingEnemy(){return battle?.enemies.find(e=>e.hp>0);}
function flash(target,value,color='#f0d5a0'){const position=battle?battlePosition(target):{x:target.x,y:target.y,height:55};fx.push({x:position.x,y:position.y-position.height+(battle?.enemies.includes(target)?24:0),text:String(value),color,life:.9});target.flash=.18;}
function hitTarget(attacker,target,value){GameAudio.effect('hit');target.hp=Math.max(0,target.hp-value);attacker.lunge=.22;flash(target,'−'+value);return value;}
function paintParty(){
 syncBattleView();
 $('party').replaceChildren();units.forEach(u=>{const b=document.createElement('button');b.className='party-card'+(hp[u.id]===0?' down':'')+(battle&&activeUnit()?.id===u.id?' current':'')+(battle?.ally===u.id?' selected':'');b.title=battle?'Select '+NAMES[u.id]+' as healing target':'Speak to '+NAMES[u.id];const c=document.createElement('canvas');c.width=32;c.height=48;drawActor(c.getContext('2d'),{...u,x:16,y:46,dir:'down',step:null},38);const text=document.createElement('span');text.textContent=NAMES[u.id]+' · Lv '+progression.levels[u.id]+' · '+hp[u.id]+'/'+STATS[u.id].hp;const meter=document.createElement('i');meter.style.width=Math.max(0,hp[u.id]/STATS[u.id].hp*100)+'%';b.append(c,text,meter);b.onclick=()=>{if(battle){battle.ally=u.id;paintParty();}else if(!taskBusy&&!finished())run(()=>say(u.id,lines[scene]?.[u.id]||'Your call.'));};$('party').append(b);});
}
const signed=n=>(n>=0?'+':'−')+Math.abs(n);
const rollSummary=spec=>spec[0]+'D'+spec[1]+(spec[2]?' '+signed(spec[2]):'');
function combatAC(id){return STATS[id].ac+(battle?.kind==='execution'&&id==='jason'?2:0);}
function commandSummary(action,id){
 const stat=STATS[id],skill=SPECIAL[id],hit='D20 '+signed(stat.atk+(action==='special'?(skill.bonus||0):0)),remaining=Math.max(0,skill.uses-uses[id]),ally=NAMES[battle.ally||id];
 if(action==='attack'){const move=Inventory.weapon(inventory,id).move;return 'Attack | '+move+' · Hit '+hit+' vs AC · Damage '+rollSummary(stat.dmg)+'.';}
 if(action==='special'){let effect='Damage '+rollSummary(skill.dmg);if(id==='jamal')effect+='; +1D6 if target already hit this round';if(skill.drain)effect+='; heal self by damage dealt';if(id==='jason')effect+='; fire burst on selected foe';if(id==='draymus')effect+='; necromantic touch, no self-healing';return 'Skill | '+skill.name+' ['+remaining+'/'+skill.uses+'] · '+(skill.auto?'Automatic hit':'Hit '+hit+' vs AC')+' · '+effect+'.';}
 if(action==='guard')return 'Guard | '+NAMES[id]+' braces · AC '+combatAC(id)+' → '+(combatAC(id)+4)+' until the next round; halve damage from hits. Uses this turn.';
 if(action==='potion')return 'Potion | '+NAMES[id]+' heals '+ally+' · Restore 2D4 +2 HP (up to max) · ['+potions+'/2].';
 if(action==='mend')return 'Mend | Infernal Mending · Jason heals '+ally+' for 2D8 +3 HP (up to max) · ['+mendUses+'/2].';
 if(action==='smoke')return 'Smoke | Jamal throws a bomb · Enemies −4 to hit for 2 rounds · ['+(quest.smokeUsed?0:1)+'/1].';
}
function commandCardSummary(action,id){const stat=STATS[id],skill=SPECIAL[id],roll=d=>rollSummary(d).replaceAll(' ',''),hit='D20'+signed(stat.atk+(action==='special'?(skill.bonus||0):0)),left=Math.max(0,skill.uses-uses[id]),ally=NAMES[battle.ally||id];if(action==='attack')return Inventory.weapon(inventory,id).move+'\n'+hit+' · '+roll(stat.dmg);if(action==='special')return (id==='jason'?'Fire · Burning Hands':id==='draymus'?'Touch · Chill Touch':skill.name)+'\n'+roll(skill.dmg)+' ['+left+'/'+skill.uses+']';if(action==='guard')return 'AC '+combatAC(id)+' → '+(combatAC(id)+4)+'\nHalf incoming damage';if(action==='potion'||action==='mend')return ally+' ['+(action==='mend'?mendUses:potions)+'/2]\n'+(action==='mend'?'2D8+3':'2D4+2')+' HP';return 'Enemies −4 to hit\n2 rounds ['+(quest.smokeUsed?0:1)+'/1]';}
function combatButtons(){return Array.from($('actions').querySelectorAll('button'));}
function paintCombatSelection(){
 if(!battle)return;const c=battle.control;combatButtons().forEach((b,i)=>b.classList.toggle('is-chosen',c?.mode==='commands'&&i===c.index));
 if(c?.mode==='enemy'||c?.mode==='ally'){
  const chosen=c.mode==='enemy'?battle.enemies[battle.target]?.name:NAMES[battle.ally];$('battle-title').textContent=chosen+' · ← → select · E: confirm · B: back';
  canvas.focus({preventScroll:true});
 }
}
function beginCombatChoice(action){
 if(!battle||battle.busy)return;const c=battle.control;
 if(['guard','smoke'].includes(action)){performAction(action);return;}
 c.action=action;c.mode=['potion','mend'].includes(action)?'ally':'enemy';paintCombatSelection();
}
function cycleCombatTarget(mode,delta){
 const choices=mode==='enemy'?battle.enemies.flatMap((e,i)=>e.hp>0?[i]:[]):units.map(u=>u.id);if(!choices.length)return;
 const current=mode==='enemy'?battle.target:battle.ally,index=choices.indexOf(current),next=choices[(Math.max(0,index)+delta+choices.length)%choices.length];if(mode==='enemy')battle.target=next;else battle.ally=next;
}
function handleCombatKey(e){
 const key=e.key.toLowerCase(),direction=KEY[e.key],confirm=['enter','e',' '].includes(key),cancel=['escape','b'].includes(key);
 if(!direction&&!confirm&&!cancel&&!['q','h'].includes(key)&&! /^[1-9]$/.test(key))return false;
 e.preventDefault();keys.clear();if(battle.busy||taskBusy||e.repeat&&confirm)return true;
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
 if(!battle)return;paintEnemyIntent();while(battle.turn<units.length&&(hp[units[battle.turn].id]<=0||(battle.paralyzed===units[battle.turn].id&&battle.round===1)))battle.turn++;
 if(battle.turn>=units.length){return;}
 if(battle.enemies[battle.target]?.hp<=0)battle.target=battle.enemies.findIndex(e=>e.hp>0);
 const actor=activeUnit();if(!battle.control||battle.control.actor!==actor.id||battle.control.round!==battle.round)battle.control={actor:actor.id,round:battle.round,mode:'commands',index:0,action:null};$('heal-target').textContent='Aid: '+NAMES[battle.ally];$('heal-target').disabled=battle.busy;$('battle-title').textContent='R'+battle.round+' · '+NAMES[actor.id]+' · E: select';$('battle-title').title='Round '+battle.round+' · '+NAMES[actor.id]+'’s turn';$('combat-target').replaceChildren();battle.enemies.forEach((e,i)=>{const o=document.createElement('option');o.value=i;o.textContent=e.name+' '+e.hp+'/'+e.max;o.disabled=e.hp<=0;$('combat-target').append(o);});$('combat-target').value=battle.target;$('combat-target').disabled=battle.busy;
 $('actions').replaceChildren();const commands=[['attack','Attack'],['special',SPECIAL[actor.id].name+' ('+Math.max(0,SPECIAL[actor.id].uses-uses[actor.id])+')'],['guard','Guard'],['potion','Potion ('+potions+')']];
 if(actor.id==='jason')commands.splice(2,0,['mend','Mending ('+mendUses+')']);
 if(actor.id==='jamal')commands.splice(2,0,['smoke','Smoke Bomb']);
 $('actions').classList.toggle('has-aux',commands.length>4);
 commands.forEach(([action,label],i)=>{const b=document.createElement('button');const remaining=Math.max(0,SPECIAL[actor.id].uses-uses[actor.id]);const detail=commandSummary(action,actor.id);const title=document.createElement('span'),subtitle=document.createElement('span');title.className='command-title';subtitle.className='command-subtitle';title.textContent=({attack:'ATTACK',special:'SKILL',guard:'GUARD',potion:'POTION',mend:'MEND',smoke:'SMOKE'})[action];subtitle.textContent=commandCardSummary(action,actor.id);b.append(title,subtitle);b.dataset.action=action;b.onfocus=()=>{if(battle.control.mode==='commands'){battle.control.index=i;paintCombatSelection();}};b.title=detail;b.setAttribute('aria-label',detail);b.disabled=battle.busy||(action==='special'&&uses[actor.id]>=SPECIAL[actor.id].uses)||(action==='potion'&&potions<=0)||(action==='mend'&&mendUses<=0)||(action==='smoke'&&quest.smokeUsed);b.onclick=()=>{if(battle.control.mode!=='commands'&&battle.control.action===action)performAction(action);else{battle.control.index=i;beginCombatChoice(action);}};$('actions').append(b);});
 paintParty();const buttons=combatButtons();if(buttons[battle.control.index]?.disabled)battle.control.index=Math.max(0,buttons.findIndex(b=>!b.disabled));paintCombatSelection();
}
async function performAction(action){try{await performActionImpl(action);}catch(e){if(e!==CANCEL){console.error(e);if(battle){battle.busy=false;paintBattle();}}}}
function potionRefusal(id){return battle?.kind==='temple'&&quest.templeWound&&id==='jamal'?'J’Mal is too badly injured to swallow a potion. He cannot consume it.':'';}
async function performActionImpl(action){
 if(Handheld.isOpen()||!battle||battle.busy||dialogOpen||taskBusy)return;const token=epoch,actor=activeUnit();if(!actor)return;const target=battle.enemies[battle.target]?.hp>0?battle.enemies[battle.target]:livingEnemy();if(!target)return;
 if(action==='special'&&uses[actor.id]>=SPECIAL[actor.id].uses||action==='potion'&&potions<=0||action==='mend'&&mendUses<=0||action==='smoke'&&quest.smokeUsed)return;
 const refusal=action==='potion'?potionRefusal(battle.ally||actor.id):'';if(refusal){battle.control.mode='commands';battle.control.action=null;log(refusal);paintBattle();return;}
 battle.control.mode='commands';battle.control.action=null;battle.busy=true;$('battle-message').classList.remove('command-preview');paintBattle();
 if(action==='guard'){await animateAction(actor,actor,'guard');actor.guard=true;log(NAMES[actor.id]+' guards. AC +4 and incoming damage halved this round.');}
 else if(action==='potion'||action==='mend'){const id=battle.ally||actor.id,value=await damage(action==='mend'?[2,8,3]:[2,4,2],NAMES[actor.id]+' · '+(action==='mend'?'Infernal Mending':'Healing potion')),before=hp[id];await animateAction(actor,units.find(u=>u.id===id),action,true,()=>{hp[id]=Math.min(STATS[id].hp,hp[id]+value);if(action==='potion')potions--;else mendUses--;flash(units.find(u=>u.id===id),'+'+(hp[id]-before),'#a8d8a0');});log(NAMES[actor.id]+(action==='potion'?' uncorks a healing potion':' invokes Infernal Mending')+' for '+NAMES[id]+': '+(hp[id]-before)+' HP restored. ['+(action==='potion'?potions:mendUses)+'/2 remaining]');}
 else if(action==='smoke'){await animateAction(actor,target,'smoke');quest.smokeUsed=true;battle.smoke=2;log('Jamal throws a smoke bomb. Enemies take −4 to hit for two rounds. [0/1 remaining]');}
 else{
  const skill=action==='special'?SPECIAL[actor.id]:null;if(skill)uses[actor.id]++;
  const bonus=STATS[actor.id].atk+(skill?.bonus||0),total=skill?.auto?null:await rollDice(NAMES[actor.id]+' · Attack',20,1,bonus,'AC '+STATS[target.id].ac),roll=total===null?null:total-bonus,hit=skill?.auto||roll===20||roll!==1&&total>=STATS[target.id].ac;
  if(hit){let value=await damage(skill?.dmg||STATS[actor.id].dmg,NAMES[actor.id]+' · '+(skill?.name||'Damage'));if(skill&&actor.id==='jamal'&&target.hitRound===battle.round)value+=await damage([1,6,0],'J’Mal · Sneak attack bonus');await animateAction(actor,target,action,true,()=>hitTarget(actor,target,value));target.hitRound=battle.round;if(skill?.drain)hp[actor.id]=Math.min(STATS[actor.id].hp,hp[actor.id]+value);log(NAMES[actor.id]+' '+(skill?(actor.id==='freya'?'challenges the foe and cuts with her '+WEAPONS.freya:SKILL_TEXT[actor.id]):ATTACKS[actor.id])+' at '+target.name+': '+value+' damage.'+(skill?' ['+Math.max(0,skill.uses-uses[actor.id])+'/'+skill.uses+' remaining]':''));}else{await animateAction(actor,target,action,false);actor.lunge=.22;flash(target,'MISS','#bfc1d1');log(NAMES[actor.id]+' '+(skill?(actor.id==='freya'?'challenges the foe and cuts with her '+WEAPONS.freya:SKILL_TEXT[actor.id]):ATTACKS[actor.id])+' but misses '+target.name+' ('+roll+' + '+bonus+').'+(skill?' ['+Math.max(0,skill.uses-uses[actor.id])+'/'+skill.uses+' remaining]':''));}
 }
 paintBattle();await delay(280);if(token!==epoch||!battle)return;
 if(!livingEnemy()){const kind=battle.kind;battle=null;$('battle').hidden=true;$('character').disabled=false;if(kind.startsWith('church_')){updateObjective();paintParty();run(()=>ChurchArc.afterBattle(kind));return;}if(['ovinnik','execution'].includes(kind)){updateObjective();paintParty();run(()=>PoliticalMovement.afterBattle(kind));return;}if(['bolgart','wereboar'].includes(kind)){updateObjective();paintParty();run(()=>LastStand.afterBattle(kind));return;}if(kind==='deputies'){updateObjective();paintParty();run(()=>window.NextArc.afterBattle());return;}quest.victory=true;updateObjective();paintParty();save();run(async()=>{await say(null,'Viggo is dead at his own altar.');await say('freya','Clean. Now the rapier.');});return;}
 battle.turn++;
 while(battle.turn<units.length&&(hp[units[battle.turn].id]<=0||(battle.paralyzed===units[battle.turn].id&&battle.round===1)))battle.turn++;
 if(battle.turn>=units.length){await ChurchArc.support();log(battle.kind==='deputies'?'The former deputies strike back.':battle.kind==='ovinnik'?'The guardian lashes out.':battle.kind==='execution'?'The attackers press forward.':battle.kind==='wereboar'?'Bolgart charges with tusks and brute force.':battle.kind==='bolgart'?'Bolgart fights back.':'The faithful strike back.');for(const enemy of battle.enemies.filter(e=>e.hp>0)){await enemyStrike(enemy,token);if(token!==epoch||!battle)return;if(units.every(u=>hp[u.id]<=0)){battle=null;$('battle').hidden=true;$('character').disabled=false;run(()=>fail(quest.chapter6?'The party is overwhelmed. Return to the checkpoint before this encounter.':scene==='longacre_jail'?'The former deputies overwhelm the party. Return to the checkpoint before their ambush.':'The hidden temple keeps your names. Try the encounter again.'));return;}}
 units.forEach(u=>u.guard=false);battle.round++;if(battle.paralyzed&&battle.round===2){battle.paralyzed=null;log('J’Mal shakes off the paralysis and rejoins the fight.');}battle.turn=0;battle.smoke=Math.max(0,battle.smoke-1);battle.enemies.forEach(e=>e.shaken=Math.max(0,(e.shaken||0)-1));planEnemyRound();
 }
 battle.busy=false;paintBattle();
}
async function enemyStrike(enemy,token){
 if(!battle||token!==epoch)return;
 if(!enemy.intent)planEnemyRound();
 const intent=enemy.intent,target=units.find(u=>u.id===intent?.target);
 // Keep the announced target: a fallen target costs the enemy this action.
 if(!target||hp[target.id]<=0){log(enemy.name+' loses the opening; the intended target is down.');return;}
 await window.ChurchArc?.enemyPreparation?.(enemy);if(token!==epoch||!battle)return;
 const penalty=(battle.smoke?4:0)+(enemy.shaken?2:0),bonus=STATS[enemy.id].atk-penalty,ac=combatAC(target.id)+(target.guard?4:0),total=await rollDice(enemy.name+' · '+intent.move+' → '+NAMES[target.id],20,1,bonus,'AC '+ac),roll=total-bonus;
 if(token!==epoch||!battle)return;
 if(roll===20||roll!==1&&total>=ac){const rolled=await damage(STATS[enemy.id].dmg,enemy.name+' · Damage'),raw=rolled+intent.extra,value=EnemyTactics.damage(raw,target.guard);await animateAction(enemy,target,'attack',true,()=>{hp[target.id]=Math.max(0,hp[target.id]-value);GameAudio.effect('hit');flash(target,'−'+value,'#ee9a88');});log(enemy.name+' uses '+intent.move+' on '+NAMES[target.id]+': '+value+' damage.'+(target.guard?' Guard absorbs '+(raw-value)+'.':''));}else{await animateAction(enemy,target,'attack',false);flash(target,'MISS','#bfc1d1');log(enemy.name+' misses '+NAMES[target.id]+(target.guard?'’s guard.':'.'));}paintParty();await delay(220);
}
async function fail(text){await say('Defeat',text);const c=await say(null,'Return to the last checkpoint?',['[Retry the encounter]','[Restart the chapter]']);if(c===0)reset(true);else reset();}
function stepUnit(u,gx,gy){if(!passable(gx,gy))return false;const tx=gx*T+8,ty=gy*T+8,dx=tx-u.x,dy=ty-u.y;u.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';u.step={sx:u.x,sy:u.y,tx,ty,p:0};return true;}
function advance(u,dt,speed){if(!u.step)return false;u.step.p=Math.min(1,u.step.p+dt*speed);u.x=u.step.sx+(u.step.tx-u.step.sx)*u.step.p;u.y=u.step.sy+(u.step.ty-u.step.sy)*u.step.p;u.anim+=dt;if(u.step.p>=1){u.x=u.step.tx;u.y=u.step.ty;u.step=null;return true;}return false;}
function walkTo(gx,gy){if(!ready||introOpen||journeyOpen||levelOpen||dialogOpen||taskBusy||battle||finished())return;const u=units[0],from=u.step?cell(u.step.tx,u.step.ty):cell(u.x,u.y),p=findPath(from,[gx,gy]);if(p){path=p;return true;}return false;}
function beginWalkTap(d){if(!ready||introOpen||journeyOpen||levelOpen||dialogOpen||taskBusy||battle||finished()||!DIR[d]||units[0].step)return false;const u=units[0],a=cell(u.x,u.y),v=DIR[d];path=[];u.dir=d;return stepUnit(u,a[0]+v[0],a[1]+v[1]);}
function update(dt){if(Handheld.isOpen()||$('save-import-dialog').open)return;if(ready&&!introOpen&&!journeyOpen&&!levelOpen&&!briefingOpen&&!dialogOpen&&!taskBusy&&!battle)updateCitizens(dt);
 for(const u of units){u.flash=Math.max(0,(u.flash||0)-dt);u.lunge=Math.max(0,(u.lunge||0)-dt);}for(const e of battle?.enemies||[]){e.flash=Math.max(0,(e.flash||0)-dt);e.lunge=Math.max(0,(e.lunge||0)-dt);}
 fx=fx.filter(f=>(f.life-=dt)>0);if(!ready||introOpen||journeyOpen||levelOpen||dialogOpen||taskBusy||battle||finished())return;
 const u=units[0],speed=keys.has('run')?8:5;
 if(u.step){if(advance(u,dt,speed)){trail.unshift(cell(u.x,u.y));trail=trail.slice(0,64);}}
 else{const d=['up','down','left','right'].find(d=>keys.has(d));if(d){path=[];const a=cell(u.x,u.y),v=DIR[d];u.dir=d;stepUnit(u,a[0]+v[0],a[1]+v[1]);}else if(path.length){const to=path.shift();stepUnit(u,...to);}}
 for(let i=1;i<units.length;i++){const f=units[i];if(f.step)advance(f,dt,speed);else{const desired=trail[Math.min(i*2,trail.length-1)],from=cell(f.x,f.y);if(desired&&(from[0]!==desired[0]||from[1]!==desired[1])){const p=findPath(from,desired);if(p?.length)stepUnit(f,...p[0]);}}}
 const p=nearPoint();$('prompt').hidden=!p;if(p)$('prompt').textContent='E · '+p.label;
}
function drawActor(g,u,height=55){
 g.imageSmoothingEnabled=false;
 const meta=window.PARTY_FRAMES[u.id];let im=sheets[u.id];if(!im)return;
 const row=u.dir==='up'?2:u.dir==='down'?0:1,col=u.step?meta.walkCycle[Math.floor(u.anim*10)%4]:0,f=col===3?meta.oppositeStep.frames[row]:meta.frames[row*3+col],scale=height/(f.scaleBasis||meta.maxHeight);if(col===3)im=sheets[u.id+'-opposite'];
 const x=Math.round(u.x),y=Math.round(u.y);g.fillStyle='#02060c66';g.fillRect(x-8,y-2,16,4);g.save();g.translate(x,y+2-(u.lunge?Math.sin(u.lunge/.22*Math.PI)*5:0));if(u.dir==='left')g.scale(-1,1);if(hp[u.id]===0)g.globalAlpha=.38;
 g.drawImage(im,f.x,f.y,f.w,f.h,Math.round((f.x-f.anchorX)*scale),-Math.round(f.h*scale),Math.round(f.w*scale),Math.round(f.h*scale));g.restore();
}
function drawNPC(u){if(u.hp!==undefined&&u.hp<=0){ctx.save();ctx.globalAlpha=.65;ctx.translate(u.x,u.y);ctx.rotate(-Math.PI/2);drawNPC({...u,x:0,y:0,hp:undefined});ctx.restore();return;}if(u.id==='reese'){drawActor(ctx,{...u,dir:'up',step:null,anim:0},55);return;}if(u.pose==='stocks'&&art.bolgartStocks){const im=art.bolgartStocks;ctx.drawImage(im,104,137,1046,1100,u.x-35,u.y-74,70,74);return;}
 if(u.id.startsWith('citizen-')||u.id.startsWith('execution-citizen-')){drawCitizen(u);return;}
 if(PoliticalMovement.drawNPC(u))return;
 if(window.NextArc.drawNPC(u))return;
 if(window.NextChapter.drawNPC(u))return;
 if(u.id==='guard'){const im=art.guard;ctx.drawImage(im,u.x-17,u.y-54,34,56);return;}
 const f=window.CHAPTER_NPCS[u.id],im=art.npcs,scale=55/f.h;ctx.save();
 ctx.drawImage(im,f.x,f.y,f.w,f.h,Math.round(u.x-f.w*scale/2),Math.round(u.y-55),Math.round(f.w*scale),55);ctx.restore();
 if(battle&&u.hp>0){rect(u.x-16,u.y-64,32,3,'#151522');rect(u.x-16,u.y-64,Math.max(0,32*u.hp/u.max),3,'#c46652');}
}
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
function buildFlicker(){if(!art[scene])return;const a=document.createElement('canvas');a.width=640;a.height=400;const g=a.getContext('2d',{willReadFrequently:true});g.imageSmoothingEnabled=false;g.drawImage(art[scene],0,0,640,400);let pixels;try{pixels=g.getImageData(0,0,640,400).data;}catch{}flicker=scenes[scene].lights.map(([x,y],index)=>{const mask=document.createElement('canvas');mask.width=33;mask.height=49;const mg=mask.getContext('2d'),d=mg.createImageData(33,49);for(let yy=0;yy<49;yy++)for(let xx=0;xx<33;xx++){const wx=x-16+xx,wy=y-24+yy,dist=((xx-16)/16)**2+((yy-24)/24)**2,i=(wy*640+wx)*4;if(dist>=1||wx<0||wy<0||wx>=640||wy>=400)continue;const r=pixels?pixels[i]:200,green=pixels?pixels[i+1]:130,b=pixels?pixels[i+2]:65;if(r>125&&green>65&&r>green*1.12&&green>b*1.2)d.data[(yy*33+xx)*4+3]=Math.round(255*Math.min(1,(r-110)/120)*(pixels?Math.sqrt(1-dist):(1-dist)**2*.55));}mg.putImageData(d,0,0);return {mask,x:x-16,y:y-24,index};});}
function render(t){if(!journeyOpen&&!taskBusy)$('journey').hidden=true;GameAudio.tick();t=Handheld.time(t);$('pause-toggle').hidden=!ready||introOpen||dialogOpen||journeyOpen||levelOpen||briefingOpen||taskBusy;
 $('quest-task').hidden=!ready||introOpen||briefingOpen||journeyOpen||levelOpen||!!battle;
 rect(0,0,640,canvas.height,'#0b1018');if(ready&&TitleScreen.draw(ctx,t))return;if(!ready||introOpen)return;if(battle){renderBattle(t);return;}ctx.save();ctx.translate(0,SCREEN.mapTop);try{if(briefingOpen){renderBriefing(t);return;}window.SceneLayers.draw(ctx,window.MAP_LAYERS[scene],ChurchArc.mapImage(),t,{reduced:reduce.matches,top:-SCREEN.mapTop,bottom:SCREEN.height-SCREEN.mapTop});
 drawBellRope();
 if(!reduce.matches){ctx.save();for(const l of flicker){ctx.globalAlpha=.095+.035*Math.sin(t*1.7+l.index*2.4)+.021*Math.sin(t*3.1+l.index*4.1);ctx.drawImage(l.mask,l.x,l.y);}ctx.restore();if(scene!=='street')for(let i=0;i<scenes[scene].lights.length;i++){const [x,y]=scenes[scene].lights[i];if((Math.floor(t*7)+i)%3===0)rect(x,y-2,1,2,'#fbd29388');}}
 if(scene==='street'&&!reduce.matches){for(let i=0;i<30;i++){const p=(t*.05+i*.177)%1,x=(i*71+t*(2+i%3))%640,y=30+p*90;rect(x,y,2,1,'#b8aa9044');}}
 if(showPaths){ctx.fillStyle='#83bdb23b';for(let y=0;y<25;y++)for(let x=0;x<40;x++)if(passable(x,y))ctx.fillRect(x*T+1,y*T+1,14,14);}
 if(path.length){ctx.fillStyle='#d9b86a77';path.forEach(([x,y])=>ctx.fillRect(x*T+7,y*T+7,2,2));}
 const npcs=ChurchArc.npcs()||PoliticalMovement.npcs()||DebtsRumors.npcs()||LastStand.npcs()||(quest.chapter3?window.NextArc.npcs():quest.chapter2?window.NextChapter.npcs():scene==='street'?[{id:'guard',x:472,y:184}]:scene==='tavern'?[{id:'cultist',x:264,y:120}]:battle?battle.enemies:quest.victory?[{id:'viggo',x:312,y:136,hp:0}]:[{id:'viggo',x:312,y:136}]);
 const drawables=[...units.filter(u=>(!battle||hp[u.id]>0)&&!(PoliticalMovement.mountedVisible()&&u.id==='freya')),...npcs,...townsfolk()].sort((a,b)=>a.y-b.y);
 for(const u of drawables){if(CORE.includes(u.id))drawActor(ctx,u);else drawNPC(u);}
 const guide=QuestGuide.current();if($('quest-task-text').textContent!==guide.text)$('quest-task-text').textContent=guide.text;
 if(scene==='church_watch'&&quest.watchStarted||scene==='execution_square'){ctx.fillStyle='#121a3c55';ctx.fillRect(0,0,640,400);}
 if(!finished()&&guide.target){const rawTarget=guide.target,speaker=({missingRemains:'loyal_deputy',allamarFight:'allamar',assassinBoon:'mantis_master',churchConfront:'allamar',cimriAccount:'cimri',executionOrders:'fex',arrestBo:'bo_gramel',doctorTalk:'gerya',ingoeTalk:'ingoe',sermon:'allamar',razelago:'razelago',fexAudience:'fex',jailDecree:'rhona',owner:'owner',cimri:'cimri',guard:'guard',barkeep:'cultist',altar:'viggo'})[rawTarget.id],actor=npcs.find(n=>n.id===speaker),target=actor?{x:actor.x,y:actor.y-(speaker==='fex'?62:55)+41}:rawTarget,lift=reduce.matches?0:Math.round(Math.sin(t*2.5)*2),y=target.y-53+lift;ctx.save();ctx.globalAlpha=.8;ctx.fillStyle='#f2cf7e';ctx.strokeStyle='#31202a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(target.x,y-9);ctx.lineTo(target.x+9,y);ctx.lineTo(target.x,y+10);ctx.lineTo(target.x-9,y);ctx.closePath();ctx.fill();ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle='#492a2a';ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.beginPath();ctx.moveTo(target.x,y-5);ctx.lineTo(target.x+4,y);ctx.lineTo(target.x,y+5);ctx.lineTo(target.x-4,y);ctx.closePath();ctx.fill();ctx.restore();}

 if(quest.burned&&scene==='tavern'){ctx.fillStyle='rgba(80,55,38,.1)';ctx.fillRect(0,0,640,400);if(!reduce.matches)for(let i=0;i<12;i++){const y=350-(t*35+i*47)%320,x=490+Math.sin(i+t)*60;rect(x,y,1,2,'#ffb97377');}}
 for(const f of fx){ctx.save();ctx.globalAlpha=Math.min(1,f.life*2);ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.lineWidth=3;const y=f.y-(.9-f.life)*18;ctx.strokeStyle='#0b1018';ctx.strokeText(f.text,f.x,y);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,y);ctx.restore();}
 const currentPrompt=nearPoint();$('prompt').hidden=dialogOpen||!!battle||taskBusy||finished()||!currentPrompt;if(currentPrompt)$('prompt').textContent='E · '+currentPrompt.label;
}finally{ctx.restore();}
}
$('combat-target').onchange=e=>{if(battle&&!battle.busy){battle.target=Number(e.target.value);paintBattle();}};
$('close').onclick=()=>finishDialog();$('reset').onclick=()=>reset();$('retry').onclick=()=>reset(true);
$('paths').onclick=()=>{showPaths=!showPaths;$('paths').textContent=showPaths?'Hide paths':'Show paths';$('paths').setAttribute('aria-pressed',String(showPaths));};
$('interact').onclick=interact;
$('heal-target').onclick=()=>{if(!battle||battle.busy)return;cycleCombatTarget('ally',1);paintBattle();};
$('character').onchange=e=>{if(battle||taskBusy||dialogOpen){e.target.value=lead;return;}const old=lead;if(units[0].step){units[0].x=units[0].step.sx;units[0].y=units[0].step.sy;}lead=e.target.value;const displaced=units.find(u=>u.id===lead);if(displaced)displaced.id=old;units[0].id=lead;units[0].step=null;path=[];keys.clear();paintParty();save();canvas.focus();};
document.addEventListener('keydown',e=>{if(e.repeat&&dialogOpen&&['Enter',' ','e','E','Escape','b','B'].includes(e.key)){e.preventDefault();return;}if(Handheld.importKey(e)||TitleScreen.key(e)||Handheld.key(e)||Handheld.dialogKey(e))return;
 if(!introOpen&&!levelOpen&&!journeyOpen&&!dialogOpen&&(e.key.toLowerCase()==='p'||['Escape','b','B'].includes(e.key)&&(!battle||battle.control?.mode==='commands'))){e.preventDefault();if(!e.repeat)Handheld.show();return;}
 if(levelOpen){e.preventDefault();if(['Enter',' ','e','E'].includes(e.key)&&!e.repeat)$('level-continue').click();else if(e.key==='Tab')$('level-continue').focus();return;}
 if(journeyOpen){e.preventDefault();if(['Enter',' ','e','E'].includes(e.key)&&!e.repeat)$('journey-continue').click();else if(e.key==='Tab')$('journey-continue').focus();return;}
 if(introOpen){const d=KEY[e.key],actions=[$('intro-start'),$('intro-resume'),$('intro-import')].filter(b=>!b.hidden&&!b.disabled);if(['left','right'].includes(d)){e.preventDefault();introIndex=(introIndex+(d==='left'?-1:1)+ROSTER.length)%ROSTER.length;paintIntro();}else if(['up','down'].includes(d)){e.preventDefault();Handheld.navigate(actions,d,1);}else if(['Enter','e','E',' '].includes(e.key)){e.preventDefault();if(!e.repeat)(actions.includes(document.activeElement)?document.activeElement:$('intro-start')).click();}else if(['b','B','Escape'].includes(e.key)){e.preventDefault();if(!TitleScreen.backFromSelection())$('intro-start').focus();}return;}
 if(battle&&!dialogOpen&&!['INPUT','TEXTAREA'].includes(e.target.tagName)&&handleCombatKey(e))return;
 if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
 const menu=dialogOpen&&$('choices').children.length?$('choices'):battle&&!battle.busy?$('actions'):null;
 if(menu&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const buttons=Array.from(menu.querySelectorAll('button')).filter(b=>!b.disabled),index=buttons.indexOf(document.activeElement),delta={ArrowUp:-2,ArrowDown:2,ArrowLeft:-1,ArrowRight:1}[e.key];buttons[index<0?0:(index+delta+buttons.length*2)%buttons.length]?.focus();return;}
 if(dialogOpen){if(['Escape','Enter',' '].includes(e.key)&&!$('close').hidden){e.preventDefault();finishDialog();}if(/^[1-9]$/.test(e.key)){const b=$('choices').children[Number(e.key)-1];if(b){e.preventDefault();b.click();}}if(e.key==='Tab'){e.preventDefault();const focusable=Array.from($('dialog').querySelectorAll('button')).filter(b=>!b.hidden);const index=focusable.indexOf(document.activeElement),next=(index+(e.shiftKey?-1:1)+focusable.length)%focusable.length;focusable[next]?.focus();}return;}
 if(KEY[e.key]){e.preventDefault();if(!battle&&!taskBusy){keys.add(KEY[e.key]);if(!e.repeat)beginWalkTap(KEY[e.key]);}}
 else if(['e','E','Enter',' '].includes(e.key)&&e.target.tagName!=='BUTTON'){e.preventDefault();if(!e.repeat)interact();}
 else if(battle&&/^[1-9]$/.test(e.key)){const b=$('actions').children[Number(e.key)-1];if(b&&!b.disabled)b.click();}
});
document.addEventListener('keyup',e=>keys.delete(KEY[e.key]));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{keys.clear();last=0;});
document.querySelectorAll('[data-dir]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(!dialogOpen&&!battle&&!taskBusy)keys.add(b.dataset.dir);};for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.dir));});
canvas.onpointerdown=e=>{if(Handheld.isOpen()||!ready||introOpen||journeyOpen||levelOpen||dialogOpen||taskBusy||finished())return;canvas.focus();const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*640/r.width,y=(e.clientY-r.top)*SCREEN.height/r.height-(battle?0:SCREEN.mapTop);if(battle){if(battle.busy)return;const i=battle.enemies.findIndex(a=>{const v=battlePosition(a);return a.hp>0&&Math.abs(x-v.x)<35&&y>v.y-v.height-22&&y<v.y+8;});if(i>=0){battle.target=i;if(battle.control?.mode==='enemy')performAction(battle.control.action);else paintBattle();}else{const ally=units.find(a=>{const v=battlePosition(a);return Math.abs(x-v.x)<44&&y>v.y-v.height&&y<v.y+38;});if(ally){battle.ally=ally.id;if(battle.control?.mode==='ally')performAction(battle.control.action);else paintBattle();}}return;}const object=visiblePoints().find(p=>Math.hypot(x-p.x,y-p.y)<25);if(object){if(Math.hypot(units[0].x-object.x,units[0].y-object.y)<INTERACTION_RADIUS&&!units[0].step){interact(object.id);return;}const candidates=[];for(let gy=0;gy<25;gy++)for(let gx=0;gx<40;gx++)if(passable(gx,gy)&&Math.hypot(gx*T+8-object.x,gy*T+8-object.y)<INTERACTION_RADIUS)candidates.push([gx,gy]);candidates.sort((a,b)=>Math.hypot(a[0]*T+8-units[0].x,a[1]*T+8-units[0].y)-Math.hypot(b[0]*T+8-units[0].x,b[1]*T+8-units[0].y));for(const c of candidates)if(walkTo(...c))return;}else walkTo(...cell(x,y));};
const citizenCache=new Map(),CITIZEN_FRAMES=[{"frames":[{"x":96,"y":27,"w":137,"h":256},{"x":96,"y":307,"w":136,"h":260},{"x":96,"y":582,"w":137,"h":255},{"x":95,"y":852,"w":141,"h":247},{"x":120,"y":1113,"w":89,"h":259}],"maxHeight":260},{"frames":[{"x":365,"y":30,"w":117,"h":254},{"x":370,"y":306,"w":116,"h":261},{"x":367,"y":580,"w":118,"h":259},{"x":369,"y":854,"w":114,"h":247},{"x":370,"y":1118,"w":102,"h":254}],"maxHeight":261},{"frames":[{"x":623,"y":23,"w":129,"h":261},{"x":620,"y":300,"w":131,"h":270},{"x":624,"y":578,"w":133,"h":261},{"x":625,"y":851,"w":130,"h":257},{"x":644,"y":1113,"w":82,"h":263}],"maxHeight":270},{"frames":[{"x":896,"y":32,"w":118,"h":251},{"x":897,"y":310,"w":118,"h":259},{"x":899,"y":584,"w":124,"h":255},{"x":902,"y":854,"w":114,"h":247},{"x":903,"y":1119,"w":99,"h":253}],"maxHeight":259}];
function townsfolk(){if(scene==='execution_square')return PoliticalMovement.crowd();
 const plans={street:[[384,184],[424,184]],remesiana:[[280,184],[328,216],[168,232]],longacre_jail:[[232,280],[440,296]],last_stand:quest.bolgartSubdued?[]:[[200,256],[456,232],[240,288]],longacre_square:quest.sermonDispersed?[[200,280],[472,312],[376,296]]:[[192,224],[240,232],[288,248],[344,248],[392,232],[448,224],[208,280],[424,288]]};
 if(!plans[scene]?.length)return [];const key=scene+':'+(scene==='longacre_square'&&!quest.sermonDispersed?'crowd':'quiet');
 if(!citizenCache.has(key))citizenCache.set(key,plans[scene].map(([x,y],i)=>({id:'citizen-'+scene+'-'+i,x,y,homeX:x,homeY:y,dir:key.endsWith('crowd')?'up':'down',variant:i%4,crowd:key.endsWith('crowd'),wait:6+i*2,step:null,anim:0})));
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
 if(!art.citizens)return;const meta=CITIZEN_FRAMES[u.variant],row=u.dir==='up'?3:['left','right'].includes(u.dir)?4:u.step?1+Math.floor(u.anim*2)%2:0,f=meta.frames[row],scale=43/meta.maxHeight;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(u.x),Math.round(u.y));if(u.dir==='left')ctx.scale(-1,1);ctx.drawImage(art.citizens,f.x,f.y,f.w,f.h,Math.round(-f.w*scale/2),-Math.round(f.h*scale),Math.round(f.w*scale),Math.round(f.h*scale));ctx.restore();
}
const REPLAY_BACKUP=SAVE+'-before-section-replay';
function replaySections(){
 const q={briefed:false},list=[];
 const add=(id,name,map,position,flags='')=>{for(const k of flags.split(' ').filter(Boolean))q[k]=true;list.push({id,name,scene:map,position,quest:structuredClone(q)});};
 add('mission','01 · The mission orders','street',[312,248]);q.briefed=true;
 add('streets','02 · Kintargo streets','street',[312,248]);add('tavern','03 · The Silver Star','tavern',[312,280],'entered');add('temple','04 · Viggo’s temple','temple',[312,312],'ropeCut');
 add('ship','05 · The Western Star','western_star',[360,248],'victory scimitar planted burned done chapter2');q.scimitarDisposed=true;add('market','06 · Remesiana harbor','remesiana',[520,280]);
 add('tannery','07 · J’Mal scouts the tannery','tannery',[136,280],'supplied metCimri guapoAway');q.activeRoster=OPENING_ROSTER.filter(id=>id!=='guapo');list.at(-1).quest=structuredClone(q);
 add('employer','08 · Ash House employer','ash_house',[328,328],'scouted ownerDeal payroll');q.goldReward=100;add('rest','09 · Rest at Ash House','ash_house',[328,296],'reward');add('bath','10 · The upstairs bath','bathroom',[328,328],'rested');
 add('sermon','11 · Allamar’s sermon','longacre_square',[328,296],'bathStarted jamalRescued spiritCalmed chapter2Complete chapter3');
 add('decrees','12 · Posting the decrees','ash_house',[328,296],'sermonDispersed decreesIssued');add('dismissal','13 · Rhona’s dismissal','longacre_jail',[328,312],'noticePosted tavernPosted gatePosted');add('ambush','14 · Former deputies’ ambush','longacre_jail',[328,312],'jailPosted rhonaDismissed');
 add('compact','15 · The Hellfire Compact','scarlet_manor',[328,312],'deputiesDefeated deputiesReported');add('last-stand','16 · The Last Stand','scarlet_manor',[328,312],'compactSworn chapter3Complete');add('hospice','17 · Gerya’s intercepted letter','rohalendi_hospice',[328,344],'chapter4 bolgartSubdued rileyCaptured prisonersJailed rileyQuestioned');add('hill','18 · The predawn hill search','angel_hill',[328,344],'doctorAlliance churchEntered churchDoorsRepaired');add('debts','19 · Ingoe’s dockside rumors','ash_house',[328,296],'hillSearched bolgartSecured chapter4Complete');add('movement','20 · Political Movement','ash_house',[328,296],'chapter5 doctorAlliance churchEntered churchDoorsRepaired ingoeAgreement chapter5Complete');q.guapoReturned=true;q.guapoAway=false;q.activeRoster=[...CORE];add('church-watch','21 · Church standoff and watch','ash_house',[328,296],'chapter6 gateOpened ovinnikSubdued ovinnikReported');add('jailbreak','22 · Jailbreak investigation','escape_jail',[328,312],'churchStandoff watchStarted jailbreakHeard');add('execution','23 · Dusk execution','execution_square',[328,296],'jailbreakInspected escapeTrailLost bolgartReleased executionOrdered boCaptured');add('missing-dead','24 · The missing dead','execution_square',[328,296],'executionPrepared boExecuted executionResolved chapter6Complete');add('church-breach','25 · The church breach','church_approach',[328,312],'chapter7 bodiesMissing churchTrail');add('church-entry','26 · The entrance defenders','church_entry',[328,312],'churchBreach churchLoadout');add('church-hall','27 · The Allamar twins','church_hall',[328,312],'entryCleared');add('church-ritual','28 · Riley’s resurrection','church_sanctuary',[328,312],'hallCleared');add('church-final','29 · Allamar’s final stand','church_sanctuary',[328,312],'resurrectionBroken sanctuaryCleared');add('church-altar','30 · The imprisoned assassin','church_ruins',[328,312],'allamarDefeated ghastDestroyed');add('mantis-training','31 · J’Mal’s training','mantis_training',[328,312],'altarBroken assassinKnowledge');add('church-conversion','32 · The new pastor','church_asmodeus',[328,312],'mantisTraining');return list;
}
function replayAllowed(){return ready&&!introOpen&&!dialogOpen&&!battle&&!taskBusy&&!journeyOpen&&!levelOpen;}
function installSectionReplay(){
 for(const section of replaySections()){const o=document.createElement('option');o.value=section.id;o.textContent=section.name;$('section-replay').append(o);}
 $('section-restore').hidden=!localStorage.getItem(REPLAY_BACKUP);
 $('section-go').onclick=()=>{if(!replayAllowed()){$('save-file-status').textContent='Finish the conversation, journey or fight before replaying a section.';return;}
 const section=replaySections().find(x=>x.id===$('section-replay').value),q=section.quest,p=Progression.migrate(q),chosen=(q.guapoAway&&lead==='guapo'||lead==='reese'&&!q.chapter3Complete)?'freya':lead;
 const checkpoint=SaveFiles.validate({version:2,scene:section.scene,position:{x:section.position[0],y:section.position[1]},lead:chosen,quest:q,progression:p,hp:Object.fromEntries(CORE.map(id=>[id,Progression.stats(BASE_STATS[id],id,p.levels[id]).hp])),uses:Object.fromEntries(CORE.map(id=>[id,0])),potions:2,mendUses:2});
 save();if(!localStorage.getItem(REPLAY_BACKUP))localStorage.setItem(REPLAY_BACKUP,localStorage.getItem(SAVE));localStorage.setItem(SAVE,JSON.stringify(checkpoint));reset(true);$('section-restore').hidden=false;$('save-file-status').textContent='Replaying '+section.name+'. Your previous progress is preserved.';
 };
 $('section-restore').onclick=()=>{if(!replayAllowed()){$('save-file-status').textContent='Finish the current conversation or fight first.';return;}const raw=localStorage.getItem(REPLAY_BACKUP);if(!raw)return;SaveFiles.decode(raw);localStorage.setItem(SAVE,raw);localStorage.removeItem(REPLAY_BACKUP);reset(true);$('section-restore').hidden=true;$('save-file-status').textContent='Your previous progress is restored.';};
}
function imageLoad(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Could not load '+src));im.src='art-test/'+src;});}
async function load(){
 try{art.briefingRoom=await imageLoad('kintargo-briefing-v1.png');art.citizens=await imageLoad('townsfolk-sheet-v1.png');const values=await Promise.all(['kintargo-map.png','silver-star-music-shop-v2.png','chapter-temple.png','chapter-npcs.png','dottari.png'].map(imageLoad));[art.street,art.tavern,art.temple,art.npcs,art.guard]=values;await Promise.all([...new Set(Object.values(LORE_CAST).map(m=>m.src))].map(async src=>art[src]=await imageLoad(src)));await CombatArt.load(imageLoad);await LastStand.load(imageLoad);await DebtsRumors.load(imageLoad);await PoliticalMovement.load(imageLoad);await ChurchArc.load(imageLoad);await window.NextChapter.load(imageLoad);await window.NextArc.load(imageLoad);await Promise.all([...new Set(Object.values(window.COMBAT_IDLES).map(m=>m.src))].map(async src=>art[src]=await imageLoad(src)));await Promise.all(ROSTER.map(async id=>{sheets[id]=await imageLoad(PARTY_FRAMES[id].src||id+'-sheet.png');sheets[id+'-opposite']=await imageLoad(window.PARTY_FRAMES[id].oppositeStep.src);}));await Promise.all(Object.entries(window.QUESTGIVER_MODELS).map(async([id,m])=>art[id]=await imageLoad(m.src)));await Promise.all(['reese','bruce'].map(async id=>art[id+'-portrait']=await imageLoad(id==='reese'?'reese-early-portrait.png':id+'-foundry-portrait.webp')));await TitleScreen.load(imageLoad);ready=true;$('loading').hidden=true;TitleScreen.show();}
 catch(e){console.error(e);$('loadingText').textContent='The chapter art could not load. Keep this HTML beside its art-test folder.';$('load-retry').hidden=false;}
}
$('load-retry').onclick=load;
function loop(now){const dt=last?Math.min((now-last)/1000,.05):0;last=now;update(dt);render(now/1000);requestAnimationFrame(loop);}
window.__chapter={state:()=>({title:TitleScreen.state(),ready,introOpen,briefingOpen,journeyOpen,levelOpen,progression:structuredClone(progression),scene,lead,quest:{...quest},hp:{...hp},potions,uses:{...uses},mendUses,interaction:nearPoint()?.id,guide:window.QuestGuide.current(),dialogOpen,taskBusy,party:units.map(u=>({id:u.id,x:u.x,y:u.y,dir:u.dir,moving:!!u.step})),pathLength:path.length,battle:battle?{round:battle.round,turn:battle.turn,actor:activeUnit()?.id,busy:battle.busy,enemies:battle.enemies.map(e=>({name:e.name,hp:e.hp})),smoke:battle.smoke}:null}),passable,findPath};
window.NextChapter.install();window.NextArc.install();LastStand.install();DebtsRumors.install();PoliticalMovement.install();ChurchArc.install();window.SaveFiles.install({scenes,core:CORE,stats:BASE_STATS,special:BASE_SPECIAL,names:NAMES,key:SAVE,read:readSave,capture:save,safeToCapture:()=>ready&&!introOpen&&!battle&&!dialogOpen&&!taskBusy,canImport:()=>ready&&!battle&&!dialogOpen&&!taskBusy,resume:()=>reset(true)});installSectionReplay();Handheld.install();TitleScreen.install();GameAudio.install();load();requestAnimationFrame(loop);
