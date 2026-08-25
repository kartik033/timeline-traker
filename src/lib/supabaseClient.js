import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_API_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing API env vars. Check that .env.local has VITE_API_URL and VITE_API_KEY set, and restart the dev server after editing .env.local.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
