import { getDashboardStats } from '@/app/actions/analytics'
import { Eye, Database, Calendar as CalendarIcon, FileText, TrendingUp, Users, Wand } from 'lucide-react'
import Link from 'next/link'

export default async function AdminOverview() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
      </div>

      {/* Quick Navigation Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Link href="/admin/magic-links" className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 hover:border-pink-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center transition-all group">
          <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Wand size={24} className="text-pink-600 dark:text-pink-400" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white text-center">Magic Links</h2>
          <p className="text-xs text-gray-500 mt-1">Client Tools</p>
        </Link>
        
        <Link href="/admin/properties" className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/50 hover:shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center transition-all group">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Database size={24} className="text-primary" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white text-center">Properties</h2>
          <p className="text-xs text-gray-500 mt-1">Manage portfolio</p>
        </Link>
        
        <Link href="/admin/pages" className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center transition-all group">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FileText size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white text-center">Website content</h2>
          <p className="text-xs text-gray-500 mt-1">Edit pages</p>
        </Link>

        <Link href="/admin/references" className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center transition-all group">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white text-center">References</h2>
          <p className="text-xs text-gray-500 mt-1">Client reviews</p>
        </Link>

        <Link href="/admin/quotes" className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 hover:border-yellow-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center transition-all group">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CalendarIcon size={24} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white text-center">Quotes & Orders</h2>
          <p className="text-xs text-gray-500 mt-1">Sales tracking</p>
        </Link>

        <Link href="/admin/team" className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center transition-all group">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users size={24} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white text-center">Team</h2>
          <p className="text-xs text-gray-500 mt-1">Manage staff</p>
        </Link>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Live Statistics</h2>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        
        <Link href="/admin/properties" className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 transition-colors">
              <Database size={24} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate group-hover:text-primary transition-colors">Total Properties</dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProperties}</dd>
              </dl>
            </div>
          </div>
        </Link>

        <Link href="/admin/schedules" className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md hover:border-green-500/30 transition-all cursor-pointer group">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 group-hover:bg-green-200 transition-colors">
              <CalendarIcon size={24} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate group-hover:text-green-600 transition-colors">Visits & Appointments</dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAppointments}</dd>
              </dl>
            </div>
          </div>
        </Link>

        <Link href="/admin/quotes" className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md hover:border-yellow-500/30 transition-all cursor-pointer group">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-200 transition-colors">
              <FileText size={24} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate group-hover:text-yellow-600 transition-colors">Quotes & Orders</dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalQuotes}</dd>
              </dl>
            </div>
          </div>
        </Link>

        <Link href="/admin/team" className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md hover:border-emerald-500/30 transition-all cursor-pointer group">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 transition-colors">
              <Users size={24} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate group-hover:text-emerald-600 transition-colors">Team Members</dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTeamMembers || 0}</dd>
              </dl>
            </div>
          </div>
        </Link>

        <Link href="/admin/properties" className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md hover:border-purple-500/30 transition-all cursor-pointer group">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 transition-colors">
              <TrendingUp size={24} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate group-hover:text-purple-600 transition-colors">Total Profile Views</dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.topProperties.reduce((acc: number, curr: any) => acc + (curr.views || 0), 0)}
                </dd>
              </dl>
            </div>
          </div>
        </Link>

      </div>

      {/* Financial Overview (Inventory) */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-700/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center">
            <TrendingUp className="mr-2 text-primary" /> Financial Overview (Inventory)
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-700/50">
          <div className="flex flex-col items-center sm:items-start pt-4 sm:pt-0">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Purchase Value</span>
            <span className="text-3xl font-bold text-white mt-2">
              {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(stats.inventoryCost)}
            </span>
          </div>
          <div className="flex flex-col items-center sm:items-start pt-4 sm:pt-0 sm:pl-6">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Sales Value</span>
            <span className="text-3xl font-bold text-white mt-2">
              {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(stats.inventoryValue)}
            </span>
          </div>
          <div className="flex flex-col items-center sm:items-start pt-4 sm:pt-0 sm:pl-6">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Potential Profit</span>
            <span className={`text-3xl font-bold mt-2 ${stats.inventoryProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(stats.inventoryProfit)}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Graph / Top Viewed Properties */}
      <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Eye className="mr-2 text-accent" /> Most Viewed Properties (Analytics)
          </h3>
        </div>
        <div className="p-6">
          {stats.topProperties.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No data available yet. Visit a property on the website to track views.</p>
          ) : (
            <div className="space-y-6">
              {stats.topProperties.map((property: any, index: number) => {
                const maxViews = Math.max(...stats.topProperties.map((h: any) => h.views || 0), 1);
                const percentage = ((property.views || 0) / maxViews) * 100;

                return (
                  <div key={property.id} className="flex items-center">
                    <span className="w-6 font-bold text-gray-400">{index + 1}.</span>
                    <div className="flex-1 ml-4">
                      <div className="flex justify-between mb-1">
                        <Link href={`/admin/properties/${property.id}/edit`} className="font-medium text-primary dark:text-white hover:text-accent transition-colors">
                          {property.name}
                        </Link>
                        <span className="text-sm font-bold text-accent">{property.views || 0} views</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-accent h-2.5 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
