import { NextRequest, NextResponse } from 'next/server';
import { runEmailCron } from '@/lib/email-cron';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization here
    const authHeader = request.headers.get('authorization');
    
    // For security, you might want to use a secret key
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await runEmailCron();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error running email cron:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Allow GET for manual testing
export async function GET(request: NextRequest) {
  return POST(request);
}
