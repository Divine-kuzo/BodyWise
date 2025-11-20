import db from './db';
import { sendEmail, emailTemplates } from './email';

interface Consultation {
  id: number;
  patient_id: number;
  professional_id: number;
  start_time: string;
  status: string;
  meeting_link: string;
  patient_email: string;
  patient_name: string;
  professional_name: string;
  professional_email: string;
  reminder_24h_sent: number;
  reminder_1h_sent: number;
  doctor_reminder_24h_sent?: number;
  doctor_reminder_1h_sent?: number;
}

/**
 * Check and send 24-hour reminder emails
 */
export async function send24HourReminders() {
  
  // Get consultations that start in 23-25 hours and haven't received 24h reminder
  const now = new Date();
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const twentyThreeHoursFromNow = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  
  const consultations = db.prepare(`
    SELECT 
      c.id,
      c.patient_id,
      c.professional_id,
      c.start_time,
      c.status,
      c.meeting_link,
      c.reminder_24h_sent,
      c.reminder_1h_sent,
      c.doctor_reminder_24h_sent,
      c.doctor_reminder_1h_sent,
      u.email as patient_email,
      p.full_name as patient_name,
      hp.full_name as professional_name,
      du.email as professional_email
    FROM consultations c
    JOIN patients p ON c.patient_id = p.id
    JOIN users u ON p.user_id = u.id
    JOIN health_professionals hp ON c.professional_id = hp.id
    JOIN users du ON hp.user_id = du.id
    WHERE c.status = 'scheduled'
    AND c.start_time BETWEEN ? AND ?
    AND c.reminder_24h_sent = 0
  `).all(twentyThreeHoursFromNow.toISOString(), twentyFourHoursFromNow.toISOString()) as Consultation[];

  console.log(`Found ${consultations.length} consultations needing 24h reminders`);

  for (const consultation of consultations) {
    try {
      const startTime = new Date(consultation.start_time);
      const template = emailTemplates.reminder24h({
        patientName: consultation.patient_name,
        professionalName: consultation.professional_name,
        date: startTime.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: startTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        meetingLink: consultation.meeting_link,
      });

      // Send to patient
      const patientResult = await sendEmail(consultation.patient_email, template);

      // Send to doctor
      const doctorTemplate = emailTemplates.reminder24h({
        patientName: consultation.patient_name,
        professionalName: consultation.professional_name,
        date: startTime.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: startTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        meetingLink: consultation.meeting_link,
      });
      const doctorResult = await sendEmail(consultation.professional_email, doctorTemplate);

      if (patientResult.success) {
        db.prepare('UPDATE consultations SET reminder_24h_sent = 1 WHERE id = ?').run(consultation.id);
        console.log(`24h reminder sent to patient ${consultation.patient_email} for consultation #${consultation.id}`);
      } else {
        console.error(`Failed to send 24h reminder to patient for consultation #${consultation.id}: ${patientResult.error}`);
      }

      if (doctorResult.success) {
        db.prepare('UPDATE consultations SET doctor_reminder_24h_sent = 1 WHERE id = ?').run(consultation.id);
        console.log(`24h reminder sent to doctor ${consultation.professional_email} for consultation #${consultation.id}`);
      } else {
        console.error(`Failed to send 24h reminder to doctor for consultation #${consultation.id}: ${doctorResult.error}`);
      }
    } catch (error) {
      console.error(`Error processing consultation #${consultation.id}:`, error);
    }
  }

  return { processed: consultations.length };
}

/**
 * Check and send 1-hour reminder emails
 */
export async function send1HourReminders() {
  // Get consultations that start in 55-65 minutes and haven't received 1h reminder
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 65 * 60 * 1000);
  const fiftyFiveMinutesFromNow = new Date(now.getTime() + 55 * 60 * 1000);
  
  const consultations = db.prepare(`
    SELECT 
      c.id,
      c.patient_id,
      c.professional_id,
      c.start_time,
      c.status,
      c.meeting_link,
      c.reminder_24h_sent,
      c.reminder_1h_sent,
      c.doctor_reminder_24h_sent,
      c.doctor_reminder_1h_sent,
      u.email as patient_email,
      p.full_name as patient_name,
      hp.full_name as professional_name,
      du.email as professional_email
    FROM consultations c
    JOIN patients p ON c.patient_id = p.id
    JOIN users u ON p.user_id = u.id
    JOIN health_professionals hp ON c.professional_id = hp.id
    JOIN users du ON hp.user_id = du.id
    WHERE c.status = 'scheduled'
    AND c.start_time BETWEEN ? AND ?
    AND c.reminder_1h_sent = 0
  `).all(fiftyFiveMinutesFromNow.toISOString(), oneHourFromNow.toISOString()) as Consultation[];

  console.log(`Found ${consultations.length} consultations needing 1h reminders`);

  for (const consultation of consultations) {
    try {
      const startTime = new Date(consultation.start_time);
      const template = emailTemplates.reminder1h({
        patientName: consultation.patient_name,
        professionalName: consultation.professional_name,
        time: startTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        meetingLink: consultation.meeting_link,
      });

      // Send to patient
      const patientResult = await sendEmail(consultation.patient_email, template);

      // Send to doctor
      const doctorTemplate = emailTemplates.reminder1h({
        patientName: consultation.patient_name,
        professionalName: consultation.professional_name,
        time: startTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        meetingLink: consultation.meeting_link,
      });
      const doctorResult = await sendEmail(consultation.professional_email, doctorTemplate);

      if (patientResult.success) {
        db.prepare('UPDATE consultations SET reminder_1h_sent = 1 WHERE id = ?').run(consultation.id);
        console.log(`1h reminder sent to patient ${consultation.patient_email} for consultation #${consultation.id}`);
      } else {
        console.error(`Failed to send 1h reminder to patient for consultation #${consultation.id}: ${patientResult.error}`);
      }

      if (doctorResult.success) {
        db.prepare('UPDATE consultations SET doctor_reminder_1h_sent = 1 WHERE id = ?').run(consultation.id);
        console.log(`1h reminder sent to doctor ${consultation.professional_email} for consultation #${consultation.id}`);
      } else {
        console.error(`Failed to send 1h reminder to doctor for consultation #${consultation.id}: ${doctorResult.error}`);
      }
    } catch (error) {
      console.error(`Error processing consultation #${consultation.id}:`, error);
    }
  }

  return { processed: consultations.length };
}

/**
 * Send confirmation email immediately after booking
 */
export async function sendConfirmationEmail(consultationId: number) {
  
  const consultation = db.prepare(`
    SELECT 
      c.id,
      c.patient_id,
      c.professional_id,
      c.start_time,
      c.status,
      c.meeting_link,
      u.email as patient_email,
      p.full_name as patient_name,
      hp.full_name as professional_name,
      du.email as professional_email
    FROM consultations c
    JOIN patients p ON c.patient_id = p.id
    JOIN users u ON p.user_id = u.id
    JOIN health_professionals hp ON c.professional_id = hp.id
    JOIN users du ON hp.user_id = du.id
    WHERE c.id = ?
  `).get(consultationId) as Consultation | undefined;

  if (!consultation) {
    throw new Error(`Consultation #${consultationId} not found`);
  }

  const startTime = new Date(consultation.start_time);
  const template = emailTemplates.confirmation({
    patientName: consultation.patient_name,
    professionalName: consultation.professional_name,
    date: startTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    time: startTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    meetingLink: consultation.meeting_link,
  });

  // Send to patient
  const patientResult = await sendEmail(consultation.patient_email, template);
  
  // Send to doctor
  const doctorTemplate = emailTemplates.confirmation({
    patientName: consultation.patient_name,
    professionalName: consultation.professional_name,
    date: startTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    time: startTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    meetingLink: consultation.meeting_link,
  });
  const doctorResult = await sendEmail(consultation.professional_email, doctorTemplate);

  if (!patientResult.success) {
    console.error(`Failed to send confirmation to patient: ${patientResult.error}`);
  }
  if (!doctorResult.success) {
    console.error(`Failed to send confirmation to doctor: ${doctorResult.error}`);
  }

  return patientResult;
}

/**
 * Run all reminder checks
 */
export async function runEmailCron() {
  console.log('Running email reminder cron job...');
  
  try {
    const results24h = await send24HourReminders();
    const results1h = await send1HourReminders();
    
    console.log(`Email cron completed: ${results24h.processed} 24h reminders, ${results1h.processed} 1h reminders`);
    
    return {
      success: true,
      reminders24h: results24h.processed,
      reminders1h: results1h.processed,
    };
  } catch (error) {
    console.error('Email cron failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
