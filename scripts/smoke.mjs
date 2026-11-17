import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base=process.env.TEST_URL || 'http://localhost:5173';
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
const errors=[];
let checks=0;
const check=(value,label)=>{assert.ok(value,label);checks++;};
await mkdir('.verification',{recursive:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(base);
  const content=await page.evaluate(()=>window.PARTT_CONTENT);
  await page.evaluate(()=>document.fonts.ready);
  check(await page.locator('#intro').isHidden(),'Reduced motion skips intro');
  await page.screenshot({path:'.verification/home-desktop.png'});
  const routes=['/','/services','/services/strategy-brand','/work','/work/olvy','/about','/contact','/privacy-policy','/cookie-policy','/terms-and-conditions','/missing'];
  for(const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    for(const route of routes) {
      await page.goto(`${base}/#${route}`);
      await page.waitForFunction(()=>document.querySelector('main h1'));
      check(await page.locator('main h1').count()===1,`${width} ${route}: one h1`);
      if(route==='/'||route==='/about')check(await page.locator('.team-section,.client-section').count()===0,`${width} ${route}: requested team and logo sections removed`);
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width} ${route}: no horizontal overflow`);
      // Scroll through the page to load deferred images and inspect every supplied asset.
      await page.evaluate(async()=>{for(const img of document.querySelectorAll('img[loading="lazy"]'))img.loading='eager';await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
      check(await page.evaluate(()=>[...document.querySelectorAll('main img')].every(i=>i.naturalWidth>0)),`${width} ${route}: no broken assets`);
      if(width===390&&['/','/services','/contact','/about'].includes(route))await page.screenshot({path:`.verification/${route.slice(1)||'home'}-mobile.png`,fullPage:route!=='/'});
      if(width===1440&&['/services','/about','/contact'].includes(route))await page.screenshot({path:`.verification/${route.slice(1)}-desktop.png`,fullPage:true});
    }
  }
  await page.goto(`${base}/#/`);
  check((await page.locator('.source-project-name').allTextContents()).join('|')==='LÉVO|DWEGO|OLVY|Incharge','Homepage shows LÉVO, DWEGO, OLVY and Incharge');
  await page.getByRole('link',{name:'All work'}).click();
  await page.waitForURL('**/#/work');
  check(await page.locator('.work-card').count()===8,'All work shows every project');
  await page.goto(`${base}/#/work`);
  await page.getByRole('button',{name:'Skincare',exact:true}).click();
  check(await page.locator('.work-card:visible').count()===1,'Sector filter shows one matching project');
  check(await page.locator('.work-card h3').textContent()==='OLVY','Skincare filter shows OLVY');
  await page.locator('.work-image').first().click();
  await page.waitForURL('**/#/work/olvy');
  check(await page.locator('h1').textContent()==='OLVY','Case link works');
  await page.goBack();
  check(await page.locator('.filters').isVisible(),'Browser back restores work');
  await page.getByRole('button',{name:'All',exact:true}).click();
  check(await page.locator('.work-card:visible').count()===8,'All filter restores eight projects');
  await page.goto(`${base}/#/services/brand`);
  await page.locator('summary').first().click();
  check(await page.locator('details').first().getAttribute('open')!==null,'FAQ expands');
  await page.goto(`${base}/#/contact`);
  await page.locator('button[type=submit]').click();
  check(await page.locator('.form-result').isHidden(),'Empty form does not prepare message');
  await page.getByRole('textbox',{name:'Your name'}).fill('Test Person');
  await page.getByRole('textbox',{name:'Email',exact:false}).fill('test@example.com');
  await page.getByRole('textbox',{name:'Company or brand'}).fill('Test & Co');
  await page.getByRole('textbox',{name:'Tell us more'}).fill('A brand project with <strong>literal text</strong>.');
  await page.getByLabel('Strategy & Brand',{exact:true}).check();
  await page.getByRole('textbox',{name:'Approximate budget'}).fill('2,000 JOD');
  await page.locator('button[type=submit]').click();
  check(await page.locator('.form-result').isVisible(),'Valid form prepares draft');
  const mailto=await page.locator('.email-draft').getAttribute('href');
  check(mailto.startsWith('mailto:info@parttagency.com?'),'Correct recipient');
  check(decodeURIComponent(mailto).includes('Services: Strategy & Brand'),'Selected service in draft');
  check(decodeURIComponent(mailto).includes('Budget: 2,000 JOD'),'Budget included in draft');
  check(await page.locator('.message-preview strong').count()===0,'Draft text is never HTML');
  await page.setViewportSize({width:390,height:844});
  await page.goto(base);
  await page.getByRole('button',{name:'Open menu',exact:true}).click();
  check(await page.locator('#mobile-menu').isVisible(),'Mobile menu opens');
  await page.keyboard.press('Escape');
  check(await page.locator('#mobile-menu').isHidden(),'Escape closes mobile menu');
  check(await page.locator('.menu-toggle').evaluate(el=>el===document.activeElement),'Menu restores focus');
  await page.getByRole('button',{name:'Open menu',exact:true}).click();
  await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Services',exact:true}).click();
  await page.waitForURL('**/#/services');
  check(await page.locator('#mobile-menu').isHidden(),'Navigation closes menu');
  check(await page.locator('h1').textContent()==='Whatwe do','Mobile navigation works');
  const motion=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  motion.on('pageerror',e=>errors.push(e.message));
  await motion.goto(base);
  check(await motion.locator('#intro').isVisible(),'Motion intro starts');
  await motion.waitForTimeout(800);
  await motion.screenshot({path:'.verification/loader.png'});
  await motion.waitForTimeout(1900);
  await motion.screenshot({path:'.verification/intro-lock.png'});
  await motion.waitForFunction(()=>document.querySelector('#intro').hidden,{},{timeout:6500});
  check(!await motion.locator('main').evaluate(el=>el.inert),'Intro restores interaction');
  await motion.waitForTimeout(1100);
  await motion.screenshot({path:'.verification/hero-motion.png'});
  await motion.locator('.desktop-nav').getByRole('link',{name:'Services',exact:true}).click();
  await motion.waitForTimeout(300);
  check(await motion.locator('#page-transition').getAttribute('class')==='covering','Page cross transition runs');
  await motion.screenshot({path:'.verification/page-transition.png'});
  await motion.waitForFunction(()=>document.querySelector('#page-transition').className==='');
  check(await motion.locator('.service-row').count()===4,'Transition reaches four source services');
  await motion.goto(base);
  await motion.getByRole('button',{name:'Skip intro'}).click();
  await motion.evaluate(()=>{const track=document.querySelector('.name-track');window.scrollTo({top:track.offsetTop+(track.offsetHeight-innerHeight)*.8,behavior:'instant'});});
  await motion.waitForTimeout(1100);
  check(await motion.locator('.name-section').evaluate(el=>el.classList.contains('joined')),'Name scroll join reaches locked state');
  await motion.screenshot({path:'.verification/name-join.png'});
  // Every migrated case, including all gallery images and original-image links.
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});
    for(const project of content.projects){
      await page.goto(`${base}/#/work/${project.slug}`);
      await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
      check(await page.locator('h1').textContent()===project.displayName,`${project.slug}: display name`);
      check(await page.locator('.gallery-shot').count()===project.gallery.length,`${project.slug}: full gallery`);
      check(await page.evaluate(()=>[...document.querySelectorAll('main img')].every(img=>img.naturalWidth>0)),`${project.slug}: images decode`);
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${project.slug}: ${width}px no overflow`);
      check(!await page.locator('main').textContent().then(text=>/coming soon|placeholder image/i.test(text)),`${project.slug}: no placeholder copy`);
      if(width===1440){
        for(const media of project.gallery){const response=await page.request.get(`${base}/${media.original}`);check(response.ok(),`${project.slug}: original image accessible`);}
      }
      if(project.slug==='levo')await page.screenshot({path:`.verification/import-levo-${width}.png`,fullPage:true});
    }
    await page.goto(`${base}/#/work`);
    await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
    await page.screenshot({path:`.verification/import-work-${width}.png`,fullPage:true});
    await page.locator('.foot').scrollIntoViewIfNeeded();
    await page.screenshot({path:`.verification/import-footer-${width}.png`});
    check(await page.locator('.foot .foot-logo').isVisible(),'Source footer logo visible');
    check(await page.locator('.foot .slogan').textContent()==='Partner in every Part','Source footer slogan preserved');
    for(const policy of Object.values(content.policies)){
      await page.locator('.foot').getByRole('link',{name:policy.title,exact:true}).click();
      check((await page.locator('h1').textContent()).replaceAll(/\s/g,'')===policy.lines.join('').replaceAll(/\s/g,''),`Footer ${policy.title} route works`);
    }
    await page.locator('.foot-top').click();
    await page.waitForFunction(()=>scrollY<5);
    check(await page.evaluate(()=>scrollY<5),'Footer Back to top works');
  }
  check(errors.length===0,`No browser errors: ${errors.join('; ')}`);
  console.log(`PASS: ${checks} checks. Five widths, eight project galleries, footer/resource links, assets, filters, form, keyboard menu, intro, scroll join, and transitions. Screenshots in .verification/.`);
} finally { await browser.close(); }
