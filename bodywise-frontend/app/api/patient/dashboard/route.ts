import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// GET /api/patient/dashboard - Get patient dashboard data
export async function GET(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'patient')) {
      return NextResponse.json(
        { error: 'Unauthorized. Patient access required.' },
        { status: 403 }
      );
    }

    // Get patient ID
    const patient = db.prepare(`
      SELECT id, username, full_name FROM patients WHERE user_id = ?
    `).get(currentUser.userId) as { id: number; username: string; full_name: string } | undefined;

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      );
    }

    // Get upcoming appointments (next 7 days)
    const upcomingAppointments = db.prepare(`
      SELECT 
        c.id,
        c.scheduled_date,
        c.scheduled_time,
        c.duration_minutes,
        c.meeting_link,
        c.status,
        c.notes,
        hp.full_name as doctor_name,
        hp.specialization,
        hp.profile_picture as doctor_picture,
        i.name as institution_name
      FROM consultations c
      JOIN health_professionals hp ON c.professional_id = hp.id
      LEFT JOIN institutions i ON hp.institution_id = i.id
      WHERE c.patient_id = ?
        AND c.status IN ('scheduled', 'confirmed')
        AND date(c.scheduled_date) >= date('now')
        AND date(c.scheduled_date) <= date('now', '+7 days')
      ORDER BY c.scheduled_date ASC, c.scheduled_time ASC
      LIMIT 5
    `).all(patient.id);

    // Get consultation stats
    const consultationStats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'scheduled' OR status = 'confirmed' THEN 1 ELSE 0 END) as scheduled,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM consultations
      WHERE patient_id = ?
    `).get(patient.id) as {
      total: number;
      scheduled: number;
      completed: number;
      cancelled: number;
    };

    // Get recent articles (last 3)
    const recentArticles = db.prepare(`
      SELECT 
        a.id,
        a.title,
        a.content,
        a.category,
        a.thumbnail_url,
        a.views_count,
        a.created_at,
        CASE 
          WHEN a.author_type = 'health_professional' THEN hp.full_name
          WHEN a.author_type = 'institutional_admin' THEN ia.full_name
        END as author_name,
        CASE 
          WHEN a.author_type = 'health_professional' THEN hp.specialization
          ELSE NULL
        END as author_specialization,
        i.name as institution_name
      FROM articles a
      LEFT JOIN health_professionals hp ON a.author_type = 'health_professional' AND a.author_id = hp.id
      LEFT JOIN institutional_admins ia ON a.author_type = 'institutional_admin' AND a.author_id = ia.id
      LEFT JOIN institutions i ON a.institution_id = i.id
      WHERE a.approval_status = 'approved' AND a.is_published = 1
      ORDER BY a.created_at DESC
      LIMIT 3
    `).all();

    // Get pending invitations from consultation_attendees
    const pendingInvitations = db.prepare(`
      SELECT 
        ca.id,
        ca.invitation_status as status,
        ca.invited_at,
        c.scheduled_date,
        c.scheduled_time,
        hp.full_name as doctor_name,
        p.username as invitee_username
      FROM consultation_attendees ca
      JOIN consultations c ON ca.consultation_id = c.id
      JOIN health_professionals hp ON c.professional_id = hp.id
      JOIN patients p ON ca.patient_id = p.id
      WHERE ca.patient_id = ?
        AND ca.invitation_status = 'pending'
      ORDER BY ca.invited_at DESC
      LIMIT 5
    `).all(patient.id) as any[];

    return NextResponse.json({
      success: true,
      data: {
        patient: {
          name: patient.full_name || patient.username,
          username: patient.username,
        },
        stats: {
          totalConsultations: consultationStats.total || 0,
          scheduledConsultations: consultationStats.scheduled || 0,
          completedConsultations: consultationStats.completed || 0,
          cancelledConsultations: consultationStats.cancelled || 0,
        },
        upcomingAppointments,
        recentArticles,
        pendingInvitations,
      },
    });

  } catch (error) {
    console.error('Get patient dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
