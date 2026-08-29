import React, { useState } from 'react';
import { RiskProfile, RiskProfileRecommendation } from '../types';
import { 
  ShieldCheck, 
  TrendingUp, 
  PieChart as PieIcon, 
  Award, 
  CheckCircle, 
  Zap, 
  Compass, 
  Scale 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const RISK_PROFILES: Record<RiskProfile, RiskProfileRecommendation> = {
  conservative: {
    profile: 'conservative',
    title: 'Conservative (Capital Preservation)',
    description: 'Prioritizes safety and stable returns with minimal volatility. Ideal for horizons under 3-5 years.',
    expectedReturnsRange: '7% - 9% CAGR',
    allocation: {
      largeCapEquity: 20,
      midSmallCapEquity: 0,
      debtFixedIncome: 65,
      goldCommodities: 15,
      internationalEquity: 0,
    },
  },
  moderate: {
    profile: 'moderate',
    title: 'Moderate (Balanced Stability)',
    description: 'A disciplined balance of steady capital appreciation with debt shock-absorbers. Great for 5-7 year horizons.',
    expectedReturnsRange: '10% - 12% CAGR',
    allocation: {
      largeCapEquity: 40,
      midSmallCapEquity: 10,
      debtFixedIncome: 35,
      goldCommodities: 10,
      internationalEquity: 5,
    },
  },
  balanced: {
    profile: 'balanced',
    title: 'Balanced Growth (The Core Classic)',
    description: 'The golden ratio of equity wealth compounding paired with strategic rebalancing.',
    expectedReturnsRange: '12% - 14% CAGR',
    allocation: {
      largeCapEquity: 50,
      midSmallCapEquity: 20,
      debtFixedIncome: 20,
      goldCommodities: 5,
      internationalEquity: 5,
    },
  },
  growth: {
    profile: 'growth',
    title: 'High Growth (Wealth Multiplier)',
    description: 'Aggressive equity accumulation for young investors with 10+ year time horizons.',
    expectedReturnsRange: '14% - 16% CAGR',
    allocation: {
      largeCapEquity: 45,
      midSmallCapEquity: 35,
      debtFixedIncome: 10,
      goldCommodities: 5,
      internationalEquity: 5,
    },
  },
  aggressive: {
    profile: 'aggressive',
    title: 'Ultra Aggressive (Alpha Hunter)',
    description: 'Maximum exposure to high-beta small cap and emerging tech innovators. High volatility tolerance required.',
    expectedReturnsRange: '16% - 18%+ CAGR',
    allocation: {
      largeCapEquity: 30,
      midSmallCapEquity: 55,
      debtFixedIncome: 5,
      goldCommodities: 0,
      internationalEquity: 10,
    },
  },
};

export const AssetAllocationGuide: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<RiskProfile>('balanced');

  const current = RISK_PROFILES[selectedProfile];

  const pieData = [
    { name: 'Large Cap / Flexi Cap', value: current.allocation.largeCapEquity, color: '#3b82f6' },
    { name: 'Mid & Small Cap', value: current.allocation.midSmallCapEquity, color: '#10b981' },
    { name: 'Debt & Fixed Income', value: current.allocation.debtFixedIncome, color: '#64748b' },
    { name: 'Gold / Sovereign Gold Bonds', value: current.allocation.goldCommodities, color: '#f59e0b' },
    { name: 'International / Tech Equity', value: current.allocation.internationalEquity, color: '#8b5cf6' },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Asset Allocation & Portfolio Architecture</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">
              Optimal Portfolio Distribution Strategy
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              "Asset allocation accounts for over 90% of a portfolio's return variability" — Ray Dalio & Vanguard Studies.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(Object.keys(RISK_PROFILES) as RiskProfile[]).map((key) => {
          const prof = RISK_PROFILES[key];
          const isSelected = selectedProfile === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedProfile(key)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-950/40 font-bold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                {prof.expectedReturnsRange}
              </div>
              <div className="text-xs sm:text-sm font-semibold truncate mt-0.5">
                {prof.title.split('(')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Donut Chart */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-white mb-2 self-start flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-400" />
            <span>Target Asset Allocation Matrix</span>
          </h3>

          <div className="h-[240px] w-[240px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Allocation']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Expected CAGR</span>
              <span className="text-lg font-bold font-display text-emerald-400">
                {current.expectedReturnsRange.split(' ')[0]}
              </span>
            </div>
          </div>

          <div className="w-full space-y-2 mt-4 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-white font-display">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Allocation Strategy & Fund Categories */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
              Portfolio Profile Strategy
            </div>
            <h3 className="font-display text-lg font-bold text-white mt-0.5">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Recommended Mutual Fund Categories for this profile */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              Sushil's Mutual Fund Categories Checklist
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-semibold text-blue-400">Core Equity Engine ({current.allocation.largeCapEquity}%)</span>
                <p className="text-[11px] text-slate-400">Nifty 50 Index Fund or Flexi-Cap Funds with strong downside protection.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-semibold text-emerald-400">Alpha Multiplier ({current.allocation.midSmallCapEquity}%)</span>
                <p className="text-[11px] text-slate-400">Mid-Cap 150 Index or Quality Small-Cap active funds for 10+ year compounding.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-300">Stability Shield ({current.allocation.debtFixedIncome}%)</span>
                <p className="text-[11px] text-slate-400">Short Duration Debt Funds, Arbitrage Funds, or Liquid Funds for emergency buffer.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-semibold text-amber-400">Hedge & Inflation ({current.allocation.goldCommodities}%)</span>
                <p className="text-[11px] text-slate-400">Sovereign Gold Bonds (SGB) or 24K Gold ETFs as an economic hedge.</p>
              </div>
            </div>
          </div>

          {/* Rebalancing Rule */}
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300/90 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Annual Rebalancing Rule:</strong> Rebalance once every 12 months. If equity outperforms and rises to 80% (when target is 70%), book profit and reallocate 10% to debt/gold.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
