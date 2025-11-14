import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';

// Calculate BMI
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
    
    const { height_cm, weight_kg } = await request.json();
    
    // Validate input
    if (!height_cm || !weight_kg || height_cm <= 0 || weight_kg <= 0) {
      return NextResponse.json(
        { error: 'Valid height (cm) and weight (kg) are required' },
        { status: 400 }
      );
    }
    
    // Calculate BMI
    const heightInMeters = height_cm / 100;
    const bmi = weight_kg / (heightInMeters * heightInMeters);
    
    // Determine BMI category based on universal standards
    let category = '';
    let healthStatus = '';
    
    if (bmi < 18.5) {
      category = 'Underweight';
      healthStatus = 'You may need to gain weight. Consider consulting a healthcare professional.';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
      healthStatus = 'You have a healthy weight. Keep up the good work!';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      healthStatus = 'You may benefit from a healthier diet and exercise routine.';
    } else {
      category = 'Obese';
      healthStatus = 'Consider consulting a healthcare professional for guidance.';
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
    
    // Store BMI record
    const insertQuery = db.prepare(`
      INSERT INTO bmi_records (patient_id, height_cm, weight_kg, bmi_value, bmi_category)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertQuery.run(patient.id, height_cm, weight_kg, parseFloat(bmi.toFixed(2)), category);
    
    return NextResponse.json({
      success: true,
      data: {
        bmi: parseFloat(bmi.toFixed(2)),
        category,
        healthStatus,
        height_cm,
        weight_kg,
      },
    });
  } catch (error) {
    console.error('BMI calculation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get BMI history
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
    
    // Get BMI history
    const historyQuery = db.prepare(`
      SELECT id, height_cm, weight_kg, bmi_value, bmi_category, recorded_at
      FROM bmi_records
      WHERE patient_id = ?
      ORDER BY recorded_at DESC
      LIMIT 20
    `);
    
    const history = historyQuery.all(patient.id);
    
    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Get BMI history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
