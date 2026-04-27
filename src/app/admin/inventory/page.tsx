import { getInventoryItems } from '@/app/actions/inventory'
import Link from 'next/link'
import { Plus, AlertTriangle, PackageSearch } from 'lucide-react'
import BulkLinkScanner from '@/components/admin/BulkLinkScanner'
import InventoryQuickActions from '@/components/admin/InventoryQuickActions'
import DeleteInventoryButton from '@/components/admin/DeleteInventoryButton'

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
  const items = await getInventoryItems()

  // Group items by category
  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity), 0)
  const totalValue = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.purchase_price || 0)), 0)

  return (
    <div className="space-y-6">
      <BulkLinkScanner />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-primary dark:text-white">Inventory Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Beheer voer, supplementen en materialen.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right mr-4 hidden sm:block">
            <p className="text-sm text-gray-500">Totale Waarde</p>
            <p className="text-lg font-bold text-accent">€ {totalValue.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
          </div>
          <Link
            href="/admin/inventory/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Nieuw Artikel</span>
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No inventory found</h3>
          <p className="mt-2 text-gray-500">Begin met het toevoegen van je eerste product.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(categories).map(([category, catItems]) => {
            const categoryTotal = (catItems as any[]).reduce((sum, i) => sum + Number(i.quantity), 0);
            return (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white">{category}</h2>
                  <span className="text-sm font-bold bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">{categoryTotal} items</span>
                </div>
                
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {(catItems as any[]).map((item) => {
                    const quantity = Number(item.quantity)
                    const threshold = Number(item.low_stock_threshold)
                    const isLowStock = quantity <= threshold
                    const progress = Math.min(100, Math.max(0, (quantity / (threshold * 3)) * 100))
                    
                    return (
                      <div key={item.id} className="p-6 flex flex-col lg:flex-row items-center justify-between gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-lg text-gray-900 dark:text-white">{item.name}</h3>
                            {isLowStock && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                <AlertTriangle size={14} />
                                Bijna op (Min. {threshold})
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 mt-2">
                            {item.supplier && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">Leverancier: {item.supplier}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs font-medium mt-1">
                              {item.purchase_price > 0 && (
                                <span className="text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  Inkoop: €{Number(item.purchase_price).toFixed(2)}
                                </span>
                              )}
                              {item.selling_price > 0 && (
                                <span className="text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                                  Verkoop: €{Number(item.selling_price).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-6 w-full lg:w-auto">
                          {/* Progress bar */}
                          <div className="hidden sm:flex flex-col w-32 mr-4">
                            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                              <span>0</span>
                              <span>Gezond</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${isLowStock ? 'bg-red-500' : progress < 50 ? 'bg-yellow-400' : 'bg-green-500'}`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <InventoryQuickActions itemId={item.id} currentQuantity={quantity} />
                          
                          <Link 
                            href={`/admin/inventory/${item.id}`}
                            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                          >
                            Details
                          </Link>
                          
                          <DeleteInventoryButton itemId={item.id} itemName={item.name} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
