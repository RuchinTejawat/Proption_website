// ═══════════════════════════════════════════════════════════════════════════
//  PROPTION WEBSITE — EDIT YOUR CONTENT HERE
//  Change any text, price, link or list below, commit to GitHub, and
//  Cloudflare redeploys the site in about a minute.
//  Numbers like return %, Sharpe, win rate come LIVE from the Google Sheet —
//  you don't type those here (see README → "Live numbers").
// ═══════════════════════════════════════════════════════════════════════════
window.SITE = {
  brand: {
    name: "Proption Fintech",
    tagline: "Quant-led research and education firm. See regulatory disclosure below.",
  },

  // Buttons and links used across the site
  links: {
    bookCall: "https://wa.me/919321474231?text=Hi%2C%20I%27d%20like%20to%20book%20a%20call%20with%20Proption%20Fintech",
    watchDemo: "https://www.youtube.com/",           // ← put your demo video link
    curriculum: "#curriculum",                        // "#curriculum" opens the pop-up; or put a PDF / form link
    // Button next to the performance chart
    performanceLink: "https://docs.google.com/spreadsheets/d/17cfDVer-_asbVh2n-GQQEr6pzwi67_j93nmq8z9OeYs/edit?gid=874859976#gid=874859976",
    performanceLabel: "View Performance",
  },

  nav: [
    { label: "Performance", href: "#performance" },
    { label: "Quant Strategies", href: "#strategies" },
    { label: "Academy", href: "#academy" },
    { label: "About", href: "#about" },
  ],

  hero: {
    badge: "Quant-led research & market education",
    line1: "Compound your",
    line2: "capital.",           // green
    line3: "Master the",
    line4: "markets.",           // orange
    text: "India's research-first fintech delivering institutional-grade quant strategies and a world-class stock market academy — built by quant experts.",
    primaryCta: "Explore Strategies",
    secondaryCta: "Watch Demo",
  },

  performance: {
    badge: "Verified Performance",
    titleA: "12 months of",
    titleB: "verified alpha.",
    text: "Cumulative net returns of our flagship strategy, independently verified on Zerodha. Past performance is not indicative of future results.",
    seriesName: "Proption Quant Strategy",
  },

  strategy: {
    badge: "Quant Strategies",
    titleA: "A single, focused",
    titleB: "quant strategy.",
    tag: "Flagship · Intraday Options",
    name: "Statistical Quant System",
    text: "Data-driven, rules-based trading system built on statistical edges, rigorous backtests and disciplined risk management.",
    features: [
      { icon: "bars", strong: "NIFTY 50", text: "+ BSE SENSEX" },
      { icon: "sun", strong: "", text: "Pure Intraday · No overnight risk" },
      { icon: "shield", strong: "", text: "Research-backed quant strategy" },
    ],
    minCapital: "₹10 Lakhs",
    cta: "Book a Call",
  },

  academy: {
    badge: "Proption Academy",
    titleA: "Learn the markets from",
    titleB: "Quant Experts.",
    tag: "Flagship · Beginner to Advanced",
    name: "Statistical Options Trading Program",
    text: "A structured, statistics-first program built for serious traders who want to move beyond guesswork. Learn the exact framework — probability, volatility, Greeks, position sizing and disciplined risk management — that powers our verified flagship strategy.",
    features: [
      { icon: "play", strong: "2 weeks", text: "· Live + Recorded" },
      { icon: "users", strong: "", text: "Cohort + community" },
      { icon: "shield", strong: "", text: "Mentored by quant experts" },
    ],
    fee: "₹20,000",
    feeNote: "+ GST · one-time",
    details: [
      ["Duration", "2 weeks"],
      ["Modules", "6"],
      ["Level", "Basics → Advanced"],
      ["Mode", "Online · Live"],
    ],
    // ─── "View Curriculum" pop-up ───────────────────────────────────────
    curriculum: {
      title: "Statistical Options Trading Program",
      subtitle: "Basics to Advanced · 6 Modules · 2 Weeks",
      facts: [
        ["Duration", "2 Weeks"],
        ["Level", "Basics → Advanced"],
        ["Format", "Live + Recorded"],
      ],
      benefits: [
        "Live + recorded sessions by quant experts",
        "Real, verified trade examples from our flagship strategy",
        "Statistical & probability-driven approach (not chart guessing)",
        "Hands-on with option chain, Greeks, IV and position sizing",
        "Lifetime access to recordings & curriculum updates",
        "Community access for doubt resolution",
      ],
      modules: [
        { title: "Basics of Options", topics: [
          "Call vs Put Options", "Strike Price, Premium, Expiry",
          "Option Buyer vs Seller: Rights & Obligations", "Intrinsic Value & Time Value",
          "Moneyness: ITM, ATM, OTM" ] },
        { title: "Analysis of Options", topics: [
          "Option Chain Analysis", "Concept of Open Interest", "Concept of PCR, Max Pain",
          "Option Greeks (Delta, Theta, Vega, Gamma, Rho)", "India VIX and IV", "IV Percentile & IV Rank" ] },
        { title: "Statistical Parameters", topics: [
          "Normal Distribution", "Z-Score and how it's calculated", "Standard Deviation",
          "Calculating Probability of Winning", "Volatility", "Expected Value", "Edge Factor",
          "Law of Large Numbers in Options", "Win Rate vs Risk-Reward vs Drawdown" ] },
        { title: "Option Strategies (Directional)", topics: ["System 1", "System 2"] },
        { title: "Option Strategies (Non-Directional)", topics: ["System 1", "System 2"] },
        { title: "Risk Management & Position Sizing", topics: [
          "Daily Risk Assessment", "Portfolio Management", "Drawdown Control",
          "Hedging", "Stop Loss & Trail SL Mechanics" ] },
      ],
      note: "Options trading involves market risk. The program teaches a statistical framework — past performance and educational examples do not guarantee future returns.",
      enrollLabel: "Enroll Now",
      enrollLink: "https://superprofile.bio/course/a46d738e-80c2-464f-8db3-c65ad39a0d3c",
    },
    cta: "View Curriculum",
  },

  // ─── "About" pop-up (opens from the About link in the menu and footer) ──
  // To add a photo: put the image in assets/team/ and set photo: "assets/team/name.jpg"
  about: {
    badge: "About",
    titleA: "Built by",
    titleB: "quants, for traders.",
    text: "Proption Fintech is a quant-led research and education firm from Udaipur. We combine statistics, data and disciplined execution to help traders make better decisions.",
    team: [
      {
        name: "Kishore Kumar", exp: "15+ years of experience",
        role: "Senior Software Engineer | Trading Systems & Infrastructure", photo: "",
        points: ["Ex — Wipro / Honeywell", "Deep experience with broker APIs", "Designed distributed algo execution", "Strong DevOps exposure"],
        bio: "Kishore brings over 15 years of deep hands-on experience in designing, building, and maintaining automated trading infrastructure. Having worked at global technology leaders like Wipro and Honeywell, he specializes in broker API integrations, distributed algorithmic execution engines, and robust DevOps practices that keep mission-critical trading systems running 24/7.",
      },
      {
        name: "CA Prachi Mehta", exp: "8+ years of experience",
        role: "Chartered Accountant | SEBI Registered Research Analyst", photo: "",
        points: ["SEBI RA — INH000017879", "Ex. Hedge Fund Admin (Citco, Morgan Stanley)", "Expertise in Cash Market Portfolios", "Designing Swing & Long-Term Investing Systems"],
        bio: "A Chartered Accountant and SEBI Registered Research Analyst (INH000017879), Prachi has spent over 8 years at the intersection of finance, compliance, and fund administration. Her prior roles at Citco and Morgan Stanley gave her an insider's view into hedge fund operations, cash-market portfolio construction, and the design of disciplined swing and long-term investing frameworks.",
      },
      {
        name: "Ruchin Tejawat", exp: "12+ years of experience",
        role: "Real-Time Trading Strategist | Quant Research", photo: "",
        points: ["Alumnus — IIT Kanpur", "Research Associate — IIM Udaipur", "Statistical Designing of Options Trading Systems", "Managing Different Risk Profiles"],
        bio: "An IIT Kanpur alumnus and Research Associate at IIM Udaipur, Ruchin combines academic rigor with 12+ years of live-market experience. His expertise lies in the statistical design of options trading systems, dynamic risk profiling, and translating quantitative research into profitable, real-time execution strategies.",
      },
      {
        name: "Aviroop", exp: "2 years of experience",
        role: "Developer | Front End & Backend", photo: "",
        points: ["MongoDB, Express, Redis, Node.js", "Experience in AI/ML Projects"],
        bio: "Aviroop is a full-stack developer who builds the dashboards, data pipelines and client-facing tools behind Proption's research and execution systems. Working across MongoDB, Express, Redis and Node.js, he turns trading logic into fast, reliable software, and brings hands-on experience from AI/ML projects to the team's analytics work.",
      },
      {
        name: "SoumyaDeep", exp: "2 years of experience",
        role: "Developer | Front End & Backend", photo: "",
        points: ["MongoDB, Express, Redis, Node.js"],
        bio: "SoumyaDeep is a full-stack developer focused on building clean, responsive interfaces and dependable back-end services. Using MongoDB, Express, Redis and Node.js, he helps ship and maintain the platforms that clients and the research team rely on every trading day.",
      },
      {
        name: "Anurag", exp: "4–5 years of experience",
        role: "Developer | Front End & Backend", photo: "",
        points: ["MongoDB, Express, Redis, Node.js"],
        bio: "With 4–5 years of full-stack development experience, Anurag designs and builds scalable web applications and APIs on MongoDB, Express, Redis and Node.js. He focuses on performance, stability and clean architecture, keeping Proption's systems fast and dependable as they grow.",
      },
    ],
  },

  cta: {
    titleA: "Ready to trade with",
    titleB: "research-backed",
    titleC: "conviction?",
    text: "Schedule a 30-minute consultation with our team. No obligations.",
    button: "Book Free Consultation",
  },

  contact: {
    address: "803, Classic Tower, Navratan Complex, Udaipur, Rajasthan",
    email: "proptionfintech@gmail.com",
    phone: "+91 93214 74231",
  },

  footer: {
    company: [
      ["About Us", "#about"], ["Performance", "#performance"], ["Quant Strategies", "#strategies"],
      ["Academy", "#academy"], ["Contact", "legal/contact.html"],
    ],
    disclosures: [
      ["Investor Charter", "legal/investor-charter.html"],
      ["Standard Risk Disclosure", "legal/risk-disclosure.html"],
      ["Code of Conduct", "legal/code-of-conduct.html"],
      ["Conflict of Interest Policy", "legal/conflict-of-interest.html"],
      ["Complaints Status", "legal/complaints-status.html"],
    ],
    legal: [
      ["Terms of Service", "legal/terms.html"],
      ["Privacy Policy", "legal/privacy.html"],
      ["SEBI Disclosure", "legal/sebi-disclosure.html"],
      ["Grievance Redressal", "legal/grievance.html"],
      ["Refund Policy", "legal/refund.html"],
    ],
    regulatory: "<strong>Proption Fintech is NOT a SEBI-registered entity.</strong> Research on this platform is independently authored and backed by a SEBI Registered Research Analyst (CA Prachi Mehta, Reg. No. INH000017879).",
    standardDisclaimer: "Registration granted by SEBI, membership of BASL, and certification from NISM in no way guarantee performance or provide any assurance of returns to investors. Investments in securities markets are subject to market risks. Read all related documents carefully before investing. Past performance is not indicative of future results.",
  },
};
