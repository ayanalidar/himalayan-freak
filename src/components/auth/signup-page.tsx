'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/store'
import { toast } from 'sonner'

export function SignupPage() {
  const { navigate } = useApp()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    state: '',
  })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password too short', { description: 'Use at least 6 characters.' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Signup failed')
        return
      }
      // Auto-sign in
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      toast.success('Welcome to Himalayan Freak!')
      setTimeout(() => navigate('dashboard'), 200)
    } catch {
      toast.error('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1605649461784-ef21f4e6a8ec?auto=format&fit=crop&w=2400&q=80"
            alt="Kashmir"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-emerald-900/30" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-10">
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
                <Badge className="mb-2 bg-amber-500/15 text-amber-400">Sign up</Badge>
                <h1 className="font-display text-2xl font-bold text-white">Begin your journey</h1>
                <p className="mt-1 text-sm text-white/70">
                  Create an account to save trips, build itineraries & access your dashboard.
                </p>
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
                <div>
                  <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-white/70">
                    Full name
                  </Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Aarav Mehta"
                      required
                      className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-white/70">
                      Email
                    </Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@email.com"
                        required
                        className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-wide text-white/70">
                      Phone
                    </Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 60000 00000"
                        className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="city" className="text-xs font-medium uppercase tracking-wide text-white/70">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Mumbai"
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-xs font-medium uppercase tracking-wide text-white/70">
                      State
                    </Label>
                    <Input
                      id="state"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      placeholder="Maharashtra"
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-white/70">
                    Password <span className="text-white/40">(min 6 chars)</span>
                  </Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      id="password"
                      type={show ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                    </>
                  ) : (
                    <>
                      Create account <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-white/70">
                Already have an account?{' '}
                <button onClick={() => navigate('login')} className="font-medium text-amber-400 hover:underline">
                  Sign in
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
