'use client'

import { useEffect } from 'react'
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
import { AdminPackagesPage } from '@/components/admin/admin-packages-page'
import { AdminTeamPage } from '@/components/admin/admin-team-page'
import { AdminPagesPage } from '@/components/admin/admin-pages-page'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { LoginPage } from '@/components/auth/login-page'
import { SignupPage } from '@/components/auth/signup-page'
import { LegalPage } from '@/components/legal/legal-page'
import { ChatBot } from '@/components/chat/chat-bot'
import { PWAInstallBanner } from '@/components/pwa-install-banner'
import { useApp, type PageId } from '@/lib/store'

// Valid page IDs that can be passed via ?page= query param (for PWA shortcuts)
const VALID_QUERY_PAGES: PageId[] = [
  'home', 'company', 'destinations', 'packages', 'trip-planner', 'tickets',
  'group-booking', 'dashboard', 'privacy', 'terms', 'cancellation',
]

export default function Home() {
  const { page, navigate } = useApp()

  // Handle PWA shortcut URLs (e.g. /?page=trip-planner)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const pageParam = params.get('page') as PageId | null
    if (pageParam && VALID_QUERY_PAGES.includes(pageParam) && pageParam !== page) {
      navigate(pageParam)
      // Clean the URL (remove ?page= param)
      const url = new URL(window.location.href)
      url.searchParams.delete('page')
      window.history.replaceState({}, '', url.toString())
    }
  }, [page, navigate])

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
        {page === 'admin-packages' && <AdminPackagesPage />}
        {page === 'admin-team' && <AdminTeamPage />}
        {page === 'admin-pages' && <AdminPagesPage />}
        {page === 'dashboard' && <DashboardPage />}
        {page === 'privacy' && <LegalPage type="privacy" />}
        {page === 'terms' && <LegalPage type="terms" />}
        {page === 'cancellation' && <LegalPage type="cancellation" />}
      </main>
      <Footer />
      <ChatBot />
      <PWAInstallBanner />
    </div>
  )
}
