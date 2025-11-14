import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Get all reviews for a professional
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const professionalId = parseInt(params.id);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Get reviews with pagination
    const reviewsQuery = db.prepare(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        p.username as patient_username,
        p.profile_picture as patient_picture,
        c.scheduled_date,
        c.scheduled_time
      FROM reviews r
      JOIN patients p ON r.patient_id = p.id
      JOIN consultations c ON r.consultation_id = c.id
      WHERE r.professional_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `);

    const reviews = reviewsQuery.all(professionalId, limit, offset);

    // Get total count
    const countQuery = db.prepare(`
      SELECT COUNT(*) as total
      FROM reviews
      WHERE professional_id = ?
    `);

    const { total } = countQuery.get(professionalId) as any;

    // Get review statistics
    const statsQuery = db.prepare(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews
      WHERE professional_id = ?
    `);

    const stats = statsQuery.get(professionalId);

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        statistics: stats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
