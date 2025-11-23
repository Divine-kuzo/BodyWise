import { NextResponse } from 'next/server';
import { getUserFromRequest, hashPassword } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || currentUser.role !== 'institutional_admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Institutional admin access required.' },
        { status: 401 }
      );
    }

    // Get institutional admin details to find their institution
    const admin = db.prepare(`
      SELECT institution_id
      FROM institutional_admins
      WHERE user_id = ?
    `).get(currentUser.userId) as any;

    if (!admin) {
      return NextResponse.json(
        { error: 'Institutional admin profile not found' },
        { status: 404 }
      );
    }

    // Get all doctors affiliated with this institution
    const doctors = db.prepare(`
      SELECT 
        hp.id,
        hp.full_name,
        hp.specialization,
        hp.years_of_experience,
        hp.average_rating,
        (SELECT COUNT(*) FROM consultations c WHERE c.professional_id = hp.user_id) as total_consultations
      FROM health_professionals hp
      WHERE hp.institution_id = ?
      ORDER BY hp.full_name ASC
    `).all(admin.institution_id);

    return NextResponse.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error('Get institutional doctors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || currentUser.role !== 'institutional_admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Institutional admin access required.' },
        { status: 401 }
      );
    }

    // Get institutional admin details
    const admin = db.prepare(`
      SELECT institution_id
      FROM institutional_admins
      WHERE user_id = ?
    `).get(currentUser.userId) as any;

    if (!admin) {
      return NextResponse.json(
        { error: 'Institutional admin profile not found' },
        { status: 404 }
      );
    }

    const { fullName, email, password, specialization, yearsOfExperience, phone } = await request.json();

    // Validate input
    if (!fullName || !email || !password || !specialization) {
      return NextResponse.json(
        { error: 'Full name, email, password, and specialization are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user account
    const userResult = db.prepare(`
      INSERT INTO users (email, password_hash, role, is_verified, is_active)
      VALUES (?, ?, 'health_professional', 1, 1)
    `).run(email, passwordHash);

    const userId = userResult.lastInsertRowid as number;

    // Create health professional profile
    db.prepare(`
      INSERT INTO health_professionals 
      (user_id, full_name, specialization, years_of_experience, phone, institution_id, average_rating, total_reviews)
      VALUES (?, ?, ?, ?, ?, ?, 0.0, 0)
    `).run(
      userId,
      fullName,
      specialization,
      yearsOfExperience ? parseInt(yearsOfExperience) : 0,
      phone || null,
      admin.institution_id
    );

    return NextResponse.json({
      success: true,
      message: 'Doctor onboarded successfully',
      data: { userId, email },
    });

  } catch (error) {
    console.error('Onboard doctor error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
