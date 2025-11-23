"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function OnboardDoctorModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    yearsOfExperience: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.specialization) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/institutional/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to onboard doctor');
      }

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          specialization: '',
          yearsOfExperience: '',
          phone: '',
        });
        window.location.reload(); // Refresh to show new doctor
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Onboard new practitioner
      </Button>
      {open
        ? createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3a2218]/40 px-4 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-[0_40px_120px_-60px_rgba(58,34,24,0.65)] max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-[#3a2218]">
                      Onboard practitioner
                    </h2>
                    <p className="text-sm text-[#80685b]">
                      Create account for a new practitioner at your institution.
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-[#f0d5b8]/80 px-3 py-1 text-xs font-semibold text-[#6a4a3a] transition hover:bg-[#e6c8ab]"
                  >
                    Close
                  </button>
                </div>

                {success && (
                  <div className="mt-4 rounded-2xl bg-green-50 border border-green-200 p-4">
                    <p className="text-sm text-green-800">Doctor onboarded successfully! They can now login.</p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="practitioner-name" requiredIndicator>
                        Full name
                      </Label>
                      <Input
                        id="practitioner-name"
                        placeholder="Dr. Nia Kabede"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="practitioner-email" requiredIndicator>
                        Email
                      </Label>
                      <Input
                        id="practitioner-email"
                        type="email"
                        placeholder="nia@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="practitioner-password" requiredIndicator>
                        Password
                      </Label>
                      <Input
                        id="practitioner-password"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="practitioner-confirm-password" requiredIndicator>
                        Confirm Password
                      </Label>
                      <Input
                        id="practitioner-confirm-password"
                        type="password"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="practitioner-specialty" requiredIndicator>
                      Specialization
                    </Label>
                    <Input
                      id="practitioner-specialty"
                      placeholder="Clinical Psychologist"
                      value={formData.specialization}
                      onChange={(e) => handleChange('specialization', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="practitioner-experience">
                        Years of Experience
                      </Label>
                      <Input
                        id="practitioner-experience"
                        type="number"
                        placeholder="5"
                        value={formData.yearsOfExperience}
                        onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="practitioner-phone">
                        Phone Number
                      </Label>
                      <Input
                        id="practitioner-phone"
                        type="tel"
                        placeholder="+250 XXX XXX XXX"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-full px-5 py-3 text-sm font-semibold text-[#6a4a3a] transition hover:text-[#3a2218]"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <Button type="submit" variant="secondary" disabled={loading}>
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}


