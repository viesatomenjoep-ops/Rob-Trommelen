import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const text = await request.text()
    const params = new URLSearchParams(text)
    
    // Twilio payload
    const body = params.get('Body')?.trim() || ''
    const from = params.get('From') || 'Unknown'
    
    console.log(`[TWILIO WEBHOOK] Ontvangen van ${from}: ${body}`)
    
    const supabase = await createClient()
    let responseText = "Onbekend commando. Typ 'HELP' voor een overzicht van alle commando's."

    const command = body.toUpperCase()

    // ---------------------------------------------------------------------------
    // COMMAND: HELP
    // ---------------------------------------------------------------------------
    if (command === 'HELP' || command === 'INFO') {
      responseText = `📱 *Equivest CMS Commando's*\n\n` +
        `🐴 *PAARD [Naam], [Jaar], [Geslacht], [Discipline], [Prijs]*\n` +
        `❌ *VERWIJDER PAARD [Naam]*\n` +
        `📅 *AFSPRAAK [Klant], [Datum], [Tijd], [Notitie]*\n` +
        `📢 *MEDEDELING [Tekst]*\n` +
        `✅ *VERLOF GOEDKEUREN [Naam]*\n` +
        `🚫 *VERLOF AFWIJZEN [Naam]*\n` +
        `📦 *VOORRAAD [Product], [Aantal]* (Vb: VOORRAAD Magnesium, +5)\n` +
        `📝 *ORDER [ID], [NieuweStatus]*`
    }
    
    // ---------------------------------------------------------------------------
    // COMMAND: PAARD (Toevoegen)
    // ---------------------------------------------------------------------------
    else if (command.startsWith('PAARD ')) {
      const dataStr = body.substring(6).trim()
      const parts = dataStr.split(/[,|]/).map(p => p.trim())
      
      if (parts.length >= 4) {
        const [name, birth_year_str, gender, discipline, price_category = 'Price on Request'] = parts
        const birth_year = parseInt(birth_year_str) || new Date().getFullYear()
        
        const { error } = await supabase.from('properties').insert({
          name,
          birth_year,
          gender,
          discipline,
          price_category,
          status: 'Available',
          description: 'Snel toegevoegd via Twilio (WhatsApp/SMS). Bewerk in CMS voor details.'
        })

        if (error) {
          responseText = `❌ Fout bij toevoegen paard: ${error.message}`
        } else {
          responseText = `✅ Paard '${name}' succesvol toegevoegd aan het CMS Portfolio!`
        }
      } else {
        responseText = `⚠️ Verkeerd formaat.\nGebruik: PAARD Naam, Jaar, Geslacht, Discipline, Prijs\nVoorbeeld: PAARD Max, 2018, Ruin, Dressuur`
      }
    }

    // ---------------------------------------------------------------------------
    // COMMAND: VERWIJDER PAARD
    // ---------------------------------------------------------------------------
    else if (command.startsWith('VERWIJDER PAARD ')) {
      const name = body.substring(16).trim()
      
      const { data, error: searchError } = await supabase.from('properties').select('id, name').ilike('name', name).limit(1).single()

      if (data) {
        const { error: deleteError } = await supabase.from('properties').delete().eq('id', data.id)
        if (deleteError) responseText = `❌ Fout bij verwijderen: ${deleteError.message}`
        else responseText = `✅ Paard '${data.name}' is definitief verwijderd uit het CMS.`
      } else {
        responseText = `⚠️ Kon geen paard vinden met de naam '${name}'.`
      }
    }

    // ---------------------------------------------------------------------------
    // COMMAND: AFSPRAAK (Inplannen rooster/agenda)
    // ---------------------------------------------------------------------------
    else if (command.startsWith('AFSPRAAK ')) {
      const dataStr = body.substring(9).trim()
      const parts = dataStr.split(/[,|]/).map(p => p.trim())
      
      if (parts.length >= 3) {
        const [client_name, appointment_date, appointment_time, ...notesParts] = parts
        const notes = notesParts.join(', ') || 'Ingepland via Twilio'
        
        const { error } = await supabase.from('appointments').insert({
          client_name, client_email: 'twilio@equivest.nl', appointment_date, appointment_time, notes, status: 'confirmed'
        })

        if (error) responseText = `❌ Fout bij inplannen: ${error.message}`
        else responseText = `✅ Agenda: Afspraak met '${client_name}' op ${appointment_date} om ${appointment_time} is succesvol ingepland!`
      } else {
        responseText = `⚠️ Verkeerd formaat.\nGebruik: AFSPRAAK KlantNaam, Datum (YYYY-MM-DD), Tijd (HH:MM), Notitie`
      }
    }

    // ---------------------------------------------------------------------------
    // COMMAND: MEDEDELING (Voor op het Staff Prikbord)
    // ---------------------------------------------------------------------------
    else if (command.startsWith('MEDEDELING ')) {
      const message = body.substring(11).trim()
      const { error } = await supabase.from('staff_announcements').insert({
        title: 'Nieuwe update via SMS/WhatsApp', message: message, type: 'info', author: 'Directie (via Twilio)'
      })
      if (error) responseText = `❌ Fout bij plaatsen mededeling: ${error.message}`
      else responseText = `✅ Mededeling is direct op het Staff Prikbord geplaatst!`
    }

    // ---------------------------------------------------------------------------
    // COMMAND: VERLOF GOEDKEUREN / AFWIJZEN
    // ---------------------------------------------------------------------------
    else if (command.startsWith('VERLOF ')) {
      const actionStr = command.substring(7).trim(); // "GOEDKEUREN Jan" of "AFWIJZEN Jan"
      const isApprove = actionStr.startsWith('GOEDKEUREN');
      const isReject = actionStr.startsWith('AFWIJZEN');
      
      if (isApprove || isReject) {
        const name = actionStr.substring(isApprove ? 10 : 8).trim();
        
        // Find employee ID
        const { data: empData } = await supabase.from('staff_employees').select('id, name').ilike('name', `%${name}%`).limit(1).single()
        
        if (empData) {
          // Find pending leave
          const { data: leaveData } = await supabase.from('staff_schedules').select('id').eq('employee_id', empData.id).eq('type', 'Verlof').eq('status', 'pending').limit(1).single()
          
          if (leaveData) {
            const newStatus = isApprove ? 'approved' : 'rejected'
            const { error } = await supabase.from('staff_schedules').update({ status: newStatus }).eq('id', leaveData.id)
            if (error) responseText = `❌ Fout bij verwerken: ${error.message}`
            else responseText = `✅ Verlof voor ${empData.name} is succesvol ${isApprove ? 'goedgekeurd' : 'afgewezen'}!`
          } else {
            responseText = `⚠️ Geen openstaand verlofverzoek gevonden voor ${empData.name}.`
          }
        } else {
          responseText = `⚠️ Kon geen medewerker vinden met de naam '${name}'.`
        }
      }
    }

    // ---------------------------------------------------------------------------
    // COMMAND: VOORRAAD BIJWERKEN
    // ---------------------------------------------------------------------------
    else if (command.startsWith('VOORRAAD ')) {
      const dataStr = body.substring(9).trim()
      const parts = dataStr.split(/[,|]/).map(p => p.trim())
      
      if (parts.length >= 2) {
        const itemName = parts[0];
        const changeAmount = Number(parts[1]);
        
        const { data: itemData } = await supabase.from('inventory_items').select('id, name, quantity').ilike('name', `%${itemName}%`).limit(1).single()
        
        if (itemData) {
          const newQty = Number(itemData.quantity) + changeAmount;
          await supabase.from('inventory_items').update({ quantity: newQty }).eq('id', itemData.id);
          await supabase.from('inventory_logs').insert({ item_id: itemData.id, employee_name: 'Twilio Admin', change_amount: changeAmount, reason: 'Via SMS/WhatsApp' });
          responseText = `✅ Voorraad van '${itemData.name}' is bijgewerkt! Nieuw aantal: ${newQty}`;
        } else {
          responseText = `⚠️ Product '${itemName}' niet gevonden in inventory.`;
        }
      } else {
        responseText = `⚠️ Verkeerd formaat. Gebruik: VOORRAAD ProductNaam, Aantal (Vb: VOORRAAD Magnesium, -2 of +5)`
      }
    }

    // ---------------------------------------------------------------------------
    // COMMAND: ORDER AANPASSEN
    // ---------------------------------------------------------------------------
    else if (command.startsWith('ORDER ')) {
      const dataStr = body.substring(6).trim()
      const parts = dataStr.split(/[,|]/).map(p => p.trim())
      
      if (parts.length >= 2) {
        const [orderId, newStatus] = parts;
        // Status can be: pending, sent, accepted, rejected, completed
        const { error } = await supabase.from('quotes').update({ status: newStatus.toLowerCase() }).eq('id', orderId);
        
        if (error) responseText = `❌ Fout: ${error.message}`
        else responseText = `✅ Order ${orderId} is succesvol geüpdatet naar status: ${newStatus}`;
      } else {
        responseText = `⚠️ Verkeerd formaat. Gebruik: ORDER OrderID, Status (Vb: ORDER 123-abc, accepted)`
      }
    }

    // Return the response to Twilio as XML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${responseText}</Message>
</Response>`

    return new NextResponse(twiml, {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
    
  } catch (error) {
    console.error('Twilio Webhook Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
