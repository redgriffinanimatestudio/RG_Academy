import { Request, Response } from 'express';
import { blacklistToken } from '../utils/jwtBlacklist';
import { verifyToken } from '../utils/auth.js';
import { success, error } from '../utils/response.js';

const AUTH_COOKIE_NAME = 'rg_auth_token';

const getCookieToken = (cookieHeader?: string) => {
  if (!cookieHeader) return null;
  const match = cookieHeader.split(';').map(part => part.trim()).find(part => part.startsWith(`${AUTH_COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.slice(AUTH_COOKIE_NAME.length + 1)) : null;
};

/**
 * POST /api/auth/logout
 * Invalidate current JWT (add to blacklist)
 */
export async function logout(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = getCookieToken(req.headers.cookie);
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : cookieToken;

    if (!token) {
      return error(res, 'Authorization header or auth cookie missing', 401);
    }

    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.exp) {
      return error(res, 'Invalid or expired token', 401);
    }
    await blacklistToken(token, decoded.exp);
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
    return success(res, { message: 'Logged out successfully' });
  } catch (e) {
    return error(res, 'Logout failed', 500);
  }
}
