// migrate-db.mjs - Pure ESM migration script
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const migrationsFolder = path.join(__dirname, 'migrations');
  
  console.log('Running migrations from:', migrationsFolder);
  
  // Database connection string
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medfund';
  console.log('Database URL:', connectionString);
  
  // For migrations
  const migrationClient = postgres(connectionString, { max: 1 });
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
  
  process.exit(0);
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 