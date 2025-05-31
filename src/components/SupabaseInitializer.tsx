import { useEffect, useState } from 'react';

/**
 * Component that previously initialized Supabase storage buckets
 * Now it's just a placeholder for backward compatibility
 * since we've switched to base64 encoding for file storage
 */
export function SupabaseInitializer() {
  const [initialized, setInitialized] = useState(true);
  
  useEffect(() => {
    console.log('Using base64 for file storage instead of Supabase buckets');
  }, []);
  
  // This component doesn't render anything visible
  return null;
} 