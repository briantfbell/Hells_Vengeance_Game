const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const w={window:null};w.window=w;vm.createContext(w);vm.runInContext(fs.readFileSync('art-test/initiative.js','utf8'),w);const I=w.Initiative;
test('every combatant gets one D20, sorting uses totals then modifiers and stable ties; duplicate enemy IDs stay distinct',()=>{
 let calls=0;const units=[{id:'freya'},{id:'jamal'}],enemies=[{id:'cultist',name:'Zealot 1'},{id:'cultist',name:'Zealot 2'}],faces=[18,16,20,20];const order=I.roll(units,enemies,{freya:'Freya',jamal:'JMal'},()=>faces[calls++]);assert.equal(calls,4);assert.deepEqual(Array.from(order,e=>e.name),['JMal','Freya','Zealot 1','Zealot 2']);assert.deepEqual(Array.from(order,e=>e.total),[20,20,20,20]);assert.equal(I.actor(order[2],units,enemies),enemies[0]);assert.equal(I.actor(order[3],units,enemies),enemies[1]);
});
test('Now/Next skips downed or defeated combatants and includes a paralyzed companion after the round wraps',()=>{
 const units=[{id:'freya'},{id:'jamal'}],enemies=[{name:'Enemy',hp:0}],order=[{side:'party',index:0},{side:'enemy',index:0},{side:'party',index:1}],hp={freya:10,jamal:10};assert.equal(I.next(order,0,units,enemies,hp,1,'jamal').index,0);assert.equal(I.next(order,2,units,enemies,hp,1,'jamal').index,0);hp.freya=0;assert.equal(I.next(order,2,units,enemies,hp,1,'jamal').index,1);assert.equal(I.eligible(order[2],units,enemies,hp,1,'jamal'),false);assert.equal(I.eligible(order[2],units,enemies,hp,2,'jamal'),true);
});
