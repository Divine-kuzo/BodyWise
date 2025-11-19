import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import db from '@/lib/db';

// GET - Get professional's own profile
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'health_professional') {
      return NextResponse.json(
        { error: 'Unauthorized. Health professional access required.' },
        { status: 403 }
      );
    }

    // Get professional profile with institution details
    const professionalQuery = db.prepare(`
      SELECT 
        hp.id,
        hp.user_id,
        hp.full_name,
        hp.bio,
        hp.specialization,
        hp.years_of_experience,
        hp.phone,
        hp.profile_picture,
        hp.calendar_integration,
        hp.average_rating,
        hp.total_reviews,
        hp.institution_id,
        i.name as institution_name,
        i.location as institution_location,
        i.verification_status as institution_verification,
        u.email,
        u.is_verified,
        u.is_active
      FROM health_professionals hp
      JOIN users u ON hp.user_id = u.id
      LEFT JOIN institutions i ON hp.institution_id = i.id
      WHERE hp.user_id = ?
    `);

    const professional = professionalQuery.get(decoded.userId) as any;

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional profile not found' },
        { status: 404 }
      );
    }

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

    const reviewStats = reviewStatsQuery.get(professional.id) as any;

    // Get recent reviews
    const recentReviewsQuery = db.prepare(`
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
      LIMIT 5
    `);

    const recentReviews = recentReviewsQuery.all(professional.id);

    return NextResponse.json({
      success: true,
      profile: {
        ...professional,
        review_statistics: reviewStats,
        recent_reviews: recentReviews,
      },
    });
  } catch (error) {
    console.error('Get professional profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update professional profile
export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'health_professional') {
      return NextResponse.json(
        { error: 'Unauthorized. Health professional access required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      full_name,
      bio,
      specialization,
      years_of_experience,
      phone,
      profile_picture,
      calendar_integration,
    } = body;

    // Validate required fields
    if (!full_name || !specialization) {
      return NextResponse.json(
        { error: 'Full name and specialization are required' },
        { status: 400 }
      );
    }

    // Get current professional
    const currentProfessional = db.prepare(`
      SELECT id, institution_id FROM health_professionals WHERE user_id = ?
    `).get(decoded.userId) as any;

    if (!currentProfessional) {
      return NextResponse.json(
        { error: 'Professional profile not found' },
        { status: 404 }
      );
    }

    // Update profile
    const updateQuery = db.prepare(`
      UPDATE health_professionals 
      SET 
        full_name = ?,
        bio = ?,
        specialization = ?,
        years_of_experience = ?,
        phone = ?,
        profile_picture = ?,
        calendar_integration = ?
      WHERE user_id = ?
    `);

    updateQuery.run(
      full_name,
      bio || null,
      specialization,
      years_of_experience || 0,
      phone || null,
      profile_picture || null,
      calendar_integration || null,
      decoded.userId
    );

    // Get updated profile
    const updatedProfile = db.prepare(`
      SELECT 
        hp.*,
        i.name as institution_name,
        i.location as institution_location
      FROM health_professionals hp
      LEFT JOIN institutions i ON hp.institution_id = i.id
      WHERE hp.user_id = ?
    `).get(decoded.userId);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Update professional profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
