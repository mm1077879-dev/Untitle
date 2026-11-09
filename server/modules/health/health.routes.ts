import { Router, Request, Response } from 'express';
import { dbStatus, connectToDatabase, isDatabaseConnected } from '../../database/connection';
import { ProductModel } from '../../database/models/Product';
import { OrderModel } from '../../database/models/Order';
import { UserModel } from '../../database/models/User';
import { CategoryModel } from '../../database/models/Category';
import { seedInitialDatabase } from '../../database/seed';

export const healthRouter = Router();

// GET /api/health - Diagnostic endpoint reporting service & Atlas connection status
healthRouter.get('/', async (req: Request, res: Response) => {
  try {
    let productCount = 0;
    let orderCount = 0;
    let userCount = 0;
    let categoryCount = 0;

    const connected = isDatabaseConnected();

    if (connected) {
      try {
        [productCount, orderCount, userCount, categoryCount] = await Promise.all([
          ProductModel.countDocuments(),
          OrderModel.countDocuments(),
          UserModel.countDocuments(),
          CategoryModel.countDocuments(),
        ]);
      } catch (err) {
        console.warn('Health check query failed:', err);
      }
    }

    res.json({
      status: connected ? 'healthy' : 'database_disconnected',
      service: 'Novara Commerce API',
      timestamp: new Date().toISOString(),
      database: {
        ...dbStatus,
        isConnected: connected,
      },
      metrics: {
        totalProducts: productCount,
        totalOrders: orderCount,
        totalUsers: userCount,
        totalCategories: categoryCount,
      },
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, database: dbStatus });
  }
});

// POST /api/health/connect - Connect or reconnect to MongoDB Atlas
healthRouter.post('/connect', async (req: Request, res: Response) => {
  try {
    const { uri, runSeed } = req.body;
    const success = await connectToDatabase(uri);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: dbStatus.error || 'Failed to connect to MongoDB Atlas cluster. Check connection string and IP allowlist.',
        database: dbStatus,
      });
    }

    let seedResult = null;
    if (runSeed) {
      seedResult = await seedInitialDatabase();
    }

    res.json({
      success: true,
      message: 'Successfully connected to MongoDB Atlas!',
      database: dbStatus,
      seedResult,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/health/seed - Trigger database seeding on connected cluster
healthRouter.post('/seed', async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Cannot seed: MongoDB Atlas is not connected.',
        database: dbStatus,
      });
    }

    const result = await seedInitialDatabase();
    res.json({
      success: true,
      message: 'Database seeded successfully with default catalog, categories, coupons, and staff users.',
      result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
