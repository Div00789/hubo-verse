import { createClient } from '@supabase/supabase-js';

export function createSupabaseServerClient(supabaseUrl: string, serviceRoleKey: string) {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createSupabaseBrowserClient(supabaseUrl: string, anonKey: string) {
  return createClient(supabaseUrl, anonKey);
}

export * from './mock-data';
