import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const redis = new Redis(redisUrl, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 200, 5000);
    if (times % 5 === 0) {
      console.log(`[Redis] Retrying connection (${times}), delay: ${delay}ms`);
    }
    return delay;
  },
  maxRetriesPerRequest: null,
  lazyConnect: true,
  enableOfflineQueue: true,
});

let errorCount = 0;
redis.on('error', (err) => {
  errorCount++;
  if (errorCount % 10 === 0) {
    console.error('[Redis] Connection error:', err.message);
  }
});

redis.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

redis.connect().catch((err) => {
  console.warn('[Redis] Initial connection failed:', err.message);
});

export default redis;
