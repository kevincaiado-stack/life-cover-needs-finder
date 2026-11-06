const test=require('node:test');const assert=require('node:assert/strict');const handler=require('../api/inflation.js');
async function call(html,status=200){const original=global.fetch;global.fetch=async()=>({ok:status>=200&&status<300,status,text:async()=>html});const headers={};const res={setHeader:(k,v)=>headers[k]=v,status(n){this.code=n;return this},json(v){this.body=v;return this}};try{await handler({query:{}},res);return res.body}finally{global.fetch=original}}
test('valid recent CPI is accepted',async()=>{const d=await call('India inflation rose to 4.3 percent in October 2026.');assert.equal(d.ok,true);assert.equal(d.on,'10/2026')});
test('old CPI is rejected',async()=>{const d=await call('India inflation rose to 5.1 percent in January 2024.');assert.equal(d.ok,false)});
test('future CPI is rejected',async()=>{const d=await call('India inflation rose to 4.3 percent in December 2027.');assert.equal(d.ok,false)});
test('HTTP error response is rejected',async()=>{const d=await call('India inflation rose to 4.3 percent in October 2026.',503);assert.equal(d.ok,false)});
test('malformed source falls back safely',async()=>{const d=await call('<html>unavailable</html>');assert.equal(d.ok,false)});
test('out of range CPI is rejected',async()=>{const d=await call('India inflation rose to 28 percent in October 2026.');assert.equal(d.ok,false)});
