import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
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

    // Get institutional admin details
    const admin = db.prepare(`
      SELECT ia.*, i.name as institution_name, i.verification_status
      FROM institutional_admins ia
      JOIN institutions i ON ia.institution_id = i.id
      WHERE ia.user_id = ?
    `).get(currentUser.userId) as any;

    if (!admin) {
      return NextResponse.json(
        { error: 'Institutional admin profile not found' },
        { status: 404 }
      );
    }

    // Get stats
    const stats = {
      totalDoctors: (db.prepare(`
        SELECT COUNT(*) as count
        FROM health_professionals
        WHERE institution_id = ?
      `).get(admin.institution_id) as any).count,

      totalDocuments: 0, // Can be implemented later if needed

      pendingApprovals: 0, // Can be implemented when approval system is added

      activeConsultations: (db.prepare(`
        SELECT COUNT(*) as count
        FROM consultations c
        JOIN health_professionals hp ON c.professional_id = hp.user_id
        WHERE hp.institution_id = ? AND c.status = 'scheduled'
      `).get(admin.institution_id) as any).count,
    };

    // Get recent doctors (using id as fallback for ordering since created_at doesn't exist)
    const recentDoctors = db.prepare(`
      SELECT id, full_name, specialization, user_id
      FROM health_professionals
      WHERE institution_id = ?
      ORDER BY id DESC
      LIMIT 5
    `).all(admin.institution_id);

    return NextResponse.json({
      success: true,
      data: {
        institution: {
          id: admin.institution_id,
          name: admin.institution_name,
          verification_status: admin.verification_status,
        },
        admin: {
          id: admin.id,
          full_name: admin.full_name,
          phone: admin.phone,
        },
        stats,
        recentDoctors,
      },
    });
  } catch (error) {
    console.error('Get institutional dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
