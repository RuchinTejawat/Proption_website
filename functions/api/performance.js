// Cloudflare Pages Function: GET /api/performance
//
// Reads the daily performance tab of your Google Sheet, computes every number
// the website shows, adds the Nifty 50 benchmark, and caches the result for a
// few minutes so the sheet is not hit on every page view.
//
// ─── SETTINGS YOU MAY WANT TO CHANGE ─────────────────────────────────────────
// You can also set these in Cloudflare (Pages → Settings → Variables) instead
// of editing this file: SHEET_ID, PERF_GID, OVERRIDE_TAB, CAPITAL, CACHE_SECONDS
const DEFAULTS = {
  SHEET_ID: "17cfDVer-_asbVh2n-GQQEr6pzwi67_j93nmq8z9OeYs", // Account Automation Description_1Cr
  PERF_GID: "874859976",          // tab "Normalized Performance 2026"
  OVERRIDE_TAB: "Website",        // optional tab with key | value rows (see README)
  CAPITAL: "3500000",             // capital shown under "Net PnL" and used for PMS card
  CACHE_SECONDS: "300",           // how long a result is reused (5 minutes)
};

// Column positions in the performance tab (A = 0, B = 1, ...)
const COL = { date: 0, netPnl: 7, pctReturn: 8 };
// ─────────────────────────────────────────────────────────────────────────────

export async function onRequestGet(context) {
  const env = { ...DEFAULTS, ...pick(context.env, Object.keys(DEFAULTS)) };
  const url = new URL(context.request.url);
  const fresh = url.searchParams.has("fresh");

  const cache = caches.default;
  const cacheKey = new Request(url.origin + "/api/performance", { method: "GET" });
  if (!fresh) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  }

  try {
    const data = await buildPerformance(env);
    const res = json(data, 200, Number(env.CACHE_SECONDS));
    context.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) }, 502, 0);
  }
}

export async function buildPerformance(env, fetchImpl = fetch) {
  const csvUrl = `https://docs.google.com/spreadsheets/d/${env.SHEET_ID}/export?format=csv&gid=${env.PERF_GID}`;
  const r = await fetchImpl(csvUrl, { redirect: "follow" });
  if (!r.ok) throw new Error(`Sheet fetch failed (${r.status}). Is the sheet shared as "Anyone with the link can view"?`);
  const text = await r.text();
  if (text.trim().startsWith("<")) throw new Error("Sheet returned a login page. Share it as \"Anyone with the link can view\".");

  const rows = parseCSV(text);
  const metrics = computeMetrics(rows, Number(env.CAPITAL));

  // Zerodha "verified P&L" link, if one is typed anywhere in the tab
  const verifiedUrl = (text.match(/https:\/\/console\.zerodha\.com\/verified\/[A-Za-z0-9]+/) || [null])[0];

  // Optional overrides tab: lets you type an exact value for any metric
  const overrides = await readOverrides(env, fetchImpl);

  // Nifty 50 benchmark over the same dates (best effort)
  let benchmark = null;
  if (metrics.series.length) {
    benchmark = await niftySeries(metrics.series[0].date, metrics.series.at(-1).date, fetchImpl).catch(() => null);
  }
  const niftyReturn = benchmark && benchmark.length ? benchmark.at(-1).pct : null;

  const out = {
    ok: true,
    updatedAt: new Date().toISOString(),
    verifiedUrl,
    capital: metrics.capital,
    period: { from: metrics.series[0]?.date ?? null, to: metrics.series.at(-1)?.date ?? null },
    stats: {
      returnPct: metrics.returnPct,
      netPnl: metrics.netPnl,
      sharpe: metrics.sharpe,
      winRate: metrics.winRate,
      avgRR: metrics.avgRR,
      maxDD: metrics.maxDD,
      avgProfit: metrics.avgProfit,
      avgLoss: metrics.avgLoss,
      tradingDays: metrics.tradingDays,
      niftyReturn,
      alpha: niftyReturn == null ? null : metrics.returnPct - niftyReturn,
    },
    series: metrics.series,          // [{date, pct}] cumulative %
    benchmark,                       // [{date, pct}] cumulative % or null
  };

  for (const [k, v] of Object.entries(overrides)) {
    if (k in out.stats) out.stats[k] = v;
    else if (k === "capital") out.capital = v;
    else if (k === "verifiedUrl") out.verifiedUrl = v;
  }
  if (out.stats.niftyReturn != null && !("alpha" in overrides)) {
    out.stats.alpha = out.stats.returnPct - out.stats.niftyReturn;
  }
  return out;
}

// ─── Metric maths ────────────────────────────────────────────────────────────
export function computeMetrics(rows, capital) {
  const days = [];
  for (const r of rows.slice(1)) {
    const date = parseDate(r[COL.date]);
    if (!date) continue;
    const pnl = toNum(r[COL.netPnl]);
    const pct = toNum(r[COL.pctReturn]); // already a percent, e.g. -1.00
    if (pnl === null || pct === null) continue;
    if (pnl === 0 && pct === 0) continue;          // weekend / holiday / no trade
    days.push({ date, pnl, pct: pct / 100 });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));

  // Return = sum of each day's % return. Daily % is measured on the capital
  // used that day, so this stays correct when capital changes during the year.
  let cum = 0, peak = 0, maxDD = 0;
  const series = [];
  for (const d of days) {
    cum += d.pct;
    peak = Math.max(peak, cum);
    maxDD = Math.max(maxDD, peak - cum);
    series.push({ date: d.date, pct: round(cum * 100, 3) });
  }
  const wins = days.filter(d => d.pnl > 0), losses = days.filter(d => d.pnl < 0);
  const avgProfit = wins.length ? sum(wins.map(d => d.pnl)) / wins.length : 0;
  const avgLoss = losses.length ? sum(losses.map(d => d.pnl)) / losses.length : 0;
  const pcts = days.map(d => d.pct);
  const mean = pcts.length ? sum(pcts) / pcts.length : 0;
  const sd = pcts.length > 1 ? Math.sqrt(sum(pcts.map(p => (p - mean) ** 2)) / (pcts.length - 1)) : 0;

  return {
    capital,
    returnPct: round(cum * 100, 2),
    netPnl: round(sum(days.map(d => d.pnl)), 0),
    sharpe: sd ? round((mean / sd) * Math.sqrt(252), 2) : null,
    winRate: days.length ? round((wins.length / days.length) * 100, 1) : null,
    avgRR: avgLoss ? round(avgProfit / -avgLoss, 2) : null,
    maxDD: round(maxDD * 100, 2),
    avgProfit: round(avgProfit, 0),
    avgLoss: round(avgLoss, 0),
    tradingDays: days.length,
    series,
  };
}

// ─── Optional "Website" overrides tab ────────────────────────────────────────
async function readOverrides(env, fetchImpl) {
  if (!env.OVERRIDE_TAB) return {};
  const u = `https://docs.google.com/spreadsheets/d/${env.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(env.OVERRIDE_TAB)}`;
  try {
    const r = await fetchImpl(u);
    if (!r.ok) return {};
    const text = await r.text();
    if (text.trim().startsWith("<")) return {};
    const out = {};
    for (const [k, v] of parseCSV(text)) {
      if (!k || v === undefined || v === "") continue;
      const key = k.trim();
      const n = toNum(v);
      out[key] = n === null ? v.trim() : n;
    }
    return out;
  } catch { return {}; }
}

// ─── Nifty 50 benchmark ──────────────────────────────────────────────────────
async function niftySeries(fromISO, toISO, fetchImpl) {
  const p1 = Math.floor(Date.parse(fromISO + "T00:00:00Z") / 1000) - 7 * 86400;
  const p2 = Math.floor(Date.parse(toISO + "T23:59:59Z") / 1000) + 86400;
  const u = `https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?period1=${p1}&period2=${p2}&interval=1d`;
  const r = await fetchImpl(u, { headers: { "User-Agent": "Mozilla/5.0 (compatible; proption-site)" } });
  if (!r.ok) return null;
  const j = await r.json();
  const res = j?.chart?.result?.[0];
  const ts = res?.timestamp || [], close = res?.indicators?.quote?.[0]?.close || [];
  const pts = [];
  for (let i = 0; i < ts.length; i++) {
    if (close[i] == null) continue;
    const d = new Date((ts[i] + 5.5 * 3600) * 1000).toISOString().slice(0, 10);
    pts.push({ date: d, close: close[i] });
  }
  // base = last close before the first trading day of the strategy
  const before = pts.filter(p => p.date < fromISO);
  const base = (before.at(-1) || pts[0])?.close;
  if (!base) return null;
  return pts.filter(p => p.date >= fromISO && p.date <= toISO)
            .map(p => ({ date: p.date, pct: round((p.close / base - 1) * 100, 3) }));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const MONTHS = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,sept:9,oct:10,nov:11,dec:12 };
export function parseDate(s) {
  if (!s) return null;
  s = String(s).trim();
  let m = s.match(/^(\d{1,2})[\s-]+([A-Za-z]{3,9})[\s-,]+(\d{4})$/);      // 1 Jan 2026
  if (m) { const mo = MONTHS[m[2].slice(0, 4).toLowerCase()] || MONTHS[m[2].slice(0, 3).toLowerCase()]; if (mo) return iso(+m[3], mo, +m[1]); }
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);                           // 2026-01-01
  if (m) return iso(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);                        // 1/31/2026 (US export)
  if (m) return iso(+m[3], +m[1], +m[2]);
  return null;
}
function iso(y, m, d) { return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
export function toNum(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).replace(/Rs\.?|₹|,|%|\s/g, "");
  if (s === "" || s === "-") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
export function parseCSV(text) {
  const rows = []; let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}
const sum = a => a.reduce((x, y) => x + y, 0);
const round = (n, p) => Math.round(n * 10 ** p) / 10 ** p;
function pick(o, keys) { const r = {}; for (const k of keys) if (o && o[k] != null && o[k] !== "") r[k] = o[k]; return r; }
function json(body, status, maxAge) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": maxAge ? `public, max-age=60, s-maxage=${maxAge}` : "no-store",
    },
  });
}
