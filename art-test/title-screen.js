const TitleScreen=(()=>{
 let mode=null,started=0,poster,plain,masks=[],selection=false;
 const confirm=k=>['Enter','e','E',' ','a','A'].includes(k),back=k=>['Escape','b','B'].includes(k);
 const panel=()=>document.getElementById('title-screen');
 async function load(loader){
  [poster,plain]=await Promise.all(['title-card.png','title-background.png'].map(loader));
  const c=document.createElement('canvas');c.width=640;c.height=480;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(plain,0,0,640,480);
  let source;try{source=g.getImageData(0,0,640,480);}catch{masks=[];return;} // file:// browsers may disallow pixel reads; embers still animate.
  masks=[[0,120,100,170,'purple'],[440,130,200,180,'fire'],[0,230,50,60,'fire'],[590,230,50,60,'fire'],[80,405,500,75,'fire']].map(([x,y,w,h,color])=>{
   const m=document.createElement('canvas');m.width=640;m.height=480;const mg=m.getContext('2d'),pixels=mg.createImageData(640,480);
   for(let py=y;py<Math.min(480,y+h);py++)for(let px=x;px<Math.min(640,x+w);px++){
    const n=(py*640+px)*4,r=source.data[n],b=source.data[n+2],green=source.data[n+1];
    if(color==='purple'?b>120&&r>70&&b>green*1.5:r>200&&green>65&&green<210&&b<100){pixels.data[n]=r;pixels.data[n+1]=green;pixels.data[n+2]=b;pixels.data[n+3]=190;}
   }
   mg.putImageData(pixels,0,0);return m;
  });
 }
 function hide(){mode=null;panel().hidden=true;document.body.classList.remove('is-title');}
 function show(menu=false){
  Handheld.close();keys.clear();path=[];introOpen=true;selection=false;$('intro').hidden=true;$('prompt').hidden=true;$('dice-panel').hidden=true;
  document.body.classList.remove('is-combat');document.body.classList.add('is-intro','is-title');canvas.height=480;
  mode=menu?'menu':'prompt';started=performance.now();panel().hidden=false;panel().classList.toggle('menu-open',menu);
  $('title-push').hidden=menu;$('title-menu').hidden=!menu;panel().classList.toggle('booting',!menu&&!reduce.matches);
  if(menu)paint('main');else $('title-push').focus();
 }
 function buttons(rows){
  const box=$('title-options');box.replaceChildren();
  for(const [label,act,disabled=false] of rows){const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-label',label);b.title=label;b.disabled=disabled;b.onclick=()=>{GameAudio.effect('confirm');act();if(mode==='settings')box.querySelectorAll('button')[rows.findIndex(row=>row[0]===label)]?.focus();};box.append(b);}
  box.querySelector('button:not(:disabled)')?.focus();
 }
 function slot(n){try{return SaveFiles.decode(localStorage.getItem(SAVE+'-slot-'+n)||'');}catch{return null;}}
 function paint(view){
  mode=view==='main'?'menu':view;panel().dataset.view=view;panel().classList.add('menu-open');$('title-push').hidden=true;$('title-menu').hidden=false;
  $('title-menu-heading').textContent={main:'Main menu',load:'Load game',settings:'Settings',controls:'Controls'}[view];
  $('title-detail').hidden=true;
  if(view==='main')buttons([
   ['Continue',()=>reset(true),!readSave()],['New game',()=>{hide();reset();selection=true;}],
   ['Load game',()=>paint('load')],['Settings',()=>paint('settings')]
  ]);
  if(view==='load')buttons([
   ['Latest checkpoint',()=>reset(true),!readSave()],
   ...[1,2,3,4].map(n=>{const s=slot(n);return ['Slot '+n+(s?' · '+(scenes[s.scene]?.name||s.scene):' · Empty'),()=>{localStorage.setItem(SAVE,JSON.stringify(s));reset(true);},!s];}),
   ['Import save',()=>$('save-import').click()],['Back',()=>paint('main')]
  ]);
  if(view==='settings'){
   const s=GameAudio.settings();buttons([
    ['Music · '+s.music+'%',()=>{GameAudio.change('music');paint('settings');}],
    ['Effects · '+s.effects+'%',()=>{GameAudio.change('effects');paint('settings');}],
    [s.muted?'Sound · Off':'Sound · On',()=>{GameAudio.change('muted');paint('settings');}],
    ['Controls',()=>paint('controls')],['Back',()=>paint('main')]
   ]);
  }
  if(view==='controls'){
   $('title-detail').hidden=false;$('title-detail').textContent='D-pad / Arrows / WASD: Move & choose\nEnter / E: Confirm (handheld A)\nB / Escape: Back & pause';
   buttons([['Back',()=>paint('settings')]]);
  }
 }
 function key(e){
  if(!mode)return false;
  const d=KEY[e.key];
  if(confirm(e.key)&&!(e.key.toLowerCase()==='a'&&mode!=='prompt')){e.preventDefault();if(!e.repeat)(mode==='prompt'?$('title-push'):document.activeElement.closest('#title-options button'))?.click();}
  else if(back(e.key)){e.preventDefault();if(!e.repeat){if(mode==='menu')show();else if(mode!=='prompt')paint(mode==='controls'?'settings':'main');}}
  else if(d||e.key==='Tab'){e.preventDefault();if(mode!=='prompt')Handheld.navigate([...$('title-options').querySelectorAll('button')],e.key==='Tab'?(e.shiftKey?'up':'down'):d,1);}
  return true;
 }
 function draw(g,t){
  if(!mode||!poster)return false;
  g.save();g.imageSmoothingEnabled=false;g.drawImage(plain,0,0,640,480);
  // Keep the printed logos fixed while the underlying light sources flicker.
  g.drawImage(poster,0,0,poster.width,poster.height*.43,0,0,640,480*.43);
  if(!reduce.matches){
   g.globalCompositeOperation='screen';masks.forEach((m,i)=>{g.globalAlpha=.10+.075*Math.sin(t*(1.4+i*.12)+i*2)+.025*Math.sin(t*4+i);g.drawImage(m,0,0);});
   g.globalCompositeOperation='source-over';
   for(let i=0;i<20;i++){const life=(t*.11+i*.137)%1;g.globalAlpha=Math.sin(life*Math.PI)*.55;g.fillStyle=i%4?'#ffa735':'#c56aff';const x=i%4?90+(i*83)%480:32+(i*7)%45;g.fillRect(Math.round(x+Math.sin(life*5+i)*4),Math.round(465-life*(i%4?100:240)),i%3?1:2,2);}
  }
  g.globalAlpha=1;
  const age=performance.now()-started;
  if(mode==='prompt'&&!reduce.matches&&age<900){const brightness=age<140?.02:age<190?.45:age<260?.12:age<340?.72:Math.min(1,(age-240)/600);g.fillStyle='rgba(0,0,0,'+(1-brightness)+')';g.fillRect(0,0,640,480);}
  g.restore();return true;
 }
 function install(){ $('title-push').onclick=()=>paint('main'); }
 return {load,show,hide,draw,key,install,state:()=>mode,backFromSelection:()=>{if(!selection)return false;show(true);return true;}};
})();

