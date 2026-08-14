'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Mountain, Loader2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/store'
import { toast } from 'sonner'

export function LoginPage() {
  const { navigate } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      toast.error('Invalid credentials', { description: 'Check your email and password.' })
      return
    }
    toast.success('Welcome back!')
    // After login, navigate based on role
    setTimeout(async () => {
      try {
        const sres = await fetch('/api/auth/session').then((r) => r.json())
        const role = sres?.user?.role
        if (role === 'admin') navigate('crm')
        else navigate('dashboard')
      } catch {
        navigate('home')
      }
    }, 200)
  }

  const quickFill = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setEmail('admin@himalayanfreak.com')
      setPassword('admin123')
    } else {
      setEmail('aarav@example.com')
      setPassword('user123')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=80"
            alt="Himalaya"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-amber-900/30" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <button
              onClick={() => navigate('home')}
              className="mb-6 flex items-center gap-3 mx-auto"
            >
              <Image src="/logo.webp" alt="Logo" width={48} height={48} className="h-12 w-12 rounded-full ring-2 ring-amber-400/40" />
              <div className="text-left">
                <div className="font-display text-xl font-bold text-white">
                  Himalayan <span className="text-amber-400">Freak</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                  Custom Himalayan Journeys
                </div>
              </div>
            </button>

            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
              <div className="text-center">
                <Badge className="mb-2 bg-amber-500/15 text-amber-400">Sign in</Badge>
                <h1 className="font-display text-2xl font-bold text-white">Welcome back, traveller</h1>
                <p className="mt-1 text-sm text-white/70">
                  Sign in to access your trips, saved destinations & dashboard.
                </p>
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-white/70">
                    Email
                  </Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                      className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-white/70">
                    Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      id="password"
                      type={show ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="border-white/10 bg-white/5 pl-9 pr-9 text-white placeholder:text-white/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                    </>
                  ) : (
                    <>
                      Sign in <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <Separator className="bg-white/10" />
                <span className="text-xs text-white/50">Quick demo</span>
                <Separator className="bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickFill('admin')}
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  <Shield /> Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickFill('user')}
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  <User /> Traveller
                </Button>
              </div>

              <p className="mt-6 text-center text-sm text-white/70">
                New to Himalayan Freak?{' '}
                <button onClick={() => navigate('signup')} className="font-medium text-amber-400 hover:underline">
                  Create an account
                </button>
              </p>
            </Card>

            <button
              onClick={() => navigate('home')}
              className="mt-5 mx-auto block text-xs text-white/60 hover:text-white"
            >
              ← Back to home
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Shield() {
  return <Mountain className="h-3.5 w-3.5" />
}
