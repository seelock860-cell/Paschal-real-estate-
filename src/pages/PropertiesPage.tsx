import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Grid, List, RotateCcw, Building2, Bed, Bath } from 'lucide-react';
import { Property, FilterState } from '../types/property';
import { PropertyCard } from '../components/PropertyCard';
import { NEIGHBORHOODS, CATEGORIES, AMENITIES_LIST } from '../data/initialProperties';
import { formatNaira, getPropertyWhatsAppUrl } from '../utils/format';

interface PropertiesPageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenSchedule: (property: Property) => void;
  initialFilters?: Partial<FilterState>;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  properties,
  onSelectProperty,
  onOpenSchedule,
  initialFilters,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(initialFilters?.searchQuery || '');
  const [city, setCity] = useState(initialFilters?.city || 'All');
  const [neighborhood, setNeighborhood] = useState(initialFilters?.neighborhood || 'All Neighborhoods');
  const [category, setCategory] = useState(initialFilters?.category || 'All Types');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000000); // ₦150M max
  const [bedrooms, setBedrooms] = useState(initialFilters?.bedrooms || 'all');
  const [furnishing, setFurnishing] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-desc' | 'price-asc' | 'newest'>('featured');

  const handleResetFilters = () => {
    setSearchQuery('');
    setCity('All');
    setNeighborhood('All Neighborhoods');
    setCategory('All Types');
    setMinPrice(0);
    setMaxPrice(150000000);
    setBedrooms('all');
    setFurnishing('all');
    setAvailability('all');
    setSelectedAmenities([]);
    setSortBy('featured');
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        // Keyword Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = prop.title.toLowerCase().includes(q);
          const matchLoc = prop.location.toLowerCase().includes(q);
          const matchDesc = prop.description.toLowerCase().includes(q);
          const matchRef = prop.refCode.toLowerCase().includes(q);
          if (!matchTitle && !matchLoc && !matchDesc && !matchRef) return false;
        }

        // City
        if (city !== 'All' && prop.city !== city) return false;

        // Neighborhood
        if (neighborhood !== 'All Neighborhoods' && prop.neighborhood !== neighborhood) return false;

        // Category
        if (category !== 'All Types' && prop.category !== category) return false;

        // Price range
        if (prop.priceNaira < minPrice || prop.priceNaira > maxPrice) return false;

        // Bedrooms
        if (bedrooms !== 'all') {
          const num = parseInt(bedrooms, 10);
          if (prop.bedrooms < num) return false;
        }

        // Furnishing
        if (furnishing !== 'all' && prop.furnishing !== furnishing) return false;

        // Availability
        if (availability !== 'all' && prop.availability !== availability) return false;

        // Amenities
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amenity) =>
            prop.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
          );
          if (!hasAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return b.priceNaira - a.priceNaira;
        if (sortBy === 'price-asc') return a.priceNaira - b.priceNaira;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    properties,
    searchQuery,
    city,
    neighborhood,
    category,
    minPrice,
    maxPrice,
    bedrooms,
    furnishing,
    availability,
    selectedAmenities,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
          Rental Portfolio
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
          Luxury Houses & Apartments for Rent
        </h1>
        <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
          Explore vetted residential estates, waterfront villas, penthouses, and executive terraces in Nigeria&apos;s prime locations with dedicated 24/7 power and security.
        </p>
      </div>

      {/* Top Search & Controls Bar */}
      <div className="bg-[#121217] border border-[#22222C] rounded-xl p-4 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Keyword Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by neighborhood, title, or reference..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A24] border border-[#2A2A38] focus:border-[#D4AF37] rounded text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          {/* Quick city filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#171720] border border-[#262633] rounded-lg w-full md:w-auto overflow-x-auto">
            {['All', 'Lagos', 'Abuja'].map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
                  city === c ? 'bg-[#D4AF37] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {c === 'All' ? 'All Cities' : c}
              </button>
            ))}
          </div>

          {/* Sort & View toggles */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-[#1A1A24] border border-[#2A2A38] text-xs text-white rounded focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="newest">Newest Listed</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 border border-[#262633] rounded p-1 bg-[#171720]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-[#2A2A38] text-[#D4AF37]' : 'text-zinc-500 hover:text-white'
                }`}
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-[#2A2A38] text-[#D4AF37]' : 'text-zinc-500 hover:text-white'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#1A1A24] border border-[#2A2A38] text-xs font-semibold text-zinc-200 rounded"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Filters</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} lg:col-span-1 space-y-6 bg-[#111116] border border-[#22222B] p-5 rounded-xl h-fit`}>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#D4AF37]" />
              <span>Refine Search</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Neighborhood filter */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Neighborhood
            </label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
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
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Property Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Max Annual Rent
              </label>
              <span className="text-xs font-mono text-[#D4AF37]">
                {formatNaira(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="15000000"
              max="150000000"
              step="5000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
              <span>₦15M</span>
              <span>₦85M</span>
              <span>₦150M+</span>
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Minimum Bedrooms
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {['all', '3', '4', '5', '6'].map((bed) => (
                <button
                  key={bed}
                  onClick={() => setBedrooms(bed)}
                  className={`py-1.5 text-xs font-semibold rounded border transition-colors ${
                    bedrooms === bed
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                      : 'bg-[#171720] text-zinc-400 border-[#2A2A38] hover:text-white'
                  }`}
                >
                  {bed === 'all' ? 'Any' : `${bed}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Furnishing */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Furnishing
            </label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
              className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="all">All Furnishing Types</option>
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Semi Furnished">Semi Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Availability Status
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-3 py-2 bg-[#171720] border border-[#2A2A38] rounded text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available for Lease</option>
              <option value="Under Offer">Under Offer</option>
              <option value="Leased">Leased (Archive)</option>
            </select>
          </div>

          {/* Key Amenities Checklist */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Amenities & Specs
            </label>
            <div className="space-y-2">
              {AMENITIES_LIST.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="accent-[#D4AF37] rounded"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* Results Area */}
        <div className="lg:col-span-3">
          {/* Results count banner */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-800 text-xs text-zinc-400">
            <span>
              Showing <strong className="text-white font-mono">{filteredProperties.length}</strong> luxury rental {filteredProperties.length === 1 ? 'property' : 'properties'}
            </span>
            {(searchQuery || city !== 'All' || neighborhood !== 'All Neighborhoods' || category !== 'All Types' || selectedAmenities.length > 0) && (
              <button
                onClick={handleResetFilters}
                className="text-[#D4AF37] hover:underline cursor-pointer"
              >
                Clear all active filters
              </button>
            )}
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[#121217] border border-[#22222A] rounded-xl space-y-4">
              <Building2 className="w-12 h-12 text-[#D4AF37]/40 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-white">No properties match your current filters</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Try widening your price range or clearing specific amenity filters, or speak with our brokerage desk for unlisted private properties.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 gold-button-gradient text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onSelect={onSelectProperty}
                  onOpenSchedule={onOpenSchedule}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="flex flex-col sm:flex-row bg-[#121217] border border-[#22222A] hover:border-[#D4AF37]/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div 
                    className="sm:w-64 aspect-[4/3] sm:aspect-auto shrink-0 relative cursor-pointer"
                    onClick={() => onSelectProperty(prop)}
                  >
                    <img
                      src={prop.images[0] || '/src/assets/images/hero_luxury_lagos_mansion_1793625216314.jpg'}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-[11px] font-mono text-[#D4AF37]">
                      {prop.refCode}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>{prop.location}</span>
                        <span className="text-[#D4AF37] font-semibold">{prop.category}</span>
                      </div>
                      <h3
                        onClick={() => onSelectProperty(prop)}
                        className="text-lg font-serif font-bold text-white hover:text-[#D4AF37] transition-colors cursor-pointer mt-1"
                      >
                        {prop.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{prop.bedrooms} Beds</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{prop.bathrooms} Baths</span>
                        </span>
                        <span>·</span>
                        <span>{prop.areaSqm} sqm</span>
                        <span>·</span>
                        <span>{prop.furnishing}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                        {prop.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#1F1F28]">
                      <div>
                        <p className="text-xs text-zinc-400">Annual Rent</p>
                        <p className="text-lg font-bold text-[#F3E5AB] tabular-nums">
                          {formatNaira(prop.priceNaira)}
                          <span className="text-xs font-normal text-zinc-400 ml-1">/year</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="px-3.5 py-2 text-xs font-semibold bg-[#1C1C24] hover:bg-[#282835] text-white rounded transition-colors"
                        >
                          Details
                        </button>
                        <a
                          href={getPropertyWhatsAppUrl(prop.title, prop.refCode, prop.location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-black rounded transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
