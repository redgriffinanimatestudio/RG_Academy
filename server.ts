import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Red Griffin Ecosystem API',
      version: '1.0.0',
      description: 'API Documentation for Red Griffin Academy & Studio Ecosystem',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./server.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Swagger UI
  const swaggerOptions_ui = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Red Griffin API Docs"
  };
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptions_ui));

  console.log("-----------------------------------------");
  console.log("🚀 RED GRIFFIN SERVER STARTING...");
  console.log("📑 Swagger UI: http://localhost:3000/api/docs");
  console.log("-----------------------------------------");

  /**
   * @openapi
   * /api/health:
   *   get:
   *     description: Check API health
   *     responses:
   *       200:
   *         description: Returns API status
   */
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", database: "connected" });
  });

  // DEV AUTH: Protected access
  app.post("/api/dev/auth", async (req, res) => {
    const { login, password } = req.body;
    if (login === 'admin' && password === 'admin') {
      const admin = await prisma.user.findUnique({ 
        where: { email: 'admin@redgriffin.academy' } 
      });
      return res.json({ success: true, user: admin });
    }
    res.status(401).json({ error: "Invalid credentials" });
  });

  // DEV MODE: Quick Login (existing)
  app.post("/api/dev/login", async (req, res) => {
    const { email, displayName } = req.body;
    try {
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            displayName,
            role: 'admin', // Dev users are admins by default
            source: 'local'
          }
        });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Dev login failed" });
    }
  });

  // GET User profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { enrollments: true }
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // SYNC: Placeholder for Firebase Sync
  app.post("/api/sync", async (req, res) => {
    // This will be implemented in the next step
    res.json({ message: "Sync started (stub)" });
  });

  // GET all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { order: 'asc' }
      });
      // Parse subcategories back from JSON string
      const parsedCategories = categories.map(cat => ({
        ...cat,
        subcategories: JSON.parse(cat.subcategories)
      }));
      res.json(parsedCategories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // GET all courses
  app.get("/api/courses", async (req, res) => {
    const { category, level } = req.query;
    try {
      const courses = await prisma.course.findMany({
        where: {
          ...(category ? { categoryId: String(category) } : {}),
          ...(level ? { level: String(level) } : {}),
          status: 'published'
        },
        include: {
          category: true
        }
      });
      // Parse tags back from JSON string
      const parsedCourses = courses.map(course => ({
        ...course,
        tags: JSON.parse(course.tags)
      }));
      res.json(parsedCourses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  // GET course by slug
  app.get("/api/courses/:slug", async (req, res) => {
    try {
      const course = await prisma.course.findUnique({
        where: { slug: req.params.slug },
        include: {
          lessons: { orderBy: { order: 'asc' } },
          reviews: true
        }
      });
      if (!course) return res.status(404).json({ error: "Course not found" });
      
      res.json({
        ...course,
        tags: JSON.parse(course.tags)
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // --- NETWORKING API (STUDIO MODE) ---

  // GET User profile by user ID or handle
  app.get("/api/v1/studio/profiles/:userId", async (req, res) => {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: req.params.userId },
        include: {
          user: true,
          skills: true,
          portfolio: true,
          _count: {
            select: { portfolio: true }
          }
        }
      });
      if (!profile) return res.status(404).json({ error: "Profile not found" });
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // UPDATE or CREATE Profile
  app.post("/api/v1/studio/profiles", async (req, res) => {
    const { userId, bio, avatar, location, skills } = req.body;
    try {
      const profile = await prisma.profile.upsert({
        where: { userId },
        update: {
          bio,
          avatar,
          location,
          skills: {
            set: [], // Clear existing skills
            connectOrCreate: skills.map((skill: string) => ({
              where: { name: skill },
              create: { name: skill }
            }))
          }
        },
        create: {
          userId,
          bio,
          avatar,
          location,
          skills: {
            connectOrCreate: skills.map((skill: string) => ({
              where: { name: skill },
              create: { name: skill }
            }))
          }
        },
        include: { skills: true }
      });
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // FOLLOW a user
  app.post("/api/v1/studio/connections", async (req, res) => {
    const { followerId, followingId } = req.body;
    try {
      const connection = await prisma.connection.create({
        data: { followerId, followingId }
      });
      
      // Create Feed Event
      await prisma.feedEvent.create({
        data: {
          actorId: followerId,
          type: 'follow',
          refId: followingId,
          payload: JSON.stringify({ timestamp: new Date() })
        }
      });

      res.json(connection);
    } catch (error) {
      res.status(500).json({ error: "Failed to follow user" });
    }
  });

  // UNFOLLOW a user
  app.delete("/api/v1/studio/connections", async (req, res) => {
    const { followerId, followingId } = req.body;
    try {
      await prisma.connection.deleteMany({
        where: {
          followerId: followerId,
          followingId: followingId
        }
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to unfollow user" });
    }
  });

  // GET Feed for a user (simplified)
  app.get("/api/v1/studio/feed/:userId", async (req, res) => {
    try {
      // Find who the user is following
      const following = await prisma.connection.findMany({
        where: { followerId: req.params.userId },
        select: { followingId: true }
      });
      const followingIds = following.map(f => f.followingId);
      
      // Get events from those users
      const events = await prisma.feedEvent.findMany({
        where: {
          actorId: { in: followingIds }
        },
        include: {
          actor: true
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feed" });
    }
  });

  // DISCOVERY: Search people
  app.get("/api/v1/studio/discovery/search", async (req, res) => {
    const { query, skill } = req.query;
    try {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { displayName: { contains: String(query || '') } },
            { profile: { skills: { some: { name: { contains: String(skill || query || '') } } } } }
          ]
        },
        include: {
          profile: { include: { skills: true } }
        }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to search users" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
