'use client';

import { useInterests } from '../../hooks/useInterests';
import styles from './ExploreInterests.module.css';

export function ExploreInterests() {
  const { interests, isLoading } = useInterests();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Explore Your Interests</div>
      </div>
      
      {isLoading ? (
        <div className={styles.emptyState}>Loading interests...</div>
      ) : interests.length > 0 ? (
        <div className={styles.grid}>
          {interests.map((interest) => (
            <div key={interest.label} className={styles.card}>
              <div className={styles.cardContent}>
                <span className={styles.label}>{interest.label}</span>
              </div>
              <span className={styles.arrow}>&gt;</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          You have no saved interests yet. Head over to your profile to add some topics you&apos;d like to explore!
        </div>
      )}
    </div>
  );
}
