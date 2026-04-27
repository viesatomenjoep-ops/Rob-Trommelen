import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function alterTable() {
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS hero_media_2 TEXT;' });
  console.log("RPC Error:", error);
  console.log("RPC Data:", data);
}

alterTable();
