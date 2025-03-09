'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../../page.module.css';
import Header from '../../../components/Header';

// 숫자에 콤마 추가하는 함수
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 콤마 제거하는 함수
const removeCommas = (str: string): string => {
  return str.replace(/,/g, '');
};

// 숫자를 한글 단위로 변환하는 함수
const formatKoreanNumber = (num: number): string => {
  if (num === 0) return '0원';

  const units = ['', '만', '억', '조', '경'];
  let result = '';
  let unitIndex = 0;
  let tempNum = num;

  while (tempNum > 0) {
    const remainder = tempNum % 10000;
    if (remainder > 0) {
      result = `${remainder}${units[unitIndex]} ${result}`;
    }
    tempNum = Math.floor(tempNum / 10000);
    unitIndex++;
  }

  return result.trim() + '원';
};

// 폼 입력 타입 정의
type FormInputs = {
  initialInvestment: string;
  monthlyContribution: string;
  annualReturn: string;
  inflation: string;
  years: string;
};

export default function FutureWorthCalculator() {
  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      initialInvestment: '1,000',
      monthlyContribution: '100',
      annualReturn: '7',
      inflation: '2',
      years: '10',
    },
    mode: 'onChange',
  });

  // 상태 관리
  const [initialInvestment, setInitialInvestment] = useState<number>(1000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(100);
  const [annualReturn, setAnnualReturn] = useState<number>(7);
  const [inflation, setInflation] = useState<number>(2);
  const [years, setYears] = useState<number>(10);
  const [result, setResult] = useState<number | null>(null);
  const [realValueResult, setRealValueResult] = useState<number | null>(null);

  // 초기 투자금 입력값 포맷팅
  const handleInitialInvestmentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = removeCommas(e.target.value);
    if (value === '') {
      setInitialInvestment(0);
      setValue('initialInvestment', '');
    } else {
      const numValue = Number(value);
      setInitialInvestment(numValue);
      setValue('initialInvestment', formatNumber(numValue));
    }
  };

  // 월 적립금 입력값 포맷팅
  const handleMonthlyContributionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = removeCommas(e.target.value);
    if (value === '') {
      setMonthlyContribution(0);
      setValue('monthlyContribution', '');
    } else {
      const numValue = Number(value);
      setMonthlyContribution(numValue);
      setValue('monthlyContribution', formatNumber(numValue));
    }
  };

  // 수익률 입력값 처리
  const handleAnnualReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setAnnualReturn(0);
      setValue('annualReturn', '');
    } else {
      const numValue = Number(value);
      setAnnualReturn(numValue);
      setValue('annualReturn', value);
    }
  };

  // 물가상승률 입력값 처리
  const handleInflationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setInflation(0);
      setValue('inflation', '');
    } else {
      const numValue = Number(value);
      setInflation(numValue);
      setValue('inflation', value);
    }
  };

  // 투자 기간 입력값 처리
  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setYears(0);
      setValue('years', '');
    } else {
      const numValue = Number(value);
      setYears(numValue);
      setValue('years', value);
    }
  };

  // 폼 제출 처리
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    // 초기 투자금의 미래 가치
    const initialFutureValue =
      initialInvestment * Math.pow(1 + annualReturn / 100, years);

    // 월별 적립금의 미래 가치
    let contributionFutureValue = 0;

    if (annualReturn === 0) {
      // 수익률이 0인 경우 단순 합산
      contributionFutureValue = monthlyContribution * years * 12;
    } else {
      // 수익률이 0이 아닌 경우 복리 계산
      const monthlyRate = annualReturn / 100 / 12;
      const months = years * 12;
      contributionFutureValue =
        monthlyContribution *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    // 총 미래 가치 (명목 가치)
    const totalFutureValue = initialFutureValue + contributionFutureValue;
    setResult(Math.round(totalFutureValue));

    // 인플레이션을 고려한 실질 가치 계산
    const realValue = totalFutureValue / Math.pow(1 + inflation / 100, years);
    setRealValueResult(Math.round(realValue));
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>미래가치 계산기</h1>
              <p className={styles.subtitle}>
                투자 금액, 기간, 수익률을 입력하여 미래 자산 가치를 계산해보세요
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.calculatorCard}>
              <div className={styles.inputGroup}>
                <label htmlFor='initialInvestment'>초기 투자금액 (원)</label>
                <input
                  id='initialInvestment'
                  type='text'
                  {...register('initialInvestment', {
                    required: '초기 투자금액을 입력해주세요',
                    validate: (value) =>
                      removeCommas(value) !== '0' ||
                      '0보다 큰 금액을 입력해주세요',
                  })}
                  onChange={handleInitialInvestmentChange}
                  min='0'
                />
                {initialInvestment > 0 && (
                  <div className={styles.koreanAmount}>
                    {formatKoreanNumber(initialInvestment)}
                  </div>
                )}
                {errors.initialInvestment && (
                  <div className={styles.errorMessage}>
                    {errors.initialInvestment.message}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='monthlyContribution'>월 적립금액 (원)</label>
                <input
                  id='monthlyContribution'
                  type='text'
                  {...register('monthlyContribution', {
                    required: '월 적립금액을 입력해주세요',
                  })}
                  onChange={handleMonthlyContributionChange}
                  min='0'
                />
                {monthlyContribution > 0 && (
                  <div className={styles.koreanAmount}>
                    {formatKoreanNumber(monthlyContribution)}
                  </div>
                )}
                {errors.monthlyContribution && (
                  <div className={styles.errorMessage}>
                    {errors.monthlyContribution.message}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='annualReturn'>연간 예상 수익률 (%)</label>
                <input
                  id='annualReturn'
                  type='text'
                  {...register('annualReturn', {
                    required: '연간 예상 수익률을 입력해주세요',
                    validate: {
                      isNumber: (value) =>
                        !isNaN(Number(value)) || '유효한 숫자를 입력해주세요',
                      isValid: (value) =>
                        Number(value) >= 0 || '0 이상의 값을 입력해주세요',
                    },
                  })}
                  onChange={handleAnnualReturnChange}
                  step='0.1'
                />
                {errors.annualReturn && (
                  <div className={styles.errorMessage}>
                    {errors.annualReturn.message}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='inflation'>연간 예상 물가상승률 (%)</label>
                <input
                  id='inflation'
                  type='text'
                  {...register('inflation', {
                    required: '연간 예상 물가상승률을 입력해주세요',
                    validate: {
                      isNumber: (value) =>
                        !isNaN(Number(value)) || '유효한 숫자를 입력해주세요',
                      isValid: (value) =>
                        Number(value) >= 0 || '0 이상의 값을 입력해주세요',
                    },
                  })}
                  onChange={handleInflationChange}
                  step='0.1'
                />
                {errors.inflation && (
                  <div className={styles.errorMessage}>
                    {errors.inflation.message}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='years'>투자 기간 (년)</label>
                <input
                  id='years'
                  type='text'
                  {...register('years', {
                    required: '투자 기간을 입력해주세요',
                    validate: (value) =>
                      Number(value) > 0 || '투자 기간은 0보다 커야 합니다',
                  })}
                  onChange={handleYearsChange}
                  min='1'
                  max='50'
                />
                {errors.years && (
                  <div className={styles.errorMessage}>
                    {errors.years.message}
                  </div>
                )}
              </div>

              <button type='submit' className={styles.calculateButton}>
                계산하기
              </button>
            </form>

            {result !== null && (
              <div className={styles.resultCard}>
                <h2>예상 미래 자산 가치</h2>
                <div className={styles.resultValue}>
                  {result.toLocaleString()} 원
                </div>
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
                      {(monthlyContribution * years * 12).toLocaleString()} 원
                    </div>
                    <div className={styles.summaryLabel}>총 적립금</div>
                    <div className={styles.koreanDetailAmount}>
                      {formatKoreanNumber(monthlyContribution * years * 12)}
                    </div>
                  </div>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryValue}>
                      {(
                        result -
                        initialInvestment -
                        monthlyContribution * years * 12
                      ).toLocaleString()}{' '}
                      원
                    </div>
                    <div className={styles.summaryLabel}>총 투자 수익</div>
                    <div className={styles.koreanDetailAmount}>
                      {formatKoreanNumber(
                        result -
                          initialInvestment -
                          monthlyContribution * years * 12
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.resultDivider}></div>

                <div className={styles.inflationSection}>
                  <div className={styles.inflationTitle}>
                    인플레이션 고려 시
                  </div>
                  <div className={styles.inflationDetails}>
                    <div className={styles.inflationItem}>
                      <div className={styles.inflationLabel}>실질 가치:</div>
                      <div className={styles.inflationValue}>
                        {realValueResult?.toLocaleString()} 원
                        <div className={styles.koreanDetailAmount}>
                          {realValueResult
                            ? formatKoreanNumber(realValueResult)
                            : ''}
                        </div>
                      </div>
                    </div>
                    <div className={styles.inflationItem}>
                      <div className={styles.inflationLabel}>구매력 감소:</div>
                      <div className={styles.inflationValue}>
                        {(result - (realValueResult ?? 0)).toLocaleString()} 원
                        <span className={styles.percentageValue}>
                          (
                          {(
                            ((result - (realValueResult ?? 0)) / result) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                        <div className={styles.koreanDetailAmount}>
                          {formatKoreanNumber(result - (realValueResult ?? 0))}
                        </div>
                      </div>
                    </div>
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
