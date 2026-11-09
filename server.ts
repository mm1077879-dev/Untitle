import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { config } from './server/config/env';
import { createExpressApp } from './server/app';
import { connectToDatabase } from './server/database/connection';
import { seedDatabaseIfEmpty } from './server/database/seed';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = createExpressApp();
  const PORT = config.port;
  const isProd = config.env === 'production';

  // Connect to MongoDB Atlas
  const connected = await connectToDatabase();
  if (connected) {
    await seedDatabaseIfEmpty();
  }

  if (!isProd) {
    // Development mode: mount Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 [Novara Commerce Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`📡 [API Endpoints] Ready at http://localhost:${PORT}/api/health\n`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
