'use client'

import { create } from 'zustand'

export type PageId =
  | 'home'
  | 'company'
  | 'destinations'
  | 'destination-detail'
  | 'packages'
  | 'package-detail'
  | 'trip-planner'
  | 'tickets'
  | 'group-booking'
  | 'crm'
  | 'admin-destinations'
  | 'admin-packages'
  | 'dashboard'
  | 'login'
  | 'signup'
  | 'privacy'
  | 'terms'
  | 'cancellation'

interface AppState {
  page: PageId
  selectedDestinationSlug: string | null
  selectedPackageSlug: string | null
  navigate: (page: PageId) => void
  openDestination: (slug: string) => void
  openPackage: (slug: string) => void
}

export const useApp = create<AppState>((set) => ({
  page: 'home',
  selectedDestinationSlug: null,
  selectedPackageSlug: null,
  navigate: (page) => {
    set({ page })
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  openDestination: (slug) => {
    set({ page: 'destination-detail', selectedDestinationSlug: slug })
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  },
  openPackage: (slug) => {
    set({ page: 'package-detail', selectedPackageSlug: slug })
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  },
}))

// Trip planner builder state
export interface TripBuilderState {
  selectedDestinations: string[]
  startDate: string
  duration: number
  pax: number
  hotelTier: string
  meals: string[]
  addOns: { id: string; qty: number }[]
  contact: { name: string; email: string; phone: string }
  toggleDestination: (slug: string) => void
  setStartDate: (date: string) => void
  setDuration: (n: number) => void
  setPax: (n: number) => void
  setHotelTier: (id: string) => void
  toggleMeal: (id: string) => void
  toggleAddOn: (id: string) => void
  setContact: (c: Partial<TripBuilderState['contact']>) => void
  reset: () => void
}

const initialTrip = {
  selectedDestinations: [] as string[],
  startDate: '',
  duration: 5,
  pax: 2,
  hotelTier: 'standard',
  meals: ['breakfast', 'dinner'] as string[],
  addOns: [] as { id: string; qty: number }[],
  contact: { name: '', email: '', phone: '' },
}

export const useTripBuilder = create<TripBuilderState>((set) => ({
  ...initialTrip,
  toggleDestination: (slug) =>
    set((s) => ({
      selectedDestinations: s.selectedDestinations.includes(slug)
        ? s.selectedDestinations.filter((d) => d !== slug)
        : [...s.selectedDestinations, slug],
    })),
  setStartDate: (startDate) => set({ startDate }),
  setDuration: (duration) => set({ duration }),
  setPax: (pax) => set({ pax: Math.max(1, Math.min(50, pax)) }),
  setHotelTier: (hotelTier) => set({ hotelTier }),
  toggleMeal: (id) =>
    set((s) => ({
      meals: s.meals.includes(id)
        ? s.meals.filter((m) => m !== id)
        : [...s.meals, id],
    })),
  toggleAddOn: (id) =>
    set((s) => ({
      addOns: s.addOns.find((a) => a.id === id)
        ? s.addOns.filter((a) => a.id !== id)
        : [...s.addOns, { id, qty: 1 }],
    })),
  setContact: (c) => set((s) => ({ contact: { ...s.contact, ...c } })),
  reset: () => set(initialTrip),
}))
