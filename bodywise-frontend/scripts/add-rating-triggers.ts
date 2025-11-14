import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = process.env.DATABASE_PATH || join(process.cwd(), 'bodywise.db');
const db = new Database(dbPath);

console.log('Adding rating update triggers...');

try {
  // drop existing triggers if they exist
  db.exec(`
    DROP TRIGGER IF EXISTS update_professional_rating_on_insert;
    DROP TRIGGER IF EXISTS update_professional_rating_on_update;
    DROP TRIGGER IF EXISTS update_professional_rating_on_delete;
  `);

  // trigger for new reviews
  db.exec(`
    CREATE TRIGGER update_professional_rating_on_insert
    AFTER INSERT ON reviews
    BEGIN
      UPDATE health_professionals
      SET 
        average_rating = (
          SELECT AVG(rating) 
          FROM reviews 
          WHERE professional_id = NEW.professional_id
        ),
        total_reviews = (
          SELECT COUNT(*) 
          FROM reviews 
          WHERE professional_id = NEW.professional_id
        )
      WHERE id = NEW.professional_id;
    END;
  `);

  // trigger for updated reviews
  db.exec(`
    CREATE TRIGGER update_professional_rating_on_update
    AFTER UPDATE ON reviews
    BEGIN
      UPDATE health_professionals
      SET 
        average_rating = (
          SELECT AVG(rating) 
          FROM reviews 
          WHERE professional_id = NEW.professional_id
        ),
        total_reviews = (
          SELECT COUNT(*) 
          FROM reviews 
          WHERE professional_id = NEW.professional_id
        )
      WHERE id = NEW.professional_id;
    END;
  `);

  // trigger for deleted reviews
  db.exec(`
    CREATE TRIGGER update_professional_rating_on_delete
    AFTER DELETE ON reviews
    BEGIN
      UPDATE health_professionals
      SET 
        average_rating = COALESCE((
          SELECT AVG(rating) 
          FROM reviews 
          WHERE professional_id = OLD.professional_id
        ), 0.0),
        total_reviews = (
          SELECT COUNT(*) 
          FROM reviews 
          WHERE professional_id = OLD.professional_id
        )
      WHERE id = OLD.professional_id;
    END;
  `);

  console.log('Rating update triggers created successfully');

  // recalculate all existing ratings
  console.log('Recalculating existing ratings...');
  
  const professionals = db.prepare('SELECT id FROM health_professionals').all();
  
  for (const prof of professionals) {
    const stats = db.prepare(`
      SELECT 
        COALESCE(AVG(rating), 0.0) as avg_rating,
        COUNT(*) as total
      FROM reviews
      WHERE professional_id = ?
    `).get(prof.id) as any;

    db.prepare(`
      UPDATE health_professionals
      SET average_rating = ?, total_reviews = ?
      WHERE id = ?
    `).run(stats.avg_rating, stats.total, prof.id);
  }

  console.log(`Recalculated ratings for ${professionals.length} professionals`);
  
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}

db.close();
console.log('Migration completed successfully');
