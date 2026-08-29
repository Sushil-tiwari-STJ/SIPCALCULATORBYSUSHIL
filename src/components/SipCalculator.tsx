import React, { useState } from 'react';
import { 
  CurrencyCode, 
  InvestmentType, 
  SipInputs, 
  SipResult 
} from '../types';
import { formatCurrency, getIndianNumberWords } from '../utils/financialCalculations';
import { 
  TrendingUp, 
  Wallet, 
  Layers, 
  Sliders, 
  Percent, 
  Calendar, 
  Flame, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Clock,
  Coins,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SipCalculatorProps {
  inputs: SipInputs;
  setInputs: React.Dispatch<React.SetStateAction<SipInputs>>;
  result: SipResult;
  currency: CurrencyCode;
}

export const SipCalculator: React.FC<SipCalculatorProps> = ({
  inputs,
  setInputs,
  result,
  currency,
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleTypeChange = (type: InvestmentType) => {
    setInputs((prev) => ({ ...prev, investmentType: type }));
  };

  const monthlyPresets = [
    { label: '₹2.5K', value: 2500 },
    { label: '₹5K', value: 5000 },
    { label: '₹10K', value: 10000 },
    { label: '₹25K', value: 25000 },
    { label: '₹50K', value: 50000 },
    { label: '₹1L', value: 100000 },
  ];

  const lumpsumPresets = [
    { label: '₹50K', value: 50000 },
    { label: '₹1L', value: 100000 },
    { label: '₹5L', value: 500000 },
    { label: '₹10L', value: 1000000 },
    { label: '₹25L', value: 2500000 },
  ];

  const returnPresets = [
    { label: 'FD / Debt (7%)', value: 7 },
    { label: 'Hybrid / Large Cap (11%)', value: 11 },
    { label: 'Nifty 50 / Flexi Cap (13%)', value: 13 },
    { label: 'Mid & Small Cap (16%)', value: 16 },
  ];

  const yearPresets = [3, 5, 10, 15, 20, 25, 30];

  // Calculate milestones
  const milestones = [
    { target: 1000000, label: 'First ₹10 Lakhs' },
    { target: 5000000, label: 'Half-Crore (₹50 L)' },
    { target: 10000000, label: 'The 1 Crore Club' },
    { target: 50000000, label: '5 Crores Ultra-Wealth' },
  ].map((m) => {
    const reachedYear = result.yearlyBreakdown.find((y) => y.futureValue >= m.target);
    return {
      ...m,
      reached: Boolean(reachedYear),
      year: reachedYear ? reachedYear.year : null,
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Type Toggle: Monthly SIP vs Step-Up SIP vs Lumpsum */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto flex-1">
          <button
            id="tab-sip"
            onClick={() => handleTypeChange('sip')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              inputs.investmentType === 'sip'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Regular SIP</span>
          </button>

          <button
            id="tab-stepup"
            onClick={() => handleTypeChange('stepup')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer relative ${
              inputs.investmentType === 'stepup'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-950 fill-amber-950" />
            <span>Step-Up SIP</span>
            <span className="hidden md:inline-block text-[9px] px-1 py-0.2 bg-amber-950 text-amber-300 font-bold rounded">
              +Wealth
            </span>
          </button>

          <button
            id="tab-lumpsum"
            onClick={() => handleTypeChange('lumpsum')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              inputs.investmentType === 'lumpsum'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>One-Time Lumpsum</span>
          </button>
        </div>
      </div>

      {/* Input Sliders & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Sliders & Inputs */}
        <div className="lg:col-span-7 space-y-5 bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
          
          {/* Investment Amount Input */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label htmlFor="investment-amount-input" className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-400" />
                {inputs.investmentType === 'lumpsum' ? 'Lumpsum Investment Amount' : 'Monthly SIP Amount'}
              </label>
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-emerald-500 transition-colors">
                <span className="text-emerald-400 font-semibold text-sm">
                  {currency === 'INR' ? '₹' : '$'}
                </span>
                <input
                  id="investment-amount-input"
                  type="number"
                  min={500}
                  max={inputs.investmentType === 'lumpsum' ? 50000000 : 2000000}
                  step={500}
                  value={inputs.investmentType === 'lumpsum' ? inputs.lumpsumAmount : inputs.monthlyInvestment}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    if (inputs.investmentType === 'lumpsum') {
                      setInputs((prev) => ({ ...prev, lumpsumAmount: val }));
                    } else {
                      setInputs((prev) => ({ ...prev, monthlyInvestment: val }));
                    }
                  }}
                  className="w-28 sm:w-32 bg-transparent text-right font-display font-bold text-base sm:text-lg text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Slider */}
            <input
              id="investment-amount-slider"
              type="range"
              min={inputs.investmentType === 'lumpsum' ? 10000 : 500}
              max={inputs.investmentType === 'lumpsum' ? 10000000 : 500000}
              step={inputs.investmentType === 'lumpsum' ? 10000 : 500}
              value={inputs.investmentType === 'lumpsum' ? inputs.lumpsumAmount : inputs.monthlyInvestment}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (inputs.investmentType === 'lumpsum') {
                  setInputs((prev) => ({ ...prev, lumpsumAmount: val }));
                } else {
                  setInputs((prev) => ({ ...prev, monthlyInvestment: val }));
                }
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />

            {/* Preset Quick Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(inputs.investmentType === 'lumpsum' ? lumpsumPresets : monthlyPresets).map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    if (inputs.investmentType === 'lumpsum') {
                      setInputs((prev) => ({ ...prev, lumpsumAmount: preset.value }));
                    } else {
                      setInputs((prev) => ({ ...prev, monthlyInvestment: preset.value }));
                    }
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    (inputs.investmentType === 'lumpsum' ? inputs.lumpsumAmount : inputs.monthlyInvestment) === preset.value
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Expected Return Rate Slider */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <label htmlFor="return-rate-input" className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-emerald-400" />
                  Expected Annual Return Rate (CAGR)
                </label>
                <p className="text-[11px] text-slate-500">Historical Long-Term Equity: 12% - 15%</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-emerald-500">
                <input
                  id="return-rate-input"
                  type="number"
                  min={1}
                  max={30}
                  step={0.5}
                  value={inputs.expectedReturnRate}
                  onChange={(e) => setInputs((prev) => ({ ...prev, expectedReturnRate: Math.min(35, Math.max(1, Number(e.target.value) || 0)) }))}
                  className="w-14 sm:w-16 bg-transparent text-right font-display font-bold text-base text-white focus:outline-none"
                />
                <span className="text-emerald-400 font-bold text-sm">%</span>
              </div>
            </div>

            <input
              id="return-rate-slider"
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={inputs.expectedReturnRate}
              onChange={(e) => setInputs((prev) => ({ ...prev, expectedReturnRate: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />

            {/* Return Benchmark Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {returnPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setInputs((prev) => ({ ...prev, expectedReturnRate: preset.value }))}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    inputs.expectedReturnRate === preset.value
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Horizon Slider */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <label htmlFor="time-horizon-input" className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Investment Time Horizon
                </label>
                <p className="text-[11px] text-slate-500">Compounding magic explodes after 10+ years</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-emerald-500">
                <input
                  id="time-horizon-input"
                  type="number"
                  min={1}
                  max={45}
                  value={inputs.timePeriodYears}
                  onChange={(e) => setInputs((prev) => ({ ...prev, timePeriodYears: Math.min(50, Math.max(1, Number(e.target.value) || 1)) }))}
                  className="w-12 bg-transparent text-right font-display font-bold text-base text-white focus:outline-none"
                />
                <span className="text-emerald-400 font-semibold text-xs">Yrs</span>
              </div>
            </div>

            <input
              id="time-horizon-slider"
              type="range"
              min={1}
              max={40}
              step={1}
              value={inputs.timePeriodYears}
              onChange={(e) => setInputs((prev) => ({ ...prev, timePeriodYears: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />

            {/* Year Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {yearPresets.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setInputs((prev) => ({ ...prev, timePeriodYears: yr }))}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    inputs.timePeriodYears === yr
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {yr} Yrs
                </button>
              ))}
            </div>
          </div>

          {/* Step-Up Settings (if Step-Up is selected) */}
          {inputs.investmentType === 'stepup' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    Annual Step-Up Increment
                  </span>
                </div>
                <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs">
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, stepUpType: 'percentage' }))}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      inputs.stepUpType === 'percentage'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, stepUpType: 'amount' }))}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      inputs.stepUpType === 'amount'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Fixed Amount (₹)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={inputs.stepUpType === 'percentage' ? 1 : 500}
                  max={inputs.stepUpType === 'percentage' ? 30 : 25000}
                  step={inputs.stepUpType === 'percentage' ? 1 : 500}
                  value={inputs.stepUpValue}
                  onChange={(e) => setInputs((prev) => ({ ...prev, stepUpValue: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <span className="font-display font-bold text-amber-400 text-sm whitespace-nowrap bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  +{inputs.stepUpValue}{inputs.stepUpType === 'percentage' ? '% /yr' : '/yr'}
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70">
                Tip: As your salary increases each year by 10%, stepping up your SIP can more than double your wealth!
              </p>
            </motion.div>
          )}

          {/* Advanced Collapsible: Inflation & LTCG Tax */}
          <div className="pt-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full py-2 px-3 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-950/60 rounded-xl border border-slate-800/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Advanced Analytics: Inflation & Tax Planning (LTCG)</span>
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4"
                >
                  {/* Inflation Toggle */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          id="inflation-toggle"
                          type="checkbox"
                          checked={inputs.enableInflation}
                          onChange={(e) => setInputs((prev) => ({ ...prev, enableInflation: e.target.checked }))}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                        <label htmlFor="inflation-toggle" className="text-xs font-semibold text-slate-300 cursor-pointer">
                          Account for Inflation (Purchasing Power)
                        </label>
                      </div>
                      {inputs.enableInflation && (
                        <span className="text-xs font-bold text-amber-400">{inputs.inflationRate}% p.a.</span>
                      )}
                    </div>
                    {inputs.enableInflation && (
                      <input
                        type="range"
                        min={3}
                        max={12}
                        step={0.5}
                        value={inputs.inflationRate}
                        onChange={(e) => setInputs((prev) => ({ ...prev, inflationRate: Number(e.target.value) }))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                      />
                    )}
                  </div>

                  {/* Tax Toggle */}
                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          id="tax-toggle"
                          type="checkbox"
                          checked={inputs.enableTax}
                          onChange={(e) => setInputs((prev) => ({ ...prev, enableTax: e.target.checked }))}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                        <label htmlFor="tax-toggle" className="text-xs font-semibold text-slate-300 cursor-pointer">
                          Deduct Long-Term Capital Gains Tax (LTCG)
                        </label>
                      </div>
                      {inputs.enableTax && (
                        <span className="text-xs font-bold text-purple-400">{inputs.taxRate}% (₹1.25L Exemption)</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Dynamic Outcome Cards & Milestones */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* Main Future Value Highlight Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 p-5 sm:p-6 shadow-2xl shadow-emerald-950/40">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Total Projected Wealth
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {inputs.timePeriodYears} Years Horizon
              </span>
            </div>

            {/* Big Corpus Number */}
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {formatCurrency(result.futureValue, currency)}
            </div>
            
            {/* Indian Words (e.g. 1 Crore 24 Lakhs) */}
            {currency === 'INR' && (
              <p className="text-xs text-emerald-300/80 font-medium mt-1">
                ≈ {getIndianNumberWords(result.futureValue)}
              </p>
            )}

            {/* Wealth Multiplier Badge */}
            <div className="mt-4 pt-4 border-t border-emerald-900/40 flex items-center justify-between text-xs">
              <span className="text-slate-400">Wealth Multiplier:</span>
              <span className="font-display font-bold text-emerald-400 text-sm bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                {result.wealthGainMultiplier}x Returns
              </span>
            </div>

            {/* Inflation-Adjusted & Post-Tax Readout if active */}
            {(inputs.enableInflation || inputs.enableTax) && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                {inputs.enableInflation && (
                  <div className="flex justify-between items-center text-amber-300/90">
                    <span>Inflation-Adjusted Purchasing Power:</span>
                    <span className="font-bold font-display">{formatCurrency(result.inflationAdjustedValue, currency)}</span>
                  </div>
                )}
                {inputs.enableTax && (
                  <div className="flex justify-between items-center text-purple-300/90">
                    <span>Post-Tax Net In-Hand Value:</span>
                    <span className="font-bold font-display">{formatCurrency(result.postTaxValue, currency)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Two-Card Split: Invested vs Compounded Gain */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Total Invested
              </div>
              <div className="font-display font-bold text-lg sm:text-xl text-blue-400">
                {formatCurrency(result.totalInvested, currency, true)}
              </div>
              <div className="text-[10px] text-slate-500">
                Principal Capital
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Est. Wealth Gain
              </div>
              <div className="font-display font-bold text-lg sm:text-xl text-emerald-400">
                {formatCurrency(result.estimatedReturns, currency, true)}
              </div>
              <div className="text-[10px] text-slate-500">
                Power of Compounding
              </div>
            </div>
          </div>

          {/* Wealth Milestones Pathway */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Milestone Checkpoints
              </span>
              <span className="text-[10px] text-slate-500">Compounding Timeline</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border text-xs transition-all ${
                    m.reached
                      ? 'bg-emerald-950/40 border-emerald-800/40 text-slate-200'
                      : 'bg-slate-950/40 border-slate-800/50 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="text-[10px] font-medium truncate">{m.label}</div>
                  <div className="font-display font-bold text-xs mt-0.5 text-emerald-400">
                    {m.reached ? `Year ${m.year}` : 'Beyond'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
