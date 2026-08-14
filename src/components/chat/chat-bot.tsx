'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Loader2,
  Bot,
  User as UserIcon,
  Plane,
  Calendar,
  MapPin,
  IndianRupee,
  Compass,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/store'
import { useAuth } from '@/components/auth-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const SUGGESTED_PROMPTS = [
  { icon: MapPin, text: 'Plan a 5-day trip to Kashmir in October for 2 people' },
  { icon: Plane, text: 'What\'s the best time to visit Ladakh?' },
  { icon: Compass, text: 'I want an adventure trip under ₹30,000 - what do you recommend?' },
  { icon: Calendar, text: 'Family trip with kids - Srinagar or Manali?' },
  { icon: IndianRupee, text: 'How much does a 7-day Ladakh package cost?' },
  { icon: Sparkles, text: 'Plan my honeymoon to Gulmarg in December' },
]

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Namaste! I'm Freak - your AI travel agent for the Himalaya. I can plan trips, recommend destinations, quote prices and even create bookings. How can I help you explore today?",
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingIntent, setBookingIntent] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '' })
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { navigate } = useApp()
  const { session } = useAuth()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const send = useCallback(async (text?: string) => {
    const content = (text || input).trim()
    if (!content || loading) return

    const userMsg: Message = { role: 'user', content, timestamp: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          sessionId: 'chat-' + (session?.user?.email || 'guest'),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      const aiMsg: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMsg])

      if (data.bookingIntent) {
        setBookingIntent(true)
        if (session?.user) {
          setContactForm({
            name: session.user.name || '',
            email: session.user.email || '',
            phone: (session.user as any).phone || '',
          })
        }
      }
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble right now. Please call +91 600 626 6072 and our team will help you immediately.",
          timestamp: Date.now(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, session])

  const submitBooking = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.phone) {
      toast.error('All fields required')
      return
    }
    setLoading(true)
    try {
      const chatHistory = messages.map((m) => `${m.role}: ${m.content}`).join('\n')
      const res = await fetch('/api/chat/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactForm,
          chatHistory,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success('Booking request created!', {
        description: `Ref: ${data.refCode}. Our team will contact you within 30 minutes.`,
      })
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Excellent! I've created your booking request - ref ${data.refCode}. Our team will WhatsApp you within 30 minutes with a personalised quote. You can also track this in your dashboard. Want me to help with anything else?`,
          timestamp: Date.now(),
        },
      ])
      setBookingIntent(false)
      setContactForm({ name: '', email: '', phone: '' })
    } catch {
      toast.error('Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Let's start fresh! How can I help you plan your Himalayan trip?",
      timestamp: Date.now(),
    }])
    setBookingIntent(false)
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-orange-900/30 hover:scale-105 transition-transform"
            aria-label="Open chat"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-amber-500" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-5 z-50 flex h-[600px] max-h-[85vh] w-[calc(100vw-2.5rem)] sm:w-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600">
                  <Bot className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                </div>
                <div>
                  <div className="font-display font-bold leading-tight">Freak AI</div>
                  <div className="text-[10px] text-white/60">Your Himalayan travel agent</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={clearChat} className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Clear chat">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button onClick={() => setOpen(false)} className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'flex gap-2',
                    m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                  )}>
                    {m.role === 'user' ? <UserIcon className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm',
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-card border border-border/60 rounded-tl-sm'
                  )}>
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl border border-border/60 bg-card px-4 py-3">
                    {[0, 0.2, 0.4].map((delay) => (
                      <motion.span
                        key={delay}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay, repeat: Infinity }}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                      />
                    ))}
                  </div>
                </div>
              )}

              {bookingIntent && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-semibold">Create your booking</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Just need your contact details and we&apos;ll set this up.</p>
                  <div className="space-y-2">
                    <Input placeholder="Full name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="h-9" />
                    <Input type="email" placeholder="Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="h-9" />
                    <Input placeholder="Phone / WhatsApp" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="h-9" />
                    <Button onClick={submitBooking} disabled={loading} className="w-full gap-2 h-9 bg-gradient-to-r from-amber-500 to-orange-600">
                      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Create booking
                    </Button>
                  </div>
                </motion.div>
              )}

              {messages.length <= 2 && !loading && !bookingIntent && (
                <div className="pt-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-2">Try asking</p>
                  <div className="grid gap-1.5">
                    {SUGGESTED_PROMPTS.slice(0, 4).map((p) => (
                      <button
                        key={p.text}
                        onClick={() => send(p.text)}
                        className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-left text-xs hover:border-primary/40 hover:bg-muted/40 transition-colors"
                      >
                        <p.icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="line-clamp-1">{p.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-background p-3">
              <form
                onSubmit={(e) => { e.preventDefault(); send() }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about Himalayan travel..."
                  disabled={loading || bookingIntent}
                  className="h-10"
                />
                <Button type="submit" size="icon" disabled={loading || !input.trim()} className="h-10 w-10 shrink-0 bg-gradient-to-r from-amber-500 to-orange-600">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
              <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                Powered by AI · Travel agent for the Himalaya
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
