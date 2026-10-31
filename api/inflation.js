// Returns the latest India retail inflation (CPI, year on year) as JSON.
// Tries several public pages in turn. Every number is sanity-checked.
// The app falls back to its own saved rate when this helper cannot answer.
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const SOURCES = [
  { name: "tradingeconomics", url: "https://tradingeconomics.com/india/inflation-cpi" },
  { name: "ddindia", url: "https://www.google.com/search?q=india+retail+inflation+latest+month+cpi" },
  { name: "mospi", url: "https://www.mospi.gov.in/" }
];
const RX = [
  /(?:to|at|of)\s+(\d{1,2}(?:\.\d{1,2})?)\s*(?:percent|per cent|%)\s+in\s+(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+of)?\s+(20\d\d)/i,
  /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d\d)[^.]{0,120}?(?:CPI|inflation)[^.]{0,120}?(\d{1,2}(?:\.\d{1,2})?)\s*(?:percent|per cent|%)/i
];
function parse(text) {
  const t = text.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/\s+/g, " ");
  let m = RX[0].exec(t);
  if (m) return { rate: parseFloat(m[1]), month: MONTHS.findIndex(x => x.toLowerCase() === m[2].toLowerCase()) + 1, year: +m[3], ctx: t.slice(Math.max(0, m.index - 60), m.index + 160) };
  m = RX[1].exec(t);
  if (m) return { rate: parseFloat(m[3]), month: MONTHS.findIndex(x => x.toLowerCase() === m[1].toLowerCase()) + 1, year: +m[2], ctx: t.slice(Math.max(0, m.index - 20), m.index + 220) };
  return null;
}
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=86400");
  const debug = req.query && req.query.debug;
  const tried = [];
  for (const s of SOURCES) {
    try {
      const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 7000);
      const r = await fetch(s.url, { signal: ctl.signal, headers: { "user-agent": "Mozilla/5.0 (compatible; NeedsFinder/1.0)", "accept": "text/html" } });
      clearTimeout(to);
      const txt = await r.text();
      const p = parse(txt);
      tried.push({ source: s.name, status: r.status, bytes: txt.length, found: p });
      if (p && isFinite(p.rate) && p.rate > 0 && p.rate < 25 && p.month >= 1 && p.year >= 2024) {
        return res.status(200).json({ ok: true, rate: p.rate, on: String(p.month).padStart(2, "0") + "/" + p.year, source: s.name, ...(debug ? { tried } : {}) });
      }
    } catch (e) { tried.push({ source: s.name, error: String(e && e.message || e) }); }
  }
  res.status(200).json({ ok: false, ...(debug ? { tried } : {}) });
};
