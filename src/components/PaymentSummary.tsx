import React from 'react';
import styles from '../app/page.module.css';

interface PaymentSummaryProps {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  paymentFrequency: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  monthlyPayment,
  totalPayment,
  totalInterest,
  paymentFrequency,
}) => {
  // 납입 주기에 따른 레이블 결정
  const getPaymentLabel = () => {
    switch (paymentFrequency) {
      case 12:
        return '월';
      case 4:
        return '분기';
      case 2:
        return '반기';
      case 1:
        return '연';
      default:
        return '월';
    }
  };

  return (
    <div className={styles.resultSummary}>
      <div className={styles.summaryItem}>
        <div className={styles.summaryValue}>
          {monthlyPayment.toLocaleString()} 원
        </div>
        <div className={styles.summaryLabel}>{getPaymentLabel()} 상환금</div>
      </div>
      <div className={styles.summaryItem}>
        <div className={styles.summaryValue}>
          {totalPayment.toLocaleString()} 원
        </div>
        <div className={styles.summaryLabel}>총 상환액</div>
      </div>
      <div className={styles.summaryItem}>
        <div className={styles.summaryValue}>
          {totalInterest.toLocaleString()} 원
        </div>
        <div className={styles.summaryLabel}>총 이자</div>
      </div>
    </div>
  );
};

export default PaymentSummary;
