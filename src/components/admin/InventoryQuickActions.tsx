'use client'

import { useState } from 'react'
import { Plus, Minus, Loader2 } from 'lucide-react'
import { updateInventoryStock } from '@/app/actions/inventory'

export default function InventoryQuickActions({ itemId, currentQuantity }: { itemId: string, currentQuantity: number }) {
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (changeAmount: number) => {
    if (currentQuantity + changeAmount < 0) return
    setLoading(true)
    try {
      await updateInventoryStock(itemId, 'Snel Actie (Admin)', changeAmount, 'Handmatige correctie via overzicht')
    } catch (err) {
      console.error(err)
      alert('Fout bij bijwerken')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
      <button 
        onClick={() => handleUpdate(-1)} 
        disabled={loading || currentQuantity <= 0}
        className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-red-500 hover:shadow-sm transition-all disabled:opacity-50"
        title="Verminder met 1"
      >
        <Minus size={16} />
      </button>
      
      <div className="w-6 text-center text-xs font-medium text-gray-500 flex items-center justify-center">
        {loading ? <Loader2 size={12} className="animate-spin" /> : <span>{currentQuantity}</span>}
      </div>

      <button 
        onClick={() => handleUpdate(1)} 
        disabled={loading}
        className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-green-500 hover:shadow-sm transition-all disabled:opacity-50"
        title="Verhoog met 1"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
