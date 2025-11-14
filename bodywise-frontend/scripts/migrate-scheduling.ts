import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'bodywise.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

console.log('Running scheduling system migration...');

try {
  // add new columns to consultations table
  db.exec(`
    ALTER TABLE consultations ADD COLUMN jitsi_room_id TEXT;
    ALTER TABLE consultations ADD COLUMN jitsi_access_token TEXT;
    ALTER TABLE consultations ADD COLUMN slot_id INTEGER REFERENCES availability_slots(id) ON DELETE SET NULL;
    ALTER TABLE consultations ADD COLUMN notes TEXT;
    ALTER TABLE consultations ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
  `);
  console.log('added new columns to consultations table');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('consultations columns already exist, skipping...');
  } else {
    console.error('Error adding consultations columns:', error);
  }
}

try {
  // create availability_slots table
  db.exec(`
    CREATE TABLE IF NOT EXISTS availability_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      professional_id INTEGER NOT NULL,
      slot_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      is_booked BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (professional_id) REFERENCES health_professionals(id) ON DELETE CASCADE,
      UNIQUE(professional_id, slot_date, start_time)
    );
  `);
  console.log('created availability_slots table');
} catch (error) {
  console.error('Error creating availability_slots:', error);
}

try {
  // create email_reminders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consultation_id INTEGER NOT NULL,
      recipient_email TEXT NOT NULL,
      reminder_type TEXT NOT NULL CHECK(reminder_type IN ('confirmation', '24hr', '1hr', 'invite')),
      scheduled_time DATETIME NOT NULL,
      sent_at DATETIME,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'failed')),
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE
    );
  `);
  console.log('created email_reminders table');
} catch (error) {
  console.error('Error creating email_reminders:', error);
}

try {
  // create invitations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS invitations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_patient_id INTEGER NOT NULL,
      recipient_patient_id INTEGER NOT NULL,
      professional_id INTEGER NOT NULL,
      consultation_id INTEGER,
      message TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'declined')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      responded_at DATETIME,
      FOREIGN KEY (sender_patient_id) REFERENCES patients(id) ON DELETE CASCADE,
      FOREIGN KEY (recipient_patient_id) REFERENCES patients(id) ON DELETE CASCADE,
      FOREIGN KEY (professional_id) REFERENCES health_professionals(id) ON DELETE CASCADE,
      FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE SET NULL
    );
  `);
  console.log('created invitations table');
} catch (error) {
  console.error('Error creating invitations:', error);
}

try {
  // create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_consultations_jitsi ON consultations(jitsi_room_id);
    CREATE INDEX IF NOT EXISTS idx_availability_slots_date ON availability_slots(slot_date);
    CREATE INDEX IF NOT EXISTS idx_availability_slots_professional ON availability_slots(professional_id, slot_date);
    CREATE INDEX IF NOT EXISTS idx_email_reminders_scheduled ON email_reminders(scheduled_time, status);
    CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
  `);
  console.log('created indexes for new tables');
} catch (error) {
  console.error('Error creating indexes:', error);
}

console.log('migration completed successfully');
db.close();
