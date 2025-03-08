'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Header from '../components/Header';

export default function FutureWorthCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number>(1000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(100);
  const [annualReturn, setAnnualReturn] = useState<number>(7);
  const [years, setYears] = useState<number>(10);
  const [result, setResult] = useState<number | null>(null);

  const calculateFutureWorth = () => {
    // 초기 투자금의 미래 가치
    const initialFutureValue =
      initialInvestment * Math.pow(1 + annualReturn / 100, years);

    // 월별 적립금의 미래 가치
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    const contributionFutureValue =
      monthlyContribution *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    // 총 미래 가치
    const totalFutureValue = initialFutureValue + contributionFutureValue;
    setResult(Math.round(totalFutureValue));
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <Image
            className={styles.logo}
            src='/next.svg'
            alt='Next.js logo'
            width={180}
            height={38}
            priority
          />
          <ol>
            <li>
              Get started by editing <code>src/app/page.tsx</code>.
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>

          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'>
              <Image
                className={styles.logo}
                src='/vercel.svg'
                alt='Vercel logomark'
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.secondary}>
              Read our docs
            </a>
          </div>

          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>미래가치 계산기</h1>
              <p className={styles.subtitle}>
                투자 금액, 기간, 수익률을 입력하여 미래 자산 가치를 계산해보세요
              </p>
            </div>

            <div className={styles.calculatorCard}>
              <div className={styles.inputGroup}>
                <label htmlFor='initialInvestment'>초기 투자금액 (원)</label>
                <input
                  id='initialInvestment'
                  type='number'
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  min='0'
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='monthlyContribution'>월 적립금액 (원)</label>
                <input
                  id='monthlyContribution'
                  type='number'
                  value={monthlyContribution}
                  onChange={(e) =>
                    setMonthlyContribution(Number(e.target.value))
                  }
                  min='0'
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='annualReturn'>연간 예상 수익률 (%)</label>
                <input
                  id='annualReturn'
                  type='number'
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  step='0.1'
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='years'>투자 기간 (년)</label>
                <input
                  id='years'
                  type='number'
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  min='1'
                  max='50'
                />
              </div>

              <button
                className={styles.calculateButton}
                onClick={calculateFutureWorth}>
                계산하기
              </button>
            </div>

            {result !== null && (
              <div className={styles.resultCard}>
                <h2>예상 미래 자산 가치</h2>
                <div className={styles.resultValue}>
                  {result.toLocaleString()} 원
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.detailItem}>
                    <span>초기 투자금:</span>
                    <span>{initialInvestment.toLocaleString()} 원</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span>총 적립금:</span>
                    <span>
                      {(monthlyContribution * years * 12).toLocaleString()} 원
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span>총 투자 수익:</span>
                    <span>
                      {(
                        result -
                        initialInvestment -
                        monthlyContribution * years * 12
                      ).toLocaleString()}{' '}
                      원
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <footer className={styles.footer}>
          <a
            href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'>
            <Image
              aria-hidden
              src='/file.svg'
              alt='File icon'
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'>
            <Image
              aria-hidden
              src='/window.svg'
              alt='Window icon'
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'>
            <Image
              aria-hidden
              src='/globe.svg'
              alt='Globe icon'
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
    </>
  );
}
