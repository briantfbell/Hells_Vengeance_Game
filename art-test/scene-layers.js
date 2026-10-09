/* Background -> foreground floor -> actors -> optional occluders. */
window.SceneLayers=(()=>{const tiles=new Map();
function oceanTile(palette){const key=palette.join(',');if(tiles.has(key))return tiles.get(key);const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle=palette[0];g.fillRect(0,0,256,256);for(let i=0;i<110;i++){const x=(i*73+19)%256,y=(i*47+11)%256,w=7+(i*17)%27;g.fillStyle=palette[1+i%3];g.globalAlpha=.35+(i%4)*.1;g.fillRect(x,y,w,1+i%2);if(x+w>256)g.fillRect(x-256,y,w,1+i%2);}g.globalAlpha=1;tiles.set(key,c);return c;}
function background(g,map,t,{width=640,height=400,top=0,bottom=height,reduced=false}={}){const b=map.background||{type:'solid',color:'#0b1018'};g.save();g.imageSmoothingEnabled=false;if(b.type==='ocean'){const tile=oceanTile(b.palette),phase=reduced?0:Math.floor(t*(b.speed||5))%256;const vertical=reduced?0:Math.floor(t*(b.speed||5)/3)%256;for(let y=Math.floor((top-vertical)/256)*256+vertical;y<bottom;y+=256)for(let x=-256+phase;x<width;x+=256)g.drawImage(tile,x,y);if(b.waterline!==undefined){g.fillStyle=b.landColor||'#18252c';g.fillRect(0,top,width,b.waterline*height/400-top);}}else{g.fillStyle=b.color||'#0b1018';g.fillRect(0,top,width,bottom-top);if(b.surface){const s=b.surface;g.fillStyle=s.color;g.fillRect(s.x*width/640,s.y*height/400,s.w*width/640,s.h*height/400);}}g.restore();}
function foreground(g,image,{width=640,height=400}={}){if(!image)return;g.save();g.imageSmoothingEnabled=false;g.drawImage(image,0,0,width,height);g.restore();}
function draw(g,map,image,t,options={}){background(g,map,t,options);if(map.openGatePatch&&art.longacre_jail){
 foreground(g,art.longacre_jail,options);g.save();const sx=(options.width||640)/1586,sy=(options.height||400)/992;
 const door=[[415,235],[430,211],[456,190],[488,176],[519,182],[544,197],[567,221],[584,245],[584,365],[415,393]];
 g.beginPath();door.forEach(([x,y],i)=>i?g.lineTo(x*sx,y*sy):g.moveTo(x*sx,y*sy));g.closePath();g.clip();foreground(g,image,options);g.restore();
 }else foreground(g,image,options);}
function occluders(g,image,options={}){foreground(g,image,options);}
return {background,foreground,draw,occluders};})();
