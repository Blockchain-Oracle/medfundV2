#!/usr/bin/env node

// This script creates the necessary Supabase storage buckets for the application
// Run with: node scripts/create-buckets.mjs

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

// Required buckets
const REQUIRED_BUCKETS = ['campaign-images', 'campaign-documents'];

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xcfziysmpitxuenoclsg.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_KEY;

// The service key should be a JWT, not a plain text key
console.log('Using Supabase URL:', SUPABASE_URL);
console.log('Using Supabase Anon Key:', SUPABASE_ANON_KEY ? 'Set ✓' : 'Not set ✗');

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createBuckets() {
  console.log('🔎 Checking existing buckets...');
  
  try {
    // Try to list existing buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Error listing buckets:', error);
      console.log('👉 You may need to:');
      console.log('   1. Make sure your Supabase anon key is correct');
      console.log('   2. Create buckets manually in the Supabase dashboard');
      console.log('   3. Ensure your RLS policies allow bucket listing');
      return;
    }
    
    // Get existing bucket names
    const existingBucketNames = buckets.map(bucket => bucket.name);
    console.log('📋 Existing buckets:', existingBucketNames.length ? existingBucketNames.join(', ') : 'none');
    
    // Check missing buckets
    const missingBuckets = REQUIRED_BUCKETS.filter(bucket => !existingBucketNames.includes(bucket));
    
    if (missingBuckets.length > 0) {
      console.log(`❗ Missing buckets: ${missingBuckets.join(', ')}`);
      console.log('👉 Please create these buckets manually in the Supabase dashboard:');
      console.log('   1. Go to https://app.supabase.com/project/_/storage/buckets');
      console.log('   2. Click "New Bucket"');
      console.log('   3. Enter the bucket name');
      console.log('   4. Set public access to "true" if files should be publicly accessible');
      console.log('   5. Repeat for all missing buckets');
    } else {
      console.log('✅ All required buckets exist');
    }
  } catch (error) {
    console.error('❌ Failed to check buckets:', error);
  }
}

// Run the script
createBuckets(); 