const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const {create,cases}=require('../scripts/combat-balance.cjs');

function rewardCombat(id) {
 const w=create(cases.find(c=>c.kind==='fastness_summit'),1001);
 w.quest.kantariaGiftsReceived=true;
 w.quest.reeseJoined=true;
 w.inventory=w.Inventory.fresh(w.quest);
 w.applyProgression();
 w.activeUnit=()=>w.units.find(u=>u.id===id);
 w.advanceInitiative=async()=>{};
 return w;
}

test('Dragon Helm maximizes the actual Burning Hands action and spends both resources',async()=>{
 const w=rewardCombat('jason');
 const target=w.battle.enemies[0],before=target.hp;
 w.damage=async(spec,_label,fixed)=>{
  assert.deepEqual(Array.from(fixed),Array(spec[0]).fill(spec[1]));
  return fixed.reduce((n,die)=>n+die,spec[2]);
 };
 await w.performActionImpl('maximize');
 assert.equal(before-target.hp,8);
 assert.equal(w.uses.jason,1);
 assert.equal(w.quest.dragonHelmSpent,1);
 w.battle.busy=false;
 w.quest.dragonHelmSpent=3;
 await w.performActionImpl('maximize');
 assert.equal(w.uses.jason,1);
});

test('Mosswater Phase spends a charge and prevents the next enemy attack',async()=>{
 const w=rewardCombat('jamal'),actor=w.activeUnit();
 const before=w.hp.jamal;
 await w.performActionImpl('phase');
 assert.equal(w.quest.mosswaterSpent,1);
 assert.equal(actor.ethereal,true);
 const enemy=w.battle.enemies[0];
 enemy.intent={target:'jamal',move:'Sword cut',extra:0};
 w.rollDice=async()=>assert.fail('A phased target should not roll an enemy attack');
 await w.enemyStrike(enemy,w.epoch);
 assert.equal(w.hp.jamal,before);
});

test('Silent Sentry adds accuracy and rolls frost for attacks and Aimed Shot only while equipped',async()=>{
 const w=rewardCombat('reese');
 assert.equal(w.STATS.reese.atk,w.BASE_STATS.reese.atk+2);
 assert.equal(w.SPECIAL.draymus.uses,w.BASE_SPECIAL.draymus.uses+5);
 assert.throws(()=>w.Inventory.equip(w.Inventory.fresh(),{reeseJoined:true},'reese','silent_sentry'));
 w.rollDice=async(_label,sides,_count,modifier)=>sides+modifier;
 for(const action of ['attack','special']){
  const labels=[];
  w.damage=async(_spec,label)=>{labels.push(label);return 3;};
  const enemy=w.battle.enemies[0],before=enemy.hp;
  w.battle.busy=false;
  await w.performActionImpl(action);
  assert.equal(before-enemy.hp,6);
  assert.equal(labels.at(-1),'Silent Sentry · Frost');
 }
 w.inventory=w.Inventory.equip(w.inventory,w.quest,'reese','reese');
 w.applyProgression();
 assert.equal(w.STATS.reese.frostDice,0);
 const source=fs.readFileSync('art-test/chapter-engine.js','utf8');
 vm.runInContext(source.slice(source.indexOf('const signed='),source.indexOf('function combatButtons()')),w);
 for(const [action,id] of [['phase','jamal'],['maximize','jason']]){
  const lines=w.commandCardSummary(action,id).split('\n');
  assert.equal(lines.length,2);
  for(const line of lines)assert(line.length*7.5<=104,line);
 }
});
