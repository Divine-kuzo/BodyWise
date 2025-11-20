'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { adminNav } from "@/lib/navigation";

interface InstitutionDetails {
  id: number;
  name: string;
  bio: string;
  location: string;
  verification_status: string;
  certificate_url: string | null;
  support_documents: string | null;
  created_at: string;
  professional_count: number;
  article_count: number;
  admins: Array<{
    full_name: string;
    phone: string | null;
    email: string;
    created_at: string;
  }>;
}

interface InstitutionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InstitutionDetailPage({
  params,
}: InstitutionDetailPageProps) {
  const router = useRouter();
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [institution, setInstitution] = useState<InstitutionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    params.then(p => setInstitutionId(p.id));
  }, [params]);

  useEffect(() => {
    if (institutionId) {
      fetchInstitution();
    }
  }, [institutionId]);

  const fetchInstitution = async () => {
    if (!institutionId) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/institutions/${institutionId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch institution details');
      }

      const result = await response.json();
      setInstitution(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load institution');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!institutionId) return;
    if (!confirm('Are you sure you want to approve this institution? The admin will receive an email notification.')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/institutions/${institutionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'approve' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve institution');
      }

      alert('Institution approved successfully! Confirmation email sent.');
      router.push('/admin/institutions');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve institution');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!confirm('Are you sure you want to reject this institution? The admin will receive an email with the reason.')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/institutions/${institutionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          action: 'reject',
          reason: rejectReason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reject institution');
      }

      alert('Institution rejected. Notification email sent.');
      router.push('/admin/institutions');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject institution');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (<DashboardShell
        title="Institution Details"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Institutions", href: "/admin/institutions" },
          { label: "Details" },
        ]}
        navItems={adminNav}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#523329] border-t-transparent mx-auto" />
            <p className="text-sm text-[#6a4a3a]">Loading institution details...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error || !institution) {
    return (
      <DashboardShell
        title="Institution Details"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Institutions", href: "/admin/institutions" },
          { label: "Details" },
        ]}
        navItems={adminNav}
      >
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-800">{error || 'Institution not found'}</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title={institution.name}
      subtitle={`Review and verify institution partnership application`}
      actions={
        institution.verification_status === 'pending' ? (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleApprove}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Approve'}
            </Button>
            <button
              onClick={() => setShowRejectForm(!showRejectForm)}
              className="rounded-full border-2 border-red-600 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
              disabled={actionLoading}
            >
              Reject
            </button>
          </div>
        ) : (
          <span className={`rounded-full px-5 py-3 text-sm font-semibold ${
            institution.verification_status === 'approved' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {institution.verification_status.charAt(0).toUpperCase() + institution.verification_status.slice(1)}
          </span>
        )
      }
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Institutions", href: "/admin/institutions" },
        { label: institution.name },
      ]}
      navItems={adminNav}
    >
      {/* Reject Form */}
      {showRejectForm && institution.verification_status === 'pending' && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)] mb-6">
          <h3 className="mb-4 text-lg font-semibold text-red-900">
            Provide Rejection Reason
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">
                This reason will be sent to the institution admin
              </Label>
              <textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full rounded-2xl border border-red-300 bg-white p-4 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                rows={4}
                placeholder="e.g., Accreditation documents are incomplete or expired..."
                disabled={actionLoading}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                disabled={actionLoading || !rejectReason.trim()}
              >
                {actionLoading ? 'Sending...' : 'Send Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectReason('');
                }}
                className="rounded-full border-2 border-red-600 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Institution Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="mb-6 text-lg font-semibold text-[#3a2218]">
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <Label>Institution Name</Label>
              <p className="mt-1 text-sm font-semibold text-[#3a2218]">{institution.name}</p>
            </div>
            <div>
              <Label>Location</Label>
              <p className="mt-1 text-sm text-[#6a4a3a]">{institution.location}</p>
            </div>
            <div>
              <Label>Bio/Description</Label>
              <p className="mt-1 text-sm text-[#6a4a3a]">{institution.bio || 'N/A'}</p>
            </div>
            <div>
              <Label>Application Date</Label>
              <p className="mt-1 text-sm text-[#6a4a3a]">
                {new Date(institution.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Admin Contacts */}
        <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="mb-6 text-lg font-semibold text-[#3a2218]">
            Administrative Contacts
          </h3>
          <div className="space-y-4">
            {institution.admins.map((admin, index) => (
              <div key={index} className="rounded-2xl border border-[#e6d8ce] bg-[#f9f0e6] p-4">
                <p className="font-semibold text-[#3a2218]">{admin.full_name}</p>
                <p className="text-sm text-[#6a4a3a]">{admin.email}</p>
                {admin.phone && (
                  <p className="text-sm text-[#6a4a3a]">{admin.phone}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Documents */}
        <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="mb-6 text-lg font-semibold text-[#3a2218]">
            Verification Documents
          </h3>
          <div className="space-y-4">
            <div>
              <Label>Accreditation Certificate</Label>
              {institution.certificate_url ? (
                <a
                  href={institution.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#523329] hover:underline"
                >
                  View Certificate →
                </a>
              ) : (
                <p className="mt-1 text-sm text-[#6a4a3a]">Not provided</p>
              )}
            </div>
            <div>
              <Label>Support Documents</Label>
              {institution.support_documents ? (
                <a
                  href={institution.support_documents}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#523329] hover:underline"
                >
                  View Documents →
                </a>
              ) : (
                <p className="mt-1 text-sm text-[#6a4a3a]">Not provided</p>
              )}
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="mb-6 text-lg font-semibold text-[#3a2218]">
            Platform Activity
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#f9f0e6] p-4 text-center">
              <p className="text-3xl font-bold text-[#523329]">{institution.professional_count}</p>
              <p className="text-sm text-[#6a4a3a]">Professionals</p>
            </div>
            <div className="rounded-2xl bg-[#f9f0e6] p-4 text-center">
              <p className="text-3xl font-bold text-[#523329]">{institution.article_count}</p>
              <p className="text-sm text-[#6a4a3a]">Articles</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}


