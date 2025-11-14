import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import db from '@/lib/db';

// get testimonials pending approval for system admin
export async function GET(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'system_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. System Admin access required.' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    
    const testimonials = db.prepare(`
      SELECT 
        t.id,
        t.content,
        t.rating,
        t.approval_status,
        t.rejection_reason,
        t.created_at,
        t.user_type,
        u.email,
        CASE 
          WHEN t.user_type = 'patient' THEN p.username
          WHEN t.user_type = 'health_professional' THEN hp.full_name
          WHEN t.user_type = 'institutional_admin' THEN ia.full_name
        END as user_name
      FROM testimonials t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN patients p ON t.user_type = 'patient' AND t.user_id = p.user_id
      LEFT JOIN health_professionals hp ON t.user_type = 'health_professional' AND t.user_id = hp.user_id
      LEFT JOIN institutional_admins ia ON t.user_type = 'institutional_admin' AND t.user_id = ia.user_id
      WHERE t.approval_status = ?
      ORDER BY t.created_at DESC
    `).all(status);
    
    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error('Get pending testimonials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// approve, reject, or feature testimonial
export async function POST(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || currentUser.role !== 'system_admin') {
      return NextResponse.json(
        { error: 'Unauthorized. System Admin access required.' },
        { status: 403 }
      );
    }
    
    const { id: testimonial_id, action, is_featured, rejection_reason } = await request.json();
    
    if (!testimonial_id || !action || !['approve', 'reject', 'feature'].includes(action)) {
      return NextResponse.json(
        { error: 'Testimonial ID and valid action (approve/reject/feature) are required' },
        { status: 400 }
      );
    }
    
    const testimonial = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(testimonial_id) as any;
    
    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    if (action === 'approve') {
      db.prepare(`
        UPDATE testimonials 
        SET approval_status = 'approved',
            approved_by = ?,
            approved_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(currentUser.userId, testimonial_id);
      
      return NextResponse.json({
        success: true,
        message: 'Testimonial approved successfully',
      });
    } else if (action === 'reject') {
      if (!rejection_reason) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }
      
      db.prepare(`
        UPDATE testimonials 
        SET approval_status = 'rejected',
            rejection_reason = ?,
            approved_by = ?,
            approved_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(rejection_reason, currentUser.userId, testimonial_id);
      
      return NextResponse.json({
        success: true,
        message: 'Testimonial rejected',
      });
    } else if (action === 'feature') {
      // only feature approved testimonials
      if (testimonial.approval_status !== 'approved') {
        return NextResponse.json(
          { error: 'Can only feature approved testimonials' },
          { status: 400 }
        );
      }
      
      db.prepare('UPDATE testimonials SET is_featured = ? WHERE id = ?')
        .run(is_featured ? 1 : 0, testimonial_id);
      
      return NextResponse.json({
        success: true,
        message: is_featured ? 'Testimonial featured' : 'Testimonial unfeatured',
      });
    }
  } catch (error) {
    console.error('Manage testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
