'use server'

import { createClient } from '@/lib/supabase/server'

export async function getClientCRMInsights() {
  const supabase = await createClient()

  // Haal alle afspraken op
  const { data: appointments } = await supabase.from('appointments').select('*')
  
  // Haal alle offertes op
  const { data: quotes } = await supabase.from('quotes').select('*')

  // We bundelen alles op basis van email
  const clientsMap: Record<string, any> = {}

  if (appointments) {
    appointments.forEach(app => {
      const email = app.client_email?.toLowerCase() || 'onbekend@email.com'
      if (!clientsMap[email]) {
        clientsMap[email] = {
          name: app.client_name,
          email: email,
          appointmentCount: 0,
          quoteCount: 0,
          totalSpent: 0,
          lastActivity: new Date(app.created_at).getTime(),
          isHotLead: false,
          history: []
        }
      }
      clientsMap[email].appointmentCount++
      const actTime = new Date(app.created_at).getTime()
      if (actTime > clientsMap[email].lastActivity) clientsMap[email].lastActivity = actTime
      clientsMap[email].history.push({ type: 'Afspraak', date: app.appointment_date, info: app.notes })
    })
  }

  if (quotes) {
    quotes.forEach(quote => {
      const email = quote.client_email?.toLowerCase() || 'onbekend@email.com'
      if (!clientsMap[email]) {
        clientsMap[email] = {
          name: quote.client_name,
          email: email,
          appointmentCount: 0,
          quoteCount: 0,
          totalSpent: 0,
          lastActivity: new Date(quote.created_at).getTime(),
          isHotLead: false,
          history: []
        }
      }
      clientsMap[email].quoteCount++
      
      const actTime = new Date(quote.created_at).getTime()
      if (actTime > clientsMap[email].lastActivity) clientsMap[email].lastActivity = actTime

      if (quote.status === 'accepted' || quote.status === 'paid') {
        clientsMap[email].totalSpent += Number(quote.total_amount) || 0
      }

      clientsMap[email].history.push({ type: quote.type === 'order' ? 'Order' : 'Offerte', date: quote.date, info: `Status: ${quote.status}` })
    })
  }

  // Bepaal Hot Leads
  const clients = Object.values(clientsMap).map(client => {
    // Iemand is een Hot Lead als ze 1 of meer afspraken hebben gehad, 
    // en nog niet super veel hebben uitgegeven (minder dan 5000), 
    // of als ze meerdere quotes hebben in status 'draft' of 'sent'.
    
    // Simpele logica:
    if (client.appointmentCount > 0 && client.totalSpent === 0) {
      client.isHotLead = true
    } else if (client.quoteCount > 0 && client.totalSpent === 0) {
      client.isHotLead = true
    } else if (client.appointmentCount >= 2) {
      client.isHotLead = true
    }
    
    // Sorteer history op datum desc
    client.history.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return client
  })

  // Sort by Hot Leads first, then by lastActivity
  clients.sort((a, b) => {
    if (a.isHotLead && !b.isHotLead) return -1
    if (!a.isHotLead && b.isHotLead) return 1
    return b.lastActivity - a.lastActivity
  })

  return clients
}
