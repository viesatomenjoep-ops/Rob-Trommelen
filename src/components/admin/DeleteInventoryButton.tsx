'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteInventoryItem } from '@/app/actions/inventory'

export default function DeleteInventoryButton({ itemId, itemName }: { itemId: string, itemName: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm(`Weet je zeker dat je "${itemName}" definitief wilt verwijderen uit de voorraad?`)) {
      setIsDeleting(true)
      try {
        const result = await deleteInventoryItem(itemId)
        if (result.error) {
          alert('Fout bij verwijderen: ' + result.error)
        }
      } catch (err: any) {
        alert('Fout bij verwijderen: ' + err.message)
      }
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      title="Verwijder product"
      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors disabled:opacity-50"
    >
      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  )
}
