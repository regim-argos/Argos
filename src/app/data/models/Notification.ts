import Sequelize, { Model } from 'sequelize';

class Notification extends Model {
  public id!: number;

  public projectId!: number;

  public platform!: string;

  public name!: string;

  public active!: boolean;

  public platformData!: {
    webhook: string;
  };

  static initModel(sequelize: Sequelize.Sequelize) {
    this.init(
      {
        platform: Sequelize.STRING,
        name: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
        platformData: Sequelize.JSON,
        projectId: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // @ts-ignore
  static associate(models) {
    this.belongsTo(models.Project, {
      foreignKey: { field: 'project_id', name: 'projectId' },
      as: 'project',
    });
  }

  static async getAllByProjectId(projectId: number) {
    const Doc = await this.findAll({
      where: { projectId },
      order: [['createdAt', 'DESC']],
    });

    return Doc;
  }

  static async getById(id: number, projectId: number) {
    const Doc = await this.findOne({
      where: { id, projectId },
    });

    return Doc;
  }

  static async createOne(data: Notification, projectId: number) {
    const Doc = await this.create({
      ...data,
      projectId,
    });

    return Doc;
  }

  static async updateById(data: Notification, id: number, projectId: number) {
    const [, [Doc]] = await this.update(data, {
      where: { projectId, id },
      returning: true,
    });

    return Doc;
  }

  static async deleteById(id: number, projectId: number) {
    return this.destroy({
      where: { projectId, id },
    });
  }

  static async getAllByIds(ids: number[], projectId: number) {
    return this.findAll({
      where: { id: ids, projectId },
      order: [['createdAt', 'DESC']],
    });
  }
}

export default Notification;
