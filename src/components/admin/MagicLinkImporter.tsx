'use client'

import { useState } from 'react'
import { scrapeProductUrl, importInventoryItem } from '@/app/actions/scraper'
import { Link2, Loader2, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function MagicLinkImporter() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [preview, setPreview] = useState<{ title: string, price: number, image: string | null } | null>(null)
  const [category, setCategory] = useState('Supplementen')
  const [quantity, setQuantity] = useState(10)
  const [importing, setImporting] = useState(false)

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.startsWith('http')) {
      setError('Vul een geldige URL in die begint met http:// of https://')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    setPreview(null)
    
    try {
      const res = await scrapeProductUrl(url)
      if (res.success) {
        setPreview({
          title: res.title || 'Onbekend',
          price: res.price || 0,
          image: res.image || null
        })
      } else {
        setError(res.error || 'Scrape fout')
      }
    } catch (err: any) {
      setError('Systeemfout bij het inladen.')
    }
    setLoading(false)
  }

  const handleImport = async () => {
    if (!preview) return
    setImporting(true)
    
    try {
      const res = await importInventoryItem({
        name: preview.title,
        price: preview.price,
        category: category,
        quantity: quantity
      })
      if (res.success) {
        setSuccess('Product succesvol geïmporteerd!')
        setPreview(null)
        setUrl('')
      }
    } catch (err: any) {
      setError(err.message)
    }
    setImporting(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-primary/20 dark:border-primary/40 overflow-hidden mb-8 relative">
      <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
        AI Magic Importer
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Link2 className="text-primary" /> Importeer via Link
        </h2>
        <p className="text-sm text-gray-500 mb-6">Plak de URL van een product (bijv. Horta, Dierencompleet) en de AI haalt automatisch de naam, prijs en afbeelding op.</p>
        
        <form onSubmit={handleScrape} className="flex gap-3">
          <input 
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.dierencompleet.nl/product/..."
            className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white"
            required
          />
          <button 
            type="submit" 
            disabled={loading || !url}
            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Scan Pagina'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        {preview && (
          <div className="mt-6 p-4 border border-accent/30 bg-accent/5 dark:bg-accent/10 rounded-xl flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {preview.image ? (
              <div className="w-full md:w-32 h-32 relative rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.image} alt={preview.title} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-full md:w-32 h-32 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 flex-shrink-0">
                Geen foto
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-1">{preview.title}</h3>
              <p className="text-xl font-bold text-accent mb-4">€ {preview.price.toFixed(2)}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Categorie</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-primary"
                  >
                    <option>Voer</option>
                    <option>Supplementen</option>
                    <option>Uitrusting</option>
                    <option>Medicatie</option>
                    <option>Overig</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Aantal (Voorraad)</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full p-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-primary"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleImport}
                disabled={importing}
                className="mt-4 w-full py-2.5 bg-accent text-white font-bold rounded-lg hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {importing ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                Definitief Toevoegen Aan Voorraad
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
