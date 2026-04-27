import { getInventoryItem, getInventoryLogs } from '@/app/actions/inventory'
import { getEmployees } from '@/app/actions/staff'
import Link from 'next/link'
import { ArrowLeft, History, Package, AlertTriangle } from 'lucide-react'
import StockUpdater from './StockUpdater'

export const dynamic = 'force-dynamic'

export default async function InventoryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await getInventoryItem(resolvedParams.id)
  const logs = await getInventoryLogs(resolvedParams.id)
  const employees = await getEmployees()

  const isLowStock = Number(item.quantity) <= Number(item.low_stock_threshold)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/inventory"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif text-primary dark:text-white flex items-center gap-3">
              {item.name}
              {isLowStock && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  <AlertTriangle size={16} />
                  Voorraad kritiek
                </span>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Categorie: {item.category}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current Status Card */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-center text-center space-y-2">
          <Package size={40} className="mx-auto text-primary opacity-50 mb-2" />
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Huidige Voorraad</p>
          <p className={`text-5xl font-bold ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-primary dark:text-white'}`}>
            {item.quantity}
          </p>
          <p className="text-lg text-gray-500">{item.unit}</p>
          
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 text-left space-y-1">
            <p><strong>Waarschuwingslimiet:</strong> {item.low_stock_threshold} {item.unit}</p>
            {item.supplier && <p><strong>Leverancier:</strong> {item.supplier}</p>}
            {item.description && <p><strong>Info:</strong> {item.description}</p>}
          </div>
        </div>

        {/* Update Form */}
        <div className="md:col-span-2">
          <StockUpdater item={item} employees={employees} />
        </div>
      </div>

      {/* History Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <History size={20} className="text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Transactie Logboek</h2>
        </div>
        
        {logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nog geen wijzigingen in de voorraad geregistreerd.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {logs.map((log) => {
              const isAddition = Number(log.change_amount) > 0
              return (
                <div key={log.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {log.employee_name}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {log.reason || (isAddition ? 'Voorraad bijgevuld' : 'Voorraad afgeboekt')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(log.created_at).toLocaleString('nl-NL')}
                    </p>
                  </div>
                  <div className={`text-lg font-bold px-4 py-2 rounded-lg ${isAddition ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'}`}>
                    {isAddition ? '+' : ''}{log.change_amount} {item.unit}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
