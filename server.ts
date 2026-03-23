import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

// --- OPENAPI SPECIFICATION ---
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Red Griffin Ecosystem API',
    version: '2.6.0',
    description: 'Comprehensive API for Red Griffin Academy & Studio (Hybrid Architecture)',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local Dev Server' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Auth', description: 'Identity & Synchronization' },
    { name: 'User', description: 'Profiles & Enrollments' },
    { name: 'Academy', description: 'LMS: Courses & Progress' },
    { name: 'Studio', description: 'Marketplace: Projects & Contracts' },
    { name: 'Notifications', description: 'User Alerts & Activity' },
    { name: 'Moderation', description: 'Safety & Compliance' },
    { name: 'System', description: 'Core: Analytics & Search' }
  ],
  paths: {
    '/api/health': { 
      get: { 
        tags: ['System'], 
        summary: 'Health Check', 
        responses: { 200: { description: 'OK' } } 
      } 
    },
    '/api/dev/auth': { 
      post: { 
        tags: ['Auth'], 
        summary: 'Backdoor Login (user/user)',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  login: { type: 'string', example: 'user' },
                  password: { type: 'string', example: 'user' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' }, 401: { description: 'Unauthorized' } } 
      } 
    },
    
    '/api/users/{id}': { 
      get: { 
        tags: ['User'], 
        summary: 'Get User Data', 
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], 
        responses: { 200: { description: 'Success' }, 404: { description: 'Not Found' } } 
      }
    },
    
    '/api/notifications/{userId}': {
      get: { 
        tags: ['Notifications'], 
        summary: 'Get User Notifications', 
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], 
        responses: { 200: { description: 'List of alerts' } } 
      }
    },
    '/api/notifications/{id}/read': {
      patch: { 
        tags: ['Notifications'], 
        summary: 'Mark as Read', 
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], 
        responses: { 200: { description: 'Updated' } } 
      }
    },
    
    '/api/courses': { 
      get: { 
        tags: ['Academy'], 
        summary: 'List Courses', 
        responses: { 200: { description: 'Success' } } 
      } 
    },
    '/api/v1/studio/contracts': { 
      post: { 
        tags: ['Studio'], 
        summary: 'Create Contract', 
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['projectId', 'clientId', 'executorId', 'amount'],
                properties: {
                  projectId: { type: 'string' },
                  clientId: { type: 'string' },
                  executorId: { type: 'string' },
                  amount: { type: 'number' },
                  milestones: { type: 'array', items: { type: 'object' } }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Created' }, 500: { description: 'Error' } } 
      } 
    },
    '/api/v1/moderation/reports': { 
      post: { 
        tags: ['Moderation'], 
        summary: 'Submit Report', 
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reporterId', 'targetType', 'targetId', 'reason'],
                properties: {
                  reporterId: { type: 'string' },
                  targetType: { type: 'string', example: 'user' },
                  targetId: { type: 'string' },
                  reason: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Submitted' }, 500: { description: 'Error' } } 
      } 
    },
    '/api/v1/admin/stats': { 
      get: { 
        tags: ['System'], 
        summary: 'Platform Analytics', 
        responses: { 200: { description: 'Stats data' } } 
      } 
    }
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Swagger UI
  app.get('/api/docs.json', (req, res) => res.json(openApiSpec));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    customSiteTitle: "Red Griffin API Docs",
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: { persistAuthorization: true }
  }));

  // --- SYSTEM & AUTH ---
  app.get("/api/health", (req, res) => res.json({ status: "active", db: "connected" }));

  app.post("/api/dev/auth", async (req, res) => {
    const { login, password } = req.body;
    if (login === 'user' && password === 'user') {
      let admin = await prisma.user.findUnique({ where: { email: 'super@redgriffin.academy' }, include: { profile: true } });
      if (!admin) admin = await prisma.user.findUnique({ where: { email: 'admin@redgriffin.academy' }, include: { profile: true } });
      if (admin) return res.json({ success: true, token: "DEV_TOKEN_SUPER_ADMIN", user: { ...admin, roles: ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'student', 'lecturer', 'executor', 'client'] } });
    }
    res.status(401).json({ error: "Unauthorized" });
  });

  // --- NOTIFICATIONS ---
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const alerts = await prisma.notification.findMany({
        where: { userId: req.params.userId },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      res.json(alerts);
    } catch (e) { res.status(500).json({ error: "Failed to fetch notifications" }); }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const alert = await prisma.notification.update({
        where: { id: req.params.id },
        data: { isRead: true }
      });
      res.json(alert);
    } catch (e) { res.status(500).json({ error: "Failed to update notification" }); }
  });

  // --- USER & ACADEMY ---
  app.get("/api/users/:id", async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, include: { profile: { include: { skills: true } } } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  app.get("/api/courses", async (req, res) => {
    const courses = await prisma.course.findMany({ where: { status: 'published' }, include: { category: true } });
    res.json(courses.map(c => ({ ...c, tags: JSON.parse(c.tags) })));
  });

  // --- STUDIO & AUTOMATION ---
  app.post("/api/v1/studio/contracts", async (req, res) => {
    const { projectId, clientId, executorId, amount, milestones } = req.body;
    try {
      const contract = await prisma.contract.create({
        data: { projectId, clientId, executorId, amount: parseFloat(amount), milestones: JSON.stringify(milestones || []) }
      });
      
      // AUTO-NOTIFICATION for Executor
      await prisma.notification.create({
        data: {
          userId: executorId,
          type: 'contract',
          title: 'New Contract Awarded',
          message: `You have been selected for project. Contract amount: $${amount}`,
          link: `/studio/eng/contracts/${contract.id}`
        }
      });

      await prisma.project.update({ where: { id: projectId }, data: { status: 'in_progress', executorId } });
      res.json(contract);
    } catch (e) { res.status(500).json({ error: "Contract failed" }); }
  });

  // --- MODERATION ---
  app.post("/api/v1/moderation/reports", async (req, res) => {
    const { reporterId, targetType, targetId, reason } = req.body;
    try {
      const report = await prisma.report.create({ data: { reporterId, targetType, targetId, reason } });
      
      // AUTO-NOTIFICATION for Admins/Moderators (simplified to super admin)
      const admins = await prisma.user.findMany({ where: { role: 'admin' } });
      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            type: 'report',
            title: 'New Safety Report',
            message: `New report on ${targetType}. Reason: ${reason.slice(0, 30)}...`,
            link: '/dashboard?view=complaints'
          }
        });
      }

      res.json(report);
    } catch (e) { res.status(500).json({ error: "Report failed" }); }
  });

  // --- ADMIN STATS ---
  app.get("/api/v1/admin/stats", async (req, res) => {
    const stats = {
      users: await prisma.user.count(),
      courses: await prisma.course.count({ where: { status: 'published' } }),
      projects: await prisma.project.count({ where: { status: 'open' } }),
      activeNotifications: await prisma.notification.count({ where: { isRead: false } })
    };
    res.json(stats);
  });

  // --- VITE / STATIC ---
  if (process.env.NODE_ENV !== "production" && !process.env.SKIP_VITE) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Red Griffin ready at http://localhost:${PORT}`));
}

startServer().catch(err => console.error(err));
