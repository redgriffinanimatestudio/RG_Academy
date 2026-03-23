import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import routes from "./api/src/routes/index";
import { errorHandler, notFound } from "./api/src/middleware/errorHandler";
import logger from "./api/src/utils/logger";
import { initSocket } from "./api/src/utils/socket";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- OPENAPI SPECIFICATION ---
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Red Griffin Ecosystem API',
    version: '2.7.0',
    description: 'Comprehensive REST API for Red Griffin Academy & Studio Platform',
    contact: { name: 'Red Griffin Team', url: 'https://rgacademy.space' }
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local Development' },
    { url: 'https://rgacademy.space', description: 'Production' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          displayName: { type: 'string' },
          photoURL: { type: 'string' },
          role: { type: 'string' }
        }
      },
      Course: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          rating: { type: 'number' },
          level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
        }
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          budget: { type: 'number' },
          status: { type: 'string', enum: ['open', 'in_progress', 'completed', 'cancelled'] }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Auth', description: 'Authentication & User Sync' },
    { name: 'Academy', description: 'LMS: Courses, Lessons & Enrollments' },
    { name: 'Studio', description: 'Marketplace: Projects, Services & Contracts' },
    { name: 'Networking', description: 'Profiles, Connections & Discovery' },
    { name: 'Notifications', description: 'User Alerts & Activity' },
    { name: 'Admin', description: 'Platform Management & Moderation' },
    { name: 'System', description: 'Health & Utilities' }
  ],
  paths: {
    '/api/health': {
      get: { tags: ['System'], summary: 'Health Check', responses: { 200: { description: 'Server status' } } }
    },
    '/api/dev/auth': {
      post: {
        tags: ['Auth'],
        summary: 'Dev Login (user/user)',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { login: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { 200: { description: 'Token & user data' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/api/sync': {
      post: {
        tags: ['Auth'],
        summary: 'Sync Firebase User',
        requestBody: { content: { 'application/json': { schema: { type: 'object', required: ['remoteId', 'email'], properties: { remoteId: { type: 'string' }, email: { type: 'string' }, displayName: { type: 'string' }, photoURL: { type: 'string' } } } } } },
        responses: { 200: { description: 'Synced user' } }
      }
    },
    '/api/me': {
      get: { tags: ['Auth'], summary: 'Get Current User', security: [{ bearerAuth: [] }], responses: { 200: { description: 'User data' } } }
    },
    '/api/users/{id}': {
      get: { tags: ['Auth'], summary: 'Get User by ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'User data' } } }
    },
    '/api/categories': {
      get: { tags: ['Academy'], summary: 'List Categories', responses: { 200: { description: 'Categories list' } } }
    },
    '/api/courses': {
      get: {
        tags: ['Academy'],
        summary: 'List Courses',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'level', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } }
        ],
        responses: { 200: { description: 'Paginated courses' } }
      },
      post: { tags: ['Academy'], summary: 'Create Course', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' } } }
    },
    '/api/courses/{slug}': {
      get: { tags: ['Academy'], summary: 'Get Course Details', parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Course with lessons & reviews' } } }
    },
    '/api/enroll': {
      post: { tags: ['Academy'], summary: 'Enroll in Course', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Enrollment created' } } }
    },
    '/api/users/{userId}/enrollments': {
      get: { tags: ['Academy'], summary: 'Get User Enrollments', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Enrollments list' } } }
    },
    '/api/v1/studio/projects': {
      get: {
        tags: ['Studio'],
        summary: 'List Projects',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'urgency', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Paginated projects' } }
      },
      post: { tags: ['Studio'], summary: 'Create Project', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' } } }
    },
    '/api/v1/studio/projects/{slug}': {
      get: { tags: ['Studio'], summary: 'Get Project Details', parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Project details' } } }
    },
    '/api/v1/studio/services': {
      get: { tags: ['Studio'], summary: 'List Services', responses: { 200: { description: 'Services list' } } },
      post: { tags: ['Studio'], summary: 'Create Service', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' } } }
    },
    '/api/v1/studio/applications': {
      post: { tags: ['Studio'], summary: 'Submit Application', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Application submitted' } } }
    },
    '/api/v1/studio/contracts': {
      get: { tags: ['Studio'], summary: 'List User Contracts', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Contracts list' } } },
      post: { tags: ['Studio'], summary: 'Create Contract', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Contract created' } } }
    },
    '/api/v1/studio/profiles/{userId}': {
      get: { tags: ['Networking'], summary: 'Get Profile', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Profile data' } } }
    },
    '/api/v1/studio/profiles': {
      post: { tags: ['Networking'], summary: 'Update Profile', security: [{ bearerAuth: [] }], responses: {200: { description: 'Updated profile' } } }
    },
    '/api/v1/studio/connections': {
      post: { tags: ['Networking'], summary: 'Follow User', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Following' } } },
      delete: { tags: ['Networking'], summary: 'Unfollow User', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Unfollowed' } } }
    },
    '/api/v1/studio/feed/{userId}': {
      get: { tags: ['Networking'], summary: 'Get Activity Feed', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Feed events' } } }
    },
    '/api/v1/studio/discovery/search': {
      get: {
        tags: ['Networking'],
        summary: 'Search Profiles',
        parameters: [
          { name: 'query', in: 'query', schema: { type: 'string' } },
          { name: 'skill', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Search results' } }
      }
    },
    '/api/notifications/{userId}': {
      get: { tags: ['Notifications'], summary: 'Get User Notifications', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Notifications list' } } }
    },
    '/api/notifications/{id}/read': {
      patch: { tags: ['Notifications'], summary: 'Mark as Read', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } }
    },
    '/api/v1/admin/stats': {
      get: { tags: ['Admin'], summary: 'Platform Statistics', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Dashboard stats' } } }
    },
    '/api/v1/admin/users': {
      get: { tags: ['Admin'], summary: 'List All Users', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Users list' } } }
    },
    '/api/v1/admin/reports': {
      get: { tags: ['Admin'], summary: 'List Reports', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Reports list' } } },
      post: { tags: ['Admin'], summary: 'Submit Report', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Report created' } } }
    }
  }
};

async function startServer() {
  const app = express();
  const server = createServer(app);
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://rgacademy.space', 'https://www.rgacademy.space']
        : true,
      credentials: true
    }
  });

  // Initialize socket utility
  initSocket(io);
  // Dev Deployment Endpoint
  app.post('/api/dev/deploy', async (req, res) => {
    const { userId } = req.body;

    // In a real app, you'd verify admin/dev role here via firebase-admin
    console.log(`[DEPLOY] Deployment triggered by user: ${userId}`);

    try {
      // Simulate build process
      // In production, you could use: exec('npm run build && firebase deploy')
      res.json({ 
        success: true, 
        message: 'Deployment pipeline initiated',
        steps: ['Build started', 'Optimizing assets', 'Uploading to edge', 'CDN Purge complete'],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Deployment failed', error: error.message });
    }
  });

  const PORT = process.env.PORT || 5000;


  // Socket.IO connection handling
  io.on('connection', (socket) => {
    logger.info('User connected', { socketId: socket.id });

    // Join user room for personal notifications
    socket.on('join-user', (userId: string) => {
      socket.join(`user-${userId}`);
      logger.info('User joined room', { socketId: socket.id, userId });
    });

    // Join project room for project updates
    socket.on('join-project', (projectId: string) => {
      socket.join(`project-${projectId}`);
      logger.info('User joined project room', { socketId: socket.id, projectId });
    });

    // Join chat room
    socket.on('join-chat', (roomId: string) => {
      socket.join(`chat-${roomId}`);
      logger.info('User joined chat room', { socketId: socket.id, roomId });
    });

    socket.on('disconnect', () => {
      logger.info('User disconnected', { socketId: socket.id });
    });
  });

  // Middleware
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://rgacademy.space', 'https://www.rgacademy.space']
      : true,
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // Stricter rate limiting for auth endpoints - increased for dev
  const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // increased to 100 for testing
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/dev/auth', authLimiter);
  app.use('/api/sync', authLimiter);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: req.method !== 'GET' ? req.body : undefined
    });
    next();
  });

  // Swagger UI
  app.get('/api/docs.json', (req, res) => res.json(openApiSpec));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    customSiteTitle: "Red Griffin API Docs",
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: { persistAuthorization: true }
  }));

  // API Routes
  app.use('/api', routes);

  // Error handling
  app.use('/api/*', notFound);
  app.use(errorHandler);

  // Vite / Static files
  if (process.env.NODE_ENV !== "production" && !process.env.SKIP_VITE) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
