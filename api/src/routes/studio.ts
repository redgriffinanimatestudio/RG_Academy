import { Router } from 'express';
import { studioController } from '../controllers/studioController.js';
import { authMiddleware, requireClient, requireExecutor } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { 
  CreateProjectSchema, 
  SubmitApplicationSchema, 
  CreateContractSchema 
} from '../utils/validation.js';

const router = Router();

// Projects (Publicly viewable)
router.get('/projects', studioController.getProjects);
router.get('/projects/:slug', studioController.getProjectBySlug);

// Client Only: Project Management
router.post('/projects', 
  authMiddleware, 
  requireClient, 
  validate(CreateProjectSchema), 
  studioController.createProject
);
router.patch('/projects/:slug', 
  authMiddleware, 
  requireClient, 
  studioController.updateProject
);

// Applications (Executors join projects)
router.post('/applications', 
  authMiddleware, 
  requireExecutor, 
  validate(SubmitApplicationSchema), 
  studioController.submitApplication
);
router.patch('/applications/:applicationId/status', 
  authMiddleware, 
  requireClient, 
  studioController.updateApplicationStatus
);

// Services (Executors offer skills)
router.get('/services', studioController.getServices);
router.post('/services', 
  authMiddleware, 
  requireExecutor, 
  studioController.createService
);

// Contracts (B2B logic)
router.get('/contracts', authMiddleware, studioController.getContracts);
router.post('/contracts', 
  authMiddleware, 
  requireClient, 
  validate(CreateContractSchema), 
  studioController.createContract
);
router.patch('/contracts/:contractId', 
  authMiddleware, 
  studioController.updateContract
);
router.post('/contracts/:contractId/milestones/:index/release', 
  authMiddleware, 
  requireClient, 
  studioController.releaseMilestone
);

// Tasks
router.get('/projects/:projectId/tasks', studioController.getTasks);
router.post('/tasks', authMiddleware, studioController.createTask);
router.patch('/tasks/:taskId', authMiddleware, studioController.updateTask);
router.get('/tasks/my', authMiddleware, studioController.getMyTasks);

export default router;

