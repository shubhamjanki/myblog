"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/integrations/supabase/types";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== "undefined") {
      console.error(
        "Supabase configuration is missing. Please check your environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }
    // Return a dummy client that satisfies the type system and prevents crashes
    // during build/SSR but won't work for actual requests.
    return createBrowserClient<Database>(
      "https://placeholder-project.supabase.co",
      "placeholder-anon-key"
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
