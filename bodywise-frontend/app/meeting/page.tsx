'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import JitsiMeeting from '@/components/meeting/jitsi-meeting';
import { useAuth } from '@/lib/auth-context';

export default function MeetingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const consultationId = searchParams.get('id');

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/meeting');
      return;
    }

    if (!consultationId) {
      setError('No consultation ID provided');
      setLoading(false);
      return;
    }

    fetchConsultation();
  }, [consultationId, user]);

  const fetchConsultation = async () => {
    try {
      setLoading(true);

      // Determine API endpoint based on user role
      const endpoint = user?.role === 'patient' 
        ? '/api/patient/consultations'
        : '/api/professional/consultations';

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch consultations');

      const data = await response.json();
      const found = data.consultations.find((c: any) => c.id === parseInt(consultationId!));

      if (!found) {
        setError('Consultation not found or you do not have access');
        setLoading(false);
        return;
      }

      if (!found.jitsi_room_id) {
        setError('Meeting link not available for this consultation');
        setLoading(false);
        return;
      }

      // Check if consultation is scheduled for today or in the future
      const scheduledDateTime = new Date(`${found.scheduled_date}T${found.scheduled_time}`);
      const now = new Date();
      const timeDiff = scheduledDateTime.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      // Allow joining 15 minutes before scheduled time
      if (hoursDiff > 0.25) {
        setError(`Meeting starts at ${found.scheduled_time}. Please come back then.`);
        setLoading(false);
        return;
      }

      // Don't allow joining more than 2 hours after scheduled time
      if (hoursDiff < -2) {
        setError('This meeting has ended.');
        setLoading(false);
        return;
      }

      setConsultation(found);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching consultation:', err);
      setError(err.message || 'Failed to load consultation');
      setLoading(false);
    }
  };

  const handleMeetingEnd = () => {
    // Redirect back to dashboard
    if (user?.role === 'patient') {
      router.push('/user');
    } else if (user?.role === 'health_professional') {
      router.push('/doctor');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <div className="text-red-600 text-4xl mb-4 font-bold">Warning</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cannot Join Meeting</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return null;
  }

  const displayName = user?.role === 'patient'
    ? consultation.patient_name || user?.email
    : consultation.professional_name || user?.email;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Meeting Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              {user?.role === 'patient' 
                ? `Consultation with ${consultation.professional_name}`
                : `Consultation with ${consultation.patient_name}`
              }
            </h1>
            <p className="text-sm text-gray-400">
              {consultation.scheduled_date} at {consultation.scheduled_time}
            </p>
          </div>
          <button
            onClick={handleMeetingEnd}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Leave Meeting
          </button>
        </div>
      </div>

      {/* Meeting Container */}
      <div className="h-[calc(100vh-80px)]">
        <JitsiMeeting
          roomId={consultation.jitsi_room_id}
          userName={displayName}
          onMeetingEnd={handleMeetingEnd}
        />
      </div>
    </div>
  );
}
