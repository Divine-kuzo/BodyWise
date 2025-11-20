'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { adminNav } from "@/lib/navigation";

interface Institution {
  id: number;
  name: string;
  location: string;
  verification_status: string;
  created_at: string;
  admin_name: string;
  admin_email: string;
}

export default function AdminInstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/institutions?status=pending', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch institutions');
      }

      const result = await response.json();
      setInstitutions(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load institutions');
    } finally {
      setLoading(false);
    }
  };

  const institutionsTableData = institutions.map(inst => ({
    id: inst.id,
    name: inst.name,
    location: inst.location,
    submitted: new Date(inst.created_at).toLocaleDateString(),
    admin: inst.admin_name,
    email: inst.admin_email,
    status: inst.verification_status.charAt(0).toUpperCase() + inst.verification_status.slice(1),
  }));

  return (
    <DashboardShell
      title="Institutional Partnerships"
      subtitle="Review, verify, and approve organisations supporting African youth wellness."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Institution Review" },
      ]}
      navItems={adminNav}
    >
      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {loading ? (
          <div className="rounded-3xl border border-[#e6d8ce] bg-white p-12 text-center shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#523329] border-t-transparent mx-auto" />
            <p className="text-sm text-[#6a4a3a]">Loading pending institutions...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={fetchInstitutions}
              className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : institutions.length === 0 ? (
          <div className="rounded-3xl border border-[#e6d8ce] bg-white p-12 text-center shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
            <p className="text-sm text-[#6a4a3a]">No pending institutions for review.</p>
          </div>
        ) : (
          <DataTable
            caption={`Pending verification (${institutions.length})`}
            data={institutionsTableData}
            columns={[
              { key: "name", header: "Institution" },
              { key: "location", header: "Location" },
              { key: "submitted", header: "Submitted" },
              { key: "admin", header: "Contact Person" },
              {
                key: "status",
                header: "Status",
                render: (value) => (
                  <span className="inline-flex rounded-full bg-[#f0d5b8]/80 px-3 py-1 text-xs font-semibold text-[#6a4a3a]">
                    {value as string}
                  </span>
                ),
              },
              {
                key: "id",
                header: "Action",
                render: (_value, row) => {
                  const { id } = row as typeof institutionsTableData[number];
                  return (
                    <Link
                      href={`/admin/institutions/${id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#523329] px-4 py-2 text-xs font-semibold text-white shadow-[0_20px_60px_-45px_rgba(58,34,24,0.55)] transition hover:bg-[#684233]"
                    >
                      Review
                    </Link>
                  );
                },
              },
            ]}
          />
        )}
        
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="text-sm font-semibold text-[#3a2218]">
            Verification checklist
          </h3>
          <ol className="mt-5 space-y-4 text-sm text-[#6a4a3a]">
            <li className="flex gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0d5b8] text-xs font-semibold text-[#3a2218]">
                1
              </span>
              Confirm uploaded accreditation documents and references.
            </li>
            <li className="flex gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0d5b8] text-xs font-semibold text-[#3a2218]">
                2
              </span>
              Evaluate proposed programming for cultural relevance and safety.
            </li>
            <li className="flex gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0d5b8] text-xs font-semibold text-[#3a2218]">
                3
              </span>
              Schedule onboarding orientation with lead wellness coordinator.
            </li>
          </ol>
        </div>
      </section>
    </DashboardShell>
  );
}


