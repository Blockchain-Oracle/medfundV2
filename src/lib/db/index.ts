import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Use environment variables for connection string in production
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medfund';

// For query purposes (connection pool)
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient);

// For single queries (use and close)
export const getDb = () => {
  const client = postgres(connectionString);
  return drizzle(client);
}; 