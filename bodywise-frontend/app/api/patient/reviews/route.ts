import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// Submit a review (after consultation)
export async function POST(request: Request) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'patient')) {
      return NextResponse.json(
        { error: 'Unauthorized. Patient access required.' },
        { status: 403 }
      );
    }
    
    const { consultation_id, rating, comment } = await request.json();
    
    // Validate input
    if (!consultation_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Consultation ID and rating (1-5) are required' },
        { status: 400 }
      );
    }
    
    // Get patient ID
    const patientQuery = db.prepare('SELECT id FROM patients WHERE user_id = ?');
    const patient = patientQuery.get(currentUser.userId) as any;
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      );
    }
    
    // Verify consultation exists, belongs to patient, and is completed
    const consultationQuery = db.prepare(`
      SELECT id, professional_id, status 
      FROM consultations
      WHERE id = ? AND patient_id = ?
    `).get(consultation_id, patient.id) as any;
    
    if (!consultationQuery) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }
    
    if (consultationQuery.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only review completed consultations' },
        { status: 400 }
      );
    }
    
    // Check if review already exists
    const existingReview = db.prepare(`
      SELECT id FROM reviews WHERE consultation_id = ?
    `).get(consultation_id);
    
    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already submitted for this consultation' },
        { status: 409 }
      );
    }
    
    // Create review in a transaction
    const transaction = db.transaction(() => {
      // Insert review
      const insertReview = db.prepare(`
        INSERT INTO reviews (consultation_id, patient_id, professional_id, rating, comment)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      insertReview.run(
        consultation_id,
        patient.id,
        consultationQuery.professional_id,
        rating,
        comment || null
      );
      
      // Update professional's average rating
      const updateRating = db.prepare(`
        UPDATE health_professionals
        SET 
          total_reviews = total_reviews + 1,
          average_rating = (
            SELECT AVG(rating) 
            FROM reviews 
            WHERE professional_id = ?
          )
        WHERE id = ?
      `);
      
      updateRating.run(consultationQuery.professional_id, consultationQuery.professional_id);
    });
    
    transaction();
    
    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get patient's submitted reviews
export async function GET(request: Request) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'patient')) {
      return NextResponse.json(
        { error: 'Unauthorized. Patient access required.' },
        { status: 403 }
      );
    }
    
    // Get patient ID
    const patientQuery = db.prepare('SELECT id FROM patients WHERE user_id = ?');
    const patient = patientQuery.get(currentUser.userId) as any;
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      );
    }
    
    // Get reviews
    const reviewsQuery = db.prepare(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        hp.full_name as professional_name,
        hp.specialization,
        c.scheduled_date
      FROM reviews r
      JOIN health_professionals hp ON r.professional_id = hp.id
      JOIN consultations c ON r.consultation_id = c.id
      WHERE r.patient_id = ?
      ORDER BY r.created_at DESC
    `);
    
    const reviews = reviewsQuery.all(patient.id);
    
    return NextResponse.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
