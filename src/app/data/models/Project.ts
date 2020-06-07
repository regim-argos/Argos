import Sequelize, { Model } from 'sequelize';

class Project extends Model {
  id!: number;

  name!: string;

  defaultDelay!: number;

  watcherNumber!: number;

  static initModel(sequelize: Sequelize.Sequelize) {
    this.init(
      {
        name: Sequelize.STRING,
        defaultDelay: Sequelize.INTEGER,
        watcherNumber: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate() {
    return true;
  }

  static async createOne(data: Partial<Project>) {
    const DocProject = await this.create({
      ...data,
      active: false,
    });
    return DocProject;
  }
}

export default Project;
