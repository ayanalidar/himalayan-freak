'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard,
  Users,
  Target,
  CalendarCheck,
  TrendingUp,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Briefcase,
  UserPlus,
  CalendarDays,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { leadStages, leadSources } from '@/lib/data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  destination?: string | null
  travelDate?: string | null
  pax: number
  budget?: string | null
  source: string
  status: string
  notes?: string | null
  assignedTo?: string | null
  createdAt: string
}

type Customer = {
  id: string
  name: string
  email: string
  phone: string
  city?: string | null
  state?: string | null
  totalTrips: number
  totalSpent: number
  type: string
  notes?: string | null
  createdAt: string
}

type Booking = {
  id: string
  refCode: string
  tripName: string
  startDate: string
  endDate: string
  pax: number
  amount: number
  status: string
  paymentStatus: string
  notes?: string | null
}

type Dashboard = {
  totals: {
    leads: number
    customers: number
    trips: number
    bookings: number
    revenueWon: number
    pipelineValue: number
    wonLeads: number
    activeTrips: number
  }
  leadsByStage: Record<string, number>
  bySource: Record<string, number>
  months: { month: string; revenue: number; leads: number }[]
  recentLeads: Lead[]
  recentTrips: any[]
}

const stageColors: Record<string, string> = {
  New: 'bg-sky-500',
  Contacted: 'bg-indigo-500',
  Qualified: 'bg-violet-500',
  Proposal: 'bg-amber-500',
  Negotiation: 'bg-orange-500',
  Won: 'bg-emerald-500',
  Lost: 'bg-rose-500',
}

const sourceColors = ['#f59e0b', '#0ea5e9', '#8b5cf6', '#10b981', '#ec4899', '#f97316']

export function CrmPage() {
  const [tab, setTab] = useState('dashboard')
  const [leads, setLeads] = useState<Lead[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [dash, setDash] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [leadDialog, setLeadDialog] = useState(false)
  const [custDialog, setCustDialog] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [lRes, cRes, bRes, dRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/customers'),
        fetch('/api/bookings'),
        fetch('/api/dashboard'),
      ])
      const [l, c, b, d] = await Promise.all([
        lRes.json(),
        cRes.json(),
        bRes.json(),
        dRes.json(),
      ])
      setLeads(l)
      setCustomers(c)
      setBookings(b)
      setDash(d)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.destination || '').toLowerCase().includes(search.toLowerCase())
  )

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  const moveLead = async (id: string, status: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      toast.success(`Lead moved to ${status}`)
      refresh()
    } catch {
      toast.error('Failed to update lead')
      refresh()
    }
  }

  const deleteLead = async (id: string) => {
    try {
      await fetch(`/api/leads?id=${id}`, { method: 'DELETE' })
      setLeads((prev) => prev.filter((l) => l.id !== id))
      toast.success('Lead deleted')
      refresh()
    } catch {
      toast.error('Failed to delete lead')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-muted/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">CRM Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage leads, customers & bookings — all in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads, customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={refresh}>
              <Filter className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6 flex h-auto w-full flex-wrap gap-1 bg-muted p-1">
            <TabsTrigger value="dashboard" className="flex-1 gap-1.5">
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex-1 gap-1.5">
              <Target className="h-3.5 w-3.5" /> Leads ({leads.length})
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex-1 gap-1.5">
              <Users className="h-3.5 w-3.5" /> Customers ({customers.length})
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex-1 gap-1.5">
              <CalendarCheck className="h-3.5 w-3.5" /> Bookings ({bookings.length})
            </TabsTrigger>
          </TabsList>

          {/* DASHBOARD */}
          <TabsContent value="dashboard" className="mt-0">
            {loading || !dash ? (
              <DashboardSkeleton />
            ) : (
              <div className="space-y-6">
                {/* KPI cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <KpiCard
                    icon={Target}
                    label="Total leads"
                    value={dash.totals.leads.toString()}
                    delta="+12% MoM"
                    deltaUp
                  />
                  <KpiCard
                    icon={Users}
                    label="Customers"
                    value={dash.totals.customers.toString()}
                    delta="+3 new this month"
                    deltaUp
                  />
                  <KpiCard
                    icon={IndianRupee}
                    label="Pipeline value"
                    value={`₹${dash.totals.pipelineValue.toLocaleString('en-IN')}`}
                    delta="From active leads"
                    deltaUp
                  />
                  <KpiCard
                    icon={TrendingUp}
                    label="Revenue (won)"
                    value={`₹${dash.totals.revenueWon.toLocaleString('en-IN')}`}
                    delta="+18% MoM"
                    deltaUp
                  />
                </div>

                {/* Charts */}
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="p-5 ring-1 ring-border/40 lg:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-base font-bold">Revenue & leads trend</h3>
                        <p className="text-xs text-muted-foreground">Last 6 months</p>
                      </div>
                      <Badge variant="outline" className="gap-1.5">
                        <TrendingUp className="h-3 w-3 text-emerald-500" /> Growing
                      </Badge>
                    </div>
                    <div className="mt-5 h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dash.months}>
                          <defs>
                            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="lds" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.15)" />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="rgba(120,120,120,0.5)" />
                          <YAxis tick={{ fontSize: 11 }} stroke="rgba(120,120,120,0.5)" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(20,20,30,0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              color: 'white',
                              fontSize: '12px',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            fill="url(#rev)"
                            name="Revenue (₹)"
                          />
                          <Area
                            type="monotone"
                            dataKey="leads"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            fill="url(#lds)"
                            name="Leads"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-5 ring-1 ring-border/40">
                    <h3 className="font-display text-base font-bold">Leads by source</h3>
                    <p className="text-xs text-muted-foreground">Where they come from</p>
                    <div className="mt-4 h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(dash.bySource).map(([name, value]) => ({ name, value }))}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={2}
                          >
                            {Object.entries(dash.bySource).map((_, i) => (
                              <Cell key={i} fill={sourceColors[i % sourceColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(20,20,30,0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              color: 'white',
                              fontSize: '12px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {Object.entries(dash.bySource).map(([src, count], i) => (
                        <div key={src} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: sourceColors[i % sourceColors.length] }}
                            />
                            {src}
                          </span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Stage breakdown */}
                <Card className="p-5 ring-1 ring-border/40">
                  <h3 className="font-display text-base font-bold">Leads by stage</h3>
                  <p className="text-xs text-muted-foreground">Pipeline distribution</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-7">
                    {leadStages.map((stage) => {
                      const count = dash.leadsByStage[stage] || 0
                      const max = Math.max(...Object.values(dash.leadsByStage), 1)
                      const pct = (count / max) * 100
                      return (
                        <div key={stage} className="rounded-lg border border-border/60 bg-muted/30 p-3 text-center">
                          <div className="text-xs text-muted-foreground">{stage}</div>
                          <div className="mt-1 font-display text-xl font-bold">{count}</div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn('h-full rounded-full', stageColors[stage])}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                {/* Recent activity */}
                <div className="grid gap-4 lg:grid-cols-2">
                  <Card className="p-5 ring-1 ring-border/40">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold">Recent leads</h3>
                      <Button variant="ghost" size="sm" onClick={() => setTab('leads')}>
                        View all →
                      </Button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {dash.recentLeads.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">No leads yet</p>
                      ) : (
                        dash.recentLeads.map((l) => (
                          <div key={l.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-primary text-sm">
                              {l.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="truncate text-sm font-medium">{l.name}</span>
                                <Badge variant="outline" className={`px-1.5 py-0 text-[10px] ${stageColors[l.status]} border-0 text-white`}>
                                  {l.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {l.destination || '—'} · {l.pax} pax
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>

                  <Card className="p-5 ring-1 ring-border/40">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold">Recent trip submissions</h3>
                      <Button variant="ghost" size="sm" onClick={() => setTab('bookings')}>
                        View all →
                      </Button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {dash.recentTrips.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">No trip submissions yet</p>
                      ) : (
                        dash.recentTrips.map((t) => (
                          <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                              <Briefcase className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate text-sm font-medium">{t.name}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {t.duration}D · {t.pax} pax · ₹{t.estimatedPrice.toLocaleString('en-IN')}
                              </div>
                            </div>
                            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                              {t.status}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* LEADS KANBAN */}
          <TabsContent value="leads" className="mt-0">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Drag leads across stages or use the menu. {filteredLeads.length} leads shown.
              </p>
              <LeadDialog onCreated={refresh} />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4">
              {leadStages.map((stage) => {
                const stageLeads = filteredLeads.filter((l) => l.status === stage)
                return (
                  <div
                    key={stage}
                    className="flex w-72 shrink-0 flex-col rounded-xl bg-muted/40"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const id = e.dataTransfer.getData('text/plain')
                      if (id) moveLead(id, stage)
                    }}
                  >
                    <div className="flex items-center justify-between border-b border-border/60 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={cn('h-2.5 w-2.5 rounded-full', stageColors[stage])} />
                        <span className="text-sm font-semibold">{stage}</span>
                        <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                          {stageLeads.length}
                        </Badge>
                      </div>
                    </div>
                    <div className="max-h-[60vh] space-y-2 overflow-y-auto p-2">
                      {stageLeads.map((l) => (
                        <div
                          key={l.id}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData('text/plain', l.id)}
                          className="group cursor-grab rounded-lg border border-border/60 bg-background p-3 transition-all hover:shadow-md active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold truncate">{l.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{l.destination || 'No destination'}</div>
                            </div>
                            <LeadMenu lead={l} onMove={moveLead} onDelete={deleteLead} />
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className="inline-flex items-center gap-0.5">
                              <Users className="h-3 w-3" /> {l.pax}
                            </span>
                            {l.budget && (
                              <span className="inline-flex items-center gap-0.5">
                                <IndianRupee className="h-3 w-3" />
                                {l.budget.replace('~₹', '').replace('₹', '')}
                              </span>
                            )}
                            {l.travelDate && (
                              <span className="inline-flex items-center gap-0.5">
                                <CalendarDays className="h-3 w-3" />
                                {new Date(l.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                              {l.source}
                            </Badge>
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <a href={`tel:${l.phone}`} className="text-muted-foreground hover:text-primary">
                                <Phone className="h-3 w-3" />
                              </a>
                              <a href={`mailto:${l.email}`} className="text-muted-foreground hover:text-primary">
                                <Mail className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                          {l.notes && (
                            <p className="mt-2 line-clamp-2 text-[11px] text-muted-foreground/80">{l.notes}</p>
                          )}
                        </div>
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">
                          Drop leads here
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          {/* CUSTOMERS TABLE */}
          <TabsContent value="customers" className="mt-0">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{filteredCustomers.length} customers</p>
              <CustomerDialog onCreated={refresh} />
            </div>

            <Card className="overflow-hidden ring-1 ring-border/40">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Trips</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{c.name}</div>
                            {c.notes && (
                              <div className="text-[11px] text-muted-foreground line-clamp-1">{c.notes}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>{c.email}</div>
                          <div className="text-muted-foreground">{c.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>{c.city || '—'}</div>
                          <div className="text-muted-foreground">{c.state || '—'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{c.totalTrips}</TableCell>
                      <TableCell className="text-right font-medium text-emerald-600">
                        ₹{c.totalSpent.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <a href={`tel:${c.phone}`}>
                            <Button size="icon" variant="ghost" className="h-7 w-7">
                              <Phone className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                          <a href={`mailto:${c.email}`}>
                            <Button size="icon" variant="ghost" className="h-7 w-7">
                              <Mail className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                        No customers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* BOOKINGS TABLE */}
          <TabsContent value="bookings" className="mt-0">
            <p className="mb-4 text-sm text-muted-foreground">{bookings.length} bookings total</p>
            <Card className="overflow-hidden ring-1 ring-border/40">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref</TableHead>
                    <TableHead>Trip</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Pax</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <span className="font-mono text-xs font-medium">{b.refCode}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{b.tripName}</div>
                        {b.notes && (
                          <div className="text-[11px] text-muted-foreground line-clamp-1">{b.notes}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>{b.startDate}</div>
                          <div className="text-muted-foreground">→ {b.endDate}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{b.pax}</TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{b.amount.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <BookingBadge status={b.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentBadge status={b.paymentStatus} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {bookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                        No bookings yet. Submit a trip via the Trip Planner to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaUp,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  delta: string
  deltaUp?: boolean
}) {
  return (
    <Card className="p-5 ring-1 ring-border/40 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        {deltaUp !== undefined && (
          <Badge
            variant="outline"
            className={`gap-1 text-[10px] ${
              deltaUp ? 'text-emerald-600 border-emerald-200' : 'text-rose-600 border-rose-200'
            }`}
          >
            {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          </Badge>
        )}
      </div>
      <div className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{delta}</div>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="h-32 p-5">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
            <div className="mt-3 h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-6 w-28 animate-pulse rounded bg-muted" />
          </Card>
        ))}
      </div>
      <Card className="h-80 p-5">
        <div className="h-full w-full animate-pulse rounded bg-muted" />
      </Card>
    </div>
  )
}

function LeadMenu({
  lead,
  onMove,
  onDelete,
}: {
  lead: Lead
  onMove: (id: string, status: string) => void
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        onClick={() => setOpen(!open)}
        aria-label="Lead menu"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-7 z-50 w-44 rounded-lg border border-border bg-popover p-1 shadow-lg">
            <div className="px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Move to
            </div>
            {leadStages.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onMove(lead.id, s)
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-muted"
              >
                <span className={cn('h-2 w-2 rounded-full', stageColors[s])} />
                {s}
              </button>
            ))}
            <Separator className="my-1" />
            <button
              onClick={() => {
                onDelete(lead.id)
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function BookingBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    Confirmed: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',
    InProgress: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400',
    Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    Cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium', map[status] || 'bg-muted text-muted-foreground')}>
      {status}
    </span>
  )
}

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Unpaid: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    Partial: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium', map[status] || 'bg-muted text-muted-foreground')}>
      {status}
    </span>
  )
}

function LeadDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelDate: '',
    pax: 2,
    budget: '',
    source: 'Website',
    status: 'New',
    notes: '',
  })

  const onSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Lead created!')
      setForm({
        name: '',
        email: '',
        phone: '',
        destination: '',
        travelDate: '',
        pax: 2,
        budget: '',
        source: 'Website',
        status: 'New',
        notes: '',
      })
      setOpen(false)
      onCreated()
    } catch {
      toast.error('Failed to create lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> New lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add new lead</DialogTitle>
          <DialogDescription>
            Capture the lead&apos;s details. You can move them across stages later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="ln">Name *</Label>
              <Input id="ln" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="le">Email *</Label>
              <Input id="le" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lp">Phone *</Label>
              <Input id="lp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ld">Destination</Label>
              <Input id="ld" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="e.g. Leh, Nubra" />
            </div>
            <div>
              <Label htmlFor="lt">Travel date</Label>
              <Input id="lt" type="date" value={form.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lpax">Pax</Label>
              <Input id="lpax" type="number" min={1} value={form.pax} onChange={(e) => setForm({ ...form, pax: Number(e.target.value) })} />
            </div>
            <div>
              <Label htmlFor="lb">Budget</Label>
              <Input id="lb" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. ₹65,000" />
            </div>
            <div>
              <Label htmlFor="ls">Source</Label>
              <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                <SelectTrigger id="ls"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {leadSources.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lst">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger id="lst"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {leadStages.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="lnote">Notes</Label>
            <Textarea id="lnote" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={loading || !form.name || !form.email || !form.phone}>
            {loading ? 'Creating...' : 'Create lead'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CustomerDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    type: 'Individual',
    notes: '',
  })

  const onSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Customer added!')
      setForm({ name: '', email: '', phone: '', city: '', state: '', type: 'Individual', notes: '' })
      setOpen(false)
      onCreated()
    } catch {
      toast.error('Failed to add customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <UserPlus className="h-3.5 w-3.5" /> Add customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add customer</DialogTitle>
          <DialogDescription>Manually add a customer to your CRM.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Individual', 'Family', 'Group', 'Corporate'].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <Label>State</Label>
              <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={onSubmit} disabled={loading || !form.name || !form.email || !form.phone}>
            {loading ? 'Adding...' : 'Add customer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
