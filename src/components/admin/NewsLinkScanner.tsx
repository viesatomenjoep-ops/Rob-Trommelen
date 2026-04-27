'use client'

import { useState } from 'react'
import { Link2, Loader2 } from 'lucide-react'
import { scrapeProductUrl } from '@/app/actions/scraper'

interface NewsLinkScannerProps {
  onScanSuccess: (imageUrl: string) => void
}

export default function NewsLinkScanner({ onScanSuccess }: NewsLinkScannerProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    
    setLoading(true)
    
    try {
      const data = await scrapeProductUrl(url)
      
      if (data.success) {
        // Fill the form fields dynamically
        const titleInput = document.getElementById('title') as HTMLInputElement
        const excerptInput = document.getElementById('excerpt') as HTMLTextAreaElement
        const contentInput = document.getElementById('content') as HTMLTextAreaElement
        
        if (titleInput && data.title) titleInput.value = data.title
        if (excerptInput && data.description) excerptInput.value = data.description
        if (contentInput && data.description) contentInput.value = data.description
        
        if (data.image) {
          onScanSuccess(data.image)
        }

        alert('Artikel succesvol gescand! Vul eventueel de rest aan.')
      } else {
        alert('Kon de gegevens niet ophalen van deze link: ' + (data.error || 'Onbekende fout'))
      }
    } catch (err) {
      console.error(err)
      alert('Er is een fout opgetreden bij het scannen.')
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
        <span>AI Scanner</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full text-blue-600 dark:text-blue-300">
          <Link2 size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-blue-900 dark:text-blue-100">Heb je een link naar een nieuwsbericht?</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">Plak de link hieronder en onze AI haalt automatisch de titel, tekst en de foto voor je op!</p>
        </div>
      </div>
      
      <form onSubmit={handleScan} className="mt-4 flex gap-2">
        <input 
          type="url" 
          placeholder="https://www.properties.nl/nieuwsbericht-123" 
          className="flex-1 px-4 py-2 rounded-md border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm bg-white dark:bg-gray-800"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button 
          type="submit" 
          disabled={loading || !url}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Scan Link</span>}
        </button>
      </form>
    </div>
  )
}
