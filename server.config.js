// server.config.js
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Use environment variables for connection string in production
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medfund';

// For query purposes (connection pool)
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient);

// For schema definitions
import { campaignsSchema } from './src/lib/db/schema-exports.js';
import { campaignUpdatesSchema } from './src/lib/db/schema-exports.js';
import { donationsSchema } from './src/lib/db/schema-exports.js'; 
import { usersSchema } from './src/lib/db/schema-exports.js';

export const campaigns = campaignsSchema;
export const campaignUpdates = campaignUpdatesSchema;
export const donations = donationsSchema;
export const users = usersSchema; 