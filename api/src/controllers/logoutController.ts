import { Request, Response } from 'express';
import { blacklistToken } from '../utils/jwtBlacklist';
import { verifyToken } from '../utils/auth.js';
import { success, error } from '../utils/response.js';

/**
 * POST /api/auth/logout
 * Invalidate current JWT (add to blacklist)
 */
export async function logout(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Authorization header missing or malformed', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.exp) {
      return error(res, 'Invalid or expired token', 401);
    }
    await blacklistToken(token, decoded.exp);
    return success(res, { message: 'Logged out successfully' });
  } catch (e) {
    return error(res, 'Logout failed', 500);
  }
}
