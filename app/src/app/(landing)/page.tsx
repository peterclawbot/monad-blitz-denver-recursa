"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Repeat,
  Zap,
  Brain,
  Shield,
  Blocks,
  Bot,
  Globe,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Lock,
  Eye,
  Timer,
  AlertTriangle,
  ExternalLink,
  Terminal,
  TrendingUp,
  Target,
  Trophy,
  Layers,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Cpu,
  Gauge,
  Users,
  Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animated counter                                                    */
/* ------------------------------------------------------------------ */
function useCountUp(end: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return { value, ref };
}

/* ------------------------------------------------------------------ */
/*  Section fade-in wrapper                                             */
/* ------------------------------------------------------------------ */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ================================================================== */
/*  LANDING PAGE                                                       */
/* ================================================================== */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <HeroBackground />
      <Navbar />
      <HeroSection />
      <StatsBar />
      <WhyRecursa />
      <FeaturesGrid />
      <VaultPreview />
      <HowItWorks />
      <PowerFeatures />
      <SecuritySection />
      <CTASection />
      <Footer />
    </div>
  );
}

/* ================================================================== */
/*  ANIMATED BACKGROUND                                                */
/* ================================================================== */
function HeroBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-primary/[0.07] blur-[120px] animate-[drift_20s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/[0.05] blur-[120px] animate-[drift_25s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px] animate-[drift_18s_ease-in-out_infinite_2s]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  NAVBAR                                                             */
/* ================================================================== */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#vaults", label: "Vaults" },
    { href: "#security", label: "Security" },
    { href: "https://docs.recursa.ai", label: "Docs", external: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Repeat className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Recursa<span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm text-text-secondary hover:text-text transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all glow-primary"
          >
            Launch App
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-text-secondary hover:text-text transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-surface/95 backdrop-blur-xl border-b border-border"
        >
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-text-secondary hover:text-text py-2 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/dashboard"
              className="block w-full text-center px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold mt-2"
            >
              Launch App
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}

/* ================================================================== */
/*  HERO                                                               */
/* ================================================================== */
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border text-sm text-text-secondary mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-accent pulse-dot" />
          Live on Monad
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="gradient-text">DeFi Leverage,</span>
          <br />
          <span className="text-text">Simplified.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
        >
          One-click leveraged looping, auto-managed vaults, and AI-powered position guards — all on the fastest chain in crypto.
          <br className="hidden sm:block" />
          <span className="text-text font-medium">Set it. Forget it. Earn.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white text-base font-semibold hover:bg-primary-dark transition-all glow-primary"
          >
            Start Earning
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="https://docs.recursa.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-surface border border-border text-text-secondary text-base font-semibold hover:text-text hover:border-border-light transition-all"
          >
            Read Docs
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Animated infinity / loop SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 md:mt-24 flex justify-center"
        >
          <svg viewBox="0 0 400 160" className="w-full max-w-md opacity-20" fill="none">
            <path
              d="M200 80C200 80 160 20 100 20C50 20 20 55 20 80C20 105 50 140 100 140C160 140 200 80 200 80ZM200 80C200 80 240 20 300 20C350 20 380 55 380 80C380 105 350 140 300 140C240 140 200 80 200 80Z"
              stroke="url(#infinityGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-[dash_4s_linear_infinite]"
              strokeDasharray="8 6"
            />
            <defs>
              <linearGradient id="infinityGrad" x1="0" y1="80" x2="400" y2="80">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  STATS BAR                                                          */
/* ================================================================== */
function StatsBar() {
  const stats = [
    { label: "Total Value Locked", end: 12400000, prefix: "$", suffix: "", format: true },
    { label: "Yield Generated", end: 847000, prefix: "$", suffix: "", format: true },
    { label: "Active Loops", end: 3420, prefix: "", suffix: "", format: true },
    { label: "Avg APY", end: 14, prefix: "", suffix: "%", format: false },
  ];

  return (
    <Section className="py-8 border-y border-border/50 bg-surface/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {stats.map((stat) => {
          const { value, ref } = useCountUp(stat.end);
          const display = stat.format ? value.toLocaleString() : value;
          return (
            <div key={stat.label} className="text-center">
              <span ref={ref} className="block text-2xl md:text-3xl font-bold font-mono gradient-text">
                {stat.prefix}{display}{stat.suffix}
              </span>
              <span className="text-sm text-text-muted mt-1 block">{stat.label}</span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ================================================================== */
/*  WHY RECURSA — killer value props                                   */
/* ================================================================== */
function WhyRecursa() {
  return (
    <Section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Why <span className="gradient-text">RecursaAI</span>?
          </h2>
          <p className="text-text-secondary mt-4 text-lg max-w-2xl mx-auto">
            Other protocols give you tools. We give you a fully automated yield engine that works while you sleep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-7 h-7" />,
              title: "10 Transactions → 1 Click",
              desc: "Traditional looping requires 10+ manual transactions. RecursaAI compresses the entire loop — borrow, swap, redeposit, repeat — into a single atomic transaction. No more babysitting.",
              accent: "from-primary/20 to-primary/5",
            },
            {
              icon: <Shield className="w-7 h-7" />,
              title: "Never Get Liquidated",
              desc: "Our DeFi Saver-style AutoRebalancer monitors every position 24/7. When your health factor dips, it auto-deleverages. When it's too high, it boosts for more yield. Fully autonomous.",
              accent: "from-accent/20 to-accent/5",
            },
            {
              icon: <TrendingUp className="w-7 h-7" />,
              title: "Up to 5x Leveraged Yield",
              desc: "Turn 1 ETH into 5x the yield exposure. Our looping engine handles the complexity — you just pick your leverage level and risk tolerance. The math works. The yield compounds.",
              accent: "from-warning/20 to-warning/5",
            },
          ].map((item, i) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true, margin: "-40px" });
            return (
              <motion.div
                key={item.title}
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-surface/60 border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.accent} border border-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ================================================================== */
/*  FEATURES GRID                                                      */
/* ================================================================== */
function FeaturesGrid() {
  const features = [
    {
      icon: <Repeat className="w-5 h-5" />,
      title: "One-Click Looping",
      desc: "Multi-step leverage loops compressed into a single transaction. Up to 5x leverage with customizable health factor targets.",
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      title: "AutoRebalancer",
      desc: "DeFi Saver-style position guards that auto-boost when health factor is high and auto-repay when it drops — keeping you safe 24/7.",
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "ERC-4626 Vaults",
      desc: "Deposit-and-forget yield vaults with automated strategy execution, timelocked upgrades, and emergency pause protection.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Strategy Marketplace",
      desc: "Follow top strategists' positions with one click. Creators earn performance fees. Built-in profit sharing with full transparency.",
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Points & Rewards",
      desc: "On-chain points system with seasonal rewards, leverage multipliers, and referral bonuses. Earn more the longer you stay.",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "AI Strategy Engine",
      desc: "Real-time APY optimization across lending protocols. The AI finds the best risk-adjusted yield so you don't have to.",
    },
    {
      icon: <Bot className="w-5 h-5" />,
      title: "Keeper Network",
      desc: "Automated position monitoring and rebalancing. No manual intervention needed — the protocol manages itself.",
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Proxy Architecture",
      desc: "Each position gets its own isolated proxy contract. No shared state, no cross-contamination. Your position, your proxy.",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Built on Monad",
      desc: "10,000 TPS. Sub-second finality. Gas costs measured in fractions of a cent. DeFi without the friction.",
    },
  ];

  return (
    <Section className="py-24 md:py-32 px-6" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Engineered for <span className="gradient-text">Performance</span>
          </h2>
          <p className="text-text-secondary mt-3 text-lg">
            Nine features that make RecursaAI the most complete yield protocol on Monad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true, margin: "-40px" });
            return (
              <motion.div
                key={feature.title}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group bg-surface/50 border border-border rounded-2xl p-6 hover:border-primary/30 hover:bg-surface/80 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ================================================================== */
/*  VAULT PREVIEW                                                      */
/* ================================================================== */
function VaultPreview() {
  const vaults = [
    {
      name: "Conservative USDC",
      asset: "USDC",
      apy: 8.2,
      risk: "Low",
      tvl: "$4.2M",
      strategy: "Lending optimization",
    },
    {
      name: "Balanced ETH",
      asset: "ETH",
      apy: 14.7,
      risk: "Medium",
      tvl: "$3.8M",
      strategy: "Loop + Lending",
    },
    {
      name: "Aggressive ETH",
      asset: "ETH",
      apy: 24.3,
      risk: "High",
      tvl: "$1.9M",
      strategy: "Max leverage loop",
    },
    {
      name: "MON Yield",
      asset: "MON",
      apy: 32.1,
      risk: "High",
      tvl: "$890K",
      strategy: "LP farming + loop",
    },
  ];

  return (
    <Section className="py-24 md:py-32 px-6" id="vaults">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Choose Your <span className="gradient-text">Strategy</span>
          </h2>
          <p className="text-text-secondary mt-3 text-lg">
            From stable yield to degen leverage — there&apos;s a vault for every risk appetite
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {vaults.map((vault, i) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true, margin: "-40px" });
            return (
              <motion.div
                key={vault.name}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-bold">{vault.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{vault.strategy}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    vault.risk === "Low" ? "bg-accent/10 text-accent"
                    : vault.risk === "Medium" ? "bg-warning/10 text-warning"
                    : "bg-danger/10 text-danger"
                  }`}>
                    {vault.risk}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">APY</span>
                    <span className="font-mono font-bold text-accent">{vault.apy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">TVL</span>
                    <span className="font-mono font-medium">{vault.tvl}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Asset</span>
                    <span className="font-mono font-medium">{vault.asset}</span>
                  </div>
                </div>

                <Link
                  href="/vaults"
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-light border border-border text-sm font-medium text-text-secondary hover:text-text hover:border-border-light transition-all"
                >
                  Deposit <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/vaults"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors text-sm font-semibold"
          >
            View All Vaults <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}

/* ================================================================== */
/*  HOW IT WORKS                                                       */
/* ================================================================== */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <Blocks className="w-6 h-6" />,
      title: "Deposit",
      desc: "Pick your token and amount. WETH, USDC, WBTC, MON — we support them all. One approval, one click.",
    },
    {
      num: "02",
      icon: <Repeat className="w-6 h-6" />,
      title: "Loop or Vault",
      desc: "Create a leveraged loop (up to 5x) for maximum yield, or deposit into an automated vault that handles everything for you.",
    },
    {
      num: "03",
      icon: <Shield className="w-6 h-6" />,
      title: "Auto-Protect",
      desc: "The AutoRebalancer watches your positions 24/7. If your health factor drops, it auto-deleverages. If it's too high, it boosts.",
    },
    {
      num: "04",
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Earn & Compound",
      desc: "Yield compounds automatically. Points accrue on-chain. Withdraw anytime — no lockups, no penalties, no BS.",
    },
  ];

  return (
    <Section className="py-24 md:py-32 px-6" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-text-secondary mt-3 text-lg">Four steps from deposit to passive income</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true, margin: "-60px" });
            return (
              <motion.div
                key={step.num}
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative group"
              >
                {i < 3 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-border to-border/0" />
                )}
                <div className="bg-surface/60 border border-border rounded-2xl p-7 hover:border-primary/30 transition-all duration-300 text-center relative">
                  <span className="text-xs font-mono text-primary/60 font-bold absolute top-4 right-5">{step.num}</span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center mx-auto mb-5 text-primary group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ================================================================== */
/*  POWER FEATURES — the stuff competitors don't have                  */
/* ================================================================== */
function PowerFeatures() {
  return (
    <Section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            What Sets Us <span className="gradient-text">Apart</span>
          </h2>
          <p className="text-text-secondary mt-3 text-lg">
            Features that actually matter for DeFi power users
          </p>
        </div>

        {/* Feature 1: AutoRebalancer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> AutoRebalancer
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Your Positions, Auto-Protected</h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              Think DeFi Saver, but built directly into the protocol. The AutoRebalancer monitors every position in real-time and takes action before you even notice a problem.
            </p>
            <ul className="space-y-3">
              {[
                "Auto-repay when health factor drops below your target",
                "Auto-boost when health factor is too high (more yield!)",
                "Configurable thresholds, cooldowns, and leverage bounds",
                "Keeper-operated — works even when you're offline",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 text-text-muted text-xs">
              <Gauge className="w-4 h-4" /> Position Monitor
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-text-muted">Health Factor</span><span className="text-warning">1.18 → </span><span className="text-accent">1.52</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Action</span><span className="text-accent">Auto-Repay ✓</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Leverage</span><span>3.2x → 2.8x</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Gas Cost</span><span className="text-accent">$0.003</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Saved from liquidation</span><span className="text-accent">$12,400</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-border text-xs text-text-muted">
              Last check: 2s ago · Next: 30s · Keeper: 0xBEEF...
            </div>
          </div>
        </div>

        {/* Feature 2: Strategy Marketplace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1 bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 text-text-muted text-xs font-mono">
              <Star className="w-4 h-4" /> Top Strategies
            </div>
            <div className="space-y-3">
              {[
                { name: "2x WETH Conservative", creator: "0xAlpha", followers: 847, apy: "12.4%", fee: "5%" },
                { name: "3x ETH/USDC Loop", creator: "0xSigma", followers: 523, apy: "21.8%", fee: "8%" },
                { name: "Delta Neutral BTC", creator: "0xHedge", followers: 312, apy: "9.2%", fee: "3%" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-surface-light border border-border/50">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-text-muted">by {s.creator} · {s.followers} followers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent">{s.apy}</p>
                    <p className="text-xs text-text-muted">{s.fee} fee</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Target className="w-3.5 h-3.5" /> Strategy Marketplace
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Copy the Best. Earn Together.</h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              Don&apos;t know which strategy to use? Follow top-performing strategists with one click. Creators set their own fees and earn a share of the profits they generate for their followers.
            </p>
            <ul className="space-y-3">
              {[
                "One-click follow — positions are created automatically",
                "Transparent profit-sharing with configurable creator fees",
                "On-chain strategy publishing and follower tracking",
                "Performance history and risk metrics for every strategy",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature 3: Points */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold mb-4">
              <Trophy className="w-3.5 h-3.5" /> Points System
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Every Second Counts</h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              Earn points continuously just by having active positions. Higher leverage = more points. Refer friends for bonus multipliers. Points are tracked on-chain — no trust required.
            </p>
            <ul className="space-y-3">
              {[
                "Points accrue every second based on TVL × leverage",
                "Seasonal campaigns with configurable reward rates",
                "10% referral bonus on all referred users' earnings",
                "Bonus points for early adopters and community events",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <Sparkles className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 text-text-muted text-xs">
              <BarChart3 className="w-4 h-4" /> Your Points
            </div>
            <div className="text-center mb-6">
              <p className="text-4xl font-bold gradient-text">847,293</p>
              <p className="text-xs text-text-muted mt-1">Total Points (Season 1)</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-text-muted">Position Points</span><span>723,450</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Referral Bonus</span><span className="text-accent">+72,345 (10%)</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Bonus Awards</span><span className="text-warning">+51,498</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Leverage Mult.</span><span className="text-primary">1.4x (2x loop)</span></div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ================================================================== */
/*  SECURITY                                                           */
/* ================================================================== */
function SecuritySection() {
  const items = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Open Source & Verified",
      desc: "Every contract is open source, verified on-chain, and available on GitHub. Transparency isn't optional — it's foundational.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Comprehensive Testing",
      desc: "270+ unit tests, edge-case fuzzing, stress tests, and live E2E testing on testnet. We found and fixed a critical bug before it went live.",
    },
    {
      icon: <Timer className="w-5 h-5" />,
      title: "24-Hour Timelock",
      desc: "All admin actions (asset whitelisting, adapter changes, strategy upgrades) go through a mandatory 24-hour timelock. No surprise rug pulls.",
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Guardian Emergency Pause",
      desc: "A separate guardian role can instantly pause the protocol in emergencies — without waiting for the timelock. Safety first, always.",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Isolated Position Proxies",
      desc: "Each position lives in its own proxy contract. One position can't affect another. Complete isolation by design.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Audit Planned",
      desc: "Comprehensive security audit by leading firms planned before mainnet. Current testnet deployment is for battle-testing only.",
    },
  ];

  return (
    <Section className="py-24 md:py-32 px-6" id="security">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Security <span className="gradient-text">First</span>
          </h2>
          <p className="text-text-secondary mt-3 text-lg">
            Your funds are protected by multiple layers of battle-tested security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true, margin: "-40px" });
            return (
              <motion.div
                key={item.title}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-4 bg-surface/50 border border-border rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ================================================================== */
/*  CTA                                                                */
/* ================================================================== */
function CTASection() {
  return (
    <Section className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Stop Leaving <span className="gradient-text">Yield</span> on the Table
        </h2>
        <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
          Every second you&apos;re not looping, you&apos;re losing yield. Connect your wallet, pick a strategy, and let RecursaAI handle the rest.
        </p>

        {/* Terminal snippet */}
        <div className="max-w-md mx-auto mb-10">
          <div className="bg-surface border border-border rounded-xl overflow-hidden text-left">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
              <Terminal className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-xs text-text-muted font-mono">recursa-cli</span>
            </div>
            <div className="p-4 font-mono text-sm space-y-1">
              <div><span className="text-accent">$</span> <span className="text-text-secondary">recursa loop --asset WETH --leverage 3x</span></div>
              <div className="text-text-muted text-xs">→ Depositing 10 WETH into Mace lending...</div>
              <div className="text-text-muted text-xs">→ Executing 3x recursive loop (4 iterations)...</div>
              <div className="text-text-muted text-xs">→ AutoRebalancer configured (min HF: 1.3)</div>
              <div className="text-accent text-xs">✓ Position #42 created. Earning 18.4% APY</div>
              <div className="text-primary text-xs">✓ Points accruing: ~2,400/hour (1.6x multiplier)</div>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-lg font-bold hover:opacity-90 transition-all glow-primary"
        >
          Launch App
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </Section>
  );
}

/* ================================================================== */
/*  FOOTER                                                             */
/* ================================================================== */
function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Repeat className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              Recursa<span className="text-primary">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/dashboard" className="hover:text-text transition-colors">App</Link>
            <a href="https://docs.recursa.ai" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">Docs</a>
            <a href="https://github.com/peterclawbot/monad-blitz-denver-recursa" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">GitHub</a>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <div className="w-2 h-2 rounded-full bg-accent" />
            Built on Monad
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 text-center text-xs text-text-muted">
          © 2026 RecursaAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
