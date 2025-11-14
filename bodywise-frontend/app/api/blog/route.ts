import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import db from '@/lib/db';

// all approved blogs (public access)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        a.id,
        a.title,
        a.content,
        a.author_type,
        a.author_id,
        a.category,
        a.tags,
        a.thumbnail_url,
        a.views_count,
        a.created_at,
        a.updated_at,
        CASE 
          WHEN a.author_type = 'health_professional' THEN hp.full_name
          WHEN a.author_type = 'institutional_admin' THEN ia.full_name
        END as author_name,
        CASE 
          WHEN a.author_type = 'health_professional' THEN hp.specialization
          ELSE NULL
        END as author_specialization,
        i.name as institution_name
      FROM articles a
      LEFT JOIN health_professionals hp ON a.author_type = 'health_professional' AND a.author_id = hp.id
      LEFT JOIN institutional_admins ia ON a.author_type = 'institutional_admin' AND a.author_id = ia.id
      LEFT JOIN institutions i ON a.institution_id = i.id
      WHERE a.approval_status = 'approved' AND a.is_published = 1
    `;
    
    const params: any[] = [];
    
    if (category) {
      query += ' AND a.category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const articles = db.prepare(query).all(...params);
    
    // total count
    let countQuery = 'SELECT COUNT(*) as count FROM articles WHERE approval_status = ? AND is_published = ?';
    const countParams: any[] = ['approved', 1];
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    
    const totalCount = (db.prepare(countQuery).get(...countParams) as any).count;
    
    // Parse tags for each article
    const parsedArticles = articles.map((article: any) => ({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : [],
    }));
    
    return NextResponse.json({
      success: true,
      data: parsedArticles,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// for a new blog we go for authenticated users only - patients excluded
export async function POST(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }
    
    // only health professionals and institutional admins can create blogs 0_0
    if (currentUser.role === 'patient' || currentUser.role === 'system_admin') {
      return NextResponse.json(
        { error: 'Only health professionals and institutional admins can create blogs.' },
        { status: 403 }
      );
    }
    
    const { title, content, category, tags, thumbnail_url } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Get author's profile ID and institution
    let authorId: number;
    let institutionId: number | null = null;
    
    if (currentUser.role === 'health_professional') {
      const professional = db.prepare('SELECT id, institution_id FROM health_professionals WHERE user_id = ?')
        .get(currentUser.userId) as any;
      
      if (!professional) {
        return NextResponse.json(
          { error: 'Professional profile not found' },
          { status: 404 }
        );
      }
      
      authorId = professional.id;
      institutionId = professional.institution_id;
    } else {
      const admin = db.prepare('SELECT id, institution_id FROM institutional_admins WHERE user_id = ?')
        .get(currentUser.userId) as any;
      
      if (!admin) {
        return NextResponse.json(
          { error: 'Admin profile not found' },
          { status: 404 }
        );
      }
      
      authorId = admin.id;
      institutionId = admin.institution_id;
    }
    
    // creating article
    const insertArticle = db.prepare(`
      INSERT INTO articles (
        title, content, author_type, author_id, institution_id,
        category, tags, thumbnail_url, approval_status, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0)
    `);
    
    const result = insertArticle.run(
      title,
      content,
      currentUser.role,
      authorId,
      institutionId,
      category || null,
      tags ? JSON.stringify(tags) : null,
      thumbnail_url || null
    );
    
    return NextResponse.json({
      success: true,
      message: 'Blog submitted for approval',
      data: {
        id: result.lastInsertRowid,
        approval_status: 'pending',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
