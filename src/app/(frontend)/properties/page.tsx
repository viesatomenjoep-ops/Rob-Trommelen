import { getPublicProperties } from '@/app/actions/property'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ShieldCheck, Eye } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Woningaanbod | Rob Trommelen Makelaardij',
  description: 'Bekijk het actuele woningaanbod in Oosterhout en omstreken bij Rob Trommelen Makelaars & Taxateurs.',
  keywords: 'makelaar oosterhout, huizen te koop, woningaanbod, trommelen makelaardij'
}

export default async function CollectionPage(props: { searchParams: Promise<{ type?: string }> }) {
  const searchParams = await props.searchParams
  const selectedType = searchParams?.type || 'Alle'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  // Try to fetch properties. If Supabase is not connected yet, we'll gracefully handle it.
  let properties = [];
  let errorMsg = null;
  try {
    properties = await getPublicProperties() || [];
  } catch (error: any) {
    console.error("Supabase error:", error);
    errorMsg = error.message;
  }

  // Filter properties by type if selected
  const displayedProperties = selectedType === 'Alle' 
    ? properties 
    : properties.filter((h: any) => h.type === selectedType)

  const propertyTypes = ['Alle', 'Woonhuis', 'Appartement', 'Bedrijfspand', 'Overig']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col border-b border-gray-200 dark:border-gray-800 pb-6 mb-8 gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-primary dark:text-white">Woningaanbod</h1>
            {isLoggedIn && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-sm font-bold border border-green-200 dark:border-green-800/30 shadow-sm animate-fade-in">
                  <ShieldCheck size={16} className="mr-2" />
                  Beheerder Toegang
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {propertyTypes.map(type => (
            <Link 
              key={type} 
              href={type === 'Alle' ? '/properties' : `/properties?type=${encodeURIComponent(type)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedType === type 
                  ? 'bg-primary text-white dark:bg-white dark:text-gray-900' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {type}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {errorMsg ? (
          <div className="col-span-full py-12 text-center text-red-500 bg-red-50 rounded-xl">
            <p className="font-bold">Database Fout (Supabase is mogelijk nog niet gekoppeld):</p>
            <p>{errorMsg}</p>
          </div>
        ) : displayedProperties.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            Geen woningen gevonden in deze categorie. Zodra je Supabase koppelt, verschijnen hier de woningen.
          </div>
        ) : (
          displayedProperties.map((property: any) => (
            <div key={property.id} className="group relative">
              <div className="min-h-80 aspect-square w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center">
                <img
                  src={property.cover_image_url || '/logo.png'}
                  alt={property.title}
                  className={`absolute inset-0 h-full w-full ${property.cover_image_url ? 'object-cover blur-xl opacity-40 scale-110' : 'object-contain opacity-10 p-10'}`}
                />
                <img
                  src={property.cover_image_url || '/logo.png'}
                  alt={property.title}
                  className={`relative h-full w-full ${property.cover_image_url ? 'object-contain' : 'object-contain p-12'} group-hover:scale-105 transition-transform duration-500 z-10`}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-lg text-primary font-serif font-semibold">
                    <Link href={`/properties/${property.id}`}>
                      <span aria-hidden="true" className="absolute inset-0 z-20" />
                      {property.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{property.street_address}, {property.city}</p>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">€ {Number(property.price).toLocaleString('nl-NL')} {property.price_condition}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SEO Section */}
      <div className="mt-24 pt-12 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-serif font-bold text-primary dark:text-white mb-4">Trommelen Makelaars & Taxateurs</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm max-w-4xl">
          Trommelen Makelaars en Taxateurs is een makelaarskantoor gevestigd aan de Heuvel 10 in Oosterhout. Het kantoor wordt geleid door Rob Trommelen. Wij staan bekend om onze persoonlijke aanpak en uitgebreide ervaring in de huizenmarkt.
        </p>
      </div>
    </div>
  )
}
