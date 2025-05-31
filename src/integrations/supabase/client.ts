/**
 * This file previously created a Supabase client for storage operations.
 * Since we've switched to base64 encoding for file storage, this now
 * provides a mock client for backward compatibility.
 */

// Mock Supabase client that logs operations instead of performing them
export const supabase = {
  storage: {
    // Mock storage methods
    listBuckets: async () => {
      console.log('Supabase storage.listBuckets called, but using base64 storage now');
      return { data: [], error: null };
    },
    from: (bucket: string) => ({
      // Mock upload method
      upload: async (path: string, file: File) => {
        console.log(`Supabase storage.from(${bucket}).upload called, but using base64 storage now`);
        return { data: { path }, error: null };
      },
      // Mock public URL method
      getPublicUrl: (path: string) => {
        console.log(`Supabase storage.from(${bucket}).getPublicUrl called, but using base64 storage now`);
        return { data: { publicUrl: path } };
      },
      // Mock remove method
      remove: async (paths: string[]) => {
        console.log(`Supabase storage.from(${bucket}).remove called, but using base64 storage now`);
        return { data: {}, error: null };
      }
    })
  }
};