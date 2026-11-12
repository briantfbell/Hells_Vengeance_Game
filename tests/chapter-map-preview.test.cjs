"use strict";

const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const assets=path.join(__dirname,'..','art-test');
const env={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(assets,'chapter-map-preview.js'),'utf8'),env);
const {layouts,cast,passable,select,key,nearbyStop}=env.window.ChapterMapPreview;

test('chapter map previews can reach their marked destinations on the game grid',()=>{
 const reachable=new Map();
 for(const [id,layout] of Object.entries(layouts)){
  assert(fs.existsSync(path.join(assets,id+'.png')),id);
  assert(passable(layout,...layout.spawn),id);
  const visited=new Set([layout.spawn.join(',')]),frontier=[layout.spawn];
  for(let index=0;index<frontier.length;index++){
   const [x,y]=frontier[index];
   for(const [dx,dy] of [[16,0],[-16,0],[0,16],[0,-16]]){
    const cell=[x+dx,y+dy],key=cell.join(',');
    if(!visited.has(key)&&passable(layout,...cell)){
     visited.add(key);
     frontier.push(cell);
    }
   }
  }
  reachable.set(id,visited);
  for(const point of layout.points)assert(visited.has([point.x,point.y].join(',')),id+' · '+point.label);
  assert(!passable(layout,-8,200));
  assert(!passable(layout,648,200));
 }
 for(const [id,layout] of Object.entries(layouts)){
  for(const stop of layout.points.filter(point=>point.destination)){
   assert(reachable.get(stop.destination)?.has(stop.arrival.join(',')),stop.label+' arrival');
   assert(layouts[stop.destination].points.some(point=>point.destination===id),stop.label+' return');
   select(stop.destination,stop.arrival);
   assert.equal(nearbyStop(),null,stop.label+' landing');
  }
 }
 select('barleybridge-approach-v1');
 assert.equal(nearbyStop().label,'Near-bank trail');
 const move=(direction,count)=>{for(let i=0;i<count;i++)assert(key({key:direction,preventDefault(){}}));};
 move('ArrowUp',6);
 move('ArrowLeft',10);
 move('ArrowUp',1);
 const crossing=nearbyStop();
 assert.equal(crossing.label,'Trace the crossing');
 select(crossing.destination,crossing.arrival);
 move('ArrowDown',1);
 assert.equal(nearbyStop().destination,'barleybridge-approach-v1');
 select('warlock-library-v1',[328,216]);
 assert.equal(nearbyStop(),null);
 assert(key({key:'ArrowUp',preventDefault(){}}));
 assert.equal(nearbyStop().label,'Reading dais');
 for(const model of Object.values(cast)){
  const png=fs.readFileSync(path.join(assets,model.src));
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  assert.equal(model.frames.length,3);
  for(const f of model.frames)assert(f.x>=0&&f.y>=0&&f.x+f.w<=width&&f.y+f.h<=height);
 }
});
