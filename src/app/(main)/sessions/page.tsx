'use client';

import Link from 'next/link';
import { useSessions } from '@/features/sessions/hooks/useSessions';
import { SESSION_STATUS_LABELS } from '@/features/sessions/types';
import type { SessionStatus } from '@/features/sessions/types';
import styles from './Sessions.module.css';

export default function SessionsPage() {
  const { sessions, isLoading, error } = useSessions();

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>My Lessons</h1>
          <p className={styles.subtitle}>All sessions you&apos;ve started or completed.</p>
        </div>
        <Link href="/sessions/new" className={styles.newLink}>
          + New session
        </Link>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          Couldn&apos;t load sessions. Try again in a moment.
        </div>
      )}

      {isLoading ? (
        <p className={styles.subtitle}>Loading sessions…</p>
      ) : sessions.length === 0 ? (
        <div className={styles.empty}>
          No sessions yet.{' '}
          <Link href="/sessions/new" className={styles.newLink}>
            Design your first session
          </Link>
          .
        </div>
      ) : (
        <ul className={styles.list}>
          {sessions.map((s, index) => {
            const status = s.status as SessionStatus | undefined;
            const label = status ? SESSION_STATUS_LABELS[status] : '—';
            const id = s.id;
            if (!id) {
              return (
                <li key={`no-id-${index}`} className={styles.row}>
                  <span className={styles.rowTitle}>{s.title?.trim() || 'Untitled session'}</span>
                  <span className={styles.badge}>{label}</span>
                </li>
              );
            }
            return (
              <li key={id}>
                <Link href={`/sessions/${id}`} className={styles.rowLink}>
                  <span className={styles.rowTitle}>{s.title?.trim() || 'Untitled session'}</span>
                  <span className={styles.badge}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
