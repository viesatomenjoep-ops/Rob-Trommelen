import { getProperty } from '@/app/actions/property'
import { notFound } from 'next/navigation'
import { Ruler, Calendar, Shield, Trophy, Video } from 'lucide-react'

export const metadata = {
  title: 'Premium Sport Property Portfolio',
  robots: 'noindex, nofollow' // Don't let Google index blind portfolios
}

export default async function BlindPortfolioPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  let property = null
  
  try {
    property = await getProperty(params.id)
  } catch (error) {
    notFound()
  }

  if (!property) notFound()

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Simple, unbranded header */}
      <header className="bg-white shadow-sm p-6 text-center">
        <h1 className="text-2xl font-serif text-gray-800 tracking-widest uppercase">Premium Sport Property Selection</h1>
        <p className="text-gray-500 text-sm mt-1">Private Portfolio Viewing</p>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Cover Video/Image */}
        <div className="w-full h-[60vh] bg-black rounded-xl overflow-hidden shadow-lg relative mb-12">
          {property.link_video ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <a href={property.link_video} target="_blank" rel="noopener noreferrer" className="bg-white/90 hover:bg-white text-gray-900 px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all">
                <Video size={24} /> Watch Full Video
              </a>
            </div>
          ) : (
            <img src={property.cover_image_url} alt="Sport Property" className="w-full h-full object-cover opacity-80" />
          )}
        </div>

        {/* Unbranded Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <Calendar className="text-gray-400 w-8 h-8 mb-3" />
              <span className="text-xs uppercase tracking-widest text-gray-500 mb-1">Birth Year</span>
              <span className="font-medium text-xl text-gray-900">{property.birth_year}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="text-gray-400 w-8 h-8 mb-3" />
              <span className="text-xs uppercase tracking-widest text-gray-500 mb-1">Gender</span>
              <span className="font-medium text-xl text-gray-900">{property.gender}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Ruler className="text-gray-400 w-8 h-8 mb-3" />
              <span className="text-xs uppercase tracking-widest text-gray-500 mb-1">Height</span>
              <span className="font-medium text-xl text-gray-900">{property.height_cm ? `${property.height_cm} cm` : 'TBD'}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Trophy className="text-gray-400 w-8 h-8 mb-3" />
              <span className="text-xs uppercase tracking-widest text-gray-500 mb-1">Level</span>
              <span className="font-medium text-xl text-gray-900">{property.experience_level || '-'}</span>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-100">
            <h2 className="text-xl font-serif text-gray-800 mb-6 text-center">Description</h2>
            <div className="prose prose-lg mx-auto text-gray-600 text-center">
              {property.description?.split('\n').map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-xs mt-12">
          Strictly Confidential. Do not share without permission.
        </p>
      </div>
    </div>
  )
}
