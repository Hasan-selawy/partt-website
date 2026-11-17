"""Create responsive delivery images; imported originals remain untouched."""
import json
from pathlib import Path
from PIL import Image, ImageOps

root=Path(__file__).resolve().parents[1]
plan=root/'.planning/quick/20261116-import-existing-content'
data=json.loads((plan/'source-content.json').read_text(encoding='utf-8'))
media_cache={}
def media(item):
    if not item: return None
    rel=item['src'].split('?')[0].removeprefix('/img/')
    original='assets/client-media/'+rel
    if rel not in media_cache:
        image=ImageOps.exif_transpose(Image.open(root/original)).convert('RGB')
        variants=[]
        for limit in [800,1600]:
            resized=image.copy(); resized.thumbnail((limit,limit*2),Image.Resampling.LANCZOS)
            dest=Path('assets/optimized')/Path(rel).parent/(Path(rel).stem+f'-{limit}.webp')
            (root/dest).parent.mkdir(parents=True,exist_ok=True)
            resized.save(root/dest,quality=86,method=5)
            variants.append((dest.as_posix(),resized.width,resized.height))
        media_cache[rel]={'src':variants[-1][0],'srcset':', '.join(f'{src} {w}w' for src,w,h in dict((v[1],v) for v in variants).values()),'original':original,'w':variants[-1][1],'h':variants[-1][2]}
    return {**item,**media_cache[rel]}
for project in data['projects']:
    project['hero']=media(project['hero'])
    if project.get('banner'): project['banner']=media(project['banner'])
    project['gallery']=[media(item) for item in project['gallery']]
for client in data['clients']:
    client['logo']='assets/client-media/'+client['logo'].removeprefix('/img/')

# Keep the source policies, adjusting only statements about different website behavior.
policies=data['policies']
for section in policies['privacy']['sections']:
    if section['id']=='privacy-information':
        section['paragraphs'][2]='The form prepares a message on your device. Review it in your email application and send it there. Preparing a draft does not deliver it to partt.'
    if section['id']=='privacy-website':
        section['paragraphs'][0]='Our website does not use analytics tools, advertising pixels, or visitor accounts. Project inquiries are prepared on your device and are not stored in a website database.'
        section['paragraphs'][1]='The site follows your device’s reduced-motion setting. It does not save a motion preference or visitor identifier in browser storage.'
for section in policies['cookies']['sections']:
    if section['id']=='cookies-current': section['paragraphs'][0]='This website does not set cookies or save preferences in local storage. We do not use analytics tools or advertising pixels.'
    if section['id']=='cookies-motion': section['paragraphs']=['The site follows your device’s reduced-motion preference without saving an override. You can change that preference in your device settings.']
    if section['id']=='cookies-controls': section['paragraphs']=['You can restrict cookies and browser storage in your browser settings. This website does not rely on either to display content or prepare an email draft.']
for section in policies['terms']['sections']:
    if section['id']=='terms-external': section['paragraphs'][-1]='Our Privacy Policy explains how inquiries and personal information are handled. Our Cookie Policy explains this website’s browser-storage behavior.'
data['policyUpdated']={'date':'2026-11-16','label':'16 November 2026'}
(root/'content.js').write_text('// Imported public Partt content. Regenerate with scripts/import-existing-content.mjs and scripts/prepare-client-media.py.\nwindow.PARTT_CONTENT = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(plan/'media-map.json').write_text(json.dumps(media_cache,indent=2)+'\n',encoding='utf-8')
print(f'Prepared {len(media_cache)} referenced photos in responsive WebP sizes and content.js.')

# Internal visual reference sheet, not a website asset.
sheet=Image.new('RGB',(1200,660),'#fffff9')
from PIL import ImageDraw
draw=ImageDraw.Draw(sheet)
for i,p in enumerate(data['projects']):
    im=Image.open(root/p['hero']['src']); im=ImageOps.fit(im,(290,280))
    x=(i%4)*300; y=(i//4)*330; sheet.paste(im,(x,y)); draw.text((x+5,y+287),p['client'],fill='#0b0344')
(root/'.verification').mkdir(exist_ok=True)
sheet.save(root/'.verification/imported-projects.jpg')
