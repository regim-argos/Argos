import Sequelize, { Model } from 'sequelize';
import User from './User';
import ProjectMember from './ProjectMember';

class Project extends Model {
  id!: number;

  name!: string;

  defaultDelay!: number;

  watcherNumber!: number;

  members!: Partial<ProjectMember>[];

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
    // this.belongsToMany(User, {
    //   through: models.ProjectMember,
    //   foreignKey: { field: 'user_id', name: 'userId' },
    //   as: 'users',
    // });
    this.hasMany(ProjectMember, {
      as: 'members',
      foreignKey: { field: 'project_id', name: 'projectId' },
    });
  }

  static async createOne(data: Partial<Project>) {
    const DocProject = await this.create(data, {
      include: ['members'],
    });
    const result = await this.findOne({
      where: { id: DocProject.id },
      include: [
        {
          model: ProjectMember,
          as: 'members',
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        },
      ],
    });
    return result as Project;
  }

  static async verifyIsProjectMember(userId: number, productId: number) {
    const result = await this.findOne({
      where: { id: productId },
      include: [
        {
          model: ProjectMember,
          as: 'members',
          where: { userId },
        },
      ],
    });
    return result as Project;
  }
}

export default Project;
