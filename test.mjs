import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('staff_schedules').select('*, employees(full_name)');
  console.log("Fetch with employees():", { data, error });

  const { data: data2, error: error2 } = await supabase.from('staff_schedules').select('*');
  console.log("Fetch without join:", { data: data2, error: error2 });
}
check();
