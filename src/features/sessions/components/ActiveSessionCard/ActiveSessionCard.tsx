'use client';

import { useSessions } from '../../hooks/useSessions';
import { SESSION_STATUS_LABELS } from '../../types';
import styles from './ActiveSessionCard.module.css';

export function ActiveSessionCard() {
  const { sessions, isLoading, error } = useSessions();

  // Find the first session that isn't completed, if any
  const activeSession = sessions.find((s) => s.status === 1 || s.status === 2 || s.status === 3);
  const activeStatusLabel = activeSession?.status
    ? SESSION_STATUS_LABELS[activeSession.status]
    : undefined;

  return (
    <div className={styles.card}>
      <div className={styles.title}>Continue Your Progress</div>
      
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.emptyState}>Loading active lessons...</div>
        ) : error ? (
          <div className={styles.emptyState}>
            We couldn&apos;t load your lessons right now. Please try again in a moment.
          </div>
        ) : activeSession ? (
          <>
            <div>
              <div className={styles.sessionTitle}>Active Lesson: {activeSession.title ?? 'Untitled lesson'}</div>
              <div className={styles.sessionSubtitle}>Session status: {activeStatusLabel ?? 'Unknown'}</div>
            </div>
            
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                {/* Fallback progress visual, since we don't have progress % in SessionDto right now */}
                <div className={styles.progressFill} style={{ width: '40%' }}></div>
              </div>
              <div className={styles.progressText}>40% Complete</div>
              <button className={styles.resumeButton}>Resume &gt;</button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            No active lessons currently. 
            <br/> 
            Create a new lesson to get started!
          </div>
        )}
      </div>
    </div>
  );
}
