'use client';

import { useSessions } from '../../hooks/useSessions';
import { SESSION_STATUS_LABELS } from '../../types';
import styles from './ActiveSessionCard.module.css';

export function ActiveSessionCard() {
  const { sessions, isLoading, error } = useSessions();

  const activeSession = sessions.find((s) => s.status === 1 || s.status === 2 || s.status === 3);
  const activeStatusLabel = activeSession?.status
    ? SESSION_STATUS_LABELS[activeSession.status]
    : undefined;

  return (
    <div className={styles.card}>
      <div className={styles.title}>Continue Learning</div>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.emptyState}>Loading your sessions…</div>
        ) : error ? (
          <div className={styles.emptyState}>
            Couldn&apos;t load sessions right now. Try again in a moment.
          </div>
        ) : activeSession ? (
          <>
            <div className={styles.sessionMeta}>
              <div className={styles.sessionTitle}>{activeSession.title ?? 'Untitled session'}</div>
              {activeStatusLabel && (
                <span className={styles.sessionBadge}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                    <circle cx="4" cy="4" r="4"/>
                  </svg>
                  {activeStatusLabel}
                </span>
              )}
            </div>

            <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>Progress</span>
                <span className={styles.progressPct}>40%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '40%' }} />
              </div>
              <button className={styles.resumeButton}>Resume session →</button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            No active sessions yet.
            <br/>
            Start a new one to begin learning!
          </div>
        )}
      </div>
    </div>
  );
}
