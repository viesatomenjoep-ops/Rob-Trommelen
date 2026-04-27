'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPropertyResults(propertyId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('property_results')
    .select('*')
    .eq('property_id', propertyId)
    .order('date', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data || []
}

export async function addPropertyResult(formData: FormData) {
  const supabase = await createClient()
  const propertyId = formData.get('propertyId') as string
  
  const resultData = {
    property_id: propertyId,
    date: formData.get('date') as string,
    event_name: formData.get('eventName') as string,
    level: formData.get('level') as string,
    result: formData.get('result') as string,
    video_url: formData.get('videoUrl') as string || null,
  }

  const { error } = await supabase.from('property_results').insert([resultData])
  if (error) throw new Error(error.message)
    
  revalidatePath(`/admin/properties/${propertyId}/edit`)
  revalidatePath(`/properties/${propertyId}`)
}

export async function deletePropertyResult(id: string, propertyId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('property_results').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath(`/admin/properties/${propertyId}/edit`)
  revalidatePath(`/properties/${propertyId}`)
}
