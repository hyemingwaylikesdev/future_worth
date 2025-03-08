'use client';

import { useState } from 'react';
import styles from '../../page.module.css';
import Header from '../../../components/Header';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [compoundFrequency, setCompoundFrequency] = useState<number>(12); // 월복리
  const [result, setResult] = useState<number | null>(null);

  const calculateCompoundInterest = () => {
    // 복리 계산 공식: A = P(1 + r/n)^(nt)
    // A: 최종 금액, P: 원금, r: 연이율, n: 복리 횟수, t: 기간(년)
    const r = rate / 100;
    const n = compoundFrequency;
    const t = years;

    const finalAmount = principal * Math.pow(1 + r / n, n * t);
    setResult(Math.round(finalAmount));
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>복리 이자 계산기</h1>
              <p className={styles.subtitle}>
                원금, 이율, 기간을 입력하여 복리 이자로 증가하는 금액을
                계산해보세요
              </p>
            </div>

            <div className={styles.calculatorCard}>
              <div className={styles.inputGroup}>
                <label htmlFor='principal'>원금 (원)</label>
                <input
                  id='principal'
                  type='number'
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  min='0'
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='rate'>연이율 (%)</label>
                <input
                  id='rate'
                  type='number'
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  step='0.1'
                  min='0'
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='compoundFrequency'>복리 계산 주기</label>
                <select
                  id='compoundFrequency'
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(Number(e.target.value))}
                  className={styles.select}>
                  <option value={1}>연복리 (연 1회)</option>
                  <option value={2}>반기복리 (연 2회)</option>
                  <option value={4}>분기복리 (연 4회)</option>
                  <option value={12}>월복리 (연 12회)</option>
                  <option value={365}>일복리 (연 365회)</option>
                </select>
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
                onClick={calculateCompoundInterest}>
                계산하기
              </button>
            </div>

            {result !== null && (
              <div className={styles.resultCard}>
                <h2>복리 적용 후 최종 금액</h2>
                <div className={styles.resultValue}>
                  {result.toLocaleString()} 원
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.detailItem}>
                    <span>원금:</span>
                    <span>{principal.toLocaleString()} 원</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span>이자 수익:</span>
                    <span>{(result - principal).toLocaleString()} 원</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span>총 수익률:</span>
                    <span>{((result / principal - 1) * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
