import React, { useState, useEffect } from 'react';
import { Product, InterestRequest, CustomOrderInquiry, AdminStats } from '../types';
import { CozyLogo } from '../components/CozyLogo';
import {
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Heart,
  TrendingUp,
  Package,
  Layers,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Clock,
  Eye,
  Check
} from 'lucide-react';

interface AdminPageProps {
  onBackToShop: () => void;
  onRefreshShopData: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onBackToShop,
  onRefreshShopData,
}) => {
  // Auth state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cozy_admin_token'));
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Data
  const [activeTab, setActiveTab] = useState<'inventory' | 'demand' | 'inquiries'>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [demandLeaderboard, setDemandLeaderboard] = useState<Product[]>([]);
  const [interests, setInterests] = useState<InterestRequest[]>([]);
  const [inquiries, setInquiries] = useState<CustomOrderInquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Edit / Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<'bouquets' | 'keychains' | 'hair' | 'custom'>('keychains');
  const [formPrice, setFormPrice] = useState('249');
  const [formOriginalPrice, setFormOriginalPrice] = useState('299');
  const [formStock, setFormStock] = useState('3');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formTags, setFormTags] = useState('Handmade, Milk Cotton');
  const [formColors, setFormColors] = useState('Blush Pink, Cream White');

  // Load dashboard data if token is present
  const fetchDashboardData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      // 1. Fetch dashboard stats & lists
      const dashRes = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!dashRes.ok) {
        if (dashRes.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Failed to fetch dashboard');
      }
      const dashData = await dashRes.json();
      setStats(dashData.stats);
      setDemandLeaderboard(dashData.demandLeaderboard || []);
      setInterests(dashData.interests || []);
      setInquiries(dashData.inquiries || []);

      // 2. Fetch full products list
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      localStorage.setItem('cozy_admin_token', data.token);
      setToken(data.token);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFillDemoCreds = () => {
    setUsername('cozy_knot18');
    setPassword('cozyknot@dhubri18');
  };

  const handleLogout = () => {
    localStorage.removeItem('cozy_admin_token');
    setToken(null);
  };

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Toggle Sold Out / In Stock
  const handleToggleStock = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}/toggle-stock`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to toggle stock');
      const data = await res.json();
      setProducts(prev => prev.map(p => p.id === product.id ? data.product : p));
      showNotification(`"${product.title}" is now ${data.product.isSoldOut ? 'Sold Out' : 'In Stock'}`);
      fetchDashboardData();
      onRefreshShopData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Adjust stock quantity by step
  const handleAdjustStock = async (product: Product, delta: number) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    try {
      const res = await fetch(`/api/admin/products/${product.id}/stock`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ stock: newStock })
      });
      if (!res.ok) throw new Error('Failed to update stock');
      const data = await res.json();
      setProducts(prev => prev.map(p => p.id === product.id ? data.product : p));
      fetchDashboardData();
      onRefreshShopData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Quick Restock from Demand Leaderboard
  const handleQuickRestock = async (productId: string, units: number = 3) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stock: units, isSoldOut: false })
      });
      if (!res.ok) throw new Error('Failed to restock');
      const data = await res.json();
      setProducts(prev => prev.map(p => p.id === productId ? data.product : p));
      showNotification(`Restocked ${units} units of ${data.product.title}!`);
      fetchDashboardData();
      onRefreshShopData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      setProducts(prev => prev.filter(p => p.id !== id));
      showNotification(`Deleted "${title}"`);
      fetchDashboardData();
      onRefreshShopData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update inquiry status
  const handleUpdateInquiryStatus = async (id: string, status: 'new' | 'contacted' | 'completed') => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update inquiry');
      fetchDashboardData();
      showNotification(`Order inquiry marked as ${status}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Save new or edited product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formTitle,
      subtitle: formSubtitle,
      category: formCategory,
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      stock: Number(formStock),
      isSoldOut: Number(formStock) <= 0,
      description: formDescription,
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
      tags: formTags.split(',').map(s => s.trim()).filter(Boolean),
      colorOptions: formColors.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (editingProduct) {
        // Edit existing
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to update product');
        showNotification(`Updated "${formTitle}"`);
      } else {
        // Create new
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to create product');
        showNotification(`Created "${formTitle}"`);
      }

      setIsAddModalOpen(false);
      setEditingProduct(null);
      fetchDashboardData();
      onRefreshShopData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('keychains');
    setFormPrice('249');
    setFormOriginalPrice('299');
    setFormStock('3');
    setFormDescription('Lovingly crocheted with 100% premium milk cotton yarn.');
    setFormImageUrl('https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80');
    setFormTags('Handmade, Milk Cotton');
    setFormColors('Pastel Pink, Cream White');
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormSubtitle(p.subtitle || '');
    setFormCategory(p.category);
    setFormPrice(String(p.price));
    setFormOriginalPrice(p.originalPrice ? String(p.originalPrice) : '');
    setFormStock(String(p.stock));
    setFormDescription(p.description);
    setFormImageUrl(p.imageUrl);
    setFormTags((p.tags || []).join(', '));
    setFormColors((p.colorOptions || []).join(', '));
    setIsAddModalOpen(true);
  };

  // Reset database back to seed
  const handleResetData = async () => {
    if (!window.confirm('Reset inventory back to initial default seed?')) return;
    try {
      const res = await fetch('/api/admin/reset-data', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showNotification('Database reset to initial catalog');
        fetchDashboardData();
        onRefreshShopData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EDE2D7] shadow-xl p-7 sm:p-9">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <CozyLogo size={68} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCEAE8] text-[#D87D82] text-xs font-semibold uppercase tracking-wider mb-2">
              <Lock size={12} /> Admin Inventory Portal
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#3D2E28]">
              Cozy Knot 18
            </h1>
            <p className="text-xs text-[#8C7A73] mt-1">
              Restricted management area for inventory, sold-out toggles, and user restock demand.
            </p>
          </div>

          {/* Quick Demo Helper Box */}
          <div className="bg-[#FAF4EE] rounded-2xl p-4 border border-[#EBE0D5] mb-6 text-xs text-[#6F5B53]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-[#3D2E28]">Admin Credentials:</span>
              <button
                type="button"
                onClick={handleFillDemoCreds}
                className="text-[11px] font-bold text-[#D87D82] hover:underline"
              >
                Auto-fill
              </button>
            </div>
            <p><strong>User ID:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-[#3D2E28]">cozy_knot18</code></p>
            <p className="mt-1"><strong>Password:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-[#3D2E28]">cozyknot@dhubri18</code></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A453D] mb-1">
                Admin User ID
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cozy_knot18"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C9] bg-[#FFFDFB] text-sm text-[#3D2E28] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5A453D] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C9] bg-[#FFFDFB] text-sm text-[#3D2E28] focus:outline-none focus:ring-2 focus:ring-[#D87D82]/40"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-full bg-[#3D2E28] text-white text-sm font-semibold hover:bg-[#281D19] transition-colors shadow-xs disabled:opacity-70 mt-2"
            >
              {authLoading ? 'Verifying...' : 'Sign In to Studio Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F0E6DC] text-center">
            <button
              onClick={onBackToShop}
              className="inline-flex items-center gap-1.5 text-xs text-[#8C7A73] hover:text-[#3D2E28] transition-colors font-medium"
            >
              <ArrowLeft size={14} /> Back to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LOGGED-IN ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EFE5DB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CozyLogo size={40} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base sm:text-lg text-[#3D2E28]">
                  Cozy Knot Studio Admin
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8F3EA] text-[#42734C]">
                  Live DB Active
                </span>
              </div>
              <p className="text-[11px] text-[#8C7A73] hidden sm:block">
                Inventory · Demand Radar · Dhubri Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToShop}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF4EE] hover:bg-[#F2E8DF] border border-[#E5DACF] text-xs font-semibold text-[#543F36] transition-colors"
            >
              <Eye size={14} />
              <span>View Live Shop</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-[#9E8B83] hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{actionSuccess}</span>
            </div>
          </div>
        )}

        {/* Real-Time Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-[#EDE2D7] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#8C7A73] mb-1">
              <span>Total Items</span>
              <Package size={14} className="text-[#3D2E28]" />
            </div>
            <p className="text-2xl font-bold text-[#3D2E28]">{stats?.totalProducts || products.length}</p>
            <p className="text-[11px] text-[#8C7A73] mt-0.5">Active in catalog</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EDE2D7] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#52795A] mb-1">
              <span>In Stock</span>
              <Layers size={14} className="text-[#52795A]" />
            </div>
            <p className="text-2xl font-bold text-[#3D2E28]">{stats?.inStockCount ?? 0}</p>
            <p className="text-[11px] text-[#52795A] mt-0.5">Ready for shipment</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EDE2D7] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#D87D82] mb-1">
              <span>Sold Out</span>
              <ShoppingBag size={14} className="text-[#D87D82]" />
            </div>
            <p className="text-2xl font-bold text-[#D87D82]">{stats?.soldOutCount ?? 0}</p>
            <p className="text-[11px] text-[#D87D82] mt-0.5">Awaiting artisan batch</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EDE2D7] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#D87D82] mb-1">
              <span>User Interests</span>
              <Heart size={14} className="text-[#D87D82]" fill="#D87D82" />
            </div>
            <p className="text-2xl font-bold text-[#3D2E28]">{stats?.totalInterests ?? 0}</p>
            <p className="text-[11px] text-[#8C7A73] mt-0.5">Customer requests logged</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EDE2D7] shadow-2xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-xs text-[#7B655C] mb-1">
              <span>Custom Inquiries</span>
              <MessageSquare size={14} className="text-[#7B655C]" />
            </div>
            <p className="text-2xl font-bold text-[#3D2E28]">{inquiries.length}</p>
            <p className="text-[11px] text-[#8C7A73] mt-0.5">Special orders</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1.5 bg-[#EDE2D7] p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'inventory'
                  ? 'bg-white text-[#3D2E28] shadow-2xs'
                  : 'text-[#6F5C53] hover:text-[#3D2E28]'
              }`}
            >
              Inventory Management ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('demand')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'demand'
                  ? 'bg-white text-[#3D2E28] shadow-2xs'
                  : 'text-[#6F5C53] hover:text-[#3D2E28]'
              }`}
            >
              <TrendingUp size={13} className="text-[#D87D82]" />
              Demand Radar ({interests.length})
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'inquiries'
                  ? 'bg-white text-[#3D2E28] shadow-2xs'
                  : 'text-[#6F5C53] hover:text-[#3D2E28]'
              }`}
            >
              Custom Inquiries ({inquiries.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl bg-white border border-[#E0D5C9] text-[#7B6861] hover:text-[#3D2E28] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loadingData ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3D2E28] text-white text-xs font-semibold hover:bg-[#281D19] transition-colors shadow-2xs"
            >
              <Plus size={15} />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: INVENTORY MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-[#EDE2D7] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#F0E6DD] flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-lg text-[#3D2E28]">
                  Products & Stock Control
                </h2>
                <p className="text-xs text-[#8C7A73]">
                  Toggle "Sold Out" status, adjust unit counts, edit prices or create new listings.
                </p>
              </div>
              <button
                onClick={handleResetData}
                className="text-[11px] text-[#A6958E] hover:text-[#3D2E28] underline"
              >
                Reset Initial Data
              </button>
            </div>

            <div className="divide-y divide-[#F2E9E1] overflow-x-auto">
              {products.map((product) => {
                const isSoldOut = product.isSoldOut || product.stock === 0;
                return (
                  <div
                    key={product.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FFFDFB] transition-colors"
                  >
                    {/* Product Basic Info */}
                    <div className="flex items-center gap-3.5 min-w-[240px]">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#EAE0D5] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-sm text-[#3D2E28]">
                            {product.title}
                          </h3>
                          {product.interestsCount > 0 && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#D87D82] bg-[#FCEAE8] px-2 py-0.5 rounded-full">
                              <Heart size={10} fill="#D87D82" /> {product.interestsCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#8C7A73] capitalize mt-0.5">
                          {product.category} · ₹{product.price}
                        </p>
                      </div>
                    </div>

                    {/* Stock Stepper Controls */}
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
                      {/* Sold Out / In Stock Quick Toggle Switch */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(product)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            !isSoldOut ? 'bg-[#52795A]' : 'bg-[#D87D82]'
                          }`}
                          aria-label="Toggle Stock"
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              !isSoldOut ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-semibold ${!isSoldOut ? 'text-[#52795A]' : 'text-[#D87D82]'}`}>
                          {!isSoldOut ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>

                      {/* Stock units adjuster */}
                      <div className="flex items-center gap-1 bg-[#FAF4EE] p-1 rounded-xl border border-[#EDE2D7]">
                        <button
                          onClick={() => handleAdjustStock(product, -1)}
                          disabled={product.stock <= 0}
                          className="w-7 h-7 rounded-lg bg-white text-[#3D2E28] font-bold text-xs flex items-center justify-center hover:bg-[#F2E7DC] disabled:opacity-40 transition-colors shadow-2xs"
                        >
                          -
                        </button>
                        <span className="w-9 text-center text-xs font-bold text-[#3D2E28]">
                          {product.stock}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(product, 1)}
                          className="w-7 h-7 rounded-lg bg-white text-[#3D2E28] font-bold text-xs flex items-center justify-center hover:bg-[#F2E7DC] transition-colors shadow-2xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-xl text-[#7A6760] hover:text-[#3D2E28] hover:bg-[#F4ECE3] transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.title)}
                          className="p-2 rounded-xl text-[#7A6760] hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: DEMAND RADAR & USER INTERESTS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'demand' && (
          <div className="space-y-6">
            {/* Restock Priority Leaderboard */}
            <div className="bg-white rounded-3xl border border-[#EDE2D7] p-5 sm:p-7 shadow-xs">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#D87D82] uppercase tracking-wider mb-1">
                    <TrendingUp size={14} /> Production Queue
                  </div>
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-[#3D2E28]">
                    Most Requested by Cozy Knot Visitors
                  </h2>
                  <p className="text-xs text-[#8C7A73]">
                    These are the designs customers expressed interest in so you know exactly which yarn colors to spin next!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demandLeaderboard.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FFFDFB] border border-[#EFE5DB] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#FAF0E6] text-[#7A5B51] font-bold text-xs flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-[#EFE5DB] shrink-0"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-xs text-[#3D2E28] line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-[#D87D82] flex items-center gap-1">
                            <Heart size={10} fill="#D87D82" /> {item.interestsCount} requests
                          </span>
                          <span className="text-[10px] text-[#A6958E]">
                            {item.isSoldOut ? 'Sold Out' : `${item.stock} in stock`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickRestock(item.id, 3)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#3D2E28] text-white text-[11px] font-semibold hover:bg-[#281D19] transition-colors shrink-0"
                    >
                      + Craft 3
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed User Interest Ledger */}
            <div className="bg-white rounded-3xl border border-[#EDE2D7] shadow-xs overflow-hidden">
              <div className="p-5 border-b border-[#F0E6DD]">
                <h3 className="font-serif font-bold text-base text-[#3D2E28]">
                  Customer Interest Ledger ({interests.length} total)
                </h3>
                <p className="text-xs text-[#8C7A73]">
                  Direct feedback submitted by users via the "I'm Interested" button.
                </p>
              </div>

              {interests.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#9E8B83]">
                  No interest records logged yet. As users tap "Interested" on items, they appear here!
                </div>
              ) : (
                <div className="divide-y divide-[#F2E9E1] max-h-[500px] overflow-y-auto">
                  {interests.map((int) => (
                    <div key={int.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#3D2E28]">
                            {int.userName || 'Cozy Admirer'}
                          </span>
                          <span className="text-xs text-[#D87D82] font-medium">
                            {int.contact}
                          </span>
                          <span className="text-[10px] text-[#A6958E]">
                            {new Date(int.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#6F5B53] mt-1">
                          Product: <strong className="text-[#3D2E28]">{int.productTitle}</strong>
                        </p>
                        {int.note && (
                          <p className="text-xs italic text-[#8A756D] mt-1 bg-[#FAF4EE] p-2 rounded-lg border border-[#EDE2D7]">
                            "{int.note}"
                          </p>
                        )}
                      </div>

                      <a
                        href="https://www.instagram.com/cozy_knot18"
                        target="_blank"
                        rel="noreferrer"
                        className="self-start sm:self-center px-3 py-1 rounded-full bg-[#FAF0E6] text-[#6A4D42] text-[11px] font-semibold hover:bg-[#F2E5D7] flex items-center gap-1"
                      >
                        <ExternalLink size={11} /> Reach Out
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: CUSTOM INQUIRIES */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-[#EDE2D7] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#F0E6DD]">
              <h2 className="font-serif font-bold text-lg text-[#3D2E28]">
                Custom Gift Orders & Inquiries
              </h2>
              <p className="text-xs text-[#8C7A73]">
                Requests sent through the website custom order builder.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#9E8B83]">
                No custom inquiries yet.
              </div>
            ) : (
              <div className="divide-y divide-[#F2E9E1]">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#3D2E28]">{inq.customerName}</span>
                        <span className="text-xs text-[#D87D82] font-semibold">{inq.contact}</span>
                        <span className="text-[10px] text-[#A6958E]">
                          {new Date(inq.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#523E36]">
                        <strong>Item Type:</strong> {inq.productInterest} · <strong>Palette:</strong> {inq.colorPreference}
                      </p>
                      {inq.deadline && (
                        <p className="text-xs text-[#D87D82] font-medium">
                          <strong>Needed by:</strong> {inq.deadline}
                        </p>
                      )}
                      {inq.message && (
                        <p className="text-xs text-[#6F5C53] bg-[#FAF4EE] p-2.5 rounded-xl border border-[#EDE2D7] mt-1">
                          {inq.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdateInquiryStatus(inq.id, 'contacted')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          inq.status === 'contacted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#F4ECE3] text-[#6F5B53] hover:bg-[#EAE0D5]'
                        }`}
                      >
                        Contacted
                      </button>
                      <button
                        onClick={() => handleUpdateInquiryStatus(inq.id, 'completed')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          inq.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#F4ECE3] text-[#6F5B53] hover:bg-[#EAE0D5]'
                        }`}
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ---------------------------------------------------- */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ---------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#EFE5DB] shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-serif font-bold text-[#3D2E28] mb-1">
              {editingProduct ? 'Edit Crochet Product' : 'Add New Crochet Creation'}
            </h2>
            <p className="text-xs text-[#8C7A73] mb-5">
              Fill in product details. Changes update the database in real-time.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A453D] mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Lavender Tulip Trio"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E0D5C9] text-xs text-[#3D2E28]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A453D] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E0D5C9] text-xs text-[#3D2E28]"
                  >
                    <option value="bouquets">Floral Bouquets</option>
                    <option value="keychains">Keychains & Charms</option>
                    <option value="hair">Hair & Accessories</option>
                    <option value="custom">Custom Gifts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A453D] mb-1">Subtitle / Short Tagline</label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="e.g. Handcrafted with milk cotton yarn"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E0D5C9] text-xs text-[#3D2E28]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A453D] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E0D5C9] text-xs text-[#3D2E28]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A453D] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E0D5C9] text-xs text-[#3D2E28]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A453D] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E0D5C9] text-xs text-[#3D2E28]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A453D] mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E0D5C9] text-xs text-[#3D2E28]"
                />
                <div className="flex gap-2 mt-1.5 overflow-x-auto pb-1 text-[10px] text-[#8C7A73]">
                  <span>Presets:</span>
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80')}
                    className="text-[#D87D82] underline"
                  >
                    Tulips
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80')}
                    className="text-[#D87D82] underline"
                  >
                    Sunflowers
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')}
                    className="text-[#D87D82] underline"
                  >
                    Keychains
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A453D] mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Handmade, Bestseller"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E0D5C9] text-xs text-[#3D2E28]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A453D] mb-1">Color Options (comma separated)</label>
                  <input
                    type="text"
                    value={formColors}
                    onChange={(e) => setFormColors(e.target.value)}
                    placeholder="Blush Pink, Cream, Yellow"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E0D5C9] text-xs text-[#3D2E28]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A453D] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E0D5C9] text-xs text-[#3D2E28] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#3D2E28] text-white text-xs font-semibold hover:bg-[#281D19] transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#FAF4EE] text-[#7A6760] text-xs font-medium hover:bg-[#F0E6DC] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
