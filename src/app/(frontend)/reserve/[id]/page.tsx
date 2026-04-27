import { getProperty } from '@/app/actions/property'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ShieldCheck, Clock, FileCheck } from 'lucide-react'

export const metadata = {
  title: 'Secure Reservation | Equivest',
  robots: 'noindex, nofollow'
}

export default async function ReservePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  let property = null
  
  try {
    property = await getProperty(params.id)
  } catch (e) {
    notFound()
  }

  if (!property) notFound()

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-primary text-white p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
              <ShieldCheck size={200} />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-2 relative z-10">Secure Asset Reservation</h1>
            <p className="text-white/80 relative z-10">Request a Pre-Purchase Exam (PPE) and hold for 48 hours.</p>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-12">
            {/* Property Details */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">Selected Asset</h3>
              <div className="flex gap-4 items-center mb-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden relative shadow-md">
                  <Image src={property.cover_image_url || '/logo.png'} alt={property.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl text-primary">{property.name}</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-widest">{property.discipline} • {property.birth_year}</p>
                  <p className="text-sm font-bold text-accent mt-1">{property.price_category}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-start gap-3">
                  <Clock className="text-accent flex-shrink-0" size={20} />
                  <p><strong>48-Hour Hold:</strong> Reserving this property temporarily removes it from the public market while we process your request.</p>
                </div>
                <div className="flex items-start gap-3">
                  <FileCheck className="text-accent flex-shrink-0" size={20} />
                  <p><strong>PPE Request:</strong> Our team will contact you within 24 hours to schedule the official Pre-Purchase Examination with a certified veterinarian.</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">Your Details</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name / Entity</label>
                  <input type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring focus:ring-accent/20" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                  <input type="email" className="w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring focus:ring-accent/20" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                  <input type="tel" className="w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring focus:ring-accent/20" required />
                </div>
                <div className="pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 rounded text-accent focus:ring-accent" required />
                    <span className="text-xs text-gray-500 leading-relaxed">I understand that this request is subject to approval by Equivest Portfolio Management and does not constitute a legally binding purchase agreement until the PPE is approved.</span>
                  </label>
                </div>
                <button type="button" onClick={() => alert('This is a demo. In production, this would open a Stripe checkout or send a confirmation email.')} className="w-full py-4 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors mt-4 flex items-center justify-center gap-2">
                  <ShieldCheck size={20} /> Submit Reservation Request
                </button>
              </form>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
