import { CacheProjectDecorator } from '@app/utils/CacheDecorator';
import ProjectCache from './cache/ProjectCache';
import Project from './models/Project';

class ProjectData {
  protected model = Project;

  protected cache = ProjectCache;

  async createOne(data: Partial<Project>) {
    return this.model.createOne(data);
  }

  @CacheProjectDecorator(
    (userId: number, projectId: number) => `${projectId}:isMember:${userId}`
  )
  async verifyIsProjectMember(userId: number, projectId: number) {
    return this.model.verifyIsProjectMember(userId, projectId);
  }

  async verifyIsProjectMemberByEmail(email: string, projectId: number) {
    return this.model.verifyIsProjectMemberByEmail(email, projectId);
  }

  @CacheProjectDecorator((userId: number) => `all:userId:${userId}`)
  async getUserProjects(userId: number) {
    return this.model.getUserProjects(userId);
  }

  async addMember(
    userId: number | undefined,
    email: string,
    projectId: number
  ) {
    const value = await this.model.addMember(userId, email, projectId);
    await this.cache.invalidateProject(projectId);
    if (userId) await this.cache.invalidateUser(userId);
    return value;
  }

  async removeMember(email: string, projectId: number, userId?: number) {
    const value = await this.model.removeMember(email, projectId);
    await this.cache.invalidateProject(projectId);
    if (userId) await this.cache.invalidateUser(userId);
    return value;
  }

  async setNewUserInProjectByEmail(userId: number, email: string) {
    const [, projects] = await this.model.setNewUserInProjectByEmail(
      userId,
      email
    );
    const ids = projects.map((item) => item.projectId);

    await this.cache.invalidateProjects(ids);
  }

  @CacheProjectDecorator((projectId: number) => projectId)
  async getById(projectId: number) {
    return this.model.getById(projectId);
  }
}

export default new ProjectData();
