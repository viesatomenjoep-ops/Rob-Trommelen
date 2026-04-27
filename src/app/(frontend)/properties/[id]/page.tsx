import { getProperty } from '@/app/actions/property'
import { ArrowLeft, Ruler, Calendar, Shield, Trophy, FileText, Link as LinkIcon, Video, FileCheck, Stethoscope, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ViewTracker from '@/components/frontend/ViewTracker'
import { Metadata } from 'next'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params
  try {
    const property = await getProperty(params.id)
    if (!property) return { title: 'Property Not Found | Equivest' }
    
    const desc = property.description ? property.description.substring(0, 150) + '...' : `Elite ${property.discipline} available at Equivest. View pedigree, videos, and investment details.`
    return {
      title: `${property.name} | Premium ${property.discipline} | Equivest`,
      description: desc,
      openGraph: {
        title: `${property.name} | Premium ${property.discipline}`,
        description: desc,
        images: property.cover_image_url ? [property.cover_image_url] : [],
      }
    }
  } catch (e) {
    return { title: 'Equivest | Premium Sport Properties' }
  }
}

export default async function PropertyDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  let property = null
  
  try {
    property = await getProperty(params.id)
  } catch (error) {
    notFound()
  }

  if (!property) notFound()

  let canSeeROI = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const cookieStore = await cookies()
    const isInvestor = cookieStore.get('investor_auth')?.value === 'true'
    canSeeROI = !!user || isInvestor
  } catch (err) {
    console.error("Auth check failed on property detail:", err)
    // Fallback safely to false
  }

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.name,
    image: property.cover_image_url ? [property.cover_image_url] : [],
    description: property.description || `Elite ${property.discipline} available at Equivest.`,
    brand: {
      '@type': 'Brand',
      name: 'Equivest'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: (property.price_category && property.price_category !== 'Price on Request') ? property.price_category.replace(/[^0-9]/g, '000') : '0',
      availability: property.status === 'Available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://www.equivestworldwide.com/properties/${property.id}`
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-[#0A192F] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />
      <ViewTracker propertyId={property.id} />
      {/* Hero Cover Image */}
      <div className="relative w-full h-[50vh] min-h-[400px] lg:h-[70vh]">
        <img 
          src={property.cover_image_url || '/logo.png'} 
          alt={property.name}
          className={`absolute inset-0 w-full h-full ${property.cover_image_url ? 'object-cover' : 'object-contain p-20 opacity-30'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-0 left-0 w-full z-10 px-4 pt-8">
          <Link 
            href="/properties"
            className="inline-flex items-center text-white/90 hover:text-white transition-colors group px-4 py-3 md:px-0 md:py-0 text-lg md:text-base font-medium rounded-xl hover:bg-white/10 md:hover:bg-transparent"
          >
            <ArrowLeft className="mr-3 w-6 h-6 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            Back to the collection
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-serif font-bold text-white drop-shadow-lg mb-4">{property.name}</h1>
          <p className="text-xl sm:text-2xl text-accent font-light drop-shadow-md">{property.discipline}</p>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12 xl:gap-16">
          
          {/* Main Details (Left/Middle) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-gray-200 dark:border-gray-800">
              <div className="flex flex-col items-start gap-2">
                <Calendar className="text-accent w-6 h-6" />
                <span className="text-xs uppercase tracking-widest text-gray-500">Birth Year</span>
                <span className="font-medium text-lg text-primary dark:text-white">{property?.birth_year || '-'}</span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Shield className="text-accent w-6 h-6" />
                <span className="text-xs uppercase tracking-widest text-gray-500">Gender</span>
                <span className="font-medium text-lg text-primary dark:text-white">{property?.gender || '-'}</span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Ruler className="text-accent w-6 h-6" />
                <span className="text-xs uppercase tracking-widest text-gray-500">Height</span>
                <span className="font-medium text-lg text-primary dark:text-white">{property?.height_cm ? `${property.height_cm} cm` : 'TBD'}</span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Trophy className="text-accent w-6 h-6" />
                <span className="text-xs uppercase tracking-widest text-gray-500">Level</span>
                <span className="font-medium text-lg text-primary dark:text-white">{property?.experience_level || '-'}</span>
              </div>
            </div>

            {/* Pedigree */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary dark:text-white mb-6">Pedigree</h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 pr-6">
                  <span className="text-sm text-gray-500 uppercase tracking-widest block mb-1">Sire</span>
                  <span className="text-xl font-medium text-primary dark:text-white">{property?.sire || 'Unknown'}</span>
                </div>
                <div className="w-1/2 pl-6">
                  <span className="text-sm text-gray-500 uppercase tracking-widest block mb-1">Dam Sire</span>
                  <span className="text-xl font-medium text-primary dark:text-white">{property?.dam_sire || 'Unknown'}</span>
                </div>
              </div>
            </div>

            {/* Investor ROI Section */}
            {canSeeROI && (property?.estimated_roi || property?.investment_rationale) && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border-2 border-green-500/30 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
                <h2 className="text-2xl font-serif font-bold text-green-800 dark:text-green-400 mb-6 flex items-center">
                  <TrendingUp className="mr-3 text-green-600 dark:text-green-500" /> Investment Prospect
                </h2>
                
                <div className="space-y-6">
                  {property.estimated_roi && (
                    <div className="bg-white/60 dark:bg-gray-900/50 rounded-xl p-4 border border-green-500/20">
                      <span className="text-sm font-bold text-green-700 dark:text-green-500 uppercase tracking-widest block mb-1">Estimated ROI</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{property.estimated_roi}</span>
                    </div>
                  )}
                  
                  {property.investment_rationale && (
                    <div>
                      <span className="text-sm font-bold text-green-700 dark:text-green-500 uppercase tracking-widest block mb-2">Why this property?</span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                        {property.investment_rationale}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents & Links */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary dark:text-white mb-6">Property Documents & Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vet Check */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center shadow-sm">
                  <Stethoscope className="w-8 h-8 text-accent mr-4" />
                  <div className="flex flex-col">
                    <span className="font-medium text-primary dark:text-white">Vet Check / Keuring</span>
                    {property?.doc_vet_check ? (
                      <a href={property.doc_vet_check} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">View Document</a>
                    ) : (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
                  </div>
                </div>

                {/* X-Rays */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center shadow-sm">
                  <FileText className="w-8 h-8 text-accent mr-4" />
                  <div className="flex flex-col">
                    <span className="font-medium text-primary dark:text-white">X-Rays</span>
                    {property?.doc_xrays ? (
                      <a href={property.doc_xrays} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">View Document</a>
                    ) : (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
                  </div>
                </div>

                {/* Passport Scan */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center shadow-sm">
                  <FileCheck className="w-8 h-8 text-accent mr-4" />
                  <div className="flex flex-col">
                    <span className="font-medium text-primary dark:text-white">Passport Scan</span>
                    {property?.doc_passport ? (
                      <a href={property.doc_passport} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">View Document</a>
                    ) : (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
                  </div>
                </div>

                {/* FEI / Lifescore */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center shadow-sm">
                  <LinkIcon className="w-8 h-8 text-accent mr-4" />
                  <div className="flex flex-col">
                    <span className="font-medium text-primary dark:text-white">FEI / Lifescore</span>
                    {property?.link_fei ? (
                      <a href={property.link_fei} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">View Profile</a>
                    ) : (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
                  </div>
                </div>

                {/* PropertyTelex */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center shadow-sm">
                  <LinkIcon className="w-8 h-8 text-accent mr-4" />
                  <div className="flex flex-col">
                    <span className="font-medium text-primary dark:text-white">PropertyTelex</span>
                    {property?.link_propertytelex ? (
                      <a href={property.link_propertytelex} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">View Pedigree</a>
                    ) : (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
                  </div>
                </div>

                {/* Video */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center shadow-sm">
                  <Video className="w-8 h-8 text-accent mr-4" />
                  <div className="flex flex-col">
                    <span className="font-medium text-primary dark:text-white">Video</span>
                    {property?.link_video ? (
                      <a href={property.link_video} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">Watch Video</a>
                    ) : (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Competition Results */}
            {property?.property_results && Array.isArray(property.property_results) && property.property_results.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary dark:text-white mb-6 flex items-center">
                  <Trophy className="mr-3 text-accent" /> Competition Results
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                          <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Event</th>
                          <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Level</th>
                          <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Result</th>
                          <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">Video</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {property.property_results.map((r: any) => (
                          <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">
                              {r.date ? new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{r.event_name || '-'}</td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{r.level || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-accent font-bold">{r.result || '-'}</td>
                            <td className="px-6 py-4 text-center">
                              {r.video_url ? (
                                <a href={r.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors" title="Watch Video">
                                  <Video size={16} />
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {property?.description && typeof property.description === 'string' && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary dark:text-white mb-6">About {property.name}</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                  {property.description.split('\n').map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            {/* Future Media Gallery placeholder */}
            {(property?.media || property?.property_media) && Array.isArray(property.media || property.property_media) && (property.media || property.property_media).length > 0 && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary dark:text-white mb-6">Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {(property.media || property.property_media).map((item: any) => (
                    <div key={item.id} className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-gray-100">
                      {item.type === 'image' ? (
                        <img src={item.url} alt="Gallery item" className="object-cover w-full h-full" />
                      ) : (
                        <video src={item.url} controls className="object-cover w-full h-full" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Inquiry Panel (Right) */}
          <div className="mt-12 lg:mt-0">
            <div className="sticky top-32 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="mb-8">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 ${
                  property?.status === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  property?.status === 'Sold' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                  'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {property?.status || 'Unknown'}
                </span>
                
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2">Price Category</h3>
                <p className="text-3xl font-serif font-bold text-primary dark:text-white">{property?.price_category || 'Price on Request'}</p>
              </div>

              <div className="space-y-4">
                <Link 
                  href={`/contact?property=${property?.id}`} 
                  className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg text-base font-medium text-white transition-all duration-300 ${
                    property?.status === 'Available' ? 'bg-primary hover:bg-secondary shadow-md hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed opacity-70'
                  }`}
                  aria-disabled={property?.status !== 'Available'}
                >
                  {property?.status === 'Available' ? `Inquire about ${property.name}` : 'Not Available'}
                </Link>
                <p className="text-center text-xs text-gray-500">
                  Serious inquiries only. Vetting and trials available upon request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
