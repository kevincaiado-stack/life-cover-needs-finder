// Official-only CPI lookup. Every invocation checks MoSPI eSankhyiki; never third-party data.
// An unavailable or unparseable government page returns ok:false; the UI uses its labelled saved baseline.
const SOURCE_URL = "https://esankhyiki.mospi.gov.in/";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function extract(html) {
  const t = String(html).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ").replace(/<[^>]*>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/\s+/g," ");
  // Official homepage KPI reads "Inflation September, 2026 5.54% Consumer Price Index".
  const m = /Inflation\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s*,?\s*(20\d{2})\s+(\d{1,2}(?:\.\d{1,2})?)\s*%\s*Consumer Price Index/i.exec(t);
  if (!m) return null;
  return { month: MONTHS.findIndex(x=>x.toLowerCase()===m[1].toLowerCase())+1, year:Number(m[2]), rate:Number(m[3]) };
}
function valid(p, now=new Date()) {
  if(!p||!Number.isFinite(p.rate)||p.rate<0||p.rate>=25||p.month<1||p.month>12)return false;
  const current=now.getUTCFullYear()*12+now.getUTCMonth()+1, report=p.year*12+p.month;
  return report<=current&&current-report<=4;
}
module.exports=async(req,res)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Cache-Control","no-store, max-age=0");
  try{
    const ctl=new AbortController(), timer=setTimeout(()=>ctl.abort(),6500);
    let response,html;
    try{
      response=await fetch(SOURCE_URL,{signal:ctl.signal,cache:"no-store",headers:{"accept":"text/html","user-agent":"LifeCoverNeedsFinder/1.0 (official CPI lookup)"}});
      if(!response.ok)throw new Error("Official source HTTP "+response.status);
      html=await response.text();
    }finally{clearTimeout(timer)}
    const p=extract(html);
    if(!valid(p))return res.status(200).json({ok:false,source:"MoSPI eSankhyiki",sourceUrl:SOURCE_URL,reason:"official-data-unavailable"});
    return res.status(200).json({ok:true,rate:p.rate,on:String(p.month).padStart(2,"0")+"/"+p.year,source:"MoSPI eSankhyiki",sourceUrl:SOURCE_URL});
  }catch(e){return res.status(200).json({ok:false,source:"MoSPI eSankhyiki",sourceUrl:SOURCE_URL,reason:"official-data-unavailable"})}
};
module.exports.extract=extract;
module.exports.valid=valid;
