import React from 'react';
import styles from './layout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.contentContainer}>
        {/* We could potentially add a logo or illustration here based on the brand */}
        <div className={styles.brandSection}>
          <h1 className={styles.logo}>SideLearning</h1>
        </div>
        <div className={styles.formSection}>
          {children}
        </div>
      </div>
    </div>
  );
}
