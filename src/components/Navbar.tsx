import React, { useState } from 'react';
import { Menu, X, PhoneCall } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/format';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, propertyId?: string) => void;
  isAdminLoggedIn: boolean;
  onOpenScheduleModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isAdminLoggedIn,
  onOpenScheduleModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'properties', label: 'Properties for Rent' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E1E24] bg-[#0B0B0C]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleLinkClick('home')}
            className="text-left group cursor-pointer focus:outline-none shrink-0"
          >
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-white group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
              PASCHAL <span className="text-[#D4AF37]">REALTY</span>
            </span>
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                  currentPage === link.id
                    ? 'text-[#D4AF37] font-semibold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {link.label}
                {currentPage === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action button */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <a
              href={getWhatsAppUrl('Hello Paschal Realty, I would like to enquire about luxury rental properties in Nigeria.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>09024971419</span>
            </a>
            <button
              onClick={onOpenScheduleModal}
              className="gold-button-gradient px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-all transform active:scale-95 shadow-md shadow-[#D4AF37]/10 whitespace-nowrap cursor-pointer"
            >
              Schedule Viewing
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={onOpenScheduleModal}
              className="gold-button-gradient px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded"
            >
              Viewing
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#222228] bg-[#0E0E12] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`block w-full text-left py-2.5 text-base font-medium tracking-wide border-b border-zinc-800/40 ${
                currentPage === link.id ? 'text-[#D4AF37] font-semibold' : 'text-zinc-200'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#17171C] border border-[#2D2D35] text-[#D4AF37] text-xs font-bold uppercase tracking-wider rounded"
            >
              WhatsApp 09024971419
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
