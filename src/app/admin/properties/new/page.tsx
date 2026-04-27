'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProperty } from '@/app/actions/property'
import dynamic from 'next/dynamic'
const CloudinaryUploader = dynamic(() => import('@/components/admin/CloudinaryUploader'), { ssr: false })
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewPropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [type, setType] = useState<string>('Woonhuis')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await createProperty(formData)
      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }
      router.push('/admin/properties')
    } catch (err: any) {
      setError(err.message || "Failed to create property")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/properties" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Nieuwe Woning Toevoegen</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Basic Info */}
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Titel (bijv. "Prachtig appartement centrum") *</label>
              <input required type="text" name="title" id="title" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="street_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Straat en huisnummer *</label>
              <input required type="text" name="street_address" id="street_address" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Postcode *</label>
              <input required type="text" name="postal_code" id="postal_code" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plaats *</label>
              <input required type="text" name="city" id="city" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Land</label>
              <input type="text" name="country" id="country" defaultValue="Nederland" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prijs (€) *</label>
              <input required type="number" name="price" id="price" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="price_condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prijs Conditie</label>
              <select name="price_condition" id="price_condition" className="mt-1 block w-full appearance-auto rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm">
                <option value="k.k.">Kosten Koper (k.k.)</option>
                <option value="v.o.n.">Vrij op naam (v.o.n.)</option>
                <option value="p.m.">Per maand (p.m.)</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type Woning *</label>
              <select required value={type} onChange={(e) => setType(e.target.value)} name="type" id="type" className="mt-1 block w-full appearance-auto rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm">
                <option value="Woonhuis">Woonhuis</option>
                <option value="Appartement">Appartement</option>
                <option value="Bedrijfspand">Bedrijfspand</option>
                <option value="Overig">Overig</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select name="status" id="status" className="mt-1 block w-full appearance-auto rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm">
                <option value="Beschikbaar">Beschikbaar</option>
                <option value="Verkocht onder voorbehoud">Verkocht onder voorbehoud</option>
                <option value="Verkocht">Verkocht</option>
                <option value="Verhuurd">Verhuurd</option>
              </select>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Omschrijving</label>
              <textarea name="description" id="description" rows={6} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            {/* Documents & Links Section */}
            <div className="col-span-2 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Documenten & Media</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                
                {/* Funda */}
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="link_funda" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Funda Link</label>
                  <input type="url" name="link_funda" id="link_funda" placeholder="https://www.funda.nl/..." className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
                </div>

                {/* Video */}
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="link_video" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video Link (YouTube/Vimeo)</label>
                  <input type="url" name="link_video" id="link_video" placeholder="https://..." className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
                </div>

                {/* Brochure */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brochure (PDF)</label>
                  <CloudinaryUploader onUploadSuccess={(url) => {
                    const input = document.getElementById('doc_brochure') as HTMLInputElement;
                    if(input) input.value = url;
                  }} label="Upload Brochure" />
                  <input type="hidden" name="doc_brochure" id="doc_brochure" />
                </div>

                {/* Floorplan */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plattegrond (PDF/Afbeelding)</label>
                  <CloudinaryUploader onUploadSuccess={(url) => {
                    const input = document.getElementById('doc_floorplan') as HTMLInputElement;
                    if(input) input.value = url;
                  }} label="Upload Plattegrond" />
                  <input type="hidden" name="doc_floorplan" id="doc_floorplan" />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="col-span-2 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Hoofdafbeelding</h3>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Afbeelding</label>
              <CloudinaryUploader onUploadSuccess={(url) => {
                const input = document.getElementById('cover_image_url') as HTMLInputElement;
                if(input) input.value = url;
              }} label="Upload Hoofdafbeelding" />
              <input type="hidden" name="cover_image_url" id="cover_image_url" />
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Opslaan...</>
              ) : (
                'Woning Opslaan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
