import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

// For migrations
const migrationClient = postgres(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medfund', { max: 1 });
const db = drizzle(migrationClient);

// This will run migrations on the database, skipping the ones already applied
async function main() {
  console.log('Running migrations...');
  
  try {
    await migrate(db, { migrationsFolder: './src/lib/db/migrations' });
    console.log('Migrations complete!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
  
  process.exit(0);
}

main(); 