import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { activityQueries } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // validate user input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // authenticate user
    const result = await authenticateUser(email, password);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 401 }
      );
    }
    
    try {
      activityQueries.logActivity.run(
        result.user!.id,
        'login',
        JSON.stringify({ timestamp: new Date().toISOString() })
      );
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
    
    // Create response with httpOnly cookie
    const response = NextResponse.json({
      success: true,
      token: result.token,
      user: result.user,
    });
    
    // Set httpOnly cookie for API authentication
    if (result.token) {
      response.cookies.set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
