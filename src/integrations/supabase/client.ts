// This file now re-exports the SSR-compatible browser client
// All existing imports of `@/integrations/supabase/client` will continue to work
import { createClient } from "@/utils/supabase/client";
import type { Database } from "./types";

export const supabase = createClient();