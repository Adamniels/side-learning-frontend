'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { ActiveSessionCard } from '@/features/sessions/components/ActiveSessionCard/ActiveSessionCard';
import { ExploreInterests } from '@/features/interests/components/ExploreInterests/ExploreInterests';
import styles from './Home.module.css';

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className={styles.container}>
      <header className={styles.welcomeSection}>
        <h1 className={styles.heading}>Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
        <p className={styles.subheading}>Ready to create some amazing lessons with AI!</p>
        <button className={styles.createButton}>Create New Lesson</button>
      </header>

      <div className={styles.pageGridArchitecture}>
        
        {/* Main Area (Spans Left & Center Columns equivalent) */}
        <div className={styles.mainContentArea}>
          <div className={styles.topCardsGrid}>
            <div className={styles.createBanner}>
              <div className={styles.bannerContent}>
                <h2 className={styles.bannerTitle}>Create Your Own Lessons</h2>
                <p className={styles.bannerText}>
                  Harness the power of AI to create personalized lessons that fit your learning goals.
                </p>
              </div>
              <div className={styles.bannerAction}>
                <button className={styles.getStartedButton}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                  </svg>
                  Get Started
                </button>
              </div>
              <img src="/robot-image.png" alt="AI Robot Assistant" className={styles.robotImage} />
            </div>

            <div className={styles.centralColumn}>
              <ActiveSessionCard />
            </div>
          </div>

          <ExploreInterests />
        </div>

        {/* Right Sidebar Column */}
        <aside className={styles.sidebarColumn}>
          <div className={styles.emptyStatsWidget}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--foreground)'}}>Your Learning Stats</h3>
            <div style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', padding: '2rem 1rem', textAlign: 'center', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
              No stats available yet.
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
