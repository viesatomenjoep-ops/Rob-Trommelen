import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Check, Trophy, Ruler, Calendar, Shield, Activity } from 'lucide-react'

export const metadata = {
  title: 'Compare Properties | Equivest',
}

export default async function ComparePage(props: { params: Promise<{ ids: string }> }) {
  const params = await props.params
  const decodedIds = decodeURIComponent(params.ids)
  const ids = decodedIds.split(',')
  
  if (ids.length < 2 || ids.length > 3) notFound()

  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .in('id', ids)

  if (!properties || properties.length < 2) notFound()

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Investment Comparison</h1>
          <p className="text-gray-600">Side-by-side analysis of your selected sport properties.</p>
        </div>

        <div className="overflow-x-auto pb-8">
          <div className="min-w-[800px] grid" style={{ gridTemplateColumns: `minmax(200px, 1fr) repeat(${properties.length}, minmax(300px, 1fr))` }}>
            {/* Headers row */}
            <div className="p-4 flex items-end font-bold text-gray-500 uppercase tracking-widest text-sm border-b-2 border-gray-100">
              Attributes
            </div>
            {properties.map(h => (
              <div key={h.id} className="p-4 border-b-2 border-gray-100 text-center">
                <div className="w-full aspect-[4/3] relative rounded-xl overflow-hidden mb-4 shadow-md">
                  <Image src={h.cover_image_url || '/logo.png'} alt={h.name} fill className="object-cover" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-primary">{h.name}</h2>
                <p className="text-accent font-bold text-sm uppercase tracking-widest mt-1">{h.price_category}</p>
              </div>
            ))}

            {/* Rows */}
            <div className="p-4 border-b border-gray-100 font-medium text-gray-700 flex items-center gap-2"><Trophy size={18}/> Level</div>
            {properties.map(h => <div key={h.id} className="p-4 border-b border-gray-100 text-center font-bold">{h.experience_level || '-'}</div>)}

            <div className="p-4 border-b border-gray-100 font-medium text-gray-700 flex items-center gap-2"><Calendar size={18}/> Birth Year</div>
            {properties.map(h => <div key={h.id} className="p-4 border-b border-gray-100 text-center">{h.birth_year}</div>)}

            <div className="p-4 border-b border-gray-100 font-medium text-gray-700 flex items-center gap-2"><Shield size={18}/> Gender</div>
            {properties.map(h => <div key={h.id} className="p-4 border-b border-gray-100 text-center">{h.gender}</div>)}

            <div className="p-4 border-b border-gray-100 font-medium text-gray-700 flex items-center gap-2"><Ruler size={18}/> Height</div>
            {properties.map(h => <div key={h.id} className="p-4 border-b border-gray-100 text-center">{h.height_cm ? `${h.height_cm} cm` : '-'}</div>)}

            <div className="p-4 border-b border-gray-100 font-medium text-gray-700 flex items-center gap-2"><Activity size={18}/> Status</div>
            {properties.map(h => (
              <div key={h.id} className="p-4 border-b border-gray-100 text-center flex justify-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold"><Check size={14}/> {h.status}</span>
              </div>
            ))}

            {/* Description Row */}
            <div className="p-4 font-medium text-gray-700 flex items-start gap-2 pt-8">Overview</div>
            {properties.map(h => (
              <div key={h.id} className="p-4 pt-8 text-sm text-gray-600 leading-relaxed text-center">
                {h.description?.substring(0, 200)}...
                <br/><br/>
                <a href={`/properties/${h.id}`} className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-md font-bold hover:bg-secondary transition-colors text-sm">View Full Profile</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
