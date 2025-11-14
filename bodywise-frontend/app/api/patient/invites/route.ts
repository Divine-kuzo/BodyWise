import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';
import { sendEmail, emailTemplates } from '@/lib/email';

const db = new Database(join(process.cwd(), 'bodywise.db'));
db.pragma('foreign_keys = ON');

// POST /api/patient/invites - Send invitation to another patient
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized - Patients only' }, { status: 403 });
    }

    const body = await req.json();
    const { recipientEmail, professionalId, message } = body;

    if (!recipientEmail || !professionalId) {
      return NextResponse.json({ error: 'Recipient email and professional ID required' }, { status: 400 });
    }

    // Get sender patient info
    const sender = db.prepare(`
      SELECT p.id, p.full_name, u.email
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE u.id = ?
    `).get(decoded.userId) as { id: number; full_name: string; email: string } | undefined;

    if (!sender) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    // Get recipient patient info
    const recipient = db.prepare(`
      SELECT p.id, p.full_name, u.email
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE u.email = ?
    `).get(recipientEmail) as { id: number; full_name: string; email: string } | undefined;

    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    // Get professional info
    const professional = db.prepare(`
      SELECT hp.id, hp.full_name
      FROM health_professionals hp
      WHERE hp.id = ?
    `).get(professionalId) as { id: number; full_name: string } | undefined;

    if (!professional) {
      return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
    }

    // Create invitation
    const result = db.prepare(`
      INSERT INTO invitations (
        sender_patient_id,
        recipient_patient_id,
        professional_id,
        message,
        status
      ) VALUES (?, ?, ?, ?, 'pending')
    `).run(sender.id, recipient.id, professionalId, message || null);

    const invitationId = result.lastInsertRowid;

    // Send invitation email
    const acceptLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/user/invites/accept?id=${invitationId}`;
    
    const emailTemplate = emailTemplates.invite({
      recipientName: recipient.full_name || recipient.email,
      senderName: sender.full_name || sender.email,
      professionalName: professional.full_name,
      message,
      acceptLink,
    });

    await sendEmail(recipient.email, emailTemplate);

    return NextResponse.json({
      message: 'Invitation sent successfully',
      invitationId,
    });

  } catch (error: any) {
    console.error('Send invitation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send invitation' }, { status: 500 });
  }
}

// GET /api/patient/invites - Get invitations (sent and received)
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized - Patients only' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'sent' or 'received'

    // Get patient info
    const patient = db.prepare(`
      SELECT id FROM patients WHERE user_id = ?
    `).get(decoded.userId) as { id: number } | undefined;

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    let invitations: any[] = [];

    if (type === 'sent' || !type) {
      // Get sent invitations
      const sent = db.prepare(`
        SELECT 
          i.id,
          i.message,
          i.status,
          i.created_at,
          i.responded_at,
          rp.full_name as recipient_name,
          ru.email as recipient_email,
          hp.full_name as professional_name,
          hp.specialization
        FROM invitations i
        JOIN patients rp ON i.recipient_patient_id = rp.id
        JOIN users ru ON rp.user_id = ru.id
        JOIN health_professionals hp ON i.professional_id = hp.id
        WHERE i.sender_patient_id = ?
        ORDER BY i.created_at DESC
      `).all(patient.id);

      invitations = [...invitations, ...sent.map((inv: any) => ({ ...inv, type: 'sent' }))];
    }

    if (type === 'received' || !type) {
      // Get received invitations
      const received = db.prepare(`
        SELECT 
          i.id,
          i.message,
          i.status,
          i.created_at,
          i.responded_at,
          sp.full_name as sender_name,
          su.email as sender_email,
          hp.full_name as professional_name,
          hp.specialization,
          hp.id as professional_id
        FROM invitations i
        JOIN patients sp ON i.sender_patient_id = sp.id
        JOIN users su ON sp.user_id = su.id
        JOIN health_professionals hp ON i.professional_id = hp.id
        WHERE i.recipient_patient_id = ?
        ORDER BY i.created_at DESC
      `).all(patient.id);

      invitations = [...invitations, ...received.map((inv: any) => ({ ...inv, type: 'received' }))];
    }

    return NextResponse.json({ invitations });

  } catch (error: any) {
    console.error('Get invitations error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get invitations' }, { status: 500 });
  }
}

// PATCH /api/patient/invites - Accept or decline invitation
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized - Patients only' }, { status: 403 });
    }

    const body = await req.json();
    const { invitationId, action } = body; // action: 'accept' or 'decline'

    if (!invitationId || !action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Get patient info
    const patient = db.prepare(`
      SELECT id FROM patients WHERE user_id = ?
    `).get(decoded.userId) as { id: number } | undefined;

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    // Get invitation
    const invitation = db.prepare(`
      SELECT 
        i.id,
        i.recipient_patient_id,
        i.professional_id,
        i.status
      FROM invitations i
      WHERE i.id = ? AND i.recipient_patient_id = ?
    `).get(invitationId, patient.id) as {
      id: number;
      recipient_patient_id: number;
      professional_id: number;
      status: string;
    } | undefined;

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found or unauthorized' }, { status: 404 });
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json({ error: 'Invitation already responded to' }, { status: 400 });
    }

    if (action === 'decline') {
      // Simply update status to declined
      db.prepare(`
        UPDATE invitations
        SET status = 'declined', responded_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(invitationId);

      return NextResponse.json({ message: 'Invitation declined' });
    }

    // Accept invitation - auto-book consultation
    const autoBookResult = db.transaction(() => {
      // Find next available slot for this professional
      const availableSlot = db.prepare(`
        SELECT 
          id,
          slot_date,
          start_time,
          end_time
        FROM availability_slots
        WHERE professional_id = ? 
          AND is_booked = 0
          AND slot_date >= date('now')
        ORDER BY slot_date ASC, start_time ASC
        LIMIT 1
      `).get(invitation.professional_id) as {
        id: number;
        slot_date: string;
        start_time: string;
        end_time: string;
      } | undefined;

      if (!availableSlot) {
        throw new Error('No available slots for this professional');
      }

      // Generate Jitsi room
      const jitsiRoomId = `bodywise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const meetingLink = `https://meet.jit.si/${jitsiRoomId}`;

      // Create consultation
      const consultResult = db.prepare(`
        INSERT INTO consultations (
          patient_id,
          professional_id,
          slot_id,
          scheduled_date,
          scheduled_time,
          duration_minutes,
          meeting_link,
          jitsi_room_id,
          status
        ) VALUES (?, ?, ?, ?, ?, 30, ?, ?, 'scheduled')
      `).run(
        patient.id,
        invitation.professional_id,
        availableSlot.id,
        availableSlot.slot_date,
        availableSlot.start_time,
        meetingLink,
        jitsiRoomId
      );

      const consultationId = consultResult.lastInsertRowid;

      // Mark slot as booked
      db.prepare('UPDATE availability_slots SET is_booked = 1 WHERE id = ?').run(availableSlot.id);

      // Update invitation
      db.prepare(`
        UPDATE invitations
        SET status = 'accepted', 
            consultation_id = ?, 
            responded_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(consultationId, invitationId);

      // Schedule confirmation email
      const patientEmail = db.prepare(`
        SELECT u.email, p.full_name
        FROM users u
        JOIN patients p ON u.id = p.user_id
        WHERE p.id = ?
      `).get(patient.id) as { email: string; full_name: string } | undefined;

      const professionalData = db.prepare(`
        SELECT hp.full_name, u.email
        FROM health_professionals hp
        JOIN users u ON hp.user_id = u.id
        WHERE hp.id = ?
      `).get(invitation.professional_id) as { full_name: string; email: string } | undefined;

      if (patientEmail && professionalData) {
        db.prepare(`
          INSERT INTO email_reminders (
            consultation_id,
            recipient_email,
            reminder_type,
            scheduled_time,
            status
          ) VALUES (?, ?, 'confirmation', datetime('now'), 'pending')
        `).run(consultationId, patientEmail.email);

        // 24-hour reminder
        const consultDateTime = new Date(`${availableSlot.slot_date}T${availableSlot.start_time}`);
        const reminder24h = new Date(consultDateTime);
        reminder24h.setHours(reminder24h.getHours() - 24);

        if (reminder24h > new Date()) {
          db.prepare(`
            INSERT INTO email_reminders (
              consultation_id,
              recipient_email,
              reminder_type,
              scheduled_time,
              status
            ) VALUES (?, ?, '24hr', ?, 'pending')
          `).run(consultationId, patientEmail.email, reminder24h.toISOString());
        }
      }

      return {
        consultationId,
        meetingLink,
        scheduledDate: availableSlot.slot_date,
        scheduledTime: availableSlot.start_time,
      };
    });

    const result = autoBookResult();

    return NextResponse.json({
      message: 'Invitation accepted and consultation automatically booked!',
      consultation: result,
    });

  } catch (error: any) {
    console.error('Respond to invitation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to respond to invitation' 
    }, { status: 500 });
  }
}
