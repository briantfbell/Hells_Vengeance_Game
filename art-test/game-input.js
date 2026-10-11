"use strict";
// Standard browser Gamepad mapping; the native handheld adapter remains separate.
window.GameInput=(()=>{
 const directions=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
 function sample(pad){
  if(!pad||pad.mapping!=='standard')return null;
  const pressed=i=>!!pad.buttons[i]?.pressed||pad.buttons[i]?.value>.5;
  const x=pad.axes[0]||0,y=pad.axes[1]||0,held=new Set();
  [12,13,14,15].forEach((b,i)=>{if(pressed(b))held.add(directions[i]);});
  if(Math.abs(x)>.55)held.add(x<0?'ArrowLeft':'ArrowRight');
  if(Math.abs(y)>.55)held.add(y<0?'ArrowUp':'ArrowDown');
  [[0,'Enter'],[1,'B'],[2,'i'],[3,'o'],[8,'F1'],[9,'p']].forEach(([b,k])=>{if(pressed(b))held.add(k);});
  return held;
 }
 function create(){
  let previous=new Set(),active=new Set(),next=new Map(),mode=null,armed=false,bRun=false;
  const release=()=>{const events=[...active].map(key=>({type:'keyup',key}));active.clear();next.clear();return events;};
  function reset(){const events=release();previous.clear();armed=false;mode=null;bRun=false;return events;}
  function tick(held,context,now){
   if(!held||context==='blocked'){return reset();}
   const events=[];
   if(context!==mode){events.push(...release());mode=context;armed=false;bRun=false;}
   // A held button cannot confirm the next screen or move after focus returns.
   if(!armed){previous=new Set(held);if(!held.size)armed=true;return events;}
   const down=(key,repeat=false)=>{events.push({type:'keydown',key,repeat});if(!repeat)active.add(key);};
   const up=key=>{if(active.delete(key))events.push({type:'keyup',key});next.delete(key);};
   const moving=directions.some(k=>held.has(k));
   if(context==='world'&&held.has('B')&&moving){bRun=true;if(!active.has('Shift'))down('Shift');}
   else up('Shift');
   if(context==='world'&&previous.has('B')&&!held.has('B')){if(!bRun){down('Escape');up('Escape');}bRun=false;}
   for(const key of [...active])if(!held.has(key==='Escape'?'B':key)&&key!=='Shift')up(key);
   for(const key of held){
    if(key==='B'&&context==='world')continue;
    const mapped=key==='B'?'Escape':key;
    if(!previous.has(key)){down(mapped);if(directions.includes(key))next.set(mapped,now+350);}
    else if(context==='menu'&&directions.includes(key)&&now>=(next.get(mapped)??Infinity)){down(mapped,true);next.set(mapped,now+110);}
   }
   // Escape is mapped from B; release against its physical button rather than its logical key.
   if(active.has('Escape')&&!held.has('B'))up('Escape');
   previous=new Set(held);return events;
  }
  return {tick,reset};
 }
 let installed=false,statusText='No controller detected',driver=create(),emit,context,padIndex=null;
 function status(){return statusText;}
 function install(options){
  if(installed)return;installed=true;emit=options.emit;context=options.context;
  const release=()=>driver.reset().forEach(emit);
  window.addEventListener('blur',release);document.addEventListener('visibilitychange',release);
  function poll(now){
   let pad=null;
   try{const pads=Array.from(navigator.getGamepads?.()||[]).filter(p=>p?.connected);pad=pads.find(p=>p.index===padIndex&&p.mapping==='standard')||pads.find(p=>p.mapping==='standard');statusText=pad?'Controller connected · standard mapping':pads.length?'Controller needs standard mapping':'No controller detected';}catch{statusText='Controller access unavailable';}
   const index=pad?.index??null;if(index!==padIndex){release();padIndex=index;}
   const focused=!document.hidden&&document.hasFocus();driver.tick(focused?sample(pad):null,focused?context():'blocked',now).forEach(emit);
   requestAnimationFrame(poll);
  }
  requestAnimationFrame(poll);
 }
 return {sample,create,install,status};
})();
