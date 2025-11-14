import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// Get all health professionals
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
    const specialization = searchParams.get('specialization');
    const institutionId = searchParams.get('institution_id');
    const search = searchParams.get('search');
    
    let query = `
      SELECT 
        hp.id,
        hp.user_id,
        hp.full_name,
        hp.bio,
        hp.specialization,
        hp.years_of_experience,
        hp.profile_picture,
        hp.average_rating,
        hp.total_reviews,
        hp.phone,
        i.name as institution_name,
        i.id as institution_id,
        i.location as institution_location,
        i.verification_status as institution_verification
      FROM health_professionals hp
      LEFT JOIN institutions i ON hp.institution_id = i.id
      JOIN users u ON hp.user_id = u.id
      WHERE u.is_active = 1
    `;
    
    const params: any[] = [];
    
    if (specialization) {
      query += ' AND hp.specialization LIKE ?';
      params.push(`%${specialization}%`);
    }
    
    if (institutionId) {
      query += ' AND hp.institution_id = ?';
      params.push(parseInt(institutionId));
    }
    
    if (search) {
      query += ' AND (hp.full_name LIKE ? OR hp.bio LIKE ? OR hp.specialization LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY hp.average_rating DESC, hp.total_reviews DESC';
    
    const professionals = db.prepare(query).all(...params);
    
    return NextResponse.json({
      success: true,
      data: professionals,
    });
  } catch (error) {
    console.error('Get professionals error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
