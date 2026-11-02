import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '../utils/format';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Mini popup card */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2.5rem)] max-w-xs sm:w-80 rounded-xl bg-[#121217] border border-[#2D2D37] shadow-2xl p-4 text-white transform transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white tracking-wide">Paschal Realty Concierge</p>
                <p className="text-[11px] text-zinc-400">Direct Agent: {WHATSAPP_NUMBER}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
              aria-label="Close message preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-zinc-300 space-y-2">
            <p className="bg-[#1A1A22] p-2.5 rounded text-zinc-300 leading-relaxed border border-zinc-800/60">
              Welcome to <span className="text-[#D4AF37] font-semibold">PASCHAL REALTY</span>. How may we assist your luxury house or serviced apartment search in Nigeria today?
            </p>
          </div>

          <a
            href={getWhatsAppUrl('Hello Paschal Realty, I would like to enquire about renting a luxury home in Nigeria.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-black text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-lg shadow-[#25D366]/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-4 py-3 bg-[#111116] border border-[#33333F] hover:border-[#25D366] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
        aria-label="Contact Paschal Realty on WhatsApp"
      >
        <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-black shadow-md">
          <MessageCircle className="w-4 h-4 fill-current" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-zinc-200 group-hover:text-white hidden sm:inline">
          WhatsApp 09024971419
        </span>
      </button>
    </div>
  );
};
