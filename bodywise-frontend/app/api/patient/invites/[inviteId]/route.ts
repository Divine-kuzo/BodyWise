import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// Respond to consultation invite (accept/decline)
export async function PUT(
  request: Request,
  { params }: { params: { inviteId: string } }
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
    
    const inviteId = parseInt(params.inviteId);
    const { action } = await request.json();
    
    // Validate action
    if (!action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Valid action (accept/decline) is required' },
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
    
    // Verify invite belongs to patient
    const inviteCheck = db.prepare(`
      SELECT ca.id, c.meeting_link
      FROM consultation_attendees ca
      JOIN consultations c ON ca.consultation_id = c.id
      WHERE ca.id = ? AND ca.patient_id = ? AND ca.invitation_status = 'pending'
    `).get(inviteId, patient.id) as any;
    
    if (!inviteCheck) {
      return NextResponse.json(
        { error: 'Invite not found or already responded' },
        { status: 404 }
      );
    }
    
    // Update invitation status
    const status = action === 'accept' ? 'accepted' : 'declined';
    const updateQuery = db.prepare(`
      UPDATE consultation_attendees
      SET invitation_status = ?
      WHERE id = ?
    `);
    
    updateQuery.run(status, inviteId);
    
    return NextResponse.json({
      success: true,
      message: `Invitation ${status}`,
      meeting_link: action === 'accept' ? inviteCheck.meeting_link : null,
    });
  } catch (error) {
    console.error('Respond to invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
