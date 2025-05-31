import { supabase } from './client';

/**
 * Creates Supabase storage buckets if they don't already exist
 * @returns Promise that resolves when buckets are created or already exist
 */
export const ensureStorageBuckets = async (): Promise<void> => {
  const requiredBuckets = ['campaign-images', 'campaign-documents'];
  
  try {
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      throw error;
    }
    
    // Get existing bucket names
    const existingBucketNames = buckets.map(bucket => bucket.name);
    
    // Check missing buckets
    const missingBuckets = requiredBuckets.filter(bucket => !existingBucketNames.includes(bucket));
    
    if (missingBuckets.length > 0) {
      console.error(`Missing buckets: ${missingBuckets.join(', ')}`);
      console.log('Please create these buckets manually in the Supabase dashboard');
    } else {
      console.log('All required storage buckets are available');
    }
  } catch (error) {
    console.error('Failed to ensure storage buckets:', error);
    throw error;
  }
};

// Export bucket names as constants
export const BUCKET_CAMPAIGN_IMAGES = 'campaign-images';
export const BUCKET_CAMPAIGN_DOCUMENTS = 'campaign-documents'; 