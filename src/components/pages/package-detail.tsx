'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  Plane,
  Check,
  X,
  Calendar,
  Mountain,
  Compass,
  Phone,
  Users,
  Clock,
  MapPin,
  Heart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useApp } from '@/lib/store'
import { packages, hotelTiers, type PackageData } from '@/lib/data'
import { toast } from 'sonner'

export function PackageDetailPage() {
  const { selectedPackageSlug, navigate } = useApp()
  const p: PackageData = packages.find((x) => x.slug === selectedPackageSlug) || packages[0]

  const [duration, setDuration] = useState(p.duration)
  const [pax, setPax] = useState(2)
  const [hotelTier, setHotelTier] = useState('standard')
  const [transport, setTransport] = useState<'suv' | 'tempo' | 'none'>('suv')

  const hotelCost = useMemo(() => {
    const tier = hotelTiers.find((t) => t.id === hotelTier)!
    return tier.perNight * (duration - 1) * Math.ceil(pax / 2)
  }, [hotelTier, duration, pax])

  const transportCost = useMemo(() => {
    if (transport === 'suv') return 3800 * duration
    if (transport === 'tempo') return 6500 * duration
    return 0
  }, [transport, duration])

  const baseCost = p.price * pax
  const adjustments = (duration - p.duration) * 2500 * pax // +₹2,500/pax/day extension
  const total = baseCost + adjustments + hotelCost + transportCost

  const onRequestQuote = () => {
    toast.success('Quote requested!', {
      description: `We will WhatsApp you within 30 minutes with a final quote for ${pax} pax × ${duration} days.`,
    })
  }

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
          <img
            src={p.heroImage}
            alt={p.title}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('packages')}
          className="absolute left-4 top-4 z-20 gap-1.5 border-white/30 bg-black/40 text-white backdrop-blur-md hover:bg-black/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> All packages
        </Button>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge className="bg-primary text-primary-foreground">{p.region}</Badge>
                <Badge className="bg-amber-500/90 text-white backdrop-blur">
                  <Star className="mr-1 h-3 w-3 fill-white text-white" />
                  {p.rating.toFixed(1)}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur">
                  <Clock className="mr-1 h-3 w-3" />
                  {p.duration}D / {p.nights}N
                </Badge>
              </div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white text-shadow-lg sm:text-4xl lg:text-5xl text-balance">
                {p.title}
              </h1>
              <p className="mt-3 max-w-3xl text-base text-white/85 sm:text-lg">{p.description}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT - content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Highlights */}
            <Card className="p-6 ring-1 ring-border/40 sm:p-8">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <h2 className="font-display text-2xl font-bold">Package highlights</h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {p.highlights.map((h, i) => (
                  <motion.div
                    key={h}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-4"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <p className="text-sm leading-relaxed">{h}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Itinerary */}
            <Card className="p-6 ring-1 ring-border/40 sm:p-8">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl font-bold">Day-by-day itinerary</h2>
              </div>
              <div className="mt-6 space-y-4">
                {p.itinerary.map((it, i) => (
                  <motion.div
                    key={it.day}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        D{it.day}
                      </div>
                      {i < p.itinerary.length - 1 && (
                        <div className="mt-1 w-0.5 flex-1 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h3 className="font-semibold leading-tight">{it.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {it.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Inclusions / Exclusions */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Card className="p-6 ring-1 ring-border/40">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <h2 className="font-display text-lg font-bold">Inclusions</h2>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {p.inclusions.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="text-muted-foreground">{inc}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 ring-1 ring-border/40">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
                    <X className="h-4 w-4" />
                  </div>
                  <h2 className="font-display text-lg font-bold">Exclusions</h2>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {p.exclusions.map((exc) => (
                    <li key={exc} className="flex items-start gap-2 text-sm">
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                      <span className="text-muted-foreground">{exc}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* RIGHT - customization & booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-5">
              {/* Customizer */}
              <Card className="overflow-hidden ring-1 ring-primary/30">
                <div className="bg-gradient-to-br from-primary/15 to-accent/10 p-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-bold">Customise & book</h3>
                    <Badge className="bg-primary/15 text-primary">Live estimate</Badge>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-xs text-muted-foreground">Starting</span>
                    <span className="font-display text-3xl font-bold">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-muted-foreground">/person</span>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  {/* Pax */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> Travellers
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPax(Math.max(1, pax - 1))}
                      >
                        −
                      </Button>
                      <div className="flex-1 text-center font-display text-lg font-bold">
                        {pax}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPax(Math.min(50, pax + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Duration
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDuration(Math.max(p.duration, duration - 1))}
                      >
                        −
                      </Button>
                      <div className="flex-1 text-center font-display text-lg font-bold">
                        {duration}D <span className="text-sm font-normal text-muted-foreground">/ {duration - 1}N</span>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDuration(Math.min(21, duration + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Hotel tier */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Mountain className="h-3.5 w-3.5" /> Hotel tier
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {hotelTiers.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setHotelTier(t.id)}
                          className={`rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-all ${
                            hotelTier === t.id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/40'
                          }`}
                        >
                          {t.name}
                          <div className="mt-0.5 text-[10px] font-normal text-muted-foreground">
                            ₹{t.perNight.toLocaleString('en-IN')}/night
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transport */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Plane className="h-3.5 w-3.5" /> Transport
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'none', label: 'None', price: '₹0' },
                        { id: 'suv', label: 'SUV', price: '₹3,800/D' },
                        { id: 'tempo', label: 'Tempo', price: '₹6,500/D' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setTransport(opt.id as typeof transport)}
                          className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-all ${
                            transport === opt.id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/40'
                          }`}
                        >
                          {opt.label}
                          <div className="mt-0.5 text-[10px] font-normal text-muted-foreground">
                            {opt.price}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Estimate */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base package × {pax} pax</span>
                      <span className="font-medium">₹{baseCost.toLocaleString('en-IN')}</span>
                    </div>
                    {adjustments !== 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration adjustment</span>
                        <span className="font-medium">
                          {adjustments > 0 ? '+' : ''}₹{adjustments.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hotel ({hotelTier})</span>
                      <span className="font-medium">₹{hotelCost.toLocaleString('en-IN')}</span>
                    </div>
                    {transportCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transport</span>
                        <span className="font-medium">₹{transportCost.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-lg font-bold">Total estimate</span>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-primary">
                        ₹{total.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ≈ ₹{Math.round(total / pax).toLocaleString('en-IN')}/person
                      </div>
                    </div>
                  </div>

                  <Button className="w-full gap-2" size="lg" onClick={onRequestQuote}>
                    <Heart className="h-4 w-4" /> Request exact quote
                  </Button>
                  <a href="tel:+916006266072">
                    <Button variant="outline" className="w-full gap-2">
                      <Phone className="h-4 w-4" /> Or call us
                    </Button>
                  </a>

                  <p className="text-center text-[10px] text-muted-foreground">
                    No deposit · Free itinerary changes · 100% refund if we cancel
                  </p>
                </div>
              </Card>

              {/* Quick info */}
              <Card className="p-5 ring-1 ring-border/40">
                <h3 className="font-display text-base font-bold">Package at a glance</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{p.duration}D / {p.nights}N</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Region</span>
                    <span className="font-medium">{p.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {p.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Highlights</span>
                    <span className="font-medium">{p.highlights.length}</span>
                  </div>
                </div>
              </Card>

              {/* Build similar CTA */}
              <Card className="p-5 ring-1 ring-primary/30 bg-primary/5">
                <Compass className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-display text-base font-bold">Want to tweak this trip further?</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add photographer, chef, detours. Use the custom Trip Planner.
                </p>
                <Button
                  variant="outline"
                  className="mt-3 w-full gap-2"
                  onClick={() => navigate('trip-planner')}
                >
                  Open Trip Planner <ArrowLeft className="h-3.5 w-3.5 -rotate-180" />
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
