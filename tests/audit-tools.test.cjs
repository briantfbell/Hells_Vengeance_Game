const {test}=require('node:test'),assert=require('node:assert/strict');
const {winPercent,playPair,create,cases}=require('../scripts/combat-balance.cjs');
test('a rare simulated loss cannot be rounded into a perfect success rate',()=>{const results=Array.from({length:400},(_,i)=>({won:i!==0}));assert.equal(winPercent(results),99.75);assert.equal(winPercent([]),0);});
test('a chain retains first-fight defeats instead of excluding them from its denominator',async()=>{const calls=[];const result=await playPair('human','wereboar',1,2,async fight=>{calls.push(fight);return {won:false,potions:1};});assert.equal(result.won,false);assert.deepEqual(calls,['human']);assert.equal(winPercent([result,{won:true}]),50);});
test('a successful first fight carries injuries and resources into the second',async()=>{const first={won:true,hp:{freya:12},potions:1},calls=[];await playPair('human','wereboar',1,2,async(fight,seed,carry)=>{calls.push({fight,seed,carry});return first;});assert.equal(calls[1].carry,first);assert.equal(calls[1].seed,2);});
test('the solo porch benchmark uses the live second guard health',()=>{const w=create(cases.find(c=>c.kind==='armory_porch'),1001);assert.deepEqual(w.enemies.map(e=>e.hp),[12,8]);});

test('South Road departure restores readiness without adding potions, while camp gives half health',()=>{
 const escort=cases.find(c=>c.kind==='south_road_infantry');
 const carry={hp:{freya:0,draymus:8},uses:{freya:2,draymus:2},potions:0,mendUses:0};
 const w=create({...escort,prepareEscort:true},1001,carry);
 assert.equal(w.hp.freya,w.STATS.freya.hp);
 assert.equal(w.hp.draymus,w.STATS.draymus.hp);
 assert.equal(w.uses.freya,0);
 assert.equal(w.uses.draymus,0);
 assert.equal(w.mendUses,2);
 assert.equal(w.potions,0);

 w.hp.freya=0;
 w.quest.dragonHelmSpent=1;
 w.SouthRoad.recover(.5);
 assert.equal(w.hp.freya,Math.ceil(w.STATS.freya.hp/2));
 assert.equal(w.quest.dragonHelmSpent,0);
 assert.equal(w.potions,0);
});

test('South Road uses a contextual mounted lance and marks only the first two infantry',()=>{
 const infantry=cases.find(c=>c.kind==='south_road_infantry');
 const w=create({...infantry,sentryMarked:true},1001);
 const equipped=w.inventory.equipped.freya;
 const damage=[1,6,4];
 assert.deepEqual(Array.from(w.enemies,e=>e.shaken),[1,1,0,0]);
 assert.equal(w.SouthRoad.damageDice('freya',infantry.kind,damage),damage);
 assert.deepEqual(Array.from(w.SouthRoad.damageDice('freya','south_road_knights',damage)),[1,8,6]);
 assert.equal(w.inventory.equipped.freya,equipped);
});
