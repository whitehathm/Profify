import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const sharedGlobal = globalThis as typeof globalThis & { __profifySupabaseClient?: SupabaseClient | null };

function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });
  } catch {
    return null;
  }
}

export const supabase = Object.prototype.hasOwnProperty.call(sharedGlobal, '__profifySupabaseClient')
  ? sharedGlobal.__profifySupabaseClient ?? null
  : createSupabaseClient();
sharedGlobal.__profifySupabaseClient = supabase;

export const supabaseAuthRedirectUrl = import.meta.env.VITE_SUPABASE_REDIRECT_URL?.trim() || '';
