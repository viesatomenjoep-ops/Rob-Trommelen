'use client'

import { useState } from 'react'
import { scrapeProductUrl } from '@/app/actions/scraper'
import { Link2, Loader2, AlertCircle, CheckCircle, Download } from 'lucide-react'

interface PropertyLinkScannerProps {
  onApply: (data: { name: string, image: string, description: string, price: number }) => void
}

export default function PropertyLinkScanner({ onApply }: PropertyLinkScannerProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.startsWith('http')) {
      setError('Vul een geldige URL in (http:// of https://)')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const res = await scrapeProductUrl(url)
      if (res.success) {
        onApply({
          name: res.title || '',
          image: res.image || '',
          description: res.description || '',
          price: res.price || 0
        })
        setSuccess('Data succesvol ingeladen!')
        setTimeout(() => setSuccess(''), 3000)
        setUrl('')
      } else {
        setError(res.error || 'Fout bij scannen.')
      }
    } catch (err) {
      setError('Systeemfout bij scannen.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-accent/5 dark:bg-accent/10 rounded-xl border border-accent/20 dark:border-accent/30 p-5 mb-8">
      <div className="flex items-center gap-2 mb-3 text-accent font-bold">
        <Link2 size={20} />
        <h3>Importeer Gegevens via URL (ClipMyProperty, Sportproperties, etc.)</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Plak hier de link van de advertentie. We proberen automatisch de naam, foto en omschrijving in te vullen.
      </p>
      
      <form onSubmit={handleScrape} className="flex gap-3">
        <input 
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.sportproperties.nl/..."
          className="flex-1 p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent outline-none text-gray-900 dark:text-white text-sm"
        />
        <button 
          type="submit" 
          disabled={loading || !url}
          className="px-4 py-2.5 bg-accent text-white font-bold rounded-lg hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
          <span>Importeer</span>
        </button>
      </form>

      {error ? (
        <div className="mt-3 p-2 bg-red-50 text-red-700 rounded-md text-sm flex items-center gap-2">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      ) : null}

      {success ? (
        <div className="mt-3 p-2 bg-green-50 text-green-700 rounded-md text-sm flex items-center gap-2">
          <CheckCircle size={16} /> <span>{success}</span>
        </div>
      ) : null}
    </div>
  )
}
