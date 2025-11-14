import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole, hashPassword } from '@/lib/auth';
import db from '@/lib/db';

// Create a new system admin
export async function POST(request: Request) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'system_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. System Admin access required.' },
        { status: 403 }
      );
    }
    
    const { email, password, full_name, phone } = await request.json();
    
    // Validate input
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user and system admin in transaction
    const transaction = db.transaction(() => {
      // Create user
      const insertUser = db.prepare(`
        INSERT INTO users (email, password_hash, role, is_verified, is_active)
        VALUES (?, ?, 'system_admin', 1, 1)
      `);
      
      const userResult = insertUser.run(email, passwordHash);
      const userId = userResult.lastInsertRowid as number;
      
      // Create system admin profile
      const insertAdmin = db.prepare(`
        INSERT INTO system_admins (user_id, full_name, phone)
        VALUES (?, ?, ?)
      `);
      
      insertAdmin.run(userId, full_name, phone || null);
      
      // Log activity
      db.prepare(`
        INSERT INTO user_activity (user_id, activity_type, details)
        VALUES (?, 'system_admin_created', ?)
      `).run(currentUser.userId, JSON.stringify({ new_admin_email: email }));
      
      return { userId, email };
    });
    
    const result = transaction();
    
    return NextResponse.json({
      success: true,
      message: 'System admin created successfully',
      data: result,
    }, { status: 201 });
  } catch (error) {
    console.error('Create system admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all system admins
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
    
    const adminsQuery = db.prepare(`
      SELECT 
        sa.id,
        sa.full_name,
        sa.phone,
        u.email,
        u.is_active,
        u.created_at
      FROM system_admins sa
      JOIN users u ON sa.user_id = u.id
      ORDER BY u.created_at DESC
    `);
    
    const admins = adminsQuery.all();
    
    return NextResponse.json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error('Get system admins error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
