import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// Get all institutions pending verification
export async function GET(request: Request) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'system_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. System Admin access required.' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    
    const institutionsQuery = db.prepare(`
      SELECT 
        i.id,
        i.name,
        i.bio,
        i.location,
        i.verification_status,
        i.certificate_url,
        i.support_documents,
        i.created_at,
        ia.full_name as admin_name,
        u.email as admin_email
      FROM institutions i
      JOIN institutional_admins ia ON i.id = ia.institution_id
      JOIN users u ON ia.user_id = u.id
      WHERE i.verification_status = ?
      ORDER BY i.created_at DESC
    `);
    
    const institutions = institutionsQuery.all(status);
    
    return NextResponse.json({
      success: true,
      data: institutions,
    });
  } catch (error) {
    console.error('Get institutions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
