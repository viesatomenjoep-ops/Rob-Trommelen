import { getProperty } from '@/app/actions/property'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ShieldCheck, Printer, Stamp } from 'lucide-react'

export const metadata = {
  title: 'Valuation Certificate | Equivest',
  robots: 'noindex, nofollow'
}

export default async function CertificatePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  let property = null

  try {
    property = await getProperty(params.id)
  } catch (e) {
    notFound()
  }

  if (!property) notFound()

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const certNumber = `EQV-${new Date().getFullYear()}-${params.id.substring(0, 6).toUpperCase()}`

  return (
    <div className="bg-gray-200 min-h-screen py-12 px-4 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-end mb-4 print:hidden">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded shadow hover:bg-gray-50 transition-colors font-bold text-sm">
            <Printer size={16} /> Print / Save as PDF
          </button>
        </div>

        {/* Certificate Paper */}
        <div className="bg-white p-12 md:p-20 shadow-2xl relative border border-gray-300 print:shadow-none print:border-none">

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <ShieldCheck size={400} />
          </div>

          <div className="text-center border-b-2 border-primary pb-8 mb-10 relative z-10">
            <Image src="/logo.png" alt="Equivest" width={80} height={80} className="mx-auto mb-6" />
            <h1 className="text-4xl font-serif font-bold text-primary tracking-widest uppercase">Certificate of Valuation</h1>
            <p className="text-gray-500 mt-2 font-serif italic">Official Insurance Document</p>
          </div>

          <div className="relative z-10 font-serif text-gray-800 leading-relaxed">
            <p className="mb-6 text-justify">
              This document serves to certify the identity, health status, and current market valuation of the equine asset described below. This certificate is issued by Equivest Portfolio Management for insurance and syndication purposes.
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-200 pb-1">Asset Identity</h3>
                <p><strong>Registered Name:</strong> {property.name}</p>
                <p><strong>Year of Birth:</strong> {property.birth_year}</p>
                <p><strong>Gender:</strong> {property.gender}</p>
                <p><strong>Height:</strong> {property.height_cm ? `${property.height_cm} cm` : 'Not recorded'}</p>
                <p><strong>Discipline:</strong> {property.discipline}</p>
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-200 pb-1">Medical & Value</h3>
                <p><strong>Latest Vet Check:</strong> Approved (Low Risk)</p>
                <p><strong>X-Rays:</strong> PROK Certified</p>
                <p><strong>Level:</strong> {property.experience_level || 'Premium'}</p>
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
                  <p className="text-xs uppercase tracking-widest text-gray-500">Insured Value / Purchase Price</p>
                  <p className="text-2xl font-bold text-primary mt-1">{property.price_category}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mt-20 pt-10 border-t border-gray-200">
              <div>
                <p className="font-bold">Equivest Portfolio Management</p>
                <p className="text-sm text-gray-500">Issued on: {today}</p>
                <p className="text-xs text-gray-400 mt-1">Ref: {certNumber}</p>
              </div>
              <div className="text-center opacity-80 text-blue-900 flex flex-col items-center">
                <Stamp size={60} strokeWidth={1} className="mb-2" />
                <p className="font-[Signature] text-3xl -mt-4">Tom van Biene</p>
                <p className="text-xs font-sans font-bold uppercase tracking-widest border-t border-blue-900/30 pt-1 mt-1">Authorized Signature</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
