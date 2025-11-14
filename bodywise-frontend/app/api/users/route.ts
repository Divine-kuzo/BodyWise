import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import { userQueries, activityQueries } from '@/lib/db';

// Get all users (System Admin only)
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    let users;
    
    if (role) {
      users = userQueries.getUsersByRole.all(role);
    } else {
      users = userQueries.getAllUsers.all(limit, offset);
    }
    
    // Get counts by role
    const counts = {
      patient: (userQueries.countUsersByRole.get('patient') as any).count,
      health_professional: (userQueries.countUsersByRole.get('health_professional') as any).count,
      institutional_admin: (userQueries.countUsersByRole.get('institutional_admin') as any).count,
      system_admin: (userQueries.countUsersByRole.get('system_admin') as any).count,
    };
    
    return NextResponse.json({
      success: true,
      users,
      counts,
      pagination: {
        page,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
