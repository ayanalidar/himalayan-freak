// Seed admin user, air tickets, train tickets, and demo vendors
import bcrypt from 'bcryptjs'
import { db } from '../src/lib/db'

async function main() {
  console.log('Seeding admin + tickets + vendors...')

  // Admin user
  const existingAdmin = await db.user.findUnique({ where: { email: 'admin@himalayanfreak.com' } })
  if (!existingAdmin) {
    await db.user.create({
      data: {
        name: 'Himalayan Admin',
        email: 'admin@himalayanfreak.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        phone: '+91 600 626 6072',
        role: 'admin',
        city: 'Magam',
        state: 'Jammu & Kashmir',
      },
    })
    console.log('  Admin user created: admin@himalayanfreak.com / admin123')
  } else {
    console.log('  Admin user already exists')
  }

  // Demo user
  const existingUser = await db.user.findUnique({ where: { email: 'aarav@example.com' } })
  if (!existingUser) {
    await db.user.create({
      data: {
        name: 'Aarav Mehta',
        email: 'aarav@example.com',
        passwordHash: await bcrypt.hash('user123', 10),
        phone: '+91 98100 11111',
        role: 'user',
        city: 'Mumbai',
        state: 'Maharashtra',
      },
    })
    console.log('  Demo user created: aarav@example.com / user123')
  } else {
    console.log('  Demo user already exists')
  }

  // Air tickets — real airline routes serving Srinagar/Leh/Jammu
  const airTickets = [
    // Srinagar routes
    { airline: 'IndiGo', flightNo: '6E 2235', origin: 'New Delhi', originCode: 'DEL', destination: 'Srinagar', destCode: 'SXR', departTime: '08:30', arriveTime: '10:05', duration: '1h 35m', stops: 0, price: 4520, cabin: 'Economy', available: 9, aircraft: 'Airbus A320' },
    { airline: 'Air India', flightNo: 'AI 823', origin: 'New Delhi', originCode: 'DEL', destination: 'Srinagar', destCode: 'SXR', departTime: '11:45', arriveTime: '13:15', duration: '1h 30m', stops: 0, price: 5180, cabin: 'Economy', available: 7, aircraft: 'Airbus A321' },
    { airline: 'SpiceJet', flightNo: 'SG 187', origin: 'Mumbai', originCode: 'BOM', destination: 'Srinagar', destCode: 'SXR', departTime: '06:15', arriveTime: '08:50', duration: '2h 35m', stops: 0, price: 6890, cabin: 'Economy', available: 5, aircraft: 'Boeing 737' },
    { airline: 'IndiGo', flightNo: '6E 2438', origin: 'Mumbai', originCode: 'BOM', destination: 'Srinagar', destCode: 'SXR', departTime: '14:20', arriveTime: '16:55', duration: '2h 35m', stops: 0, price: 6450, cabin: 'Economy', available: 8, aircraft: 'Airbus A320neo' },
    { airline: 'Vistara', flightNo: 'UK 611', origin: 'Bengaluru', originCode: 'BLR', destination: 'Srinagar', destCode: 'SXR', departTime: '09:00', arriveTime: '12:10', duration: '3h 10m', stops: 1, price: 8240, cabin: 'Economy', available: 6, aircraft: 'Airbus A320' },
    { airline: 'IndiGo', flightNo: '6E 712', origin: 'Srinagar', originCode: 'SXR', destination: 'New Delhi', destCode: 'DEL', departTime: '14:30', arriveTime: '16:05', duration: '1h 35m', stops: 0, price: 4290, cabin: 'Economy', available: 9, aircraft: 'Airbus A320' },
    { airline: 'Go First', flightNo: 'G8 152', origin: 'Srinagar', originCode: 'SXR', destination: 'Mumbai', destCode: 'BOM', departTime: '13:10', arriveTime: '15:40', duration: '2h 30m', stops: 0, price: 6680, cabin: 'Economy', available: 4, aircraft: 'Airbus A320' },
    { airline: 'Air India', flightNo: 'AI 466', origin: 'Srinagar', originCode: 'SXR', destination: 'Jammu', destCode: 'IXJ', departTime: '17:20', arriveTime: '18:10', duration: '0h 50m', stops: 0, price: 2890, cabin: 'Economy', available: 9, aircraft: 'ATR 72' },

    // Leh routes
    { airline: 'IndiGo', flightNo: '6E 2001', origin: 'New Delhi', originCode: 'DEL', destination: 'Leh', destCode: 'IXL', departTime: '07:15', arriveTime: '08:40', duration: '1h 25m', stops: 0, price: 6890, cabin: 'Economy', available: 7, aircraft: 'Airbus A320' },
    { airline: 'Air India', flightNo: 'AI 445', origin: 'New Delhi', originCode: 'DEL', destination: 'Leh', destCode: 'IXL', departTime: '06:00', arriveTime: '07:30', duration: '1h 30m', stops: 0, price: 7240, cabin: 'Economy', available: 6, aircraft: 'Airbus A319' },
    { airline: 'SpiceJet', flightNo: 'SG 124', origin: 'Mumbai', originCode: 'BOM', destination: 'Leh', destCode: 'IXL', departTime: '05:30', arriveTime: '09:00', duration: '3h 30m', stops: 1, price: 9850, cabin: 'Economy', available: 4, aircraft: 'Boeing 737' },
    { airline: 'Vistara', flightNo: 'UK 777', origin: 'Srinagar', originCode: 'SXR', destination: 'Leh', destCode: 'IXL', departTime: '10:00', arriveTime: '11:20', duration: '1h 20m', stops: 0, price: 8950, cabin: 'Economy', available: 5, aircraft: 'Airbus A320' },
    { airline: 'IndiGo', flightNo: '6E 6201', origin: 'Leh', originCode: 'IXL', destination: 'New Delhi', destCode: 'DEL', departTime: '09:15', arriveTime: '10:45', duration: '1h 30m', stops: 0, price: 7120, cabin: 'Economy', available: 8, aircraft: 'Airbus A320' },

    // Jammu routes
    { airline: 'IndiGo', flightNo: '6E 952', origin: 'New Delhi', originCode: 'DEL', destination: 'Jammu', destCode: 'IXJ', departTime: '12:30', arriveTime: '13:50', duration: '1h 20m', stops: 0, price: 3450, cabin: 'Economy', available: 9, aircraft: 'Airbus A320' },
    { airline: 'Air India', flightNo: 'AI 821', origin: 'Mumbai', originCode: 'BOM', destination: 'Jammu', destCode: 'IXJ', departTime: '10:45', arriveTime: '13:25', duration: '2h 40m', stops: 0, price: 6120, cabin: 'Economy', available: 6, aircraft: 'Airbus A320' },
    { airline: 'SpiceJet', flightNo: 'SG 145', origin: 'Jammu', originCode: 'IXJ', destination: 'Srinagar', destCode: 'SXR', departTime: '08:30', arriveTime: '09:20', duration: '0h 50m', stops: 0, price: 2890, cabin: 'Economy', available: 8, aircraft: 'ATR 72' },
    { airline: 'IndiGo', flightNo: '6E 145', origin: 'Jammu', originCode: 'IXJ', destination: 'New Delhi', destCode: 'DEL', departTime: '15:40', arriveTime: '17:00', duration: '1h 20m', stops: 0, price: 3290, cabin: 'Economy', available: 9, aircraft: 'Airbus A320' },

    // Chandigarh (gateway to Manali/Spiti)
    { airline: 'IndiGo', flightNo: '6E 281', origin: 'New Delhi', originCode: 'DEL', destination: 'Chandigarh', destCode: 'IXC', departTime: '09:30', arriveTime: '10:20', duration: '0h 50m', stops: 0, price: 2980, cabin: 'Economy', available: 9, aircraft: 'Airbus A320' },
    { airline: 'Vistara', flightNo: 'UK 811', origin: 'Mumbai', originCode: 'BOM', destination: 'Chandigarh', destCode: 'IXC', departTime: '13:15', arriveTime: '15:30', duration: '2h 15m', stops: 0, price: 5670, cabin: 'Economy', available: 7, aircraft: 'Airbus A320' },

    // Dehradun (gateway to Rishikesh/Garhwal)
    { airline: 'IndiGo', flightNo: '6E 951', origin: 'New Delhi', originCode: 'DEL', destination: 'Dehradun', destCode: 'DED', departTime: '11:00', arriveTime: '11:55', duration: '0h 55m', stops: 0, price: 3120, cabin: 'Economy', available: 9, aircraft: 'ATR 72' },
    { airline: 'Air India', flightNo: 'AI 9601', origin: 'Mumbai', originCode: 'BOM', destination: 'Dehradun', destCode: 'DED', departTime: '07:25', arriveTime: '09:35', duration: '2h 10m', stops: 0, price: 5890, cabin: 'Economy', available: 6, aircraft: 'Airbus A320' },
  ]
  for (const t of airTickets) {
    const exists = await db.airTicket.findFirst({ where: { flightNo: t.flightNo } })
    if (!exists) await db.airTicket.create({ data: t })
  }
  console.log(`  Air tickets: ${airTickets.length}`)

  // Train tickets — real train numbers serving Jammu Tawi/Katra/Udhampur
  const trains = [
    // Jammu Tawi (JAT) - the main railhead for Kashmir
    { trainNo: '12471', trainName: 'Swraj Express', origin: 'New Delhi', originCode: 'NDLS', destination: 'Jammu Tawi', destCode: 'JAT', departTime: '14:00', arriveTime: '05:30', duration: '15h 30m', classes: JSON.stringify([{code:'1A',name:'AC First Class',price:3120,available:8},{code:'2A',name:'AC 2 Tier',price:1840,available:32},{code:'3A',name:'AC 3 Tier',price:1310,available:64},{code:'SL',name:'Sleeper',price:490,available:120}]), runsOn: JSON.stringify([1,2,3,4,5,6,0]) },
    { trainNo: '12547', trainName: 'Humsafar Express', origin: 'Ahmedabad', originCode: 'ADI', destination: 'Jammu Tawi', destCode: 'JAT', departTime: '17:30', arriveTime: '20:45', duration: '27h 15m', classes: JSON.stringify([{code:'3A',name:'AC 3 Tier',price:2140,available:48},{code:'SL',name:'Sleeper',price:790,available:96}]), runsOn: JSON.stringify([1,3,5,0]) },
    { trainNo: '16317', trainName: 'Himsagar Express', origin: 'Kanyakumari', originCode: 'CAPE', destination: 'Jammu Tawi', destCode: 'JAT', departTime: '08:40', arriveTime: '13:00', duration: '76h 20m', classes: JSON.stringify([{code:'2A',name:'AC 2 Tier',price:3920,available:16},{code:'3A',name:'AC 3 Tier',price:2710,available:42},{code:'SL',name:'Sleeper',price:1010,available:120}]), runsOn: JSON.stringify([0]) },
    { trainNo: '11077', trainName: 'Pune-Jammu Tawi Express', origin: 'Pune', originCode: 'PUNE', destination: 'Jammu Tawi', destCode: 'JAT', departTime: '09:30', arriveTime: '20:55', duration: '35h 25m', classes: JSON.stringify([{code:'2A',name:'AC 2 Tier',price:2760,available:24},{code:'3A',name:'AC 3 Tier',price:1890,available:48},{code:'SL',name:'Sleeper',price:710,available:96}]), runsOn: JSON.stringify([5]) },

    // Katra (SVDK) - for Vaishno Devi yatra
    { trainNo: '22461', trainName: 'Shri Shakti Express', origin: 'New Delhi', originCode: 'NDLS', destination: 'Katra', destCode: 'SVDK', departTime: '06:00', arriveTime: '14:10', duration: '8h 10m', classes: JSON.stringify([{code:'1A',name:'AC First Class',price:2410,available:6},{code:'2A',name:'AC 2 Tier',price:1430,available:24},{code:'3A',name:'AC 3 Tier',price:1010,available:48}]), runsOn: JSON.stringify([1,2,3,4,5,6,0]) },
    { trainNo: '22461', trainName: 'Vande Bharat Express', origin: 'New Delhi', originCode: 'NDLS', destination: 'Katra', destCode: 'SVDK', departTime: '06:00', arriveTime: '14:10', duration: '8h 10m', classes: JSON.stringify([{code:'CC',name:'AC Chair Car',price:1840,available:32},{code:'EC',name:'Exec Chair Car',price:3520,available:8}]), runsOn: JSON.stringify([1,2,3,4,5,6,0]) },
    { trainNo: '12331', trainName: 'Himgiri Express', origin: 'Howrah', originCode: 'HWH', destination: 'Jammu Tawi', destCode: 'JAT', departTime: '23:55', arriveTime: '13:30', duration: '37h 35m', classes: JSON.stringify([{code:'2A',name:'AC 2 Tier',price:2940,available:18},{code:'3A',name:'AC 3 Tier',price:2010,available:36},{code:'SL',name:'Sleeper',price:760,available:84}]), runsOn: JSON.stringify([1,3,5]) },

    // Udhampur (UHP) - USBRL extension
    { trainNo: '14609', trainName: 'Hemkunt Express', origin: 'Saharanpur', originCode: 'SRE', destination: 'Udhampur', destCode: 'UHP', departTime: '21:25', arriveTime: '11:55', duration: '14h 30m', classes: JSON.stringify([{code:'2A',name:'AC 2 Tier',price:1620,available:22},{code:'3A',name:'AC 3 Tier',price:1140,available:48},{code:'SL',name:'Sleeper',price:425,available:96}]), runsOn: JSON.stringify([1,2,3,4,5,6]) },

    // SVDK → JAT route
    { trainNo: '14033', trainName: 'Jammu Mail', origin: 'Delhi', originCode: 'DLI', destination: 'Jammu Tawi', destCode: 'JAT', departTime: '20:10', arriveTime: '08:25', duration: '12h 15m', classes: JSON.stringify([{code:'3A',name:'AC 3 Tier',price:1090,available:42},{code:'SL',name:'Sleeper',price:410,available:120}]), runsOn: JSON.stringify([1,2,3,4,5,6,0]) },
    { trainNo: '14645', trainName: 'Sahyadri Express', origin: 'Delhi', originCode: 'DLI', destination: 'Katra', destCode: 'SVDK', departTime: '23:55', arriveTime: '14:35', duration: '14h 40m', classes: JSON.stringify([{code:'3A',name:'AC 3 Tier',price:1140,available:36},{code:'SL',name:'Sleeper',price:425,available:84}]), runsOn: JSON.stringify([2,4,6]) },

    // Pathankot (PTK) — gateway to Dalhousie/Dharamshala
    { trainNo: '14035', trainName: 'Dauladhar Express', origin: 'Delhi', originCode: 'DLI', destination: 'Pathankot Cantt', destCode: 'PTKC', departTime: '22:50', arriveTime: '07:50', duration: '9h 0m', classes: JSON.stringify([{code:'1A',name:'AC First Class',price:1840,available:8},{code:'2A',name:'AC 2 Tier',price:1090,available:24},{code:'3A',name:'AC 3 Tier',price:770,available:48}]), runsOn: JSON.stringify([1,3,5,0]) },
  ]
  for (const t of trains) {
    const exists = await db.trainTicket.findFirst({ where: { trainNo: t.trainNo, originCode: t.originCode, destCode: t.destCode } })
    if (!exists) await db.trainTicket.create({ data: t })
  }
  console.log(`  Train tickets: ${trains.length}`)

  // Vendors
  const vendors = [
    { name: 'The Lalit Grand Palace', type: 'Hotel', category: 'Luxury', location: 'Srinagar', phone: '+91 194 250 1001', email: 'stay@lalitgrand.com', rating: 4.8, pricePerDay: 18000 },
    { name: 'The Khyber Himalayan Resort', type: 'Hotel', category: 'Luxury', location: 'Gulmarg', phone: '+91 194 250 6060', email: 'reservations@khyberresort.com', rating: 4.9, pricePerDay: 24000 },
    { name: 'Welcome Hotel by Khems', type: 'Hotel', category: 'Premium', location: 'Pahalgam', phone: '+91 1936 248 215', rating: 4.6, pricePerDay: 6500 },
    { name: 'Hotel Dragon', type: 'Hotel', category: 'Standard', location: 'Leh', phone: '+91 1982 252 022', rating: 4.4, pricePerDay: 3200 },
    { name: 'The Grand Dragon Ladakh', type: 'Hotel', category: 'Premium', location: 'Leh', phone: '+91 1982 277 777', email: 'stay@granddragonladakh.com', rating: 4.7, pricePerDay: 7800 },
    { name: 'Imtiyaz Ahmad Bhat', type: 'Driver', category: 'Premium', location: 'Magam', phone: '+91 600 626 6072', rating: 4.9, pricePerDay: 3800 },
    { name: 'Mehraj-ud-Din', type: 'Driver', category: 'Standard', location: 'Srinagar', phone: '+91 979 705 1060', rating: 4.8, pricePerDay: 3500 },
    { name: 'Tashi Norbu', type: 'Guide', category: 'Premium', location: 'Leh', phone: '+91 1982 275 233', rating: 4.9, pricePerDay: 2500 },
    { name: 'Mohammad Yusuf', type: 'Guide', category: 'Standard', location: 'Srinagar', phone: '+91 941 901 2345', rating: 4.7, pricePerDay: 2200 },
    { name: 'Kashmir Lens Studio', type: 'Photographer', category: 'Premium', location: 'Srinagar', phone: '+91 941 902 3456', email: 'shoot@kashmirlens.in', rating: 4.9, pricePerDay: 4500 },
    { name: 'Mountain Lens Ladakh', type: 'Photographer', category: 'Premium', location: 'Leh', phone: '+91 1982 278 999', rating: 4.8, pricePerDay: 4800 },
    { name: 'Alpine Cabs Kashmir', type: 'Cab', category: 'Standard', location: 'Srinagar', phone: '+91 941 903 4567', rating: 4.6, pricePerDay: 3800 },
    { name: 'Ladakh 4x4 Adventures', type: 'Cab', category: 'Premium', location: 'Leh', phone: '+91 1982 279 100', email: 'drive@ladakh4x4.in', rating: 4.9, pricePerDay: 5500 },
    { name: 'Stok Palace Heritage Homestay', type: 'Homestay', category: 'Premium', location: 'Stok (Leh)', phone: '+91 1982 277 001', rating: 4.8, pricePerDay: 5500 },
    { name: 'Nubra Homestay Network', type: 'Homestay', category: 'Standard', location: 'Hunder (Nubra)', phone: '+91 1982 277 200', rating: 4.5, pricePerDay: 2200 },
  ]
  for (const v of vendors) {
    const exists = await db.vendor.findFirst({ where: { name: v.name, location: v.location } })
    if (!exists) await db.vendor.create({ data: v })
  }
  console.log(`  Vendors: ${vendors.length}`)

  console.log('Seed complete.')
  console.log('  Admin: admin@himalayanfreak.com / admin123')
  console.log('  User:  aarav@example.com / user123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
