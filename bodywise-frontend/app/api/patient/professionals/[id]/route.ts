import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// Get professional details including availability
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'patient')) {
      return NextResponse.json(
        { error: 'Unauthorized. Patient access required.' },
        { status: 403 }
      );
    }
    
    const professionalId = parseInt(params.id);
    
    // Get professional details
    const professionalQuery = db.prepare(`
      SELECT 
        hp.id,
        hp.user_id,
        hp.full_name,
        hp.bio,
        hp.specialization,
        hp.years_of_experience,
        hp.profile_picture,
        hp.phone,
        hp.average_rating,
        hp.total_reviews,
        i.name as institution_name,
        i.id as institution_id,
        i.location as institution_location,
        i.bio as institution_bio,
        i.verification_status as institution_verification
      FROM health_professionals hp
      LEFT JOIN institutions i ON hp.institution_id = i.id
      JOIN users u ON hp.user_id = u.id
      WHERE hp.id = ? AND u.is_active = 1
    `);
    
    const professional = professionalQuery.get(professionalId);
    
    if (!professional) {
      return NextResponse.json(
        { error: 'Professional not found' },
        { status: 404 }
      );
    }

    // Get available slots for next 30 days
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const endDate = futureDate.toISOString().split('T')[0];

    const availabilityQuery = db.prepare(`
      SELECT 
        id,
        slot_date,
        start_time,
        end_time,
        is_booked
      FROM availability_slots
      WHERE professional_id = ? 
        AND slot_date BETWEEN ? AND ?
        AND is_booked = 0
      ORDER BY slot_date, start_time
      LIMIT 50
    `);
    
    const availableSlots = availabilityQuery.all(professionalId, today, endDate);
    
    // Get review statistics
    const reviewStatsQuery = db.prepare(`
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

    const reviewStats = reviewStatsQuery.get(professionalId);

    // Get recent reviews with patient info
    const reviewsQuery = db.prepare(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        p.username as patient_username,
        p.profile_picture as patient_picture
      FROM reviews r
      JOIN patients p ON r.patient_id = p.id
      WHERE r.professional_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `);
    
    const reviews = reviewsQuery.all(professionalId);

    // Get total completed consultations
    const consultationsQuery = db.prepare(`
      SELECT COUNT(*) as total_consultations
      FROM consultations
      WHERE professional_id = ? AND status = 'completed'
    `);

    const consultationStats = consultationsQuery.get(professionalId);
    
    return NextResponse.json({
      success: true,
      data: {
        ...professional,
        available_slots: availableSlots,
        review_statistics: reviewStats,
        recent_reviews: reviews,
        total_consultations: consultationStats,
      },
    });
  } catch (error) {
    console.error('Get professional details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
