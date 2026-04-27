import Link from 'next/link'
import { FileText, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminPagesOverview() {
  const pages = [
    { name: 'Investors (Want to invest)', path: '/admin/pages/investors', description: 'Manage text and content for the investment page.' },
    { name: 'About & Team (Legacy of Excellence)', path: '/admin/pages/about', description: 'Manage the text above the team members list.' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Website Content</h1>
          <p className="text-gray-500 mt-2">Select a page to edit its content.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {pages.map((page) => (
            <li key={page.path}>
              <Link href={page.path} className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{page.name}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{page.description}</p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
