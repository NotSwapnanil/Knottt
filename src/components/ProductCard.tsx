import React, { useState } from 'react';
import { Product } from '../types';
import { Heart, Send, Check, Sparkles, Eye, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onExpressInterest: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onExpressInterest,
  onViewDetails,
}) => {
  const [copied, setCopied] = useState(false);
  const [heartClicked, setHeartClicked] = useState(false);

  const isSoldOut = product.isSoldOut || product.stock === 0;

  // Generate Instagram order message
  const handleDirectDM = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hi Cozy Knot! 💕 I would love to order "${product.title}" (₹${product.price}). Is it available?`;
    navigator.clipboard?.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    window.open('https://www.instagram.com/cozy_knot18/', '_blank');
  };

  const handleInterestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartClicked(true);
    setTimeout(() => setHeartClicked(false), 800);
    onExpressInterest(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onClick={() => onViewDetails(product)}
      className="group relative flex flex-col bg-white rounded-3xl border border-[#EDE2D7] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F7EFE8]">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Soft vignette overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start z-10">
          {isSoldOut ? (
            <span className="px-2.5 py-1 rounded-full bg-[#3D2E28]/95 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
              Sold Out · Request Restock
            </span>
          ) : product.stock <= 3 ? (
            <span className="px-2.5 py-1 rounded-full bg-[#D87D82]/95 backdrop-blur-md text-white text-[10px] font-bold tracking-wider shadow-xs">
              Only {product.stock} Left
            </span>
          ) : null}

          {product.tags && product.tags[0] && !isSoldOut && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#5B473E] text-[10px] font-semibold border border-[#E8DFC8] shadow-2xs">
              {product.tags[0]}
            </span>
          )}
        </div>

        {/* Community Wishlist Counter */}
        {product.interestsCount > 0 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#3D2E28] text-[10px] font-semibold flex items-center gap-1.5 shadow-sm border border-white/60">
            <Heart size={11} className="text-[#D87D82] fill-[#D87D82]" />
            <span>{product.interestsCount} requested</span>
          </div>
        )}

        {/* Quick View Button on Desktop Hover */}
        <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="p-2 rounded-full bg-white/95 backdrop-blur-md text-[#3D2E28] shadow-md flex items-center justify-center hover:bg-[#FAF0E6]">
            <Eye size={14} />
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between text-xs text-[#8C7A73] mb-1.5 font-medium">
          <span className="capitalize">{product.category}</span>
          <span className="text-[#DDD3C7]">·</span>
          <span>100% Milk Cotton</span>
        </div>

        <h3 className="font-serif text-base sm:text-lg font-bold text-[#3D2E28] leading-snug line-clamp-1 mb-1.5 group-hover:text-[#D87D82] transition-colors">
          {product.title}
        </h3>

        <p className="text-xs text-[#7B6861] line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.subtitle || product.description}
        </p>

        {/* Price & Stock Indicator Row */}
        <div className="flex items-baseline gap-2 mb-4 pt-3 border-t border-[#F5EFE9]">
          <span className="text-xl font-bold text-[#3D2E28]">
            ₹{product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-[#A89891] line-through">
              ₹{product.originalPrice}
            </span>
          )}
          {isSoldOut ? (
            <span className="ml-auto text-xs font-semibold text-[#D87D82]">
              Made to Order
            </span>
          ) : (
            <span className="ml-auto text-xs font-semibold text-[#487351] flex items-center gap-1">
              In Stock
            </span>
          )}
        </div>

        {/* Functional Actions */}
        <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
          {/* I'm Interested / Restock Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleInterestClick}
            className={`py-2.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
              isSoldOut
                ? 'bg-[#D87D82] text-white hover:bg-[#C96B70]'
                : 'bg-[#FAF0E6] text-[#553E35] hover:bg-[#F2E5D7] border border-[#E5DACF]'
            }`}
          >
            <motion.div
              animate={heartClicked ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={13}
                className={isSoldOut ? 'fill-white' : 'text-[#D87D82]'}
              />
            </motion.div>
            <span className="truncate">
              {isSoldOut ? 'Request Restock' : 'Wishlist'}
            </span>
          </motion.button>

          {/* DM to Order / Instagram Checkout Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleDirectDM}
            className={`py-2.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
              isSoldOut
                ? 'bg-[#F6EFEA] text-[#7A665E] hover:bg-[#EDE3DC] border border-[#E5DACF]'
                : 'bg-[#3D2E28] text-white hover:bg-[#251A16]'
            }`}
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="truncate">Copied DM!</span>
              </>
            ) : (
              <>
                <Send size={12} />
                <span className="truncate">DM to Order</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
