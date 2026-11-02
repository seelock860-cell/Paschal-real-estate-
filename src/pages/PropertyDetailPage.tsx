import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Bed, Bath, Maximize2, Car, Shield, CheckCircle2, 
  MessageSquare, Calendar, PhoneCall, Share2, Check, Clock, AlertCircle, Building2, Flame
} from 'lucide-react';
import { Property } from '../types/property';
import { PropertyGalleryModal } from '../components/PropertyGalleryModal';
import { formatNaira, getPropertyWhatsAppUrl, WHATSAPP_NUMBER } from '../utils/format';
import { api } from '../services/api';

interface PropertyDetailPageProps {
  property: Property;
  onBack: () => void;
  onSelectProperty: (property: Property) => void;
  allProperties: Property[];
  onOpenSchedule: (property: Property) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  onBack,
  onSelectProperty,
  allProperties,
  onOpenSchedule,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick Viewing Form on page
  const [viewerName, setViewerName] = useState('');
  const [viewerPhone, setViewerPhone] = useState('+234 ');
  const [viewerEmail, setViewerEmail] = useState('');
  const [viewDate, setViewDate] = useState('');
  const [viewTime, setViewTime] = useState('11:00 AM');
  const [viewMessage, setViewMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['/src/assets/images/hero_luxury_lagos_mansion_1793625216314.jpg'];

  const similarProperties = allProperties
    .filter((p) => p.id !== property.id && (p.neighborhood === property.neighborhood || p.city === property.city))
    .slice(0, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewerName.trim() || !viewerPhone.trim() || viewerPhone.trim() === '+234') {
      setSubmitError('Please enter your name and contact phone number.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await api.submitEnquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyRefCode: property.refCode,
        fullName: viewerName.trim(),
        email: viewerEmail.trim(),
        phone: viewerPhone.trim(),
        preferredDate: viewDate,
        preferredTime: viewTime,
        budgetRange: `${formatNaira(property.priceNaira)} / year`,
        movingTimeline: 'Next 30 Days',
        message: viewMessage.trim() || `Scheduled inspection request for ${property.title}.`,
      });
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit inspection request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171720] border border-[#2A2A38] hover:border-zinc-500 rounded text-xs text-zinc-300 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Property'}</span>
          </button>

          <span className="font-mono text-xs text-[#D4AF37] bg-black/60 px-2.5 py-1 rounded border border-[#D4AF37]/30">
            REF: {property.refCode}
          </span>
        </div>
      </div>

      {/* 1. PHOTO GALLERY SHOWCASE */}
      <div className="space-y-3 mb-10">
        {/* Main Showcase Photo */}
        <div 
          onClick={() => setGalleryOpen(true)}
          className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-xl overflow-hidden bg-zinc-900 border border-[#23232C] cursor-pointer group"
        >
          <img
            src={images[activeImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

          {/* Fullscreen Trigger Overlay */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-lg text-xs font-semibold text-white border border-white/10 group-hover:bg-black/90 transition-colors">
            <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>View Full Gallery ({images.length} Photos)</span>
          </div>

          <div className="absolute top-4 left-4">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black/75 backdrop-blur-md text-[#D4AF37] rounded border border-[#D4AF37]/30">
              {property.category}
            </span>
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        {images.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'border-[#D4AF37] scale-102 shadow-md' : 'border-[#23232C] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. MAIN LAYOUT: Details & Sidebar Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Cols: Comprehensive Property Specs & Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Header & Status */}
          <div className="pb-6 border-b border-[#22222B]">
            <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2">
              <span className="flex items-center gap-1 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{property.location}</span>
              </span>
              <span>·</span>
              <span className="text-[#D4AF37]">{property.city}</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                {property.availability}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {property.title}
            </h1>

            {/* Pricing Strip */}
            <div className="mt-6 p-5 rounded-xl bg-[#141419] border border-[#252530] flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-400">Rental Price</p>
                <p className="text-3xl font-bold text-[#F3E5AB] tabular-nums mt-0.5">
                  {formatNaira(property.priceNaira)}
                  <span className="text-sm font-normal text-zinc-400 ml-1.5">/year</span>
                </p>
              </div>

              {property.serviceChargeNaira ? (
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">Annual Service Charge</p>
                  <p className="text-lg font-semibold text-zinc-200 tabular-nums mt-0.5">
                    {formatNaira(property.serviceChargeNaira)}
                  </p>
                </div>
              ) : null}

              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-400">Caution Deposit</p>
                <p className="text-sm font-semibold text-zinc-300 mt-0.5">
                  {property.cautionDepositPercentage || 10}% (Refundable)
                </p>
              </div>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">
              Property Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-[#121217] border border-[#22222A]">
                <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Bedrooms</span>
                </p>
                <p className="text-lg font-bold text-white mt-1 tabular-nums">{property.bedrooms} Ensuite</p>
              </div>

              <div className="p-4 rounded-lg bg-[#121217] border border-[#22222A]">
                <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Bathrooms</span>
                </p>
                <p className="text-lg font-bold text-white mt-1 tabular-nums">{property.bathrooms} Luxury</p>
              </div>

              <div className="p-4 rounded-lg bg-[#121217] border border-[#22222A]">
                <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Gross Area</span>
                </p>
                <p className="text-lg font-bold text-white mt-1 tabular-nums">{property.areaSqm} sqm</p>
              </div>

              <div className="p-4 rounded-lg bg-[#121217] border border-[#22222A]">
                <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Car Parking</span>
                </p>
                <p className="text-lg font-bold text-white mt-1 tabular-nums">{property.parkingSpaces} Vehicles</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-3">
              Residence Overview
            </h3>
            <div className="prose prose-invert text-sm text-zinc-300 leading-relaxed space-y-4">
              <p>{property.description}</p>
              <p>
                Constructed to ultra-premium architectural specifications in {property.yearBuilt}, the property incorporates acoustically insulated double-glazed windows, centralized air conditioning ducting, bespoke joinery, and private domestic staff quarters.
              </p>
            </div>
          </div>

          {/* Amenities & High-End Features */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">
              Features & Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#121217] border border-[#202028] text-xs text-zinc-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Infrastructure Standards */}
          <div className="p-5 rounded-xl bg-[#101015] border border-[#22222E]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span>Security & Power Protocol</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              In accordance with Paschal Realty luxury standards, this residence is equipped with 100% continuous power capability and gated security protocols.
            </p>
            <div className="space-y-2 text-xs text-zinc-300">
              {property.securityFeatures?.map((sec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>{sec}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>Synchronized generator with automatic mains failure (AMF) transfer switch</span>
              </div>
            </div>
          </div>

          {/* Standard Rental Terms in Nigeria */}
          <div className="p-5 rounded-xl bg-[#0D0D11] border border-[#1E1E24] text-xs text-zinc-400 space-y-2">
            <h4 className="font-semibold text-zinc-300 uppercase tracking-wider">
              Standard Nigerian Tenancy Terms
            </h4>
            <p>• Agency Fee: 10% of annual rent (payable on lease execution)</p>
            <p>• Legal & Tenancy Agreement Preparation: 10% standard</p>
            <p>• Service Charge covers generator maintenance, security personnel, waste disposal, and estate common area facilities.</p>
          </div>

        </div>

        {/* Right Col: Sticky Booking & WhatsApp Action Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto pr-1">
          
          {/* Main Action Box */}
          <div className="bg-[#121217] border border-[#292935] rounded-xl p-6 shadow-2xl space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">Direct Broker Desk</p>
              <h3 className="text-lg font-serif font-bold text-white mt-1">
                Enquire for Rent
              </h3>
            </div>

            {/* Direct WhatsApp Action Button */}
            <a
              href={getPropertyWhatsAppUrl(property.title, property.refCode, property.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all hover:scale-102"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Agent: 09024971419</span>
            </a>

            <div className="text-center">
              <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-mono">
                — OR SCHEDULE INSPECTION —
              </span>
            </div>

            {/* Quick Inspection Form */}
            {submitted ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-700/50 rounded text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">Inspection Scheduled</p>
                <p className="text-[11px] text-zinc-300">
                  We have recorded your viewing request. We will reach out to confirm your itinerary.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInlineSubmit} className="space-y-3">
                {submitError && (
                  <div className="p-2.5 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs">
                    {submitError}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={viewerName}
                    onChange={(e) => setViewerName(e.target.value)}
                    placeholder="e.g. Mr. David Adeleke"
                    className="w-full px-3 py-2 bg-[#1A1A22] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={viewerPhone}
                    onChange={(e) => setViewerPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3 py-2 bg-[#1A1A22] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={viewerEmail}
                    onChange={(e) => setViewerEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full px-3 py-2 bg-[#1A1A22] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Inspection Date</label>
                    <input
                      type="date"
                      value={viewDate}
                      onChange={(e) => setViewDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#1A1A22] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Time</label>
                    <select
                      value={viewTime}
                      onChange={(e) => setViewTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#1A1A22] border border-[#2B2B38] focus:border-[#D4AF37] rounded text-xs text-white focus:outline-none"
                    >
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 gold-button-gradient text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Request Private Inspection'}
                </button>
              </form>
            )}

            {/* Direct Calling & Advisory */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>Direct Phone Inquiry:</span>
              <a href={`tel:${WHATSAPP_NUMBER}`} className="text-white hover:text-[#D4AF37] font-semibold flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>09024971419</span>
              </a>
            </div>

          </div>

          {/* Verified Broker Profile */}
          <div className="bg-[#101014] border border-[#22222A] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex items-center justify-center text-black font-serif font-bold text-lg">
                P
              </div>
              <div>
                <p className="text-sm font-serif font-bold text-white">Paschal Luxury Desk</p>
                <p className="text-xs text-[#D4AF37]">Managing Partner & Lead Broker</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Specialist in Banana Island, Ikoyi, and Maitama luxury tenancies. We coordinate private viewing escort and escrow management.
            </p>
          </div>

        </div>

      </div>

      {/* 3. SIMILAR PROPERTIES NEARBY */}
      {similarProperties.length > 0 && (
        <div className="mt-20 pt-10 border-t border-[#1F1F27]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Recommendations</p>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                Similar Residences in {property.city}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {similarProperties.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProperty(p)}
                className="group flex flex-col sm:flex-row bg-[#121217] border border-[#22222A] hover:border-[#D4AF37]/50 rounded-lg overflow-hidden cursor-pointer transition-all"
              >
                <div className="sm:w-56 aspect-[4/3] sm:aspect-auto shrink-0 relative">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-zinc-400">{p.location}</p>
                    <h3 className="text-base font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors mt-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2">
                      {p.bedrooms} Beds · {p.bathrooms} Baths · {p.areaSqm} sqm
                    </p>
                  </div>
                  <p className="text-base font-bold text-[#F3E5AB] tabular-nums mt-4">
                    {formatNaira(p.priceNaira)} <span className="text-xs text-zinc-400 font-normal">/year</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Gallery Lightbox Modal */}
      <PropertyGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={images}
        title={property.title}
        initialIndex={activeImageIndex}
      />

    </div>
  );
};
