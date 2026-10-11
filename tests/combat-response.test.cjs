const {test}=require('node:test'),assert=require('node:assert/strict');
const {create}=require('../scripts/combat-balance.cjs');
const c={name:'Initiative fixture',kind:'deputies',roster:['freya','jason','jamal','draymus'],enemies:['deputy1']};
const setup=()=>{const w=create(c,1001);w.enemies[0].hp=100;w.rollDice=async()=>24;w.damage=async()=>8;w.battle.order=[{side:'party',index:0},{side:'enemy',index:0},...w.units.slice(1).map((_,i)=>({side:'party',index:i+1}))];return w;};
test('initiative interleaves enemy and party turns once per round; Guard lasts until its owner next acts',async()=>{
 const guarded=setup(),attacking=setup(),before=guarded.hp.freya;
 await guarded.performActionImpl('guard');await attacking.performActionImpl('attack');
 assert.equal(guarded.hp.freya,before-4);assert.equal(attacking.hp.freya,before-8);assert.equal(guarded.activeUnit().id,'jason');assert.equal(guarded.enemies[0].actedRound,1);assert(guarded.units[0].guard);
 for(let i=0;i<3;i++)await guarded.performActionImpl('attack');
 assert.equal(guarded.hp.freya,before-4);assert.equal(guarded.battle.round,2);assert.equal(guarded.activeUnit().id,'freya');assert.equal(guarded.units[0].guard,false);
});
test('fallen party members are skipped and an enemy can act first',async()=>{
 const w=setup();w.hp.jason=0;const before=w.hp.freya;await w.performActionImpl('attack');assert.equal(w.hp.freya,before-8);assert.equal(w.activeUnit().id,'jamal');
 const v=setup();v.battle.order=[{side:'enemy',index:0},...v.units.map((_,index)=>({side:'party',index}))];await v.advanceInitiative(false,1);assert.equal(v.hp.freya,before-8);assert.equal(v.activeUnit().id,'freya');
});
test('round-one paralysis preserves the rolled place and resumes in round two',async()=>{
 const w=setup();w.battle.paralyzed='jamal';await w.performActionImpl('attack');assert.equal(w.activeUnit().id,'jason');await w.performActionImpl('attack');assert.equal(w.activeUnit().id,'draymus');await w.performActionImpl('attack');assert.equal(w.battle.round,2);assert.equal(w.battle.paralyzed,null);assert.equal(w.battle.order[3].index,2);
});
test('guard survives the round boundary when an earlier enemy attacks before the owner’s next turn',async()=>{
 const w=setup();w.battle.order=[{side:'enemy',index:0},...w.units.map((_,index)=>({side:'party',index}))];w.battle.turn=1;w.planEnemyRound=()=>{w.enemies[0].intent={target:'freya',move:'Strike',extra:0,round:w.battle.round};};
 await w.performActionImpl('guard');for(let i=0;i<3;i++)await w.performActionImpl('attack');assert.equal(w.hp.freya,34);assert.equal(w.battle.round,2);assert.equal(w.activeUnit().id,'freya');assert.equal(w.units[0].guard,false);
});
