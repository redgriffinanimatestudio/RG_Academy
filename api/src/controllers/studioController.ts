import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { success, error, paginate } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const studioController = {
  // --- PROJECTS ---
  async getProjects(req: Request, res: Response) {
    try {
      const { status, urgency, page = '1', limit = '10', search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};
      if (status) where.status = status;
      if (urgency) where.urgency = urgency;
      if (search) {
        where.OR = [
          { title: { contains: search as string } },
          { description: { contains: search as string } }
        ];
      }

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where,
          include: {
            client: { select: { id: true, displayName: true, photoURL: true } },
            executor: { select: { id: true, displayName: true, photoURL: true } },
            _count: { select: { applications: true, tasks: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum
        }),
        prisma.project.count({ where })
      ]);

      return paginate(res, projects.map(p => ({
        ...p,
        tags: JSON.parse(p.tags || '[]')
      })), total, pageNum, limitNum);
    } catch (e) {
      return error(res, 'Failed to fetch projects');
    }
  },

  async getProjectBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const project = await prisma.project.findUnique({
        where: { slug },
        include: {
          client: { select: { id: true, displayName: true, photoURL: true, email: true } },
          executor: { select: { id: true, displayName: true, photoURL: true } },
          applications: {
            include: { executor: { select: { id: true, displayName: true, photoURL: true } } },
            orderBy: { createdAt: 'desc' }
          },
          tasks: { orderBy: { createdAt: 'desc' } },
          contracts: true
        }
      });

      if (!project) return error(res, 'Project not found', 404);

      return success(res, { ...project, tags: JSON.parse(project.tags || '[]') });
    } catch (e) {
      return error(res, 'Failed to fetch project');
    }
  },

  async createProject(req: AuthRequest, res: Response) {
    try {
      const { title, description, budget, urgency, tags } = req.body;
      const clientId = req.user!.id;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const project = await prisma.project.create({
        data: {
          title,
          slug: `${slug}-${Date.now()}`,
          description,
          clientId,
          budget: parseFloat(budget) || 0,
          urgency: urgency || 'normal',
          tags: JSON.stringify(tags || []),
          status: 'open'
        },
        include: { client: { select: { displayName: true, photoURL: true } } }
      });

      return success(res, { ...project, tags: JSON.parse(project.tags) }, 201);
    } catch (e) {
      return error(res, 'Failed to create project');
    }
  },

  async updateProject(req: AuthRequest, res: Response) {
    try {
      const { slug } = req.params;
      const { title, description, status, executorId } = req.body;

      const project = await prisma.project.update({
        where: { slug },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(status && { status }),
          ...(executorId && { executorId })
        }
      });

      return success(res, project);
    } catch (e) {
      return error(res, 'Failed to update project');
    }
  },

  // --- APPLICATIONS ---
  async submitApplication(req: AuthRequest, res: Response) {
    try {
      const { projectId, coverLetter, bid } = req.body;
      const executorId = req.user!.id;

      const existing = await prisma.application.findFirst({
        where: { projectId, executorId }
      });

      if (existing) return error(res, 'Already applied to this project', 400);

      const application = await prisma.application.create({
        data: {
          projectId,
          executorId,
          coverLetter,
          bid: parseFloat(bid),
          status: 'pending'
        },
        include: { executor: { select: { displayName: true, photoURL: true } } }
      });

      // Notify project owner
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (project) {
        await prisma.notification.create({
          data: {
            userId: project.clientId,
            type: 'info',
            title: 'New Application',
            message: `Someone applied to your project "${project.title}"`,
            link: `/studio/eng/projects/${project.slug}`
          }
        });
      }

      return success(res, application, 201);
    } catch (e) {
      return error(res, 'Failed to submit application');
    }
  },

  async updateApplicationStatus(req: AuthRequest, res: Response) {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;

      const application = await prisma.application.update({
        where: { id: applicationId },
        data: { status }
      });

      // If accepted, create contract
      if (status === 'accepted') {
        const app = await prisma.application.findUnique({
          where: { id: applicationId },
          include: { project: true }
        });

        if (app) {
          await prisma.contract.create({
            data: {
              projectId: app.projectId,
              clientId: app.project.clientId,
              executorId: app.executorId,
              amount: app.bid,
              status: 'pending',
              milestones: '[]'
            }
          });

          await prisma.project.update({
            where: { id: app.projectId },
            data: { status: 'in_progress', executorId: app.executorId }
          });

          // Notify executor
          await prisma.notification.create({
            data: {
              userId: app.executorId,
              type: 'success',
              title: 'Application Accepted!',
              message: `Your application for "${app.project.title}" was accepted`,
              link: `/studio/eng/projects/${app.project.slug}`
            }
          });
        }
      }

      return success(res, application);
    } catch (e) {
      return error(res, 'Failed to update application');
    }
  },

  // --- SERVICES ---
  async getServices(req: Request, res: Response) {
    try {
      const { category, page = '1', limit = '12' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      const where: any = {};
      if (category) where.category = category;

      const [services, total] = await Promise.all([
        prisma.service.findMany({
          where,
          include: { executor: { select: { displayName: true, photoURL: true } } },
          orderBy: { createdAt: 'desc' },
          skip: (pageNum - 1) * limitNum,
          take: limitNum
        }),
        prisma.service.count({ where })
      ]);

      return paginate(res, services.map(s => ({
        ...s,
        tags: JSON.parse(s.tags || '[]')
      })), total, pageNum, limitNum);
    } catch (e) {
      return error(res, 'Failed to fetch services');
    }
  },

  async createService(req: AuthRequest, res: Response) {
    try {
      const { title, description, price, category, tags } = req.body;
      const executorId = req.user!.id;

      const service = await prisma.service.create({
        data: {
          title,
          description,
          executorId,
          price: parseFloat(price),
          category,
          tags: JSON.stringify(tags || [])
        }
      });

      return success(res, { ...service, tags: JSON.parse(service.tags) }, 201);
    } catch (e) {
      return error(res, 'Failed to create service');
    }
  },

  // --- CONTRACTS ---
  async getContracts(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { role } = req.query;

      const where: any = {};
      if (role === 'client') where.clientId = userId;
      else if (role === 'executor') where.executorId = userId;
      else where.OR = [{ clientId: userId }, { executorId: userId }];

      const contracts = await prisma.contract.findMany({
        where,
        include: {
          project: { select: { title: true, slug: true } },
          client: { select: { displayName: true, photoURL: true } },
          executor: { select: { displayName: true, photoURL: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      return success(res, contracts.map(c => ({
        ...c,
        milestones: JSON.parse(c.milestones || '[]')
      })));
    } catch (e) {
      return error(res, 'Failed to fetch contracts');
    }
  },

  async createContract(req: AuthRequest, res: Response) {
    try {
      const { projectId, clientId, executorId, amount, milestones } = req.body;

      const contract = await prisma.contract.create({
        data: {
          projectId,
          clientId,
          executorId,
          amount: parseFloat(amount),
          milestones: JSON.stringify(milestones || []),
          status: 'pending'
        }
      });

      // Notify executor
      await prisma.notification.create({
        data: {
          userId: executorId,
          type: 'contract',
          title: 'New Contract',
          message: `A new contract for $${amount} has been created`,
          link: `/studio/eng/contracts`
        }
      });

      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'in_progress', executorId }
      });

      return success(res, contract, 201);
    } catch (e) {
      return error(res, 'Failed to create contract');
    }
  },

  async updateContract(req: AuthRequest, res: Response) {
    try {
      const { contractId } = req.params;
      const { status, milestones } = req.body;

      const contract = await prisma.contract.update({
        where: { id: contractId },
        data: {
          ...(status && { status }),
          ...(milestones && { milestones: JSON.stringify(milestones) })
        }
      });

      return success(res, contract);
    } catch (e) {
      return error(res, 'Failed to update contract');
    }
  },

  // --- TASKS ---
  async getTasks(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const tasks = await prisma.task.findMany({
        where: { projectId },
        include: { assignee: { select: { displayName: true, photoURL: true } } },
        orderBy: { createdAt: 'desc' }
      });
      return success(res, tasks);
    } catch (e) {
      return error(res, 'Failed to fetch tasks');
    }
  },

  async createTask(req: AuthRequest, res: Response) {
    try {
      const { projectId, title, assigneeId, priority, deadline } = req.body;

      const task = await prisma.task.create({
        data: {
          projectId,
          title,
          assigneeId,
          priority: priority || 'medium',
          deadline: deadline ? new Date(deadline) : null,
          status: 'todo'
        }
      });

      return success(res, task, 201);
    } catch (e) {
      return error(res, 'Failed to create task');
    }
  },

  async updateTask(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params;
      const { status, title, assigneeId, priority, deadline } = req.body;

      const task = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...(status && { status }),
          ...(title && { title }),
          ...(assigneeId !== undefined && { assigneeId }),
          ...(priority && { priority }),
          ...(deadline && { deadline: new Date(deadline) })
        }
      });

      return success(res, task);
    } catch (e) {
      return error(res, 'Failed to update task');
    }
  }
};
