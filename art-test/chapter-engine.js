'use strict';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d'),T=16,COLS=40,ROWS=25;
ctx.imageSmoothingEnabled=false;
const CORE=['freya','jamal','jason','draymus','guapo'],NAMES={freya:'Freya',jamal:'Jamal',jason:'Jason',draymus:'Draymus',guapo:'El Guapo',barzillai:'Barzillai Thrune',fex:'Archbaron Darellus Fex',viggo:'Viggo',cultist:'Zealot'};
const STATS={freya:{hp:38,ac:17,atk:6,dmg:[1,10,4]},jamal:{hp:30,ac:16,atk:7,dmg:[1,4,5]},jason:{hp:32,ac:15,atk:4,dmg:[1,8,2]},draymus:{hp:26,ac:13,atk:3,dmg:[1,4,1]},guapo:{hp:34,ac:15,atk:6,dmg:[1,6,3]},viggo:{hp:34,ac:14,atk:5,dmg:[1,8,2]},cultist:{hp:12,ac:12,atk:3,dmg:[1,6,0]}};
const SPECIAL={freya:{name:'Iaijutsu Strike',uses:1,bonus:2,dmg:[2,10,4]},jamal:{name:'Sneak Attack',uses:2,dmg:[1,4,5]},jason:{name:'Hellfire',uses:2,auto:true,dmg:[2,6,0]},draymus:{name:'Vampiric Touch',uses:3,dmg:[1,6,3],drain:true},guapo:{name:'Throw a Chair',uses:3,auto:true,dmg:[1,8,1]}};
const INTERACTION_RADIUS=56;
const WEAPONS={freya:'katana',jamal:'dagger',jason:'mace',draymus:'dagger',guapo:'rapier'};
const ATTACKS={freya:'slashes with her katana',jamal:'lunges with his dagger',jason:'swings his mace',draymus:'strikes with his dagger',guapo:'thrusts his rapier'};
const SKILL_TEXT={freya:'draws her katana in an Iaijutsu Strike',jamal:'finds an opening for a Sneak Attack',jason:'calls down Hellfire',draymus:'reaches through the veil with Vampiric Touch',guapo:'hurls a chair across the fight'};
const DIR={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]},KEY={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',Shift:'run'};
const scenes={
 street:{name:'Kintargo · Night of Ashes',image:'kintargo-map.png',walk:[{x:240,y:8,w:104,h:296},{x:256,y:304,w:88,h:88},{x:16,y:160,w:560,h:48},{x:576,y:176,w:48,h:16},{x:136,y:136,w:104,h:24}],blocks:[],points:[{id:'silver',x:142,y:132,label:'Enter the Silver Star'},{id:'guard',x:472,y:184,label:'Speak to Dottari'},{id:'ship',x:608,y:184,label:'Board The Western Star'}],lights:[[22,30],[140,27],[19,119],[223,20],[163,62],[122,107],[366,67],[399,114],[474,38],[510,36],[573,117],[581,170],[585,231],[365,230],[351,316],[235,279],[40,298],[171,342]]},
 tavern:{name:'The Silver Star',image:'chapter-tavern.png',walk:[{x:48,y:128,w:544,h:160},{x:256,y:88,w:128,h:296},{x:272,y:112,w:320,h:32}],blocks:[{x:88,y:160,w:120,h:80},{x:424,y:160,w:128,h:80}],points:[{id:'barkeep',x:264,y:120,label:'Speak to barkeep'},{id:'rope',x:584,y:112,label:'Examine bell rope'},{id:'stairs',x:536,y:136,label:'Descend to the temple'},{id:'outside',x:312,y:360,label:'Return to Kintargo'}],lights:[[94,84],[210,84],[228,35],[283,35],[356,35],[410,35],[35,132],[607,132],[153,181],[480,181],[277,330],[368,330]]},
 temple:{name:'Beneath the Silver Star',image:'chapter-temple.png',walk:[{x:48,y:96,w:544,h:224},{x:272,y:320,w:96,h:64}],blocks:[{x:160,y:104,w:56,h:88},{x:424,y:104,w:56,h:88},{x:160,y:216,w:56,h:80},{x:424,y:216,w:56,h:80}],points:[{id:'altar',x:312,y:112,label:'Approach Viggo'},{id:'upstairs',x:312,y:360,label:'Return to the Silver Star'}],lights:[[45,117],[46,198],[256,46],[380,46],[274,62],[366,62],[212,160],[434,160],[212,268],[432,268],[74,300],[566,300],[252,352],[390,352]]}
};
const lines={street:{freya:'Quiet. In and out. Barzillai does not forgive noise.',jamal:'Nice night for it. Door is up there. Try not to kick it in.',jason:'The flames are a blessing. Asmodeus favors the thorough.',draymus:'So many bodies in a fire. Nobody will notice one more going missing.',guapo:'If we die tonight, I want it on record that I was not paid.'},tavern:{freya:'Search the room. Quickly.',jamal:'Trapdoor. Has to be. Check the corners.',jason:'Can you smell the incense? It is under us.',draymus:'The floor creaks differently over there.',guapo:'I will guard the door. From the inside. Near the drinks.'}};
const SAVE='hells-bubbies-night-of-ashes-v1',keys=new Set(),art={},sheets={},CANCEL=Symbol('cancel');
let introOpen=false,introIndex=0,briefingOpen=false;
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
async function rollDice(label,sides,count=1,modifier=0,context=''){
 const token=epoch,values=Array.from({length:count},()=>dice(sides)),total=values.reduce((a,b)=>a+b,modifier),panel=$('dice-panel');
 panel.hidden=false;panel.classList.add('rolling');$('dice-label').textContent=label;$('dice-result').textContent='Rolling…';
 const paint=vals=>$('dice-tray').innerHTML=vals.map(v=>dieMarkup(sides,v)).join('');paint(values);
 let tick=0;const timer=reduce.matches?null:setInterval(()=>{if(token!==epoch){clearInterval(timer);return;}paint(values.map((v,i)=>(v+ ++tick+i)%sides+1));},70);
 await delay(reduce.matches?80:420);if(timer)clearInterval(timer);if(token!==epoch)throw CANCEL;
 paint(values);panel.classList.remove('rolling');$('dice-result').textContent=values.join(' + ')+(modifier?' '+(modifier>0?'+ ':'− ')+Math.abs(modifier):'')+' = '+total+(context?' · '+context:'');
 await delay(reduce.matches?120:330);if(token!==epoch)throw CANCEL;return total;
}
async function damage(spec,label){return rollDice(label,spec[1],spec[0],spec[2]);}
function point(id){return scenes[scene].points.find(p=>p.id===id);}
function actorBlocking(x,y,which=scene){return (which===scene&&quest.chapter2&&window.NextChapter.npcs().some(p=>Math.hypot(x-p.x,y-p.y)<12))||scenes[which].points.some(p=>['guard','barkeep'].includes(p.id)&&Math.hypot(x-p.x,y-p.y)<12);}
function passable(gx,gy,which=scene){if(gx<0||gy<0||gx>=COLS||gy>=ROWS)return false;const x=gx*T+8,y=gy*T+8,s=scenes[which];return s.walk.some(r=>inside(x,y,r))&&!s.blocks.some(r=>inside(x,y,r))&&!actorBlocking(x,y,which);}
function findPath(from,to,which=scene){if(!passable(...from,which)||!passable(...to,which))return null;const q=[from],prev=new Map([[from.join(','),null]]);for(let i=0;i<q.length;i++){const a=q[i],key=a.join(',');if(key===to.join(',')){let k=key,result=[];while(prev.get(k)!==null){result.unshift(k.split(',').map(Number));k=prev.get(k);}return result;}for(const [dx,dy] of Object.values(DIR)){const n=[a[0]+dx,a[1]+dy],k=n.join(',');if(passable(...n,which)&&!prev.has(k)){prev.set(k,key);q.push(n);}}}return null;}
function partyRoster(){return quest.activeRoster||CORE;}
function finished(){return !!quest.chapter2Complete;}
function seedParty(x,y,dir='up'){
 const start=cell(x,y),seen=new Set([start.join(',')]);trail=[start];let cur=start,heading=dir==='up'?'down':'up';
 for(let i=0;i<16;i++){let next=null;for(const d of [heading,'left','right','up','down']){const v=DIR[d],a=[cur[0]+v[0],cur[1]+v[1]];if(passable(...a)&&!seen.has(a.join(','))){next=a;heading=d;break;}}if(!next)break;trail.push(next);seen.add(next.join(','));cur=next;}
 units=[lead,...partyRoster().filter(id=>id!==lead)].map((id,i)=>{const c=trail[Math.min(i*2,trail.length-1)];return {id,x:c[0]*T+8,y:c[1]*T+8,dir,step:null,anim:0};});path=[];keys.clear();
}
function setScene(next,x,y,dir='up'){$('dice-panel').hidden=true;scene=next;seedParty(x,y,dir);buildFlicker();$('location-name').textContent=scenes[next].name;updateObjective();paintParty();save();}
function updateObjective(){
 if(window.NextChapter.objective())return;
 $('objective').textContent=battle?'Defeat Viggo and the zealots.':quest.done?'Seven days to Remesiana.':scene==='street'?(quest.burned?'Board The Western Star before dawn.':'Find the Silver Star.'):scene==='tavern'?(quest.burned?'Return to the street.':quest.ropeCut?'The bell is silent. Find the stairs.':'Find the way down.'):quest.victory?(quest.planted?'Burn the false trail.':'Take the scimitar. Plant the rapier.'):'Approach the altar.';
 $('status').textContent=quest.done?'Chapter complete. Remesiana, then the road to Longacre.':battle?'Choose an enemy, then attack or use an ability. Select a companion to receive healing.':quest.burned?'The temple burns below. Get the party to the harbor.':'WASD / arrows to walk · Shift to run · E to interact · Click to move';
}
function save(){if(battle||!ready||introOpen)return;try{localStorage.setItem(SAVE,JSON.stringify({version:1,scene,lead,quest,hp,uses,potions,mendUses,position:units[0]?{x:units[0].step?.sx||units[0].x,y:units[0].step?.sy||units[0].y}:null}));$('save-status').textContent='Checkpoint saved';}catch{$('save-status').textContent='Checkpoint unavailable';}}
function clearDialog(){const resolve=dialogResolve;dialogResolve=null;dialogOpen=false;$('dialog').hidden=true;keys.clear();if(resolve)resolve(null);}
function say(name,text,choices=null){if(!battle&&name!=='Intimidation')$('dice-panel').hidden=true;const token=epoch;dialogOpen=true;keys.clear();path=[];$('speaker').textContent=name?NAMES[name]||name:'Chronicle';paintPortrait(name);$('line').textContent=text;$('choices').replaceChildren();$('close').hidden=!!choices;$('dialog').hidden=false;$('prompt').hidden=true;
 if(choices)choices.forEach((text,i)=>{const b=document.createElement('button');b.textContent=(i+1)+'. '+text;b.onclick=()=>finishDialog(i);$('choices').append(b);});
 (choices?$('choices').firstChild:$('close')).focus();
 return new Promise(r=>dialogResolve=r).then(v=>{if(token!==epoch)throw CANCEL;return v;});
}
function paintPortrait(name){
 const id=({ 'Freya Kusanagi':'freya','Dottari Guard':'guard','Barkeep':'cultist' })[name]||name,c=$('portrait'),g=c.getContext('2d');let im,f;
 if(window.NEXT_NPCS?.[id]){im=art.nextNPCs;f=window.NEXT_NPCS[id];}
 if(window.QUESTGIVER_MODELS[id]){im=art[id];f=window.QUESTGIVER_MODELS[id].frames[0];}
 else if(CORE.includes(id)){im=sheets[id];f=window.PARTY_FRAMES[id].frames[0];}
 else if(['viggo','cultist'].includes(id)){im=art.npcs;f=window.CHAPTER_NPCS[id];}
 else if(id==='guard'){im=art.guard;f={x:0,y:0,w:im.width,h:im.height};}
 c.hidden=!im;$('dialog').classList.toggle('has-portrait',!!im);if(!im)return;
 g.clearRect(0,0,96,96);g.imageSmoothingEnabled=false;g.fillStyle='#252c35';g.fillRect(0,0,96,96);
 const side=Math.min(f.w,f.h*.32),cx=f.anchorX||f.x+f.w/2;
 g.drawImage(im,Math.max(f.x,Math.min(cx-side/2,f.x+f.w-side)),f.y,side,side,3,3,90,90);
}
function syncBattleView(){const on=!!battle;document.body.classList.toggle('is-combat',on);if(canvas.height!==(on?480:400)){canvas.height=on?480:400;ctx.imageSmoothingEnabled=false;}}
function battlePosition(actor){const partyIndex=units.indexOf(actor);if(partyIndex>=0){const places=[[72,246],[181,225],[290,244],[399,230],[508,244]];return {x:places[partyIndex][0],y:places[partyIndex][1],height:activeUnit()===actor?104:82};}const i=battle?.enemies.indexOf(actor)??0,places=[[346,108],[441,144],[522,110],[588,157]];return {x:places[Math.max(0,i)][0],y:places[Math.max(0,i)][1],height:actor.id==='viggo'?79:65};}
function renderBattle(t){
 window.SceneLayers.draw(ctx,window.MAP_LAYERS.temple,art.temple,t,{height:336,reduced:reduce.matches});ctx.fillStyle='#131a2755';ctx.fillRect(0,0,640,336);if(!reduce.matches){ctx.save();ctx.scale(1,.84);for(const l of flicker){ctx.globalAlpha=.1+.04*Math.sin(t*1.7+l.index*2.4);ctx.drawImage(l.mask,l.x,l.y);}ctx.restore();}
 const platform=(x,y,rx,ry)=>{ctx.fillStyle='#a9a18544';ctx.beginPath();ctx.ellipse(x,y,rx,ry,-.08,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#dccb8b66';ctx.stroke();};platform(470,145,148,35);platform(288,242,282,46);
 for(const enemy of battle.enemies){const v=battlePosition(enemy),f=window.CHAPTER_NPCS[enemy.id],scale=v.height/f.h;ctx.save();ctx.globalAlpha=enemy.hp>0?1:.22;ctx.drawImage(art.npcs,f.x,f.y,f.w,f.h,v.x-f.w*scale/2,v.y-v.height+(enemy.lunge?-5:0),f.w*scale,v.height);ctx.restore();if(enemy.hp>0){const selected=battle.enemies[battle.target]===enemy;rect(v.x-29,v.y-v.height-22,58,18,selected?'#e7d49c':'#e5dfc7');ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillStyle='#222a30';ctx.fillText(enemy.name,v.x,v.y-v.height-10);rect(v.x-27,v.y-v.height-7,54,3,'#39404b');rect(v.x-27,v.y-v.height-7,54*enemy.hp/enemy.max,3,'#9a523f');}}
 const ordered=units.map(u=>({u,v:battlePosition(u)})).sort((a,b)=>a.v.y-b.v.y);
 for(const {u,v} of ordered){if(activeUnit()===u){ctx.strokeStyle='#e4c379';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(v.x,v.y+2,31,7,0,0,Math.PI*2);ctx.stroke();}drawActor(ctx,{...u,x:v.x,y:v.y,dir:'up',step:null},v.height);rect(v.x-44,v.y+8,88,30,battle.ally===u.id?'#f1e4b7':'#e3ddc7');ctx.textAlign='center';ctx.font='bold 11px monospace';ctx.fillStyle='#222a30';ctx.fillText(NAMES[u.id],v.x,v.y+20);ctx.font='10px monospace';ctx.fillText(hp[u.id]+'/'+STATS[u.id].hp,v.x,v.y+31);rect(v.x-41,v.y+35,82,3,'#39404b');rect(v.x-41,v.y+35,82*hp[u.id]/STATS[u.id].hp,3,'#7b925b');}
 for(const f of fx){ctx.font='bold 15px monospace';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#111';ctx.fillStyle=f.color;ctx.strokeText(f.text,f.x,f.y-(.9-f.life)*15);ctx.fillText(f.text,f.x,f.y-(.9-f.life)*15);}
 $('prompt').hidden=true;
}
function finishDialog(value=0){const resolve=dialogResolve;dialogResolve=null;dialogOpen=false;$('dialog').hidden=true;keys.clear();canvas.focus();if(resolve)resolve(value);}
function run(fn){if(taskBusy||battle?.busy)return;taskBusy=true;const token=epoch;Promise.resolve().then(fn).catch(e=>{if(e!==CANCEL){console.error(e);$('status').textContent='The scene could not continue. Restart from the checkpoint.';}}).finally(()=>{if(token===epoch){taskBusy=false;updateObjective();}});}
const ROSTER=[...CORE,'reese','bruce'];
const BIOS={
 freya:{name:'Freya Kusanagi',role:'Half-elf · Samurai',bio:'Composed and deliberate. Freya leads with steel, discipline, and a devastating first strike.',ability:'Iaijutsu · A powerful opening sword strike.'},
 jamal:{name:'Jamal',role:'Hobgoblin · Knife master',bio:'A sharp grin and sharper blades. Jamal exploits openings while smoke keeps the enemy guessing.',ability:'Sneak Attack · Extra damage against a wounded target.'},
 jason:{name:'Jason',role:'Oni-spawn tiefling · Cleric of Asmodeus',bio:'An imposing servant of the Prince of Darkness. Jason brings hellfire and infernal healing to the party.',ability:'Hellfire · Burn foes. Mending · Restore an ally.'},
 draymus:{name:'Draymus Mortiar',role:'Dhampir · Necromancer',bio:'Pale, patient, and fascinated by what death leaves behind. Draymus drains his enemies to sustain himself.',ability:'Vampiric Touch · Deal damage and recover health.'},
 guapo:{name:'El Guapo',role:'Sailor · Swashbuckler',bio:'A seasoned blade with a dry sense of humor. El Guapo fights dirty and keeps one eye on the nearest exit.',ability:'Throw Chair · An unconventional, reliable attack.'},
 reese:{name:'Reese',role:'Later companion · Provisional design',bio:'A hooded archer bearing the Silent Sentry. Race, class, and character details are still awaiting confirmation.',ability:'Joins later in the campaign; not present on the Night of Ashes.'},
 bruce:{name:'Bruce',role:'Later companion · Provisional design',bio:'A broad traveler in slate leather. This appearance is provisional until his character details are confirmed.',ability:'Joins later in the campaign; not present on the Night of Ashes.'}
};
function drawIntroArt(c,id){const g=c.getContext('2d'),f=window.PARTY_FRAMES[id].frames[0];g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;const scale=Math.min(c.width*.85/f.w,c.height*.94/f.h),w=f.w*scale,h=f.h*scale;g.drawImage(sheets[id],f.x,f.y,f.w,f.h,(c.width-w)/2,c.height-h,w,h);}
function paintIntro(){const id=ROSTER[introIndex],bio=BIOS[id];drawIntroArt($('intro-art'),id);$('intro-name').textContent=bio.name;$('intro-role').textContent=bio.role;$('intro-bio').textContent=bio.bio;$('intro-ability').textContent=bio.ability;$('intro-start').disabled=!CORE.includes(id);$('intro-start').textContent=CORE.includes(id)?'Play as '+NAMES[id]:'Joins in a later chapter';Array.from($('intro-roster').children).forEach((b,i)=>b.setAttribute('aria-pressed',String(i===introIndex)));}
function showIntro(){introOpen=true;document.body.classList.add('is-intro');canvas.height=480;ctx.imageSmoothingEnabled=false;$('intro').hidden=false;$('intro-resume').hidden=!readSave();$('intro-roster').replaceChildren();ROSTER.forEach((id,i)=>{const b=document.createElement('button'),c=document.createElement('canvas'),name=document.createElement('span');c.width=110;c.height=130;drawIntroArt(c,id);name.textContent=NAMES[id]||BIOS[id].name;b.append(c,name);b.setAttribute('aria-label',BIOS[id].name+(CORE.includes(id)?'':', joins later'));if(!CORE.includes(id)){const tag=document.createElement('small');tag.textContent='Later';b.append(tag);}b.onclick=()=>{introIndex=i;paintIntro();};$('intro-roster').append(b);});introIndex=Math.max(0,ROSTER.indexOf(lead));paintIntro();$('intro-start').focus();}
function reset(resume=false,selected=null){
 epoch++;briefingOpen=false;$('dice-panel').hidden=true;$('dice-panel').classList.remove('rolling');clearDialog();battle=null;taskBusy=false;fx=[];path=[];keys.clear();$('battle').hidden=true;$('character').disabled=false;syncBattleView();
 if(!resume&&!selected){showIntro();return;}
 introOpen=false;$('intro').hidden=true;document.body.classList.remove('is-intro');canvas.height=400;ctx.imageSmoothingEnabled=false;
 const saved=resume?readSave():null;quest=saved?.quest||{briefed:false,ropeCut:false,bell:false,victory:false,scimitar:false,planted:false,burned:false,done:false};
 hp=saved?.hp||Object.fromEntries(CORE.map(id=>[id,STATS[id].hp]));uses=saved?.uses||Object.fromEntries(CORE.map(id=>[id,0]));potions=saved?.potions??2;mendUses=saved?.mendUses??2;lead=saved?.lead||selected||'freya';$('character').value=lead;
 const next=saved?.scene||'street',spawn=scenes[next].spawn||[312,next==='street'?248:next==='tavern'?280:312];setScene(next,saved?.position?.x??spawn[0],saved?.position?.y??spawn[1]);window.NextChapter.syncRoster();canvas.focus();
 if(!saved||quest.briefed===false)run(deliverOpeningMission);
}
$('intro-start').onclick=()=>{const id=ROSTER[introIndex];if(CORE.includes(id))reset(false,id);};$('intro-resume').onclick=()=>reset(true);
function drawQuestgiver(id,x,y,height=150,dir='front'){const model=window.QUESTGIVER_MODELS[id],f=model.frames[dir==='back'?2:dir==='right'||dir==='left'?1:0],scale=height/f.h;ctx.save();ctx.translate(x,y);if(dir==='left')ctx.scale(-1,1);ctx.drawImage(art[id],f.x,f.y,f.w,f.h,-f.w*scale/2,-height,f.w*scale,height);ctx.restore();}
function renderBriefing(t){window.SceneLayers.draw(ctx,window.MAP_LAYERS.tavern,art.tavern,t,{reduced:reduce.matches});ctx.fillStyle='#0a111bcc';ctx.fillRect(0,0,640,400);ctx.textAlign='center';ctx.font='bold 14px monospace';ctx.fillStyle='#d9ba79';ctx.fillText('KINTARGO · A PRIVATE AUDIENCE',320,35);drawActor(ctx,{id:lead,x:174,y:255,dir:'right',step:null},153);drawQuestgiver('barzillai',456,255,170,'left');$('prompt').hidden=true;}
async function deliverOpeningMission(){briefingOpen=true;keys.clear();path=[];
 await say('barzillai','Kintargo is restless. Rebels nest in this city like rats in a granary.');
 await say('barzillai',lead==='freya'?'Kusanagi. You are assigned to me. Quietly. Your team as well.':NAMES[lead]+'. Kusanagi answers to me now, quietly. That means your whole team does.');
 await say('barzillai','Beneath a tavern called the Silver Star, dissidents keep a hidden temple. Its priest is a man named Viggo.');
 await say('barzillai','In two nights this city will burn a little. In the confusion, go beneath the Silver Star. End the temple. End Viggo.');
 await say('barzillai','Take his scimitar. Leave this rapier in its place. Let Kintargo blame a swordsman who was never there.');
 await say('barzillai','Then be aboard The Western Star before dawn. You were never in this city.');
 await say(lead,'Understood. The scimitar, the rapier, then the ship.');
 briefingOpen=false;quest.briefed=true;await say('Night of Ashes','Two nights later. Smoke drifts over the rooftops. The Silver Star waits on the north side of the street.');save();}
function readSave(){try{const s=JSON.parse(localStorage.getItem(SAVE));if(s?.version===1&&scenes[s.scene]&&CORE.includes(s.lead)&&CORE.every(id=>Number.isFinite(s.hp?.[id])))return s;}catch{}return null;}
function visiblePoints(){if(quest.done&&!quest.chapter2)return [{id:'nextChapter',x:608,y:184,label:'Continue to Chapter Two'}];return scenes[scene].points.filter(p=>!(quest.burned&&scene==='tavern'&&p.id==='stairs')&&!(quest.victory&&scene==='temple'&&p.id==='altar')) .concat(scene==='temple'&&quest.victory?[{id:'aftermath',x:312,y:120,label:!quest.scimitar?'Take Viggo’s scimitar':!quest.planted?'Plant the rapier':'Burn the temple'}]:[]);}
function nearPoint(){if(!units[0])return null;return visiblePoints().filter(p=>Math.hypot(units[0].x-p.x,units[0].y-p.y)<INTERACTION_RADIUS).sort((a,b)=>Math.hypot(units[0].x-a.x,units[0].y-a.y)-Math.hypot(units[0].x-b.x,units[0].y-b.y))[0];}
async function interact(requestedId=null){
 if(introOpen||dialogOpen||taskBusy||battle||units[0]?.step||finished())return;const p=typeof requestedId==='string'?visiblePoints().find(p=>p.id===requestedId&&Math.hypot(units[0].x-p.x,units[0].y-p.y)<INTERACTION_RADIUS):nearPoint();if(!p)return;
 run(async()=>{
  if(await window.NextChapter.interact(p.id))return;
  if(p.id==='silver'){setScene('tavern',312,280);if(!quest.entered){quest.entered=true;await say('The Silver Star','The room is empty. Somewhere under the floorboards, chanting rises through the wood.');save();}}
  if(p.id==='outside'){setScene('street',152,152,'down');}
  if(p.id==='upstairs'){setScene('tavern',536,152,'down');}
  if(p.id==='guard'){await say('Dottari Guard',quest.burned?'The Western Star sails on the tide. Nobody is checking papers tonight.':'Fires on the north bank. Every Dottari in the city is up there. Keep off the streets.');if(!quest.burned)await say('Dottari Guard','...Unless you are who I think you are. Then I saw nothing.');}
  if(p.id==='ship'){if(!quest.burned){await say('The Western Star','The temple is unfinished business. Barzillai expects a false trail before you leave Kintargo.');return;}await say('The Western Star','The Western Star clears the harbor. Kintargo glows orange on the horizon, then fades.');await say('guapo','So. The Night of Ashes. I have been in worse nights, but never in one somebody else paid for.');quest.done=true;save();updateObjective();await say('Chapter complete','Seven days to Remesiana. From there, the road to Longacre, and a man named Archbaron Fex.');}
  if(p.id==='barkeep'){await say('Barkeep','We are closed. The fires. Go home.');const choice=await say(null,'The barkeep waits.',['Leave him.','The cellar?','[Intimidation] Tell me, or burn with it.']);if(choice===0){await say('Barkeep','...Please.');}if(choice===1){await say('Barkeep','There is no cellar.');await say(null,'His eyes go to the far corner of the room.');quest.stairsKnown=true;}if(choice===2){if(quest.ropeCut||quest.bell){await say('Barkeep','I already told you everything.');return;}const mod={freya:4,jamal:1,jason:3,draymus:2,guapo:3}[lead],total=await rollDice('Intimidation',20,1,mod,'DC 10');await say('Intimidation',total>=10?'Success. The barkeep gives way.':'Failed. The barkeep reaches for the alarm.');if(total>=10){quest.ropeCut=true;await say('Barkeep','The bell rope. By the stairs in the corner. Cut it or they will hear you coming.');await say(null,'You cut the rope. Whatever is below will not be warned.');}else{quest.bell=true;await say(null,'He screams. Somewhere beneath the floor, a bell answers.');}}save();}
  if(p.id==='rope'){if(quest.ropeCut){await say(null,'The severed bell rope hangs loose. Below, the chanting continues.');}else if(quest.bell){await say(null,'The bell has already sounded. Whoever is below knows you are coming.');}else{await say(null,'A bell rope, by the cellar stairs.');const c=await say(null,'Cut the rope before descending?',['Cut it.','Leave it.']);if(c===0){quest.ropeCut=true;await say(null,'You cut the rope. Whatever is below will not be warned.');save();}}}
  if(p.id==='stairs'){await say(null,'A trapdoor, and stairs. Chanting rises from below.');setScene('temple',312,312);if(!quest.victory)await say(null,'A hidden temple. Candles, an altar, and a man in robes'+(quest.ropeCut?' still absorbed in prayer.':' who has heard you coming.'));}
  if(p.id==='altar')await encounter();
  if(p.id==='aftermath'){if(!quest.scimitar){quest.scimitar=true;await say(null,'Obtained: Viggo’s scimitar.');}else if(!quest.planted){quest.planted=true;await say(null,'You lay the rapier in its place. Whoever finds this room will look for a swordsman who was never here.');}else{const c=await say(null,'Nothing about tonight is undecided.',['Burn it.','Burn it anyway.']);quest.burned=true;await say(null,'Braziers tip. Old wood catches fast. Nobody will pray here again.');await say('jamal','We should not be standing in a fire. Just saying.');setScene('tavern',312,280,'down');}save();}
 });
}
async function encounter(){
 await say('viggo','You walk into a holy place with drawn steel. Then you are what the fires are for.');
 await say('viggo','The Silver Star will not kneel to Thrune.');
 const c=await say(null,'Your answer?',['It will.','[Intimidation] Everything kneels, eventually.','Kneel.']);
 if(c===2){await say(null,'You kneel. Viggo smiles, and the knife is already in his hand.');await fail('You knelt to the Silver Star. The crown does not record failures.');return;}
 let shaken=false,surprise=false;
 if(c===1){const mod={freya:4,jamal:1,jason:3,draymus:2,guapo:3}[lead],total=await rollDice('Intimidation',20,1,mod,'DC 12');await say('Intimidation',total>=12?'Success. Viggo’s resolve falters.':'Failed. Viggo stands firm.');shaken=total>=12;surprise=!shaken;await say(shaken?null:'viggo',shaken?'Viggo flinches. His hands are shaking. He will fight worse for it.':'Then kneel to this.');}
 else await say(lead,'It will.');
 const count=quest.ropeCut?1:quest.bell?3:2;
 await say(null,count===1?'A single zealot steps from behind a pillar. The others never heard the bell.':count===2?'Two zealots step from behind the pillars.':'Three zealots come down the stairs behind you. The bell did its work.');
 startBattle(count,shaken);if(surprise){battle.busy=true;await enemyStrike(battle.enemies[0],epoch);if(battle){battle.busy=false;paintBattle();}}
}
function startBattle(count,shaken){
 const places=[[312,280],[264,296],[360,296],[280,328],[344,328]];
 units.forEach((u,i)=>{u.x=places[i][0];u.y=places[i][1];u.dir='up';u.step=null;u.guard=false;});path=[];
 const enemies=[{id:'viggo',name:'Viggo',x:312,y:136,hp:34,max:34,shaken:shaken?2:0},...Array.from({length:count},(_,i)=>({id:'cultist',name:'Zealot '+(i+1),x:[248,392,552][i],y:[152,152,280][i],hp:12,max:12}))];
 battle={round:1,turn:0,target:0,ally:lead,enemies,busy:false,smoke:0};$('battle').hidden=false;$('character').disabled=true;$('combat-log').replaceChildren();log('Choose a target. Five companions, one mission.');paintBattle();updateObjective();
}
function log(text){$('battle-message').textContent=text;const e=document.createElement('div');e.textContent=text;$('combat-log').prepend(e);while($('combat-log').children.length>6)$('combat-log').lastChild.remove();}
function activeUnit(){return battle?units[battle.turn]:null;}
function livingEnemy(){return battle?.enemies.find(e=>e.hp>0);}
function flash(target,value,color='#f0d5a0'){const position=battle?battlePosition(target):{x:target.x,y:target.y,height:55};fx.push({x:position.x,y:position.y-position.height,text:String(value),color,life:.9});target.flash=.18;}
function hitTarget(attacker,target,value){target.hp=Math.max(0,target.hp-value);attacker.lunge=.22;flash(target,'−'+value);return value;}
function paintParty(){
 syncBattleView();
 $('party').replaceChildren();units.forEach(u=>{const b=document.createElement('button');b.className='party-card'+(hp[u.id]===0?' down':'')+(battle&&activeUnit()?.id===u.id?' current':'')+(battle?.ally===u.id?' selected':'');b.title=battle?'Select '+NAMES[u.id]+' as healing target':'Speak to '+NAMES[u.id];const c=document.createElement('canvas');c.width=32;c.height=48;drawActor(c.getContext('2d'),{...u,x:16,y:46,dir:'down',step:null},38);const text=document.createElement('span');text.textContent=NAMES[u.id]+' · '+hp[u.id]+'/'+STATS[u.id].hp;const meter=document.createElement('i');meter.style.width=Math.max(0,hp[u.id]/STATS[u.id].hp*100)+'%';b.append(c,text,meter);b.onclick=()=>{if(battle){battle.ally=u.id;paintParty();}else if(!taskBusy&&!finished())run(()=>say(u.id,lines[scene]?.[u.id]||'Your call.'));};$('party').append(b);});
}
function paintBattle(){
 if(!battle)return;while(battle.turn<units.length&&hp[units[battle.turn].id]<=0)battle.turn++;
 if(battle.turn>=units.length){return;}
 if(battle.enemies[battle.target]?.hp<=0)battle.target=battle.enemies.findIndex(e=>e.hp>0);
 const actor=activeUnit();$('heal-target').textContent='Heal: '+NAMES[battle.ally];$('heal-target').disabled=battle.busy;$('battle-title').textContent='Round '+battle.round+' · '+NAMES[actor.id]+'’s turn';$('enemy-targets').replaceChildren();
 battle.enemies.forEach((e,i)=>{const b=document.createElement('button');b.className='target'+(battle.target===i?' selected':'');b.disabled=e.hp<=0||battle.busy;b.textContent=e.name+' · '+e.hp+'/'+e.max;b.onclick=()=>{battle.target=i;paintBattle();};$('enemy-targets').append(b);});
 $('actions').replaceChildren();const commands=[['attack','Attack'],['special',({freya:'Iaijutsu',jamal:'Sneak Attack',jason:'Hellfire',draymus:'Vampiric Touch',guapo:'Throw Chair'})[actor.id]+' ('+Math.max(0,SPECIAL[actor.id].uses-uses[actor.id])+')'],['guard','Guard'],['potion','Potion ('+potions+')']];
 if(actor.id==='jason')commands.splice(2,0,['mend','Mending ('+mendUses+')']);
 if(actor.id==='jamal')commands.splice(2,0,['smoke','Smoke Bomb']);
 commands.forEach(([action,label],i)=>{const b=document.createElement('button');const remaining=Math.max(0,SPECIAL[actor.id].uses-uses[actor.id]);const detail=action==='special'?SPECIAL[actor.id].name+' ['+remaining+'/'+SPECIAL[actor.id].uses+']':action==='potion'?'Healing potion ['+potions+'/2]':action==='mend'?'Infernal Mending ['+mendUses+'/2]':action==='smoke'?'Smoke bomb ['+(quest.smokeUsed?0:1)+'/1]':action==='attack'?'Attack with '+WEAPONS[actor.id]:label;b.textContent=action==='special'?'Skill ['+remaining+'/'+SPECIAL[actor.id].uses+']':action==='potion'?'Potion ['+potions+'/2]':action==='smoke'?'Smoke ['+(quest.smokeUsed?0:1)+'/1]':action==='mend'?'Mend ['+mendUses+'/2]':label;b.dataset.action=action;b.onfocus=b.onpointerenter=()=>{if(battle&&!battle.busy)$('battle-message').textContent=detail;};b.title=detail;b.setAttribute('aria-label',detail);b.disabled=battle.busy||(action==='special'&&uses[actor.id]>=SPECIAL[actor.id].uses)||(action==='potion'&&potions<=0)||(action==='mend'&&mendUses<=0)||(action==='smoke'&&quest.smokeUsed);b.onclick=()=>performAction(action);$('actions').append(b);});
 paintParty();
}
async function performAction(action){try{await performActionImpl(action);}catch(e){if(e!==CANCEL){console.error(e);if(battle){battle.busy=false;paintBattle();}}}}
async function performActionImpl(action){
 if(!battle||battle.busy||dialogOpen||taskBusy)return;const token=epoch,actor=activeUnit();if(!actor)return;const target=battle.enemies[battle.target]?.hp>0?battle.enemies[battle.target]:livingEnemy();if(!target)return;
 if(action==='special'&&uses[actor.id]>=SPECIAL[actor.id].uses||action==='potion'&&potions<=0||action==='mend'&&mendUses<=0||action==='smoke'&&quest.smokeUsed)return;
 battle.busy=true;paintBattle();
 if(action==='guard'){actor.guard=true;log(NAMES[actor.id]+' guards. AC +4 this round.');}
 else if(action==='potion'||action==='mend'){const id=battle.ally||actor.id,value=await damage(action==='mend'?[2,8,3]:[2,4,2],NAMES[actor.id]+' · '+(action==='mend'?'Infernal Mending':'Healing potion')),before=hp[id];hp[id]=Math.min(STATS[id].hp,hp[id]+value);if(action==='potion')potions--;else mendUses--;flash(units.find(u=>u.id===id),'+'+(hp[id]-before),'#a8d8a0');log(NAMES[actor.id]+(action==='potion'?' uncorks a healing potion':' invokes Infernal Mending')+' for '+NAMES[id]+': '+(hp[id]-before)+' HP restored. ['+(action==='potion'?potions:mendUses)+'/2 remaining]');}
 else if(action==='smoke'){quest.smokeUsed=true;battle.smoke=2;log('Jamal throws a smoke bomb. Enemies take −4 to hit for two rounds. [0/1 remaining]');}
 else{
  const skill=action==='special'?SPECIAL[actor.id]:null;if(skill)uses[actor.id]++;
  const bonus=STATS[actor.id].atk+(skill?.bonus||0),total=skill?.auto?null:await rollDice(NAMES[actor.id]+' · Attack',20,1,bonus,'AC '+STATS[target.id].ac),roll=total===null?null:total-bonus,hit=skill?.auto||roll===20||roll!==1&&total>=STATS[target.id].ac;
  if(hit){let value=await damage(skill?.dmg||STATS[actor.id].dmg,NAMES[actor.id]+' · '+(skill?.name||'Damage'));if(skill&&actor.id==='jamal'&&target.hitRound===battle.round)value+=await damage([3,6,0],'Jamal · Sneak attack bonus');hitTarget(actor,target,value);target.hitRound=battle.round;if(skill?.drain)hp[actor.id]=Math.min(STATS[actor.id].hp,hp[actor.id]+value);log(NAMES[actor.id]+' '+(skill?SKILL_TEXT[actor.id]:ATTACKS[actor.id])+' at '+target.name+': '+value+' damage.'+(skill?' ['+Math.max(0,skill.uses-uses[actor.id])+'/'+skill.uses+' remaining]':''));}else{actor.lunge=.22;flash(target,'MISS','#bfc1d1');log(NAMES[actor.id]+' '+(skill?SKILL_TEXT[actor.id]:ATTACKS[actor.id])+' but misses '+target.name+' ('+roll+' + '+bonus+').'+(skill?' ['+Math.max(0,skill.uses-uses[actor.id])+'/'+skill.uses+' remaining]':''));}
 }
 paintBattle();await delay(280);if(token!==epoch||!battle)return;
 if(!livingEnemy()){battle=null;$('battle').hidden=true;$('character').disabled=false;quest.victory=true;updateObjective();paintParty();save();run(async()=>{await say(null,'Viggo is dead at his own altar.');await say('freya','Clean. Now the rapier.');});return;}
 battle.turn++;
 while(battle.turn<units.length&&hp[units[battle.turn].id]<=0)battle.turn++;
 if(battle.turn>=units.length){log('The faithful strike back.');for(const enemy of battle.enemies.filter(e=>e.hp>0)){await enemyStrike(enemy,token);if(token!==epoch||!battle)return;if(CORE.every(id=>hp[id]<=0)){battle=null;$('battle').hidden=true;$('character').disabled=false;run(()=>fail('The hidden temple keeps your names. Try the encounter again.'));return;}}
 units.forEach(u=>u.guard=false);battle.round++;battle.turn=0;battle.smoke=Math.max(0,battle.smoke-1);battle.enemies.forEach(e=>e.shaken=Math.max(0,(e.shaken||0)-1));
 }
 battle.busy=false;paintBattle();
}
async function enemyStrike(enemy,token){const live=units.filter(u=>hp[u.id]>0);if(!live.length)return;const target=live[Math.floor(Math.random()*live.length)],penalty=(battle.smoke?4:0)+(enemy.shaken?2:0),bonus=STATS[enemy.id].atk-penalty,total=await rollDice(enemy.name+' → '+NAMES[target.id],20,1,bonus,'AC '+(STATS[target.id].ac+(target.guard?4:0))),roll=total-bonus;
 if(roll===20||roll!==1&&roll+STATS[enemy.id].atk-penalty>=STATS[target.id].ac+(target.guard?4:0)){const value=await damage(STATS[enemy.id].dmg,enemy.name+' · Damage');hp[target.id]=Math.max(0,hp[target.id]-value);enemy.lunge=.22;flash(target,'−'+value,'#ee9a88');log(enemy.name+' hits '+NAMES[target.id]+' for '+value+'.');}else{flash(target,'MISS','#bfc1d1');log(enemy.name+' misses '+NAMES[target.id]+'.');}paintParty();await delay(220);if(token!==epoch)return;}
async function fail(text){await say('Defeat',text);const c=await say(null,'Return to the last checkpoint?',['Retry encounter.','Restart chapter.']);if(c===0)reset(true);else reset();}
function stepUnit(u,gx,gy){if(!passable(gx,gy))return false;const tx=gx*T+8,ty=gy*T+8,dx=tx-u.x,dy=ty-u.y;u.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';u.step={sx:u.x,sy:u.y,tx,ty,p:0};return true;}
function advance(u,dt,speed){if(!u.step)return false;u.step.p=Math.min(1,u.step.p+dt*speed);u.x=u.step.sx+(u.step.tx-u.step.sx)*u.step.p;u.y=u.step.sy+(u.step.ty-u.step.sy)*u.step.p;u.anim+=dt;if(u.step.p>=1){u.x=u.step.tx;u.y=u.step.ty;u.step=null;return true;}return false;}
function walkTo(gx,gy){if(!ready||introOpen||dialogOpen||taskBusy||battle||finished())return;const u=units[0],from=u.step?cell(u.step.tx,u.step.ty):cell(u.x,u.y),p=findPath(from,[gx,gy]);if(p){path=p;return true;}return false;}
function update(dt){
 for(const u of units){u.flash=Math.max(0,(u.flash||0)-dt);u.lunge=Math.max(0,(u.lunge||0)-dt);}for(const e of battle?.enemies||[]){e.flash=Math.max(0,(e.flash||0)-dt);e.lunge=Math.max(0,(e.lunge||0)-dt);}
 fx=fx.filter(f=>(f.life-=dt)>0);if(!ready||introOpen||dialogOpen||taskBusy||battle||finished())return;
 const u=units[0],speed=keys.has('run')?8:5;
 if(u.step){if(advance(u,dt,speed)){trail.unshift(cell(u.x,u.y));trail=trail.slice(0,64);}}
 else{const d=['up','down','left','right'].find(d=>keys.has(d));if(d){path=[];const a=cell(u.x,u.y),v=DIR[d];u.dir=d;stepUnit(u,a[0]+v[0],a[1]+v[1]);}else if(path.length){const to=path.shift();stepUnit(u,...to);}}
 for(let i=1;i<units.length;i++){const f=units[i];if(f.step)advance(f,dt,speed);else{const desired=trail[Math.min(i*2,trail.length-1)],from=cell(f.x,f.y);if(desired&&(from[0]!==desired[0]||from[1]!==desired[1])){const p=findPath(from,desired);if(p?.length)stepUnit(f,...p[0]);}}}
 const p=nearPoint();$('prompt').hidden=!p;if(p)$('prompt').textContent='E · '+p.label;
}
function drawActor(g,u,height=55){
 g.imageSmoothingEnabled=false;
 const meta=window.PARTY_FRAMES[u.id],im=sheets[u.id];if(!im)return;
 const row=u.dir==='up'?2:u.dir==='down'?0:1,col=u.step?[1,0,2,0][Math.floor(u.anim*10)%4]:0,f=meta.frames[row*3+col],scale=height/meta.maxHeight;
 const x=Math.round(u.x),y=Math.round(u.y);g.fillStyle='#02060c66';g.fillRect(x-8,y-2,16,4);g.save();g.translate(x,y+2-(u.lunge?Math.sin(u.lunge/.22*Math.PI)*5:0));if(u.dir==='left')g.scale(-1,1);if(hp[u.id]===0)g.globalAlpha=.38;
 g.drawImage(im,f.x,f.y,f.w,f.h,Math.round((f.x-f.anchorX)*scale),-Math.round(f.h*scale),Math.round(f.w*scale),Math.round(f.h*scale));g.restore();
}
function drawNPC(u){
 if(window.NextChapter.drawNPC(u))return;
 if(u.id==='guard'){const im=art.guard;ctx.drawImage(im,u.x-17,u.y-54,34,56);return;}
 const f=window.CHAPTER_NPCS[u.id],im=art.npcs,scale=55/f.h;ctx.save();if(u.hp!==undefined&&u.hp<=0)ctx.globalAlpha=.25;
 ctx.drawImage(im,f.x,f.y,f.w,f.h,Math.round(u.x-f.w*scale/2),Math.round(u.y-55),Math.round(f.w*scale),55);ctx.restore();
 if(battle&&u.hp>0){rect(u.x-16,u.y-64,32,3,'#151522');rect(u.x-16,u.y-64,Math.max(0,32*u.hp/u.max),3,'#c46652');}
}
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
function buildFlicker(){if(!art[scene])return;const a=document.createElement('canvas');a.width=640;a.height=400;const g=a.getContext('2d',{willReadFrequently:true});g.imageSmoothingEnabled=false;g.drawImage(art[scene],0,0,640,400);let pixels;try{pixels=g.getImageData(0,0,640,400).data;}catch{}flicker=scenes[scene].lights.map(([x,y],index)=>{const mask=document.createElement('canvas');mask.width=33;mask.height=49;const mg=mask.getContext('2d'),d=mg.createImageData(33,49);for(let yy=0;yy<49;yy++)for(let xx=0;xx<33;xx++){const wx=x-16+xx,wy=y-24+yy,dist=((xx-16)/16)**2+((yy-24)/24)**2,i=(wy*640+wx)*4;if(dist>=1||wx<0||wy<0||wx>=640||wy>=400)continue;const r=pixels?pixels[i]:200,green=pixels?pixels[i+1]:130,b=pixels?pixels[i+2]:65;if(r>125&&green>65&&r>green*1.12&&green>b*1.2)d.data[(yy*33+xx)*4+3]=Math.round(255*Math.min(1,(r-110)/120)*(pixels?Math.sqrt(1-dist):(1-dist)**2*.55));}mg.putImageData(d,0,0);return {mask,x:x-16,y:y-24,index};});}
function render(t){
 rect(0,0,640,canvas.height,'#0b1018');if(!ready||introOpen)return;if(briefingOpen){renderBriefing(t);return;}if(battle){renderBattle(t);return;}window.SceneLayers.draw(ctx,window.MAP_LAYERS[scene],art[scene],t,{reduced:reduce.matches});
 if(!reduce.matches){ctx.save();for(const l of flicker){ctx.globalAlpha=.095+.035*Math.sin(t*1.7+l.index*2.4)+.021*Math.sin(t*3.1+l.index*4.1);ctx.drawImage(l.mask,l.x,l.y);}ctx.restore();if(scene!=='street')for(let i=0;i<scenes[scene].lights.length;i++){const [x,y]=scenes[scene].lights[i];if((Math.floor(t*7)+i)%3===0)rect(x,y-2,1,2,'#fbd29388');}}
 if(scene==='street'&&!reduce.matches){for(let i=0;i<30;i++){const p=(t*.05+i*.177)%1,x=(i*71+t*(2+i%3))%640,y=30+p*90;rect(x,y,2,1,'#b8aa9044');}}
 if(showPaths){ctx.fillStyle='#83bdb23b';for(let y=0;y<25;y++)for(let x=0;x<40;x++)if(passable(x,y))ctx.fillRect(x*T+1,y*T+1,14,14);}
 if(path.length){ctx.fillStyle='#d9b86a77';path.forEach(([x,y])=>ctx.fillRect(x*T+7,y*T+7,2,2));}
 const npcs=quest.chapter2?window.NextChapter.npcs():scene==='street'?[{id:'guard',x:472,y:184}]:scene==='tavern'?[{id:'cultist',x:264,y:120}]:battle?battle.enemies:quest.victory?[{id:'viggo',x:312,y:136,hp:0}]:[{id:'viggo',x:312,y:136}];
 const drawables=[...units.filter(u=>!battle||hp[u.id]>0),...npcs].sort((a,b)=>a.y-b.y);
 for(const u of drawables){if(CORE.includes(u.id))drawActor(ctx,u);else drawNPC(u);}
 if(!battle&&!finished()){const target=quest.chapter2?window.NextChapter.target():quest.done?visiblePoints()[0]:quest.burned?scene==='street'?point('ship'):point('outside'):scene==='street'?point('silver'):scene==='tavern'?point('stairs'):quest.victory?{x:312,y:120}:point('altar');if(target){const lift=reduce.matches?0:Math.round(Math.sin(t*3)*2);rect(target.x-3,target.y-56+lift,6,1,'#e6c47c');rect(target.x-2,target.y-55+lift,4,2,'#e6c47c');}}
 if(quest.burned&&scene==='tavern'){ctx.fillStyle='rgba(80,55,38,.1)';ctx.fillRect(0,0,640,400);if(!reduce.matches)for(let i=0;i<12;i++){const y=350-(t*35+i*47)%320,x=490+Math.sin(i+t)*60;rect(x,y,1,2,'#ffb97377');}}
 for(const f of fx){ctx.save();ctx.globalAlpha=Math.min(1,f.life*2);ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.lineWidth=3;const y=f.y-(.9-f.life)*18;ctx.strokeStyle='#0b1018';ctx.strokeText(f.text,f.x,y);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,y);ctx.restore();}
 $('prompt').hidden=dialogOpen||!!battle||taskBusy||finished()||!nearPoint();
}
$('close').onclick=()=>finishDialog();$('reset').onclick=()=>reset();$('retry').onclick=()=>reset(true);
$('paths').onclick=()=>{showPaths=!showPaths;$('paths').textContent=showPaths?'Hide paths':'Show paths';$('paths').setAttribute('aria-pressed',String(showPaths));};
$('interact').onclick=interact;
$('heal-target').onclick=()=>{if(!battle||battle.busy)return;const i=units.findIndex(u=>u.id===battle.ally);battle.ally=units[(i+1)%units.length].id;paintBattle();};
$('character').onchange=e=>{if(battle||taskBusy||dialogOpen){e.target.value=lead;return;}const old=lead;if(units[0].step){units[0].x=units[0].step.sx;units[0].y=units[0].step.sy;}lead=e.target.value;const displaced=units.find(u=>u.id===lead);if(displaced)displaced.id=old;units[0].id=lead;units[0].step=null;path=[];keys.clear();paintParty();save();canvas.focus();};
document.addEventListener('keydown',e=>{
 if(introOpen){if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();introIndex=(introIndex+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1)+ROSTER.length)%ROSTER.length;paintIntro();}else if(e.key==='Enter'&&e.target.id!=='intro-resume'){e.preventDefault();$('intro-start').click();}return;}
 if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
 if(battle&&!battle.busy&&!dialogOpen&&['q','e','h'].includes(e.key.toLowerCase())){e.preventDefault();if(e.key.toLowerCase()==='h')$('heal-target').click();else{const living=battle.enemies.map((a,i)=>a.hp>0?i:-1).filter(i=>i>=0),at=living.indexOf(battle.target);battle.target=living[(at+(e.key.toLowerCase()==='q'?-1:1)+living.length)%living.length];paintBattle();}return;}
 const menu=dialogOpen&&$('choices').children.length?$('choices'):battle&&!battle.busy?$('actions'):null;
 if(menu&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const buttons=Array.from(menu.querySelectorAll('button')).filter(b=>!b.disabled),index=buttons.indexOf(document.activeElement),delta={ArrowUp:-2,ArrowDown:2,ArrowLeft:-1,ArrowRight:1}[e.key];buttons[index<0?0:(index+delta+buttons.length*2)%buttons.length]?.focus();return;}
 if(dialogOpen){if(['Escape','Enter',' '].includes(e.key)&&!$('close').hidden){e.preventDefault();finishDialog();}if(/^[1-9]$/.test(e.key)){const b=$('choices').children[Number(e.key)-1];if(b){e.preventDefault();b.click();}}if(e.key==='Tab'){e.preventDefault();const focusable=Array.from($('dialog').querySelectorAll('button')).filter(b=>!b.hidden);const index=focusable.indexOf(document.activeElement),next=(index+(e.shiftKey?-1:1)+focusable.length)%focusable.length;focusable[next]?.focus();}return;}
 if(KEY[e.key]){e.preventDefault();if(!battle&&!taskBusy)keys.add(KEY[e.key]);}
 else if(['e','E','Enter',' '].includes(e.key)&&e.target.tagName!=='BUTTON'){e.preventDefault();if(!e.repeat)interact();}
 else if(battle&&/^[1-9]$/.test(e.key)){const b=$('actions').children[Number(e.key)-1];if(b&&!b.disabled)b.click();}
});
document.addEventListener('keyup',e=>keys.delete(KEY[e.key]));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{keys.clear();last=0;});
document.querySelectorAll('[data-dir]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(!dialogOpen&&!battle&&!taskBusy)keys.add(b.dataset.dir);};for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.dir));});
canvas.onpointerdown=e=>{if(!ready||introOpen||dialogOpen||taskBusy||finished())return;canvas.focus();const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*640/r.width,y=(e.clientY-r.top)*canvas.height/r.height;if(battle){if(battle.busy)return;const i=battle.enemies.findIndex(a=>{const v=battlePosition(a);return a.hp>0&&Math.abs(x-v.x)<35&&y>v.y-v.height-22&&y<v.y+8;});if(i>=0){battle.target=i;paintBattle();}else{const ally=units.find(a=>{const v=battlePosition(a);return Math.abs(x-v.x)<44&&y>v.y-v.height&&y<v.y+38;});if(ally){battle.ally=ally.id;paintBattle();}}return;}const object=visiblePoints().find(p=>Math.hypot(x-p.x,y-p.y)<25);if(object){if(Math.hypot(units[0].x-object.x,units[0].y-object.y)<INTERACTION_RADIUS&&!units[0].step){interact(object.id);return;}const candidates=[];for(let gy=0;gy<25;gy++)for(let gx=0;gx<40;gx++)if(passable(gx,gy)&&Math.hypot(gx*T+8-object.x,gy*T+8-object.y)<INTERACTION_RADIUS)candidates.push([gx,gy]);candidates.sort((a,b)=>Math.hypot(a[0]*T+8-units[0].x,a[1]*T+8-units[0].y)-Math.hypot(b[0]*T+8-units[0].x,b[1]*T+8-units[0].y));for(const c of candidates)if(walkTo(...c))return;}else walkTo(...cell(x,y));};
function imageLoad(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Could not load '+src));im.src='art-test/'+src;});}
async function load(){
 try{const values=await Promise.all(['kintargo-map.png','chapter-tavern.png','chapter-temple.png','chapter-npcs.png','dottari.png'].map(imageLoad));[art.street,art.tavern,art.temple,art.npcs,art.guard]=values;await window.NextChapter.load(imageLoad);await Promise.all(ROSTER.map(async id=>sheets[id]=await imageLoad(id+'-sheet.png')));await Promise.all(Object.entries(window.QUESTGIVER_MODELS).map(async([id,m])=>art[id]=await imageLoad(m.src)));ready=true;$('loading').hidden=true;reset(!!readSave());}
 catch(e){console.error(e);$('loadingText').textContent='The chapter art could not load. Keep this HTML beside its art-test folder.';$('load-retry').hidden=false;}
}
$('load-retry').onclick=load;
function loop(now){const dt=last?Math.min((now-last)/1000,.05):0;last=now;update(dt);render(now/1000);requestAnimationFrame(loop);}
window.__chapter={state:()=>({ready,introOpen,briefingOpen,scene,lead,quest:{...quest},hp:{...hp},potions,uses:{...uses},mendUses,interaction:nearPoint()?.id,dialogOpen,taskBusy,party:units.map(u=>({id:u.id,x:u.x,y:u.y,dir:u.dir,moving:!!u.step})),pathLength:path.length,battle:battle?{round:battle.round,turn:battle.turn,actor:activeUnit()?.id,busy:battle.busy,enemies:battle.enemies.map(e=>({name:e.name,hp:e.hp})),smoke:battle.smoke}:null}),passable,findPath};
window.NextChapter.install();load();requestAnimationFrame(loop);
