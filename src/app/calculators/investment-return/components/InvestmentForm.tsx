import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import styles from '../page.module.css';

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

export type FormData = z.infer<typeof formSchema>;

interface InvestmentFormProps {
  onSubmit: (data: FormData) => void;
}

export function InvestmentForm({ onSubmit }: InvestmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
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
  );
}
