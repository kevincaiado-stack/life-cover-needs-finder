const test=require('node:test');
const assert=require('node:assert/strict');
const handler=require('../api/inflation.js');
const SEP='https://www.pib.gov.in/PressReleasePage.aspx?PRID=2322244&lang=1&reg=3';
const OCT='https://www.pib.gov.in/PressReleasePage.aspx?PRID=9999999&lang=1&reg=3';
function release(headMonth,rateMonth,rate='5.54'){
 return '<html><body>Ministry of Statistics & Programme Implementation<h1>PRESS RELEASE OF CONSUMER PRICE INDEX ON BASE 2024=100 FOR '+headMonth.toUpperCase()+', 2026</h1>Year-on-year inflation rate based on All India Consumer Price Index (CPI) with base year 2024 for the month of '+rateMonth+', 2026 over '+rateMonth+', 2025 is '+rate+'%(Provisional).</body></html>';
}
async function invoke(list,byUrl){
 const original=global.fetch;
 const calls=[];
 global.fetch=async (url,opts)=>{calls.push({url,opts});return {ok:true,text:async()=>url.includes('pmreleases')?list:byUrl(url)}};
 const res={setHeader(){},status(){return this},json(value){this.body=value;return this}};
 try{await handler({},res);return {body:res.body,calls}}finally{global.fetch=original}
}
test('official September source parses with matching headline and rate month',()=>{
 const p=handler.parseRelease(release('September','September'),SEP);
 assert.equal(p.rate,5.54);assert.equal(p.month,9);assert.equal(p.sourceUrl,SEP);
});
test('October headline with September rate is rejected, preventing mismatched source attribution',()=>{
 assert.equal(handler.parseRelease(release('October','September'),OCT),null);
});
test('headline and rate with same month but different years are rejected',()=>{
 assert.equal(handler.parseRelease(release('October','October').replace('for the month of October, 2026','for the month of October, 2025'),OCT),null);
});
test('newer matching official release updates rate month and link together',async()=>{
 const list='<a href="PressReleasePage.aspx?PRID=9999999">PRESS RELEASE OF CONSUMER PRICE INDEX ON BASE 2024=100 FOR OCTOBER, 2026</a>';
 const r=await invoke(list,u=>u.includes('9999999')?release('October','October','6.21'):release('September','September'));
 assert.equal(r.body.ok,true);assert.equal(r.body.rate,6.21);assert.equal(r.body.on,'10/2026');assert.equal(r.body.sourceUrl,OCT);
});
test('mismatched newer release falls back to verified September and its link',async()=>{
 const list='<a href="PressReleasePage.aspx?PRID=9999999">PRESS RELEASE OF CONSUMER PRICE INDEX ON BASE 2024=100 FOR OCTOBER, 2026</a>';
 const r=await invoke(list,u=>u.includes('9999999')?release('October','September','6.21'):release('September','September'));
 assert.equal(r.body.rate,5.54);assert.equal(r.body.on,'09/2026');assert.equal(r.body.sourceUrl,SEP);
});
test('all official requests disable caching',async()=>{
 const r=await invoke('',()=>release('September','September'));
 assert.ok(r.calls.length>=2);assert.ok(r.calls.every(c=>c.opts.cache==='no-store'));
});
