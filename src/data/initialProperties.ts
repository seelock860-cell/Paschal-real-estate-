import { Property } from '../types/property';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'pr-001',
    title: 'The Obsidian Grand Lagoon Waterfront Villa',
    slug: 'the-obsidian-grand-lagoon-waterfront-villa',
    refCode: 'PR-BI-01',
    category: 'Waterfront Villa',
    city: 'Lagos',
    location: 'Zone A, Banana Island, Ikoyi, Lagos',
    neighborhood: 'Banana Island',
    priceNaira: 85000000,
    pricePeriod: 'per year',
    serviceChargeNaira: 6500000,
    cautionDepositPercentage: 10,
    bedrooms: 6,
    bathrooms: 7,
    toilets: 8,
    parkingSpaces: 6,
    areaSqm: 820,
    furnishing: 'Fully Furnished',
    availability: 'Available',
    featured: true,
    images: [
      '/src/assets/images/property_banana_island_villa_1793625217146.jpg',
      '/src/assets/images/hero_luxury_lagos_mansion_1793625216314.jpg',
      '/src/assets/images/property_maitama_penthouse_1793625217385.jpg'
    ],
    description: 'An architectural masterwork situated in the ultra-exclusive enclave of Banana Island. This waterfront residence features a private deep-water jetty on the Lagos lagoon, a heated rim-flow infinity pool, floor-to-ceiling soundproof thermal glass, bespoke Italian kitchen cabinetry, and dedicated quarters for domestic staff. Fully equipped with an industrial-grade synchronized generator system and 24/7 dedicated security protocol.',
    amenities: [
      'Private Boat Dock & Lagoon Access',
      'Infinity Heated Swimming Pool',
      '24/7 Guaranteed Power (Dual 150kVA Perkins Gen)',
      'Smart Home Control4 Automation',
      'Private 4-Stop Otis Elevator',
      'Chef Gourmet Kitchen with Sub-Zero Appliances',
      'Cinema Room (Dolby Atmos 9.2)',
      'Boys Quarters (3 Rooms Ensuite)',
      'Armed Patrol & Biometric Perimeter'
    ],
    yearBuilt: 2024,
    securityFeatures: [
      'Banana Island Controlled Access Gates',
      'Perimeter Electric Fencing & CCTV',
      'Bullet-resistant Master Suite Portal'
    ],
    createdAt: '2025-01-15T09:00:00.000Z',
    updatedAt: '2025-02-10T14:30:00.000Z'
  },
  {
    id: 'pr-002',
    title: 'The Sovereign High-Floor Sky Penthouse',
    slug: 'the-sovereign-high-floor-sky-penthouse',
    refCode: 'PR-ABJ-02',
    category: 'Luxury Penthouse',
    city: 'Abuja',
    location: 'Gana Street Corridor, Maitama, Abuja',
    neighborhood: 'Maitama',
    priceNaira: 55000000,
    pricePeriod: 'per year',
    serviceChargeNaira: 5000000,
    cautionDepositPercentage: 10,
    bedrooms: 4,
    bathrooms: 5,
    toilets: 6,
    parkingSpaces: 4,
    areaSqm: 640,
    furnishing: 'Fully Furnished',
    availability: 'Available',
    featured: true,
    images: [
      '/src/assets/images/property_maitama_penthouse_1793625217385.jpg',
      '/src/assets/images/property_eko_atlantic_apartment_1793625232512.jpg',
      '/src/assets/images/property_ikoyi_terrace_1793625232588.jpg'
    ],
    description: 'Perched high above Maitama, this duplex penthouse commands panoramic views across Aso Rock and the Abuja diplomatic quarter. Designed with soaring double-height ceilings, imported book-matched Calacatta marble, ambient mood lighting, a private rooftop deck, and direct express elevator access into your private vestibule.',
    amenities: [
      'Direct Keycard Private Elevator',
      'Panoramic Aso Rock & City Views',
      '24/7 Dedicated Power Grid & Gen Backup',
      'Marble Wet Bar & Wine Cellar',
      'Master Spa Suite with Jacuzzi & Steam Shower',
      'High-Speed Dedicated Fibre Internet',
      'Concierge & Porter Services',
      '2 Ensuite Staff Rooms (BQ)'
    ],
    yearBuilt: 2024,
    securityFeatures: [
      'Diplomatic Security Zone Standards',
      '24/7 Uniformed Guards & CCTV Surveillance',
      'Biometric Elevator & Entrance Locks'
    ],
    createdAt: '2025-01-20T11:00:00.000Z',
    updatedAt: '2025-02-12T16:00:00.000Z'
  },
  {
    id: 'pr-003',
    title: 'The Solstice Contemporary Smart Duplex',
    slug: 'the-solstice-contemporary-smart-duplex',
    refCode: 'PR-LEK-03',
    category: 'Detached Duplex',
    city: 'Lagos',
    location: 'Off Admiralty Way, Lekki Phase 1, Lagos',
    neighborhood: 'Lekki Phase 1',
    priceNaira: 28000000,
    pricePeriod: 'per year',
    serviceChargeNaira: 2500000,
    cautionDepositPercentage: 10,
    bedrooms: 5,
    bathrooms: 5,
    toilets: 6,
    parkingSpaces: 5,
    areaSqm: 520,
    furnishing: 'Semi Furnished',
    availability: 'Available',
    featured: true,
    images: [
      '/src/assets/images/property_lekki_duplex_1793625218313.jpg',
      '/src/assets/images/hero_luxury_lagos_mansion_1793625216314.jpg',
      '/src/assets/images/property_ikoyi_terrace_1793625232588.jpg'
    ],
    description: 'A striking 5-bedroom contemporary detached duplex located in a gated, serene cul-de-sac just off Admiralty Way. Includes private swimming pool with sundeck, expansive floor-to-ceiling glass sliding doors, rooftop entertainment lounge, fitted contemporary kitchen with Bosch appliances, and comprehensive perimeter security.',
    amenities: [
      'Private Swimming Pool with Sun Deck',
      '24/7 Power Supply & Solar Inverter Integration',
      'Rooftop Terrace & Bar Lounge',
      'Fitted Chef Kitchen & Smoke Extractor',
      'Automated Access Gates',
      'Covered Carport for 5 Vehicles',
      'Ensuite Domestic Staff Quarters (BQ)'
    ],
    yearBuilt: 2023,
    securityFeatures: [
      'Gated Resident Community Security',
      'Armed Response Network',
      'CCTV Monitoring & Video Intercom'
    ],
    createdAt: '2025-02-01T10:00:00.000Z',
    updatedAt: '2025-02-15T12:00:00.000Z'
  },
  {
    id: 'pr-004',
    title: 'Azure Horizon Atlantic Oceanfront Residence',
    slug: 'azure-horizon-atlantic-oceanfront-residence',
    refCode: 'PR-EKO-04',
    category: 'Serviced Apartment',
    city: 'Lagos',
    location: 'Coastal Road, Eko Atlantic City, Lagos',
    neighborhood: 'Eko Atlantic City',
    priceNaira: 42000000,
    pricePeriod: 'per year',
    serviceChargeNaira: 4500000,
    cautionDepositPercentage: 10,
    bedrooms: 3,
    bathrooms: 3,
    toilets: 4,
    parkingSpaces: 2,
    areaSqm: 310,
    furnishing: 'Fully Furnished',
    availability: 'Available',
    featured: false,
    images: [
      '/src/assets/images/property_eko_atlantic_apartment_1793625232512.jpg',
      '/src/assets/images/property_maitama_penthouse_1793625217385.jpg',
      '/src/assets/images/property_banana_island_villa_1793625217146.jpg'
    ],
    description: 'Experience international coastal living in Eko Atlantic City. Uninterrupted Atlantic ocean views, floor-to-ceiling insulated glass facades, world-class independent municipal infrastructure with 100% uninterrupted power, Olympic-sized communal swimming pool, residents lounge, and state-of-the-art gym.',
    amenities: [
      'Uninterrupted Atlantic Ocean Vistas',
      'Independent Eko Atlantic 24/7 Power Grid',
      'Communal Infinity Pool & Squash Court',
      'Fully Equipped Fitness Centre',
      'High-Speed Passenger & Service Elevators',
      'Dedicated 24/7 Concierge Desk',
      'Central Chilled Water Air-Conditioning'
    ],
    yearBuilt: 2024,
    securityFeatures: [
      'Eko Atlantic City Gated Perimeter',
      'Internal Keycard Access Control',
      'Fire Suppression & 24/7 Control Room'
    ],
    createdAt: '2025-02-05T08:30:00.000Z',
    updatedAt: '2025-02-14T10:15:00.000Z'
  },
  {
    id: 'pr-005',
    title: 'The Royal Courtyard Luxury Terrace Residence',
    slug: 'the-royal-courtyard-luxury-terrace-residence',
    refCode: 'PR-IKY-05',
    category: 'Executive Terrace',
    city: 'Lagos',
    location: 'Bourdon Road, Old Ikoyi, Lagos',
    neighborhood: 'Old Ikoyi',
    priceNaira: 35000000,
    pricePeriod: 'per year',
    serviceChargeNaira: 3800000,
    cautionDepositPercentage: 10,
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    parkingSpaces: 3,
    areaSqm: 410,
    furnishing: 'Fully Furnished',
    availability: 'Under Offer',
    featured: false,
    images: [
      '/src/assets/images/property_ikoyi_terrace_1793625232588.jpg',
      '/src/assets/images/hero_luxury_lagos_mansion_1793625216314.jpg',
      '/src/assets/images/property_lekki_duplex_1793625218313.jpg'
    ],
    description: 'An elegant 4-bedroom terrace with a private plunge pool and landscaped courtyard in leafy Old Ikoyi. Boasts custom timber accents, imported sanitary ware, a fully integrated Italian kitchen, and a private generator backup alongside dedicated estate facility management.',
    amenities: [
      'Private Heated Plunge Pool & Teak Deck',
      'Full Estate 24/7 Unbroken Power & Gens',
      'Italian Fitted Kitchen & Pantry',
      'Spacious Master Suite with Walk-in Wardrobe',
      'Dedicated Estate Facility Management',
      'Ensuite Maid Room (BQ)'
    ],
    yearBuilt: 2023,
    securityFeatures: [
      'Old Ikoyi Prime Police Patrol Zone',
      '24/7 Armed Estate Security',
      'Perimeter Electric Barrier & HD CCTV'
    ],
    createdAt: '2025-01-10T14:00:00.000Z',
    updatedAt: '2025-02-08T09:45:00.000Z'
  },
  {
    id: 'pr-006',
    title: 'The Diplomatic Waterfront Mansion Estate',
    slug: 'the-diplomatic-waterfront-mansion-estate',
    refCode: 'PR-IKY-06',
    category: 'Waterfront Villa',
    city: 'Lagos',
    location: 'Alexander Avenue, Ikoyi, Lagos',
    neighborhood: 'Old Ikoyi',
    priceNaira: 120000000,
    pricePeriod: 'per year',
    serviceChargeNaira: 9000000,
    cautionDepositPercentage: 10,
    bedrooms: 7,
    bathrooms: 8,
    toilets: 9,
    parkingSpaces: 8,
    areaSqm: 1100,
    furnishing: 'Fully Furnished',
    availability: 'Available',
    featured: true,
    images: [
      '/src/assets/images/hero_luxury_lagos_mansion_1793625216314.jpg',
      '/src/assets/images/property_banana_island_villa_1793625217146.jpg',
      '/src/assets/images/property_maitama_penthouse_1793625217385.jpg'
    ],
    description: 'A benchmark of Nigerian luxury real estate. Positioned along prime Ikoyi waterfront, this private estate includes a 25-meter Olympic-grade pool, sprawling grounds with royal palms, dual professional kitchens, full diplomatic security compound specifications, and accommodation for security and staff.',
    amenities: [
      'Deep Water Private Yacht Mooring',
      'Olympic-Length Swimming Pool & Poolhouse',
      'Full Redundant Dual 250kVA Power Facility',
      'Diplomatic Security Compound Rating',
      'Commercial Grade Industrial Kitchen & Family Kitchen',
      'Private Wellness Spa, Sauna & Gym',
      'Separate Security Gatehouse & 4 Staff Rooms'
    ],
    yearBuilt: 2024,
    securityFeatures: [
      'Reinforced Diplomatic Security Perimeter',
      'Automated Anti-Ram Barrier Gates',
      'Thermal Imaging & 24/7 Armed Guard Protocol'
    ],
    createdAt: '2025-01-05T07:30:00.000Z',
    updatedAt: '2025-02-18T18:00:00.000Z'
  }
];

export const NEIGHBORHOODS = [
  'All Neighborhoods',
  'Banana Island',
  'Old Ikoyi',
  'Maitama',
  'Lekki Phase 1',
  'Eko Atlantic City',
  'Victoria Island',
  'Asokoro'
];

export const CATEGORIES = [
  'All Types',
  'Waterfront Villa',
  'Luxury Penthouse',
  'Detached Duplex',
  'Serviced Apartment',
  'Executive Terrace'
];

export const AMENITIES_LIST = [
  '24/7 Guaranteed Power',
  'Swimming Pool',
  'Waterfront / Lagoon View',
  'Smart Home Automation',
  'Private Elevator',
  'Chef Kitchen',
  'Boys Quarters (BQ)',
  'Armed Patrol & CCTV',
  'Gym & Wellness'
];
