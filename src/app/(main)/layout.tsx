'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import styles from './layout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div className="container" style={{ padding: '2rem' }}>Loading application...</div>;
  }

  if (!isAuthenticated && !isLoading) {
    // Fallback UI while redirect is being applied.
    return null;
  }

  // Get the first initial for the avatar
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div>
      <nav className={styles.navbar}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span className={styles.brandName}>Side Learning</span>
          </div>
          <div className={styles.navLinks}>
            <Link 
              href="/home" 
              className={`${styles.navLink} ${pathname.startsWith('/home') ? styles.navLinkActive : ''}`}
            >
              Home
            </Link>
            <Link href="#" className={styles.navLink}>My Lessons</Link>
            <Link href="#" className={styles.navLink}>Browse</Link>
            <Link href="#" className={styles.navLink}>Activity</Link>
          </div>
        </div>

        <div className={styles.navRight}>
          <button className={styles.iconButton} aria-label="Search">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 111 6.65a7.5 7.5 0 0115.65 10z"></path></svg>
          </button>
          <button className={styles.iconButton} aria-label="Notifications">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405C18.21 14.79 18 13.91 18 13V9a6 6 0 00-9.33-5 5.98 5.98 0 00-2.67 5v4c0 .91-.21 1.79-.595 2.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          <div className={styles.userProfile} onClick={() => logout()}>
            <div className={styles.avatar}>{initial}</div>
            <span className={styles.userProfileName}>{user?.name?.split(' ')[0] || 'User'}</span>
          </div>
        </div>
      </nav>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
