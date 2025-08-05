import { createServer } from 'http';
import { readFileSync } from 'fs';
import { createServer as createHttpsServer } from 'https';
import { config } from 'dotenv';
import { cpus } from 'os';
import cluster from 'cluster';
import app from './app.js';
import dbConnect from './config/db.js';
import logger from './utils/logger.js';

// Load environment variables
config();

// Server configuration
const SERVER_CONFIG = {
  port: Number(process.env.PORT) || 5001,
  host: process.env.HOST || 'localhost',
  useHttps: process.env.USE_HTTPS === 'true',
  maxDbRetries: Number(process.env.DB_MAX_RETRIES) || 5,
  dbRetryDelay: Number(process.env.DB_RETRY_DELAY) || 5000, // ms
  maxWorkers: Number(process.env.MAX_WORKERS) || cpus().length
};

// Validate configuration
if (!SERVER_CONFIG.port || SERVER_CONFIG.port < 1024 || SERVER_CONFIG.port > 65535) {
  logger.error('Invalid port configuration', { port: SERVER_CONFIG.port });
  throw new Error('Invalid port number');
}

// Graceful shutdown handler
let server;
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);
  try {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.warn('Forcing server shutdown');
      process.exit(1);
    }, 10000);
  } catch (error) {
    logger.error('Error during graceful shutdown', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

// Process error handling
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason: reason?.message || reason, stack: reason?.stack });
  gracefulShutdown('unhandledRejection');
});

// Database connection with retry
const connectWithRetry = async (retries = SERVER_CONFIG.maxDbRetries) => {
  let attempt = 1;
  while (attempt <= retries) {
    try {
      await dbConnect();
      logger.info('Database connected successfully');
      return;
    } catch (error) {
      logger.error('Database connection attempt failed', {
        attempt,
        error: error.message,
        stack: error.stack
      });
      if (attempt === retries) {
        logger.error('Max database connection retries reached');
        throw new Error('Failed to connect to database');
      }
      await new Promise(resolve => setTimeout(resolve, SERVER_CONFIG.dbRetryDelay));
      attempt++;
    }
  }
};

// Create server based on HTTPS configuration
const createAppServer = () => {
  if (SERVER_CONFIG.useHttps) {
    const key = process.env.HTTPS_KEY_PATH ? readFileSync(process.env.HTTPS_KEY_PATH) : null;
    const cert = process.env.HTTPS_CERT_PATH ? readFileSync(process.env.HTTPS_CERT_PATH) : null;
    
    if (!key || !cert) {
      logger.error('Missing HTTPS key or certificate');
      throw new Error('HTTPS configuration requires key and certificate paths');
    }

    return createHttpsServer({ key, cert }, app);
  }
  return createServer(app);
};

// Cluster setup for primary process
if (cluster.isPrimary) {
  logger.info('Primary process started', {
    pid: process.pid,
    environment: process.env.NODE_ENV,
    workers: SERVER_CONFIG.maxWorkers
  });

  // Fork workers
  for (let i = 0; i < SERVER_CONFIG.maxWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn('Worker process exited', { workerPid: worker.process.pid, code, signal });
    cluster.fork(); // Restart worker
  });
} else {
  // Worker process
  (async () => {
    try {
      // Connect to database
      await connectWithRetry();

      // Start server
      server = createAppServer();
      server.listen(SERVER_CONFIG.port, SERVER_CONFIG.host, () => {
        const startupTime = process.uptime();
        const memoryUsage = process.memoryUsage();
        
        logger.info('Server started', {
          workerPid: process.pid,
          url: SERVER_CONFIG.useHttps 
            ? `https://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`
            : `http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`,
          startupTime: `${startupTime.toFixed(2)}s`,
          memoryUsage: {
            heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
            heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`
          }
        });
      });
    } catch (error) {
      logger.error('Worker failed to start', {
        workerPid: process.pid,
        error: error.message,
        stack: error.stack
      });
      process.exit(1);
    }
  })();
}

// Handle termination signals
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
  process.on(signal, () => gracefulShutdown(signal));
});