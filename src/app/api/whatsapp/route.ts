import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    // Parse URL-encoded body from Twilio
    const bodyText = await req.text()
    const params = new URLSearchParams(bodyText)
    
    const from = params.get('From') // e.g., "whatsapp:+31612345678"
    const body = params.get('Body') || '' // The actual text message

    // Security check: Only allow authorized admins to use this webhook
    // In a real scenario, you could check the phone number against an allowed list
    const allowedNumbers = ['whatsapp:+31612345678', 'whatsapp:+31651641886']
    
    // We will process the message anyway for this demo, 
    // but in production, uncomment the block below:
    /*
    if (!from || !allowedNumbers.includes(from)) {
      return new NextResponse(
        '<Response><Message>Onbevoegde toegang. Dit nummer is niet geautoriseerd.</Message></Response>', 
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }
    */

    const message = body.trim()
    let responseText = "Ik begrijp dat commando niet. Probeer bijvoorbeeld: 'Voorraad: Supplementen, 10'"

    // Create admin Supabase client using Service Role key since this is an API route without user session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Check if message is an inventory command
    // Expected format: "Voorraad: [Naam van item], [Aantal]"
    // Example: "Voorraad: Zadeldekjes, 5" of "Voorraad: Paardenvoer, -2"
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('voorraad') || lowerMessage.includes('inventory')) {
      // Split by colon or just assume the first part is the command
      const commandParts = message.split(/:|-/)
      if (commandParts.length > 1) {
        const payload = commandParts[1].trim()
        const parts = payload.split(',')
        
        if (parts.length >= 2) {
          const itemName = parts[0].trim()
          const changeAmount = parseInt(parts[1].trim())

          if (!isNaN(changeAmount)) {
            // Find the item in the database
            const { data: items, error: fetchError } = await supabase
              .from('inventory_items')
              .select('*')
              .ilike('name', `%${itemName}%`) // case-insensitive search
              .limit(1)

            if (fetchError || !items || items.length === 0) {
              responseText = `Kan het artikel "${itemName}" niet vinden in het voorraadsysteem.`
            } else {
              const item = items[0]
              const newQuantity = Number(item.quantity) + changeAmount
              
              // Update the stock
              const { error: updateError } = await supabase
                .from('inventory_items')
                .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
                .eq('id', item.id)

              if (updateError) {
                responseText = `Er ging iets mis bij het updaten van ${item.name}: ${updateError.message}`
              } else {
                // Log the change
                await supabase.from('inventory_logs').insert([{
                  item_id: item.id,
                  employee_name: 'WhatsApp Bot',
                  change_amount: changeAmount,
                  reason: 'Aangepast via WhatsApp'
                }])

                responseText = `✅ Succes! Voorraad van *${item.name}* is aangepast met ${changeAmount}.\nNieuwe totaal: ${newQuantity} ${item.unit}.`
              }
            }
          } else {
            responseText = "Fout: Het aantal moet een geldig nummer zijn (bijv. 5 of -2)."
          }
        } else {
          responseText = "Onjuist formaat. Gebruik: 'Voorraad: [Naam], [Aantal]'\nBijv: 'Voorraad: Voer, 10'"
        }
      }
    }

    // Return TwiML (Twilio XML response)
    const twiml = `
      <Response>
        <Message>${responseText}</Message>
      </Response>
    `

    return new NextResponse(twiml, {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
    
  } catch (error: any) {
    console.error('WhatsApp Webhook Error:', error)
    return new NextResponse(
      '<Response><Message>Er is een serverfout opgetreden.</Message></Response>',
      { headers: { 'Content-Type': 'text/xml' } }
    )
  }
}
