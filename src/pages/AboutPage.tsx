import React from 'react';
import { Shield, Award, Users, MapPin, CheckCircle, ArrowRight, PhoneCall } from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '../utils/format';

interface AboutPageProps {
  onNavigate: (page: string) => void;
  onOpenSchedule: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenSchedule }) => {
  return (
    <div className="w-full">
      {/* 1. Header Hero */}
      <section className="relative py-20 bg-[#0E0E12] border-b border-[#1E1E26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
            About Paschal Realty
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mt-2 leading-tight">
            Setting the Benchmark for Luxury Tenancies in Nigeria
          </h1>
          <p className="text-base text-zinc-300 mt-4 leading-relaxed font-light">
            Founded with a singular commitment: to make renting ultra-luxury residential properties in Nigeria transparent, secure, and world-class.
          </p>
        </div>
      </section>

      {/* 2. Brand Story & Mission */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              The Paschal Realty Philosophy
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              In Nigeria&apos;s fast-evolving luxury residential landscape, locating a genuinely serviced property with guaranteed continuous power, clear landlord title, and impeccable structural finishes has historically been fraught with ambiguity.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              PASCHAL REALTY was established to bridge this gap. We operate not as passive listing aggregators, but as bespoke luxury tenancy advisors. Every residence in our catalogue undergoes a rigorous 42-point inspection covering facility generators, water treatment systems, legal title verification, and security infrastructure before it is presented to our clients.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Whether you are an expatriate diplomat moving your family to Abuja, an international executive stationing in Lagos, or a high-net-worth Nigerian national seeking a secure turnkey home, we handle your tenancy with absolute discretion.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('properties')}
                className="gold-button-gradient px-6 py-3 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow-md"
              >
                Explore Rental Portfolio
              </button>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#1A1A22] border border-[#2F2F3D] hover:border-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp: {WHATSAPP_NUMBER}</span>
              </a>
            </div>
          </div>

          {/* Image Grid Showcase */}
          <div className="relative rounded-2xl overflow-hidden border border-[#252532] shadow-2xl">
            <img
              src="/src/assets/images/property_banana_island_villa_1793625217146.jpg"
              alt="Banana Island Luxury Villa"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-black/70 backdrop-blur-md border border-white/10">
              <p className="text-xs font-mono text-[#D4AF37]">ZONE A, BANANA ISLAND</p>
              <p className="text-sm font-serif font-bold text-white">Representative of Our Exclusive Rental Inventory</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Pillars */}
      <section className="py-20 bg-[#0E0E12] border-y border-[#1A1A22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Our Tenancy Standards</p>
            <h2 className="text-3xl font-serif font-bold text-white mt-1">Four Unwavering Commitments</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#131318] border border-[#22222C] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white">Legal Title Due Diligence</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Zero sublet surprises. We certify direct landlord ownership, valid Governor&apos;s Consent or Certificate of Occupancy, and authentic authorization.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#131318] border border-[#22222C] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white">Guaranteed Infrastructure</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We independently test industrial generators, automatic changeover switches, industrial inverters, and reverse-osmosis borehole filtration systems.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#131318] border border-[#22222C] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white">Diplomatic Protocol</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Trusted by foreign diplomatic missions, UN agencies, and global energy conglomerates with standard diplomatic break-clause integration.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#131318] border border-[#22222C] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white">Caution Escrow Protection</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We safeguard refundable caution deposits through documented entry-and-exit condition schedules, ensuring swift refund at lease end.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Leadership & Advisory */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Executive Leadership</p>
          <h2 className="text-3xl font-serif font-bold text-white">Guided by Experienced Real Estate Professionals</h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            PASCHAL REALTY is spearheaded by seasoned real estate advisors with over a decade of high-tier brokerage across the prime real estate markets of Ikoyi, Victoria Island, Lekki, and Abuja.
          </p>

          <div className="p-8 rounded-xl bg-[#121217] border border-[#242430] text-left mt-8 flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center text-black font-serif font-bold text-3xl shrink-0 shadow-xl">
              PR
            </div>
            <div className="space-y-2">
              <p className="text-lg font-serif font-bold text-white">Paschal Executive Directorate</p>
              <p className="text-xs font-mono text-[#D4AF37]">Lead Broker & Managing Partner · Lagos & Abuja</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                &ldquo;Our pledge is simple: Every client who walks through our doors receives the exact same standard of integrity, privacy, and speed they would expect from prime agencies in London, Dubai, or New York.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
