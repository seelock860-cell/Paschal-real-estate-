export type PropertyCategory = 
  | 'Waterfront Villa'
  | 'Luxury Penthouse'
  | 'Detached Duplex'
  | 'Serviced Apartment'
  | 'Executive Terrace'
  | 'Commercial / Diplomatic';

export type AvailabilityStatus = 
  | 'Available'
  | 'Leased'
  | 'Under Offer'
  | 'Reserved';

export type FurnishingStatus = 
  | 'Fully Furnished'
  | 'Semi Furnished'
  | 'Unfurnished';

export interface Property {
  id: string;
  title: string;
  slug: string;
  refCode: string; // e.g. PR-IKY-01
  category: PropertyCategory;
  city: 'Lagos' | 'Abuja' | 'Port Harcourt';
  location: string; // e.g. "Banana Island, Ikoyi, Lagos"
  neighborhood: string; // e.g. "Banana Island"
  priceNaira: number; // e.g. 65000000
  pricePeriod: 'per year' | 'per month';
  serviceChargeNaira?: number; // e.g. 4500000
  cautionDepositPercentage?: number; // e.g. 10
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  parkingSpaces: number;
  areaSqm: number;
  furnishing: FurnishingStatus;
  availability: AvailabilityStatus;
  featured: boolean;
  images: string[];
  description: string;
  amenities: string[];
  yearBuilt: number;
  securityFeatures?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyRefCode?: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  budgetRange?: string;
  movingTimeline?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Viewing Scheduled' | 'Completed' | 'Archived';
  createdAt: string;
}

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  bucketName: string;
  isConnected: boolean;
  lastTestedAt?: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  neighborhood: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  furnishing: string;
  availability: string;
  amenities: string[];
  sortBy: 'price-desc' | 'price-asc' | 'newest' | 'featured';
}

export interface AdminAuthResponse {
  token: string;
  username: string;
  role: 'admin';
}
