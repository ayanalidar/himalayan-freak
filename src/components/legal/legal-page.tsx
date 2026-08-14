'use client'

import { motion } from 'framer-motion'
import { Shield, FileText, RotateCcw, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/store'

type LegalType = 'privacy' | 'terms' | 'cancellation'

interface LegalConfig {
  title: string
  badge: string
  icon: typeof Shield
  intro: string
  sections: { heading: string; body: string; bullets?: string[] }[]
}

const configs: Record<LegalType, LegalConfig> = {
  privacy: {
    title: 'Privacy Policy',
    badge: 'Privacy Policy',
    icon: Shield,
    intro:
      'Himalayan Freak ("we", "us", "our") respects your privacy. This policy explains what personal information we collect, why we collect it, how we use it, and the choices you have. It applies to all visitors and users of himalayanfreak.in and our mobile/PWA application.',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'We collect information you provide directly to us and information collected automatically when you use our services.',
        bullets: [
          'Account information: name, email address, phone number, city, state - collected when you sign up',
          'Trip planning data: destinations selected, travel dates, number of travellers, hotel and meal preferences, add-on choices',
          'Booking information: traveller names, emergency contacts, dietary restrictions, ID proofs (for permits)',
          'Payment information: processed via secure third-party gateways (Razorpay/UPI) - we never store card details',
          'Communications: chats with our AI travel agent, emails, WhatsApp messages, call logs',
          'Usage data: IP address, browser type, pages visited, device information - collected automatically via cookies',
          'Reviews and feedback: ratings and text you submit about destinations and packages',
        ],
      },
      {
        heading: '2. How We Use Your Information',
        body: 'We use your personal information for the following legitimate business purposes:',
        bullets: [
          'To plan, customise and operate your travel itinerary',
          'To process bookings, payments and issue vouchers',
          'To communicate with you about your trip, weather alerts and route updates',
          'To arrange permits (Inner Line, Protected Area, Amarnath Yatra) with government authorities',
          'To provide emergency medical and evacuation support during your trip',
          'To improve our services, destinations database and AI chatbot responses',
          'To send our monthly travel journal (you can unsubscribe at any time)',
          'To comply with legal obligations under Jammu & Kashmir tourism regulations',
        ],
      },
      {
        heading: '3. Legal Basis for Processing (GDPR/DPDP)',
        body: 'Under the EU General Data Protection Regulation (GDPR) and the Indian Digital Personal Data Protection Act (DPDP) 2023, we process your data based on:',
        bullets: [
          'Consent: when you sign up, submit a trip plan, or subscribe to our journal',
          'Contract: when you book a trip and we need to fulfil our service obligations',
          'Legal obligation: when we are required to share traveller IDs with authorities for permits',
          'Legitimate interest: when we log communications for service quality and dispute resolution',
        ],
      },
      {
        heading: '4. Information Sharing',
        body: 'We do NOT sell your personal information. We share it only with:',
        bullets: [
          'Service providers: hotels, drivers, guides, photographers - only the details needed to operate your specific trip',
          'Government authorities: ID proofs for permit applications (Inner Line, Protected Area, Amarnath Yatra registration)',
          'Payment processors: Razorpay, UPI gateways (no card data is stored on our servers)',
          'Emergency services: medical professionals, evacuation teams (only in genuine emergencies)',
          'Legal authorities: if required by law, court order, or government regulation',
        ],
      },
      {
        heading: '5. Data Retention',
        body: 'We retain your personal information for as long as necessary to fulfil the purposes outlined above. Specifically:',
        bullets: [
          'Active booking data: retained for the duration of the trip plus 7 years for tax/audit purposes',
          'Account data: retained until you delete your account, after which it is anonymised within 30 days',
          'AI chat logs: retained for 90 days, then automatically deleted',
          'Marketing data: retained until you unsubscribe, then deleted within 30 days',
          'ID proofs (Aadhaar, PAN, passport): deleted within 7 days of trip completion',
        ],
      },
      {
        heading: '6. Your Rights',
        body: 'You have the following rights regarding your personal data:',
        bullets: [
          'Right to access: request a copy of all personal data we hold about you',
          'Right to rectification: correct inaccurate or incomplete data',
          'Right to erasure ("right to be forgotten"): request deletion of your data',
          'Right to restrict processing: limit how we use your data',
          'Right to data portability: receive your data in a machine-readable format',
          'Right to object: opt out of marketing communications at any time',
          'Right to withdraw consent: at any time, without affecting the lawfulness of prior processing',
        ],
      },
      {
        heading: '7. Cookies & Tracking',
        body: 'We use essential cookies for authentication (NextAuth session) and analytics cookies to understand how visitors use our site. We do not use third-party advertising cookies. You can disable cookies in your browser settings, but authentication features will not work.',
      },
      {
        heading: '8. Data Security',
        body: 'We implement industry-standard security measures including:',
        bullets: [
          'TLS 1.3 encryption for all data in transit',
          'Bcrypt password hashing (10 rounds) - passwords are never stored in plain text',
          'Role-based access control (RBAC) - only admin users can access CRM data',
          'Serverless PostgreSQL (Neon) with encryption at rest',
          'Regular security audits (VAPT) of all API endpoints',
          'Strict input validation and parameterised queries (Prisma ORM) to prevent SQL injection',
        ],
      },
      {
        heading: '9. International Transfers',
        body: 'Your data is stored on servers located in India (Neon PostgreSQL ap-southeast-1, AWS Mumbai) and the United States (Vercel edge network). By using our services, you consent to these transfers in accordance with this policy.',
      },
      {
        heading: '10. Children\'s Privacy',
        body: 'Our services are not directed to children under 18. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us and we will delete it promptly.',
      },
      {
        heading: '11. Changes to This Policy',
        body: 'We may update this policy from time to time. Material changes will be notified via email to registered users at least 30 days before they take effect. The "last updated" date at the bottom reflects the most recent revision.',
      },
      {
        heading: '12. Contact Us',
        body: 'For privacy questions, data access requests, or to exercise any of your rights, contact our Data Protection Officer:',
        bullets: [
          'Email: info@himalayanfreak.in',
          'Phone: +91 600 626 6072',
          'Address: Al Falah Complex, Srinagar-Gulmarg Road, Magam, Jammu & Kashmir 193401, India',
          'Founder & CEO: Syed Shamshul Razvi',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    badge: 'Terms of Service',
    icon: FileText,
    intro:
      'Welcome to Himalayan Freak. These Terms and Conditions ("Terms") govern your use of our website, mobile/PWA application, and travel services. By booking a trip, creating an account, or using any of our services, you agree to these Terms. Please read them carefully.',
    sections: [
      {
        heading: '1. Definitions',
        body: 'In these Terms:',
        bullets: [
          '"Company", "we", "us", "our" refers to Himalayan Freak, a travel agency registered in Magam, Jammu & Kashmir, India',
          '"Traveller", "you", "your" refers to any person booking or inquiring about a trip with us',
          '"Trip" refers to any itinerary, package, or custom journey planned and operated by us',
          '"Services" includes trip planning, bookings, transportation, accommodation, guides, and related travel services',
        ],
      },
      {
        heading: '2. Bookings & Confirmation',
        body: 'A booking is considered confirmed only when:',
        bullets: [
          'You have submitted a complete booking request via Trip Planner, Group Booking, or AI Chatbot',
          'We have sent you a written confirmation (email or WhatsApp) with a reference code',
          'You have paid the advance deposit (typically 25% of total trip cost)',
          'The balance payment must be cleared at least 14 days before departure',
        ],
      },
      {
        heading: '3. Pricing & Payments',
        body: 'All prices are quoted in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Pricing terms:',
        bullets: [
          'Prices quoted in itineraries are estimates; final quotes are confirmed after a 30-minute onboarding call',
          'Pricing depends on hotel availability, season, transport type, pax count, and permit costs',
          'Peak season surcharges (April-June, September-November, December-January) may apply',
          'We accept payments via UPI, bank transfer, credit/debit card (Razorpay), and cash',
          'GST invoice is provided for all corporate bookings on request',
        ],
      },
      {
        heading: '4. Traveller Responsibilities',
        body: 'You agree to:',
        bullets: [
          'Provide accurate personal information including valid ID proofs for permits',
          'Disclose medical conditions, dietary restrictions, and accessibility needs at the time of booking',
          'Carry valid government-issued photo ID and 4 passport-size photographs for permits',
          'Follow the instructions of our drivers, guides, and trip managers at all times',
          'Respect local customs, dress codes at religious sites, and environmental guidelines',
          'Not engage in any illegal activity during the trip',
          'Carry travel insurance for high-altitude trips (mandatory for treks above 4,000m)',
        ],
      },
      {
        heading: '5. Health & Safety',
        body: 'High-altitude travel carries inherent risks. You acknowledge that:',
        bullets: [
          'Acclimatisation is mandatory for trips to Ladakh, Spiti, and high passes (above 3,000m)',
          'AMS (Acute Mountain Sickness) can affect anyone regardless of fitness - inform our team immediately if symptoms appear',
          'We provide oxygen cylinders and medical kits on all remote-route trips',
          'Pregnant women, travellers with heart conditions, and those with severe asthma should consult a doctor before booking high-altitude trips',
          'We reserve the right to refuse or terminate a trip if a traveller\'s health or behaviour endangers themselves or others',
        ],
      },
      {
        heading: '6. Permits & Documentation',
        body: 'For certain destinations, permits are required:',
        bullets: [
          'Inner Line Permit (ILP) for Indian nationals visiting Nubra, Pangong, Tso Moriri (Ladakh)',
          'Protected Area Permit (PAP) for foreign nationals visiting Ladakh restricted areas',
          'Amarnath Yatra registration (mandatory, July-August)',
          'Vaishno Devi yatra registration (mandatory, year-round)',
          'We arrange all permits on your behalf - original ID proofs must be shared at least 7 days before departure',
        ],
      },
      {
        heading: '7. Travel Documents',
        body: 'It is your responsibility to carry valid travel documents:',
        bullets: [
          'Indian nationals: valid government-issued photo ID (Aadhaar, PAN, passport, driving licence)',
          'Foreign nationals: valid passport with Indian visa (or e-Visa), valid for at least 6 months beyond travel dates',
          'OCI cardholders: OCI card and passport',
          'We are not liable for denial of entry due to invalid or expired documents',
        ],
      },
      {
        heading: '8. Force Majeure',
        body: 'We are not liable for any failure or delay in performance caused by circumstances beyond our reasonable control, including but not limited to:',
        bullets: [
          'Natural disasters (earthquakes, floods, landslides, heavy snowfall)',
          'Road closures (Zoji La, Rohtang La, Khardung La closures due to weather)',
          'Government actions (curfews, lockdowns, permit suspensions, border closures)',
          'Civil unrest, terrorism, or war',
          'Pandemics and public health emergencies',
          'In such cases, we will offer rescheduling or a full refund minus unrecoverable third-party costs',
        ],
      },
      {
        heading: '9. Limitation of Liability',
        body: 'To the maximum extent permitted by law:',
        bullets: [
          'Our total liability for any claim arising from a booking is limited to the amount you paid us for that specific trip',
          'We are not liable for indirect, incidental, or consequential damages',
          'We are not liable for the acts or omissions of third-party service providers (hotels, airlines, railways, restaurants)',
          'We strongly recommend comprehensive travel insurance covering medical evacuation, trip cancellation, and baggage loss',
        ],
      },
      {
        heading: '10. Intellectual Property',
        body: 'All content on this website - including destination descriptions, photographs, itinerary text, the AI chatbot ("Freak AI"), and the Himalayan Freak logo - is the property of Himalayan Freak and protected under Indian Copyright Act 1957. You may not reproduce, distribute, or create derivative works without our written permission.',
      },
      {
        heading: '11. User-Generated Content',
        body: 'When you submit reviews, photos, or other content to our platform:',
        bullets: [
          'You grant us a non-exclusive, royalty-free, worldwide licence to use, reproduce, and display that content for marketing purposes',
          'You confirm you own the rights to the content and it does not violate any third-party rights',
          'We reserve the right to remove any content we deem inappropriate, offensive, or misleading',
        ],
      },
      {
        heading: '12. Governing Law & Dispute Resolution',
        body: 'These Terms are governed by the laws of India. Any disputes will be resolved as follows:',
        bullets: [
          'First, attempt amicable resolution through direct communication with our team',
          'If unresolved within 30 days, the matter will be referred to mediation in Srinagar, Jammu & Kashmir',
          'Failing mediation, disputes will be subject to the exclusive jurisdiction of the courts of Srinagar, Jammu & Kashmir, India',
        ],
      },
      {
        heading: '13. Changes to Terms',
        body: 'We may update these Terms from time to time. Material changes will be notified via email to registered users at least 30 days before they take effect. Continued use of our services after changes take effect constitutes acceptance of the new Terms.',
      },
      {
        heading: '14. Contact',
        body: 'For questions about these Terms, please contact us:',
        bullets: [
          'Email: info@himalayanfreak.in',
          'Phone: +91 600 626 6072',
          'Address: Al Falah Complex, Srinagar-Gulmarg Road, Magam, Jammu & Kashmir 193401, India',
          'Founder & CEO: Syed Shamshul Razvi',
        ],
      },
    ],
  },
  cancellation: {
    title: 'Cancellation & Refund Policy',
    badge: 'Cancellation Policy',
    icon: RotateCcw,
    intro:
      'We understand that plans change. This policy explains our cancellation and refund terms. We aim to be fair to both travellers and our local partners (drivers, homestays, guides) who commit resources based on your booking.',
    sections: [
      {
        heading: '1. Cancellation by Traveller',
        body: 'If you need to cancel your trip, please notify us in writing (email to info@himalayanfreak.in or WhatsApp to +91 600 626 6072). Cancellation charges are calculated based on the number of days before departure:',
        bullets: [
          'More than 60 days before departure: 90% refund (10% administrative fee)',
          '45-60 days before departure: 75% refund',
          '30-44 days before departure: 50% refund',
          '15-29 days before departure: 25% refund',
          'Less than 15 days before departure: No refund',
          'Same-day or no-show: No refund',
        ],
      },
      {
        heading: '2. Refund Calculation',
        body: 'Refunds are calculated based on the total amount paid (advance + balance), not the package price. Refund processing:',
        bullets: [
          'Refunds are processed within 7-10 business days of cancellation confirmation',
          'Refunds are credited back to the original payment method (UPI, card, bank account)',
          'Bank charges and payment gateway fees (typically 2-3%) are non-refundable',
          'Permit fees already paid to government authorities are non-refundable',
          'Airline and railway tickets are subject to the respective operator\'s cancellation policy',
        ],
      },
      {
        heading: '3. Cancellation by Us',
        body: 'We may cancel or modify a trip due to circumstances including:',
        bullets: [
          'Force majeure (natural disasters, weather, road closures, pandemics)',
          'Insufficient bookings (minimum group size not met) - we will notify you at least 21 days before departure',
          'Government closures (Zoji La, Rohtang La, Khardung La closures)',
          'Security situations in the destination region',
        ],
      },
      {
        heading: '4. Refund If We Cancel',
        body: 'If we cancel a trip:',
        bullets: [
          'You will receive a 100% refund of all amounts paid to us, within 7 business days',
          'OR you may choose to reschedule to a future date with the same itinerary at no extra cost',
          'OR you may choose an alternative itinerary of equal or lesser value (we will refund the difference if lesser)',
          'We are not liable for non-refundable flights, train tickets, or third-party bookings made independently',
        ],
      },
      {
        heading: '5. Trip Modifications',
        body: 'If you want to modify your booking (dates, destinations, hotel tier):',
        bullets: [
          'Modifications more than 30 days before departure: free of charge (subject to availability)',
          'Modifications 15-30 days before departure: 10% modification fee',
          'Modifications less than 15 days before departure: treated as cancellation + new booking',
          'We will do our best to accommodate reasonable changes',
        ],
      },
      {
        heading: '6. Trip Curtailment',
        body: 'If you need to cut your trip short after it has begun:',
        bullets: [
          'No refund for unused services (hotels, transport, activities)',
          'We will assist with rearranging return transport at your cost',
          'Travel insurance may cover curtailment - check your policy',
          'Medical emergencies: we will assist with evacuation; insurance claims are between you and your insurer',
        ],
      },
      {
        heading: '7. No-Show Policy',
        body: 'If you fail to arrive at the designated pickup point or starting location without prior notification:',
        bullets: [
          'The entire booking will be treated as cancelled with no refund',
          'We will attempt to contact you via phone, email, and WhatsApp before declaring a no-show',
          'If you miss a flight/train due to your own delay, we will assist with rebooking at your cost',
        ],
      },
      {
        heading: '8. Weather & Route Closures',
        body: 'Himalayan travel is weather-dependent. If routes close during your trip:',
        bullets: [
          'We will offer alternative destinations or activities of equivalent value',
          'If no alternative is possible, we will refund the unused portion of the trip pro-rata',
          'We are not liable for missed flights/trains due to weather-related delays',
          'Trip insurance with "trip interruption" cover is strongly recommended',
        ],
      },
      {
        heading: '9. Group Booking Cancellations',
        body: 'For group bookings (10+ travellers), special cancellation terms apply:',
        bullets: [
          'Group cancellations more than 90 days before departure: 85% refund',
          '60-90 days before departure: 60% refund',
          '30-59 days before departure: 30% refund',
          'Less than 30 days: No refund',
          'Individual cancellations within a group: standard individual policy applies',
        ],
      },
      {
        heading: '10. Refund Disputes',
        body: 'If you disagree with a refund amount:',
        bullets: [
          'Contact us within 14 days of receiving the refund with supporting documentation',
          'We will review and respond within 7 business days',
          'If unresolved, the matter will be referred to mediation in Srinagar',
          'Ultimately subject to the jurisdiction of Srinagar courts, Jammu & Kashmir, India',
        ],
      },
      {
        heading: '11. Contact for Cancellations',
        body: 'To cancel a booking or request a refund, contact us immediately:',
        bullets: [
          'Email: info@himalayanfreak.in',
          'Phone/WhatsApp: +91 600 626 6072 (24x7)',
          'Address: Al Falah Complex, Srinagar-Gulmarg Road, Magam, Jammu & Kashmir 193401, India',
          'Founder & CEO: Syed Shamshul Razvi',
        ],
      },
    ],
  },
}

export function LegalPage({ type }: { type: LegalType }) {
  const { navigate } = useApp()
  const config = configs[type]
  const Icon = config.icon

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/30">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate('home')}
              className="mb-5 flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" /> Back to home
            </button>
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 backdrop-blur">
              <Icon className="mr-1.5 h-3 w-3" /> {config.badge}
            </Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {config.title}
            </h1>
            <p className="mt-3 text-sm text-white/60">
              Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 ring-1 ring-border/40 sm:p-10">
              <p className="text-base leading-relaxed text-muted-foreground">{config.intro}</p>

              <div className="mt-8 space-y-8">
                {config.sections.map((section, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                  >
                    <h2 className="font-display text-xl font-bold tracking-tight">{section.heading}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
                    {section.bullets && (
                      <ul className="mt-3 space-y-2">
                        {section.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 rounded-xl border border-border/60 bg-muted/30 p-5">
                <h3 className="font-display text-sm font-bold">Questions?</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  We&apos;re here to help. Reach out and our team will respond within 30 minutes during business hours.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <a href="mailto:info@himalayanfreak.in" className="flex items-center gap-1.5 text-primary hover:underline">
                    <Mail className="h-3.5 w-3.5" /> info@himalayanfreak.in
                  </a>
                  <a href="tel:+916006266072" className="flex items-center gap-1.5 text-primary hover:underline">
                    <Phone className="h-3.5 w-3.5" /> +91 600 626 6072
                  </a>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> Magam, Kashmir 193401
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {(['privacy', 'terms', 'cancellation'] as LegalType[])
                  .filter((t) => t !== type)
                  .map((t) => (
                    <Button
                      key={t}
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(t)}
                      className="gap-1.5"
                    >
                      {t === 'privacy' && <Shield className="h-3.5 w-3.5" />}
                      {t === 'terms' && <FileText className="h-3.5 w-3.5" />}
                      {t === 'cancellation' && <RotateCcw className="h-3.5 w-3.5" />}
                      View {configs[t].title}
                    </Button>
                  ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
