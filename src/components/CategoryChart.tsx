import React from 'react';
import styles from '../app/page.module.css';

interface CategoryChartProps {
  expensesByCategory: Record<string, number>;
  categoryPercentages: Record<string, number>;
  totalExpenses: number;
}

// 카테고리별 색상 정의 - 더 세련된 색상으로 업데이트
const categoryColors: Record<string, string> = {
  주거: '#4361EE', // 깊은 파란색
  식비: '#F72585', // 선명한 핑크
  교통: '#7209B7', // 보라색
  통신: '#4CC9F0', // 밝은 하늘색
  의료: '#F94144', // 빨간색
  교육: '#90BE6D', // 녹색
  여가: '#F9C74F', // 노란색
  의류: '#43AA8B', // 청록색
  기타: '#577590', // 회청색
};

// 기본 카테고리 색상
const defaultColor = '#9CA3AF';

const CategoryChart: React.FC<CategoryChartProps> = ({
  expensesByCategory,
  categoryPercentages,
  totalExpenses,
}) => {
  // 카테고리 항목을 비율 내림차순으로 정렬
  const sortedCategories = Object.entries(expensesByCategory).sort(
    ([, amountA], [, amountB]) => amountB - amountA
  );

  return (
    <div className={styles.categoryChart}>
      <h3 className={styles.chartTitle}>카테고리별 지출</h3>

      <div className={styles.chartContainer}>
        <div className={styles.barChart}>
          {sortedCategories.map(([category, amount]) => (
            <div key={category} className={styles.chartItem}>
              <div className={styles.categoryLabel}>
                <span
                  className={styles.colorIndicator}
                  style={{
                    backgroundColor: categoryColors[category] || defaultColor,
                  }}></span>
                <span className={styles.categoryName}>{category}</span>
                <span className={styles.categoryAmount}>
                  {amount.toLocaleString()}원 (
                  {categoryPercentages[category].toFixed(1)}%)
                </span>
              </div>
              <div className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{
                    width: `${categoryPercentages[category]}%`,
                    backgroundColor: categoryColors[category] || defaultColor,
                    boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
                  }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chartLegend}>
        <div className={styles.legendItems}>
          {sortedCategories.map(([category]) => (
            <div key={category} className={styles.legendItem}>
              <span
                className={styles.legendColor}
                style={{
                  backgroundColor: categoryColors[category] || defaultColor,
                }}></span>
              <span className={styles.legendLabel}>{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
