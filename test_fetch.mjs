import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { data: list, error: listError } = await supabase.from('horses').select('id').limit(1)
  console.log("List:", list, listError)
  if (list && list.length > 0) {
    const id = list[0].id
    console.log("Fetching id:", id)
    const { data: horse, error } = await supabase
      .from('horses')
      .select('*, horse_media(*), horse_results(*)')
      .eq('id', id)
      .single()
    console.log("Horse:", horse ? 'Found' : 'Null', "Error:", error)
    if (error) {
      console.log("Fallback...")
      const fallback = await supabase.from('horses').select('*').eq('id', id).single()
      console.log("Fallback:", fallback)
    }
  }
}
test()
