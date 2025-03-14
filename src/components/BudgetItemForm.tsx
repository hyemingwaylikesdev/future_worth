import React, { useState } from 'react';
import styles from '../app/page.module.css';
import { formatNumber, removeCommas } from '../utils/formatters';

interface BudgetItemFormProps {
  type: 'income' | 'expense';
  onAdd: (item: { name: string; amount: number; category?: string }) => void;
  categories?: string[];
}

const BudgetItemForm: React.FC<BudgetItemFormProps> = ({
  type,
  onAdd,
  categories = [],
}) => {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [amountFormatted, setAmountFormatted] = useState<string>('');
  const [category, setCategory] = useState<string>(categories[0] || '');
  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removeCommas(e.target.value);
    if (value === '') {
      setAmount(0);
      setAmountFormatted('');
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setAmount(numValue);
        setAmountFormatted(formatNumber(numValue));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('항목 이름을 입력해주세요');
      return;
    }

    if (amount <= 0) {
      setError('금액은 0보다 커야 합니다');
      return;
    }

    if (type === 'expense' && !category) {
      setError('카테고리를 선택해주세요');
      return;
    }

    // 항목 추가
    onAdd({
      name: name.trim(),
      amount,
      ...(type === 'expense' ? { category } : {}),
    });

    // 폼 초기화
    setName('');
    setAmount(0);
    setAmountFormatted('');
    if (type === 'expense') {
      setCategory(categories[0] || '');
    }
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.budgetItemForm}>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label htmlFor={`${type}-name`}>항목 이름</label>
          <input
            id={`${type}-name`}
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              type === 'income' ? '급여, 부수입 등' : '월세, 식비 등'
            }
            className={styles.formInput}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor={`${type}-amount`}>금액 (원)</label>
          <input
            id={`${type}-amount`}
            type='text'
            value={amountFormatted}
            onChange={handleAmountChange}
            placeholder='0'
            className={styles.formInput}
          />
        </div>

        {type === 'expense' && (
          <div className={styles.inputGroup}>
            <label htmlFor='expense-category'>카테고리</label>
            <div className={styles.selectWrapper}>
              <select
                id='expense-category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.categorySelect}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button type='submit' className={styles.addButton}>
            추가
          </button>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </form>
  );
};

export default BudgetItemForm;
