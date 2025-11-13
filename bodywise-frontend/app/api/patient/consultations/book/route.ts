import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';
import { randomBytes } from 'crypto';

const db = new Database(join(process.cwd(), 'bodywise.db'));
db.pragma('foreign_keys = ON');

// Helper to generate unique Jitsi room ID
function generateJitsiRoomId(): string {
  return `bodywise-${Date.now()}-${randomBytes(8).toString('hex')}`;
}

// POST /api/patient/consultations/book - Book a consultation
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
    const { professionalId, slotId, notes } = body;

    if (!professionalId || !slotId) {
      return NextResponse.json({ error: 'Professional ID and Slot ID required' }, { status: 400 });
    }

    // Get patient_id from user_id
    const patient = db.prepare(
      'SELECT id FROM patients WHERE user_id = ?'
    ).get(decoded.userId) as { id: number } | undefined;

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    // Start transaction for atomic booking
    const bookConsultation = db.transaction(() => {
      // Check if slot exists, is not booked, and belongs to the specified professional
      const slot = db.prepare(`
        SELECT 
          id,
          professional_id,
          slot_date,
          start_time,
          end_time,
          is_booked
        FROM availability_slots
        WHERE id = ? AND professional_id = ? AND is_booked = 0
      `).get(slotId, professionalId) as {
        id: number;
        professional_id: number;
        slot_date: string;
        start_time: string;
        end_time: string;
        is_booked: number;
      } | undefined;

      if (!slot) {
        throw new Error('Slot not available or already booked');
      }

      // Generate unique Jitsi room
      const jitsiRoomId = generateJitsiRoomId();
      const meetingLink = `https://meet.jit.si/${jitsiRoomId}`;

      // Create consultation
      const insertConsultation = db.prepare(`
        INSERT INTO consultations (
          patient_id,
          professional_id,
          slot_id,
          scheduled_date,
          scheduled_time,
          duration_minutes,
          meeting_link,
          jitsi_room_id,
          status,
          notes
        ) VALUES (?, ?, ?, ?, ?, 30, ?, ?, 'scheduled', ?)
      `);

      const result = insertConsultation.run(
        patient.id,
        professionalId,
        slotId,
        slot.slot_date,
        slot.start_time,
        meetingLink,
        jitsiRoomId,
        notes || null
      );

      const consultationId = result.lastInsertRowid;

      // Mark slot as booked
      db.prepare('UPDATE availability_slots SET is_booked = 1 WHERE id = ?').run(slotId);

      // Get patient and professional emails for reminders
      const patientEmail = db.prepare(`
        SELECT u.email FROM users u
        JOIN patients p ON u.id = p.user_id
        WHERE p.id = ?
      `).get(patient.id) as { email: string } | undefined;

      const professionalEmail = db.prepare(`
        SELECT u.email FROM users u
        JOIN health_professionals hp ON u.id = hp.user_id
        WHERE hp.id = ?
      `).get(professionalId) as { email: string } | undefined;

      // Schedule email reminders
      const consultationDateTime = new Date(`${slot.slot_date}T${slot.start_time}`);
      
      // Confirmation email (immediate)
      const insertReminder = db.prepare(`
        INSERT INTO email_reminders (
          consultation_id,
          recipient_email,
          reminder_type,
          scheduled_time,
          status
        ) VALUES (?, ?, ?, datetime('now'), 'pending')
      `);

      if (patientEmail) {
        insertReminder.run(consultationId, patientEmail.email, 'confirmation');
      }
      if (professionalEmail) {
        insertReminder.run(consultationId, professionalEmail.email, 'confirmation');
      }

      // 24-hour reminder
      const reminder24h = new Date(consultationDateTime);
      reminder24h.setHours(reminder24h.getHours() - 24);
      
      if (patientEmail && reminder24h > new Date()) {
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

      // 1-hour reminder
      const reminder1h = new Date(consultationDateTime);
      reminder1h.setHours(reminder1h.getHours() - 1);
      
      if (patientEmail && reminder1h > new Date()) {
        db.prepare(`
          INSERT INTO email_reminders (
            consultation_id,
            recipient_email,
            reminder_type,
            scheduled_time,
            status
          ) VALUES (?, ?, '1hr', ?, 'pending')
        `).run(consultationId, patientEmail.email, reminder1h.toISOString());
      }

      return {
        consultationId,
        meetingLink,
        jitsiRoomId,
        scheduledDate: slot.slot_date,
        scheduledTime: slot.start_time,
      };
    });

    const result = bookConsultation();

    return NextResponse.json({
      message: 'Consultation booked successfully',
      consultation: result
    });

  } catch (error: any) {
    console.error('Book consultation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to book consultation' 
    }, { status: 500 });
  }
}

// GET /api/patient/consultations - Get patient's consultations
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

    // Get patient_id
    const patient = db.prepare(
      'SELECT id FROM patients WHERE user_id = ?'
    ).get(decoded.userId) as { id: number } | undefined;

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = `
      SELECT 
        c.id,
        c.scheduled_date,
        c.scheduled_time,
        c.duration_minutes,
        c.meeting_link,
        c.jitsi_room_id,
        c.status,
        c.notes,
        c.created_at,
        hp.full_name as professional_name,
        hp.specialization,
        hp.profile_picture as professional_picture
      FROM consultations c
      JOIN health_professionals hp ON c.professional_id = hp.id
      WHERE c.patient_id = ?
    `;
    const params: any[] = [patient.id];

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    query += ' ORDER BY c.scheduled_date DESC, c.scheduled_time DESC';

    const consultations = db.prepare(query).all(...params);

    return NextResponse.json({ consultations });

  } catch (error: any) {
    console.error('Get consultations error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get consultations' }, { status: 500 });
  }
}

// PATCH /api/patient/consultations - Cancel consultation
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
    const { consultationId } = body;

    if (!consultationId) {
      return NextResponse.json({ error: 'Consultation ID required' }, { status: 400 });
    }

    // Get patient_id
    const patient = db.prepare(
      'SELECT id FROM patients WHERE user_id = ?'
    ).get(decoded.userId) as { id: number } | undefined;

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    // Cancel consultation in transaction
    const cancelConsultation = db.transaction(() => {
      // Check if consultation exists and belongs to patient
      const consultation = db.prepare(`
        SELECT id, slot_id, status FROM consultations
        WHERE id = ? AND patient_id = ?
      `).get(consultationId, patient.id) as {
        id: number;
        slot_id: number;
        status: string;
      } | undefined;

      if (!consultation) {
        throw new Error('Consultation not found or unauthorized');
      }

      if (consultation.status === 'cancelled') {
        throw new Error('Consultation already cancelled');
      }

      // Update consultation status
      db.prepare('UPDATE consultations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run('cancelled', consultationId);

      // Free up the slot
      if (consultation.slot_id) {
        db.prepare('UPDATE availability_slots SET is_booked = 0 WHERE id = ?')
          .run(consultation.slot_id);
      }

      // Cancel pending email reminders
      db.prepare(`
        UPDATE email_reminders 
        SET status = 'failed', error_message = 'Consultation cancelled'
        WHERE consultation_id = ? AND status = 'pending'
      `).run(consultationId);
    });

    cancelConsultation();

    return NextResponse.json({ message: 'Consultation cancelled successfully' });

  } catch (error: any) {
    console.error('Cancel consultation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to cancel consultation' 
    }, { status: 500 });
  }
}
