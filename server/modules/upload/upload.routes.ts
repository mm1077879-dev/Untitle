import { Router, Response } from 'express';
import { config } from '../../config/env';
import { AuthenticatedRequest, requireRole } from '../../middleware/auth';

export const uploadRouter = Router();

// POST /api/upload/cloudinary-sign (Generates signature for client or handles upload info)
uploadRouter.post(
  '/sign',
  requireRole('super_admin', 'admin', 'catalog_manager'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { folder = 'novara_products' } = req.body;

      if (!config.cloudinary.cloudName || !config.cloudinary.apiKey) {
        return res.json({
          success: true,
          isConfigured: false,
          cloudName: 'novara-cloud',
          message: 'Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY) not yet configured. Provide an image URL or configure Cloudinary credentials in .env.',
        });
      }

      const timestamp = Math.round(new Date().getTime() / 1000);

      res.json({
        success: true,
        isConfigured: true,
        cloudName: config.cloudinary.cloudName,
        apiKey: config.cloudinary.apiKey,
        timestamp,
        folder,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);
