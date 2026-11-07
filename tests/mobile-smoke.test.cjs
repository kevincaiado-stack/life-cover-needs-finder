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
test('M47 dense saved summary moves details into appendix rather than deleting them',async()=>browserCase(async page=>{
 const html=await page.evaluate(()=>{document.querySelector('#age').value='40';document.querySelector('#inc').value='1200000';document.querySelector('#exp').value='50000';render();return buildSummary()});
 await page.setContent(html,{waitUntil:'load'});
 const result=await page.evaluate(()=>{const d=document.querySelector('#summaryDashboard'),p=document.querySelector('#panel-nmBox');for(let i=0;i<45;i++){const n=document.createElement('div');n.className='line';n.textContent='Additional family goal '+i+' ₹1,00,000';p.appendChild(n)}summaryDashboardLayout();return {appendix:!document.querySelector('#summaryAppendix').hidden,kept:document.querySelectorAll('#panel-nmBox .line').length,exists:!!document.querySelector('#panel-nmBox'),main:document.querySelector('#summaryPage').scrollHeight}});
 assert.equal(result.appendix,true);assert.equal(result.exists,true);assert.ok(result.kept>=45);assert.ok(result.main<900);
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
