"""Read original PNG alpha; record tiny detached border islands, never alter source PNGs."""
from pathlib import Path
from PIL import Image
from collections import deque
import json
inventory=json.loads(Path('docs/sprite-frame-inventory.json').read_text())
entries={}
def walk(o,src=None):
 if isinstance(o,dict):
  src=o.get('src',src)
  if src and 'frames' in o:
   for f in o['frames']:entries[(src,f['x'],f['y'],f['w'],f['h'])]=f
  if src and 'frame' in o:
   f=o['frame'];entries[(src,f['x'],f['y'],f['w'],f['h'])]=f
  for k,v in o.items():walk(v,k if k.endswith('.png') else src)
 elif isinstance(o,list):
  for v in o:walk(v,src)
walk(inventory)
clean={};report=[];images={}
for (src,x,y,w,h),f in entries.items():
 if not Path('art-test',src).exists():continue
 im=images.setdefault(src,Image.open(Path('art-test',src)).convert('RGBA'))
 mask=bytearray(im.getchannel('A').crop((x,y,x+w,y+h)).point(lambda v:255 if v>90 else 0).tobytes());components=[]
 for start,v in enumerate(mask):
  if not v:continue
  q=[start];mask[start]=0;area=0;left=w;right=0;top=h;bottom=0
  for k in q:
   yy,xx=divmod(k,w);area+=1;left=min(left,xx);right=max(right,xx);top=min(top,yy);bottom=max(bottom,yy)
   for nk in ([k-1] if xx else [])+([k+1] if xx<w-1 else [])+([k-w] if yy else [])+([k+w] if yy<h-1 else []):
    if mask[nk]:mask[nk]=0;q.append(nk)
  components.append(dict(area=area,x=left,y=top,w=right-left+1,h=bottom-top+1))
 if not components:continue
 body=max(components,key=lambda c:c['area']);cuts=[]
 for c in components:
  if c is body or c['area']>24:continue
  border=c['x']<5 or c['x']+c['w']>w-5 or c['y']+c['h']>h-5
  below=c['y']>body['y']+body['h']+3
  gap=max(body['x']-(c['x']+c['w']),c['x']-(body['x']+body['w']),body['y']-(c['y']+c['h']),c['y']-(body['y']+body['h']))
  if below or border and gap>6:cuts.append({k:c[k] for k in ['x','y','w','h']})
 if cuts:clean.setdefault(src,{})[','.join(map(str,[x,y,w,h]))]=cuts;report.append(dict(source=src,frame=[x,y,w,h],excluded=cuts))
Path('art-test/sprite-clean-rects.js').write_text('window.SPRITE_CLEAN_RECTS='+json.dumps(clean)+';',encoding='utf-8')
Path('docs/sprite-alpha-audit.json').write_text(json.dumps(dict(frames_scanned=len(entries),policy='Alpha >90; detached islands <=24 pixels below body or at border with >6 pixel gap; sources unchanged; draw-time transparent exclusion rectangles.',excluded_frames=report),indent=2)+'\n',encoding='utf-8')
print('Frames:',len(entries),'excluded frames:',len(report));print([(r['source'],r['frame'],len(r['excluded'])) for r in report])
