import React from 'react';
import { Line } from 'react-chartjs-2';
import styles from '../page.module.css';

interface InvestmentChartProps {
  currentAveragePrice: number;
  currentTotalInvestment: number;
  newAveragePrice: number;
  newTotalInvestment: number;
}

export function InvestmentChart({
  currentAveragePrice,
  currentTotalInvestment,
  newAveragePrice,
  newTotalInvestment,
}: InvestmentChartProps) {
  const chartData = {
    labels: ['현재', '추가 매수 후'],
    datasets: [
      {
        label: '평균 매수가',
        data: [currentAveragePrice, newAveragePrice],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: '총 투자금액',
        data: [currentTotalInvestment, newTotalInvestment],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '평균 매수가 및 총 투자금액 변화',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (this: any, tickValue: string | number) {
            return Number(tickValue).toLocaleString() + '원';
          },
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}
