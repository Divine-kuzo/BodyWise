import { NextResponse } from 'next/server';
import { getUserFromRequest, hasAnyRole } from '@/lib/auth';
import { userQueries, patientQueries, professionalQueries, institutionalAdminQueries, systemAdminQueries } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user profile based on role
    let profile = null;
    
    switch (currentUser.role) {
      case 'patient':
        profile = patientQueries.getPatientByUserId.get(currentUser.userId);
        break;
      case 'health_professional':
        profile = professionalQueries.getProfessionalByUserId.get(currentUser.userId);
        break;
      case 'institutional_admin':
        profile = institutionalAdminQueries.getAdminByUserId.get(currentUser.userId);
        break;
      case 'system_admin':
        profile = systemAdminQueries.getAdminByUserId.get(currentUser.userId);
        break;
    }
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        ...currentUser,
        profile,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const updates = await request.json();
    
    // Update based on role
    switch (currentUser.role) {
      case 'patient':
        // Patients can only update username
        if (updates.username) {
          // Check if username is available
          const existing = patientQueries.checkUsernameAvailable.get(updates.username) as any;
          const currentProfile = patientQueries.getPatientByUserId.get(currentUser.userId) as any;
          
          if (existing && existing.id !== currentProfile?.id) {
            return NextResponse.json(
              { error: 'Username already taken' },
              { status: 409 }
            );
          }
          
          patientQueries.updatePatient.run(
            updates.username,
            currentProfile.full_name,
            currentProfile.date_of_birth,
            currentProfile.gender,
            currentProfile.phone,
            currentProfile.profile_picture,
            currentUser.userId
          );
        }
        break;
        
      // Add other role update logic here
      default:
        return NextResponse.json(
          { error: 'Profile updates not implemented for this role' },
          { status: 501 }
        );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
