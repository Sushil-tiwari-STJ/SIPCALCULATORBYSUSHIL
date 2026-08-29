import React, { useState, useMemo } from 'react';
import { CurrencyCode, SipInputs } from './types';
import { calculateSip } from './utils/financialCalculations';
import { Header } from './components/Header';
import { SipCalculator } from './components/SipCalculator';
import { GrowthCharts } from './components/GrowthCharts';
import { FinancialPlanner } from './components/FinancialPlanner';
import { FireCalculator } from './components/FireCalculator';
import { AssetAllocationGuide } from './components/AssetAllocationGuide';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { YearlyScheduleTable } from './components/YearlyScheduleTable';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Flame, 
  Target, 
  Compass, 
  Award,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_INPUTS: SipInputs = {
  investmentType: 'sip',
  monthlyInvestment: 15000,
  lumpsumAmount: 500000,
  expectedReturnRate: 13,
  timePeriodYears: 15,
  stepUpType: 'percentage',
  stepUpValue: 10,
  enableInflation: true,
  inflationRate: 6,
  enableTax: false,
  taxRate: 12.5,
  taxExemptionAmount: 125000,
};

export default function App() {
  const [inputs, setInputs] = useState<SipInputs>(INITIAL_INPUTS);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [activeTab, setActiveTab] = useState<'calculator' | 'planner' | 'fire' | 'allocation' | 'simulator'>('calculator');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Memoized SIP Calculation
  const result = useMemo(() => calculateSip(inputs), [inputs]);

  const handleReset = () => {
    setInputs(INITIAL_INPUTS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        onOpenReport={() => setIsReportOpen(true)}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Main SIP Calculator & Wealth Projections */}
          {activeTab === 'calculator' && (
            <motion.div
              key="tab-calculator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Core Interactive Calculator */}
              <SipCalculator
                inputs={inputs}
                setInputs={setInputs}
                result={result}
                currency={currency}
              />

              {/* Graphical Visualizations */}
              <GrowthCharts
                result={result}
                inputs={inputs}
                currency={currency}
              />

              {/* Annual Schedule Table */}
              <YearlyScheduleTable
                result={result}
                inputs={inputs}
                currency={currency}
              />
            </motion.div>
          )}

          {/* TAB 2: Unique Financial Planner (Goal-Based Target Achiever) */}
          {activeTab === 'planner' && (
            <motion.div
              key="tab-planner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FinancialPlanner currency={currency} />
            </motion.div>
          )}

          {/* TAB 3: FIRE Retirement Planner */}
          {activeTab === 'fire' && (
            <motion.div
              key="tab-fire"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FireCalculator currency={currency} />
            </motion.div>
          )}

          {/* TAB 4: Asset Allocation Guide */}
          {activeTab === 'allocation' && (
            <motion.div
              key="tab-allocation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AssetAllocationGuide />
            </motion.div>
          )}

          {/* TAB 5: Compounding & What-If Simulator */}
          {activeTab === 'simulator' && (
            <motion.div
              key="tab-simulator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <WhatIfSimulator inputs={inputs} currency={currency} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Printable Financial Plan Dossier Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        result={result}
        inputs={inputs}
        currency={currency}
      />

      {/* Footer with Made by Sushil signature */}
      <Footer />

    </div>
  );
}
