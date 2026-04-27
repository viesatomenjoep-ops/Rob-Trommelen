'use server'

import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import { revalidatePath } from 'next/cache'

export async function getNewsArticles() {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('news').select('*').order('published_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function getNewsArticle(id: string) {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('news').select('*').eq('id', id).single()
  
  if (error) throw new Error(error.message)
  return data
}

export async function createNewsArticle(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to create news.' }
  
  const rawData = {
    title: formData.get('title') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    image_url: formData.get('image_url') as string || null,
  }

  const { data, error } = await supabase.from('news').insert([rawData]).select().single()
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/news')
  revalidatePath('/news')
  
  return { success: true, data }
}

export async function updateNewsArticle(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to update news.' }
  
  const rawData: any = {
    title: formData.get('title') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
  }

  const imageUrl = formData.get('image_url') as string
  if (imageUrl) {
    rawData.image_url = imageUrl
  }

  const { data, error } = await supabase.from('news').update(rawData).eq('id', id).select().single()
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath(`/news/${id}`)
  
  return { success: true, data }
}

export async function deleteNewsArticle(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to delete news.' }
  
  const { error } = await supabase.from('news').delete().eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/news')
  revalidatePath('/news')
  
  return { success: true }
}
