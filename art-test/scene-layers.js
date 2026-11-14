/* Background -> foreground floor -> actors -> optional occluders. */
window.SceneLayers=(()=>{const tiles=new Map();
function oceanTile(palette){const key=palette.join(',');if(tiles.has(key))return tiles.get(key);const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle=palette[0];g.fillRect(0,0,256,256);for(let i=0;i<110;i++){const x=(i*73+19)%256,y=(i*47+11)%256,w=7+(i*17)%27;g.fillStyle=palette[1+i%3];g.globalAlpha=.24+(i%4)*.075;g.fillRect(x,y,w,1+i%2);if(x+w>256)g.fillRect(x-256,y,w,1+i%2);}g.globalAlpha=1;tiles.set(key,c);return c;}
function background(g,map,t,{width=640,height=400,top=0,bottom=height,reduced=false}={}){const b=map.background||{type:'solid',color:'#0b1018'};g.save();g.imageSmoothingEnabled=false;if(b.type==='ocean'){const tile=oceanTile(b.palette),phase=reduced?0:Math.floor(t*(b.speed||5)*.8)%256;const vertical=reduced?0:Math.floor(t*(b.speed||5)*.2)%256;for(let y=Math.floor((top-vertical)/256)*256+vertical;y<bottom;y+=256)for(let x=-256+phase;x<width;x+=256)g.drawImage(tile,x,y);if(b.waterline!==undefined){g.fillStyle=b.landColor||'#18252c';g.fillRect(0,top,width,b.waterline*height/400-top);}}else if(b.type==='sky'){
 const dusk=g.createLinearGradient(0,top,0,bottom);
 dusk.addColorStop(0,'#121826');
 dusk.addColorStop(.55,'#32384d');
 dusk.addColorStop(1,'#685260');
 g.fillStyle=dusk;
 g.fillRect(0,top,width,bottom-top);
}else{g.fillStyle=b.color||'#0b1018';g.fillRect(0,top,width,bottom-top);if(b.surface){const s=b.surface;g.fillStyle=s.color;g.fillRect(s.x*width/640,s.y*height/400,s.w*width/640,s.h*height/400);}}g.restore();}
function foreground(g,image,{width=640,height=400,contain=false}={}){
 if(!image)return;
 const scale=contain?Math.min(width/image.width,height/image.height):null;
 const w=contain?Math.round(image.width*scale):width,h=contain?Math.round(image.height*scale):height;
 g.save();g.imageSmoothingEnabled=false;
 g.drawImage(image,Math.round((width-w)/2),Math.round((height-h)/2),w,h);
 g.restore();
}
function channelPath(g,channels,width,height){
 for(const channel of channels){
  channel.forEach(([x,y],i)=>g[i?'lineTo':'moveTo'](x*width/640,y*height/400));
  g.closePath();
 }
}
function drawWaterChannels(g,map,image,t,options){
 const {width=640,height=400,reduced=false}=options;
 foreground(g,image,{...options,contain:map.contain});
 if(reduced)return;
 const {speed=5,palette=['#8bbca5','#b6d8ba'],direction='down'}=map.waterCurrent||{};
 const flowsDown=direction==='down';
 g.save();
 g.scale(width/640,height/400);
 map.waterChannels.forEach((channel,channelIndex)=>{
  const xs=channel.map(([x])=>x),ys=channel.map(([,y])=>y);
  const left=Math.min(...xs),top=Math.min(...ys);
  const w=Math.max(...xs)-left,h=Math.max(...ys)-top;
  const count=Math.max(8,Math.min(44,Math.round(w*h/1800)));
  g.save();
  g.beginPath();
  channelPath(g,[channel],640,400);
  g.clip();
  for(let i=0;i<count;i++){
   const offset=i+channelIndex*19;
   const distance=flowsDown?h:w;
   const phase=(offset*.381966+t*speed/(distance+14))%1;
   const cross=offset*.618034%1;
   const x=Math.floor(left+w*(flowsDown?cross:phase));
   const y=Math.floor(top+h*(flowsDown?phase:cross));
   const strength=.045+.04*(.5+.5*Math.sin(t*1.4+offset*2.4));
   g.globalAlpha=strength*Math.min(1,phase*10,(1-phase)*10);
   g.fillStyle=palette[i%palette.length];
   g.fillRect(x,y,4+offset%8,1);
  }
  g.restore();
 });
 g.restore();
}
function draw(g,map,image,t,options={}){background(g,map,t,options);map.drawUnderlay?.(g,t,options);if(map.waterChannels){drawWaterChannels(g,map,image,t,options);return;}if(map.openGatePatch&&art.longacre_jail){
 foreground(g,art.longacre_jail,options);g.save();const sx=(options.width||640)/1586,sy=(options.height||400)/992;
 const door=[[415,235],[430,211],[456,190],[488,176],[519,182],[544,197],[567,221],[584,245],[584,365],[415,393]];
 g.beginPath();door.forEach(([x,y],i)=>i?g.lineTo(x*sx,y*sy):g.moveTo(x*sx,y*sy));g.closePath();g.clip();foreground(g,image,options);g.restore();
 }else foreground(g,image,map.contain?{...options,contain:true}:options);}
function occluders(g,image,options={}){foreground(g,image,options);}
return {background,foreground,draw,occluders};})();
