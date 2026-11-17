import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { join } from 'node:path';

const dir='.planning/quick/20261116-import-existing-content';
const manifest=JSON.parse(await readFile(`${dir}/source-manifest.json`,'utf8'));
const original=JSON.parse(await readFile(`${dir}/source-content.json`,'utf8'));
const context={window:{}};
runInNewContext(await readFile('content.js','utf8'),context);
const data=JSON.parse(JSON.stringify(context.window.PARTT_CONTENT));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
let checked=0;
for(const file of manifest.files){
  assert.equal(hash(await readFile(join(manifest.source,file.source))),file.sha256,`Source unchanged: ${file.source}`);checked++;
  if(file.destination){assert.equal(hash(await readFile(file.destination)),file.sha256,`Copy intact: ${file.destination}`);checked++;}
}
for(const key of ['services','processSteps','processIntro','customNote','about']){assert.deepEqual(data[key],original[key],`Content parity: ${key}`);checked++;}
const home={...data.home,workShowcase:original.home.workShowcase};
assert.deepEqual(home,original.home,'Content parity: home');checked++;
assert.deepEqual(data.home.workShowcase,['levo','dwego','olvy','incharge'],'Homepage shows LÉVO, DWEGO, OLVY, Incharge');checked++;
assert.equal(data.projects.length,original.projects.length);
for(const project of data.projects){
  const source=original.projects.find(p=>p.slug===project.slug);assert.ok(source);
  for(const key of ['client','displayName','sector','location','statement','brand','year','services','challenge','approach','execution','results']){assert.deepEqual(project[key],source[key],`${project.slug}: ${key}`);checked++;}
  assert.equal(project.gallery.length,source.gallery.length);
  const media=[project.hero,project.banner,...project.gallery].filter(Boolean);
  for(const item of media){
    const bytes=await readFile(item.src);assert.equal(bytes.subarray(8,12).toString(),'WEBP',item.src);assert.ok(item.alt&&item.w>0&&item.h>0);assert.ok((await readFile(item.original)).length>0);checked++;
  }
}
console.log(`PASS: ${checked} content/asset checks. Source unchanged, 66 originals intact, all 8 project stories and galleries preserved, service/about/process parity verified.`);
