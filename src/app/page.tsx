'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import Header from '../components/Header';

interface CalculatorCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
}

export default function HomePage() {
  const calculators: CalculatorCard[] = [
    {
      id: 'future-worth',
      title: '미래가치 계산기',
      description: '초기 투자금과 정기 적립금의 미래 가치를 계산합니다.',
      icon: '/icons/chart-up.svg',
      path: '/calculators/future-worth',
    },
    {
      id: 'compound-interest',
      title: '예금/적금 계산기',
      description:
        '예금(초기 금액)과 적금(월 적립금)을 입력하여 미래 가치를 계산합니다.',
      icon: '/icons/percentage.svg',
      path: '/calculators/compound-interest',
    },
    {
      id: 'loan-payment',
      title: '대출 상환 계산기',
      description: '대출 상환 계획과 월 납입금을 계산합니다.',
      icon: '/icons/money.svg',
      path: '/calculators/loan-payment',
    },
    {
      id: 'retirement',
      title: '퇴직 자금 계산기',
      description: '은퇴를 위해 필요한 저축액을 계산합니다.',
      icon: '/icons/calendar.svg',
      path: '/calculators/retirement',
    },
    {
      id: 'budget',
      title: '예산 계획 계산기',
      description: '수입과 지출을 기반으로 예산을 계획합니다.',
      icon: '/icons/wallet.svg',
      path: '/calculators/budget',
    },
    {
      id: 'tax',
      title: '세금 계산기',
      description: '소득세 및 기타 세금을 계산합니다.',
      icon: '/icons/document.svg',
      path: '/calculators/tax',
    },
  ];

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>금융 계산기 모음</h1>
              <p className={styles.subtitle}>
                다양한 금융 계산기를 이용하여 재무 계획을 세워보세요
              </p>
            </div>

            <div className={styles.calculatorGrid}>
              {calculators.map((calc) => (
                <Link
                  href={calc.path}
                  key={calc.id}
                  className={styles.calculatorLink}>
                  <div className={styles.calculatorItem}>
                    <div className={styles.calculatorIcon}>
                      <Image
                        src={calc.icon}
                        alt={`${calc.title} 아이콘`}
                        width={32}
                        height={32}
                      />
                    </div>
                    <h2 className={styles.calculatorTitle}>{calc.title}</h2>
                    <p className={styles.calculatorDescription}>
                      {calc.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <footer className={styles.footer}>
          <a
            href='https://github.com/hyemingwaylikesdev/future_worth'
            target='_blank'
            rel='noopener noreferrer'>
            <Image
              aria-hidden
              src='/icons/github.svg'
              alt='GitHub 아이콘'
              width={16}
              height={16}
            />
            GitHub
          </a>
        </footer>
      </div>
    </>
  );
}
