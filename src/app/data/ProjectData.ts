import Project from './models/Project';

class ProjectData {
  protected model = Project;

  async createOne(data: Partial<Project>) {
    return this.model.createOne(data);
  }

  async verifyIsProjectMember(userId: number, projectId: number) {
    return this.model.verifyIsProjectMember(userId, projectId);
  }

  async verifyIsProjectMemberByEmail(email: string, projectId: number) {
    return this.model.verifyIsProjectMemberByEmail(email, projectId);
  }

  async getUserProjects(userId: number) {
    const project = await this.model.getUserProjects(userId);
    return project;
  }

  async addMember(
    userId: number | undefined,
    email: string,
    projectId: number
  ) {
    return this.model.addMember(userId, email, projectId);
  }
}

export default new ProjectData();
