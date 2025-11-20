'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Button } from '@/components/ui/button';
import { userNav } from '@/lib/navigation';

interface Doctor {
  id: number;
  full_name: string;
  bio: string;
  specialization: string;
  years_of_experience: number;
  average_rating: number;
  total_reviews: number;
  institution_name: string;
}

interface AvailableSlot {
  id: number;
  professional_id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_booked: number;
}

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [showInviteSection, setShowInviteSection] = useState(false);

  useEffect(() => {
    fetchDoctorAndSlots();
  }, [doctorId]);

  const fetchDoctorAndSlots = async () => {
    try {
      setLoading(true);
      const [doctorRes, slotsRes] = await Promise.all([
        fetch(`/api/patient/professionals/${doctorId}`, { credentials: 'include' }),
        fetch(`/api/patient/available-slots?professional_id=${doctorId}`, { credentials: 'include' })
      ]);

      if (!doctorRes.ok || !slotsRes.ok) throw new Error('Failed to fetch data');

      const doctorData = await doctorRes.json();
      const slotsData = await slotsRes.json();

      setDoctor(doctorData.data);
      setSlots(slotsData.data || []);
    } catch (err: any) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    try {
      setBookingLoading(true);
      const response = await fetch('/api/patient/consultations/book', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professional_id: parseInt(doctorId),
          slot_id: selectedSlot,
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Booking failed');
      }

      // If there's an invitee, send invitation
      if (inviteeEmail && result.consultation) {
        await sendInvitation(result.consultation.consultationId);
      }

      alert('Consultation booked successfully! Check your email for confirmation.');
      router.push('/user');
    } catch (err: any) {
      alert(err.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const sendInvitation = async (consultationId: number) => {
    try {
      const response = await fetch(`/api/patient/consultations/${consultationId}/invite`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitee_email: inviteeEmail }),
      });

      if (!response.ok) {
        console.error('Failed to send invitation');
      }
    } catch (err) {
      console.error('Invitation error:', err);
    }
  };

  if (loading) {
    return (
      <DashboardShell title="Loading..." subtitle="Please wait" breadcrumbs={[{ label: 'User', href: '/user' }, { label: 'Doctors', href: '/user/doctors' }, { label: 'Details' }]} navItems={userNav}>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#523329] border-t-transparent"></div>
        </div>
      </DashboardShell>
    );
  }

  if (!doctor) {
    return (
      <DashboardShell title="Doctor not found" subtitle="Please try again" breadcrumbs={[{ label: 'User', href: '/user' }, { label: 'Doctors', href: '/user/doctors' }]} navItems={userNav}>
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">Doctor not found</p>
          <Button onClick={() => router.push('/user/doctors')} className="mt-4">Back to Doctors</Button>
        </div>
      </DashboardShell>
    );
  }

  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.slot_date]) acc[slot.slot_date] = [];
    acc[slot.slot_date].push(slot);
    return acc;
  }, {} as Record<string, AvailableSlot[]>);

  return (
    <DashboardShell
      title={doctor.full_name}
      subtitle={doctor.specialization}
      breadcrumbs={[{ label: 'User', href: '/user' }, { label: 'Doctors', href: '/user/doctors' }, { label: doctor.full_name }]}
      navItems={userNav}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        {/* Doctor Info */}
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#f9f0e6] text-3xl font-semibold text-[#6a4a3a]">
            {doctor.full_name.charAt(0)}
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-[#3a2218]">{doctor.full_name}</h2>
          <p className="mb-4 text-sm text-[#6a4a3a]">{doctor.specialization}</p>
          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f0d5b8]/80 px-3 py-1 font-semibold text-[#6a4a3a]">
              Rating: {doctor.average_rating ? doctor.average_rating.toFixed(1) : 'New'}
            </span>
            <span className="text-[#80685b]">{doctor.total_reviews} reviews</span>
          </div>
          <p className="mb-4 text-sm text-[#6a4a3a]">{doctor.bio}</p>
          <div className="space-y-2 text-sm text-[#80685b]">
            <p>{doctor.years_of_experience}+ years experience</p>
            <p>{doctor.institution_name}</p>
          </div>
        </div>

        {/* Booking Section */}
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="mb-4 text-lg font-semibold text-[#3a2218]">Book a Session</h3>

          {Object.keys(groupedSlots).length === 0 ? (
            <p className="text-sm text-[#6a4a3a]">No available slots at the moment</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSlots).slice(0, 7).map(([date, dateSlots]) => (
                <div key={date}>
                  <h4 className="mb-3 text-sm font-semibold text-[#3a2218]">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h4>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {dateSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                          selectedSlot === slot.id
                            ? 'border-[#6a4a3a] bg-[#6a4a3a] text-white'
                            : 'border-[#e6d8ce] bg-white text-[#6a4a3a] hover:border-[#d6b28f] hover:bg-[#f9f0e6]'
                        }`}
                      >
                        {new Date(`2000-01-01T${slot.start_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#3a2218]">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any specific concerns or topics you'd like to discuss..."
                  className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] placeholder:text-[#a1897c] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
                  rows={3}
                />
              </div>

              <div>
                <button
                  onClick={() => setShowInviteSection(!showInviteSection)}
                  className="mb-2 text-sm font-medium text-[#6a4a3a] hover:text-[#523329]"
                >
                  {showInviteSection ? '− Hide' : '+ Add'} someone to this session
                </button>
                {showInviteSection && (
                  <div>
                    <input
                      type="email"
                      value={inviteeEmail}
                      onChange={(e) => setInviteeEmail(e.target.value)}
                      placeholder="friend@example.com"
                      className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] placeholder:text-[#a1897c] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
                    />
                    <p className="mt-1 text-xs text-[#80685b]">They'll receive an email invitation with the meeting link</p>
                  </div>
                )}
              </div>

              <Button
                onClick={handleBooking}
                disabled={!selectedSlot || bookingLoading}
                className="w-full"
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
