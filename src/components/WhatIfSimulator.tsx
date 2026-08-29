import React, { useState } from 'react';
import { CurrencyCode, SipInputs } from '../types';
import { calculateCostOfDelay, formatCurrency } from '../utils/financialCalculations';
import { 
  Zap, 
  Clock, 
  Hourglass, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Flame, 
  Award,
  ArrowRight
} from 'lucide-react';

interface WhatIfSimulatorProps {
  inputs: SipInputs;
  currency: CurrencyCode;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ inputs, currency }) => {
  const [delayYears, setDelayYears] = useState<number>(3);
  const [boostAmount, setBoostAmount] = useState<number>(1000);

  const delayResult = calculateCostOfDelay(
    inputs.monthlyInvestment,
    inputs.expectedReturnRate,
    inputs.timePeriodYears,
    delayYears
  );

  // Rule of 72 calculation
  const doublingYears = inputs.expectedReturnRate > 0 ? (72 / inputs.expectedReturnRate).toFixed(1) : 'N/A';

  // Boost calculation
  const boostedMonthly = inputs.monthlyInvestment + boostAmount;
  const standardMonthly = inputs.monthlyInvestment;
  const monthlyRate = inputs.expectedReturnRate / 100 / 12;
  const months = inputs.timePeriodYears * 12;

  const standardFV = ((standardMonthly * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate) * (1 + monthlyRate);
  const boostedFV = ((boostedMonthly * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate) * (1 + monthlyRate);
  const extraWealthGenerated = boostedFV - standardFV;
  const totalExtraInvested = boostAmount * months;

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-emerald-950/40 border border-purple-500/30 p-5 sm:p-6 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Compounding Insights & Behavioral Simulators</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">
          The Hidden Mathematics of Wealth Acceleration
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Discover how minor adjustments in starting time or an extra ₹1,000 monthly investment create life-changing multi-lakh differences.
        </p>
      </div>

      {/* Grid: 3 Interactive Simulators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Simulator 1: The Brutal Cost of Delay */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="font-display text-sm sm:text-base font-bold text-white">
                The Brutal Cost of Delay
              </h3>
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-800/60">
              Delay by {delayYears} Years
            </span>
          </div>

          <p className="text-xs text-slate-400">
            See the compounding loss if you postpone your monthly SIP of {formatCurrency(inputs.monthlyInvestment, currency)} by just a few years:
          </p>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Delay Horizon:</span>
              <span className="text-rose-400 font-bold">{delayYears} Years Delay</span>
            </div>
            <input
              type="range"
              min={1}
              max={Math.min(10, Math.floor(inputs.timePeriodYears / 2))}
              step={1}
              value={delayYears}
              onChange={(e) => setDelayYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          {/* Loss Metrics Card */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-rose-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Estimated Wealth Lost:</span>
              <span className="font-display font-extrabold text-xl text-rose-400">
                -{formatCurrency(delayResult.wealthLost, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-900 pt-2 text-slate-400">
              <span>Corpus If Started On Time:</span>
              <span className="font-semibold text-emerald-400">{formatCurrency(delayResult.onTimeCorpus, currency)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Corpus After {delayYears} Yr Delay:</span>
              <span className="font-semibold text-slate-300">{formatCurrency(delayResult.delayedCorpus, currency)}</span>
            </div>

            <div className="text-[11px] text-amber-300/80 bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/30">
              To make up for this {delayYears}-year delay, you would need to invest an extra <strong className="text-amber-200">+{formatCurrency(delayResult.extraMonthlySipRequired, currency)}/month</strong> every single month!
            </div>
          </div>
        </div>

        {/* Simulator 2: Power of an Extra ₹1,000 Boost */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display text-sm sm:text-base font-bold text-white">
                Power of an Extra Small Boost
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
              +{formatCurrency(boostAmount, currency)} / month
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Skipping one restaurant meal or small weekend expense and adding it to your SIP:
          </p>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Monthly Boost Amount:</span>
              <span className="text-emerald-400 font-bold">+{formatCurrency(boostAmount, currency)}</span>
            </div>
            <input
              type="range"
              min={200}
              max={10000}
              step={200}
              value={boostAmount}
              onChange={(e) => setBoostAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Boost Result Card */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Extra Wealth Created:</span>
              <span className="font-display font-extrabold text-xl text-emerald-400">
                +{formatCurrency(extraWealthGenerated, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-900 pt-2 text-slate-400">
              <span>Your Extra Out-of-Pocket Cost:</span>
              <span className="font-semibold text-slate-300">{formatCurrency(totalExtraInvested, currency)}</span>
            </div>

            <div className="text-[11px] text-emerald-300/90 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
              Your extra {formatCurrency(totalExtraInvested, currency)} investment creates <strong className="text-emerald-200">{formatCurrency(extraWealthGenerated, currency)}</strong> in additional wealth (a {((extraWealthGenerated / (totalExtraInvested || 1))).toFixed(1)}x return on boost)!
            </div>
          </div>
        </div>

        {/* Simulator 3: Rule of 72 & The 8-4-3 Rule */}
        <div className="lg:col-span-12 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display text-sm sm:text-base font-bold text-white">
              Sushil's Golden Rules of Compounding
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Rule of 72 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">The Rule of 72</span>
                <span className="font-display font-bold text-emerald-400 text-sm">{doublingYears} Years to Double</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                At your current expected return of <strong>{inputs.expectedReturnRate}% CAGR</strong>, your money doubles every <strong className="text-emerald-400">{doublingYears} years</strong> (72 ÷ {inputs.expectedReturnRate}).
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                E.g., ₹10 Lakhs becomes ₹20 Lakhs in {doublingYears} yrs, then ₹40 Lakhs in {Number(doublingYears) * 2} yrs!
              </div>
            </div>

            {/* The 8-4-3 Rule */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">The 8-4-3 Compounding Miracle</span>
                <span className="font-display font-bold text-amber-400 text-xs bg-amber-950 px-2 py-0.5 rounded">Snowball Effect</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reaching your <strong>First ₹1 Crore</strong> takes the longest (~8 years). Your <strong>Second ₹1 Crore</strong> takes only ~4 years, and your <strong>Third ₹1 Crore</strong> takes just ~2.5 to 3 years!
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                Because your accumulated interest begins to earn more than your salary.
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
