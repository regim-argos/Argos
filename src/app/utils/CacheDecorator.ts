/* eslint-disable @typescript-eslint/no-explicit-any */
export function CacheProjectDecorator(getKeyFunction: Function) {
  return (_: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function Before(...args: any[]) {
      const cacheKey = getKeyFunction(...args);

      const value = await this.cache.getCache(cacheKey);

      if (value) return value;

      const cache = await originalMethod.apply(this, args);

      await this.cache.setCache(cacheKey, cache);

      return cache;
    };

    return descriptor;
  };
}

export function CacheDecorator(projectPos: number, idPos?: number) {
  return (_: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function Before(...args: any[]) {
      const keyId = idPos !== undefined ? args[idPos] : 'all';
      const value = await this.cache.getCache(args[projectPos], keyId);

      if (value) return value;

      const cache = await originalMethod.apply(this, args);

      await this.cache.setCache(args[projectPos], keyId, cache);

      return cache;
    };

    return descriptor;
  };
}
