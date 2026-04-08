import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { generateToken } from '../utils/auth.js';
import bcrypt from 'bcryptjs';
import { 
  UserCreateInputSchema, 
  UserUpdateInputSchema,
  ProfileUpsertWithoutUserInputSchema
} from '../schemas/generated/index.js';
import { z } from 'zod';
import { mapSocialPayload } from '../utils/socialMapper.js';
import { identityService } from '../services/identityService.js';
import { canonicalizePhoneDigits, normalizePhone } from '../utils/phone.js';

// Временное кэширование OTP в памяти сервера
// Формат: { '+7900...': { code: '123456', expiresAt: 1234123, attempts: 0 } }
const otpCache = new Map<string, { code: string; expiresAt: number; attempts: number }>();
const AUTH_COOKIE_NAME = 'rg_auth_token';
const authCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const attachAuthCookie = (res: Response, token: string) => {
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);
};

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
        const token = generateToken(user.id, user.email!);
        attachAuthCookie(res, token);
        return success(res, {
          token,
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
        const token = generateToken(user.id, user.email!);
        attachAuthCookie(res, token);
        return success(res, {
          token,
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
      const token = generateToken(user.id, user.email!);
      attachAuthCookie(res, token);
      return success(res, {
        token,
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
      const { email, displayName, phone, phoneCode, password, role, provider, profileData, signature, selectedPath, metadata } = req.body;

      if (!email) return error(res, 'Email is required for registration', 400);
      const normalizedPhone = normalizePhone(phone, phoneCode);

      // Check for existing node (Prisma findUnique requires value)
      const existingByEmail = await prisma.user.findUnique({ where: { email } });
      if (existingByEmail) return error(res, 'Email already exists', 409);

      if (normalizedPhone) {
        const existingByPhone = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
        if (existingByPhone) return error(res, 'Phone already exists', 409);
      }

      console.log(`[AUTH] Industrializing request for: ${email} | Role: ${role} | Path: ${selectedPath} | Phone: ${normalizedPhone || phone || 'N/A'}`);

      const result = await identityService.registerUser({ 
        email, displayName, phone: normalizedPhone || phone, password, role, provider, profileData, signature, selectedPath, metadata 
      });

      const token = generateToken(result.user.id, result.user.email!);
      attachAuthCookie(res, token);
      return success(res, { 
        token, 
        user: { ...result.user, roles: result.roles } 
      });
    } catch (e: any) {
      console.error('❌ [AUTH] Registration Critical Failure:', e);
      if (e?.code === 'P2002') {
        const target = Array.isArray(e?.meta?.target) ? e.meta.target.join(', ') : e?.meta?.target;
        if (String(target).includes('phone')) return error(res, 'Phone already exists', 409);
        if (String(target).includes('email')) return error(res, 'Email already exists', 409);
        return error(res, 'Duplicate record already exists', 409);
      }
      return error(res, `Registration failed: ${e.message || 'Internal Error'}`, 500, { message: e.message, stack: e.stack });
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
      const { phone, phoneCode } = req.body;
      const normalizedPhone = normalizePhone(phone, phoneCode);
      if (!normalizedPhone) return error(res, 'Phone is required', 400);

      // Генерация 6-значного кода
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Храним в памяти 2 минуты (120000 мс) и даем 3 попытки
      otpCache.set(normalizedPhone, {
        code,
        expiresAt: Date.now() + 2 * 60 * 1000,
        attempts: 0
      });

      // ЯРКИЙ ЛОГ В КОНСОЛЬ СЕРВЕРА (терминал npm run dev)
      console.log('\n======================================================');
      console.log('⚡ [FAST ACCESS] КОД АВТОРИЗАЦИИ ЗАПРОШЕН');
      console.log(`📱 Телефон: ${normalizedPhone}`);
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
      const { phone, phoneCode, code, role } = req.body;
      const normalizedPhone = normalizePhone(phone, phoneCode);
      const cached = otpCache.get(normalizedPhone);

      console.log(`[AUTH] Попытка входа пользователя ${normalizedPhone}. Введен код: ${code}`);

      if (!cached) {
        console.log(`[AUTH] ❌ Отказ для ${normalizedPhone}: код не запрошен или уже сгорел.`);
        return error(res, 'The code expired or was not requested', 400);
      }

      if (Date.now() > cached.expiresAt) {
        otpCache.delete(normalizedPhone);
        console.log(`[AUTH] ❌ Отказ для ${normalizedPhone}: Время вышло (2 минуты).`);
        return error(res, 'Code expired (2 minutes limit)', 400);
      }
      
      if (cached.attempts >= 3) {
        otpCache.delete(normalizedPhone);
        console.log(`[AUTH] ❌ Отказ для ${normalizedPhone}: Превышено количество попыток.`);
        return error(res, 'Too many failed attempts. Request a new code.', 429);
      }

      if (cached.code !== code) {
        cached.attempts += 1;
        const left = 3 - cached.attempts;
        console.log(`[AUTH] ❌ Неверный код для ${normalizedPhone}. Осталось попыток: ${left}`);
        if (left <= 0) otpCache.delete(normalizedPhone);
        return error(res, `Invalid code. ${left} attempts left.`, 400);
      }

      // УСПЕХ!
      otpCache.delete(normalizedPhone);
      console.log(`✅ [AUTH] Пользователь ${normalizedPhone} начал процесс онбординга.`);

      let user = await prisma.user.findFirst({ where: { phone: normalizedPhone } });
      const roles = ['user'];

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: `${normalizedPhone.replace(/[^0-9]/g, '')}@phone.local`,
            phone: normalizedPhone,
            displayName: `User ${normalizedPhone.slice(-4)}`,
            role: 'user',
            primaryRole: 'user',
            roles: JSON.stringify(roles),
            source: 'fast_access',
            registrationStatus: 'VISITOR',
            isOnboarded: false, // Force protocol steps 2-5
            isStudent: false,
            isClient: false,
            isExecutor: false,
            isAdmin: false,
            profile: { create: { bio: `Registered via OTP (Initial Entry)` } }
          }
        });
        console.log(`✨ [AUTH] Created new OTP node for ${normalizedPhone} (Protocol: Pending)`);
      }

      const token = generateToken(user.id, user.email!);
      attachAuthCookie(res, token);
      return success(res, { 
        token, 
        user: { ...user, roles } 
      });

    } catch (e: any) {
      console.error('OTP Verify Error:', e);
      return error(res, 'Verification failed', 500);
    }
  },

  async checkEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return success(res, { available: true }); // Guest check
      
      const user = await prisma.user.findUnique({ where: { email } });
      return success(res, { available: !user });
    } catch (e: any) {
      console.error('❌ [AUTH] CheckEmail Failure:', e);
      // Temporary Debug: Exposure of Prisma error to identify Hostinger migration issues
      return error(res, `Prisma Conflict: ${e.message}`, 500, { 
        code: e.code, 
        meta: e.meta,
        stack: e.stack 
      });
    }
  },

  async checkPhone(req: Request, res: Response) {
    try {
      const { phone, phoneCode } = req.body;
      const normalizedPhone = normalizePhone(phone, phoneCode);
      if (!normalizedPhone) return success(res, { available: true });

      const user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
      if (user) {
        console.log(`[AUTH] CheckPhone matched exact canonical value: ${normalizedPhone} -> ${user.id}`);
        return success(res, { available: false });
      }

      const digitsOnly = canonicalizePhoneDigits(normalizedPhone);
      if (!digitsOnly) {
        return success(res, { available: true });
      }

      const legacyMatch = await prisma.$queryRaw<Array<{ id: string; phone: string | null }>>`
        SELECT id, phone
        FROM \`User\`
        WHERE phone IS NOT NULL
          AND phone <> ''
          AND REGEXP_REPLACE(phone, '[^0-9]', '') = ${digitsOnly}
        LIMIT 1
      `;

      if (legacyMatch.length > 0) {
        console.log(`[AUTH] CheckPhone matched legacy phone storage: ${normalizedPhone} -> ${legacyMatch[0].id} (${legacyMatch[0].phone})`);
      }

      return success(res, { available: legacyMatch.length === 0 });
    } catch (e: any) {
      console.error('❌ [AUTH] CheckPhone Failure:', e);
      return error(res, `Prisma Conflict: ${e.message}`, 500, {
        code: e.code,
        meta: e.meta,
        stack: e.stack
      });
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
        role: z.enum(['student', 'lecturer', 'client', 'executor', 'admin', 'hr', 'finance', 'support', 'chief_manager', 'manager', 'moderator', 'artist', 'engineer', 'client_ceo', 'partner', 'community']),
        chosenPathId: z.string().optional(),
        signature: z.string().optional(),
        profileData: z.object({
          bio: z.string().optional(),
          country: z.string().optional(),
          citizenship: z.string().optional(),
          linkedInUrl: z.string().optional(),
          telegramHandle: z.string().optional(),
          portfolioUrl: z.string().optional(),
          gender: z.string().optional(),
          dateOfBirth: z.string().optional()
        }).optional()
      });

      const { role, chosenPathId, profileData, signature } = onboardingSchema.parse(req.body);
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (!user) return error(res, 'User not found', 404);

      console.log(`[ONBOARDING] Node ${user.email} synchronizing profile as [${role}]`);

      const result = await identityService.finalizeOnboarding(user.id, user.email!, {
        role, chosenPathId, profileData, signature, 
        registrationStatus: 'ACTIVE' // Activating account after onboarding complete
      });

      const token = generateToken(result.user.id, result.user.email!);
      attachAuthCookie(res, token);
      return success(res, { 
        message: 'Onboarding complete', 
        token,
        user: { ...result.user, roles: result.roles } 
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
      const { provider, payload } = req.body;
      if (!payload || !payload.email) return error(res, 'Invalid social payload', 400);

      const result = await identityService.synchronizeSocialIdentity({ provider, payload });

      const token = generateToken(result.user.id, result.user.email!);
      attachAuthCookie(res, token);
      return success(res, { 
        token, 
        user: { ...result.user, roles: result.roles } 
      });
    } catch (e: any) {
      console.error('Social Auth Sync Error:', e);
      return error(res, 'Identity synchronization failed', 500);
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
  },

  /**
   * @swagger
   * /api/auth/dev/activate:
   *   post:
   *     summary: Developer-only account activation (Simulate Admin Approval)
   *     security:
   *       - bearerAuth: []
   */
  async devActivate(req: AuthRequest, res: Response) {
    try {
      // In production, this would be restricted by admin role
      const userId = req.user!.id;
      const user = await prisma.user.update({
        where: { id: userId },
        data: { registrationStatus: 'ACTIVE' }
      });
      return success(res, { message: 'Industrial Node Activated', user });
    } catch (e: any) {
      return error(res, 'Activation failed', 500);
    }
  }
};
