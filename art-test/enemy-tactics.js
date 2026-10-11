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
