import { getProperty } from '@/app/actions/property'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PieChart, Users, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'Syndicate & Fractional Ownership | Equivest',
  robots: 'noindex, nofollow'
}

export default async function SyndicatePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  let property = null
  
  try {
    property = await getProperty(params.id)
  } catch (e) {
    notFound()
  }

  if (!property) notFound()

  // Dummy logic for the syndication UI
  const totalShares = 10
  const availableShares = 4
  const sharePrice = property.price_category ? "€25,000" : "Contact for pricing"
  const fundedPercentage = ((totalShares - availableShares) / totalShares) * 100

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-accent uppercase tracking-[0.3em] text-sm font-bold block mb-4">Investment Syndicate</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Fractional Ownership Offering</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Join an exclusive syndicate to co-own <strong className="text-accent">{property.name}</strong>. Diversify your equestrian portfolio with lower capital entry.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          {/* Left Side: Property */}
          <div className="md:w-5/12 bg-gray-100 relative min-h-[300px]">
            <Image src={property.cover_image_url || '/logo.png'} alt={property.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white w-full">
              <h2 className="text-3xl font-serif font-bold mb-1">{property.name}</h2>
              <p className="text-white/80 uppercase tracking-widest text-sm">{property.discipline} • {property.experience_level || 'Premium'}</p>
            </div>
          </div>

          {/* Right Side: Data */}
          <div className="md:w-7/12 p-8 md:p-12">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Syndicate Funding Status</h3>
                <p className="text-sm text-gray-500 mt-1">Goal: 100% Capital Secured</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-serif font-bold text-accent">{fundedPercentage}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-4 mb-8 overflow-hidden">
              <div className="bg-accent h-4 rounded-full transition-all duration-1000" style={{ width: `${fundedPercentage}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <PieChart className="text-primary mb-2" size={24} />
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Cost per 10% Share</p>
                <p className="text-2xl font-serif font-bold text-gray-900">{sharePrice}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <Users className="text-primary mb-2" size={24} />
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Available Shares</p>
                <p className="text-2xl font-serif font-bold text-gray-900">{availableShares} of {totalShares}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">Select your commitment:</h4>
              <select className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-accent focus:ring-0 text-gray-700 font-medium cursor-pointer">
                <option value="1">10% Share ({sharePrice})</option>
                <option value="2">20% Share</option>
                <option value="3">30% Share</option>
                <option value="4">40% Share</option>
              </select>
              
              <button onClick={() => alert('This is a demo. In production, this would open a digital signature and payment gateway.')} className="w-full py-4 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors mt-4 flex items-center justify-center gap-2">
                <ShieldCheck size={20} /> Secure My Allocation <ArrowRight size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6 text-center leading-relaxed">
              By reserving a share, you agree to the Equivest Syndication Terms. All investments carry risks. Management and training fees apply proportionally.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
