'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { StatCard } from '@/components/dashboard/stat-card';
import { ChatCard } from '@/components/dashboard/chat-card';
import { ScheduleList } from '@/components/dashboard/schedule-list';
import { userNav } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DashboardData {
  patient: { name: string; username: string };
  stats: {
    totalConsultations: number;
    scheduledConsultations: number;
    completedConsultations: number;
    cancelledConsultations: number;
  };
  upcomingAppointments: Array<{
    id: number; scheduled_date: string; scheduled_time: string; duration_minutes: number;
    meeting_link: string; status: string; notes: string; doctor_name: string;
    specialization: string; doctor_picture: string | null; institution_name: string;
  }>;
  recentArticles: Array<{
    id: number; title: string; content: string; category: string; thumbnail_url: string | null;
    views_count: number; created_at: string; author_name: string;
    author_specialization: string | null; institution_name: string;
  }>;
  pendingInvitations: Array<{
    id: number; invitee_email: string; status: string; sent_at: string;
    scheduled_date: string; scheduled_time: string; doctor_name: string;
  }>;
}

const habitChecklist = [
  'Reflect on body gratitude journal (10 mins)',
  'Practice breathing ritual shared by wellness coach',
  'Read this week community article',
  'Stay hydrated and track your water intake',
] as const;

export default function UserDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patient/dashboard');
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
      <DashboardShell title="Loading your wellness snapshot..." subtitle="Please wait" breadcrumbs={[{ label: 'User' }, { label: 'Dashboard' }]} navItems={userNav}>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#523329] border-t-transparent"></div>
        </div>
      </DashboardShell>
    );
  }

  if (error || !data) {
    return (
      <DashboardShell title="Error loading dashboard" subtitle="Please try again" breadcrumbs={[{ label: 'User' }, { label: 'Dashboard' }]} navItems={userNav}>
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{error || 'Failed to load dashboard data'}</p>
          <Button onClick={fetchDashboardData} className="mt-4">Retry</Button>
        </div>
      </DashboardShell>
    );
  }

  const userStats = [
    { label: 'Total Sessions', value: data.stats.totalConsultations.toString(), trend: data.stats.totalConsultations > 0 ? 'up' : undefined },
    { label: 'Upcoming', value: data.stats.scheduledConsultations.toString(), trend: data.stats.scheduledConsultations > 0 ? 'up' : undefined },
    { label: 'Completed', value: data.stats.completedConsultations.toString(), trend: 'stable' },
  ];

  const formattedAppointments = data.upcomingAppointments.map((apt) => {
    const startTime = new Date(`2000-01-01T${apt.scheduled_time}`);
    const endTime = new Date(startTime.getTime() + (apt.duration_minutes || 30) * 60000);
    const timeRange = `${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    
    return {
      title: `Session with ${apt.doctor_name}`,
      date: new Date(apt.scheduled_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: timeRange,
      duration: `${apt.duration_minutes || 30} min`,
      specialist: apt.specialization,
      status: apt.status,
      meeting_link: apt.meeting_link,
    };
  });

  return (
    <DashboardShell
      title={`Hi ${data.patient.name}, here's your wellness snapshot`}
      subtitle="Track your body confidence journey, access support, and stay consistent."
      breadcrumbs={[{ label: 'User' }, { label: 'Dashboard' }]}
      navItems={userNav}
    >
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {userStats.map((stat) => <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend as any} />)}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="text-sm font-semibold text-[#3a2218]">Today&apos;s wellbeing focus</h3>
          <ul className="mt-5 space-y-3 text-sm text-[#4b3125]">
            {habitChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl bg-[#f9f0e6] px-3 py-2">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border border-[#d7c6ba] text-[#6a4a3a] focus:ring-[#d6b28f]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <ChatCard heading="BodyWise Coach" messages={[
          { from: 'coach', message: 'Welcome to your wellness journey! Check your upcoming appointments below.', time: '09:12' },
          { from: 'user', message: 'Thank you! Looking forward to my sessions.', time: '09:14' },
        ]} />
      </section>

      {formattedAppointments.length > 0 ? (
        <ScheduleList heading="Upcoming appointments" items={formattedAppointments} />
      ) : (
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-8 text-center shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="mb-2 text-lg font-semibold text-[#3a2218]">No upcoming appointments</h3>
          <p className="mb-4 text-sm text-[#6a4a3a]">Book your first session with a verified wellness professional</p>
          <Link href="/user/doctors"><Button variant="secondary">Find Doctors</Button></Link>
        </div>
      )}

      {data.recentArticles.length > 0 && (
        <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#3a2218]">Latest Articles & Wellness Tips</h3>
            <Link href="/education" className="text-sm font-medium text-[#6a4a3a] hover:text-[#523329]">View all →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.recentArticles.map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <div className="mb-3 overflow-hidden rounded-2xl bg-[#f9f0e6]">
                  {article.thumbnail_url ? (
                    <img src={article.thumbnail_url} alt={article.title} className="h-40 w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="flex h-40 items-center justify-center"><span className="text-4xl text-[#6a4a3a]">Education</span></div>
                  )}
                </div>
                <span className="mb-1 inline-block rounded-full bg-[#f0d5b8]/80 px-3 py-1 text-xs font-semibold text-[#6a4a3a]">{article.category}</span>
                <h4 className="mb-1 text-sm font-semibold text-[#3a2218] line-clamp-2">{article.title}</h4>
                <p className="text-xs text-[#80685b]">By {article.author_name} {article.author_specialization && `• ${article.author_specialization}`}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-[#e6d8ce] bg-gradient-to-br from-[#f9f0e6] to-[#f0d5b8]/50 p-8 text-center shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
        <h3 className="mb-2 text-lg font-semibold text-[#3a2218]">Share Your Story</h3>
        <p className="mb-4 text-sm text-[#6a4a3a]">Help others on their wellness journey by sharing your experience with BodyWise</p>
        <Link href="/testimonials"><Button variant="secondary">Share Testimonial</Button></Link>
      </section>
    </DashboardShell>
  );
}
