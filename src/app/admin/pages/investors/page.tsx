import { getPageContent } from '@/app/actions/pages'
import PageBuilderClient from '@/components/admin/PageBuilderClient'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminInvestorsPage() {
  let data = await getPageContent('investors')

  if (!data) {
    data = {
      title: 'Invest in Excellence',
      hero_image: '/about-bg.jpg',
      content_blocks: []
    }
  }

  return <PageBuilderClient initialData={data} pageSlug="investors" pageTitle="Investors" />
}
