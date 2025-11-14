'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'patient' | 'health_professional' | 'institutional_admin' | 'system_admin'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not authenticated, redirect to login
        router.push('/login');
      } else if (!allowedRoles.includes(user.role)) {
        // Authenticated but wrong role, redirect to their dashboard
        const redirectMap = {
          'system_admin': '/admin',
          'health_professional': '/doctor',
          'institutional_admin': '/institution',
          'patient': '/user',
        };
        router.push(redirectMap[user.role]);
      }
    }
  }, [user, isLoading, allowedRoles, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5ebe3]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#523329] border-r-transparent"></div>
          <p className="mt-4 text-sm text-[#6a4a3a]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated or wrong role (will redirect)
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  // User is authenticated and has correct role
  return <>{children}</>;
}
