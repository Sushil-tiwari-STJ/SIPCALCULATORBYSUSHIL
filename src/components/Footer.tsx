import React from 'react';
import { Heart, ShieldCheck, TrendingUp, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md pt-12 pb-8 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Brand & Sushil Signature */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="font-display font-bold text-base text-white">
                WealthCraft <span className="text-emerald-400 text-sm">Financial Planner</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              An intelligent, institutional-grade Systematic Investment Plan (SIP) suite and goal-based financial architect engineered to calculate true wealth compounding, inflation hedging, and early retirement roadmaps.
            </p>

            {/* Prominent Sushil Attribution Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">
                Designed, Engineered & Crafted by <strong className="text-emerald-400 font-bold">Sushil</strong>
              </span>
            </div>
          </div>

          {/* Col 2: Financial Compounding Formula */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Mathematical Engine
            </h4>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[11px] text-emerald-400">
              FV = P × [((1 + r)ⁿ - 1) / r] × (1 + r)
            </div>
            <p className="text-[11px] text-slate-500">
              Monthly annuity due compounding formula with annual step-up delta.
            </p>
          </div>

          {/* Col 3: Key Features Checklist */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Planning Capabilities
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Reverse SIP Goal Architecture</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>FIRE Early Retirement Number</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Inflation & 12.5% LTCG Tax Model</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Annual Step-Up Multiplier</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} WealthCraft Suite. Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by <strong className="text-slate-300">Sushil</strong>. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mutual fund investments are subject to market risks.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
