import { getProperty } from '@/app/actions/property'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'

export const metadata = {
  title: 'Investment Proposal | Equivest',
  robots: 'noindex, nofollow'
}

export default async function ProposalPage(props: { params: Promise<{ slug: string }>, searchParams: Promise<{ properties?: string }> }) {
  const params = await props.params
  const searchParams = await props.searchParams
  
  // Convert "john-doe" to "John Doe"
  const clientName = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const propertyId = searchParams?.properties
  
  if (!propertyId) notFound()

  let property = null
  try {
    property = await getProperty(propertyId)
  } catch (e) {
    notFound()
  }

  if (!property) notFound()

  return (
    <div className="bg-[#0A192F] min-h-screen text-white font-sans selection:bg-accent selection:text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-32 text-center">
        <span className="text-accent uppercase tracking-[0.3em] text-sm font-bold block mb-6">Confidential Investment Proposal</span>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
          Prepared exclusively for <br/><span className="text-accent italic">{clientName}</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-16">
          Based on your investment profile and our recent discussions, Equivest Portfolio Management has secured a highly exclusive opportunity that aligns perfectly with your goals.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-1 md:p-8 backdrop-blur-md">
          <div className="grid md:grid-cols-2 gap-8 items-center bg-[#0d213f] rounded-xl overflow-hidden border border-white/5">
            <div className="h-full min-h-[400px] relative">
              <img src={property.cover_image_url} alt={property.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d213f] opacity-80 md:hidden"></div>
            </div>
            <div className="p-8 md:p-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <Trophy size={14} /> Prime Asset
              </div>
              <h2 className="text-4xl font-serif font-bold mb-2">{property.name}</h2>
              <p className="text-gray-400 mb-6 uppercase tracking-widest text-sm">{property.discipline} • {property.birth_year}</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Level</span>
                  <span className="font-medium">{property.experience_level || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Investment Target</span>
                  <span className="font-medium text-green-400">{property.estimated_roi || 'High Yield'}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Capital Required</span>
                  <span className="font-medium text-white">{property.price_category}</span>
                </div>
              </div>

              <Link href={`/properties/${property.id}`} className="group inline-flex items-center gap-3 bg-accent hover:bg-white hover:text-[#0A192F] transition-all text-white px-6 py-4 rounded-lg font-bold w-full justify-center">
                Review Asset Details
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm">
            This link is private and monitored. It will expire in 7 days. <br/>
            © 2026 Equivest Portfolio Management.
          </p>
        </div>
      </div>
    </div>
  )
}
