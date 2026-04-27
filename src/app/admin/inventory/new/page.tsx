'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { addInventoryItem } from '@/app/actions/inventory'

export default function NewInventoryItemPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await addInventoryItem(formData)

    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      router.push('/admin/inventory')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/inventory"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <h1 className="text-2xl font-serif text-primary dark:text-white">Nieuw Artikel Toevoegen</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Naam *</label>
            <input 
              name="name" 
              required 
              placeholder="Bijv. Magnesium Citraat"
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categorie *</label>
            <select 
              name="category" 
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            >
              <option value="Supplementen">Supplementen</option>
              <option value="Voer & Ruwvoer">Voer & Ruwvoer</option>
              <option value="Verzorging">Verzorging</option>
              <option value="Materialen">Materialen</option>
              <option value="Overig">Overig</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Voorraad *</label>
            <input 
              type="number"
              name="quantity" 
              required 
              min="0"
              step="0.01"
              defaultValue="0"
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Eenheid *</label>
            <select 
              name="unit" 
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            >
              <option value="stuks">Stuks (Emmers/Flessen)</option>
              <option value="zakken">Zakken</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="liter">Liter (L)</option>
              <option value="balen">Balen</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Waarschuwingslimiet (Low Stock) *</label>
            <input 
              type="number"
              name="low_stock_threshold" 
              required 
              min="0"
              step="0.01"
              defaultValue="5"
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            />
            <p className="text-xs text-gray-500">Krijg een WhatsAppje als de voorraad hieronder komt.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Leverancier</label>
            <input 
              name="supplier" 
              placeholder="Bijv. Hartog of Agradi"
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Inkoopprijs (€)</label>
            <input 
              type="number"
              name="purchase_price" 
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Verkoopprijs (€)</label>
            <input 
              type="number"
              name="selling_price" 
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Opmerkingen / Beschrijving</label>
          <textarea 
            name="description" 
            rows={3}
            placeholder="Speciale voorschriften of omschrijving..."
            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            <span>Opslaan & Toevoegen</span>
          </button>
        </div>
      </form>
    </div>
  )
}
