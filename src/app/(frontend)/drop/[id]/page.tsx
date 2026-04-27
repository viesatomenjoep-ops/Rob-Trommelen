'use client'

import { useState } from 'react'
import { CloudUpload, FileCheck, Shield, UploadCloud } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function DocumentDropPage() {
  const params = useParams()
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleDrop = (e: any) => {
    e.preventDefault()
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setSuccess(true)
    }, 2000)
  }

  return (
    <div className="bg-gray-50 min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        
        <div className="text-center mb-10">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Equivest Secure Drop</h1>
          <p className="text-gray-500">Upload Vet Checks, X-Rays, or 4K Videos directly to the Equivest Vault.</p>
          <p className="text-xs text-gray-400 mt-2">Asset Ref: {params.id}</p>
        </div>

        {success ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-green-100">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileCheck size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Complete</h2>
            <p className="text-gray-500">Files have been securely encrypted and transferred to Equivest Portfolio Management.</p>
            <button onClick={() => setSuccess(false)} className="mt-8 text-accent font-bold hover:underline">Upload more files</button>
          </div>
        ) : (
          <div 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={handleDrop}
            className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
          >
            {uploading ? (
              <div className="py-12">
                <UploadCloud className="w-16 h-16 text-accent mx-auto mb-6 animate-bounce" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transferring to Vault...</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4 max-w-xs mx-auto overflow-hidden">
                  <div className="bg-accent h-2 rounded-full animate-[pulse_1s_ease-in-out_infinite] w-2/3"></div>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <CloudUpload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Drag & Drop files here</h3>
                <p className="text-gray-500 text-sm mb-6">Supports .mp4, .pdf, .jpg, .png (Max 2GB per file)</p>
                <button onClick={() => {
                  setUploading(true)
                  setTimeout(() => {setUploading(false); setSuccess(true)}, 2000)
                }} className="px-8 py-3 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-secondary transition-colors">
                  Browse Files
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
