'use client'

import { useState, useEffect } from 'react'
import { getProperty } from '@/app/actions/property'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import { Timer, AlertTriangle, ArrowRight } from 'lucide-react'

export default function FlashSalePage() {
  const params = useParams()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60) // 48 hours in seconds

  useEffect(() => {
    async function load() {
      try {
        const data = await getProperty(params.id as string)
        if (!data) notFound()
        setProperty(data)
      } catch (e) {
        notFound()
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
  if (!property) return null

  if (timeLeft === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <Timer size={64} className="text-red-500 mb-6" />
        <h1 className="text-4xl font-serif font-bold mb-4">Offer Expired</h1>
        <p className="text-gray-400">This off-market flash sale has permanently closed.</p>
      </div>
    )
  }

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      
      {/* Sticky Top Bar */}
      <div className="bg-red-600 text-white p-3 flex justify-center items-center gap-4 sticky top-0 z-50 shadow-lg">
        <AlertTriangle size={20} className="animate-pulse" />
        <span className="font-bold uppercase tracking-widest text-sm">Confidential Off-Market Opportunity</span>
        <div className="bg-black/20 px-3 py-1 rounded font-mono font-bold">
          {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">{property.name}</h1>
          <p className="text-gray-400 uppercase tracking-widest">{property.discipline} • {property.experience_level}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <Image src={property.cover_image_url || '/logo.png'} alt={property.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          <div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
              <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Special Acquisition Terms</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-gray-400 line-through">
                  <span>Public Listing Value</span>
                  <span>{property.price_category}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-red-500">
                  <span>Flash Sale Offer</span>
                  <span>Contact for exact quote</span>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-8">
                <p className="text-sm text-red-200 leading-relaxed">
                  <strong>Strictly Confidential:</strong> This is a time-sensitive, off-market opportunity presented only to select VIP clients. This link and offer will permanently self-destruct when the timer reaches zero.
                </p>
              </div>

              <button onClick={() => window.location.href = `mailto:tom@equivestworldwide.com?subject=Flash Sale Interest: ${property.name}`} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2">
                Claim this Asset Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
