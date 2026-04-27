'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProperty, updateProperty } from '@/app/actions/property'
import dynamic from 'next/dynamic'
const CloudinaryUploader = dynamic(() => import('@/components/admin/CloudinaryUploader'), { ssr: false })
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import PropertyLinkScanner from '@/components/admin/PropertyLinkScanner'
import Image from 'next/image'
import PropertyResultsManager from '@/components/admin/PropertyResultsManager'

export default function EditPropertyPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProperty() {
      try {
        const params = await props.params
        const data = await getProperty(params.id)
        setProperty(data)
        setCoverImageUrl(data.cover_image_url)
      } catch (err: any) {
        setError(err.message || 'Failed to load property details')
      } finally {
        setIsLoading(false)
      }
    }
    loadProperty()
  }, [props.params])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    if (coverImageUrl) {
      formData.append('cover_image_url', coverImageUrl)
    }

    try {
      const params = await props.params
      const result = await updateProperty(params.id, formData)
      
      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }
      
      router.push('/admin/properties')
    } catch (err: any) {
      setError(err.message || "Failed to update property")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
  }

  if (!property && !isLoading) {
    return <div className="text-center p-12 text-red-500">Property not found or error loading data.</div>
  }

  const handleApplyData = (data: { name: string, image: string, description: string, price: number }) => {
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    if (nameInput && data.name) nameInput.value = data.name;

    const descInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
    if (descInput && data.description) descInput.value = data.description;

    const priceInput = document.querySelector('input[name="price"]') as HTMLInputElement;
    if (priceInput && data.price > 0) priceInput.value = data.price.toString();

    if (data.image) {
      setCoverImageUrl(data.image);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/properties" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Edit Property</h1>
      </div>

      <PropertyLinkScanner onApply={handleApplyData} />

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Basic Info */}
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Name *</label>
              <input required defaultValue={property.name} type="text" name="name" id="name" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Category *</label>
              <select required defaultValue={property.category || 'sales'} name="category" id="category" className="mt-1 block w-full appearance-auto rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm">
                <option value="sales">Sales Property (Public Inventory)</option>
                <option value="investment">Investment Property (Private Portfolio)</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="birth_year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Birth Year *</label>
              <input required defaultValue={property.birth_year} type="number" name="birth_year" id="birth_year" min="1990" max={new Date().getFullYear()} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender *</label>
              <select required defaultValue={property.gender} name="gender" id="gender" className="mt-1 block w-full appearance-auto rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm">
                <option value="Mare">Mare</option>
                <option value="Gelding">Gelding</option>
                <option value="Stallion">Stallion</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="height_cm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
              <input type="number" defaultValue={property.height_cm || ''} name="height_cm" id="height_cm" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="discipline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Discipline / Category *</label>
              <select required defaultValue={property.discipline} name="discipline" id="discipline" className="mt-1 block w-full appearance-auto rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm">
                <option value="Jumping properties">Jumping properties</option>
                <option value="Hunters">Hunters</option>
                <option value="Equitation properties">Equitation properties</option>
                <option value="Ponies">Ponies</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience Level</label>
              <input type="text" defaultValue={property.experience_level || ''} name="experience_level" id="experience_level" placeholder="e.g. Grand Prix, L, M, Unbroken" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="price_category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Category *</label>
              <select required defaultValue={property.price_category} name="price_category" id="price_category" className="mt-1 block w-full appearance-auto rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm">
                <option value="Price on Request">Price on Request</option>
                <option value="€10k-25k">€10k-25k</option>
                <option value="€25k-50k">€25k-50k</option>
                <option value="€50k-100k">€50k-100k</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select name="status" defaultValue={property.status} id="status" className="mt-1 block w-full appearance-auto rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm">
                <option value="Available">Available</option>
                <option value="Under Offer / Vet Check">Under Offer / Vet Check</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="sire" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sire</label>
              <input type="text" defaultValue={property.sire || ''} name="sire" id="sire" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="dam_sire" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dam Sire</label>
              <input type="text" defaultValue={property.dam_sire || ''} name="dam_sire" id="dam_sire" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea name="description" defaultValue={property.description || ''} id="description" rows={4} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
            </div>

            {/* Investment Data */}
            <div className="col-span-2 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-accent dark:text-accent mb-4">Investment Data & ROI</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="estimated_roi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated ROI / Profit</label>
                  <input type="text" name="estimated_roi" id="estimated_roi" defaultValue={property.estimated_roi || ''} placeholder="e.g. 15-20% within 12 months" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-accent focus:ring-accent sm:text-sm" />
                </div>
                <div className="col-span-2">
                  <label htmlFor="investment_rationale" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Why invest in this property?</label>
                  <textarea name="investment_rationale" id="investment_rationale" defaultValue={property.investment_rationale || ''} rows={3} placeholder="Explain the potential, training timeline, and financial strategy..." className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-accent focus:ring-accent sm:text-sm" />
                </div>
              </div>
            </div>

            {/* Documents & Links Section */}
            <div className="col-span-2 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Documents & Links</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                
                {/* FEI / Lifescore */}
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="link_fei" className="block text-sm font-medium text-gray-700 dark:text-gray-300">FEI / Lifescore Link</label>
                  <input type="url" name="link_fei" id="link_fei" defaultValue={property.link_fei || ''} placeholder="https://..." className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
                </div>

                {/* PropertyTelex */}
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="link_propertytelex" className="block text-sm font-medium text-gray-700 dark:text-gray-300">PropertyTelex Link</label>
                  <input type="url" name="link_propertytelex" id="link_propertytelex" defaultValue={property.link_propertytelex || ''} placeholder="https://..." className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
                </div>

                {/* Video */}
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="link_video" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video Link (e.g. YouTube/Vimeo) OR Upload</label>
                  <div className="mt-1 flex flex-col gap-2">
                    <input type="url" name="link_video" id="link_video" defaultValue={property.link_video || ''} placeholder="https://..." className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" />
                    <CloudinaryUploader onUploadSuccess={(url) => {
                      const input = document.getElementById('link_video') as HTMLInputElement;
                      if(input) input.value = url;
                    }} label="Upload Video File" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave blank if pending</p>
                </div>

                {/* Vet Check */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vet Check / Keuring Document</label>
                  {property.doc_vet_check && <p className="text-xs text-green-600 mb-2">Currently uploaded: <a href={property.doc_vet_check} target="_blank" className="underline">View</a></p>}
                  <CloudinaryUploader onUploadSuccess={(url) => {
                    const input = document.getElementById('doc_vet_check') as HTMLInputElement;
                    if(input) input.value = url;
                  }} label="Upload Document" />
                  <input type="hidden" name="doc_vet_check" id="doc_vet_check" defaultValue={property.doc_vet_check || ''} />
                </div>

                {/* X-Rays */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">X-Rays Document/Archive</label>
                  {property.doc_xrays && <p className="text-xs text-green-600 mb-2">Currently uploaded: <a href={property.doc_xrays} target="_blank" className="underline">View</a></p>}
                  <CloudinaryUploader onUploadSuccess={(url) => {
                    const input = document.getElementById('doc_xrays') as HTMLInputElement;
                    if(input) input.value = url;
                  }} label="Upload Document" />
                  <input type="hidden" name="doc_xrays" id="doc_xrays" defaultValue={property.doc_xrays || ''} />
                </div>

                {/* Passport Scan */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Passport Scan</label>
                  {property.doc_passport && <p className="text-xs text-green-600 mb-2">Currently uploaded: <a href={property.doc_passport} target="_blank" className="underline">View</a></p>}
                  <CloudinaryUploader onUploadSuccess={(url) => {
                    const input = document.getElementById('doc_passport') as HTMLInputElement;
                    if(input) input.value = url;
                  }} label="Upload Document" />
                  <input type="hidden" name="doc_passport" id="doc_passport" defaultValue={property.doc_passport || ''} />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="col-span-2 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Media</h3>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>
              <div className="mb-4">
                {coverImageUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-4">
                    <Image src={coverImageUrl} alt="Current cover preview" fill className="object-cover" />
                    <button type="button" onClick={() => setCoverImageUrl(null)} className="absolute top-2 right-2 bg-white text-red-600 px-2 py-1 rounded text-xs shadow">Remove</button>
                  </div>
                )}
                <div className={coverImageUrl ? "hidden" : "block"}>
                  <CloudinaryUploader onUploadSuccess={setCoverImageUrl} label="Upload New Cover Image" />
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
                'Update Property'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Competition Results Manager */}
      <PropertyResultsManager propertyId={property.id} />
    </div>
  )
}
