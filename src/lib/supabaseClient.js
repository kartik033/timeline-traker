import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_API_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase env vars. Check that .env has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set, and restart the dev server after creating/editing .env.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
