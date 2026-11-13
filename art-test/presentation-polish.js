"use strict";
window.PresentationPolish=(()=>{
 const cache=new WeakMap();
 function draw(g,im,f,x,y,w,h){if(!im||!f)return false;const key=[f.x,f.y,f.w,f.h].join(',');const cuts=window.SPRITE_CLEAN_RECTS?.[im.src?.split('/').pop()]?.[key];if(!cuts?.length){g.drawImage(im,f.x,f.y,f.w,f.h,x,y,w,h);return true;}let frames=cache.get(im);if(!frames){frames=new Map();cache.set(im,frames);}let c=frames.get(key);if(!c){c=document.createElement('canvas');c.width=f.w;c.height=f.h;const cg=c.getContext('2d');cg.drawImage(im,f.x,f.y,f.w,f.h,0,0,f.w,f.h);for(const r of cuts)cg.clearRect(r.x,r.y,r.w,r.h);frames.set(key,c);}g.drawImage(c,x,y,w,h);return true;}
 function phase(u,t,m){const index=battle?.enemies.indexOf(u)??-1,offset=index>=0?(u.idleOffset??u.id.length*.11+index*.193):Math.max(0,CORE.indexOf(u.id))*.17;return reduce.matches||hp[u.id]===0||u.hp===0?0:m.cycle[Math.floor((t+offset)/.52)%m.cycle.length];}
 function install(){COMBAT_IDLES.porch_guard={...MOVEMENT_FRAMES['political-cast-v1.png'][3],frames:MOVEMENT_FRAMES['political-cast-v1.png'][3].frames.slice(0,2),cycle:[0,1,0,1]};}
 async function load(loader){for(const src of ['combat-void-v2.png','dice-atlas-v1.png','townsfolk-sheet-v2.png'])art[src]=await loader(src);}
 const diceFrames=[{"x": 33, "y": 225, "w": 360, "h": 317}, {"x": 445, "y": 234, "w": 321, "h": 316}, {"x": 812, "y": 200, "w": 358, "h": 381}, {"x": 1204, "y": 210, "w": 346, "h": 339}, {"x": 1602, "y": 200, "w": 329, "h": 381}];
 function paintDice(){const im=art['dice-atlas-v1.png'];if(!im)return;for(const c of document.querySelectorAll('#dice-tray canvas[data-die],#initiative-results canvas[data-die]')){const f=diceFrames[Number(c.dataset.die)],g=c.getContext('2d'),scale=Math.min(60/f.w,60/f.h);g.clearRect(0,0,64,64);g.imageSmoothingEnabled=false;g.drawImage(im,f.x,f.y,f.w,f.h,(64-f.w*scale)/2,(64-f.h*scale)/2,f.w*scale,f.h*scale);}}
 function citizenMeta(variant){return variant<4?CITIZEN_FRAMES[variant]:window.EXTRA_CITIZEN_FRAMES?.[variant-4]||CITIZEN_FRAMES[0];}
 function citizenPortrait(id,g){const u=townsfolk().find(u=>u.id===id),variant=u?.variant??0,m=citizenMeta(variant),f=m.frames[0],im=variant<4?art.citizens:art['townsfolk-sheet-v2.png'];if(!im)return false;g.clearRect(0,0,96,96);g.fillStyle='#25212a';g.fillRect(0,0,96,96);g.imageSmoothingEnabled=false;const side=Math.min(f.w,f.h*.28);g.drawImage(im,f.x+(f.w-side)/2,f.y,side,side,3,3,90,90);return true;}
 const captiveLocations={last_stand:[397,277],longacre_cells:[328,180],longacre_jail:[456,216],rohalendi_hospice:[392,280],longacre_church_front:[389,222],longacre_church:[392,216],angel_hill:[328,163]};
 function captive(){
  return !!(quest.rileyCaptured&&!quest.jailbreakHeard&&!quest.chapter7&&captiveLocations[scene]&&(scene!=='longacre_jail'||quest.rileyQuestioned));
 }
 function captivePoints(){
  if(!captive()||(scene==='longacre_cells'&&!quest.rileyQuestioned))return [];
  const [x,y]=captiveLocations[scene];
  return [{id:'rileyBanter',x,y,label:'Talk to Riley'}];
 }
 async function banter(){
  if(!captive())return false;
  const questions=['[Ask about his music]','[Ask how important he is]','[Ask about his admirers]','[Ask about his future]','[Leave him to his thoughts]'];
  const asks=['How is the music business, Riley?','And how important are you, exactly?','Do you have many admirers?','What comes next for the great Riley Kels?'];
  const replies=['Longacre has very few ears refined enough for my work. I try not to hold it against them.','If you have to ask, I fear you have not been keeping up with the cultural life of this town.','Naturally. Some are simply too overcome to introduce themselves.','I expect a larger stage. The acoustics here are beneath me.'];
  const choice=await say('riley','Since you are here, perhaps we could discuss someone of actual interest.',questions);
  if(choice<asks.length){await say(lead,asks[choice]);await say('riley',replies[choice]);}
  return true;
 }

 const decreePages=[
  ['The Castle Gate',
   'All Citizens of and Visitors to the Town of Longacre,\n\nBy Order of His Lordship Darellus Fex, Archbaron of Longacre, and in accordance with the wishes of Her Infernal Majestrix, Queen Abrogail II of the Thrice-Damned House of Thrune, the following decrees are now in effect:\n\n'+
   'Longacre’s western gate, known as the Castle Gate, is closed until further notice. All travel into and out of Longacre must employ the north or south gates and be officially sanctioned. Only the archbaron’s agents, sanctioned local businesses, or those displaying a writ of passage bearing the seal of House Fex, will be granted passage. All others must obtain a writ from the Longacre notary or do business elsewhere.'],
  ['Gatherings and Curfew',
   'Longacre citizens shall not congregate in groups numbering greater than six in private, or in numbers greater than twelve in public. Exceptions will be made only for families with more than six members or for individuals undertaking the natural course of their business. Gatherings for the purposes of celebration, education, or religion are not exempt from this order.\n\n'+
   'A curfew is now in effect. From the hour after dusk to the hour before dawn, no citizen of Longacre is allowed upon the town’s streets without a writ of exception bearing the seal of House Fex. The archbaron’s agents and sanctioned local businesses are exempt from this order. Those seeking a writ of exception may apply at the Longacre Notary.'],
  ['Enforcement and Seal',
   'Any persons found in violation of these mandates or any other laws and sanctions of Longacre will be considered seditious agents and are subject to questioning, imprisonment, and summary judgment by the Archbaron of Longacre and officials of the town government.\n\n'+
   'For the prosperity of Longacre, the protection of the Empire, and the glory of House Thrune,\n\nDarellus Fex,\nArchbaron of Longacre']
 ];
 async function parchment(pages){
  const panel=$('journey');
  panel.classList.add('decree-page');
  try{
   for(const [title,body] of pages)await journeyCard(title,body);
  }finally{panel.classList.remove('decree-page');}
 }
 function decree(){return parchment(decreePages.map(([title,body],index)=>[`Longacre Decree · ${title} [${index+1}/${decreePages.length}]`,body]));}
 function hospiceLetter(){return parchment([['Intercepted Letter · Remesiana','Gerya Rohalendi wrote to her cousin in Remesiana.\n\nThe hospice owes nearly three hundred gold pieces and may soon have to close. Razelago obtained the letter and passed it to the party.']]);}
 function world(g,t){if(scene==='ash_house'){const m=LORE_CREATURE_IDLES.krenshar,phase=reduce.matches?0:m.cycle[Math.floor(t/.8)%m.cycle.length],f=m.frames[phase],im=art[m.src];if(im){g.save();g.translate(240,280);g.scale(-1,1);const scale=35/m.maxHeight;draw(g,im,f,(f.x-f.anchorX)*scale,-f.h*scale,f.w*scale,f.h*scale);g.restore();}}if(scene==='execution_square'&&quest.executionResolved&&!quest.bodiesMissing){for(const[id,x]of [['bo_gramel',252],['riley',404]]){const m=FUTURE_NPCS[id],im=art[m.source];if(!im)continue;const f=m.frame,crop=DIALOGUE_FACE_CROPS[id]||{x:f.x+f.w*.25,y:f.y,w:f.w*.5,h:f.w*.5};g.fillStyle='#5a4231';g.fillRect(x-1,122,3,91);g.fillStyle='#a99b7e';g.fillRect(x,117,1,10);g.drawImage(im,crop.x,crop.y,crop.w,crop.h,x-7,123,15,17);}}
 }
 function smoke(g,a){const p=CombatArt.phase(a),from=battlePosition(a.actor),targets=battle.enemies.map(battlePosition);g.save();g.imageSmoothingEnabled=false;const flight=Math.min(1,p/.38),x=from.x+(455-from.x)*flight,y=from.y-45+(128-(from.y-45))*flight-Math.sin(flight*Math.PI)*60;if(p<.4){g.fillStyle='#665566';g.fillRect(Math.round(x)-4,Math.round(y)-4,8,8);g.fillStyle='#bca078';g.fillRect(Math.round(x)-1,Math.round(y)-6,2,3);}else{const q=(p-.38)/.62;for(let k=0;k<targets.length;k++)for(let i=0;i<8;i++){const v=targets[k],r=8+q*24,cx=Math.round(v.x+Math.sin(i*2.3+k)*r*1.4),cy=Math.round(v.y-v.height*.4-Math.cos(i*1.7)*r-q*24);g.globalAlpha=(1-q*.55)*(.4+i%3*.09);g.fillStyle=['#403648','#655b72','#9b90a1'][i%3];for(let j=0;j<5;j++){const ww=Math.round((j===0||j===4?.5:.9)*r);g.fillRect(cx-ww,cy+(j-2)*5,ww*2,5);}}}g.restore();}
 function worldFire(g,t,sites){
  const time=reduce.matches?0:t;
  g.save();
  for(const [index,[x,y]] of sites.entries()){
   const light=g.createRadialGradient(x,y,2,x,y,32);
   light.addColorStop(0,'#f4833666');
   light.addColorStop(1,'#f4833600');
   g.fillStyle=light;
   g.fillRect(x-32,y-32,64,64);
   for(let i=0;i<5;i++){
    const phase=(time*.36+i*.21+index*.13)%1;
    const size=4+Math.floor(phase*10);
    const dx=x+Math.floor(phase*21)+(i-2)*3;
    const dy=y-21-Math.floor(phase*42);
    g.globalAlpha=(1-phase)*.38;
    g.fillStyle=i%2?'#67544f':'#403439';
    g.fillRect(dx-size,dy,size*2,size);
    g.fillRect(dx-size+3,dy-3,size*2-6,3);
   }
   g.globalAlpha=1;
   for(let i=0;i<5;i++){
    const fx=x-16+i*7;
    const height=12+Math.round(11*Math.sin(i*Math.PI/4))+(Math.floor(time*8)*5+i*7+index)%9;
    const lean=(i+Math.floor(time*5)+index)%3-1;
    g.fillStyle='#9b321c';
    g.fillRect(fx-2,y-7,12,7);
    g.fillStyle='#e95d25';
    for(let step=0;step<4;step++){
     const width=10-step*2;
     const rise=Math.floor(height*step/4);
     const next=Math.floor(height*(step+1)/4);
     g.fillRect(fx+step+lean*step,y-next,width,next-rise+1);
    }
    g.fillStyle='#ffbf59';
    g.fillRect(fx+2,y-7,5,6);
    g.fillRect(fx+3+lean,y-12,3,6);
    g.fillStyle='#ffe2a1';
    g.fillRect(fx+3,y-4,3,3);
   }
  }
  g.restore();
 }

 // Positions and radii are percentages of the source illustration.
 const journeyEffects={
  'transition-western-star-v1.png':{lights:[[5,12,5,11]]},
  'church-ruins-v1.png':{aspect:1585/992,lights:[[17,46,3,7],[29,42,3,6],[57,43,3,6],[74,43,3,6],[86,48,3,6]]},
  'court-platforms-v1.png':{aspect:1586/992,lights:[[29,33,2,5],[48,30,2,5],[56,31,2,5],[72,35,2,5]]},
  'transition-uskwood-fire-v1.png':{lights:[[25,16,13,17],[46,24,15,16]]},
  'transition-valors-fastness-v1.png':{lights:[[68,32,10,12]]},
  'egorian-west-bridge-v1.png':{aspect:1586/992,lights:[[39,26,3,7],[61,26,3,7]]},
  'whisperwood-unicorn-glade-v1.png':{aspect:1586/992,water:[[88,10,3,4],[82,24,4,5],[85,40,4,5],[79,58,4,5]]},
  'transition-inferno-gate-v1.png':{lights:[[15,40,4,7],[49,40,19,19],[87,40,4,7]]},
  'transition-egorian-sting-v1.png':{lights:[[11,14,4,8],[16,17,4,8],[20,15,3,7]]},
  'transition-night-of-the-pale-v1.png':{lights:[[19,32,7,11],[38,38,4,7],[81,40,4,7]]},
  'transition-fourteenth-stone-v1.png':{lights:[[40,46,3,5],[52,50,3,5],[66,46,3,5]]},
  'transition-split-missions-v1.png':{lights:[[12,36,6,10,'violet'],[31,30,6,12,'violet']]},
  'dinyar-bridge-ward-v1.png':{aspect:1585/992,lights:[[16,58,3,7],[43,47,3,6],[58,47,3,6],[86,61,3,7]]},
  'transition-kintargo-safehouse-v1.png':{lights:[[31,33,7,8],[51,34,8,9],[73,40,6,8]]},
  'transition-pezzack-manse-v1.png':{lights:[[27,42,9,12],[53,27,12,16],[74,16,15,16]]},
  'transition-dusk-square-v1.png':{lights:[[11,39,4,8],[28,43,4,6],[79,44,4,7]]},
  'menador-twins-v1.png':{lights:[[5,28,4,8]]}
 };
 function setJourneyEffects(card,illustration){
  card.querySelector('.journey-effects')?.remove();
  const effects=journeyEffects[illustration];
  if(!effects)return;
  const layer=document.createElement('div');
  layer.className='journey-effects';
  layer.setAttribute('aria-hidden','true');
  layer.style.setProperty('--art-aspect',effects.aspect??4/3);
  for(const kind of ['lights','water']){
   for(const [index,[x,y,rx,ry,tint]] of (effects[kind]??[]).entries()){
    const patch=document.createElement('span');
    patch.className=kind==='lights'?'journey-light':'journey-water';
    if(tint)patch.classList.add(tint);
    patch.style.left=(x-rx)+'%';
    patch.style.top=(y-ry)+'%';
    patch.style.width=(rx*2)+'%';
    patch.style.height=(ry*2)+'%';
    patch.style.animationDelay=(-index*1.17)+'s';
    patch.style.animationDuration=((kind==='lights'?3.9:6.4)+index*.43)+'s';
    layer.append(patch);
   }
  }
  card.prepend(layer);
 }
 return {setJourneyEffects,worldFire,draw,paintDice,phase,install,load,citizenMeta,citizenPortrait,captive,captivePoints,banter,decree,hospiceLetter,world,smoke};
})();
