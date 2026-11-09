// Renders the site from site.config.js and fills live numbers from /api/performance.
// You normally don't need to edit this file — change text in site.config.js.
(function () {
  const S = window.SITE;
  if (S.theme === "dark") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", S.theme || "light");
  const BASE = document.body.dataset.base || "";          // "../" on legal pages
  const isHome = !BASE;
  const $ = (id) => document.getElementById(id);
  const link = (h) => (/^(https?:|mailto:|tel:)/.test(h) ? h : h.startsWith("#") ? (isHome ? h : BASE + h) : BASE + h);
  const ext = (h) => (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : "");
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/></svg>',
    bars: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20h16M7 16V9M12 16V5M17 16v-4"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 010 7M18.5 14.8c1.7.9 2.7 2.7 3 5.2"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h6a3 3 0 013 3v12a2 2 0 00-2-2H3zM21 5h-6a3 3 0 00-3 3v12a2 2 0 012-2h7z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  };
  const btn = (href, label, cls = "btn-primary") => `<a class="btn ${cls}" href="${esc(link(href))}"${ext(href)}>${esc(label)} ${I.arrow}</a>`;
  const feats = (list) => `<div class="feats">${list.map((f) => `<span>${I[f.icon] || I.shield}${f.strong ? `<strong>${esc(f.strong)}</strong>` : ""} ${esc(f.text)}</span>`).join("")}</div>`;

  // ─── Header ──────────────────────────────────────────────────────────────
  $("nav").innerHTML = `<div class="container nav-in">
      <a class="brand" href="${isHome ? "#hero" : BASE}"><img src="${BASE}assets/logo.svg" alt="">${esc(S.brand.name)}</a>
      <nav class="nav-links" id="navlinks">${S.nav.map((n) => `<a href="${esc(link(n.href))}">${esc(n.label)}</a>`).join("")}</nav>
      <div style="display:flex;gap:10px;align-items:center">
        ${btn(S.links.bookCall, "Book a Call", "btn-primary btn-sm")}
        <button class="menu-btn" aria-label="Menu" id="menubtn">${I.menu}</button>
      </div></div>`;
  $("menubtn").onclick = () => $("navlinks").classList.toggle("open");
  $("navlinks").addEventListener("click", () => $("navlinks").classList.remove("open"));

  // ─── Footer ──────────────────────────────────────────────────────────────
  const col = (title, items) => `<div><h5>${title}</h5><ul>${items.map(([t, h]) => `<li><a href="${esc(link(h))}">${esc(t)}</a></li>`).join("")}</ul></div>`;
  const c = S.contact, F = S.footer;
  $("footer").innerHTML = `<div class="container">
    <div class="f-grid">
      <div class="f-about">
        <a class="brand" href="${isHome ? "#hero" : BASE}"><img src="${BASE}assets/logo.svg" alt="">${esc(S.brand.name)}</a>
        <p>${esc(S.brand.tagline)}</p>
        <div class="f-contact">
          <div>${I.pin}<span>${esc(c.address)}</span></div>
          <div>${I.mail}<a href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>
          <div>${I.phone}<a href="tel:${esc(c.phone.replace(/\s/g, ""))}">${esc(c.phone)}</a></div>
        </div>
      </div>
      ${col("Company", F.company)}${col("Disclosures", F.disclosures)}${col("Legal", F.legal)}
    </div>
    <div class="f-legal">
      <div><strong>Investor Grievance:</strong> In case of any grievance, please write to <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>. For research-related grievances pertaining to the SEBI Registered Research Analyst, you may also escalate to SEBI via the SCORES portal at <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener">scores.sebi.gov.in</a> or use the Online Dispute Resolution (ODR) portal at <a href="https://smartodr.in" target="_blank" rel="noopener">smartodr.in</a>.</div>
      <div class="reg-box"><div class="h">Regulatory Disclosure</div>${F.regulatory} <a href="${esc(link("legal/sebi-disclosure.html"))}">Read the full regulatory disclosure →</a></div>
      <div><strong>Standard Disclaimer:</strong> ${esc(F.standardDisclaimer)}</div>
      <div class="f-bottom"><span>© ${new Date().getFullYear()} ${esc(S.brand.name)}. All rights reserved.</span><span>Made in India 🇮🇳</span></div>
    </div></div>`;

  if (!isHome) return; // legal pages stop here
  const hashOpeners = {};

  // Each section is drawn separately, so a typo in one part of site.config.js
  // can't stop the rest of the page (or the live numbers) from loading.
  const safe = (name, fn) => { try { fn(); } catch (e) { console.error(`[site] "${name}" section failed:`, e); } };

  // ─── Hero ────────────────────────────────────────────────────────────────
  safe("Hero", () => {
  const H = S.hero;
  $("hero").innerHTML = `
    <div>
      <span class="badge">${I.shield}${esc(H.badge)}</span>
      <h1><span>${esc(H.line1)}</span><span class="g">${esc(H.line2)}</span><span>${esc(H.line3)}</span><span class="o">${esc(H.line4)}</span></h1>
      <p class="lead">${esc(H.text)}</p>
      <div class="hero-ctas">${btn("#strategies", H.primaryCta)}<a class="btn btn-ghost" href="${esc(S.links.watchDemo)}"${ext(S.links.watchDemo)}>${I.play}${esc(H.secondaryCta)}</a></div>
      <div class="hero-stats">
        <div><div class="v" data-k="returnPct">—</div><div class="l">1Y Return</div></div>
        <div><div class="v" data-k="netPnl">—</div><div class="l">Net PnL</div></div>
        <div><div class="v" data-k="sharpe">—</div><div class="l">Sharpe</div></div>
      </div>
    </div>
    <div class="hero-art">${H.visual ? `<div id="viz-hero"></div>` : `<div class="screen">${candleArt()}</div>`}</div>`;
  if (H.visual) window.ProptionVisuals.mount($("viz-hero"), H.visual);

  $("strip").innerHTML = `<div class="container strip-in">
    <div><div class="k-label">1Y Net Return</div><div class="k-val" data-k="returnPct">—</div><div class="k-sub">verified on Zerodha</div></div>
    <div><div class="k-label">Net PnL</div><div class="k-val" data-k="netPnl">—</div><div class="k-sub" data-k="capitalNote">&nbsp;</div></div>
    <div><div class="k-label">Sharpe Ratio</div><div class="k-val white" data-k="sharpe">—</div><div class="k-sub">risk-adjusted</div></div>
    <div><div class="k-label">Win Rate</div><div class="k-val" data-k="winRate">—</div><div class="k-sub" data-k="rrNote">&nbsp;</div></div>
  </div>`;
  });

  // ─── Performance ─────────────────────────────────────────────────────────
  safe("Performance", () => {
  const P = S.performance;
  $("performance").innerHTML = `
    <span class="badge">${I.chart}${esc(P.badge)}</span>
    <h2>${esc(P.titleA)} <span class="g">${esc(P.titleB)}</span></h2>
    <p class="sub">${esc(P.text)}</p>
    <div class="card chart-card">
      <div class="chart-head">
        <div class="legend">
          <span><i class="dot" style="background:var(--green)"></i>${esc(P.seriesName)}<b class="g" data-k="returnPctSigned">—</b></span>
          <span id="lg-nifty"><i class="dot" style="background:var(--orange)"></i>Nifty 50<b class="o" data-k="niftySigned">—</b></span>
          <span id="lg-alpha">Alpha<b class="g" data-k="alphaSigned">—</b></span>
        </div>
        <a class="badge" id="verified-link" href="${esc(S.links.performanceLink || "#")}" target="_blank" rel="noopener">${I.chart}${esc(S.links.performanceLabel || "View Performance")}</a>
      </div>
      <div class="chart-wrap" id="chart"><div class="chart-empty">Loading live performance…</div></div>
    </div>
    <div class="tiles">
      ${[["Net PnL", "netPnl"], ["% Return", "returnPct"], ["Sharpe", "sharpe"], ["Win Rate", "winRate"], ["Avg RR", "avgRR"], ["Max DD", "maxDD"], ["Avg Profit", "avgProfit"]]
        .map(([l, k]) => `<div class="tile"><div class="k-label">${l}</div><div class="tv" data-k="${k}">—</div></div>`).join("")}
    </div>
    <div class="live-note"><i class="live-dot"></i><span id="updated">Live data · auto-synced from verified Zerodha P&amp;L</span></div>`;
  });

  // ─── Quant Strategies ─────────────────────────────────────────────────────────────────
  safe("Quant Strategies", () => {
  const M = S.strategy;
  $("strategies").innerHTML = `
    <span class="badge">${esc(M.badge)}</span>
    <h2>${esc(M.titleA)} <span class="g">${esc(M.titleB)}</span></h2>
    ${(M.visuals || []).length ? `<div class="viz-row">${M.visuals.map((v, i) => `<figure class="viz-fig"><div id="viz-s${i}"></div><figcaption><strong>${esc(v.title)}</strong>${esc(v.caption)}</figcaption></figure>`).join("")}</div>` : ""}
    <div class="product" style="margin-top:40px">
      <div><span class="chip">${esc(M.tag)}</span><h3>${esc(M.name)}</h3><p>${esc(M.text)}</p>${feats(M.features)}</div>
      <div class="side">
        <div class="k-label">1Y Verified Return</div>
        <div class="big" data-k="returnPct">—</div>
        <div class="note">Live · Zerodha verified</div>
        <div class="kv"><span>Min. Capital</span><span>${esc(M.minCapital)}</span></div>
        <div class="kv"><span>Win Rate</span><span class="mono" data-k="winRate">—</span></div>
        <div class="kv"><span>Sharpe</span><span class="mono" data-k="sharpe">—</span></div>
        <div class="kv"><span>Max DD</span><span class="mono" data-k="maxDD">—</span></div>
        <a class="btn btn-primary btn-block" href="${esc(S.links.bookCall)}"${ext(S.links.bookCall)}>${esc(M.cta)} ${I.arrow}</a>
      </div>
    </div>`;
  (M.visuals || []).forEach((v, i) => window.ProptionVisuals.mount($("viz-s" + i), v.type));
  });

  // ─── Academy ─────────────────────────────────────────────────────────────
  safe("Academy", () => {
  const A = S.academy;
  $("academy").innerHTML = `
    <div class="${A.visual ? "acad-head" : ""}">
      <div>
        <span class="badge orange">${I.book}${esc(A.badge)}</span>
        <h2>${esc(A.titleA)} <span class="o">${esc(A.titleB)}</span></h2>
        ${A.visual && A.visualCaption ? `<p class="sub" style="margin-bottom:0">${esc(A.visualCaption)}</p>` : ""}
      </div>
      ${A.visual ? `<div id="viz-acad"></div>` : ""}
    </div>
    <div class="product amber" style="margin-top:40px">
      <div><span class="chip">${esc(A.tag)}</span><h3>${esc(A.name)}</h3><p>${esc(A.text)}</p>${feats(A.features)}
      </div>
      <div class="side">
        ${A.fee ? `<div class="k-label">Program Fee</div><div class="big">${esc(A.fee)}</div><div class="note">${esc(A.feeNote || "")}</div>`
                : `<div class="k-label" style="margin-bottom:12px">Program Details</div>`}
        ${A.details.map(([k, v]) => `<div class="kv"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join("")}
        <a class="btn btn-primary btn-block" id="curr-btn" href="${esc(link(S.links.curriculum))}"${ext(S.links.curriculum)}>${esc(A.cta)} ${I.arrow}</a>
      </div>
    </div>`;
  if (A.visual) window.ProptionVisuals.mount($("viz-acad"), A.visual);
  // Curriculum pop-up
  const CU = A.curriculum;
  if (CU) {
    const dlg = document.createElement("dialog");
    dlg.className = "modal"; dlg.id = "curriculum";
    dlg.innerHTML = `<div class="modal-in">
      <button class="modal-x" aria-label="Close">✕</button>
      <h3>${esc(CU.title)}</h3><div class="modal-sub">${esc(CU.subtitle)}</div>
      <div class="facts">${CU.facts.map(([k, v]) => `<div><div class="k-label">${esc(k)}</div><div class="fv">${esc(v)}</div></div>`).join("")}</div>
      <h4>What you'll get</h4>
      <ul class="ticks">${CU.benefits.map((b) => `<li>${I.shield}<span>${esc(b)}</span></li>`).join("")}</ul>
      <h4>Curriculum</h4>
      <div class="mods">${CU.modules.map((m, i) => `<details${i === 0 ? " open" : ""}><summary><span class="mn">Module ${i + 1}</span>${esc(m.title)}</summary>
        <ol>${m.topics.map((t) => `<li>${esc(t)}</li>`).join("")}</ol></details>`).join("")}</div>
      <p class="modal-note">${esc(CU.note)}</p>
      <a class="btn btn-primary btn-block" href="${esc(CU.enrollLink)}" target="_blank" rel="noopener">${esc(CU.enrollLabel)} ${I.arrow}</a>
    </div>`;
    document.body.appendChild(dlg);
    const open = () => { dlg.showModal(); document.body.style.overflow = "hidden"; };
    const close = () => dlg.close();
    dlg.addEventListener("close", () => { document.body.style.overflow = ""; if (location.hash === "#curriculum") history.replaceState(null, "", location.pathname); });
    dlg.querySelector(".modal-x").onclick = close;
    dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });   // click outside closes
    if (S.links.curriculum === "#curriculum") $("curr-btn").addEventListener("click", (e) => { e.preventDefault(); open(); });
    hashOpeners["#curriculum"] = open;                                          // shareable link
  }
  });

  // ─── About (pop-up with team; each card opens a profile pop-up) ─────────
  safe("About", () => {
  const B = S.about;
  const initials = (n) => n.replace(/^CA\s+/, "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const avatar = (p, cls = "avatar") => p.photo
    ? `<img class="${cls} ph" src="${esc(p.photo)}" alt="${esc(p.name)}">`
    : `<div class="${cls}">${esc(initials(p.name))}</div>`;
  const about = modal("about", "modal-wide", `
    <span class="badge">${esc(B.badge)}</span>
    <h3 style="margin-top:14px">${esc(B.titleA)} <span class="g">${esc(B.titleB)}</span></h3>
    <p class="modal-lead">${esc(B.text)}</p>
    <div class="team-grid">${B.team.map((p, i) => `<div class="tcard">
      <div class="thead">${avatar(p)}<div><h4>${esc(p.name)}</h4><div class="texp">${esc(p.exp)}</div></div></div>
      <div class="trole">${esc(p.role)}</div>
      <ul class="tpts">${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <button class="btn btn-ghost btn-sm tbtn" data-i="${i}">View profile ${I.arrow}</button></div>`).join("")}</div>`);
  const prof = modal("profile", "", "");
  about.el.addEventListener("click", (e) => {
    const b = e.target.closest(".tbtn"); if (!b) return;
    const p = B.team[+b.dataset.i];
    prof.body.innerHTML = `
      <div class="phead">${avatar(p, "avatar avatar-lg")}<div><h3>${esc(p.name)}</h3><div class="trole">${esc(p.role)}</div><div class="texp">${esc(p.exp)}</div></div></div>
      <p class="pbio">${esc(p.bio)}</p>
      <h4>Key Highlights</h4>
      <ul class="ticks">${p.points.map((x) => `<li>${I.shield}<span>${esc(x)}</span></li>`).join("")}</ul>
      <button class="btn btn-ghost btn-sm" style="margin-top:22px" data-close>← Back to team</button>`;
    prof.open();
  });
  hashOpeners["#about"] = about.open;
  });

  // ─── Pop-up helper + links like "#about" / "#curriculum" open pop-ups ───
  function modal(id, cls, html) {
    const d = document.createElement("dialog");
    d.className = "modal " + cls; d.id = id;
    d.innerHTML = `<div class="modal-in"><button class="modal-x" aria-label="Close">✕</button><div class="modal-body">${html}</div></div>`;
    document.body.appendChild(d);
    const open = () => { if (!d.open) d.showModal(); document.body.style.overflow = "hidden"; d.querySelector(".modal-in").scrollTop = 0; };
    const close = () => d.close();
    d.addEventListener("close", () => {
      if (!document.querySelector("dialog[open]")) document.body.style.overflow = "";
      if (location.hash === "#" + id) history.replaceState(null, "", location.pathname);
    });
    d.addEventListener("click", (e) => { if (e.target === d || e.target.closest(".modal-x,[data-close]")) close(); });
    return { el: d, body: d.querySelector(".modal-body"), open, close };
  }

  // ─── CTA ─────────────────────────────────────────────────────────────────
  safe("CTA", () => {
  const C = S.cta;
  $("cta").innerHTML = `<div class="cta-panel">
    <h2>${esc(C.titleA)}<br><span class="g">${esc(C.titleB)}</span><br>${esc(C.titleC)}</h2>
    <p>${esc(C.text)}</p>${btn(S.links.bookCall, C.button)}</div>`;
  });

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const fn = hashOpeners[a.getAttribute("href")];
    if (fn) { e.preventDefault(); $("navlinks").classList.remove("open"); fn(); }
  });
  if (hashOpeners[location.hash]) hashOpeners[location.hash]();

  // ─── Live data ───────────────────────────────────────────────────────────
  fetch("/api/performance").then((r) => r.json()).then(fill).catch(() => {
    $("chart").innerHTML = '<div class="chart-empty">Live performance is temporarily unavailable.</div>';
  });

  function fill(d) {
    if (!d || !d.ok) { $("chart").innerHTML = `<div class="chart-empty">Live performance is temporarily unavailable.</div>`; return; }
    const s = d.stats;
    const pct = (v) => (v == null ? "—" : `${Number(v).toFixed(2)}%`);
    const signed = (v) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${Number(v).toFixed(2)}%`);
    const vals = {
      returnPct: pct(s.returnPct), returnPctSigned: signed(s.returnPct),
      netPnl: inr(s.netPnl), sharpe: s.sharpe == null ? "—" : Number(s.sharpe).toFixed(2),
      winRate: s.winRate == null ? "—" : `${Number(s.winRate).toFixed(1)}%`,
      avgRR: s.avgRR == null ? "—" : Number(s.avgRR).toFixed(2),
      maxDD: pct(s.maxDD), avgProfit: inrFull(s.avgProfit),
      niftySigned: signed(s.niftyReturn), alphaSigned: signed(s.alpha),
      capitalNote: s.tradingDays ? `net of charges · ${s.tradingDays} trading days` : "net of charges",
      rrNote: s.avgRR == null ? "" : `avg RR ${Number(s.avgRR).toFixed(2)}`,
    };
    document.querySelectorAll("[data-k]").forEach((el) => { const k = el.dataset.k; if (k in vals) el.textContent = vals[k]; });
    if (s.niftyReturn == null) { $("lg-nifty").style.display = "none"; $("lg-alpha").style.display = "none"; }
    const vl = $("verified-link");
    const vu = S.links.performanceLink || d.verifiedUrl; if (vu) vl.href = vu; else vl.removeAttribute("href");
    $("updated").textContent = `Live data · auto-synced from verified Zerodha P&L · Last updated ${new Date(d.updatedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })}`;
    drawChart($("chart"), d.series || [], d.benchmark || []);
    if (window.ProptionVisuals) window.ProptionVisuals.setData(d);
  }

  // ₹13.29 L / ₹1.20 Cr style
  function inr(v) {
    if (v == null || isNaN(v)) return "—";
    const a = Math.abs(v), sg = v < 0 ? "-" : "";
    if (a >= 1e7) return `${sg}₹${(a / 1e7).toFixed(2)} Cr`;
    if (a >= 1e5) return `${sg}₹${(a / 1e5).toFixed(2)} L`;
    return `${sg}₹${Math.round(a).toLocaleString("en-IN")}`;
  }
  function inrFull(v) { return v == null ? "—" : `₹${Math.round(v).toLocaleString("en-IN")}`; }

  // ─── Chart (plain SVG, no library) ───────────────────────────────────────
  function drawChart(el, a, b) {
    if (!a.length) { el.innerHTML = '<div class="chart-empty">No trades in the sheet yet.</div>'; return; }
    const W = el.clientWidth || 900, Hh = el.clientHeight || 340, pl = 46, pr = 10, pt = 10, pb = 30;
    const t0 = Date.parse(a[0].date), t1 = Date.parse(a.at(-1).date) || t0 + 1;
    const all = a.concat(b).map((p) => p.pct);
    let lo = Math.min(0, ...all), hi = Math.max(...all);
    const step = niceStep((hi - lo) / 3);
    lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step;
    const X = (d) => pl + ((Date.parse(d) - t0) / (t1 - t0 || 1)) * (W - pl - pr);
    const Y = (v) => pt + (1 - (v - lo) / (hi - lo || 1)) * (Hh - pt - pb);
    const pts = (s) => s.map((p) => [X(p.date), Y(p.pct)]);
    const path = (p) => smooth(p);
    const area = (p) => `${smooth(p)} L${p.at(-1)[0]},${Y(Math.max(lo, 0))} L${p[0][0]},${Y(Math.max(lo, 0))} Z`;

    let grid = "";
    for (let v = lo; v <= hi + 1e-9; v += step) {
      grid += `<line x1="${pl}" x2="${W - pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="#1c2530" stroke-dasharray="${v === 0 ? "" : "3 4"}"/>
               <text x="${pl - 8}" y="${Y(v) + 4}" text-anchor="end" fill="#6b7785" font-size="12">${+v.toFixed(1)}%</text>`;
    }
    // month ticks
    const d0 = new Date(t0), months = [];
    for (let d = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth() + 1, 1)); d.getTime() <= t1; d.setUTCMonth(d.getUTCMonth() + 1)) months.push(new Date(d));
    const every = W < 600 ? 2 : 1;
    months.forEach((m, i) => {
      const x = X(m.toISOString().slice(0, 10));
      grid += `<line x1="${x}" x2="${x}" y1="${pt}" y2="${Hh - pb}" stroke="#161e27" stroke-dasharray="2 5"/>`;
      if (i % every === 0) grid += `<text x="${x}" y="${Hh - 8}" text-anchor="middle" fill="#6b7785" font-size="12">${m.toLocaleString("en", { month: "short", timeZone: "UTC" })}</text>`;
    });

    const A = pts(a), Bp = b.length ? pts(b) : null;
    el.innerHTML = `<svg viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12d99a" stop-opacity=".32"/><stop offset="1" stop-color="#12d99a" stop-opacity="0"/></linearGradient>
        <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7a531" stop-opacity=".18"/><stop offset="1" stop-color="#f7a531" stop-opacity="0"/></linearGradient>
      </defs>
      ${grid}
      <line x1="${pl}" x2="${pl}" y1="${pt}" y2="${Hh - pb}" stroke="#2a3642"/>
      ${Bp ? `<path d="${area(Bp)}" fill="url(#gb)"/><path d="${path(Bp)}" fill="none" stroke="#f7a531" stroke-width="2"/>` : ""}
      <path d="${area(A)}" fill="url(#ga)"/><path d="${path(A)}" fill="none" stroke="#12d99a" stroke-width="2.4"/>
      <line id="hx" y1="${pt}" y2="${Hh - pb}" stroke="#3a4856" opacity="0"/>
      <circle id="hd" r="4.5" fill="#12d99a" stroke="#0b0f14" stroke-width="2" opacity="0"/>
    </svg><div class="chart-tip" id="tip"></div>`;

    const svg = el.querySelector("svg"), tip = el.querySelector("#tip"), hx = el.querySelector("#hx"), hd = el.querySelector("#hd");
    const bmap = new Map(b.map((p) => [p.date, p.pct]));
    svg.addEventListener("mousemove", (e) => {
      const r = svg.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W;
      let i = 0, best = Infinity;
      A.forEach((p, k) => { const dd = Math.abs(p[0] - x); if (dd < best) { best = dd; i = k; } });
      const [px, py] = A[i], dt = a[i].date;
      hx.setAttribute("x1", px); hx.setAttribute("x2", px); hx.setAttribute("opacity", 1);
      hd.setAttribute("cx", px); hd.setAttribute("cy", py); hd.setAttribute("opacity", 1);
      const bv = bmap.get(dt);
      tip.innerHTML = `<div class="d">${new Date(dt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
        <div><span class="g mono">${a[i].pct >= 0 ? "+" : ""}${a[i].pct.toFixed(2)}%</span> Proption</div>
        ${bv != null ? `<div><span class="o mono">${bv >= 0 ? "+" : ""}${bv.toFixed(2)}%</span> Nifty 50</div>` : ""}`;
      tip.style.opacity = 1;
      const tx = (px / W) * r.width, ty = (py / Hh) * r.height;
      tip.style.left = Math.min(tx + 12, r.width - 150) + "px"; tip.style.top = Math.max(ty - 60, 0) + "px";
    });
    svg.addEventListener("mouseleave", () => { tip.style.opacity = 0; hx.setAttribute("opacity", 0); hd.setAttribute("opacity", 0); });
    if (!drawChart.bound) {
      drawChart.bound = true;
      let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => drawChart(el, a, b), 150); });
    }
  }
  function niceStep(raw) {
    const p = 10 ** Math.floor(Math.log10(raw || 1)), n = raw / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
  }
  // Monotone cubic smoothing (no overshoot)
  function smooth(p) {
    if (p.length < 3) return "M" + p.map((q) => q.join(",")).join(" L");
    const n = p.length, m = new Array(n), dx = [], dy = [], s = [];
    for (let i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0] || 1e-6; dy[i] = p[i + 1][1] - p[i][1]; s[i] = dy[i] / dx[i]; }
    m[0] = s[0]; m[n - 1] = s[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = s[i - 1] * s[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / s[i - 1] + (dx[i] + 2 * dx[i - 1]) / s[i]);
    let d = `M${p[0][0]},${p[0][1]}`;
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      d += ` C${p[i][0] + h},${p[i][1] + m[i] * h} ${p[i + 1][0] - h},${p[i + 1][1] - m[i + 1] * h} ${p[i + 1][0]},${p[i + 1][1]}`;
    }
    return d;
  }

  // Decorative candlestick screen for the hero (generated, no image files)
  function candleArt() {
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const W = 640, H = 440, n = 64; let v = 300, out = "", vol = "";
    for (let i = 0; i < 8; i++) out += `<line x1="0" x2="${W}" y1="${40 + i * 48}" y2="${40 + i * 48}" stroke="#1d3a33" stroke-width="1"/>`;
    for (let i = 0; i < 14; i++) out += `<line y1="0" y2="${H}" x1="${i * 48}" x2="${i * 48}" stroke="#14302a" stroke-width="1"/>`;
    for (let i = 0; i < n; i++) {
      const drift = i < 20 ? 0.6 : i < 44 ? -1.6 : -1.1;
      const o = v, c = v + (rnd() - 0.5) * 34 + drift * 4; const hi = Math.min(o, c) - rnd() * 14, lo = Math.max(o, c) + rnd() * 14;
      const x = 14 + i * 9.6, up = c < o, col = up ? "#19e28f" : "#f39a2b";
      out += `<line x1="${x}" x2="${x}" y1="${hi}" y2="${lo}" stroke="${col}" stroke-width="1.4"/><rect x="${x - 3}" y="${Math.min(o, c)}" width="6" height="${Math.max(2, Math.abs(c - o))}" fill="${col}" rx="1"/>`;
      const vh = 12 + rnd() * 40; vol += `<rect x="${x - 3}" y="${H - vh}" width="6" height="${vh}" fill="${up ? "#12b874" : "#0f8f5d"}" opacity=".7"/>`;
      v = Math.max(80, Math.min(330, c));
    }
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><rect width="${W}" height="${H}" fill="#08100e"/>${out}
      <path d="M0 ${H - 70} C 200 ${H - 64}, 420 ${H - 92}, ${W} ${H - 100}" stroke="#f7a531" stroke-width="2.5" fill="none" opacity=".8"/>${vol}
      <rect width="${W}" height="${H}" fill="url(#vg)"/><defs><radialGradient id="vg" cx=".6" cy=".4" r=".9"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient></defs></svg>`;
  }
})();
