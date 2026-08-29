import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { CurrencyCode, SipInputs, SipResult } from '../types';
import { formatCurrency } from '../utils/financialCalculations';
import { PieChart as PieIcon, LineChart as LineIcon, BarChart3, ShieldCheck, Flame } from 'lucide-react';

interface GrowthChartsProps {
  result: SipResult;
  inputs: SipInputs;
  currency: CurrencyCode;
}

export const GrowthCharts: React.FC<GrowthChartsProps> = ({
  result,
  inputs,
  currency,
}) => {
  const [chartView, setChartView] = useState<'area' | 'breakdown' | 'stepup'>('area');

  // Chart data from yearly breakdown
  const areaChartData = result.yearlyBreakdown.map((item) => ({
    year: `Yr ${item.year}`,
    yearNum: item.year,
    invested: item.totalInvested,
    returns: item.totalInterestEarned,
    futureValue: item.futureValue,
    inflationAdjusted: item.inflationAdjustedValue,
    postTax: item.postTaxValue,
  }));

  // Pie chart data
  const pieData = [
    { name: 'Total Invested', value: result.totalInvested, color: '#3b82f6' },
    { name: 'Est. Wealth Gain', value: result.estimatedReturns, color: '#10b981' },
  ];

  if (result.taxAmount > 0 && inputs.enableTax) {
    pieData.push({ name: 'Estimated LTCG Tax', value: result.taxAmount, color: '#f43f5e' });
  }

  // Step-up comparison data: Step-up vs Normal SIP
  const comparisonData = result.yearlyBreakdown.map((item) => {
    // calculate normal sip equivalent
    const monthlyRate = inputs.expectedReturnRate / 100 / 12;
    const months = item.year * 12;
    const normalSipFV = ((inputs.monthlyInvestment * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate) * (1 + monthlyRate);
    const normalInvested = inputs.monthlyInvestment * months;

    return {
      year: `Yr ${item.year}`,
      stepUpValue: item.futureValue,
      normalSipValue: Math.round(normalSipFV),
      stepUpInvested: item.totalInvested,
      normalInvested: normalInvested,
    };
  });

  const isStepUp = inputs.investmentType === 'stepup';

  const customAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[210px]">
          <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex justify-between">
            <span>Timeline: {label}</span>
            <span className="text-emerald-400 font-bold">{formatCurrency(data.futureValue, currency, true)}</span>
          </div>
          <div className="flex justify-between items-center text-blue-400">
            <span>Invested Principal:</span>
            <span className="font-semibold">{formatCurrency(data.invested, currency)}</span>
          </div>
          <div className="flex justify-between items-center text-emerald-400">
            <span>Interest / Wealth Gain:</span>
            <span className="font-semibold">{formatCurrency(data.returns, currency)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-100 font-bold pt-1 border-t border-slate-800/80">
            <span>Total Maturity Corpus:</span>
            <span className="text-emerald-300">{formatCurrency(data.futureValue, currency)}</span>
          </div>
          {inputs.enableInflation && (
            <div className="flex justify-between items-center text-amber-400 text-[11px] pt-0.5">
              <span>Real Value (Inflation-Adj):</span>
              <span className="font-medium">{formatCurrency(data.inflationAdjusted, currency)}</span>
            </div>
          )}
          {inputs.enableTax && (
            <div className="flex justify-between items-center text-purple-400 text-[11px]">
              <span>Post-Tax Corpus:</span>
              <span className="font-medium">{formatCurrency(data.postTax, currency)}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      
      {/* Chart Header & Toggle Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>Wealth Accumulation & Projection</span>
            {isStepUp && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> Step-Up Boost Active
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400">
            Visualizing the compounding curve over {inputs.timePeriodYears} years at {inputs.expectedReturnRate}% p.a.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-center">
          <button
            id="chart-tab-area"
            onClick={() => setChartView('area')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              chartView === 'area'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>Growth Curve</span>
          </button>

          <button
            id="chart-tab-breakdown"
            onClick={() => setChartView('breakdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              chartView === 'breakdown'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Capital Ratio</span>
          </button>

          {isStepUp && (
            <button
              id="chart-tab-stepup"
              onClick={() => setChartView('stepup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartView === 'stepup'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Step-Up vs Flat</span>
            </button>
          )}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="mt-5 h-[280px] sm:h-[340px] w-full">
        {chartView === 'area' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorInflation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="year"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(val) => formatCurrency(val, currency, true)}
              />
              <Tooltip content={customAreaTooltip} />
              
              {/* Invested Capital Layer */}
              <Area
                type="monotone"
                dataKey="invested"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorInvested)"
                name="Invested Amount"
              />

              {/* Total Future Value (Returns + Invested) */}
              <Area
                type="monotone"
                dataKey="futureValue"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorReturns)"
                name="Total Wealth"
              />

              {/* Inflation adjusted real power curve if enabled */}
              {inputs.enableInflation && (
                <Area
                  type="monotone"
                  dataKey="inflationAdjusted"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={0.2}
                  fill="url(#colorInflation)"
                  name="Inflation Adjusted"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartView === 'breakdown' && (
          <div className="flex flex-col sm:flex-row items-center justify-around h-full gap-4">
            <div className="h-[220px] w-[220px] sm:h-[260px] sm:w-[260px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val), currency), 'Amount']}
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
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Wealth Multiplier</span>
                <span className="text-xl sm:text-2xl font-bold font-display text-emerald-400">
                  {result.wealthGainMultiplier}x
                </span>
                <span className="text-[10px] text-slate-500">of Invested</span>
              </div>
            </div>

            {/* Breakdown Legend Cards */}
            <div className="flex flex-col gap-2.5 w-full max-w-xs text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                  <div>
                    <div className="font-semibold text-slate-200">Invested Capital</div>
                    <div className="text-[11px] text-slate-400">
                      {((result.totalInvested / (result.futureValue || 1)) * 100).toFixed(1)}% of Corpus
                    </div>
                  </div>
                </div>
                <span className="font-bold text-blue-400 font-display">
                  {formatCurrency(result.totalInvested, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-emerald-900/30">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  <div>
                    <div className="font-semibold text-slate-200">Est. Compounded Gain</div>
                    <div className="text-[11px] text-slate-400">
                      {((result.estimatedReturns / (result.futureValue || 1)) * 100).toFixed(1)}% of Corpus
                    </div>
                  </div>
                </div>
                <span className="font-bold text-emerald-400 font-display">
                  {formatCurrency(result.estimatedReturns, currency)}
                </span>
              </div>

              {result.taxAmount > 0 && inputs.enableTax && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-rose-900/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                    <div>
                      <div className="font-semibold text-slate-200">LTCG Tax (@{inputs.taxRate}%)</div>
                      <div className="text-[11px] text-slate-400">After ₹1.25L Exemption</div>
                    </div>
                  </div>
                  <span className="font-bold text-rose-400 font-display">
                    -{formatCurrency(result.taxAmount, currency)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {chartView === 'stepup' && isStepUp && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData.filter((_, idx) => (idx + 1) % 2 === 0 || idx === comparisonData.length - 1 || idx === 0)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(val) => formatCurrency(val, currency, true)} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val), currency), '']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="normalSipValue" name="Flat Standard SIP" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stepUpValue" name={`Step-Up SIP (+${inputs.stepUpValue}${inputs.stepUpType === 'percentage' ? '%' : ''}/yr)`} fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend / Footer Insights */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
            <span>Total Invested</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
            <span>Total Wealth</span>
          </div>
          {inputs.enableInflation && (
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
              <span>Inflation Value ({inputs.inflationRate}%)</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Compounded Monthly (Annuity Due)</span>
        </div>
      </div>
    </div>
  );
};
