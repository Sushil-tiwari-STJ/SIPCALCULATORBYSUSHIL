import React from 'react';
import { CurrencyCode, SipInputs, SipResult } from '../types';
import { formatCurrency, getIndianNumberWords } from '../utils/financialCalculations';
import { X, Printer, Download, Sparkles, Award, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SipResult;
  inputs: SipInputs;
  currency: CurrencyCode;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  result,
  inputs,
  currency,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-white">Financial Plan Dossier</h3>
              <p className="text-xs text-slate-400">Official Wealth Projection Report • Made by Sushil</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="space-y-6 print:text-black">
          
          {/* Header Banner in Report */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Financial Blueprint
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">
                SIP & Wealth Accumulation Plan
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Authored & Formatted by <strong className="text-emerald-400">Sushil</strong> • WealthCraft Suite
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Projected Corpus</span>
              <div className="font-display font-black text-2xl text-emerald-400">
                {formatCurrency(result.futureValue, currency)}
              </div>
              {currency === 'INR' && (
                <div className="text-[11px] text-slate-300">
                  ≈ {getIndianNumberWords(result.futureValue)}
                </div>
              )}
            </div>
          </div>

          {/* Key Parameters Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Investment Mode:</span>
              <div className="font-bold text-white uppercase mt-0.5">{inputs.investmentType}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Monthly Contribution:</span>
              <div className="font-bold text-emerald-400 mt-0.5 font-display">
                {formatCurrency(inputs.monthlyInvestment, currency)}/mo
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Target Horizon:</span>
              <div className="font-bold text-white mt-0.5">{inputs.timePeriodYears} Years</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Expected CAGR:</span>
              <div className="font-bold text-emerald-400 mt-0.5 font-display">{inputs.expectedReturnRate}% p.a.</div>
            </div>
          </div>

          {/* Mathematical Results Summary */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Maturity Analysis & Returns Breakdown
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                <span className="text-slate-400">Total Capital Out-of-Pocket Invested:</span>
                <span className="font-bold text-blue-400 font-display">{formatCurrency(result.totalInvested, currency)}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                <span className="text-slate-400">Estimated Compounded Gain:</span>
                <span className="font-bold text-emerald-400 font-display">{formatCurrency(result.estimatedReturns, currency)}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-900 font-bold text-white">
                <span>Gross Expected Maturity Value:</span>
                <span className="text-emerald-300 font-display text-sm">{formatCurrency(result.futureValue, currency)}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-900 text-amber-400">
                <span>Real Purchasing Power (Inflation {inputs.inflationRate}%):</span>
                <span className="font-bold font-display">{formatCurrency(result.inflationAdjustedValue, currency)}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 text-purple-400">
                <span>Estimated Post-Tax Net Value (LTCG {inputs.taxRate}%):</span>
                <span className="font-bold font-display">{formatCurrency(result.postTaxValue, currency)}</span>
              </div>
            </div>
          </div>

          {/* Sushil's Strategic Guidelines */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Award className="w-4 h-4" />
              <span>Sushil's Wealth Principles for Maximum Compounding</span>
            </div>
            <ul className="space-y-1 text-slate-400 list-disc pl-4">
              <li><strong>Never Stop in Market Corrections:</strong> Rupee cost averaging buys more units at cheaper NAV during market dips.</li>
              <li><strong>Activate 10% Step-Up Annually:</strong> Increasing your monthly SIP with each annual salary increment can more than double your wealth over 15 years.</li>
              <li><strong>Emergency Buffer First:</strong> Maintain 6 months of living expenses in liquid debt funds before aggressive equity SIPs.</li>
            </ul>
          </div>

          {/* Footer in Report */}
          <div className="text-center pt-4 border-t border-slate-800 text-xs text-slate-500">
            <p>Generated by WealthCraft SIP & Financial Planning Suite • <strong>Made by Sushil</strong></p>
            <p className="text-[10px] text-slate-600 mt-1">Investments are subject to market risks. Please read all scheme-related documents carefully.</p>
          </div>

        </div>

      </div>
    </div>
  );
};
