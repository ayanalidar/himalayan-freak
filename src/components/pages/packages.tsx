'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Plane, Star, Compass, ArrowRight, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useApp } from '@/lib/store'
import { packages, type Region } from '@/lib/data'
import { PackageCard } from '@/components/cards'

const regions: (Region | 'Multi-Region' | 'All')[] = ['All', 'Kashmir', 'Jammu', 'Ladakh', 'Himachal', 'Multi-Region']
const sortOptions = [
  { id: 'featured', label: 'Featured first' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'duration', label: 'Shortest first' },
  { id: 'rating', label: 'Top rated' },
]

export function PackagesPage() {
  const { navigate } = useApp()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState<Region | 'Multi-Region' | 'All'>('All')
  const [maxPrice, setMaxPrice] = useState<number>(50000)
  const [sortBy, setSortBy] = useState<string>('featured')

  const filtered = useMemo(() => {
    let list = packages.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      const matchRegion = region === 'All' || p.region === region
      const matchPrice = p.price <= maxPrice
      return matchSearch && matchRegion && matchPrice
    })

    switch (sortBy) {
      case 'price-low':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'duration':
        list = [...list].sort((a, b) => a.duration - b.duration)
        break
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating)
        break
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
    }
    return list
  }, [search, region, maxPrice, sortBy])

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=2400&q=80"
            alt="Pangong Lake"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-primary/20 text-primary backdrop-blur">
              <Plane className="mr-1.5 h-3 w-3" /> Curated packages
            </Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white text-shadow-lg sm:text-5xl lg:text-6xl text-balance">
              Ready-made journeys, fully customisable
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
              Start from a tried-and-tested itinerary - adjust hotels, duration, transport
              and add-ons to make it truly yours. Every package is operated by our own team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hidden">
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      region === r
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {r === 'All' ? 'All regions' : r}
                  </button>
                ))}
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 w-[170px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Max budget: </span>
            <input
              type="range"
              min={5000}
              max={50000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary lg:max-w-xs"
            />
            <span className="font-medium text-foreground">₹{maxPrice.toLocaleString('en-IN')}</span>
            <span className="ml-auto">Showing <span className="font-medium text-foreground">{filtered.length}</span> packages</span>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center ring-1 ring-border/40">
              <Compass className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 font-display text-lg font-semibold">No packages match your filters</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try raising your budget or selecting "All regions".</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch('')
                  setRegion('All')
                  setMaxPrice(50000)
                }}
              >
                Reset filters
              </Button>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <PackageCard key={p.slug} p={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CUSTOM CTA */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/40 p-8 text-white sm:p-12">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="relative grid items-center gap-6 lg:grid-cols-2">
              <div>
                <Badge className="mb-3 bg-white/15 text-white backdrop-blur">
                  <Compass className="mr-1.5 h-3 w-3" /> Custom Trip Planner
                </Badge>
                <h2 className="font-display text-3xl font-bold leading-tight">
                  Don&apos;t see what you want? Build your own.
                </h2>
                <p className="mt-3 text-white/80">
                  Pick destinations, hotels, meals, photographer, guide & cabs - get an
                  instant estimate. No deposits, no pressure.
                </p>
              </div>
              <div className="flex lg:justify-end">
                <Button size="lg" variant="secondary" className="gap-2" onClick={() => navigate('trip-planner')}>
                  Open Trip Planner <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
