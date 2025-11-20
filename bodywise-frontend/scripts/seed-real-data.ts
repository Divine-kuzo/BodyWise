import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { join } from 'path';

const dbPath = process.env.DATABASE_PATH || join(process.cwd(), 'bodywise.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

console.log('Seeding BodyWise database with real credentials...\n');

// Clear existing data (be careful in production!)
function clearDatabase() {
  const tables = [
    'user_activity',
    'system_logs',
    'reviews',
    'consultation_attendees',
    'consultations',
    'availability_schedules',
    'bmi_records',
    'assessment_results',
    'assessments',
    'articles',
    'health_professionals',
    'patients',
    'institutional_admins',
    'system_admins',
    'institutions',
    'users',
  ];

  tables.forEach(table => {
    try {
      db.prepare(`DELETE FROM ${table}`).run();
      console.log(`Cleared ${table}`);
    } catch (error) {
      console.log(`Warning: Could not clear ${table} (might not exist)`);
    }
  });
  console.log('');
}

// Hash passwords
const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

function seedUsers() {
  console.log('Creating users...\n');

  // 1. System Admin - Albert Niyonsenga
  const adminPassword = hashPassword('admin123');
  const adminResult = db.prepare(`
    INSERT INTO users (email, password_hash, role, is_verified, is_active)
    VALUES (?, ?, 'system_admin', 1, 1)
  `).run('a.niyonseng@alustudent.com', adminPassword);

  db.prepare(`
    INSERT INTO system_admins (user_id, full_name, phone)
    VALUES (?, ?, ?)
  `).run(adminResult.lastInsertRowid, 'Albert Niyonsenga', '+250788123456');
  
  console.log('System Admin: Albert Niyonsenga (a.niyonseng@alustudent.com / admin123)');

  // 2. Patient - Peggy Dusenge
  const patientPassword = hashPassword('patient123');
  const patientResult = db.prepare(`
    INSERT INTO users (email, password_hash, role, is_verified, is_active)
    VALUES (?, ?, 'patient', 1, 1)
  `).run('p.dusenge@alustudent.com', patientPassword);

  db.prepare(`
    INSERT INTO patients (user_id, username, full_name, date_of_birth, gender, phone, profile_picture)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    patientResult.lastInsertRowid,
    'peggy_dusenge',
    'Peggy Dusenge',
    '2000-05-15',
    'female',
    '+250788234567',
    null
  );

  console.log('Patient: Peggy Dusenge (p.dusenge@alustudent.com / patient123)');

  // 3. Institution - African Leadership University (ALU)
  const institutionAdminPassword = hashPassword('institution123');
  const institutionResult = db.prepare(`
    INSERT INTO institutions (name, bio, location, latitude, longitude, verification_status, certificate_url, support_documents)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'African Leadership University',
    'African Leadership University (ALU) is a Pan-African institution dedicated to developing ethical and entrepreneurial leaders for Africa and the world. ALU provides world-class education focused on developing leadership, entrepreneurship, and practical skills needed to transform the continent.',
    'Kigali, Rwanda',
    -1.9441,
    30.0619,
    'pending',
    'https://alu.edu/certificates/accreditation.pdf',
    'https://alu.edu/documents/support-docs.pdf'
  );

  const institutionAdminResult = db.prepare(`
    INSERT INTO users (email, password_hash, role, is_verified, is_active)
    VALUES (?, ?, 'institutional_admin', 0, 1)
  `).run('d.kuzo@alustudent.com', institutionAdminPassword);

  db.prepare(`
    INSERT INTO institutional_admins (user_id, institution_id, full_name, phone, profile_picture)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    institutionAdminResult.lastInsertRowid,
    institutionResult.lastInsertRowid,
    'Divine Kuzo',
    '+250788345678',
    null
  );

  console.log('Institution Admin: Divine Kuzo (d.kuzo@alustudent.com / institution123)');
  console.log('  → Institution: African Leadership University (PENDING verification)');

  // 4. Doctors at ALU
  const doctorPassword = hashPassword('doctor123');
  const doctors = [
    {
      email: 'n.umurerwa@alustudent.com',
      name: 'Dr. Nicole Mbera Umurerwa',
      specialization: 'Nutritionist & Wellness Coach',
      bio: 'Specialized in adolescent nutrition and holistic wellness. 8+ years helping young people achieve optimal health through balanced nutrition and lifestyle changes.',
      experience: 8,
      phone: '+250788456789',
    },
    {
      email: 'e.irakoze1@alustudent.com',
      name: 'Dr. Esther Irakoze',
      specialization: 'Mental Health Counselor',
      bio: 'Licensed counselor focusing on youth mental health, stress management, and emotional well-being. Passionate about creating safe spaces for African youth.',
      experience: 6,
      phone: '+250788567890',
    },
    {
      email: 's.uwineza@alustudent.com',
      name: 'Dr. Shamilla Uwineza',
      specialization: 'Fitness & Body Image Specialist',
      bio: 'Certified fitness trainer and body positivity advocate. Helping young people build healthy relationships with exercise and their bodies.',
      experience: 5,
      phone: '+250788678901',
    },
  ];

  doctors.forEach(doctor => {
    const doctorResult = db.prepare(`
      INSERT INTO users (email, password_hash, role, is_verified, is_active)
      VALUES (?, ?, 'health_professional', 1, 1)
    `).run(doctor.email, doctorPassword);

    db.prepare(`
      INSERT INTO health_professionals (user_id, institution_id, full_name, bio, specialization, years_of_experience, phone, profile_picture)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      doctorResult.lastInsertRowid,
      institutionResult.lastInsertRowid,
      doctor.name,
      doctor.bio,
      doctor.specialization,
      doctor.experience,
      doctor.phone,
      null
    );

    console.log(`Doctor: ${doctor.name} (${doctor.email} / doctor123)`);
  });

  console.log('\nCreating sample data...\n');

  // Add some sample availability for doctors
  const doctorUsers = db.prepare(`
    SELECT hp.id, hp.user_id 
    FROM health_professionals hp
    JOIN users u ON hp.user_id = u.id
    WHERE u.role = 'health_professional'
  `).all() as Array<{ id: number; user_id: number }>;

  doctorUsers.forEach((doctor) => {
    // Add availability for all days of the week (0=Sunday, 6=Saturday)
    for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
      db.prepare(`
        INSERT INTO availability_schedules (professional_id, day_of_week, start_time, end_time, is_available)
        VALUES (?, ?, ?, ?, 1)
      `).run(doctor.id, dayOfWeek, '09:00', '17:00');
    }
  });

  console.log('Added availability schedules for doctors (Mon-Fri, 9AM-5PM)');

  // Add sample articles from ALU
  const articles = [
    {
      title: 'Understanding Body Positivity in African Context',
      content: 'Body positivity is about accepting and appreciating all body types...',
      category: 'Mental Health',
    },
    {
      title: 'Nutrition Basics for Active Youth',
      content: 'Proper nutrition is essential for young people who lead active lives...',
      category: 'Nutrition',
    },
    {
      title: 'Managing Stress During Academic Pressure',
      content: 'Academic pressure can be overwhelming. Here are practical strategies...',
      category: 'Mental Health',
    },
  ];

  const firstDoctor = doctorUsers[0] as any;
  articles.forEach(article => {
    db.prepare(`
      INSERT INTO articles (author_type, author_id, institution_id, title, content, category, is_published, approval_status)
      VALUES (?, ?, ?, ?, ?, ?, 1, 'approved')
    `).run('health_professional', firstDoctor.user_id, institutionResult.lastInsertRowid, article.title, article.content, article.category);
  });

  console.log('Added sample educational articles');

  // Log system activity
  db.prepare(`
    INSERT INTO system_logs (log_type, message, details)
    VALUES ('info', 'Database seeded with real credentials', ?)
  `).run(JSON.stringify({ timestamp: new Date().toISOString() }));

  console.log('System logs initialized');
}

// Main execution
try {
  console.log('Warning: This will clear all existing data!\n');
  
  clearDatabase();
  seedUsers();
  
  console.log('\nDatabase seeded successfully!\n');
  console.log('Login Credentials Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('System Admin:');
  console.log('  • Email: a.niyonseng@alustudent.com');
  console.log('  • Password: admin123');
  console.log('');
  console.log('Patient:');
  console.log('  • Email: p.dusenge@alustudent.com');
  console.log('  • Password: patient123');
  console.log('  • (Anyone can register as a patient)');
  console.log('');
  console.log('Institution Admin (PENDING approval):');
  console.log('  • Email: d.kuzo@alustudent.com');
  console.log('  • Password: institution123');
  console.log('  • Institution: African Leadership University');
  console.log('  • Status: Waiting for admin approval');
  console.log('');
  console.log('Doctors (ALU):');
  console.log('  • Nicole Mbera: n.umurerwa@alustudent.com / doctor123');
  console.log('  • Esther Irakoze: e.irakoze1@alustudent.com / doctor123');
  console.log('  • Shamilla Uwineza: s.uwineza@alustudent.com / doctor123');
  console.log('  • (No signup - login only with institutional credentials)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  process.exit(0);
} catch (error) {
  console.error('Seeding failed:', error);
  process.exit(1);
}
