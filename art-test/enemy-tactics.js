"use strict";
// Deliberate game tactics, not claims about historical Pathfinder feats.
window.EnemyTactics=(()=>{
 function plan(enemies,units,hp,stats,round){
  const live=units.filter(u=>hp[u.id]>0);
  enemies.forEach((e,i)=>{
   e.intent=null;if(e.hp<=0||!live.length)return;
   let target=live[(round-1+i)%live.length],move='Strike',extra=0,effect=null,physical=true;
   if(e.id==='cultist'){target=live.reduce((a,b)=>hp[b.id]/stats[b.id].hp<hp[a.id]/stats[a.id].hp?b:a);move='Press';}
   else if(e.id==='ovinnik'){move=round%2?'Heavy claw':'Claw';extra=round%2?3:0;}
   else if(e.id==='bolgart_wereboar'){if(round===1)target=live.find(u=>u.id==='jamal')||target;move=round%2?'Gore charge':'Tusk strike';extra=round%2?3:0;}
   else if(e.id==='bolgart'){move='Brawling swing';target=live[(round-1)%Math.min(2,live.length)];}
   else if(e.id==='viggo'){move=round%2?'Scimitar cut':'Heavy slash';extra=round%2?0:2;}
   else if(e.id==='false_knight'){move=round%2?'Sword strike':'Heavy strike';extra=round%2?0:2;}
   else if(e.id==='jonas'){move='Cutlass strike';}
   else if(e.id==='angel_bro'){move=round%2?'Longsword cut':'Heavy sword strike';extra=round%2?0:2;}
   else if(e.id==='jalila'){move=round%2?'Unarmed strike':'Driving palm';extra=round%2?0:2;}
   else if(e.id==='lamashtu_sentry'){move='Curved blade';}
   else if(e.id==='lamashtu_adept'){move=round%2?'Staff strike':'Heavy staff';extra=round%2?0:2;}
   else if(e.id==='kantaria_guard'){move='Sword strike';}
   else if(e.id==='fastness_paladin'){move=round%2?'Sword cut':'Shield-led strike';extra=round%2?0:2;}
   else if(e.id==='fastness_cleric'){move='Mace strike';}
   else if(e.id==='fastness_mage'){move=round%2?'Arcane bolt':'Charged bolt';extra=round%2?0:3;effect='arcaneBolt';physical=false;}
   else if(e.id==='fastness_warpriest'){move=round%2?'Warhammer strike':'Overhead hammer';extra=round%2?0:2;}
   else if(e.id==='south_road_knight'){move=round%2?'Lance charge':'Cavalry thrust';extra=round%2?2:0;}
   else if(e.id==='oppian'){move=round%2?'Sword cut':'Heavy sword cut';extra=round%2?0:2;}
   else if(e.id==='fastness_archon'){move=round%2?'Greatsword cut':'Radiant strike';extra=round%2?0:2;}
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
   else if(e.id==='allamar'){move=round%2?'Sword strike':'Spiritual sword';extra=round%2?0:2;physical=round%2!==0;}
   else if(e.id==='celestial_wolf'){move='Celestial bite';}
   // Rank-and-file pairs focus together; intentions remain visible while initiative determines when they act.
   if(['kantaria_guard','court_ranger','church_acolyte','heist_ranger'].includes(e.id))target=live[(round-1+Math.floor(i/2))%live.length];
   e.intent={target:target.id,move,extra,heavy:extra>0,round,effect,physical,canMend:e.id==='fastness_cleric'&&round%2===0,battlePrayer:e.id==='fastness_warpriest'&&round%2===0&&!e.prayerSpent};
  });
 }
 function defense(target,enemies,stats){
  const covered=target.resolve&&enemies.some(enemy=>enemy.id==='fastness_archon'&&enemy.hp>0);
  return stats[target.id].ac+(covered?2:0);
 }
 const damage=(value,guard,armor=0)=>{const through=Math.max(0,value-armor);return guard&&through>0?Math.max(1,Math.floor(through/2)):through;};
 const preview=(enemy,names)=>enemy.intent?enemy.name+' · '+(enemy.actedRound===enemy.intent.round?'Done this round':(enemy.intent.canMend?'Mend if an ally is wounded':enemy.intent.battlePrayer?'Battle prayer at half HP':enemy.intent.move+' → '+names[enemy.intent.target])):'';
 return {plan,defense,damage,preview};
})();
