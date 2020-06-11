import ProjectCache from './cache/ProjectCache';
import Project from './models/Project';

class ProjectData {
  protected model = Project;

  protected cache = ProjectCache;

  async createOne(data: Partial<Project>) {
    return this.model.createOne(data);
  }

  async verifyIsProjectMember(userId: number, projectId: number) {
    const value = await this.cache.getCache(`${projectId}:isMember:${userId}`);

    if (value) return value;

    const project = await this.model.verifyIsProjectMember(userId, projectId);

    await this.cache.setCache(`${projectId}:isMember:${userId}`, project);

    return project;
  }

  async verifyIsProjectMemberByEmail(email: string, projectId: number) {
    return this.model.verifyIsProjectMemberByEmail(email, projectId);
  }

  async getUserProjects(userId: number) {
    const value = await this.cache.getCache(`all:userId:${userId}`);

    if (value) return value;

    const project = await this.model.getUserProjects(userId);

    await this.cache.setCache(`all:userId:${userId}`, project);

    return project;
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

  async getById(projectId: number) {
    const value = await this.cache.getCache(projectId);

    if (value) return value;

    const project = await this.model.getById(projectId);

    await this.cache.setCache(projectId, project);

    return project;
  }
}

export default new ProjectData();
