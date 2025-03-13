'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../../page.module.css';
import Header from '../../../components/Header';
import FormattedInput from '../../../components/FormattedInput';
import ResultCard from '../../../components/ResultCard';
import RetirementSummary from '../../../components/RetirementSummary';
import { formatNumber, removeCommas } from '../../../utils/formatters';
import {
  calculateRetirementFunds,
  RetirementCalculationResult,
} from '../../../utils/retirement-calculator';

// 폼 입력 타입 정의
type FormInputs = {
  currentAge: string;
  retirementAge: string;
  lifeExpectancy: string;
  currentSavings: string;
  monthlyExpenses: string;
  annualReturn: string;
  inflation: string;
};

export default function RetirementCalculator() {
  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      currentAge: '30',
      retirementAge: '65',
      lifeExpectancy: '90',
      currentSavings: '50,000,000',
      monthlyExpenses: '2,000,000',
      annualReturn: '5',
      inflation: '2',
    },
    mode: 'onChange',
  });

  // 상태 관리
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90);
  const [currentSavings, setCurrentSavings] = useState<number>(50000000);
  const [currentSavingsFormatted, setCurrentSavingsFormatted] =
    useState<string>('50,000,000');
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(2000000);
  const [monthlyExpensesFormatted, setMonthlyExpensesFormatted] =
    useState<string>('2,000,000');
  const [annualReturn, setAnnualReturn] = useState<number>(5);
  const [inflation, setInflation] = useState<number>(2);

  // 결과 상태
  const [calculationResult, setCalculationResult] =
    useState<RetirementCalculationResult | null>(null);

  // 현재 나이 입력값 처리
  const handleCurrentAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setCurrentAge(0);
      setValue('currentAge', '');
    } else {
      const numValue = Number(value);
      setCurrentAge(numValue);
      setValue('currentAge', value);
    }
  };

  // 은퇴 예정 나이 입력값 처리
  const handleRetirementAgeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '') {
      setRetirementAge(0);
      setValue('retirementAge', '');
    } else {
      const numValue = Number(value);
      setRetirementAge(numValue);
      setValue('retirementAge', value);
    }
  };

  // 기대 수명 입력값 처리
  const handleLifeExpectancyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '') {
      setLifeExpectancy(0);
      setValue('lifeExpectancy', '');
    } else {
      const numValue = Number(value);
      setLifeExpectancy(numValue);
      setValue('lifeExpectancy', value);
    }
  };

  // 현재 저축액 입력값 포맷팅
  const handleCurrentSavingsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = removeCommas(e.target.value);
    if (value === '') {
      setCurrentSavings(0);
      setCurrentSavingsFormatted('');
      setValue('currentSavings', '');
    } else {
      const numValue = Number(value);
      setCurrentSavings(numValue);
      setCurrentSavingsFormatted(formatNumber(numValue));
      setValue('currentSavings', formatNumber(numValue));
    }
  };

  // 월 생활비 입력값 포맷팅
  const handleMonthlyExpensesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = removeCommas(e.target.value);
    if (value === '') {
      setMonthlyExpenses(0);
      setMonthlyExpensesFormatted('');
      setValue('monthlyExpenses', '');
    } else {
      const numValue = Number(value);
      setMonthlyExpenses(numValue);
      setMonthlyExpensesFormatted(formatNumber(numValue));
      setValue('monthlyExpenses', formatNumber(numValue));
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

  // 폼 제출 처리
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    // 계산 유틸리티 함수 호출
    const result = calculateRetirementFunds({
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      monthlyExpenses,
      annualReturn,
      inflation,
    });

    // 결과 설정
    setCalculationResult(result);
  };

  // 총 적립금 계산 (은퇴까지 매월 저축액 * 개월 수)
  const totalContribution = calculationResult?.requiredMonthlySavings
    ? calculationResult.requiredMonthlySavings *
      (retirementAge - currentAge) *
      12
    : 0;

  // 총 투자 수익 계산
  const totalProfit =
    calculationResult?.requiredSavings && currentSavings && totalContribution
      ? calculationResult.requiredSavings - currentSavings - totalContribution
      : 0;

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>퇴직 자금 계산기</h1>
              <p className={styles.subtitle}>
                은퇴를 위해 필요한 저축액을 계산해보세요
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.calculatorCard}>
              <div className={styles.inputGroup}>
                <label htmlFor='currentAge'>현재 나이 (세)</label>
                <input
                  id='currentAge'
                  type='number'
                  {...register('currentAge', {
                    required: '현재 나이를 입력해주세요',
                    min: {
                      value: 18,
                      message: '18세 이상이어야 합니다',
                    },
                    max: {
                      value: 100,
                      message: '100세 이하여야 합니다',
                    },
                    onChange: handleCurrentAgeChange,
                  })}
                />
                {errors.currentAge && (
                  <div className={styles.errorMessage}>
                    {errors.currentAge.message}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='retirementAge'>은퇴 예정 나이 (세)</label>
                <input
                  id='retirementAge'
                  type='number'
                  {...register('retirementAge', {
                    required: '은퇴 예정 나이를 입력해주세요',
                    validate: (value) =>
                      Number(value) > currentAge ||
                      '은퇴 나이는 현재 나이보다 커야 합니다',
                    min: {
                      value: 40,
                      message: '40세 이상이어야 합니다',
                    },
                    max: {
                      value: 100,
                      message: '100세 이하여야 합니다',
                    },
                    onChange: handleRetirementAgeChange,
                  })}
                />
                {errors.retirementAge && (
                  <div className={styles.errorMessage}>
                    {errors.retirementAge.message}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='lifeExpectancy'>기대 수명 (세)</label>
                <input
                  id='lifeExpectancy'
                  type='number'
                  {...register('lifeExpectancy', {
                    required: '기대 수명을 입력해주세요',
                    validate: (value) =>
                      Number(value) > retirementAge ||
                      '기대 수명은 은퇴 나이보다 커야 합니다',
                    min: {
                      value: 50,
                      message: '50세 이상이어야 합니다',
                    },
                    max: {
                      value: 120,
                      message: '120세 이하여야 합니다',
                    },
                    onChange: handleLifeExpectancyChange,
                  })}
                />
                {errors.lifeExpectancy && (
                  <div className={styles.errorMessage}>
                    {errors.lifeExpectancy.message}
                  </div>
                )}
              </div>

              <FormattedInput
                id='currentSavings'
                label='현재 저축액 (원)'
                value={currentSavingsFormatted}
                numericValue={currentSavings}
                onChange={handleCurrentSavingsChange}
                register={register}
                name='currentSavings'
                validation={{
                  required: '현재 저축액을 입력해주세요',
                }}
                error={errors.currentSavings}
                min='0'
              />

              <FormattedInput
                id='monthlyExpenses'
                label='은퇴 후 필요 월 생활비 (원)'
                value={monthlyExpensesFormatted}
                numericValue={monthlyExpenses}
                onChange={handleMonthlyExpensesChange}
                register={register}
                name='monthlyExpenses'
                validation={{
                  required: '은퇴 후 필요 월 생활비를 입력해주세요',
                  validate: (value) =>
                    (removeCommas(value) !== '0' &&
                      Number(removeCommas(value)) > 0) ||
                    '0보다 큰 금액을 입력해주세요',
                }}
                error={errors.monthlyExpenses}
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

              <button type='submit' className={styles.calculateButton}>
                계산하기
              </button>
            </form>

            {calculationResult && (
              <div className={styles.resultCard}>
                <h2>은퇴 준비 정보</h2>

                <div className={styles.resultValue}>
                  {calculationResult.requiredMonthlySavings.toLocaleString()} 원
                </div>
                <div className={styles.resultLabel}>매월 저축해야 할 금액</div>

                <div className={styles.resultDivider}></div>

                <ResultCard
                  title='필요한 총 은퇴 자금'
                  result={calculationResult.requiredSavings}
                  initialInvestment={currentSavings}
                  totalContribution={totalContribution}
                  totalProfit={totalProfit}
                  realValueResult={calculationResult.realValueRetirementFund}
                  inflationLoss={calculationResult.inflationLoss}
                />

                <RetirementSummary
                  yearsToRetirement={retirementAge - currentAge}
                  retirementYears={lifeExpectancy - retirementAge}
                  inflatedMonthlyExpenses={
                    calculationResult.inflatedMonthlyExpenses
                  }
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
