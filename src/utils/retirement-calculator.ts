/**
 * 은퇴 자금 계산 결과 타입
 */
export interface RetirementCalculationResult {
  requiredSavings: number;
  requiredMonthlySavings: number;
  realValueRetirementFund: number;
  inflationLoss: number;
  inflatedMonthlyExpenses: number;
}

/**
 * 은퇴 자금 계산에 필요한 입력값 타입
 */
export interface RetirementCalculationInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyExpenses: number;
  annualReturn: number;
  inflation: number;
}

/**
 * 은퇴 자금 계산
 * @param input 계산에 필요한 입력값
 * @returns 계산 결과
 */
export const calculateRetirementFunds = (
  input: RetirementCalculationInput
): RetirementCalculationResult => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyExpenses,
    annualReturn,
    inflation,
  } = input;

  // 은퇴까지 남은 기간 (년)
  const yearsToRetirement = retirementAge - currentAge;

  // 은퇴 후 생존 기간 (년)
  const retirementYears = lifeExpectancy - retirementAge;

  // 은퇴 시점의 월 생활비 (물가상승률 반영)
  const inflatedMonthlyExpenses =
    monthlyExpenses * Math.pow(1 + inflation / 100, yearsToRetirement);

  // 은퇴 기간 동안 필요한 총 자금 (실질 수익률 고려)
  const realReturn = (annualReturn - inflation) / 100;

  let totalNeeded;
  if (realReturn === 0) {
    // 실질 수익률이 0인 경우
    totalNeeded = inflatedMonthlyExpenses * 12 * retirementYears;
  } else {
    // 실질 수익률이 0이 아닌 경우
    totalNeeded =
      (inflatedMonthlyExpenses *
        12 *
        (1 - Math.pow(1 + realReturn, -retirementYears))) /
      realReturn;
  }

  // 현재 저축액의 은퇴 시점 가치
  const futureSavingsValue =
    currentSavings * Math.pow(1 + annualReturn / 100, yearsToRetirement);

  // 추가로 필요한 저축액
  const additionalSavingsNeeded = Math.max(0, totalNeeded - futureSavingsValue);

  // 은퇴까지 매월 저축해야 할 금액
  let monthlySavingsNeeded;
  if (annualReturn === 0) {
    // 수익률이 0인 경우
    monthlySavingsNeeded = additionalSavingsNeeded / (yearsToRetirement * 12);
  } else {
    // 수익률이 0이 아닌 경우
    const monthlyRate = annualReturn / 100 / 12;
    monthlySavingsNeeded =
      additionalSavingsNeeded *
      (monthlyRate / (Math.pow(1 + monthlyRate, yearsToRetirement * 12) - 1));
  }

  // 인플레이션을 고려한 실질 가치
  const realValueRetirementFund =
    totalNeeded / Math.pow(1 + inflation / 100, yearsToRetirement);

  // 인플레이션으로 인한 구매력 감소
  const inflationLoss = totalNeeded - realValueRetirementFund;

  return {
    requiredSavings: Math.round(totalNeeded),
    requiredMonthlySavings: Math.round(monthlySavingsNeeded),
    realValueRetirementFund: Math.round(realValueRetirementFund),
    inflationLoss: Math.round(inflationLoss),
    inflatedMonthlyExpenses: Math.round(inflatedMonthlyExpenses),
  };
};
