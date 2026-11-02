import React, { useState } from 'react';
import { X, Calendar, Clock, MessageSquare, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Property } from '../types/property';
import { api } from '../services/api';
import { getPropertyWhatsAppUrl, getWhatsAppUrl } from '../utils/format';

interface ScheduleViewingModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleViewingModal: React.FC<ScheduleViewingModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00');
  const [budgetRange, setBudgetRange] = useState('');
  const [movingTimeline, setMovingTimeline] = useState('Within 30 Days');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock background body scroll when modal is active
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || phone.trim() === '+234') {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.submitEnquiry({
        propertyId: property?.id,
        propertyTitle: property?.title || 'General VIP Rental Advisory',
        propertyRefCode: property?.refCode || 'VIP-CONCIERGE',
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        preferredDate,
        preferredTime,
        budgetRange: budgetRange || (property ? `₦${(property.priceNaira / 1000000).toFixed(0)}M / year` : 'Luxury Tier'),
        movingTimeline,
        message: message.trim() || `Requesting a scheduled private inspection for ${property?.title || 'luxury rental properties'}.`,
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit enquiry. Please try again or message via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-hidden">
      <div className="relative w-full max-w-lg bg-[#111116] border border-[#2D2D37] rounded-xl shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto my-auto">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-white">Viewing Request Received</h3>
              <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-[#D4AF37] font-semibold">{fullName}</span>. A senior Paschal Realty private advisor has been notified and will call you on <span className="text-white">{phone}</span> to finalize your private viewing itinerary.
              </p>
            </div>

            <div className="bg-[#171720] border border-[#2A2A35] p-4 rounded-lg text-left text-xs text-zinc-300 space-y-1.5">
              <p><strong className="text-zinc-400">Property:</strong> {property ? property.title : 'VIP Rental Concierge'}</p>
              {preferredDate && <p><strong className="text-zinc-400">Date:</strong> {preferredDate} at {preferredTime}</p>}
              <p><strong className="text-zinc-400">Reference:</strong> {property?.refCode || 'PASCHAL-ADVISORY'}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {property ? (
                <a
                  href={getPropertyWhatsAppUrl(property.title, property.refCode, property.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Confirmation</span>
                </a>
              ) : (
                <a
                  href={getWhatsAppUrl(`Hello, my name is ${fullName}. I just requested a viewing consultation on your website.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Confirm on WhatsApp</span>
                </a>
              )}
              <button
                onClick={handleResetAndClose}
                className="py-3 px-5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 rounded"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                Private Inspection
              </p>
              <h3 className="text-xl font-serif font-bold text-white mt-1">
                {property ? `Schedule Viewing: ${property.title}` : 'Schedule Private Viewing'}
              </h3>
              {property && (
                <p className="text-xs text-zinc-400 mt-1">
                  {property.location} · Ref: <span className="text-[#D4AF37] font-mono">{property.refCode}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-800/50 text-red-200 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Chief Babatunde Adeleke"
                  className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2D2D3B] focus:border-[#D4AF37] rounded text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Phone / WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2D2D3B] focus:border-[#D4AF37] rounded text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2D2D3B] focus:border-[#D4AF37] rounded text-sm text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2D2D3B] focus:border-[#D4AF37] rounded text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Preferred Time
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2D2D3B] focus:border-[#D4AF37] rounded text-sm text-white focus:outline-none"
                  >
                    <option value="10:00">10:00 AM (Morning)</option>
                    <option value="12:00">12:00 PM (Midday)</option>
                    <option value="14:00">02:00 PM (Afternoon)</option>
                    <option value="16:00">04:00 PM (Late Afternoon)</option>
                    <option value="17:30">05:30 PM (Sunset Inspection)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Moving Timeline
                  </label>
                  <select
                    value={movingTimeline}
                    onChange={(e) => setMovingTimeline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2D2D3B] focus:border-[#D4AF37] rounded text-sm text-white focus:outline-none"
                  >
                    <option value="Immediate">Immediate (Within 7 Days)</option>
                    <option value="Within 30 Days">Within 30 Days</option>
                    <option value="1 - 3 Months">1 - 3 Months</option>
                    <option value="Relocation Exploration">Exploring Options</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Annual Budget (NGN)
                  </label>
                  <input
                    type="text"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    placeholder="e.g. ₦30M - ₦60M"
                    className="w-full px-3.5 py-2.5 bg-[#171720] border border-[#2D2D3B] focus:border-[#D4AF37] rounded text-sm text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Specific Requirements or Questions
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Requires 24/7 power backup, BQ, diplomatic clearance..."
                  className="w-full px-3.5 py-2 bg-[#171720] border border-[#2D2D3B] focus:border-[#D4AF37] rounded text-sm text-white placeholder-zinc-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 gold-button-gradient text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Private Inspection</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
