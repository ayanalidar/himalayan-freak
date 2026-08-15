// One-off seed script for Himalayan Freak CRM demo data
// Run with: bun run /home/z/my-project/scripts/seed-crm.ts
import { db } from '../src/lib/db'

async function main() {
  console.log('Seeding CRM...')

  const leadsData = [
    { name: 'Aarav Mehta', email: 'aarav@example.com', phone: '+91 98100 11111', destination: 'Leh, Pangong', travelDate: '2026-09-12', pax: 2, budget: '~₹65,000', source: 'Website', status: 'New', notes: 'Interested in 7D Ladakh Odyssey. Honeymoon trip.' },
    { name: 'Isha Patel', email: 'isha@example.com', phone: '+91 98200 22222', destination: 'Srinagar, Gulmarg', travelDate: '2026-10-05', pax: 4, budget: '~₹85,000', source: 'WhatsApp', status: 'Contacted', notes: 'Family of 4 with 2 kids.' },
    { name: 'Rohit Sharma', email: 'rohit@example.com', phone: '+91 98300 33333', destination: 'Spiti Valley', travelDate: '2026-08-20', pax: 6, budget: '~₹2,10,000', source: 'Referral', status: 'Qualified', notes: 'Group of friends. Wants photographer add-on.' },
    { name: 'Banerjee Family', email: 'banerjee@example.com', phone: '+91 98400 44444', destination: 'Vaishno Devi, Patnitop', travelDate: '2026-09-25', pax: 5, budget: '~₹52,000', source: 'Website', status: 'Proposal', notes: '3 generations. Need slower pace.' },
    { name: 'Priya Singh', email: 'priya@example.com', phone: '+91 98500 55555', destination: 'Kashmir Great Lakes Trek', travelDate: '2026-08-10', pax: 3, budget: '~₹74,000', source: 'Social', status: 'Negotiation', notes: 'Experienced trekkers. Asking for off-route lake.' },
    { name: 'Karan Malhotra', email: 'karan@example.com', phone: '+91 98600 66666', destination: 'Nubra, Pangong', travelDate: '2026-07-15', pax: 2, budget: '~₹45,000', source: 'Trip Planner', status: 'Won', notes: 'Confirmed 6D Ladakh. Paid deposit.' },
    { name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 98700 77777', destination: 'Manali, Spiti', travelDate: '2026-06-18', pax: 4, budget: '~₹1,40,000', source: 'Website', status: 'New', notes: 'First-time Himalayan traveller.' },
    { name: 'Vikram Joshi', email: 'vikram@example.com', phone: '+91 98800 88888', destination: 'Srinagar, Pahalgam', travelDate: '2026-05-22', pax: 2, budget: '~₹38,000', source: 'Phone', status: 'Lost', notes: 'Went with competitor due to dates.' },
    { name: 'Ananya Iyer', email: 'ananya@example.com', phone: '+91 98900 99999', destination: 'Gulmarg, Sonmarg', travelDate: '2026-12-25', pax: 2, budget: '~₹55,000', source: 'Website', status: 'Contacted', notes: 'Skiing trip. Christmas week.' },
    { name: 'Imran Khan', email: 'imran@example.com', phone: '+91 99000 10101', destination: 'Amarnath Yatra', travelDate: '2026-07-30', pax: 8, budget: '~₹1,24,000', source: 'Referral', status: 'Qualified', notes: 'Group yatra. Need helicopter for 2 seniors.' },
    { name: 'Megha Kapoor', email: 'megha@example.com', phone: '+91 99111 12121', destination: 'Rishikesh', travelDate: '2026-10-10', pax: 3, budget: '~₹32,000', source: 'Social', status: 'Proposal', notes: 'Yoga retreat + rafting.' },
    { name: 'Aditya Verma', email: 'aditya@example.com', phone: '+91 99222 13131', destination: 'Zanskar Valley', travelDate: '2026-08-01', pax: 4, budget: '~₹1,80,000', source: 'Website', status: 'Won', notes: 'Confirmed 8D Zanskar. Adventure-heavy.' },
  ]

  for (const lead of leadsData) {
    await db.lead.create({ data: lead })
  }

  const customersData = [
    { name: 'Karan Malhotra', email: 'karan@example.com', phone: '+91 98600 66666', city: 'Delhi', state: 'Delhi', totalTrips: 2, totalSpent: 98000, type: 'Individual', notes: 'Repeat customer. Loves photography.' },
    { name: 'Aditya Verma', email: 'aditya@example.com', phone: '+91 99222 13131', city: 'Pune', state: 'Maharashtra', totalTrips: 1, totalSpent: 180000, type: 'Group', notes: 'Adventure group leader.' },
    { name: 'The Banerjee Family', email: 'banerjee@example.com', phone: '+91 98400 44444', city: 'Kolkata', state: 'West Bengal', totalTrips: 3, totalSpent: 245000, type: 'Family', notes: 'Loyal customers since 2022.' },
    { name: 'Rohit Sharma', email: 'rohit@example.com', phone: '+91 98300 33333', city: 'Bengaluru', state: 'Karnataka', totalTrips: 1, totalSpent: 64000, type: 'Individual', notes: 'Ladakh trip 2024.' },
    { name: 'Priya Singh', email: 'priya@example.com', phone: '+91 98500 55555', city: 'Mumbai', state: 'Maharashtra', totalTrips: 2, totalSpent: 132000, type: 'Individual', notes: 'Trekker.' },
  ]
  for (const c of customersData) {
    await db.customer.create({ data: c })
  }

  const bookingsData = [
    { refCode: 'HF' + Math.random().toString(36).slice(2, 8).toUpperCase(), tripName: 'Ladakh Odyssey 7D', startDate: '2026-09-12', endDate: '2026-09-18', pax: 2, amount: 69000, status: 'Confirmed', paymentStatus: 'Partial', notes: 'Honeymoon trip' },
    { refCode: 'HF' + Math.random().toString(36).slice(2, 8).toUpperCase(), tripName: 'Kashmir Dreams 5D', startDate: '2026-10-05', endDate: '2026-10-09', pax: 4, amount: 78000, status: 'Pending', paymentStatus: 'Unpaid', notes: 'Awaiting deposit' },
    { refCode: 'HF' + Math.random().toString(36).slice(2, 8).toUpperCase(), tripName: 'Spiti Circuit 9D', startDate: '2026-08-20', endDate: '2026-08-28', pax: 6, amount: 210000, status: 'Confirmed', paymentStatus: 'Paid', notes: 'Group booking' },
    { refCode: 'HF' + Math.random().toString(36).slice(2, 8).toUpperCase(), tripName: 'Vaishno Devi & Patnitop 4D', startDate: '2026-09-25', endDate: '2026-09-28', pax: 5, amount: 52000, status: 'Confirmed', paymentStatus: 'Partial', notes: 'Family with seniors' },
    { refCode: 'HF' + Math.random().toString(36).slice(2, 8).toUpperCase(), tripName: 'Kashmir Great Lakes Trek 8D', startDate: '2026-08-10', endDate: '2026-08-17', pax: 3, amount: 73500, status: 'InProgress', paymentStatus: 'Paid', notes: 'Currently on trek' },
    { refCode: 'HF' + Math.random().toString(36).slice(2, 8).toUpperCase(), tripName: 'Zanskar Valley 8D', startDate: '2026-08-01', endDate: '2026-08-08', pax: 4, amount: 180000, status: 'Completed', paymentStatus: 'Paid', notes: 'Successfully completed' },
  ]
  for (const b of bookingsData) {
    await db.booking.create({ data: b })
  }

  console.log('Seed complete.')
  console.log(`  Leads:       ${leadsData.length}`)
  console.log(`  Customers:   ${customersData.length}`)
  console.log(`  Bookings:    ${bookingsData.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
