import React, { useState } from 'react';
import { CurrencyCode, SipInputs, SipResult } from '../types';
import { formatCurrency } from '../utils/financialCalculations';
import { Table, Download, Search, ChevronRight, FileSpreadsheet } from 'lucide-react';

interface YearlyScheduleTableProps {
  result: SipResult;
  inputs: SipInputs;
  currency: CurrencyCode;
}

export const YearlyScheduleTable: React.FC<YearlyScheduleTableProps> = ({
  result,
  inputs,
  currency,
}) => {
  const [filterQuery, setFilterQuery] = useState<string>('');

  const filteredRows = result.yearlyBreakdown.filter((item) => {
    if (!filterQuery) return true;
    return item.year.toString().includes(filterQuery);
  });

  const handleDownloadCsv = () => {
    const headers = [
      'Year',
      'Monthly Deposit',
      'Yearly Deposit',
      'Total Invested Capital',
      'Interest Earned That Year',
      'Total Compounded Wealth Gain',
      'Closing Future Value (Corpus)',
      'Inflation-Adjusted Value',
      'Post-Tax Value',
    ];

    const csvRows = [
      headers.join(','),
      ...result.yearlyBreakdown.map((row) =>
        [
          row.year,
          row.monthlyDeposit,
          row.yearlyDeposit,
          row.totalInvested,
          Math.round(row.interestEarnedYear),
          Math.round(row.totalInterestEarned),
          Math.round(row.futureValue),
          Math.round(row.inflationAdjustedValue),
          Math.round(row.postTaxValue),
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sushil_SIP_Financial_Schedule_${inputs.timePeriodYears}Yrs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div>
          <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-400" />
            <span>Year-by-Year Amortization & Compounding Schedule</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full annual breakdown of monthly deposits, capital invested, interest earned, and closing corpus.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-36">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search year..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Monthly SIP</th>
              <th className="px-4 py-3">Total Invested</th>
              <th className="px-4 py-3 text-right">Interest (Year)</th>
              <th className="px-4 py-3 text-right">Total Gain</th>
              <th className="px-4 py-3 text-right text-emerald-400">Closing Balance</th>
              {inputs.enableInflation && (
                <th className="px-4 py-3 text-right text-amber-400">Real Value</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {filteredRows.map((row) => (
              <tr key={row.year} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-2.5 font-bold text-slate-200">Year {row.year}</td>
                <td className="px-4 py-2.5 text-slate-300 font-display">
                  {formatCurrency(row.monthlyDeposit, currency)}
                </td>
                <td className="px-4 py-2.5 text-blue-400 font-display font-semibold">
                  {formatCurrency(row.totalInvested, currency)}
                </td>
                <td className="px-4 py-2.5 text-right text-slate-400 font-display">
                  +{formatCurrency(row.interestEarnedYear, currency)}
                </td>
                <td className="px-4 py-2.5 text-right text-emerald-400 font-display font-medium">
                  {formatCurrency(row.totalInterestEarned, currency)}
                </td>
                <td className="px-4 py-2.5 text-right font-display font-bold text-emerald-300 text-sm">
                  {formatCurrency(row.futureValue, currency)}
                </td>
                {inputs.enableInflation && (
                  <td className="px-4 py-2.5 text-right font-display font-medium text-amber-400">
                    {formatCurrency(row.inflationAdjustedValue, currency)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
