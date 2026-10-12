import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Sparkles, MapPin } from 'lucide-react';

interface HighlightStory {
  id: string;
  type: 'review' | 'delivery' | 'behind_scenes';
  title: string;
  customer?: string;
  location?: string;
  quote?: string;
  date: string;
  image: string;
  tagline: string;
}

const HIGHLIGHT_STORIES: Record<string, HighlightStory[]> = {
  reviews: [
    {
      id: 'rev-1',
      type: 'review',
      title: 'Tulip Bouquet Surprise',
      customer: 'Tanya S., Guwahati',
      location: 'Assam',
      quote: '"The crochet tulips are so breathtakingly pretty! The packaging had a handwritten card and smelled like sweet vanilla. My sister literally screamed in joy 💕"',
      date: '2 days ago',
      image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
      tagline: 'reviews 🌷',
    },
    {
      id: 'rev-2',
      type: 'review',
      title: 'Celestial Sun & Moon Keychains',
      customer: 'Rohan & Ananya',
      location: 'Kolkata',
      quote: '"We ordered the matching sun and moon keychain set for our 1 year anniversary. The stitches are super tight and durable. 10/10 craftsmanship!"',
      date: '1 week ago',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      tagline: 'reviews 🌷',
    },
    {
      id: 'rev-3',
      type: 'review',
      title: 'Sunflower Burlap Bouquet',
      customer: 'Sneha B.',
      location: 'Siliguri',
      quote: '"Ordered this for my study desk. It brings so much warmth every morning and the jute wrap gives it such an aesthetic cottagecore vibe ✨"',
      date: '2 weeks ago',
      image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
      tagline: 'reviews 🌷',
    }
  ],
  deliveries: [
    {
      id: 'del-1',
      type: 'delivery',
      title: 'Parcel Packed with Love',
      customer: 'Order #CK-1092',
      location: 'Dhubri -> Bangalore',
      quote: 'Safe in transit! Kraft paper bubble wrapped with pastel tissue and wax seal ribbon.',
      date: 'Yesterday',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      tagline: 'deliveries ✨',
    },
    {
      id: 'del-2',
      type: 'delivery',
      title: 'Bulk Wedding Favors Dispatched',
      customer: 'Order #CK-1088',
      location: 'Dhubri -> Jorhat',
      quote: '15 personalized cherry & star keychains for bridal shower hampers!',
      date: '4 days ago',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      tagline: 'deliveries ✨',
    }
  ]
};

interface InstagramHighlightsModalProps {
  category: 'reviews' | 'deliveries' | null;
  onClose: () => void;
}

export const InstagramHighlightsModal: React.FC<InstagramHighlightsModalProps> = ({
  category,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!category) return null;

  const stories = HIGHLIGHT_STORIES[category] || [];
  const current = stories[currentIndex] || stories[0];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm sm:max-w-md bg-[#241A16] rounded-3xl overflow-hidden shadow-2xl text-white aspect-[9/16] max-h-[88vh] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bars on top like IG Story */}
        <div className="absolute top-3 inset-x-3 z-30 flex gap-1.5">
          {stories.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-300 ${
                  idx < currentIndex ? 'w-full' : idx === currentIndex ? 'w-full' : 'w-0'
                }`} 
              />
            </div>
          ))}
        </div>

        {/* Top Header */}
        <div className="absolute top-7 inset-x-4 z-30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-[#D87D82] overflow-hidden bg-[#FCEAE8] flex items-center justify-center text-[#D87D82] font-bold text-xs">
              CK
            </div>
            <div>
              <p className="font-semibold text-white">cozy_knot18</p>
              <p className="text-[10px] text-white/70">{current.tagline} · {current.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Story Background Image */}
        <div className="absolute inset-0">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />
        </div>

        {/* Tap areas for Prev / Next */}
        <div className="absolute inset-0 z-20 grid grid-cols-2">
          <div onClick={handlePrev} className="cursor-pointer" />
          <div onClick={handleNext} className="cursor-pointer" />
        </div>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button 
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 text-white/90 hover:bg-black/60"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 text-white/90 hover:bg-black/60"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Bottom Story Content */}
        <div className="relative z-30 p-5 mt-auto">
          <div className="p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15">
            <div className="flex items-center justify-between text-xs text-[#F2C4C4] mb-1.5">
              <span className="font-medium flex items-center gap-1">
                <Sparkles size={12} /> {current.customer}
              </span>
              {current.location && (
                <span className="flex items-center gap-1 text-[11px] text-white/70">
                  <MapPin size={11} /> {current.location}
                </span>
              )}
            </div>
            <p className="text-sm font-serif font-semibold text-white mb-2">
              {current.title}
            </p>
            <p className="text-xs text-white/90 italic leading-relaxed">
              {current.quote}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-white/70 px-1">
            <span>Tap right to view next</span>
            <span className="flex items-center gap-1 text-[#F2C4C4]">
              <Heart size={12} fill="#F2C4C4" /> Dhubri Crochet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
