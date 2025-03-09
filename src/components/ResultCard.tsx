import React from 'react';
import styles from '../app/page.module.css';
import { formatKoreanNumber } from '../utils/formatters';

interface ResultCardProps {
  title: string;
  result: number;
  initialInvestment: number;
  totalContribution: number;
  totalProfit: number;
  realValueResult?: number | null;
  inflationLoss?: number;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  result,
  initialInvestment,
  totalContribution,
  totalProfit,
  realValueResult,
  inflationLoss,
}) => {
  return (
    <div className={styles.resultCard}>
      <h2>{title}</h2>
      <div className={styles.resultValue}>{result.toLocaleString()} 원</div>
      <div className={styles.koreanResultAmount}>
        {formatKoreanNumber(result)}
      </div>

      <div className={styles.resultSummary}>
        <div className={styles.summaryItem}>
          <div className={styles.summaryValue}>
            {initialInvestment.toLocaleString()} 원
          </div>
          <div className={styles.summaryLabel}>초기 투자금</div>
          <div className={styles.koreanDetailAmount}>
            {formatKoreanNumber(initialInvestment)}
          </div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryValue}>
            {totalContribution.toLocaleString()} 원
          </div>
          <div className={styles.summaryLabel}>총 적립금</div>
          <div className={styles.koreanDetailAmount}>
            {formatKoreanNumber(totalContribution)}
          </div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryValue}>
            {totalProfit.toLocaleString()} 원
          </div>
          <div className={styles.summaryLabel}>총 투자 수익</div>
          <div className={styles.koreanDetailAmount}>
            {formatKoreanNumber(totalProfit)}
          </div>
        </div>
      </div>

      {realValueResult !== undefined && inflationLoss !== undefined && (
        <>
          <div className={styles.resultDivider}></div>

          <div className={styles.inflationSection}>
            <div className={styles.inflationTitle}>인플레이션 고려 시</div>
            <div className={styles.inflationDetails}>
              <div className={styles.inflationItem}>
                <div className={styles.inflationLabel}>실질 가치:</div>
                <div className={styles.inflationValue}>
                  {realValueResult?.toLocaleString()} 원
                  <div className={styles.koreanDetailAmount}>
                    {realValueResult ? formatKoreanNumber(realValueResult) : ''}
                  </div>
                </div>
              </div>
              <div className={styles.inflationItem}>
                <div className={styles.inflationLabel}>구매력 감소:</div>
                <div className={styles.inflationValue}>
                  {inflationLoss.toLocaleString()} 원
                  <span className={styles.percentageValue}>
                    ({((inflationLoss / result) * 100).toFixed(1)}%)
                  </span>
                  <div className={styles.koreanDetailAmount}>
                    {formatKoreanNumber(inflationLoss)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResultCard;
