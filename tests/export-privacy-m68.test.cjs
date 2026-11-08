const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../needs-finder.html'),'utf8');
const locales=['en','hi','gu','ta','ml','kn','mr'];
function section(a,b){const start=src.indexOf(a);assert.ok(start>=0,'missing '+a);const end=src.indexOf(b,start+a.length);assert.ok(end>start,'missing end '+b);return src.slice(start,end)}
const summary=section('function buildSummary(){','function sumText(){');
const share=section('function sumText(){','function waShare(){');
const pdf=section('async function downloadSummaryPdf(){','$("dlBtn").onclick=');
test('all seven supported locales are represented in source',()=>{for(const l of locales)assert.match(src,new RegExp('\\b'+l+'\\s*:|["\\x27]'+l+'["\\x27]'))});
test('saved summary uses exactly the approved financial panel allowlist',()=>{const m=summary.match(/var panelIds=\[([^\]]+)\]/);assert.ok(m);assert.deepEqual([...m[1].matchAll(/"([^"]+)"/g)].map(x=>x[1]),['nmBox','rwBox','pmBox','tlBox','mdBox','finBox']);assert.match(summary,/var extras=\[\]/);assert.doesNotMatch(summary,/querySelectorAll\(["']aside/)});
test('advisor-only sections and nested suggestion content excluded',()=>{for(const id of ['sayBox','qsMore','raBox','ccBox','objBox','ksBox','tpBox','qsBox'])assert.ok(summary.includes('"'+id+'"'),'missing exclusion '+id);for(const selector of ['.pcat','.ptip','.rt','.qh','.hb'])assert.ok(summary.includes(selector),'missing nested exclusion '+selector)});
test('export builders are independent of customer/advisor screen toggle',()=>{for(const fn of [summary,share]){assert.doesNotMatch(fn,/custBtn|\.classList\.contains\(["']customer|simpleView|custMode/)} });
test('PDF derives from sanitized summary and not the live advisor DOM',()=>{assert.match(pdf,/doc\.write\(buildSummary\(\)\)/);assert.match(pdf,/querySelectorAll\("\.stage > \.sheet"\)/);assert.doesNotMatch(pdf,/document\.querySelector\(["']aside["']\)\.outerHTML/)});
test('WhatsApp text is fixed financial fields and includes disclaimer',()=>{assert.match(share,/L\.push\(tx\("Extra cover needed"\)/);assert.match(share,/L\.push\(tx\("Total financial need"\)/);assert.match(share,/Strictly for Internal Training Purposes only/);assert.doesNotMatch(share,/innerHTML|outerHTML|objBox|tpBox|sayBox|pcat/)});
test('direct print of advisor workspace is blocked',()=>{assert.match(src,/Direct printing the live advisor workspace is unsafe/);assert.match(src,/body>\*\{display:none!important\}/);assert.match(src,/Use the Print or save as PDF button in the results screen/)});
