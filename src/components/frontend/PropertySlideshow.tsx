'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight, Activity, Trophy, Euro } from 'lucide-react'

export default function PropertySlideshow({ properties }: { properties: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use only properties that have a main image, limit to 6 for the slideshow
  let displayProperties = properties.filter(h => h.main_image_url).slice(0, 6)

  if (displayProperties.length === 0) {
    displayProperties = [
      {
        id: 'dummy1',
        name: 'Equivest Elite',
        main_image_url: '/portfolio_ai_1.png',
        status: 'Available',
        category: 'Grand Prix Prospect',
        age: 7,
        gender: 'Stallion',
        price_range: 'On Request'
      },
      {
        id: 'dummy2',
        name: 'Equivest Champion',
        main_image_url: '/portfolio_ai_2.png',
        status: 'Available',
        category: '1.60m Talent',
        age: 9,
        gender: 'Gelding',
        price_range: 'On Request'
      },
      {
        id: 'dummy3',
        name: 'Equivest Star',
        main_image_url: '/portfolio_ai_3.png',
        status: 'Available',
        category: 'Hunter Prospect',
        age: 6,
        gender: 'Mare',
        price_range: 'On Request'
      }
    ]
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayProperties.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayProperties.length) % displayProperties.length)
  }

  return (
    <section className="pt-10 pb-0 relative z-20 -mt-20 md:-mt-32 w-full animate-fade-in-up">
      {/* Background decorations - subtle glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
              <span className="w-2 h-2 bg-accent-light rounded-full animate-pulse"></span>
              <span className="text-white uppercase tracking-[0.2em] text-xs font-bold">Premium Assets</span>
            </div>
            <Link href="/properties" className="inline-block group">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight group-hover:opacity-80 transition-opacity drop-shadow-md">
                Explore the <span className="italic text-accent-light font-light">Sport Portfolio</span>
              </h2>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/properties" className="hidden sm:flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 hover:bg-white/20 transition-all group shadow-xl">
              View Portfolio <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden relative z-10 pb-12 group/slider">
        {/* Navigation Buttons inside image area (top left) */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 flex gap-2">
          <button onClick={prevSlide} className="w-10 h-10 md:w-12 md:h-12 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-all group">
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button onClick={nextSlide} className="w-10 h-10 md:w-12 md:h-12 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-all group">
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div 
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentIndex * (typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 33.333)}%)` }}
        >
          {displayProperties.map((property, index) => {
            return (
              <div 
                key={property.id} 
                className="min-w-full md:min-w-[33.333%] px-3 md:px-4 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] relative"
              >
                <div className="block group relative rounded-2xl overflow-hidden aspect-[4/5] w-full shadow-2xl bg-gray-900 border border-gray-200 dark:border-white/5 cursor-default">
                  <Image
                    src={property.main_image_url}
                    alt={property.name}
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"></div>
                  
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end transform transition-transform duration-500">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {property.status === 'Available' && (
                          <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Available</span>
                        )}
                        <span className="bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{property.category}</span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 group-hover:text-accent transition-colors duration-300 drop-shadow-lg">{property.name}</h3>
                      
                      <div className="flex items-center gap-4 text-white/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="flex items-center gap-1.5"><Activity size={14} /> <span>{property.age} yrs</span></div>
                        <div className="flex items-center gap-1.5"><Euro size={14} /> <span className="uppercase">{property.price_range || 'On Request'}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / displayProperties.length) * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}
