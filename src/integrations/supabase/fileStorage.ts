import { supabase } from './client';
import { BUCKET_CAMPAIGN_DOCUMENTS, BUCKET_CAMPAIGN_IMAGES, ensureStorageBuckets } from './createBuckets';

// Try to ensure buckets exist on module initialization
ensureStorageBuckets().catch(error => {
  console.error('Failed to initialize storage buckets:', error);
});

/**
 * Check if a bucket exists
 * @param bucket The bucket name to check
 * @returns Promise resolving to true if the bucket exists, false otherwise
 */
export const checkBucketExists = async (bucket: string): Promise<boolean> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return false;
    }
    
    return buckets.some(b => b.name === bucket);
  } catch (error) {
    console.error('Error checking bucket existence:', error);
    return false;
  }
};

/**
 * Upload a file to Supabase storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param folder Optional folder path within the bucket
 * @returns Object with publicUrl and error (if any)
 */
export const uploadFile = async (
  file: File,
  bucket: string,
  folder: string = ''
): Promise<{ publicUrl: string | null; error: Error | null }> => {
  try {
    // Check if the bucket exists before uploading
    const bucketExists = await checkBucketExists(bucket);
    
    if (!bucketExists) {
      console.warn(`Bucket ${bucket} doesn't exist. Will attempt to use it anyway, which may fail.`);
      
      // We won't try to create it here because:
      // 1. We already tried during module initialization
      // 2. Regular users don't have permission to create buckets
    }
    
    // Create a unique file name to prevent collisions
    const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const filePath = folder ? `${folder}/${uniquePrefix}-${file.name}` : `${uniquePrefix}-${file.name}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return { publicUrl: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { publicUrl: null, error: error as Error };
  }
};

/**
 * Upload multiple files to Supabase storage
 * @param files Array of files to upload
 * @param bucket The storage bucket name
 * @param folder Optional folder path within the bucket
 * @returns Array of objects with publicUrl and error (if any)
 */
export const uploadMultipleFiles = async (
  files: File[],
  bucket: string,
  folder: string = ''
): Promise<{ publicUrls: string[]; errors: Error[] }> => {
  const results = await Promise.all(
    files.map(file => uploadFile(file, bucket, folder))
  );
  
  const publicUrls = results
    .filter(result => result.publicUrl !== null)
    .map(result => result.publicUrl as string);
  
  const errors = results
    .filter(result => result.error !== null)
    .map(result => result.error as Error);
  
  return { publicUrls, errors };
};

/**
 * Delete a file from Supabase storage
 * @param path Full path to the file including folder and filename
 * @param bucket The storage bucket name
 * @returns Success status and error (if any)
 */
export const deleteFile = async (
  path: string,
  bucket: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error as Error };
  }
}; 