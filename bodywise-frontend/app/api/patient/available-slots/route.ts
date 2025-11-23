import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const professionalId = searchParams.get('professional_id');
    const date = searchParams.get('date'); // Format: YYYY-MM-DD (optional)

    if (!professionalId) {
      return NextResponse.json(
        { error: 'Professional ID is required' },
        { status: 400 }
      );
    }

    // If date is provided, filter by date, otherwise get all future slots
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const endDate = futureDate.toISOString().split('T')[0];

    let query = `
      SELECT 
        id,
        professional_id,
        slot_date,
        start_time,
        end_time,
        is_booked
      FROM availability_slots
      WHERE professional_id = ?
        AND is_booked = 0
        AND slot_date >= ?
    `;
    
    const params: any[] = [professionalId, today];
    
    if (date) {
      query += ' AND slot_date = ?';
      params.push(date);
    } else {
      query += ' AND slot_date <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY slot_date, start_time LIMIT 100';

    const slots = db.prepare(query).all(...params) as Array<{
      id: number;
      professional_id: number;
      slot_date: string;
      start_time: string;
      end_time: string;
      is_booked: number;
    }>;

    return NextResponse.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
