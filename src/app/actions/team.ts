'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTeamMembers() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true })
  
  if (error) throw new Error(error.message)
  return data
}

export async function getTeamMember(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('team_members').select('*').eq('id', id).single()
  
  if (error) throw new Error(error.message)
  return data
}

export async function createTeamMember(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to create team members.' }
  
  const sortOrderStr = formData.get('sort_order') as string
  
  const rawData = {
    name: formData.get('name') as string,
    role: formData.get('role') as string,
    bio: formData.get('bio') as string,
    image_url: formData.get('image_url') as string || null,
    sort_order: sortOrderStr ? parseInt(sortOrderStr) : 0,
  }

  const { data, error } = await supabase.from('team_members').insert([rawData]).select().single()
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/team')
  revalidatePath('/about')
  
  return { success: true, data }
}

export async function updateTeamMember(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to update team members.' }
  
  const sortOrderStr = formData.get('sort_order') as string

  const rawData: any = {
    name: formData.get('name') as string,
    role: formData.get('role') as string,
    bio: formData.get('bio') as string,
    sort_order: sortOrderStr ? parseInt(sortOrderStr) : 0,
  }

  const imageUrl = formData.get('image_url') as string
  if (imageUrl) {
    rawData.image_url = imageUrl
  }

  const { data, error } = await supabase.from('team_members').update(rawData).eq('id', id).select().single()
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/team')
  revalidatePath('/about')
  revalidatePath(`/team/${id}`) // Just in case we ever have individual team pages
  
  return { success: true, data }
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to delete team members.' }
  
  const { error } = await supabase.from('team_members').delete().eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/team')
  revalidatePath('/about')
  
  return { success: true }
}
