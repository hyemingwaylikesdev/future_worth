import React from 'react';
import styles from '../app/page.module.css';
import { BudgetCalculationResult } from '../utils/budget-calculator';

interface BudgetSummaryProps {
  result: BudgetCalculationResult;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ result }) => {
  const { totalIncome, totalExpenses, balance, savingsRate } = result;

  return (
    <div className={styles.budgetSummary}>
      <div className={styles.summaryRow}>
        <div className={styles.summaryLabel}>총 수입:</div>
        <div className={styles.summaryValue}>
          {totalIncome.toLocaleString()} 원
        </div>
      </div>
      <div className={styles.summaryRow}>
        <div className={styles.summaryLabel}>총 지출:</div>
        <div className={styles.summaryValue}>
          {totalExpenses.toLocaleString()} 원
        </div>
      </div>
      <div className={styles.summaryRow}>
        <div className={styles.summaryLabel}>잔액:</div>
        <div
          className={`${styles.summaryValue} ${
            balance < 0 ? styles.negative : ''
          }`}>
          {balance.toLocaleString()} 원
        </div>
      </div>
      <div className={styles.summaryRow}>
        <div className={styles.summaryLabel}>저축률:</div>
        <div
          className={`${styles.summaryValue} ${
            savingsRate < 0 ? styles.negative : ''
          }`}>
          {savingsRate.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;
