const test=require('node:test'),assert=require('node:assert/strict');const handler=require('../api/inflation.js');
async function call(html,status=200){const prev=global.fetch;let calls=[];global.fetch=async(url,options)=>{calls.push({url,options});return {ok:status===200,status,text:async()=>html}};const res={setHeader(){},status(n){this.code=n;return this},json(x){this.body=x;return this}};try{await handler({query:{}},res);return {body:res.body,calls}}finally{global.fetch=prev}}
const official='<div>Inflation September, 2026 5.54% Consumer Price Index Base: 2024 = 100</div>';
test('official MoSPI homepage is fetched with no-store on every request',async()=>{const a=await call(official),b=await call(official);assert.equal(a.calls.length,1);assert.equal(b.calls.length,1);assert.match(a.calls[0].url,/esankhyiki.mospi.gov.in/);assert.equal(a.calls[0].options.cache,'no-store');assert.equal(a.body.source,'MoSPI eSankhyiki');assert.equal(a.body.rate,5.54);assert.equal(a.body.on,'09/2026');assert.match(a.body.sourceUrl,/mospi.gov.in/)});
test('no third-party fallback',async()=>{const a=await call('Trading Economics India inflation October 2026 5%');assert.equal(a.body.ok,false)});
test('future reporting month rejected',async()=>{assert.equal(handler.valid({month:12,year:2099,rate:5}),false)});
test('stale report rejected',async()=>{assert.equal(handler.valid({month:1,year:2024,rate:5},new Date('2026-11-07')),false)});
test('out-of-range value rejected',async()=>{assert.equal(handler.valid({month:9,year:2026,rate:30},new Date('2026-11-07')),false)});
test('HTTP failure returns no official live value',async()=>{const a=await call(official,503);assert.equal(a.body.ok,false)});
test('malformed HTML returns no official live value',async()=>{const a=await call('<html>offline</html>');assert.equal(a.body.ok,false)});
