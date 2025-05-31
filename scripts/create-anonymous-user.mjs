// scripts/create-anonymous-user.mjs
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function createAnonymousUser() {
  try {
    console.log('Checking for anonymous user...');
    
    // Check if anonymous user already exists
    const existingUser = await client`
      SELECT * FROM users WHERE id = 'anonymous'
    `;
    
    if (existingUser.length > 0) {
      console.log('Anonymous user already exists, no action needed');
    } else {
      // Create anonymous user
      console.log('Creating anonymous user...');
      await client`
        INSERT INTO users (id, email, full_name, role)
        VALUES ('anonymous', 'anonymous@medfund.org', 'Anonymous User', 'system')
      `;
      console.log('Anonymous user created successfully');
    }
  } catch (error) {
    console.error('Error creating anonymous user:', error);
  } finally {
    await client.end();
  }
}

createAnonymousUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 