'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Line } from 'react-chartjs-2';
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

const formSchema = z.object({
  currentAveragePrice: z
    .number()
    .min(0, '현재 평균 매수가는 0보다 커야 합니다')
    .max(1000000000, '현재 평균 매수가가 너무 큽니다'),
  currentQuantity: z
    .number()
    .min(0, '보유 수량은 0보다 커야 합니다')
    .max(1000000000, '보유 수량이 너무 큽니다'),
  currentStockPrice: z
    .number()
    .min(0, '현재 주가는 0보다 커야 합니다')
    .max(1000000000, '현재 주가가 너무 큽니다'),
  targetAveragePrice: z
    .number()
    .min(0, '목표 평균 매수가는 0보다 커야 합니다')
    .max(1000000000, '목표 평균 매수가가 너무 큽니다'),
});

type FormData = z.infer<typeof formSchema>;

export default function InvestmentReturnCalculator() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [result, setResult] = React.useState<{
    requiredQuantity: number;
    totalInvestment: number;
    newAveragePrice: number;
    priceReductionPercentage: number;
  } | null>(null);

  const onSubmit = (data: FormData) => {
    const {
      currentAveragePrice,
      currentQuantity,
      currentStockPrice,
      targetAveragePrice,
    } = data;

    const requiredQuantity =
      (currentQuantity * (currentAveragePrice - targetAveragePrice)) /
      (targetAveragePrice - currentStockPrice);

    const totalInvestment = requiredQuantity * currentStockPrice;
    const newAveragePrice =
      (currentQuantity * currentAveragePrice +
        requiredQuantity * currentStockPrice) /
      (currentQuantity + requiredQuantity);
    const priceReductionPercentage =
      ((currentAveragePrice - newAveragePrice) / currentAveragePrice) * 100;

    setResult({
      requiredQuantity,
      totalInvestment,
      newAveragePrice,
      priceReductionPercentage,
    });
  };

  const chartData = result
    ? {
        labels: ['현재', '추가 매수 후'],
        datasets: [
          {
            label: '평균 매수가',
            data: [watch('currentAveragePrice'), result.newAveragePrice],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: '총 투자금액',
            data: [
              watch('currentAveragePrice') * watch('currentQuantity'),
              result.totalInvestment +
                watch('currentAveragePrice') * watch('currentQuantity'),
            ],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
          },
        ],
      }
    : null;

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
                추가 매수를 통한 평균 매수가 변화를 계산해보세요
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor='currentAveragePrice'>현재 평균 매수가</label>
                <input
                  type='number'
                  id='currentAveragePrice'
                  {...register('currentAveragePrice', { valueAsNumber: true })}
                  className={errors.currentAveragePrice ? styles.error : ''}
                />
                {errors.currentAveragePrice && (
                  <span className={styles.errorMessage}>
                    {errors.currentAveragePrice.message}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='currentQuantity'>보유 수량</label>
                <input
                  type='number'
                  id='currentQuantity'
                  {...register('currentQuantity', { valueAsNumber: true })}
                  className={errors.currentQuantity ? styles.error : ''}
                />
                {errors.currentQuantity && (
                  <span className={styles.errorMessage}>
                    {errors.currentQuantity.message}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='currentStockPrice'>현재 주가</label>
                <input
                  type='number'
                  id='currentStockPrice'
                  {...register('currentStockPrice', { valueAsNumber: true })}
                  className={errors.currentStockPrice ? styles.error : ''}
                />
                {errors.currentStockPrice && (
                  <span className={styles.errorMessage}>
                    {errors.currentStockPrice.message}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='targetAveragePrice'>목표 평균 매수가</label>
                <input
                  type='number'
                  id='targetAveragePrice'
                  {...register('targetAveragePrice', { valueAsNumber: true })}
                  className={errors.targetAveragePrice ? styles.error : ''}
                />
                {errors.targetAveragePrice && (
                  <span className={styles.errorMessage}>
                    {errors.targetAveragePrice.message}
                  </span>
                )}
              </div>

              <button type='submit' className={styles.button}>
                계산하기
              </button>
            </form>

            {result && (
              <div className={styles.result}>
                <h2>계산 결과</h2>
                <div className={styles.resultGrid}>
                  <div className={styles.resultCard}>
                    <h3>추가 매수 필요 수량</h3>
                    <p>{result.requiredQuantity.toLocaleString()}주</p>
                  </div>
                  <div className={styles.resultCard}>
                    <h3>추가 투자 필요 금액</h3>
                    <p>{result.totalInvestment.toLocaleString()}원</p>
                  </div>
                  <div className={styles.resultCard}>
                    <h3>새로운 평균 매수가</h3>
                    <p>{result.newAveragePrice.toLocaleString()}원</p>
                  </div>
                  <div className={styles.resultCard}>
                    <h3>평균 매수가 하락률</h3>
                    <p>{result.priceReductionPercentage.toFixed(2)}%</p>
                  </div>
                </div>

                {chartData && (
                  <div className={styles.chartContainer}>
                    <Line options={chartOptions} data={chartData} />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
