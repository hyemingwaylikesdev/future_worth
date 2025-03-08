'use client';

import React from 'react';
import styles from '../page.module.css';
import Header from '../../components/Header';

export default function FinancialKnowledge() {
  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>금융 지식</h1>
              <p className={styles.subtitle}>
                현명한 투자를 위한 기본 개념과 팁을 알아보세요
              </p>
            </div>

            <div className={styles.contentCard}>
              <h2 className={styles.sectionTitle}>복리의 힘</h2>
              <p className={styles.paragraph}>
                복리는 '이자에 이자가 붙는' 현상으로, 장기 투자의 가장 강력한
                도구입니다. 아인슈타인은 복리를 '세상에서 가장 강력한 힘'이라고
                표현했습니다.
              </p>
              <p className={styles.paragraph}>
                예를 들어, 연 10%의 수익률로 투자한 1,000만원은 7.2년 후에 약
                2,000만원이 됩니다(72법칙). 이는 시간이 지날수록 수익이
                기하급수적으로 증가함을 의미합니다.
              </p>
            </div>

            <div className={styles.contentCard}>
              <h2 className={styles.sectionTitle}>분산 투자의 중요성</h2>
              <p className={styles.paragraph}>
                '모든 달걀을 한 바구니에 담지 마라'는 격언처럼, 투자 위험을
                줄이기 위해 다양한 자산에 분산 투자하는 것이 중요합니다.
              </p>
              <p className={styles.paragraph}>
                주식, 채권, 부동산, 현금성 자산 등 다양한 자산 클래스에 투자하면
                한 자산의 가치가 하락하더라도 전체 포트폴리오의 손실을 최소화할
                수 있습니다.
              </p>
            </div>

            <div className={styles.contentCard}>
              <h2 className={styles.sectionTitle}>장기 투자의 이점</h2>
              <p className={styles.paragraph}>
                시장 타이밍을 맞추려는 시도보다 장기적인 투자 전략이 더
                효과적입니다. 역사적으로 주식 시장은 단기적으로 변동성이 있지만
                장기적으로는 상승하는 경향이 있습니다.
              </p>
              <p className={styles.paragraph}>
                정기적인 투자와 복리의 효과를 통해 시간이 지날수록 자산은 더
                빠르게 성장합니다.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
