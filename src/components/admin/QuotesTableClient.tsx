'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default function QuotesTableClient({ quotes }: { quotes: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredQuotes = quotes.filter(quote => {
    const term = searchTerm.toLowerCase()
    return (
      quote.quote_number?.toLowerCase().includes(term) ||
      quote.client_name?.toLowerCase().includes(term) ||
      quote.client_email?.toLowerCase().includes(term) ||
      quote.total_amount?.toString().includes(term)
    )
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      
      {/* Zoekbalk */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
              placeholder="Search by invoice number, client name, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Number</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Type</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Client</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Amount</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredQuotes.map((quote: any) => (
              <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 font-medium text-primary dark:text-white">{quote.quote_number}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    quote.type === 'order' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {quote.type === 'order' ? 'ORDER' : 'QUOTE'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900 dark:text-gray-100">{quote.client_name}</div>
                  <div className="text-sm text-gray-500">{quote.client_email}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {new Date(quote.date).toLocaleDateString('nl-NL')}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  € {Number(quote.total_amount).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    quote.status === 'sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    quote.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    quote.status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {quote.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/quotes/${quote.id}/edit`}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link 
                      href={`/admin/quotes/${quote.id}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filteredQuotes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No results found for your search.' : 'No quotes or orders created yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
