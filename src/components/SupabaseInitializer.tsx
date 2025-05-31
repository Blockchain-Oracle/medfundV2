import { useEffect, useState } from 'react';
import { ensureStorageBuckets } from '@/integrations/supabase/createBuckets';

/**
 * Component that initializes Supabase storage buckets when the app starts
 * This is a "silent" component that doesn't render anything visible
 */
export function SupabaseInitializer() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        console.log('Initializing Supabase storage buckets...');
        await ensureStorageBuckets();
        console.log('Supabase storage buckets initialized successfully');
        setInitialized(true);
      } catch (err) {
        console.error('Failed to initialize Supabase storage:', err);
        setError(err as Error);
      }
    };
    
    initializeSupabase();
  }, []);
  
  // This component doesn't render anything visible
  return null;
} 