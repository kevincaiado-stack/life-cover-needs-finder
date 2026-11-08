// Run with: node tests/cpi-production-smoke-m74.cjs
// Read-only production smoke test. Never updates live rates.
const assert=require('node:assert/strict');
(async()=>{
 const url=process.env.CPI_LIVE_URL||'https://life-cover-needs-finder.vercel.app/api/inflation';
 const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),20000);
 try{
  const r=await fetch(url,{cache:'no-store',signal:ctl.signal});
  assert.equal(r.status,200,'CPI endpoint HTTP status');
  const d=await r.json();
  assert.equal(typeof d.ok,'boolean');
  assert.equal(d.source,'MoSPI via PIB');
  assert.match(String(d.sourceUrl),/^https:\/\/www\.pib\.gov\.in\/PressReleasePage\.aspx\?PRID=\d+/);
  if(d.ok){
   assert.equal(d.stale,false);
   assert.equal(Number.isFinite(d.rate),true);
   assert.match(d.on,/^\d{2}\/20\d{2}$/);
   const [month,year]=d.on.split('/').map(Number);
   assert.ok(month>=1&&month<=12&&year>=2026);
   assert.ok(year>2026||(year===2026&&month>=9),'CPI release must not roll backward');
  }else{
   assert.equal(d.stale,true);
   assert.equal(d.reason,'official-data-unavailable');
  }
  console.log(JSON.stringify({endpoint:url,ok:d.ok,rate:d.ok?d.rate:null,on:d.ok?d.on:null,sourceUrl:d.sourceUrl,stale:d.stale}));
 }finally{clearTimeout(timer)}
})().catch(e=>{console.error('CPI production smoke failed:',e);process.exitCode=1});
