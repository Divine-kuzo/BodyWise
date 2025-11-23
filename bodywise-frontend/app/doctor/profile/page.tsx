'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Button } from '@/components/ui/button';
import { doctorNav } from '@/lib/navigation';

interface ProfessionalProfile {
  id: number;
  user_id: number;
  full_name: string;
  bio: string | null;
  specialization: string;
  years_of_experience: number;
  phone: string | null;
  profile_picture: string | null;
  calendar_integration: string | null;
  average_rating: number;
  total_reviews: number;
  institution_id: number | null;
  institution_name: string | null;
  institution_location: string | null;
  institution_verification: string | null;
  email: string;
  review_statistics: {
    total_reviews: number;
    average_rating: number;
    five_star: number;
    four_star: number;
    three_star: number;
    two_star: number;
    one_star: number;
  };
  recent_reviews: Array<{
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    patient_username: string;
    patient_picture: string | null;
  }>;
}

export default function DoctorProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    specialization: '',
    years_of_experience: 0,
    phone: '',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'health_professional') {
        router.push('/login?redirect=/doctor/profile');
        return;
      }
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/professional/profile', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setFormData({
          full_name: data.profile.full_name || '',
          bio: data.profile.bio || '',
          specialization: data.profile.specialization || '',
          years_of_experience: data.profile.years_of_experience || 0,
          phone: data.profile.phone || '',
        });
      } else if (response.status === 401) {
        router.push('/login?redirect=/doctor/profile');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/professional/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchProfile();
        setEditing(false);
        alert('Profile updated successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update profile');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            Rating:
          </span>
        ))}
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <DashboardShell
        title="Loading..."
        subtitle="Please wait"
        breadcrumbs={[{ label: 'Doctor', href: '/doctor' }, { label: 'Profile' }]}
        navItems={doctorNav}
      >
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#523329] border-t-transparent"></div>
        </div>
      </DashboardShell>
    );
  }

  if (!profile) {
    return (
      <DashboardShell
        title="Profile Not Found"
        subtitle="Unable to load your profile"
        breadcrumbs={[{ label: 'Doctor', href: '/doctor' }, { label: 'Profile' }]}
        navItems={doctorNav}
      >
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">Profile not found</p>
          <Button onClick={() => router.push('/doctor')} className="mt-4">Back to Dashboard</Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="My Professional Profile"
      subtitle="Manage your professional information and view patient feedback"
      breadcrumbs={[{ label: 'Doctor', href: '/doctor' }, { label: 'Profile' }]}
      navItems={doctorNav}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#3a2218]">
                  Professional Information
                </h2>
                {!editing && (
                  <Button onClick={() => setEditing(true)} variant="secondary">
                    Edit Profile
                  </Button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3a2218] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] placeholder:text-[#a1897c] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3a2218] mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] placeholder:text-[#a1897c] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
                      placeholder="Tell patients about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3a2218] mb-2">
                      Specialization *
                    </label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData({ ...formData, specialization: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] placeholder:text-[#a1897c] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3a2218] mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={formData.years_of_experience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          years_of_experience: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] placeholder:text-[#a1897c] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3a2218] mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] placeholder:text-[#a1897c] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setEditing(false)}
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#80685b]">Full Name</p>
                    <p className="text-lg font-medium text-[#3a2218]">{profile.full_name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#80685b]">Email</p>
                    <p className="text-lg text-[#3a2218]">{profile.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#80685b]">Specialization</p>
                    <p className="text-lg font-medium text-[#3a2218]">{profile.specialization}</p>
                  </div>

                  {profile.bio && (
                    <div>
                      <p className="text-sm text-[#80685b]">Bio</p>
                      <p className="text-[#6a4a3a]">{profile.bio}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-[#80685b]">Years of Experience</p>
                    <p className="text-lg text-[#3a2218]">{profile.years_of_experience} years</p>
                  </div>

                  {profile.phone && (
                    <div>
                      <p className="text-sm text-[#80685b]">Phone</p>
                      <p className="text-lg text-[#3a2218]">{profile.phone}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Affiliated Institution */}
            {profile.institution_name && (
              <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
                <h2 className="text-xl font-semibold text-[#3a2218] mb-4">
                  Affiliated Institution
                </h2>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="text-lg font-medium text-[#3a2218]">{profile.institution_name}</p>
                      {profile.institution_location && (
                        <p className="text-sm text-[#80685b]">
                          {profile.institution_location}
                        </p>
                      )}
                      {profile.institution_verification === 'approved' && (
                        <span className="inline-flex items-center rounded-full bg-[#d1fae5] px-3 py-1 text-xs font-medium text-[#065f46] mt-1">
                          ✓ Verified Institution
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Reviews */}
            <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
              <h2 className="text-xl font-semibold text-[#3a2218] mb-4">
                Recent Reviews
              </h2>

              {profile.recent_reviews && profile.recent_reviews.length > 0 ? (
                <div className="space-y-4">
                  {profile.recent_reviews.map((review) => (
                    <div key={review.id} className="border-b border-[#e6d8ce] pb-4 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f9f0e6] flex items-center justify-center text-[#6a4a3a] font-semibold">
                          {review.patient_username[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-[#3a2218]">{review.patient_username}</p>
                            <p className="text-sm text-[#80685b]">
                              {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          {renderStars(review.rating)}
                          {review.comment && (
                            <p className="text-[#6a4a3a] mt-2">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#80685b]">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Rating Stats */}
            <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
              <h3 className="text-lg font-semibold text-[#3a2218] mb-4">
                Rating Overview
              </h3>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-[#6a4a3a]">
                  {profile.average_rating.toFixed(1)}
                </div>
                {renderStars(Math.round(profile.average_rating))}
                <p className="text-sm text-[#80685b] mt-2">
                  Based on {profile.total_reviews} reviews
                </p>
              </div>

              {profile.review_statistics && (
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const key = `${['one', 'two', 'three', 'four', 'five'][star - 1]}_star` as keyof typeof profile.review_statistics;
                    const count = profile.review_statistics[key] as number || 0;
                    const percentage = profile.total_reviews > 0
                      ? (count / profile.total_reviews) * 100
                      : 0;

                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm text-[#6a4a3a] w-8">{star}★</span>
                        <div className="flex-1 h-2 bg-[#f0e5d8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#d6b28f]"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#80685b] w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
              <h3 className="text-lg font-semibold text-[#3a2218] mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#6a4a3a]">Total Reviews</span>
                  <span className="font-semibold text-[#3a2218]">{profile.total_reviews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6a4a3a]">Average Rating</span>
                  <span className="font-semibold text-[#3a2218]">
                    {profile.average_rating.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6a4a3a]">Experience</span>
                  <span className="font-semibold text-[#3a2218]">
                    {profile.years_of_experience} years
                  </span>
                </div>
              </div>
            </div>
          </div>
      </div>
    </DashboardShell>
  );
}
