import express from "express";
import * as Sentry from "@sentry/node";
import fs from "fs";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import cors from "cors";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import routes from "./api/src/routes/index";
import { errorHandler } from "./api/src/middleware/errorHandler";
import { initSocket } from "./api/src/utils/socket";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";

// Universally compatible paths (No import.meta.url required)
const _cwd = process.cwd();

const PORT = process.env.PORT || 3000;

// --- SWAGGER SETUP ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RG Academy API',
      version: '2.6.0',
      description: 'API Documentation for RG Academy Platform',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./api/src/routes/*.ts', './api/src/controllers/*.ts'], // Scan for JSDoc comments
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

async function startServer() {
  // --- SENTRY INIT ---
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV || 'development',
    });
    console.log("Sentry initialized");
  }
  console.log("🛠️ Starting RG Academy Server (Step 1: INIT)...");
  const app = express();
  // LOGGING: Critical for Hostinger diagnostics
  app.use((req, res, next) => {
    if (req.url.startsWith('/assets')) {
      console.log(`[ASSET] ${req.method} ${req.url}`);
    }
    next();
  });
  
  // --- SECURITY MIDDLEWARE ---
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "https://locize.com"],
        "img-src": ["'self'", "data:", "https:", "https://cdn.flyonui.com"],
        "connect-src": ["'self'", "https://locize.com", "https://api.locize.com", "ws://localhost:24678", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://ipapi.co"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      },
    }
  }));
  app.use(hpp());

  // Required for Hostinger/Cloudflare/Proxy environments
  app.set('trust proxy', 1);

  const server = createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: true, credentials: true }
  });

  console.log("🛠️ Initializing Socket.io...");
  initSocket(io);

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 500 : 2000,

    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 500, // Increased for Live Identity Check
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts, please try again after 15 minutes.' }
  });

  const corsOptions = {
    origin: [process.env.APP_URL || `http://localhost:${PORT}`, `http://localhost:${PORT}`],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  app.use('/api', limiter);
  
  // Phase 32: Legacy Compatibility Bridge
  // Some old cached builds may still look for current_user instead of /me
  app.get('/api/auth/current_user', (req, res) => {
    console.log("🌉 Legacy Bridge Triggered: Redirecting current_user to /me");
    res.redirect(307, '/api/auth/me');
  });

  app.use('/api/auth', authLimiter);

  // --- HEALTH CHECK ---
  app.get('/api/health', async (req, res) => {
    let dbStatus = "Unknown";
    try {
      const { prisma } = await import("./api/src/utils/prisma");
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "Connected";
    } catch (err) {
      dbStatus = "Disconnected";
      console.error("Health Check DB Error:", err.message);
    }

    res.status(dbStatus === "Connected" ? 200 : 503).json({ 
      status: "Operational", 
      database: dbStatus,
      timestamp: new Date().toISOString(),
      node: "RG_ACADEMY_INDUSTRIAL_CORE v2.6.1"
    });
  });

  console.log("🛠️ Registering routes...");
  // --- API ROUTES ---
  app.use('/api', routes);

  // Sentry error handler (after all routes)
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  // Phase 31: API Discovery Guard
  app.all('/api/*', (req, res) => {
    console.error(`[API 404] Endpoint not found: ${req.method} ${req.url} | Headers:`, JSON.stringify(req.headers, null, 2));
    res.status(404).json({ 
      success: false, 
      error: 'API endpoint not found',
      path: req.url,
      node: 'RG_ACADEMY_INDUSTRIAL_CORE'
    });
  });

  console.log("🛠️ Registering Swagger UI...");
  // Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });

  // --- MODE SELECTION ---
  // --- PRODUCTION & SERVING MODE ---
  const distPath = path.resolve(_cwd, 'dist');
  const isProduction = process.env.NODE_ENV === "production";
  const skipVite = process.env.SKIP_VITE === "true";

  if (isProduction || skipVite) {
    if (fs.existsSync(distPath)) {
      console.log(`📦 PRODUCTION MODE: Serving static files from: ${distPath}`);
      app.use(express.static(distPath, {
        maxAge: '1d', // Cache assets to reduce server hitting
        index: false
      }));
      app.get('*', (req, res) => {
        // Phase 31.5: MIME Type Rescue
        // If the request is for an asset (has an extension) but reached here, it's a 404.
        // Falling back to index.html for assets causes "MIME type mismatch" errors in browser.
        const isAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|json|woff|woff2|ttf|otf|map)$/i.test(req.path);
        
        if (isAsset || req.path.startsWith('/api')) {
          res.status(404).json({ 
            success: false, 
            error: isAsset ? 'Static asset not found' : 'API endpoint not found',
            path: req.path
          });
        } else {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.sendFile(path.join(distPath, 'index.html'));
        }
      });
    } else {
      console.warn("⚠️  PRODUCTION MODE: dist/ folder not found! Serving API status.");
      app.get('/', (req, res) => {
        res.json({ 
          status: "API Online", 
          docs: `http://localhost:${PORT}/api/docs`,
          version: "2.6.0",
          note: "Production build missing. Run npm run build."
        });
      });
    }
  } else {
    console.log("⚡ INTEGRATED DEV MODE: Starting Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }

  app.use(errorHandler);

  // Robust listen for both Port (Number) and Socket Path (String/Passenger)
  const listenTarget = isNaN(Number(PORT)) ? PORT : Number(PORT);

  server.listen(listenTarget, () => {
    console.log(`\n🚀 ========================================== 🚀`);
    console.log(`🔥 PLATFORM READY: ${typeof listenTarget === 'string' ? 'Socket' : 'http://localhost'}:${listenTarget}`);
    console.log(`🔌 BACKEND API:   /api`);
    console.log(`📚 SWAGGER DOCS:  /api/docs`);
    console.log(`🚀 ========================================== 🚀\n`);
  });
}

startServer().catch(err => {
  console.error('❌ CRITICAL STARTUP ERROR:', err);
  process.exit(1);
});
