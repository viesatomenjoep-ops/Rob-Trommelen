import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ShieldCheck, ArrowRight, Building, Globe, Copy, CheckCircle } from 'lucide-react'
import { getProperty } from '@/app/actions/property'

export const metadata = {
  title: 'Secure Wire Transfer | Equivest',
  robots: 'noindex, nofollow'
}

export default async function PaymentPage(props: { 
  params: Promise<{ token: string }>,
  searchParams: Promise<{ property?: string, amount?: string, currency?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  
  if (!params.token || params.token.length < 5) notFound()

  let propertyName = "Equivest Asset"
  if (searchParams.property) {
    try {
      const h = await getProperty(searchParams.property)
      if (h) propertyName = h.name
    } catch(e) {}
  }

  const amount = searchParams.amount ? parseFloat(searchParams.amount).toLocaleString() : "0.00"
  const currency = searchParams.currency || "EUR"
  const ref = "EQV-" + params.token.substring(0, 6).toUpperCase()

  // Fake WISE details
  const wiseDetails = {
    accountName: "Equivest Portfolio Management B.V.",
    iban: "BE68 3000 1234 5678",
    bic: "TWISEBE1",
    bankName: "WISE Europe SA",
    bankAddress: "Avenue Louise 54, 1050 Brussels, Belgium"
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-sans">
      <div className="max-w-2xl mx-auto px-4">
        
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Equivest" width={60} height={60} className="mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-primary">Secure Wire Transfer</h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
            <Globe size={14} /> International Payment Instructions
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#9fe870] p-8 border-b border-[#8ae053] flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-[#163300] uppercase tracking-wider text-xs font-bold block mb-1">Amount Due</span>
              <p className="text-5xl font-serif font-bold text-[#163300]">{currency} {amount}</p>
            </div>
            <div className="bg-[#163300] text-white px-4 py-2 rounded-lg text-sm text-center">
              <span className="block text-white/70 text-xs mb-1">Payment Reference</span>
              <span className="font-mono font-bold tracking-widest">{ref}</span>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-2">Transaction Details</h3>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Asset / Property</span>
                <span className="font-bold text-gray-900">{propertyName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Beneficiary</span>
                <span className="font-bold text-gray-900">{wiseDetails.accountName}</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 relative">
              <div className="absolute top-4 right-4 text-[#9fe870] bg-[#163300] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                Powered by WISE
              </div>
              
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building size={20} className="text-[#163300]" /> Bank Transfer Details
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">IBAN / Account Number</span>
                  <div className="bg-white p-3 border border-gray-200 rounded-md font-mono text-gray-900 font-bold flex justify-between items-center">
                    {wiseDetails.iban}
                  </div>
                </div>
                
                <div>
                  <span className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">BIC / SWIFT Code</span>
                  <div className="bg-white p-3 border border-gray-200 rounded-md font-mono text-gray-900 font-bold flex justify-between items-center">
                    {wiseDetails.bic}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Bank Name & Address</span>
                  <p className="text-sm text-gray-700 bg-white p-3 border border-gray-200 rounded-md">
                    <strong>{wiseDetails.bankName}</strong><br/>
                    {wiseDetails.bankAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-lg flex items-start gap-3 mb-6">
              <ShieldCheck className="flex-shrink-0 mt-0.5" size={18} />
              <p>
                <strong>Important:</strong> You must include the Payment Reference <strong>{ref}</strong> in your wire transfer notes to ensure immediate allocation to your account.
              </p>
            </div>
            
            <p className="text-center text-xs text-gray-400 mt-6 flex justify-center items-center gap-1">
              Secure international transfers via WISE Institutional.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
