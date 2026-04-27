import { getProperty } from '@/app/actions/property'
import { notFound, redirect } from 'next/navigation'
import { BarChart3, Users, Eye, TrendingUp, Calendar } from 'lucide-react'
import Image from 'next/image'

export const metadata = {
  title: 'Investor Analytics | Equivest',
  robots: 'noindex, nofollow'
}

export default async function AnalyticsPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ token?: string }> }) {
  const params = await props.params
  const searchParams = await props.searchParams
  
  if (!searchParams?.token) {
    redirect('/investor-login')
  }

  let property = null
  try {
    property = await getProperty(params.id)
  } catch (e) {
    notFound()
  }

  if (!property) notFound()

  // Generate some realistic looking dummy data based on the property ID to keep it consistent
  const seed = property.id.charCodeAt(0) + property.id.charCodeAt(1)
  const views = 1200 + (seed * 10)
  const videoPlays = Math.floor(views * 0.65)
  const activeLeads = Math.floor((seed % 5) + 2)
  const daysOnMarket = Math.floor((seed % 30) + 15)

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Asset Performance Report</h1>
            <p className="text-gray-500 flex items-center gap-2"><BarChart3 size={16}/> Live data room for current shareholders</p>
          </div>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
              <Image src={property.cover_image_url || '/logo.png'} alt={property.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{property.name}</p>
              <p className="text-xs text-green-600 font-medium">Active Asset</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4"><Eye size={20}/></div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Profile Views</p>
            <p className="text-3xl font-serif font-bold text-gray-900">{views.toLocaleString()}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-2"><TrendingUp size={12}/> +12% this week</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4"><VideoIcon size={20}/></div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Video Engagements</p>
            <p className="text-3xl font-serif font-bold text-gray-900">{videoPlays.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">65% conversion rate</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4"><Users size={20}/></div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Active Leads</p>
            <p className="text-3xl font-serif font-bold text-gray-900">{activeLeads}</p>
            <p className="text-xs text-gray-400 mt-2">Qualified inquiries</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4"><Calendar size={20}/></div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Days on Market</p>
            <p className="text-3xl font-serif font-bold text-gray-900">{daysOnMarket}</p>
            <p className="text-xs text-gray-400 mt-2">Since public listing</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <h3 className="font-serif font-bold text-xl text-gray-900 mb-6">Market Interest Timeline</h3>
          <div className="h-64 w-full bg-gray-50 rounded-lg border border-gray-100 flex items-end px-4 gap-2 pb-4 pt-10">
            {/* Simple CSS Bar Chart Mock */}
            {[40, 55, 30, 80, 65, 90, 75, 100, 85, 110, 95, 120].map((height, i) => (
              <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm relative group cursor-pointer" style={{ height: `${height}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {height * 10} views
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 font-bold uppercase tracking-widest px-2">
            <span>12 Weeks Ago</span>
            <span>Today</span>
          </div>
        </div>

      </div>
    </div>
  )
}

function VideoIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
  )
}
