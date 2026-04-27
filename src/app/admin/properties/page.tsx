import { getProperties } from '@/app/actions/property'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import SortablePropertyList from './SortablePropertyList'

export default async function AdminPropertiesPage() {
  let properties = [];
  try {
    properties = await getProperties() || [];
  } catch (error) {
    console.error("Supabase not configured yet.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white">Properties Inventory</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Link href="/admin/properties/new?category=sales" className="flex-1 sm:flex-none flex justify-center items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors text-xs sm:text-sm font-medium">
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add Sales Property</span>
            <span className="sm:hidden">Sales</span>
          </Link>
          <Link href="/admin/properties/new?category=investment" className="flex-1 sm:flex-none flex justify-center items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-accent text-white rounded-md hover:bg-primary transition-colors text-xs sm:text-sm font-medium">
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add Investment Property</span>
            <span className="sm:hidden">Investment</span>
          </Link>
        </div>
      </div>

      <SortablePropertyList initialProperties={properties} />
    </div>
  )
}
