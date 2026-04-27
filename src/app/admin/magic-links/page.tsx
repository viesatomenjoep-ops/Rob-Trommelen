import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MagicLinksClient from './MagicLinksClient'

export const metadata = {
  title: 'Magic Links & Tools | Equivest CMS',
}

export default async function MagicLinksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/cms-login')
  }

  // Get properties for the selectors
  const { data: properties } = await supabase
    .from('properties')
    .select('id, name, status, price_category, cover_image_url')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Magic Links & Automation Tools</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your centralized hub for internal automation (scanners/formatters) and external client links (VIP access, proposals).
        </p>
      </div>

      <MagicLinksClient properties={properties || []} />
    </div>
  )
}
