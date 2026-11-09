import { CategoryModel } from './models/Category';
import { ProductModel } from './models/Product';
import { UserModel } from './models/User';
import { ReviewModel } from './models/Review';
import { CouponModel } from './models/Coupon';
import { CMSConfigModel } from './models/CMS';
import { AttributeModel } from './models/Attribute';
import { initialCategories, initialProducts, initialReviews, initialCoupons, initialAttributes } from '../seeds/defaultData';
import { config } from '../config/env';

export async function seedDatabaseIfEmpty() {
  try {
    const categoryCount = await CategoryModel.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding initial categories into MongoDB Atlas...');
      await CategoryModel.insertMany(initialCategories);
    }

    // Seed attributes
    const attributeCount = await AttributeModel.countDocuments();
    if (attributeCount === 0) {
      console.log('🌱 Seeding universal product attributes...');
      await AttributeModel.insertMany(initialAttributes);
    }

    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding initial products into MongoDB Atlas...');
      await ProductModel.insertMany(initialProducts);
    } else {
      // Ensure Samsung Galaxy S25 Ultra 5G and new multi-category products exist with full variants
      for (const prod of initialProducts) {
        const existing = await ProductModel.findOne({ slug: prod.slug });
        if (!existing) {
          await ProductModel.create(prod);
        } else if (prod.slug === 'samsung-galaxy-s25-ultra' || prod.slug === 'samsung-galaxy-s25') {
          // Keep flagship product up to date with full highlights and variant matrix
          await ProductModel.updateOne({ _id: existing._id }, { $set: prod });
        }
      }
    }

    const targetAdminEmail = config.adminEmail?.trim().toLowerCase() || 'admin@novaracommerce.com';
    const targetAdminPassword = config.adminPassword?.trim() || 'admin123456';

    const adminUser = await UserModel.findOne({ email: targetAdminEmail });
    if (!adminUser) {
      console.log(`🌱 Bootstrapping configured Super Admin user (${targetAdminEmail})...`);
      await UserModel.create({
        name: 'Aurelia Super Admin',
        email: targetAdminEmail,
        password: targetAdminPassword,
        role: 'super_admin',
        phone: '+880 1712 345678',
        addresses: [
          {
            isDefault: true,
            label: 'Headquarters',
            recipientName: 'Aurelia Operations',
            phone: '+880 1712 345678',
            division: 'Dhaka',
            district: 'Dhaka',
            upazila: 'Gulshan',
            unionOrWard: 'Ward 19',
            streetAddress: 'House 42, Road 11, Block D, Banani',
          },
        ],
      });
    } else if (config.adminPassword && config.adminPassword.trim().length >= 6) {
      // If environment password was provided, keep database password synced
      adminUser.password = targetAdminPassword;
      adminUser.role = 'super_admin';
      await adminUser.save();
    }

    // Also create a demo customer for instant testing
    const demoCustomer = await UserModel.findOne({ email: 'customer@novara.com' });
    if (!demoCustomer) {
      console.log('🌱 Bootstrapping demo verified customer (customer@novara.com)...');
      await UserModel.create({
        name: 'Rafik Hasan',
        email: 'customer@novara.com',
        password: 'customer123',
        role: 'customer',
        phone: '+880 1819 000111',
        addresses: [
          {
            isDefault: true,
            label: 'Home',
            recipientName: 'Rafik Hasan',
            phone: '+880 1819 000111',
            division: 'Dhaka',
            district: 'Dhaka',
            upazila: 'Dhanmondi',
            unionOrWard: 'Ward 15',
            streetAddress: 'House 14, Road 27, Dhanmondi',
          },
        ],
      });
    }

    const reviewCount = await ReviewModel.countDocuments();
    const firstCustomer = await UserModel.findOne({ email: 'customer@novara.com' });
    if (reviewCount === 0) {
      console.log('🌱 Seeding verified customer reviews...');
      const reviewsWithUserId = initialReviews.map((r) => ({
        ...r,
        userId: firstCustomer ? firstCustomer._id.toString() : 'guest-seed',
      }));
      await ReviewModel.insertMany(reviewsWithUserId);
    } else {
      // Ensure flagship reviews exist
      const flagshipReview = await ReviewModel.findOne({ productId: 'samsung-galaxy-s25-ultra' });
      if (!flagshipReview) {
        const flagshipReviews = initialReviews
          .filter((r) => r.productId === 'samsung-galaxy-s25-ultra' || r.productId === 'samsung-galaxy-s25')
          .map((r) => ({
            ...r,
            userId: firstCustomer ? firstCustomer._id.toString() : 'guest-seed',
          }));
        if (flagshipReviews.length > 0) {
          await ReviewModel.insertMany(flagshipReviews);
        }
      }
    }

    const couponCount = await CouponModel.countDocuments();
    if (couponCount === 0) {
      console.log('🌱 Seeding promotional coupons...');
      await CouponModel.insertMany(initialCoupons);
    }

    const cmsConfig = await CMSConfigModel.findOne();
    if (!cmsConfig) {
      console.log('🌱 Creating default CMS and promotional configuration...');
      await CMSConfigModel.create({
        heroTitle: 'Upgrade Your Life with',
        heroHighlight: 'Aurelia',
        heroSubtitle: 'Premium Quality. Unbeatable Prices. Fast delivery across Bangladesh.',
        heroBadge: 'Limited Time Offer ⚡',
        heroCtaText: 'Shop Now',
        heroCtaLink: '/shop',
        announcementText: 'Free Shipping on Orders Over ৳1,000 · 30 Days Easy Return · Secure Payment',
        announcementPhone: '+880 1234 567890',
        announcementEmail: 'support@aurelia.com',
        heroSlides: [
          {
            id: 'slide-1',
            badge: 'Limited Time Offer ⚡',
            title: 'Upgrade Your Life with',
            highlight: 'Aurelia',
            subtitle: 'Premium Quality. Unbeatable Prices. Fast delivery across Bangladesh.',
            discountBadge: 'Up to 50% OFF',
            ctaText: 'Shop Now',
            ctaLink: '/shop',
            desktopImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
            order: 1,
            isEnabled: true,
          },
          {
            id: 'slide-2',
            badge: 'New Flagship Launch 🔥',
            title: 'Next-Gen Tech & Audio with',
            highlight: 'Aurelia Studio',
            subtitle: 'Immersive sound, ultra-fast performance, and genuine brand warranties.',
            discountBadge: 'Up to 40% OFF',
            ctaText: 'Explore Tech',
            ctaLink: '/shop?category=electronics',
            desktopImage: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
            order: 2,
            isEnabled: true,
          },
        ],
        banners: [
          {
            id: 'banner-summer-sale',
            title: 'Big Summer Sale',
            subtitle: 'Up to 70% OFF',
            tagline: "Don't Miss Out On Hot Electronics & Lifestyle!",
            ctaText: 'Shop the Sale',
            ctaLink: '/shop?sort=discount',
            imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
            position: 'split_left',
            order: 1,
            isEnabled: true,
          },
          {
            id: 'banner-next-gen-tech',
            title: 'Next-Gen Tech',
            subtitle: 'Smarter. Faster. Better.',
            tagline: 'Exclusive discounts on ultrabooks & iPads',
            ctaText: 'Explore Tech',
            ctaLink: '/shop?category=electronics',
            imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
            position: 'split_right',
            order: 2,
            isEnabled: true,
          },
          {
            id: 'banner-live-smarter',
            title: 'Live Smarter with Aurelia',
            subtitle: 'Discover the latest trends, unbeatable deals, and a better shopping experience curated for Bangladesh.',
            ctaText: 'Shop Now',
            ctaLink: '/shop',
            imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
            position: 'mid_banner',
            order: 3,
            isEnabled: true,
          },
        ],
        settings: {
          storeName: 'Aurelia',
          tagline: 'Shop Smart, Live Better',
          supportPhone: '+880 1234 567890',
          supportEmail: 'support@aurelia.com',
          currencySymbol: '৳',
          currencyCode: 'BDT',
          freeShippingThreshold: 1000,
          shippingDhaka: 60,
          shippingOutsideDhaka: 120,
          taxRate: 0,
          paymentMethods: {
            cod: true,
            bkash: true,
            nagad: true,
            card: true,
          },
        },
        sections: [
          { id: 'hero', title: 'Hero Carousel', isEnabled: true, order: 1 },
          { id: 'trust', title: 'Trust Badges', isEnabled: true, order: 2 },
          { id: 'categories', title: 'Shop by Category', isEnabled: true, order: 3 },
          { id: 'promo_banners', title: 'Split Promotional Banners', isEnabled: true, order: 4 },
          { id: 'trending', title: 'Trending Products', isEnabled: true, order: 5 },
          { id: 'feature_banner', title: 'Brand Feature Showcase', isEnabled: true, order: 6 },
          { id: 'reviews', title: 'Customer Testimonials', isEnabled: true, order: 7 },
          { id: 'newsletter', title: 'Newsletter Subscription', isEnabled: true, order: 8 },
        ],
        promotionalPlacement: {
          isEnabled: false,
          title: 'Special Flash Deals',
          subtitle: 'Limited-time offer on audio gear',
          imageUrl: '',
          destinationUrl: '/shop',
          ctaText: 'Claim Deal',
        },
      });
    }

    console.log('✅ Database initialization & verification complete.');
    return { success: true };
  } catch (err: any) {
    console.error('⚠️ [Database Seeding Notice]:', err.message);
    return { success: false, error: err.message };
  }
}

export const seedInitialDatabase = seedDatabaseIfEmpty;


