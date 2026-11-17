// Import only public content and artwork. Never read environment files or private data.
import { readFile, writeFile, mkdir, cp, readdir, access } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { resolve, relative, join } from 'node:path';
import { createHash } from 'node:crypto';

const source=resolve(process.argv[2] || 'C:/Dev/partt-nextjs');
const backup='.local/backups/before-content-import';
await mkdir(backup,{recursive:true});
for(const file of ['app.js','styles.css','index.html','README.md','scripts/build.mjs','scripts/smoke.mjs']) {
  const target=join(backup,file); await mkdir(resolve(target,'..'),{recursive:true});
  try { await access(target); } catch { await cp(file,target); }
}
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const manifest=[];
async function moduleData(name, substitutions={}) {
  const path=join(source,'src/content',name+'.ts');
  let text=await readFile(path,'utf8');
  manifest.push({source:relative(source,path).replaceAll('\\','/'),sha256:hash(text)});
  for(const [from,to] of Object.entries(substitutions))text=text.replace(from,to);
  const code=stripTypeScriptTypes(text,{mode:'strip'});
  return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
}
const {projects}=await moduleData('projects');
const {clients}=await moduleData('clients');
const serviceData=await moduleData('services');
const {about}=await moduleData('about');
const home=await moduleData('home');
const {site}=await moduleData('site');
const marks=await moduleData('mark');
const policyData=await moduleData('policies',{
  "import { site } from './site';":`const site=${JSON.stringify(site)};`,
  "import { MOTION_STORAGE_KEY } from '@/lib/motion/boot';":"const MOTION_STORAGE_KEY='not-used-by-this-static-site';"
});
await mkdir('assets/client-media',{recursive:true});
async function copyImages(dir) {
  for(const item of await readdir(dir,{withFileTypes:true})) {
    const path=join(dir,item.name);
    if(item.isDirectory()){await copyImages(path);continue;}
    const rel=relative(join(source,'public/img'),path).replaceAll('\\','/');
    const bytes=await readFile(path); const dest='assets/client-media/'+rel;
    await mkdir(resolve(dest,'..'),{recursive:true}); await writeFile(dest,bytes);
    manifest.push({source:'public/img/'+rel,destination:dest,sha256:hash(bytes),bytes:bytes.length});
  }
}
await copyImages(join(source,'public/img'));
const bundle={projects,clients,services:serviceData.services,processSteps:serviceData.processSteps,processIntro:serviceData.processIntro,customNote:serviceData.customNote,about,home,site:{...site,showPlaceholders:undefined},policies:policyData.policies,policyUpdated:policyData.policyUpdated};
await mkdir('.planning/quick/20261116-import-existing-content',{recursive:true});
await writeFile('.planning/quick/20261116-import-existing-content/source-content.json',JSON.stringify(bundle,null,2)+'\n');
await writeFile('.planning/quick/20261116-import-existing-content/source-manifest.json',JSON.stringify({source,files:manifest},null,2)+'\n');
await writeFile('assets/source-wordmark.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${marks.WORDMARK_VIEWBOX}">${marks.WORDMARK_PATHS.map(p=>`<path fill="${p.part==='par'?'#FFFFF9':'#E7292B'}" d="${p.d}"/>`).join('')}</svg>`);
await writeFile('assets/pinwheel.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-.55 -.55 1.1 1.1">${marks.MARK_PIECES.map(p=>`<path fill="${p.color==='red'?'#E7292B':'#FFFFF9'}" d="${p.d}"/>`).join('')}</svg>`);
console.log(`Imported ${projects.length} projects, ${clients.length} logos, ${serviceData.services.length} services, ${manifest.filter(f=>f.destination).length} original images. Source untouched.`);
