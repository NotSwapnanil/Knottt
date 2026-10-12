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
  contact?: string;
  note?: string;
  timestamp: string;
}

export interface CustomOrderInquiry {
  id: string;
  customerName: string;
  contact: string;
  productInterest: string;
  colorPreference: string;
  deadline?: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  timestamp: string;
}

export interface AdminStats {
  totalProducts: number;
  soldOutCount: number;
  inStockCount: number;
  totalInterests: number;
  totalInquiries: number;
}
