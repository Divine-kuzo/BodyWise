import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const professionalId = searchParams.get('professional_id');
    const date = searchParams.get('date'); // Format: YYYY-MM-DD

    if (!professionalId || !date) {
      return NextResponse.json(
        { error: 'Professional ID and date are required' },
        { status: 400 }
      );
    }

    // Get the day of week for the requested date
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay(); // 0=Sunday, 1=Monday, etc.

    // Get availability schedules for this day
    const schedules = db.prepare(`
      SELECT id, start_time, end_time
      FROM availability_schedules
      WHERE professional_id = ? 
        AND day_of_week = ?
        AND is_available = 1
      ORDER BY start_time
    `).all(professionalId, dayOfWeek) as Array<{
      id: number;
      start_time: string;
      end_time: string;
    }>;

    if (schedules.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No availability for this date'
      });
    }

    // Generate 30-minute slots for each schedule
    const allSlots: Array<{
      schedule_id: number;
      start_time: string;
      end_time: string;
      is_booked: boolean;
    }> = [];

    for (const schedule of schedules) {
      const slots = generateTimeSlots(schedule.start_time, schedule.end_time);
      
      for (const slot of slots) {
        // Check if this slot is already booked
        const booking = db.prepare(`
          SELECT id FROM consultations
          WHERE professional_id = ?
            AND scheduled_date = ?
            AND scheduled_time = ?
            AND status IN ('scheduled', 'confirmed')
        `).get(professionalId, date, slot.start_time);

        allSlots.push({
          schedule_id: schedule.id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_booked: !!booking,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: allSlots,
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateTimeSlots(startTime: string, endTime: string): Array<{ start_time: string; end_time: string }> {
  const slots = [];
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  let current = start;
  while (current < end) {
    const slotStart = current.toTimeString().substring(0, 5);
    current.setMinutes(current.getMinutes() + 30);
    const slotEnd = current.toTimeString().substring(0, 5);
    
    if (current <= end) {
      slots.push({
        start_time: slotStart,
        end_time: slotEnd,
      });
    }
  }
  
  return slots;
}
