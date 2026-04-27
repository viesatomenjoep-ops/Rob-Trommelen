'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateQuoteStatus(id: string, newStatus: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('quotes').update({ status: newStatus }).eq('id', id)
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath('/admin/quotes')
  return { success: true }
}
