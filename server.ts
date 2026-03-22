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
    version: '2.4.0',
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
    { name: 'Academy', description: 'LMS: Courses, Lessons, Reviews' },
    { name: 'Studio', description: 'Marketplace: Projects, Contracts, Tasks' },
    { name: 'Networking', description: 'Social: Profiles & Feed' },
    { name: 'Moderation', description: 'Safety: Trust & Reports' },
    { name: 'System', description: 'Core: Analytics & Search' }
  ],
  paths: {
    '/api/health': { get: { tags: ['System'], summary: 'Health Check', responses: { 200: { description: 'OK' } } } },
    '/api/dev/auth': { post: { tags: ['Auth'], summary: 'Backdoor Login (user/user)', responses: { 200: { description: 'Success' } } } },
    
    '/api/courses': { 
      get: { tags: ['Academy'], summary: 'List Published Courses', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Academy'], summary: 'Create New Course', responses: { 200: { description: 'Created' } } }
    },
    
    '/api/v1/studio/projects': { 
      get: { tags: ['Studio'], summary: 'List Projects', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Studio'], summary: 'Post Project', responses: { 200: { description: 'Created' } } }
    },
    '/api/v1/studio/projects/{id}/apply': {
      post: { tags: ['Studio'], summary: 'Apply to Project', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Applied' } } }
    },
    '/api/v1/studio/contracts': {
      get: { tags: ['Studio'], summary: 'List Contracts', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Studio'], summary: 'Create Contract', responses: { 200: { description: 'Created' } } }
    },
    '/api/v1/studio/contracts/{id}': {
      get: { tags: ['Studio'], summary: 'Contract Details', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } }
    },
    '/api/v1/studio/projects/{id}/tasks': {
      get: { tags: ['Studio'], summary: 'List Project Tasks', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
      post: { tags: ['Studio'], summary: 'Add Task to Project', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Created' } } }
    },
    
    '/api/v1/moderation/reports': { get: { tags: ['Moderation'], summary: 'List Reports', responses: { 200: { description: 'Success' } } } },
    '/api/v1/admin/stats': { get: { tags: ['System'], summary: 'Platform Analytics', responses: { 200: { description: 'Stats data' } } } }
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

  // --- ACADEMY ---
  app.get("/api/courses", async (req, res) => {
    const courses = await prisma.course.findMany({ where: { status: 'published' }, include: { category: true } });
    res.json(courses.map(c => ({ ...c, tags: JSON.parse(c.tags) })));
  });

  // --- STUDIO (PROJECTS & APPLICATIONS) ---
  app.get("/api/v1/studio/projects", async (req, res) => {
    const projects = await prisma.project.findMany({ 
      include: { client: true, executor: true, _count: { select: { applications: true } } }, 
      orderBy: { createdAt: 'desc' } 
    });
    res.json(projects.map(p => ({ ...p, tags: JSON.parse(p.tags) })));
  });

  app.post("/api/v1/studio/projects/:id/apply", async (req, res) => {
    const { executorId, coverLetter, bid } = req.body;
    try {
      const application = await prisma.application.create({
        data: { projectId: req.params.id, executorId, coverLetter, bid: parseFloat(bid) }
      });
      res.json(application);
    } catch (e) { res.status(500).json({ error: "Application failed" }); }
  });

  // --- STUDIO (CONTRACTS) ---
  app.get("/api/v1/studio/contracts", async (req, res) => {
    const contracts = await prisma.contract.findMany({
      include: { project: true, client: true, executor: true }
    });
    res.json(contracts);
  });

  app.post("/api/v1/studio/contracts", async (req, res) => {
    const { projectId, clientId, executorId, amount, milestones } = req.body;
    try {
      const contract = await prisma.contract.create({
        data: { projectId, clientId, executorId, amount: parseFloat(amount), milestones: JSON.stringify(milestones || []) }
      });
      // Also update project status
      await prisma.project.update({ where: { id: projectId }, data: { status: 'in_progress', executorId } });
      res.json(contract);
    } catch (e) { res.status(500).json({ error: "Contract creation failed" }); }
  });

  app.get("/api/v1/studio/contracts/:id", async (req, res) => {
    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id },
      include: { project: true, client: true, executor: true }
    });
    if (!contract) return res.status(404).json({ error: "Contract not found" });
    res.json({ ...contract, milestones: JSON.parse(contract.milestones) });
  });

  // --- STUDIO (TASKS) ---
  app.get("/api/v1/studio/projects/:id/tasks", async (req, res) => {
    const tasks = await prisma.task.findMany({ where: { projectId: req.params.id }, include: { assignee: true } });
    res.json(tasks);
  });

  app.post("/api/v1/studio/projects/:id/tasks", async (req, res) => {
    const { title, assigneeId, priority, deadline } = req.body;
    try {
      const task = await prisma.task.create({
        data: { projectId: req.params.id, title, assigneeId, priority, deadline: deadline ? new Date(deadline) : null }
      });
      res.json(task);
    } catch (e) { res.status(500).json({ error: "Task creation failed" }); }
  });

  // --- ADMIN STATS ---
  app.get("/api/v1/admin/stats", async (req, res) => {
    const stats = {
      users: await prisma.user.count(),
      courses: await prisma.course.count({ where: { status: 'published' } }),
      projects: await prisma.project.count({ where: { status: 'open' } }),
      contracts: await prisma.contract.count({ where: { status: 'active' } }),
      revenue: await prisma.contract.aggregate({ _sum: { amount: true } })
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
