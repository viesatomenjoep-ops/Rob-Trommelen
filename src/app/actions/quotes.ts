'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import nodemailer from 'nodemailer'

export async function getQuotes() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false })
  
  if (error) {
    console.error("Quotes fetch error:", error.message)
    return []
  }
  return data || []
}

export async function getQuoteWithItems(id: string) {
  const supabase = await createClient()
  const { data: quote, error: quoteError } = await supabase.from('quotes').select('*').eq('id', id).single()
  const { data: items, error: itemsError } = await supabase.from('quote_items').select('*').eq('quote_id', id)

  if (quoteError || itemsError) {
    console.error("Quote fetch error:", quoteError?.message || itemsError?.message)
    return null
  }

  return { quote, items: items || [] }
}

export async function createQuote(formData: FormData) {
  const supabase = await createClient()
  
  // Parse items from formData
  const itemsJson = formData.get('items') as string
  const items = JSON.parse(itemsJson)

  // Calculate totals
  const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.price)), 0)
  const taxRate = Number(formData.get('taxRate')) || 21
  const taxAmount = (subtotal * taxRate) / 100
  const totalAmount = subtotal + taxAmount

  const quoteData = {
    quote_number: formData.get('quoteNumber') as string,
    type: (formData.get('type') as string) || 'quote',
    client_name: formData.get('clientName') as string,
    client_email: formData.get('clientEmail') as string,
    client_address: formData.get('clientAddress') as string,
    client_company: formData.get('clientCompany') as string,
    subtotal: subtotal,
    tax_rate: taxRate,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    notes: formData.get('notes') as string,
    status: 'draft',
    date: new Date().toISOString()
  }

  const { data: quote, error: quoteError } = await supabase.from('quotes').insert([quoteData]).select().single()

  if (quoteError) {
    console.error("Error creating quote:", quoteError)
    throw new Error(quoteError.message)
  }

  // Insert items
  const quoteItems = items.map((item: any) => ({
    quote_id: quote.id,
    description: item.description,
    quantity: Number(item.quantity),
    unit_price: Number(item.price),
    total: Number(item.quantity) * Number(item.price)
  }))

  const { error: itemsError } = await supabase.from('quote_items').insert(quoteItems)

  if (itemsError) {
    console.error("Error creating quote items:", itemsError)
    throw new Error(itemsError.message)
  }

  revalidatePath('/admin/quotes')
  return quote.id
}

export async function sendQuoteEmail(quoteId: string, emailPass: string) {
  const data = await getQuoteWithItems(quoteId)
  if (!data) throw new Error("Quote not found")

  const { quote, items } = data

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tomjo118735@gmail.com',
      pass: emailPass
    }
  })

  const typeLabel = quote.type === 'order' ? 'Order' : 'Offerte'

  // Create simple HTML email invoice
  const htmlContent = `
    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #111;">
      <h1 style="color: #08704D; text-align: center;">Equivest</h1>
      <h2 style="text-align: center;">${typeLabel}: ${quote.quote_number}</h2>
      
      <p>Beste ${quote.client_name},</p>
      <p>Hierbij ontvangt u uw ${typeLabel.toLowerCase()} overzicht.</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #08704D; color: white;">
          <th style="padding: 10px; text-align: left;">Omschrijving</th>
          <th style="padding: 10px; text-align: center;">Aantal</th>
          <th style="padding: 10px; text-align: right;">Prijs per stuk</th>
          <th style="padding: 10px; text-align: right;">Totaal</th>
        </tr>
        ${items.map((item: any) => `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">${item.description}</td>
            <td style="padding: 10px; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right;">€${item.unit_price.toFixed(2)}</td>
            <td style="padding: 10px; text-align: right;">€${item.total.toFixed(2)}</td>
          </tr>
        `).join('')}
      </table>

      <div style="text-align: right; margin-top: 20px;">
        <p>Subtotaal: €${quote.subtotal.toFixed(2)}</p>
        <p>BTW (${quote.tax_rate}%): €${quote.tax_amount.toFixed(2)}</p>
        <h3 style="color: #08704D;">Totaal: €${quote.total_amount.toFixed(2)}</h3>
      </div>

      ${quote.notes ? `<p style="margin-top: 30px; font-style: italic;">Opmerkingen: ${quote.notes}</p>` : ''}

      <p style="margin-top: 40px; font-size: 12px; color: #666; text-align: center;">
        Equivest Worldwide - Since 1995
      </p>
    </div>
  `

  await transporter.sendMail({
    from: '"Equivest Worldwide" <tomjo118735@gmail.com>',
    to: quote.client_email,
    subject: `Equivest ${typeLabel} - ${quote.quote_number}`,
    html: htmlContent
  })

  // Update status
  const supabase = await createClient()
  await supabase.from('quotes').update({ status: 'sent' }).eq('id', quoteId)
  revalidatePath('/admin/quotes')
}

export async function updateQuote(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const itemsJson = formData.get('items') as string
  const items = JSON.parse(itemsJson)

  const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.price)), 0)
  const taxRate = Number(formData.get('taxRate')) || 21
  const taxAmount = (subtotal * taxRate) / 100
  const totalAmount = subtotal + taxAmount

  const quoteData = {
    quote_number: formData.get('quoteNumber') as string,
    client_name: formData.get('clientName') as string,
    client_email: formData.get('clientEmail') as string,
    client_address: formData.get('clientAddress') as string,
    client_company: formData.get('clientCompany') as string,
    subtotal: subtotal,
    tax_rate: taxRate,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    notes: formData.get('notes') as string,
  }

  const { error: quoteError } = await supabase.from('quotes').update(quoteData).eq('id', id)
  if (quoteError) throw new Error(quoteError.message)

  // Re-create items: delete old, insert new
  await supabase.from('quote_items').delete().eq('quote_id', id)

  const quoteItems = items.map((item: any) => ({
    quote_id: id,
    description: item.description,
    quantity: Number(item.quantity),
    unit_price: Number(item.price),
    total: Number(item.quantity) * Number(item.price)
  }))

  const { error: itemsError } = await supabase.from('quote_items').insert(quoteItems)
  if (itemsError) throw new Error(itemsError.message)

  revalidatePath('/admin/quotes')
  revalidatePath(`/admin/quotes/${id}`)
  return id
}
