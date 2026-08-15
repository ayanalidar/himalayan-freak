'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plane,
  Train,
  Search,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  IndianRupee,
  Users,
  CheckCircle2,
  Loader2,
  Filter,
  Sparkles,
  Wifi,
  Utensils,
  Plug,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useApp } from '@/lib/store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const popularRoutes = [
  { from: 'Delhi', to: 'Srinagar' },
  { from: 'Mumbai', to: 'Srinagar' },
  { from: 'Delhi', to: 'Leh' },
  { from: 'Delhi', to: 'Jammu' },
  { from: 'Delhi', to: 'Katra' },
  { from: 'Mumbai', to: 'Leh' },
  { from: 'Bengaluru', to: 'Srinagar' },
  { from: 'Delhi', to: 'Chandigarh' },
  { from: 'Delhi', to: 'Dehradun' },
]

type Flight = {
  id: string
  airline: string
  flightNo: string
  origin: string
  originCode: string
  destination: string
  destCode: string
  departTime: string
  arriveTime: string
  duration: string
  stops: number
  price: number
  finalPrice: number
  cabin: string
  available: number
  aircraft: string | null
  dateLabel: string
}

type TrainClass = { code: string; name: string; price: number; available: number }
type Train = {
  id: string
  trainNo: string
  trainName: string
  origin: string
  originCode: string
  destination: string
  destCode: string
  departTime: string
  arriveTime: string
  duration: string
  classes: TrainClass[]
  runsOn: number[]
  runsToday: boolean
  dateLabel: string
}

const airlineLogos: Record<string, string> = {
  IndiGo: '🟦',
  'Air India': '🔴',
  SpiceJet: '🟧',
  Vistara: '🟪',
  'Go First': '🟩',
}

export function TicketsPage() {
  const { navigate } = useApp()
  const [tab, setTab] = useState<'flights' | 'trains'>('flights')
  const [origin, setOrigin] = useState('Delhi')
  const [dest, setDest] = useState('Srinagar')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [pax, setPax] = useState(1)
  const [flights, setFlights] = useState<Flight[]>([])
  const [trains, setTrains] = useState<Train[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const onSearch = async () => {
    if (!origin || !dest) {
      toast.error('Please select origin and destination')
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const [fRes, tRes] = await Promise.all([
        fetch(`/api/tickets/flights?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&date=${date}`),
        fetch(`/api/tickets/trains?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&date=${date}`),
      ])
      const fData = await fRes.json()
      const tData = await tRes.json()
      // API may return {flights: [...], source, configured} or just [...]
      const f = Array.isArray(fData) ? fData : (fData.flights || [])
      const t = Array.isArray(tData) ? tData : (tData.trains || [])
      setFlights(f)
      setTrains(t)
    } catch {
      toast.error('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const swap = () => {
    setOrigin(dest)
    setDest(origin)
  }

  const onBook = (type: string, ref: string, price: number) => {
    toast.success('Added to your trip plan!', {
      description: `${type} ${ref} · ₹${price.toLocaleString('en-IN')} × ${pax} pax`,
    })
    setTimeout(() => navigate('trip-planner'), 1000)
  }

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
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/75 to-amber-900/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 backdrop-blur">
              <Sparkles className="mr-1.5 h-3 w-3" /> Real-time Flights & Trains
            </Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white text-shadow-lg sm:text-5xl lg:text-6xl text-balance">
              Flights & trains to the Himalaya
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
              Search real airline and railway routes to Srinagar, Leh, Jammu, Katra & beyond.
              Compare fares, timings, classes - and add tickets to your trip plan in one click.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Card className="p-4 ring-1 ring-border/40 sm:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto] md:items-end">
              <div>
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">From</Label>
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Delhi"
                  className="mt-1.5"
                />
              </div>
              <Button variant="ghost" size="icon" onClick={swap} className="hidden md:flex mb-1.5" aria-label="Swap">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </Button>
              <div>
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">To</Label>
                <Input
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  placeholder="Srinagar"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pax</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  className="mt-1.5 w-20"
                />
              </div>
              <Button
                onClick={onSearch}
                disabled={loading}
                size="lg"
                className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 md:mt-0"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
            </div>

            {/* Popular routes */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium">Popular:</span>
              {popularRoutes.map((r) => (
                <button
                  key={`${r.from}-${r.to}`}
                  onClick={() => {
                    setOrigin(r.from)
                    setDest(r.to)
                  }}
                  className="rounded-full bg-muted px-2.5 py-0.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {r.from} → {r.to}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!searched ? (
            <EmptyState />
          ) : loading ? (
            <LoadingSkeleton />
          ) : (
            <Tabs value={tab} onValueChange={(v) => setTab(v as 'flights' | 'trains')}>
              <div className="mb-5 flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="flights" className="gap-1.5">
                    <Plane className="h-3.5 w-3.5" /> Flights ({flights.length})
                  </TabsTrigger>
                  <TabsTrigger value="trains" className="gap-1.5">
                    <Train className="h-3.5 w-3.5" /> Trains ({trains.length})
                  </TabsTrigger>
                </TabsList>
                <div className="text-sm text-muted-foreground">
                  {origin} → {dest} · {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {pax} pax
                </div>
              </div>

              <TabsContent value="flights" className="mt-0 space-y-3">
                {flights.length === 0 ? (
                  <NoResults type="flights" />
                ) : (
                  flights.map((f, i) => (
                    <FlightCard
                      key={f.id + i}
                      flight={f}
                      pax={pax}
                      onBook={() => onBook('Flight', `${f.airline} ${f.flightNo}`, (f.finalPrice || f.price || 0) * pax)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="trains" className="mt-0 space-y-3">
                {trains.length === 0 ? (
                  <NoResults type="trains" />
                ) : (
                  trains.map((t, i) => (
                    <TrainCard
                      key={t.id + i}
                      train={t}
                      pax={pax}
                      onBook={(cls) => onBook(`Train ${t.trainNo} (${cls})`, t.trainName, 0)}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Want tickets + hotels + cabs in one package?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Our team can bundle everything into one itinerary - often cheaper than booking separately.
          </p>
          <Button size="lg" className="mt-5 gap-2" onClick={() => navigate('trip-planner')}>
            <Sparkles className="h-4 w-4" /> Build a complete trip
          </Button>
        </div>
      </section>
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="p-12 text-center ring-1 ring-border/40">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Plane className="h-7 w-7" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">Search for flights & trains</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
        Pick your origin, destination and date above - we search real airline routes (IndiGo, Air India, SpiceJet, Vistara, Go First) and Indian Railways trains in real-time.
      </p>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          </div>
        </Card>
      ))}
    </div>
  )
}

function NoResults({ type }: { type: 'flights' | 'trains' }) {
  return (
    <Card className="p-12 text-center ring-1 ring-border/40">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {type === 'flights' ? <Plane className="h-7 w-7" /> : <Train className="h-7 w-7" />}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">No {type} found for this route</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try a different city or check the popular routes above.
      </p>
    </Card>
  )
}

function FlightCard({ flight, pax, onBook }: { flight: Flight; pax: number; onBook: () => void }) {
  const pricePerPax = flight.finalPrice || flight.price || 0
  const total = pricePerPax * pax
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden p-0 ring-1 ring-border/40 transition-all hover:shadow-md hover:ring-primary/40">
        <div className="grid gap-0 md:grid-cols-[1fr_auto]">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 text-2xl">
                {airlineLogos[flight.airline] || '✈️'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-base font-bold">{flight.airline}</span>
                  <Badge variant="outline" className="text-[10px]">{flight.flightNo}</Badge>
                  <Badge variant="outline" className="text-[10px]">{flight.aircraft || 'Aircraft'}</Badge>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div>
                    <div className="font-display text-xl font-bold">{flight.departTime}</div>
                    <div className="text-xs text-muted-foreground">{flight.originCode} · {flight.origin}</div>
                  </div>
                  <div className="flex flex-1 flex-col items-center text-xs text-muted-foreground">
                    <span>{flight.duration}</span>
                    <div className="my-1 flex w-full items-center">
                      <span className="h-px flex-1 bg-border" />
                      <Plane className="mx-1 h-3 w-3 text-muted-foreground" />
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <span>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold">{flight.arriveTime}</div>
                    <div className="text-xs text-muted-foreground">{flight.destCode} · {flight.destination}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                  <Badge variant="outline" className="gap-1 px-1.5 py-0 text-[10px]">
                    <Wifi className="h-2.5 w-2.5" /> Wi-Fi
                  </Badge>
                  <Badge variant="outline" className="gap-1 px-1.5 py-0 text-[10px]">
                    <Utensils className="h-2.5 w-2.5" /> Meal
                  </Badge>
                  <Badge variant="outline" className="gap-1 px-1.5 py-0 text-[10px]">
                    <Plug className="h-2.5 w-2.5" /> Power
                  </Badge>
                  <span className="ml-1">{flight.cabin}</span>
                  <span>·</span>
                  <span className="text-emerald-600">{flight.available} seats left</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center border-t border-border/60 bg-muted/30 p-5 md:border-l md:border-t-0">
            <div className="text-xs text-muted-foreground">Starting from</div>
            <div className="font-display text-2xl font-bold text-primary">
              ₹{pricePerPax.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-muted-foreground">per person · incl. taxes</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Total ₹{total.toLocaleString('en-IN')} ({pax} pax)
            </div>
            <Button className="mt-3 gap-1.5" onClick={onBook}>
              Add to trip <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function TrainCard({ train, pax, onBook }: { train: Train; pax: number; onBook: (cls: string) => void }) {
  const [selectedClass, setSelectedClass] = useState<TrainClass | null>(null)
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden p-0 ring-1 ring-border/40 transition-all hover:shadow-md hover:ring-primary/40">
        <div className="grid gap-0 md:grid-cols-[1fr_auto]">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-2xl">
                🚆
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-base font-bold">{train.trainName}</span>
                  <Badge variant="outline" className="text-[10px]">{train.trainNo}</Badge>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div>
                    <div className="font-display text-xl font-bold">{train.departTime}</div>
                    <div className="text-xs text-muted-foreground">{train.originCode} · {train.origin}</div>
                  </div>
                  <div className="flex flex-1 flex-col items-center text-xs text-muted-foreground">
                    <span>{train.duration}</span>
                    <div className="my-1 flex w-full items-center">
                      <span className="h-px flex-1 bg-border" />
                      <Train className="mx-1 h-3 w-3 text-muted-foreground" />
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <span>{train.runsToday ? 'Runs today' : 'Doesn\'t run today'}</span>
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold">{train.arriveTime}</div>
                    <div className="text-xs text-muted-foreground">{train.destCode} · {train.destination}</div>
                  </div>
                </div>
                {/* Runs on */}
                <div className="mt-3 flex items-center gap-1">
                  {days.map((d, i) => (
                    <span
                      key={i}
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium',
                        train.runsOn.includes(i) ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                {/* Class options */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {train.classes.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setSelectedClass(c)}
                      className={cn(
                        'rounded-lg border px-2.5 py-1.5 text-left text-xs font-medium transition-all',
                        selectedClass?.code === c.code
                          ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                          : 'border-border hover:border-primary/40'
                      )}
                    >
                      <div>{c.code} · {c.name}</div>
                      <div className="mt-0.5 font-bold">₹{c.price.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-emerald-600">{c.available} avail</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center border-t border-border/60 bg-muted/30 p-5 md:border-l md:border-t-0">
            <div className="text-xs text-muted-foreground">
              {selectedClass ? `${selectedClass.name} × ${pax} pax` : 'Select a class'}
            </div>
            <div className="font-display text-2xl font-bold text-primary">
              {selectedClass
                ? `₹${(selectedClass.price * pax).toLocaleString('en-IN')}`
                : '-'}
            </div>
            <div className="text-xs text-muted-foreground">incl. all taxes</div>
            <Button
              className="mt-3 gap-1.5"
              disabled={!selectedClass}
              onClick={() => selectedClass && onBook(selectedClass.code)}
            >
              Add to trip <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
