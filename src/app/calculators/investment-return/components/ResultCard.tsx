import React from 'react';
import styles from '../page.module.css';

interface ResultCardProps {
  title: string;
  value: string;
}

export function ResultCard({ title, value }: ResultCardProps) {
  return (
    <div className={styles.resultCard}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
