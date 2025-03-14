/**
 * 예산 계획 계산에 필요한 유틸리티 함수들을 제공합니다.
 */

/**
 * 수입 항목 타입
 */
export interface IncomeItem {
  id: string;
  name: string;
  amount: number;
}

/**
 * 지출 항목 타입
 */
export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

/**
 * 예산 계획 계산 결과 타입
 */
export interface BudgetCalculationResult {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  expensesByCategory: Record<string, number>;
  categoryPercentages: Record<string, number>;
}

/**
 * 예산 계획 계산
 * @param incomeItems 수입 항목 배열
 * @param expenseItems 지출 항목 배열
 * @returns 예산 계획 계산 결과
 */
export const calculateBudget = (
  incomeItems: IncomeItem[],
  expenseItems: ExpenseItem[]
): BudgetCalculationResult => {
  // 총 수입 계산
  const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0);

  // 총 지출 계산
  const totalExpenses = expenseItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // 잔액 계산 (수입 - 지출)
  const balance = totalIncome - totalExpenses;

  // 저축률 계산 (잔액 / 수입 * 100)
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  // 카테고리별 지출 계산
  const expensesByCategory = expenseItems.reduce((categories, item) => {
    const category = item.category;
    if (!categories[category]) {
      categories[category] = 0;
    }
    categories[category] += item.amount;
    return categories;
  }, {} as Record<string, number>);

  // 카테고리별 지출 비율 계산
  const categoryPercentages = Object.entries(expensesByCategory).reduce(
    (percentages, [category, amount]) => {
      percentages[category] =
        totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
      return percentages;
    },
    {} as Record<string, number>
  );

  return {
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    expensesByCategory,
    categoryPercentages,
  };
};
