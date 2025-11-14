import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// Get user analytics and growth data
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
    const period = searchParams.get('period') || '30'; // days
    
    // Get user counts by role
    const userCounts = {
      patients: (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'patient'").get() as any).count,
      health_professionals: (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'health_professional'").get() as any).count,
      institutional_admins: (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'institutional_admin'").get() as any).count,
      system_admins: (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'system_admin'").get() as any).count,
    };
    
    // Get user growth over time
    const growthQuery = db.prepare(`
      SELECT 
        DATE(created_at) as date,
        role,
        COUNT(*) as count
      FROM users
      WHERE created_at >= date('now', '-' || ? || ' days')
      GROUP BY DATE(created_at), role
      ORDER BY date DESC
    `);
    
    const growthData = growthQuery.all(period);
    
    // Get recent registrations
    const recentUsersQuery = db.prepare(`
      SELECT 
        u.id,
        u.email,
        u.role,
        u.created_at,
        u.is_verified,
        u.is_active,
        CASE 
          WHEN u.role = 'patient' THEN p.username
          WHEN u.role = 'health_professional' THEN hp.full_name
          WHEN u.role = 'institutional_admin' THEN ia.full_name
          WHEN u.role = 'system_admin' THEN sa.full_name
        END as display_name
      FROM users u
      LEFT JOIN patients p ON u.id = p.user_id AND u.role = 'patient'
      LEFT JOIN health_professionals hp ON u.id = hp.user_id AND u.role = 'health_professional'
      LEFT JOIN institutional_admins ia ON u.id = ia.user_id AND u.role = 'institutional_admin'
      LEFT JOIN system_admins sa ON u.id = sa.user_id AND u.role = 'system_admin'
      ORDER BY u.created_at DESC
      LIMIT 20
    `);
    
    const recentUsers = recentUsersQuery.all();
    
    // Get active users (logged in last 7 days)
    const activeUsersQuery = db.prepare(`
      SELECT COUNT(DISTINCT user_id) as count
      FROM user_activity
      WHERE created_at >= date('now', '-7 days')
    `);
    
    const activeUsers = (activeUsersQuery.get() as any).count;
    
    // Get consultation statistics
    const consultationStats = {
      total: (db.prepare("SELECT COUNT(*) as count FROM consultations").get() as any).count,
      scheduled: (db.prepare("SELECT COUNT(*) as count FROM consultations WHERE status = 'scheduled'").get() as any).count,
      completed: (db.prepare("SELECT COUNT(*) as count FROM consultations WHERE status = 'completed'").get() as any).count,
      cancelled: (db.prepare("SELECT COUNT(*) as count FROM consultations WHERE status = 'cancelled'").get() as any).count,
    };
    
    return NextResponse.json({
      success: true,
      data: {
        userCounts,
        growthData,
        recentUsers,
        activeUsers,
        consultationStats,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
