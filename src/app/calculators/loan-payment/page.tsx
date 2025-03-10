'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../../page.module.css';
import Header from '../../../components/Header';
import FormattedInput from '../../../components/FormattedInput';
import { formatNumber, removeCommas } from '../../../utils/formatters';

// 폼 입력 타입 정의
type FormInputs = {
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
  paymentFrequency: string;
};

// 상환 계획 항목 타입
interface PaymentScheduleItem {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export default function LoanPaymentCalculator() {
  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      loanAmount: '100,000,000',
      interestRate: '4.5',
      loanTerm: '30',
      paymentFrequency: '12',
    },
    mode: 'onChange',
  });

  // 상태 관리
  const [loanAmount, setLoanAmount] = useState<number>(100000000);
  const [loanAmountFormatted, setLoanAmountFormatted] =
    useState<string>('100,000,000');
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [paymentFrequency, setPaymentFrequency] = useState<number>(12); // 월 납입
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleItem[]>(
    []
  );
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);

  // 대출 금액 입력값 포맷팅
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removeCommas(e.target.value);
    if (value === '') {
      setLoanAmount(0);
      setLoanAmountFormatted('');
      setValue('loanAmount', '');
    } else {
      const numValue = Number(value);
      setLoanAmount(numValue);
      setLoanAmountFormatted(formatNumber(numValue));
      setValue('loanAmount', formatNumber(numValue));
    }
  };

  // 이자율 입력값 처리
  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setInterestRate(0);
      setValue('interestRate', '');
    } else {
      const numValue = Number(value);
      setInterestRate(numValue);
      setValue('interestRate', value);
    }
  };

  // 대출 기간 입력값 처리
  const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setLoanTerm(0);
      setValue('loanTerm', '');
    } else {
      const numValue = Number(value);
      setLoanTerm(numValue);
      setValue('loanTerm', value);
    }
  };

  // 납입 주기 변경 처리
  const handlePaymentFrequencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value);
    setPaymentFrequency(value);
    setValue('paymentFrequency', e.target.value);
  };

  // 상환 계획 계산
  const calculateAmortizationSchedule = (
    principal: number,
    annualRate: number,
    termYears: number,
    paymentsPerYear: number
  ): PaymentScheduleItem[] => {
    const schedule: PaymentScheduleItem[] = [];
    const totalPayments = termYears * paymentsPerYear;
    const periodicRate = annualRate / 100 / paymentsPerYear;

    // 월 상환금 계산 (원리금균등상환 방식)
    const payment =
      (principal * (periodicRate * Math.pow(1 + periodicRate, totalPayments))) /
      (Math.pow(1 + periodicRate, totalPayments) - 1);

    let balance = principal;

    for (let period = 1; period <= totalPayments; period++) {
      // 이자 계산
      const interestPayment = balance * periodicRate;
      // 원금 계산
      const principalPayment = payment - interestPayment;
      // 잔액 계산
      balance -= principalPayment;

      // 마지막 납입 시 잔액 오차 보정
      const adjustedBalance = period === totalPayments ? 0 : balance;

      schedule.push({
        period,
        payment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: adjustedBalance,
      });
    }

    return schedule;
  };

  // 폼 제출 처리
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      return;
    }

    // 상환 계획 계산
    const schedule = calculateAmortizationSchedule(
      loanAmount,
      interestRate,
      loanTerm,
      paymentFrequency
    );

    if (schedule.length > 0) {
      // 월 상환금
      setMonthlyPayment(Math.round(schedule[0].payment));

      // 총 상환액
      const total = schedule.reduce((sum, item) => sum + item.payment, 0);
      setTotalPayment(Math.round(total));

      // 총 이자
      setTotalInterest(Math.round(total - loanAmount));

      // 상환 계획 저장
      setPaymentSchedule(schedule);
    }
  };

  // 상환 계획 표시 토글
  const toggleScheduleDisplay = () => {
    setShowFullSchedule(!showFullSchedule);
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>대출 상환 계산기</h1>
              <p className={styles.subtitle}>
                대출 금액, 이자율, 기간을 입력하여 월 상환금과 총 상환액을
                계산해보세요
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.calculatorCard}>
              <FormattedInput
                id='loanAmount'
                label='대출 금액 (원)'
                value={loanAmountFormatted}
                numericValue={loanAmount}
                onChange={handleLoanAmountChange}
                register={register}
                name='loanAmount'
                validation={{
                  required: '대출 금액을 입력해주세요',
                  validate: (value) =>
                    (removeCommas(value) !== '0' &&
                      Number(removeCommas(value)) > 0) ||
                    '0보다 큰 금액을 입력해주세요',
                }}
                error={errors.loanAmount}
                min='0'
              />

              <FormattedInput
                id='interestRate'
                label='연이자율 (%)'
                numericValue={interestRate}
                onChange={handleInterestRateChange}
                register={register}
                name='interestRate'
                validation={{
                  required: '연이자율을 입력해주세요',
                  validate: {
                    isNumber: (value) =>
                      !isNaN(Number(value)) || '유효한 숫자를 입력해주세요',
                    isValid: (value) =>
                      Number(value) > 0 || '0보다 큰 값을 입력해주세요',
                  },
                }}
                error={errors.interestRate}
                step='0.1'
                showKorean={false}
              />

              <div className={styles.inputGroup}>
                <label htmlFor='paymentFrequency'>납입 주기</label>
                <select
                  id='paymentFrequency'
                  value={paymentFrequency}
                  {...register('paymentFrequency', {
                    required: '납입 주기를 선택해주세요',
                  })}
                  onChange={handlePaymentFrequencyChange}
                  className={styles.select}>
                  <option value={12}>월 납입 (연 12회)</option>
                  <option value={4}>분기 납입 (연 4회)</option>
                  <option value={2}>반기 납입 (연 2회)</option>
                  <option value={1}>연 납입 (연 1회)</option>
                </select>
                {errors.paymentFrequency && (
                  <div className={styles.errorMessage}>
                    {errors.paymentFrequency.message}
                  </div>
                )}
              </div>

              <FormattedInput
                id='loanTerm'
                label='대출 기간 (년)'
                numericValue={loanTerm}
                onChange={handleLoanTermChange}
                register={register}
                name='loanTerm'
                validation={{
                  required: '대출 기간을 입력해주세요',
                  validate: (value) =>
                    Number(value) > 0 || '대출 기간은 0보다 커야 합니다',
                }}
                error={errors.loanTerm}
                min='1'
                max='50'
                showKorean={false}
              />

              <button type='submit' className={styles.calculateButton}>
                계산하기
              </button>
            </form>

            {monthlyPayment !== null &&
              totalPayment !== null &&
              totalInterest !== null && (
                <div className={styles.resultCard}>
                  <h2>대출 상환 정보</h2>

                  <div className={styles.resultSummary}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryValue}>
                        {monthlyPayment.toLocaleString()} 원
                      </div>
                      <div className={styles.summaryLabel}>
                        {paymentFrequency === 12
                          ? '월'
                          : paymentFrequency === 4
                          ? '분기'
                          : paymentFrequency === 2
                          ? '반기'
                          : '연'}{' '}
                        상환금
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryValue}>
                        {totalPayment.toLocaleString()} 원
                      </div>
                      <div className={styles.summaryLabel}>총 상환액</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryValue}>
                        {totalInterest.toLocaleString()} 원
                      </div>
                      <div className={styles.summaryLabel}>총 이자</div>
                    </div>
                  </div>

                  <div className={styles.resultDivider}></div>

                  <div className={styles.scheduleSection}>
                    <h3 className={styles.scheduleTitle}>상환 계획</h3>

                    <div className={styles.scheduleTable}>
                      <div className={styles.scheduleHeader}>
                        <div className={styles.scheduleHeaderCell}>회차</div>
                        <div className={styles.scheduleHeaderCell}>상환금</div>
                        <div className={styles.scheduleHeaderCell}>원금</div>
                        <div className={styles.scheduleHeaderCell}>이자</div>
                        <div className={styles.scheduleHeaderCell}>잔액</div>
                      </div>

                      {paymentSchedule
                        .slice(
                          0,
                          showFullSchedule ? paymentSchedule.length : 12
                        )
                        .map((item) => (
                          <div key={item.period} className={styles.scheduleRow}>
                            <div className={styles.scheduleCell}>
                              {item.period}
                            </div>
                            <div className={styles.scheduleCell}>
                              {Math.round(item.payment).toLocaleString()}
                            </div>
                            <div className={styles.scheduleCell}>
                              {Math.round(item.principal).toLocaleString()}
                            </div>
                            <div className={styles.scheduleCell}>
                              {Math.round(item.interest).toLocaleString()}
                            </div>
                            <div className={styles.scheduleCell}>
                              {Math.round(
                                item.remainingBalance
                              ).toLocaleString()}
                            </div>
                          </div>
                        ))}
                    </div>

                    {paymentSchedule.length > 12 && (
                      <button
                        className={styles.toggleButton}
                        onClick={toggleScheduleDisplay}
                        type='button'>
                        {showFullSchedule
                          ? '간략히 보기'
                          : '전체 상환 계획 보기'}
                      </button>
                    )}
                  </div>
                </div>
              )}
          </div>
        </main>
      </div>
    </>
  );
}
