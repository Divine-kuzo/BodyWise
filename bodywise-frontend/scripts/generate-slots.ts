import db from '../lib/db';

/**
 * Generate 30-minute slots for a given schedule
 */
function generateSlots(scheduleId: number, professionalId: number, startTime: string, endTime: string) {
  const slots = [];
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  let current = start;
  while (current < end) {
    const slotStart = current.toTimeString().substring(0, 5);
    current.setMinutes(current.getMinutes() + 30);
    const slotEnd = current.toTimeString().substring(0, 5);
    
    if (current <= end) {
      slots.push({
        schedule_id: scheduleId,
        professional_id: professionalId,
        start_time: slotStart,
        end_time: slotEnd,
      });
    }
  }
  
  return slots;
}

async function main() {
  console.log('Generating 30-minute slots for all schedules...\n');
  
  // Get all schedules
  const schedules = db.prepare(`
    SELECT s.id, s.professional_id, s.start_time, s.end_time, hp.full_name
    FROM availability_schedules s
    JOIN health_professionals hp ON s.professional_id = hp.id
    WHERE s.is_available = 1
  `).all() as Array<{
    id: number;
    professional_id: number;
    start_time: string;
    end_time: string;
    full_name: string;
  }>;
  
  let totalSlots = 0;
  
  for (const schedule of schedules) {
    const slots = generateSlots(
      schedule.id,
      schedule.professional_id,
      schedule.start_time,
      schedule.end_time
    );
    
    // Insert slots
    const insertSlot = db.prepare(`
      INSERT INTO availability_slots (schedule_id, professional_id, start_time, end_time, is_available)
      VALUES (?, ?, ?, ?, 1)
    `);
    
    const insertMany = db.transaction((slots) => {
      for (const slot of slots) {
        insertSlot.run(slot.schedule_id, slot.professional_id, slot.start_time, slot.end_time);
      }
    });
    
    insertMany(slots);
    totalSlots += slots.length;
    
    console.log(`${schedule.full_name}: ${slots.length} slots (${schedule.start_time} - ${schedule.end_time})`);
  }
  
  console.log(`\ntotal slots generated: ${totalSlots}`);
  
  // Show summary
  const summary = db.prepare(`
    SELECT hp.full_name, COUNT(s.id) as total_slots
    FROM availability_slots s
    JOIN health_professionals hp ON s.professional_id = hp.id
    GROUP BY hp.id
  `).all();
  
  console.log('\nSummary:');
  console.table(summary);
}

main().catch(console.error);
