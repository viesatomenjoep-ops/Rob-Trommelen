'use client'

import { useState } from 'react'
import { scrapeProductUrl, importInventoryItem } from '@/app/actions/scraper'
import { Link2, Loader2, Play, AlertCircle, CheckCircle } from 'lucide-react'

export default function BulkLinkScanner() {
  const [linksText, setLinksText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ url: string, status: string, name?: string }[]>([])
  const [category, setCategory] = useState('Supplementen')
  
  const handleBulkImport = async () => {
    const urls = linksText.split('\n').map(l => l.trim()).filter(l => l.startsWith('http'))
    if (urls.length === 0) {
      alert('Plak minimaal 1 geldige URL (die begint met http)')
      return
    }

    setLoading(true)
    setResults([])

    for (const url of urls) {
      try {
        setResults(prev => [...prev, { url, status: 'Scannen...' }])
        const res = await scrapeProductUrl(url)
        
        if (res.success && res.title) {
          // Import it immediately
          await importInventoryItem({
            name: res.title,
            price: res.price || 0,
            category: category,
            quantity: 10 // Default quantity
          })
          setResults(prev => prev.map(r => r.url === url ? { url, status: '✅ Toegevoegd', name: res.title } : r))
        } else {
          setResults(prev => prev.map(r => r.url === url ? { url, status: '❌ Mislukt bij scannen' } : r))
        }
      } catch (err) {
        setResults(prev => prev.map(r => r.url === url ? { url, status: '❌ Systeemfout' } : r))
      }
    }
    
    setLoading(false)
    setLinksText('')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-accent/20 dark:border-accent/40 overflow-hidden mb-8 relative">
      <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
        Bulk AI Importer
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Link2 className="text-accent" /> Meerdere Linkjes Importeren (Bulk)
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Plak hier meerdere productlinks (één per regel). De AI scant ze allemaal en zet ze direct in het systeem met een standaard voorraad van 10 stuks.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <textarea 
            rows={5}
            value={linksText}
            onChange={(e) => setLinksText(e.target.value)}
            placeholder="https://www.dierencompleet.nl/product-1&#10;https://www.dierencompleet.nl/product-2&#10;https://www.horta.be/product-3"
            className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all text-sm"
          />
          <div className="w-full md:w-64 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Standaard Categorie</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full p-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md outline-none"
              >
                <option>Voer</option>
                <option>Supplementen</option>
                <option>Uitrusting</option>
                <option>Medicatie</option>
                <option>Overig</option>
              </select>
            </div>
            <button 
              onClick={handleBulkImport}
              disabled={loading || !linksText}
              className="w-full py-3 bg-accent text-white font-bold rounded-lg hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
              <span>Start Bulk Import</span>
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-sm mb-3">Resultaten ({results.length}):</h3>
            <ul className="space-y-2">
              {results.map((r, i) => (
                <li key={i} className="text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                  <span className="truncate flex-1 text-gray-500" title={r.url}>{r.name || r.url}</span>
                  <span className={`font-medium whitespace-nowrap ${r.status.includes('❌') ? 'text-red-500' : r.status.includes('✅') ? 'text-green-600' : 'text-accent'}`}>
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
