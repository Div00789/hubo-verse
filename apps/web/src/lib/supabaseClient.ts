import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nuqzdunyntkzstpuebuf.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Hmctqyg9ba_0IIzuIqIzsw_fo7o_DNg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export async function checkSupabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return { connected: false, error: error.message };
    }
    return { connected: true };
  } catch (err: any) {
    return { connected: false, error: err?.message || 'Network error' };
  }
}
