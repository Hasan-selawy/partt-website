/* Partt: native, static pages. Supplied concepts remain the source of truth. */
const main = document.querySelector('main');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mark = '<img class="tiny-mark" src="assets/mark.svg" alt="" aria-hidden="true">';
const link = (text, href = '#/contact', secondary = false) => `<a class="button ${secondary ? 'button-outline' : ''}" href="${href}">${text} ${secondary ? '' : mark}</a>`;
const eyebrow = text => `<p class="eyebrow">${mark}${text}</p>`;
const lines = values => values.map((value,i)=>`<span class="line" style="--i:${i}"><span>${value}</span></span>`).join('');
const content = window.PARTT_CONTENT;
const site = content.site;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const paragraphs = values => (values || []).map(value=>`<p>${escapeHTML(value)}</p>`).join('');
const services = content.services.map(service=>({...service,short:service.name,title:service.name,description:service.summary,bullets:service.items}));
const clients = content.projects.map(project=>({...project,name:project.client}));
const featured = content.home.workShowcase.map(slug=>clients.find(project=>project.slug===slug)).filter(Boolean);
const sectors = [...new Set(clients.map(project=>project.sector).filter(Boolean))];
function projectImage(media, {className='',priority=false,sizes='(max-width:760px) 88vw, 44vw'}={}) {
  return `<img class="${className}" src="${media.src}" srcset="${media.srcset}" sizes="${sizes}" alt="${escapeHTML(media.alt)}" width="${media.w}" height="${media.h}" loading="${priority?'eager':'lazy'}" decoding="async" style="object-position:${media.focus||'50%'} 50%">`;
}
const steps = content.processSteps.map(step=>[step.name,step.text]);
function footer() {
  return `<footer class="foot" id="footer"><div class="wm" aria-hidden="true"><img src="assets/wordmark-base.svg" alt=""><img class="wm-t2" src="assets/wordmark-t2.svg" alt=""></div><div class="foot-main"><div class="foot-brand"><a href="#/" class="foot-logo" aria-label="partt home"><img src="assets/source-wordmark.svg" alt=""></a><p>${escapeHTML(site.footerLine)}</p></div><nav class="foot-nav" aria-labelledby="footer-links-title"><h2 id="footer-links-title">Quick links</h2><ul>${[['Home',''],['Work','work'],['Services','services'],['About','about'],['Contact','contact']].map(([label,path])=>`<li><a href="#/${path}">${label}</a></li>`).join('')}</ul></nav><nav class="foot-nav policy-links" aria-labelledby="footer-resources-title"><h2 id="footer-resources-title">Resources</h2><ul>${Object.values(content.policies).map(policy=>`<li><a href="#${policy.path}">${escapeHTML(policy.title)}</a></li>`).join('')}</ul></nav><div class="foot-contact"><h2 id="footer-contact-title">Contact</h2><address aria-labelledby="footer-contact-title"><a href="mailto:${site.email}">${site.email}</a><a href="tel:${site.phoneHref}">${site.phone}</a><span>${escapeHTML(site.location)}</span></address></div></div><div class="foot-bottom"><p class="legal">© ${new Date().getFullYear()} ${site.legalName}. All rights reserved.</p><p class="slogan">Partner in every <b>Part</b></p><a class="foot-top" href="#main" data-scroll="main">Back to top <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 20V4m-6 6 6-6 6 6"/></svg></a></div></footer>`;
}
function cta(title='Have a project<br>in mind?', copy="Tell us what you're working on and how partt can help bring it to life.") {
  return `<section class="closing-intro" aria-labelledby="closing-title"><h2 id="closing-title" class="reveal">${title}<img class="closing-mark" src="assets/pinwheel.svg" alt="" aria-hidden="true"></h2><div class="closing-go"><p>${escapeHTML(copy)}</p><a class="button closing-button" href="#/contact">Start a project <span aria-hidden="true">↗</span></a></div></section>`;
}
function processSection(dark=false) {
  return `<section class="process section-pad ${dark?'dark':''}">${eyebrow('03 / How we work')}<div class="section-heading"><h2 class="reveal">${content.processIntro.title.map(escapeHTML).join('<br>')}</h2><p>${escapeHTML(content.processIntro.text)}</p></div><div class="steps">${steps.map((step,i)=>`<div class="step reveal" style="--delay:${i*100}ms"><div class="step-dot">${mark}</div><span class="step-number">0${i+1}</span><h3>${escapeHTML(step[0])}</h3><p>${escapeHTML(step[1])}</p></div>`).join('')}</div></section>`;
}
function workCard(project,i=0) {
  const alternate=project.banner||project.gallery[0];
  return `<article class="work-card reveal" data-client="${project.slug}" data-sector="${escapeHTML(project.sector)}" style="--delay:${i%2*120}ms"><a href="#/work/${project.slug}" class="work-image photographic" aria-label="View ${escapeHTML(project.name)} project">${projectImage(project.hero,{className:'project-cover'})}${alternate?projectImage(alternate,{className:'project-alternate'}):''}<span class="work-view">View ↗</span>${project.slug==='incharge'?'<span class="project-note">Fleet concept</span>':''}</a><div class="work-caption"><div><h3><a href="#/work/${project.slug}">${escapeHTML(project.displayName)}</a></h3><p>${[project.sector,project.location].filter(Boolean).map(escapeHTML).join(' · ')}</p></div><span class="project-index">${String(i+1).padStart(2,'0')}</span></div><p class="project-statement">${escapeHTML(project.statement)}</p></article>`;
}
function selectedWork() {
  return `<section class="source-selected" id="work" aria-labelledby="work-title"><div class="source-work-head"><h2 id="work-title">${escapeHTML(content.home.workTitle)}</h2><p>${escapeHTML(content.home.workIntro)}</p></div><ul class="source-work-list">${featured.map((project,i)=>{
    const alternate=project.banner||project.gallery[0];
    const serviceNames=project.services?.map(slug=>services.find(service=>service.slug===slug)?.name||slug).join(', ');
    const meta=[serviceNames||project.sector,project.location].filter(Boolean).map(escapeHTML).join(', ');
    return `<li style="grid-row:${i+1} / span 2"><article class="source-project reveal" data-client="${project.slug}"><div class="source-project-image">${projectImage(project.hero,{sizes:'(max-width:820px) 100vw, 46vw'})}${alternate?projectImage(alternate,{className:'source-project-alternate',sizes:'(max-width:820px) 100vw, 46vw'}):''}</div><div class="source-project-caption"><span class="source-project-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><h3 class="source-project-name"><a href="#/work/${project.slug}">${escapeHTML(project.displayName)}</a></h3>${meta?`<p class="source-project-meta">${meta}</p>`:''}${project.statement?`<p class="source-project-statement">${escapeHTML(project.statement)}</p>`:''}</div></article></li>`;
  }).join('')}<li class="source-work-all" style="${featured.length%2?`grid-row:${featured.length+1};grid-column:2`:''}"><a href="#/work">All work <span aria-hidden="true">→</span></a></li></ul></section>`;
}
function homePage() {
  return `<section class="hero dark"><div class="hero-copy">${eyebrow('Marketing agency, Amman')}<h1>${lines(['Part of','your <em>team.</em>'])}</h1><p>${escapeHTML(content.home.hero.lede)}</p><div class="hero-actions">${link('Start a project')}${link('See our services','#/services',true)}</div></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="hero-axis"></div><img src="assets/mark.svg" alt="" class="hero-mark"></div><a class="scroll-cue" href="#name" data-scroll="name">${mark} Scroll</a><span class="hero-location">Jabal Al-Luweibdeh, Amman</span></section>
  <div class="name-track" id="name"><section class="name-section section-pad"><span class="ghost-number" aria-hidden="true">01</span><div class="name-layout"><div class="name-copy">${eyebrow('01 / The name')}<h2>Part <em>+</em> partner<br>= partt</h2><p>${escapeHTML(content.home.statement.main)} ${escapeHTML(content.home.statement.lead)} ${escapeHTML(content.home.statement.rest)}</p></div><div class="join-diagram" aria-hidden="true"><div class="join-marks"><img class="join-first" src="assets/t-first.svg" alt=""><img class="join-outline" src="assets/t-second.svg" alt=""><img class="join-second" src="assets/t-second.svg" alt=""><div class="speed-lines"></div></div><div class="join-labels"><span>The first t: us</span><span>The second t: you</span></div><div class="join-progress"><i></i></div></div></div><h3 class="name-punchline"><span class="sr-only">The first t is us. The second one is you.</span><span data-type="The first t is us. " aria-hidden="true">The first t is us. </span><em data-type="The second one is you." aria-hidden="true">The second one is you.</em><span class="caret" aria-hidden="true"></span></h3></section></div>
  <section class="services-section section-pad dark"><span class="ghost-number" aria-hidden="true">02</span><div class="section-heading"><div>${eyebrow('02 / Services')}<h2 class="reveal">What we do</h2></div><div><p>${escapeHTML(content.home.journey.introduction)}</p>${link('All services','#/services')}</div></div><div class="service-grid">${services.map((s,i)=>`<a href="#/services/${s.slug}" class="service-card reveal" style="--delay:${i%2*100}ms"><span class="card-tab">${mark}</span><span class="service-number">0${i+1}</span><h3>${s.title}</h3><p>${s.description}</p><span class="underlink">Learn more ${mark}</span></a>`).join('')}</div></section>
  ${processSection()}${selectedWork()}${cta(content.home.storyClosing.heading.map(escapeHTML).join('<br>'),content.home.storyClosing.description)}${footer()}`;
}
function servicesPage() {
  return `<section class="page-hero services-hero dark"><div>${eyebrow('Services')}<h1>${lines(['What','we <em>do</em>'])}</h1><p>${escapeHTML(content.home.journey.introduction)}</p></div><div class="service-index">${services.map((s,i)=>`<a href="#/services/${s.slug}" style="--delay:${i*150}ms">${mark}${s.short}</a>`).join('')}</div></section><section class="service-list">${services.map((s,i)=>`<a href="#/services/${s.slug}" class="service-row"><span class="service-number">0${i+1}</span><h2>${mark}${s.fullTitle||s.title}</h2><ul>${s.bullets.map(b=>`<li>${mark}${b}</li>`).join('')}</ul><span class="circle-arrow" aria-hidden="true"><span class="ca-label">View service</span><span class="ca-icon">↗</span></span></a>`).join('')}</section>${processSection(true)}${cta()}${footer()}`;
}
function servicePage(slug) {
  const aliases={strategy:'strategy-brand',brand:'strategy-brand',digital:'digital-growth',performance:'digital-growth',content:'content-communication',events:'events-activations'};
  const service=services.find(item=>item.slug===(Object.hasOwn(aliases,slug)?aliases[slug]:slug)); if(!service)return notFound();
  const i=services.indexOf(service);
  return `<section class="page-hero service-detail-hero dark"><div><p class="breadcrumb"><a href="#/services">Services</a> / ${escapeHTML(service.title)}</p><h1>${lines([`${escapeHTML(service.title)}<em>.</em>`])}</h1><p>${escapeHTML(service.description)}</p></div><span class="detail-number" aria-hidden="true">0${i+1}<small>/ 04</small></span><img class="detail-mark" src="assets/mark.svg" alt=""></section><section class="section-pad">${eyebrow("What's included")}<h2 class="reveal">What's included</h2><div class="included-grid">${service.bullets.map(item=>`<article class="reveal"><h3>${mark}${escapeHTML(item)}</h3></article>`).join('')}</div></section>${processSection()}<section class="section-pad soft">${eyebrow('Selected work')}<div class="section-heading"><h2>Made together.</h2><a class="underlink" href="#/work">See all work ${mark}</a></div><div class="related-work">${featured.slice(0,2).map(workCard).join('')}</div><div class="faq"><div>${eyebrow('Your next step')}<h2>Questions</h2></div><div><details><summary>How do we get started?<span>+</span></summary><p>${escapeHTML(content.processSteps[0].text)} <a href="#/contact">Tell us about your project.</a></p></details><details><summary>${escapeHTML(content.customNote.title)}<span>+</span></summary><p>${escapeHTML(content.customNote.text)}</p></details></div></div></section><section class="other-services section-pad dark">${eyebrow('Other services')}<div>${services.filter(item=>item!==service).map(item=>`<a href="#/services/${item.slug}"><span>↗</span><h3>${escapeHTML(item.title)}</h3></a>`).join('')}</div></section>${cta()}${footer()}`;
}
function workPage() {
  return `<section class="page-hero work-hero dark">${eyebrow('Work')}<h1>${lines(['Our <em>work</em>'])}</h1><p>Brands we are part of, across tourism, hospitality, retail and services.</p><div class="filters" role="group" aria-label="Filter projects by sector">${['All',...sectors].map((sector,i)=>`<button data-filter="${escapeHTML(sector)}" aria-pressed="${i===0}">${escapeHTML(sector)}</button>`).join('')}</div></section><section class="section-pad work-section"><div class="work-grid">${clients.map(workCard).join('')}</div><p class="filter-status sr-only" role="status">${clients.length} projects shown.</p></section>${cta()}${footer()}`;
}
function casePage(slug) {
  if(slug==='dead-sea')slug='dead-sea-tourist-beach';
  const project=clients.find(item=>item.slug===slug); if(!project)return notFound();
  const next=clients[(clients.indexOf(project)+1)%clients.length];
  const meta=[['Client',project.client],['Sector',project.sector],['Location',project.location],['Year',project.year],['Our part',project.services?.map(slug=>services.find(s=>s.slug===slug)?.title||slug).join(', ')]];
  const [lead,...gallery]=project.gallery;
  const story=[['The challenge','challenge'],['Our approach','approach'],['Creative execution','execution'],['The outcome','results']].filter(([,key])=>project[key]?.length);
  const figure=(media,large=false)=>`<figure class="gallery-shot reveal ${large?'gallery-wide':''}"><a href="${media.original}" target="_blank" rel="noopener" aria-label="View full image: ${escapeHTML(media.alt)}">${projectImage(media,{sizes:large?'89vw':'(max-width:760px) 88vw, 44vw'})}<span class="image-expand" aria-hidden="true">↗</span></a><figcaption>${escapeHTML(media.alt)}</figcaption></figure>`;
  return `<section class="case-heading section-pad"><p class="breadcrumb"><a href="#/work">Work</a> / ${escapeHTML(project.client)}</p><h1 class="${project.displayName.length>16?'long-title':''}">${escapeHTML(project.displayName)}</h1><p class="case-statement">${escapeHTML(project.statement)}</p><div class="case-meta">${meta.filter(([,value])=>value).map(([label,value])=>`<div><span>${label}</span>${escapeHTML(value)}</div>`).join('')}</div><div class="case-cover photographic">${projectImage(project.banner||project.hero,{priority:true,sizes:'89vw'})}</div></section><section class="section-pad case-story"><h2>The brand</h2><div>${paragraphs(project.brand)}</div></section>${lead?`<section class="case-gallery-lead">${figure(lead,true)}</section>`:''}${story.length?`<section class="section-pad case-story"><h2>The work</h2><div class="case-story-blocks">${story.map(([title,key])=>`<article><h3>${title}</h3>${paragraphs(project[key])}</article>`).join('')}</div></section>`:''}${gallery.length?`<section class="case-gallery section-pad" aria-label="${escapeHTML(project.client)} gallery">${gallery.map((media,i)=>figure(media,gallery.length%2===1&&i===gallery.length-1)).join('')}</section>`:''}<section class="next-project cta">${eyebrow('Next project')}<a href="#/work/${next.slug}"><h2>${escapeHTML(next.displayName)}</h2><span class="circle-arrow">→</span></a></section>${cta()}${footer()}`;
}
function aboutPage() {
  const about=content.about;
  return `<section class="page-hero about-hero dark"><div>${eyebrow('About partt')}<h1>${lines(['Part of','your <em>team.</em>'])}</h1><p>${escapeHTML(about.lede)}</p></div><img src="assets/about-parts.webp" alt="Two red puzzle pieces joining together" width="880" height="1160"></section><section class="section-pad story"><span class="ghost-number" aria-hidden="true">01</span>${eyebrow('01 / True partnership')}<div class="story-grid"><h2>${escapeHTML(about.name.title)}</h2><div>${paragraphs(about.story)}</div><p>${escapeHTML(about.name.text)}</p></div></section><section class="section-pad vision dark">${eyebrow('02 / Our approach')}<h2>${escapeHTML(about.approach.title)}</h2><blockquote>${escapeHTML(about.approach.lead)}</blockquote><div class="approach-body">${paragraphs(about.approach.body)}</div></section><section class="section-pad values">${eyebrow('03 / Values')}<h2>Three things<br>we work by</h2><div class="value-grid">${about.pillars.map((value,i)=>`<article class="reveal"><img src="assets/t-first.svg" alt=""><span class="step-number">0${i+1}</span><h3>${escapeHTML(value.name)}</h3><p>${escapeHTML(value.text)}</p></article>`).join('')}</div></section>${processSection()}${cta()}${footer()}`;
}
function contactPage() {
  return `<section class="page-hero contact-hero dark"><div>${eyebrow('Contact')}<h1>${lines(['Tell us about','your <em>brand.</em>'])}</h1><p>Tell us what you're working on and how partt can help bring it to life.</p></div><div class="contact-mark" aria-hidden="true"><img src="assets/t-first.svg" alt=""><img src="assets/t-second.svg" alt=""></div></section><section class="contact-body section-pad"><form id="contact-form"><div class="form-grid"><label>Your name <span>*</span><input name="name" autocomplete="name" required maxlength="120"></label><label>Company or brand<input name="company" autocomplete="organization" maxlength="150"></label><label>Email <span>*</span><input name="email" type="email" autocomplete="email" required maxlength="254"></label><label>Phone<input name="phone" type="tel" autocomplete="tel" maxlength="50"></label></div><fieldset><legend>What do you need?</legend><div class="service-choices">${[...services.map(s=>s.short),'Not sure yet'].map(s=>`<label><input type="checkbox" name="services" value="${s}"><span>${mark}${s}</span></label>`).join('')}</div></fieldset><label class="budget-label">Approximate budget (optional)<input name="budget" maxlength="120" aria-describedby="budget-hint"></label><p class="form-note" id="budget-hint">A rough range is enough.</p><label class="message-label">Tell us more <span>*</span><textarea name="message" rows="4" required maxlength="5000"></textarea></label><p class="form-note">This form prepares an email to info@parttagency.com. You can review it before sending.</p><div class="form-actions"><button type="submit" class="button">Prepare message ${mark}</button><span>Fields with * are required.</span></div><div class="form-result" hidden role="status"><h3>Ready to send.</h3><p>Your message is ready. Open your email app to review and send it.</p><div><a class="button email-draft" href="mailto:info@parttagency.com">Open email app ↗</a><button type="button" class="button button-outline copy-message">Copy message</button></div><pre class="message-preview"></pre></div></form><aside class="contact-details"><div><span>Visit</span><p>${escapeHTML(site.location)}</p></div><div><span>Call</span><a href="tel:+962791910808">+962 79 191 0808</a></div><div><span>Email</span><a href="mailto:info@parttagency.com">info@parttagency.com</a></div><div><span>Let's work together</span><p>A clear plan. One team.<br>Part of your growth.</p></div></aside></section><section class="location-panel"><div class="map-lines" aria-hidden="true"></div><div class="map-label">${mark}<h3>Jabal Al-Luweibdeh</h3></div><p>Amman, Jordan · Area shown; exact office pin to be confirmed.</p></section>${footer()}`;
}
function privacyPage() { return policyPage('privacy'); }
function policyPage(key) {
  const policy=content.policies[key];
  return `<section class="page-hero policy-hero dark">${eyebrow('Resources')}<h1>${lines(policy.lines.map(escapeHTML))}</h1><p>${escapeHTML(policy.introduction)}</p></section><section class="section-pad policy-content"><p class="policy-updated">Updated ${content.policyUpdated.label}</p><nav class="policy-index" aria-label="On this page">${policy.sections.map(section=>`<a href="#${section.id}" data-scroll="${section.id}">${escapeHTML(section.title)}</a>`).join('')}</nav>${policy.sections.map(section=>`<article id="${section.id}"><h2>${escapeHTML(section.title)}</h2>${paragraphs(section.paragraphs)}${section.items?`<ul>${section.items.map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul>`:''}${(section.links||[]).map(item=>`<a href="${item.href}" target="_blank" rel="noopener">${escapeHTML(item.label)} ↗</a>`).join('')}</article>`).join('')}<p>Questions? <a href="mailto:${site.email}">${site.email}</a></p></section>${footer()}`;
}
function notFound() {
  return `<section class="not-found dark"><span>404</span><h1>${lines(['This part','is <em>missing.</em>'])}</h1><p>Let's get you back to the team.</p>${link('Back to home','#/')}</section>${footer()}`;
}

let observer;
let scrollFrame=0;
let routeVersion=0;
let replayAfterNavigation=false;
const getRoute=()=>location.hash.startsWith('#/')?location.hash.slice(2).replace(/\/$/,''):'';
function render() {
  const route=getRoute();
  const [page,slug]=route.split('/');
  const validDepth=route.split('/').length<=2;
  const templates={work:()=>slug?casePage(slug):workPage(),services:()=>slug?servicePage(slug):servicesPage(),about:aboutPage,contact:contactPage,privacy:privacyPage,'privacy-policy':privacyPage,'cookie-policy':()=>policyPage('cookies'),'terms-and-conditions':()=>policyPage('terms')};
  main.innerHTML=validDepth?(route===''?homePage():(Object.hasOwn(templates,page)&&(!slug||['work','services'].includes(page))?templates[page]():notFound())):notFound();
  document.body.dataset.page=page||'home';
  document.title=`${route===''?'Part of your team.':(main.querySelector('h1')?.textContent||'Page not found').replace(/\s+/g,' ')} — partt`;
  document.querySelectorAll('.desktop-nav > a,.mobile-menu nav a').forEach(a=>{const active=a.hash===`#/${page}`; a.classList.toggle('active',active); active?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
  observer?.disconnect();
  observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12});
  main.querySelectorAll('.reveal,.steps,.wm').forEach(el=>observer.observe(el));
  wireForm();
  window.scrollTo({top:0,behavior:'instant'});
  clearTimeout(typeTimer);
  if(!reducedMotion.matches)main.querySelectorAll('.name-punchline [data-type]').forEach(part=>part.textContent='');
  measureName();
  updateScroll();
  playHeroEntrance(0);
  addServiceList(1100);
}
const clamp=value=>Math.max(0,Math.min(1,value));
let pinned=false;
let typeTimer;
let listTimers=[];
function measureName() {
  const section=document.querySelector('.name-section');
  if(!section)return;
  pinned=getComputedStyle(section).position==='sticky';
  // While pinned, the second t waits at the right edge with only a sliver showing.
  const outline=section.querySelector('.join-outline').getBoundingClientRect();
  if(pinned)section.style.setProperty('--join-from',`${Math.max(0,innerWidth-outline.left-outline.width*.3)}px`);
  else section.style.removeProperty('--join-from');
}
function typePunchline(heading) {
  if(!heading)return;
  const parts=[...heading.querySelectorAll('[data-type]')];
  if(reducedMotion.matches){clearTimeout(typeTimer);parts.forEach(part=>part.textContent=part.dataset.type);heading.classList.remove('typing');heading.classList.add('typed');heading.dataset.typed='true';return;}
  if(heading.dataset.typed)return;
  heading.dataset.typed='true';
  let part=0,length=0;
  heading.classList.add('typing');
  (function type(){
    const text=parts[part].dataset.type;
    parts[part].textContent=text.slice(0,++length);
    if(length>=text.length){part++;length=0;}
    if(part<parts.length)typeTimer=setTimeout(type,16);
    else heading.classList.replace('typing','typed');
  })();
}
function playHeroEntrance(t0) {
  const hero=document.querySelector('.hero');
  if(!hero)return;
  hero.classList.remove('hero-enter');hero.style.setProperty('--t0',`${t0}s`);void hero.offsetWidth;hero.classList.add('hero-enter');
}
function playHeaderEntrance(t0) {
  const header=document.querySelector('.site-header');
  header.classList.remove('header-enter');header.style.setProperty('--t0',`${t0}s`);void header.offsetWidth;header.classList.add('header-enter');
}
// Services hero: the + steps down the list, lighting each service in turn.
function addServiceList(start) {
  listTimers.forEach(clearTimeout);listTimers=[];
  const items=[...document.querySelectorAll('.service-index a')];
  if(!items.length)return;
  if(reducedMotion.matches){items.forEach(item=>item.classList.add('on'));items.at(-1).classList.replace('on','hot');return;}
  items.forEach((item,i)=>listTimers.push(setTimeout(()=>{items[i-1]?.classList.replace('hot','on');item.classList.add('hot');},start+i*220)));
}
function updateScroll() {
  scrollFrame=0;
  document.querySelector('.site-header').classList.toggle('scrolled',window.scrollY>40);
  const section=document.querySelector('.name-section');
  if(!section)return;
  let progress;
  if(reducedMotion.matches)progress=1;
  else if(pinned){const track=section.parentElement.getBoundingClientRect();progress=clamp(-track.top/((track.height-innerHeight)*.7));}
  else{const rect=section.getBoundingClientRect();progress=clamp((innerHeight*.8-rect.top)/(innerHeight*.65));}
  section.style.setProperty('--join',progress);
  const joined=pinned?progress>=1:progress>.88;
  section.classList.toggle('joined',joined);
  if(joined)typePunchline(section.querySelector('.name-punchline'));
}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});
window.addEventListener('resize',()=>{measureName();updateScroll();});
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)finishIntro();updateScroll();});
let pointerFrame=0;
document.addEventListener('pointermove',event=>{
  if(reducedMotion.matches||event.pointerType==='touch'||pointerFrame)return;
  pointerFrame=requestAnimationFrame(()=>{
    pointerFrame=0;
    const art=document.querySelector('.hero-art');
    if(!art)return;
    // The big t+ turns toward the cursor, at most 8 degrees.
    const box=art.getBoundingClientRect();
    art.style.setProperty('--turn',`${Math.max(-1,Math.min(1,(event.clientX-box.left-box.width/2)/(innerWidth*.45)))*8}deg`);
  });
});

const menu=document.querySelector('#mobile-menu');
const menuToggle=document.querySelector('.menu-toggle');
function closeMenu(){menu.close();menuToggle.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');}
menuToggle.addEventListener('click',()=>{menu.showModal();menuToggle.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');});
document.querySelector('.menu-close').addEventListener('click',closeMenu);
menu.addEventListener('close',()=>{menuToggle.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');});
menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});

const transition=document.querySelector('#page-transition');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function navigate() {
  const version=++routeVersion;
  closeMenu();
  finishIntro();
  if(reducedMotion.matches){transition.className='';render();main.focus({preventScroll:true});return;}
  // Red +: bars 0-500 ms, full red at 650 ms, quarters slide out 650-1000 ms.
  transition.className='';void transition.offsetWidth;transition.className='covering';
  const page=getRoute().split('/')[0];
  transition.querySelector('span').textContent={services:'What we do',work:'Our work',about:'Part of your team',contact:'Let’s talk',privacy:'Your privacy'}[page]||'Part of your team';
  await delay(650);
  if(version!==routeVersion)return;
  render();
  transition.className='revealing';
  main.focus({preventScroll:true});
  await delay(360);
  if(version===routeVersion){transition.className='';if(replayAfterNavigation){replayAfterNavigation=false;startIntro();}}
}
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#/')||location.hash==='')navigate();});
document.addEventListener('click',event=>{
  const scrollLink=event.target.closest('[data-scroll]');
  if(scrollLink){event.preventDefault();document.getElementById(scrollLink.dataset.scroll)?.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});}
  const filter=event.target.closest('[data-filter]');
  if(filter){
    const value=filter.dataset.filter;
    document.querySelectorAll('.filters button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===value)));
    const shown=clients.filter(project=>value==='All'||project.sector===value);
    const grid=document.querySelector('.work-section .work-grid');
    grid.innerHTML=shown.map(workCard).join('');
    grid.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
    grid.classList.toggle('filtered',value!=='All');
    document.querySelector('.filter-status').textContent=`${shown.length} ${shown.length===1?'project':'projects'} shown${value==='All'?'':` in ${value}`}.`;
  }
  if(event.target.closest('.replay-intro')){
    if(getRoute()!==''){replayAfterNavigation=true;location.hash='#/';return;}
    window.scrollTo({top:0,behavior:'instant'});startIntro();
  }
});
function wireForm(){
  const form=document.querySelector('#contact-form'); if(!form)return;
  let message='';
  for(const name of ['name','message']){const field=form.elements[name];field.addEventListener('input',()=>field.setCustomValidity(field.value.trim()?'':'Please fill in this field.'));}
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form);
    message=`Hello Partt,\n\n${data.get('message').trim()}\n\nName: ${data.get('name').trim()}\nCompany: ${data.get('company').trim()||'—'}\nEmail: ${data.get('email').trim()}\nPhone: ${data.get('phone').trim()||'—'}\nServices: ${data.getAll('services').join(', ')||'To discuss'}\nBudget: ${data.get('budget').trim()||'To discuss'}`;
    const result=form.querySelector('.form-result');
    result.hidden=false;
    result.querySelector('.email-draft').href=`mailto:info@parttagency.com?subject=${encodeURIComponent('Project enquiry — '+data.get('name').trim())}&body=${encodeURIComponent(message)}`;
    result.querySelector('.message-preview').textContent=message;
    result.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});
  });
  form.querySelector('.copy-message').addEventListener('click',async event=>{
    try{await navigator.clipboard.writeText(message);event.target.textContent='Copied ✓';}
    catch{event.target.textContent='Select the message below to copy';}
  });
}
let introTimer;
let countFrame;
let introStart=0;
let introActive=false;
const heroHandoff=3.4;
function finishIntro(){
  clearTimeout(introTimer);cancelAnimationFrame(countFrame);
  if(introActive){
    introActive=false;
    // Skipped before the hand-off: play the hero entrance straight away.
    if(performance.now()-introStart<heroHandoff*1000){playHeroEntrance(0);playHeaderEntrance(0);}
  }
  const intro=document.querySelector('#intro');
  intro.hidden=true;intro.classList.remove('playing');
  document.body.classList.remove('intro-running');
  document.querySelector('.site-header').inert=false;
  main.inert=false;
}
// Film timeline: loader 0-1.6 s, split and lock to 3.4 s, logo lands in the nav at 3.95 s.
function startIntro(){
  if(reducedMotion.matches)return;
  const intro=document.querySelector('#intro');
  finishIntro();
  intro.hidden=false;
  document.body.classList.add('intro-running');
  document.querySelector('.site-header').inert=true;main.inert=true;
  intro.querySelector('.skip-intro').tabIndex=0;
  intro.removeAttribute('aria-hidden');
  const stage=intro.querySelector('.intro-stage');
  const from=stage.getBoundingClientRect();
  const to=document.querySelector('.site-header .brand img').getBoundingClientRect();
  stage.style.setProperty('--fx',`${to.left-from.left}px`);
  stage.style.setProperty('--fy',`${to.top-from.top}px`);
  stage.style.setProperty('--fs',to.width/from.width);
  intro.classList.remove('playing');void intro.offsetWidth;intro.classList.add('playing');
  playHeroEntrance(heroHandoff);playHeaderEntrance(heroHandoff);
  introActive=true;introStart=performance.now();
  const counter=intro.querySelector('.loader-count');
  const wheel=intro.querySelector('.loader-wheel');
  (function count(){
    const time=(wheel.getAnimations()[0]?.currentTime??0)/1000;
    const progress=Math.min(time/1.3,1);
    counter.innerHTML=String(Math.round((1-(1-progress)**2)*100)).padStart(3,'0')+'<span>%</span>';
    if(time<1.6)countFrame=requestAnimationFrame(count);
  })();
  introTimer=setTimeout(finishIntro,3950);
}
document.querySelector('.skip-intro').addEventListener('click',finishIntro);
document.addEventListener('keydown',event=>{if(event.key==='Escape')finishIntro();});
render();
if(getRoute()==='')startIntro();
