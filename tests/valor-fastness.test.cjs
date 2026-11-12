const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

test('the chapel cleric spends an even turn healing a living ally, and attacks if nobody needs healing',async()=>{
 const enemy={id:'fastness_cleric',name:'Chapel Cleric',hp:24,max:25};
 const fallen={id:'fastness_paladin',name:'Fallen',hp:0,max:26};
 const ally={id:'fastness_paladin',name:'Living',hp:24,max:26};
 const enemies=[fallen,enemy,ally];
 const messages=[];
 const w={battle:{enemies},animateAction:async(_actor,_target,_action,_hit,impact)=>impact(),
  flash:()=>{},log:message=>messages.push(message)};
 w.window=w;
 vm.createContext(w);
 for(const file of ['enemy-tactics.js','valor-fastness.js']){
  vm.runInContext(fs.readFileSync('art-test/'+file,'utf8'),w);
 }
 const party=[{id:'freya'}];
 const plan=round=>w.EnemyTactics.plan(enemies,party,{freya:32},{freya:{hp:32}},round);
 plan(1);
 assert.equal(await w.FastnessArc.enemySupport(enemy),false);
 plan(2);
 assert.match(w.EnemyTactics.preview(enemy,{}),/Mend if an ally is wounded/);
 assert.equal(await w.FastnessArc.enemySupport(enemy),true);
 assert.equal(ally.hp,26);
 assert.equal(enemy.hp,24);
 assert.equal(fallen.hp,0);
 assert.equal(messages.length,1);
 assert.equal(await w.FastnessArc.enemySupport(enemy),false);
});

test('the warpriest can spend one even turn on a prayer after reaching half health',async()=>{
 const enemy={id:'fastness_warpriest',name:'Tower Warpriest',hp:22,max:44};
 const w={animateAction:async(_actor,_target,_action,_hit,impact)=>impact(),flash:()=>{},log:()=>{}};
 w.window=w;
 vm.createContext(w);
 for(const file of ['enemy-tactics.js','valor-fastness.js']){
  vm.runInContext(fs.readFileSync('art-test/'+file,'utf8'),w);
 }
 const plan=round=>w.EnemyTactics.plan([enemy],[{id:'freya'}],{freya:32},{freya:{hp:32}},round);
 plan(1);
 assert.equal(await w.FastnessArc.enemySupport(enemy),false);
 plan(2);
 assert.match(w.EnemyTactics.preview(enemy,{}),/Battle prayer at half HP/);
 assert.equal(await w.FastnessArc.enemySupport(enemy),true);
 assert.equal(enemy.hp,30);
 enemy.hp=10;
 plan(4);
 assert.equal(await w.FastnessArc.enemySupport(enemy),false);
 assert.equal(enemy.hp,10);
});
