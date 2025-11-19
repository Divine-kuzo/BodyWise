import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// PUT /api/admin/testimonials/[id] - Approve or reject testimonial
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'system_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const testimonialId = parseInt(params.id);
    const { action, is_featured, rejection_reason } = await request.json();

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Get testimonial
    const testimonial = db.prepare(`
      SELECT t.*, u.email FROM testimonials t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `).get(testimonialId);

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Approve testimonial
      db.prepare(`
        UPDATE testimonials 
        SET approval_status = 'approved',
            is_featured = ?,
            approved_by = ?,
            approved_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `).run(is_featured ? 1 : 0, currentUser.userId, testimonialId);

      // Log action
      db.prepare(`
        INSERT INTO system_logs (log_type, message, details)
        VALUES ('info', ?, ?)
      `).run(
        'Testimonial approved',
        JSON.stringify({
          testimonial_id: testimonialId,
          admin_id: currentUser.userId,
          is_featured: is_featured || false,
        })
      );

      return NextResponse.json({
        success: true,
        message: 'Testimonial approved successfully',
      });

    } else {
      // Reject testimonial
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
            approved_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `).run(rejection_reason, currentUser.userId, testimonialId);

      // Log action
      db.prepare(`
        INSERT INTO system_logs (log_type, message, details)
        VALUES ('info', ?, ?)
      `).run(
        'Testimonial rejected',
        JSON.stringify({
          testimonial_id: testimonialId,
          admin_id: currentUser.userId,
          reason: rejection_reason,
        })
      );

      return NextResponse.json({
        success: true,
        message: 'Testimonial rejected',
      });
    }

  } catch (error) {
    console.error('Testimonial approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
