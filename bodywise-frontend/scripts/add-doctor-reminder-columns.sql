-- add doctor reminder columns to consultations table
ALTER TABLE consultations ADD COLUMN doctor_reminder_24h_sent INTEGER DEFAULT 0;
ALTER TABLE consultations ADD COLUMN doctor_reminder_1h_sent INTEGER DEFAULT 0;

-- create index for doctor reminder queries
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_reminders 
ON consultations(professional_id, start_time, status, doctor_reminder_24h_sent, doctor_reminder_1h_sent);
