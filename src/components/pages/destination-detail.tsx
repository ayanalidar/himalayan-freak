'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Star,
  Mountain,
  Clock,
  Calendar,
  Activity,
  Compass,
  Camera,
  Cloud,
  Droplets,
  Wind,
  Eye,
  Sun,
  Thermometer,
  Navigation,
  CheckCircle2,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useApp } from '@/lib/store'
import { destinations as staticDestinations, generateMockWeather, type DestinationData } from '@/lib/data'

export function DestinationDetailPage() {
  const { selectedDestinationSlug, navigate, openDestination } = useApp()
  const [activeImage, setActiveImage] = useState(0)
  const [prevSlug, setPrevSlug] = useState<string | null>(null)
  const [d, setD] = useState<DestinationData>(
    staticDestinations.find((x) => x.slug === selectedDestinationSlug) || staticDestinations[0]
  )

  // Fetch latest from API (so admin edits reflect)
  useEffect(() => {
    if (!selectedDestinationSlug) return
    fetch('/api/destinations')
      .then((r) => r.json())
      .then((data: DestinationData[]) => {
        const found = data.find((x) => x.slug === selectedDestinationSlug)
        if (found) setD(found)
      })
      .catch(() => {})
  }, [selectedDestinationSlug])

  // Reset gallery index when destination changes (without useEffect)
  if (prevSlug !== d.slug) {
    setPrevSlug(d.slug)
    setActiveImage(0)
  }

  const weather = useMemo(
    () => generateMockWeather(d.latitude, d.longitude, d.elevation),
    [d]
  )

  const related = useMemo(() => {
    return destinations
      .filter((x) => x.region === d.region && x.slug !== d.slug)
      .slice(0, 3)
  }, [d])

  return (
    <div className="bg-background">
      {/* HERO with gallery */}
      <section className="relative">
        <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
          <img
            src={d.gallery[activeImage]}
            alt={d.name}
            className="h-full w-full object-cover transition-opacity duration-500"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* Back button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('destinations')}
            className="absolute left-4 top-4 z-20 gap-1.5 border-white/30 bg-black/40 text-white backdrop-blur-md hover:bg-black/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All destinations
          </Button>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
              <motion.div
                key={d.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge className="bg-primary text-primary-foreground">{d.region}</Badge>
                  <Badge className="bg-white/20 text-white backdrop-blur">
                    <Mountain className="mr-1 h-3 w-3" />
                    {d.elevation.toLocaleString()}m
                  </Badge>
                  <Badge className="bg-amber-500/90 text-white backdrop-blur">
                    <Star className="mr-1 h-3 w-3 fill-white text-white" />
                    {d.rating.toFixed(1)}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur">
                    {d.difficulty}
                  </Badge>
                </div>
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-white text-shadow-lg sm:text-5xl lg:text-6xl">
                  {d.name}
                </h1>
                <p className="mt-2 max-w-2xl text-lg text-white/85">{d.tagline}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {d.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {d.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {d.bestTime.split('(')[0]}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Thumbnail gallery */}
        <div className="border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto scrollbar-hidden">
              {d.gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md ring-2 transition-all ${
                    i === activeImage ? 'ring-primary' : 'ring-transparent hover:ring-border'
                  }`}
                >
                  <img src={g} alt={`${d.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6 flex h-auto w-full flex-wrap gap-1 bg-muted p-1">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="attractions" className="flex-1">Attractions</TabsTrigger>
                <TabsTrigger value="activities" className="flex-1">Activities</TabsTrigger>
                <TabsTrigger value="weather" className="flex-1">Weather</TabsTrigger>
                <TabsTrigger value="how-to-reach" className="flex-1">How to Reach</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="mt-0">
                <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                  <h2 className="font-display text-2xl font-bold">About {d.name}</h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{d.description}</p>

                  <Separator className="my-6" />

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <Mountain className="h-3.5 w-3.5" /> Elevation
                      </div>
                      <div className="mt-1 font-display text-xl font-bold">{d.elevation.toLocaleString()}m</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> Recommended
                      </div>
                      <div className="mt-1 font-display text-xl font-bold">{d.duration}</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <Activity className="h-3.5 w-3.5" /> Difficulty
                      </div>
                      <div className="mt-1 font-display text-xl font-bold">{d.difficulty}</div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                      <Calendar className="h-4 w-4 text-primary" /> Best time to visit
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.bestTime}</p>
                  </div>
                </Card>
              </TabsContent>

              {/* Attractions */}
              <TabsContent value="attractions" className="mt-0">
                <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                  <h2 className="font-display text-2xl font-bold">Top attractions in {d.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hand-picked by our local team - the spots we send our own family to.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {d.attractions.map((a, i) => (
                      <motion.div
                        key={a}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-4"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <p className="text-sm leading-relaxed">{a}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Activities */}
              <TabsContent value="activities" className="mt-0">
                <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                  <h2 className="font-display text-2xl font-bold">Things to do</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Activities curated for every season and fitness level.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {d.activities.map((a, i) => (
                      <motion.div
                        key={a}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-4"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-sm leading-relaxed">{a}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Weather */}
              <TabsContent value="weather" className="mt-0">
                <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-bold">Live weather</h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Conditions at {d.name} · {d.elevation.toLocaleString()}m · {d.latitude.toFixed(2)}°N, {Math.abs(d.longitude).toFixed(2)}°E
                      </p>
                    </div>
                    <div className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600">
                      Live forecast
                    </div>
                  </div>

                  {/* Current */}
                  <div className="mt-6 rounded-2xl bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-blue-500/10 p-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/40 dark:bg-white/10 backdrop-blur">
                          {weather.current.condition.toLowerCase().includes('snow') ? (
                            <Cloud className="h-9 w-9 text-sky-500" />
                          ) : weather.current.condition.toLowerCase().includes('rain') ? (
                            <Droplets className="h-9 w-9 text-sky-600" />
                          ) : weather.current.condition.toLowerCase().includes('cloud') ? (
                            <Cloud className="h-9 w-9 text-slate-500" />
                          ) : (
                            <Sun className="h-9 w-9 text-amber-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-display text-4xl font-bold">
                            {weather.current.temp}°C
                          </div>
                          <div className="text-sm text-muted-foreground">{weather.current.condition}</div>
                          <div className="text-xs text-muted-foreground">
                            Feels like {weather.current.feelsLike}°C
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                          { icon: Droplets, label: 'Humidity', val: `${weather.current.humidity}%` },
                          { icon: Wind, label: 'Wind', val: `${weather.current.wind} km/h` },
                          { icon: Eye, label: 'Visibility', val: `${weather.current.visibility} km` },
                          { icon: Thermometer, label: 'UV Index', val: `${weather.current.uvIndex}` },
                        ].map((item) => (
                          <div key={item.label} className="rounded-xl bg-white/40 p-3 text-center dark:bg-white/5">
                            <item.icon className="mx-auto h-4 w-4 text-primary" />
                            <div className="mt-1.5 text-xs text-muted-foreground">{item.label}</div>
                            <div className="text-sm font-semibold">{item.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 5-day forecast */}
                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      5-day forecast
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                      {weather.forecast.map((f, i) => (
                        <div
                          key={f.date}
                          className="rounded-xl border border-border/60 bg-muted/30 p-4 text-center"
                        >
                          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {i === 0 ? 'Today' : f.dayName}
                          </div>
                          <div className="mt-2 flex justify-center">
                            {f.condition.toLowerCase().includes('snow') ? (
                              <Cloud className="h-7 w-7 text-sky-500" />
                            ) : f.condition.toLowerCase().includes('rain') ? (
                              <Droplets className="h-7 w-7 text-sky-600" />
                            ) : f.condition.toLowerCase().includes('cloud') ? (
                              <Cloud className="h-7 w-7 text-slate-500" />
                            ) : (
                              <Sun className="h-7 w-7 text-amber-500" />
                            )}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">{f.condition}</div>
                          <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                            <span className="font-semibold">{f.maxTemp}°</span>
                            <span className="text-muted-foreground">{f.minTemp}°</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-6 text-xs text-muted-foreground">
                    * Weather shown is an indicative forecast based on elevation and season.
                    For real-time data and severe-weather alerts, our trip manager shares a
                    live briefing 24 hours before departure.
                  </p>
                </Card>
              </TabsContent>

              {/* How to Reach */}
              <TabsContent value="how-to-reach" className="mt-0">
                <Card className="p-6 ring-1 ring-border/40 sm:p-8">
                  <h2 className="font-display text-2xl font-bold">How to reach {d.name}</h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{d.howToReach}</p>

                  <Separator className="my-6" />

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                      <Navigation className="h-5 w-5 text-primary" />
                      <h3 className="mt-2 text-sm font-semibold">By Air</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Check nearest airport in the description above. We arrange airport
                        pickup & drop on every trip.
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                      <Mountain className="h-5 w-5 text-primary" />
                      <h3 className="mt-2 text-sm font-semibold">By Road</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Private SUV, Tempo Traveller or self-drive. We provide vetted drivers
                        familiar with high-altitude routes.
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                      <Compass className="h-5 w-5 text-primary" />
                      <h3 className="mt-2 text-sm font-semibold">Permits & passes</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Inner Line / Protected Area permits handled by us where required
                        (Ladakh, Nubra, Pangong, Spiti).
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button onClick={() => navigate('trip-planner')} className="gap-2">
                      <Compass className="h-4 w-4" /> Plan a trip to {d.name}
                    </Button>
                    <a href="tel:+916006266072">
                      <Button variant="outline" className="gap-2">
                        <Phone className="h-4 w-4" /> Talk to an expert
                      </Button>
                    </a>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-5">
              {/* Quick info */}
              <Card className="overflow-hidden ring-1 ring-border/40">
                <div className="bg-gradient-to-br from-primary/10 to-accent/5 p-5">
                  <h3 className="font-display text-lg font-bold">Quick facts</h3>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { label: 'Region', value: d.region },
                    { label: 'State', value: d.state },
                    { label: 'Elevation', value: `${d.elevation.toLocaleString()} m` },
                    { label: 'Difficulty', value: d.difficulty },
                    { label: 'Duration', value: d.duration },
                    { label: 'Rating', value: `${d.rating.toFixed(1)} / 5` },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-3 text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Coordinates card */}
              <Card className="p-5 ring-1 ring-border/40">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Coordinates</h3>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Latitude</div>
                    <div className="font-mono text-sm">{d.latitude.toFixed(4)}° N</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Longitude</div>
                    <div className="font-mono text-sm">{d.longitude.toFixed(4)}° E</div>
                  </div>
                </div>
              </Card>

              {/* CTA */}
              <Card className="p-5 ring-1 ring-primary/30 bg-primary/5">
                <Camera className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-display text-lg font-bold">Visit {d.name} with us</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add {d.name} to your custom itinerary and get a personalised quote within 30 minutes.
                </p>
                <Button className="mt-4 w-full gap-2" onClick={() => navigate('trip-planner')}>
                  <Compass className="h-4 w-4" /> Plan my trip
                </Button>
              </Card>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold">More in {d.region}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Other hand-picked destinations in the same region.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <motion.button
                  key={r.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  onClick={() => openDestination(r.slug)}
                  className="group text-left"
                >
                  <Card className="overflow-hidden p-0 ring-1 ring-border/40 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-primary/40">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={r.heroImage}
                        alt={r.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-1 text-xs text-white/90">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {r.rating.toFixed(1)}
                          <span className="mx-1">·</span>
                          {r.duration}
                        </div>
                        <div className="font-display text-lg font-bold text-white">{r.name}</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-2 text-sm text-muted-foreground">{r.tagline}</p>
                    </div>
                  </Card>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
