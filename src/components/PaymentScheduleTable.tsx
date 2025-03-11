import React, { useState } from 'react';
import styles from '../app/page.module.css';
import { PaymentScheduleItem } from '../utils/calculators';

interface PaymentScheduleTableProps {
  schedule: PaymentScheduleItem[];
  paymentFrequency: number;
}

const PaymentScheduleTable: React.FC<PaymentScheduleTableProps> = ({
  schedule,
  paymentFrequency,
}) => {
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);

  // 상환 계획 표시 토글
  const toggleScheduleDisplay = () => {
    setShowFullSchedule(!showFullSchedule);
  };

  return (
    <div className={styles.scheduleSection}>
      <h3 className={styles.scheduleTitle}>상환 계획</h3>

      <div className={styles.scheduleTable}>
        <div className={styles.scheduleHeader}>
          <div className={styles.scheduleHeaderCell}>회차</div>
          <div className={styles.scheduleHeaderCell}>상환금</div>
          <div className={styles.scheduleHeaderCell}>원금</div>
          <div className={styles.scheduleHeaderCell}>이자</div>
          <div className={styles.scheduleHeaderCell}>잔액</div>
        </div>

        {schedule
          .slice(0, showFullSchedule ? schedule.length : 12)
          .map((item) => (
            <div key={item.period} className={styles.scheduleRow}>
              <div className={styles.scheduleCell}>{item.period}</div>
              <div className={styles.scheduleCell}>
                {Math.round(item.payment).toLocaleString()}
              </div>
              <div className={styles.scheduleCell}>
                {Math.round(item.principal).toLocaleString()}
              </div>
              <div className={styles.scheduleCell}>
                {Math.round(item.interest).toLocaleString()}
              </div>
              <div className={styles.scheduleCell}>
                {Math.round(item.remainingBalance).toLocaleString()}
              </div>
            </div>
          ))}
      </div>

      {schedule.length > 12 && (
        <button
          className={styles.toggleButton}
          onClick={toggleScheduleDisplay}
          type='button'>
          {showFullSchedule ? '간략히 보기' : '전체 상환 계획 보기'}
        </button>
      )}
    </div>
  );
};

export default PaymentScheduleTable;
