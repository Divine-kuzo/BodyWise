import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const doctors = db.prepare(`
      SELECT 
        hp.id,
        hp.full_name,
        hp.specialization,
        hp.bio,
        hp.years_of_experience,
        hp.phone,
        hp.average_rating,
        hp.total_reviews,
        i.name as institution_name,
        u.email
      FROM health_professionals hp
      JOIN users u ON hp.user_id = u.id
      LEFT JOIN institutions i ON hp.institution_id = i.id
      WHERE u.is_active = 1
      ORDER BY hp.average_rating DESC, hp.full_name
    `).all();

    return NextResponse.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
