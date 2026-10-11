# Production atlas slicing: isolates connected silhouettes without changing artwork.
from PIL import Image
from pathlib import Path
import json,sys
source,target,rowids=sys.argv[1:];ids=rowids.split(',');im=Image.open(source).convert('RGBA');W,H=im.size;alpha=bytearray(1 if a>32 else 0 for a in im.getchannel('A').getdata());parts=[]
for seed in range(len(alpha)):
 if not alpha[seed]:continue
 todo=[seed];alpha[seed]=0;points=[];x0=x1=seed%W;y0=y1=seed//W
 while todo:
  i=todo.pop();points.append(i);x,y=i%W,i//W;x0=min(x0,x);x1=max(x1,x);y0=min(y0,y);y1=max(y1,y)
  for j in (i-1 if x else -1,i+1 if x<W-1 else -1,i-W if y else -1,i+W if y<H-1 else -1):
   if j>=0 and alpha[j]:alpha[j]=0;todo.append(j)
 if len(points)>1500:parts.append((x0,y0,x1+1,y1+1,points))
parts.sort(key=lambda f:(int((f[1]+f[3])/2/(H/len(ids))),f[0]))
if len(parts)!=len(ids)*3:raise ValueError('Expected three silhouettes per row, got '+str(len(parts)))
cw=max(f[2]-f[0] for f in parts)+32;ch=max(f[3]-f[1] for f in parts)+32;out=Image.new('RGBA',(cw*3,ch*len(ids)));rows={};a=im.getchannel('A').load()
for n,(l,t,r,b,pts)in enumerate(parts):
 row,col=n//3,n%3;f=im.crop((l,t,r,b));mask=Image.new('L',f.size);mp=mask.load()
 for i in pts:mp[i%W-l,i//W-t]=a[i%W,i//W]
 f.putalpha(mask);x=col*cw+(cw-f.width)//2;y=(row+1)*ch-16-f.height;out.paste(f,(x,y));m=rows.setdefault(ids[row],dict(src=Path(target).name,frames=[],maxHeight=0,cycle=[0,1,0,2]));m['frames'].append(dict(x=x,y=y,w=f.width,h=f.height,anchorX=col*cw+cw/2,anchorY=(row+1)*ch-16));m['maxHeight']=max(m['maxHeight'],f.height)
out.save(target);Path(target).with_suffix('.json').write_text(json.dumps(rows,indent=2))
