'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { UploadCloud, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string) => void
  label?: string
}

export default function CloudinaryUploader({ onUploadSuccess, label = "Upload Image" }: CloudinaryUploaderProps) {
  const [error, setError] = useState<string | null>(null)
  
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!preset || !cloudName) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-600">
        <AlertCircle size={20} />
        <span className="text-sm font-medium">Missing Cloudinary Keys in Vercel! Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</span>
      </div>
    )
  }

  return (
    <CldUploadWidget 
      uploadPreset={preset}
      options={{ resourceType: 'auto', maxFileSize: 500000000, clientAllowedFormats: ['png', 'jpeg', 'jpg', 'pdf', 'mp4', 'mov', 'webm'] }}
      onError={(err: any) => {
        console.error("Cloudinary upload error:", err)
        setError("Failed to upload image. Please check your Cloudinary settings.")
      }}
      onSuccess={(result: any) => {
        setError(null)
        if (result?.info?.secure_url) {
          onUploadSuccess(result.info.secure_url)
        }
      }}
    >
      {({ open }) => {
        return (
          <div className="w-full">
            <button
              type="button"
              onClick={() => open()}
              className="w-full flex justify-center items-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <UploadCloud size={24} />
              <span className="font-medium">{label}</span>
            </button>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>
        )
      }}
    </CldUploadWidget>
  )
}
