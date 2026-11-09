import mongoose from 'mongoose';
import { config } from '../config/env';

// Disable query buffering so disconnected queries fail fast instead of hanging for 10 seconds
mongoose.set('bufferCommands', false);

export interface DatabaseStatus {
  isConnected: boolean;
  statusText: string;
  host?: string;
  databaseName?: string;
  error?: string;
}

export let dbStatus: DatabaseStatus = {
  isConnected: false,
  statusText: 'Disconnected. MONGODB_URI not configured or initializing.',
};

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

let memoryServerInstance: any = null;

export async function connectToDatabase(customUri?: string): Promise<boolean> {
  const uri = customUri || config.mongodbUri;

  // Check if a valid remote MongoDB Atlas URI is provided
  const hasValidRemoteUri = uri && !uri.includes('YOUR_PASSWORD') && uri.trim() !== '';

  if (hasValidRemoteUri) {
    try {
      console.log('⏳ Connecting to MongoDB Atlas cluster...');
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }

      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
      });

      const conn = mongoose.connection;
      dbStatus = {
        isConnected: true,
        statusText: 'Connected to MongoDB Atlas',
        host: conn.host,
        databaseName: conn.name,
      };

      console.log(`✅ [MongoDB Atlas Connected] Host: ${conn.host}, DB: ${conn.name}`);
      return true;
    } catch (err: any) {
      console.warn(`⚠️ [MongoDB Atlas Connection Failed]: ${err.message}. Falling back to embedded development engine...`);
    }
  }

  // If no external MONGODB_URI or external Atlas connection failed, spin up embedded engine
  try {
    console.log('⚡ Starting embedded development MongoDB engine...');
    if (!memoryServerInstance) {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
    }

    const memoryUri = memoryServerInstance.getUri();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(memoryUri, {
      serverSelectionTimeoutMS: 5000,
    });

    const conn = mongoose.connection;
    dbStatus = {
      isConnected: true,
      statusText: 'Connected to MongoDB (Development Engine Active)',
      host: conn.host,
      databaseName: conn.name,
    };

    console.log(`✅ [Embedded MongoDB Active] Connected at ${memoryUri}`);
    return true;
  } catch (err: any) {
    console.error('❌ [Database Connection Error]:', err.message);
    dbStatus = {
      isConnected: false,
      statusText: 'Failed to initialize database engine',
      error: err.message,
    };
    return false;
  }
}

mongoose.connection.on('disconnected', () => {
  dbStatus.isConnected = false;
  dbStatus.statusText = 'Disconnected from MongoDB Atlas';
  console.warn('⚠️ [MongoDB Atlas Disconnected]');
});

mongoose.connection.on('error', (err) => {
  dbStatus.isConnected = false;
  dbStatus.error = err.message;
  console.error('❌ [MongoDB Connection Error Event]:', err.message);
});

