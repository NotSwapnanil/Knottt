import React, { useState } from 'react';
import { CozyLogo } from './CozyLogo';
import { Instagram, Lock, Sparkles, Send, Heart, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenCustomOrder: () => void;
  onNavigateAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
  isAdmin: boolean;
  totalInterestsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCustomOrder,
  onNavigateAdmin,
  onNavigateSection,
  isAdmin,
  totalInterestsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Editorial Ticker Bar */}
      <div className="bg-[#3D2E28] text-[#F3E9E0] text-[11px] sm:text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 overflow-hidden select-none">
        <span className="hidden sm:inline">✦</span>
        <span>Handcrafted in Dhubri, Assam</span>
        <span className="text-[#D87D82]">·</span>
        <span>Everlasting Milk Cotton Botanicals & Whimsical Charms</span>
        <span className="text-[#D87D82]">·</span>
        <span className="hidden sm:inline">Pan-India Delivery</span>
        <span className="hidden sm:inline">✦</span>
      </div>

      {/* Main Website Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EFE5DB] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand Identity */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3.5 group cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <CozyLogo size={46} />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#3D2E28] group-hover:text-[#D87D82] transition-colors">
                  Cozy Knot
                </span>
                <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-[#FCEAE8] text-[#D87D82] border border-[#F5D5D3]">
                  Atelier
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#8C776F] -mt-0.5 font-medium">
                Handmade Crochet Studio
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#635047]">
            <button
              onClick={() => onNavigateSection('catalog')}
              className="hover:text-[#D87D82] transition-colors cursor-pointer py-1 relative group"
            >
              Collection
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D87D82] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => onNavigateSection('bouquets')}
              className="hover:text-[#D87D82] transition-colors cursor-pointer py-1 relative group"
            >
              Bouquets 💐
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D87D82] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => onNavigateSection('charms')}
              className="hover:text-[#D87D82] transition-colors cursor-pointer py-1 relative group"
            >
              Keychains & Charms 🌟
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D87D82] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => onNavigateSection('story')}
              className="hover:text-[#D87D82] transition-colors cursor-pointer py-1 relative group"
            >
              The Studio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D87D82] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => onNavigateSection('reviews')}
              className="hover:text-[#D87D82] transition-colors cursor-pointer py-1 relative group"
            >
              Reviews 🌷
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D87D82] transition-all duration-300 group-hover:w-full" />
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Total Community Interest Badge */}
            <div 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF0E6] border border-[#E7D7C8] text-xs text-[#5D473E] font-medium"
              title="Community requests logged"
            >
              <Heart size={13} className="text-[#D87D82] fill-[#D87D82]" />
              <span>{totalInterestsCount} Wishlist Requests</span>
            </div>

            {/* Custom Order Atelier CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenCustomOrder}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#3D2E28] hover:bg-[#F8F2EC] border border-[#DDD0C3] text-xs font-semibold shadow-2xs transition-all"
            >
              <Sparkles size={13} className="text-[#D87D82]" />
              <span>Bespoke Order</span>
            </motion.button>

            {/* Direct Order on Instagram */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://www.instagram.com/cozy_knot18"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3D2E28] text-white text-xs font-semibold hover:bg-[#281D19] shadow-xs transition-all"
            >
              <Send size={13} />
              <span>Order via DM</span>
            </motion.a>

            {/* Discreet Admin Lock Button */}
            <button
              onClick={onNavigateAdmin}
              className={`p-2 rounded-full transition-colors ${
                isAdmin
                  ? 'bg-[#D87D82] text-white'
                  : 'text-[#9E8B83] hover:text-[#3D2E28] hover:bg-[#F4ECE3]'
              }`}
              title="Admin Inventory Dashboard (/admin)"
              aria-label="Admin Portal"
            >
              <Lock size={15} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#3D2E28] hover:bg-[#F2E7DC] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-[#EFE5DB] bg-[#FAF7F2] px-6 py-5 overflow-hidden"
            >
              <div className="flex flex-col gap-3.5 text-sm font-semibold text-[#5B4840]">
                <button
                  onClick={() => {
                    onNavigateSection('catalog');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-1 hover:text-[#D87D82] transition-colors flex items-center justify-between"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={14} className="text-[#D87D82]" />
                </button>
                <button
                  onClick={() => {
                    onNavigateSection('bouquets');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-1 hover:text-[#D87D82] transition-colors flex items-center justify-between"
                >
                  <span>Everlasting Bouquets 💐</span>
                  <ArrowRight size={14} className="text-[#D87D82]" />
                </button>
                <button
                  onClick={() => {
                    onNavigateSection('charms');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-1 hover:text-[#D87D82] transition-colors flex items-center justify-between"
                >
                  <span>Keychains & Charms 🌟</span>
                  <ArrowRight size={14} className="text-[#D87D82]" />
                </button>
                <button
                  onClick={() => {
                    onNavigateSection('story');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-1 hover:text-[#D87D82] transition-colors flex items-center justify-between"
                >
                  <span>About Our Dhubri Atelier</span>
                  <ArrowRight size={14} className="text-[#D87D82]" />
                </button>
                <button
                  onClick={() => {
                    onNavigateSection('reviews');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-1 hover:text-[#D87D82] transition-colors flex items-center justify-between"
                >
                  <span>Customer Love & Reviews 🌷</span>
                  <ArrowRight size={14} className="text-[#D87D82]" />
                </button>

                <div className="pt-3 border-t border-[#EDE0D4] flex flex-col gap-2">
                  <button
                    onClick={() => {
                      onOpenCustomOrder();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-full bg-[#3D2E28] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={13} className="text-[#D87D82]" />
                    <span>Request Custom Crochet Order</span>
                  </button>

                  <a
                    href="https://www.instagram.com/cozy_knot18"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-full bg-[#FAF0E6] text-[#63493E] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E7D7C8]"
                  >
                    <Instagram size={14} />
                    <span>Visit @cozy_knot18 Instagram</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
