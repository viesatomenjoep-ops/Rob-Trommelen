'use client'

import { useEffect } from 'react'
import { incrementPropertyView } from '@/app/actions/analytics'

export default function ViewTracker({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    // We put this in a timeout to avoid calling it multiple times during strict mode double-renders
    const timer = setTimeout(() => {
      incrementPropertyView(propertyId).catch(console.error)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [propertyId])

  return null // Invisible component
}
