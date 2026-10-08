/* Background -> foreground floor -> actors -> optional occluders. */
window.SceneLayers=(()=>{const tiles=new Map();
function oceanTile(palette){const key=palette.join(',');if(tiles.has(key))return tiles.get(key);const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle=palette[0];g.fillRect(0,0,256,256);for(let i=0;i<110;i++){const x=(i*73+19)%256,y=(i*47+11)%256,w=7+(i*17)%27;g.fillStyle=palette[1+i%3];g.globalAlpha=.35+(i%4)*.1;g.fillRect(x,y,w,1+i%2);if(x+w>256)g.fillRect(x-256,y,w,1+i%2);}g.globalAlpha=1;tiles.set(key,c);return c;}
function background(g,map,t,{width=640,height=400,reduced=false}={}){const b=map.background||{type:'solid',color:'#0b1018'};g.save();g.imageSmoothingEnabled=false;if(b.type==='ocean'){const tile=oceanTile(b.palette),phase=reduced?0:Math.floor(t*(b.speed||5))%256;const vertical=reduced?0:Math.floor(t*(b.speed||5)/3)%256;for(let y=-256+vertical;y<height;y+=256)for(let x=-256+phase;x<width;x+=256)g.drawImage(tile,x,y);}else{g.fillStyle=b.color||'#0b1018';g.fillRect(0,0,width,height);}g.restore();}
function foreground(g,image,{width=640,height=400}={}){if(!image)return;g.save();g.imageSmoothingEnabled=false;g.drawImage(image,0,0,width,height);g.restore();}
function draw(g,map,image,t,options={}){background(g,map,t,options);foreground(g,image,options);}
function occluders(g,image,options={}){foreground(g,image,options);}
return {background,foreground,draw,occluders};})();
