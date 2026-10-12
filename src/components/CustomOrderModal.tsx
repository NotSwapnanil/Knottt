import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle } from 'lucide-react';
import { CustomOrderInquiry } from '../types';
import { motion } from 'motion/react';

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquiryCreated?: (inquiry: CustomOrderInquiry) => void;
}

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({
  isOpen,
  onClose,
  onInquiryCreated,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [productInterest, setProductInterest] = useState('Custom Bouquet Mix');
  const [colorPreference, setColorPreference] = useState('');
  const [deadline, setDeadline] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          contact,
          productInterest,
          colorPreference,
          deadline,
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      const data = await res.json();
      if (onInquiryCreated) onInquiryCreated(data.inquiry);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setCustomerName('');
    setContact('');
    setColorPreference('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-lg bg-[#FFFDFB] rounded-t-[32px] sm:rounded-[32px] border border-[#EFE5DB] shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#7B6861] hover:text-[#3D2E28] hover:bg-[#F6EFE9] transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F2F7F2] text-[#4A7A55] rounded-full flex items-center justify-center">
              <CheckCircle size={36} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#3D2E28] mb-2">
              Request Received! 🧶
            </h3>
            <p className="text-sm text-[#7B6861] max-w-sm mx-auto mb-6 leading-relaxed">
              We received your custom crochet vision. Cozy Knot will review your design and reach out to you directly!
            </p>

            <a
              href="https://www.instagram.com/cozy_knot18/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D87D82] text-white text-xs font-semibold hover:bg-[#C96B70] transition-colors mb-4 shadow-sm"
            >
              <Send size={13} />
              Open Direct Chat @cozy_knot18
            </a>

            <div>
              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 text-xs text-[#8A7870] hover:text-[#3D2E28]"
              >
                Return to Storefront
              </button>
            </div>
          </motion.div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D87D82] uppercase tracking-wider mb-1.5">
              <Sparkles size={14} /> Bespoke Atelier Commission
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#3D2E28] mb-2">
              Design a Custom Keepsake
            </h2>
            <p className="text-xs text-[#7B6861] leading-relaxed mb-6">
              Have a special flower combination, personalized monogram, or gift hamper idea? Let us weave it specially for your recipient!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#534038] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sweta"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C9] bg-white text-sm text-[#3D2E28] placeholder-[#B5A59E] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#534038] mb-1">
                    Instagram or WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. @sweta_crochet or 98765..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C9] bg-white text-sm text-[#3D2E28] placeholder-[#B5A59E] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#534038] mb-1">
                  Creation Type
                </label>
                <select
                  value={productInterest}
                  onChange={(e) => setProductInterest(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C9] bg-white text-sm text-[#3D2E28] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/40"
                >
                  <option value="Custom Bouquet Mix">Everlasting Flower Bouquet (Tulips, Sunflower, Chamomile mix)</option>
                  <option value="Solo Statement Flower">Solo Sunflower or Rose Stem with Burlap Wrap</option>
                  <option value="Custom Amigurumi Keychain">Amigurumi Charm (Jellyfish, Celestial, Bakery cake)</option>
                  <option value="Hair Accessory Set">Hair Accessories & Knitted Velvet Bows</option>
                  <option value="Wedding / Event Favors">Bulk Hampers for Birthday or Wedding</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#534038] mb-1">
                    Color Palette Idea
                  </label>
                  <input
                    type="text"
                    value={colorPreference}
                    onChange={(e) => setColorPreference(e.target.value)}
                    placeholder="e.g. Pastel pink, lilac and cream"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C9] bg-white text-sm text-[#3D2E28] placeholder-[#B5A59E] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#534038] mb-1">
                    Target Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C9] bg-white text-sm text-[#3D2E28] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#534038] mb-1">
                  Describe your idea
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details like recipient name, message card note, wrapping paper color..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C9] bg-white text-sm text-[#3D2E28] placeholder-[#B5A59E] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/40 resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  {error}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#3D2E28] text-white text-sm font-semibold hover:bg-[#251A16] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-2"
              >
                {loading ? 'Submitting...' : 'Send Commission Request'}
              </motion.button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
