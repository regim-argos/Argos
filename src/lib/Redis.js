import Redis from 'ioredis';

class Cache {
  constructor() {
    if (process.env.REDIS_CLUSTER) {
      this.redis = new Redis.Cluster({
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASS,
        keyPrefix: 'cache:',
        retryStrategy(times) {
          const delay = Math.min(times * 5000, 200000);
          return delay;
        },
        reconnectOnError: () => false,
      });
    } else {
      this.redis = new Redis({
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASS,
        keyPrefix: 'cache:',
        retryStrategy(times) {
          const delay = Math.min(times * 5000, 200000);
          return delay;
        },
        reconnectOnError: () => false,
      });
    }
  }

  set(key, value, expires = process.env.DEFAULT_CACHE_EXPIRATION) {
    if (!this.redis || this.redis.status !== 'ready') {
      return null;
    }

    return this.redis.set(key, JSON.stringify(value), 'EX', expires);
  }

  async get(key) {
    if (!this.redis || this.redis.status !== 'ready') {
      return null;
    }

    const cached = await this.redis.get(key);

    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    if (!this.redis || this.redis.status !== 'ready') {
      return null;
    }

    return this.redis.del(key);
  }

  async invalidatePrefix(prefix) {
    if (!this.redis || this.redis.status !== 'ready') {
      return null;
    }
    const keys = await this.redis.keys(`cache:${prefix}:*`);

    const keysWithoutPrefix = keys.map(key => key.replace('cache:', ''));

    if (keysWithoutPrefix.length === 0) return [];
    return this.redis.del(keysWithoutPrefix);
  }
}

export default new Cache();
