'use client'

import { useState } from 'react'
import { updateInventoryStock } from '@/app/actions/inventory'
import { PlusCircle, MinusCircle, Loader2 } from 'lucide-react'

type StockUpdaterProps = {
  item: any
  employees: any[]
}

export default function StockUpdater({ item, employees }: StockUpdaterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'remove' | 'add'>('remove')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const amount = Number(formData.get('amount'))
    const employeeName = formData.get('employeeName') as string
    const reason = formData.get('reason') as string

    if (amount <= 0) {
      setError("Hoeveelheid moet groter zijn dan 0")
      setIsSubmitting(false)
      return
    }

    const changeAmount = actionType === 'remove' ? -amount : amount

    const result = await updateInventoryStock(item.id, employeeName, changeAmount, reason)

    if (result?.error) {
      setError(result.error)
    } else {
      // Reset form
      const form = e.target as HTMLFormElement
      form.reset()
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
      <h2 className="text-xl font-serif text-primary dark:text-white mb-6">Voorraad Wijzigen</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Type of action */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActionType('remove')}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
              actionType === 'remove' 
                ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' 
                : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
            }`}
          >
            <MinusCircle size={20} />
            <span className="font-medium">Afboeken (Gebruiken)</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActionType('add')}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
              actionType === 'add' 
                ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
            }`}
          >
            <PlusCircle size={20} />
            <span className="font-medium">Bijvullen (Levering)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hoeveelheid ({item.unit}) *</label>
            <input 
              type="number"
              name="amount" 
              required 
              min="0.01"
              step="0.01"
              placeholder="Bijv. 1 of 0.5"
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Wie voert dit in? *</label>
            <select 
              name="employeeName" 
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            >
              <option value="">Selecteer medewerker...</option>
              <option value="Tom (Admin)">Tom (Admin)</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.full_name}>{emp.full_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reden / Opmerking (Optioneel)</label>
          <input 
            name="reason" 
            placeholder={actionType === 'remove' ? 'Bijv. Gevoerd aan paard X' : 'Bijv. Nieuwe levering binnengekomen'}
            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 p-3 text-white rounded-lg transition-colors disabled:opacity-70 ${
            actionType === 'remove' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : (actionType === 'remove' ? <MinusCircle size={20} /> : <PlusCircle size={20} />)}
          <span className="font-medium">
            {actionType === 'remove' ? 'Bevestig Afboeken' : 'Bevestig Bijvullen'}
          </span>
        </button>
      </form>
    </div>
  )
}
