'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone, Moon, Sun, Mountain, ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { useApp, type PageId } from '@/lib/store'
import { cn } from '@/lib/utils'

const navItems: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'company', label: 'Company' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'packages', label: 'Packages' },
  { id: 'trip-planner', label: 'Trip Planner' },
  { id: 'crm', label: 'CRM' },
]

export function Navbar() {
  const { page, navigate } = useApp()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { setTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'light' : 'dark')
  }

  const go = (id: PageId) => {
    navigate(id)
    setOpen(false)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'glass shadow-sm border-b border-border/40'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => go('home')}
          className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
          aria-label="Himalayan Freak home"
        >
          <Image
            src="/logo.webp"
            alt="Himalayan Freak logo"
            width={40}
            height={40}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/30"
            priority
          />
          <div className="hidden sm:block text-left leading-tight">
            <div className="font-display text-lg font-bold tracking-tight text-foreground">
              Himalayan <span className="text-primary">Freak</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Custom Himalayan Journeys
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={cn(
                'relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors',
                page === item.id || (item.id === 'destinations' && page === 'destination-detail') || (item.id === 'packages' && page === 'package-detail')
                  ? 'text-primary'
                  : 'text-foreground/80 hover:text-primary'
              )}
            >
              {item.label}
              {(page === item.id || (item.id === 'destinations' && page === 'destination-detail') || (item.id === 'packages' && page === 'package-detail')) && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:inline-flex"
            aria-label="Toggle theme"
          >
            <Moon className="hidden dark:block h-4 w-4" />
            <Sun className="dark:hidden h-4 w-4" />
          </Button>
          <a href="tel:+916006266072" className="hidden md:flex">
            <Button variant="outline" size="sm" className="gap-2">
              <Phone className="h-4 w-4" />
              +91 600 626 6072
            </Button>
          </a>
          <Button
            onClick={() => go('trip-planner')}
            size="sm"
            className="hidden sm:inline-flex gap-1.5"
          >
            <Mountain className="h-4 w-4" />
            Plan My Trip
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
              <SheetTitle className="sr-only">Himalayan Freak Navigation</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div className="flex items-center gap-2">
                    <Image src="/logo.webp" alt="Logo" width={32} height={32} className="h-8 w-8 rounded-full" />
                    <span className="font-display font-bold">Himalayan Freak</span>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close menu">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => go(item.id)}
                      className={cn(
                        'flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors',
                        page === item.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4 -rotate-90" />
                    </button>
                  ))}
                </nav>
                <div className="mt-auto border-t border-border p-4 space-y-2">
                  <a href="tel:+916006266072" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Phone className="h-4 w-4" />
                      +91 600 626 6072
                    </Button>
                  </a>
                  <a href="tel:+919797051060" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Phone className="h-4 w-4" />
                      +91 979 705 1060
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={toggleTheme}
                  >
                    <Moon className="hidden dark:block h-4 w-4" />
                    <Sun className="dark:hidden h-4 w-4" />
                    <span className="dark:hidden">Dark Mode</span>
                    <span className="hidden dark:inline">Light Mode</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
