import React, { useState } from 'react';
import { Bed, Bath, Maximize2, MessageCircle, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { Property } from '../types/property';
import { formatNaira, getPropertyWhatsAppUrl } from '../utils/format';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onOpenSchedule: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onOpenSchedule,
}) => {
  const [imgError, setImgError] = useState(false);
  const mainImage = property.images && property.images.length > 0 ? property.images[0] : '';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
      case 'Under Offer':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      case 'Leased':
        return 'text-zinc-400 bg-zinc-900 border-zinc-700/50';
      default:
        return 'text-[#D4AF37] bg-yellow-950/40 border-yellow-800/40';
    }
  };

  return (
    <article className="group flex flex-col bg-[#121216] border border-[#22222A] hover:border-[#D4AF37]/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/60">
      {/* Media Slot */}
      <div 
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#181820] cursor-pointer"
        onClick={() => onSelect(property)}
      >
        {!imgError && mainImage ? (
          <img
            src={mainImage}
            alt={property.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A22] to-[#0E0E12] p-6 text-center text-zinc-500">
            <Maximize2 className="w-10 h-10 mb-2 text-[#D4AF37]/60" />
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">{property.category}</p>
            <p className="text-xs text-zinc-600 mt-1">{property.neighborhood}</p>
          </div>
        )}

        {/* Subtle Scrim gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges: Category & Availability */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-200 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
            {property.category}
          </span>
          <span className={`text-[11px] font-medium tracking-wide px-2.5 py-0.5 rounded border backdrop-blur-md flex items-center gap-1.5 ${getStatusColor(property.availability)}`}>
            {property.availability === 'Available' ? (
              <CheckCircle2 className="w-3 h-3 shrink-0" />
            ) : (
              <Clock className="w-3 h-3 shrink-0" />
            )}
            <span>{property.availability}</span>
          </span>
        </div>

        {/* Bottom media bar: Ref Code & City */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
          <span className="font-mono text-[11px] text-[#D4AF37] tracking-wider bg-black/60 px-2 py-0.5 rounded border border-[#D4AF37]/30">
            {property.refCode}
          </span>
          <span className="text-[11px] text-zinc-300 bg-black/50 px-2 py-0.5 rounded">
            {property.city}
          </span>
        </div>
      </div>

      {/* Content Slot */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Unboxed Location Kicker */}
          <p className="text-xs font-medium text-zinc-400 tracking-wide mb-1">
            {property.location}
          </p>

          {/* Title */}
          <h3 
            onClick={() => onSelect(property)}
            className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1"
          >
            {property.title}
          </h3>

          {/* Unboxed Metadata with · separator */}
          <div className="flex items-center gap-2 mt-2.5 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{property.bedrooms} Beds</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{property.bathrooms} Baths</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{property.areaSqm} sqm</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{property.furnishing}</span>
          </div>

          <p className="text-xs text-zinc-400 mt-3 line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-4 border-t border-[#1F1F27] flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-zinc-400">Rent</p>
              <p className="text-xl font-bold text-[#F3E5AB] tabular-nums tracking-tight">
                {formatNaira(property.priceNaira)}
                <span className="text-xs font-normal text-zinc-400 ml-1">/{property.pricePeriod.replace('per ', '')}</span>
              </p>
            </div>
            {property.serviceChargeNaira ? (
              <div className="text-right">
                <p className="text-[11px] text-zinc-400">Service Charge</p>
                <p className="text-xs text-zinc-300 tabular-nums">
                  {formatNaira(property.serviceChargeNaira)}/yr
                </p>
              </div>
            ) : null}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onSelect(property)}
              className="py-2.5 px-3 text-xs font-semibold text-zinc-200 hover:text-white bg-[#1A1A22] hover:bg-[#252530] border border-[#2E2E3A] rounded transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>

            <a
              href={getPropertyWhatsAppUrl(property.title, property.refCode, property.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 text-xs font-bold text-black bg-[#25D366] hover:bg-[#22bf5b] rounded transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm shadow-[#25D366]/20"
              title="Chat with Paschal Realty on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
