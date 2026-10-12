import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowDown, Heart, ShieldCheck, Feather, Send, Star } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenCustomOrder: () => void;
  totalProductsCount: number;
  totalInterestsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onOpenCustomOrder,
  totalProductsCount,
  totalInterestsCount,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Background Decorative Blobs with gentle blur */}
      <div className="absolute top-10 right-10 -z-10 w-72 h-72 rounded-full bg-[#FCEAE8]/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-80 h-80 rounded-full bg-[#F5EBE1]/70 blur-3xl pointer-events-none" />

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Editorial Typography & CTAs */}
        <div className="lg:col-span-7 text-center lg:text-left">
          {/* Studio Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E6] border border-[#E8DACF] text-xs font-semibold text-[#5A453D] mb-5 shadow-2xs"
          >
            <Sparkles size={13} className="text-[#D87D82]" />
            <span>The Dhubri Crochet Atelier · Established 2024</span>
          </motion.div>

          {/* Big Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#3D2E28] leading-[1.12] mb-5"
          >
            Heirloom stitches for{' '}
            <span className="italic font-normal text-[#D87D82]">gentle souls</span>.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="text-base sm:text-lg text-[#6E5950] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
          >
            Everlasting floral bouquets, celestial charms, and whimsical miniature amigurumi — lovingly spun one knot at a time with 100% cloud-soft milk cotton yarn.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-10"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExploreClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#3D2E28] text-white text-sm font-semibold hover:bg-[#251A16] shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore Collection</span>
              <ArrowDown size={15} className="group-hover:translate-y-0.5 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenCustomOrder}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FFFBF8] text-[#47342C] text-sm font-semibold hover:bg-[#F7EFE8] border border-[#DDD0C3] shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={15} className="text-[#D87D82]" />
              <span>Bespoke Gift Request</span>
            </motion.button>
          </motion.div>

          {/* Social Proof & Metrics Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 border-t border-[#EDE1D6] flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs text-[#7A665E]"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex text-[#D87D82]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#D87D82" />
                ))}
              </div>
              <span className="font-semibold text-[#3D2E28]">5.0</span>
              <span>Client Praise</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Heart size={14} className="text-[#D87D82] fill-[#D87D82]" />
              <span className="font-semibold text-[#3D2E28]">{totalInterestsCount}+</span>
              <span>Restock Wishes</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Feather size={14} className="text-[#8F9E8B]" />
              <span>100% Milk Cotton Yarn</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Hero Visual Showcase with Floating Animations */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative mx-auto max-w-md"
          >
            {/* Primary Editorial Image Card */}
            <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-[#F7EFE8]">
              <img
                src="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1000&q=85"
                alt="Cozy Knot Handcrafted Pastel Tulip Bouquet"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

              {/* Bottom Badge inside photo */}
              <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#D87D82] uppercase tracking-wider text-[10px]">
                    Signature Bouquet
                  </span>
                  <span className="text-[11px] font-bold text-[#3D2E28]">
                    ₹699
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#3D2E28]">
                  Pastel Dream Tulip Bouquet
                </h4>
                <p className="text-[11px] text-[#7A675F] mt-0.5 line-clamp-1">
                  9 handcrafted milk cotton stems that never wilt
                </p>
              </div>
            </div>

            {/* Floating Bobbing Badge 1: Top-Left */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -left-4 sm:-left-6 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE0D5] shadow-lg text-xs font-semibold text-[#3D2E28] flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-[#FCEAE8] text-[#D87D82] flex items-center justify-center text-xs">
                🌸
              </div>
              <div>
                <p className="text-[11px] font-bold leading-none">Everlasting Botanicals</p>
                <p className="text-[9px] text-[#8C7A73] font-normal">Flowers that never fade</p>
              </div>
            </motion.div>

            {/* Floating Bobbing Badge 2: Right-Middle */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-1/2 -right-3 sm:-right-6 -translate-y-1/2 px-3.5 py-2.5 rounded-2xl bg-[#3D2E28]/95 backdrop-blur-md text-white shadow-xl text-xs flex items-center gap-2.5"
            >
              <div className="w-6 h-6 rounded-full bg-[#D87D82] flex items-center justify-center text-white">
                <Heart size={12} fill="white" />
              </div>
              <div>
                <p className="text-[11px] font-semibold leading-none">Crafted on Demand</p>
                <p className="text-[9px] text-white/70">Tap "Interested" to restock</p>
              </div>
            </motion.div>

            {/* Floating Bobbing Badge 3: Bottom-Left */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 -left-3 sm:-left-5 px-3.5 py-2 rounded-2xl bg-[#FAF0E6]/95 backdrop-blur-md border border-[#E5DACF] shadow-md text-xs font-medium text-[#5B4840] flex items-center gap-1.5"
            >
              <span>📍 Dhubri Studio</span>
              <span className="text-[#A89891]">·</span>
              <span className="text-emerald-700 font-semibold">Ready to Ship</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Atelier Core Pillars Strip */}
      <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[#EDE1D6]">
        <div className="p-5 rounded-2xl bg-white/60 border border-[#EDE2D7] shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] text-[#D87D82] flex items-center justify-center mb-3">
            <Feather size={20} />
          </div>
          <h3 className="font-serif font-bold text-base text-[#3D2E28] mb-1">
            01. Slow Handcrafting
          </h3>
          <p className="text-xs text-[#7B6861] leading-relaxed">
            Every petal, miniature jellyfish tentacle, and swirl roll cake takes between 2 to 6 hours of patient crochet stitching.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/60 border border-[#EDE2D7] shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#FCEAE8] text-[#D87D82] flex items-center justify-center mb-3">
            <Heart size={20} />
          </div>
          <h3 className="font-serif font-bold text-base text-[#3D2E28] mb-1">
            02. Community Restock Radar
          </h3>
          <p className="text-xs text-[#7B6861] leading-relaxed">
            Sold out? Hit <strong className="text-[#3D2E28]">"I'm Interested"</strong>. Our artisan watches live demand and spins yarn for the most-requested pieces first.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/60 border border-[#EDE2D7] shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] text-[#4F7A59] flex items-center justify-center mb-3">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-serif font-bold text-base text-[#3D2E28] mb-1">
            03. Keepsake Packaging
          </h3>
          <p className="text-xs text-[#7B6861] leading-relaxed">
            Carefully enveloped in sustainable kraft wrap with wax seals and handwritten notes, dispatched safely from Dhubri across India.
          </p>
        </div>
      </div>
    </section>
  );
};
