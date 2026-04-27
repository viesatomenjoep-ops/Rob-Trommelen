import { getProperty } from '@/app/actions/property'
import { notFound, redirect } from 'next/navigation'
import { Stethoscope, FileText, FileCheck, ShieldAlert, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'VIP Asset Data Room | Equivest',
  robots: 'noindex, nofollow'
}

export default async function VIPAccessPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ token?: string }> }) {
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

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      <div className="bg-primary text-white py-4 px-4 sm:px-8 flex justify-between items-center shadow-lg relative z-50">
        <div className="flex items-center gap-6">
          <Link 
            href={`/properties/${property.id}`} 
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-bold tracking-widest uppercase text-xs transition-all shadow-md"
          >
            <ArrowLeft size={16} /> Back to Property
          </Link>
          <h1 className="font-serif font-bold text-lg sm:text-xl hidden sm:block">Equivest VIP Data Room</h1>
        </div>
        <div className="flex items-center gap-2 bg-red-500/20 text-red-100 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs font-bold border border-red-500/30">
          <ShieldAlert size={14} /> <span className="hidden sm:inline">Link Expires in 24h</span><span className="sm:hidden">24h</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Vetting & Documents: {property.name}</h2>
          <p className="text-gray-600">Secure access granted via temporary token.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Vet Check */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <Stethoscope size={32} />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Vet Check</h3>
            <p className="text-sm text-gray-500 mb-8 flex-1">Complete clinical examination report from certified equine veterinarians.</p>
            {property.doc_vet_check ? (
              <a href={property.doc_vet_check} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors">
                View Report
              </a>
            ) : (
              <button disabled className="w-full py-3 bg-gray-100 text-gray-400 rounded-lg font-bold cursor-not-allowed">
                Pending Upload
              </button>
            )}
          </div>

          {/* X-Rays */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
              <FileText size={32} />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Radiographs</h3>
            <p className="text-sm text-gray-500 mb-8 flex-1">Complete set of recent X-Rays (PROK standards) available for review.</p>
            {property.doc_xrays ? (
              <a href={property.doc_xrays} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors">
                View X-Rays
              </a>
            ) : (
              <button disabled className="w-full py-3 bg-gray-100 text-gray-400 rounded-lg font-bold cursor-not-allowed">
                Pending Upload
              </button>
            )}
          </div>

          {/* Passport */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6">
              <FileCheck size={32} />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Passport Scan</h3>
            <p className="text-sm text-gray-500 mb-8 flex-1">Official FEI/National passport including breeding history and vaccinations.</p>
            {property.doc_passport ? (
              <a href={property.doc_passport} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors">
                View Passport
              </a>
            ) : (
              <button disabled className="w-full py-3 bg-gray-100 text-gray-400 rounded-lg font-bold cursor-not-allowed">
                Pending Upload
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-sm text-yellow-800 text-center">
          <strong>Confidentiality Notice:</strong> The documents provided are the intellectual property of Equivest Portfolio Management and are intended solely for the use of the individual receiving this link. Redistribution is prohibited.
        </div>
      </div>
    </div>
  )
}
