import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import path from 'path';
import { fileURLToPath } from 'url';

async function runMigrations() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const migrationsFolder = path.join(__dirname, 'migrations');
  
  console.log('Running migrations from:', migrationsFolder);
  console.log('Database URL:', process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medfund');
  
  // For migrations
  const migrationClient = postgres(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medfund', { max: 1 });
  const db = drizzle(migrationClient);

  try {
    console.log('Starting migrations...');
    await migrate(db, { migrationsFolder });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
  
  return 'Migrations completed';
}

// Check if this module is being run directly (ESM version)
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error in migration script:', err);
      process.exit(1);
    });
}

export default runMigrations; 