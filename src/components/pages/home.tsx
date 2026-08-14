'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import {
  Mountain,
  Plane,
  Camera,
  Compass,
  Star,
  Quote,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Users,
  Award,
  Phone,
  MapPin,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/store'
import { destinations, packages } from '@/lib/data'
import { DestinationCard, PackageCard } from '@/components/cards'

export function HomePage() {
  const { navigate } = useApp()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.7], [1, 1.1])

  const featuredDest = destinations.filter((d) => d.featured)
  const featuredPkg = packages.filter((p) => p.featured)

  return (
    <div ref={ref}>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] overflow-hidden">
        <motion.div style={{ y: yBg, scale }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=80"
            alt="Himalayan range"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
          <div className="absolute inset-0 hero-gradient opacity-60" />
        </motion.div>

        <motion.div
          style={{ opacity }}
          className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/90">
              Kashmir-based · Custom Himalayan Travel
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white text-shadow-lg sm:text-6xl lg:text-7xl text-balance"
          >
            Where the Himalaya <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Becomes Personal
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg text-balance"
          >
            Bespoke journeys across Kashmir, Ladakh, Jammu, Himachal & Uttarakhand -
            designed around your pace, your stories and your budget. From a shikara at
            sunrise to Khardung La at dusk.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              onClick={() => navigate('trip-planner')}
              size="lg"
              className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-900/30 hover:from-amber-600 hover:to-orange-700"
            >
              <Compass className="h-4.5 w-4.5" />
              Plan My Custom Trip
            </Button>
            <Button
              onClick={() => navigate('destinations')}
              size="lg"
              variant="outline"
              className="gap-2 border-white/40 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
            >
              Explore Destinations
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/70 sm:text-sm"
          >
            {[
              { icon: Users, label: '4,500+ happy travellers' },
              { icon: MapPin, label: '18 destinations curated' },
              { icon: Award, label: '4.9 ★ avg rating' },
              { icon: Shield, label: 'Locally rooted team' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-amber-300" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity }} className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-2 w-1 rounded-full bg-white"
            />
          </div>
        </motion.div>
      </section>

      {/* WHY US - quick value strip */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            { icon: Compass, title: 'Truly Custom', desc: 'Every itinerary built from scratch - no cookie-cutter tours.' },
            { icon: Mountain, title: 'Local Roots', desc: 'Born in Magam, Kashmir - on the road to Gulmarg every week.' },
            { icon: Shield, title: 'Safe & Insured', desc: 'Verified drivers, vetted hotels, 24×7 on-trip support.' },
            { icon: Clock, title: '24×7 Support', desc: 'Direct line to your dedicated trip manager.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
                <MapPin className="h-3 w-3" /> Featured destinations
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Iconic stops across the Himalayan range
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                From the Dal Lake of Srinagar to the cold desert of Nubra - a handpicked
                starting set. Click any card for an in-depth guide with live weather, attractions & how to reach.
              </p>
            </div>
            <Button variant="ghost" className="gap-1.5 text-primary" onClick={() => navigate('destinations')}>
              View all 18 destinations <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDest.slice(0, 6).map((d, i) => (
              <DestinationCard key={d.slug} d={d} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SPLIT - Story strip */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/40 py-20 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-amber-500/20 text-amber-200 backdrop-blur">Since 2018</Badge>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
              A small Kashmiri team obsessed with the mountains.
            </h2>
            <p className="mt-4 text-white/80">
              Himalayan Freak was founded by travellers who grew up hiking the Pir Panjal -
              we know which meadow blooms in May, which monastery serves the best butter tea,
              and which driver to call at 4am when Zoji La opens. Every itinerary we craft
              is one we would happily take ourselves.
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                'Locally-based team in Magam, Kashmir',
                'Direct relationships with hotels, drivers & homestays',
                'Honest pricing - no commission-led detours',
                'Backup vehicles & medical kits on every remote route',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm text-white/90">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  {line}
                </li>
              ))}
            </ul>
            <Button className="mt-7 gap-2" size="lg" onClick={() => navigate('company')}>
              Read our story <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { src: 'https://images.unsplash.com/photo-1605649461784-ef21f4e6a8ec?auto=format&fit=crop&w=800&q=80', label: 'Dal Lake' },
              { src: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', label: 'Gulmarg' },
              { src: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=800&q=80', label: 'Ladakh' },
              { src: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80', label: 'Pangong' },
            ].map((img) => (
              <div key={img.label} className="group relative aspect-square overflow-hidden rounded-2xl">
                <img src={img.src} alt={img.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-3 text-xs font-medium text-white">{img.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
                <Plane className="h-3 w-3" /> Curated packages
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Tried-and-tested journeys, fully customisable
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Start from a ready package - adjust hotels, duration, transport and add-ons
                to make it truly yours.
              </p>
            </div>
            <Button variant="ghost" className="gap-1.5 text-primary" onClick={() => navigate('packages')}>
              All packages <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPkg.map((p, i) => (
              <PackageCard key={p.slug} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* TRIP PLANNER CTA */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 p-8 text-white sm:p-12 lg:p-16">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/20 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <Badge className="mb-4 bg-white/20 text-white backdrop-blur">
                  <Sparkles className="mr-1.5 h-3 w-3" /> Custom Trip Planner
                </Badge>
                <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  Build your own Himalayan journey - step by step.
                </h2>
                <p className="mt-4 text-white/90">
                  Pick destinations, choose hotels, add meals, photographer, guide, cab -
                  and get an instant estimate. No deposits. No pressure. Just the trip you want.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" variant="secondary" className="gap-2" onClick={() => navigate('trip-planner')}>
                    <Compass className="h-4 w-4" /> Start planning
                  </Button>
                  <a href="tel:+916006266072" className="inline-flex">
                    <Button size="lg" variant="outline" className="gap-2 border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                      <Phone className="h-4 w-4" /> Talk to an expert
                    </Button>
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-white sm:gap-4">
                {[
                  { icon: MapPin, label: 'Pick destinations', n: '01' },
                  { icon: Mountain, label: 'Choose hotels', n: '02' },
                  { icon: Camera, label: 'Add photographer', n: '03' },
                  { icon: Star, label: 'Confirm & save', n: '04' },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="rounded-2xl bg-white/10 p-4 backdrop-blur"
                  >
                    <div className="flex items-center justify-between">
                      <s.icon className="h-6 w-6 text-amber-200" />
                      <span className="text-xs font-medium text-white/60">{s.n}</span>
                    </div>
                    <div className="mt-3 text-sm font-medium">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
              <Star className="h-3 w-3 fill-primary text-primary" /> Traveller stories
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by 4,500+ travellers across the Himalaya
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                name: 'Aarav & Isha',
                city: 'Mumbai',
                quote:
                  'Himalayan Freak planned our Ladakh loop down to the last chai stop. The Pangong camp under stars was unreal - we cried actual tears. The custom trip planner made it all fit our budget.',
                rating: 5,
                trip: 'Ladakh Odyssey, 7D',
              },
              {
                name: 'Rohit Sharma',
                city: 'Bengaluru',
                quote:
                  'The Khardung La sunrise at -15°C, the Wazwan dinner on a houseboat, the photographer who captured every moment - this was the most stress-free travel we have ever done.',
                rating: 5,
                trip: 'Kashmir Dreams, 5D',
              },
              {
                name: 'The Banerjee Family',
                city: 'Kolkata',
                quote:
                  'Three generations, one bus, one driver-guide who became family. They handled our parents\' pace, kids\' food fussiness, and even arranged Vaishno Devi VIP darshan.',
                rating: 5,
                trip: 'Vaishno Devi & Patnitop, 4D',
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full p-6 ring-1 ring-border/40">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="mb-3 h-6 w-6 text-primary/40" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.city} · {t.trip}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-background pb-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to walk into the Himalaya?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Call us, message us, or build your own itinerary - we usually respond within 30 minutes.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="tel:+916006266072">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Phone className="h-4 w-4" /> +91 600 626 6072
              </Button>
            </a>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => navigate('trip-planner')}>
              <Compass className="h-4 w-4" /> Build my trip
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
