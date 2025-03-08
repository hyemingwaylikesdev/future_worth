import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href='/'>
            <Image
              src='/logo.svg'
              alt='미래가치 계산기 로고'
              width={40}
              height={40}
            />
            <span className={styles.logoText}>금융 계산기</span>
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href='/' className={styles.navLink}>
            홈
          </Link>
          <Link href='/about' className={styles.navLink}>
            금융 지식
          </Link>
          <Link href='/tools' className={styles.navLink}>
            유용한 도구
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
