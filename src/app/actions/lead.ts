'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLead(formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    client_name: formData.get('client_name') as string,
    email: formData.get('email') as string,
    phone_number: formData.get('phone_number') as string || null,
    message: formData.get('message') as string,
    property_id: formData.get('property_id') ? formData.get('property_id') as string : null,
  }

  const { data, error } = await supabase.from('leads').insert([rawData]).select().single()
  
  if (error) {
    return { error: error.message || 'Failed to submit inquiry' }
  }
  
  revalidatePath('/admin/leads')
  return { success: true, data }
}

export async function getLeads() {
  const supabase = await createClient()
  
  // Using a left join with properties to get the property name if available
  const { data, error } = await supabase
    .from('leads')
    .select('*, properties(name)')
    .order('created_at', { ascending: false })
    
  if (error) throw new Error(error.message)
  return data
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').update({ status }).eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/leads')
  return { success: true }
}
