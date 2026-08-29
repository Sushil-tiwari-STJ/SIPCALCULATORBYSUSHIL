import React, { useState } from 'react';
import { 
  CurrencyCode, 
  FinancialGoal, 
  GoalCalculationResult, 
  GoalCategory 
} from '../types';
import { 
  calculateGoalSip, 
  formatCurrency, 
  getIndianNumberWords 
} from '../utils/financialCalculations';
import { 
  Target, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  Flame, 
  HelpCircle,
  Home,
  GraduationCap,
  Car,
  Palmtree,
  ShieldCheck,
  Plane,
  Edit2,
  ChevronRight,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface FinancialPlannerProps {
  currency: CurrencyCode;
}

const DEFAULT_GOALS: FinancialGoal[] = [
  {
    id: 'goal-1',
    name: 'Dream Home Down Payment',
    category: 'house',
    targetAmount: 5000000, // 50 Lakhs
    targetYearHorizon: 7,
    expectedReturn: 12,
    currentSavings: 500000,
    inflationAdjusted: true,
    inflationRate: 6,
    priority: 'high',
    icon: '🏡',
  },
  {
    id: 'goal-2',
    name: 'Child Higher Education Fund',
    category: 'child_education',
    targetAmount: 3500000, // 35 Lakhs
    targetYearHorizon: 12,
    expectedReturn: 13,
    currentSavings: 200000,
    inflationAdjusted: true,
    inflationRate: 7,
    priority: 'high',
    icon: '🎓',
  },
  {
    id: 'goal-3',
    name: 'Comfortable Retirement Corpus',
    category: 'retirement',
    targetAmount: 25000000, // 2.5 Crores
    targetYearHorizon: 20,
    expectedReturn: 12,
    currentSavings: 1000000,
    inflationAdjusted: true,
    inflationRate: 6,
    priority: 'high',
    icon: '🏖️',
  },
  {
    id: 'goal-4',
    name: 'Dream SUV / Car Upgrade',
    category: 'car',
    targetAmount: 1500000, // 15 Lakhs
    targetYearHorizon: 4,
    expectedReturn: 10,
    currentSavings: 100000,
    inflationAdjusted: false,
    inflationRate: 5,
    priority: 'medium',
    icon: '🚗',
  },
];

export const FinancialPlanner: React.FC<FinancialPlannerProps> = ({ currency }) => {
  const [goals, setGoals] = useState<FinancialGoal[]>(DEFAULT_GOALS);
  const [selectedGoalId, setSelectedGoalId] = useState<string>(DEFAULT_GOALS[0]?.id || '');
  const [isAddingGoal, setIsAddingGoal] = useState<boolean>(false);

  // New goal form state
  const [newGoal, setNewGoal] = useState<Partial<FinancialGoal>>({
    name: 'International Vacation',
    category: 'custom',
    targetAmount: 600000,
    targetYearHorizon: 3,
    expectedReturn: 10,
    currentSavings: 50000,
    inflationAdjusted: true,
    inflationRate: 6,
    priority: 'medium',
    icon: '✈️',
  });

  // Calculate results for all goals
  const calculatedGoals: GoalCalculationResult[] = goals.map((g) => calculateGoalSip(g));
  
  // Total aggregate monthly SIP required across all goals
  const totalCombinedMonthlySip = calculatedGoals.reduce((sum, g) => sum + g.requiredMonthlySip, 0);
  const totalCombinedStepUpSip = calculatedGoals.reduce((sum, g) => sum + g.requiredStepUpSip, 0);
  const totalAdjustedTargetCorpus = calculatedGoals.reduce((sum, g) => sum + g.adjustedTargetAmount, 0);
  const totalExistingSavings = goals.reduce((sum, g) => sum + g.currentSavings, 0);

  const selectedGoalResult = calculatedGoals.find((g) => g.goal.id === selectedGoalId) || calculatedGoals[0];

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount) return;

    const created: FinancialGoal = {
      id: `goal-${Date.now()}`,
      name: newGoal.name || 'My Financial Goal',
      category: newGoal.category as GoalCategory || 'custom',
      targetAmount: Number(newGoal.targetAmount) || 1000000,
      targetYearHorizon: Number(newGoal.targetYearHorizon) || 5,
      expectedReturn: Number(newGoal.expectedReturn) || 12,
      currentSavings: Number(newGoal.currentSavings) || 0,
      inflationAdjusted: Boolean(newGoal.inflationAdjusted),
      inflationRate: Number(newGoal.inflationRate) || 6,
      priority: (newGoal.priority as 'high' | 'medium' | 'low') || 'medium',
      icon: newGoal.icon || '🎯',
    };

    setGoals((prev) => [...prev, created]);
    setSelectedGoalId(created.id);
    setIsAddingGoal(false);

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleDeleteGoal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (selectedGoalId === id) {
      const remaining = goals.filter((g) => g.id !== id);
      if (remaining.length > 0) setSelectedGoalId(remaining[0].id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Planning Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Unique Goal Architecture & Reverse SIP Engine</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
              Life Milestones & Target-Achiever Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Reverse-engineer the exact monthly savings required to fund your life goals (House, Education, Retirement, Car) while factoring in true inflation costs.
            </p>
          </div>

          {/* Master Aggregate Cards */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-left min-w-[170px] flex-1 lg:flex-initial">
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Total Target Corpus
              </div>
              <div className="font-display font-bold text-lg sm:text-xl text-white mt-0.5">
                {formatCurrency(totalAdjustedTargetCorpus, currency, true)}
              </div>
              <div className="text-[10px] text-slate-400">
                Across {goals.length} Active Goals
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-teal-500/40 text-left min-w-[170px] flex-1 lg:flex-initial">
              <div className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Combined Monthly SIP
              </div>
              <div className="font-display font-bold text-lg sm:text-xl text-teal-300 mt-0.5">
                {formatCurrency(totalCombinedMonthlySip, currency)}
              </div>
              <div className="text-[10px] text-slate-400">
                Or {formatCurrency(totalCombinedStepUpSip, currency)} with Step-Up
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Goal List (Left) & Selected Goal Deep Dive (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Goals List & Creation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Your Life Goals ({goals.length})</span>
            </h3>
            <button
              onClick={() => setIsAddingGoal(!isAddingGoal)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Goal</span>
            </button>
          </div>

          {/* Add Goal Modal / Form */}
          <AnimatePresence>
            {isAddingGoal && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddGoal}
                className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-emerald-400">Configure New Milestone</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingGoal(false)}
                    className="text-xs text-slate-500 hover:text-slate-300"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="col-span-2">
                    <label className="text-[11px] font-medium text-slate-400">Goal Title</label>
                    <div className="flex gap-1.5 mt-1">
                      <select
                        value={newGoal.icon}
                        onChange={(e) => setNewGoal({ ...newGoal, icon: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2 text-sm"
                      >
                        <option value="🏡">🏡 House</option>
                        <option value="🎓">🎓 College</option>
                        <option value="🏖️">🏖️ Retire</option>
                        <option value="🚗">🚗 Car</option>
                        <option value="💍">💍 Wedding</option>
                        <option value="✈️">✈️ Travel</option>
                        <option value="💼">💼 Business</option>
                        <option value="🚀">🚀 Freedom</option>
                      </select>
                      <input
                        type="text"
                        required
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                        placeholder="e.g. Dream House"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Target Cost (Today)</label>
                    <input
                      type="number"
                      required
                      min={10000}
                      step={10000}
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Horizon (Years)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={40}
                      value={newGoal.targetYearHorizon}
                      onChange={(e) => setNewGoal({ ...newGoal, targetYearHorizon: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Existing Savings (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={newGoal.currentSavings}
                      onChange={(e) => setNewGoal({ ...newGoal, currentSavings: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Expected CAGR (%)</label>
                    <input
                      type="number"
                      min={4}
                      max={25}
                      value={newGoal.expectedReturn}
                      onChange={(e) => setNewGoal({ ...newGoal, expectedReturn: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      id="new-goal-inflation"
                      type="checkbox"
                      checked={newGoal.inflationAdjusted}
                      onChange={(e) => setNewGoal({ ...newGoal, inflationAdjusted: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-emerald-500"
                    />
                    <label htmlFor="new-goal-inflation" className="text-[11px] text-slate-300 cursor-pointer">
                      Adjust for 6% Inflation
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer"
                  >
                    Save & Plan
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Goal Cards List */}
          <div className="space-y-2.5">
            {calculatedGoals.map(({ goal, requiredMonthlySip, adjustedTargetAmount, feasibilityScore }) => {
              const isSelected = goal.id === selectedGoalId;
              return (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-400" />
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-white flex items-center gap-1.5">
                          <span>{goal.name}</span>
                          {goal.inflationAdjusted && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                              Inf-Adjusted
                            </span>
                          )}
                        </h4>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Target: <strong className="text-slate-200">{formatCurrency(adjustedTargetAmount, currency, true)}</strong> in <span className="text-emerald-400 font-semibold">{goal.targetYearHorizon} yrs</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Required SIP</div>
                      <div className="font-display font-bold text-sm sm:text-base text-emerald-400">
                        {formatCurrency(requiredMonthlySip, currency)}
                        <span className="text-[10px] font-normal text-slate-400">/mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Quick Metrics Bar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">Feasibility:</span>
                      <span className={`font-bold ${feasibilityScore > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {feasibilityScore}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {goal.currentSavings > 0 && (
                        <span className="text-[10px] text-slate-400">
                          Saved: {formatCurrency(goal.currentSavings, currency, true)}
                        </span>
                      )}
                      {goals.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteGoal(goal.id, e)}
                          title="Delete Goal"
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Goal Comprehensive Roadmap */}
        <div className="lg:col-span-7">
          {selectedGoalResult && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
              
              {/* Selected Goal Title & Category Pill */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800">
                    {selectedGoalResult.goal.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                        {selectedGoalResult.goal.name}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {selectedGoalResult.goal.targetYearHorizon} Yrs Horizon
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Target Cost Today: {formatCurrency(selectedGoalResult.goal.targetAmount, currency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Two Primary Execution Strategies: Flat SIP vs Step-Up SIP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Option A: Flat Regular SIP */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wide">
                    <span>Option A: Regular SIP</span>
                    <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">Constant</span>
                  </div>
                  <div className="font-display font-extrabold text-2xl text-emerald-400">
                    {formatCurrency(selectedGoalResult.requiredMonthlySip, currency)}
                    <span className="text-xs font-normal text-slate-400"> / month</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Fixed monthly investment for {selectedGoalResult.goal.targetYearHorizon} years at {selectedGoalResult.goal.expectedReturn}% CAGR.
                  </p>
                </div>

                {/* Option B: Step-Up SIP (10% Annual Growth) */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-950 border border-amber-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Option B: Step-Up SIP
                    </span>
                    <span className="text-[10px] bg-amber-950 px-2 py-0.5 rounded text-amber-300">+10%/yr</span>
                  </div>
                  <div className="font-display font-extrabold text-2xl text-amber-400">
                    {formatCurrency(selectedGoalResult.requiredStepUpSip, currency)}
                    <span className="text-xs font-normal text-slate-400"> / mo start</span>
                  </div>
                  <p className="text-[11px] text-amber-200/70">
                    Start with <strong className="text-amber-300">35% less upfront</strong> and increase your SIP with salary hikes each year.
                  </p>
                </div>
              </div>

              {/* Mathematical Breakdown Table / Cards */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Corpus Math & Inflation Reality
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Inflation-Adjusted Target</span>
                    <span className="font-display font-bold text-sm text-white mt-1 block">
                      {formatCurrency(selectedGoalResult.adjustedTargetAmount, currency)}
                    </span>
                    <span className="text-[10px] text-amber-400 mt-0.5 block">
                      +{Math.round(((selectedGoalResult.adjustedTargetAmount - selectedGoalResult.goal.targetAmount) / (selectedGoalResult.goal.targetAmount || 1)) * 100)}% due to {selectedGoalResult.goal.inflationRate}% inf.
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Savings Future Value</span>
                    <span className="font-display font-bold text-sm text-emerald-300 mt-1 block">
                      {formatCurrency(selectedGoalResult.futureValueOfCurrentSavings, currency)}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      from {formatCurrency(selectedGoalResult.goal.currentSavings, currency)} today
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 text-[10px] block">Net Gap To Fund</span>
                    <span className="font-display font-bold text-sm text-blue-400 mt-1 block">
                      {formatCurrency(selectedGoalResult.netTargetRemaining, currency)}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Funded via monthly SIP
                    </span>
                  </div>
                </div>
              </div>

              {/* Actionable Strategy Recommendations */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sushil's Financial Strategy & Allocation Advice</span>
                </div>
                <div className="space-y-2">
                  {selectedGoalResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                  
                  {/* Suggested Asset Allocation for this goal's time horizon */}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Recommended Portfolio Allocation:</span>
                    <span className="font-semibold text-emerald-300">
                      {selectedGoalResult.goal.targetYearHorizon >= 7
                        ? '75% Equity / 20% Debt / 5% Gold'
                        : selectedGoalResult.goal.targetYearHorizon >= 3
                        ? '50% Equity Hybrid / 45% Debt / 5% Gold'
                        : '80% Ultra Short-Term Debt / 20% Arbitrage'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
