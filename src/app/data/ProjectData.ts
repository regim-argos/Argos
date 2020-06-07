import Project from './models/Project';

class ProjectData {
  protected model = Project;

  async createOne(data: Partial<Project>) {
    return this.model.createOne(data);
  }
}

export default new ProjectData();
