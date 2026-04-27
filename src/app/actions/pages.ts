'use server'

import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import { revalidatePath } from 'next/cache'

export async function getPageContent(slug: string) {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('site_pages').select('*').eq('slug', slug).single()
  
  if (error || !data) {
    console.error("Page fetch error:", error?.message)
    return null
  }
  return data
}

export async function updatePageContent(slug: string, updateData: any) {
  const supabase = await createClient()
  
  // Eerst kijken of we moeten updaten of inserten
  const { data: existing } = await supabase.from('site_pages').select('id').eq('slug', slug).single()
  
  let errorMsg = null;
  
  if (existing) {
    const { error } = await supabase.from('site_pages').update(updateData).eq('slug', slug)
    if (error) errorMsg = error.message
  } else {
    // Probeer in te voegen als hij nog niet bestaat
    const { error } = await supabase.from('site_pages').insert([{ slug, ...updateData }])
    if (error) errorMsg = error.message
  }
  
  if (errorMsg) {
    return { error: errorMsg }
  }
  
  revalidatePath(`/${slug}`)
  revalidatePath(`/admin/pages/${slug}`)
  return { success: true }
}
