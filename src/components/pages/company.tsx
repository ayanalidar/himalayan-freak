'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Target,
  Eye,
  Heart,
  Mountain,
  Compass,
  Shield,
  Users,
  Award,
  Phone,
  MapPin,
  Mail,
  Leaf,
  Globe,
  Quote,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useApp } from '@/lib/store'

const stats = [
  { value: '2018', label: 'Founded in Magam' },
  { value: '4,500+', label: 'Happy travellers' },
  { value: '18', label: 'Destinations curated' },
  { value: '4.9', label: 'Average rating' },
]

const values = [
  {
    icon: Heart,
    title: 'Local First',
    desc: 'We hire drivers, guides and home-cooks from the very villages we visit. When you travel with us, your money stays in the mountains.',
  },
  {
    icon: Shield,
    title: 'Safety Always',
    desc: 'Every remote-route trip carries oxygen, a medical kit and a backup vehicle. Drivers are vetted, hotels are inspected, permits handled.',
  },
  {
    icon: Leaf,
    title: 'Light Footprint',
    desc: 'No plastic bottles on treks, no detours to commission shops, no overtouristed traps. We carry our trash out and we tell you the truth.',
  },
  {
    icon: Compass,
    title: 'Custom by Default',
    desc: 'No two itineraries we ship are identical. We start every plan with a 30-minute call - your pace, your food, your budget.',
  },
]

const team = [
  {
    name: 'Syed Shamshul Razvi',
    role: 'Founder & CEO',
    bio: 'Founder & CEO of Himalayan Freak. Visionary behind every custom itinerary. Born and raised in Magam, Kashmir - knows every pass, every homestay, every driver by name.',
    avatar: 'S',
  },
  {
    name: 'Imtiyaz Ahmad',
    role: 'Lead Trip Designer',
    bio: '14 years guiding in Pir Panjal & Ladakh. Speaks Kashmiri, Urdu, Hindi, Ladakhi & basic Tibetan. Designs every offbeat itinerary.',
    avatar: 'I',
  },
  {
    name: 'Suhail Bhat',
    role: 'Operations & Logistics Head',
    bio: 'Master of permits, convoy timings and oxygen cylinders. The voice you will hear at 4am if Zoji La opens.',
    avatar: 'S',
  },
  {
    name: 'Aaliya Khan',
    role: 'Customer Experience Lead',
    bio: 'Designs every pre-trip onboarding call. Believes the journey starts the day you book, not the day you fly.',
    avatar: 'A',
  },
  {
    name: 'Tashi Norbu',
    role: 'Senior Mountain Guide (Ladakh)',
    bio: 'Born in Nubra. Holds mountaineering certifications from NIM Uttarkashi. Knows every chang-la shortcut and homestay cook.',
    avatar: 'T',
  },
]

const milestones = [
  { year: '2018', text: 'Himalayan Freak founded as a one-person shop in Magam.' },
  { year: '2020', text: 'Pivoted to fully custom itineraries during the pandemic - first 100% refund policy in Kashmir.' },
  { year: '2022', text: 'Crossed 1,000 travellers; expanded to Ladakh & Spiti circuits.' },
  { year: '2024', text: 'Launched 4×4 fleet for Zanskar & Khardung La; partnered with 40+ homestays.' },
  { year: '2026', text: 'Launching the Custom Trip Planner - first AI-assisted itinerary builder in J&K.' },
]

export function CompanyPage() {
  const { navigate } = useApp()

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=2400&q=80"
            alt="Kashmir mountains"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-primary/20 text-primary backdrop-blur">About Himalayan Freak</Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white text-shadow-lg sm:text-5xl lg:text-6xl text-balance">
              A small team of mountain obsessives, born and based in Kashmir.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
              We are not a call-centre travel agency. We are six people who live on the
              Srinagar–Gulmarg road, who have walked every meadow in Pahalgam and driven
              every pass in Ladakh. We plan trips the way we would plan them for our own
              cousins - carefully, honestly, and with a deep love for the land.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
                >
                  <div className="font-display text-2xl font-bold text-white sm:text-3xl">{s.value}</div>
                  <div className="mt-1 text-xs text-white/80">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full p-8 ring-1 ring-border/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Target className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  To make the entire Himalayan range - from Pahalgam to Spiti - accessible,
                  safe and unforgettable for every kind of traveller, without ever
                  compromising the culture, ecology or economy of the regions we operate in.
                  We exist to prove that locally-rooted, honest travel can compete with - and
                  outshine - the largest online agencies.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Every itinerary we ship is one we would happily take ourselves. Every
                  hotel we recommend has been slept in by our team. Every driver we assign
                  is someone whose family we have shared tea with. That is the bar.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full p-8 ring-1 ring-border/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  A Himalayan tourism economy where the traveller gets an honest, deeply
                  local experience, and the local community receives a fair share of every
                  rupee spent. Where a trip to Gulmarg helps a Magam driver send his
                  daughter to college, and a trek in Zanskar funds a homestay in Padum.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  In ten years, we want to be the most trusted custom-Himalayan travel
                  house in India - not the largest, but the most loved. We will earn it
                  one traveller at a time.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
              <Heart className="h-3 w-3" /> What we believe
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Four principles we never compromise on
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ring-1 ring-border/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
              <Award className="h-3 w-3" /> Our journey
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              From a one-person shop to a 6-person mountain house
            </h2>
          </div>

          <div className="mt-12 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border sm:left-1/2" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`relative flex items-start gap-6 sm:w-1/2 ${
                    i % 2 === 0
                      ? 'sm:ml-auto sm:flex-row-reverse sm:text-right sm:pl-8'
                      : 'sm:mr-auto sm:pr-8'
                  } pl-10 sm:pl-0`}
                >
                  <div
                    className={`absolute top-1.5 left-2.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background sm:left-auto sm:right-auto ${
                      i % 2 === 0 ? 'sm:-left-1.5' : 'sm:-right-1.5'
                    }`}
                  />
                  <Card className="flex-1 p-5 ring-1 ring-border/40">
                    <div className="font-display text-2xl font-bold text-primary">{m.year}</div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
              <Users className="h-3 w-3" /> Meet the team
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              The humans behind your Himalayan journey
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Six people. Three states. One obsession with the mountains. You will likely
              speak to all of us at some point during your trip.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="h-full overflow-hidden ring-1 ring-border/40">
                  <div className="relative h-44 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background text-2xl font-display font-bold text-primary ring-4 ring-background">
                        {t.avatar}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold">{t.name}</h3>
                    <p className="text-xs font-medium text-primary">{t.role}</p>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t.bio}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
                <Star className="h-3 w-3 fill-primary text-primary" /> Why travel with us
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                The difference is in the details.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Big online agencies sell you a package and disappear. We sell you a
                relationship - with us, with the mountains, and with the people who live
                in them. Here is what that looks like in practice.
              </p>
              <div className="mt-6 space-y-4">
                {[
                  { title: 'Direct WhatsApp access to your trip manager', desc: 'No call-centre. The person planning your trip is the person on call at 4am if Zoji La opens or your flight is delayed.' },
                  { title: 'Pre-trip onboarding call', desc: 'A 30-minute video call before you travel - route briefing, packing list, food preferences, accessibility needs.' },
                  { title: 'Locally-vetted partners only', desc: 'Every hotel, driver and homestay is someone we have personally worked with for years. No commission-led detours.' },
                  { title: '100% refund if we cancel', desc: 'If we cancel a trip for any reason (weather, route closure, force majeure), you get every rupee back within 7 days.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Star className="h-3.5 w-3.5 fill-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-7 gap-2" onClick={() => navigate('trip-planner')}>
                <Compass className="h-4 w-4" /> Start planning your trip
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Card className="relative h-full overflow-hidden ring-1 ring-border/40">
                <img
                  src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80"
                  alt="Himalayan Freak team"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6 text-white">
                  <Quote className="mb-3 h-8 w-8 text-amber-300" />
                  <p className="font-display text-xl font-medium leading-snug sm:text-2xl">
                    "We do not sell trips. We invite people to walk the Himalaya with us -
                    the way our families have for generations."
                  </p>
                  <p className="mt-3 text-sm text-white/80">- Syed Shamshul Razvi, Founder &amp; CEO</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-gradient-to-br from-slate-900 to-amber-900/30 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-3 bg-white/15 text-white backdrop-blur">Visit us in Magam</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Come say hello at our office - or call ahead.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/80">
              We are 35 minutes from Srinagar airport, on the road to Gulmarg. Tea is always on.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, title: 'Office', lines: ['Al Falah Complex,', 'Srinagar-Gulmarg Road, Magam,', 'Jammu & Kashmir 193401, India'] },
              { icon: Phone, title: 'Call / WhatsApp', lines: ['+91 600 626 6072', '+91 979 705 1060'], hrefs: ['tel:+916006266072', 'tel:+919797051060'] },
              { icon: Mail, title: 'Email & Social', lines: ['info@himalayanfreak.in', 'Instagram: @himalayanfreaktravels', 'Facebook: /thehimalayan1'], hrefs: ['mailto:info@himalayanfreak.in', 'https://instagram.com/himalayanfreaktravels', 'https://www.facebook.com/thehimalayan1'] },
              { icon: Globe, title: 'Hours', lines: ['Mon-Sat: 9am - 8pm IST', 'Sun: 10am - 4pm IST', 'WhatsApp: 24x7'] },
            ].map((c) => (
              <Card key={c.title} className="border-0 bg-white/5 p-6 text-white backdrop-blur">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{c.title}</h3>
                <div className="mt-2 space-y-1 text-sm text-white/80">
                  {c.lines.map((l, i) =>
                    c.hrefs ? (
                      <a key={i} href={c.hrefs[i]} target={c.hrefs[i].startsWith('http') ? '_blank' : undefined} rel={c.hrefs[i].startsWith('http') ? 'noopener noreferrer' : undefined} className="block hover:text-amber-300 transition-colors">
                        {l}
                      </a>
                    ) : (
                      <p key={i}>{l}</p>
                    )
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
