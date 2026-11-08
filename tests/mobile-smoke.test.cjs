const {test}=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {resolve}=require('node:path');
const url='file://'+resolve(__dirname,'../needs-finder.html');
async function browserCase(fn){const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']});try{const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await page.route('**/*',route=>{const u=route.request().url();if(u.startsWith('file:'))return route.continue();return route.abort()});page.on('pageerror',e=>console.error('PAGE ERROR:',e.message));await page.goto(url);console.log('PAGE DIAG',await page.evaluate(()=>({scripts:document.scripts.length,ready:document.readyState,html:document.documentElement.outerHTML.length,src:location.href})));return await fn(page)}finally{await browser.close()}}
test('mobile viewport: page initializes and no horizontal overflow',async()=>browserCase(async page=>{const x=await page.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth>window.innerWidth+2,ready:typeof render==='function'}));assert.equal(x.ready,true);assert.equal(x.overflow,false);assert.match(x.title,/Life Cover/)}));
test('all seven languages switch without runtime errors',async()=>browserCase(async page=>{const result=await page.evaluate(()=>{const opts=[...document.querySelector('#lang').options].map(x=>x.value);return opts.map(l=>{setLang(l);return {l,attr:document.documentElement.lang,heading:document.querySelector('h2')?.textContent}})});assert.equal(result.length,7);for(const v of result){assert.equal(v.attr,v.l);assert.ok(v.heading)}}));
test('valid customer inputs retain M38 runway and create standalone summary',async()=>browserCase(async page=>{const x=await page.evaluate(()=>{document.querySelector('#age').value='38';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='60000';document.querySelector('#liab').value='3000000';document.querySelector('#assets').value='1000000';document.querySelector('#cover').value='5000000';render();return {runway:document.querySelector('#rwBox').textContent,summary:buildSummary(),gap:document.querySelector('#oGap').textContent}});assert.match(x.runway,/50 months/);assert.match(x.summary,/Life cover needs summary/);assert.doesNotMatch(x.summary,/id="resetBtn"/);assert.ok(x.gap)}));
test('Simple view toggles without hiding runway',async()=>browserCase(async page=>{const x=await page.evaluate(()=>{document.querySelector('#age').value='38';document.querySelector('#exp').value='60000';document.querySelector('#assets').value='3000000';render();setSimple(true);return {simple:document.documentElement.classList.contains('simple'),visible:getComputedStyle(document.querySelector('#rwBox')).display!=='none',hidden:document.querySelector('#rwBox').hidden}});assert.equal(x.simple,true);assert.equal(x.visible,true);assert.equal(x.hidden,false)}));

test('new official monthly CPI recalculates inflation-dependent projections',async()=>browserCase(async page=>{const x=await page.evaluate(()=>{document.querySelector('#age').value='40';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='50000';render();const before=document.querySelector('#retBox').textContent;const previous=INFL;const previousUI=UI;INFL=previous+1;UI=INFL;INFL_ON='10/2026';render();const after=document.querySelector('#retBox').textContent;INFL=previous;UI=previousUI;return {before,after}});assert.notEqual(x.before,x.after)}));

test('official API response on visit updates CPI and recalculates visible retirement figures',async()=>browserCase(async page=>{const x=await page.evaluate(async()=>{document.querySelector('#age').value='40';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='50000';render();const before=document.querySelector('#retBox').textContent;const prevFetch=window.fetch;window.fetch=async()=>({ok:true,json:async()=>({ok:true,rate:6.54,on:'10/2026',source:'MoSPI eSankhyiki'})});try{loadInfl();await new Promise(resolve=>setTimeout(resolve,50));return {before,after:document.querySelector('#retBox').textContent,rate:INFL,month:INFL_ON,live:LIVE}}finally{window.fetch=prevFetch}});assert.equal(x.rate,6.54);assert.equal(x.month,'10/2026');assert.equal(x.live,true);assert.notEqual(x.before,x.after)}));

test('monthly savings presets and custom value split across goals without double counting',async()=>browserCase(async page=>{const x=await page.evaluate(()=>{const goals=[{k:'education',y:5,v:600000},{k:'home',y:10,v:1200000}];const shares=savingsSplit(goals,15000);const total=shares.reduce((n,g)=>n+g.monthly,0);const first=shares[0].covered;const second=shares[1].covered;return {buttons:document.querySelector('#wiOpts')!==null,custom:document.querySelector('#wiCustom')!==null,slider:document.querySelector('#wiR'),total,first,second,remaining:shares.map(g=>g.remaining),none:savingsSplit(goals,0).every(g=>g.covered===0)}});assert.equal(x.buttons,true);assert.equal(x.custom,true);assert.equal(x.slider,null);assert.ok(Math.abs(x.total-15000)<0.001);assert.equal(x.first,450000);assert.equal(x.second,900000);assert.deepEqual(x.remaining,[150000,300000]);assert.equal(x.none,true)}));
test('savings buttons and custom amount update scenario in browser',async()=>browserCase(async page=>{const x=await page.evaluate(()=>{const g=[{k:'a',y:5,v:600000},{k:'b',y:10,v:1200000}];renderTl(35,60,0,g);document.querySelector('[data-wi="10000"]').click();const button=WI;const amount=document.querySelector('#wiCustom').value;renderTl(35,60,0,g);const visibleBefore=document.querySelector('#tlList').textContent.includes('Monthly allocation');const input=document.querySelector('#wiCustom');input.value='17500';input.dispatchEvent(new Event('input',{bubbles:true}));return {button,amount,custom:WI,selected:document.querySelector('[data-wi="10000"]').getAttribute('aria-pressed'),visible:visibleBefore}});assert.equal(x.button,10000);assert.equal(x.amount,'10000');assert.equal(x.custom,17500);assert.equal(x.selected,'false');assert.equal(x.visible,true)}));

test('M47 saved summary is a landscape dashboard and excludes advisor-only content',async()=>browserCase(async page=>{
 const html=await page.evaluate(()=>{document.querySelector('#age').value='40';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='50000';render();return buildSummary()});
 assert.match(html,/@page\{size:A4 landscape/);assert.match(html,/id="summaryDashboard"/);assert.match(html,/id="summaryAppendix"/);
 assert.doesNotMatch(html,/id="objBox"/);assert.doesNotMatch(html,/id="tpBox"/);assert.doesNotMatch(html,/id="raBox"/);
 await page.setContent(html,{waitUntil:'load'});await page.waitForTimeout(150);
 const result=await page.evaluate(()=>({kpis:document.querySelectorAll('.kpi').length,main:document.querySelector('#summaryPage').scrollHeight,appendix:!document.querySelector('#summaryAppendix').hidden,goal:!!document.querySelector('#panel-nmBox'),title:document.title,panels:document.querySelectorAll('.panel').length}));
 assert.equal(result.kpis,3);assert.equal(result.goal,true);assert.ok(result.panels>=1);assert.ok(result.main<900);
}));
test('M47 dense saved summary keeps every detail and fits each A4 landscape page (shrink-to-fit, nothing deleted)',async()=>browserCase(async page=>{
 const html=await page.evaluate(()=>{document.querySelector('#age').value='40';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='50000';render();return buildSummary()});
 await page.setContent(html,{waitUntil:'load'});
 const result=await page.evaluate(()=>{const p=document.querySelector('#panel-nmBox');for(let i=0;i<45;i++){const n=document.createElement('div');n.className='line';n.textContent='Additional family goal '+i+' ₹1,00,000';p.appendChild(n)}summaryDashboardLayout();const sh=[...document.querySelectorAll('.sheet')].map(s=>{const cs=getComputedStyle(s),avail=s.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);return s.firstElementChild.getBoundingClientRect().height<=avail*1.02});return {kept:document.querySelectorAll('#panel-nmBox .line').length,exists:!!p,fits:sh,sheets:sh.length}});
 assert.equal(result.exists,true);assert.ok(result.kept>=45);assert.ok(result.fits.every(Boolean),'a sheet overflows its A4 page');assert.ok(result.sheets>=2);
}));

test('M48 customer summary exports only allowlisted panels and retains training warning',async()=>browserCase(async page=>{
 const x=await page.evaluate(()=>{document.querySelector('#age').value='40';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='50000';render();const html=buildSummary();return {html,disclaimer:html.includes('Strictly for Internal Training Purposes only'),allowlist:html.includes('id="summaryDashboard"')}});
 assert.equal(x.disclaimer,true);assert.equal(x.allowlist,true);
 for(const id of ['tpBox','objBox','ccBox','sayBox','qsBox','raBox','ksBox','wiCtl'])assert.doesNotMatch(x.html,new RegExp('id="'+id+'"'));
 assert.doesNotMatch(x.html,/class="pcat/);
}));
test('M48 saved summary remains privacy-safe when advisor-only sections are populated',async()=>browserCase(async page=>{
 const x=await page.evaluate(()=>{document.querySelector('#age').value='40';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='50000';render();document.querySelector('#objBox').hidden=false;document.querySelector('#objBox').innerHTML='ADVISOR_ONLY_MARKER';document.querySelector('#tpBox').hidden=false;document.querySelector('#qsBox').hidden=false;document.querySelector('#qsBox').innerHTML='QUICK_START_MARKER';return buildSummary()});
 assert.doesNotMatch(x,/ADVISOR_ONLY_MARKER|QUICK_START_MARKER/);
}));

test('M49 claim record uses consistent individual-death-claims comparison and official source links',async()=>browserCase(async page=>{
 const result=await page.evaluate(()=>({v:CSR.v,pv:CSR.pv,fy:CSR.fy,pfy:CSR.pfy,html:csrBox(()=>''),sources:CSRL.map(x=>x[1])}));
 assert.equal(result.v,'99.52');assert.equal(result.pv,'99.43');assert.equal(result.fy,'2025-26');assert.equal(result.pfy,'2024-25');
 assert.match(result.html,/individual death claims settled \(by number\)/);assert.match(result.html,/99.38%/);assert.match(result.html,/rounded 99.6%/);
 assert.ok(result.sources.some(x=>x.includes('annual-report-2024-25.pdf')));assert.ok(result.sources.some(x=>x==='https://www.canarahsbclife.com/'));
}));

test('M50 all seven languages and both screen modes keep HTML and WhatsApp exports free of advisor markers',async()=>browserCase(async page=>{
 const out=await page.evaluate(()=>{
   document.querySelector('#age').value='38';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='50000';render();
   const ids=['objBox','tpBox','ccBox','sayBox','qsBox','raBox','ksBox'];const markers=ids.map((id,i)=>'ADVISOR_PRIVACY_'+i+'_MARKER');
   ids.forEach((id,i)=>{const el=document.getElementById(id);el.hidden=false;el.insertAdjacentText('beforeend',markers[i])});
   return ['en','hi','gu','ta','ml','kn','mr'].flatMap(l=>{setLang(l);return [false,true].map(cust=>{setCust(cust);const html=buildSummary(),text=sumText();return {l,cust,html,text,lang:document.documentElement.lang,markers}})});
 });
 assert.equal(out.length,14);
 for(const x of out){assert.equal(x.lang,x.l);assert.match(x.html,/id="summaryDashboard"/);assert.match(x.html,/Strictly for Internal Training Purposes only/);assert.ok(x.text.includes('_')&&x.text.trim().endsWith('_'),x.l+' translated training disclaimer missing');for(const m of x.markers){assert.ok(!x.html.includes(m),x.l+' HTML leaked '+m);assert.ok(!x.text.includes(m),x.l+' WhatsApp leaked '+m)}for(const id of ['objBox','tpBox','ccBox','sayBox','qsBox','raBox','ksBox'])assert.ok(!x.html.includes('id="'+id+'"'),x.l+' exported '+id)}
}));
test('M50 browser direct-print shortcut hides live advisor workspace, but exported dashboard remains printable',async()=>browserCase(async page=>{
 await page.evaluate(()=>{document.querySelector('#age').value='38';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='50000';render();document.querySelector('#objBox').hidden=false;document.querySelector('#objBox').textContent='PRIVATE_ADVISOR_PRINT_MARKER'});
 await page.emulateMedia({media:'print'});
 const v=await page.evaluate(()=>({header:getComputedStyle(document.querySelector('header')).display,wrap:getComputedStyle(document.querySelector('.wrap')).display,warning:getComputedStyle(document.body,'::before').content,html:buildSummary()}));
 assert.equal(v.header,'none');assert.equal(v.wrap,'none');assert.match(v.warning,/privacy-safe customer summary/);assert.doesNotMatch(v.html,/PRIVATE_ADVISOR_PRINT_MARKER/);
 await page.setContent(v.html,{waitUntil:'load'});
 await page.emulateMedia({media:'print'});
 const d=await page.evaluate(()=>({display:getComputedStyle(document.querySelector('#summaryPage')).display,panels:document.querySelectorAll('.panel').length,warning:getComputedStyle(document.body,'::before').content}));
 assert.notEqual(d.display,'none');assert.ok(d.panels>0);assert.equal(d.warning,'none');
}));

test('M51 translation dictionary completeness, exact numbered placeholders, and seven-language runtime formatting',async()=>browserCase(async page=>{
 const audit=await page.evaluate(()=>{
  const keys=Object.keys(TD),missing=[],mismatch=[],bad=[];
  const slots=t=>[...String(t).matchAll(/\{\d+\}/g)].map(x=>x[0]).sort().join('|');
  keys.forEach(k=>{const r=TD[k];for(let j=1;j<=6;j++){if(typeof r[j]!=='string'||!r[j].trim())missing.push({k,lang:j});else if(slots(k)!==slots(r[j]))mismatch.push({k,lang:j,source:slots(k),target:slots(r[j])})}});
  ['en','hi','gu','ta','ml','kn','mr'].forEach(l=>{setLang(l);if(document.documentElement.lang!==l)bad.push(l);if(!fmt('Prepared for {0}','TEST_PERSON').includes('TEST_PERSON'))bad.push(l+'-format')});
  return {keys:keys.length,missing:missing.slice(0,30),missingCount:missing.length,mismatch:mismatch.slice(0,30),mismatchCount:mismatch.length,bad};
 });
 console.log('M51 TRANSLATION AUDIT',JSON.stringify(audit));
 assert.equal(audit.missingCount,0);assert.equal(audit.mismatchCount,0);assert.deepEqual(audit.bad,[]);
}));

test('M51 translation review register matches runtime dictionary keys',async()=>browserCase(async page=>{
 const {readFileSync}=require('node:fs');const csv=readFileSync(resolve(__dirname,'../docs/translation-review.csv'),'utf8');
 const rows=[];let row=[],value='',quoted=false;
 for(let i=0;i<csv.length;i++){const c=csv[i];if(quoted){if(c==='"'&&csv[i+1]==='"'){value+='"';i++}else if(c==='"')quoted=false;else value+=c}else if(c==='"')quoted=true;else if(c===','){row.push(value);value=''}else if(c==='\n'){row.push(value.replace(/\r$/,''));rows.push(row);row=[];value=''}else value+=c}
 if(row.length||value){row.push(value);rows.push(row)}
 const reviewRows=rows.slice(1).filter(r=>r[1]);const sources=new Set(reviewRows.map(r=>r[1]));
 const slots=t=>[...String(t).matchAll(/\\{\\d+\\}/g)].map(m=>m[0]).sort().join('|');
 for(const r of reviewRows){assert.equal(r.length,9,'review row '+r[0]+' must have nine columns');for(let j=2;j<=7;j++){assert.ok(r[j]?.trim(),'missing '+r[0]+' language '+j);assert.equal(slots(r[1]),slots(r[j]),'placeholder mismatch row '+r[0]+' language '+j)}}
 const entries=await page.evaluate(()=>Object.values(TD));const keys=entries.map(r=>r[0]);
 const absent=entries.filter(r=>!sources.has(r[0]));const stale=[...sources].filter(k=>!keys.includes(k));
 console.log('M51 CSV DICTIONARY DIFFERENCE',JSON.stringify({runtime:keys.length,registered:sources.size,absent,stale}));
 assert.deepEqual(absent,[]);assert.deepEqual(stale,[]);
}));

test('M52 A4 landscape export: every page fits, long content is kept, PDF pages equal sheets',async()=>browserCase(async page=>{
 const summary=await page.evaluate(()=>{document.querySelector('#age').value='38';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='50000';render();const nm=document.querySelector('#nmBox');nm.insertAdjacentHTML('beforeend','<div id="M52_LONG_DETAILS">'+Array.from({length:95},(_,i)=>'<p>Goal '+i+' — detailed illustration retained</p>').join('')+'</div>');return buildSummary()});
 await page.setContent(summary,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>summaryDashboardLayout());
 const x=await page.evaluate(()=>{const long=document.querySelector('#M52_LONG_DETAILS');const sh=[...document.querySelectorAll('.sheet')];return {longPresent:!!long,sheets:sh.length,fits:sh.map(s=>{const cs=getComputedStyle(s),avail=s.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);return s.firstElementChild.getBoundingClientRect().height<=avail*1.02}),panels:document.querySelectorAll('.panel').length,hasKpis:document.querySelectorAll('.kpi').length,css:document.querySelector('style').textContent}});
 assert.equal(x.longPresent,true);assert.ok(x.fits.every(Boolean),'a page overflows the landscape printable area');assert.equal(x.hasKpis,3);assert.ok(x.panels>=3);assert.match(x.css,/@page\{size:A4 landscape;margin:8mm\}/);assert.doesNotMatch(x.css,/margin:9mm/);
 const pdf=await page.pdf({format:'A4',landscape:true,printBackground:true,preferCSSPageSize:true});
 assert.ok(pdf.length>1500);assert.match(pdf.subarray(0,8).toString(),/%PDF-/);
 const pages=(pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)||[]).length;assert.equal(pages,x.sheets,'PDF page count must equal the number of saved-summary sheets');
}));
test('Saved summary on screen and Print/PDF share one layout (same sheets, same panel positions)',async()=>browserCase(async page=>{
 const html=await page.evaluate(()=>{document.querySelector('#age').value='40';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='50000';render();return buildSummary()});
 await page.setViewportSize({width:1280,height:900});await page.setContent(html,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
 const geo=()=>page.evaluate(()=>{summaryDashboardLayout();const r={};document.querySelectorAll('.sheet').forEach((s,i)=>{const sb=s.getBoundingClientRect(),z=sb.width/(281*96/25.4);s.querySelectorAll('.panel').forEach(pn=>{const b=pn.getBoundingClientRect();r[pn.id]=[i,Math.round((b.left-sb.left)/z),Math.round((b.top-sb.top)/z),Math.round(b.width/z),Math.round(b.height/z)]})});return r});
 const screen=await geo();await page.emulateMedia({media:'print'});const print=await geo();
 assert.deepEqual(screen,print,'screen layout differs from print layout');
}));
test('M52 summary export maintains data and privacy across seven languages in phone viewport',async()=>browserCase(async page=>{
 const out=await page.evaluate(()=>{document.querySelector('#age').value='38';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='60000';render();return ['en','hi','gu','ta','ml','kn','mr'].map(l=>{setLang(l);const html=buildSummary();return {l,lang:html.match(/<html lang="([^"]+)"/)?.[1],panels:(html.match(/class="panel"/g)||[]).length,print:html.includes('size:A4 landscape'),advisor:html.includes('id="objBox"'),disclaimer:html.includes('id="sumDisc"'),script:html.includes('summaryDashboardLayout')}})});
 for(const x of out){assert.equal(x.lang,x.l);assert.equal(x.print,true);assert.equal(x.advisor,false);assert.equal(x.disclaimer,true);assert.equal(x.script,true);assert.ok(x.panels>=3)}
}));
