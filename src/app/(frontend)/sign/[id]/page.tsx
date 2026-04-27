'use client'

import { useState } from 'react'
import { FileSignature, Shield, CheckCircle } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function SignDocumentPage() {
  const params = useParams()
  const [signed, setSigned] = useState(false)
  const [name, setName] = useState('')

  if (signed) {
    return (
      <div className="bg-gray-50 min-h-screen pt-32 pb-20 flex flex-col items-center px-4">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Document Signed</h1>
        <p className="text-gray-500 text-center max-w-md">Thank you. The legally binding document has been recorded and a copy has been emailed to you and Equivest Portfolio Management.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-primary flex items-center justify-center gap-2">
            <FileSignature /> Secure E-Signature
          </h1>
          <p className="text-sm text-gray-500 mt-2">Digital Bill of Sale / Syndicate Agreement</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Document Preview */}
          <div className="bg-gray-100 p-8 h-96 overflow-y-auto border-b border-gray-200 text-sm text-gray-700 leading-relaxed font-serif">
            <h2 className="text-xl font-bold mb-6 text-center underline">EQUIVEST SALES AGREEMENT</h2>
            <p className="mb-4">This Agreement is entered into on this day between Equivest Portfolio Management (Seller) and the undersigned (Buyer).</p>
            <p className="mb-4"><strong>1. Asset:</strong> The Seller agrees to sell the sport property referenced by ID: {params.id}.</p>
            <p className="mb-4"><strong>2. Terms:</strong> The Buyer agrees to the terms and conditions outlined in the official Equivest documentation, including but not limited to the pre-purchase examination clauses and transfer of ownership protocols.</p>
            <p className="mb-4"><strong>3. Condition:</strong> The asset is sold "as is" pending the completion and approval of the requested veterinary checks.</p>
            {/* Add lots of dummy text to make it scrollable */}
            {[...Array(5)].map((_, i) => (
               <p key={i} className="mb-4 text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.</p>
            ))}
          </div>

          {/* Signature Pad area */}
          <div className="p-8">
            <h3 className="font-bold text-gray-900 mb-4">Sign Below</h3>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Print Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border-gray-300 rounded focus:ring-accent focus:border-accent" placeholder="Enter your full legal name" />
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 mb-6 flex items-center justify-center bg-gray-50 relative cursor-crosshair">
              {name ? (
                <span className="font-[Signature] text-4xl text-blue-900 absolute opacity-80">{name}</span>
              ) : (
                <span className="text-gray-400 text-sm">Draw signature here</span>
              )}
            </div>

            <button onClick={() => name ? setSigned(true) : alert('Please enter your name to sign.')} className="w-full py-4 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors shadow-md flex justify-center items-center gap-2">
              <Shield size={18} /> Agree and Sign Document
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">By clicking sign, you agree that this digital signature is legally binding.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
