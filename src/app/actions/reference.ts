'use server'

import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import { revalidatePath } from 'next/cache'

export async function getReferences() {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('instagram_references')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching references:", error)
    return []
  }
  return data
}

export async function addReference(formData: FormData) {
  const supabase = await createClient()
  const url = formData.get('url') as string
  const property_name = formData.get('property_name') as string

  if (!url) return { error: 'Instagram URL is required' }

  // Basic validation to ensure it's an instagram URL
  if (!url.includes('instagram.com/')) {
    return { error: 'Must be a valid Instagram URL' }
  }

  // Clean URL to base post URL
  let cleanUrl = url.split('?')[0]
  if (!cleanUrl.endsWith('/')) {
    cleanUrl += '/'
  }

  const { error } = await supabase.from('instagram_references').insert([{ 
    url: cleanUrl, 
    property_name: property_name || null 
  }])

  if (error) return { error: error.message }

  revalidatePath('/admin/references')
  revalidatePath('/references')
  return { success: true }
}

export async function deleteReference(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('instagram_references').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/references')
  revalidatePath('/references')
  return { success: true }
}

export async function updateReference(id: string, formData: FormData) {
  const supabase = await createClient()
  const url = formData.get('url') as string
  const property_name = formData.get('property_name') as string

  if (!url) return { error: 'Instagram URL is required' }
  if (!url.includes('instagram.com/')) return { error: 'Must be a valid Instagram URL' }

  let cleanUrl = url.split('?')[0]
  if (!cleanUrl.endsWith('/')) {
    cleanUrl += '/'
  }

  const { error } = await supabase.from('instagram_references').update({
    url: cleanUrl,
    property_name: property_name || null
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/references')
  revalidatePath('/references')
  return { success: true }
}
