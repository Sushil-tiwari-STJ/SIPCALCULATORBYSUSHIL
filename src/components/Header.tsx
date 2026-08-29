import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  FileDown, 
  RotateCcw, 
  Award,
  Globe2,
  CheckCircle2
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCY_CONFIGS } from '../utils/financialCalculations';

interface HeaderProps {
  activeTab: 'calculator' | 'planner' | 'fire' | 'allocation' | 'simulator';
  setActiveTab: (tab: 'calculator' | 'planner' | 'fire' | 'allocation' | 'simulator') => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  onOpenReport: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onOpenReport,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
          
          {/* Brand Logo & Sushil Attribution */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
                    WealthCraft <span className="text-emerald-400 text-sm font-semibold">SIP & Financial Planner</span>
                  </h1>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Smart Wealth Architect</span>
                  <span className="text-slate-600">•</span>
                  <div className="inline-flex items-center gap-1 text-emerald-400 font-medium px-1.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Made by Sushil</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Author Badge */}
            <div className="sm:hidden flex items-center gap-1 text-xs text-slate-400">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-slate-900 border border-slate-700 text-emerald-400 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              >
                {Object.values(CURRENCY_CONFIGS).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Right Controls: Currency Selector, Export Dossier, Reset */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="currency-select" className="text-slate-400 sr-only">Currency</label>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer pr-1"
              >
                {Object.values(CURRENCY_CONFIGS).map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                    {c.symbol} {c.code} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              id="reset-btn"
              onClick={onReset}
              title="Reset parameters to defaults"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              id="export-dossier-btn"
              onClick={onOpenReport}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 rounded-xl shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Plan</span>
            </button>

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800 text-xs font-medium text-slate-400">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">By <strong className="text-emerald-400 font-semibold">Sushil</strong></span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar border-t border-slate-900 text-xs sm:text-sm font-medium">
          <button
            id="nav-tab-calculator"
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>SIP Calculator</span>
          </button>

          <button
            id="nav-tab-planner"
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer relative ${
              activeTab === 'planner'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Goal Financial Planner</span>
            <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Unique
            </span>
          </button>

          <button
            id="nav-tab-fire"
            onClick={() => setActiveTab('fire')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'fire'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <span className="text-sm">🏖️</span>
            <span>FIRE Retirement Plan</span>
          </button>

          <button
            id="nav-tab-allocation"
            onClick={() => setActiveTab('allocation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'allocation'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <span className="text-sm">📊</span>
            <span>Asset Allocation & Risk</span>
          </button>

          <button
            id="nav-tab-simulator"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <span className="text-sm">⚡</span>
            <span>Compounding Simulator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
