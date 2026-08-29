import { 
  CurrencyCode, 
  CurrencyConfig, 
  FinancialGoal, 
  GoalCalculationResult, 
  SipInputs, 
  SipResult, 
  YearlyBreakdown 
} from '../types';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', formatIndian: true, rateAgainstINR: 1 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', formatIndian: false, rateAgainstINR: 0.0116 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', formatIndian: false, rateAgainstINR: 0.011 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', formatIndian: false, rateAgainstINR: 0.0094 },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', formatIndian: false, rateAgainstINR: 0.0425 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', formatIndian: false, rateAgainstINR: 0.0163 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', formatIndian: false, rateAgainstINR: 0.0182 },
};

/**
 * Format currency with Indian formatting (Lakhs/Crores) or Western formatting (Millions/Billions)
 */
export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = 'INR',
  compact: boolean = false
): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.INR;
  const symbol = config.symbol;
  const absAmount = Math.abs(amount);

  if (compact) {
    if (config.formatIndian) {
      if (absAmount >= 10000000) {
        return `${symbol}${(amount / 10000000).toFixed(2)} Cr`;
      }
      if (absAmount >= 100000) {
        return `${symbol}${(amount / 100000).toFixed(2)} L`;
      }
      if (absAmount >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)} K`;
      }
      return `${symbol}${Math.round(amount).toLocaleString('en-IN')}`;
    } else {
      if (absAmount >= 1000000000) {
        return `${symbol}${(amount / 1000000000).toFixed(2)}B`;
      }
      if (absAmount >= 1000000) {
        return `${symbol}${(amount / 1000000).toFixed(2)}M`;
      }
      if (absAmount >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)}K`;
      }
      return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
    }
  }

  if (config.formatIndian) {
    // Custom Indian formatting: ##,##,##,###
    const rounded = Math.round(amount);
    const isNegative = rounded < 0;
    const str = Math.abs(rounded).toString();
    
    let lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return `${isNegative ? '-' : ''}${symbol}${formatted}`;
  }

  return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Detailed Indian readout (e.g. "1 Crore 25 Lakh 40 Thousand")
 */
export function getIndianNumberWords(amount: number): string {
  if (!amount || amount < 1) return 'Zero';
  
  const rounded = Math.round(amount);
  const crores = Math.floor(rounded / 10000000);
  const lakhs = Math.floor((rounded % 10000000) / 100000);
  const thousands = Math.floor((rounded % 100000) / 1000);
  const remaining = rounded % 1000;

  const parts: string[] = [];
  if (crores > 0) parts.push(`${crores} Crore${crores > 1 ? 's' : ''}`);
  if (lakhs > 0) parts.push(`${lakhs} Lakh${lakhs > 1 ? 's' : ''}`);
  if (thousands > 0 && crores === 0) parts.push(`${thousands} Thousand`);
  if (parts.length === 0 && remaining > 0) parts.push(`${remaining}`);

  return parts.slice(0, 2).join(' ') || '0';
}

/**
 * Calculates SIP / Lumpsum / Step-Up Future Values and yearly breakdown
 */
export function calculateSip(inputs: SipInputs): SipResult {
  const {
    investmentType,
    monthlyInvestment,
    lumpsumAmount,
    expectedReturnRate,
    timePeriodYears,
    stepUpType,
    stepUpValue,
    enableInflation,
    inflationRate,
    enableTax,
    taxRate,
    taxExemptionAmount,
  } = inputs;

  const monthlyRate = expectedReturnRate / 100 / 12;
  const annualInflationRate = inflationRate / 100;
  const totalMonths = Math.max(1, Math.round(timePeriodYears * 12));
  const yearlyBreakdown: YearlyBreakdown[] = [];

  let accumulatedBalance = 0;
  let totalInvested = 0;
  let currentMonthlyDeposit = monthlyInvestment;

  if (investmentType === 'lumpsum') {
    accumulatedBalance = lumpsumAmount;
    totalInvested = lumpsumAmount;

    for (let yr = 1; yr <= timePeriodYears; yr++) {
      const yearStartBalance = accumulatedBalance;
      // Compound for 12 months
      for (let m = 1; m <= 12; m++) {
        accumulatedBalance = accumulatedBalance * (1 + monthlyRate);
      }
      const interestEarnedYear = accumulatedBalance - yearStartBalance;
      const totalInterestEarned = accumulatedBalance - totalInvested;
      const inflationFactor = Math.pow(1 + annualInflationRate, yr);
      const inflationAdjustedValue = enableInflation
        ? accumulatedBalance / inflationFactor
        : accumulatedBalance;

      // Tax calculation
      let postTax = accumulatedBalance;
      if (enableTax) {
        const totalGain = accumulatedBalance - totalInvested;
        const taxableGain = Math.max(0, totalGain - taxExemptionAmount);
        const tax = taxableGain * (taxRate / 100);
        postTax = totalInvested + Math.max(0, totalGain - tax);
      }

      yearlyBreakdown.push({
        year: yr,
        monthlyDeposit: 0,
        yearlyDeposit: 0,
        totalInvested,
        interestEarnedYear,
        totalInterestEarned,
        futureValue: accumulatedBalance,
        inflationAdjustedValue,
        postTaxValue: postTax,
      });
    }
  } else {
    // SIP or Step-Up SIP
    let regularSipBalanceComparison = 0; // for comparing regular vs step up

    for (let yr = 1; yr <= timePeriodYears; yr++) {
      let yearlyDeposit = 0;
      const yearStartBalance = accumulatedBalance;

      for (let m = 1; m <= 12; m++) {
        // Annuity due compounding: deposit at start of month
        accumulatedBalance = (accumulatedBalance + currentMonthlyDeposit) * (1 + monthlyRate);
        regularSipBalanceComparison = (regularSipBalanceComparison + monthlyInvestment) * (1 + monthlyRate);
        
        totalInvested += currentMonthlyDeposit;
        yearlyDeposit += currentMonthlyDeposit;
      }

      const interestEarnedYear = accumulatedBalance - yearStartBalance - yearlyDeposit;
      const totalInterestEarned = accumulatedBalance - totalInvested;
      const inflationFactor = Math.pow(1 + annualInflationRate, yr);
      const inflationAdjustedValue = enableInflation
        ? accumulatedBalance / inflationFactor
        : accumulatedBalance;

      // Tax calculation
      let postTax = accumulatedBalance;
      if (enableTax) {
        const totalGain = accumulatedBalance - totalInvested;
        const taxableGain = Math.max(0, totalGain - taxExemptionAmount);
        const tax = taxableGain * (taxRate / 100);
        postTax = totalInvested + Math.max(0, totalGain - tax);
      }

      yearlyBreakdown.push({
        year: yr,
        monthlyDeposit: currentMonthlyDeposit,
        yearlyDeposit,
        totalInvested,
        interestEarnedYear,
        totalInterestEarned,
        futureValue: accumulatedBalance,
        inflationAdjustedValue,
        postTaxValue: postTax,
      });

      // Increase monthly deposit for next year if step-up is active
      if (investmentType === 'stepup') {
        if (stepUpType === 'percentage') {
          currentMonthlyDeposit = currentMonthlyDeposit * (1 + stepUpValue / 100);
        } else {
          currentMonthlyDeposit = currentMonthlyDeposit + stepUpValue;
        }
      }
    }
  }

  const futureValue = accumulatedBalance;
  const estimatedReturns = Math.max(0, futureValue - totalInvested);
  const inflationFactor = Math.pow(1 + annualInflationRate, timePeriodYears);
  const inflationAdjustedValue = enableInflation
    ? futureValue / inflationFactor
    : futureValue;

  let taxAmount = 0;
  let postTaxValue = futureValue;
  if (enableTax) {
    const taxableGain = Math.max(0, estimatedReturns - taxExemptionAmount);
    taxAmount = taxableGain * (taxRate / 100);
    postTaxValue = futureValue - taxAmount;
  }

  const wealthGainMultiplier = totalInvested > 0 ? futureValue / totalInvested : 0;

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.round(estimatedReturns),
    futureValue: Math.round(futureValue),
    inflationAdjustedValue: Math.round(inflationAdjustedValue),
    postTaxValue: Math.round(postTaxValue),
    taxAmount: Math.round(taxAmount),
    yearlyBreakdown,
    wealthGainMultiplier: Number(wealthGainMultiplier.toFixed(2)),
  };
}

/**
 * Calculates Required Monthly SIP for a given Financial Goal (Reverse SIP)
 */
export function calculateGoalSip(goal: FinancialGoal): GoalCalculationResult {
  const {
    targetAmount,
    targetYearHorizon,
    expectedReturn,
    currentSavings,
    inflationAdjusted,
    inflationRate,
  } = goal;

  const annualReturnRate = expectedReturn / 100;
  const monthlyRate = annualReturnRate / 12;
  const totalMonths = Math.max(1, Math.round(targetYearHorizon * 12));

  // 1. Inflation adjust target if enabled
  let adjustedTargetAmount = targetAmount;
  if (inflationAdjusted && inflationRate > 0) {
    adjustedTargetAmount = targetAmount * Math.pow(1 + inflationRate / 100, targetYearHorizon);
  }

  // 2. Future value of current existing savings
  const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + annualReturnRate, targetYearHorizon);

  // 3. Remaining net target needed
  const netTargetRemaining = Math.max(0, adjustedTargetAmount - futureValueOfCurrentSavings);

  // 4. Required Regular Monthly SIP (annuity due)
  // FV = P * [ ((1+r)^n - 1) / r ] * (1+r)
  // P = FV / ( [ ((1+r)^n - 1) / r ] * (1+r) )
  const compoundingFactor = ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const requiredMonthlySip = compoundingFactor > 0 ? netTargetRemaining / compoundingFactor : 0;

  // 5. Required Initial Monthly SIP if Step-Up 10% is used
  // We can solve iterative initial SIP for 10% annual increase
  let requiredStepUpSip = requiredMonthlySip * 0.65; // approximation initial starting point
  let testBalance = 0;
  let testMonthly = requiredStepUpSip;
  for (let yr = 1; yr <= targetYearHorizon; yr++) {
    for (let m = 1; m <= 12; m++) {
      testBalance = (testBalance + testMonthly) * (1 + monthlyRate);
    }
    testMonthly = testMonthly * 1.10;
  }
  if (testBalance > 0) {
    requiredStepUpSip = Math.round((netTargetRemaining / testBalance) * requiredStepUpSip);
  }

  // Recommendations and Feasibility
  const recommendations: string[] = [];
  let feasibilityScore = 85;

  if (targetYearHorizon < 3 && expectedReturn > 10) {
    recommendations.push('For a short horizon under 3 years, avoid high equity volatility and target safe debt/liquid funds (6-8%).');
    feasibilityScore -= 20;
  }

  if (requiredMonthlySip > 100000) {
    recommendations.push('The required SIP is high. Consider using an annual 10-15% Step-Up SIP to start with lower initial commitment.');
  }

  if (inflationAdjusted) {
    recommendations.push(`Due to ${inflationRate}% inflation, your ₹${(targetAmount / 100000).toFixed(1)}L goal will actually require ₹${(adjustedTargetAmount / 100000).toFixed(1)}L at year ${targetYearHorizon}.`);
  }

  if (currentSavings > 0) {
    recommendations.push(`Your existing ₹${(currentSavings / 100000).toFixed(1)}L savings will grow to ₹${(futureValueOfCurrentSavings / 100000).toFixed(1)}L, significantly reducing your monthly SIP requirement.`);
  }

  recommendations.push(`Rule of Compounding: Starting now instead of delaying by 2 years can save you up to 35% in total invested capital.`);

  return {
    goal,
    adjustedTargetAmount: Math.round(adjustedTargetAmount),
    requiredMonthlySip: Math.round(requiredMonthlySip),
    requiredStepUpSip: Math.round(requiredStepUpSip),
    futureValueOfCurrentSavings: Math.round(futureValueOfCurrentSavings),
    netTargetRemaining: Math.round(netTargetRemaining),
    feasibilityScore: Math.min(100, Math.max(20, feasibilityScore)),
    recommendations,
  };
}

/**
 * Calculates FIRE (Financial Independence, Retire Early) numbers
 */
export function calculateFireTarget(
  annualExpenses: number,
  withdrawalRatePercent: number = 4, // 4% Rule (25x expenses)
  inflationRatePercent: number = 6,
  yearsToRetirement: number = 15,
  currentPortfolio: number = 0,
  expectedReturnRate: number = 12
) {
  // Inflation adjusted annual expenses at retirement
  const futureAnnualExpenses = annualExpenses * Math.pow(1 + inflationRatePercent / 100, yearsToRetirement);
  
  // Total FIRE Corpus needed = Future Annual Expenses / (Withdrawal Rate / 100)
  const fireCorpusNeeded = futureAnnualExpenses / (withdrawalRatePercent / 100);
  
  // Future value of current portfolio
  const futurePortfolio = currentPortfolio * Math.pow(1 + expectedReturnRate / 100, yearsToRetirement);
  
  // Net corpus needed from fresh SIP
  const netCorpusNeeded = Math.max(0, fireCorpusNeeded - futurePortfolio);
  
  // Required monthly SIP
  const monthlyRate = expectedReturnRate / 100 / 12;
  const totalMonths = yearsToRetirement * 12;
  const factor = ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const requiredMonthlySip = factor > 0 ? netCorpusNeeded / factor : 0;
  
  // Safe Monthly Pension (4% annual withdrawal / 12)
  const monthlyPensionInRetirement = futureAnnualExpenses / 12;

  return {
    futureAnnualExpenses: Math.round(futureAnnualExpenses),
    fireCorpusNeeded: Math.round(fireCorpusNeeded),
    futurePortfolio: Math.round(futurePortfolio),
    netCorpusNeeded: Math.round(netCorpusNeeded),
    requiredMonthlySip: Math.round(requiredMonthlySip),
    monthlyPensionInRetirement: Math.round(monthlyPensionInRetirement),
    multiplier: Math.round(100 / withdrawalRatePercent),
  };
}

/**
 * Cost of Delay Calculator ("What if I delay investing by X years?")
 */
export function calculateCostOfDelay(
  monthlySip: number,
  expectedReturn: number,
  totalYears: number,
  delayYears: number = 3
) {
  const onTimeResult = calculateSip({
    investmentType: 'sip',
    monthlyInvestment: monthlySip,
    lumpsumAmount: 0,
    expectedReturnRate: expectedReturn,
    timePeriodYears: totalYears,
    stepUpType: 'percentage',
    stepUpValue: 0,
    enableInflation: false,
    inflationRate: 6,
    enableTax: false,
    taxRate: 12.5,
    taxExemptionAmount: 125000,
  });

  const delayedYears = Math.max(1, totalYears - delayYears);
  const delayedResult = calculateSip({
    investmentType: 'sip',
    monthlyInvestment: monthlySip,
    lumpsumAmount: 0,
    expectedReturnRate: expectedReturn,
    timePeriodYears: delayedYears,
    stepUpType: 'percentage',
    stepUpValue: 0,
    enableInflation: false,
    inflationRate: 6,
    enableTax: false,
    taxRate: 12.5,
    taxExemptionAmount: 125000,
  });

  const wealthLost = onTimeResult.futureValue - delayedResult.futureValue;
  const extraMonthlySipRequired = delayedResult.futureValue > 0
    ? (onTimeResult.futureValue / delayedResult.futureValue) * monthlySip - monthlySip
    : 0;

  return {
    onTimeCorpus: onTimeResult.futureValue,
    delayedCorpus: delayedResult.futureValue,
    wealthLost,
    delayedYears,
    extraMonthlySipRequired: Math.round(extraMonthlySipRequired),
    percentageLost: onTimeResult.futureValue > 0 ? Math.round((wealthLost / onTimeResult.futureValue) * 100) : 0,
  };
}
