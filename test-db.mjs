import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://raxitqtoqqsmrbdzvhwr.supabase.co';
const supabaseAnonKey = 'sb_publishable_J02PVYiRzqfxhe6cSbOlPA_K-_djD_L';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Fetching articles...");
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
  } else {
    console.log("Success! Found", data.length, "articles.");
  }
}

test();
