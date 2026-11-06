// Animated hero: four rotating slides (equity curve, market tape, probability engine, option chain).
// Text for each slide lives in site.config.js → hero.slides. You normally don't need to edit this file.
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = (n, f) => (getComputedStyle(document.documentElement).getPropertyValue(n).trim() || f);
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const signed = (v) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)}%`;
  let C = {};
  const readColors = () => {
    C = { green: css("--green", "#12d99a"), green2: css("--green-2", "#7ff0c6"), orange: css("--orange", "#f7a531"),
          red: "#f0616d", grid: css("--line", "#1c2530"), dim: css("--muted-2", "#6b7785"), text: css("--text", "#f2f5f7") };
  };
  const rgba = (hex, a) => { const h = hex.replace("#", ""); const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };

  // Canvas wrapper: crisp on any screen, redraws on resize, animates only while running
  function canvasVisual(host, draw) {
    const cv = document.createElement("canvas"); host.appendChild(cv);
    const ctx = cv.getContext("2d");
    const s = { ctx, w: 0, h: 0, running: false, raf: 0, t0: performance.now() };
    const fit = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      if (!r.width) return;
      s.w = r.width; s.h = r.height; cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
      ctx.setTransform(d, 0, 0, d, 0, 0); draw(s, performance.now());
    };
    new ResizeObserver(fit).observe(cv);
    const loop = (now) => { draw(s, now); if (s.running) s.raf = requestAnimationFrame(loop); };
    s.start = () => { s.t0 = performance.now(); fit(); if (reduce) return; if (!s.running) { s.running = true; s.raf = requestAnimationFrame(loop); } };
    s.stop = () => { s.running = false; cancelAnimationFrame(s.raf); };
    s.redraw = () => draw(s, performance.now());
    return s;
  }

  /* ── 1. Equity curve draws itself (real data from the sheet) ─────────── */
  function curve(host) {
    let rows = null, lo = -10, hi = 30;
    host.insertAdjacentHTML("beforeend", `<div class="hv-readout"><span class="k">Cumulative net return</span><span class="v">—</span><span class="s"></span></div>`);
    const elV = host.querySelector(".hv-readout .v"), elS = host.querySelector(".hv-readout .s");
    const DUR = 3600;
    const v = canvasVisual(host, (s, now) => {
      const { ctx, w, h } = s; if (!w) return;
      ctx.clearRect(0, 0, w, h);
      if (!rows) { ctx.fillStyle = C.dim; ctx.font = "13px Inter, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText("Loading live performance…", w / 2, h / 2); return; }
      const n = rows.length, t = reduce ? 1 : Math.min(1, (now - s.t0) / DUR), p = ease(t);
      const L = 42, R = 16, T = 78, B = 28, X = (i) => L + (i / Math.max(1, n - 1)) * (w - L - R), Y = (val) => T + (1 - (val - lo) / (hi - lo)) * (h - T - B);
      ctx.font = "11px Inter, system-ui, sans-serif"; ctx.textAlign = "right"; ctx.fillStyle = C.dim;
      for (let g = Math.ceil(lo / 10) * 10; g <= hi; g += 10) {
        ctx.strokeStyle = C.grid; ctx.setLineDash(g === 0 ? [] : [3, 4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(w - R, Y(g)); ctx.stroke(); ctx.fillText(`${g}%`, L - 8, Y(g) + 4);
      }
      ctx.setLineDash([]);
      const m = Math.max(1, Math.floor(p * (n - 1))), frac = Math.min(1, p * (n - 1) - m);
      const trace = (k) => {
        ctx.beginPath();
        for (let i = 0; i <= Math.min(m, n - 1); i++) { const x = X(i), y = Y(rows[i][k]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        if (m < n - 1) ctx.lineTo(X(m + frac), Y(rows[m][k] + (rows[m + 1][k] - rows[m][k]) * frac));
      };
      const endX = m < n - 1 ? X(m + frac) : X(n - 1);
      if (rows[0][2] != null) { trace(2); ctx.strokeStyle = C.orange; ctx.lineWidth = 1.6; ctx.lineJoin = "round"; ctx.stroke(); }
      trace(1); ctx.lineTo(endX, Y(lo)); ctx.lineTo(X(0), Y(lo)); ctx.closePath();
      const g = ctx.createLinearGradient(0, T, 0, h - B); g.addColorStop(0, rgba(C.green, 0.28)); g.addColorStop(1, rgba(C.green, 0));
      ctx.fillStyle = g; ctx.fill();
      trace(1); ctx.strokeStyle = C.green; ctx.lineWidth = 2.4; ctx.lineJoin = "round"; ctx.stroke();
      const cur = rows[Math.min(n - 1, m)], hy = Y(m < n - 1 ? rows[m][1] + (rows[m + 1][1] - rows[m][1]) * frac : cur[1]);
      const glow = ctx.createRadialGradient(endX, hy, 0, endX, hy, 16); glow.addColorStop(0, rgba(C.green, 0.55)); glow.addColorStop(1, rgba(C.green, 0));
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(endX, hy, 16, 0, 7); ctx.fill();
      ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(endX, hy, 4, 0, 7); ctx.fill();
      ctx.textAlign = "center"; ctx.fillStyle = C.dim; let lastM = "";
      rows.forEach((r, i) => { const mo = r[0].slice(5, 7); if (mo !== lastM && i > 0 && +mo % 2 === 1) ctx.fillText(new Date(r[0] + "T00:00:00Z").toLocaleString("en", { month: "short", timeZone: "UTC" }), X(i), h - 9); lastM = mo; });
      elV.textContent = signed(cur[1]); elS.textContent = cur[2] != null ? `Nifty 50 ${signed(cur[2])}` : "";
    });
    v.setData = (d) => {
      const series = d.series || [], bm = d.benchmark || [];
      if (!series.length) return;
      const bmap = new Map(bm.map((p) => [p.date, p.pct])); let last = bm.length ? 0 : null;
      rows = series.map((p) => { if (bmap.has(p.date)) last = bmap.get(p.date); return [p.date, p.pct, last]; });
      const all = rows.flatMap((r) => (r[2] == null ? [r[1]] : [r[1], r[2]]));
      lo = Math.floor(Math.min(0, ...all) / 5) * 5 - 2; hi = Math.ceil(Math.max(...all) / 5) * 5 + 2;
      v.t0 = performance.now(); v.redraw();
    };
    return v;
  }

  /* ── 2. Market tape: candles form in real time (illustrative) ────────── */
  function tape(host) {
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const STEP = 900, candles = []; let price = 24012;
    const mk = () => { const o = price, c = o + (rnd() - 0.48) * 22; price = c; return { o, c, h: Math.max(o, c) + rnd() * 9, l: Math.min(o, c) - rnd() * 9 }; };
    for (let i = 0; i < 70; i++) candles.push(mk());
    let live = { o: price, c: price, h: price, l: price, target: price + (rnd() - 0.48) * 22 }, born = performance.now();
    host.insertAdjacentHTML("beforeend", `<div class="hv-tape" aria-hidden="true"><div class="hv-tape-track"></div></div><span class="hv-illus hv-illus-up">Illustrative motion, not live prices</span>`);
    const v = canvasVisual(host, (s, now) => {
      const { ctx, w, h } = s; if (!w) return;
      let k = Math.min(1, (now - born) / STEP);
      if (k >= 1 && s.running) { candles.push({ o: live.o, c: live.c, h: live.h, l: live.l }); candles.shift(); price = live.c; live = { o: price, c: price, h: price, l: price, target: price + (rnd() - 0.48) * 22 }; born = now; k = 0; }
      live.c = live.o + (live.target - live.o) * ease(k) + Math.sin(now / 90) * 2.5 * (1 - k); live.h = Math.max(live.h, live.c); live.l = Math.min(live.l, live.c);
      const vis = candles.concat([live]).slice(-62), cw = (w - 70) / 60, shift = s.running ? k * cw : 0;
      const hi = Math.max(...vis.map((c) => c.h)) + 8, lo = Math.min(...vis.map((c) => c.l)) - 8;
      const T = 16, B = 46, Y = (val) => T + (1 - (val - lo) / (hi - lo)) * (h - T - B);
      ctx.clearRect(0, 0, w, h); ctx.lineWidth = 1;
      ctx.strokeStyle = C.grid; for (let i = 1; i < 6; i++) { const y = T + i * (h - T - B) / 6; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      const xOf = (i) => (i - (vis.length - 61)) * cw - shift + 4;
      vis.forEach((c, i) => {
        const x = xOf(i), col = c.c >= c.o ? C.green : C.orange;
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x + cw / 2, Y(c.h)); ctx.lineTo(x + cw / 2, Y(c.l)); ctx.stroke();
        ctx.fillRect(x + cw * 0.18, Math.min(Y(c.o), Y(c.c)), cw * 0.64, Math.max(1.5, Math.abs(Y(c.c) - Y(c.o))));
      });
      ctx.beginPath(); ctx.strokeStyle = rgba(C.orange, 0.7); ctx.lineWidth = 1.6;
      vis.forEach((c, i) => { if (i < 8) return; const avg = vis.slice(i - 8, i + 1).reduce((a, b) => a + b.c, 0) / 9; const x = xOf(i) + cw / 2; i === 8 ? ctx.moveTo(x, Y(avg)) : ctx.lineTo(x, Y(avg)); });
      ctx.stroke();
      const py = Y(live.c), up = live.c >= live.o, col = up ? C.green : C.orange;
      ctx.setLineDash([4, 4]); ctx.strokeStyle = rgba(col, 0.6); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w - 66, py); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = col; ctx.fillRect(w - 66, py - 10, 62, 20);
      ctx.fillStyle = "#05140f"; ctx.font = "600 11px 'JetBrains Mono', monospace"; ctx.textAlign = "center"; ctx.fillText(live.c.toFixed(2), w - 35, py + 4);
      const pulse = (now % 1200) / 1200; ctx.strokeStyle = rgba(C.green, 0.6 * (1 - pulse)); ctx.beginPath(); ctx.arc(w - 72, py, 4 + pulse * 10, 0, 7); ctx.stroke();
    });
    const syms = [["NIFTY 50", 24012.35], ["SENSEX", 79186.4], ["BANKNIFTY", 51840.1], ["FINNIFTY", 23710.6], ["INDIA VIX", 13.42], ["NIFTY IT", 41260.8], ["MIDCPNIFTY", 12455.2]];
    const track = host.querySelector(".hv-tape-track");
    const render = () => {
      const html = syms.map(([nm, val]) => { const ch = (rnd() - 0.5) * 1.6; return `<span class="hv-tape-item"><span class="n">${nm}</span><span>${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span><span class="${ch >= 0 ? "up" : "dn"}">${ch >= 0 ? "▲" : "▼"} ${Math.abs(ch).toFixed(2)}%</span></span>`; }).join("");
      track.innerHTML = html + html;
    };
    render();
    let timer = 0; const start = v.start, stop = v.stop;
    v.start = () => { start(); host.classList.add("on"); if (!reduce) timer = setInterval(render, 6000); };
    v.stop = () => { stop(); host.classList.remove("on"); clearInterval(timer); };
    return v;
  }

  /* ── 3. Probability engine: Galton board → bell curve ───────────────── */
  function probability(host) {
    const ROWS = 12, BINS = ROWS + 1, MAX = 900, mid = ROWS / 2, sd = Math.sqrt(ROWS) / 2;
    let seed = 5; const rnd = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
    let bins = new Array(BINS).fill(0), balls = [], total = 0, lastSpawn = 0, fade = 0;
    host.insertAdjacentHTML("beforeend", `<div class="hv-prob"><span>trials <b>0</b></span><span>within ±1σ <b>0.0%</b></span><span>within ±2σ <b>0.0%</b></span></div>`);
    const [eN, e1, e2] = host.querySelectorAll(".hv-prob b");
    const within = (k) => { let a = 0; bins.forEach((x, i) => { if (Math.abs(i - mid) <= k * sd + 1e-9) a += x; }); return total ? (100 * a) / total : 0; };
    if (reduce) { for (let i = 0; i < 700; i++) { let b = 0; for (let r = 0; r < ROWS; r++) b += rnd() < 0.5 ? 0 : 1; bins[b]++; total++; } }
    return canvasVisual(host, (s, now) => {
      const { ctx, w, h } = s; if (!w) return;
      const top = 24, pegH = h * 0.46, gap = Math.min((w - 40) / (ROWS + 2), 34), gy = pegH / ROWS, cx = w / 2;
      const pegX = (r, j) => cx + (j - r / 2) * gap, pegY = (r) => top + r * gy;
      const baseY = h - 24, binX = (i) => cx + (i - ROWS / 2) * gap;
      ctx.clearRect(0, 0, w, h);
      [[2, rgba(C.orange, 0.06)], [1, rgba(C.green, 0.08)]].forEach(([k, col]) => {
        ctx.fillStyle = col; const x0 = binX(mid - k * sd) - gap / 2, x1 = binX(mid + k * sd) + gap / 2; ctx.fillRect(x0, pegY(ROWS), x1 - x0, baseY - pegY(ROWS));
      });
      ctx.font = "10.5px 'JetBrains Mono', monospace"; ctx.textAlign = "center"; ctx.fillStyle = C.dim;
      [["−2σ", -2], ["−1σ", -1], ["μ", 0], ["+1σ", 1], ["+2σ", 2]].forEach(([t, k]) => ctx.fillText(t, binX(mid + k * sd), baseY + 16));
      ctx.fillStyle = C.grid; for (let r = 0; r < ROWS; r++) for (let j = 0; j <= r; j++) { ctx.beginPath(); ctx.arc(pegX(r, j), pegY(r), 2.2, 0, 7); ctx.fill(); }
      const maxB = Math.max(8, ...bins), availH = baseY - pegY(ROWS) - 12;
      bins.forEach((x, i) => {
        const bh = (x / maxB) * availH, dist = Math.abs(i - mid);
        ctx.fillStyle = dist <= sd ? rgba(C.green, 0.75) : dist <= 2 * sd ? rgba(C.green, 0.45) : rgba(C.orange, 0.55);
        ctx.fillRect(binX(i) - gap * 0.38, baseY - bh, gap * 0.76, bh);
      });
      if (total > 30) {
        ctx.beginPath(); ctx.strokeStyle = C.orange; ctx.lineWidth = 1.8;
        for (let x = -0.5; x <= ROWS + 0.5; x += 0.1) { const pdf = Math.exp(-((x - mid) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI)); const y = baseY - ((pdf * total) / maxB) * availH; x === -0.5 ? ctx.moveTo(binX(x), y) : ctx.lineTo(binX(x), y); }
        ctx.stroke();
      }
      if (s.running) {
        if (now - lastSpawn > 55 && balls.length < 40 && total < MAX) { const path = []; for (let r = 0; r < ROWS; r++) path.push(rnd() < 0.5 ? 0 : 1); balls.push({ path, t: now }); lastSpawn = now; }
        balls = balls.filter((b) => {
          const e = (now - b.t) / 85, r = Math.floor(e), f = e - r;
          if (r >= ROWS) { bins[b.path.reduce((a, c) => a + c, 0)]++; total++; return false; }
          let j = 0; for (let q = 0; q < r; q++) j += b.path[q];
          const x0 = pegX(r, j), x1 = pegX(r + 1, j + b.path[r]), y0 = pegY(r) - 6, y1 = pegY(r + 1) - 6;
          ctx.fillStyle = C.green2; ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f - Math.sin(f * Math.PI) * gy * 0.35, 3, 0, 7); ctx.fill();
          return true;
        });
        if (total >= MAX && !balls.length && ++fade > 140) { bins.fill(0); total = 0; fade = 0; }
      }
      eN.textContent = total.toLocaleString("en-IN"); e1.textContent = `${within(1).toFixed(1)}%`; e2.textContent = `${within(2).toFixed(1)}%`;
    });
  }

  /* ── 4. Living option chain (illustrative) ───────────────────────────── */
  function chain(host) {
    let seed = 23; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let spot = 24012.35; const em = 198, strikes = [];
    for (let k = 23700; k <= 24300; k += 50) strikes.push(k);
    const iv = (k) => 0.13 + (Math.abs(k - spot) / 24000) * 0.4;
    const prem = (k, ce) => Math.max(0, ce ? spot - k : k - spot) + 95 * Math.exp(-(((k - spot) / 260) ** 2)) * (iv(k) / 0.13) + 1.5;
    const oi = strikes.map((k) => ({ ce: 20 + 80 * rnd() * (k > 24000 ? 1.4 : 0.7), pe: 20 + 80 * rnd() * (k < 24000 ? 1.4 : 0.7) }));
    host.insertAdjacentHTML("beforeend", `<div class="hv-chain">
      <div class="hv-chain-top"><span>NIFTY spot <b class="spot"></b></span><span>Expected move <b>±${em}</b></span></div>
      <div class="hv-chain-body"><table><thead><tr><th>CE OI</th><th>CE LTP</th><th class="c">Strike</th><th>PE LTP</th><th>PE OI</th></tr></thead>
      <tbody>${strikes.map((k) => `<tr><td><i class="bar ce"></i><span class="oice"></span></td><td><span class="lce"></span></td><td class="k c">${k.toLocaleString("en-IN")}</td><td><span class="lpe"></span></td><td><i class="bar pe"></i><span class="oipe"></span></td></tr>`).join("")}</tbody></table></div>
    </div><span class="hv-illus">Illustrative motion, not live prices</span>`);
    const rowsEl = [...host.querySelectorAll("tbody tr")], spotEl = host.querySelector(".spot"), last = {};
    const tick = () => {
      spot += (rnd() - 0.5) * 9; spotEl.textContent = spot.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const atm = Math.round(spot / 50) * 50, maxOI = Math.max(...oi.flatMap((o) => [o.ce, o.pe]));
      rowsEl.forEach((tr, i) => {
        const k = strikes[i], o = oi[i]; o.ce = Math.max(5, o.ce + (rnd() - 0.45) * 4); o.pe = Math.max(5, o.pe + (rnd() - 0.45) * 4);
        tr.classList.toggle("atm", k === atm); tr.classList.toggle("band", Math.abs(k - spot) <= em && k !== atm);
        [["lce", prem(k, true)], ["lpe", prem(k, false)]].forEach(([c, val]) => {
          const el = tr.querySelector("." + c), key = k + c, prev = last[key]; el.textContent = val.toFixed(2);
          if (prev !== undefined && Math.abs(val - prev) > 0.05) { el.classList.remove("up", "dn"); void el.offsetWidth; el.classList.add(val > prev ? "up" : "dn"); }
          last[key] = val;
        });
        tr.querySelector(".oice").textContent = `${o.ce.toFixed(1)}L`; tr.querySelector(".oipe").textContent = `${o.pe.toFixed(1)}L`;
        tr.querySelector(".bar.ce").style.width = `${(o.ce / maxOI) * 78}%`; tr.querySelector(".bar.pe").style.width = `${(o.pe / maxOI) * 78}%`;
      });
    };
    tick();
    let timer = 0;
    return { start() { if (!reduce) timer = setInterval(tick, 900); }, stop() { clearInterval(timer); } };
  }

  const FACTORIES = { curve, tape, probability, chain };

  /* ── Slider: rotates slides, syncs copy, tabs and visuals ────────────── */
  window.ProptionHero = {
    mount(root, opts) {
      readColors();
      const { slides, rotateSeconds = 9, renderCopy } = opts;
      const copy = root.querySelector(".hero-copy"), stage = root.querySelector(".hero-stage"), tabs = root.querySelector(".hero-tabs");
      const visuals = slides.map((sl) => {
        const host = document.createElement("div"); host.className = "hv"; stage.appendChild(host);
        try { return (FACTORIES[sl.visual] || curve)(host); }
        catch (err) { console.error("[hero] could not build", sl.visual, err); return { start() {}, stop() {} }; }
      });
      copy.innerHTML = slides.map((sl, i) => `<div class="hc" data-i="${i}"></div>`).join("");
      const layers = [...copy.children];
      slides.forEach((sl, i) => { layers[i].innerHTML = renderCopy(sl); layers[i].setAttribute("aria-hidden", "true"); });
      tabs.innerHTML = slides.map((sl, i) => `<button class="hero-tab" type="button" role="tab" aria-selected="false" data-i="${i}"><span>${sl.tab || sl.visual}</span><i class="prog"></i></button>`).join("");
      const tabEls = [...tabs.children], hosts = [...stage.children];
      let cur = -1, timer = 0, paused = false, visible = true;
      const show = (i) => {
        if (i === cur) return;
        if (cur >= 0) { try { visuals[cur].stop(); } catch (err) {} hosts[cur].classList.remove("active"); tabEls[cur].classList.remove("active"); tabEls[cur].setAttribute("aria-selected", "false"); layers[cur].classList.remove("active"); layers[cur].setAttribute("aria-hidden", "true"); }
        cur = i;
        layers[i].classList.add("active"); layers[i].removeAttribute("aria-hidden");
        hosts[i].classList.add("active"); tabEls[i].classList.add("active"); tabEls[i].setAttribute("aria-selected", "true");
        tabEls[i].style.setProperty("--dur", `${rotateSeconds}s`);
        const prog = tabEls[i].querySelector(".prog"); prog.style.animation = "none"; void prog.offsetWidth; prog.style.animation = "";
        schedule();
        if (visible) { try { visuals[i].start(); } catch (err) { console.error("[hero] slide failed:", err); } }
      };
      const schedule = () => { clearTimeout(timer); if (reduce || paused || !visible) return; timer = setTimeout(() => show((cur + 1) % slides.length), rotateSeconds * 1000); };
      tabs.addEventListener("click", (e) => { const b = e.target.closest(".hero-tab"); if (b) show(+b.dataset.i); });
      // Pause only while the pointer is on the animation itself (not the whole hero), and only on mouse devices
      const art = stage;
      if (matchMedia("(hover: hover)").matches) {
        art.addEventListener("mouseenter", () => { paused = true; root.classList.add("paused"); clearTimeout(timer); });
        art.addEventListener("mouseleave", () => { paused = false; root.classList.remove("paused"); const p = tabEls[cur].querySelector(".prog"); p.style.animation = "none"; void p.offsetWidth; p.style.animation = ""; schedule(); });
      }
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (cur < 0) return;
        try { if (visible) { schedule(); visuals[cur].start(); } else { clearTimeout(timer); visuals[cur].stop(); } } catch (err) { console.error("[hero]", err); }
      }, { threshold: 0.1 }).observe(stage);
      if (reduce) root.classList.add("still");
      show(0);
      this._visuals = visuals;
      if (this._pending) this.setData(this._pending);
    },
    setData(d) {
      if (!this._visuals) { this._pending = d; return; }
      this._visuals.forEach((v) => v.setData && v.setData(d));
    },
  };
})();
