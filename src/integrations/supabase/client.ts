// This file re-exports the SSR-compatible browser client as a lazy singleton.
// Deferring instantiation prevents browser-only code from running at module
// evaluation time, which caused ChunkLoadError on app/layout.
import { createClient } from "@/utils/supabase/client";
import type { Database } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: ReturnType<typeof createClient> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
    get(_target, prop) {
        if (!_client) {
            _client = createClient();
        }
        const value = (_client as any)[prop];
        return typeof value === "function" ? value.bind(_client) : value;
    },
});