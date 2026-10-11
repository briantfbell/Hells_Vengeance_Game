"use strict";
// Provisional game modifiers. Later Foundry sheets do not establish early initiative bonuses.
window.Initiative=(()=>{
 const party={freya:2,jamal:4,jason:0,draymus:1,guapo:3,reese:4};
 function roll(units,enemies,names,d20){
  const entries=[...units.map((u,index)=>({side:'party',index,name:names[u.id],modifier:party[u.id]??0})),...enemies.map((e,index)=>({side:'enemy',index,name:e.name,modifier:0}))];
  entries.forEach((e,index)=>{e.die=d20();e.total=e.die+e.modifier;e.tie=index;});
  return entries.sort((a,b)=>b.total-a.total||b.modifier-a.modifier||a.tie-b.tie);
 }
 function actor(entry,units,enemies){return entry&&(entry.side==='party'?units:enemies)[entry.index];}
 function eligible(entry,units,enemies,hp,round,paralyzed){const u=actor(entry,units,enemies);return !!u&&(entry.side==='enemy'?u.hp>0:hp[u.id]>0&&!(u.id===paralyzed&&round===1));}
 function next(order,turn,units,enemies,hp,round,paralyzed){for(let offset=1;offset<=order.length;offset++){const n=turn+offset,index=n%order.length;if(eligible(order[index],units,enemies,hp,round+(n>=order.length?1:0),paralyzed))return order[index];}return null;}
 return {roll,actor,eligible,next,partyModifiers:party};
})();
