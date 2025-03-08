'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../page.module.css';
import Header from '../../components/Header';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  isExternal: boolean;
}

export default function ToolsPage() {
  const tools: Tool[] = [
    {
      id: 'calculators',
      title: '금융 계산기 모음',
      description: '다양한 금융 계산기를 이용하여 재무 계획을 세워보세요.',
      icon: '/icons/calculator.svg',
      url: '/',
      isExternal: false,
    },
    {
      id: 'stock-screener',
      title: '주식 스크리너',
      description: '다양한 조건으로 주식을 검색하고 분석할 수 있는 도구입니다.',
      icon: '/icons/search.svg',
      url: 'https://finance.yahoo.com/screener/',
      isExternal: true,
    },
    {
      id: 'economic-calendar',
      title: '경제 캘린더',
      description: '주요 경제 지표 발표 일정을 확인할 수 있습니다.',
      icon: '/icons/calendar-check.svg',
      url: 'https://www.investing.com/economic-calendar/',
      isExternal: true,
    },
    {
      id: 'dividend-tracker',
      title: '배당금 트래커',
      description: '보유 주식의 배당금을 추적하고 관리할 수 있는 도구입니다.',
      icon: '/icons/chart-pie.svg',
      url: 'https://www.dividendchannel.com/',
      isExternal: true,
    },
  ];

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>유용한 금융 도구</h1>
              <p className={styles.subtitle}>
                투자와 재무 관리에 도움이 되는 다양한 도구들을 소개합니다
              </p>
            </div>

            <div className={styles.toolsGrid}>
              {tools.map((tool) => (
                <div key={tool.id} className={styles.toolCard}>
                  {tool.isExternal ? (
                    <a
                      href={tool.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={styles.toolLink}>
                      <div className={styles.toolIcon}>
                        <Image
                          src={tool.icon}
                          alt={`${tool.title} 아이콘`}
                          width={32}
                          height={32}
                        />
                      </div>
                      <h2 className={styles.toolTitle}>{tool.title}</h2>
                      <p className={styles.toolDescription}>
                        {tool.description}
                      </p>
                      <div className={styles.externalLinkIndicator}>
                        <Image
                          src='/icons/external-link.svg'
                          alt='외부 링크'
                          width={16}
                          height={16}
                        />
                      </div>
                    </a>
                  ) : (
                    <Link href={tool.url} className={styles.toolLink}>
                      <div className={styles.toolIcon}>
                        <Image
                          src={tool.icon}
                          alt={`${tool.title} 아이콘`}
                          width={32}
                          height={32}
                        />
                      </div>
                      <h2 className={styles.toolTitle}>{tool.title}</h2>
                      <p className={styles.toolDescription}>
                        {tool.description}
                      </p>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
