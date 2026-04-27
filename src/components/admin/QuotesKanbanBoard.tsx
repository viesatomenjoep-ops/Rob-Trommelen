'use client'

import { useState } from 'react'
import { updateQuoteStatus } from '@/app/actions/kanban'
import Link from 'next/link'
import { FileText, GripVertical } from 'lucide-react'

const COLUMNS = [
  { id: 'draft', title: 'Draft', color: 'bg-gray-100 border-gray-200' },
  { id: 'sent', title: 'Sent', color: 'bg-blue-50 border-blue-200' },
  { id: 'accepted', title: 'Accepted', color: 'bg-emerald-50 border-emerald-200' },
  { id: 'paid', title: 'Paid', color: 'bg-green-100 border-green-300' }
]

export default function QuotesKanbanBoard({ initialQuotes }: { initialQuotes: any[] }) {
  const [quotes, setQuotes] = useState(initialQuotes)
  const [draggedQuoteId, setDraggedQuoteId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedQuoteId(id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, statusId: string) => {
    e.preventDefault()
    if (!draggedQuoteId) return

    const quote = quotes.find(q => q.id === draggedQuoteId)
    if (!quote || quote.status === statusId) return

    // Optimistic UI update
    const newQuotes = quotes.map(q => 
      q.id === draggedQuoteId ? { ...q, status: statusId } : q
    )
    setQuotes(newQuotes)

    // Server update
    try {
      await updateQuoteStatus(draggedQuoteId, statusId)
    } catch (err) {
      console.error(err)
      // Revert on error
      alert("Error updating status")
    }
    
    setDraggedQuoteId(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
      {COLUMNS.map(column => {
        const columnQuotes = quotes.filter(q => q.status === column.id)
        
        return (
          <div 
            key={column.id}
            className={`rounded-xl border ${column.color} p-4 min-h-[500px] transition-colors`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">{column.title}</h3>
              <span className="bg-white/50 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{columnQuotes.length}</span>
            </div>
            
            <div className="space-y-3">
              {columnQuotes.map(quote => (
                <div 
                  key={quote.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, quote.id)}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative group"
                >
                  <div className="absolute top-4 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={16} className="text-gray-300" />
                  </div>
                  <div className="flex justify-between items-start mb-2 pr-6">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${quote.type === 'order' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {quote.type === 'order' ? 'ORDER' : 'QUOTE'}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{quote.quote_number}</span>
                  </div>
                  <h4 className="font-bold text-gray-900">{quote.client_name}</h4>
                  <p className="text-xs text-gray-500 truncate mb-3">{quote.client_email}</p>
                  
                  <div className="flex justify-between items-end border-t border-gray-50 pt-3 mt-3">
                    <span className="font-bold text-gray-900">€ {Number(quote.total_amount).toFixed(2)}</span>
                    <div className="flex gap-2">
                      <Link href={`/admin/quotes/${quote.id}/edit`} className="text-xs text-gray-500 hover:text-primary hover:underline flex items-center gap-1">
                        Edit
                      </Link>
                      <Link href={`/admin/quotes/${quote.id}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                        <FileText size={12} /> Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
