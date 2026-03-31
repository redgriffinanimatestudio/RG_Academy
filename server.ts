import express from "express";
import fs from "fs";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import routes from "./api/src/routes/index";
import { errorHandler } from "./api/src/middleware/errorHandler";
import { initSocket } from "./api/src/utils/socket";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  console.log("🛠️ Starting RG Academy Server (Step 1: INIT)...");
  const app = express();
  const server = createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: true, credentials: true }
  });

  console.log("🛠️ Initializing Socket.io...");
  initSocket(io);

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 2000, // 20x increase for dev
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  });

  const corsOptions = {
    origin: [process.env.APP_URL || 'http://localhost:3000', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', limiter);

  console.log("🛠️ Registering routes...");
  // --- API ROUTES ---
  app.use('/api', routes);

  console.log("🛠️ Registering Swagger UI...");
  // Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });

  // --- MODE SELECTION ---
  // --- PRODUCTION & SERVING MODE ---
  const distPath = path.resolve(__dirname, 'dist');
  const isProduction = process.env.NODE_ENV === "production";
  const skipVite = process.env.SKIP_VITE === "true";

  if (isProduction || skipVite) {
    if (fs.existsSync(distPath)) {
      console.log("📦 PRODUCTION MODE: Serving static files from dist/");
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        // Only fallback to index.html if it's not an API call
        if (!req.path.startsWith('/api')) {
          res.sendFile(path.join(distPath, 'index.html'));
        } else {
          res.status(404).json({ error: 'API endpoint not found' });
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

  server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`\n🚀 ========================================== 🚀`);
    console.log(`🔥 PLATFORM READY: http://localhost:${PORT}`);
    console.log(`🌐 FRONTEND:      http://localhost:${PORT}`);
    console.log(`🔌 BACKEND API:   http://localhost:${PORT}/api`);
    console.log(`📚 SWAGGER DOCS:  http://localhost:${PORT}/api/docs`);
    console.log(`💎 PRISMA STUDIO: http://localhost:5555 (if running)`);
    console.log(`🚀 ========================================== 🚀\n`);
  });
}

startServer().catch(err => {
  console.error('❌ CRITICAL STARTUP ERROR:', err);
  process.exit(1);
});
