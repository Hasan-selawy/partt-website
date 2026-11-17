"""Extract supplied artwork only; run with PYTHONPATH=.tools."""
from pathlib import Path
import re
import urllib.request
import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets'
OUT.mkdir(exist_ok=True)
home = Image.open(ROOT / 'desktop/partt_home_desktop.png').convert('RGB')
about = Image.open(ROOT / 'desktop/partt_about_desktop.png').convert('RGB')

def svg_trace(name, crop, color_mode='both'):
    pixels = np.array(crop)
    layers = []
    for color, mask in [('#FFFFF9', ((pixels[:,:,0]>180)&(pixels[:,:,1]>180)).astype('uint8')*255), ('#E7292B', ((pixels[:,:,0]>150)&(pixels[:,:,1]<100)).astype('uint8')*255)]:
        if color_mode=='red' and color!='#E7292B': continue
        contours, hierarchy = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        if name in ['t-first.svg','t-second.svg'] and contours:
            contours=[max(contours,key=cv2.contourArea)]
        paths=[]
        for contour in contours:
            if cv2.contourArea(contour)<12: continue
            points=cv2.approxPolyDP(contour,0.65,True).reshape(-1,2)
            paths.append('M'+'L'.join(f'{x},{y}' for x,y in points)+'Z')
        layers.append(f'<path fill="{color}" fill-rule="evenodd" d="{"".join(paths)}"/>')
    (OUT/name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {crop.width} {crop.height}">{"".join(layers)}</svg>')

svg_trace('logo.svg', home.crop((118,13700,2040,14542)))
svg_trace('par.svg', home.crop((118,13840,1300,14542)))
svg_trace('mark.svg', home.crop((1320,13700,2040,14470)), 'red')
svg_trace('t-first.svg', home.crop((1320,13700,1685,14470)), 'red')
svg_trace('t-second.svg', home.crop((1675,13700,2040,14470)), 'red')
(OUT/'mark-cream.svg').write_text((OUT/'mark.svg').read_text().replace('#E7292B','#FFFFF9'))
(OUT/'t-first-navy.svg').write_text((OUT/'t-first.svg').read_text().replace('#E7292B','#0B0344'))
(OUT/'t-outline.svg').write_text((OUT/'t-second.svg').read_text().replace('fill="#E7292B"','fill="none" stroke="#E7292B" stroke-width="3" stroke-dasharray="12 10"'))

for i,name in enumerate(['incharge','w','celatte','levo','olvy','dead-sea']):
    tile=home.crop((120+i*320+30,6750,120+(i+1)*320-30,6880)).convert('RGBA')
    data=np.array(tile)
    # Remove cream background and retain the supplied logo ink.
    alpha=(255-np.min(data[:,:,:3],axis=2)).astype(float)/244*255
    alpha[alpha<20]=0
    data[:,:,:3]=[11,3,68]
    data[:,:,3]=np.clip(alpha,0,255).astype('uint8')
    Image.fromarray(data).save(OUT/f'{name}.png')

names=['abed','doaa','layan','fatima','lyan','jenen','qais']
for i,name in enumerate(names):
    col=i%4; row=i//4
    about.crop((120+col*488,6668+row*760,570+col*488,7240+row*760)).save(OUT/f'team-{name}.webp',quality=92)
about.crop((1150,220,2030,1380)).save(OUT/'about-parts.webp',quality=92)

fonts=OUT/'fonts'; fonts.mkdir(exist_ok=True)
for family,filename in [('Bebas+Neue','bebas-neue'),('Poppins:wght@400','poppins-regular'),('Poppins:wght@500','poppins-medium'),('Poppins:wght@600','poppins-semibold')]:
    req=urllib.request.Request(f'https://fonts.googleapis.com/css2?family={family}&display=swap',headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'})
    css=urllib.request.urlopen(req).read().decode()
    urls=re.findall(r'url\((https[^)]+)\)',css)
    urllib.request.urlretrieve(urls[-1],fonts/f'{filename}.woff2')
print('Extracted logo vectors, 6 client marks, 7 team portraits, about artwork, and 4 fonts.')
