// Returns the latest India retail inflation (CPI, year on year) as JSON.
// Validates source status, numerical range and reporting period.
// The app falls back to its own saved rate when this helper cannot answer.
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const SOURCES = [
  { name: "tradingeconomics", url: "https://tradingeconomics.com/india/inflation-cpi" }
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
function recentPeriod(p, now = new Date()) {
  if (!p || !Number.isFinite(p.rate) || p.rate <= 0 || p.rate >= 25) return false;
  if (!Number.isInteger(p.month) || p.month < 1 || p.month > 12 || !Number.isInteger(p.year)) return false;
  const report = p.year * 12 + p.month;
  const current = now.getUTCFullYear() * 12 + now.getUTCMonth() + 1;
  return report <= current && current - report <= 4;
}
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=86400");
  const debug = req.query && req.query.debug;
  const tried = [];
  for (const s of SOURCES) {
    try {
      const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 7000);
      let r, txt;
      try {
        r = await fetch(s.url, { signal: ctl.signal, headers: { "user-agent": "Mozilla/5.0 (compatible; NeedsFinder/1.0)", "accept": "text/html" } });
        if (!r.ok) { tried.push({ source: s.name, status: r.status }); continue; }
        txt = await r.text();
      } finally { clearTimeout(to); }
      const p = parse(txt);
      tried.push({ source: s.name, status: r.status, bytes: txt.length, found: p });
      if (recentPeriod(p)) {
        return res.status(200).json({ ok: true, rate: p.rate, on: String(p.month).padStart(2, "0") + "/" + p.year, source: s.name, ...(debug ? { tried } : {}) });
      }
    } catch (e) { tried.push({ source: s.name, error: String(e && e.message || e) }); }
  }
  res.status(200).json({ ok: false, ...(debug ? { tried } : {}) });
};
