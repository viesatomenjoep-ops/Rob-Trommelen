'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTeamMember } from '@/app/actions/team'
import dynamic from 'next/dynamic'
const CloudinaryUploader = dynamic(() => import('@/components/admin/CloudinaryUploader'), { ssr: false })
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function NewTeamMemberPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    if (imageUrl) {
      formData.append('image_url', imageUrl)
    }

    try {
      const result = await createTeamMember(formData)
      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }
      router.push('/admin/team')
    } catch (err: any) {
      setError(err.message || "Failed to add team member")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/team" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Add Team Member</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                <input required type="text" name="name" id="name" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role / Title *</label>
                <input required type="text" name="role" id="role" placeholder="e.g. Head Trainer" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort Order</label>
              <input type="number" name="sort_order" id="sort_order" defaultValue={0} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
              <p className="mt-1 text-xs text-gray-500">Lower numbers appear first. (0 is default)</p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Biography</label>
              <textarea name="bio" id="bio" rows={4} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Photo</label>
              <div className="mb-4">
                {imageUrl && (
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-4 mx-auto">
                    <Image src={imageUrl} alt="Profile preview" fill className="object-cover" />
                    <button type="button" onClick={() => setImageUrl(null)} className="absolute top-2 right-2 bg-white text-red-600 px-2 py-1 rounded text-xs shadow">Remove</button>
                  </div>
                )}
                <div className={imageUrl ? "hidden" : "block"}>
                  <CloudinaryUploader onUploadSuccess={setImageUrl} label="Upload Profile Photo" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
              ) : (
                'Add Team Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
