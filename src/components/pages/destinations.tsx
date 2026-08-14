'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Filter, Mountain, Star, Compass, Loader2 } from 'lucide-react'
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
import { DestinationCard } from '@/components/cards'
import type { DestinationData, Region } from '@/lib/data'

const regions: (Region | 'All')[] = ['All', 'Kashmir', 'Jammu', 'Ladakh', 'Himachal', 'Uttarakhand']
const difficulties = ['All', 'Easy', 'Moderate', 'Challenging']
const sortOptions = [
  { id: 'featured', label: 'Featured first' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'elevation-desc', label: 'Highest elevation' },
  { id: 'elevation-asc', label: 'Lowest elevation' },
  { id: 'name', label: 'A -> Z' },
]

export function DestinationsPage() {
  const { navigate } = useApp()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState<Region | 'All'>('All')
  const [difficulty, setDifficulty] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('featured')
  const [destinations, setDestinations] = useState<DestinationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/destinations')
      .then((r) => r.json())
      .then((data) => setDestinations(data))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = destinations.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.tagline.toLowerCase().includes(search.toLowerCase()) ||
        d.state.toLowerCase().includes(search.toLowerCase())
      const matchRegion = region === 'All' || d.region === region
      const matchDiff = difficulty === 'All' || d.difficulty === difficulty
      return matchSearch && matchRegion && matchDiff
    })

    switch (sortBy) {
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating)
        break
      case 'elevation-desc':
        list = [...list].sort((a, b) => b.elevation - a.elevation)
        break
      case 'elevation-asc':
        list = [...list].sort((a, b) => a.elevation - b.elevation)
        break
      case 'name':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
    }
    return list
  }, [destinations, search, region, difficulty, sortBy])

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=2400&q=80"
            alt="Himalayan peaks"
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
            <Badge className="mb-4 bg-primary/20 text-primary backdrop-blur">{destinations.length} destinations across 5 Himalayan states</Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white text-shadow-lg sm:text-5xl lg:text-6xl text-balance">
              Every major stop across the Indian Himalaya
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
              From the floating gardens of Srinagar to the sand dunes of Nubra - every
              destination card opens an in-depth guide with live weather, attractions,
              activities, best time to visit and how to reach.
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
                placeholder="Search destinations, states, taglines..."
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
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="h-9 w-[130px] shrink-0">
                  <Filter className="mr-1 h-3.5 w-3.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d === 'All' ? 'All levels' : d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 w-[160px] shrink-0">
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
          <div className="mt-2 text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length}</span> of {destinations.length} destinations
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden p-0">
                  <div className="aspect-[4/3] animate-pulse bg-muted" />
                  <div className="p-4">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="mt-2 h-3 w-full animate-pulse rounded bg-muted" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="p-12 text-center ring-1 ring-border/40">
              <Compass className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 font-display text-lg font-semibold">No destinations match your filters</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try clearing the search or selecting "All regions".</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch('')
                  setRegion('All')
                  setDifficulty('All')
                }}
              >
                Reset filters
              </Button>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d, i) => (
                <DestinationCard key={d.slug} d={d} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Can&apos;t find your dream destination?
          </h2>
          <p className="mt-2 text-muted-foreground">
            We cover the entire Himalayan range. Tell us where you want to go - we&apos;ll plan the route.
          </p>
          <Button size="lg" className="mt-5 gap-2" onClick={() => navigate('trip-planner')}>
            <Compass className="h-4 w-4" /> Build a custom itinerary
          </Button>
        </div>
      </section>
    </div>
  )
}
