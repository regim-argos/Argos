import Cache from './Cache';

class ProjectCache extends Cache {
  protected keyPrefix = 'project';

  getKey() {
    return `${this.keyPrefix}`;
  }

  async getCache(key: string | number) {
    return this.Redis.get(`${this.getKey()}:${key}`);
  }

  async setCache(key: string | number, data: any) {
    await this.Redis.set(`${this.getKey()}:${key}`, data);
  }

  async invalidateProject(projectId: number) {
    return this.invalidation([
      { key: `${this.getKey()}:${projectId}`, type: 'ONE' },
      { key: `${this.getKey()}:${projectId}`, type: 'MANY' },
    ]);
  }

  async invalidateUser(userId: number) {
    return this.invalidation([
      { key: `${this.getKey()}:all:userId:${userId}`, type: 'ONE' },
    ]);
  }

  async invalidateProjects(ids: number[]) {
    const projectKeyOne = ids.map((item) => ({
      key: `${this.getKey()}:${item}`,
      type: 'ONE',
    }));
    const projectKeyMany = ids.map((item) => ({
      key: `${this.getKey()}:${item}`,
      type: 'MANY',
    }));
    return this.invalidation([...projectKeyOne, ...projectKeyMany]);
  }

  // invalidateUpdateKeys(userId: number, id: number) {
  //   return [
  //     ...super.invalidateUpdateKeys(userId, id),
  //     { key: `${WatcherCache.getKey(userId)}`, type: 'MANY' },
  //   ];
  // }
}

export default new ProjectCache();
