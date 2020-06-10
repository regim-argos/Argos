import Sequelize, { Model } from 'sequelize';

export enum MemberRole {
  USER = 'USER',
  OWNER = 'OWNER',
}

class ProjectMember extends Model {
  id!: number;

  role!: MemberRole;

  email!: string;

  userId!: number;

  static initModel(sequelize: Sequelize.Sequelize) {
    this.init(
      {
        role: Sequelize.ENUM('OWNER', 'USER'),
        userId: Sequelize.INTEGER,
        email: Sequelize.STRING,
        projectId: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'project_user',
      }
    );

    return this;
  }

  static associate(models: any) {
    this.belongsTo(models.User, {
      foreignKey: { field: 'user_id', name: 'userId' },
      as: 'user',
    });
    this.belongsTo(models.Project, {
      foreignKey: { field: 'project_id', name: 'projectId' },
      as: 'project',
    });
  }
}

export default ProjectMember;
