"use strict";

const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const assets=path.join(__dirname,'..','art-test');
const env={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(assets,'warlock-map-preview.js'),'utf8'),env);
const {layouts,passable}=env.window.WarlockMapPreview;

test('both Warlock Island previews can reach their marked destinations on the game grid',()=>{
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
  for(const point of layout.points)assert(visited.has([point.x,point.y].join(',')),id+' · '+point.label);
  assert(!passable(layout,-8,200));
  assert(!passable(layout,648,200));
 }
});
