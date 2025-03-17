'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../../page.module.css';
import Header from '../../../components/Header';
import FormattedInput from '../../../components/FormattedInput';
import { formatNumber, removeCommas } from '../../../utils/formatters';

// 폼 입력 타입 정의
type FormInputs = {
  currentAvgPrice: string;
  currentQuantity: string;
  currentPrice: string;
  targetPrice: string;
};

export default function AveragingDownCalculator() {
  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      currentAvgPrice: '50,000',
      currentQuantity: '100',
      currentPrice: '40,000',
      targetPrice: '45,000',
    },
    mode: 'onChange',
  });

  // 상태 관리
  const [currentAvgPrice, setCurrentAvgPrice] = useState<number>(50000);
  const [currentQuantity, setCurrentQuantity] = useState<number>(100);
  const [currentPrice, setCurrentPrice] = useState<number>(40000);
  const [targetPrice, setTargetPrice] = useState<number>(45000);
  const [result, setResult] = useState<{
    requiredQuantity: number;
    totalInvestmentNeeded: number;
    newAveragePrice: number;
    totalQuantity: number;
    totalInvestment: number;
    priceReduction: number;
  } | null>(null);

  // 현재 평단가 입력값 포맷팅
  const handleCurrentAvgPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = removeCommas(e.target.value);
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    setCurrentAvgPrice(numericValue);
    setValue('currentAvgPrice', formatNumber(numericValue));
  };

  // 현재 보유 수량 입력값 포맷팅
  const handleCurrentQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    setCurrentQuantity(numericValue);
    setValue('currentQuantity', value);
  };

  // 현재 주가 입력값 포맷팅
  const handleCurrentPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removeCommas(e.target.value);
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    setCurrentPrice(numericValue);
    setValue('currentPrice', formatNumber(numericValue));
  };

  // 목표 평단가 입력값 포맷팅
  const handleTargetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removeCommas(e.target.value);
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    setTargetPrice(numericValue);
    setValue('targetPrice', formatNumber(numericValue));
  };

  // 폼 제출 처리
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    // 현재 총 투자금액
    const currentTotalInvestment = currentAvgPrice * currentQuantity;

    // 목표 평단가를 달성하기 위한 추가 매수 수량 계산
    // (현재_평단가 * 현재_수량 - 목표_평단가 * 현재_수량) / (목표_평단가 - 현재_주가)
    const requiredQuantity = Math.ceil(
      (currentAvgPrice * currentQuantity - targetPrice * currentQuantity) /
        (targetPrice - currentPrice)
    );

    // 추가 필요 투자금액
    const totalInvestmentNeeded = requiredQuantity * currentPrice;

    // 총 수량
    const totalQuantity = currentQuantity + requiredQuantity;

    // 총 투자금액
    const totalInvestment = currentTotalInvestment + totalInvestmentNeeded;

    // 새로운 평균 매수가
    const newAveragePrice = totalInvestment / totalQuantity;

    // 평단가 감소율
    const priceReduction =
      ((currentAvgPrice - newAveragePrice) / currentAvgPrice) * 100;

    setResult({
      requiredQuantity,
      totalInvestmentNeeded,
      newAveragePrice,
      totalQuantity,
      totalInvestment,
      priceReduction,
    });
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>주식 물타기 계산기</h1>
              <p className={styles.subtitle}>
                목표 평단가 달성을 위한 추가 매수 수량을 계산해보세요
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.calculatorCard}>
              <div className={styles.inputGroup}>
                <h3 className={styles.inputGroupTitle}>현재 상태</h3>
                <FormattedInput
                  id='currentAvgPrice'
                  label='현재 평균 단가 (원)'
                  numericValue={currentAvgPrice}
                  onChange={handleCurrentAvgPriceChange}
                  register={register}
                  name='currentAvgPrice'
                  validation={{
                    required: '현재 평균 단가를 입력해주세요',
                    validate: (value) =>
                      removeCommas(value) !== '0' ||
                      '0보다 큰 금액을 입력해주세요',
                  }}
                  error={errors.currentAvgPrice}
                  min='0'
                />

                <FormattedInput
                  id='currentQuantity'
                  label='현재 보유 수량 (주)'
                  numericValue={currentQuantity}
                  onChange={handleCurrentQuantityChange}
                  register={register}
                  name='currentQuantity'
                  validation={{
                    required: '현재 보유 수량을 입력해주세요',
                    validate: (value) =>
                      Number(value) > 0 || '0보다 큰 수량을 입력해주세요',
                  }}
                  error={errors.currentQuantity}
                  min='1'
                  showKorean={false}
                />

                <FormattedInput
                  id='currentPrice'
                  label='현재 주가 (원)'
                  numericValue={currentPrice}
                  onChange={handleCurrentPriceChange}
                  register={register}
                  name='currentPrice'
                  validation={{
                    required: '현재 주가를 입력해주세요',
                    validate: (value) =>
                      removeCommas(value) !== '0' ||
                      '0보다 큰 금액을 입력해주세요',
                  }}
                  error={errors.currentPrice}
                  min='0'
                />

                <FormattedInput
                  id='targetPrice'
                  label='목표 평단가 (원)'
                  numericValue={targetPrice}
                  onChange={handleTargetPriceChange}
                  register={register}
                  name='targetPrice'
                  validation={{
                    required: '목표 평단가를 입력해주세요',
                    validate: {
                      positive: (value) =>
                        removeCommas(value) !== '0' ||
                        '0보다 큰 금액을 입력해주세요',
                      lessThanCurrent: (value) =>
                        Number(removeCommas(value)) < currentAvgPrice ||
                        '목표 평단가는 현재 평단가보다 작아야 합니다',
                      moreThanMarket: (value) =>
                        Number(removeCommas(value)) > currentPrice ||
                        '목표 평단가는 현재 주가보다 커야 합니다',
                    },
                  }}
                  error={errors.targetPrice}
                  min='0'
                />
              </div>

              <button type='submit' className={styles.calculateButton}>
                계산하기
              </button>
            </form>

            {result !== null && (
              <div className={styles.resultCard}>
                <h2>물타기 전략</h2>
                <div className={styles.resultSummary}>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryValue}>
                      {result.requiredQuantity.toLocaleString()} 주
                    </div>
                    <div className={styles.summaryLabel}>필요 매수 수량</div>
                  </div>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryValue}>
                      {result.totalInvestmentNeeded.toLocaleString()} 원
                    </div>
                    <div className={styles.summaryLabel}>필요 투자금액</div>
                  </div>
                </div>

                <div className={styles.resultDivider}></div>

                <div className={styles.resultSummary}>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryValue}>
                      {Math.round(result.newAveragePrice).toLocaleString()} 원
                    </div>
                    <div className={styles.summaryLabel}>예상 평균 단가</div>
                  </div>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryValue}>
                      {result.priceReduction.toFixed(2)}%
                    </div>
                    <div className={styles.summaryLabel}>평단가 감소율</div>
                  </div>
                </div>

                <div className={styles.resultDivider}></div>

                <div className={styles.resultSummary}>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryValue}>
                      {result.totalQuantity.toLocaleString()} 주
                    </div>
                    <div className={styles.summaryLabel}>총 보유 수량</div>
                  </div>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryValue}>
                      {result.totalInvestment.toLocaleString()} 원
                    </div>
                    <div className={styles.summaryLabel}>총 투자금액</div>
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
