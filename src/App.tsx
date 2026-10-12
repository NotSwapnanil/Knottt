import React, { useState, useEffect, useMemo } from 'react';
import { Product } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrandStorySection } from './components/BrandStorySection';
import { ReviewsSection } from './components/ReviewsSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { InterestModal } from './components/InterestModal';
import { CustomOrderModal } from './components/CustomOrderModal';
import { AdminPage } from './pages/AdminPage';
import { CozyLogo } from './components/CozyLogo';
import { motion, AnimatePresence } from 'motion/react';
import {
  Instagram,
  Heart,
  Sparkles,
  MapPin,
  Lock,
  Search,
  RefreshCw,
  ShoppingBag,
  ArrowUp,
  Filter
} from 'lucide-react';

export default function App() {
  // Navigation: View 'shop' or 'admin'
  const [currentRoute, setCurrentRoute] = useState<'shop' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') return 'admin';
    }
    return 'shop';
  });

  // Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'soldOut'>('all');

  // Modals
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [selectedProductForInterest, setSelectedProductForInterest] = useState<Product | null>(null);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);

  // Sync route with URL
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('shop');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateTo = (route: 'shop' | 'admin') => {
    setCurrentRoute(route);
    if (route === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'bouquets') {
      setActiveCategory('bouquets');
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'charms') {
      setActiveCategory('keychains');
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch live products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products from server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Real-time synchronization every 8 seconds
    const timer = setInterval(fetchProducts, 8000);
    return () => clearInterval(timer);
  }, []);

  // Update local product after interest recorded
  const handleInterestSubmitted = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    if (selectedProductForDetails?.id === updatedProduct.id) {
      setSelectedProductForDetails(updatedProduct);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      const isSoldOut = item.isSoldOut || item.stock === 0;
      if (stockFilter === 'inStock' && isSoldOut) return false;
      if (stockFilter === 'soldOut' && !isSoldOut) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }

      return true;
    });
  }, [products, activeCategory, stockFilter, searchQuery]);

  const totalInterestsCount = useMemo(() => {
    return products.reduce((acc, curr) => acc + (curr.interestsCount || 0), 0);
  }, [products]);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'bouquets', label: 'Floral Bouquets 💐' },
    { id: 'keychains', label: 'Keychains & Charms 🌟' },
    { id: 'hair', label: 'Hair Accessories 🎀' },
  ];

  // If on /admin page, render Admin Portal
  if (currentRoute === 'admin') {
    return (
      <AdminPage
        onBackToShop={() => navigateTo('shop')}
        onRefreshShopData={fetchProducts}
      />
    );
  }

  // High-End Website Storefront
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#3D2E28] flex flex-col font-sans selection:bg-[#F3C5C5] selection:text-[#3D2E28]">
      {/* Elevated Navigation Bar */}
      <Navbar
        onOpenCustomOrder={() => setIsCustomOrderOpen(true)}
        onNavigateAdmin={() => navigateTo('admin')}
        onNavigateSection={handleNavigateSection}
        isAdmin={Boolean(localStorage.getItem('cozy_admin_token'))}
        totalInterestsCount={totalInterestsCount}
      />

      {/* Website Hero with Animations */}
      <HeroSection
        onExploreClick={() => handleNavigateSection('catalog')}
        onOpenCustomOrder={() => setIsCustomOrderOpen(true)}
        totalProductsCount={products.length}
        totalInterestsCount={totalInterestsCount}
      />

      {/* The Permanent Collection / Catalog Section */}
      <section id="catalog" className="pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#EDE1D6]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E6] text-[#D87D82] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={12} /> The Catalog
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3D2E28]">
              Handcrafted Creations
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B63] mt-1">
              Select any piece to inspect details or request restocks on sold-out creations.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89891]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by flower or charm..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-[#EDE2D7] bg-white text-xs text-[#3D2E28] placeholder-[#B5A59E] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/30 shadow-2xs"
            />
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Animated Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive ? 'text-white' : 'text-[#6F5B53] hover:text-[#3D2E28] bg-white border border-[#EDE2D7]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-[#3D2E28] rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stock Filter Segmented Control */}
          <div className="flex items-center bg-[#EFE5DB] p-1 rounded-full text-xs font-semibold shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                stockFilter === 'all'
                  ? 'bg-white text-[#3D2E28] shadow-2xs font-bold'
                  : 'text-[#7D6B63] hover:text-[#3D2E28]'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setStockFilter('inStock')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                stockFilter === 'inStock'
                  ? 'bg-white text-[#3D2E28] shadow-2xs font-bold'
                  : 'text-[#7D6B63] hover:text-[#3D2E28]'
              }`}
            >
              In Stock Only
            </button>
            <button
              onClick={() => setStockFilter('soldOut')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                stockFilter === 'soldOut'
                  ? 'bg-white text-[#3D2E28] shadow-2xs font-bold'
                  : 'text-[#7D6B63] hover:text-[#3D2E28]'
              }`}
            >
              Sold Out (Queue)
            </button>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <RefreshCw size={28} className="animate-spin text-[#D87D82] mb-3" />
            <p className="font-serif italic text-sm text-[#7B6861]">
              Unpacking handcrafted creations...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white/70 rounded-3xl border border-[#EDE2D7]">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#FAF0E6] text-[#A68F85] flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3D2E28] mb-1">
              No matching pieces in this view
            </h3>
            <p className="text-xs text-[#8C7A73] max-w-sm mx-auto mb-4">
              Try resetting your category or stock filter. Or commission a bespoke piece!
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setStockFilter('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-full bg-[#FAF4EE] hover:bg-[#F2E8DF] border border-[#E5DACF] text-xs font-semibold text-[#543F36]"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsCustomOrderOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#3D2E28] text-white text-xs font-semibold hover:bg-[#251A16]"
              >
                Request Custom Piece
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onExpressInterest={(p) => setSelectedProductForInterest(p)}
                onViewDetails={(p) => setSelectedProductForDetails(p)}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* The Atelier Story Narrative */}
      <BrandStorySection onOpenCustomOrder={() => setIsCustomOrderOpen(true)} />

      {/* Customer Testimonials & Reviews */}
      <ReviewsSection />

      {/* High-End Website Footer */}
      <footer className="mt-auto bg-[#F4ECE3] border-t border-[#E8DFC8] pt-16 pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-3">
              <CozyLogo size={46} />
              <div>
                <span className="font-serif text-xl font-bold text-[#3D2E28]">
                  Cozy Knot Atelier
                </span>
                <p className="text-[11px] text-[#8C7A73]">Handmade in Dhubri, Assam</p>
              </div>
            </div>
            <p className="text-xs text-[#7B6861] leading-relaxed max-w-sm mb-5">
              Everlasting botanicals and whimsical miniature amigurumi crafted with 100% milk cotton yarn. Mindfully made to cherish for a lifetime.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/cozy_knot18"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#3D2E28] text-white text-xs font-semibold hover:bg-[#251A16] transition-colors shadow-2xs"
              >
                <Instagram size={13} /> @cozy_knot18
              </a>
              <span className="text-xs text-[#9E8B83]">· Direct Instagram Orders</span>
            </div>
          </div>

          {/* Nav Col */}
          <div className="md:col-span-3 text-xs text-[#6F5B53]">
            <h4 className="font-serif font-bold text-sm text-[#3D2E28] mb-3">
              Studio Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigateSection('catalog')}
                  className="hover:text-[#D87D82] transition-colors"
                >
                  View Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigateSection('bouquets')}
                  className="hover:text-[#D87D82] transition-colors"
                >
                  Everlasting Bouquets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigateSection('charms')}
                  className="hover:text-[#D87D82] transition-colors"
                >
                  Keychains & Charms
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigateSection('story')}
                  className="hover:text-[#D87D82] transition-colors"
                >
                  Our Slow Craft Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCustomOrderOpen(true)}
                  className="hover:text-[#D87D82] transition-colors"
                >
                  Bespoke Commissions
                </button>
              </li>
            </ul>
          </div>

          {/* Admin & Atelier Col */}
          <div className="md:col-span-4 text-xs text-[#6F5B53]">
            <h4 className="font-serif font-bold text-sm text-[#3D2E28] mb-3">
              Studio Operations
            </h4>
            <div className="p-4 rounded-2xl bg-white/70 border border-[#EDE2D7] mb-3">
              <p className="font-semibold text-[#3D2E28] mb-1 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#D87D82]" /> Dhubri Studio, Assam
              </p>
              <p className="text-[11px] text-[#7B6861] leading-relaxed">
                Pan-India postal shipping with tracked delivery & bubble-wrapped keepsake presentation.
              </p>
            </div>

            <button
              onClick={() => navigateTo('admin')}
              className="inline-flex items-center gap-1.5 text-xs text-[#8C7A73] hover:text-[#3D2E28] transition-colors font-medium"
            >
              <Lock size={12} /> Access /admin Inventory & Demand Radar
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9E8B83]">
          <p>© {new Date().getFullYear()} Cozy Knot Studio. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Lovingly crafted with <Heart size={12} className="text-[#D87D82]" fill="#D87D82" /> in Dhubri, Assam
          </p>
        </div>
      </footer>

      {/* Modals with AnimatePresence */}
      <AnimatePresence>
        {selectedProductForDetails && (
          <ProductDetailsModal
            product={selectedProductForDetails}
            onClose={() => setSelectedProductForDetails(null)}
            onExpressInterest={(p) => {
              setSelectedProductForDetails(null);
              setSelectedProductForInterest(p);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProductForInterest && (
          <InterestModal
            product={selectedProductForInterest}
            isOpen={Boolean(selectedProductForInterest)}
            onClose={() => setSelectedProductForInterest(null)}
            onInterestSubmitted={handleInterestSubmitted}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCustomOrderOpen && (
          <CustomOrderModal
            isOpen={isCustomOrderOpen}
            onClose={() => setIsCustomOrderOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
