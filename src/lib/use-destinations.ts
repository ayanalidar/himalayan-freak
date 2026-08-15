'use client'

import { useState, useEffect, useCallback } from 'react'

// Type matching DestinationData from data.ts
export interface DestinationRecord {
  id?: string
  slug: string
  name: string
  region: string
  state: string
  elevation: number
  latitude: number
  longitude: number
  tagline: string
  description: string
  bestTime: string
  duration: string
  difficulty: string
  rating: number
  heroImage: string
  gallery: string[]
  attractions: string[]
  activities: string[]
  howToReach: string
  featured: boolean
  isCustom?: boolean // marked if loaded from DB (customised by admin)
}

export interface PackageRecord {
  id?: string
  slug: string
  title: string
  region: string
  duration: number
  nights: number
  price: number
  description: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: { day: number; title: string; description: string }[]
  heroImage: string
  rating: number
  featured: boolean
  isCustom?: boolean
}

const DEFAULT_DEST_FALLBACK: DestinationRecord[] = []

// Loads destinations, merging static seed + admin DB-edited records
export function useDestinations() {
  const [destinations, setDestinations] = useState<DestinationRecord[] | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/destinations')
      const data = await res.json()
      setDestinations(data)
    } catch {
      setDestinations(DEFAULT_DEST_FALLBACK)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { destinations, loading, refresh }
}

// Loads packages, merging static seed + admin DB-edited records
export function usePackages() {
  const [packages, setPackages] = useState<PackageRecord[] | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/packages')
      const data = await res.json()
      setPackages(data)
    } catch {
      setPackages([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { packages, loading, refresh }
}
