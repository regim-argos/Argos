import Project from './models/Project';

class ProjectData {
  protected model = Project;

  async createOne(data: Partial<Project>) {
    return this.model.createOne(data);
  }

  async verifyIsProjectMember(userId: number, projectId: number) {
    return this.model.verifyIsProjectMember(userId, projectId);
  }
}

export default new ProjectData();
