import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';

const db = new Database(join(process.cwd(), 'bodywise.db'));
db.pragma('foreign_keys = ON');

// GET /api/professional/consultations - Get doctor's consultations
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'health_professional') {
      return NextResponse.json({ error: 'Unauthorized - Health professionals only' }, { status: 403 });
    }

    // Get professional_id
    const professional = db.prepare(
      'SELECT id FROM health_professionals WHERE user_id = ?'
    ).get(decoded.userId) as { id: number } | undefined;

    if (!professional) {
      return NextResponse.json({ error: 'Health professional profile not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

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
        p.full_name as patient_name,
        p.username as patient_username,
        p.profile_picture as patient_picture,
        u.email as patient_email
      FROM consultations c
      JOIN patients p ON c.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE c.professional_id = ?
    `;
    const params: any[] = [professional.id];

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND c.scheduled_date = ?';
      params.push(date);
    }

    query += ' ORDER BY c.scheduled_date ASC, c.scheduled_time ASC';

    const consultations = db.prepare(query).all(...params);

    return NextResponse.json({ consultations });

  } catch (error: any) {
    console.error('Get consultations error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get consultations' }, { status: 500 });
  }
}

// PATCH /api/professional/consultations - Update consultation status
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'health_professional') {
      return NextResponse.json({ error: 'Unauthorized - Health professionals only' }, { status: 403 });
    }

    const body = await req.json();
    const { consultationId, status, notes } = body;

    if (!consultationId || !status) {
      return NextResponse.json({ error: 'Consultation ID and status required' }, { status: 400 });
    }

    // Get professional_id
    const professional = db.prepare(
      'SELECT id FROM health_professionals WHERE user_id = ?'
    ).get(decoded.userId) as { id: number } | undefined;

    if (!professional) {
      return NextResponse.json({ error: 'Health professional profile not found' }, { status: 404 });
    }

    // Check if consultation belongs to this professional
    const consultation = db.prepare(`
      SELECT id FROM consultations
      WHERE id = ? AND professional_id = ?
    `).get(consultationId, professional.id);

    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found or unauthorized' }, { status: 404 });
    }

    // Update consultation
    let updateQuery = 'UPDATE consultations SET status = ?, updated_at = CURRENT_TIMESTAMP';
    const params: any[] = [status];

    if (notes !== undefined) {
      updateQuery += ', notes = ?';
      params.push(notes);
    }

    updateQuery += ' WHERE id = ?';
    params.push(consultationId);

    db.prepare(updateQuery).run(...params);

    return NextResponse.json({ message: 'Consultation updated successfully' });

  } catch (error: any) {
    console.error('Update consultation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update consultation' 
    }, { status: 500 });
  }
}
