import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base=process.env.TEST_URL||'http://localhost:5173';
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
let checks=0;
const errors=[];
const check=(value,label)=>{assert.ok(value,label);checks++;};
await mkdir('.verification/motion',{recursive:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await page.goto(base);
  await page.evaluate(async()=>{clearTimeout(introTimer);document.getAnimations().forEach(a=>a.pause());await document.fonts.ready;await Promise.all([...document.querySelectorAll('#intro img')].map(img=>img.decode()));});
  const seek=async seconds=>{await page.evaluate(t=>document.getAnimations().forEach(a=>a.currentTime=t*1000),seconds);await page.waitForTimeout(40);};
  await seek(.2);
  check(await page.locator('.loader-count').textContent()==='028%','Film loader counter at 0.2 seconds');
  await seek(1.15);
  check(await page.locator('.loader-count').textContent()==='099%','Film loader counter at 1.15 seconds');
  await page.screenshot({path:'.verification/motion/loader.png'});
  // These red t positions were measured in the supplied 1440 x 900 film.
  for(const [time,x] of [[1.9,730],[2.15,1236],[2.75,1392],[2.95,1232],[3.1,827]]) {
    await seek(time);
    const box=await page.locator('.intro-second').boundingBox();
    check(Math.abs(box.x-x)<12,`Film red t trajectory at ${time}s (actual ${box.x.toFixed(1)}, target ${x})`);
    if(time===2.75||time===3.1)await page.screenshot({path:`.verification/motion/intro-${time}.png`});
  }
  check(await page.locator('.intro-streak').evaluate(el=>parseFloat(getComputedStyle(el).opacity)>.9),'Streak remains visible through the return');
  await seek(3.35);
  check(await page.locator('.intro-ring').evaluate(el=>parseFloat(getComputedStyle(el).opacity)>.1),'Lock ring follows the returning t');
  check(await page.locator('main').evaluate(el=>el.inert),'Intro retains interaction lock until handoff');
  await seek(3.95);
  const landing=await page.locator('.intro-stage').boundingBox();
  const brand=await page.locator('.site-header .brand img').boundingBox();
  check(Math.abs(landing.x-brand.x)<1&&Math.abs(landing.y-brand.y)<1&&Math.abs(landing.width-brand.width)<1,'Logo flight lands exactly on the navigation logo');
  await page.goto(base);
  await page.keyboard.press('Escape');
  check(await page.locator('#intro').isHidden()&&!await page.locator('main').evaluate(el=>el.inert),'Escape skips intro and releases interaction');
  await page.waitForTimeout(1300);
  await page.mouse.move(0,450);
  await page.waitForTimeout(900);
  const turn=await page.locator('.hero-art').evaluate(el=>el.style.getPropertyValue('--turn'));
  await page.mouse.move(1439,450);
  await page.waitForTimeout(900);
  check(await page.locator('.hero-art').evaluate(el=>el.style.getPropertyValue('--turn'))!==turn,'Hero mark follows the cursor');
  const scrollName=async fraction=>{await page.evaluate(f=>{const track=document.querySelector('.name-track');scrollTo({top:track.offsetTop+(track.offsetHeight-innerHeight)*f,behavior:'instant'});},fraction);await page.waitForTimeout(120);};
  await scrollName(0);
  check(await page.locator('.name-section').evaluate(el=>getComputedStyle(el).position==='sticky'&&parseFloat(el.style.getPropertyValue('--join'))===0),'Name section pins before the join');
  await scrollName(.35);
  check(await page.locator('.name-section').evaluate(el=>{const p=parseFloat(el.style.getPropertyValue('--join'));return p>.3&&p<.7;}),'Second t moves as the page scrolls');
  await scrollName(.8);
  await page.waitForFunction(()=>document.querySelector('.name-punchline').classList.contains('typed'));
  check(await page.locator('.name-section').evaluate(el=>el.classList.contains('joined')),'Scroll join locks before typing');
  check(await page.locator('.name-punchline [data-type]').evaluateAll(parts=>parts.every(p=>p.textContent===p.dataset.type)),'Punchline types to completion');
  await page.screenshot({path:'.verification/motion/name-join.png'});
  await page.locator('.service-card').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1100);
  check(await page.locator('.service-card').first().evaluate(el=>el.classList.contains('is-visible')&&getComputedStyle(el).opacity==='1'),'Service cards reveal on scroll');
  await page.locator('.steps').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1900);
  check(await page.locator('.steps').evaluate(el=>el.classList.contains('is-visible')),'Process sequence starts on entry');
  check(await page.locator('.step').first().evaluate(el=>['none','matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(el,'::after').transform)),'Process line completes its draw');
  await page.screenshot({path:'.verification/motion/process.png'});
  await page.locator('.source-project').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1700);
  check(await page.locator('.source-project').first().evaluate(el=>el.classList.contains('is-visible')&&getComputedStyle(el.querySelector('.source-project-caption')).opacity==='1'),'Portfolio image wipe and caption reveal complete');
  await page.locator('.source-project').first().hover();
  await page.waitForTimeout(900);
  check(await page.locator('.source-project-alternate').first().evaluate(el=>getComputedStyle(el).opacity==='1'),'Portfolio alternate photo appears on hover');
  await page.locator('.foot-top').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  check(await page.locator('.foot .wm').evaluate(el=>el.classList.contains('is-visible')),'Footer wordmark enters and locks');
  await page.screenshot({path:'.verification/motion/footer.png'});
  await page.locator('.desktop-nav').getByRole('link',{name:'Services',exact:true}).click();
  await page.waitForFunction(()=>document.body.dataset.page==='services'&&document.querySelector('#page-transition').className==='');
  check(await page.locator('.service-row').count()===4,'Cross transition reaches the Services page');
  await page.waitForTimeout(1700);
  check(await page.locator('.service-index a.on').count()===3&&await page.locator('.service-index a.hot').count()===1,'Services light up one by one');
  await page.locator('.service-row').first().hover();
  await page.waitForTimeout(650);
  check(await page.locator('.ca-label').first().evaluate(el=>getComputedStyle(el).opacity==='1'),'Service row opens its action on hover');
  check(await page.locator('.service-row').first().evaluate(el=>el.querySelector('ul').getBoundingClientRect().right<el.querySelector('.circle-arrow').getBoundingClientRect().left),'Expanded service action leaves room for client content');
  await page.screenshot({path:'.verification/motion/service-hover.png'});
  for(const time of [200,400,650]) {
    await page.evaluate(()=>{const transition=document.querySelector('#page-transition');transition.className='';void transition.offsetWidth;transition.className='covering';document.getAnimations().filter(a=>a.effect.target.closest('#page-transition')).forEach(a=>a.pause());});
    await page.evaluate(ms=>document.getAnimations().filter(a=>a.effect.target.closest('#page-transition')).forEach(a=>a.currentTime=ms),time);
    const clips=await page.locator('#page-transition').evaluate(el=>[getComputedStyle(el.querySelector('.wipe-horizontal')).clipPath,getComputedStyle(el.querySelector('.wipe-vertical')).clipPath]);
    check(clips[0]!=='none'&&clips[1]!=='none',`Red cross geometry at ${time}ms`);
    if(time===650)check(clips.every(clip=>clip.match(/[\d.]+/g)?.every(n=>Number(n)===0)),`Red cross fully covers the page at 650ms: ${clips}`);
    await page.screenshot({path:`.verification/motion/cross-${time}.png`});
  }
  await page.evaluate(()=>{const el=document.querySelector('#page-transition');el.className='revealing';document.getAnimations().filter(a=>a.effect.target.closest('#page-transition')).forEach(a=>{a.pause();a.currentTime=175;});});
  check(await page.locator('.wipe-panels').evaluate(el=>getComputedStyle(el).visibility==='visible'),'Cross separates into four quarters');
  await page.screenshot({path:'.verification/motion/quarters.png'});
  await page.goto(base);
  await page.emulateMedia({reducedMotion:'reduce'});
  check(await page.locator('#intro').isHidden()&&!await page.locator('main').evaluate(el=>el.inert),'Changing to reduced motion skips an active intro');
  for(const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto(base);
    check(await page.locator('#intro').isHidden(),`${width}: reduced motion skips intro`);
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: no overflow`);
    check(await page.locator('.name-punchline [data-type]').evaluateAll(parts=>parts.every(p=>p.textContent===p.dataset.type)),`${width}: reduced-motion punchline visible`);
  }
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const width of [320,390,768]) {
    await page.setViewportSize({width,height:900});
    await page.goto(base);
    await page.evaluate(()=>{clearTimeout(introTimer);document.getAnimations().forEach(a=>a.pause());});
    await seek(3.95);
    const logo=await page.locator('.intro-stage').boundingBox();
    const target=await page.locator('.brand img').first().boundingBox();
    check(Math.abs(logo.x-target.x)<1&&Math.abs(logo.y-target.y)<1,`${width}: intro lands on mobile/tablet navigation`);
    await page.keyboard.press('Escape');
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: motion creates no page overflow`);
  }
  check(errors.length===0,`No browser or asset errors: ${errors.join('; ')}`);
  console.log(`PASS: ${checks} motion checks. Measured intro trajectory, logo landing, skip, pointer, pinned join, typing, reveals, process, hover, footer, cross/quarters and reduced motion verified.`);
} finally {await browser.close();}
