'use strict';
// Opening score files with synthesized fallback cues for the rest of the campaign.
window.GameAudio=(()=>{
 const key='hells-bubbies-audio-v1',defaults={version:2,music:null,effects:null,muted:false};let settings={...defaults},context=null,musicGain,effectsGain,nextNote=0,beat=0,mode='',variant=0,lastBattle=null,lastEffect='',file=null,fileCue='',failedCue='';
 const validVolume=n=>Number.isInteger(n)&&n>=0&&n<=100;
 try{
  const saved=JSON.parse(localStorage.getItem(key)||'null');
  if(saved&&typeof saved.muted==='boolean'){
   settings.muted=saved.muted;
   for(const [field,legacyDefault] of [['music',25],['effects',45]]){
    const value=saved[field];
    if(validVolume(value)&&(saved.version===2||value!==legacyDefault))settings[field]=value;
   }
  }
 }catch{}
 const cues={gate_watch:[40,43,47,42,40,38,43,47],church_watch:[40,47,52,55,52,48,47,43],escape_jail:[38,45,41,48,40,47,42,45],gramel_gate:[40,43,47,42,40,38,43,47],execution_square:[36,43,40,47,38,45,41,43],title:[45,52,57,55,52,50,48,52],street:[45,48,52,47,45,43,40,43],western_star:[48,55,60,59,55,52,50,55],remesiana:[50,57,60,62,57,55,53,57],longacre_square:[43,50,55,53,50,48,46,50],rohalendi_hospice:[48,52,55,59,55,52,50,52],longacre_church:[40,47,52,55,52,48,47,43],combat:[[45,45,52,48,47,47,50,43],[43,50,46,53,45,52,47,50],[40,47,43,50,42,49,45,52]]};
 function currentCue(){
  if(typeof battle!=='undefined'&&battle)return battle.kind==='temple'?'silver-star-battle':'combat';
  if(typeof introOpen!=='undefined'&&introOpen)return $('intro').hidden?'title':'selection';
  if(typeof briefingOpen!=='undefined'&&briefingOpen)return 'briefing';
  return typeof scene==='undefined'?'title':scene;
 }
 const openingCues=new Set(['title','selection','briefing','street','tavern','temple','silver-star-battle']);
 function volume(field){
  return settings[field]??(field==='effects'?100:openingCues.has(currentCue())?25:50);
 }
 function effectiveSettings(){return {music:volume('music'),effects:volume('effects'),muted:settings.muted};}
 function gains(){
  if(!context)return;
  const {music,effects,muted}=effectiveSettings();
  musicGain.gain.setTargetAtTime(muted?0:music/100,context.currentTime,.06);
  effectsGain.gain.setTargetAtTime(muted?0:effects/100,context.currentTime,.03);
  if(file)file.volume=muted?0:music/100;
 }
 function unlock(){if(!context){const Constructor=window.AudioContext||window.webkitAudioContext;if(!Constructor)return;context=new Constructor();musicGain=context.createGain();effectsGain=context.createGain();musicGain.connect(context.destination);effectsGain.connect(context.destination);gains();}if(context.state==='suspended')context.resume().catch(()=>{});}
 function tone(midi,duration,gain,type,bus,when=context?.currentTime){if(!context||context.state!=='running')return;const osc=context.createOscillator(),amp=context.createGain();osc.type=type;osc.frequency.value=440*Math.pow(2,(midi-69)/12);amp.gain.setValueAtTime(0,when);amp.gain.linearRampToValueAtTime(gain,when+.015);amp.gain.exponentialRampToValueAtTime(.0001,when+duration);osc.connect(amp);amp.connect(bus);osc.start(when);osc.stop(when+duration+.03);osc.onended=()=>{osc.disconnect();amp.disconnect();};}
 function effect(kind){
  if(!context||context.state!=='running'||settings.muted||volume('effects')===0)return;
  lastEffect=kind;
  const at=context.currentTime;
  if(kind==='dice'){
   [52,46,57,43].forEach((pitch,i)=>tone(pitch,.072,.032-i*.004,'triangle',effectsGain,at+i*.063));
   return;
  }
  if(kind==='dice-result'){
   tone(50,.09,.043,'triangle',effectsGain,at);
   tone(67,.12,.022,'sine',effectsGain,at+.025);
   return;
  }
  const notes=kind==='heal'?[72,76,79]:kind==='fire'?[40,52,64]:kind==='spell'?[64,67,55]:kind==='hit'?[49,40]:kind==='miss'?[55,48]:kind==='confirm'?[67,74]:[60];
  notes.forEach((pitch,i)=>tone(pitch,kind==='confirm'?.095:.13,kind==='confirm'?.038:.055,
   kind==='fire'||kind==='hit'?'triangle':'sine',effectsGain,at+i*.045));
 }
 function tick(){if(!context||context.state!=='running'||document.hidden)return;const next=currentCue();if(next==='combat'&&battle!==lastBattle){variant=(variant+1)%3;lastBattle=battle;}if(next!==mode){mode=next;beat=0;nextNote=context.currentTime+.08;failedCue='';gains();}
  const selected=mode==='combat'?'combat-'+(variant+1):mode,path=window.MUSIC_TRACKS?.[selected];if(path&&failedCue!==selected){if(fileCue!==selected){if(file)file.pause();const track=new Audio(path);track.loop=true;file=track;fileCue=selected;gains();track.play().catch(()=>{if(file!==track||fileCue!==selected||document.hidden)return;failedCue=selected;track.pause();fileCue='';});}return;}if(file&&fileCue){file.pause();fileCue='';}if(settings.muted||volume('music')===0){nextNote=context.currentTime+.1;return;}if(nextNote<context.currentTime-.1)nextNote=context.currentTime+.04;const fighting=mode==='combat'||mode==='silver-star-battle';const sequence=fighting?cues.combat[variant]:cues[mode]||cues.street,step=fighting?.32:.78;
  while(nextNote<context.currentTime+.15){const note=sequence[beat%sequence.length];tone(note,step*2,.065,'sine',musicGain,nextNote);if(beat%2===0)tone(note+12,step*.7,.012,'triangle',musicGain,nextNote);if(fighting)tone(note-12,.15,.03,'triangle',musicGain,nextNote);beat++;nextNote+=step;}
 }
 function change(field){if(field==='muted')settings.muted=!settings.muted;else if(['music','effects'].includes(field))settings[field]=[0,25,50,75,100].find(n=>n>volume(field))??0;try{localStorage.setItem(key,JSON.stringify(settings));}catch{}gains();return effectiveSettings();}
 function install(){for(const event of ['pointerdown','keydown'])document.addEventListener(event,e=>{if(e.isTrusted){unlock();if(failedCue)failedCue='';tick();}},{capture:true});document.addEventListener('visibilitychange',()=>{if(document.hidden){context?.suspend().catch(()=>{});file?.pause();}else if(context){context.resume().catch(()=>{});nextNote=context.currentTime+.1;if(file&&fileCue)file.play().catch(()=>{});}});}
 return {install,tick,effect,change,settings:effectiveSettings,status:()=>({ready:!!context,mode,variant,fileCue,failedCue,lastEffect,playing:!!fileCue&&!file.paused})};
})();
window.MUSIC_TRACKS=Object.fromEntries(
 ['title','selection','briefing','street','tavern','temple','silver-star-battle']
  .map(cue=>[cue,'art-test/music/'+cue+'.ogg'])
);
