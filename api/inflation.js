// Official-government-only CPI: discover new MoSPI releases on PIB, verify each release.
const PIB='https://www.pib.gov.in';
const LIST=PIB+'/newsite/pmreleases.aspx?lang=1&mincode=55&reg=3';
const VERIFIED=PIB+'/PressReleasePage.aspx?PRID=2322244&lang=1&reg=3';
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function parseRelease(html,url){
 const text=String(html).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;|&amp;/gi,' ').replace(/\s+/g,' ');
 const heading=/PRESS RELEASE OF CONSUMER PRICE INDEX ON BASE 2024=100 FOR\s+(January|February|March|April|May|June|July|August|September|October|November|December),?\s*(20\d{2})/i.exec(text);
 if(!heading||!/Ministry of Statistics/i.test(text))return null;
 // Bind the rate's reporting month/year to the official release headline.
 const monthPattern='(January|February|March|April|May|June|July|August|September|October|November|December)';
 const primary=new RegExp('Year-on-year inflation rate based on All India Consumer Price Index \\(CPI\\)[^.!]{0,240}?for the month of\\s+'+monthPattern+',?\\s*(20\\d{2})[^.!]{0,150}?\\bis\\s+(-?\\d{1,2}(?:\\.\\d{1,2})?)\\s*%','i');
 const secondary=new RegExp('Retail inflation based on Consumer Price Index in\\s+'+monthPattern+',?\\s*(20\\d{2})\\s+is\\s+(-?\\d{1,2}(?:\\.\\d{1,2})?)\\s*%','i');
 const rate=primary.exec(text)||secondary.exec(text);
 if(!rate||rate[1].toLowerCase()!==heading[1].toLowerCase()||rate[2]!==heading[2])return null;
 return {month:MONTHS.findIndex(x=>x.toLowerCase()===heading[1].toLowerCase())+1,year:Number(heading[2]),rate:Number(rate[3]),sourceUrl:url};
}
function valid(p,now=new Date()){if(!p||!Number.isFinite(p.rate)||p.rate<=-25||p.rate>=25)return false;const n=now.getUTCFullYear()*12+now.getUTCMonth()+1,k=p.year*12+p.month;return p.month>=1&&p.month<=12&&k<n&&n-k<=4}
function candidates(html){const out=[];const rx=/<a\b[^>]*href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/gi;let m;while((m=rx.exec(String(html)))){const label=m[2].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');if(!/PRESS RELEASE OF CONSUMER PRICE INDEX ON BASE 2024=100 FOR/i.test(label))continue;const id=/PRID=(\d+)/i.exec(m[1]);if(id)out.push(PIB+'/PressReleasePage.aspx?PRID='+id[1]+'&lang=1&reg=3')}return [...new Set(out)]}
async function get(url){const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),6500);try{const r=await fetch(url,{signal:ctl.signal,cache:'no-store',headers:{accept:'text/html'}});if(!r.ok)throw Error('official HTTP '+r.status);return await r.text()}finally{clearTimeout(to)}}
module.exports=async(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Cache-Control','no-store, max-age=0');
 let urls=[VERIFIED];try{urls=[...candidates(await get(LIST)),VERIFIED].slice(0,12)}catch(e){}
 const results=await Promise.all(urls.map(async url=>{try{const p=parseRelease(await get(url),url);return valid(p)?p:null}catch(e){return null}}));
 const p=results.filter(Boolean).sort((a,b)=>(b.year*12+b.month)-(a.year*12+a.month))[0];
 if(!p)return res.status(200).json({ok:false,source:'MoSPI via PIB',sourceUrl:VERIFIED,reason:'official-data-unavailable',stale:true});
 return res.status(200).json({ok:true,rate:p.rate,on:String(p.month).padStart(2,'0')+'/'+p.year,source:'MoSPI via PIB',sourceUrl:p.sourceUrl,stale:false});
};
module.exports.parseRelease=parseRelease;module.exports.candidates=candidates;module.exports.valid=valid;
