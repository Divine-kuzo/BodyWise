import { initializeDatabase } from '../lib/db/index.js';

console.log('Initializing BodyWise database...');

try {
  initializeDatabase();
  console.log('Database setup complete!');
  console.log('Default system admin created:');
  console.log('Email: a.niyonseng@alustudent.com');
  console.log('Password: admin123');
  process.exit(0);
} catch (error) {
  console.error('Database initialization failed:', error);
  process.exit(1);
}
