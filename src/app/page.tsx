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
import { CrmPage } from '@/components/crm/crm-page'
import { useApp } from '@/lib/store'

export default function Home() {
  const { page } = useApp()

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
        {page === 'crm' && <CrmPage />}
      </main>
      <Footer />
    </div>
  )
}
