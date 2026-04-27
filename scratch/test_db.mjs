import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  const { data, error } = await supabase.from('horses').select('*').limit(1)
  console.log(data)
  
  if (data && data.length > 0) {
    const id = data[0].id
    console.log("Fetching detail for:", id)
    const detail = await fetch(`https://equivest-platform.vercel.app/horses/${id}`)
    console.log("Status:", detail.status)
    const text = await detail.text()
    if (detail.status === 500) {
       console.log("Error html:", text.substring(0, 500))
    }
  }
}
run()
