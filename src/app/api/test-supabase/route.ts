import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.from('site_pages').select('*')
  
  return NextResponse.json({
    data: data,
    error: error
  })
}
