import { getPageContent } from '@/app/actions/pages'
import PageBuilderClient from '@/components/admin/PageBuilderClient'

export const dynamic = 'force-dynamic'

export default async function AdminAboutPage() {
  let data = await getPageContent('about')

  if (!data) {
    data = {
      title: 'Legacy of Excellence',
      hero_image: '/wellington_showjumper.png',
      content_blocks: []
    }
  }

  return <PageBuilderClient initialData={data} pageSlug="about" pageTitle="About & Team" />
}
