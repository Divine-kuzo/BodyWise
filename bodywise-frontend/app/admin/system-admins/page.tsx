'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminNav } from "@/lib/navigation";

interface SystemAdmin {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  is_active: number;
  created_at: string;
}

export default function SystemAdminsPage() {
  const [admins, setAdmins] = useState<SystemAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/admins', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const result = await response.json();
      setAdmins(result.data);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create admin');
      }

      setFormSuccess('System admin created successfully!');
      setFormData({ email: '', password: '', full_name: '', phone: '' });
      setShowAddForm(false);
      fetchAdmins(); // Refresh the list
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const adminsTableData = admins.map(admin => ({
    name: admin.full_name,
    email: admin.email,
    phone: admin.phone || 'N/A',
    status: admin.is_active ? 'Active' : 'Inactive',
    created: new Date(admin.created_at).toLocaleDateString(),
  }));

  return (
    <DashboardShell
      title="System Administrators"
      subtitle="Manage system administrator accounts and permissions"
      actions={
        <Button
          variant="secondary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Admin'}
        </Button>
      }
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "System Admins" }
      ]}
      navItems={adminNav}
    >
      {/* Success Message */}
      {formSuccess && (
        <div className="rounded-3xl border border-green-200 bg-green-50 p-4 mb-6">
          <p className="text-sm font-semibold text-green-800">{formSuccess}</p>
        </div>
      )}

      {/* Add Admin Form */}
      {showAddForm && (
        <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)] mb-6">
          <h3 className="mb-6 text-lg font-semibold text-[#3a2218]">
            Create New System Administrator
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{formError}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name" requiredIndicator>
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" requiredIndicator>
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" requiredIndicator>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={submitting}
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="secondary"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Administrator'}
              </Button>
              <button
                type="button"
                className="rounded-full border-2 border-[#523329] px-5 py-3 text-sm font-semibold text-[#523329] transition hover:bg-[#523329] hover:text-white disabled:opacity-50"
                onClick={() => {
                  setShowAddForm(false);
                  setFormError(null);
                  setFormData({ email: '', password: '', full_name: '', phone: '' });
                }}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Admins List */}
      <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
        <h3 className="mb-6 text-lg font-semibold text-[#3a2218]">
          Current System Administrators ({admins.length})
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#523329] border-t-transparent mx-auto" />
              <p className="text-sm text-[#6a4a3a]">Loading administrators...</p>
            </div>
          </div>
        ) : admins.length === 0 ? (
          <div className="rounded-2xl border border-[#e6d8ce] bg-[#f9f0e6] p-8 text-center">
            <p className="text-sm text-[#6a4a3a]">No system administrators found.</p>
          </div>
        ) : (
          <DataTable
            data={adminsTableData}
            columns={[
              { key: "name", header: "Name" },
              { key: "email", header: "Email" },
              { key: "phone", header: "Phone" },
              { key: "status", header: "Status" },
              { key: "created", header: "Created" },
            ]}
          />
        )}
      </section>
    </DashboardShell>
  );
}
