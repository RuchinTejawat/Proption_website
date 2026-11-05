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
    curriculum: "#academy",                           // or a PDF / form link
  },

  nav: [
    { label: "Performance", href: "#performance" },
    { label: "PMS", href: "#pms" },
    { label: "Academy", href: "#academy" },
    { label: "About", href: "#about" },
  ],

  hero: {
    badge: "Quant-led research & market education",
    line1: "Compound your",
    line2: "capital.",           // green
    line3: "Master the",
    line4: "markets.",           // orange
    text: "India's research-first fintech delivering institutional-grade PMS strategies and a world-class stock market academy — built by quant experts.",
    primaryCta: "Explore PMS",
    secondaryCta: "Watch Demo",
  },

  performance: {
    badge: "Verified Performance",
    titleA: "12 months of",
    titleB: "verified alpha.",
    text: "Cumulative net returns of our flagship strategy, independently verified on Zerodha. Past performance is not indicative of future results.",
    seriesName: "Proption Quant PMS",
  },

  pms: {
    badge: "PMS Strategies",
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
    // Shown when someone clicks "View Curriculum"
    modules: [
      "Options basics & payoff thinking",
      "Probability, distributions and expected value",
      "Volatility: IV, HV and the expected move",
      "Greeks in practice",
      "Position sizing & risk of ruin",
      "Building and backtesting a rules-based system",
    ],
    cta: "View Curriculum",
  },

  about: {
    badge: "About",
    titleA: "Built by",
    titleB: "quants, for traders.",
    text: "Proption Fintech is a quant-led research and education firm from Udaipur. We combine statistics, data and disciplined execution to help traders make better decisions.",
    team: [
      { name: "Ruchin Tejawat", role: "Founder · Quant Research", bio: "Alumnus, IIT Kanpur · Research Associate, IIM Udaipur" },
      { name: "CA Prachi Mehta", role: "SEBI Registered Research Analyst", bio: "Reg. No. INH000017879" },
    ],
  },

  cta: {
    titleA: "Ready to invest with",
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
      ["About Us", "#about"], ["Performance", "#performance"], ["PMS Strategies", "#pms"],
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
