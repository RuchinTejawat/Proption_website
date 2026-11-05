# proption.in

Website for Proption Fintech. Plain HTML/CSS/JS — no build step — hosted on
Cloudflare Pages, deployed automatically from GitHub. Performance numbers are
read live from Google Sheets.

## What's where

| File | What it's for |
|---|---|
| `site.config.js` | **All text, prices, links, team, footer.** Edit this for 90% of changes. |
| `functions/api/performance.js` | Reads the Google Sheet and computes the live numbers. Sheet ID / tab / capital at the top. |
| `assets/styles.css` | Colours and layout. Theme colours are at the top (`--green`, `--orange`, …). |
| `assets/app.js` | Builds the page from the config. Usually no need to touch. |
| `legal/*.html` | Terms, Privacy, Investor Charter, etc. Edit the text between the ✏️ comments. |
| `index.html` | Page title, SEO description. |

## Making a change

1. On github.com open the file (e.g. `site.config.js`) → pencil icon → edit → **Commit changes**.
2. Cloudflare rebuilds in ~1 minute. Done.

## Live numbers (Google Sheet)

The site reads tab **Normalized Performance 2026** of
*Account Automation Description_1Cr* (`gid=874859976`):

- Column A = date, column H = Net PnL (₹), column I = % return for the day
- Rows with 0 PnL (weekends/holidays) are skipped
- **1Y return** = sum of daily % returns (correct even when capital changes, e.g. 35 L → 1 Cr)
- **Net PnL** = sum of column H · **Max DD** from the cumulative % curve
- **Win rate / Avg RR / Avg profit** from days with a profit or loss · **Sharpe** = annualised from daily %
- **Zerodha Verified P&L** button uses any `console.zerodha.com/verified/...` link typed in that tab
- **Nifty 50** line is fetched automatically for the same dates

The sheet must be shared as **Anyone with the link → Viewer**.
Results are cached for 5 minutes. Add `?fresh` to `/api/performance` to force a refresh.

### Want to type an exact number yourself?

Add a tab called **Website** with two columns (no header needed):

```
returnPct     37.96
netPnl        1329000
sharpe        1.48
winRate       47.7
avgRR         1.37
maxDD         9.85
avgProfit     32786
niftyReturn   1.92
verifiedUrl   https://console.zerodha.com/verified/xxxx
```

Any key you put there overrides the calculated value; leave a key out to keep it automatic.
Those cells can be formulas, so you control the maths in the sheet.

### Pointing to a different sheet or tab

In Cloudflare: **Pages → your project → Settings → Variables and secrets** add
`SHEET_ID`, `PERF_GID`, `OVERRIDE_TAB`, `CAPITAL` or `CACHE_SECONDS`. Redeploy.

## First-time deploy (GitHub → Cloudflare Pages)

1. Push this folder to a GitHub repo (e.g. `proption-site`).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings: Framework **None**, build command **empty**, output directory **`/`**. Save and deploy.
4. You get `proption-site.pages.dev`. Check it, then **Custom domains → Set up a custom domain → proption.in**
   (and `www.proption.in`). If the domain's DNS is already on Cloudflare it's one click; otherwise
   Cloudflare shows the CNAME to add at your registrar.
5. When the new site looks right, remove proption.in from Lovable so the domain points only here.

## Running it on your computer (optional)

```
npx wrangler pages dev .
```
Opens http://localhost:8788 with the live sheet data.
