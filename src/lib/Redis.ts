/* eslint-disable @typescript-eslint/no-explicit-any */
import Redis, { Redis as IRedis, RedisOptions } from 'ioredis';
import configRedisFile from '../config/redis';

const config = {
  ...configRedisFile,
  keyPrefix: 'cache:',
  retryStrategy(times: number) {
    const delay = Math.min(times * 5000, 200000);
    return delay;
  },
  reconnectOnError: () => false,
};

const configRedis = process.env.URL_REDIS || config;

class Cache {
  protected redis: IRedis;

  constructor() {
    if (process.env.REDIS_CLUSTER) {
      // @ts-ignore
      this.redis = new Redis.Cluster(
        [
          {
            host: process.env.REDIS_HOST,
          },
        ],
        {
          redisOptions: configRedis as RedisOptions,
        }
      );
    } else {
      this.redis = new Redis(configRedis as RedisOptions);
    }
  }

  set(key: string, value: any, expires = 60 * 60 * 6) {
    if (!this.redis || this.redis.status !== 'ready') {
      return null;
    }

    return this.redis.set(key, JSON.stringify(value), 'EX', expires);
  }

  async get(key: any) {
    if (!this.redis || this.redis.status !== 'ready') {
      return null;
    }

    const cached = await this.redis.get(key);

    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key: string | number) {
    if (!this.redis || this.redis.status !== 'ready') {
      return null;
    }

    return this.redis.del(key as string);
  }

  async invalidatePrefix(prefix: string | number) {
    if (!this.redis || this.redis.status !== 'ready') {
      return null;
    }
    const keys = await this.redis.keys(`cache:${prefix}:*`);

    const keysWithoutPrefix = keys.map((key) => key.replace('cache:', ''));

    if (keysWithoutPrefix.length === 0) return [];
    return this.redis.del(keysWithoutPrefix);
  }
}

export default new Cache();
