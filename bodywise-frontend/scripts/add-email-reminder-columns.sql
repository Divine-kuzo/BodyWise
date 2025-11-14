-- add reminder tracking columns to consultations table
ALTER TABLE consultations ADD COLUMN start_time DATETIME;
ALTER TABLE consultations ADD COLUMN reminder_24h_sent INTEGER DEFAULT 0;
ALTER TABLE consultations ADD COLUMN reminder_1h_sent INTEGER DEFAULT 0;

-- update existing records to have start_time based on scheduled_date and scheduled_time
UPDATE consultations 
SET start_time = datetime(scheduled_date || ' ' || scheduled_time)
WHERE start_time IS NULL;

-- create index for faster email cron queries
CREATE INDEX IF NOT EXISTS idx_consultations_reminders 
ON consultations(status, start_time, reminder_24h_sent, reminder_1h_sent);
