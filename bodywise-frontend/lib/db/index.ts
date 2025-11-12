import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';

// initialize our database
const dbPath = process.env.DATABASE_PATH || join(process.cwd(), 'bodywise.db');
const db = new Database(dbPath);

// foreign keys enabled
db.pragma('foreign_keys = ON');

// initialize database schema
export function initializeDatabase() {
  try {
    const schemaPath = join(process.cwd(), 'lib', 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    // execute the schema
    db.exec(schema);
    
    // create default system admin (for testing)
    createDefaultSystemAdmin();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// auto-initialize on first import in development
if (process.env.NODE_ENV !== 'production') {
  try {
    // are tables exist, or not?
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (!tableCheck) {
      initializeDatabase();
    }
  } catch (error) {
    initializeDatabase();
  }
}

function createDefaultSystemAdmin() {
  const checkAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('a.niyonseng@alustudent.com');
  
  if (!checkAdmin) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    
    const insertUser = db.prepare(`
      INSERT INTO users (email, password_hash, role, is_verified, is_active)
      VALUES (?, ?, 'system_admin', 1, 1)
    `);
    const userResult = insertUser.run('a.niyonseng@alustudent.com', passwordHash);
    
    const insertAdmin = db.prepare(`
      INSERT INTO system_admins (user_id, full_name, phone)
      VALUES (?, ?, ?)
    `);
    insertAdmin.run(userResult.lastInsertRowid, 'Albert Niyonsenga', '+250788123456');
    
    console.log('Default system admin created');
  }
}

// exporting database instance
export default db;

export const userQueries = {
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  
  getUserById: db.prepare('SELECT * FROM users WHERE id = ?'),
  
  createUser: db.prepare(`
    INSERT INTO users (email, password_hash, role, is_verified, is_active)
    VALUES (?, ?, ?, ?, ?)
  `),
  
  updateUser: db.prepare(`
    UPDATE users 
    SET email = ?, role = ?, is_verified = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  deleteUser: db.prepare('DELETE FROM users WHERE id = ?'),

  getUsersByRole: db.prepare('SELECT * FROM users WHERE role = ?'),

  getAllUsers: db.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'),
  
  countUsersByRole: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?'),
};

// Patient queries
export const patientQueries = {
  getPatientByUserId: db.prepare(`
    SELECT p.*, u.email, u.is_verified, u.is_active, u.created_at
    FROM patients p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ?
  `),
  
  getPatientByUsername: db.prepare(`
    SELECT p.*, u.email, u.is_verified, u.is_active, u.created_at
    FROM patients p
    JOIN users u ON p.user_id = u.id
    WHERE p.username = ?
  `),
  
  createPatient: db.prepare(`
    INSERT INTO patients (user_id, username, full_name, date_of_birth, gender, phone, profile_picture)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  
  // update patient
  updatePatient: db.prepare(`
    UPDATE patients 
    SET username = ?, full_name = ?, date_of_birth = ?, gender = ?, phone = ?, profile_picture = ?
    WHERE user_id = ?
  `),
  
  checkUsernameAvailable: db.prepare('SELECT id FROM patients WHERE username = ?'),
};

// Health professional queries
export const professionalQueries = {
  getProfessionalByUserId: db.prepare(`
    SELECT hp.*, u.email, i.name as institution_name, u.is_verified, u.is_active
    FROM health_professionals hp
    JOIN users u ON hp.user_id = u.id
    LEFT JOIN institutions i ON hp.institution_id = i.id
    WHERE hp.user_id = ?
  `),
  
  getAllProfessionals: db.prepare(`
    SELECT hp.*, u.email, i.name as institution_name
    FROM health_professionals hp
    JOIN users u ON hp.user_id = u.id
    LEFT JOIN institutions i ON hp.institution_id = i.id
    ORDER BY hp.full_name
  `),
  
  createProfessional: db.prepare(`
    INSERT INTO health_professionals (user_id, institution_id, full_name, bio, specialization, years_of_experience, phone, profile_picture)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  updateProfessional: db.prepare(`
    UPDATE health_professionals 
    SET full_name = ?, bio = ?, specialization = ?, years_of_experience = ?, phone = ?, profile_picture = ?, institution_id = ?
    WHERE user_id = ?
  `),
  
  getProfessionalsByInstitution: db.prepare(`
    SELECT hp.*, u.email
    FROM health_professionals hp
    JOIN users u ON hp.user_id = u.id
    WHERE hp.institution_id = ?
  `),
};

// Institution queries
export const institutionQueries = {
  getInstitutionById: db.prepare('SELECT * FROM institutions WHERE id = ?'),
  
  getAllInstitutions: db.prepare('SELECT * FROM institutions ORDER BY name'),
  
  getPendingInstitutions: db.prepare("SELECT * FROM institutions WHERE verification_status = 'pending'"),
  
  createInstitution: db.prepare(`
    INSERT INTO institutions (name, bio, location, latitude, longitude, verification_status, certificate_url, support_documents)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  updateInstitution: db.prepare(`
    UPDATE institutions 
    SET name = ?, bio = ?, location = ?, latitude = ?, longitude = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  updateVerificationStatus: db.prepare(`
    UPDATE institutions 
    SET verification_status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
};

// Institutional admin queries
export const institutionalAdminQueries = {
  getAdminByUserId: db.prepare(`
    SELECT ia.*, u.email, i.name as institution_name, i.verification_status
    FROM institutional_admins ia
    JOIN users u ON ia.user_id = u.id
    JOIN institutions i ON ia.institution_id = i.id
    WHERE ia.user_id = ?
  `),
  createInstitutionalAdmin: db.prepare(`
    INSERT INTO institutional_admins (user_id, institution_id, full_name, phone, profile_picture)
    VALUES (?, ?, ?, ?, ?)
  `),
  
  getAdminsByInstitution: db.prepare(`
    SELECT ia.*, u.email
    FROM institutional_admins ia
    JOIN users u ON ia.user_id = u.id
    WHERE ia.institution_id = ?
  `),
};

// System admin queries
export const systemAdminQueries = {
  getAdminByUserId: db.prepare(`
    SELECT sa.*, u.email
    FROM system_admins sa
    JOIN users u ON sa.user_id = u.id
    WHERE sa.user_id = ?
  `),
  
  createSystemAdmin: db.prepare(`
    INSERT INTO system_admins (user_id, full_name, phone)
    VALUES (?, ?, ?)
  `),
  
  getAllSystemAdmins: db.prepare(`
    SELECT sa.*, u.email, u.is_active
    FROM system_admins sa
    JOIN users u ON sa.user_id = u.id
  `),
};

// User activity logging
export const activityQueries = {
  logActivity: db.prepare(`
    INSERT INTO user_activity (user_id, activity_type, details)
    VALUES (?, ?, ?)
  `),
  
  getRecentActivities: db.prepare(`
    SELECT ua.*, u.email
    FROM user_activity ua
    JOIN users u ON ua.user_id = u.id
    ORDER BY ua.created_at DESC
    LIMIT ? OFFSET ?
  `),
  
  getUserGrowthStats: db.prepare(`
    SELECT 
      role,
      DATE(created_at) as date,
      COUNT(*) as count
    FROM users
    WHERE created_at >= date('now', '-30 days')
    GROUP BY role, DATE(created_at)
    ORDER BY date DESC
  `),
};
