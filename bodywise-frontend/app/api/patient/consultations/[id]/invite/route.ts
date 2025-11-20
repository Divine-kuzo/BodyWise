import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// Invite another patient to group session
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
    
    const { id } = await params;
    const consultationId = parseInt(id);
    const { patient_username } = await request.json();
    
    // Validate input
    if (!patient_username) {
      return NextResponse.json(
        { error: 'Patient username is required' },
        { status: 400 }
      );
    }
    
    // Get current patient ID
    const currentPatientQuery = db.prepare('SELECT id FROM patients WHERE user_id = ?');
    const currentPatient = currentPatientQuery.get(currentUser.userId) as any;
    
    if (!currentPatient) {
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      );
    }
    
    // Verify consultation exists and belongs to current patient
    const consultationCheck = db.prepare(`
      SELECT id FROM consultations
      WHERE id = ? AND patient_id = ? AND status = 'scheduled'
    `);
    
    if (!consultationCheck.get(consultationId, currentPatient.id)) {
      return NextResponse.json(
        { error: 'Consultation not found or you do not have permission' },
        { status: 404 }
      );
    }
    
    // Find invited patient by username
    const invitedPatientQuery = db.prepare('SELECT id FROM patients WHERE username = ?');
    const invitedPatient = invitedPatientQuery.get(patient_username) as any;
    
    if (!invitedPatient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    // Check if already invited
    const existingInvite = db.prepare(`
      SELECT id FROM consultation_attendees
      WHERE consultation_id = ? AND patient_id = ?
    `).get(consultationId, invitedPatient.id);
    
    if (existingInvite) {
      return NextResponse.json(
        { error: 'Patient already invited to this consultation' },
        { status: 409 }
      );
    }
    
    // Create invitation
    const insertQuery = db.prepare(`
      INSERT INTO consultation_attendees (consultation_id, patient_id, invitation_status)
      VALUES (?, ?, 'pending')
    `);
    
    insertQuery.run(consultationId, invitedPatient.id);
    
    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Invite patient error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get consultation invites for current patient
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
    
    // Get patient ID
    const patientQuery = db.prepare('SELECT id FROM patients WHERE user_id = ?');
    const patient = patientQuery.get(currentUser.userId) as any;
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      );
    }
    
    // Get pending invitations
    const invitesQuery = db.prepare(`
      SELECT 
        ca.id,
        ca.invitation_status,
        ca.invited_at,
        c.id as consultation_id,
        c.scheduled_date,
        c.scheduled_time,
        c.duration_minutes,
        hp.full_name as professional_name,
        hp.specialization,
        p.username as invited_by
      FROM consultation_attendees ca
      JOIN consultations c ON ca.consultation_id = c.id
      JOIN health_professionals hp ON c.professional_id = hp.id
      JOIN patients p ON c.patient_id = p.id
      WHERE ca.patient_id = ? AND ca.invitation_status = 'pending'
      ORDER BY ca.invited_at DESC
    `);
    
    const invites = invitesQuery.all(patient.id);
    
    return NextResponse.json({
      success: true,
      data: invites,
    });
  } catch (error) {
    console.error('Get invites error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
