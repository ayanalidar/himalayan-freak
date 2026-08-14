'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Menu,
  X,
  Phone,
  Moon,
  Sun,
  Mountain,
  ChevronDown,
  LogIn,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Shield,
  Plane,
  Sparkles,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useApp, type PageId } from '@/lib/store'
import { useAuth } from '@/components/auth-provider'
import { cn } from '@/lib/utils'

const navItems: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'company', label: 'Company' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'packages', label: 'Packages' },
  { id: 'tickets', label: 'Flights & Trains' },
  { id: 'trip-planner', label: 'Trip Planner' },
  { id: 'group-booking', label: 'Groups' },
]

export function Navbar() {
  const { page, navigate } = useApp()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { setTheme } = useTheme()
  const { session, status, signOut } = useAuth()

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

  const user = session?.user
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-slate-950/95 shadow-lg shadow-black/30 backdrop-blur-md border-b border-white/10'
          : 'bg-slate-900/85 backdrop-blur-md border-b border-white/10'
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
            className="h-9 w-9 rounded-full object-cover ring-2 ring-amber-400/40"
            priority
          />
          <div className="hidden sm:block text-left leading-tight">
            <div className="font-display text-lg font-bold tracking-tight text-white">
              Himalayan <span className="text-amber-400">Freak</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">
              Custom Himalayan Journeys
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const active =
              page === item.id ||
              (item.id === 'destinations' && page === 'destination-detail') ||
              (item.id === 'packages' && page === 'package-detail')
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={cn(
                  'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-amber-400'
                    : 'text-white/80 hover:text-amber-300'
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-amber-400" />
                )}
              </button>
            )
          })}
          {user?.role === 'admin' && (
            <button
              onClick={() => go('crm')}
              className={cn(
                'relative rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5',
                page === 'crm' || page === 'admin-destinations' || page === 'admin-packages'
                  ? 'text-amber-400'
                  : 'text-white/80 hover:text-amber-300'
              )}
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
              {(page === 'crm' || page === 'admin-destinations' || page === 'admin-packages') && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-amber-400" />
              )}
            </button>
          )}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:inline-flex text-white hover:bg-white/10 hover:text-white"
            aria-label="Toggle theme"
          >
            <Moon className="hidden dark:block h-4 w-4" />
            <Sun className="dark:hidden h-4 w-4" />
          </Button>
          <a href="tel:+916006266072" className="hidden xl:flex">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Phone className="h-4 w-4" />
              +91 600 626 6072
            </Button>
          </a>
          <Button
            onClick={() => go('trip-planner')}
            size="sm"
            className="hidden sm:inline-flex gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
          >
            <Mountain className="h-4 w-4" />
            Plan My Trip
          </Button>

          {/* Auth */}
          {status === 'loading' ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 ring-2 ring-white/20 hover:ring-amber-400/40">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-display text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                    {user.role === 'admin' && (
                      <Badge className="mt-1 w-fit gap-1 bg-amber-500/15 text-amber-600">
                        <Shield className="h-3 w-3" /> Admin
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => go('dashboard')} className="gap-2 cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" /> My Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => go('tickets')} className="gap-2 cursor-pointer">
                  <Plane className="h-4 w-4" /> Flights & Trains
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => go('trip-planner')} className="gap-2 cursor-pointer">
                  <Sparkles className="h-4 w-4" /> Plan a Trip
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => go('crm')} className="gap-2 cursor-pointer">
                      <Shield className="h-4 w-4" /> CRM Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => go('admin-destinations')} className="gap-2 cursor-pointer">
                      <Mountain className="h-4 w-4" /> Manage Destinations
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => go('login')}
              size="sm"
              variant="outline"
              className="gap-1.5 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign in</span>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10 hover:text-white"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
              <SheetTitle className="sr-only">Himalayan Freak Navigation</SheetTitle>
              <div className="flex h-full flex-col bg-slate-950 text-white">
                <div className="flex items-center justify-between border-b border-white/10 p-4">
                  <div className="flex items-center gap-2">
                    <Image src="/logo.webp" alt="Logo" width={32} height={32} className="h-8 w-8 rounded-full ring-2 ring-amber-400/40" />
                    <span className="font-display font-bold">Himalayan Freak</span>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close menu" className="text-white hover:bg-white/10">
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
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4 -rotate-90" />
                    </button>
                  ))}
                  {user?.role === 'admin' && (
                    <>
                      <button
                        onClick={() => go('crm')}
                        className={cn(
                          'flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors gap-2',
                          page === 'crm'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> CRM</span>
                        <ChevronDown className="h-4 w-4 -rotate-90" />
                      </button>
                      <button
                        onClick={() => go('admin-destinations')}
                        className={cn(
                          'flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors gap-2',
                          page === 'admin-destinations'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        <span className="flex items-center gap-2"><Mountain className="h-4 w-4" /> Edit Destinations</span>
                        <ChevronDown className="h-4 w-4 -rotate-90" />
                      </button>
                    </>
                  )}
                </nav>
                <div className="mt-auto border-t border-white/10 p-4 space-y-2">
                  {user ? (
                    <>
                      <div className="rounded-lg bg-white/5 p-3">
                        <div className="text-xs text-white/60">Signed in as</div>
                        <div className="mt-0.5 text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-white/60">{user.email}</div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        onClick={() => go('dashboard')}
                      >
                        <LayoutDashboard className="h-4 w-4" /> My Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200"
                        onClick={() => signOut()}
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-600"
                      onClick={() => go('login')}
                    >
                      <LogIn className="h-4 w-4" /> Sign in
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <a href="tel:+916006266072" className="flex-1">
                      <Button variant="outline" className="w-full justify-start gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                        <Phone className="h-4 w-4" /> +91 60062 66072
                      </Button>
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
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
