import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LinkedInClient from './LinkedInClient'

export default async function LinkedInPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/cms-login')
  }

  // Get active investment properties for the campaign
  const { data: properties } = await supabase
    .from('properties')
    .select('id, name, description, estimated_roi, category')
    .eq('status', 'Available')

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-6">LinkedIn Outreach</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
        Generate highly personalized connection messages for potential investors. 
        Select a property from your portfolio, enter the lead's details, and generate a message to send safely via your own LinkedIn account.
      </p>

      <LinkedInClient properties={properties || []} />
    </div>
  )
}
