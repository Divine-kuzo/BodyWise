import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// Verify or reject an institution
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'system_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. System Admin access required.' },
        { status: 403 }
      );
    }
    
    const institutionId = parseInt(params.id);
    const { action, reason } = await request.json();
    
    // Validate action
    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Valid action (approve/reject) is required' },
        { status: 400 }
      );
    }
    
    // Check if institution exists
    const institution = db.prepare('SELECT id FROM institutions WHERE id = ?').get(institutionId);
    if (!institution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }
    
    const status = action === 'approve' ? 'approved' : 'rejected';
    
    // Update institution status in transaction
    const transaction = db.transaction(() => {
      // Update institution
      db.prepare(`
        UPDATE institutions
        SET verification_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(status, institutionId);
      
      // Update associated institutional admins' user accounts
      if (action === 'approve') {
        db.prepare(`
          UPDATE users
          SET is_verified = 1
          WHERE id IN (
            SELECT user_id FROM institutional_admins WHERE institution_id = ?
          )
        `).run(institutionId);
      }
      
      // Log the verification action
      db.prepare(`
        INSERT INTO system_logs (log_type, message, details)
        VALUES ('info', ?, ?)
      `).run(
        `Institution ${status}`,
        JSON.stringify({
          institution_id: institutionId,
          action,
          reason: reason || null,
          admin_id: currentUser.userId,
          timestamp: new Date().toISOString(),
        })
      );
    });
    
    transaction();
    
    return NextResponse.json({
      success: true,
      message: `Institution ${status} successfully`,
    });
  } catch (error) {
    console.error('Verify institution error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get institution details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'system_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. System Admin access required.' },
        { status: 403 }
      );
    }
    
    const institutionId = parseInt(params.id);
    
    // Get institution details
    const institutionQuery = db.prepare(`
      SELECT 
        i.*,
        COUNT(DISTINCT hp.id) as professional_count,
        COUNT(DISTINCT a.id) as article_count
      FROM institutions i
      LEFT JOIN health_professionals hp ON i.id = hp.institution_id
      LEFT JOIN articles a ON i.id = a.institution_id
      WHERE i.id = ?
      GROUP BY i.id
    `);
    
    const institution = institutionQuery.get(institutionId);
    
    if (!institution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }
    
    // Get admins
    const adminsQuery = db.prepare(`
      SELECT 
        ia.full_name,
        ia.phone,
        u.email,
        u.created_at
      FROM institutional_admins ia
      JOIN users u ON ia.user_id = u.id
      WHERE ia.institution_id = ?
    `);
    
    const admins = adminsQuery.all(institutionId);
    
    return NextResponse.json({
      success: true,
      data: {
        ...institution,
        admins,
      },
    });
  } catch (error) {
    console.error('Get institution details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
