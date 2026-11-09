export type AttributeInputType = 'color_swatch' | 'size_selector' | 'select' | 'radio' | 'text' | 'number' | 'boolean';

export interface AttributeValue {
  id?: string;
  label: string;
  value: string;
  hexColor?: string;
  description?: string;
}

export interface Attribute {
  _id: string;
  name: string;
  slug: string;
  type: AttributeInputType;
  values: AttributeValue[];
  categories: string[];
  isRequired: boolean;
  isFilterable: boolean;
  isVisibleOnPDP: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price?: number;
  originalPrice?: number;
  stock: number;
  options: Record<string, string>;
  image?: string;
  barcode?: string;
  isActive?: boolean;
}

export interface ProductHighlight {
  label: string;
  value: string;
  icon?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
  group?: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Product {
  _id: string;
  name: string;
  subtitle?: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  features: string[];
  attributes: Record<string, string>;
  highlights?: ProductHighlight[];
  specificationsTable?: ProductSpecification[];
  faqs?: ProductFAQ[];
  basePrice: number;
  salePrice: number;
  stock: number;
  reservedStock?: number;
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isTrending?: boolean;
  isTopSelling?: boolean;
  isNewArrival?: boolean;
  isBestRated?: boolean;
  isFeatured?: boolean;
  badge?: string;
  status: 'active' | 'draft' | 'archived';
  warranty?: string;
  deliveryEstimate?: string;
  banglaKeywords?: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  itemCount: number;
  liveCount?: number;
  description?: string;
  order: number;
  featured: boolean;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  isActive: boolean;
  itemCount: number;
  featured?: boolean;
}

export interface UserAddress {
  _id?: string;
  id?: string;
  isDefault?: boolean;
  label?: string;
  recipientName: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  unionOrWard?: string;
  streetAddress: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'super_admin' | 'admin' | 'order_manager' | 'inventory_manager' | 'catalog_manager' | 'customer_support' | 'finance';
  phone?: string;
  addresses: UserAddress[];
  orderCount?: number;
  totalSpent?: number;
  status?: string;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  subtitle?: string;
  sku: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  options?: Record<string, string>;
  stock: number;
  selected?: boolean;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  options?: Record<string, string>;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: UserAddress;
  pricing: {
    subtotal: number;
    discount: number;
    shippingFee: number;
    tax: number;
    total: number;
    couponCode?: string;
  };
  paymentMethod: 'cod' | 'card' | 'bkash' | 'nagad';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  timeline: {
    status: string;
    timestamp: string;
    note?: string;
    actor?: string;
  }[];
  staffNotes?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  helpfulCount?: number;
  photos?: string[];
  createdAt: string;
}

export interface HeroSlide {
  _id?: string;
  id: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  discountBadge: string;
  ctaText: string;
  ctaLink: string;
  desktopImage: string;
  mobileImage?: string;
  order: number;
  isEnabled: boolean;
}

export interface BannerItem {
  _id?: string;
  id: string;
  title: string;
  subtitle: string;
  tagline?: string;
  discountTag?: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  position: 'split_left' | 'split_right' | 'mid_banner' | 'sponsored';
  isEnabled: boolean;
  order: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportPhone: string;
  supportEmail: string;
  currencySymbol: string;
  currencyCode: string;
  freeShippingThreshold: number;
  shippingDhaka: number;
  shippingOutsideDhaka: number;
  taxRate: number;
  paymentMethods: {
    cod: boolean;
    bkash: boolean;
    nagad: boolean;
    card: boolean;
  };
  socialLinks?: {
    facebook: string;
    youtube: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

export interface ContentPage {
  _id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  updatedAt?: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  image: string;
  tags: string[];
  publishedAt: string;
  isActive: boolean;
  views?: number;
}

export interface AuditLog {
  _id: string;
  action: string;
  module: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  details: string;
  timestamp: string;
}

export interface CMSConfig {
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroBadge: string;
  heroCtaText: string;
  heroCtaLink: string;
  announcementText: string;
  announcementPhone: string;
  announcementEmail: string;
  heroSlides?: HeroSlide[];
  banners?: BannerItem[];
  settings?: StoreSettings;
  sections: {
    id: string;
    title: string;
    isEnabled: boolean;
    order: number;
  }[];
  promotionalPlacement: {
    isEnabled: boolean;
    title: string;
    subtitle?: string;
    imageUrl: string;
    destinationUrl: string;
    ctaText: string;
  };
}
