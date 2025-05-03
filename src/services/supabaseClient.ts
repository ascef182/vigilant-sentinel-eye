
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for the entire app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set, otherwise use mock implementation
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are not set. Using mock implementation.');
}

// Create a client with fallback to prevent runtime errors
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : {
      // Mock implementation with empty methods that don't fail
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
        single: () => ({ data: null, error: null }),
        eq: () => ({ data: null, error: null }),
        gte: () => ({ data: null, error: null }),
        order: () => ({ data: [], error: null, limit: () => ({ data: [], error: null }) }),
        limit: () => ({ data: [], error: null }),
      }),
      channel: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => ({}),
      }),
      removeChannel: () => {},
      auth: {
        signUp: () => Promise.resolve({ data: null, error: null }),
        signIn: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: null, unsubscribe: () => {} }),
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    };
