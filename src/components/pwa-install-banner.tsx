'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Mountain, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'hf-pwa-install-dismissed'
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  // Lazy init - detect standalone mode once on mount (client-only)
  const [installed, setInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    return standalone
  })

  useEffect(() => {
    // If already in standalone mode, no need for banner
    if (installed) return

    // Check if user has dismissed recently
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY)
      if (dismissed) {
        const dismissedTime = Number(dismissed)
        if (Date.now() - dismissedTime < DISMISS_DURATION) {
          return // don't show banner
        }
      }
    } catch {}

    // Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show banner after a short delay so it doesn't interrupt initial load
      setTimeout(() => setShowBanner(true), 3000)
    }

    const handleAppInstalled = () => {
      setInstalled(true)
      setShowBanner(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const onInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setInstalled(true)
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  const onDismiss = () => {
    setShowBanner(false)
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {}
  }

  // Don't render if already installed
  if (installed) return null

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed top-20 left-1/2 z-40 w-[calc(100vw-2.5rem)] max-w-md -translate-x-1/2"
        >
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-2xl ring-1 ring-amber-500/20">
            {/* Decorative glow */}
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl" />

            <div className="relative flex items-start gap-3">
              {/* Logo */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 ring-2 ring-white/20">
                <Mountain className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold text-white">
                    Install Himalayan Freak
                  </h3>
                  <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-medium text-amber-300">
                    PWA
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-white/70">
                  Add to your home screen for app-like experience, offline access, and faster load times.
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={onInstall}
                    className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 h-8"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Install App
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDismiss}
                    className="h-8 text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    Not now
                  </Button>
                </div>
              </div>

              <button
                onClick={onDismiss}
                className="shrink-0 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 flex items-center gap-1.5 border-t border-white/10 pt-2 text-[10px] text-white/40">
              <Smartphone className="h-3 w-3" />
              <span>Works offline · Faster · No app store needed</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
