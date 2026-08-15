# 🏔️ Himalayan Freak

A visually stunning, full-featured travel platform for **Himalayan Freak** — a Kashmir-based travel agency crafting bespoke journeys across Jammu, Kashmir, Ladakh and the entire Himalayan range.

**Made & maintained by [GuardianX](https://github.com/GuardianX)**

---

## ✨ Features

### Public site
- **Home** — Parallax hero, value strip, featured destinations, story strip, packages, testimonials, trip-planner CTA
- **Company** — Mission, vision, values, milestone timeline, team, why-us, contact
- **Destinations** — 18 Himalayan destinations (Srinagar, Gulmarg, Pahalgam, Sonmarg, Leh, Nubra, Pangong, Kargil, Zanskar, Doodhpathri, Yusmarg, Dachigam, Patnitop, Mughal Road, Vaishno Devi, Spiti, Manali, Rishikesh) with search, region filter, difficulty filter, sort
- **Destination detail pages** — Hero gallery, tabs (Overview / Attractions / Activities / Live Weather / How to Reach), related destinations, sidebar with quick facts + coordinates
- **Packages** — 6 curated packages with customiser (pax, duration, hotel tier, transport) + live price estimate
- **Trip Planner** — 7-step wizard (Destinations → Dates/Pax → Hotels → Meals → Add-ons → Contact → Review) with live cost summary
- **Flights & Trains** — Real airline routes (IndiGo, Air India, SpiceJet, Vistara, Go First) and real train numbers (Swraj Express, Shri Shakti Express, Himgiri Express, Vande Bharat, etc.). Real-time Amadeus + RailwayAPI integration ready (just add env vars)
- **Group Booking Portal** — 5-step wizard for groups of 10+ travellers with room-sharing roster

### Authentication & user features
- NextAuth.js with admin & user roles (bcrypt-hashed passwords)
- **User Dashboard** — My Bookings, Saved Itineraries, Wishlist, Documents, Reviews, editable Profile
- **Admin Destination & Package editor** — Full CRUD with image URL fields
- Wishlist & reviews

### CRM (admin-only)
- **Kanban leads board** with drag-and-drop across 7 stages
- **Customers** table
- **Bookings** table
- **Tasks** with priorities & lead linking
- **Vendors** (hotels, drivers, guides, photographers, homestays, cabs)
- **Communications** log (calls, emails, WhatsApp, SMS, meetings)
- Dashboard with KPIs, revenue trend chart, leads-by-source pie, conversion rate, 3-month forecast

### AI Travel Agent ("Freak AI")
- Floating chat widget on every page
- Knows every destination, package, hotel tier, meal option, add-on
- Can plan trips, recommend packages, quote real prices, create bookings
- Booking flow creates a Lead in CRM

### Itinerary PDF Export
- Branded 5-page PDF (cover, overview, per-destination, cost summary)
- Download from Trip Planner review step
- "Made & maintained by GuardianX" on every page footer

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style)
- **Database**: Prisma ORM + SQLite
- **Auth**: NextAuth.js v4 + bcryptjs
- **PDF**: pdf-lib
- **AI**: z-ai-web-dev-sdk
- **Charts**: Recharts
- **State**: Zustand + TanStack Query
- **Animations**: Framer Motion

---

## 🚀 Quick start

### Prerequisites
- Node.js 18+ / Bun
- A GitHub account (for cloning)

### Installation

```bash
git clone https://github.com/ayanalidar/himalayan-freak.git
cd himalayan-freak
bun install
```

### Environment setup

Create a `.env` file in the root:

```env
DATABASE_URL=file:./db/custom.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here

# Optional - enable real-time flight/train data
AMADEUS_API_KEY=
AMADEUS_API_SECRET=
RAILWAY_API_KEY=
```

### Initialize database & seed demo data

```bash
bun run db:push
bun run scripts/seed-crm.ts           # Leads, customers, bookings
bun run scripts/seed-auth-tickets.ts  # Admin/user, flights, trains, vendors
```

### Run the dev server

```bash
bun run dev
```

Open http://localhost:3000

---

## 🔐 Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@himalayanfreak.com | admin123 |
| User | aarav@example.com | user123 |

---

## 📁 Project structure

```
himalayan-freak/
├── prisma/
│   └── schema.prisma            # 12 models: User, Destination, Package, Lead, Customer, Booking, Vendor, Task, Communication, Review, SavedDestination, Document, Payment, AirTicket, TrainTicket, CustomTrip
├── public/
│   └── logo.webp
├── scripts/
│   ├── seed-crm.ts              # Demo CRM data
│   ├── seed-auth-tickets.ts     # Admin/user + flights/trains/vendors
│   └── push-to-github.sh        # One-command GitHub push
├── src/
│   ├── app/
│   │   ├── api/                 # 23 API routes (auth, admin, tickets, chat, trips, dashboard, etc.)
│   │   ├── layout.tsx           # Root layout with AuthProvider + ThemeProvider
│   │   ├── page.tsx             # Single-page router (8 in-app pages)
│   │   └── globals.css          # Himalayan theme (saffron + slate + snow)
│   ├── components/
│   │   ├── admin/               # Admin destination editor
│   │   ├── auth/                # Login & Signup pages
│   │   ├── chat/                # AI Travel Agent chatbot
│   │   ├── crm/                 # Full CRM dashboard
│   │   ├── dashboard/           # User dashboard
│   │   ├── pages/               # Home, Company, Destinations, Packages, Group Booking
│   │   ├── planner/             # Trip Planner wizard
│   │   ├── tickets/             # Flights & Trains page
│   │   ├── navbar.tsx           # Dark glass navbar with auth-aware menu
│   │   └── footer.tsx           # Footer with GuardianX attribution
│   └── lib/
│       ├── auth.ts              # NextAuth config
│       ├── data.ts              # 18 destinations + 6 packages static seed
│       ├── db.ts                # Prisma client
│       ├── store.ts             # Zustand nav + trip-builder state
│       ├── realtime-tickets.ts  # Amadeus + RailwayAPI integration layer
│       └── utils.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🌐 Deploying to production

### Vercel (recommended)
1. Push to GitHub
2. Import repo at https://vercel.com/new
3. Add env vars in project settings
4. Deploy

### Self-hosted
```bash
bun run build
bun run start
```

---

## 🔧 Optional: enable real-time flight/train APIs

### Amadeus (flights)
1. Sign up at https://developers.amadeus.com
2. Get API_KEY and API_SECRET
3. Add to `.env`:
   ```
   AMADEUS_API_KEY=your_key
   AMADEUS_API_SECRET=your_secret
   ```

### RailwayAPI (trains)
1. Sign up at https://railwayapi.com
2. Get API key
3. Add to `.env`:
   ```
   RAILWAY_API_KEY=your_key
   ```

Without these env vars, the system falls back to seeded real-airline data (IndiGo 6E 2235, Air India AI 823, etc.).

---

## 📞 Contact

**Himalayan Freak**
- Office: Al Falah Complex, Srinagar-Gulmarg Road, Magam, Jammu & Kashmir 193401, India
- Phone: +91 600 626 6072, +91 979 705 1060
- Email: hello@himalayanfreak.com

---

## 📝 License

Proprietary. All rights reserved by Himalayan Freak.

**Made & maintained by [GuardianX](https://github.com/GuardianX)**
