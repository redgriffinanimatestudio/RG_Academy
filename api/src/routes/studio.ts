import { Router } from 'express';
import { studioController } from '../controllers/studioController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Projects
router.get('/projects', studioController.getProjects);
router.get('/projects/:slug', studioController.getProjectBySlug);
router.post('/projects', authMiddleware, studioController.createProject);
router.patch('/projects/:slug', authMiddleware, studioController.updateProject);

// Applications
router.post('/applications', authMiddleware, studioController.submitApplication);
router.patch('/applications/:applicationId', authMiddleware, studioController.updateApplicationStatus);

// Services
router.get('/services', studioController.getServices);
router.post('/services', authMiddleware, studioController.createService);

// Contracts
router.get('/contracts', authMiddleware, studioController.getContracts);
router.post('/contracts', authMiddleware, studioController.createContract);
router.patch('/contracts/:contractId', authMiddleware, studioController.updateContract);

// Tasks
router.get('/projects/:projectId/tasks', studioController.getTasks);
router.post('/tasks', authMiddleware, studioController.createTask);
router.patch('/tasks/:taskId', authMiddleware, studioController.updateTask);

export default router;
