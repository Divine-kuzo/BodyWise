'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { StatCard } from '@/components/dashboard/stat-card';
import { ScheduleList } from '@/components/dashboard/schedule-list';
import { DataTable } from '@/components/dashboard/data-table';
import { doctorNav } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DashboardData {
  professional: {
    id: number;
    name: string;
    specialization: string;
    institution: string;
    experience: number;
    rating: number;
    total_reviews: number;
  };
  stats: {
    totalConsultations: number;
    scheduledConsultations: number;
    completedConsultations: number;
    cancelledConsultations: number;
    activePatients: number;
    todaysSessions: number;
  };
  todayConsultations: any[];
  upcomingConsultations: any[];
  activePatients: any[];
  recentArticles: any[];
}

export default function DoctorDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/doctor/dashboard');
      
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const result = await response.json();
      setData(result.data);
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
        breadcrumbs={[{ label: 'Doctor' }, { label: 'Dashboard' }]}
        navItems={doctorNav}
      >
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#523329] border-t-transparent"></div>
        </div>
      </DashboardShell>
    );
  }

  if (error || !data) {
    return (
      <DashboardShell
        title="Error loading dashboard"
        subtitle="Please try again"
        breadcrumbs={[{ label: 'Doctor' }, { label: 'Dashboard' }]}
        navItems={doctorNav}
      >
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{error || 'Failed to load dashboard data'}</p>
          <Button onClick={fetchDashboardData} className="mt-4">Retry</Button>
        </div>
      </DashboardShell>
    );
  }

  const stats = [
    { label: 'Total Patients', value: data.stats.activePatients.toString(), trend: 'up' as const },
    { label: 'Today\'s Sessions', value: data.stats.todaysSessions.toString(), trend: 'stable' as const },
    { label: 'Completed', value: data.stats.completedConsultations.toString(), trend: 'up' as const },
  ];

  const upcomingSchedule = data.upcomingConsultations.map(consultation => ({
    title: `Session with ${consultation.patient_name}`,
    date: new Date(consultation.scheduled_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: new Date(`2000-01-01T${consultation.scheduled_time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    specialist: data.professional.specialization,
    status: consultation.status,
    meeting_link: consultation.meeting_link,
  }));

  const patientTableData = data.activePatients.map(patient => ({
    name: patient.full_name || patient.username,
    progress: `${patient.total_sessions} session${patient.total_sessions !== 1 ? 's' : ''}`,
    lastSession: patient.last_session_date 
      ? new Date(patient.last_session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'No sessions yet',
    nextSession: patient.next_session_date
      ? new Date(patient.next_session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'Not scheduled',
  }));

  return (
    <DashboardShell
      title={`Welcome back, Dr. ${data.professional.name.split(' ')[data.professional.name.split(' ').length - 1]}`}
      subtitle="Stay prepared for scheduled sessions, monitor patient progress, and celebrate impact."
      breadcrumbs={[{ label: 'Doctor' }, { label: 'Dashboard' }]}
      navItems={doctorNav}
    >
      {/* Stats */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
          />
        ))}
      </section>

      {/* Profile Summary */}
      <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
        <h3 className="mb-4 text-lg font-semibold text-[#3a2218]">Your Profile</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-[#80685b]">Specialization</p>
            <p className="text-sm font-semibold text-[#3a2218]">{data.professional.specialization}</p>
          </div>
          <div>
            <p className="text-xs text-[#80685b]">Institution</p>
            <p className="text-sm font-semibold text-[#3a2218]">{data.professional.institution}</p>
          </div>
          <div>
            <p className="text-xs text-[#80685b]">Rating</p>
            <p className="text-sm font-semibold text-[#3a2218]">
              {data.professional.rating.toFixed(1)} / 5.0 ({data.professional.total_reviews} reviews)
            </p>
          </div>
          <div>
            <p className="text-xs text-[#80685b]">Experience</p>
            <p className="text-sm font-semibold text-[#3a2218]">{data.professional.experience}+ years</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {patientTableData.length > 0 ? (
          <DataTable
            caption="Active patient focus"
            data={patientTableData}
            columns={[
              { key: 'name', header: 'Patient' },
              { key: 'progress', header: 'Progress' },
              { key: 'lastSession', header: 'Last Session' },
              { key: 'nextSession', header: 'Next Session' },
            ]}
          />
        ) : (
          <div className="rounded-3xl border border-[#e6d8ce] bg-white p-8 text-center">
            <p className="text-sm text-[#6a4a3a]">No active patients yet</p>
          </div>
        )}

        {upcomingSchedule.length > 0 ? (
          <ScheduleList heading="Upcoming sessions" items={upcomingSchedule} />
        ) : (
          <div className="rounded-3xl border border-[#e6d8ce] bg-white p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold text-[#3a2218]">No upcoming sessions</h3>
            <p className="text-sm text-[#6a4a3a]">Your schedule is clear</p>
          </div>
        )}
      </section>

      {/* Recent Articles */}
      {data.recentArticles.length > 0 && (
        <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#3a2218]">Your Recent Articles</h3>
            <Link href="/doctor/profile" className="text-sm font-medium text-[#6a4a3a] hover:text-[#523329]">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentArticles.map((article) => (
              <div key={article.id} className="flex items-center justify-between rounded-2xl bg-[#f9f0e6] p-4">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-[#3a2218]">{article.title}</h4>
                  <p className="text-xs text-[#80685b]">
                    {article.category} • {article.views_count} views
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  article.approval_status === 'approved' 
                    ? 'bg-green-100 text-green-700'
                    : article.approval_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {article.approval_status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </DashboardShell>
  );
}


