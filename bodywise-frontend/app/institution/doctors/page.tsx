'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { OnboardDoctorModal } from "@/components/institution/onboard-doctor-modal";
import { institutionNav } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: number;
  full_name: string;
  specialization: string;
  years_of_experience: number;
  average_rating: number;
  total_consultations: number;
}

export default function InstitutionDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institutional/doctors');
      
      if (!response.ok) throw new Error('Failed to fetch doctors');
      
      const result = await response.json();
      if (result.success) {
        setDoctors(result.data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Fetch doctors error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell
        title="Practitioner Network"
        subtitle="Loading..."
        actions={<OnboardDoctorModal />}
        breadcrumbs={[
          { label: "Institution", href: "/institution" },
          { label: "Doctors" },
        ]}
        navItems={institutionNav}
      >
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#523329] border-t-transparent"></div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell
        title="Practitioner Network"
        subtitle="Error loading doctors"
        actions={<OnboardDoctorModal />}
        breadcrumbs={[
          { label: "Institution", href: "/institution" },
          { label: "Doctors" },
        ]}
        navItems={institutionNav}
      >
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchDoctors} className="mt-4">Retry</Button>
        </div>
      </DashboardShell>
    );
  }

  const doctorTableData = doctors.map(doctor => ({
    name: doctor.full_name,
    specialty: doctor.specialization,
    experience: `${doctor.years_of_experience} years`,
    rating: `${doctor.average_rating.toFixed(1)} ⭐`,
    consultations: doctor.total_consultations,
  }));

  return (
    <DashboardShell
      title="Practitioner Network"
      subtitle="Manage your institution's verified practitioners and invite new collaborators."
      actions={<OnboardDoctorModal />}
      breadcrumbs={[
        { label: "Institution", href: "/institution" },
        { label: "Doctors" },
      ]}
      navItems={institutionNav}
    >
      {doctors.length > 0 ? (
        <DataTable
          caption="Current practitioner roster"
          data={doctorTableData}
          columns={[
            { key: "name", header: "Name" },
            { key: "specialty", header: "Specialty" },
            { key: "experience", header: "Experience" },
            { key: "rating", header: "Rating" },
            {
              key: "consultations",
              header: "Consultations",
              render: (value) => (
                <span className="text-sm font-semibold text-[#3a2218]">
                  {value}
                </span>
              ),
            },
          ]}
        />
      ) : (
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-8 text-center">
          <p className="text-sm text-[#6a4a3a]">No doctors affiliated with your institution yet</p>
        </div>
      )}
    </DashboardShell>
  );
}


