'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../page.module.css';
import Header from '../../../components/Header';
import BudgetItemForm from '../../../components/BudgetItemForm';
import BudgetItemList from '../../../components/BudgetItemList';
import BudgetSummary from '../../../components/BudgetSummary';
import CategoryChart from '../../../components/CategoryChart';
import {
  IncomeItem,
  ExpenseItem,
  calculateBudget,
  BudgetCalculationResult,
} from '../../../utils/budget-calculator';

// 기본 지출 카테고리
const DEFAULT_EXPENSE_CATEGORIES = [
  '주거',
  '식비',
  '교통',
  '통신',
  '의료',
  '교육',
  '여가',
  '의류',
  '기타',
];

export default function BudgetCalculator() {
  // 상태 관리
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [budgetResult, setBudgetResult] =
    useState<BudgetCalculationResult | null>(null);

  // 예산 계산 결과 업데이트
  useEffect(() => {
    const result = calculateBudget(incomeItems, expenseItems);
    setBudgetResult(result);
  }, [incomeItems, expenseItems]);

  // 수입 항목 추가
  const addIncomeItem = (item: { name: string; amount: number }) => {
    const newItem: IncomeItem = {
      id: uuidv4(),
      name: item.name,
      amount: item.amount,
    };
    setIncomeItems([...incomeItems, newItem]);
  };

  // 지출 항목 추가
  const addExpenseItem = (item: {
    name: string;
    amount: number;
    category?: string;
  }) => {
    const newItem: ExpenseItem = {
      id: uuidv4(),
      name: item.name,
      amount: item.amount,
      category: item.category || DEFAULT_EXPENSE_CATEGORIES[0],
    };
    setExpenseItems([...expenseItems, newItem]);
  };

  // 수입 항목 삭제
  const removeIncomeItem = (id: string) => {
    setIncomeItems(incomeItems.filter((item) => item.id !== id));
  };

  // 지출 항목 삭제
  const removeExpenseItem = (id: string) => {
    setExpenseItems(expenseItems.filter((item) => item.id !== id));
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>예산 계획 계산기</h1>
              <p className={styles.subtitle}>
                수입과 지출을 입력하여 예산을 계획해보세요
              </p>
            </div>

            <div className={styles.calculatorCard}>
              {/* 탭 메뉴 */}
              <div className={styles.tabContainer}>
                <div
                  className={`${styles.tab} ${
                    activeTab === 'income' ? styles.active : ''
                  }`}
                  onClick={() => setActiveTab('income')}>
                  수입
                </div>
                <div
                  className={`${styles.tab} ${
                    activeTab === 'expense' ? styles.active : ''
                  }`}
                  onClick={() => setActiveTab('expense')}>
                  지출
                </div>
              </div>

              {/* 수입 탭 */}
              {activeTab === 'income' && (
                <div>
                  <h2>수입 항목</h2>
                  <BudgetItemForm type='income' onAdd={addIncomeItem} />
                  <BudgetItemList
                    type='income'
                    items={incomeItems}
                    onRemove={removeIncomeItem}
                  />
                </div>
              )}

              {/* 지출 탭 */}
              {activeTab === 'expense' && (
                <div>
                  <h2>지출 항목</h2>
                  <BudgetItemForm
                    type='expense'
                    onAdd={addExpenseItem}
                    categories={DEFAULT_EXPENSE_CATEGORIES}
                  />
                  <BudgetItemList
                    type='expense'
                    items={expenseItems}
                    onRemove={removeExpenseItem}
                  />
                </div>
              )}
            </div>

            {/* 예산 요약 및 차트 */}
            {budgetResult &&
              (incomeItems.length > 0 || expenseItems.length > 0) && (
                <div className={styles.resultCard}>
                  <h2>예산 요약</h2>

                  <BudgetSummary result={budgetResult} />

                  {expenseItems.length > 0 && (
                    <CategoryChart
                      expensesByCategory={budgetResult.expensesByCategory}
                      categoryPercentages={budgetResult.categoryPercentages}
                      totalExpenses={budgetResult.totalExpenses}
                    />
                  )}

                  <div className={styles.budgetTipsCard}>
                    <h3 className={styles.tipsTitle}>예산 관리 팁</h3>
                    <ul className={styles.tipsList}>
                      <li className={styles.tipItem}>
                        <span className={styles.tipIcon}>💰</span>
                        <div className={styles.tipContent}>
                          <strong>50-30-20 규칙:</strong> 수입의 50%는 필수
                          지출, 30%는 개인 지출, 20%는 저축에 할당하세요.
                        </div>
                      </li>
                      <li className={styles.tipItem}>
                        <span className={styles.tipIcon}>📈</span>
                        <div className={styles.tipContent}>
                          <strong>저축률 목표:</strong> 저축률은 최소 20% 이상을
                          목표로 하세요.
                        </div>
                      </li>
                      <li className={styles.tipItem}>
                        <span className={styles.tipIcon}>🛡️</span>
                        <div className={styles.tipContent}>
                          <strong>비상금 확보:</strong> 최소 3-6개월치의
                          생활비를 비상금으로 확보하는 것이 좋습니다.
                        </div>
                      </li>
                      <li className={styles.tipItem}>
                        <span className={styles.tipIcon}>✂️</span>
                        <div className={styles.tipContent}>
                          <strong>고정 지출 줄이기:</strong> 고정 지출을 줄이면
                          장기적으로 더 많은 저축이 가능합니다.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
          </div>
        </main>
      </div>
    </>
  );
}
