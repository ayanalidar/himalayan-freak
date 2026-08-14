'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mountain,
  Utensils,
  Camera,
  User,
  Car,
  Calendar,
  Users,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Compass,
  Phone,
  Mail,
  Hotel,
  Clock,
  HeartPulse,
  FileDown,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useApp, useTripBuilder } from '@/lib/store'
import { destinations, hotelTiers, mealOptions, addOns } from '@/lib/data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const steps = [
  { id: 0, label: 'Destinations', icon: MapPin },
  { id: 1, label: 'Dates & Pax', icon: Calendar },
  { id: 2, label: 'Hotels', icon: Hotel },
  { id: 3, label: 'Meals', icon: Utensils },
  { id: 4, label: 'Add-ons', icon: Camera },
  { id: 5, label: 'Contact', icon: User },
  { id: 6, label: 'Review', icon: Check },
]

const addOnIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera,
  MapPin,
  Car,
  Bus: Car,
  HeartPulse,
  Mountain,
}

export function TripPlannerPage() {
  const { navigate } = useApp()
  const trip = useTripBuilder()
  const [currentStep, setStep] = useStepState()

  const selectedDestObjs = destinations.filter((d) =>
    trip.selectedDestinations.includes(d.slug)
  )

  const estimate = useMemo(() => {
    const hotel = hotelTiers.find((t) => t.id === trip.hotelTier)!
    const hotelCost = hotel.perNight * Math.max(0, trip.duration - 1) * Math.ceil(trip.pax / 2)

    const mealsPerDay = trip.meals
      .filter((m) => m !== 'wazwan')
      .reduce((sum, m) => {
        const meal = mealOptions.find((x) => x.id === m)!
        return sum + meal.perPersonPerDay!
      }, 0)
    const wazwanCost = trip.meals.includes('wazwan')
      ? mealOptions.find((x) => x.id === 'wazwan')!.perPerson! * trip.pax
      : 0
    const mealsCost = mealsPerDay * trip.duration * trip.pax + wazwanCost

    const addOnsCost = trip.addOns.reduce((sum, a) => {
      const add = addOns.find((x) => x.id === a.id)!
      const base = add.perDay || add.perTrip || add.perPerson || 0
      const multiplier = add.perDay ? trip.duration : add.perPerson ? trip.pax : 1
      return sum + base * multiplier
    }, 0)

    const transportPerDay = trip.pax <= 4 ? 3800 : trip.pax <= 8 ? 5200 : 6500
    const transportCost = transportPerDay * trip.duration

    const basePerPaxPerDay = 2500 // activities + permits + guides baseline
    const baseCost = basePerPaxPerDay * trip.duration * trip.pax

    const total = hotelCost + mealsCost + addOnsCost + transportCost + baseCost

    return {
      hotel: hotelCost,
      meals: mealsCost,
      addOns: addOnsCost,
      transport: transportCost,
      base: baseCost,
      total,
      perPerson: Math.round(total / Math.max(1, trip.pax)),
    }
  }, [trip])

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0:
        return trip.selectedDestinations.length > 0
      case 1:
        return trip.startDate !== '' && trip.duration > 0 && trip.pax > 0
      case 5:
        return (
          trip.contact.name.trim().length > 1 &&
          /^\S+@\S+\.\S+$/.test(trip.contact.email) &&
          trip.contact.phone.replace(/\D/g, '').length >= 10
        )
      default:
        return true
    }
  }, [currentStep, trip])

  const onSubmit = async () => {
    try {
      const payload = {
        name: trip.contact.name,
        email: trip.contact.email,
        phone: trip.contact.phone,
        destinations: trip.selectedDestinations,
        startDate: trip.startDate,
        duration: trip.duration,
        pax: trip.pax,
        hotelTier: trip.hotelTier,
        meals: trip.meals,
        addOns: trip.addOns.map((a) => a.id),
        estimatedPrice: estimate.total,
      }
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      toast.success('Trip saved!', {
        description: `Ref: ${data.refCode}. Our team will WhatsApp you within 30 minutes.`,
      })
      navigate('crm')
      trip.reset()
      setStep(0)
    } catch {
      toast.error('Could not save trip', { description: 'Please try again or call us directly.' })
    }
  }

  const [pdfLoading, setPdfLoading] = useState(false)
  const onDownloadPdf = async () => {
    setPdfLoading(true)
    try {
      const payload = {
        name: trip.contact.name || 'Traveller',
        email: trip.contact.email,
        phone: trip.contact.phone,
        destinationSlugs: trip.selectedDestinations,
        startDate: trip.startDate,
        duration: trip.duration,
        pax: trip.pax,
        hotelTier: trip.hotelTier,
        meals: trip.meals,
        addOnIds: trip.addOns.map((a) => a.id),
        estimatedPrice: estimate.total,
      }
      const res = await fetch('/api/trips/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('PDF failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `himalayan-freak-itinerary.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Itinerary PDF downloaded!')
    } catch {
      toast.error('Could not generate PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=2400&q=80"
            alt="Himalaya"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-primary/20 text-primary backdrop-blur">
              <Sparkles className="mr-1.5 h-3 w-3" /> Custom Trip Planner
            </Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white text-shadow-lg sm:text-5xl lg:text-6xl text-balance">
              Build your own Himalayan journey - step by step.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
              Choose destinations, dates, hotels, meals, photographer, guide and cabs.
              Get an instant estimate. No deposits, no pressure.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stepper */}
        <div className="mb-8 overflow-x-auto scrollbar-hidden">
          <div className="flex min-w-max items-center gap-2">
            {steps.map((s, i) => {
              const active = i === currentStep
              const done = i < currentStep
              return (
                <button
                  key={s.id}
                  onClick={() => i < currentStep && setStep(i)}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                    active
                      ? 'bg-primary text-primary-foreground shadow'
                      : done
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                      active ? 'bg-white/20' : done ? 'bg-primary text-primary-foreground' : 'bg-background'
                    )}
                  >
                    {done ? <Check className="h-3 w-3" /> : i + 1}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                  <s.icon className="h-3.5 w-3.5 sm:hidden" />
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* MAIN */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
              >
                {/* STEP 0 - DESTINATIONS */}
                {currentStep === 0 && (
                  <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-display text-2xl font-bold">Pick your destinations</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Choose one or many - we&apos;ll connect them by road, train or flight.
                        </p>
                      </div>
                      <Badge variant="outline" className="gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {trip.selectedDestinations.length} selected
                      </Badge>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {destinations.map((d) => {
                        const selected = trip.selectedDestinations.includes(d.slug)
                        return (
                          <button
                            key={d.slug}
                            onClick={() => trip.toggleDestination(d.slug)}
                            className={cn(
                              'group relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 text-left transition-all',
                              selected
                                ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                                : 'border-border hover:border-primary/40'
                            )}
                          >
                            <img
                              src={d.heroImage}
                              alt={d.name}
                              className="h-16 w-16 shrink-0 rounded-lg object-cover"
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-sm truncate">{d.name}</span>
                                <Badge variant="outline" className="px-1.5 py-0 text-[10px]">{d.region}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground truncate">{d.tagline}</div>
                              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <Mountain className="h-3 w-3" />
                                {d.elevation.toLocaleString()}m · {d.duration}
                              </div>
                            </div>
                            <div
                              className={cn(
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                              )}
                            >
                              {selected && <Check className="h-3.5 w-3.5" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </Card>
                )}

                {/* STEP 1 - DATES & PAX */}
                {currentStep === 1 && (
                  <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                    <h2 className="font-display text-2xl font-bold">Dates & travellers</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      When would you like to travel, and with how many people?
                    </p>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="startDate" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" /> Start date
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={trip.startDate}
                          onChange={(e) => trip.setStartDate(e.target.value)}
                          min={new Date().toISOString().slice(0, 10)}
                        />
                      </div>

                      <div>
                        <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <Users className="h-3.5 w-3.5" /> Travellers
                        </Label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => trip.setPax(trip.pax - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <div className="flex-1 text-center font-display text-xl font-bold">{trip.pax}</div>
                          <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => trip.setPax(trip.pax + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" /> Duration - {trip.duration} days / {Math.max(0, trip.duration - 1)} nights
                        </Label>
                        <input
                          type="range"
                          min={2}
                          max={21}
                          value={trip.duration}
                          onChange={(e) => trip.setDuration(Number(e.target.value))}
                          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                        />
                        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                          <span>2 days</span>
                          <span>21 days</span>
                        </div>
                      </div>
                    </div>

                    {selectedDestObjs.length > 0 && (
                      <div className="mt-6 rounded-xl bg-muted/40 p-4">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Selected destinations for this trip
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selectedDestObjs.map((d) => (
                            <Badge key={d.slug} variant="outline" className="gap-1">
                              <MapPin className="h-3 w-3" /> {d.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* STEP 2 - HOTELS */}
                {currentStep === 2 && (
                  <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                    <h2 className="font-display text-2xl font-bold">Choose your hotel tier</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Same itinerary, different comfort levels. Mix and match - our team can split hotels across destinations.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {hotelTiers.map((t) => {
                        const selected = trip.hotelTier === t.id
                        return (
                          <button
                            key={t.id}
                            onClick={() => trip.setHotelTier(t.id)}
                            className={cn(
                              'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                              selected ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border hover:border-primary/40'
                            )}
                          >
                            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                              <Hotel className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-display font-bold">{t.name}</div>
                                <div className="font-display text-sm font-bold text-primary">₹{t.perNight.toLocaleString('en-IN')}</div>
                              </div>
                              <div className="text-xs text-muted-foreground">{t.desc}</div>
                              <div className="mt-0.5 text-[10px] text-muted-foreground">per night · twin-share</div>
                            </div>
                            <div className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
                              {selected && <Check className="h-3 w-3" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </Card>
                )}

                {/* STEP 3 - MEALS */}
                {currentStep === 3 && (
                  <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                    <h2 className="font-display text-2xl font-bold">Pick your meals</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      From daily breakfast to a once-in-a-trip Kashmiri Wazwan feast.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {mealOptions.map((m) => {
                        const selected = trip.meals.includes(m.id)
                        const price = m.perPersonPerDay || m.perPerson || 0
                        const unit = m.perPerson ? 'one time' : 'per day'
                        return (
                          <button
                            key={m.id}
                            onClick={() => trip.toggleMeal(m.id)}
                            className={cn(
                              'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                              selected ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border hover:border-primary/40'
                            )}
                          >
                            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                              <Utensils className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-display font-bold">{m.name}</div>
                                <div className="font-display text-sm font-bold text-primary">₹{price.toLocaleString('en-IN')}</div>
                              </div>
                              <div className="text-xs text-muted-foreground">per person · {unit}</div>
                            </div>
                            <div className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
                              {selected && <Check className="h-3 w-3" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </Card>
                )}

                {/* STEP 4 - ADD-ONS */}
                {currentStep === 4 && (
                  <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                    <h2 className="font-display text-2xl font-bold">Add experiences & services</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Photographer, guide, cabs, medical kit, trek equipment - pick what makes your trip sing.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {addOns.map((a) => {
                        const selected = trip.addOns.some((x) => x.id === a.id)
                        const price = a.perDay || a.perTrip || a.perPerson || 0
                        const unit = a.perDay ? 'per day' : a.perPerson ? 'per person' : 'per trip'
                        const Icon = addOnIconMap[a.icon] || Camera
                        return (
                          <button
                            key={a.id}
                            onClick={() => trip.toggleAddOn(a.id)}
                            className={cn(
                              'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                              selected ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border hover:border-primary/40'
                            )}
                          >
                            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-display font-bold text-sm">{a.name}</div>
                                <div className="font-display text-sm font-bold text-primary">₹{price.toLocaleString('en-IN')}</div>
                              </div>
                              <div className="text-xs text-muted-foreground">{unit}</div>
                            </div>
                            <div className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
                              {selected && <Check className="h-3 w-3" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </Card>
                )}

                {/* STEP 5 - CONTACT */}
                {currentStep === 5 && (
                  <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                    <h2 className="font-display text-2xl font-bold">Your contact details</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      We&apos;ll send you a personalised quote on WhatsApp within 30 minutes.
                    </p>

                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="name" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <User className="h-3.5 w-3.5" /> Full name
                        </Label>
                        <Input
                          id="name"
                          value={trip.contact.name}
                          onChange={(e) => trip.setContact({ name: e.target.value })}
                          placeholder="e.g. Aarav Mehta"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" /> Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={trip.contact.email}
                          onChange={(e) => trip.setContact({ email: e.target.value })}
                          placeholder="you@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" /> Phone / WhatsApp
                        </Label>
                        <Input
                          id="phone"
                          value={trip.contact.phone}
                          onChange={(e) => trip.setContact({ phone: e.target.value })}
                          placeholder="+91 60000 00000"
                        />
                      </div>
                    </div>

                    <div className="mt-6 rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground">
                      <ShieldNote />
                    </div>
                  </Card>
                )}

                {/* STEP 6 - REVIEW */}
                {currentStep === 6 && (
                  <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-display text-2xl font-bold">Review your trip</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Look good? Submit - we&apos;ll send a personalised quote within 30 minutes.
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1" onClick={() => { trip.reset(); setStep(0) }}>
                        <Trash2 className="h-3.5 w-3.5" /> Reset
                      </Button>
                    </div>

                    <div className="mt-6 space-y-4">
                      <ReviewRow icon={MapPin} label="Destinations">
                        <div className="flex flex-wrap gap-1.5">
                          {selectedDestObjs.map((d) => (
                            <Badge key={d.slug} variant="outline" className="gap-1">
                              {d.name}
                            </Badge>
                          ))}
                        </div>
                      </ReviewRow>
                      <ReviewRow icon={Calendar} label="Dates & travellers">
                        <span className="text-sm">
                          {trip.startDate || 'Date TBD'} · {trip.duration}D / {Math.max(0, trip.duration - 1)}N · {trip.pax} pax
                        </span>
                      </ReviewRow>
                      <ReviewRow icon={Hotel} label="Hotels">
                        <span className="text-sm">
                          {hotelTiers.find((t) => t.id === trip.hotelTier)?.name}
                        </span>
                      </ReviewRow>
                      <ReviewRow icon={Utensils} label="Meals">
                        <div className="flex flex-wrap gap-1.5">
                          {trip.meals.length === 0 ? (
                            <span className="text-sm text-muted-foreground">None selected</span>
                          ) : (
                            trip.meals.map((m) => (
                              <Badge key={m} variant="outline" className="gap-1">
                                {mealOptions.find((x) => x.id === m)?.name}
                              </Badge>
                            ))
                          )}
                        </div>
                      </ReviewRow>
                      <ReviewRow icon={Camera} label="Add-ons">
                        <div className="flex flex-wrap gap-1.5">
                          {trip.addOns.length === 0 ? (
                            <span className="text-sm text-muted-foreground">None selected</span>
                          ) : (
                            trip.addOns.map((a) => (
                              <Badge key={a.id} variant="outline" className="gap-1">
                                {addOns.find((x) => x.id === a.id)?.name}
                              </Badge>
                            ))
                          )}
                        </div>
                      </ReviewRow>
                      <ReviewRow icon={User} label="Contact">
                        <div className="text-sm">
                          <div className="font-medium">{trip.contact.name || '-'}</div>
                          <div className="text-muted-foreground">{trip.contact.email} · {trip.contact.phone}</div>
                        </div>
                      </ReviewRow>
                    </div>

                    <Separator className="my-6" />

                    <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 p-4">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Estimated total</div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-display text-3xl font-bold text-primary">
                          ₹{estimate.total.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ≈ ₹{estimate.perPerson.toLocaleString('en-IN')}/person
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Final price confirmed by our team after a 30-min call. No deposit required to submit.
                      </p>
                    </div>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="gap-1.5"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={() => setStep(currentStep + 1)}
                  disabled={!canProceed}
                  className="gap-1.5"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button onClick={onSubmit} className="gap-1.5" size="lg">
                    <Check className="h-4 w-4" /> Submit my trip
                  </Button>
                  <Button
                    onClick={onDownloadPdf}
                    disabled={pdfLoading}
                    variant="outline"
                    size="lg"
                    className="gap-1.5"
                  >
                    {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                    Download PDF
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR - Live summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              <Card className="overflow-hidden ring-1 ring-primary/30">
                <div className="bg-gradient-to-br from-primary/15 to-accent/10 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold">Trip summary</h3>
                    <Badge className="bg-primary/15 text-primary">Live estimate</Badge>
                  </div>
                </div>
                <div className="space-y-3 p-5 text-sm">
                  <SummaryRow icon={MapPin} label="Destinations" value={`${trip.selectedDestinations.length} selected`} />
                  <SummaryRow icon={Calendar} label="Start date" value={trip.startDate || 'Not set'} />
                  <SummaryRow icon={Clock} label="Duration" value={`${trip.duration}D / ${Math.max(0, trip.duration - 1)}N`} />
                  <SummaryRow icon={Users} label="Travellers" value={`${trip.pax} pax`} />
                  <SummaryRow icon={Hotel} label="Hotel tier" value={hotelTiers.find((t) => t.id === trip.hotelTier)?.name || '-'} />
                  <SummaryRow icon={Utensils} label="Meals" value={`${trip.meals.length} selected`} />
                  <SummaryRow icon={Camera} label="Add-ons" value={`${trip.addOns.length} selected`} />

                  <Separator />

                  <div className="space-y-1.5">
                    <LineItem label="Hotels" value={estimate.hotel} />
                    <LineItem label="Meals" value={estimate.meals} />
                    <LineItem label="Transport" value={estimate.transport} />
                    <LineItem label="Add-ons" value={estimate.addOns} />
                    <LineItem label="Activities & permits" value={estimate.base} />
                  </div>

                  <Separator />

                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-base font-bold">Total</span>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-primary">
                        ₹{estimate.total.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ≈ ₹{estimate.perPerson.toLocaleString('en-IN')}/person
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-[10px] text-muted-foreground">
                    Estimate only · Final quote shared after onboarding call
                  </p>
                </div>
              </Card>

              <Card className="p-5 ring-1 ring-border/40">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Prefer to talk?</h3>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Call us - we usually pick up within 30 seconds.
                </p>
                <a href="tel:+916006266072" className="mt-3 block">
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5" /> +91 600 626 6072
                  </Button>
                </a>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper hook
function useStepState() {
  const [step, set] = useState(0)
  return [step, set] as const
}

function ShieldNote() {
  return (
    <span>
      Your data is shared only with our trip-design team - never sold or used for marketing
      outside Himalayan Freak. We typically respond within 30 minutes during business hours.
    </span>
  )
}

function ReviewRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function LineItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">₹{value.toLocaleString('en-IN')}</span>
    </div>
  )
}
