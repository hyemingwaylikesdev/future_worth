'use client';

import React from 'react';
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
import { InvestmentForm, FormData } from './components/InvestmentForm';
import { ResultCard } from './components/ResultCard';
import { InvestmentChart } from './components/InvestmentChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function InvestmentReturnCalculator() {
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

            <InvestmentForm onSubmit={onSubmit} />

            {result && (
              <div className={styles.result}>
                <h2>계산 결과</h2>
                <div className={styles.resultGrid}>
                  <ResultCard
                    title='추가 매수 필요 수량'
                    value={`${result.requiredQuantity.toLocaleString()}주`}
                  />
                  <ResultCard
                    title='추가 투자 필요 금액'
                    value={`${result.totalInvestment.toLocaleString()}원`}
                  />
                  <ResultCard
                    title='새로운 평균 매수가'
                    value={`${result.newAveragePrice.toLocaleString()}원`}
                  />
                  <ResultCard
                    title='평균 매수가 하락률'
                    value={`${result.priceReductionPercentage.toFixed(2)}%`}
                  />
                </div>

                <InvestmentChart
                  currentAveragePrice={result.newAveragePrice}
                  currentTotalInvestment={result.totalInvestment}
                  newAveragePrice={result.newAveragePrice}
                  newTotalInvestment={result.totalInvestment * 2}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
