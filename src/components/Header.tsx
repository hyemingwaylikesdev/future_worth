import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image
            src='/logo.svg'
            alt='미래가치 계산기 로고'
            width={40}
            height={40}
          />
          <span className={styles.logoText}>미래가치 계산기</span>
        </div>
        <nav className={styles.nav}>
          <Link href='/' className={styles.navLink}>
            홈
          </Link>
          <Link href='/about' className={styles.navLink}>
            소개
          </Link>
          <Link href='/calculator' className={styles.navLink}>
            계산기
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
