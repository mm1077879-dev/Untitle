import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { addToast } from '../features/ui/uiSlice';
import { apiRequest } from '../services/api';
import { Product, Category } from '../types';
import {
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  Star,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Zap,
  Mail,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingTab, setTrendingTab] = useState<'topSelling' | 'newArrivals' | 'bestRated'>('topSelling');
  const [trendingData, setTrendingData] = useState<{
    topSelling: Product[];
    newArrivals: Product[];
    bestRated: Product[];
  }>({
    topSelling: [],
    newArrivals: [],
    bestRated: [],
  });
  const [cmsConfig, setCmsConfig] = useState<any>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);

  useEffect(() => {
    // Auto slide timer
    const slideTimer = setInterval(() => {
      setActiveSlideIndex((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    // Fetch live categories
    apiRequest('/categories').then((res) => {
      if (res.success && res.categories) {
        setCategories(res.categories);
      }
    });

    // Fetch trending products
    apiRequest('/products/trending').then((res) => {
      if (res.success && res.data) {
        setTrendingData(res.data);
      }
    });

    // Fetch CMS settings
    apiRequest('/cms/config').then((res) => {
      if (res.success && res.config) {
        setCmsConfig(res.config);
      }
    });
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        price: product.salePrice,
        originalPrice: product.basePrice > product.salePrice ? product.basePrice : undefined,
        quantity: 1,
        image: product.images?.[0] || '',
        stock: product.stock,
      })
    );
    dispatch(
      addToast({
        type: 'success',
        title: 'Added to Cart',
        message: `${product.name} (৳${product.salePrice.toLocaleString()}) added to your bag.`,
      })
    );
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    const res = await apiRequest('/cms/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: newsletterEmail }),
    });

    if (res.success) {
      setIsNewsletterSubscribed(true);
      dispatch(
        addToast({
          type: 'success',
          title: 'Subscribed!',
          message: res.message || 'You have successfully subscribed to Novara / Aurelia newsletter.',
        })
      );
    }
  };

  const currentProducts = trendingData[trendingTab] || [];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. HERO CAMPAIGN (Faithful to Reference Image & CMS-Controlled) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#001736] via-[#002f6c] to-[#001e4a] text-white pt-8 pb-12 sm:pb-16 px-4 sm:px-8">
        {/* Subtle glowing mesh dots background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        {(() => {
          const slides = (cmsConfig?.heroSlides && cmsConfig.heroSlides.length > 0)
            ? cmsConfig.heroSlides.filter((s: any) => s.isActive !== false)
            : [
                {
                  id: 'default-hero',
                  badge: cmsConfig?.heroBadge || 'Limited Time Offer ⚡',
                  title: cmsConfig?.heroTitle || 'Upgrade Your Life with',
                  highlight: cmsConfig?.heroHighlight || 'Aurelia',
                  subtitle: cmsConfig?.heroSubtitle || 'Premium Quality. Unbeatable Prices. Fast delivery across Bangladesh.',
                  ctaText: cmsConfig?.heroCtaText || 'Shop Now',
                  ctaLink: cmsConfig?.heroCtaLink || '/shop',
                  discountBadge: 'Up to 50% OFF',
                  image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
                  bgGradient: 'from-[#001736] via-[#002f6c] to-[#001e4a]',
                },
              ];

          const currentSlide = slides[activeSlideIndex % slides.length] || slides[0];

          return (
            <>
              <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                {/* Left Hero Text */}
                <div className="flex-1 max-w-xl text-center lg:text-left space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-xs">
                    <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{currentSlide.badge || 'Limited Time Offer ⚡'}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                    {currentSlide.title || 'Upgrade Your Life with'}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                      {currentSlide.highlight || 'Aurelia'}
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-blue-100/80 font-normal max-w-lg">
                    {currentSlide.subtitle || 'Premium Quality. Unbeatable Prices. Fast delivery across Bangladesh.'}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <Link
                      to={currentSlide.ctaLink || '/shop'}
                      className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-blue-600/40 transition-all hover:translate-x-0.5 flex items-center gap-2"
                    >
                      <span>{currentSlide.ctaText || 'Shop Now'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/shop"
                      className="px-6 py-3 bg-transparent hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-full border border-white/30 transition-all"
                    >
                      Explore More
                    </Link>
                  </div>
                </div>

                {/* Right Floating Product Showcase with "Up to 50% OFF" Badge */}
                <div className="relative flex-1 max-w-lg w-full flex items-center justify-center">
                  {/* Glowing circular discount badge matching image */}
                  <div className="absolute top-0 right-4 sm:right-8 z-20 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex flex-col items-center justify-center text-center shadow-xl shadow-cyan-500/30 transform hover:scale-105 transition-transform border-2 border-white/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Up to</span>
                    <span className="text-xl font-black leading-none">50%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">OFF</span>
                  </div>

                  {/* Showcase Visual Assets */}
                  <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-blue-900/40 to-blue-950/80 rounded-3xl p-6 border border-blue-400/20 backdrop-blur-md shadow-2xl flex items-center justify-center gap-4">
                    <div className="text-center">
                      <img
                        src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=400&q=80"
                        alt="AirPods Pro"
                        className="w-24 h-24 object-cover mx-auto rounded-2xl drop-shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                      <p className="text-[11px] font-semibold text-blue-200 mt-2">AirPods Pro</p>
                    </div>
                    <div className="text-center">
                      <img
                        src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=400&q=80"
                        alt="iPhone Flagship"
                        className="w-28 h-36 object-cover mx-auto rounded-2xl drop-shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                      <p className="text-[11px] font-semibold text-blue-200 mt-2">iPhone 16 Pro</p>
                    </div>
                    <div className="text-center">
                      <img
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
                        alt="Smart Watch"
                        className="w-24 h-24 object-cover mx-auto rounded-2xl drop-shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                      <p className="text-[11px] font-semibold text-blue-200 mt-2">Watch Series 10</p>
                    </div>
                  </div>

                  {/* Carousel Chevrons */}
                  {slides.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActiveSlideIndex((prev) => (prev + 1) % slides.length)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Carousel pagination dots */}
              <div className="flex items-center justify-center gap-1.5 mt-8">
                {slides.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`transition-all rounded-full cursor-pointer ${
                      activeSlideIndex % slides.length === idx
                        ? 'w-6 h-2 bg-white'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          );
        })()}
      </section>

      {/* 2. TRUST BADGES STRIP (Matching Reference Image) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-100/80 border border-slate-100 flex items-center gap-4 hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Free Shipping</h4>
              <p className="text-xs text-slate-500">On Orders Over ৳1,000</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-100/80 border border-slate-100 flex items-center gap-4 hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">100% Secure Payment</h4>
              <p className="text-xs text-slate-500">Your Data is Safe</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-100/80 border border-slate-100 flex items-center gap-4 hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">24/7 Customer Support</h4>
              <p className="text-xs text-slate-500">Always Here to Help</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-100/80 border border-slate-100 flex items-center gap-4 hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">30 Days Easy Return</h4>
              <p className="text-xs text-slate-500">Hassle-Free Policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY (12 Cards with counts, matching image) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-2xl p-4 border border-slate-100 hover:border-blue-300 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 mt-0.5">({cat.liveCount || cat.itemCount}+)</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SPLIT PROMOTIONAL BANNERS (Big Summer Sale 70% & Next-Gen Tech / CMS Driven) */}
      {(() => {
        const leftBanner = cmsConfig?.banners?.find((b: any) => b.position === 'split_left' && b.isActive !== false);
        const rightBanner = cmsConfig?.banners?.find((b: any) => b.position === 'split_right' && b.isActive !== false);

        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Banner: Big Summer Sale */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-sky-400 text-white p-7 sm:p-9 shadow-xl shadow-blue-500/10 flex items-center justify-between">
                <div className="space-y-3 z-10 max-w-[65%]">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                    {leftBanner?.badge || 'Big Summer Sale'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    {leftBanner?.title || 'Up to 70% OFF'}
                  </h3>
                  <p className="text-xs text-blue-100">
                    {leftBanner?.subtitle || "Don't Miss Out On Hot Electronics & Lifestyle!"}
                  </p>
                  <Link
                    to={leftBanner?.link || '/shop?sort=discount'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-700 font-bold text-xs rounded-full shadow-md hover:bg-blue-50 transition-colors"
                  >
                    <span>{leftBanner?.ctaText || 'Shop the Sale'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-85">
                  <img
                    src={leftBanner?.image || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80'}
                    alt={leftBanner?.title || 'Summer Sale'}
                    className="h-full object-cover object-left"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Right Banner: Next-Gen Tech */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#001736] to-[#002f6c] text-white p-7 sm:p-9 shadow-xl flex items-center justify-between">
                <div className="space-y-3 z-10 max-w-[65%]">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    {rightBanner?.badge || 'Next-Gen Tech'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    {rightBanner?.title || 'Smarter. Faster. Better.'}
                  </h3>
                  <p className="text-xs text-blue-200">
                    {rightBanner?.subtitle || 'Exclusive discounts on ultrabooks & iPads'}
                  </p>
                  <Link
                    to={rightBanner?.link || '/shop?category=electronics'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full shadow-md transition-colors"
                  >
                    <span>{rightBanner?.ctaText || 'Explore Tech'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="absolute right-2 top-0 bottom-0 w-1/3 flex items-center justify-center">
                  <img
                    src={rightBanner?.image || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80'}
                    alt={rightBanner?.title || 'Next Gen Tech'}
                    className="h-28 object-contain drop-shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 5. TRENDING PRODUCTS SECTION (Matching Reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Trending Products</h2>
          </div>

          {/* Filter tabs: Top Selling, New Arrivals, Best Rated */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setTrendingTab('topSelling')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                trendingTab === 'topSelling'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Top Selling
            </button>
            <button
              onClick={() => setTrendingTab('newArrivals')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                trendingTab === 'newArrivals'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setTrendingTab('bestRated')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                trendingTab === 'bestRated'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Best Rated
            </button>
          </div>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product.slug}`)}
              className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all p-3.5 flex flex-col justify-between cursor-pointer relative"
            >
              {/* Badge */}
              {product.badge && (
                <span
                  className={`absolute top-2.5 left-2.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md z-10 text-white ${
                    product.badge.includes('%')
                      ? 'bg-emerald-600'
                      : product.badge === 'Hot'
                      ? 'bg-rose-600'
                      : 'bg-amber-500'
                  }`}
                >
                  {product.badge}
                </span>
              )}

              {/* Product Thumbnail */}
              <div className="w-full aspect-square rounded-xl bg-slate-50 mb-3 overflow-hidden flex items-center justify-center">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Product Details */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-800">{product.rating || 4.8}</span>
                  <span className="text-[10px] text-slate-400">({(product.reviewCount || 1000) > 1000 ? `${((product.reviewCount || 1000) / 1000).toFixed(1)}k` : product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm font-extrabold text-blue-700 tabular-nums">
                    ৳{product.salePrice.toLocaleString()}
                  </span>
                  {product.basePrice > product.salePrice && (
                    <span className="text-[10px] text-slate-400 line-through tabular-nums">
                      ৳{product.basePrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="mt-3 w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MID-PAGE BRAND FEATURE BANNER: "Live Smarter with Aurelia" (CMS-Driven) */}
      {(() => {
        const midBanner = cmsConfig?.banners?.find((b: any) => b.position === 'mid_banner' && b.isActive !== false);

        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#001736] via-[#002b66] to-[#001a3a] text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-lg z-10 text-center md:text-left">
                {midBanner?.badge && (
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                    {midBanner.badge}
                  </span>
                )}
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  {midBanner?.title || 'Live Smarter with Aurelia'}
                </h2>
                <p className="text-sm text-blue-100/80">
                  {midBanner?.subtitle || 'Discover the latest trends, unbeatable deals, and a better shopping experience curated for Bangladesh.'}
                </p>
                <div className="pt-2">
                  <Link
                    to={midBanner?.link || '/shop'}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-colors"
                  >
                    <span>{midBanner?.ctaText || 'Shop Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="relative z-10 w-full max-w-md flex items-center justify-center">
                <img
                  src={midBanner?.image || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80'}
                  alt={midBanner?.title || 'Live Smarter Tech'}
                  className="w-full max-w-xs drop-shadow-2xl rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </section>
        );
      })()}

      {/* 7. AUTHENTIC CUSTOMER REVIEWS (What Our Customers Say) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">What Our Customers Say</h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1: Rafik Hasan */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "Aurelia has the best products and super fast delivery. Highly recommended!"
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                  alt="Rafik Hasan"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Rafik Hasan</h4>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                    <CheckCircle className="w-3 h-3 fill-blue-600 text-white" />
                    Verified Buyer
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Review 2: Tania Akter */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "Excellent quality and amazing service. I will shop again for sure!"
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Tania Akter"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Tania Akter</h4>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                    <CheckCircle className="w-3 h-3 fill-blue-600 text-white" />
                    Verified Buyer
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Review 3: Md. Fahim */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "Very professional and trustworthy online store. Love it! 💖"
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80"
                  alt="Md. Fahim"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Md. Fahim</h4>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                    <CheckCircle className="w-3 h-3 fill-blue-600 text-white" />
                    Verified Buyer
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER SUBSCRIPTION (Matching Reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 text-white p-8 sm:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center lg:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Subscribe to Our Newsletter</h3>
              <p className="text-xs text-blue-100">Get the latest updates, offers and exclusive vouchers.</p>
            </div>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full lg:max-w-md flex items-center gap-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 py-3 px-4 bg-white rounded-xl text-slate-800 text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-white/40 shadow-inner"
            />
            <button
              type="submit"
              className="py-3 px-6 bg-[#002244] hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* 9. OPTIONAL ADMIN-MANAGED PROMOTIONAL PLACEMENT (Section 10) */}
      {cmsConfig?.promotionalPlacement?.isEnabled && cmsConfig.promotionalPlacement.imageUrl && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <a
            href={cmsConfig.promotionalPlacement.destinationUrl || '/shop'}
            className="block overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative group"
          >
            <img
              src={cmsConfig.promotionalPlacement.imageUrl}
              alt={cmsConfig.promotionalPlacement.title}
              className="w-full h-48 sm:h-64 object-cover group-hover:scale-102 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Sponsored Placement</span>
              <h3 className="text-xl sm:text-2xl font-black">{cmsConfig.promotionalPlacement.title}</h3>
              {cmsConfig.promotionalPlacement.subtitle && (
                <p className="text-xs text-slate-300 mt-1">{cmsConfig.promotionalPlacement.subtitle}</p>
              )}
            </div>
          </a>
        </section>
      )}
    </div>
  );
};
