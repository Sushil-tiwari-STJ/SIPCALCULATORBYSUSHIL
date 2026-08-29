import React, { useState } from 'react';
import { CurrencyCode } from '../types';
import { calculateFireTarget, formatCurrency, getIndianNumberWords } from '../utils/financialCalculations';
import { 
  Palmtree, 
  Flame, 
  ShieldCheck, 
  Percent, 
  Clock, 
  Coins, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';

interface FireCalculatorProps {
  currency: CurrencyCode;
}

export const FireCalculator: React.FC<FireCalculatorProps> = ({ currency }) => {
  const [currentAge, setCurrentAge] = useState<number>(28);
  const [targetRetireAge, setTargetRetireAge] = useState<number>(45);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(60000);
  const [currentPortfolio, setCurrentPortfolio] = useState<number>(1000000);
  const [withdrawalRate, setWithdrawalRate] = useState<number>(4.0); // 4% Rule
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [inflationRate, setInflationRate] = useState<number>(6);

  const yearsToRetire = Math.max(1, targetRetireAge - currentAge);
  const annualExpenses = monthlyExpenses * 12;

  const fireResult = calculateFireTarget(
    annualExpenses,
    withdrawalRate,
    inflationRate,
    yearsToRetire,
    currentPortfolio,
    expectedReturn
  );

  // Lean FIRE (20x expenses) vs Standard FIRE (25x expenses) vs Fat FIRE (33x expenses)
  const leanCorpus = fireResult.futureAnnualExpenses * 20;
  const standardCorpus = fireResult.fireCorpusNeeded;
  const fatCorpus = fireResult.futureAnnualExpenses * 33.33;

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Financial Independence & Early Retirement Planner</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
              The FIRE Master Blueprint (4% Safe Rule)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Calculate your exact freedom corpus number to retire at age {targetRetireAge} with a lifelong inflation-hedged passive cashflow.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-500/40 text-left min-w-[200px]">
            <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <Palmtree className="w-3.5 h-3.5" /> Target Retirement Age
            </div>
            <div className="font-display font-bold text-2xl text-white mt-0.5">
              Age {targetRetireAge} <span className="text-xs font-normal text-slate-400">({yearsToRetire} yrs left)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Inputs (Left) & Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form */}
        <div className="lg:col-span-6 space-y-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Lifestyle & Retirement Parameters</span>
          </h3>

          {/* Age Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Current Age</span>
                <span className="font-bold text-white">{currentAge} Yrs</span>
              </div>
              <input
                type="range"
                min={18}
                max={60}
                value={currentAge}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentAge(val);
                  if (val >= targetRetireAge) setTargetRetireAge(val + 5);
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Target Retire Age</span>
                <span className="font-bold text-amber-400">{targetRetireAge} Yrs</span>
              </div>
              <input
                type="range"
                min={currentAge + 1}
                max={70}
                value={targetRetireAge}
                onChange={(e) => setTargetRetireAge(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Monthly Expenses Today */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="monthly-expenses-input" className="font-medium text-slate-300">Current Monthly Living Expenses</label>
              <div className="flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">₹</span>
                <input
                  id="monthly-expenses-input"
                  type="number"
                  step={5000}
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-24 bg-transparent text-right font-display font-bold text-sm text-white focus:outline-none"
                />
              </div>
            </div>
            <input
              type="range"
              min={15000}
              max={500000}
              step={5000}
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Existing Savings / Portfolio */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="current-portfolio-input" className="font-medium text-slate-300">Existing Net Worth / Mutual Funds</label>
              <div className="flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">₹</span>
                <input
                  id="current-portfolio-input"
                  type="number"
                  step={50000}
                  value={currentPortfolio}
                  onChange={(e) => setCurrentPortfolio(Number(e.target.value))}
                  className="w-28 bg-transparent text-right font-display font-bold text-sm text-white focus:outline-none"
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={20000000}
              step={50000}
              value={currentPortfolio}
              onChange={(e) => setCurrentPortfolio(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Return & Safe Withdrawal Rate */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Pre-Retire Return</span>
                <span className="font-bold text-emerald-400">{expectedReturn}%</span>
              </div>
              <input
                type="range"
                min={8}
                max={18}
                step={0.5}
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Inflation Rate</span>
                <span className="font-bold text-amber-400">{inflationRate}%</span>
              </div>
              <input
                type="range"
                min={4}
                max={10}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Right Results Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main FIRE Number Card */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-950/50 via-slate-900 to-slate-950 border border-amber-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Required FIRE Freedom Corpus
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                {fireResult.multiplier}x Annual Expense
              </span>
            </div>

            <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {formatCurrency(fireResult.fireCorpusNeeded, currency)}
            </div>

            {currency === 'INR' && (
              <p className="text-xs text-amber-300/80 font-medium">
                ≈ {getIndianNumberWords(fireResult.fireCorpusNeeded)}
              </p>
            )}

            {/* Monthly SIP Required */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Monthly SIP Needed Starting Today:</span>
                <div className="font-display font-extrabold text-xl text-emerald-400 mt-0.5">
                  {formatCurrency(fireResult.requiredMonthlySip, currency)}
                  <span className="text-xs font-normal text-slate-400"> / month</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Monthly Pension At Age {targetRetireAge}:</span>
                <div className="font-display font-bold text-sm text-slate-200 mt-0.5">
                  {formatCurrency(fireResult.monthlyPensionInRetirement, currency)}/mo
                </div>
              </div>
            </div>

            {/* 3 Tiers of FIRE (Lean, Standard, Fat) */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">Lean FIRE (20x)</div>
                <div className="font-display font-bold text-xs sm:text-sm text-slate-200 mt-0.5">
                  {formatCurrency(leanCorpus, currency, true)}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/40">
                <div className="text-[10px] text-amber-400 font-bold">Standard (25x)</div>
                <div className="font-display font-bold text-xs sm:text-sm text-amber-300 mt-0.5">
                  {formatCurrency(standardCorpus, currency, true)}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">Fat FIRE (33x)</div>
                <div className="font-display font-bold text-xs sm:text-sm text-slate-200 mt-0.5">
                  {formatCurrency(fatCorpus, currency, true)}
                </div>
              </div>
            </div>
          </div>

          {/* Expert Philosophy Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Sushil's FIRE Wisdom (The Trinity Study 4% Rule)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The 4% withdrawal rule ensures your portfolio has a &gt;95% probability of lasting 30+ years without running out of money, assuming a 60:40 Equity to Debt asset allocation in retirement.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
