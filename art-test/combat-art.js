'use strict';
window.CombatArt=(()=>{
 const sources=['spell-effects-v1.png','attack-freya-v1.png','cast-party-v1.png','attack-party-v1.png'];
 async function load(loader){await Promise.all(sources.map(async src=>art[src]=await loader(src)));}
 function phase(a){return reduce.matches?.55:Math.min(1,(performance.now()-a.start)/a.duration);}
 function actor(g,u,v){const a=battle?.animation,acting=a?.actor===u&&['attack','special','mend'].includes(a.type),casting=acting&&(a.type==='mend'||a.type==='special'&&['jason','draymus'].includes(u.id));let src,row,index;
  if(acting){index=reduce.matches?1:phase(a)<.25?0:phase(a)<.78?1:2;if(casting){src='cast-party-v1.png';row=u.id==='jason'?0:1;}else if(u.id==='freya'){src='attack-freya-v1.png';row=inventory.equipped.freya==='scimitar'?1:0;}else{src='attack-party-v1.png';row=['jamal','guapo','jason','draymus'].indexOf(u.id);if(row<0)return false;}}
  else if(u.id==='freya'&&inventory.equipped.freya==='scimitar'){src='attack-freya-v1.png';row=1;index=2;}else return false;
  const meta=COMBAT_ART_FRAMES[src]?.[row],f=meta?.frames[index],im=art[src];if(!f||!im)return false;const scale=v.height/meta.maxHeight,pose=actionPose(u);g.save();g.imageSmoothingEnabled=false;g.translate(v.x+pose.dx+(!acting&&!reduce.matches?Math.sin(Handheld.time(performance.now()/1000)*1.6):0),v.y+pose.dy);g.rotate(pose.tilt);if(hp[u.id]===0)g.globalAlpha=.25;else if(u.flash>0&&!reduce.matches)g.globalAlpha=.65;g.drawImage(im,f.x,f.y,f.w,f.h,(f.x-f.anchorX)*scale,(f.y-f.anchorY)*scale,f.w*scale,f.h*scale);g.restore();return true;
 }
 function effect(g,a){const healing=['potion','mend'].includes(a.type),row=healing?1:a.type==='special'&&a.actor.id==='jason'?0:a.type==='special'&&a.actor.id==='draymus'?2:-1;if(row<0)return false;if(!a.hit&&!healing)return true;const to=battlePosition(a.target||a.actor),p=phase(a),frame=reduce.matches?3:Math.min(7,Math.floor(p*8)),f=COMBAT_ART_FRAMES['spell-effects-v1.png'][row].frames[frame],size=healing?96:104;g.save();g.imageSmoothingEnabled=false;g.globalAlpha=reduce.matches?.65:1;g.drawImage(art['spell-effects-v1.png'],f.x,f.y,f.w,f.h,to.x-size/2,to.y-to.height*.6-size/2,size,size);g.restore();return true;}
 return {load,actor,effect,phase};
})();
