export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  formatIndian: boolean;
  rateAgainstINR: number;
}

export type InvestmentType = 'sip' | 'lumpsum' | 'stepup';

export interface SipInputs {
  investmentType: InvestmentType;
  monthlyInvestment: number;
  lumpsumAmount: number;
  expectedReturnRate: number; // in percentage e.g. 12
  timePeriodYears: number;
  stepUpType: 'percentage' | 'amount';
  stepUpValue: number; // e.g. 10% or 1000/year
  enableInflation: boolean;
  inflationRate: number; // e.g. 6%
  enableTax: boolean;
  taxRate: number; // e.g. 12.5% for LTCG
  taxExemptionAmount: number; // e.g. 125000 in INR
}

export interface YearlyBreakdown {
  year: number;
  monthlyDeposit: number;
  yearlyDeposit: number;
  totalInvested: number;
  interestEarnedYear: number;
  totalInterestEarned: number;
  futureValue: number;
  inflationAdjustedValue: number;
  postTaxValue: number;
}

export interface SipResult {
  totalInvested: number;
  estimatedReturns: number;
  futureValue: number;
  inflationAdjustedValue: number;
  postTaxValue: number;
  taxAmount: number;
  yearlyBreakdown: YearlyBreakdown[];
  wealthGainMultiplier: number;
  regularSipComparisonValue?: number; // for step up comparison
}

export type GoalCategory = 
  | 'retirement'
  | 'house'
  | 'child_education'
  | 'car'
  | 'marriage'
  | 'emergency'
  | 'fire'
  | 'custom';

export interface FinancialGoal {
  id: string;
  name: string;
  category: GoalCategory;
  targetAmount: number;
  targetYearHorizon: number; // in years
  expectedReturn: number;
  currentSavings: number;
  inflationAdjusted: boolean;
  inflationRate: number;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export interface GoalCalculationResult {
  goal: FinancialGoal;
  adjustedTargetAmount: number;
  requiredMonthlySip: number;
  requiredStepUpSip: number; // assuming 10% annual stepup
  futureValueOfCurrentSavings: number;
  netTargetRemaining: number;
  feasibilityScore: number; // 0 - 100
  recommendations: string[];
}

export type RiskProfile = 'conservative' | 'moderate' | 'balanced' | 'growth' | 'aggressive';

export interface RiskProfileRecommendation {
  profile: RiskProfile;
  title: string;
  description: string;
  expectedReturnsRange: string;
  allocation: {
    largeCapEquity: number;
    midSmallCapEquity: number;
    debtFixedIncome: number;
    goldCommodities: number;
    internationalEquity: number;
  };
}
