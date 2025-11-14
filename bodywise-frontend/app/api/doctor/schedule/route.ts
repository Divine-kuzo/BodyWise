import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// GET - Get doctor's schedules
export async function GET(request: NextRequest) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'professional')) {
      return NextResponse.json(
        { error: 'Unauthorized. Professional access required.' },
        { status: 403 }
      );
    }

    // Get professional_id
    const professional = db.prepare(
      'SELECT id FROM health_professionals WHERE user_id = ?'
    ).get(currentUser.userId) as { id: number } | undefined;

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional profile not found' },
        { status: 404 }
      );
    }

    // Get all schedules for this professional
    const schedules = db.prepare(`
      SELECT 
        id,
        day_of_week,
        start_time,
        end_time,
        is_available
      FROM availability_schedules
      WHERE professional_id = ?
      ORDER BY day_of_week, start_time
    `).all(professional.id);

    return NextResponse.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.error('Get schedules error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new schedule
export async function POST(request: NextRequest) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'professional')) {
      return NextResponse.json(
        { error: 'Unauthorized. Professional access required.' },
        { status: 403 }
      );
    }

    const { day_of_week, start_time, end_time } = await request.json();

    // Validate input
    if (day_of_week === undefined || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Day of week, start time, and end time are required' },
        { status: 400 }
      );
    }

    if (day_of_week < 0 || day_of_week > 6) {
      return NextResponse.json(
        { error: 'Day of week must be between 0 (Sunday) and 6 (Saturday)' },
        { status: 400 }
      );
    }

    // Get professional_id
    const professional = db.prepare(
      'SELECT id FROM health_professionals WHERE user_id = ?'
    ).get(currentUser.userId) as { id: number } | undefined;

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional profile not found' },
        { status: 404 }
      );
    }

    // Check for conflicts
    const conflict = db.prepare(`
      SELECT id FROM availability_schedules
      WHERE professional_id = ?
        AND day_of_week = ?
        AND (
          (start_time <= ? AND end_time > ?) OR
          (start_time < ? AND end_time >= ?) OR
          (start_time >= ? AND end_time <= ?)
        )
    `).get(
      professional.id,
      day_of_week,
      start_time, start_time,
      end_time, end_time,
      start_time, end_time
    );

    if (conflict) {
      return NextResponse.json(
        { error: 'This time slot conflicts with an existing schedule' },
        { status: 409 }
      );
    }

    // Insert schedule
    const result = db.prepare(`
      INSERT INTO availability_schedules (professional_id, day_of_week, start_time, end_time, is_available)
      VALUES (?, ?, ?, ?, 1)
    `).run(professional.id, day_of_week, start_time, end_time);

    return NextResponse.json({
      success: true,
      message: 'Schedule created successfully',
      data: {
        id: result.lastInsertRowid,
        day_of_week,
        start_time,
        end_time,
        is_available: true,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create schedule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a schedule
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'professional')) {
      return NextResponse.json(
        { error: 'Unauthorized. Professional access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('id');

    if (!scheduleId) {
      return NextResponse.json(
        { error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    // Get professional_id
    const professional = db.prepare(
      'SELECT id FROM health_professionals WHERE user_id = ?'
    ).get(currentUser.userId) as { id: number } | undefined;

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional profile not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    const schedule = db.prepare(`
      SELECT id FROM availability_schedules
      WHERE id = ? AND professional_id = ?
    `).get(scheduleId, professional.id);

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete schedule
    db.prepare('DELETE FROM availability_schedules WHERE id = ?').run(scheduleId);

    return NextResponse.json({
      success: true,
      message: 'Schedule deleted successfully',
    });
  } catch (error) {
    console.error('Delete schedule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
