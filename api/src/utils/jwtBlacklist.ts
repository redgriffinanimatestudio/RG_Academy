import { redis } from '../utils/redis';

const BLACKLIST_PREFIX = 'jwt_blacklist:';

// Add JWT to blacklist with TTL (token exp time)
export async function blacklistToken(token: string, exp: number) {
  // exp - expiration timestamp in seconds
  const ttl = exp - Math.floor(Date.now() / 1000);
  if (ttl > 0) {
    await redis.set(`${BLACKLIST_PREFIX}${token}`, '1', 'EX', ttl);
  }
}

// Check if JWT is blacklisted
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  return (await redis.exists(`${BLACKLIST_PREFIX}${token}`)) === 1;
}
