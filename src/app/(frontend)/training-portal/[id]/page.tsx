import { getProperty } from '@/app/actions/property'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Video, Trophy, Calendar, MessageCircle, PlayCircle } from 'lucide-react'

export const metadata = {
  title: 'After-Sales Training Portal | Equivest',
  robots: 'noindex, nofollow'
}

export default async function TrainingPortalPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  let property = null
  
  try {
    property = await getProperty(params.id)
  } catch (e) {
    notFound()
  }

  if (!property) notFound()

  // Dummy training updates for the demo
  const updates = [
    {
      date: 'Oct 24, 2026',
      type: 'competition',
      title: 'Clear Round - CSI2* Opglabbeek',
      desc: 'Fantastic performance today! Jumped a double clear in the 1.40m class. Very careful and scopey.',
      icon: Trophy,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      date: 'Oct 18, 2026',
      type: 'training',
      title: 'Gymnastics at Home',
      desc: 'Worked on ridability and grid work. Feeling very sharp off the ground.',
      icon: Video,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      date: 'Oct 12, 2026',
      type: 'vet',
      title: 'Routine Physio',
      desc: 'Checked by the physio today. Muscles are loose, back feels great. Ready for the weekend show.',
      icon: MessageCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="h-48 bg-slate-900 relative">
            <Image src={property.cover_image_url || '/logo.png'} alt={property.name} fill className="object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div className="absolute bottom-6 left-8 text-white">
              <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 inline-block">Owner's Portal</span>
              <h1 className="text-3xl font-serif font-bold">{property.name}</h1>
            </div>
          </div>
          <div className="p-6 flex justify-between items-center bg-white">
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Rider</p>
                <p className="font-medium text-gray-900">Equivest Pro Team</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Current Level</p>
                <p className="font-medium text-gray-900">{property.experience_level || 'Premium'}</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Contact Trainer
            </button>
          </div>
        </div>

        <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="text-primary" /> Training Timeline
        </h2>

        {/* Timeline */}
        <div className="space-y-6">
          {updates.map((update, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex gap-6 relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${update.bg} ${update.color}`}>
                <update.icon size={24} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 mb-1">{update.date}</p>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{update.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{update.desc}</p>
                
                {update.type !== 'vet' && (
                  <div className="w-full max-w-sm h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors group">
                    <PlayCircle className="text-gray-400 group-hover:text-primary transition-colors w-12 h-12" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
