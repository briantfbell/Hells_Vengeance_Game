"use strict";
// Deliberate game tactics, not claims about historical Pathfinder feats.
window.EnemyTactics=(()=>{
 function plan(enemies,units,hp,stats,round){
  const live=units.filter(u=>hp[u.id]>0);
  enemies.forEach((e,i)=>{
   e.intent=null;if(e.hp<=0||!live.length)return;
   let target=live[(round-1+i)%live.length],move='Strike',extra=0;
   if(e.id==='cultist'){target=live.reduce((a,b)=>hp[b.id]/stats[b.id].hp<hp[a.id]/stats[a.id].hp?b:a);move='Press';}
   else if(e.id==='ovinnik'){move=round%2?'Heavy claw':'Claw';extra=round%2?3:0;}
   else if(e.id==='bolgart_wereboar'){if(round===1)target=live.find(u=>u.id==='jamal')||target;move=round%2?'Gore charge':'Tusk strike';extra=round%2?3:0;}
   else if(e.id==='bolgart'){move='Brawling swing';target=live[(round-1)%Math.min(2,live.length)];}
   else if(e.id==='viggo'){move=round%2?'Scimitar cut':'Heavy slash';extra=round%2?0:2;}
   else if(e.id==='false_knight'){move=round%2?'Sword strike':'Heavy strike';extra=round%2?0:2;}
   else if(e.id==='jalila'){move=round%2?'Unarmed strike':'Driving palm';extra=round%2?0:2;}
   else if(e.id==='kantaria_guard'){move='Sword strike';}
   else if(e.id==='court_rhona'){move=round%2?'Twin hand axes':'Press the crossing';extra=round%2?1:0;}
   else if(e.id==='lencia'){move=round%2?'Longsword cut':'Shield-led strike';extra=round%2?0:2;}
   else if(e.id==='court_ranger'){move='Hand axe';}
   else if(e.id==='manticore'){move=round%2?'Tail-spine volley':'Diving claws';extra=round%2?0:2;target=live.find(u=>u.id==='jason')||target;}
   else if(e.id==='armory_bo'){target=live.find(u=>u.id==='freya')||target;move='Repeating crossbow';}
   else if(e.id==='armory_dent'){move='Longsword';}
   else if(e.id==='heist_ranger'){move='Hand axe';}
   else if(e.id==='porch_guard'){move='Sword strike';}
   else if(e.id==='church_acolyte'){move='Sword cut';}
   else if(['twin1','twin2'].includes(e.id)){move='Heavy mace';}
   else if(e.id==='allamar'){move=round%2?'Sword strike':'Spiritual sword';extra=round%2?0:2;}
   else if(e.id==='celestial_wolf'){move='Celestial bite';}
   e.intent={target:target.id,move,extra,heavy:extra>0,round};
  });
 }
 const damage=(value,guard)=>guard?Math.max(1,Math.floor(value/2)):value;
 const preview=(enemy,names)=>enemy.intent?enemy.name+' · '+enemy.intent.move+' → '+names[enemy.intent.target]:'';
 return {plan,damage,preview};
})();
