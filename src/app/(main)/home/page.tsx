'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ActiveSessionCard } from '@/features/sessions/components/ActiveSessionCard/ActiveSessionCard';
import { ExploreInterests } from '@/features/interests/components/ExploreInterests/ExploreInterests';
import styles from './Home.module.css';

export default function HomePage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className={styles.container}>
      <header className={styles.welcomeSection}>
        <div className={styles.welcomeText}>
          <h1 className={styles.heading}>
            Welcome back, <span className={styles.headingAccent}>{firstName}</span>
          </h1>
          <p className={styles.subheading}>What would you like to explore today?</p>
        </div>
        <Link href="/sessions/new" className={styles.createButton}>
          + New Session
        </Link>
      </header>

      <div className={styles.pageGridArchitecture}>

        {/* Main content area */}
        <div className={styles.mainContentArea}>
          <div className={styles.topCardsGrid}>

            {/* Create banner */}
            <div className={styles.createBanner}>
              <div className={styles.bannerContent}>
                <h2 className={styles.bannerTitle}>Start a learning session</h2>
                <p className={styles.bannerText}>
                  AI builds a structured 1–2 hour session around any topic you care about.
                </p>
              </div>
              <div className={styles.bannerAction}>
                <Link href="/sessions/new" className={styles.getStartedButton}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Get started
                </Link>
              </div>
              <img src="/robot-image.png" alt="AI assistant" className={styles.robotImage} />
            </div>

            {/* Active session */}
            <div className={styles.centralColumn}>
              <ActiveSessionCard />
            </div>
          </div>

          <ExploreInterests />
        </div>

        {/* Right sidebar */}
        <aside className={styles.sidebarColumn}>
          <div className={styles.emptyStatsWidget}>
            <h3 className={styles.statsWidgetTitle}>Learning Stats</h3>
            <div className={styles.statsEmptyInner}>
              Complete your first session to start tracking progress.
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
