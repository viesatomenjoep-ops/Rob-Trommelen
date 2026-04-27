'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function scrapeProductUrl(url: string) {
  try {
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    })
    
    if (!res.ok) throw new Error('Kon website niet bereiken')
    
    const html = await res.text()

    const getMeta = (property: string) => {
      const match = html.match(new RegExp(`<meta\\s+(?:property|name)=["']${property}["']\\s+content=["'](.*?)["']`, 'i'))
      return match ? match[1] : null
    }

    const title = getMeta('og:title') || getMeta('twitter:title') || html.match(/<title>(.*?)<\/title>/i)?.[1] || 'Nieuw Product'
    const image = getMeta('og:image') || getMeta('twitter:image') || null
    const description = getMeta('og:description') || getMeta('twitter:description') || getMeta('description') || ''
    
    let price = getMeta('product:price:amount') || getMeta('og:price:amount') || '0.00'
    
    if (price === '0.00') {
      const priceMatch = html.match(/(?:€|EUR)\s?([0-9]+[.,][0-9]{2})/)
      if (priceMatch) price = priceMatch[1].replace(',', '.')
    }

    // Decode HTML entities in title
    const cleanTitle = title.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    const cleanDescription = description.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')

    return { success: true, title: cleanTitle, image, price: parseFloat(price), description: cleanDescription }
  } catch (error: any) {
    return { success: false, error: 'Kan URL niet uitlezen. Probeer het handmatig.' }
  }
}

export async function importInventoryItem(data: { name: string, price: number, category: string, quantity: number }) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('inventory_items').insert([{
    name: data.name,
    category: data.category,
    quantity: data.quantity,
    unit: 'stuks',
    purchase_price: data.price, // Webshop price is probably purchase price for us
    selling_price: data.price * 1.21, // Suggestion
    low_stock_threshold: 5
  }])

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/inventory')
  return { success: true }
}
