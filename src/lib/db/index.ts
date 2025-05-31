// This file should only be imported from server-side code
// For client-side code, use the client.ts module instead

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Throw an error if this file is imported in browser code
if (typeof window !== 'undefined') {
  throw new Error(
    'This module should not be imported in client-side code. ' +
    'Use "src/lib/db/client.ts" for browser-safe database access through APIs.'
  );
}

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