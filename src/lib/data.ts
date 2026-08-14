// Shared types & data — Himalayan Freak
import { db } from '@/lib/db'

export type Region = 'Kashmir' | 'Jammu' | 'Ladakh' | 'Himachal' | 'Uttarakhand'

export interface DestinationData {
  id?: string
  slug: string
  name: string
  region: Region
  state: string
  elevation: number
  latitude: number
  longitude: number
  tagline: string
  description: string
  bestTime: string
  duration: string
  difficulty: string
  rating: number
  heroImage: string
  gallery: string[]
  attractions: string[]
  activities: string[]
  howToReach: string
  featured: boolean
}

// Unsplash images — hand-picked for each Himalayan destination
export const destinations: DestinationData[] = [
  {
    slug: 'srinagar',
    name: 'Srinagar',
    region: 'Kashmir',
    state: 'Jammu & Kashmir',
    elevation: 1585,
    latitude: 34.0837,
    longitude: 74.7973,
    tagline: 'The Venice of the East',
    description:
      'Srinagar, the summer capital of Jammu & Kashmir, is a timeless mosaic of floating gardens, Mughal palaces, and chinar-lined boulevards. Gliding aboard a shikara across Dal Lake at dawn, watching the sun ignite the Pir Panjal range, is among the most soul-stirring experiences in Asia. The old city hums with saffron traders, papier-mâché artisans, and carpet weavers whose lineage runs back centuries. Whether you spend a night on a houseboat, sip kahwa in a Mughal garden, or lose yourself in the floating vegetable market, Srinagar lingers long after you leave.',
    bestTime: 'April to October (peak bloom: April–May for tulips, September for chinar)',
    duration: '3–4 days',
    difficulty: 'Easy',
    rating: 4.8,
    heroImage:
      'https://images.unsplash.com/photo-1605649461784-ef21f4e6a8ec?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605649461784-ef21f4e6a8ec?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Dal Lake — houseboats, shikara rides & floating gardens',
      'Mughal Gardens: Nishat, Shalimar & Chashm-e-Shahi',
      'Hazratbal Shrine & Jamia Masjid',
      'Old City bazaars: spice, saffron & papier-mâché',
      'Tulip Garden (Asia’s largest, blooms in April)',
      'Shankaracharya Temple atop Takht-e-Suleiman',
    ],
    activities: [
      'Sunrise shikara ride on Dal Lake',
      'Stay on a traditional houseboat',
      'Kahwa tasting with a Kashmiri family',
      'Saffron field visit at Pampore',
      'Pashmina & carpet weaving workshop',
      'Wazwan traditional feast',
    ],
    howToReach:
      'Srinagar International Airport (SXR) has direct flights from Delhi, Mumbai, Jammu and Leh. The 300km Jammu–Srinagar National Highway (NH-44) is scenic but slow. Train: nearest railhead is Udhampur (200km) / Banihal (130km, connected by USBRL).',
    featured: true,
  },
  {
    slug: 'gulmarg',
    name: 'Gulmarg',
    region: 'Kashmir',
    state: 'Jammu & Kashmir',
    elevation: 2650,
    latitude: 34.0484,
    longitude: 74.3805,
    tagline: 'The Meadow of Flowers',
    description:
      'Gulmarg is a cup-shaped alpine bowl perched at 2,650m in the Pir Panjal range, draped in wildflowers in summer and powder so deep in winter that skiers fly in from across the globe. The Gulmarg Gondola — one of the highest cable cars in the world — ferries visitors to 3,979m at Apharwat Peak, where the Himalayas fall away in a 360° white rampage. In spring the meadow explodes into a million daisies; in autumn the golf course (world’s highest) turns amber under a sky of crows. Gulmarg is adventure and stillness in equal measure.',
    bestTime: 'December to March for skiing; May to September for meadows & gondola',
    duration: '2–3 days',
    difficulty: 'Moderate',
    rating: 4.7,
    heroImage:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341577-58edc5d25d4a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601551620748-4f5b1c2e8b76?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605649461784-ef21f4e6a8ec?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Gulmarg Gondola — Phase I (Kongdoori) & Phase II (Apharwat 3,979m)',
      'Alpather Lake (frozen till June)',
      'Maharani Temple & St. Mary’s Church',
      'World’s highest 18-hole golf course',
      'Strawberry Valley & Children’s Park',
      'Khilanmarg meadow (5km trek)',
    ],
    activities: [
      'Skiing & snowboarding (Dec–Mar, heli-skiing available)',
      'Snowshoe walks & gondola rides',
      'Mountain biking & ATV rides',
      'Trek to Alpather Lake',
      'Golf at 2,650m (May–Sep)',
      'Photography at sunset ridge',
    ],
    howToReach:
      '56km from Srinagar (1.5 hours by road). Tangmarg is the last motorable point in winter, from where ponies/snow-mobiles take you up. Airport: Srinagar (SXR).',
    featured: true,
  },
  {
    slug: 'pahalgam',
    name: 'Pahalgam',
    region: 'Kashmir',
    state: 'Jammu & Kashmir',
    elevation: 2200,
    latitude: 34.015,
    longitude: 75.33,
    tagline: 'The Valley of Shepherds',
    description:
      'Pahalgam sits where the Aru and Lidder rivers meet under a cathedral of deodar and pine. Once a humble shepherd village, it is now the launchpad for the Amarnath Yatra and a base for some of Kashmir’s most beautiful day-treks. The meadow of Betaab Valley (named after a Bollywood film shot here) and the alpine lakes of Tarsar and Marsar are day-dreams made real. Pahalgam is the rare place that satisfies both the contemplative traveller and the serious trekker.',
    bestTime: 'March to November (peak: May–June & September)',
    duration: '2–3 days',
    difficulty: 'Moderate',
    rating: 4.7,
    heroImage:
      'https://images.unsplash.com/photo-1626621341577-58edc5d25d4a?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626621341577-58edc5d25d4a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593181629936-11c669d8d3f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605649461784-ef21f4e6a8ec?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Betaab Valley & Aru Valley',
      'Chandanwari (Amarnath base camp)',
      'Lidder River trout fishing beats',
      'Tarsar-Marsar alpine lake trek',
      'Baisaran "Mini Switzerland" meadow',
      'Overa-Aru Wildlife Sanctuary',
    ],
    activities: [
      'Horse-riding to Baisaran',
      'River rafting on the Lidder',
      'Trout fishing (permit required)',
      'Day trek to Tulian Lake',
      'Golf at Pahalgam Club',
      'Shepherd village walks',
    ],
    howToReach:
      '95km from Srinagar (2.5 hours via Anantnag). Shared & private cabs available. Helicopter service for Amarnath Yatra operates from Baltal & Pahalgam.',
    featured: true,
  },
  {
    slug: 'sonmarg',
    name: 'Sonmarg',
    region: 'Kashmir',
    state: 'Jammu & Kashmir',
    elevation: 2800,
    latitude: 34.3005,
    longitude: 75.2908,
    tagline: 'The Meadow of Gold',
    description:
      'Sonmarg is the gateway to Zoji La and the last Kashmiri outpost before Ladakh. In summer the meadow glows butter-yellow with wildflowers, framed by the snowy sentinels of the Thajiwas glacier — a short pony ride away. The Sindh river fans out across the valley in braided silver ribbons, and the road east climbs through Baltal toward the holy cave of Amarnath. Sonmarg is also the starting point of the famous three-day trek to Vishansar, Krishansar and Gangabal twin lakes, a route so beautiful it is considered one of the finest alpine walks in Asia.',
    bestTime: 'May to October',
    duration: '2 days',
    difficulty: 'Moderate',
    rating: 4.6,
    heroImage:
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Thajiwas Glacier (pony ride / walk)',
      'Vishansar & Krishansar twin lakes trek',
      'Zoji La pass (gateway to Ladakh)',
      'Baltal — Amarnath Yatra base',
      'Nilagrad River confluence',
      'Sindh River trout beats',
    ],
    activities: [
      'Glacier walks & sled rides',
      'Trek to Gangabal Lake',
      'River rafting on the Sindh',
      'Fishing permits on the Sindh',
      'Photography at Zoji La sunrise',
      'Camping under the Milky Way',
    ],
    howToReach:
      '80km from Srinagar on the Srinagar–Leh highway (3 hours). Sonmarg is closed for through traffic from November to May due to snow at Zoji La.',
    featured: true,
  },
  {
    slug: 'leh',
    name: 'Leh',
    region: 'Ladakh',
    state: 'Ladakh',
    elevation: 3500,
    latitude: 34.1526,
    longitude: 77.577,
    tagline: 'The Kingdom of Mountain Passes',
    description:
      'Leh, the historical capital of the Ladakhi kingdom, is where the Indian plateau truly begins to feel Tibetan. Whitewashed stupas dot every ridge, prayer flags snap in the thin air, and 17th-century monasteries like Thiksey and Hemis cling like swallows’ nests to vertical cliffs. Acclimatise gently, sip butter tea in a Tibetan cafe, walk up to Leh Palace at sunset, and the desert mountains turn copper, then violet, then a deep silence that is the true face of the Himalaya.',
    bestTime: 'May to September (roads close Oct–Apr due to snow)',
    duration: '4–5 days',
    difficulty: 'Moderate',
    rating: 4.8,
    heroImage:
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593181629936-11c669d8d3f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Leh Palace & Namgyal Tsemo Gompa',
      'Shanti Stupa (panoramic sunset)',
      'Thiksey & Hemis Monasteries',
      'Hall of Fame (Army museum)',
      'Stok Palace (Royal family residence)',
      'Sangam — Zanskar & Indus confluence',
    ],
    activities: [
      'Two-day acclimatisation walk',
      'Monastery circuit (Spituk, Thiksey, Hemis)',
      'River rafting on the Zanskar',
      'Mountain biking Khardung La',
      'Tibetan cooking class',
      'Stargazing at 3,500m',
    ],
    howToReach:
      'Kushok Bakula Rimpochee Airport (IXL) — daily flights from Delhi, Srinagar & Jammu. By road: 434km Srinagar–Leh via Zoji La (Jun–Oct), or 474km Manali–Leh via Rohtang (Jun–Oct).',
    featured: true,
  },
  {
    slug: 'nubra-valley',
    name: 'Nubra Valley',
    region: 'Ladakh',
    state: 'Ladakh',
    elevation: 3048,
    latitude: 34.65,
    longitude: 77.55,
    tagline: 'Where Desert Meets Glacier',
    description:
      'Crossing Khardung La — one of the highest motorable passes in the world at 5,359m — the road drops into the surreal Nubra Valley, where Bactrian camels wander cold desert dunes at Hunder, hot springs steam at Panamik, and the Shyok river bends like jade through Diskit. The 32m Maitreya Buddha at Diskit monastery keeps silent watch over the valley, and the double-humped camels (left behind from the ancient Silk Route) remain one of the most surreal sights in the Indian Himalaya.',
    bestTime: 'June to September',
    duration: '2–3 days',
    difficulty: 'Challenging',
    rating: 4.8,
    heroImage:
      'https://images.unsplash.com/photo-1593181629936-11c669d8d3f8?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593181629936-11c669d8d3f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Khardung La — 5,359m motorable pass',
      'Diskit Monastery & 32m Maitreya Buddha',
      'Hunder sand dunes & Bactrian camel rides',
      'Panamik hot springs',
      'Sumur Samstanling Gompa',
      'Turtuk — last village on Silk Route',
    ],
    activities: [
      'Camel safari on cold-desert dunes',
      'ATV rides in Hunder',
      'Monastery walks & butter tea',
      'Camping under star-drenched skies',
      'Village homestay at Turtuk (Balti culture)',
      'Sunrise at Khardung La',
    ],
    howToReach:
      '120km from Leh via Khardung La (4–5 hours). Inner Line Permit required for Indian nationals; Protected Area Permit for foreigners. Organised taxis & bikes available in Leh.',
    featured: true,
  },
  {
    slug: 'pangong-lake',
    name: 'Pangong Tso',
    region: 'Ladakh',
    state: 'Ladakh',
    elevation: 4225,
    latitude: 33.75,
    longitude: 78.65,
    tagline: 'The Lake That Changes Colour',
    description:
      'Pangong Tso stretches 134km across the Ladakhi plateau into Tibet, a sheet of impossible blue that turns emerald, then silver, then violet as the day moves. At 4,225m, the air is thin and silent save for the wind and the cry of Brahminy ducks. Spending a night beside the lake — in a tented camp at Spangmik or a homestay at Man, watching the Milky Way wheel overhead — is among the most transcendent experiences the Himalaya can offer.',
    bestTime: 'June to September',
    duration: '1–2 days (often combined with Leh)',
    difficulty: 'Moderate',
    rating: 4.9,
    heroImage:
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593181629936-11c669d8d3f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Pangong Tso — 134km trans-boundary lake',
      'Spangmik village & lakeside camps',
      'Chang La pass (5,360m, on route)',
      'Man & Merak villages (offbeat)',
      'Brahminy duck & migratory bird watching',
      'Lakeside sunset & sunrise',
    ],
    activities: [
      'Lakeside camping',
      'Stargazing & astrophotography',
      'Birdwatching (migratory birds)',
      'Mountain bike down from Chang La',
      'Village homestays at Man/Merak',
      'Photography at "3 Idiots" filming point',
    ],
    howToReach:
      '225km from Leh via Chang La (6–7 hours). Inner Line Permit required. Day-return possible but overnight recommended for sunrise/sunset.',
    featured: true,
  },
  {
    slug: 'kargil',
    name: 'Kargil',
    region: 'Ladakh',
    state: 'Ladakh',
    elevation: 2676,
    latitude: 34.5539,
    longitude: 76.1349,
    tagline: 'Gateway to Zanskar',
    description:
      'Kargil sits on the banks of the Suru river, the second-largest town of Ladakh and a strategic halt on the Srinagar–Leh highway. Once a busy Silk Route bazaar, today it is the gateway to the Suru & Zanskar valleys and a living memorial to the 1999 Kargil War. The town itself trades in apricots, pashmina and Balti culture; nearby Drass is the second-coldest inhabited place on Earth. Kargil rewards travellers willing to slow down and listen to its layered history.',
    bestTime: 'May to October',
    duration: '1–2 days',
    difficulty: 'Easy',
    rating: 4.4,
    heroImage:
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593181629936-11c669d8d3f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Kargil War Memorial, Drass',
      'Tiger Hill & Tololing views',
      'Munshi Aziz Bhat Central Asian Museum',
      'Suru Valley & Parkachik glacier views',
      'Pensi La pass (gateway to Zanskar)',
      'Apricot orchards (Aug harvest)',
    ],
    activities: [
      'Visit to Drass War Memorial',
      'Apricot blossom tour (April)',
      'Suru Valley drive to Rangdum',
      'Museum tour of Silk Route artefacts',
      'Photography at Minam Meadow',
      'Trekking toward Zanskar',
    ],
    howToReach:
      '204km from Srinagar (5 hours) on the Srinagar–Leh highway. 230km from Leh. Kargil does not have an airport; nearest is Leh (IXL) or Srinagar (SXR).',
    featured: false,
  },
  {
    slug: 'zanskar',
    name: 'Zanskar Valley',
    region: 'Ladakh',
    state: 'Ladakh',
    elevation: 3650,
    latitude: 33.55,
    longitude: 76.5,
    tagline: 'The Last Frontier of Tibetan Buddhism',
    description:
      'Zanskar is a tri-armed valley system cut off from the world for seven months a year by snow. Its villages cling to riverbanks beneath 6,000m peaks; its monasteries — Karsha, Phugtal, Sani — hold treasures of Tibetan Buddhism. In winter, the fabled Chadar Trek walks the frozen Zanskar river through a canyon of turquoise ice. For the traveller who has seen everything, Zanskar still offers the rare feeling of arriving somewhere genuinely remote.',
    bestTime: 'June to September (summer); January–February for Chadar trek',
    duration: '5–7 days',
    difficulty: 'Challenging',
    rating: 4.8,
    heroImage:
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593181629936-11c669d8d3f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Padum — Zanskar’s administrative capital',
      'Phugtal Monastery (cliff-clinging cave gompa)',
      'Karsha & Sani monasteries',
      'Chadar Trek on frozen Zanskar river (Jan–Feb)',
      'Pensi La & Drang-Drung glacier',
      'Zangla & Stongdey villages',
    ],
    activities: [
      'Chadar winter trek on frozen river',
      'Multi-day Darcha–Padum trek',
      'River rafting on the Zanskar',
      'Monastery circuit',
      'Homestays in traditional Zanskari homes',
      'Stargazing in zero light pollution',
    ],
    howToReach:
      '440km from Leh via Kargil and Suru Valley (2-day drive, July–Sept). Or on foot via the Darcha–Padum trek. Inner Line Permit required.',
    featured: false,
  },
  {
    slug: 'doodhpathri',
    name: 'Doodhpathri',
    region: 'Kashmir',
    state: 'Jammu & Kashmir',
    elevation: 2730,
    latitude: 33.8333,
    longitude: 74.7333,
    tagline: 'The Valley of Milk',
    description:
      'Doodhpathri is a crescent-shaped alpine meadow 40km from Srinagar, so named because the river that braids through it runs milky-white from glacial silt. The grass rolls uninterrupted to the foot of the Pir Panjal, ponies drift across the meadow, and the silence is broken only by the tinkle of sheep bells. Still off the main tourist map, Doodhpathri is the day-trip the locals take when they want to disappear into a meadow for an afternoon.',
    bestTime: 'May to September',
    duration: '1 day',
    difficulty: 'Easy',
    rating: 4.5,
    heroImage:
      'https://images.unsplash.com/photo-1626621341577-58edc5d25d4a?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626621341577-58edc5d25d4a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605649461784-ef21f4e6a8ec?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Undulating meadows of Sholga',
      'River bend at Tangnar',
      'Pony rides across the bowl',
      'Trek start point to Tosa Maidan',
      'Picnic groves along the Shaliganga',
    ],
    activities: [
      'Day picnic & photography',
      'Pony riding',
      'Short hikes to surrounding ridges',
      'River-side camping (with permit)',
      'Local shepherd lunches',
    ],
    howToReach:
      '42km from Srinagar via Budgam (1.5 hours). Road is motorable till the meadow; no public transport — pre-book a cab.',
    featured: false,
  },
  {
    slug: 'yusmarg',
    name: 'Yusmarg',
    region: 'Kashmir',
    state: 'Jammu & Kashmir',
    elevation: 2395,
    latitude: 33.8333,
    longitude: 74.65,
    tagline: 'The Meadow of Jesus',
    description:
      'Local legend holds that Jesus once walked these meadows; the name Yus (Jesus) Marg (meadow) is its echo. Whether or not the story holds, Yusmarg’s rolling grasslands ringed by dense pine forest are among the most serene in Kashmir. Day walks lead to Nilnag Lake and Sang-e-Safed, a cliff of white stone. With no mobile signal and no crowds, Yusmarg is the place to disconnect and remember what silence sounds like.',
    bestTime: 'April to October',
    duration: '1–2 days',
    difficulty: 'Easy',
    rating: 4.5,
    heroImage:
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341577-58edc5d25d4a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605649461784-ef21f4e6a8ec?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Nilnag Lake (4km walk)',
      'Sang-e-Safed white cliff',
      'Charar-e-Sharif shrine (en route)',
      'Meadows of Pakherpora',
      'Pine forest trails',
    ],
    activities: [
      'Horse-riding across the meadow',
      'Walk to Nilnag Lake',
      'Forest trekking & birdwatching',
      'Shepherd interactions & cheese tasting',
      'Stargazing',
    ],
    howToReach:
      '47km from Srinagar (1.5 hours). Road motorable till Yusmarg; hire a cab from Srinagar or Charar-e-Sharif.',
    featured: false,
  },
  {
    slug: 'dachigam',
    name: 'Dachigam National Park',
    region: 'Kashmir',
    state: 'Jammu & Kashmir',
    elevation: 1700,
    latitude: 34.1167,
    longitude: 75.0333,
    tagline: 'Last Refuge of the Hangul',
    description:
      'Dachigam, just 22km from Srinagar, is the last stronghold of the Kashmir stag (Hangul), a critically endangered red deer subspecies. The park climbs from 1,700m to 4,400m across a steep gradient, sheltering leopard, Himalayan black bear, musk deer and over 150 bird species. November is rutting season, when stags bugle across the valley. Permits are required, but a guided walk inside Dachigam is one of the most rewarding wildlife experiences in the western Himalaya.',
    bestTime: 'April to October (best wildlife: September–November)',
    duration: '1 day',
    difficulty: 'Moderate',
    rating: 4.5,
    heroImage:
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605649461784-ef21f4e6a8ec?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Hangul (Kashmir stag) sightings',
      'Marsar Lake inside upper Dachigam',
      'Trout fish hatchery',
      'Leopard & black bear habitat',
      'Over 150 bird species',
    ],
    activities: [
      'Guided wildlife walks',
      'Birdwatching (Sep–Mar)',
      'Trek to Marsar Lake',
      'Photography hides',
      'Trout farm visit',
    ],
    howToReach:
      '22km from Srinagar (45 min). Entry permits via Wildlife Warden, Srinagar. Only guided walks allowed inside the park.',
    featured: false,
  },
  {
    slug: 'patnitop',
    name: 'Patnitop',
    region: 'Jammu',
    state: 'Jammu & Kashmir',
    elevation: 2024,
    latitude: 33.0833,
    longitude: 75.2833,
    tagline: 'Pine-Clad Plateau of Jammu',
    description:
      'Patnitop sits midway on the Jammu–Srinagar highway, a plateau of cedar and pine that breaks the long climb to Kashmir. In winter it is dusted with snow and buzzing with skiers; in summer it is a green lung, ideal for paragliding, pony rides and a hot lunch at Nathatop. Sanasar, 17km away, offers a quieter alpine bowl and a lake for rowing. Patnitop is the perfect one-night halt to stretch the legs on a long Kashmir drive.',
    bestTime: 'March to October (Dec–Feb for snow)',
    duration: '1–2 days',
    difficulty: 'Easy',
    rating: 4.3,
    heroImage:
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Nathatop meadow & paragliding',
      'Sanasar lake & meadow',
      'Madhatop (snow in winter)',
      'Sudh Mahadev temple (en route)',
      'Naag Mandir (Patnitop)',
      'Kud ki Patissa (local sweet)',
    ],
    activities: [
      'Paragliding at Nathatop',
      'Snow skiing (Dec–Feb)',
      'Pony rides & nature walks',
      'Camping at Sanasar',
      'Tree-house stays',
      'Trek to Mantalai',
    ],
    howToReach:
      '112km from Jammu (3 hours) on NH-44, en route to Srinagar. Nearest railhead: Udhampur (45km). Nearest airport: Jammu (IXJ).',
    featured: false,
  },
  {
    slug: 'mughal-road',
    name: 'Mughal Road',
    region: 'Jammu',
    state: 'Jammu & Kashmir',
    elevation: 3500,
    latitude: 33.3667,
    longitude: 74.2833,
    tagline: 'The Ancient Highway of Emperors',
    description:
      'The Mughal Road is the 84km historical route from Bafliaz (Poonch) to Shopian (Kashmir) over the Pir Panjal at Peer Ki Gali (3,490m). Built on the path Akbar once took to conquer Kashmir in 1586, it remains the least travelled route into the valley — a single-lane ribbon through dense pine forest, alpine meadow and remote Gujjar hamlets. The road closes from November to April, but in summer it offers a side of Kashmir that NH-44 cannot.',
    bestTime: 'May to October',
    duration: '1–2 days (transit)',
    difficulty: 'Moderate',
    rating: 4.5,
    heroImage:
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Peer Ki Gali pass (3,490m)',
      'Noor-e-Chamb waterfall (Aliabad)',
      'Bufliaz — historic campsite',
      'Shopian apple orchards',
      'Sukh Sarai ruins',
    ],
    activities: [
      'Scenic driving & photography',
      'Trekking in Pir Panjal range',
      'Apple orchard visits (Sep)',
      'Gujjar village cultural stops',
      'Sunrise at Peer Ki Gali',
    ],
    howToReach:
      'Accessible from Jammu via Rajouri–Poonch–Bafliaz (210km, 6 hours) or from Srinagar via Shopian (60km, 2 hours). Open May–Oct only.',
    featured: false,
  },
  {
    slug: 'vaishno-devi',
    name: 'Vaishno Devi',
    region: 'Jammu',
    state: 'Jammu & Kashmir',
    elevation: 5300,
    latitude: 33.0312,
    longitude: 74.9496,
    tagline: 'The Holy Cave Shrine of Mata Rani',
    description:
      'Perched at 5,300ft in the Trikuta hills, Vaishno Devi is one of the most revered Hindu shrines, drawing over 10 million pilgrims a year. The 13km uphill trek from Katra is itself a moving spiritual exercise — lit at night, lined with chants and chai stalls — and culminates in the holy cave where three pindis (rock formations) represent Maha Kali, Maha Lakshmi and Maha Saraswati. Helicopter, pony and palki options make the yatra accessible to all.',
    bestTime: 'March to October (avoid Jan–Feb snow)',
    duration: '1–2 days',
    difficulty: 'Moderate',
    rating: 4.8,
    heroImage:
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605649461784-ef21f4e6a8ec?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Holy cave of Mata Vaishno Devi',
      'Ardh Kuwari cave',
      'Bhairon Temple (2km beyond cave)',
      'Ban Ganga & Charan Paduka',
      'Himkoti viewpoint',
    ],
    activities: [
      'Pilgrimage trek (13km)',
      'Helicopter ride (Katra → Sanjichhat)',
      'Pony / palki / e-rickshaw',
      'Evening aarti',
      'Photography at Himkoti',
    ],
    howToReach:
      'Katra base camp (50km from Jammu). Jammu Tawi is the nearest railway (rail extension to Katra now operational). Jammu Airport (IXJ) 55km from Katra. Yatra registration mandatory.',
    featured: true,
  },
  {
    slug: 'spiti',
    name: 'Spiti Valley',
    region: 'Himachal',
    state: 'Himachal Pradesh',
    elevation: 3800,
    latitude: 32.2464,
    longitude: 78.0349,
    tagline: 'The Middle Land Between India & Tibet',
    description:
      'Spiti — "the middle land" — is a cold desert valley in Himachal Pradesh with Tibet to its east. Villages here sit at 4,000m, monasteries are 1,000 years old, and fossils lie scattered on the mountainsides. Tabo, Dhankar, Ki and the highest post office in the world at Hikkim are the highlights. Spiti is the gentler cousin of Ladakh: smaller in scale, easier to reach in summer, no less soul-stirring.',
    bestTime: 'May to October',
    duration: '6–8 days',
    difficulty: 'Moderate',
    rating: 4.8,
    heroImage:
      'https://images.unsplash.com/photo-1593181629936-11c669d8d3f8?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593181629936-11c669d8d3f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Ki Monastery & Kibber village',
      'Tabo Monastery (1,000+ years old)',
      'Chandratal Lake',
      'Dhankar Monastery & lake',
      'Pin Valley National Park',
      'Hikkim — highest post office',
    ],
    activities: [
      'Monastery circuit',
      'Trek to Chandratal',
      'Fossil hunting at Langza',
      'Snow leopard tracking (winter)',
      'Village homestays',
      'Pin Valley wildlife tour',
    ],
    howToReach:
      'Two routes: via Shimla–Rampur–Tabo (open year-round), or via Manali–Rohtang–Kunzum (June–Oct). Nearest airport: Bhuntar (Kullu) 240km.',
    featured: false,
  },
  {
    slug: 'manali',
    name: 'Manali',
    region: 'Himachal',
    state: 'Himachal Pradesh',
    elevation: 2040,
    latitude: 32.2396,
    longitude: 77.1887,
    tagline: 'The Alpine Resort of the Beas Valley',
    description:
      'Manali sits where the Beas river tumbles out of the mountains on its way to the plains, framed by snow peaks and pine forest. Old Manali retains a hippie alpine village charm with wooden cafes and apple orchards; Solang Valley is the adventure hub for paragliding and skiing; and Rohtang La, just beyond, is the gateway to Lahaul, Spiti and Ladakh. Whether for honeymoon, adventure or transit, Manali is the magnet of the western Himalaya.',
    bestTime: 'March to June & October to February',
    duration: '3–4 days',
    difficulty: 'Easy',
    rating: 4.5,
    heroImage:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593181629936-11c669d8d3f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Solang Valley & Rohtang La',
      'Hadimba Devi temple',
      'Manikaran Sahib (hot springs)',
      'Old Manali cafes & apple orchards',
      'Naggar Castle & Roerich Gallery',
      'Atal Tunnel (longest highway tunnel)',
    ],
    activities: [
      'Paragliding & zorbing at Solang',
      'Skiing at Solang / Rohtang',
      'River rafting on the Beas',
      'Trek to Hamta Pass',
      'Mountain biking to Rohtang',
      'Café hopping in Old Manali',
    ],
    howToReach:
      '540km from Delhi (12 hours). Nearest airport: Bhuntar (Kullu) 50km. Nearest broad-gauge rail: Chandigarh (310km) or Joginder Nagar narrow-gauge.',
    featured: false,
  },
  {
    slug: 'rishikesh',
    name: 'Rishikesh',
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    elevation: 372,
    latitude: 30.0869,
    longitude: 78.2676,
    tagline: 'Yoga Capital of the World',
    description:
      'Rishikesh sits where the Ganges pours out of the Himalaya onto the plains, a town of ashrams, yoga shalas and the evening Ganga aarti at Triveni Ghat. The two suspension bridges — Lakshman Jhula and Ram Jhula — connect forested banks where the Beatles once studied with the Maharishi. Rishikesh is also India’s whitewater capital, with rapids from Grade I to IV, and the launch point for treks into the Garhwal Himalaya.',
    bestTime: 'September to April (avoid monsoon Jul–Aug)',
    duration: '2–3 days',
    difficulty: 'Easy',
    rating: 4.6,
    heroImage:
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1200&q=80',
    ],
    attractions: [
      'Triveni Ghat — evening Ganga aarti',
      'Lakshman Jhula & Ram Jhula bridges',
      'Beatles Ashram (Maharishi Mahesh Yogi)',
      'Neelkanth Mahadev temple',
      'Rajaji National Park',
      'Vashishta cave',
    ],
    activities: [
      'Whitewater rafting (Grade I–IV)',
      'Yoga & meditation retreats',
      'Bungee jumping at Mohan Chatti',
      'Trek to Kunjapuri temple (sunrise)',
      'Ayurvedic massage & Panchakarma',
      'Café culture in Tapovan',
    ],
    howToReach:
      '240km from Delhi (6 hours). Nearest airport: Dehradun (DED) 20km. Nearest rail: Rishikesh railway station / Haridwar 25km.',
    featured: false,
  },
]

export interface PackageData {
  slug: string
  title: string
  region: Region | 'Multi-Region'
  duration: number
  nights: number
  price: number
  description: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: { day: number; title: string; description: string }[]
  heroImage: string
  rating: number
  featured: boolean
}

export const packages: PackageData[] = [
  {
    slug: 'kashmir-dreams-5d',
    title: 'Kashmir Dreams — 5 Days / 4 Nights',
    region: 'Kashmir',
    duration: 5,
    nights: 4,
    price: 18900,
    description:
      'The classic Kashmir circuit — Srinagar’s houseboats, Gulmarg’s gondola, Pahalgam’s pine valleys and Sonmarg’s meadows. Hand-picked hotels, daily breakfast & dinner, and a dedicated SUV with driver-guide throughout.',
    highlights: [
      'Night on a Dal Lake houseboat',
      'Gulmarg Gondola to 3,979m',
      'Betaab Valley & Aru meadow',
      'Sunrise shikara ride',
      'Wazwan welcome dinner',
    ],
    inclusions: [
      '4 nights stay (1 houseboat + 3 hotels)',
      'Daily breakfast & dinner',
      'Private SUV with driver',
      'All sightseeing as per itinerary',
      'Shikara ride on Dal Lake',
      'Gondola Phase-I ticket',
    ],
    exclusions: [
      'Airfare / train fare',
      'Lunches & beverages',
      'Personal expenses & tips',
      'Travel insurance',
      'Anything not mentioned in inclusions',
    ],
    itinerary: [
      { day: 1, title: 'Arrive Srinagar — Dal & Mughal Gardens', description: 'Airport pickup, check-in to houseboat, sunset shikara ride, welcome Wazwan dinner.' },
      { day: 2, title: 'Srinagar → Gulmarg (52km)', description: 'Drive to Gulmarg, gondola to Apharwat, lunch at Kongdoori, evening return.' },
      { day: 3, title: 'Gulmarg → Pahalgam (140km)', description: 'Scenic drive via Anantnag, Betaab Valley, Lidder riverside dinner.' },
      { day: 4, title: 'Pahalgam → Sonmarg → Srinagar', description: 'Day trip to Sonmarg & Thajiwas glacier, evening return to Srinagar hotel.' },
      { day: 5, title: 'Srinagar — Departure', description: 'Morning Mughal gardens, last-minute shopping, airport drop.' },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1605649461784-ef21f4e6a8ec?auto=format&fit=crop&w=1600&q=80',
    rating: 4.7,
    featured: true,
  },
  {
    slug: 'ladakh-odyssey-7d',
    title: 'Ladakh Odyssey — 7 Days / 6 Nights',
    region: 'Ladakh',
    duration: 7,
    nights: 6,
    price: 34500,
    description:
      'The full Leh–Ladakh loop with acclimatisation, monasteries, Nubra’s sand dunes and the indescribable blue of Pangong. Includes inner-line permits, all meals, and a 4×4 with driver.',
    highlights: [
      'Khardung La — 5,359m motorable pass',
      'Bactrian camel ride at Hunder dunes',
      'Overnight at Pangong Tso',
      'Thiksey & Hemis monasteries',
      'Sangam — Zanskar–Indus confluence',
    ],
    inclusions: [
      '6 nights stay in Leh, Nubra & Pangong',
      'All meals (B/L/D)',
      '4×4 SUV with experienced driver',
      'Inner Line Permits',
      'Oxygen cylinder & first aid',
      'Airport transfers',
    ],
    exclusions: [
      'Airfare',
      'Personal expenses, tips, beverages',
      'River rafting / ATV / camel rides',
      'Travel insurance',
      'Anything not mentioned in inclusions',
    ],
    itinerary: [
      { day: 1, title: 'Arrive Leh — Acclimatisation', description: 'Airport pickup, light walk to market, evening at Shanti Stupa.' },
      { day: 2, title: 'Leh local — Monasteries & Palace', description: 'Thiksey, Hemis, Shey, Stok Palace & Leh Palace.' },
      { day: 3, title: 'Leh → Nubra via Khardung La', description: 'Cross 5,359m pass, reach Diskit, evening camel ride at Hunder.' },
      { day: 4, title: 'Nubra → Pangong via Shyok', description: 'Scenic Shyok route, arrive Pangong, lakeside camp overnight.' },
      { day: 5, title: 'Pangong → Leh via Chang La', description: 'Sunrise at lake, cross 5,360m Chang La, return to Leh.' },
      { day: 6, title: 'Leh → Sham Valley', description: 'Sangam confluence, Magnetic Hill, Pathar Sahib, Alchi monastery.' },
      { day: 7, title: 'Leh — Departure', description: 'Morning shopping, airport drop.' },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1600&q=80',
    rating: 4.9,
    featured: true,
  },
  {
    slug: 'great-lakes-trek-8d',
    title: 'Kashmir Great Lakes Trek — 8 Days',
    region: 'Kashmir',
    duration: 8,
    nights: 7,
    price: 24500,
    description:
      'Widely considered the most beautiful trek in the Indian Himalaya — seven alpine lakes across five mountain passes, meadows that roll on for kilometres, and wildflower blooms that have to be seen to be believed. Full camping crew, meals, and permits included.',
    highlights: [
      'Seven alpine lakes in 6 days of walking',
      'Gangabal & Nundkol twin lakes',
      'Five mountain passes above 4,000m',
      'Wildflower meadows of Satsar',
      'Sunrise on Mount Harmukh',
    ],
    inclusions: [
      '7 nights camping (twin-share)',
      'All meals (B/L/D) on trek',
      'Professional trek leader & crew',
      'All camping & kitchen equipment',
      'Forest department permits',
      'Mules for luggage carriage',
    ],
    exclusions: [
      'Srinagar hotel stay (before/after trek)',
      'Personal trekking gear',
      'Beverages & snacks',
      'Travel insurance',
      'Anything not mentioned in inclusions',
    ],
    itinerary: [
      { day: 1, title: 'Srinagar → Sonmarg → Nichnai', description: 'Drive to Sonmarg, trek to Nichnai camp (3,500m, 4 hrs).' },
      { day: 2, title: 'Nichnai → Vishansar Lake', description: 'Cross Nichnai Pass (4,100m), descend to Vishansar camp.' },
      { day: 3, title: 'Vishansar → Krishansar → Gadsar', description: 'Cross Krishansar Pass (4,150m), descend to Gadsar.' },
      { day: 4, title: 'Gadsar → Satsar Lakes', description: 'Cross Gadsar Pass (4,200m), camp at Satsar (7 lakes).' },
      { day: 5, title: 'Satsar → Gangabal Twin Lakes', description: 'Cross Zaj Pass, descend to Gangabal & Nundkol.' },
      { day: 6, title: 'Gangabal — Rest day', description: 'Rest, fish, photograph Mount Harmukh sunrise/sunset.' },
      { day: 7, title: 'Gangabal → Naranag → Srinagar', description: 'Steep descent to Naranag, drive to Srinagar.' },
      { day: 8, title: 'Srinagar — Departure', description: 'Houseboat checkout, airport drop.' },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1626621341577-58edc5d25d4a?auto=format&fit=crop&w=1600&q=80',
    rating: 4.9,
    featured: true,
  },
  {
    slug: 'vaishno-devi-patnitop-4d',
    title: 'Vaishno Devi & Patnitop — 4 Days',
    region: 'Jammu',
    duration: 4,
    nights: 3,
    price: 12900,
    description:
      'A short spiritual-and-scenic break covering the Vaishno Devi yatra from Katra and a day in the pine meadows of Patnitop. Ideal for families and senior travellers.',
    highlights: [
      'Vaishno Devi holy cave darshan',
      'Pine meadows of Patnitop',
      'Nathatop paragliding viewpoint',
      'Sudh Mahadev temple',
    ],
    inclusions: [
      '3 nights hotel stay (Katra & Patnitop)',
      'Daily breakfast & dinner',
      'Private cab for transfers & sightseeing',
      'Yatra registration assistance',
    ],
    exclusions: [
      'Helicopter / pony charges for yatra',
      'Lunches & beverages',
      'Personal expenses & tips',
      'Anything not mentioned in inclusions',
    ],
    itinerary: [
      { day: 1, title: 'Arrive Katra — Begin Yatra', description: 'Railway/airport pickup, evening start of 13km yatra.' },
      { day: 2, title: 'Darshan & Return to Katra', description: 'Morning darshan, return to hotel, rest.' },
      { day: 3, title: 'Katra → Patnitop (80km)', description: 'Drive via Sudh Mahadev, evening at Nathatop.' },
      { day: 4, title: 'Patnitop → Jammu Drop', description: 'Morning in pine forest, drive to Jammu for departure.' },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1600&q=80',
    rating: 4.6,
    featured: false,
  },
  {
    slug: 'spiti-circuit-9d',
    title: 'Spiti Circuit — 9 Days / 8 Nights',
    region: 'Himachal',
    duration: 9,
    nights: 8,
    price: 38500,
    description:
      'The complete Spiti Valley loop from Manali — Chandratal Lake, Ki & Tabo monasteries, the highest villages in the world, and a night in a homestay at 4,300m. Off-the-grid, soul-shifting Himalayan travel.',
    highlights: [
      'Chandratal Lake under moonlight',
      'Ki & Tabo monasteries (1,000 years old)',
      'Hikkim — highest post office in the world',
      'Pin Valley & Kibber village',
      'Homestay at Komik (4,300m)',
    ],
    inclusions: [
      '8 nights stay (hotel + homestay + camp)',
      'All meals (B/L/D)',
      'Private 4×4 SUV with driver',
      'Permits & monastery fees',
      'Camping equipment at Chandratal',
    ],
    exclusions: [
      'Airfare / Volvo to Manali',
      'Personal expenses, tips, beverages',
      'Travel insurance',
      'Anything not mentioned in inclusions',
    ],
    itinerary: [
      { day: 1, title: 'Manali → Chandratal', description: 'Cross Rohtang Pass, drive to Chandratal, lake-side camp.' },
      { day: 2, title: 'Chandratal → Kaza', description: 'Cross Kunzum La, reach Kaza (Spiti HQ).' },
      { day: 3, title: 'Kaza → Kee → Kibber → Kaza', description: 'Ki Monastery, Kibber village, Gette & Tashigang.' },
      { day: 4, title: 'Kaza → Langza → Hikkim → Komik', description: 'Fossils at Langza, post at Hikkim, homestay at Komik.' },
      { day: 5, title: 'Komik → Tabo', description: 'Drive to Tabo, 1,000-year-old monastery, cave meditation.' },
      { day: 6, title: 'Tabo → Dhankar → Pin Valley', description: 'Dhankar monastery & lake, drive into Pin Valley.' },
      { day: 7, title: 'Pin Valley → Nako', description: 'Drive to Nako, lake & village walk.' },
      { day: 8, title: 'Nako → Kalpa', description: 'Exit Spiti via Kinnaur, reach Kalpa (Sutlej valley).' },
      { day: 9, title: 'Kalpa → Shimla — Drop', description: 'Drive through Kinnaur, drop at Shimla.' },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1593181629936-11c669d8d3f8?auto=format&fit=crop&w=1600&q=80',
    rating: 4.8,
    featured: false,
  },
  {
    slug: 'amarnath-yatra-3d',
    title: 'Amarnath Yatra (Baltal Route) — 3 Days',
    region: 'Kashmir',
    duration: 3,
    nights: 2,
    price: 15500,
    description:
      'A short, intensive yatra to the holy Amarnath cave via the shorter Baltal route, with optional helicopter from Neelgrath. Includes registration assistance, accommodation at Baltal base camp, and a dedicated driver from Srinagar.',
    highlights: [
      'Darshan at Amarnath holy cave',
      'Helicopter option from Neelgrath',
      'Baltal base camp stay',
      'Srinagar airport pickup & drop',
    ],
    inclusions: [
      '2 nights stay (1 Srinagar + 1 Baltal camp)',
      'Srinagar airport transfers',
      'Private cab to/from Baltal',
      'Yatra registration assistance',
      'All meals at base camp',
    ],
    exclusions: [
      'Helicopter ticket (optional, INR 3,500–5,000)',
      'Pony / palki charges',
      'Personal expenses & tips',
      'Travel insurance',
      'Anything not mentioned in inclusions',
    ],
    itinerary: [
      { day: 1, title: 'Srinagar → Baltal', description: 'Pickup from Srinagar, drive via Sonmarg to Baltal base camp.' },
      { day: 2, title: 'Baltal → Holy Cave → Baltal', description: 'Trek/pony/helicopter to cave (14km), darshan, return to Baltal.' },
      { day: 3, title: 'Baltal → Srinagar', description: 'Return to Srinagar, airport/railway drop.' },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1600&q=80',
    rating: 4.7,
    featured: false,
  },
]

// Hotel tiers, meal options, add-ons for Trip Planner
export const hotelTiers = [
  { id: 'budget', name: 'Budget', desc: '2★ guest house, basic but clean', perNight: 1500 },
  { id: 'standard', name: 'Standard', desc: '3★ hotel, breakfast included', perNight: 2800 },
  { id: 'premium', name: 'Premium', desc: '4★ hotel, premium location', perNight: 5500 },
  { id: 'luxury', name: 'Luxury', desc: '5★ heritage / houseboat', perNight: 11000 },
]

export const mealOptions = [
  { id: 'breakfast', name: 'Breakfast', perPersonPerDay: 350 },
  { id: 'lunch', name: 'Lunch', perPersonPerDay: 500 },
  { id: 'dinner', name: 'Dinner', perPersonPerDay: 650 },
  { id: 'wazwan', name: 'Wazwan Feast (one evening)', perPerson: 1500 },
]

export const addOns = [
  { id: 'photographer', name: 'Professional Photographer', perDay: 4500, icon: 'Camera' },
  { id: 'guide', name: 'Local Guide', perDay: 2500, icon: 'MapPin' },
  { id: 'cab-suv', name: 'Private SUV + Driver', perDay: 3800, icon: 'Car' },
  { id: 'cab-tempo', name: 'Tempo Traveller (10 seats)', perDay: 6500, icon: 'Bus' },
  { id: 'medical', name: 'Medical Kit + Oxygen', perTrip: 1500, icon: 'HeartPulse' },
  { id: 'equipment', name: 'Trek Equipment Set', perPerson: 1800, icon: 'Mountain' },
]

export const leadStages = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost',
] as const

export const bookingStages = [
  'Pending',
  'Confirmed',
  'InProgress',
  'Completed',
  'Cancelled',
] as const

export const paymentStages = ['Unpaid', 'Partial', 'Paid'] as const

// Lead sources for CRM
export const leadSources = ['Website', 'WhatsApp', 'Referral', 'Social', 'Walk-in', 'Phone']

// Helper: get destination by slug
export function getDestinationBySlug(slug: string): DestinationData | undefined {
  return destinations.find((d) => d.slug === slug)
}

// Helper: get package by slug
export function getPackageBySlug(slug: string): PackageData | undefined {
  return packages.find((p) => p.slug === slug)
}

// Mock weather generator — deterministic per destination & day
export function generateMockWeather(lat: number, lon: number, elevation: number) {
  // Use elevation & coords as a deterministic seed
  const seed = Math.floor(Math.abs(lat * 100 + lon * 10 + elevation / 10))
  const today = new Date()
  const days = []
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Snow', 'Clear']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  for (let i = 0; i < 5; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const dateSeed = seed + i * 7
    const baseTemp = elevation > 3500 ? -2 : elevation > 2500 ? 8 : 15
    const variance = (dateSeed % 9) - 4
    const maxTemp = baseTemp + variance + 4
    const minTemp = baseTemp + variance - 5
    const cond = conditions[(dateSeed + i) % conditions.length]
    const humidity = 30 + (dateSeed % 50)
    const wind = 5 + (dateSeed % 20)
    days.push({
      date: d.toISOString().slice(0, 10),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      maxTemp,
      minTemp,
      condition: cond,
      humidity,
      wind,
    })
  }
  // Current weather = first day
  const current = {
    temp: days[0].maxTemp - 2,
    condition: days[0].condition,
    humidity: days[0].humidity,
    wind: days[0].wind,
    feelsLike: days[0].maxTemp - 4,
    visibility: 8 + (seed % 4),
    uvIndex: (seed % 8) + 2,
  }
  return { current, forecast: days, elevation, coords: { lat, lon } }
}
