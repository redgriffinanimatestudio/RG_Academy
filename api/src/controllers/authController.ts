import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { generateToken } from '../utils/auth.js';
import bcrypt from 'bcrypt';
import { 
  UserCreateInputSchema, 
  UserUpdateInputSchema,
  ProfileUpsertWithoutUserInputSchema
} from '../schemas/generated/index.js';
import { z } from 'zod';

// Временное кэширование OTP в памяти сервера
// Формат: { '+7900...': { code: '123456', expiresAt: 1234123, attempts: 0 } }
const otpCache = new Map<string, { code: string; expiresAt: number; attempts: number }>();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and identity management
 */

export const authController = {
  /**
   * @swagger
   * /api/auth/dev/auth:
   *   post:
   *     summary: Developer backdoor login
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               login: { type: string }
   *               password: { type: string }
   */
  async devLogin(req: Request, res: Response) {
    try {
      const { login, password } = req.body;
      if (login === 'admin' && password === 'admin') {
        const user = await prisma.user.upsert({
          where: { email: 'admin@redgriffin.academy' },
          update: { password: bcrypt.hashSync('admin', 10) },
          create: {
            email: 'admin@redgriffin.academy',
            password: bcrypt.hashSync('admin', 10),
            displayName: 'System Architect',
            role: 'admin',
            primaryRole: 'admin',
            roles: JSON.stringify(['admin', 'student', 'lecturer', 'client', 'executor', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support']),
            isAdmin: true,
            isStudent: true
          }
        });
        const rolesArray = JSON.parse(user.roles || '["student"]');
        return success(res, {
          token: generateToken(user.id, user.email!),
          user: { ...user, roles: rolesArray }
        });
      }
      return error(res, 'Invalid credentials', 401);
    } catch (e) {
      return error(res, 'Internal error', 500);
    }
  },

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Professional login
   *     tags: [Auth]
   */
  async login(req: Request, res: Response) {
    try {
      // Manual small schema for login credentials
      const loginSchema = z.object({
        login: z.string().min(1, 'Login is required'),
        password: z.string().min(1, 'Password is required')
      });

      const { login, password } = loginSchema.parse(req.body);
      
      // 1. Support dev backdoor 'admin'/'admin' inside professional login
      if (login === 'admin' && password === 'admin') {
        const user = await prisma.user.upsert({
          where: { email: 'admin@redgriffin.academy' },
          update: { password: bcrypt.hashSync('admin', 10) },
          create: {
            email: 'admin@redgriffin.academy',
            password: bcrypt.hashSync('admin', 10),
            displayName: 'System Architect',
            role: 'admin',
            primaryRole: 'admin',
            roles: JSON.stringify(['admin', 'student', 'lecturer', 'chief_manager', 'manager', 'hr', 'finance']),
            isAdmin: true,
            isStudent: true
          }
        });
        return success(res, {
          token: generateToken(user.id, user.email!),
          user: { ...user, roles: JSON.parse(user.roles || '["admin"]') }
        });
      }

      // 2. Regular email/password login
      const user = await prisma.user.findUnique({ where: { email: login } });
      
      if (!user || !user.password) {
        return error(res, 'Invalid email or password', 401);
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return error(res, 'Invalid email or password', 401);
      }

      const rolesArray = JSON.parse(user.roles || '["student"]');
      return success(res, {
        token: generateToken(user.id, user.email!),
        user: { ...user, roles: rolesArray }
      });
    } catch (e) {
      return error(res, 'Login failed', 500);
    }
  },

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Fast registration
   *     tags: [Auth]
   */
  async register(req: Request, res: Response) {
    try {
      const { email, displayName, phone, password, role, provider, profileData } = req.body;

      // Check for existing node
      let user = await prisma.user.findUnique({ where: { email } });
      if (user) return res.status(400).json({ success: false, error: 'Node already active in grid' });

      const roles = role === 'admin' ? ['admin', 'student', 'lecturer'] : [role || 'student'];
      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
      
      // Create user with full professional profile node
      user = await prisma.user.create({
        data: {
          email, 
          displayName, 
          phone, 
          password: hashedPassword,
          role: role || 'user', 
          primaryRole: role || 'user',
          roles: JSON.stringify(roles), 
          source: provider || 'local', 
          isStudent: role === 'student', 
          isClient: role === 'client', 
          isExecutor: role === 'executor',
          profile: { 
            create: { 
              bio: profileData?.bio || `Registered via ${provider || 'Auth System'}`,
              country: profileData?.country,
              citizenship: profileData?.citizenship,
              linkedInUrl: profileData?.linkedInUrl,
              telegramHandle: profileData?.telegramHandle,
              portfolioUrl: profileData?.portfolioUrl,
              gender: profileData?.gender,
              dateOfBirth: profileData?.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
              ageCategory: profileData?.dateOfBirth ? (() => {
                const age = new Date().getFullYear() - new Date(profileData.dateOfBirth).getFullYear();
                if (age < 13) return 'child';
                if (age < 18) return 'teen';
                return 'adult';
              })() : undefined
            } 
          }
        },
        include: { profile: true }
      });

      return success(res, { 
        token: generateToken(user.id, user.email!), 
        user: { ...user, roles } 
      });
    } catch (e: any) {
      console.error('Registration Error:', e);
      return error(res, 'Registration failed', 500);
    }
  },

  /**
   * @swagger
   * /api/auth/otp/send:
   *   post:
   *     summary: Send Fast Access OTP Code (Mocked via console)
   */
  async sendOtp(req: Request, res: Response) {
    try {
      const { phone } = req.body;
      if (!phone) return error(res, 'Phone is required', 400);

      // Генерация 6-значного кода
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Храним в памяти 2 минуты (120000 мс) и даем 3 попытки
      otpCache.set(phone, {
        code,
        expiresAt: Date.now() + 2 * 60 * 1000,
        attempts: 0
      });

      // ЯРКИЙ ЛОГ В КОНСОЛЬ СЕРВЕРА (терминал npm run dev)
      console.log('\n======================================================');
      console.log('⚡ [FAST ACCESS] КОД АВТОРИЗАЦИИ ЗАПРОШЕН');
      console.log(`📱 Телефон: ${phone}`);
      console.log(`🔑 КОД ДЛЯ ВХОДА:  \x1b[32m\x1b[1m${code}\x1b[0m   <--- (Введите его на сайте)`);
      console.log('⏳ Срок действия: 2 минуты (осталось 3 попытки)');
      console.log('======================================================\n');

      return success(res, { message: 'Code processed securely by node' });
    } catch (e: any) {
      console.error('OTP Send Error:', e);
      return error(res, 'Failed to process request', 500);
    }
  },

  /**
   * @swagger
   * /api/auth/otp/verify:
   *   post:
   *     summary: Verify Fast Access OTP Code and login/register
   */
  async verifyOtp(req: Request, res: Response) {
    try {
      const { phone, code, role } = req.body;
      const cached = otpCache.get(phone);

      console.log(`[AUTH] Попытка входа пользователя ${phone}. Введен код: ${code}`);

      if (!cached) {
        console.log(`[AUTH] ❌ Отказ для ${phone}: код не запрошен или уже сгорел.`);
        return error(res, 'The code expired or was not requested', 400);
      }

      if (Date.now() > cached.expiresAt) {
        otpCache.delete(phone);
        console.log(`[AUTH] ❌ Отказ для ${phone}: Время вышло (2 минуты).`);
        return error(res, 'Code expired (2 minutes limit)', 400);
      }
      
      if (cached.attempts >= 3) {
        otpCache.delete(phone);
        console.log(`[AUTH] ❌ Отказ для ${phone}: Превышено количество попыток.`);
        return error(res, 'Too many failed attempts. Request a new code.', 429);
      }

      if (cached.code !== code) {
        cached.attempts += 1;
        const left = 3 - cached.attempts;
        console.log(`[AUTH] ❌ Неверный код для ${phone}. Осталось попыток: ${left}`);
        if (left <= 0) otpCache.delete(phone);
        return error(res, `Invalid code. ${left} attempts left.`, 400);
      }

      // УСПЕХ!
      otpCache.delete(phone);
      console.log(`✅ [AUTH] Пользователь ${phone} начал процесс онбординга.`);

      let user = await prisma.user.findFirst({ where: { phone } });
      const roles = ['user'];

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: `${phone.replace(/[^0-9]/g, '')}@phone.local`,
            phone,
            displayName: `User ${phone.slice(-4)}`,
            role: 'user',
            primaryRole: 'user',
            roles: JSON.stringify(roles),
            source: 'fast_access',
            isStudent: false,
            isClient: false,
            isExecutor: false,
            isAdmin: false,
            profile: { create: { bio: `Registered via OTP (Pending Onboarding)` } }
          }
        });
        console.log(`✨ [AUTH] Создан новый профиль USER для ${phone}`);
      }

      return success(res, { 
        token: generateToken(user.id, user.email!), 
        user: { ...user, roles } 
      });

    } catch (e: any) {
      console.error('OTP Verify Error:', e);
      return error(res, 'Verification failed', 500);
    }
  },

  /**
   * @swagger
   * /api/auth/check-email:
   *   post:
   *     summary: Real-time email validation
   */
  async checkEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      return success(res, { available: !user });
    } catch (e) {
      return error(res, 'Validation failed', 500);
    }
  },

  /**
   * @swagger
   * /api/auth/onboarding:
   *   post:
   *     summary: Submit onboarding data and acquire a role
   *     security:
   *       - bearerAuth: []
   */
  async onboarding(req: AuthRequest, res: Response) {
    try {
      const onboardingSchema = z.object({
        role: z.enum(['student', 'client', 'executor']),
        profileData: z.object({
          bio: z.string().optional(),
          country: z.string().optional(),
          citizenship: z.string().optional(),
          linkedInUrl: z.string().optional(),
          telegramHandle: z.string().optional(),
          portfolioUrl: z.string().optional()
        }).optional()
      });

      const { role, profileData } = onboardingSchema.parse(req.body);
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (!user) return error(res, 'User not found', 404);

      console.log(`[ONBOARDING] Пользователь ${user.email} завершает регистрацию как [${role}]`);

      // Устанавливаем флаги роли
      const updateData: any = { 
        role, 
        primaryRole: role,
        roles: JSON.stringify([role])
      };
      
      if (role === 'student') updateData.isStudent = true;
      if (role === 'client') updateData.isClient = true;
      if (role === 'executor') updateData.isExecutor = true;

      // Обновляем права
      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });

      // Обновляем профиль (анкета)
      if (profileData) {
        // Убираем потенциально вредные поля, если есть
        const safeData = { ...profileData };
        delete safeData.id;
        delete safeData.userId;
        
        await prisma.profile.upsert({
          where: { userId: user.id },
          create: { userId: user.id, ...safeData },
          update: { ...safeData }
        });
      }

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { profile: true }
      });

      return success(res, { 
        message: 'Onboarding complete', 
        user: { ...updatedUser, roles: JSON.parse(updatedUser?.roles || '[]') } 
      });
    } catch (e: any) {
      console.error('Onboarding Error:', e);
      return error(res, 'Failed to complete onboarding', 500);
    }
  },

  /**
   * @swagger
   * /api/auth/social-auth:
   *   post:
   *     summary: Social login
   *     tags: [Auth]
   */
  async socialAuth(req: Request, res: Response) {
    try {
      const { email, displayName, photoURL, provider, remoteId } = req.body;
      let user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email, displayName, photoURL, remoteId, source: provider,
            role: 'user', primaryRole: 'user', roles: JSON.stringify(['user']),
            isStudent: false, isClient: false, isExecutor: false,
            profile: { create: { bio: `Social login`, avatar: photoURL } }
          },
          include: { profile: true }
        });
      }
      const rolesArray = JSON.parse(user.roles || '["student"]');
      return success(res, { 
        token: generateToken(user.id, user.email!), 
        user: { ...user, roles: rolesArray } 
      });
    } catch (e) {
      return error(res, 'Social auth failed', 500);
    }
  },

  /**
   * @swagger
   * /api/auth/switch-role:
   *   post:
   *     summary: Switch active role
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   */
  async switchRole(req: AuthRequest, res: Response) {
    try {
      const { role } = req.body;
      
      // Sync flags based on role
      const updateData: any = { role };
      
      if (role === 'student') updateData.isStudent = true;
      if (role === 'lecturer') updateData.isLecturer = true;
      if (role === 'client') updateData.isClient = true;
      if (role === 'executor') updateData.isExecutor = true;
      if (role === 'hr') updateData.isHr = true;
      if (role === 'finance') updateData.isFinance = true;
      if (role === 'support') updateData.isSupport = true;
      if (role === 'admin') {
        updateData.isAdmin = true;
        updateData.isStudent = true; // Admins are usually everything
        updateData.isHr = true;
        updateData.isFinance = true;
        updateData.isSupport = true;
      }

      const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: updateData
      });

      const rolesArray = JSON.parse(user.roles || '["student"]');
      return success(res, { ...user, roles: rolesArray });
    } catch (e) {
      return error(res, 'Failed to switch role', 500);
    }
  },

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Get current user profile
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   */
  async me(req: AuthRequest, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        include: { profile: true }
      });
      if (!user) return error(res, 'Not found', 404);
      const rolesArray = JSON.parse(user.roles || '["student"]');
      return success(res, { ...user, roles: rolesArray });
    } catch (e) {
      return error(res, 'Server error', 500);
    }
  },

  async getUser(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { profile: true }
      });
      if (!user) return error(res, 'Not found', 404);
      const rolesArray = JSON.parse(user.roles || '["student"]');
      return success(res, { ...user, roles: rolesArray });
    } catch (e) {
      return error(res, 'Server error', 500);
    }
  },

  async syncUser(req: Request, res: Response) {
    try {
      const { email, displayName, remoteId, photoURL } = req.body;
      let user = await prisma.user.upsert({
        where: { email },
        update: { remoteId, photoURL, displayName },
        create: { 
          email, displayName, remoteId, photoURL, 
          role: 'student', primaryRole: 'student', isStudent: true,
          roles: JSON.stringify(['student'])
        }
      });
      const rolesArray = JSON.parse(user.roles || '["student"]');
      return success(res, { ...user, roles: rolesArray });
    } catch (e) {
      return error(res, 'Failed to sync user', 500);
    }
  }
};
