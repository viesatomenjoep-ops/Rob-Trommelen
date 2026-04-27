'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getInventoryItems() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inventory_items').select('*').order('category', { ascending: true })
  if (error) {
    console.error("Inventory fetch error:", error.message)
    return []
  }
  return data || []
}

export async function getInventoryItem(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inventory_items').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function getInventoryLogs(itemId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inventory_logs').select('*').eq('item_id', itemId).order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function addInventoryItem(formData: FormData) {
  const supabase = await createClient()
  const data = {
    name: formData.get('name') as string,
    category: formData.get('category') as string,
    description: formData.get('description') as string,
    quantity: Number(formData.get('quantity')),
    unit: formData.get('unit') as string,
    low_stock_threshold: Number(formData.get('low_stock_threshold')),
    supplier: formData.get('supplier') as string,
    purchase_price: Number(formData.get('purchase_price') || 0),
    selling_price: Number(formData.get('selling_price') || 0),
  }

  const { error } = await supabase.from('inventory_items').insert([data])
  if (error) return { error: error.message }
  
  revalidatePath('/admin/inventory')
  return { success: true }
}

export async function updateInventoryStock(itemId: string, employeeName: string, changeAmount: number, reason: string) {
  const supabase = await createClient()
  
  // 1. Get current item to check stock levels
  const { data: item, error: itemError } = await supabase.from('inventory_items').select('*').eq('id', itemId).single()
  if (itemError) return { error: itemError.message }

  const newQuantity = Number(item.quantity) + changeAmount;

  // 2. Update the item quantity
  const { error: updateError } = await supabase.from('inventory_items').update({ quantity: newQuantity, updated_at: new Date().toISOString() }).eq('id', itemId)
  if (updateError) return { error: updateError.message }

  // 3. Insert the log
  const { error: logError } = await supabase.from('inventory_logs').insert([{
    item_id: itemId,
    employee_name: employeeName,
    change_amount: changeAmount,
    reason: reason
  }])
  if (logError) return { error: logError.message }

  // 4. Send low-stock warning via WhatsApp if needed
  if (newQuantity <= Number(item.low_stock_threshold) && changeAmount < 0) {
    const waText = encodeURIComponent(`🚨 *Voorraad Waarschuwing* 🚨\nHet artikel *${item.name}* is bijna op!\nEr is nog maar ${newQuantity} ${item.unit} over.\nMinimum vereist: ${item.low_stock_threshold}\n\nTijd om bij te bestellen bij: ${item.supplier || 'Onbekend'}`);
    fetch(`https://api.callmebot.com/whatsapp.php?phone=31651641886&text=${waText}&apikey=6121648&t=${Date.now()}`, { cache: 'no-store' }).catch(console.error);
  }

  revalidatePath('/admin/inventory')
  revalidatePath(`/admin/inventory/${itemId}`)
  return { success: true }
}

export async function deleteInventoryItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('inventory_items').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/inventory')
  return { success: true }
}
