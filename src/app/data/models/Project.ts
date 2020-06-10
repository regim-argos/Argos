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
              attributes: ['name', 'email'],
            },
          ],
        },
      ],
    });
    return result as Project;
  }

  static async addMember(
    userId: number | undefined,
    email: string,
    projectId: number
  ) {
    await ProjectMember.create({ userId, email, projectId });
    const result = await this.findOne({
      where: { id: projectId },
      include: [
        {
          model: ProjectMember,
          as: 'members',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'email'],
            },
          ],
        },
      ],
    });
    return result as Project;
  }

  static async removeMember(email: string, projectId: number) {
    await ProjectMember.destroy({
      where: { email, projectId },
    });
    const result = await this.findOne({
      where: { id: projectId },
      include: [
        {
          model: ProjectMember,
          as: 'members',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'email'],
            },
          ],
        },
      ],
    });
    return result as Project;
  }

  static async verifyIsProjectMember(userId: number, projectId: number) {
    const result = await this.findOne({
      where: { id: projectId },
      include: [
        {
          model: ProjectMember,
          as: 'members',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'email'],
            },
          ],
          where: { userId },
        },
      ],
    });
    return result as Project;
  }

  static async verifyIsProjectMemberByEmail(email: string, projectId: number) {
    const result = await this.findOne({
      where: { id: projectId },
      include: [
        {
          model: ProjectMember,
          as: 'members',
          where: { email },
        },
      ],
    });
    return result as Project;
  }

  static async getUserProjects(userId: number) {
    const result = await this.findAll({
      include: [
        {
          model: ProjectMember,
          as: 'members',
          where: { userId },
        },
      ],
    });

    return result;
  }
}

export default Project;
