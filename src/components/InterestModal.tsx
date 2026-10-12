import React, { useState } from 'react';
import { Product } from '../types';
import { Heart, X, CheckCircle, Sparkles, Send, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InterestModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onInterestSubmitted: (updatedProduct: Product) => void;
}

export const InterestModal: React.FC<InterestModalProps> = ({
  product,
  isOpen,
  onClose,
  onInterestSubmitted,
}) => {
  const [userName, setUserName] = useState('');
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${product.id}/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, contact, note }),
      });

      if (!res.ok) throw new Error('Failed to record interest');
      const data = await res.json();
      onInterestSubmitted(data.product);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setUserName('');
    setContact('');
    setNote('');
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
            <div className="w-16 h-16 mx-auto mb-4 bg-[#FCEAE8] text-[#D87D82] rounded-full flex items-center justify-center">
              <CheckCircle size={36} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#3D2E28] mb-2">
              Wishlist Request Saved! 💕
            </h3>
            <p className="text-sm text-[#7B6861] max-w-sm mx-auto mb-6 leading-relaxed">
              You are now recorded in our studio's queue for{' '}
              <span className="font-semibold text-[#3D2E28]">{product.title}</span>. 
              Our artisan prioritizes yarn spinning based on these requests!
            </p>

            <div className="p-4 bg-[#FAF4EE] rounded-2xl border border-[#EFE5DB] text-xs text-[#7B6861] mb-6 text-left">
              <div className="font-semibold text-[#3D2E28] mb-1 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#D87D82]" />
                Direct Atelier Contact:
              </div>
              Drop a quick direct DM on Instagram{' '}
              <a 
                href="https://www.instagram.com/cozy_knot18" 
                target="_blank" 
                rel="noreferrer"
                className="text-[#D87D82] font-semibold underline"
              >
                @cozy_knot18
              </a>{' '}
              to request specific color variations or reserve the very next finished piece!
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3.5 px-6 rounded-full bg-[#3D2E28] text-white text-sm font-semibold hover:bg-[#251A16] transition-colors shadow-xs"
            >
              Continue Browsing
            </button>
          </motion.div>
        ) : (
          <div>
            <div className="flex items-start gap-4 mb-6">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-20 h-20 rounded-2xl object-cover border border-[#EFE5DB] shrink-0"
              />
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#D87D82] mb-1">
                  {product.isSoldOut ? 'Sold Out · Request Restock' : 'Express Interest'}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#3D2E28] leading-snug">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-[#3D2E28]">₹{product.price}</span>
                  <span className="text-xs text-[#9B8881]">·</span>
                  <span className="text-xs text-[#D87D82] font-semibold flex items-center gap-1">
                    <Heart size={12} fill="#D87D82" /> {product.interestsCount} cozy lovers in queue
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF4EE] rounded-2xl p-4 border border-[#EFE5DB] mb-6">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3D2E28] mb-1">
                <TrendingUp size={14} className="text-[#D87D82]" />
                How the Restock Queue Works:
              </div>
              <p className="text-xs text-[#6B5A53] leading-relaxed">
                As a slow craft studio, we crochet each piece by hand in Dhubri. Tapping below adds to our live <strong className="text-[#3D2E28]">Demand Radar</strong> so our artisan spins yarn for this creation right away!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#534038] mb-1">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Aanya"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C9] bg-white text-sm text-[#3D2E28] placeholder-[#B5A59E] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#534038] mb-1">
                  Instagram Handle or WhatsApp (to notify when crafted)
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. @your_instagram or +91 98765..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C9] bg-white text-sm text-[#3D2E28] placeholder-[#B5A59E] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#534038] mb-1">
                  Color preference / special note (optional)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Would love in pastel pink, or needed for an anniversary gift!"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C9] bg-white text-sm text-[#3D2E28] placeholder-[#B5A59E] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/40 resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  {error}
                </p>
              )}

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-[#D87D82] text-white text-sm font-semibold hover:bg-[#C96B70] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
                >
                  {loading ? (
                    'Recording request...'
                  ) : (
                    <>
                      <Heart size={16} fill="white" />
                      Add to Restock Queue ({product.interestsCount} already)
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
