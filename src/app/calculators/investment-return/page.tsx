'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './page.module.css';
import Header from '../../../../src/components/Header';
import Head from 'next/head';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type FormInputs = {
  currentAvgPrice: string;
  currentQuantity: string;
  currentPrice: string;
  targetPrice: string;
};

type CalculationResult = {
  requiredQuantity: number;
  totalInvestment: number;
  newAveragePrice: number;
  priceReduction: number;
};

export default function InvestmentReturnCalculator() {
  const [formData, setFormData] = useState<FormInputs>({
    currentAvgPrice: '',
    currentQuantity: '',
    currentPrice: '',
    targetPrice: '',
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCurrentAvgPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, currentAvgPrice: value }));
  };

  const handleCurrentQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, currentQuantity: value }));
  };

  const handleCurrentPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, currentPrice: value }));
  };

  const handleTargetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, targetPrice: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentAvgPrice = Number(formData.currentAvgPrice);
    const currentQuantity = Number(formData.currentQuantity);
    const currentPrice = Number(formData.currentPrice);
    const targetPrice = Number(formData.targetPrice);

    if (
      isNaN(currentAvgPrice) ||
      isNaN(currentQuantity) ||
      isNaN(currentPrice) ||
      isNaN(targetPrice)
    ) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const requiredQuantity =
      (currentAvgPrice * currentQuantity - targetPrice * currentQuantity) /
      (targetPrice - currentPrice);

    const totalInvestment = requiredQuantity * currentPrice;
    const newAveragePrice =
      (currentAvgPrice * currentQuantity + totalInvestment) /
      (currentQuantity + requiredQuantity);
    const priceReduction =
      ((currentAvgPrice - newAveragePrice) / currentAvgPrice) * 100;

    setResult({
      requiredQuantity,
      totalInvestment,
      newAveragePrice,
      priceReduction,
    });
  };

  return (
    <>
      <Head>
        <title>주식 물타기 계산기 | Future Worth</title>
        <meta
          name='description'
          content='주식 물타기를 통한 평균 매수가 변화와 필요한 투자금액을 계산해보세요. 현재 평균 매수가, 보유 수량, 현재 주가를 입력하여 목표 평균 매수가까지 도달하기 위한 추가 매수 수량을 계산합니다.'
        />
        <meta
          name='keywords'
          content='주식 물타기, 평균 매수가 계산, 주식 투자 계산기, 주식 매수 계산기'
        />
        <meta property='og:title' content='주식 물타기 계산기 | Future Worth' />
        <meta
          property='og:description'
          content='주식 물타기를 통한 평균 매수가 변화와 필요한 투자금액을 계산해보세요.'
        />
        <meta property='og:type' content='website' />
      </Head>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>주식 물타기 계산기</h1>
              <p className={styles.subtitle}>
                추가 매수를 통한 평균 매수가 변화를 계산합니다
              </p>
            </div>

            <div className={styles.calculatorCard}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor='currentAvgPrice'>현재 평균 매수가</label>
                  <input
                    type='text'
                    id='currentAvgPrice'
                    value={formData.currentAvgPrice}
                    onChange={handleCurrentAvgPriceChange}
                    placeholder='예: 100000'
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor='currentQuantity'>현재 보유 수량</label>
                  <input
                    type='text'
                    id='currentQuantity'
                    value={formData.currentQuantity}
                    onChange={handleCurrentQuantityChange}
                    placeholder='예: 100'
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor='currentPrice'>현재 주가</label>
                  <input
                    type='text'
                    id='currentPrice'
                    value={formData.currentPrice}
                    onChange={handleCurrentPriceChange}
                    placeholder='예: 80000'
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor='targetPrice'>목표 평균 매수가</label>
                  <input
                    type='text'
                    id='targetPrice'
                    value={formData.targetPrice}
                    onChange={handleTargetPriceChange}
                    placeholder='예: 90000'
                  />
                </div>

                <button type='submit' className={styles.submitButton}>
                  계산하기
                </button>
              </form>

              {result !== null && (
                <div className={styles.resultCard}>
                  <h2>계산 결과</h2>
                  <div className={styles.resultSummary}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryValue}>
                        {Math.round(result.requiredQuantity).toLocaleString()}{' '}
                        주
                      </div>
                      <div className={styles.summaryLabel}>
                        추가 매수 필요 수량
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryValue}>
                        {Math.round(result.priceReduction).toFixed(2)}%
                      </div>
                      <div className={styles.summaryLabel}>
                        평균 매수가 감소율
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryValue}>
                        {Math.round(result.newAveragePrice).toLocaleString()} 원
                      </div>
                      <div className={styles.summaryLabel}>
                        예상 평균 매수가
                      </div>
                    </div>
                  </div>

                  <div className={styles.resultDivider}></div>

                  <div className={styles.resultSummary}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryValue}>
                        {result.totalInvestment.toLocaleString()} 원
                      </div>
                      <div className={styles.summaryLabel}>총 투자금액</div>
                    </div>
                  </div>

                  <div className={styles.resultDivider}></div>

                  <div className={styles.chartContainer}>
                    <h2>매수 현황 비교</h2>
                    <div className={styles.chart}>
                      <Line
                        data={{
                          labels: ['현재', '추가 매수 후'],
                          datasets: [
                            {
                              label: '평균 매수가',
                              data: [
                                Number(formData.currentAvgPrice),
                                result.newAveragePrice,
                              ],
                              borderColor: 'rgb(59, 130, 246)',
                              backgroundColor: 'rgba(59, 130, 246, 0.5)',
                              yAxisID: 'y',
                            },
                            {
                              label: '총 투자금액',
                              data: [
                                Number(formData.currentAvgPrice) *
                                  Number(formData.currentQuantity),
                                result.totalInvestment,
                              ],
                              borderColor: 'rgb(16, 185, 129)',
                              backgroundColor: 'rgba(16, 185, 129, 0.5)',
                              yAxisID: 'y1',
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          interaction: {
                            mode: 'index' as const,
                            intersect: false,
                          },
                          scales: {
                            y: {
                              type: 'linear' as const,
                              display: true,
                              position: 'left' as const,
                              title: {
                                display: true,
                                text: '평균 매수가 (원)',
                              },
                            },
                            y1: {
                              type: 'linear' as const,
                              display: true,
                              position: 'right' as const,
                              title: {
                                display: true,
                                text: '총 투자금액 (원)',
                              },
                              grid: {
                                drawOnChartArea: false,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
