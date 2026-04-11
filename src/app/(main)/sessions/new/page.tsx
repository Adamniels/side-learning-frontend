'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card/Card';
import { useSessionDesignJobFlow } from '@/features/sessions/hooks/useSessionDesignJobFlow';
import styles from './CreateSession.module.css';

function statusMessage(pollStatus: string | null, showLongWaitHint: boolean) {
  if (pollStatus === 'queued') {
    return { primary: 'Your session is queued…', secondary: null as string | null };
  }
  if (pollStatus === 'running') {
    return {
      primary: 'Designing your session…',
      secondary: showLongWaitHint ? 'Still working on it — almost there.' : null,
    };
  }
  return { primary: 'Checking status…', secondary: null as string | null };
}

export default function CreateSessionPage() {
  const { phase, pollStatus, errorMessage, showLongWaitHint, start, tryAgain } =
    useSessionDesignJobFlow();

  const isBusy = phase === 'creating' || phase === 'polling';
  const { primary: statusPrimary, secondary: statusSecondary } =
    phase === 'polling' ? statusMessage(pollStatus, showLongWaitHint) : { primary: '', secondary: null };

  return (
    <div className={styles.page}>
      <Card className={`${styles.card}`}>
        <CardHeader>
          <CardTitle>Create session</CardTitle>
          <CardDescription>
            We are designing your session — this usually takes a few seconds. When you&apos;re ready,
            start the process below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {phase === 'failed' && errorMessage && (
            <div className={styles.errorAlert} role="alert">
              {errorMessage}
            </div>
          )}

          {phase === 'succeeded' && (
            <div className={styles.successPanel}>
              <p className={styles.successText}>
                We&apos;ll notify you when your session is done and ready for you. You can find all
                your sessions in the <strong>My Lessons</strong> tab.
              </p>
              <Link href="/sessions" className={styles.sessionLink}>
                Go to My Lessons →
              </Link>
            </div>
          )}

          {isBusy && (
            <div className={styles.statusBlock}>
              {phase === 'creating' ? (
                <p className={styles.statusPrimary}>Starting…</p>
              ) : (
                <>
                  <p className={styles.statusPrimary}>{statusPrimary}</p>
                  {statusSecondary && <p className={styles.statusSecondary}>{statusSecondary}</p>}
                </>
              )}
            </div>
          )}
        </CardContent>

        {(phase === 'idle' || phase === 'failed' || isBusy) && (
          <CardFooter className={styles.footer}>
            {(phase === 'idle' || phase === 'failed') && (
              <Button
                type="button"
                className={styles.primaryBtn}
                onClick={phase === 'failed' ? tryAgain : () => void start()}
              >
                {phase === 'failed' ? 'Try again' : 'Start designing'}
              </Button>
            )}
            {isBusy && (
              <Button type="button" className={styles.primaryBtn} disabled isLoading>
                Designing session
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
