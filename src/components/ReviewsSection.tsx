import React from 'react';
import { motion } from 'motion/react';
import { Star, Heart, CheckCircle2, Quote } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Tanya Saha',
      location: 'Guwahati, Assam',
      item: 'Pastel Dream Tulip Bouquet',
      rating: 5,
      date: 'March 2026',
      quote:
        'The tulips arrived in flawless packaging! My sister cried happy tears when she opened the box. The milk cotton yarn is so soft and the ribbon work is stunning. Forever a customer 💕',
    },
    {
      id: 2,
      name: 'Rohan & Ananya',
      location: 'Kolkata, West Bengal',
      item: 'Celestial Sun & Moon Duo',
      rating: 5,
      date: 'February 2026',
      quote:
        'We ordered the matching sun and moon keychains for our 1st anniversary. The stitches are incredibly tight, sturdy, and the detail on the moon stitches is pure art.',
    },
    {
      id: 3,
      name: 'Sneha Barman',
      location: 'Siliguri',
      item: 'Rustic Sunshine Sunflower Bouquet',
      rating: 5,
      date: 'March 2026',
      quote:
        'The jute wrap gives it such an authentic cottagecore vibe! It sits proudly on my work desk and brings so much warmth every morning without any watering.',
    },
    {
      id: 4,
      name: 'Priya Sen',
      location: 'Bangalore',
      item: 'Patisserie Cake & Cherry Charms',
      rating: 5,
      date: 'January 2026',
      quote:
        'The little cherry on top of the swiss roll keychain is the cutest thing ever. Everyone at my college keeps asking where I got it from!',
    },
  ];

  return (
    <section id="reviews" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCEAE8] text-[#D87D82] text-xs font-semibold uppercase tracking-wider mb-3">
          <Heart size={12} fill="#D87D82" /> Client Love & Unboxings
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3D2E28] mb-3">
          Cherished across India
        </h2>
        <p className="text-xs sm:text-sm text-[#7D6B63] leading-relaxed">
          Read what cozy souls have to say about our handcrafted bouquets, keychains, and gift boxes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((rev, idx) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -6 }}
            className="p-6 rounded-3xl bg-white border border-[#EDE2D7] shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-[#D87D82] mb-3">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#D87D82" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-[#55423A] italic leading-relaxed mb-5">
                "{rev.quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-[#F5EBE1]">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#3D2E28]">{rev.name}</h4>
                  <p className="text-[11px] text-[#8C7A73]">{rev.location}</p>
                </div>
                <span className="text-[10px] font-semibold text-[#D87D82] bg-[#FAF0E6] px-2 py-0.5 rounded-md">
                  Verified
                </span>
              </div>
              <p className="text-[10px] text-[#A6958E] mt-1 line-clamp-1">
                Ordered: {rev.item}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
