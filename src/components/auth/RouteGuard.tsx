import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang = 'eng' } = useParams();
  const lastNav = React.useRef<string | null>(null);

  useEffect(() => {
    if (loading) {
      lastNav.current = null; // Reset on load
      return;
    }

    const path = location.pathname;
    const isAuthPage = path.includes('/login') || path.includes('/register');
    const isRootPath = path === `/${lang}` || path === `/${lang}/` || path === '/' || path === `/${lang}/dashboard`;
    const isWaitlistPath = path.includes('/dashboard/welcome-waitlist');

    // 1. No Session -> Redirect to Login (unless on auth page)
    if (!user) {
      if (!isAuthPage && path !== '/' && !path.startsWith(`/${lang}/info`)) {
        const loginPath = `/${lang}/login`;
        if (path !== loginPath && lastNav.current !== loginPath) {
          lastNav.current = loginPath;
          navigate(loginPath, { replace: true });
        }
      }
      return;
    }

    // 2. VISITOR (Unfinished Onboarding) -> Redirect to Registration Flow
    if (user.registrationStatus === 'VISITOR' || !user.isOnboarded) {
      if (!isAuthPage) {
        const loginPath = `/${lang}/login`;
        if (path !== loginPath && lastNav.current !== loginPath) {
          lastNav.current = loginPath;
          navigate(loginPath, { replace: true });
        }
      }
      return;
    }

    // 3. PENDING (Awaiting Activation) -> Redirect to Waitlist
    if (user.registrationStatus === 'PENDING') {
      if (!isWaitlistPath) {
        const waitlistPath = `/${lang}/dashboard/welcome-waitlist`;
        if (path !== waitlistPath && lastNav.current !== waitlistPath) {
          lastNav.current = waitlistPath;
          navigate(waitlistPath, { replace: true });
        }
      }
      return;
    }

    // 4. ACTIVE (Fully Activated) -> Verification Check
    if (user.registrationStatus === 'ACTIVE') {
      const isVerifyPath = path.includes('/verify');
      
      if (!user.isVerified) {
        if (!isVerifyPath) {
          const verifyPath = `/${lang}/verify`;
          if (path !== verifyPath && lastNav.current !== verifyPath) {
            lastNav.current = verifyPath;
            navigate(verifyPath, { replace: true });
          }
        }
        return;
      }

      // 5. Fully Verified -> Semantic Sector Routing
      // Prevent loop or redundant waitlist/verify access
      if (isWaitlistPath || isRootPath || isAuthPage || isVerifyPath) {
        const sector = user.selectedPath || 'ACADEMY';
        const prefix = sector === 'ACADEMY' ? 'aca' : sector.toLowerCase();
        const targetSectorPath = `/${prefix}/${lang}`;
        if (path !== targetSectorPath && lastNav.current !== targetSectorPath) {
          lastNav.current = targetSectorPath;
          navigate(targetSectorPath, { replace: true });
        }
      }
    }

  }, [user, loading, location.pathname, navigate, lang]);

  if (loading) return null;

  return <>{children}</>;
}
