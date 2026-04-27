'use client'

import { useState } from 'react'
import { Stethoscope, FileText, UploadCloud, ShieldAlert, CheckCircle } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function VetOpinionPage() {
  const params = useParams()
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="bg-gray-50 min-h-screen pt-32 pb-20 flex flex-col items-center px-4">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Report Submitted</h1>
        <p className="text-gray-500 text-center max-w-md">Thank you. Your second opinion report has been securely uploaded to Equivest Portfolio Management.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          
          <div className="bg-slate-900 text-white p-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold mb-1 flex items-center gap-2">
                <Stethoscope /> Virtual Vet Room
              </h1>
              <p className="text-slate-400 text-sm">Strictly confidential medical data for Asset #{params.id}</p>
            </div>
            <div className="bg-red-500/20 text-red-200 px-3 py-1 rounded text-xs font-bold border border-red-500/30 flex items-center gap-1">
              <ShieldAlert size={14} /> DVM Access Only
            </div>
          </div>

          <div className="grid md:grid-cols-2 p-8 gap-12">
            <div>
              <h3 className="font-bold text-gray-900 mb-6 text-lg border-b pb-2">Available Medical Files</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Clinical Vet Check</p>
                      <p className="text-xs text-gray-500">PDF • 2.4 MB • Oct 12, 2026</p>
                    </div>
                  </div>
                  <span className="text-primary font-bold text-sm">Download</span>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Full X-Ray Set (PROK)</p>
                      <p className="text-xs text-gray-500">ZIP • 145 MB • Oct 12, 2026</p>
                    </div>
                  </div>
                  <span className="text-primary font-bold text-sm">Download</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                By downloading these files, you agree to maintain strict confidentiality. These documents are the intellectual property of Equivest.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-6 text-lg border-b pb-2">Submit Your Findings</h3>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Veterinarian Name / Clinic</label>
                  <input type="text" required className="w-full border-gray-300 rounded focus:ring-accent focus:border-accent" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Overall Assessment</label>
                  <select required className="w-full border-gray-300 rounded focus:ring-accent focus:border-accent">
                    <option value="">Select risk level...</option>
                    <option value="low">Low Risk (Approved)</option>
                    <option value="medium">Medium Risk (Acceptable with remarks)</option>
                    <option value="high">High Risk (Not recommended)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Upload Report (PDF)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary cursor-pointer transition-colors bg-gray-50">
                    <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm font-bold text-gray-600">Click to upload report</span>
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors mt-2">
                  Securely Submit Report
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
