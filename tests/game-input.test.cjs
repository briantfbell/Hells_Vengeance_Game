const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const w={window:{}};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../art-test/game-input.js'),'utf8'),w);const G=w.window.GameInput;
const held=(...keys)=>new Set(keys),down=events=>Array.from(events).filter(e=>e.type==='keydown').map(e=>e.key);
const start=(mode='menu')=>{const d=G.create();d.tick(held(),mode,0);return d;};
test('standard controller maps face buttons, D-pad and stick with a dead zone',()=>{
 const pad={mapping:'standard',buttons:Array.from({length:16},()=>({pressed:false,value:0})),axes:[.2,0]};assert.equal(G.sample(pad).size,0);
 [0,1,2,3,8,9,12].forEach(i=>pad.buttons[i].pressed=true);pad.axes=[.7,0];assert.deepEqual([...G.sample(pad)].sort(),['ArrowRight','ArrowUp','B','Enter','F1','i','o','p'].sort());assert.equal(G.sample({...pad,mapping:''}),null);
});
test('confirm is edge-triggered; held directions repeat only in menus',()=>{
 const d=start();assert.deepEqual(down(d.tick(held('Enter','ArrowDown'),'menu',10)),['Enter','ArrowDown']);assert.equal(down(d.tick(held('Enter','ArrowDown'),'menu',200)).length,0);assert.deepEqual(down(d.tick(held('Enter','ArrowDown'),'menu',360)),['ArrowDown']);assert.equal(d.tick(held(),'menu',370).filter(e=>e.type==='keyup').length,2);
 const world=start('world');world.tick(held('ArrowRight'),'world',10);assert.equal(world.tick(held('ArrowRight'),'world',2000).length,0);
});
test('B pauses on stationary release and becomes run when a direction is held',()=>{
 const d=start('world');assert.equal(d.tick(held('B'),'world',10).length,0);assert.deepEqual(down(d.tick(held(),'world',20)),['Escape']);
 const run=start('world');assert.deepEqual(down(run.tick(held('B','ArrowRight'),'world',10)),['Shift','ArrowRight']);const release=run.tick(held(),'world',30);assert(!down(release).includes('Escape'));assert(release.some(e=>e.type==='keyup'&&e.key==='Shift'));
 const delayed=start('world');delayed.tick(held('B'),'world',10);assert(down(delayed.tick(held('B','ArrowUp'),'world',20)).includes('Shift'));delayed.tick(held('B'),'world',30);assert(!down(delayed.tick(held(),'world',40)).includes('Escape'));
});
test('screen changes, disconnect and blocked turns release controls and require neutral input',()=>{
 const d=start('world');d.tick(held('ArrowRight'),'world',10);assert(d.tick(held('Enter'),'menu',20).some(e=>e.type==='keyup'));assert.equal(d.tick(held('Enter'),'menu',400).length,0);d.tick(held(),'menu',410);assert.deepEqual(down(d.tick(held('Enter'),'menu',420)),['Enter']);assert(d.tick(null,'menu',430).some(e=>e.type==='keyup'));assert.equal(d.tick(held('Enter'),'menu',450).length,0);d.tick(held(),'menu',460);d.tick(held('ArrowDown'),'menu',470);assert(d.tick(held('ArrowDown'),'blocked',480).some(e=>e.type==='keyup'));
});
