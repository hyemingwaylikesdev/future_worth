import React from 'react';
import styles from '../app/page.module.css';

interface RetirementSummaryProps {
  yearsToRetirement: number;
  retirementYears: number;
  inflatedMonthlyExpenses: number;
}

const RetirementSummary: React.FC<RetirementSummaryProps> = ({
  yearsToRetirement,
  retirementYears,
  inflatedMonthlyExpenses,
}) => {
  return (
    <div className={styles.retirementSummary}>
      <div className={styles.summaryRow}>
        <div className={styles.summaryLabel}>은퇴까지 남은 기간:</div>
        <div className={styles.summaryValue}>{yearsToRetirement}년</div>
      </div>
      <div className={styles.summaryRow}>
        <div className={styles.summaryLabel}>은퇴 후 예상 생존 기간:</div>
        <div className={styles.summaryValue}>{retirementYears}년</div>
      </div>
      <div className={styles.summaryRow}>
        <div className={styles.summaryLabel}>은퇴 시점 월 생활비:</div>
        <div className={styles.summaryValue}>
          {inflatedMonthlyExpenses.toLocaleString()} 원
        </div>
      </div>
    </div>
  );
};

export default RetirementSummary;
