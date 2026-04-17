"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/integrations/supabase/types";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time or if env vars are missing, return a dummy client
    // to prevent @supabase/ssr from throwing a fatal error.
    return createBrowserClient<Database>(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
