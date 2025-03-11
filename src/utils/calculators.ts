// 상환 계획 항목 타입
export interface PaymentScheduleItem {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

/**
 * 원리금균등상환 방식의 상환 계획을 계산합니다.
 * @param principal 대출 원금
 * @param annualRate 연이율 (%)
 * @param termYears 대출 기간 (년)
 * @param paymentsPerYear 연간 납입 횟수
 * @returns 상환 계획 배열
 */
export const calculateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  termYears: number,
  paymentsPerYear: number
): PaymentScheduleItem[] => {
  const schedule: PaymentScheduleItem[] = [];

  // 이율이 0이면 단순 분할 상환
  if (annualRate === 0) {
    const totalPayments = termYears * paymentsPerYear;
    const payment = principal / totalPayments;

    let balance = principal;
    for (let period = 1; period <= totalPayments; period++) {
      const principalPayment = payment;
      balance -= principalPayment;

      // 마지막 납입 시 잔액 오차 보정
      const adjustedBalance = period === totalPayments ? 0 : balance;

      schedule.push({
        period,
        payment,
        principal: principalPayment,
        interest: 0,
        remainingBalance: adjustedBalance,
      });
    }

    return schedule;
  }

  // 일반적인 원리금균등상환 계산
  const totalPayments = termYears * paymentsPerYear;
  const periodicRate = annualRate / 100 / paymentsPerYear;

  // 월 상환금 계산 (원리금균등상환 방식)
  const payment =
    (principal * (periodicRate * Math.pow(1 + periodicRate, totalPayments))) /
    (Math.pow(1 + periodicRate, totalPayments) - 1);

  let balance = principal;

  for (let period = 1; period <= totalPayments; period++) {
    // 이자 계산
    const interestPayment = balance * periodicRate;
    // 원금 계산
    const principalPayment = payment - interestPayment;
    // 잔액 계산
    balance -= principalPayment;

    // 마지막 납입 시 잔액 오차 보정
    const adjustedBalance = period === totalPayments ? 0 : balance;

    schedule.push({
      period,
      payment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: adjustedBalance,
    });
  }

  return schedule;
};

/**
 * 상환 계획에서 요약 정보를 계산합니다.
 * @param schedule 상환 계획 배열
 * @param loanAmount 대출 원금
 * @returns 월 상환금, 총 상환액, 총 이자
 */
export const calculatePaymentSummary = (
  schedule: PaymentScheduleItem[],
  loanAmount: number
) => {
  if (schedule.length === 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
  }

  // 월 상환금
  const monthlyPayment = Math.round(schedule[0].payment);

  // 총 상환액
  const totalPayment = Math.round(
    schedule.reduce((sum, item) => sum + item.payment, 0)
  );

  // 총 이자
  const totalInterest = Math.round(totalPayment - loanAmount);

  return { monthlyPayment, totalPayment, totalInterest };
};
