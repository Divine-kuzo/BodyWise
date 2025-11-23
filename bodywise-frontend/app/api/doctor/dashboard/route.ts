import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// GET /api/doctor/dashboard - Get doctor/professional dashboard data
export async function GET(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || currentUser.role !== 'health_professional') {
      return NextResponse.json(
        { error: 'Unauthorized. Health professional access required.' },
        { status: 403 }
      );
    }

    // Get professional ID and details
    const professional = db.prepare(`
      SELECT 
        hp.id,
        hp.full_name,
        hp.specialization,
        hp.years_of_experience,
        hp.average_rating,
        hp.total_reviews,
        i.name as institution_name
      FROM health_professionals hp
      LEFT JOIN institutions i ON hp.institution_id = i.id
      WHERE hp.user_id = ?
    `).get(currentUser.userId) as any;

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional profile not found' },
        { status: 404 }
      );
    }

    // Get consultation stats
    const consultationStats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'scheduled' OR status = 'confirmed' THEN 1 ELSE 0 END) as scheduled,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN date(scheduled_date) = date('now') AND status IN ('scheduled', 'confirmed') THEN 1 ELSE 0 END) as todays_sessions
      FROM consultations
      WHERE professional_id = ?
    `).get(currentUser.userId) as {
      total: number;
      scheduled: number;
      completed: number;
      cancelled: number;
      todays_sessions: number;
    };

    // Get active patients (unique patients who have had consultations)
    const activePatients = db.prepare(`
      SELECT DISTINCT
        p.id,
        p.full_name,
        p.username,
        p.profile_picture,
        (SELECT COUNT(*) FROM consultations c2 WHERE c2.patient_id = p.user_id AND c2.professional_id = ?) as total_sessions,
        (SELECT MAX(c3.scheduled_date) FROM consultations c3 WHERE c3.patient_id = p.user_id AND c3.professional_id = ? AND c3.status = 'completed') as last_session_date,
        (SELECT MIN(c4.scheduled_date) FROM consultations c4 WHERE c4.patient_id = p.user_id AND c4.professional_id = ? AND c4.status IN ('scheduled', 'confirmed') AND date(c4.scheduled_date) >= date('now')) as next_session_date
      FROM consultations c
      JOIN patients p ON c.patient_id = p.user_id
      WHERE c.professional_id = ?
      GROUP BY p.id
      ORDER BY last_session_date DESC
      LIMIT 10
    `).all(currentUser.userId, currentUser.userId, currentUser.userId, currentUser.userId);

    // Get today's consultations
    const todayConsultations = db.prepare(`
      SELECT 
        c.id,
        c.scheduled_date,
        c.scheduled_time,
        c.duration_minutes,
        c.meeting_link,
        c.status,
        c.notes,
        p.full_name as patient_name,
        p.username as patient_username,
        p.profile_picture as patient_picture
      FROM consultations c
      JOIN patients p ON c.patient_id = p.user_id
      WHERE c.professional_id = ?
        AND date(c.scheduled_date) = date('now')
        AND c.status IN ('scheduled', 'confirmed')
      ORDER BY c.scheduled_time ASC
    `).all(currentUser.userId);

    // Get upcoming consultations (next 7 days, excluding today)
    const upcomingConsultations = db.prepare(`
      SELECT 
        c.id,
        c.scheduled_date,
        c.scheduled_time,
        c.duration_minutes,
        c.meeting_link,
        c.status,
        c.notes,
        p.full_name as patient_name,
        p.username as patient_username,
        p.profile_picture as patient_picture
      FROM consultations c
      JOIN patients p ON c.patient_id = p.user_id
      WHERE c.professional_id = ?
        AND c.status IN ('scheduled', 'confirmed')
        AND date(c.scheduled_date) > date('now')
        AND date(c.scheduled_date) <= date('now', '+7 days')
      ORDER BY c.scheduled_date ASC, c.scheduled_time ASC
      LIMIT 10
    `).all(currentUser.userId);

    // Get recent articles by this professional
    const recentArticles = db.prepare(`
      SELECT 
        a.id,
        a.title,
        a.content,
        a.category,
        a.thumbnail_url,
        a.views_count,
        a.created_at,
        i.name as institution_name
      FROM articles a
      LEFT JOIN institutions i ON a.institution_id = i.id
      WHERE a.author_type = 'health_professional'
        AND a.author_id = ?
        AND a.approval_status = 'approved'
        AND a.is_published = 1
      ORDER BY a.created_at DESC
      LIMIT 5
    `).all(professional.id);

    return NextResponse.json({
      success: true,
      data: {
        professional: {
          id: professional.id,
          name: professional.full_name,
          specialization: professional.specialization,
          institution: professional.institution_name || 'Independent',
          experience: professional.years_of_experience,
          rating: professional.average_rating,
          total_reviews: professional.total_reviews,
        },
        stats: {
          totalConsultations: consultationStats.total || 0,
          scheduledConsultations: consultationStats.scheduled || 0,
          completedConsultations: consultationStats.completed || 0,
          cancelledConsultations: consultationStats.cancelled || 0,
          activePatients: activePatients.length,
          todaysSessions: consultationStats.todays_sessions || 0,
        },
        todayConsultations,
        upcomingConsultations,
        activePatients,
        recentArticles,
      },
    });

  } catch (error) {
    console.error('Get doctor dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
