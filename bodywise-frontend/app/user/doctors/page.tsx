'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Button } from '@/components/ui/button';
import { userNav } from '@/lib/navigation';
import Link from 'next/link';

interface Doctor {
  id: number;
  user_id: number;
  full_name: string;
  bio: string;
  specialization: string;
  years_of_experience: number;
  profile_picture: string | null;
  average_rating: number;
  total_reviews: number;
  phone: string;
  institution_name: string;
  institution_id: number;
  institution_location: string;
  institution_verification: string;
}

export default function UserDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, [searchTerm, specializationFilter]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (specializationFilter) params.append('specialization', specializationFilter);
      
      const response = await fetch(`/api/patient/professionals?${params.toString()}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch doctors');
      
      const result = await response.json();
      setDoctors(result.data);
    } catch (err: any) {
      setError(err.message);
      console.error('Fetch doctors error:', err);
    } finally {
      setLoading(false);
    }
  };

  const specializations = Array.from(new Set(doctors.map(d => d.specialization))).filter(Boolean);

  return (
    <DashboardShell
      title="Find your support team"
      subtitle="Explore verified BodyWise professionals and book culturally aligned sessions."
      breadcrumbs={[{ label: 'User', href: '/user' }, { label: 'Doctors' }]}
      navItems={userNav}
    >
      {/* Search and Filter Section */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="Search by name, specialization, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] placeholder:text-[#a1897c] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
          />
        </div>
        <div>
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#523329] border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchDoctors} className="mt-4">Retry</Button>
        </div>
      ) : doctors.length === 0 ? (
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-12 text-center">
          <p className="text-lg font-semibold text-[#3a2218]">No doctors found</p>
          <p className="mt-2 text-sm text-[#6a4a3a]">Try adjusting your search criteria</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-[#6a4a3a]">
            Found {doctors.length} professional{doctors.length !== 1 ? 's' : ''}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex flex-col gap-4 rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)] transition-shadow hover:shadow-[0_30px_80px_-50px_rgba(58,34,24,0.55)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#f9f0e6] text-lg font-semibold text-[#6a4a3a]">
                    {doctor.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold text-[#3a2218]">{doctor.full_name}</h3>
                    <p className="text-sm text-[#6a4a3a]">{doctor.specialization}</p>
                    {doctor.institution_name && (
                      <p className="text-xs text-[#80685b]">📍 {doctor.institution_name}</p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[#6a4a3a] line-clamp-3">{doctor.bio}</p>

                <div className="flex items-center gap-4 text-xs text-[#80685b]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f0d5b8]/80 px-3 py-1 font-semibold text-[#6a4a3a]">
                    ★ {doctor.average_rating ? doctor.average_rating.toFixed(1) : 'New'}
                  </span>
                  <span>{doctor.years_of_experience}+ years exp</span>
                  {doctor.total_reviews > 0 && (
                    <span>{doctor.total_reviews} reviews</span>
                  )}
                </div>

                <Link href={`/user/doctors/${doctor.id}`} className="mt-auto">
                  <Button variant="secondary" className="w-full">
                    View Profile & Book
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  );
}


