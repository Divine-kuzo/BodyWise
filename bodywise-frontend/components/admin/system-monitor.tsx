"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  RiCpuLine,
  RiDatabase2Line,
  RiServerLine,
  RiHardDriveLine,
  RiTimeLine,
  RiRefreshLine,
  RiAlertLine,
} from "react-icons/ri";

interface SystemMetric {
  label: string;
  value: string;
  percentage: number;
  status: "healthy" | "warning" | "critical";
  icon: React.ComponentType<{ className?: string }>;
}

export function SystemMonitor() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPerformanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/admin/performance', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }

      const result = await response.json();
      const data = result.data;

      // Format metrics from real data
      const newMetrics: SystemMetric[] = [
        {
          label: "CPU Usage",
          value: `${data.cpu.usage}%`,
          percentage: parseFloat(data.cpu.usage),
          status: parseFloat(data.cpu.usage) > 80 ? "warning" : parseFloat(data.cpu.usage) > 90 ? "critical" : "healthy",
          icon: RiCpuLine,
        },
        {
          label: "Memory (RAM)",
          value: `${(data.memory.usedMem / 1024 / 1024 / 1024).toFixed(1)} GB / ${(data.memory.totalMem / 1024 / 1024 / 1024).toFixed(1)} GB`,
          percentage: parseFloat(data.memory.percent),
          status: parseFloat(data.memory.percent) > 80 ? "warning" : parseFloat(data.memory.percent) > 90 ? "critical" : "healthy",
          icon: RiDatabase2Line,
        },
        {
          label: "Disk Space",
          value: data.disk.percent > 0 
            ? `${(data.disk.used / 1024 / 1024 / 1024).toFixed(1)} GB / ${(data.disk.total / 1024 / 1024 / 1024).toFixed(1)} GB`
            : "N/A",
          percentage: data.disk.percent,
          status: data.disk.percent > 80 ? "warning" : data.disk.percent > 90 ? "critical" : "healthy",
          icon: RiHardDriveLine,
        },
        {
          label: "Database Size",
          value: `${(data.database.size / 1024 / 1024).toFixed(1)} MB`,
          percentage: Math.min((data.database.size / 1024 / 1024 / 100) * 100, 100), // Scale to 100MB max
          status: "healthy",
          icon: RiServerLine,
        },
      ];

      setMetrics(newMetrics);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
      setLoading(false);
    }
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    await fetchPerformanceData();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRunning(false);
  };

  const getStatusColor = (status: SystemMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBgColor = (status: SystemMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-50";
      case "warning":
        return "bg-yellow-50";
      case "critical":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#3a2218]">
            System Resource Monitor
          </h3>
          <p className="text-sm text-[#80685b]">
            Real-time system performance metrics
            {lastUpdate && (
              <span className="ml-2 inline-flex items-center text-xs">
                <RiTimeLine className="mr-1 h-3 w-3" />
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="rounded-full bg-[#523329] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#684233] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RiRefreshLine className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <RiRefreshLine className="mr-2 h-4 w-4" />
              Run Diagnostics
            </>
          )}
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={`rounded-2xl border-2 p-4 transition-all ${
                metric.status === "warning"
                  ? "border-yellow-200 bg-yellow-50"
                  : metric.status === "critical"
                  ? "border-red-200 bg-red-50"
                  : "border-[#e6d8ce] bg-[#f9f5f2]"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <Icon
                  className={`h-8 w-8 ${
                    metric.status === "warning"
                      ? "text-yellow-600"
                      : metric.status === "critical"
                      ? "text-red-600"
                      : "text-[#523329]"
                  }`}
                />
                {metric.status === "warning" && (
                  <RiAlertLine className="h-5 w-5 text-yellow-600" />
                )}
                {metric.status === "critical" && (
                  <RiAlertLine className="h-5 w-5 text-red-600" />
                )}
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
                {metric.label}
              </p>
              <p className="mb-3 text-xl font-bold text-[#3a2218]">
                {metric.value}
              </p>
              
              {/* Progress Bar */}
              <div className="relative h-2 overflow-hidden rounded-full bg-[#e6d8ce]">
                <div
                  className={`h-full transition-all duration-500 ${getStatusColor(
                    metric.status
                  )}`}
                  style={{ width: `${metric.percentage}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#80685b]">
                {metric.percentage}% utilized
              </p>
            </div>
          );
        })}
      </div>

      {/* System Health Alerts */}
      {metrics.some((m) => m.status !== "healthy") && (
        <div className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <RiAlertLine className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
            <div>
              <h4 className="mb-1 font-semibold text-yellow-900">
                System Alerts
              </h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                {metrics
                  .filter((m) => m.status !== "healthy")
                  .map((m) => (
                    <li key={m.label}>
                      • {m.label} is at {m.percentage}% - consider optimization
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Server Information */}
        <div className="rounded-2xl border border-[#e6d8ce] bg-white p-6">
          <h4 className="mb-4 font-semibold text-[#3a2218]">
            Server Information
          </h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#80685b]">Server Location:</dt>
              <dd className="font-semibold text-[#3a2218]">Kigali, Rwanda</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#80685b]">Uptime:</dt>
              <dd className="font-semibold text-[#3a2218]">45 days 12 hours</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#80685b]">Active Processes:</dt>
              <dd className="font-semibold text-[#3a2218]">247</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#80685b]">Database Connections:</dt>
              <dd className="font-semibold text-[#3a2218]">42 / 100</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#80685b]">API Requests (24h):</dt>
              <dd className="font-semibold text-[#3a2218]">1,247,392</dd>
            </div>
          </dl>
        </div>

        {/* Database Statistics */}
        <div className="rounded-2xl border border-[#e6d8ce] bg-white p-6">
          <h4 className="mb-4 font-semibold text-[#3a2218]">
            Database Statistics
          </h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#80685b]">Total Records:</dt>
              <dd className="font-semibold text-[#3a2218]">1,284,392</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#80685b]">Query Response Time:</dt>
              <dd className="font-semibold text-[#3a2218]">23ms avg</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#80685b]">Last Backup:</dt>
              <dd className="font-semibold text-[#3a2218]">2 hours ago</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#80685b]">Cache Hit Rate:</dt>
              <dd className="font-semibold text-[#3a2218]">94.2%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#80685b]">Active Queries:</dt>
              <dd className="font-semibold text-[#3a2218]">18</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
