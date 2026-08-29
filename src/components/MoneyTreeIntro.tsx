import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  Coins, 
  CheckCircle2, 
  Play, 
  FastForward, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  Leaf,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MoneyTreeIntroProps {
  onComplete: () => void;
}

const WEALTH_QUOTES = [
  {
    quote: "The best time to plant a tree was 20 years ago. The second best time is today.",
    author: "Ancient Proverb",
  },
  {
    quote: "Compound interest is the eighth wonder of the world. He who understands it, earns it.",
    author: "Albert Einstein",
  },
  {
    quote: "Do not save what is left after spending, but spend what is left after saving.",
    author: "Warren Buffett",
  },
  {
    quote: "Discipline with Step-Up SIP turns ordinary salaries into generational wealth.",
    author: "Sushil • Wealth Architect",
  },
];

export const MoneyTreeIntro: React.FC<MoneyTreeIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [progress, setProgress] = useState<number>(0);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [liveCorpus, setLiveCorpus] = useState<number>(5000);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const isCompletedRef = useRef(false);

  // Growth sequence controller
  useEffect(() => {
    // Stage 0: Seed Dropping (0 - 800ms)
    const t0 = setTimeout(() => setStage(1), 700 / speedMultiplier);

    // Stage 1: Roots & Trunk Sprout (800ms - 1800ms)
    const t1 = setTimeout(() => setStage(2), 1700 / speedMultiplier);

    // Stage 2: Canopy & Leaves Blossom (1800ms - 2800ms)
    const t2 = setTimeout(() => {
      setStage(3);
      // Gold & emerald particle burst
      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#10b981', '#fbbf24', '#34d399', '#f59e0b', '#ecfdf5'],
        });
      } catch (e) {
        // Safe fallback
      }
    }, 2700 / speedMultiplier);

    // Stage 3: Golden Coin Harvest & Compounding Peak (2800ms - 4200ms)
    const t3 = setTimeout(() => {
      setStage(4);
      try {
        confetti({
          particleCount: 65,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#fbbf24', '#f59e0b', '#10b981', '#38bdf8', '#ffffff'],
        });
      } catch (e) {
        // Safe fallback
      }
    }, 3900 / speedMultiplier);

    // Auto complete if not interacted
    const t4 = setTimeout(() => {
      if (!isCompletedRef.current) {
        isCompletedRef.current = true;
        onComplete();
      }
    }, 5500 / speedMultiplier);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [speedMultiplier, onComplete]);

  // Smooth live corpus ticker animation
  useEffect(() => {
    const targetCorpus = 18450000; // 1.84 Crore
    const duration = 4000 / speedMultiplier;
    const intervalTime = 40;
    const steps = duration / intervalTime;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      const factor = Math.pow(stepCount / steps, 3); // exponential compounding curve
      const current = Math.min(targetCorpus, Math.round(5000 + (targetCorpus - 5000) * factor));
      setLiveCorpus(current);
      setProgress(Math.min(100, Math.round((stepCount / steps) * 100)));

      if (stepCount >= steps) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [speedMultiplier]);

  // Quote rotator
  useEffect(() => {
    const qInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % WEALTH_QUOTES.length);
    }, 2200);
    return () => clearInterval(qInterval);
  }, []);

  const handleAccelerate = () => {
    setSpeedMultiplier(2.5);
  };

  const handleInstantEnter = () => {
    isCompletedRef.current = true;
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 bg-[#070b12] text-slate-100 select-none overflow-hidden"
    >
      {/* Precision Ambient Atmosphere Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Center Core Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-emerald-500/[0.08] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/[0.06] rounded-full blur-[100px]" />
        
        {/* Mathematical Financial Isometric Grid */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #10b981 1px, transparent 1px),
              linear-gradient(to bottom, #10b981 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ambient Floating Light Specks */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-400 blur-[1px]"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-amber-400 blur-[1px]"
        />
      </div>

      {/* TOP BAR: Brand & Verified Author Badge */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-950/40">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm tracking-tight text-white">
                WEALTHCRAFT <span className="text-emerald-400 font-semibold">FINANCIAL</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                PRO TERMINAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Institutional Compounding Architect</p>
          </div>
        </div>

        {/* Prominent Sushil Attribution Stamp */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-sm backdrop-blur-md">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-slate-300">
            Engineered by <strong className="text-emerald-400 font-bold tracking-wide">Sushil</strong>
          </span>
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        </div>
      </header>

      {/* CENTERPIECE: Interactive Money Tree SVG & Dynamic Compounding Ticker */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto max-w-2xl w-full text-center space-y-4">
        
        {/* Animated Money Tree Canvas */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          
          {/* Pulsing Light Corona behind the Tree */}
          <motion.div
            animate={{
              scale: stage >= 3 ? [1, 1.12, 1] : [0.8, 0.9, 0.8],
              opacity: stage >= 3 ? [0.4, 0.7, 0.4] : [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-emerald-600/20 via-teal-500/20 to-amber-400/20 blur-2xl"
          />

          <svg
            viewBox="0 0 320 320"
            className="w-full h-full drop-shadow-[0_0_35px_rgba(16,185,129,0.3)]"
          >
            <defs>
              {/* Trunk Gradient */}
              <linearGradient id="trunkShade" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#022c22" />
                <stop offset="40%" stopColor="#065f46" />
                <stop offset="80%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Gold Coin Gradient */}
              <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="25%" stopColor="#fde047" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              {/* Emerald Leaf Gradient */}
              <linearGradient id="emeraldFoliage" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>

              {/* Coin Glow Filter */}
              <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Organic Ground / Soil Mound */}
            <motion.ellipse
              cx="160"
              cy="285"
              rx="75"
              ry="14"
              fill="#064e3b"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ duration: 0.5 }}
            />
            <motion.ellipse
              cx="160"
              cy="283"
              rx="55"
              ry="9"
              fill="#047857"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />

            {/* STAGE 0: Golden Seed Inception */}
            <AnimatePresence>
              {stage === 0 && (
                <motion.g
                  initial={{ y: -80, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeIn' }}
                >
                  <circle cx="160" cy="275" r="8" fill="url(#goldMetallic)" filter="url(#goldGlow)" />
                  <circle cx="160" cy="275" r="16" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 3" />
                </motion.g>
              )}
            </AnimatePresence>

            {/* STAGE 1+: Roots branching into the earth */}
            {stage >= 1 && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <path d="M 152 284 C 140 292, 125 295, 110 297" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M 168 284 C 180 292, 195 295, 210 297" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M 160 286 L 160 300" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
              </motion.g>
            )}

            {/* STAGE 1+: Main Strong Compounding Trunk */}
            {stage >= 1 && (
              <motion.path
                d="M 153 285 C 154 235, 146 195, 160 145 C 174 195, 166 235, 167 285 Z"
                fill="url(#trunkShade)"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'bottom center' }}
              />
            )}

            {/* STAGE 1+: Structural Major Branches */}
            {stage >= 1 && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Left Primary Arch */}
                <motion.path
                  d="M 158 185 C 135 160, 115 165, 85 145 C 110 155, 135 150, 157 175"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7 }}
                />

                {/* Right Primary Arch */}
                <motion.path
                  d="M 162 180 C 185 155, 205 160, 235 140 C 210 150, 185 145, 163 170"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                />

                {/* Top Center Shoot */}
                <motion.path
                  d="M 160 150 C 160 115, 160 90, 160 65"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />

                {/* Upper Left Branch */}
                <motion.path
                  d="M 160 145 C 145 120, 125 105, 105 85"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                />

                {/* Upper Right Branch */}
                <motion.path
                  d="M 160 145 C 175 120, 195 105, 215 85"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </motion.g>
            )}

            {/* STAGE 2+: Lush Geometric Foliage Cloud Canopy */}
            {stage >= 2 && (
              <motion.g
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'backOut' }}
              >
                {/* Central Top Crown */}
                <circle cx="160" cy="70" r="30" fill="url(#emeraldFoliage)" opacity="0.95" />
                <circle cx="130" cy="90" r="26" fill="url(#emeraldFoliage)" opacity="0.9" />
                <circle cx="190" cy="90" r="26" fill="url(#emeraldFoliage)" opacity="0.9" />
                
                {/* Mid Wings */}
                <circle cx="95" cy="140" r="24" fill="url(#emeraldFoliage)" opacity="0.85" />
                <circle cx="225" cy="135" r="24" fill="url(#emeraldFoliage)" opacity="0.85" />
                <circle cx="160" cy="120" r="34" fill="url(#emeraldFoliage)" opacity="0.95" />
                
                {/* Outer Delicate Leaves */}
                <circle cx="115" cy="65" r="18" fill="#34d399" opacity="0.6" />
                <circle cx="205" cy="65" r="18" fill="#34d399" opacity="0.6" />
              </motion.g>
            )}

            {/* STAGE 3+: Compounded Golden Wealth Fruits (Coins) */}
            {stage >= 3 && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, staggerChildren: 0.08 }}
              >
                {/* Golden Master Coin (Crown Center) */}
                <motion.g 
                  transform="translate(160, 52)"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <circle cx="0" cy="0" r="15" fill="url(#goldMetallic)" filter="url(#goldGlow)" />
                  <circle cx="0" cy="0" r="12" fill="none" stroke="#fef08a" strokeWidth="1.5" />
                  <text x="0" y="5" fontSize="13" fontWeight="900" fill="#78350f" textAnchor="middle" fontFamily="sans-serif">₹</text>
                </motion.g>

                {/* Coin 2 (Upper Left) */}
                <g transform="translate(115, 80)">
                  <circle cx="0" cy="0" r="13" fill="url(#goldMetallic)" filter="url(#goldGlow)" />
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#fef08a" strokeWidth="1.2" />
                  <text x="0" y="4.5" fontSize="11" fontWeight="bold" fill="#78350f" textAnchor="middle" fontFamily="sans-serif">$</text>
                </g>

                {/* Coin 3 (Upper Right) */}
                <g transform="translate(205, 80)">
                  <circle cx="0" cy="0" r="13" fill="url(#goldMetallic)" filter="url(#goldGlow)" />
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#fef08a" strokeWidth="1.2" />
                  <text x="0" y="4.5" fontSize="11" fontWeight="bold" fill="#78350f" textAnchor="middle" fontFamily="sans-serif">₹</text>
                </g>

                {/* Coin 4 (Mid Branch Left) */}
                <g transform="translate(85, 135)">
                  <circle cx="0" cy="0" r="13.5" fill="url(#goldMetallic)" />
                  <circle cx="0" cy="0" r="10.5" fill="none" stroke="#fef08a" strokeWidth="1.2" />
                  <text x="0" y="4.5" fontSize="11" fontWeight="bold" fill="#78350f" textAnchor="middle" fontFamily="sans-serif">€</text>
                </g>

                {/* Coin 5 (Mid Branch Right) */}
                <g transform="translate(235, 130)">
                  <circle cx="0" cy="0" r="13.5" fill="url(#goldMetallic)" />
                  <circle cx="0" cy="0" r="10.5" fill="none" stroke="#fef08a" strokeWidth="1.2" />
                  <text x="0" y="4.5" fontSize="11" fontWeight="bold" fill="#78350f" textAnchor="middle" fontFamily="sans-serif">£</text>
                </g>

                {/* Coin 6 (Heart Trunk Core) */}
                <g transform="translate(160, 115)">
                  <circle cx="0" cy="0" r="16" fill="url(#goldMetallic)" filter="url(#goldGlow)" />
                  <circle cx="0" cy="0" r="13" fill="none" stroke="#fef08a" strokeWidth="1.6" />
                  <text x="0" y="5.5" fontSize="14" fontWeight="900" fill="#78350f" textAnchor="middle" fontFamily="sans-serif">₹</text>
                </g>

                {/* Sparkle Flares */}
                <motion.polygon
                  points="145,25 148,33 156,36 148,39 145,47 142,39 134,36 142,33"
                  fill="#fde047"
                  animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                <motion.polygon
                  points="230,60 232,65 238,67 232,69 230,75 228,69 222,67 228,65"
                  fill="#34d399"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                />
              </motion.g>
            )}
          </svg>
        </div>

        {/* Live Compounding Ticker HUD */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {stage === 0 && 'Planting Seed: Monthly SIP Inception...'}
              {stage === 1 && 'Germinating Roots: Dollar-Cost Averaging...'}
              {stage === 2 && 'Step-Up Compounding: Expanding Portfolio...'}
              {stage >= 3 && 'Harvesting Generational Wealth Corpus'}
            </span>
          </div>

          {/* Exponential Corpus Display */}
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
              Compounded Future Corpus Growth
            </div>
            <div className="font-display text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-300 to-amber-300">
              ₹{liveCorpus.toLocaleString('en-IN')}
            </div>
            {liveCorpus >= 10000000 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-amber-400"
              >
                ★ ₹1.84+ Crore Multi-Fold Milestone Reached
              </motion.div>
            )}
          </div>

          {/* Dynamic Rotating Wisdom Quote */}
          <div className="h-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="max-w-md text-xs text-slate-400 italic px-4"
              >
                "{WEALTH_QUOTES[quoteIndex].quote}"
                <div className="text-[11px] font-semibold text-emerald-400 not-italic mt-0.5">
                  — {WEALTH_QUOTES[quoteIndex].author}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </main>

      {/* BOTTOM CONTROL DOCK: Progress Bar, Speed Up, and Enter Terminal */}
      <footer className="relative z-10 w-full max-w-md space-y-3">
        {/* Sleek Linear Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
            <span>Progress: {progress}%</span>
            <span className="text-emerald-400 font-semibold">
              {progress < 100 ? 'Compounding...' : 'Initialized'}
            </span>
          </div>
        </div>

        {/* Action Buttons: Speed Up & Enter App */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleAccelerate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-400" />
            <span>2.5x Fast Forward</span>
          </button>

          <button
            onClick={handleInstantEnter}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <span>Launch Wealth Terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </motion.div>
  );
};
