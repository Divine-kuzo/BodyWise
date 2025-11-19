import { NextResponse } from 'next/server';
import { activityQueries } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Get user from token to log activity
    const currentUser = getUserFromRequest(request);
    
    if (currentUser) {
      try {
        activityQueries.logActivity.run(
          currentUser.userId,
          'logout',
          JSON.stringify({ timestamp: new Date().toISOString() })
        );
      } catch (error) {
        console.error('Failed to log logout activity:', error);
      }
    }
    
    // Create response and clear the token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
    
    // Clear the httpOnly cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
