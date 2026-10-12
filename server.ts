import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Hardcoded Admin Credentials
export const ADMIN_CREDENTIALS = {
  username: 'cozy_knot18',
  password: 'cozyknot@dhubri18',
  token: 'cozy_session_token_dhubri_2024_secure'
};

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  category: 'bouquets' | 'keychains' | 'hair' | 'custom';
  price: number;
  originalPrice?: number;
  stock: number;
  isSoldOut: boolean;
  interestsCount: number;
  tags: string[];
  imageUrl: string;
  colorOptions?: string[];
  description: string;
  featured?: boolean;
  createdAt: string;
}

export interface InterestRequest {
  id: string;
  productId: string;
  productTitle: string;
  userName?: string;
  contact?: string; // IG handle, phone or email
  note?: string;
  timestamp: string;
}

export interface CustomOrderInquiry {
  id: string;
  customerName: string;
  contact: string; // Instagram handle or phone
  productInterest: string;
  colorPreference: string;
  deadline?: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  timestamp: string;
}

interface StoreData {
  products: Product[];
  interests: InterestRequest[];
  inquiries: CustomOrderInquiry[];
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'pastel-tulip-bouquet',
    title: 'Pastel Dream Tulip Bouquet',
    subtitle: 'Everlasting hand-knitted 9-stem pastel tulips',
    category: 'bouquets',
    price: 699,
    originalPrice: 849,
    stock: 4,
    isSoldOut: false,
    interestsCount: 29,
    tags: ['Bestseller', 'Milk Cotton', 'Gift Ready'],
    imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
    colorOptions: ['Pastel Mix', 'Blush Pink & White', 'Lilac & Butter Yellow'],
    description: 'Delicately crocheted with ultra-soft milk cotton yarn. Features 9 vibrant yet gentle pastel tulips that never wilt. Wrapped in premium blush florist paper with a pearlescent white satin ribbon.',
    featured: true,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'rustic-sunflower-bouquet',
    title: 'Rustic Sunshine Sunflower Bouquet',
    subtitle: 'Textured golden sunflower with chamomile daisies in burlap',
    category: 'bouquets',
    price: 599,
    originalPrice: 720,
    stock: 0,
    isSoldOut: true,
    interestsCount: 44,
    tags: ['Most Loved', 'Sold Out', 'Signature Piece'],
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    colorOptions: ['Classic Sunflower', 'Sunflower & Baby Breath'],
    description: 'Our signature golden sunflower handcrafted with textured seed stitch center, surrounded by dainty white daisies and wrapped in eco-friendly rustic jute burlap with a crimson bow.',
    featured: true,
    createdAt: '2026-03-02T10:00:00Z',
  },
  {
    id: 'celestial-sun-moon',
    title: 'Celestial Sun & Moon Keychain Duo',
    subtitle: 'Spiral golden sun & midnight navy crescent pair',
    category: 'keychains',
    price: 299,
    originalPrice: 349,
    stock: 5,
    isSoldOut: false,
    interestsCount: 22,
    tags: ['Couple Set', 'Top Rated'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    colorOptions: ['Sun & Moon Duo', 'Solo Sun', 'Solo Moon'],
    description: 'A cosmic pair! One radiant textured swirl sun with scalloped sunburst rays, and one deep night crescent moon with fine hand-stitched white constellation accents. Includes sturdy stainless keyrings.',
    featured: true,
    createdAt: '2026-03-03T10:00:00Z',
  },
  {
    id: 'jellyfish-amigurumi-charm',
    title: 'Pastel Jellyfish Ocean Charm',
    subtitle: 'Whimsical baby jellyfish with flowing bouncy curly tentacles',
    category: 'keychains',
    price: 249,
    originalPrice: 299,
    stock: 3,
    isSoldOut: false,
    interestsCount: 18,
    tags: ['Cute Amigurumi', 'Bag Charm'],
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    colorOptions: ['Blush Pink & Cream', 'Deep Ocean & Snow', 'Lavender & Mint'],
    description: 'Adorable bell-capped miniature jellyfish with bouncy spiraling tentacles. Includes silver swivel snap hook for tote bags or keychains.',
    featured: false,
    createdAt: '2026-03-04T10:00:00Z',
  },
  {
    id: 'swirl-cake-roll-charm',
    title: 'Sweet Patisserie Swirl Cake Keychain',
    subtitle: 'Miniature Swiss roll dessert charm with bright cherry topper',
    category: 'keychains',
    price: 199,
    originalPrice: 249,
    stock: 0,
    isSoldOut: true,
    interestsCount: 38,
    tags: ['Dessert Series', 'Sold Out', 'Restock Soon'],
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    colorOptions: ['Strawberry Swirl', 'Matcha Cream Swirl', 'Chocolate Cocoa'],
    description: 'Sweet bakery treat lovers! Crocheted spiral roll cakes with piped cream layers and a sweet red cherry topper. Lightweight, soft and sturdy.',
    featured: true,
    createdAt: '2026-03-05T10:00:00Z',
  },
  {
    id: 'double-cherry-charm',
    title: 'Sweet Ruby Cherry Bag Charm',
    subtitle: 'Plump dual red cherry pair with leafy stem & loop',
    category: 'keychains',
    price: 179,
    originalPrice: 220,
    stock: 8,
    isSoldOut: false,
    interestsCount: 14,
    tags: ['Trending', 'Under ₹200'],
    imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    colorOptions: ['Cherry Red & Sage'],
    description: 'A delightful duo of plump deep red cherries crocheted on a sturdy forest green stalk with sculpted leaf. Perfect clip for tote bags, backpacks, and car keys.',
    featured: false,
    createdAt: '2026-03-06T10:00:00Z',
  },
  {
    id: 'puffy-star-charm',
    title: 'Sunshine Star Pocket Charm',
    subtitle: 'Soft 3D dimensional star with textured center spiral',
    category: 'keychains',
    price: 169,
    originalPrice: 199,
    stock: 6,
    isSoldOut: false,
    interestsCount: 12,
    tags: ['Good Luck', 'Handmade'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    colorOptions: ['Golden Yellow', 'Pastel Pink', 'Sky Blue'],
    description: 'Warm buttercup yellow five-point star with a cozy spiral texture. Plumply stuffed with premium hypoallergenic fiberfill.',
    featured: false,
    createdAt: '2026-03-07T10:00:00Z',
  },
  {
    id: 'plumeria-hair-clips',
    title: 'Plumeria Blossom Hair Clip Set',
    subtitle: 'Hand-crocheted tropical 5-petal flower clips (Pair)',
    category: 'hair',
    price: 229,
    originalPrice: 280,
    stock: 3,
    isSoldOut: false,
    interestsCount: 26,
    tags: ['Hair Aesthetic', 'Cottagecore'],
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    colorOptions: ['Blush Pink & Cream Vanilla', 'Sunset Peach Pair'],
    description: 'Pair of delicate blooming plumerias in peach blush and vanilla cream. Mounted on damage-free French snap clips for all-day hold without pulling hair.',
    featured: false,
    createdAt: '2026-03-08T10:00:00Z',
  },
  {
    id: 'burgundy-knit-bow',
    title: 'Burgundy Velvet Knit Hair Bow',
    subtitle: 'Rich wine-red oversized hand-knitted ribbon hair bow',
    category: 'hair',
    price: 189,
    originalPrice: 240,
    stock: 0,
    isSoldOut: true,
    interestsCount: 33,
    tags: ['Coquette Style', 'Sold Out'],
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    colorOptions: ['Deep Burgundy', 'Blush Rose', 'Espresso Brown'],
    description: 'Hand-knit from soft merino-blend crimson yarn. Adds an effortless French coquette or cottagecore touch to half-up hairstyles or ponytails.',
    featured: false,
    createdAt: '2026-03-09T10:00:00Z',
  },
  {
    id: 'solo-sunflower-burlap',
    title: 'Solo Sunshine Burlap Stem',
    subtitle: 'Statement single sunflower wrapped in rustic sackcloth & ribbon',
    category: 'bouquets',
    price: 349,
    originalPrice: 399,
    stock: 4,
    isSoldOut: false,
    interestsCount: 16,
    tags: ['Minimal Bouquet', 'Desk Decor'],
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    colorOptions: ['Crimson Bow', 'Cream Ribbon'],
    description: 'A cheerful solitary sunflower wrapped neatly in authentic natural hessian burlap, finished with a scarlet satin ribbon. Stands beautifully in a bud vase or gift pouch.',
    featured: false,
    createdAt: '2026-03-10T10:00:00Z',
  }
];

// Ensure data folder and file exists
function initStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const content = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.products && Array.isArray(parsed.products)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading store file, reinitializing default data:', err);
  }

  const initialData: StoreData = {
    products: DEFAULT_PRODUCTS,
    interests: [
      {
        id: 'int-1',
        productId: 'rustic-sunflower-bouquet',
        productTitle: 'Rustic Sunshine Sunflower Bouquet',
        userName: 'Aanya Sharma',
        contact: '@aanya_cozy',
        note: 'Need 2 for my sister birthday next week please!',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'int-2',
        productId: 'rustic-sunflower-bouquet',
        productTitle: 'Rustic Sunshine Sunflower Bouquet',
        userName: 'Priya Das',
        contact: '+91 98765 43210',
        note: 'Whenever restocked let me know',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'int-3',
        productId: 'swirl-cake-roll-charm',
        productTitle: 'Sweet Patisserie Swirl Cake Keychain',
        userName: 'Rhea Sen',
        contact: '@rhea_crochet',
        note: 'Matcha green one please!!',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'int-4',
        productId: 'burgundy-knit-bow',
        productTitle: 'Burgundy Velvet Knit Hair Bow',
        userName: 'Megha',
        contact: '@meghak',
        note: 'Loved the wine shade',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      }
    ],
    inquiries: [
      {
        id: 'inq-1',
        customerName: 'Ankita Roy',
        contact: '@ankita_r',
        productInterest: 'Custom Birthday Bouquet',
        colorPreference: 'Pastel Lilac & Butter Yellow',
        deadline: '2026-10-25',
        message: 'Can you do a mix of 5 lavender tulips and 3 daisies?',
        status: 'new',
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      }
    ]
  };

  saveStore(initialData);
  return initialData;
}

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store data:', err);
  }
}

let store: StoreData = initStore();

async function startServer() {
  const app = express();

  app.use(express.json());

  // Middleware for Admin Auth check
  const requireAdminAuth = (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${ADMIN_CREDENTIALS.token}`) {
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Admin access required' });
  };

  // --- PUBLIC API ROUTES ---

  // Get all products
  app.get('/api/products', (req: Request, res: Response) => {
    res.json(store.products);
  });

  // Get single product
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = store.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  // Express Interest in a product
  app.post('/api/products/:id/interest', (req: Request, res: Response) => {
    const product = store.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { userName, contact, note } = req.body || {};

    // Increment interest count
    product.interestsCount = (product.interestsCount || 0) + 1;

    // Record interest inquiry
    const newInterest: InterestRequest = {
      id: `int-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      productTitle: product.title,
      userName: userName?.trim() || 'Cozy Admirer',
      contact: contact?.trim() || 'Instagram Visitor',
      note: note?.trim() || '',
      timestamp: new Date().toISOString(),
    };

    store.interests.unshift(newInterest);
    saveStore(store);

    res.json({
      success: true,
      message: `Interest recorded! Cozy Knot artisan has been notified to make more.`,
      product,
      interest: newInterest,
    });
  });

  // Submit custom order inquiry
  app.post('/api/inquiries', (req: Request, res: Response) => {
    const { customerName, contact, productInterest, colorPreference, deadline, message } = req.body;
    if (!customerName || !contact) {
      return res.status(400).json({ error: 'Name and Instagram handle or phone are required.' });
    }

    const inquiry: CustomOrderInquiry = {
      id: `inq-${Date.now()}`,
      customerName: customerName.trim(),
      contact: contact.trim(),
      productInterest: productInterest || 'Custom Request',
      colorPreference: colorPreference || 'Surprise me / Custom colors',
      deadline: deadline || '',
      message: message?.trim() || '',
      status: 'new',
      timestamp: new Date().toISOString(),
    };

    store.inquiries.unshift(inquiry);
    saveStore(store);

    res.status(201).json({ success: true, inquiry });
  });

  // Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      res.json({
        success: true,
        token: ADMIN_CREDENTIALS.token,
        admin: {
          username: ADMIN_CREDENTIALS.username,
          storeName: 'Cozy Knot 18',
          location: 'Dhubri, Assam',
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid user ID or password' });
    }
  });

  // Verify Admin Token
  app.get('/api/admin/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${ADMIN_CREDENTIALS.token}`) {
      res.json({ valid: true, username: ADMIN_CREDENTIALS.username });
    } else {
      res.status(401).json({ valid: false });
    }
  });

  // --- PROTECTED ADMIN ROUTES ---

  // Admin: Get all stats, interests, inquiries
  app.get('/api/admin/dashboard', requireAdminAuth, (req: Request, res: Response) => {
    const totalProducts = store.products.length;
    const soldOutCount = store.products.filter(p => p.isSoldOut || p.stock === 0).length;
    const totalInterests = store.products.reduce((acc, p) => acc + (p.interestsCount || 0), 0);
    const inStockCount = totalProducts - soldOutCount;

    // Leaderboard of most requested products
    const demandLeaderboard = [...store.products]
      .sort((a, b) => (b.interestsCount || 0) - (a.interestsCount || 0))
      .slice(0, 5);

    res.json({
      stats: {
        totalProducts,
        soldOutCount,
        inStockCount,
        totalInterests,
        totalInquiries: store.inquiries.length,
      },
      demandLeaderboard,
      interests: store.interests,
      inquiries: store.inquiries,
    });
  });

  // Admin: Toggle Sold Out / In Stock status
  app.post('/api/admin/products/:id/toggle-stock', requireAdminAuth, (req: Request, res: Response) => {
    const product = store.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.isSoldOut = !product.isSoldOut;
    if (!product.isSoldOut && product.stock === 0) {
      product.stock = 3; // Default to 3 stock if brought back to in-stock
    } else if (product.isSoldOut) {
      product.stock = 0;
    }

    saveStore(store);
    res.json({ success: true, product });
  });

  // Admin: Update Stock Quantity & Status
  app.patch('/api/admin/products/:id/stock', requireAdminAuth, (req: Request, res: Response) => {
    const product = store.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { stock, isSoldOut } = req.body;
    if (typeof stock === 'number') {
      product.stock = Math.max(0, stock);
      if (product.stock === 0) {
        product.isSoldOut = true;
      } else if (isSoldOut === undefined) {
        product.isSoldOut = false;
      }
    }
    if (typeof isSoldOut === 'boolean') {
      product.isSoldOut = isSoldOut;
      if (isSoldOut && product.stock > 0) {
        product.stock = 0;
      }
    }

    saveStore(store);
    res.json({ success: true, product });
  });

  // Admin: Create New Product
  app.post('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
    const {
      title,
      subtitle,
      category,
      price,
      originalPrice,
      stock,
      description,
      imageUrl,
      tags,
      colorOptions,
      featured,
    } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    const newProduct: Product = {
      id: `item-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle?.trim() || 'Handmade with love',
      category: category || 'keychains',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock ?? 1),
      isSoldOut: Number(stock ?? 1) <= 0,
      interestsCount: 0,
      tags: Array.isArray(tags) ? tags : ['Handmade', 'New'],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
      colorOptions: Array.isArray(colorOptions) ? colorOptions : ['Original'],
      description: description?.trim() || 'Lovingly crocheted using 100% premium milk cotton yarn.',
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    store.products.unshift(newProduct);
    saveStore(store);
    res.status(201).json({ success: true, product: newProduct });
  });

  // Admin: Update Product Details
  app.put('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
    const index = store.products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });

    const current = store.products[index];
    const updated = {
      ...current,
      ...req.body,
      id: current.id, // prevent ID change
      price: req.body.price !== undefined ? Number(req.body.price) : current.price,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : current.stock,
      isSoldOut: req.body.stock !== undefined && Number(req.body.stock) === 0 ? true : Boolean(req.body.isSoldOut ?? current.isSoldOut),
    };

    store.products[index] = updated;
    saveStore(store);
    res.json({ success: true, product: updated });
  });

  // Admin: Delete Product
  app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
    const initialLen = store.products.length;
    store.products = store.products.filter(p => p.id !== req.params.id);
    if (store.products.length === initialLen) {
      return res.status(404).json({ error: 'Product not found' });
    }
    saveStore(store);
    res.json({ success: true, message: 'Product deleted' });
  });

  // Admin: Update Inquiry Status
  app.patch('/api/admin/inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
    const inquiry = store.inquiries.find(inq => inq.id === req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    if (req.body.status) {
      inquiry.status = req.body.status;
      saveStore(store);
    }
    res.json({ success: true, inquiry });
  });

  // Admin: Reset / Adjust Interest count for product
  app.post('/api/admin/products/:id/reset-interest', requireAdminAuth, (req: Request, res: Response) => {
    const product = store.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    product.interestsCount = 0;
    saveStore(store);
    res.json({ success: true, product });
  });

  // Reset database back to default seed
  app.post('/api/admin/reset-data', requireAdminAuth, (req: Request, res: Response) => {
    store = {
      products: DEFAULT_PRODUCTS,
      interests: [],
      inquiries: [],
    };
    saveStore(store);
    res.json({ success: true, message: 'Inventory reset to initial seed' });
  });

  // --- VITE MIDDLEWARE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🌸 Cozy Knot 18 server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
