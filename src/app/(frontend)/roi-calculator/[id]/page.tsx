import { getProperty } from '@/app/actions/property'
import { notFound } from 'next/navigation'
import RoiClient from './RoiClient'

export const metadata = {
  title: 'ROI Calculator | Equivest',
  robots: 'noindex, nofollow'
}

export default async function RoiCalculatorPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  let property = null
  
  try {
    property = await getProperty(params.id)
  } catch (e) {
    notFound()
  }

  if (!property) notFound()

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Investment Projection</h1>
          <p className="text-gray-600">Interactive ROI calculator for <strong className="text-accent">{property.name}</strong></p>
        </div>
        <RoiClient property={property} />
      </div>
    </div>
  )
}
