'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateQuote } from '@/app/actions/quotes'
import { Plus, Trash2, ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditQuoteClient({ initialData, quoteId }: { initialData: any, quoteId: string }) {
  const router = useRouter()
  const { quote, items: initialItems } = initialData
  const isOrder = quote.type === 'order'
  
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState(
    initialItems.map((item: any) => ({
      description: item.description,
      quantity: item.quantity,
      price: item.unit_price
    }))
  )
  const [taxRate, setTaxRate] = useState(quote.tax_rate || 21)

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.price)), 0)
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('items', JSON.stringify(items))
      formData.append('taxRate', taxRate.toString())
      
      await updateQuote(quoteId, formData)
      router.push(`/admin/quotes/${quoteId}`)
    } catch (error) {
      console.error(error)
      alert("Er is een fout opgetreden bij het bijwerken.")
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/quotes/${quoteId}`} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary dark:text-white">{isOrder ? 'Order' : 'Offerte'} Bewerken</h1>
          <p className="text-gray-500">Pas de details aan van {quote.quote_number}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-8">
        
        {/* Client Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Klantgegevens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offerte Nummer *</label>
              <input required name="quoteNumber" type="text" defaultValue={quote.quote_number} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Naam Klant *</label>
              <input required name="clientName" type="text" defaultValue={quote.client_name} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail Klant *</label>
              <input required name="clientEmail" type="email" defaultValue={quote.client_email} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrijf (optioneel)</label>
              <input name="clientCompany" type="text" defaultValue={quote.client_company} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adres (optioneel)</label>
              <input name="clientAddress" type="text" defaultValue={quote.client_address} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-accent outline-none" />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Producten / Diensten</h2>
            <button type="button" onClick={handleAddItem} className="flex items-center text-sm text-accent hover:text-primary transition-colors">
              <Plus size={16} className="mr-1" /> Regel Toevoegen
            </button>
          </div>
          
          <div className="space-y-3">
            {items.map((item: any, index: number) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                <div className="flex-1 w-full">
                  <input 
                    required
                    type="text" 
                    placeholder="Omschrijving" 
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div className="w-24">
                  <input 
                    required
                    type="number" 
                    min="1"
                    placeholder="Aantal" 
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div className="w-32 relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">€</span>
                  <input 
                    required
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="Prijs" 
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    className="w-full p-2 pl-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" disabled={items.length === 1}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Totals & Notes */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opmerkingen op offerte</label>
            <textarea name="notes" defaultValue={quote.notes} rows={4} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-accent outline-none"></textarea>
          </div>
          
          <div className="w-full sm:w-64 space-y-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotaal</span>
              <span>€ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span>BTW</span>
                <select value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="p-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                  <option value={21}>21%</option>
                  <option value={9}>9%</option>
                  <option value={0}>0%</option>
                </select>
              </div>
              <span>€ {taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2">
              <span>Totaal</span>
              <span>€ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Wijzigingen Opslaan
          </button>
        </div>
      </form>
    </div>
  )
}
