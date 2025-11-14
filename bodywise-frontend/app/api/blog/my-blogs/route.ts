import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import db from '@/lib/db';

// current user's blogs
export async function GET(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (currentUser.role === 'patient' || currentUser.role === 'system_admin') {
      return NextResponse.json(
        { error: 'Only health professionals and institutional admins can have blogs' },
        { status: 403 }
      );
    }
    
    // Get user's profile ID
    let authorId: number;
    if (currentUser.role === 'health_professional') {
      const professional = db.prepare('SELECT id FROM health_professionals WHERE user_id = ?')
        .get(currentUser.userId) as any;
      authorId = professional?.id;
    } else {
      const admin = db.prepare('SELECT id FROM institutional_admins WHERE user_id = ?')
        .get(currentUser.userId) as any;
      authorId = admin?.id;
    }
    
    if (!authorId) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    const articles = db.prepare(`
      SELECT 
        id,
        title,
        content,
        category,
        tags,
        thumbnail_url,
        approval_status,
        is_published,
        views_count,
        rejection_reason,
        created_at,
        updated_at
      FROM articles
      WHERE author_type = ? AND author_id = ?
      ORDER BY created_at DESC
    `).all(currentUser.role, authorId);
    
    // parsing tags
    const parsedArticles = articles.map((article: any) => ({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : [],
    }));
    
    return NextResponse.json({
      success: true,
      data: parsedArticles,
    });
  } catch (error) {
    console.error('Get my blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
