import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = parseInt(params.id);
    
    const article = db.prepare(`
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
        a.approval_status,
        a.is_published,
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
        CASE 
          WHEN a.author_type = 'health_professional' THEN hp.bio
          WHEN a.author_type = 'institutional_admin' THEN NULL
        END as author_bio,
        i.name as institution_name
      FROM articles a
      LEFT JOIN health_professionals hp ON a.author_type = 'health_professional' AND a.author_id = hp.id
      LEFT JOIN institutional_admins ia ON a.author_type = 'institutional_admin' AND a.author_id = ia.id
      LEFT JOIN institutions i ON a.institution_id = i.id
      WHERE a.id = ?
    `).get(blogId) as any;
    
    if (!article) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // show approved and published articles to public
    // actually every visitor
    const currentUser = getUserFromRequest(request);
    const isAuthor = currentUser && 
      ((article.author_type === 'health_professional' && currentUser.role === 'health_professional') ||
       (article.author_type === 'institutional_admin' && currentUser.role === 'institutional_admin'));
    
    const canApprove = currentUser && 
      ((article.author_type === 'health_professional' && currentUser.role === 'institutional_admin') ||
       (article.author_type === 'institutional_admin' && currentUser.role === 'system_admin'));
    
    if (article.approval_status !== 'approved' && !isAuthor && !canApprove && currentUser?.role !== 'system_admin') {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // incremental view count for published articles
    if (article.approval_status === 'approved' && article.is_published === 1) {
      db.prepare('UPDATE articles SET views_count = views_count + 1 WHERE id = ?').run(blogId);
      article.views_count += 1;
    }
    
    // parse tags
    article.tags = article.tags ? JSON.parse(article.tags) : [];
    
    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Get blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// update blog (author only, if not yet approved)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const blogId = parseInt(params.id);
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(blogId) as any;
    
    if (!article) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // get author's profile ID
    let authorId: number;
    if (currentUser.role === 'health_professional') {
      const professional = db.prepare('SELECT id FROM health_professionals WHERE user_id = ?')
        .get(currentUser.userId) as any;
      authorId = professional?.id;
    } else if (currentUser.role === 'institutional_admin') {
      const admin = db.prepare('SELECT id FROM institutional_admins WHERE user_id = ?')
        .get(currentUser.userId) as any;
      authorId = admin?.id;
    } else {
      return NextResponse.json(
        { error: 'Only blog authors can update their blogs' },
        { status: 403 }
      );
    }
    
    // check if user is the author
    if (article.author_type !== currentUser.role || article.author_id !== authorId) {
      return NextResponse.json(
        { error: 'You can only update your own blogs' },
        { status: 403 }
      );
    }
    
    // only update if pending or rejected
    if (article.approval_status === 'approved') {
      return NextResponse.json(
        { error: 'Cannot update approved blogs. Contact admin to unpublish first.' },
        { status: 400 }
      );
    }
    
    const { title, content, category, tags, thumbnail_url } = await request.json();
    
    db.prepare(`
      UPDATE articles 
      SET title = ?, content = ?, category = ?, tags = ?, 
          thumbnail_url = ?, updated_at = CURRENT_TIMESTAMP,
          approval_status = 'pending'
      WHERE id = ?
    `).run(
      title || article.title,
      content || article.content,
      category || article.category,
      tags ? JSON.stringify(tags) : article.tags,
      thumbnail_url || article.thumbnail_url,
      blogId
    );
    
    return NextResponse.json({
      success: true,
      message: 'Blog updated and resubmitted for approval',
    });
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// delete blog (author only, if not approved)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const blogId = parseInt(params.id);
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(blogId) as any;
    
    if (!article) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // author's profile ID
    let authorId: number;
    if (currentUser.role === 'health_professional') {
      const professional = db.prepare('SELECT id FROM health_professionals WHERE user_id = ?')
        .get(currentUser.userId) as any;
      authorId = professional?.id;
    } else if (currentUser.role === 'institutional_admin') {
      const admin = db.prepare('SELECT id FROM institutional_admins WHERE user_id = ?')
        .get(currentUser.userId) as any;
      authorId = admin?.id;
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // check if user is the author
    if (article.author_type !== currentUser.role || article.author_id !== authorId) {
      return NextResponse.json(
        { error: 'You can only delete your own blogs' },
        { status: 403 }
      );
    }
    
    db.prepare('DELETE FROM articles WHERE id = ?').run(blogId);
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
