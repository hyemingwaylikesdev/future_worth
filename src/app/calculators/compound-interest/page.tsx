'use client';

import React from 'react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../../page.module.css';
import Header from '../../../components/Header';
import FormattedInput from '../../../components/FormattedInput';
import ResultCard from '../../../components/ResultCard';
import { formatNumber, removeCommas } from '../../../utils/formatters';

// 폼 입력 타입 정의
type FormInputs = {
  initialDeposit: string;
  monthlyDeposit: string;
  rate: string;
  years: string;
  compoundFrequency: string;
};

export default function SavingsCalculator() {
  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      initialDeposit: '1,000,000',
      monthlyDeposit: '100,000',
      rate: '3.5',
      years: '2',
      compoundFrequency: '12',
    },
    mode: 'onChange',
  });

  // 상태 관리
  const [initialDeposit, setInitialDeposit] = useState<number>(1000000);
  const [initialDepositFormatted, setInitialDepositFormatted] =
    useState<string>('1,000,000');
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(100000);
  const [monthlyDepositFormatted, setMonthlyDepositFormatted] =
    useState<string>('100,000');
  const [rate, setRate] = useState<number>(3.5);
  const [years, setYears] = useState<number>(2);
  const [compoundFrequency, setCompoundFrequency] = useState<number>(12); // 월복리
  const [result, setResult] = useState<number | null>(null);

  // 초기 예금액 입력값 포맷팅
  const handleInitialDepositChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = removeCommas(e.target.value);
    if (value === '') {
      setInitialDeposit(0);
      setInitialDepositFormatted('');
      setValue('initialDeposit', '');
    } else {
      const numValue = Number(value);
      setInitialDeposit(numValue);
      setInitialDepositFormatted(formatNumber(numValue));
      setValue('initialDeposit', formatNumber(numValue));
    }
  };

  // 월 적립금 입력값 포맷팅
  const handleMonthlyDepositChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = removeCommas(e.target.value);
    if (value === '') {
      setMonthlyDeposit(0);
      setMonthlyDepositFormatted('');
      setValue('monthlyDeposit', '');
    } else {
      const numValue = Number(value);
      setMonthlyDeposit(numValue);
      setMonthlyDepositFormatted(formatNumber(numValue));
      setValue('monthlyDeposit', formatNumber(numValue));
    }
  };

  // 이율 입력값 처리
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setRate(0);
      setValue('rate', '');
    } else {
      const numValue = Number(value);
      setRate(numValue);
      setValue('rate', value);
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

  // 복리 주기 변경 처리
  const handleCompoundFrequencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value);
    setCompoundFrequency(value);
    setValue('compoundFrequency', e.target.value);
  };

  // 폼 제출 처리
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    // 예금(초기 예금액)의 미래 가치 계산
    const r = rate / 100;
    const n = compoundFrequency;
    const t = years;

    // 초기 예금액의 미래 가치
    const initialDepositFutureValue =
      initialDeposit * Math.pow(1 + r / n, n * t);

    // 월 적립금의 미래 가치
    let monthlyDepositFutureValue = 0;

    if (monthlyDeposit > 0) {
      if (rate === 0) {
        // 이율이 0인 경우 단순 합산
        monthlyDepositFutureValue = monthlyDeposit * years * 12;
      } else {
        // 이율이 0이 아닌 경우 복리 계산
        const monthlyRate = r / n;
        const months = years * 12;
        monthlyDepositFutureValue =
          monthlyDeposit *
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      }
    }

    // 총 미래 가치
    const totalFutureValue =
      initialDepositFutureValue + monthlyDepositFutureValue;
    setResult(Math.round(totalFutureValue));
  };

  // 총 적립금 계산
  const totalContribution = monthlyDeposit * years * 12;

  // 총 투자 수익 계산
  const totalProfit =
    result !== null ? result - initialDeposit - totalContribution : 0;

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>예금/적금 계산기</h1>
              <p className={styles.subtitle}>
                예금(초기 금액)과 적금(월 적립금)의 미래 가치를 계산해보세요
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.calculatorCard}>
              <FormattedInput
                id='initialDeposit'
                label='초기 예금액 (원)'
                value={initialDepositFormatted}
                numericValue={initialDeposit}
                onChange={handleInitialDepositChange}
                register={register}
                name='initialDeposit'
                validation={{
                  validate: (value) =>
                    !value ||
                    removeCommas(value) === '0' ||
                    Number(removeCommas(value)) > 0 ||
                    '0보다 큰 금액을 입력해주세요',
                }}
                error={errors.initialDeposit}
                min='0'
              />

              <FormattedInput
                id='monthlyDeposit'
                label='월 적립금 (원)'
                value={monthlyDepositFormatted}
                numericValue={monthlyDeposit}
                onChange={handleMonthlyDepositChange}
                register={register}
                name='monthlyDeposit'
                validation={{
                  validate: (value) =>
                    !value ||
                    removeCommas(value) === '0' ||
                    Number(removeCommas(value)) > 0 ||
                    '0보다 큰 금액을 입력해주세요',
                }}
                error={errors.monthlyDeposit}
                min='0'
              />

              <div className={styles.noteText}>
                * 예금만 하려면 월 적립금을 0으로, 적금만 하려면 초기 예금액을
                0으로 설정하세요.
              </div>

              <FormattedInput
                id='rate'
                label='연이율 (%)'
                numericValue={rate}
                onChange={handleRateChange}
                register={register}
                name='rate'
                validation={{
                  required: '연이율을 입력해주세요',
                  validate: {
                    isNumber: (value) =>
                      !isNaN(Number(value)) || '유효한 숫자를 입력해주세요',
                    isValid: (value) =>
                      Number(value) >= 0 || '0 이상의 값을 입력해주세요',
                  },
                }}
                error={errors.rate}
                step='0.1'
                showKorean={false}
              />

              <div className={styles.inputGroup}>
                <label htmlFor='compoundFrequency'>이자 계산 주기</label>
                <select
                  id='compoundFrequency'
                  value={compoundFrequency}
                  {...register('compoundFrequency', {
                    required: '이자 계산 주기를 선택해주세요',
                  })}
                  onChange={handleCompoundFrequencyChange}
                  className={styles.select}>
                  <option value={1}>연복리 (연 1회)</option>
                  <option value={2}>반기복리 (연 2회)</option>
                  <option value={4}>분기복리 (연 4회)</option>
                  <option value={12}>월복리 (연 12회)</option>
                  <option value={365}>일복리 (연 365회)</option>
                </select>
                {errors.compoundFrequency && (
                  <div className={styles.errorMessage}>
                    {errors.compoundFrequency.message}
                  </div>
                )}
              </div>

              <FormattedInput
                id='years'
                label='예치 기간 (년)'
                numericValue={years}
                onChange={handleYearsChange}
                register={register}
                name='years'
                validation={{
                  required: '예치 기간을 입력해주세요',
                  validate: (value) =>
                    Number(value) > 0 || '예치 기간은 0보다 커야 합니다',
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
                title='만기 시 예상 금액'
                result={result}
                initialInvestment={initialDeposit}
                totalContribution={totalContribution}
                totalProfit={totalProfit}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
