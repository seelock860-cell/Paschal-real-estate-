import React, { useState } from 'react';
import { Search, MapPin, Home, ArrowRight, Shield, Award, Users, Check, PhoneCall, Sparkles } from 'lucide-react';
import { Property } from '../types/property';
import { PropertyCard } from '../components/PropertyCard';
import { NEIGHBORHOODS, CATEGORIES } from '../data/initialProperties';
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '../utils/format';

interface HomePageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenSchedule: (property: Property | null) => void;
  onNavigateToProperties: (filters?: { neighborhood?: string; category?: string; bedrooms?: string }) => void;
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  onSelectProperty,
  onOpenSchedule,
  onNavigateToProperties,
  onNavigate,
}) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All Neighborhoods');
  const [selectedCategory, setSelectedCategory] = useState('All Types');
  const [selectedBedrooms, setSelectedBedrooms] = useState('any');

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 3);
  const heroImage = '/src/assets/images/hero_luxury_lagos_mansion_1793625216314.jpg';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToProperties({
      neighborhood: selectedNeighborhood === 'All Neighborhoods' ? '' : selectedNeighborhood,
      category: selectedCategory === 'All Types' ? '' : selectedCategory,
      bedrooms: selectedBedrooms === 'any' ? '' : selectedBedrooms,
    });
  };

  const primeLocations = [
    {
      name: 'Banana Island',
      city: 'Lagos',
      description: "Nigeria's most affluent waterfront sanctuary. Private yacht jetties and supreme seclusion.",
      image: '/src/assets/images/property_banana_island_villa_1793625217146.jpg',
      priceGuide: 'From ₦65M / year',
    },
    {
      name: 'Maitama District',
      city: 'Abuja',
      description: 'The diplomatic heart of Nigeria with tree-lined avenues, luxury sky penthouses and embassies.',
      image: '/src/assets/images/property_maitama_penthouse_1793625217385.jpg',
      priceGuide: 'From ₦45M / year',
    },
    {
      name: 'Lekki Phase 1',
      city: 'Lagos',
      description: 'Vibrant modern luxury with contemporary detached smart homes, private pools and nightlife.',
      image: '/src/assets/images/property_lekki_duplex_1793625218313.jpg',
      priceGuide: 'From ₦25M / year',
    },
    {
      name: 'Eko Atlantic City',
      city: 'Lagos',
      description: 'Visionary coastal metropolis featuring international infrastructure and oceanfront suites.',
      image: '/src/assets/images/property_eko_atlantic_apartment_1793625232512.jpg',
      priceGuide: 'From ₦35M / year',
    },
  ];

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-[#1E1E24]">
        {/* Background photo with measured contrast scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Paschal Realty Luxury Nigerian Mansion"
            className="w-full h-full object-cover object-center scale-105 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/75 to-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nigeria&apos;s High-End Real Estate Rental Authority</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white max-w-4xl tracking-tight leading-[1.15] text-balance">
            Curating Nigeria&apos;s Most Exclusive <span className="gold-gradient-text">Rental Residences</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-zinc-300 max-w-2xl font-light leading-relaxed">
            From waterfront villas on Banana Island to executive sky penthouses in Maitama, PASCHAL REALTY delivers verified luxury residences with 24/7 dedicated concierge.
          </p>

          {/* Quick Search Bar Card */}
          <div className="w-full max-w-4xl mt-10 bg-[#121217]/95 border border-[#2B2B36] rounded-xl shadow-2xl p-4 sm:p-6 backdrop-blur-xl">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
              
              {/* Location Select */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Neighborhood</span>
                </label>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1B1B24] border border-[#2E2E3C] focus:border-[#D4AF37] text-white text-xs rounded focus:outline-none"
                >
                  {NEIGHBORHOODS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Category */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Property Type</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1B1B24] border border-[#2E2E3C] focus:border-[#D4AF37] text-white text-xs rounded focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Bedrooms
                </label>
                <select
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1B1B24] border border-[#2E2E3C] focus:border-[#D4AF37] text-white text-xs rounded focus:outline-none"
                >
                  <option value="any">Any Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                  <option value="6">6+ Bedrooms</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 gold-button-gradient text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-lg shadow-[#D4AF37]/15 h-[41px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Rentals</span>
                </button>
              </div>

            </form>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 max-w-4xl w-full border-t border-zinc-800/80 pt-8 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-white tabular-nums">₦50B+</p>
              <p className="text-xs text-zinc-400 mt-1">Managed Luxury Assets</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37] tabular-nums">100%</p>
              <p className="text-xs text-zinc-400 mt-1">Verified Tenancy Title</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-white tabular-nums">24/7</p>
              <p className="text-xs text-zinc-400 mt-1">Dedicated Tenant Support</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37] tabular-nums">&lt; 1hr</p>
              <p className="text-xs text-zinc-400 mt-1">WhatsApp Response Time</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED PROPERTIES SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
              Curated Portfolio
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
              Featured Luxury Rentals
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl">
              Inspect our most sought-after residences currently available for immediate lease in Lagos and Abuja.
            </p>
          </div>
          <button
            onClick={() => onNavigate('properties')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-white transition-colors cursor-pointer self-start md:self-auto py-2"
          >
            <span>Browse All {properties.length} Properties</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
              onOpenSchedule={onOpenSchedule}
            />
          ))}
        </div>
      </section>

      {/* 3. PRIME NEIGHBORHOODS SHOWCASE */}
      <section className="py-20 bg-[#0E0E12] border-y border-[#1A1A22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
              Prestigious Enclaves
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
              Prime Nigerian Locations
            </h2>
            <p className="text-sm text-zinc-400 mt-3">
              We focus exclusively on locations with premier security, stable infrastructure, and world-class luxury status.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {primeLocations.map((loc) => (
              <div
                key={loc.name}
                onClick={() => onNavigateToProperties({ neighborhood: loc.name })}
                className="group relative h-96 rounded-xl overflow-hidden cursor-pointer border border-[#23232C] hover:border-[#D4AF37]/60 transition-all duration-300"
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#D4AF37]">
                    <span>{loc.city}</span>
                    <span className="font-mono text-zinc-300">{loc.priceGuide}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {loc.description}
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    <span>View Available Rentals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY RENT WITH PASCHAL REALTY */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
              The Paschal Distinction
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1 leading-tight">
              A Bespoke Standard for Nigerian High-End Rentals
            </h2>
            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
              Renting a luxury home in Nigeria requires rigorous due diligence. PASCHAL REALTY eliminates the friction, unverified listings, and power concerns typical of the general market.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-[#171720] border border-[#2A2A38] text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-white">01. 100% Verified Ownership & Clean Tenancy</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Every property in our portfolio is thoroughly verified with Land Registry checks and vetted landlords, ensuring zero disputes or duplicate leases.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-[#171720] border border-[#2A2A38] text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-white">02. Infrastructure & 24/7 Power Assurance</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    We only list homes with proven uninterrupted power guarantees (dual backup generators, dedicated transformers, and solar/inverter systems).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-[#171720] border border-[#2A2A38] text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-white">03. Discretion for Diplomats & C-Suite Executives</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Our private viewing protocols protect tenant privacy and adhere to international diplomatic security guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="relative rounded-2xl overflow-hidden border border-[#252530] bg-[#121217] p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] border-b border-[#D4AF37]/30 pb-1 inline-block">
                Direct Principal Broker
              </span>

              <h3 className="text-2xl font-serif font-bold text-white">
                Looking for a Specific Luxury Home in Nigeria?
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Whether you are an expatriate relocating to Lagos, a diaspora executive seeking a serviced holiday residence, or an embassy needing ambassadorial accommodation, our team conducts targeted property searches.
              </p>

              <div className="bg-[#1A1A24] p-4 rounded-lg border border-[#2A2A38] space-y-2 text-xs text-zinc-300">
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#25D366]" />
                  <span>Curated viewings arranged in under 24 hours</span>
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#25D366]" />
                  <span>Direct WhatsApp contact with Senior Broker</span>
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#25D366]" />
                  <span>Full legal lease preparation and advisory</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => onOpenSchedule(null)}
                  className="flex-1 gold-button-gradient py-3 px-4 text-xs font-bold uppercase tracking-wider rounded text-center cursor-pointer shadow-md"
                >
                  Request Private Consultation
                </button>
                <a
                  href={getWhatsAppUrl('Hello Paschal Realty, I would like to speak directly with an agent regarding rental homes in Nigeria.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-black py-3 px-4 text-xs font-bold uppercase tracking-wider rounded text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Chat: {WHATSAPP_NUMBER}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CLIENT TESTIMONIALS */}
      <section className="py-20 bg-[#0A0A0D] border-t border-[#1C1C22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
              Client Feedback
            </p>
            <h2 className="text-3xl font-serif font-bold text-white mt-1">
              Trusted by Discerning Tenants
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#121217] border border-[#22222B] p-6 rounded-lg space-y-4">
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                &ldquo;Finding a secure, fully serviced waterfront home on Banana Island within two weeks of my transfer from Geneva seemed impossible until we engaged Paschal Realty. The tenancy process was seamless and thoroughly vetted.&rdquo;
              </p>
              <div className="pt-2 border-t border-zinc-800/60">
                <p className="text-sm font-serif font-bold text-white">Ambassador Philippe L.</p>
                <p className="text-xs text-[#D4AF37]">Diplomatic Mission · Banana Island Tenant</p>
              </div>
            </div>

            <div className="bg-[#121217] border border-[#22222B] p-6 rounded-lg space-y-4">
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                &ldquo;The level of professional communication on WhatsApp and immediate response to inquiries was remarkable. Our sky penthouse in Maitama has unbroken power and stunning views across Abuja.&rdquo;
              </p>
              <div className="pt-2 border-t border-zinc-800/60">
                <p className="text-sm font-serif font-bold text-white">Dr. Oby Nkemdilim</p>
                <p className="text-xs text-[#D4AF37]">Managing Director, Fintech Venture · Maitama Tenant</p>
              </div>
            </div>

            <div className="bg-[#121217] border border-[#22222B] p-6 rounded-lg space-y-4">
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                &ldquo;Paschal Realty handled our corporate executive housing in Eko Atlantic with exemplary precision. Every promise regarding facility management and caution fee escrow was honored strictly.&rdquo;
              </p>
              <div className="pt-2 border-t border-zinc-800/60">
                <p className="text-sm font-serif font-bold text-white">Engr. Babatunde Sanusi</p>
                <p className="text-xs text-[#D4AF37]">Infrastructure Principal · Eko Atlantic Tenant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-[#171720] via-[#101015] to-[#171720] border-t border-[#262633]">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Ready to Discover Your Next Luxury Residence in Nigeria?
          </h2>
          <p className="text-sm text-zinc-300 max-w-xl mx-auto">
            Contact our private brokerage team today on WhatsApp or schedule an exclusive inspection with our senior property advisors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={getWhatsAppUrl('Hello Paschal Realty, I am interested in viewing rental houses and apartments.')}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Connect on WhatsApp (09024971419)</span>
            </a>
            <button
              onClick={() => onOpenSchedule(null)}
              className="py-3 px-6 gold-button-gradient text-xs font-bold uppercase tracking-wider rounded transition-all hover:scale-105 cursor-pointer shadow-lg"
            >
              Schedule Private Viewing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
