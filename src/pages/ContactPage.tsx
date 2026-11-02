import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle2, ArrowRight, Loader2, Send } from 'lucide-react';
import { api } from '../services/api';
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '../utils/format';

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Rent a Luxury Home in Lagos');
  const [budgetRange, setBudgetRange] = useState('');
  const [timeline, setTimeline] = useState('Immediate (Next 14 Days)');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || phone.trim() === '+234') {
      setError('Please provide your full name and phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.submitEnquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        budgetRange: budgetRange || 'Luxury Tier',
        movingTimeline: timeline,
        propertyTitle: subject,
        message: message.trim() || 'General enquiry regarding luxury residential rental properties in Nigeria.',
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit enquiry. Please use our direct WhatsApp line.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'How does PASCHAL REALTY guarantee 24/7 power in Lagos and Abuja rentals?',
      a: 'We only list residences that feature dual synchronized generators (e.g., Perkins or Cummins), high-capacity inverter/solar battery systems, and dedicated transformers with automated mains failure (AMF) transfer switches.',
    },
    {
      q: 'Can expatriates and diaspora tenants execute leases remotely?',
      a: 'Yes. We provide complete 4K virtual video walkthroughs, digital lease documentation with electronic signatures, and escrow handling so you can secure your home before arriving in Nigeria.',
    },
    {
      q: 'What is the standard payment structure for rental residences in Nigeria?',
      a: 'Luxury residential leases in Nigeria are typically billed annually in advance, accompanied by a refundable caution deposit (typically 10%), estate service charge, and standard legal/agency brokerage fees.',
    },
    {
      q: 'How quickly can a private viewing be arranged?',
      a: 'For vacant residences in Banana Island, Ikoyi, Lekki Phase 1, and Maitama, private inspections can be coordinated within 2 to 4 hours of your inquiry.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
          Direct Concierge
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
          Contact Paschal Realty
        </h1>
        <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
          Our senior property advisors are available 24/7 on WhatsApp, direct phone, or through our private client inquiry portal.
        </p>
      </div>

      {/* Main Grid: Channels + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
        
        {/* Left Column: Direct Contact Info & Offices */}
        <div className="space-y-6">
          
          {/* WhatsApp Direct Highlight Box */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#122B18] via-[#101912] to-[#0E1410] border border-[#25D366]/40 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#25D366] text-black flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#25D366] font-bold">Fastest Response</p>
              <h3 className="text-xl font-serif font-bold text-white mt-1">WhatsApp Concierge</h3>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                Connect directly with Lead Broker Paschal for instant property availability, video walkthroughs, and inspection bookings.
              </p>
            </div>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider rounded transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat: {WHATSAPP_NUMBER}</span>
            </a>
          </div>

          {/* Contact Details Card */}
          <div className="p-6 rounded-xl bg-[#121217] border border-[#22222B] space-y-5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Direct Contact Details
            </h4>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-zinc-500">Call Direct</p>
                  <a href={`tel:${WHATSAPP_NUMBER}`} className="text-white hover:text-[#D4AF37] font-semibold font-mono">
                    +234 (0) 902 497 1419
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-zinc-500">Official Email</p>
                  <a href="mailto:paschaljoshua45@gmail.com" className="text-white hover:text-[#D4AF37]">
                    paschaljoshua45@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-zinc-500">Viewing Hours</p>
                  <p className="text-zinc-300 text-xs">Monday – Saturday: 8:00 AM – 6:30 PM</p>
                  <p className="text-zinc-500 text-[11px]">Sunday VIP inspections by appointment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Office Locations */}
          <div className="p-6 rounded-xl bg-[#121217] border border-[#22222B] space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Our Locations
            </h4>

            <div className="space-y-4 text-xs text-zinc-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Lagos Office</p>
                  <p className="text-zinc-400 mt-0.5">14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Abuja Office</p>
                  <p className="text-zinc-400 mt-0.5">22 Gana Street Corridor, Maitama, Abuja, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 2 Columns: Interactive Customer Enquiry Form */}
        <div className="lg:col-span-2 bg-[#121217] border border-[#242430] rounded-xl p-8 shadow-2xl">
          {submitted ? (
            <div className="text-center py-16 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">Message Dispatched Successfully</h3>
              <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                Thank you for contacting PASCHAL REALTY. An executive advisor has received your details and will follow up with you on <span className="text-[#D4AF37] font-semibold">{phone}</span> shortly.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={getWhatsAppUrl(`Hello Paschal Realty, I am ${fullName}. I just submitted an inquiry on your website.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirm on WhatsApp (09024971419)</span>
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white rounded cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                  Confidential Inquiry
                </p>
                <h2 className="text-2xl font-serif font-bold text-white mt-1">
                  Send a Tenancy or Property Inquiry
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Fill in your requirements below and our private desk will curate matching verified properties.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Chief Adeleke"
                      className="w-full px-3.5 py-2.5 bg-[#181822] border border-[#2B2B3A] focus:border-[#D4AF37] rounded text-sm text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Phone Number / WhatsApp <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="w-full px-3.5 py-2.5 bg-[#181822] border border-[#2B2B3A] focus:border-[#D4AF37] rounded text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 bg-[#181822] border border-[#2B2B3A] focus:border-[#D4AF37] rounded text-sm text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Primary Location of Interest
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#181822] border border-[#2B2B3A] focus:border-[#D4AF37] rounded text-sm text-white focus:outline-none"
                    >
                      <option value="Banana Island Luxury Villa">Banana Island, Ikoyi (Lagos)</option>
                      <option value="Old Ikoyi Residential Estate">Old Ikoyi (Lagos)</option>
                      <option value="Maitama Diplomatic Penthouse">Maitama District (Abuja)</option>
                      <option value="Lekki Phase 1 Modern Duplex">Lekki Phase 1 (Lagos)</option>
                      <option value="Eko Atlantic Oceanfront">Eko Atlantic City (Lagos)</option>
                      <option value="Asokoro Residence">Asokoro (Abuja)</option>
                      <option value="General Rental Inquiry">Other / Undecided</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Estimated Budget (NGN / Year)
                    </label>
                    <input
                      type="text"
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      placeholder="e.g. ₦30M - ₦50M / year"
                      className="w-full px-3.5 py-2.5 bg-[#181822] border border-[#2B2B3A] focus:border-[#D4AF37] rounded text-sm text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Target Relocation Timeline
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#181822] border border-[#2B2B3A] focus:border-[#D4AF37] rounded text-sm text-white focus:outline-none"
                    >
                      <option value="Immediate (Next 14 Days)">Immediate (Next 14 Days)</option>
                      <option value="Within 1 Month">Within 1 Month</option>
                      <option value="1 - 3 Months">1 - 3 Months</option>
                      <option value="Exploring Options">Exploring Market Options</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Detailed Message & Specific Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide any details regarding number of bedrooms, waterfront view, staff quarters (BQ), swimming pool, pet-friendly estates, or diplomatic clearance..."
                    className="w-full px-3.5 py-2.5 bg-[#181822] border border-[#2B2B3A] focus:border-[#D4AF37] rounded text-sm text-white placeholder-zinc-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 gold-button-gradient text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-lg shadow-[#D4AF37]/15 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Tenancy Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

      {/* FAQ Section */}
      <div className="pt-10 border-t border-[#1C1C24]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Frequently Asked</p>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Luxury Rental Advisory in Nigeria
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-[#121217] border border-[#22222B] space-y-2">
              <h3 className="text-sm font-serif font-bold text-white leading-snug">
                {faq.q}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
