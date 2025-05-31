/**
 * This file previously contained Supabase bucket setup,
 * but has been replaced with base64 utilities.
 * The constants are kept for backward compatibility.
 */

// Dummy function for backward compatibility
export const ensureStorageBuckets = async (): Promise<void> => {
  console.log('Storage buckets are deprecated, using base64 encoding instead');
  return;
};

// Export bucket names as constants (still used in legacy code references)
export const BUCKET_CAMPAIGN_IMAGES = 'campaign-images';
export const BUCKET_CAMPAIGN_DOCUMENTS = 'campaign-documents'; 