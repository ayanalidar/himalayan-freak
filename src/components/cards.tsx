'use client'

import { motion } from 'framer-motion'
import { MapPin, Star, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'
import type { DestinationData } from '@/lib/data'
import { cn } from '@/lib/utils'

export function DestinationCard({ d, index = 0 }: { d: DestinationData; index?: number }) {
  const { openDestination } = useApp()
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      onClick={() => openDestination(d.slug)}
      className="group text-left"
    >
      <Card className="overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-1 ring-border/40 hover:ring-primary/40">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={d.heroImage}
            alt={d.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <Badge className="bg-background/90 text-foreground backdrop-blur">{d.region}</Badge>
            <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur">
              {d.elevation.toLocaleString()}m
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1 text-white/90">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium">{d.rating.toFixed(1)}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white drop-shadow">{d.name}</h3>
              <p className="text-xs text-white/80 line-clamp-1">{d.tagline}</p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{d.state}</span>
            <span className="mx-1">·</span>
            <span>{d.duration}</span>
            <span className="mx-1">·</span>
            <span>{d.difficulty}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{d.description}</p>
        </div>
      </Card>
    </motion.button>
  )
}

export function PackageCard({ p, index = 0 }: { p: import('@/lib/data').PackageData; index?: number }) {
  const { openPackage } = useApp()
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      onClick={() => openPackage(p.slug)}
      className="group block text-left"
    >
      <Card className="overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-1 ring-border/40 hover:ring-primary/40">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={p.heroImage}
            alt={p.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <Badge className="bg-primary text-primary-foreground">{p.region}</Badge>
            <Badge className="bg-amber-500/90 text-white">
              <Star className="mr-1 h-3 w-3 fill-white text-white" />
              {p.rating.toFixed(1)}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="mb-1 flex items-center gap-2 text-xs text-white/90">
              <span className="font-medium">{p.duration}D / {p.nights}N</span>
              <span>·</span>
              <span>{p.highlights.length} highlights</span>
            </div>
            <h3 className="font-display text-lg font-bold leading-tight text-white drop-shadow">{p.title}</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Starting from</div>
              <div className="font-display text-lg font-bold text-foreground">
                ₹{p.price.toLocaleString('en-IN')}
                <span className="ml-1 text-xs font-normal text-muted-foreground">/ person</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-1.5 transition-all">
              View details <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Card>
    </motion.button>
  )
}
