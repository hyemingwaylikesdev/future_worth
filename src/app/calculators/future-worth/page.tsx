'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../../page.module.css';
import Header from '../../../components/Header';
import FormattedInput from '../../../components/FormattedInput';
import ResultCard from '../../../components/ResultCard';
import { formatNumber, removeCommas } from '../../../utils/formatters';

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
    watch,
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

  // 총 적립금 계산
  const totalContribution = monthlyContribution * years * 12;

  // 총 투자 수익 계산
  const totalProfit =
    result !== null ? result - initialInvestment - totalContribution : 0;

  // 인플레이션으로 인한 구매력 감소
  const inflationLoss =
    result !== null && realValueResult !== null ? result - realValueResult : 0;

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
              <FormattedInput
                id='initialInvestment'
                label='초기 투자금액 (원)'
                numericValue={initialInvestment}
                onChange={handleInitialInvestmentChange}
                register={register}
                name='initialInvestment'
                validation={{
                  required: '초기 투자금액을 입력해주세요',
                  validate: (value) =>
                    removeCommas(value) !== '0' ||
                    '0보다 큰 금액을 입력해주세요',
                }}
                error={errors.initialInvestment}
                min='0'
              />

              <FormattedInput
                id='monthlyContribution'
                label='월 적립금액 (원)'
                numericValue={monthlyContribution}
                onChange={handleMonthlyContributionChange}
                register={register}
                name='monthlyContribution'
                validation={{
                  required: '월 적립금액을 입력해주세요',
                }}
                error={errors.monthlyContribution}
                min='0'
              />

              <FormattedInput
                id='annualReturn'
                label='연간 예상 수익률 (%)'
                numericValue={annualReturn}
                onChange={handleAnnualReturnChange}
                register={register}
                name='annualReturn'
                validation={{
                  required: '연간 예상 수익률을 입력해주세요',
                  validate: {
                    isNumber: (value) =>
                      !isNaN(Number(value)) || '유효한 숫자를 입력해주세요',
                    isValid: (value) =>
                      Number(value) >= 0 || '0 이상의 값을 입력해주세요',
                  },
                }}
                error={errors.annualReturn}
                step='0.1'
                showKorean={false}
              />

              <FormattedInput
                id='inflation'
                label='연간 예상 물가상승률 (%)'
                numericValue={inflation}
                onChange={handleInflationChange}
                register={register}
                name='inflation'
                validation={{
                  required: '연간 예상 물가상승률을 입력해주세요',
                  validate: {
                    isNumber: (value) =>
                      !isNaN(Number(value)) || '유효한 숫자를 입력해주세요',
                    isValid: (value) =>
                      Number(value) >= 0 || '0 이상의 값을 입력해주세요',
                  },
                }}
                error={errors.inflation}
                step='0.1'
                showKorean={false}
              />

              <FormattedInput
                id='years'
                label='투자 기간 (년)'
                numericValue={years}
                onChange={handleYearsChange}
                register={register}
                name='years'
                validation={{
                  required: '투자 기간을 입력해주세요',
                  validate: (value) =>
                    Number(value) > 0 || '투자 기간은 0보다 커야 합니다',
                }}
                error={errors.years}
                min='1'
                max='50'
                showKorean={false}
              />

              <button type='submit' className={styles.calculateButton}>
                계산하기
              </button>
            </form>

            {result !== null && (
              <ResultCard
                title='예상 미래 자산 가치'
                result={result}
                initialInvestment={initialInvestment}
                totalContribution={totalContribution}
                totalProfit={totalProfit}
                realValueResult={realValueResult}
                inflationLoss={inflationLoss}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
