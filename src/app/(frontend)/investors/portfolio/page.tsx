import { getInvestmentProperties } from '@/app/actions/property'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PrivatePortfolioPage() {
  let properties = [];
  let errorMsg = null;

  try {
    properties = await getInvestmentProperties() || [];
  } catch (error: any) {
    errorMsg = error.message;
  }

  if (errorMsg) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-12 border border-gray-100 dark:border-gray-700">
            <Lock className="w-16 h-16 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-serif font-bold text-primary dark:text-white mb-4">Private Access Only</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
              This portfolio is strictly reserved for our registered investors. Please log in to view our exclusive investment properties.
            </p>
            <Link href="/auth/login" className="px-8 py-3 bg-accent text-white font-bold rounded-full hover:bg-primary transition-colors">
              Log in to view Portfolio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline border-b border-gray-200 dark:border-gray-800 pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight text-primary flex items-center gap-3">
              <Lock className="text-accent" /> Private Investment Portfolio
            </h1>
            <p className="text-gray-500 mt-2">Exclusive overview of our current investment properties.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {properties.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              No investment properties currently available in the portfolio.
            </div>
          ) : (
            properties.map((property: any) => (
              <div key={property.id} className="group relative">
                <div className="min-h-80 aspect-square w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={property.cover_image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
                    alt={property.name}
                    className="absolute inset-0 h-full w-full object-cover blur-xl opacity-40 scale-110"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={property.cover_image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
                    alt={property.name}
                    className="relative h-full w-full object-contain group-hover:scale-105 transition-transform duration-500 z-10"
                  />
                  <div className="absolute top-2 right-2 z-20 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    INVESTMENT
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-lg text-primary font-serif font-semibold">
                      <Link href={`/properties/${property.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {property.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{property.discipline} &bull; {property.birth_year}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{property.price_category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
