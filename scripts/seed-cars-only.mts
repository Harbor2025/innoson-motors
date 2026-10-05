import 'dotenv/config'

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { plainTextToLexical } from '../src/lib/lexical'
import { randomUUID } from 'crypto'

type Payload = Awaited<ReturnType<typeof getPayload>>
type Id = number | string

const rich = (text: string) => plainTextToLexical(text) as never

const slugify = (s: string): string =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const DESIGN_BODY = `Improved Exhaust Tech – IVM improved exhaust helps to create that energetic performance needed to drive through long distance while maintaining optimal stability. It also helps to conserve your fuel efficiently, cools the temperature of the engine and allows the engine to breathe better.

Adjustable passenger seats – IVM gives you the finesse and peace you need while driving. There is a great need for your muscles to be well relaxed while driving; there is no room for discomfort while cruising with IVM.

Air Conditioned leather seats – each drive is a memorable experience. The air conditioned leather seats create a lush feel and extreme relaxation while driving.

Standard LED front lights – we used the latest technology in automotive lighting technology. No need to be frustrated with dull lights while driving. Power through the dark, your vision and balance are secured.

Enhanced multimedia experience – play your favorite sounds with the inbuilt modern multimedia system. You can connect your multimedia devices while driving.

Automatic folding side mirrors – you can park comfortably without bothering about accidental smashing of your side mirrors.

Front and rear airbags – the front and rear airbags are there to prevent fatal injuries if there is an unexpected crash.`

type SpecGroup = 'performance' | 'general' | 'dimensions'

type NewCar = {
  name: string
  categorySlug: string
  tagline: string
  summary: string
  description: string
  technology: string
  specs: { label: string; value: string; group: SpecGroup; order: number }[]
  highlights: { title: string; description: string; order: number }[]
  colors: { name: string; hexCode: string; order: number }[]
  basePrice: number
  featured?: boolean
  order: number
}

const NEW_CARS: NewCar[] = [
  {
    name: 'INNOSON Fox',
    categorySlug: 'cars',
    tagline: 'City-ready, efficient, and bold.',
    summary: '1.6L / Automatic / 5 Seats',
    description:
      'The IVM Fox is a compact, nimble sedan built for urban commuting — easy to park, light on fuel, and packed with standard features that make every trip feel premium.',
    technology:
      'Touchscreen infotainment with CarPlay, rear parking sensors, automatic climate control, keyless entry, and ABS with EBD.',
    specs: [
      { label: 'Engine Capacity', value: '1.6L 4-Cylinder Petrol', group: 'performance', order: 1 },
      { label: 'Transmission', value: '4-Speed Automatic', group: 'performance', order: 2 },
      { label: 'Drive Type', value: 'FWD', group: 'performance', order: 3 },
      { label: 'Seating', value: '5 seats', group: 'general', order: 4 },
      { label: 'Fuel Tank', value: '50L', group: 'general', order: 5 },
      { label: 'Length', value: '4,460 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,720 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '1,460 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '2,600 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: 'Urban-friendly footprint', description: 'Compact dimensions make city parking and tight maneuvers effortless.', order: 1 },
      { title: 'Efficient 1.6L powerplant', description: 'Tuned for fuel economy without sacrificing highway cruising torque.', order: 2 },
      { title: 'Dual front airbags + ABS', description: 'Standard safety across the entire Fox range.', order: 3 },
      { title: 'Smart infotainment', description: 'Apple CarPlay and Android Auto at every trim level.', order: 4 },
    ],
    colors: [
      { name: 'Midnight Black', hexCode: '#111111', order: 1 },
      { name: 'Pearl White', hexCode: '#f8f8f8', order: 2 },
      { name: 'Sunset Orange', hexCode: '#d9540e', order: 3 },
    ],
    basePrice: 7500000,
    order: 1,
  },
  {
    name: 'INNOSON Iris',
    categorySlug: 'cars',
    tagline: 'Executive comfort, Nigerian engineering.',
    summary: '2.0L / Automatic / 5 Seats',
    description:
      'The IVM Iris is our executive mid-size sedan, designed for comfort on interstate runs and calm presence in the corporate driveway.',
    technology:
      'Nappa leather interior, dual-zone climate control, 12-inch digital cluster, adaptive cruise control, and a premium 8-speaker audio system.',
    specs: [
      { label: 'Engine Capacity', value: '2.0L 4-Cylinder Petrol Turbo', group: 'performance', order: 1 },
      { label: 'Transmission', value: '6-Speed Automatic', group: 'performance', order: 2 },
      { label: 'Drive Type', value: 'FWD', group: 'performance', order: 3 },
      { label: 'Seating', value: '5 seats', group: 'general', order: 4 },
      { label: 'Fuel Tank', value: '60L', group: 'general', order: 5 },
      { label: 'Length', value: '4,860 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,835 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '1,475 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '2,810 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: 'Executive leather interior', description: 'Nappa leather with contrast stitching and soft-touch dashboard surfaces.', order: 1 },
      { title: 'Adaptive cruise control', description: 'Highway assistant maintains safe following distance automatically.', order: 2 },
      { title: 'Digital cockpit', description: '12-inch cluster + 10-inch central touchscreen with full phone integration.', order: 3 },
      { title: 'Quiet cabin', description: 'Triple-door seals and acoustic glass reduce road noise to limousine levels.', order: 4 },
    ],
    colors: [
      { name: 'Royal Blue', hexCode: '#002f6c', order: 1 },
      { name: 'Titanium Silver', hexCode: '#8d9093', order: 2 },
      { name: 'Ivory White', hexCode: '#f5f5f5', order: 3 },
    ],
    basePrice: 10500000,
    order: 2,
  },
  {
    name: 'INNOSON G5',
    categorySlug: 'mpv',
    tagline: 'Built for Nigerian families.',
    summary: '2.0L / Automatic / 7 Seats',
    description:
      'The IVM G5 is a 7-seater mid-size MPV designed for family journeys, school runs, and ride-hailing fleets. Every row gets air vents, cup holders, and USB charging.',
    technology:
      'Three-zone climate control, 360° parking camera, sliding rear doors, roof-mounted rear entertainment, and ISOFIX child-seat anchors in the second row.',
    specs: [
      { label: 'Engine Capacity', value: '2.0L 4-Cylinder Petrol', group: 'performance', order: 1 },
      { label: 'Transmission', value: 'CVT Automatic', group: 'performance', order: 2 },
      { label: 'Drive Type', value: 'FWD', group: 'performance', order: 3 },
      { label: 'Seating', value: '7 seats', group: 'general', order: 4 },
      { label: 'Fuel Tank', value: '65L', group: 'general', order: 5 },
      { label: 'Length', value: '4,780 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,820 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '1,780 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '2,840 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: '7 captain-style seats', description: 'Fold-flat second and third rows give flexible cargo-passenger combinations.', order: 1 },
      { title: 'Sliding rear doors', description: 'Wide-opening sliding doors make entry easy even in tight car parks.', order: 2 },
      { title: '360° camera system', description: 'Birds-eye view for tight parking and maneuvering the family MPV.', order: 3 },
      { title: 'ISOFIX + curtain bags', description: 'Full 3-row safety with curtain airbags and standard child-seat anchors.', order: 4 },
    ],
    colors: [
      { name: 'Granite Grey', hexCode: '#4a4a4a', order: 1 },
      { name: 'Pearl White', hexCode: '#f8f8f8', order: 2 },
      { name: 'Deep Ocean Blue', hexCode: '#005eb8', order: 3 },
    ],
    basePrice: 9800000,
    order: 1,
  },
  {
    name: 'INNOSON G6',
    categorySlug: 'mpv',
    tagline: 'First-class on the road.',
    summary: '2.4L / Automatic / 7 Seats — Premium',
    description:
      'Our premium MPV: the G6 pairs executive seating with long-distance comfort. Often used by corporate fleets, government convoys, and hospitality shuttle services.',
    technology:
      'Reclining captain chairs with leg rests, rear cabin console with refrigerator option, panoramic sunroof, wireless charging for both rows, and a 10-speaker premium sound system.',
    specs: [
      { label: 'Engine Capacity', value: '2.4L 4-Cylinder Petrol', group: 'performance', order: 1 },
      { label: 'Transmission', value: '6-Speed Automatic', group: 'performance', order: 2 },
      { label: 'Drive Type', value: 'FWD', group: 'performance', order: 3 },
      { label: 'Seating', value: '7 seats', group: 'general', order: 4 },
      { label: 'Fuel Tank', value: '70L', group: 'general', order: 5 },
      { label: 'Length', value: '5,080 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,880 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '1,820 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '2,990 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: 'Reclining second-row captains', description: 'Leg rest, massage function, and fold-away tables for the working passenger.', order: 1 },
      { title: 'Panoramic roof', description: 'Glass roof with retractable shade for a spacious, light-filled cabin.', order: 2 },
      { title: 'Rear refrigerator console', description: 'Optional chiller unit in the second-row centre console.', order: 3 },
      { title: 'Fleet telematics-ready', description: 'Wired for GPS tracking, dashcams, and fleet management integrations.', order: 4 },
    ],
    colors: [
      { name: 'Obsidian Black', hexCode: '#0a0a0a', order: 1 },
      { name: 'Pearl White', hexCode: '#f8f8f8', order: 2 },
      { name: 'Signature Red', hexCode: '#b71c1c', order: 3 },
    ],
    basePrice: 15500000,
    featured: true,
    order: 2,
  },
  {
    name: 'INNOSON Carrier',
    categorySlug: 'pickup',
    tagline: 'Workhorse. Built in Nigeria.',
    summary: '2.5L Diesel / Manual / 5 Seats',
    description:
      'The IVM Carrier single-cab pickup is built for farmers, contractors, and small-business owners who need a tough, affordable, easy-to-repair load hauler.',
    technology:
      'Heavy-duty leaf-spring rear suspension, reinforced cargo bed, underbody protection, central locking, and a tow bar with 2.5-tonne rated capacity.',
    specs: [
      { label: 'Engine Capacity', value: '2.5L 4-Cylinder Turbo Diesel', group: 'performance', order: 1 },
      { label: 'Transmission', value: '5-Speed Manual', group: 'performance', order: 2 },
      { label: 'Drive Type', value: '4x2 (RWD) — 4x4 optional', group: 'performance', order: 3 },
      { label: 'Seating', value: '5 seats', group: 'general', order: 4 },
      { label: 'Fuel Tank', value: '70L', group: 'general', order: 5 },
      { label: 'Length', value: '5,120 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,820 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '1,780 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '3,085 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: '1.2-tonne rated bed', description: 'Reinforced steel bed with internal tie-downs and optional load liner.', order: 1 },
      { title: 'Turbo diesel torque', description: '2.5L common-rail diesel tuned for low-end pulling power.', order: 2 },
      { title: 'Easy-to-service parts', description: 'Common rail and manual transmission — mechanics nationwide know the layout.', order: 3 },
      { title: 'Underbody protection', description: 'Steel sump guard and fuel-tank shield standard.', order: 4 },
    ],
    colors: [
      { name: 'Worksite White', hexCode: '#ffffff', order: 1 },
      { name: 'Construction Yellow', hexCode: '#e6a100', order: 2 },
      { name: 'Graphite Grey', hexCode: '#525252', order: 3 },
    ],
    basePrice: 8500000,
    order: 1,
  },
  {
    name: 'INNOSON Hauler',
    categorySlug: 'pickup',
    tagline: 'Double-cab for work and family.',
    summary: '2.8L Diesel / Automatic / 5 Seats',
    description:
      'The IVM Hauler double-cab combines a full five-seat cabin with a generous cargo bed. Comfortable enough for the family weekend, tough enough for the workweek.',
    technology:
      'Automatic 6-speed, shift-on-the-fly 4x4, differential lock, hill-descent control, leather interior, reverse camera, and a 2.8T braked towing rating.',
    specs: [
      { label: 'Engine Capacity', value: '2.8L 4-Cylinder Turbo Diesel', group: 'performance', order: 1 },
      { label: 'Transmission', value: '6-Speed Automatic', group: 'performance', order: 2 },
      { label: 'Drive Type', value: '4x4 (Part-time)', group: 'performance', order: 3 },
      { label: 'Seating', value: '5 seats', group: 'general', order: 4 },
      { label: 'Fuel Tank', value: '80L', group: 'general', order: 5 },
      { label: 'Length', value: '5,330 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,880 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '1,830 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '3,150 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: 'Shift-on-the-fly 4x4', description: 'Turn the dial to 4H at up to 80 km/h — no stopping required.', order: 1 },
      { title: 'Rear diff lock', description: 'Mechanical locker for muddy construction sites and rural roads.', order: 2 },
      { title: '5-seat family cabin', description: 'Rear A/C vents, armrest, and three-point belts for all passengers.', order: 3 },
      { title: 'Tow-rated 2.8T', description: 'Factory-fitted wiring and tow bar for boat or utility trailer.', order: 4 },
    ],
    colors: [
      { name: 'Cosmic Blue', hexCode: '#104e8b', order: 1 },
      { name: 'Obsidian Black', hexCode: '#0a0a0a', order: 2 },
      { name: 'Dune Beige', hexCode: '#c7b191', order: 3 },
    ],
    basePrice: 13500000,
    order: 2,
  },
  {
    name: 'INNOSON G80',
    categorySlug: 'suvs',
    tagline: 'The flagship Nigerian SUV.',
    summary: '3.0L V6 / 4x4 / 7 Seats',
    description:
      'The IVM G80 is our most premium 7-seat full-size SUV, blending commanding presence with serious 4x4 capability. A flagship vehicle for executives, government, and hospitality fleets.',
    technology:
      'Adaptive LED headlamps, air suspension option, full leather 7-seater interior, panoramic roof, 12.3-inch touchscreen with 360° camera, and advanced driver-assist package.',
    specs: [
      { label: 'Engine Capacity', value: '3.0L V6 Petrol', group: 'performance', order: 1 },
      { label: 'Transmission', value: '8-Speed Automatic', group: 'performance', order: 2 },
      { label: 'Drive Type', value: 'Permanent 4x4', group: 'performance', order: 3 },
      { label: 'Seating', value: '7 seats', group: 'general', order: 4 },
      { label: 'Fuel Tank', value: '85L', group: 'general', order: 5 },
      { label: 'Length', value: '4,995 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,960 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '1,865 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '2,900 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: 'Permanent 4x4 with terrain select', description: 'Snow, Mud, Sand, and Rock modes at the turn of a dial.', order: 1 },
      { title: '3-row Nappa leather', description: 'First, second and third rows with A/C vents and USB ports.', order: 2 },
      { title: 'Panoramic glass roof', description: 'Dual-pane sunroof with power retractable shade.', order: 3 },
      { title: 'ADAS safety suite', description: 'Autonomous braking, lane-keep assist, blind-spot monitor, and adaptive cruise.', order: 4 },
    ],
    colors: [
      { name: 'Onyx Black', hexCode: '#050505', order: 1 },
      { name: 'Aurora White', hexCode: '#fdfdfd', order: 2 },
      { name: 'Nile Green', hexCode: '#3b5b48', order: 3 },
    ],
    basePrice: 22500000,
    featured: true,
    order: 3,
  },
  {
    name: 'INNOSON G40',
    categorySlug: 'suvs',
    tagline: 'Compact SUV, big Nigerian heart.',
    summary: '1.8L / Automatic / 5 Seats',
    description:
      'The IVM G40 is a compact family SUV designed for first-time buyers who want the stance and practicality of an SUV without the full-size price tag.',
    technology:
      'LED headlamps, 9-inch touchscreen, rear-view camera, digital instrument cluster, keyless go, cruise control, and roof rails.',
    specs: [
      { label: 'Engine Capacity', value: '1.8L 4-Cylinder Petrol', group: 'performance', order: 1 },
      { label: 'Transmission', value: 'CVT Automatic', group: 'performance', order: 2 },
      { label: 'Drive Type', value: 'FWD — 4x4 optional', group: 'performance', order: 3 },
      { label: 'Seating', value: '5 seats', group: 'general', order: 4 },
      { label: 'Fuel Tank', value: '55L', group: 'general', order: 5 },
      { label: 'Length', value: '4,440 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,830 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '1,650 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '2,630 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: 'Raised driving position', description: 'Commanding SUV seating position at a compact-car footprint.', order: 1 },
      { title: 'Cargo-friendly boot', description: '500L+ boot with split-fold seats for market, luggage or school gear.', order: 2 },
      { title: 'LED lights all round', description: 'Standard LED headlights, DRLs, and rear combination lamps.', order: 3 },
      { title: 'Roof rails standard', description: 'For extra luggage, rooftop carriers, or jerry-can holders on long trips.', order: 4 },
    ],
    colors: [
      { name: 'Sahara Silver', hexCode: '#b9b9b9', order: 1 },
      { name: 'Forest Green', hexCode: '#1f4d2d', order: 2 },
      { name: 'Pearl White', hexCode: '#f8f8f8', order: 3 },
    ],
    basePrice: 8900000,
    order: 4,
  },
  {
    name: 'INNOSON City Coach',
    categorySlug: 'buses',
    tagline: 'Mass transit, made in Nigeria.',
    summary: 'Diesel / 18 Seats / Coach Bus',
    description:
      'The IVM City Coach is an 18-seat medium-duty passenger bus used for inter-state transport, corporate staff buses, and school runs. High roof, standing headroom, and wide entry/exit doors.',
    technology:
      'High-torque diesel, heavy-duty manual gearbox, air suspension, overhead A/C vents, individual reading lights, PA system, and roof escape hatch.',
    specs: [
      { label: 'Engine Capacity', value: '4.0L Inline-6 Turbo Diesel', group: 'performance', order: 1 },
      { label: 'Transmission', value: '6-Speed Manual', group: 'performance', order: 2 },
      { label: 'Drive Type', value: 'RWD', group: 'performance', order: 3 },
      { label: 'Seating', value: '18 seats', group: 'general', order: 4 },
      { label: 'Fuel Tank', value: '150L', group: 'general', order: 5 },
      { label: 'Length', value: '7,800 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '2,260 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '2,960 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '4,400 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: '18 reclining seats', description: 'High-back reclining seats with seat belts for every passenger.', order: 1 },
      { title: 'Roof A/C system', description: 'Roof-mounted air conditioning with individual vents.', order: 2 },
      { title: 'Wide entry doors', description: 'Twin-leaf side door for fast passenger loading at bus stops.', order: 3 },
      { title: 'Fleet-ready wiring', description: 'Pre-wired for GPS tracker, CCTV cameras, and speed governor.', order: 4 },
    ],
    colors: [
      { name: 'Transport White', hexCode: '#ffffff', order: 1 },
      { name: 'Sunshine Yellow', hexCode: '#f6b800', order: 2 },
      { name: 'Corporate Blue', hexCode: '#003f88', order: 3 },
    ],
    basePrice: 28000000,
    order: 1,
  },
  {
    name: 'INNOSON Hiace',
    categorySlug: 'buses',
    tagline: "Nigeria's 15-seat workhorse.",
    summary: 'Diesel / 15 Seats / Minibus',
    description:
      'The IVM 15-seat minibus is our bestselling Hiace-class people carrier: reliable, affordable, and available everywhere from Abuja to Port Harcourt for corporate staff buses, church shuttles, and schools.',
    technology:
      'Front and rear A/C, sliding side door, 3-point belts in all rows, PA system, tinted side glass, and heavy-duty rear leaf suspension.',
    specs: [
      { label: 'Engine Capacity', value: '2.8L 4-Cylinder Turbo Diesel', group: 'performance', order: 1 },
      { label: 'Transmission', value: '5-Speed Manual', group: 'performance', order: 2 },
      { label: 'Drive Type', value: 'RWD', group: 'performance', order: 3 },
      { label: 'Seating', value: '15 seats', group: 'general', order: 4 },
      { label: 'Fuel Tank', value: '80L', group: 'general', order: 5 },
      { label: 'Length', value: '5,380 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,880 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '2,285 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '3,110 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: '15 seats with seatbelts', description: 'All 15 passenger positions have 3-point belts.', order: 1 },
      { title: 'Split cargo area', description: 'Rear cargo space for luggage behind the last row.', order: 2 },
      { title: 'Easy nationwide service', description: 'Common mechanical layout — any mechanic can service it.', order: 3 },
      { title: 'Tinted windows + curtains', description: 'Privacy glass and optional fabric curtains for VIP shuttle use.', order: 4 },
    ],
    colors: [
      { name: 'Classic White', hexCode: '#ffffff', order: 1 },
      { name: 'Ash Grey', hexCode: '#707070', order: 2 },
      { name: 'Royal Maroon', hexCode: '#5c1014', order: 3 },
    ],
    basePrice: 18500000,
    order: 2,
  },
  {
    name: 'INNOSON EVM-K1',
    categorySlug: 'electric',
    tagline: 'Nigeria-made electric hatchback.',
    summary: 'EV / 50 kWh / 5 Seats',
    description:
      'The IVM EVM-K1 is the first mass-market all-electric car assembled in Nigeria. The K1 pairs a 50 kWh battery with AC and DC fast-charging support for urban commuters and ride-hailing fleets.',
    technology:
      '50 kWh liquid-cooled battery, 6.6 kW on-board charger, CCS DC fast charging, regenerative braking, 10-inch digital cockpit, and a 7-year battery warranty option.',
    specs: [
      { label: 'Battery Capacity', value: '50 kWh Lithium-ion', group: 'performance', order: 1 },
      { label: 'Motor Output', value: '105 kW (141 HP)', group: 'performance', order: 2 },
      { label: 'Range (WLTP)', value: '320 km', group: 'performance', order: 3 },
      { label: 'Seating', value: '5 seats', group: 'general', order: 4 },
      { label: 'Charge (AC 6.6 kW)', value: '~8 hours 0-100%', group: 'general', order: 5 },
      { label: 'Length', value: '4,280 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,780 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '1,525 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '2,650 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: '320 km range', description: 'Real-world range for Lagos–Ibadan or Abuja–Minna daily runs.', order: 1 },
      { title: 'CCS DC fast charge', description: 'Supports public DC chargers — 30 minutes to 80%.', order: 2 },
      { title: 'Low running cost', description: 'Fraction of the per-km cost of a petrol equivalent.', order: 3 },
      { title: 'Fleet telematics', description: 'Pre-wired for battery monitoring, charging reports, and GPS.', order: 4 },
    ],
    colors: [
      { name: 'Electric Blue', hexCode: '#1e6fff', order: 1 },
      { name: 'Solar White', hexCode: '#f4f8ff', order: 2 },
      { name: 'Graphite Grey', hexCode: '#4a4a4a', order: 3 },
    ],
    basePrice: 14500000,
    featured: true,
    order: 1,
  },
  {
    name: 'INNOSON EVM-SUV',
    categorySlug: 'electric',
    tagline: 'Electric family SUV, proudly Nigerian.',
    summary: 'EV / 75 kWh / 7 Seats',
    description:
      'The 7-seat IVM EVM-SUV is our premium electric SUV offering 75 kWh battery, dual motors, and all-wheel drive. Designed for executives and government fleets ready to transition to EV.',
    technology:
      '75 kWh pack, dual-motor AWD, 11 kW 3-phase AC charge, CCS2 DC fast charge, heat pump climate control, 12.3-inch dual screens, vegan leather interior.',
    specs: [
      { label: 'Battery Capacity', value: '75 kWh Lithium-ion', group: 'performance', order: 1 },
      { label: 'Motor Output', value: 'Dual 150+80 kW (308 HP total)', group: 'performance', order: 2 },
      { label: 'Range (WLTP)', value: '440 km', group: 'performance', order: 3 },
      { label: 'Seating', value: '7 seats', group: 'general', order: 4 },
      { label: 'Charge (DC 120 kW)', value: '32 minutes 10-80%', group: 'general', order: 5 },
      { label: 'Length', value: '4,860 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,920 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '1,745 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '2,930 mm', group: 'dimensions', order: 9 },
    ],
    highlights: [
      { title: 'Dual-motor AWD', description: 'Front + rear motors deliver all-weather grip and quick acceleration.', order: 1 },
      { title: '7-seat layout', description: 'Three rows with flat-folding option for cargo.', order: 2 },
      { title: 'Heat pump HVAC', description: 'Increases real-world range in hot Nigerian climates.', order: 3 },
      { title: 'Vegan leather interior', description: 'Sustainable, water-resistant trim suitable for Nigerian use.', order: 4 },
    ],
    colors: [
      { name: 'Emerald Black', hexCode: '#0e0e0e', order: 1 },
      { name: 'Celestial White', hexCode: '#fafcff', order: 2 },
      { name: 'Copper Bronze', hexCode: '#b87333', order: 3 },
    ],
    basePrice: 26000000,
    order: 2,
  },
]

async function getCategoryMap(payload: Payload): Promise<Map<string, Id>> {
  const res = await payload.find({
    collection: 'categories' as never,
    where: {},
    limit: 100,
    depth: 0,
  })
  const map = new Map<string, Id>()
  for (const d of res.docs as unknown as { id: Id; slug: string }[]) {
    map.set(d.slug, d.id)
  }
  return map
}

async function ensureSharedHeroImage(payload: Payload): Promise<Id | undefined> {
  const sharedAlt = 'IVM Shared Hero Vehicle'
  const existing = await payload.find({
    collection: 'media' as never,
    where: { alt: { equals: sharedAlt } } as never,
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    return (existing.docs[0] as unknown as { id: Id }).id
  }
  try {
    const prompt = encodeURIComponent(
      'Professional studio photograph of a modern white Nigerian-made SUV sedan, three-quarter front angle, clean neutral studio background, high-end automotive photography, soft lighting, reflections on body panels, photorealistic, no text, high quality',
    )
    const imageSize = 'landscape_16_9'
    const url = `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${prompt}&image_size=${imageSize}`
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`Image fetch ${resp.status}`)
    const arrayBuffer = await resp.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const result = (await payload.create({
      collection: 'media' as never,
      data: { alt: sharedAlt } as never,
      file: {
        name: `ivm-shared-hero-${randomUUID()}.jpg`,
        data: buffer,
        mimetype: 'image/jpeg',
        size: buffer.length,
      },
    })) as unknown as { id: Id }
    return result.id
  } catch (e) {
    console.warn(
      '[seed-cars] Warning: could not upload shared hero image, leaving heroImage blank —',
      (e as Error).message,
    )
    return undefined
  }
}

async function upsertModel(
  payload: Payload,
  car: NewCar,
  categoryId: Id,
  heroImageId: Id | undefined,
) {
  const slug = slugify(car.name.replace(/^INNOSON\s+/i, ''))
  const existing = await payload.find({
    collection: 'models' as never,
    where: { slug: { equals: slug } } as never,
    limit: 1,
    depth: 0,
  })
  const data = {
    name: car.name,
    slug,
    category: categoryId,
    tagline: car.tagline,
    summary: car.summary,
    description: rich(car.description),
    design: rich(DESIGN_BODY),
    technology: rich(car.technology),
    specs: car.specs,
    gallery: [] as never[],
    highlights: car.highlights.map((h) => ({ ...h, icon: undefined })),
    colorOptions: car.colors.map((c) => ({ ...c, image: undefined })),
    heroImage: heroImageId,
    brochure: undefined,
    currency: 'NGN' as const,
    basePrice: car.basePrice,
    featured: !!car.featured,
    order: car.order,
    _status: 'published' as const,
  }
  if (existing.docs.length > 0) {
    const id = (existing.docs[0] as unknown as { id: Id }).id
    await payload.update({
      collection: 'models' as never,
      id,
      data: data as never,
    })
    console.log(`[seed-cars] Updated model: ${car.name} (${slug})`)
  } else {
    await payload.create({
      collection: 'models' as never,
      data: data as never,
    })
    console.log(`[seed-cars] Created model: ${car.name} (${slug})`)
  }
}

async function run() {
  const payload = await getPayload({ config })

  console.log('[seed-cars] Looking up categories…')
  const categories = await getCategoryMap(payload)
  for (const c of NEW_CARS) {
    if (!categories.has(c.categorySlug)) {
      console.error(
        `[seed-cars] FATAL: Category slug "${c.categorySlug}" not found for ${c.name}. Run the main seed first.`,
      )
      process.exit(1)
    }
  }

  console.log('[seed-cars] Ensuring shared hero image (all cars use the same one)…')
  const heroImageId = await ensureSharedHeroImage(payload)
  if (heroImageId) {
    console.log(`[seed-cars] Shared hero image media id = ${heroImageId}`)
  }

  console.log(`[seed-cars] Upserting ${NEW_CARS.length} vehicle models…`)
  for (const car of NEW_CARS) {
    await upsertModel(payload, car, categories.get(car.categorySlug)!, heroImageId)
  }

  console.log('[seed-cars] Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error('[seed-cars] FATAL:', err)
  process.exit(1)
})
