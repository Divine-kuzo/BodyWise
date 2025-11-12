import { NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth';
import { userQueries, patientQueries, professionalQueries, institutionalAdminQueries } from '@/lib/db';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;
    
    // validate user input
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }
    
    // validate role
    const validRoles = ['patient', 'health_professional', 'institutional_admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // role-specific validation
    if (role === 'patient') {
      const { username } = body;
      if (!username) {
        return NextResponse.json(
          { error: 'Username is required for patients' },
          { status: 400 }
        );
      }
      
      // if username already exists
      const existingUsername = patientQueries.checkUsernameAvailable.get(username);
      if (existingUsername) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
    } else if (role === 'health_professional') {
      const { full_name, specialization } = body;
      if (!full_name || !specialization) {
        return NextResponse.json(
          { error: 'Full name and specialization are required for health professionals' },
          { status: 400 }
        );
      }
    } else if (role === 'institutional_admin') {
      const { full_name, institution_name } = body;
      if (!full_name || !institution_name) {
        return NextResponse.json(
          { error: 'Full name and institution name are required for institutional admins' },
          { status: 400 }
        );
      }
    }
    
    // if email already exists
    const existingUser = userQueries.getUserByEmail.get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user and role-specific profile in a transaction
    const transaction = db.transaction(() => {
      // Create user
      const userResult = userQueries.createUser.run(
        email,
        passwordHash,
        role,
        role === 'patient' ? 1 : 0, // auto-verify patients coz others need verification (for doctors, inst-admins)
        1 // is_active
      );
      
      const userId = userResult.lastInsertRowid as number;
      
      // create role-specific profile
      if (role === 'patient') {
        const { username, full_name, date_of_birth, gender, phone } = body;
        patientQueries.createPatient.run(
          userId,
          username,
          full_name || null,
          date_of_birth || null,
          gender || null,
          phone || null,
          null  // profile_picture
        );
      } else if (role === 'health_professional') {
        const { full_name, specialization, years_of_experience, bio, phone } = body;
        // createProfessional expects: user_id, institution_id, full_name, bio, specialization, years_of_experience, phone, profile_picture
        professionalQueries.createProfessional.run(
          userId,
          null, // institution_id - can be set later
          full_name,
          bio || null,
          specialization,
          years_of_experience || 0,
          phone || null,
          null  // profile_picture
        );
      } else if (role === 'institutional_admin') {
        const { full_name, phone, institution_name, institution_bio, institution_location } = body;
        
        // create institution
        const institutionResult = db.prepare(`
          INSERT INTO institutions (name, bio, location, verification_status)
          VALUES (?, ?, ?, 'pending')
        `).run(institution_name, institution_bio || null, institution_location || null);
        
        const institutionId = institutionResult.lastInsertRowid as number;
        
        // create institutional admin
        // createInstitutionalAdmin expects: user_id, institution_id, full_name, phone, profile_picture (i don't know  but this profile picture will cook us even if is cool stuff.)
        institutionalAdminQueries.createInstitutionalAdmin.run(
          userId,
          institutionId,
          full_name,
          phone || null,
          null  // profile_picture
        );
      }
      
      return { userId, email, role };
    });
    
    const result = transaction();

    // generating token for all users
    const token = generateToken({
      userId: result.userId,
      email: result.email,
      role: result.role,
    });
    
    return NextResponse.json({
      success: true,
      message: role === 'patient' 
        ? 'Account created successfully' 
        : 'Account created. Pending verification.',
      token,
      user: {
        id: result.userId,
        email: result.email,
        role: result.role,
        isVerified: role === 'patient' ? 1 : 0,
      },
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
