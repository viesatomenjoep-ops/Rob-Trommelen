'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import nodemailer from 'nodemailer'

export async function getAppointments() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('appointments').select('*').order('appointment_date', { ascending: true }).order('appointment_time', { ascending: true })
  
  if (error) {
    console.error("Appointments fetch error:", error.message)
    return []
  }
  return data || []
}

export async function createAppointment(formData: FormData) {
  const supabase = await createClient()
  
  const appointmentData = {
    client_name: formData.get('clientName') as string,
    client_email: formData.get('clientEmail') as string,
    client_phone: formData.get('clientPhone') as string,
    appointment_date: formData.get('appointmentDate') as string,
    appointment_time: formData.get('appointmentTime') as string,
    notes: formData.get('notes') as string,
    status: 'pending'
  }

  // Insert into database
  const { data: appointment, error } = await supabase.from('appointments').insert([appointmentData]).select().single()

  if (error) {
    console.error("Error creating appointment:", error)
    throw new Error(error.message)
  }

  // Send email notification to admin
  try {
    const emailPass = process.env.EMAIL_APP_PASSWORD
    if (!emailPass) {
      console.warn("EMAIL_APP_PASSWORD not set. Booking saved but no email sent.")
      // We don't throw here so the user booking still succeeds
    } else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tomjo118735@gmail.com',
          pass: emailPass
        }
      })

      const htmlContent = `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #111;">
          <h2 style="color: #08704D;">Nieuwe Afspraak Aanvraag</h2>
          <p>Je hebt een nieuwe bezoekaanvraag via de website ontvangen!</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Naam:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${appointmentData.client_name}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>E-mail:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${appointmentData.client_email}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Telefoon:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${appointmentData.client_phone || '-'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Datum:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date(appointmentData.appointment_date).toLocaleDateString('nl-NL')}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Tijd:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${appointmentData.appointment_time}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Opmerkingen:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${appointmentData.notes || '-'}</td></tr>
          </table>

          <p style="margin-top: 20px;">Log in op het CMS om deze afspraak te bevestigen of beheren.</p>
        </div>
      `

      await transporter.sendMail({
        from: '"Equivest Website" <tomjo118735@gmail.com>',
        to: 'tomjo118735@gmail.com', // Sending to yourself
        subject: `Nieuw Bezoek Ingepland: ${appointmentData.client_name}`,
        html: htmlContent
      })
    }
  } catch (emailErr) {
    console.error("Failed to send booking email:", emailErr)
  }

  revalidatePath('/admin/appointments')
  return appointment.id
}

export async function updateAppointmentStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath('/admin/appointments')
}
