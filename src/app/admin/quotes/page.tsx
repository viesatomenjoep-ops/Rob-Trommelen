import { getQuotes } from '@/app/actions/quotes'
import Link from 'next/link'
import { Plus, FileText, Send, CheckCircle, LayoutDashboard, Table as TableIcon } from 'lucide-react'
import QuotesKanbanBoard from '@/components/admin/QuotesKanbanBoard'
import QuotesTableClient from '@/components/admin/QuotesTableClient'

export default async function QuotesPage(props: { searchParams?: Promise<{ view?: string }> }) {
  const searchParams = props.searchParams ? await props.searchParams : {}
  const view = searchParams.view || 'kanban'
  const quotes = await getQuotes()

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary dark:text-white">Quotes & Orders</h1>
          <p className="text-gray-500 mt-1">Manage your quotes and send them directly to clients.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-gray-800 p-1 rounded-md border border-gray-200 dark:border-gray-700 flex items-center mr-2 shadow-sm">
            <Link href="?view=kanban" className={`p-1.5 rounded ${view === 'kanban' ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
              <LayoutDashboard size={18} />
            </Link>
            <Link href="?view=table" className={`p-1.5 rounded ${view === 'table' ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
              <TableIcon size={18} />
            </Link>
          </div>
          <Link 
            href="/admin/quotes/new?type=quote" 
            className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors font-medium"
          >
            <FileText size={20} className="mr-2" />
            New Quote
          </Link>
          <Link 
            href="/admin/quotes/new?type=order" 
            className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-medium"
          >
            <Plus size={20} className="mr-2" />
            New Order
          </Link>
        </div>
      </div>

      {view === 'kanban' ? (
        <QuotesKanbanBoard initialQuotes={quotes} />
      ) : (
        <QuotesTableClient quotes={quotes} />
      )}
    </div>
  )
}
