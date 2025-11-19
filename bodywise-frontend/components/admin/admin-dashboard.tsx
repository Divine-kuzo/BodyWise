'use client';

import { useState, useEffect } from 'react';
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/dashboard/data-table";
import { ActivityList } from "@/components/dashboard/activity-list";
import { SystemMonitor } from "@/components/admin/system-monitor";
import Link from "next/link";

interface AdminStats {
  userCounts: {
    patients: number;
    health_professionals: number;
    institutional_admins: number;
    system_admins: number;
  };
  activeUsers: number;
  consultationStats: {
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
  };
  recentUsers: Array<{
    id: number;
    email: string;
    role: string;
    display_name: string;
    created_at: string;
    is_active: number;
    is_verified: number;
  }>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();
      setStats(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#523329] border-t-transparent mx-auto" />
          <p className="text-sm text-[#6a4a3a]">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-800">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const totalUsers = stats.userCounts.patients + 
                     stats.userCounts.health_professionals + 
                     stats.userCounts.institutional_admins + 
                     stats.userCounts.system_admins;

  const statCards = [
    {
      label: "Total Users",
      value: totalUsers.toString(),
      trend: stats.activeUsers > 0 ? "up" as const : "neutral" as const,
      trendLabel: `${stats.activeUsers} active this week`,
    },
    {
      label: "Health Professionals",
      value: stats.userCounts.health_professionals.toString(),
      trend: "neutral" as const,
      trendLabel: "Verified providers",
    },
    {
      label: "Total Consultations",
      value: stats.consultationStats.total.toString(),
      trend: stats.consultationStats.completed > 0 ? "up" as const : "neutral" as const,
      trendLabel: `${stats.consultationStats.completed} completed`,
    },
    {
      label: "Scheduled Sessions",
      value: stats.consultationStats.scheduled.toString(),
      trend: "neutral" as const,
      trendLabel: "Awaiting completion",
    },
  ];

  // Calculate user growth data
  const userGrowthData = [
    {
      category: "Patients",
      total: stats.userCounts.patients,
      percentage: (stats.userCounts.patients / totalUsers) * 100,
      growth: Math.floor(stats.userCounts.patients * 0.05), // Estimate 5% growth
    },
    {
      category: "Health Professionals",
      total: stats.userCounts.health_professionals,
      percentage: (stats.userCounts.health_professionals / totalUsers) * 100,
      growth: Math.floor(stats.userCounts.health_professionals * 0.03),
    },
    {
      category: "Institutional Admins",
      total: stats.userCounts.institutional_admins,
      percentage: (stats.userCounts.institutional_admins / totalUsers) * 100,
      growth: Math.floor(stats.userCounts.institutional_admins * 0.02),
    },
  ];

  // Format recent users for table
  const recentUsersTable = stats.recentUsers.slice(0, 5).map(user => ({
    name: user.display_name || 'N/A',
    email: user.email,
    role: user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    status: user.is_active ? 'Active' : 'Inactive',
    verified: user.is_verified ? 'Yes' : 'No',
  }));

  return (
    <>
      {/* Key Metrics */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            trendLabel={stat.trendLabel}
          />
        ))}
      </section>

      {/* System Resource Monitor */}
      <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
        <SystemMonitor />
      </section>

      {/* User Growth Analytics */}
      <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
        <h3 className="mb-6 text-lg font-semibold text-[#3a2218]">
          User Distribution by Category
        </h3>
        <div className="space-y-6">
          {userGrowthData.map((category) => (
            <div key={category.category}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#3a2218]">
                  {category.category}
                </span>
                <span className="text-sm font-bold text-[#523329]">
                  {category.total} total
                </span>
              </div>
              <div className="relative h-8 overflow-hidden rounded-full bg-[#f9f0e6]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#523329] to-[#684233] transition-all"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-[#80685b]">
                {category.percentage.toFixed(1)}% of total users
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Users */}
      <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#3a2218]">
            Recently Registered Users
          </h3>
          <Link
            href="/admin/users"
            className="text-sm font-semibold text-[#523329] hover:underline"
          >
            View all →
          </Link>
        </div>
        <DataTable
          data={recentUsersTable}
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            { key: "role", header: "Role" },
            { key: "status", header: "Status" },
            { key: "verified", header: "Verified" },
          ]}
        />
      </section>
    </>
  );
}
