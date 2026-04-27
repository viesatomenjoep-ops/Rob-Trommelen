'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/cms-login?error=${encodeURIComponent(error.message)}`)
  }

  // Send email notification (non-blocking)
  fetch('https://formsubmit.co/ajax/tomvanbiene@gmail.com', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://www.equivestworldwide.com',
      'Referer': 'https://www.equivestworldwide.com/'
    },
    body: JSON.stringify({
      _subject: '⚠️ Beveiligingsmelding: Iemand is ingelogd op Equivest',
      _template: 'basic',
      message: `Er is zojuist succesvol ingelogd op het Equivest CMS.\n\nAccount: ${data.email}\nTijdstip: ${new Date().toLocaleString('nl-NL')}\n\nAls jij dit niet was, controleer dan direct je wachtwoorden.`
    })
  }).catch(err => console.error("Email notification failed:", err))

  // Send WhatsApp notification (non-blocking)
  const waText = encodeURIComponent(`🚨 *Equivest Login* 🚨\nEr is zojuist ingelogd op het CMS!\nEmail: ${data.email}\nTijd: ${new Date().toLocaleTimeString('nl-NL')}`);
  fetch(`https://api.callmebot.com/whatsapp.php?phone=31651641886&text=${waText}&apikey=6121648&t=${Date.now()}`, { cache: 'no-store' })
    .catch(err => console.error("WhatsApp notification failed:", err));

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function investorLogin(formData: FormData) {
  const rawUsername = formData.get('username') as string
  const password = formData.get('password') as string
  
  // Clean up username for comparison
  const cleanUsername = rawUsername.toLowerCase().replace(/\s+/g, '')

  if (cleanUsername === 'equivest11' && password === '1111') {
    const cookieStore = await cookies()
    cookieStore.set('investor_auth', 'true', { maxAge: 60 * 60 * 24 * 7 }) // 1 week
    revalidatePath('/', 'layout')
    redirect('/properties')
  }

  redirect(`/investor-login?error=${encodeURIComponent("Invalid username or password.")}`)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  const cookieStore = await cookies()
  cookieStore.delete('investor_auth')
  revalidatePath('/', 'layout')
  redirect('/')
}
