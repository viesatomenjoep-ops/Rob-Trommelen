'use server'

import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import { revalidatePath } from 'next/cache'

export async function getProperties() {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function getPublicProperties() {
  const supabase = createPublicClient()
  // Just return all properties for the real estate prototype
  const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function getProperty(id: string) {
  const supabase = await createClient() // Use server client so it has auth state
  
  try {
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .limit(1)
    
    if (error) {
       return null
    }

    if (!property || property.length === 0) return null
    return property[0]
  } catch (err) {
    console.error("Fatal error in getProperty:", err)
    return null
  }
}

export async function createProperty(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to create a property.' }
  }
  
  const rawData = {
    title: formData.get('title') as string,
    street_address: formData.get('street_address') as string,
    postal_code: formData.get('postal_code') as string,
    city: formData.get('city') as string,
    country: formData.get('country') as string || 'Nederland',
    price: parseFloat(formData.get('price') as string),
    price_condition: formData.get('price_condition') as string || 'k.k.',
    type: formData.get('type') as string,
    status: formData.get('status') as string || 'Beschikbaar',
    description: formData.get('description') as string,
    cover_image_url: formData.get('cover_image_url') as string || null,
    doc_brochure: formData.get('doc_brochure') as string || null,
    doc_floorplan: formData.get('doc_floorplan') as string || null,
    link_funda: formData.get('link_funda') as string || null,
    link_video: formData.get('link_video') as string || null,
  }

  const { data, error } = await supabase.from('properties').insert([rawData]).select().single()
  
  if (error) {
    console.error("Supabase insert error details:", error)
    return { error: `Database error: ${error.message} (Code: ${error.code})` }
  }
  
  revalidatePath('/admin/properties')
  revalidatePath('/properties')
  
  return { success: true, data }
}

export async function updatePropertyStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('properties').update({ status }).eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/properties')
  revalidatePath(`/properties/${id}`)
  return { success: true }
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to update a property.' }
  
  const rawData: any = {
    title: formData.get('title') as string,
    street_address: formData.get('street_address') as string,
    postal_code: formData.get('postal_code') as string,
    city: formData.get('city') as string,
    country: formData.get('country') as string || 'Nederland',
    price: parseFloat(formData.get('price') as string),
    price_condition: formData.get('price_condition') as string || 'k.k.',
    type: formData.get('type') as string,
    status: formData.get('status') as string || 'Beschikbaar',
    description: formData.get('description') as string,
    doc_brochure: formData.get('doc_brochure') as string || null,
    doc_floorplan: formData.get('doc_floorplan') as string || null,
    link_funda: formData.get('link_funda') as string || null,
    link_video: formData.get('link_video') as string || null,
  }

  const coverImageUrl = formData.get('cover_image_url') as string
  if (coverImageUrl) {
    rawData.cover_image_url = coverImageUrl
  }

  const { data, error } = await supabase.from('properties').update(rawData).eq('id', id).select().single()
  
  if (error) return { error: error.message || 'Unknown database error' }
  
  revalidatePath('/admin/properties')
  revalidatePath('/properties')
  revalidatePath(`/properties/${id}`)
  
  return { success: true, data }
}

export async function deleteProperty(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to delete a property.' }
  
  const { error } = await supabase.from('properties').delete().eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/properties')
  revalidatePath('/properties')
  
  return { success: true }
}

export async function updatePropertyOrder(propertyIds: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const now = new Date().getTime()

  for (let i = 0; i < propertyIds.length; i++) {
    const newDate = new Date(now - i * 1000).toISOString()
    await supabase.from('properties').update({ created_at: newDate }).eq('id', propertyIds[i])
  }

  revalidatePath('/admin/properties')
  revalidatePath('/properties')
  
  return { success: true }
}
