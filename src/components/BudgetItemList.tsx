import React from 'react';
import styles from '../app/page.module.css';
import { IncomeItem, ExpenseItem } from '../utils/budget-calculator';

interface BudgetItemListProps {
  type: 'income' | 'expense';
  items: (IncomeItem | ExpenseItem)[];
  onRemove: (id: string) => void;
}

const BudgetItemList: React.FC<BudgetItemListProps> = ({
  type,
  items,
  onRemove,
}) => {
  if (items.length === 0) {
    return (
      <div className={styles.emptyList}>
        {type === 'income' ? '수입' : '지출'} 항목이 없습니다. 항목을
        추가해주세요.
      </div>
    );
  }

  return (
    <div className={styles.budgetItemList}>
      <div className={styles.listHeader}>
        <div className={styles.itemName}>항목</div>
        <div className={styles.itemAmount}>금액</div>
        {type === 'expense' && (
          <div className={styles.itemCategory}>카테고리</div>
        )}
        <div className={styles.itemAction}>삭제</div>
      </div>

      {items.map((item) => (
        <div key={item.id} className={styles.listItem}>
          <div className={styles.itemName}>{item.name}</div>
          <div className={styles.itemAmount}>
            {item.amount.toLocaleString()} 원
          </div>
          {type === 'expense' && (
            <div className={styles.itemCategory}>
              {(item as ExpenseItem).category}
            </div>
          )}
          <div className={styles.itemAction}>
            <button
              className={styles.removeButton}
              onClick={() => onRemove(item.id)}
              aria-label='항목 삭제'>
              ×
            </button>
          </div>
        </div>
      ))}

      <div className={styles.listFooter}>
        <div className={styles.itemName}>합계</div>
        <div className={styles.itemAmount}>
          {items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}{' '}
          원
        </div>
        {type === 'expense' && <div className={styles.itemCategory}></div>}
        <div className={styles.itemAction}></div>
      </div>
    </div>
  );
};

export default BudgetItemList;
