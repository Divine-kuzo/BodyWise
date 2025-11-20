import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// GET /api/admin/testimonials - Get all testimonials (pending or all)
export async function GET(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'system_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending', 'approved', 'rejected', or all
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        t.id,
        t.content,
        t.rating,
        t.is_featured,
        t.approval_status,
        t.rejection_reason,
        t.created_at,
        t.updated_at,
        t.user_type,
        t.user_id,
        u.email as user_email,
        CASE 
          WHEN t.user_type = 'patient' THEN p.username
          WHEN t.user_type = 'health_professional' THEN hp.full_name
          WHEN t.user_type = 'institutional_admin' THEN ia.full_name
        END as user_name,
        CASE 
          WHEN t.user_type = 'patient' THEN p.full_name
          WHEN t.user_type = 'health_professional' THEN hp.specialization
          ELSE NULL
        END as additional_info
      FROM testimonials t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN patients p ON t.user_type = 'patient' AND u.id = p.user_id
      LEFT JOIN health_professionals hp ON t.user_type = 'health_professional' AND u.id = hp.user_id
      LEFT JOIN institutional_admins ia ON t.user_type = 'institutional_admin' AND u.id = ia.user_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (status) {
      query += ' AND t.approval_status = ?';
      params.push(status);
    }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const testimonials = db.prepare(query).all(...params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM testimonials WHERE 1=1';
    const countParams: any[] = [];

    if (status) {
      countQuery += ' AND approval_status = ?';
      countParams.push(status);
    }

    const totalCount = (db.prepare(countQuery).get(...countParams) as any).count;

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Get admin testimonials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
