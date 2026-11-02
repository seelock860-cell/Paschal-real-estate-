import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, ArrowUpRight } from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '../utils/format';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#08080A] border-t border-[#1C1C22] text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <span className="text-xl font-serif font-bold text-white tracking-wider">
              PASCHAL <span className="text-[#D4AF37]">REALTY</span>
            </span>
            <p className="text-sm leading-relaxed text-zinc-400">
              Nigeria&apos;s premier luxury real estate rental agency. We curate and manage exclusive high-end waterfront estates, penthouses, and serviced duplexes across Lagos and Abuja.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:underline uppercase tracking-wider"
              >
                <span>Direct WhatsApp Concierge</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Prime Locations */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Prime Locations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Banana Island, Ikoyi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Old Ikoyi Waterfronts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Maitama Diplomatic, Abuja
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Eko Atlantic City, Victoria Island
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Lekki Phase 1 Luxury Corridors
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Properties for Rent
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Official Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Direct Contact
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="flex items-start gap-3 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>+234 (0) 902 497 1419</span>
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-white transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <span>WhatsApp: 09024971419</span>
              </a>
              <a
                href="mailto:paschaljoshua45@gmail.com"
                className="flex items-start gap-3 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="truncate">paschaljoshua45@gmail.com</span>
              </a>
              <div className="flex items-start gap-3 pt-1">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-400 space-y-1">
                  <p>Lekki Phase 1, Lagos, Nigeria</p>
                  <p>Maitama District, Abuja, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1C1C22] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} PASCHAL REALTY. All rights reserved. Registered Luxury Real Estate Brokerage in Nigeria.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-400">Strict Tenancy Verification</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-zinc-400">Diplomatic Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
