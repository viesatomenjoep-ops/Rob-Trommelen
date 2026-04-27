import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { data: team, error } = await supabase.from('team').select('*')
  console.log("Team:", team, error)
  
  const { data: staff, error2 } = await supabase.from('staff').select('*')
  console.log("Staff:", staff, error2)
  
  const { data: pages, error3 } = await supabase.from('pages').select('*')
  console.log("Pages:", pages?.map(p => p.slug), error3)
}
test()
