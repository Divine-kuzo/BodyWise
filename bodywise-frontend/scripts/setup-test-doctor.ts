import Database from 'better-sqlite3';
import { join } from 'path';
import bcrypt from 'bcryptjs';

const dbPath = join(process.cwd(), 'bodywise.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

console.log('Setting up African Leadership University test data...'); // our default institution at the moment
console.log('---------------------------------------------\n');

try {
  // 1. create African Leadership University institution
  console.log('1. Creating African Leadership University...');
  
  const existingInstitution = db.prepare(
    "SELECT id FROM institutions WHERE name = 'African Leadership University'"
  ).get() as { id: number } | undefined;

  let institutionId: number;

  if (existingInstitution) {
    institutionId = existingInstitution.id;
    console.log(`institution already exists (ID: ${institutionId})`);
  } else {
    const institutionResult = db.prepare(`
      INSERT INTO institutions (
        name, 
        bio, 
        location, 
        latitude, 
        longitude, 
        verification_status
      ) VALUES (?, ?, ?, ?, ?, 'approved')
    `).run(
      'African Leadership University',
      'Pan-African institution developing ethical and entrepreneurial leaders. Offering world-class healthcare services through our wellness center.',
      'Kigali, Rwanda',
      -1.9441,
      30.0619,
    );
    
    institutionId = Number(institutionResult.lastInsertRowid);
    console.log(`created institution (ID: ${institutionId})`);
  }

  // 2. create test doctor user account
  console.log('\n2.Creating test doctor account...');
  
  const doctorEmail = 'testdoctor@alu.edu';
  const existingUser = db.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).get(doctorEmail) as { id: number } | undefined;

  let userId: number;

  if (existingUser) {
    userId = existingUser.id;
    console.log(`user already exists (ID: ${userId})`);
    
    // update to health_professional role if needed
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run('health_professional', userId);
  } else {
    const passwordHash = bcrypt.hashSync('testdoc123', 10);
    
    const userResult = db.prepare(`
      INSERT INTO users (email, password_hash, role, is_verified, is_active)
      VALUES (?, ?, 'health_professional', 1, 1)
    `).run(doctorEmail, passwordHash);
    
    userId = Number(userResult.lastInsertRowid);
    console.log(`created user account (ID: ${userId})`);
    console.log(`   Email: ${doctorEmail}`);
    console.log(`   Password: testdoc123`);
  }

  // 3. create health professional profile
  console.log('\n3. Creating health professional profile...');
  
  const existingProfessional = db.prepare(
    'SELECT id FROM health_professionals WHERE user_id = ?'
  ).get(userId) as { id: number } | undefined;

  let professionalId: number;

  if (existingProfessional) {
    professionalId = existingProfessional.id;
    console.log(`professional profile already exists (ID: ${professionalId})`);
    
    // update institution association
    db.prepare('UPDATE health_professionals SET institution_id = ? WHERE id = ?')
      .run(institutionId, professionalId);
  } else {
    const professionalResult = db.prepare(`
      INSERT INTO health_professionals (
        user_id,
        institution_id,
        full_name,
        bio,
        specialization,
        years_of_experience,
        phone,
        average_rating,
        total_reviews
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 4.8, 25)
    `).run(
      userId,
      institutionId,
      'Dr. Kwame Mensah',
      'Experienced General Practitioner specializing in preventive care and wellness. Passionate about holistic health approaches that combine modern medicine with traditional healing wisdom.',
      'General Practice & Wellness',
      12,
      '+250788123456'
    );
    
    professionalId = Number(professionalResult.lastInsertRowid);
    console.log(`created professional profile (ID: ${professionalId})`);
  }

  // 4. create some availability slots for testing (next 7 days)
  console.log('\n4. Creating test availability slots...');
  
  const today = new Date();
  let totalSlotsCreated = 0;

  for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
    const slotDate = new Date(today);
    slotDate.setDate(slotDate.getDate() + dayOffset);
    const dateStr = slotDate.toISOString().split('T')[0];

    // check if slots already exist for this date
    const existingSlots = db.prepare(
      'SELECT COUNT(*) as count FROM availability_slots WHERE professional_id = ? AND slot_date = ?'
    ).get(professionalId, dateStr) as { count: number };

    if (existingSlots.count > 0) {
      console.log(`Slots already exist for ${dateStr}, skipping...`);
      continue;
    }

    // create morning slots (09:00 - 12:00)
    const morningSlots = [
      '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
      '11:00-11:30', '11:30-12:00'
    ];

    // create afternoon slots (14:00 - 17:00)
    const afternoonSlots = [
      '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00',
      '16:00-16:30', '16:30-17:00'
    ];

    const allSlots = [...morningSlots, ...afternoonSlots];

    for (const slot of allSlots) {
      const [startTime, endTime] = slot.split('-');
      
      db.prepare(`
        INSERT INTO availability_slots (professional_id, slot_date, start_time, end_time, is_booked)
        VALUES (?, ?, ?, ?, 0)
      `).run(professionalId, dateStr, startTime, endTime);
      
      totalSlotsCreated++;
    }

    console.log(`created ${allSlots.length} slots for ${dateStr})`);
  }

  console.log(`\ntotal slots created: ${totalSlotsCreated}`);

  // 5. Summary
  console.log('\n' + '='.repeat(50));
  console.log('test setup complete');
  console.log('='.repeat(50));
  console.log('\ntest account details:');
  console.log('   Institution: African Leadership University');
  console.log(`   Institution ID: ${institutionId}`);
  console.log('\n   Doctor Account:');
  console.log('   Email: testdoctor@alu.edu');
  console.log('   Password: testdoc123');
  console.log('   Name: Dr. Kwame Mensah');
  console.log('   Specialization: General Practice & Wellness');
  console.log(`   Professional ID: ${professionalId}`);
  console.log(`   Available Slots: ${totalSlotsCreated} (next 7 days)`);

} catch (error) {
  console.error('error setting up test data:', error);
  throw error;
} finally {
  db.close();
}
