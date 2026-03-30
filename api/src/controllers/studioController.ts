import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response.js';
import { AuthRequest, requireClient, requireExecutor } from '../middleware/auth.js';
import { notifyUser } from '../utils/socket.js';
import { 
  ProjectCreateInputSchema, 
  ApplicationCreateInputSchema, 
  ContractCreateInputSchema,
  TaskCreateInputSchema
} from '../schemas/generated/index.js';
import { z } from 'zod';

/**
 * @swagger
 * tags:
 *   name: Studio
 *   description: Project management and professional services
 */

export const studioController = {
  /**
   * @swagger
   * /api/v1/studio/projects:
   *   get:
   *     summary: List all projects
   *     tags: [Studio]
   */
  async getProjects(req: Request, res: Response) {
    try {
      const { search, status, budgetMin, urgency, maturity } = req.query;

      const where: any = {};
      if (status && status !== 'all') where.status = status;
      if (urgency && urgency !== 'all') where.urgency = urgency;
      if (maturity && maturity !== 'all') where.maturityLevel = maturity;
      if (budgetMin) where.budget = { gte: parseFloat(budgetMin as string) };
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      const projects = await prisma.project.findMany({
        where,
        include: { 
          client: { select: { displayName: true, photoURL: true } }, 
          _count: { select: { applications: true } } 
        },
        orderBy: { createdAt: 'desc' }
      });
      return success(res, projects);
    } catch (e) {
      return error(res, 'Database error');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/projects/{slug}:
   *   get:
   *     summary: Get project details by slug
   *     tags: [Studio]
   */
  async getProjectBySlug(req: Request, res: Response) {
    try {
      const project = await prisma.project.findUnique({
        where: { slug: req.params.slug },
        include: { 
          client: { select: { id: true, displayName: true, photoURL: true } }, 
          applications: { 
            include: { 
              executor: { 
                select: { 
                  id: true, 
                  displayName: true, 
                  photoURL: true,
                  profile: { include: { skills: { include: { skill: true } } } }
                } 
              } 
            } 
          } 
        }
      });
      if (!project) return error(res, 'Project not found', 404);
      return success(res, project);
    } catch (e) {
      return error(res, 'Database error');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/projects:
   *   post:
   *     summary: Create new project
   *     tags: [Studio]
   *     security:
   *       - bearerAuth: []
   */
  async createProject(req: AuthRequest, res: Response) {
    try {
      const validatedData = ProjectCreateInputSchema.parse(req.body);
      const { title, description, budget, urgency, tags } = validatedData;
      const slug = `${title.toLowerCase().replace(/ /g, '-')}-${Date.now()}`;
      const project = await prisma.project.create({
        data: { title, slug, description, budget, urgency, tags: JSON.stringify(tags || []), clientId: req.user!.id }
      });

      // Automatic Notification
      await prisma.notification.create({
        data: {
          userId: req.user!.id,
          type: 'success',
          title: 'Project Published',
          message: `Your project "${title}" is now live on the board.`,
          link: `/studio/eng/projects/${slug}`
        }
      });

      return success(res, project, 201);
    } catch (e) {
      return error(res, 'Failed to create project');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/projects/{slug}:
   *   patch:
   *     summary: Update project details
   *     tags: [Studio]
   *     security:
   *       - bearerAuth: []
   */
  async updateProject(req: AuthRequest, res: Response) {
    try {
      const { title, description, budget, urgency, status, tags } = req.body;
      const project = await prisma.project.update({
        where: { slug: req.params.slug, clientId: req.user!.id },
        data: { title, description, budget: budget ? parseFloat(budget) : undefined, urgency, status, tags: tags ? JSON.stringify(tags) : undefined }
      });
      return success(res, project);
    } catch (e) {
      return error(res, 'Update failed');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/applications:
   *   post:
   *     summary: Submit application for a project
   *     tags: [Studio]
   *     security:
   *       - bearerAuth: []
   */
  async submitApplication(req: AuthRequest, res: Response) {
    try {
      const validatedData = ApplicationCreateInputSchema.parse(req.body);
      const { projectId, coverLetter, bid, days, milestones } = validatedData;
      
      // 1. Fetch Project Requirements
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { client: true }
      });
      if (!project) return error(res, 'Project not found', 404);

      // 2. Fetch Executor Skills
      const executorProfile = await prisma.profile.findUnique({
        where: { userId: req.user!.id },
        include: { skills: { include: { skill: true } } }
      });
      if (!executorProfile) return error(res, 'Executor profile not found', 404);

      // 3. Calculate Skill Match Entropy
      const requiredSkills = JSON.parse(project.requiredSkills || '[]');
      const executorSkills = executorProfile.skills;
      
      let matchCount = 0;
      let totalReqLevel = 0;
      let executorReqLevel = 0;

      if (requiredSkills.length > 0) {
        requiredSkills.forEach((req: any) => {
          totalReqLevel += (req.level || 1);
          const found = executorSkills.find(s => s.skill.name.toLowerCase() === req.skill.toLowerCase());
          if (found) {
            matchCount++;
            executorReqLevel += Math.min(found.proficiency, req.level || found.proficiency);
          }
        });
      }

      const matchScore = requiredSkills.length > 0 
        ? Math.round((executorReqLevel / totalReqLevel) * 100) 
        : 100;

      // 4. Maturity Level Check (Warning/Strict)
      // Logic: If project is 'senior' but executor is 'junior', we might allow but flag it.
      
      const application = await prisma.application.create({
        data: { 
          projectId, 
          coverLetter, 
          bid, 
          days: days || 7,
          milestones: JSON.stringify(milestones || []),
          matchScore,
          executorId: req.user!.id, 
          status: 'pending' 
        },
        include: { project: true }
      });

      // WebSocket Notification for Client
      notifyUser(project.clientId, 'NEW_BID', {
        projectId: application.projectId,
        projectTitle: project.title,
        bid: application.bid,
        matchScore,
        executorName: req.user!.displayName
      });

      return success(res, application, 201);
    } catch (e) {
      console.error('[Application Error]:', e);
      return error(res, 'Application failed');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/applications/{applicationId}/status:
   *   patch:
   *     summary: Update application status (Approve/Reject)
   *     tags: [Studio]
   *     security:
   *       - bearerAuth: []
   */
  async updateApplicationStatus(req: AuthRequest, res: Response) {
    try {
      const { status } = req.body;
      const application = await prisma.application.update({
        where: { id: req.params.applicationId },
        data: { status }
      });
      return success(res, application);
    } catch (e) {
      return error(res, 'Update failed');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/services:
   *   get:
   *     summary: List all professional services
   *     tags: [Studio]
   */
  async getServices(req: Request, res: Response) {
    try {
      const services = await prisma.service.findMany({
        include: { executor: { select: { displayName: true, photoURL: true } } }
      });
      return success(res, services);
    } catch (e) {
      return error(res, 'Database error');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/services:
   *   post:
   *     summary: Offer a new service
   *     tags: [Studio]
   *     security:
   *       - bearerAuth: []
   */
  async createService(req: AuthRequest, res: Response) {
    try {
      const { title, description, price, category, tags } = req.body;
      const service = await prisma.service.create({
        data: { title, description, price: parseFloat(price), category, tags: JSON.stringify(tags || []), executorId: req.user!.id }
      });
      return success(res, service, 201);
    } catch (e) {
      return error(res, 'Service creation failed');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/contracts:
   *   get:
   *     summary: Get all user contracts
   *     tags: [Studio]
   *     security:
   *       - bearerAuth: []
   */
  async getContracts(req: AuthRequest, res: Response) {
    try {
      const contracts = await prisma.contract.findMany({
        where: { OR: [{ clientId: req.user!.id }, { executorId: req.user!.id }] },
        include: { project: true, client: { select: { displayName: true } }, executor: { select: { displayName: true } } }
      });
      return success(res, contracts);
    } catch (e) {
      return error(res, 'Database error');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/contracts:
   *   post:
   *     summary: Create production contract
   *     tags: [Studio]
   *     security:
   *       - bearerAuth: []
   */
  async createContract(req: AuthRequest, res: Response) {
    try {
      const validatedData = ContractCreateInputSchema.parse(req.body);
      const { projectId, executorId, amount, milestones } = validatedData;
      const contract = await prisma.contract.create({
        data: { projectId, clientId: req.user!.id, executorId, amount, milestones: JSON.stringify(milestones || []), status: 'pending' }
      });
      return success(res, contract, 201);
    } catch (e) {
      return error(res, 'Contract creation failed');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/contracts/{contractId}:
   *   patch:
   *     summary: Update contract status
   *     tags: [Studio]
   *     security:
   *       - bearerAuth: []
   */
  async updateContract(req: AuthRequest, res: Response) {
    try {
      const { status, milestones } = req.body;
      const contract = await prisma.contract.update({
        where: { id: req.params.contractId },
        data: { status, milestones: milestones ? JSON.stringify(milestones) : undefined }
      });
      return success(res, contract);
    } catch (e) {
      return error(res, 'Update failed');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/contracts/{contractId}/milestones/{index}/release:
   *   post:
   *     summary: Release funds for a milestone
   *     tags: [Studio]
   *     security:
   *       - bearerAuth: []
   */
  async releaseMilestone(req: AuthRequest, res: Response) {
    try {
      const { contractId, index } = req.params;
      const milestoneIdx = parseInt(index);

      const result = await prisma.$transaction(async (tx) => {
        const contract = await tx.contract.findUnique({ 
          where: { id: contractId },
          include: { project: true }
        });
        
        if (!contract) throw new Error('Contract not found');
        if (contract.clientId !== req.user!.id) throw new Error('Unauthorized');

        const milestones = JSON.parse(contract.milestones || '[]');
        const milestone = milestones[milestoneIdx];

        if (!milestone) throw new Error('Milestone not found');
        if (milestone.status === 'released') throw new Error('Milestone already released');

        milestone.status = 'released';
        milestone.releasedAt = new Date().toISOString();

        const updatedContract = await tx.contract.update({
          where: { id: contractId },
          data: { milestones: JSON.stringify(milestones) }
        });

        const transaction = await tx.transaction.create({
          data: {
            userId: contract.executorId,
            amount: milestone.amount,
            type: 'payout',
            status: 'completed',
            refId: `${contractId}-${milestoneIdx}`,
            description: `Milestone "${milestone.title}" released for project: ${contract.project.title}`
          }
        });

        // Atomic Balance Update (Financial Bridge)
        await tx.user.update({
          where: { id: contract.executorId },
          data: { balance: { increment: milestone.amount } }
        });

        // System Notification (Persistence)
        await tx.notification.create({
          data: {
            userId: contract.executorId,
            type: 'success',
            title: 'Payment Received',
            message: `Milestone "${milestone.title}" has been released. $${milestone.amount} added to your balance.`,
            link: `/studio/eng/contracts`
          }
        });

        // WebSocket Notification (Real-Time)
        notifyUser(contract.executorId, 'PAYMENT_RECEIVED', {
          amount: milestone.amount,
          projectTitle: contract.project.title,
          milestoneTitle: milestone.title
        });

        return { updatedContract, transaction };
      });

      return success(res, result);
    } catch (e: any) {
      console.error('[Transaction Error]:', e);
      return error(res, e.message || 'Milestone release failed', 400);
    }
  },

  /**
   * @swagger
   * /api/v1/studio/projects/{projectId}/tasks:
   *   get:
   *     summary: Get all project tasks
   *     tags: [Studio]
   */
  async getTasks(req: Request, res: Response) {
    try {
      const tasks = await prisma.task.findMany({
        where: { projectId: req.params.projectId },
        include: { assignee: { select: { displayName: true } } }
      });
      return success(res, tasks);
    } catch (e) {
      return error(res, 'Database error');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/tasks:
   *   post:
   *     summary: Create project task
   *     tags: [Studio]
   *     security:
   *       - bearerAuth: []
   */
  async createTask(req: AuthRequest, res: Response) {
    try {
      const { projectId, title, assigneeId, priority, deadline } = req.body;
      const task = await prisma.task.create({
        data: { projectId, title, assigneeId, priority, deadline: deadline ? new Date(deadline) : null, status: 'todo' }
      });
      return success(res, task, 201);
    } catch (e) {
      return error(res, 'Task creation failed');
    }
  },

  /**
   * @swagger
   * /api/v1/studio/tasks/{taskId}:
   *   patch:
   *     summary: Update task status/details
   *     tags: [Studio]
   *     security:
   *       - bearerAuth: []
   */
  async updateTask(req: AuthRequest, res: Response) {
    try {
      const { title, status, priority, assigneeId, deadline } = req.body;
      const task = await prisma.task.update({
        where: { id: req.params.taskId },
        data: { title, status, priority, assigneeId, deadline: deadline ? new Date(deadline) : undefined }
      });
      return success(res, task);
    } catch (e) {
      return error(res, 'Update failed');
    }
  },

  async getMyTasks(req: AuthRequest, res: Response) {
    try {
      const tasks = await prisma.task.findMany({
        where: { assigneeId: req.user!.id },
        include: { project: { select: { title: true, slug: true } } },
        orderBy: { updatedAt: 'desc' }
      });
      return success(res, tasks);
    } catch (e) {
      return error(res, 'Failed to fetch your tasks');
    }
  }
};
