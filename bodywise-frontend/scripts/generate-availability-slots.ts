import db from '../lib/db/index.js';

/**
 * Generate availability_slots for the next 30 days based on availability_schedules
 */
function generateSlotsForDate(date: Date, dayOfWeek: number, schedules: any[]): any[] {
  const slots = [];
  const dateStr = date.toISOString().split('T')[0];
  
  for (const schedule of schedules) {
    // Generate 30-minute slots
    const start = new Date(`2000-01-01T${schedule.start_time}`);
    const end = new Date(`2000-01-01T${schedule.end_time}`);
    
    let current = start;
    while (current < end) {
      const slotStart = current.toTimeString().substring(0, 5);
      current.setMinutes(current.getMinutes() + 30);
      const slotEnd = current.toTimeString().substring(0, 5);
      
      if (current <= end) {
        slots.push({
          professional_id: schedule.professional_id,
          slot_date: dateStr,
          start_time: slotStart,
          end_time: slotEnd,
        });
      }
    }
  }
  
  return slots;
}

async function main() {
  console.log('Generating availability slots for the next 30 days...\n');
  
  // Get all active schedules
  const schedules = db.prepare(`
    SELECT s.id, s.professional_id, s.day_of_week, s.start_time, s.end_time, hp.full_name
    FROM availability_schedules s
    JOIN health_professionals hp ON s.professional_id = hp.id
    WHERE s.is_available = 1
    ORDER BY s.professional_id, s.day_of_week
  `).all() as Array<{
    id: number;
    professional_id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    full_name: string;
  }>;
  
  if (schedules.length === 0) {
    console.log('No availability schedules found!');
    return;
  }
  
  // Clear existing future slots
  db.prepare("DELETE FROM availability_slots WHERE slot_date >= date('now')").run();
  console.log('Cleared existing future slots\n');
  
  let totalSlots = 0;
  const insertSlot = db.prepare(`
    INSERT OR IGNORE INTO availability_slots (professional_id, slot_date, start_time, end_time, is_booked)
    VALUES (?, ?, ?, ?, 0)
  `);
  
  // Generate slots for next 30 days
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay(); // 0=Sunday, 6=Saturday
    
    // Get schedules for this day of week
    const daySchedules = schedules.filter(s => s.day_of_week === dayOfWeek);
    
    if (daySchedules.length > 0) {
      const slots = generateSlotsForDate(date, dayOfWeek, daySchedules);
      
      const insertMany = db.transaction((slots: any[]) => {
        for (const slot of slots) {
          insertSlot.run(slot.professional_id, slot.slot_date, slot.start_time, slot.end_time);
        }
      });
      
      insertMany(slots);
      totalSlots += slots.length;
    }
  }
  
  console.log(`\nTotal slots generated: ${totalSlots}`);
  
  // Show summary
  const summary = db.prepare(`
    SELECT 
      hp.full_name, 
      COUNT(s.id) as total_slots,
      MIN(s.slot_date) as first_date,
      MAX(s.slot_date) as last_date
    FROM availability_slots s
    JOIN health_professionals hp ON s.professional_id = hp.id
    WHERE s.slot_date >= date('now')
    GROUP BY hp.id
  `).all() as Array<{ 
    full_name: string; 
    total_slots: number;
    first_date: string;
    last_date: string;
  }>;
  
  console.log('\nSummary by Professional:');
  console.table(summary);
}

main().catch(console.error);
