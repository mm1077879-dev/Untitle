import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI || '',
  adminEmail: process.env.ADMIN_EMAIL || 'siam@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'siam12345!',
  jwtSecret: process.env.JWT_SECRET || 'novara_commerce_default_super_secret_jwt_key_2026',
  jwtExpiresIn: '7d',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    emailFrom: process.env.EMAIL_FROM || 'orders@novaracommerce.com',
  },
};
