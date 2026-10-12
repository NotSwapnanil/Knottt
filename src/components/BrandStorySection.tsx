import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, MapPin, Feather, Check } from 'lucide-react';

interface BrandStorySectionProps {
  onOpenCustomOrder: () => void;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({
  onOpenCustomOrder,
}) => {
  return (
    <section id="story" className="py-16 sm:py-24 bg-[#F5ECE2]/60 border-y border-[#EDE0D4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Story Collage */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ y: -4 }}
                className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md border-2 border-white"
              >
                <img
                  src="https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=700&q=80"
                  alt="Sunflower Bouquet in Jute Burlap"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md border-2 border-white mt-8"
              >
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80"
                  alt="Celestial Sun and Moon Keychains"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Quote Overlay Badge */}
            <div className="absolute -bottom-5 inset-x-8 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE0D5] shadow-lg text-center">
              <p className="font-serif italic text-xs sm:text-sm text-[#3D2E28]">
                "A real flower withers in days. A hand-crocheted bloom holds your memories forever."
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[#A6958E] font-semibold mt-1">
                — Cozy Knot Artisan
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E6] text-[#D87D82] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#F2DDD5]">
              <Sparkles size={12} /> The Philosophy of Slow Stitches
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3D2E28] leading-tight mb-5">
              Rooted in Dhubri, woven with patience & pure intention.
            </h2>

            <div className="space-y-4 text-sm text-[#6C574F] leading-relaxed mb-8">
              <p>
                In a fast-paced world of mass-produced plastic gifts, <strong>Cozy Knot</strong> was born out of a desire for things made with slow, mindful tenderness. Based in Dhubri, Assam, each piece begins with skeins of combed milk cotton yarn and a single crochet hook.
              </p>
              <p>
                Whether it is our signature pastel tulip bouquet wrapped in satin ribbon, a textured golden sunflower in rustic sackcloth, or a celestial moon charm, nothing is rushed. We count every loop and knot so that every petal maintains its plush dimensional form for years.
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#523E36] font-medium mb-8">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#D87D82] text-white flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Hypoallergenic soft milk cotton</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#D87D82] text-white flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Zero plastic petals or synthetic foam</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#D87D82] text-white flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Custom color palettes on request</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#D87D82] text-white flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Safe pan-India gift delivery</span>
              </div>
            </div>

            <button
              onClick={onOpenCustomOrder}
              className="px-6 py-3 rounded-full bg-[#3D2E28] text-white text-xs font-semibold hover:bg-[#251A16] shadow-sm transition-all"
            >
              Order a Custom Creation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
