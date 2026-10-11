const {test}=require('node:test'),assert=require('node:assert/strict');
const {create}=require('../scripts/combat-balance.cjs');
test('announced responses follow the target turn; Guard protects and each enemy acts only once per round',async()=>{
 const c={name:'Response fixture',kind:'deputies',roster:['freya','jason','jamal','draymus'],enemies:['deputy1']};
 const setup=()=>{const w=create(c,1001);w.enemies[0].hp=100;w.rollDice=async()=>24;w.damage=async()=>8;return w;};
 const guarded=setup(),attacking=setup(),before=guarded.hp.freya;
 await guarded.performActionImpl('guard');await attacking.performActionImpl('attack');
 assert.equal(guarded.hp.freya,before-4);assert.equal(attacking.hp.freya,before-8);
 assert.equal(guarded.battle.turn,1);assert.equal(guarded.enemies[0].actedRound,1);
 for(let i=0;i<3;i++)await guarded.performActionImpl('attack');
 assert.equal(guarded.hp.freya,before-4,'end-of-round phase cannot repeat the response');
 assert.equal(guarded.battle.round,2);assert.equal(guarded.units[0].guard,false);
});
test('fallen targets are not retargeted and killing an announced attacker prevents its response',async()=>{
 const c={name:'Response fixture',kind:'deputies',roster:['freya','jason','jamal','draymus'],enemies:['deputy1','deputy2']};
 const w=create(c,1001);w.enemies.forEach(e=>{e.hp=100;e.intent.target='freya';});w.hp.freya=1;w.rollDice=async()=>24;w.damage=async()=>8;
 await w.performActionImpl('attack');assert.equal(w.hp.freya,0);assert.equal(w.activeUnit().id,'jason');assert(w.enemies.every(e=>e.actedRound===1));
 const v=create(c,1001);v.enemies[0].hp=1;v.enemies[1].hp=100;v.rollDice=async()=>24;v.damage=async()=>8;
 const before=v.hp.freya;await v.performActionImpl('attack');assert.equal(v.hp.freya,before);assert.equal(v.enemies[0].hp,0);
});
