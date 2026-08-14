'use client'

import Image from 'next/image'
import { MapPin, Phone, Mail, Mountain, Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react'
import { useApp } from '@/lib/store'
import { destinations, packages } from '@/lib/data'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function Footer() {
  const { navigate, openDestination, openPackage } = useApp()

  const featuredDest = destinations.filter((d) => d.featured).slice(0, 6)
  const featuredPkg = packages.filter((p) => p.featured).slice(0, 4)

  const onSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = data.get('email')
    if (email) {
      toast.success('Subscribed!', { description: 'You will receive our monthly Himalayan travel journal.' })
      ;(e.target as HTMLFormElement).reset()
    }
  }

  return (
    <footer className="mt-auto border-t border-border bg-gradient-to-b from-background to-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.webp" alt="Himalayan Freak" width={48} height={48} className="h-12 w-12 rounded-full ring-2 ring-primary/30" />
              <div>
                <div className="font-display text-xl font-bold">
                  Himalayan <span className="text-primary">Freak</span>
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Custom Himalayan Journeys
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A Kashmir-born travel house crafting bespoke journeys across Jammu, Kashmir, Ladakh
              and the entire Himalayan range. Locally rooted. Globally trusted.
            </p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button className="hover:text-primary transition-colors" onClick={() => navigate('company')}>About Us</button></li>
              <li><button className="hover:text-primary transition-colors" onClick={() => navigate('packages')}>Packages</button></li>
              <li><button className="hover:text-primary transition-colors" onClick={() => navigate('trip-planner')}>Trip Planner</button></li>
              <li><button className="hover:text-primary transition-colors" onClick={() => navigate('crm')}>CRM Dashboard</button></li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="lg:col-span-3">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">Top Destinations</h4>
            <ul className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-1">
              {featuredDest.map((d) => (
                <li key={d.slug}>
                  <button
                    className="hover:text-primary transition-colors text-left"
                    onClick={() => openDestination(d.slug)}
                  >
                    {d.name}, {d.state}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Al Falah Complex, Srinagar–Gulmarg Road, Magam, Jammu &amp; Kashmir 193401, India</span>
              </li>
              <li>
                <a href="tel:+916006266072" className="flex items-center gap-2.5 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary" /> +91 600 626 6072
                </a>
              </li>
              <li>
                <a href="tel:+919797051060" className="flex items-center gap-2.5 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary" /> +91 979 705 1060
                </a>
              </li>
              <li>
                <a href="mailto:hello@himalayanfreak.com" className="flex items-center gap-2.5 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 text-primary" /> hello@himalayanfreak.com
                </a>
              </li>
            </ul>

            <form onSubmit={onSubscribe} className="mt-5">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Subscribe to our journal
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  name="email"
                  required
                  placeholder="you@email.com"
                  className="h-9"
                />
                <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Himalayan Freak. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Cancellation</a>
          </div>
          <div className="flex items-center gap-1.5">
            <Mountain className="h-3.5 w-3.5 text-primary" />
            <span>Made in the Himalayas</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
