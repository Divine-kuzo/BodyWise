'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { StatCard } from '@/components/dashboard/stat-card';
import { institutionNav } from '@/lib/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DashboardData {
  institution?: {
    id: number;
    name: string;
    verification_status: string;
  };
  admin?: {
    id: number;
    full_name: string;
  };
  stats: {
    totalDoctors: number;
    totalDocuments: number;
    pendingApprovals: number;
    activeConsultations: number;
  };
  recentDoctors: Array<{
    id: number;
    full_name: string;
    specialization: string;
    user_id: number;
  }>;
}

export default function InstitutionDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institutional/dashboard');
      
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell
        title="Loading..."
        subtitle="Please wait"
        breadcrumbs={[{ label: 'Institution' }, { label: 'Dashboard' }]}
        navItems={institutionNav}
      >
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#523329] border-t-transparent"></div>
        </div>
      </DashboardShell>
    );
  }

  if (error || !dashboardData) {
    return (
      <DashboardShell
        title="Error loading dashboard"
        subtitle="Please try again"
        breadcrumbs={[{ label: 'Institution' }, { label: 'Dashboard' }]}
        navItems={institutionNav}
      >
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{error || 'Failed to load dashboard data'}</p>
          <Button onClick={fetchDashboardData} className="mt-4">Retry</Button>
        </div>
      </DashboardShell>
    );
  }

  const stats = [
    { label: 'Total Doctors', value: dashboardData.stats.totalDoctors.toString(), trend: 'stable' as const },
    { label: 'Pending Approvals', value: dashboardData.stats.pendingApprovals.toString(), trend: dashboardData.stats.pendingApprovals > 0 ? 'up' as const : 'stable' as const },
    { label: 'Active Consultations', value: dashboardData.stats.activeConsultations.toString(), trend: 'up' as const },
  ];

  return (
    <DashboardShell
      title={dashboardData.institution?.name || 'Institution Dashboard'}
      subtitle="Manage your institution's doctors and documents"
      breadcrumbs={[{ label: 'Institution' }, { label: 'Dashboard' }]}
      navItems={institutionNav}
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-8 shadow-[0_25px_70px_-55px_rgba(58,34,24,0.2)]">
          <h2 className="mb-6 text-xl font-semibold text-[#3a2218]">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/institution/doctors" className="group">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-[#e6d8ce] bg-[#f9f0e6] px-6 py-4 transition-all hover:border-[#523329] hover:shadow-md">
                <span className="text-lg font-semibold text-[#523329]">Manage Doctors</span>
              </div>
            </Link>
            <Link href="/institution/documents" className="group">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-[#e6d8ce] bg-[#f9f0e6] px-6 py-4 transition-all hover:border-[#523329] hover:shadow-md">
                <span className="text-lg font-semibold text-[#523329]">View Documents</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Doctors */}
        {dashboardData?.recentDoctors && dashboardData.recentDoctors.length > 0 && (
          <div className="rounded-3xl border border-[#e6d8ce] bg-white p-8 shadow-[0_25px_70px_-55px_rgba(58,34,24,0.2)]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#3a2218]">Recent Doctors</h2>
              <Link href="/institution/doctors" className="text-sm font-semibold text-[#523329] hover:text-[#3a2218]">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.recentDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#f9f0e6] hover:bg-[#f0e6d8] transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-[#3a2218]">{doctor.full_name}</h3>
                    <p className="text-sm text-[#80685b]">{doctor.specialization}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#80685b]">
                      ID: #{doctor.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification Status */}
        {dashboardData?.institution && (
          <div className="rounded-3xl border border-[#e6d8ce] bg-white p-8 shadow-[0_25px_70px_-55px_rgba(58,34,24,0.2)]">
            <h2 className="mb-4 text-xl font-semibold text-[#3a2218]">Institution Status</h2>
            <div className="flex items-center gap-3">
              <span className="text-[#80685b]">Verification Status:</span>
              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
                dashboardData.institution.verification_status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : dashboardData.institution.verification_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {dashboardData.institution.verification_status.charAt(0).toUpperCase() + 
                 dashboardData.institution.verification_status.slice(1)}
              </span>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
