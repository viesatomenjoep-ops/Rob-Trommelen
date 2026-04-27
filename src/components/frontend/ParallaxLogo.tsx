'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function ParallaxLogo() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Call handler right away so state gets updated with initial window size
    handleScroll()
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate the parallax effect. 
  // We want it to move down as the user scrolls down.
  // We fade it out slowly so it disappears right before hitting the slider.
  const translateY = scrollY * 0.8 // Moves down at 80% of scroll speed
  const opacity = Math.max(0, 1.0 - (scrollY / 1200))

  if (opacity === 0) return null

  return (
    <div 
      className="relative z-20 flex flex-col items-center justify-center mt-2 md:mt-4 pointer-events-none"
      style={{ 
        transform: `translateY(${translateY}px)`,
        opacity: opacity 
      }}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-4 block drop-shadow-md">
        Scroll to explore
      </span>
      <div className="flex flex-col items-center animate-bounce">
        <Image 
          src="/logo.png" 
          alt="Scroll down" 
          width={40} 
          height={40} 
          className="brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] mb-2"
        />
        <svg 
          className="w-5 h-5 text-white/80" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  )
}
