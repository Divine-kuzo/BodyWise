import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import db from '@/lib/db';

// blogs pending approval for institutional admin or system admin
export async function GET(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    let query: string;
    let params: any[] = [];
    
    if (currentUser.role === 'institutional_admin') {
      // institutional admin's institution
      const admin = db.prepare('SELECT institution_id FROM institutional_admins WHERE user_id = ?')
        .get(currentUser.userId) as any;
      
      if (!admin) {
        return NextResponse.json(
          { error: 'Admin profile not found' },
          { status: 404 }
        );
      }
      
      // health professionals' blogs from same institution
      query = `
        SELECT 
          a.id,
          a.title,
          a.content,
          a.category,
          a.tags,
          a.thumbnail_url,
          a.approval_status,
          a.created_at,
          hp.full_name as author_name,
          hp.specialization as author_specialization
        FROM articles a
        JOIN health_professionals hp ON a.author_id = hp.id AND a.author_type = 'health_professional'
        WHERE a.institution_id = ? AND a.approval_status = 'pending'
        ORDER BY a.created_at DESC
      `;
      params = [admin.institution_id];
    } else if (currentUser.role === 'system_admin') {
      // all institutional admins' blogs
      query = `
        SELECT 
          a.id,
          a.title,
          a.content,
          a.category,
          a.tags,
          a.thumbnail_url,
          a.approval_status,
          a.created_at,
          ia.full_name as author_name,
          i.name as institution_name
        FROM articles a
        JOIN institutional_admins ia ON a.author_id = ia.id AND a.author_type = 'institutional_admin'
        LEFT JOIN institutions i ON a.institution_id = i.id
        WHERE a.approval_status = 'pending'
        ORDER BY a.created_at DESC
      `;
    } else {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can access this endpoint.' },
        { status: 403 }
      );
    }
    
    const articles = db.prepare(query).all(...params);
    
    // parse tags
    const parsedArticles = articles.map((article: any) => ({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : [],
    }));
    
    return NextResponse.json({
      success: true,
      data: parsedArticles,
    });
  } catch (error) {
    console.error('Get pending blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ppprove or reject a blog 
export async function POST(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { blog_id, action, rejection_reason } = await request.json();
    
    if (!blog_id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Blog ID and valid action (approve/reject) are required' },
        { status: 400 }
      );
    }
    
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(blog_id) as any;
    
    if (!article) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // authorization checkin
    if (currentUser.role === 'institutional_admin') {
      // Can only approve health professionals' blogs from same institution
      const admin = db.prepare('SELECT institution_id FROM institutional_admins WHERE user_id = ?')
        .get(currentUser.userId) as any;
      
      if (article.author_type !== 'health_professional' || article.institution_id !== admin.institution_id) {
        return NextResponse.json(
          { error: 'You can only approve blogs from health professionals in your institution' },
          { status: 403 }
        );
      }
    } else if (currentUser.role === 'system_admin') {
      // only approve institutional admins' blogs
      if (article.author_type !== 'institutional_admin') {
        return NextResponse.json(
          { error: 'System admins can only approve institutional admins\' blogs' },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    if (action === 'approve') {
      db.prepare(`
        UPDATE articles 
        SET approval_status = 'approved',
            is_published = 1,
            approved_by = ?,
            approved_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(currentUser.userId, blog_id);
      
      return NextResponse.json({
        success: true,
        message: 'Blog approved and published successfully',
      });
    } else {
      if (!rejection_reason) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }
      
      db.prepare(`
        UPDATE articles 
        SET approval_status = 'rejected',
            rejection_reason = ?,
            approved_by = ?,
            approved_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(rejection_reason, currentUser.userId, blog_id);
      
      return NextResponse.json({
        success: true,
        message: 'Blog rejected',
      });
    }
  } catch (error) {
    console.error('Approve/reject blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
