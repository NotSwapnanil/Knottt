import React, { useState } from 'react';
import { Product } from '../types';
import { X, Heart, Send, Check, ShieldCheck, Sparkles, MapPin, Feather } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onExpressInterest: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onExpressInterest,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const isSoldOut = product.isSoldOut || product.stock === 0;
  const activeColor = selectedColor || (product.colorOptions ? product.colorOptions[0] : '');

  const handleOrderDM = () => {
    const colorMsg = activeColor ? ` in "${activeColor}" shade` : '';
    const text = `Hi Cozy Knot! 💕 I would love to order "${product.title}"${colorMsg} (₹${product.price}). Could you share shipping details to my location?`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    window.open('https://www.instagram.com/cozy_knot18/', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-[#FFFDFB] rounded-t-[32px] sm:rounded-[32px] border border-[#EFE5DB] shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 backdrop-blur-md text-[#7B6861] hover:text-[#3D2E28] hover:bg-white transition-all shadow-xs"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Product Image Frame */}
          <div className="relative aspect-square sm:aspect-auto bg-[#F7EFE8] overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {isSoldOut && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#3D2E28] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                Sold Out · Made to Order
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8C7A73] mb-2 font-medium">
                <span className="capitalize">{product.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-[#D87D82]" /> Dhubri, Assam
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3D2E28] leading-tight mb-2">
                {product.title}
              </h2>

              <div className="flex items-baseline gap-2.5 mb-4">
                <span className="text-2xl font-bold text-[#3D2E28]">
                  ₹{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#A89891] line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {isSoldOut ? (
                  <span className="text-xs font-semibold text-[#D87D82] ml-2">
                    Awaiting next batch
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 ml-2">
                    {product.stock} available in atelier
                  </span>
                )}
              </div>

              {/* Demand Status */}
              <div className="p-3.5 bg-[#FAF4EE] rounded-2xl border border-[#EDE2D5] mb-4 text-xs text-[#6E5B53] flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-medium">
                  <Heart size={14} className="text-[#D87D82]" fill="#D87D82" />
                  <span><strong>{product.interestsCount} customers</strong> in restock queue</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onExpressInterest(product);
                  }}
                  className="text-xs font-semibold text-[#D87D82] hover:underline"
                >
                  + Add mine
                </button>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#66544D] leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Color Variations */}
              {product.colorOptions && product.colorOptions.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-[#5A463E] mb-2">
                    Available Shades / Variations:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colorOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedColor(opt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          activeColor === opt
                            ? 'bg-[#3D2E28] text-white shadow-xs'
                            : 'bg-[#F6EFEA] text-[#6A574F] hover:bg-[#EDE3DC]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              <div className="space-y-2 text-xs text-[#806E66] border-t border-[#F0E6DD] pt-3 mb-6">
                <div className="flex items-center gap-2">
                  <Feather size={14} className="text-[#8F9E8B]" />
                  <span>100% Hand-knitted with soft milk cotton yarn</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#8F9E8B]" />
                  <span>Everlasting keepsake — will never wilt or fade</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOrderDM}
                className="w-full py-3.5 px-6 rounded-full bg-[#3D2E28] text-white text-xs font-semibold hover:bg-[#251A16] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-400" />
                    <span>Copied! Opening Instagram DM...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Order via Instagram DM</span>
                  </>
                )}
              </motion.button>

              <button
                onClick={() => {
                  onClose();
                  onExpressInterest(product);
                }}
                className="w-full py-2.5 px-5 rounded-full bg-[#FAF4EE] text-[#D87D82] text-xs font-semibold hover:bg-[#F3E9E0] border border-[#E5DACF] transition-colors flex items-center justify-center gap-1.5"
              >
                <Heart size={14} />
                <span>Express Wishlist Interest ({product.interestsCount} already)</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
