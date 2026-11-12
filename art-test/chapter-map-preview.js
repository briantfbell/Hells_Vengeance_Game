"use strict";

window.ChapterMapPreview=(()=>{
 const tile=16,columns=40,rows=25;
 const layouts={
  'warlock-library-v1':{
   spawn:[328,376],
   walk:[
    [288,160,64,240],[272,160,96,32],[96,240,448,32],
    [80,224,64,32],[64,144,64,96],[80,112,64,48],[112,80,64,48],
    [160,64,80,32],[224,48,192,32],[400,64,80,32],[464,80,80,48],
    [512,224,48,32],[528,144,48,96],[544,96,48,64],[560,48,48,64]
   ],
   points:[{label:'Reading dais',x:328,y:184},{label:'Gallery passage',x:584,y:56}]
  },
  'warlock-archive-v1':{
   spawn:[328,376],
   walk:[
    [272,320,64,80],[32,288,576,32],[64,240,80,48],[64,176,16,64],
    [272,224,32,64],[224,208,112,32],[464,240,48,48],[464,128,32,112],
    [368,112,224,32],[560,96,32,48],[544,32,32,80]
   ],
   points:[{label:'Document stacks',x:72,y:248},{label:'Display gallery',x:472,y:184}]
  },
  'barleybridge-throne-v1':{
   spawn:[328,376],
   walk:[[304,288,48,112],[144,144,352,160],[256,112,128,48],[480,160,128,32],[560,112,48,64]],
   points:[{label:'Audience dais',x:328,y:120},{label:'East stairs',x:584,y:120}]
  },
  'barleybridge-basement-v1':{
   spawn:[328,376],
   walk:[[288,368,64,32],[272,224,96,160],[96,96,448,144],[288,32,64,80]],
   points:[{label:'Cask storage',x:168,y:104},{label:'Service bench',x:472,y:104},{label:'North stairs',x:328,y:56}]
  },
  'barleybridge-town-v1':{
   spawn:[328,376],
   walk:[[288,224,64,176],[80,192,496,48],[112,160,416,32],[240,112,224,48],[448,144,80,48]],
   occluder:[288,240,64,64],
   points:[{label:'Market square',x:328,y:200},{label:'Inn lane',x:184,y:168},{label:'Pagoda lane',x:472,y:152}]
  }
 };
 const cast={
  barleybridge_bowman:{name:'Barleybridge Bowman',caption:'Composite longbow · ready, draw and recover',src:'barleybridge-bowman-v1.png',frames:[
   {x:72,y:10,w:472,h:705,anchorX:362},
   {x:794,y:0,w:528,h:715,anchorX:1124},
   {x:1520,y:11,w:473,h:704,anchorX:1811}
  ]},
  barleybridge_guard:{name:'Barleybridge Guardsman',caption:'Glaive · watch, thrust and ready',src:'barleybridge-guard-v1.png',frames:[
   {x:149,y:2,w:303,h:719,anchorX:315},
   {x:556,y:108,w:854,h:613,anchorX:1085},
   {x:1519,y:88,w:569,h:633,anchorX:1810}
  ]}
 };
 const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1],
  a:[-1,0],d:[1,0],w:[0,-1],s:[0,1]};
 let selected=null,position=null,showPaths=false;

 function passable(layout,x,y){
  return x>=0&&x<columns*tile&&y>=0&&y<rows*tile&&layout.walk.some(([left,top,width,height])=>
   x>=left&&x<left+width&&y>=top&&y<top+height);
 }
 function select(id){
  selected=layouts[id]||null;
  position=selected?[...selected.spawn]:null;
 }
 function key(event){
  const direction=directions[event.key]||directions[event.key.toLowerCase()];
  if(!selected||!direction)return;
  event.preventDefault();
  const next=position.map((coordinate,index)=>coordinate+direction[index]*tile);
  if(passable(selected,...next))position=next;
 }
 function togglePaths(){showPaths=!showPaths;return showPaths;}
 function draw(g,{font='11px system-ui'}={}){
  if(!selected)return;
  g.save();
  if(showPaths){
   g.fillStyle='#84b09340';
   for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
    const x=col*tile,y=row*tile;
    if(passable(selected,x+tile/2,y+tile/2))g.fillRect(x+1,y+1,tile-2,tile-2);
   }
  }
  g.font=font;
  g.textAlign='center';
  for(const {label,x,y} of selected.points){
   g.fillStyle='#13141ddd';
   const width=Math.ceil(g.measureText(label).width)+10;
   g.fillRect(x-width/2,y-24,width,15);
   g.fillStyle='#f0d8aa';
   g.fillText(label,x,y-13);
   g.fillRect(x-2,y-2,5,5);
  }
  const [x,y]=position;
  const roof=selected.occluder;
  if(roof&&x>=roof[0]&&x<roof[0]+roof[2]&&y>=roof[1]&&y<roof[1]+roof[3])g.globalAlpha=.35;
  g.fillStyle='#201722';
  g.fillRect(x-5,y-5,11,11);
  g.fillStyle='#f2b956';
  g.fillRect(x-3,y-3,7,7);
  g.restore();
 }
 return {layouts,cast,select,key,passable,togglePaths,draw};
})();
