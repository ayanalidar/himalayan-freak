// Seed team members into the database
import { db } from '../src/lib/db'

async function main() {
  console.log('Seeding team members...')

  const team = [
    {
      name: 'Syed Shamshul Razvi',
      role: 'Founder & CEO',
      bio: 'Founder & CEO of Himalayan Freak. Visionary behind every custom itinerary. Born and raised in Magam, Kashmir - knows every pass, every homestay, every driver by name.',
      avatar: 'S',
      order: 1,
      active: true,
    },
    {
      name: 'Imtiyaz Ahmad',
      role: 'Lead Trip Designer',
      bio: '14 years guiding in Pir Panjal & Ladakh. Speaks Kashmiri, Urdu, Hindi, Ladakhi & basic Tibetan. Designs every offbeat itinerary.',
      avatar: 'I',
      order: 2,
      active: true,
    },
    {
      name: 'Suhail Bhat',
      role: 'Operations & Logistics Head',
      bio: 'Master of permits, convoy timings and oxygen cylinders. The voice you will hear at 4am if Zoji La opens.',
      avatar: 'S',
      order: 3,
      active: true,
    },
    {
      name: 'Aaliya Khan',
      role: 'Customer Experience Lead',
      bio: 'Designs every pre-trip onboarding call. Believes the journey starts the day you book, not the day you fly.',
      avatar: 'A',
      order: 4,
      active: true,
    },
    {
      name: 'Tashi Norbu',
      role: 'Senior Mountain Guide (Ladakh)',
      bio: 'Born in Nubra. Holds mountaineering certifications from NIM Uttarkashi. Knows every chang-la shortcut and homestay cook.',
      avatar: 'T',
      order: 5,
      active: true,
    },
  ]

  for (const m of team) {
    const exists = await db.teamMember.findFirst({ where: { name: m.name } })
    if (!exists) {
      await db.teamMember.create({ data: m })
      console.log(`  Added: ${m.name}`)
    } else {
      console.log(`  Already exists: ${m.name}`)
    }
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
