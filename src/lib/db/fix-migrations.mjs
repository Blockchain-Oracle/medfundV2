// fix-migrations.mjs - Script to fix migration issues with existing types
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  // Database connection string
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medfund';
  console.log('Database URL:', connectionString);
  
  // Create client
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  try {
    console.log('Checking for existing types...');
    
    // First, check if campaign_category type exists
    const typeExists = await client`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'campaign_category'
      );
    `;
    
    const campaignCategoryExists = typeExists[0]?.exists || false;
    
    if (campaignCategoryExists) {
      console.log('campaign_category type already exists, skipping...');
    } else {
      console.log('Creating campaign_category type...');
      await client`
        CREATE TYPE "public"."campaign_category" AS ENUM(
          'surgery', 'treatment', 'therapy', 'emergency', 
          'medication', 'rehabilitation', 'other'
        );
      `;
    }
    
    // Check and create campaign_status if needed
    const campaignStatusExists = await client`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'campaign_status'
      );
    `;
    
    if (campaignStatusExists[0]?.exists) {
      console.log('campaign_status type already exists, skipping...');
    } else {
      console.log('Creating campaign_status type...');
      await client`
        CREATE TYPE "public"."campaign_status" AS ENUM(
          'pending', 'active', 'completed', 'rejected', 'cancelled'
        );
      `;
    }
    
    // Check and create donation_status if needed
    const donationStatusExists = await client`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'donation_status'
      );
    `;
    
    if (donationStatusExists[0]?.exists) {
      console.log('donation_status type already exists, skipping...');
    } else {
      console.log('Creating donation_status type...');
      await client`
        CREATE TYPE "public"."donation_status" AS ENUM(
          'pending', 'completed', 'failed', 'refunded'
        );
      `;
    }
    
    // Check and create record_type if needed
    const recordTypeExists = await client`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'record_type'
      );
    `;
    
    if (recordTypeExists[0]?.exists) {
      console.log('record_type type already exists, skipping...');
    } else {
      console.log('Creating record_type type...');
      await client`
        CREATE TYPE "public"."record_type" AS ENUM(
          'diagnosis', 'test_result', 'prescription', 'treatment', 
          'surgery', 'consultation', 'other'
        );
      `;
    }
    
    console.log('Type checks and creation completed successfully!');
    console.log('You can now run the migrations with: pnpm db:migrate');
    
  } catch (error) {
    console.error('Error fixing migrations:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
  
  process.exit(0);
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 