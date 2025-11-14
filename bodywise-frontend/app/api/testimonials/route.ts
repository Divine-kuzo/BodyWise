import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import db from '@/lib/db';

// get all approved testimonials for public access
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let query = `
      SELECT 
        t.id,
        t.content,
        t.rating,
        t.is_featured,
        t.created_at,
        t.user_type,
        CASE 
          WHEN t.user_type = 'patient' THEN p.username
          WHEN t.user_type = 'health_professional' THEN hp.full_name
          WHEN t.user_type = 'institutional_admin' THEN ia.full_name
        END as user_name,
        CASE 
          WHEN t.user_type = 'health_professional' THEN hp.specialization
          ELSE NULL
        END as user_specialization
      FROM testimonials t
      LEFT JOIN patients p ON t.user_type = 'patient' AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = t.user_id AND u.role = 'patient' AND u.id = p.user_id
      )
      LEFT JOIN health_professionals hp ON t.user_type = 'health_professional' AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = t.user_id AND u.role = 'health_professional' AND u.id = hp.user_id
      )
      LEFT JOIN institutional_admins ia ON t.user_type = 'institutional_admin' AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = t.user_id AND u.role = 'institutional_admin' AND u.id = ia.user_id
      )
      WHERE t.approval_status = 'approved'
    `;
    
    if (featured) {
      query += ' AND t.is_featured = 1';
    }
    
    query += ' ORDER BY t.is_featured DESC, t.created_at DESC LIMIT ?';
    
    const testimonials = db.prepare(query).all(limit);
    
    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// create new testimonial for authenticated users
export async function POST(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to submit a testimonial.' },
        { status: 401 }
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
    
    // check if user already has testimonial
    const existing = db.prepare('SELECT id FROM testimonials WHERE user_id = ?')
      .get(currentUser.userId);
    
    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted a testimonial. You can update it instead.' },
        { status: 409 }
      );
    }
    
    const insertTestimonial = db.prepare(`
      INSERT INTO testimonials (user_id, user_type, content, rating, approval_status)
      VALUES (?, ?, ?, ?, 'pending')
    `);
    
    const result = insertTestimonial.run(
      currentUser.userId,
      currentUser.role,
      content,
      rating || null
    );
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial submitted for approval',
      data: {
        id: result.lastInsertRowid,
        approval_status: 'pending',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
