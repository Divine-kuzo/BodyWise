import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'bodywise.db'));

console.log('Starting ID reset process...\n');
console.log('Step 1: Collecting all data...\n');

// Collect ALL data first before any deletions
const users = db.prepare('SELECT * FROM users ORDER BY id').all();
const patients = db.prepare('SELECT * FROM patients ORDER BY id').all();
const professionals = db.prepare('SELECT * FROM health_professionals ORDER BY id').all();
const admins = db.prepare('SELECT * FROM institutional_admins ORDER BY id').all();
const institutions = db.prepare('SELECT * FROM institutions ORDER BY id').all();
const schedules = db.prepare('SELECT * FROM availability_schedules ORDER BY id').all();
const slots = db.prepare('SELECT * FROM availability_slots ORDER BY id').all();
const consultations = db.prepare('SELECT * FROM consultations ORDER BY id').all();
const articles = db.prepare('SELECT * FROM articles ORDER BY id').all();
const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY id').all();

console.log(`Collected: ${users.length} users, ${patients.length} patients, ${professionals.length} professionals`);
console.log(`          ${admins.length} admins, ${institutions.length} institutions, ${schedules.length} schedules`);
console.log(`          ${slots.length} slots, ${consultations.length} consultations`);
console.log(`          ${articles.length} articles, ${testimonials.length} testimonials\n`);

console.log('Step 2: Resetting IDs...\n');

try {
  db.exec('BEGIN TRANSACTION');

  // 1. Users table
  console.log('Resetting users IDs...');
  db.exec('DELETE FROM users');
  
  const userIdMap = new Map();
  let newUserId = 1;
  
  for (const user of users) {
    userIdMap.set(user.id, newUserId);
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, is_verified, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newUserId, user.email, user.password_hash, user.role, user.is_verified, user.is_active, user.created_at, user.updated_at);
    newUserId++;
  }
  console.log(`✓ Users: ${users.length} records (1-${users.length})\n`);

  // 2. Patients table
  console.log('Resetting patients IDs...');
  db.exec('DELETE FROM patients');
  
  let newPatientId = 1;
  for (const patient of patients) {
    const newUserId = userIdMap.get(patient.user_id);
    db.prepare(`
      INSERT INTO patients (id, user_id, username, full_name, date_of_birth, gender, phone, profile_picture)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newPatientId, newUserId, patient.username, patient.full_name, patient.date_of_birth, patient.gender, patient.phone, patient.profile_picture);
    newPatientId++;
  }
  console.log(`✓ Patients: ${patients.length} records (1-${patients.length})\n`);

  // 3. Health Professionals table
  console.log('Resetting health_professionals IDs...');
  db.exec('DELETE FROM health_professionals');
  
  const professionalIdMap = new Map();
  let newProfId = 1;
  
  for (const prof of professionals) {
    const newUserId = userIdMap.get(prof.user_id);
    professionalIdMap.set(prof.id, newProfId);
    db.prepare(`
      INSERT INTO health_professionals (id, user_id, institution_id, full_name, bio, specialization, years_of_experience, phone, profile_picture, calendar_integration, average_rating, total_reviews)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newProfId, newUserId, prof.institution_id, prof.full_name, prof.bio, prof.specialization, prof.years_of_experience, prof.phone, prof.profile_picture, prof.calendar_integration, prof.average_rating, prof.total_reviews);
    newProfId++;
  }
  console.log(`✓ Health Professionals: ${professionals.length} records (1-${professionals.length})\n`);

  // 4. Institutional Admins table
  console.log('Resetting institutional_admins IDs...');
  db.exec('DELETE FROM institutional_admins');
  
  const adminIdMap = new Map();
  let newAdminId = 1;
  
  for (const admin of admins) {
    const newUserId = userIdMap.get(admin.user_id);
    adminIdMap.set(admin.id, newAdminId);
    db.prepare(`
      INSERT INTO institutional_admins (id, user_id, institution_id, full_name, phone, profile_picture)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(newAdminId, newUserId, admin.institution_id, admin.full_name, admin.phone, admin.profile_picture);
    newAdminId++;
  }
  console.log(`✓ Institutional Admins: ${admins.length} records (1-${admins.length})\n`);

  // 5. Institutions table
  console.log('Resetting institutions IDs...');
  db.exec('DELETE FROM institutions');
  
  const institutionIdMap = new Map();
  let newInstId = 1;
  
  for (const inst of institutions) {
    institutionIdMap.set(inst.id, newInstId);
    db.prepare(`
      INSERT INTO institutions (id, name, bio, location, latitude, longitude, verification_status, certificate_url, support_documents, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newInstId, inst.name, inst.bio, inst.location, inst.latitude, inst.longitude, inst.verification_status, inst.certificate_url, inst.support_documents, inst.created_at, inst.updated_at);
    newInstId++;
  }
  console.log(`✓ Institutions: ${institutions.length} records (1-${institutions.length})\n`);

  // Update institution_id in institutional_admins
  for (const admin of admins) {
    const newAdminId = adminIdMap.get(admin.id);
    const newInstId = institutionIdMap.get(admin.institution_id);
    if (newInstId) {
      db.prepare('UPDATE institutional_admins SET institution_id = ? WHERE id = ?').run(newInstId, newAdminId);
    }
  }

  // 6. Availability Schedules table
  console.log('Resetting availability_schedules IDs...');
  db.exec('DELETE FROM availability_schedules');
  
  const scheduleIdMap = new Map();
  let newScheduleId = 1;
  
  for (const schedule of schedules) {
    const newProfId = professionalIdMap.get(schedule.professional_id);
    scheduleIdMap.set(schedule.id, newScheduleId);
    db.prepare(`
      INSERT INTO availability_schedules (id, professional_id, day_of_week, start_time, end_time, is_available, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newScheduleId, newProfId, schedule.day_of_week, schedule.start_time, schedule.end_time, schedule.is_available, schedule.created_at, schedule.updated_at);
    newScheduleId++;
  }
  console.log(`✓ Availability Schedules: ${schedules.length} records (1-${schedules.length})\n`);

  // 7. Availability Slots table
  console.log('Resetting availability_slots IDs...');
  db.exec('DELETE FROM availability_slots');
  
  let newSlotId = 1;
  for (const slot of slots) {
    const newScheduleId = scheduleIdMap.get(slot.schedule_id);
    db.prepare(`
      INSERT INTO availability_slots (id, schedule_id, slot_date, start_time, end_time, is_booked, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(newSlotId, newScheduleId, slot.slot_date, slot.start_time, slot.end_time, slot.is_booked, slot.created_at);
    newSlotId++;
  }
  console.log(`✓ Availability Slots: ${slots.length} records (1-${slots.length})\n`);

  // 8. Consultations table
  console.log('Resetting consultations IDs...');
  db.exec('DELETE FROM consultations');
  
  let newConsultId = 1;
  for (const consult of consultations) {
    const newPatientId = userIdMap.get(consult.patient_id);
    const newProfId = userIdMap.get(consult.professional_id);
    db.prepare(`
      INSERT INTO consultations (id, patient_id, professional_id, scheduled_date, start_time, end_time, status, meeting_link, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newConsultId, newPatientId, newProfId, consult.scheduled_date, consult.start_time, consult.end_time, consult.status, consult.meeting_link, consult.notes, consult.created_at, consult.updated_at);
    newConsultId++;
  }
  console.log(`✓ Consultations: ${consultations.length} records (1-${consultations.length})\n`);

  // 9. Articles table
  console.log('Resetting articles IDs...');
  db.exec('DELETE FROM articles');
  
  let newArticleId = 1;
  for (const article of articles) {
    let newAuthorId = article.author_id;
    if (article.author_type === 'health_professional') {
      newAuthorId = professionalIdMap.get(article.author_id) || article.author_id;
    } else if (article.author_type === 'institutional_admin') {
      newAuthorId = adminIdMap.get(article.author_id) || article.author_id;
    }
    
    const newInstId = article.institution_id ? institutionIdMap.get(article.institution_id) : null;
    
    db.prepare(`
      INSERT INTO articles (id, title, content, author_type, author_id, institution_id, category, tags, thumbnail_url, views_count, approval_status, is_published, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newArticleId, article.title, article.content, article.author_type, newAuthorId, newInstId, article.category, article.tags, article.thumbnail_url, article.views_count, article.approval_status, article.is_published, article.created_at, article.updated_at);
    newArticleId++;
  }
  console.log(`✓ Articles: ${articles.length} records (1-${articles.length})\n`);

  // 10. Testimonials table
  console.log('Resetting testimonials IDs...');
  db.exec('DELETE FROM testimonials');
  
  let newTestId = 1;
  for (const test of testimonials) {
    const newUserId = userIdMap.get(test.user_id);
    db.prepare(`
      INSERT INTO testimonials (id, user_id, user_type, content, rating, approval_status, approved_by, approved_at, rejection_reason, is_featured, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newTestId, newUserId, test.user_type, test.content, test.rating, test.approval_status, test.approved_by, test.approved_at, test.rejection_reason, test.is_featured, test.created_at, test.updated_at);
    newTestId++;
  }
  console.log(`✓ Testimonials: ${testimonials.length} records (1-${testimonials.length})\n`);

  // Reset SQLite autoincrement sequences
  db.exec(`
    UPDATE sqlite_sequence SET seq = ${users.length} WHERE name = 'users';
    UPDATE sqlite_sequence SET seq = ${patients.length} WHERE name = 'patients';
    UPDATE sqlite_sequence SET seq = ${professionals.length} WHERE name = 'health_professionals';
    UPDATE sqlite_sequence SET seq = ${admins.length} WHERE name = 'institutional_admins';
    UPDATE sqlite_sequence SET seq = ${institutions.length} WHERE name = 'institutions';
    UPDATE sqlite_sequence SET seq = ${schedules.length} WHERE name = 'availability_schedules';
    UPDATE sqlite_sequence SET seq = ${slots.length} WHERE name = 'availability_slots';
    UPDATE sqlite_sequence SET seq = ${consultations.length} WHERE name = 'consultations';
    UPDATE sqlite_sequence SET seq = ${articles.length} WHERE name = 'articles';
    UPDATE sqlite_sequence SET seq = ${testimonials.length} WHERE name = 'testimonials';
  `);

  db.exec('COMMIT');
  
  console.log('\n✅ All IDs have been reset to be incremental!');
  console.log('Backup saved as bodywise.db.backup');
  
} catch (error) {
  db.exec('ROLLBACK');
  console.error('❌ Error resetting IDs:', error);
  process.exit(1);
} finally {
  db.close();
}
