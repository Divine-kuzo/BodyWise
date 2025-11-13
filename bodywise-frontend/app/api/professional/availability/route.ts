import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';

const db = new Database(join(process.cwd(), 'bodywise.db'));
db.pragma('foreign_keys = ON');

// Helper to generate 30-minute time slots
function generateTimeSlots(startTime: string, endTime: string, date: string) {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const start = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    
    // Add 30 minutes
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin -= 60;
      currentHour += 1;
    }
    
    const end = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    
    // Don't add slot if it goes beyond end time
    if (currentHour < endHour || (currentHour === endHour && currentMin <= endMin)) {
      slots.push({ date, start_time: start, end_time: end });
    }
  }
  
  return slots;
}

// POST /api/professional/availability - Create availability slots
export async function POST(req: NextRequest) {
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
    const { date, startTime, endTime, generateMultiple } = body;

    if (!date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get professional_id from user_id
    const professional = db.prepare(
      'SELECT id FROM health_professionals WHERE user_id = ?'
    ).get(decoded.userId) as { id: number } | undefined;

    if (!professional) {
      return NextResponse.json({ error: 'Health professional profile not found' }, { status: 404 });
    }

    // Generate 30-minute slots
    const slots = generateTimeSlots(startTime, endTime, date);
    
    // Check for conflicts
    const existingSlots = db.prepare(`
      SELECT start_time, end_time FROM availability_slots 
      WHERE professional_id = ? AND slot_date = ?
    `).all(professional.id, date) as Array<{ start_time: string; end_time: string }>;

    const conflicts = [];
    for (const slot of slots) {
      const hasConflict = existingSlots.some(existing => {
        return !(slot.end_time <= existing.start_time || slot.start_time >= existing.end_time);
      });
      if (hasConflict) {
        conflicts.push(slot);
      }
    }

    if (conflicts.length > 0) {
      return NextResponse.json({ 
        error: 'Time slot conflicts detected',
        conflicts: conflicts.map(c => `${c.start_time} - ${c.end_time}`)
      }, { status: 409 });
    }

    // Insert all slots
    const insertStmt = db.prepare(`
      INSERT INTO availability_slots (professional_id, slot_date, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `);

    const insertMany = db.transaction((slotsToInsert) => {
      for (const slot of slotsToInsert) {
        insertStmt.run(professional.id, slot.date, slot.start_time, slot.end_time);
      }
    });

    insertMany(slots);

    return NextResponse.json({ 
      message: 'Availability slots created successfully',
      slotsCreated: slots.length,
      slots
    });

  } catch (error: any) {
    console.error('Create availability error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create availability' }, { status: 500 });
  }
}

// GET /api/professional/availability - Get professional's availability
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

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Get professional_id
    const professional = db.prepare(
      'SELECT id FROM health_professionals WHERE user_id = ?'
    ).get(decoded.userId) as { id: number } | undefined;

    if (!professional) {
      return NextResponse.json({ error: 'Health professional profile not found' }, { status: 404 });
    }

    let query = `
      SELECT 
        id,
        slot_date,
        start_time,
        end_time,
        is_booked,
        created_at
      FROM availability_slots
      WHERE professional_id = ?
    `;
    const params: any[] = [professional.id];

    if (date) {
      query += ' AND slot_date = ?';
      params.push(date);
    } else if (startDate && endDate) {
      query += ' AND slot_date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY slot_date, start_time';

    const slots = db.prepare(query).all(...params);

    return NextResponse.json({ 
      slots,
      totalSlots: slots.length
    });

  } catch (error: any) {
    console.error('Get availability error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get availability' }, { status: 500 });
  }
}

// DELETE /api/professional/availability - Delete availability slots
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'health_professional') {
      return NextResponse.json({ error: 'Unauthorized - Health professionals only' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const slotId = searchParams.get('id');

    if (!slotId) {
      return NextResponse.json({ error: 'Slot ID required' }, { status: 400 });
    }

    // Get professional_id
    const professional = db.prepare(
      'SELECT id FROM health_professionals WHERE user_id = ?'
    ).get(decoded.userId) as { id: number } | undefined;

    if (!professional) {
      return NextResponse.json({ error: 'Health professional profile not found' }, { status: 404 });
    }

    // Check if slot exists and belongs to this professional
    const slot = db.prepare(`
      SELECT id, is_booked FROM availability_slots 
      WHERE id = ? AND professional_id = ?
    `).get(slotId, professional.id) as { id: number; is_booked: number } | undefined;

    if (!slot) {
      return NextResponse.json({ error: 'Slot not found or unauthorized' }, { status: 404 });
    }

    if (slot.is_booked) {
      return NextResponse.json({ error: 'Cannot delete booked slot' }, { status: 400 });
    }

    // Delete the slot
    db.prepare('DELETE FROM availability_slots WHERE id = ?').run(slotId);

    return NextResponse.json({ message: 'Slot deleted successfully' });

  } catch (error: any) {
    console.error('Delete availability error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete availability' }, { status: 500 });
  }
}
