// lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js';
// Supabase URL and service role key (for server-side operations)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create and export a Supabase client with service role key
export function supabaseServerClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}