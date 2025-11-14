import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import db from '@/lib/db';

// get current user's testimonial
export async function GET(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const testimonial = db.prepare(`
      SELECT 
        id,
        content,
        rating,
        approval_status,
        rejection_reason,
        is_featured,
        created_at,
        updated_at
      FROM testimonials
      WHERE user_id = ?
    `).get(currentUser.userId) as any;
    
    if (!testimonial) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }
    
    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error('Get my testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// update testimonial if rejected or pending
export async function PUT(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const testimonial = db.prepare('SELECT * FROM testimonials WHERE user_id = ?')
      .get(currentUser.userId) as any;
    
    if (!testimonial) {
      return NextResponse.json(
        { error: 'You don\'t have a testimonial yet. Please create one first.' },
        { status: 404 }
      );
    }
    
    // can only update if pending or rejected
    if (testimonial.approval_status === 'approved') {
      return NextResponse.json(
        { error: 'Cannot update approved testimonials' },
        { status: 400 }
      );
    }
    
    const { content, rating } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    db.prepare(`
      UPDATE testimonials 
      SET content = ?, rating = ?, 
          approval_status = 'pending',
          rejection_reason = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(content, rating || null, currentUser.userId);
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial updated and resubmitted for approval',
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// delete user's testimonial
export async function DELETE(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const result = db.prepare('DELETE FROM testimonials WHERE user_id = ?')
      .run(currentUser.userId);
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'No testimonial found to delete' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
