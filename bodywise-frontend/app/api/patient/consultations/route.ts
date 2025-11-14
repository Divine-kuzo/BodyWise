import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';
import { sendConfirmationEmail } from '@/lib/email-cron';

// Book a consultation
export async function POST(request: Request) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'patient')) {
      return NextResponse.json(
        { error: 'Unauthorized. Patient access required.' },
        { status: 403 }
      );
    }
    
    const { professional_id, scheduled_date, scheduled_time } = await request.json();
    
    // Validate input
    if (!professional_id || !scheduled_date || !scheduled_time) {
      return NextResponse.json(
        { error: 'Professional ID, date, and time are required' },
        { status: 400 }
      );
    }
    
    // Get patient ID
    const patientQuery = db.prepare('SELECT id FROM patients WHERE user_id = ?');
    const patient = patientQuery.get(currentUser.userId) as any;
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      );
    }
    
    // Check if professional exists and is active
    const professionalCheck = db.prepare(`
      SELECT hp.id 
      FROM health_professionals hp
      JOIN users u ON hp.user_id = u.id
      WHERE hp.id = ? AND u.is_active = 1
    `);
    
    if (!professionalCheck.get(professional_id)) {
      return NextResponse.json(
        { error: 'Professional not found or inactive' },
        { status: 404 }
      );
    }
    
    // Check if patient already has 2 bookings for this day (limit per day)
    const patientBookingsToday = db.prepare(`
      SELECT COUNT(*) as count FROM consultations
      WHERE patient_id = ?
        AND scheduled_date = ?
        AND status IN ('scheduled', 'confirmed')
    `).get(patient.id, scheduled_date) as { count: number };

    if (patientBookingsToday.count >= 2) {
      return NextResponse.json(
        { error: 'You can only book up to 2 consultations per day' },
        { status: 409 }
      );
    }

    // Check for conflicting appointments
    const conflictCheck = db.prepare(`
      SELECT id FROM consultations
      WHERE professional_id = ? 
        AND scheduled_date = ? 
        AND scheduled_time = ?
        AND status IN ('scheduled', 'confirmed')
    `);
    
    if (conflictCheck.get(professional_id, scheduled_date, scheduled_time)) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
    }
    
    // Create consultation with start_time
    const startTime = new Date(`${scheduled_date}T${scheduled_time}`);
    const insertQuery = db.prepare(`
      INSERT INTO consultations (patient_id, professional_id, scheduled_date, scheduled_time, start_time, duration_minutes, status, meeting_link)
      VALUES (?, ?, ?, ?, ?, 30, 'scheduled', ?)
    `);
    
    const meetingLink = `https://meet.jit.si/bodywise-${Date.now()}`; // Jitsi room
    const result = insertQuery.run(
      patient.id, 
      professional_id, 
      scheduled_date, 
      scheduled_time, 
      startTime.toISOString(),
      meetingLink
    );
    
    // Send confirmation email asynchronously
    const consultationId = Number(result.lastInsertRowid);
    sendConfirmationEmail(consultationId).catch((error: unknown) => {
      console.error('Failed to send confirmation email:', error);
      // Don't fail the booking if email fails
    });
    
    return NextResponse.json({
      success: true,
      message: 'Consultation booked successfully. Confirmation email sent.',
      data: {
        consultation_id: consultationId,
        scheduled_date,
        scheduled_time,
        duration_minutes: 30,
        meeting_link: meetingLink,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Book consultation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get patient's consultations
export async function GET(request: Request) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'patient')) {
      return NextResponse.json(
        { error: 'Unauthorized. Patient access required.' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Get patient ID
    const patientQuery = db.prepare('SELECT id FROM patients WHERE user_id = ?');
    const patient = patientQuery.get(currentUser.userId) as any;
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      );
    }
    
    let query = `
      SELECT 
        c.id,
        c.scheduled_date,
        c.scheduled_time,
        c.duration_minutes,
        c.meeting_link,
        c.status,
        c.created_at,
        hp.full_name as professional_name,
        hp.specialization,
        hp.profile_picture as professional_picture,
        i.name as institution_name
      FROM consultations c
      JOIN health_professionals hp ON c.professional_id = hp.id
      LEFT JOIN institutions i ON hp.institution_id = i.id
      WHERE c.patient_id = ?
    `;
    
    const params: any[] = [patient.id];
    
    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY c.scheduled_date DESC, c.scheduled_time DESC';
    
    const consultations = db.prepare(query).all(...params);
    
    return NextResponse.json({
      success: true,
      data: consultations,
    });
  } catch (error) {
    console.error('Get consultations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
