'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Button } from '@/components/ui/button';
import { adminNav } from '@/lib/navigation';

interface Testimonial {
  id: number;
  content: string;
  rating: number | null;
  is_featured: number;
  approval_status: string;
  rejection_reason: string | null;
  created_at: string;
  user_type: string;
  user_email: string;
  user_name: string;
  additional_info: string | null;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/testimonials?status=${filter}`);
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const result = await response.json();
      setTestimonials(result.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, isFeatured: boolean = false) => {
    if (!confirm(`Are you sure you want to approve this testimonial${isFeatured ? ' and mark it as featured' : ''}?`)) return;

    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', is_featured: isFeatured }),
      });

      if (!response.ok) throw new Error('Failed to approve testimonial');
      alert('Testimonial approved successfully!');
      fetchTestimonials();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', rejection_reason: reason }),
      });

      if (!response.ok) throw new Error('Failed to reject testimonial');
      alert('Testimonial rejected');
      fetchTestimonials();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardShell
      title="Testimonial Management"
      subtitle="Review and approve user testimonials"
      breadcrumbs={[{ label: 'Admin' }, { label: 'Testimonials' }]}
      navItems={adminNav}
    >
      <div className="mb-6 flex gap-2">
        {['pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-[#6a4a3a] text-white'
                : 'bg-[#f9f0e6] text-[#6a4a3a] hover:bg-[#f0d5b8]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#523329] border-t-transparent"></div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-12 text-center">
          <p className="text-lg font-semibold text-[#3a2218]">No {filter} testimonials</p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#3a2218]">{testimonial.user_name}</h3>
                  <p className="text-sm text-[#80685b]">
                    {testimonial.user_email} • {testimonial.user_type}
                    {testimonial.additional_info && ` • ${testimonial.additional_info}`}
                  </p>
                  <p className="mt-1 text-xs text-[#a1897c]">
                    {new Date(testimonial.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {testimonial.rating && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f0d5b8]/80 px-3 py-1 text-sm font-semibold text-[#6a4a3a]">
                    {testimonial.rating}/5
                  </span>
                )}
              </div>

              <p className="mb-4 text-sm text-[#6a4a3a]">{testimonial.content}</p>

              {testimonial.approval_status === 'rejected' && testimonial.rejection_reason && (
                <div className="mb-4 rounded-2xl bg-red-50 p-3 text-sm text-red-600">
                  <strong>Rejection Reason:</strong> {testimonial.rejection_reason}
                </div>
              )}

              {testimonial.approval_status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(testimonial.id, false)}
                    disabled={actionLoading === testimonial.id}
                    variant="secondary"
                    className="flex-1"
                  >
                    {actionLoading === testimonial.id ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={() => handleApprove(testimonial.id, true)}
                    disabled={actionLoading === testimonial.id}
                    variant="primary"
                    className="flex-1"
                  >
                    {actionLoading === testimonial.id ? 'Processing...' : 'Approve as Featured'}
                  </Button>
                  <Button
                    onClick={() => handleReject(testimonial.id)}
                    disabled={actionLoading === testimonial.id}
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    Reject
                  </Button>
                </div>
              )}

              {testimonial.is_featured === 1 && (
                <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                  Featured Testimonial
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
