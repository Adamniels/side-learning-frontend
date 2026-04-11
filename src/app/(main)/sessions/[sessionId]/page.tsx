'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSessionDetail } from '@/features/sessions/hooks/useSessionDetail';
import { SESSION_STATUS_LABELS } from '@/features/sessions/types';
import type { SessionReflectionDto, SessionStatus } from '@/features/sessions/types';
import styles from './SessionDetail.module.css';

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Very easy',
  2: 'Easy',
  3: 'About right',
  4: 'Hard',
  5: 'Very hard',
};

function hasReflectionContent(r: SessionReflectionDto | undefined | null): boolean {
  if (!r) return false;
  return Boolean(
    (r.solution && r.solution.trim()) ||
      (r.reflection && r.reflection.trim()) ||
      (r.notes && r.notes.trim()) ||
      r.difficultyFeedback != null
  );
}

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId : undefined;
  const { session, isLoading, error } = useSessionDetail(sessionId);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Link href="/sessions" className={styles.back}>
          ← My Lessons
        </Link>
        <p className={styles.meta}>Loading session…</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className={styles.page}>
        <Link href="/sessions" className={styles.back}>
          ← My Lessons
        </Link>
        <div className={styles.error} role="alert">
          {error?.message || 'Session could not be loaded.'}
        </div>
      </div>
    );
  }

  const status = session.status as SessionStatus | undefined;
  const statusLabel = status ? SESSION_STATUS_LABELS[status] : '—';
  const ctx = session.context;
  const handsOn = session.handsOn;
  const reflection = session.reflection;
  const areas = session.subjectAreas?.filter(Boolean) ?? [];
  const duration = session.estimatedDurationInMinutes;

  return (
    <div className={styles.page}>
      <Link href="/sessions" className={styles.back}>
        ← My Lessons
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{session.title?.trim() || 'Untitled session'}</h1>
        <span className={styles.badge}>{statusLabel}</span>
      </header>

      {duration != null && (
        <p className={styles.meta}>About {duration} minutes</p>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Summary</h2>
        <p className={styles.body}>{session.summary?.trim() || '—'}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Goal</h2>
        <p className={styles.body}>{session.goal?.trim() || '—'}</p>
      </section>

      {areas.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Subject areas</h2>
          <div className={styles.chips}>
            {areas.map((a) => (
              <span key={a} className={styles.chip}>
                {a}
              </span>
            ))}
          </div>
        </section>
      )}

      {ctx && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Context</h2>
          <p className={styles.body}>{ctx.explanation?.trim() || '—'}</p>
          {ctx.whyItMatters?.trim() && (
            <>
              <h3 className={styles.sectionTitle} style={{ marginTop: '1rem' }}>
                Why it matters
              </h3>
              <p className={styles.body}>{ctx.whyItMatters}</p>
            </>
          )}
          {ctx.youtubeUrl?.trim() && (
            <p className={styles.body} style={{ marginTop: '0.75rem' }}>
              <a href={ctx.youtubeUrl} target="_blank" rel="noopener noreferrer">
                Video link
              </a>
            </p>
          )}
          {ctx.additionalResources?.trim() && (
            <>
              <h3 className={styles.sectionTitle} style={{ marginTop: '1rem' }}>
                Additional resources
              </h3>
              <p className={`${styles.body} ${styles.preWrap}`}>{ctx.additionalResources}</p>
            </>
          )}
        </section>
      )}

      {handsOn && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Hands-on</h2>
          <p className={`${styles.body} ${styles.preWrap}`}>
            {handsOn.instructions?.trim() || '—'}
          </p>
          {handsOn.expectedOutput?.trim() && (
            <>
              <h3 className={styles.sectionTitle} style={{ marginTop: '1rem' }}>
                Expected output
              </h3>
              <p className={`${styles.body} ${styles.preWrap}`}>{handsOn.expectedOutput}</p>
            </>
          )}
        </section>
      )}

      {session.extension?.trim() && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Go further</h2>
          <p className={styles.body}>{session.extension}</p>
        </section>
      )}

      {hasReflectionContent(reflection) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Reflection</h2>
          {reflection?.solution?.trim() && (
            <p className={`${styles.body} ${styles.preWrap}`}>{reflection.solution}</p>
          )}
          {reflection?.reflection?.trim() && (
            <p className={`${styles.body} ${styles.preWrap}`} style={{ marginTop: '0.75rem' }}>
              {reflection.reflection}
            </p>
          )}
          {reflection?.notes?.trim() && (
            <p className={`${styles.body} ${styles.preWrap}`} style={{ marginTop: '0.75rem' }}>
              {reflection.notes}
            </p>
          )}
          {reflection?.difficultyFeedback != null && (
            <p className={styles.body} style={{ marginTop: '0.75rem' }}>
              Difficulty:{' '}
              {DIFFICULTY_LABELS[reflection.difficultyFeedback] ?? reflection.difficultyFeedback}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
