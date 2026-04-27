import { getQuoteWithItems } from '@/app/actions/quotes'
import EditQuoteClient from './EditQuoteClient'

export default async function EditQuotePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const data = await getQuoteWithItems(params.id)
  
  if (!data) {
    return (
      <div className="p-6 text-center text-gray-500">
        Offerte niet gevonden.
      </div>
    )
  }

  return <EditQuoteClient initialData={data} quoteId={params.id} />
}
