'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HomePage } from '@/components/pages/home'
import { CompanyPage } from '@/components/pages/company'
import { DestinationsPage } from '@/components/pages/destinations'
import { DestinationDetailPage } from '@/components/pages/destination-detail'
import { PackagesPage } from '@/components/pages/packages'
import { PackageDetailPage } from '@/components/pages/package-detail'
import { TripPlannerPage } from '@/components/planner/trip-planner'
import { TicketsPage } from '@/components/tickets/tickets-page'
import { GroupBookingPage } from '@/components/pages/group-booking'
import { CrmPage } from '@/components/crm/crm-page'
import { AdminDestinationsPage } from '@/components/admin/admin-destinations-page'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { LoginPage } from '@/components/auth/login-page'
import { SignupPage } from '@/components/auth/signup-page'
import { ChatBot } from '@/components/chat/chat-bot'
import { useApp } from '@/lib/store'

export default function Home() {
  const { page } = useApp()

  // For auth pages, render full-screen without navbar/footer
  if (page === 'login') return <LoginPage />
  if (page === 'signup') return <SignupPage />

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {page === 'home' && <HomePage />}
        {page === 'company' && <CompanyPage />}
        {page === 'destinations' && <DestinationsPage />}
        {page === 'destination-detail' && <DestinationDetailPage />}
        {page === 'packages' && <PackagesPage />}
        {page === 'package-detail' && <PackageDetailPage />}
        {page === 'trip-planner' && <TripPlannerPage />}
        {page === 'tickets' && <TicketsPage />}
        {page === 'group-booking' && <GroupBookingPage />}
        {page === 'crm' && <CrmPage />}
        {page === 'admin-destinations' && <AdminDestinationsPage />}
        {page === 'dashboard' && <DashboardPage />}
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}
